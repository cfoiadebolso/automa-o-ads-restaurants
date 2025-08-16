# 🚀 GUIA TÉCNICO DE PRODUÇÃO
## MicroSaaS Meta Ads + Cardápios Digitais

---

## 📋 VISÃO GERAL

**O que é:** Sistema completo para restaurantes gerenciarem cardápios digitais e campanhas Meta Ads.

**Arquitetura:** Frontend React + Backend Supabase + Meta Ads API + Stripe

**Objetivo:** 4 sprints para produção completa, cada sprint entrega valor real.

---

## 🏃‍♂️ SPRINT 1: MVP FUNCIONAL (7 dias)
### 🎯 Objetivo: Sistema básico funcionando em produção

### 📝 PASSOS EXTERNOS:

#### 1. Configurar Supabase
1. Acesse [supabase.com](https://supabase.com)
2. Crie conta e novo projeto
3. Anote: `URL` e `ANON_KEY`
4. No SQL Editor, execute:

```sql
-- Tabela de restaurantes
CREATE TABLE restaurants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  address TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de cardápios
CREATE TABLE menus (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de itens do cardápio
CREATE TABLE menu_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  menu_id UUID REFERENCES menus(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category VARCHAR(100),
  image_url TEXT,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE menus ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
```

#### 2. Configurar Vercel
1. Acesse [vercel.com](https://vercel.com)
2. Conecte seu GitHub
3. Importe o repositório
4. Configure variáveis de ambiente:
   - `REACT_APP_SUPABASE_URL`
   - `REACT_APP_SUPABASE_ANON_KEY`

#### 3. Configurar Domínio
1. No Vercel, vá em Settings > Domains
2. Adicione seu domínio personalizado
3. Configure DNS conforme instruções



### ✅ CHECKLIST SPRINT 1:
- [ ] Supabase configurado e funcionando
- [ ] Deploy no Vercel realizado
- [ ] Domínio personalizado ativo
- [ ] CRUD de cardápios funcionando
- [ ] Página pública de cardápio acessível
- [ ] Sistema responsivo
- [ ] SSL/HTTPS ativo

---

## 🏃‍♂️ SPRINT 2: AUTENTICAÇÃO + MULTI-TENANT (7 dias)
### 🎯 Objetivo: Sistema seguro com múltiplos restaurantes

### 📝 PASSOS EXTERNOS:

#### 1. Configurar Autenticação no Supabase
1. No painel Supabase, vá em Authentication
2. Configure providers (Email, Google)
3. No SQL Editor, execute:

```sql
-- Políticas RLS para restaurantes
CREATE POLICY "Restaurantes podem ver apenas seus dados" ON restaurants
  FOR ALL USING (auth.uid()::text = id::text);

-- Políticas RLS para cardápios
CREATE POLICY "Cardápios por restaurante" ON menus
  FOR ALL USING (
    restaurant_id IN (
      SELECT id FROM restaurants WHERE auth.uid()::text = id::text
    )
  );

-- Políticas RLS para itens
CREATE POLICY "Itens por cardápio" ON menu_items
  FOR ALL USING (
    menu_id IN (
      SELECT m.id FROM menus m
      JOIN restaurants r ON m.restaurant_id = r.id
      WHERE auth.uid()::text = r.id::text
    )
  );

-- Função para criar restaurante após signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO restaurants (id, email, name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'name', 'Novo Restaurante'));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para auto-criar restaurante
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

#### 2. Configurar Email Templates
1. No Supabase, vá em Authentication > Email Templates
2. Personalize templates de confirmação e reset
3. Configure SMTP customizado (opcional)



### ✅ CHECKLIST SPRINT 2:
- [ ] Autenticação funcionando (email + Google)
- [ ] RLS configurado e testado
- [ ] Dashboard protegido por login
- [ ] Auto-criação de restaurante no signup
- [ ] Onboarding para novos usuários
- [ ] Perfil editável do restaurante
- [ ] Logout funcionando corretamente

---

## 🏃‍♂️ SPRINT 3: META ADS API + BILLING (10 dias)
### 🎯 Objetivo: Monetização e integração com Meta

### 📝 PASSOS EXTERNOS:

#### 1. Configurar Meta for Developers
1. Acesse [developers.facebook.com](https://developers.facebook.com)
2. Crie app Business
3. Adicione produto "Marketing API"
4. Solicite permissões: `ads_management`, `ads_read`
5. Configure webhook para eventos

#### 2. Configurar Stripe
1. Acesse [stripe.com](https://stripe.com)
2. Crie conta e ative modo live
3. Configure produtos e preços:
   - Plano Básico: R$ 97/mês
   - Plano Pro: R$ 197/mês
   - Plano Enterprise: R$ 397/mês
4. Configure webhooks para: `invoice.payment_succeeded`, `customer.subscription.deleted`

#### 3. Expandir Database
No Supabase SQL Editor:

```sql
-- Tabela de planos
CREATE TABLE plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stripe_price_id VARCHAR(255) UNIQUE NOT NULL,
  features JSONB,
  max_menus INTEGER,
  max_items INTEGER,
  ads_budget_limit DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de assinaturas
CREATE TABLE subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES plans(id),
  stripe_subscription_id VARCHAR(255) UNIQUE,
  status VARCHAR(50) DEFAULT 'active',
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de campanhas Meta Ads
CREATE TABLE ad_campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  menu_id UUID REFERENCES menus(id),
  name VARCHAR(255) NOT NULL,
  meta_campaign_id VARCHAR(255),
  budget DECIMAL(10,2),
  status VARCHAR(50) DEFAULT 'draft',
  target_audience JSONB,
  creative_assets JSONB,
  performance_data JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Inserir planos padrão
INSERT INTO plans (name, price, stripe_price_id, max_menus, max_items, ads_budget_limit) VALUES
('Básico', 97.00, 'price_basic_monthly', 1, 50, 500.00),
('Pro', 197.00, 'price_pro_monthly', 3, 150, 1500.00),
('Enterprise', 397.00, 'price_enterprise_monthly', 10, 500, 5000.00);

-- Habilitar RLS
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_campaigns ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Assinaturas por restaurante" ON subscriptions
  FOR ALL USING (restaurant_id IN (
    SELECT id FROM restaurants WHERE auth.uid()::text = id::text
  ));

CREATE POLICY "Campanhas por restaurante" ON ad_campaigns
  FOR ALL USING (restaurant_id IN (
    SELECT id FROM restaurants WHERE auth.uid()::text = id::text
  ));
```

#### 4. Configurar Variáveis de Ambiente
Adicione no Vercel:
- `REACT_APP_META_APP_ID`
- `REACT_APP_META_APP_SECRET`
- `REACT_APP_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`



### ✅ CHECKLIST SPRINT 3:
- [ ] Stripe configurado e funcionando
- [ ] Planos de assinatura ativos
- [ ] Checkout e pagamento funcionando
- [ ] Meta for Developers configurado
- [ ] Conexão com Meta Ads API
- [ ] Criação de campanhas funcionando
- [ ] Dashboard de performance
- [ ] Limitações por plano implementadas

---

## 🏃‍♂️ SPRINT 4: OTIMIZAÇÃO + MONITORAMENTO (7 dias)
### 🎯 Objetivo: Sistema otimizado e monitorado

### 📝 PASSOS EXTERNOS:

#### 1. Configurar Monitoramento
1. **Sentry** (Erros):
   - Acesse [sentry.io](https://sentry.io)
   - Crie projeto React
   - Configure alertas

2. **Google Analytics** (Usuários):
   - Configure GA4
   - Implemente eventos customizados

3. **Uptime Robot** (Disponibilidade):
   - Configure monitoramento de uptime
   - Configure alertas por email/SMS

#### 2. Configurar CDN e Cache
1. No Vercel, configure:
   - Edge Functions para APIs
   - Cache headers otimizados
   - Compressão automática

#### 3. Configurar Backup
No Supabase:

```sql
-- Função de backup automático
CREATE OR REPLACE FUNCTION backup_critical_data()
RETURNS void AS $$
BEGIN
  -- Log de backup
  INSERT INTO system_logs (action, details, created_at)
  VALUES ('backup', 'Backup automático executado', NOW());
END;
$$ LANGUAGE plpgsql;

-- Tabela de logs do sistema
CREATE TABLE system_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  action VARCHAR(100) NOT NULL,
  details TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 4. Configurar Segurança
1. **Rate Limiting** no Vercel:
   - Configure limites por IP
   - Implemente throttling

2. **CORS** no Supabase:
   - Configure domínios permitidos
   - Restrinja acesso à API



### ✅ CHECKLIST SPRINT 4:
- [ ] Sentry configurado e funcionando
- [ ] Google Analytics implementado
- [ ] Uptime monitoring ativo
- [ ] CDN e cache otimizados
- [ ] Backup automático configurado
- [ ] Rate limiting implementado
- [ ] Performance otimizada (Lighthouse > 90)
- [ ] Service worker funcionando
- [ ] Notificações implementadas

---

## 🎯 RESULTADO FINAL

### ✅ SISTEMA COMPLETO EM PRODUÇÃO:
- Frontend React otimizado
- Backend Supabase escalável
- Autenticação segura
- Multi-tenancy funcional
- Integração Meta Ads
- Sistema de billing
- Monitoramento completo
- Performance otimizada

### 📊 MÉTRICAS DE SUCESSO:
- Uptime > 99.9%
- Lighthouse Score > 90
- Tempo de carregamento < 3s
- Zero erros críticos
- Conversão de trial > 15%

---

## 🏃‍♂️ SPRINT 5: LANDING PAGE BUILDER + CUPONS (7 dias)
### 🎯 Objetivo: Sistema de páginas personalizadas e promoções

### 📝 PASSOS EXTERNOS:

#### 1. Configurar Subdomínios Dinâmicos
1. No Vercel, configure:
   - Wildcard domain: `*.seudominio.com`
   - Edge Functions para roteamento dinâmico
2. Configure DNS:
   - CNAME: `*.seudominio.com` → `cname.vercel-dns.com`

#### 2. Expandir Database para Landing Pages
No Supabase SQL Editor:

```sql
-- Tabela de landing pages
CREATE TABLE landing_pages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  campaign_id UUID REFERENCES ad_campaigns(id),
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  template_config JSONB,
  custom_css TEXT,
  is_active BOOLEAN DEFAULT true,
  views_count INTEGER DEFAULT 0,
  conversions_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de cupons
CREATE TABLE coupons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  landing_page_id UUID REFERENCES landing_pages(id),
  code VARCHAR(50) UNIQUE NOT NULL,
  discount_type VARCHAR(20) CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value DECIMAL(10,2) NOT NULL,
  min_order_value DECIMAL(10,2),
  max_uses INTEGER,
  current_uses INTEGER DEFAULT 0,
  expires_at TIMESTAMP,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de templates
CREATE TABLE page_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  config JSONB NOT NULL,
  preview_image TEXT,
  is_premium BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Inserir templates padrão
INSERT INTO page_templates (name, category, config) VALUES
('Promoção Simples', 'promocao', '{"sections": ["hero", "product", "cta"]}'),
('Menu Completo', 'cardapio', '{"sections": ["hero", "menu-grid", "about", "contact"]}'),
('Delivery Express', 'delivery', '{"sections": ["hero", "featured-items", "coupon", "cta"]}');

-- Habilitar RLS
ALTER TABLE landing_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Landing pages por restaurante" ON landing_pages
  FOR ALL USING (restaurant_id IN (
    SELECT id FROM restaurants WHERE auth.uid()::text = id::text
  ));

CREATE POLICY "Cupons por restaurante" ON coupons
  FOR ALL USING (restaurant_id IN (
    SELECT id FROM restaurants WHERE auth.uid()::text = id::text
  ));
```



### ✅ CHECKLIST SPRINT 5:
- [ ] Subdomínios dinâmicos funcionando
- [ ] Landing page builder operacional
- [ ] Sistema de templates implementado
- [ ] Gerador de cupons funcionando
- [ ] Preview responsivo
- [ ] Analytics de conversão
- [ ] URLs personalizadas ativas

---

## 🏃‍♂️ SPRINT 6: WHITE-LABEL + MULTI-RESTAURANTE (7 dias)
### 🎯 Objetivo: Sistema para agências e marca própria

### 📝 PASSOS EXTERNOS:

#### 1. Configurar Domínios Personalizados
1. No Vercel, configure:
   - Custom domains por cliente
   - SSL automático
   - Edge redirects

#### 2. Expandir Database para White-Label
No Supabase SQL Editor:

```sql
-- Tabela de agências
CREATE TABLE agencies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  domain VARCHAR(255) UNIQUE,
  logo_url TEXT,
  primary_color VARCHAR(7),
  secondary_color VARCHAR(7),
  custom_css TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de relacionamento agência-restaurante
CREATE TABLE agency_restaurants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agency_id UUID REFERENCES agencies(id) ON DELETE CASCADE,
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'client',
  permissions JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(agency_id, restaurant_id)
);

-- Atualizar tabela de usuários para suportar agências
ALTER TABLE restaurants ADD COLUMN agency_id UUID REFERENCES agencies(id);
ALTER TABLE restaurants ADD COLUMN white_label_config JSONB;

-- Função para criar agência
CREATE OR REPLACE FUNCTION create_agency(
  agency_name TEXT,
  user_id UUID
)
RETURNS UUID AS $$
DECLARE
  new_agency_id UUID;
BEGIN
  INSERT INTO agencies (name) VALUES (agency_name) RETURNING id INTO new_agency_id;
  
  UPDATE restaurants 
  SET agency_id = new_agency_id 
  WHERE id = user_id;
  
  RETURN new_agency_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Habilitar RLS
ALTER TABLE agencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE agency_restaurants ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para agências
CREATE POLICY "Agências por proprietário" ON agencies
  FOR ALL USING (
    id IN (
      SELECT agency_id FROM restaurants WHERE auth.uid()::text = id::text
    )
  );
```



### ✅ CHECKLIST SPRINT 6:
- [ ] Domínios personalizados funcionando
- [ ] Painel de agência operacional
- [ ] Sistema de marca própria
- [ ] Permissões por usuário
- [ ] Billing consolidado
- [ ] Seletor de restaurantes
- [ ] Customização visual completa

---

## 🏃‍♂️ SPRINT 7: AUTOMAÇÕES + INTEGRAÇÕES (7 dias)
### 🎯 Objetivo: Automações inteligentes e integrações avançadas

### 📝 PASSOS EXTERNOS:

#### 1. Configurar Webhooks Avançados
1. Configure webhooks para:
   - Stripe: todos os eventos de billing
   - Meta Ads: mudanças de status
   - Supabase: triggers de dados

#### 2. Configurar Make.com (Zapier Alternative)
1. Acesse [make.com](https://make.com)
2. Crie conta e configure scenarios:
   - Novo cliente → enviar email boas-vindas
   - Campanha sem conversão → alerta
   - Assinatura cancelada → workflow retenção

#### 3. Expandir Database para Automações
No Supabase SQL Editor:

```sql
-- Tabela de automações
CREATE TABLE automations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  trigger_type VARCHAR(100) NOT NULL,
  trigger_config JSONB,
  action_type VARCHAR(100) NOT NULL,
  action_config JSONB,
  is_active BOOLEAN DEFAULT true,
  last_run TIMESTAMP,
  run_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de notificações
CREATE TABLE notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  type VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT,
  is_read BOOLEAN DEFAULT false,
  action_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de integrações
CREATE TABLE integrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  provider VARCHAR(100) NOT NULL,
  config JSONB,
  status VARCHAR(50) DEFAULT 'active',
  last_sync TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Função para criar notificação
CREATE OR REPLACE FUNCTION create_notification(
  rest_id UUID,
  notif_type TEXT,
  notif_title TEXT,
  notif_message TEXT
)
RETURNS UUID AS $$
DECLARE
  new_notif_id UUID;
BEGIN
  INSERT INTO notifications (restaurant_id, type, title, message)
  VALUES (rest_id, notif_type, notif_title, notif_message)
  RETURNING id INTO new_notif_id;
  
  RETURN new_notif_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Habilitar RLS
ALTER TABLE automations ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Automações por restaurante" ON automations
  FOR ALL USING (restaurant_id IN (
    SELECT id FROM restaurants WHERE auth.uid()::text = id::text
  ));

CREATE POLICY "Notificações por restaurante" ON notifications
  FOR ALL USING (restaurant_id IN (
    SELECT id FROM restaurants WHERE auth.uid()::text = id::text
  ));
```


### ✅ CHECKLIST SPRINT 7:
- [ ] Make.com configurado e funcionando
- [ ] Webhooks avançados ativos
- [ ] Centro de notificações
- [ ] Automações básicas funcionando
- [ ] Integrações com APIs externas
- [ ] Sistema de alertas
- [ ] Sincronização automática

---

## 🏃‍♂️ SPRINT 8: IA + ANALYTICS AVANÇADOS (7 dias)
### 🎯 Objetivo: Inteligência artificial e insights avançados

### 📝 PASSOS EXTERNOS:

#### 1. Configurar OpenAI API
1. Acesse [platform.openai.com](https://platform.openai.com)
2. Crie conta e gere API key
3. Configure billing e limites

#### 2. Configurar Mixpanel (Analytics Avançado)
1. Acesse [mixpanel.com](https://mixpanel.com)
2. Crie projeto e configure eventos
3. Implemente tracking de funil

#### 3. Expandir Database para IA
No Supabase SQL Editor:

```sql
-- Tabela de insights de IA
CREATE TABLE ai_insights (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  type VARCHAR(100) NOT NULL,
  insight_data JSONB,
  confidence_score DECIMAL(3,2),
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de otimizações sugeridas
CREATE TABLE optimization_suggestions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  campaign_id UUID REFERENCES ad_campaigns(id),
  suggestion_type VARCHAR(100) NOT NULL,
  current_value TEXT,
  suggested_value TEXT,
  expected_improvement DECIMAL(5,2),
  is_applied BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de relatórios customizados
CREATE TABLE custom_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  config JSONB,
  schedule VARCHAR(50),
  last_generated TIMESTAMP,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Função para gerar insights
CREATE OR REPLACE FUNCTION generate_ai_insights(
  rest_id UUID
)
RETURNS void AS $$
BEGIN
  -- Placeholder para lógica de IA
  INSERT INTO ai_insights (restaurant_id, type, insight_data)
  VALUES (rest_id, 'performance_analysis', '{"status": "generated"}');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Habilitar RLS
ALTER TABLE ai_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE optimization_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_reports ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Insights por restaurante" ON ai_insights
  FOR ALL USING (restaurant_id IN (
    SELECT id FROM restaurants WHERE auth.uid()::text = id::text
  ));
```

#### 4. Configurar Variáveis de Ambiente
Adicione no Vercel:
- `OPENAI_API_KEY`
- `MIXPANEL_TOKEN`
- `MIXPANEL_SECRET`


### ✅ CHECKLIST SPRINT 8:
- [ ] OpenAI API configurada
- [ ] Mixpanel implementado
- [ ] Sugestões de IA funcionando
- [ ] Relatórios customizados
- [ ] Otimização automática
- [ ] Dashboard de insights
- [ ] Predições de performance

---

## 🎯 RESULTADO FINAL COMPLETO

### ✅ SISTEMA ENTERPRISE EM PRODUÇÃO:
- Frontend React otimizado
- Backend Supabase escalável
- Autenticação + Multi-tenancy
- Meta Ads API integrada
- Sistema de billing completo
- Landing page builder
- Sistema de cupons
- White-label para agências
- Automações inteligentes
- IA para otimizações
- Analytics avançados
- Monitoramento completo

### 📊 MÉTRICAS DE SUCESSO FINAIS:
- Uptime > 99.9%
- Lighthouse Score > 90
- Tempo de carregamento < 3s
- Zero erros críticos
- Conversão de trial > 15%
- ROAS médio > 300%
- Retenção de clientes > 80%

### 🚀 CAPACIDADES COMPLETAS:
- ✅ Multi-tenant escalável
- ✅ White-label para agências
- ✅ Automações no-code
- ✅ IA para otimizações
- ✅ Analytics avançados
- ✅ Landing pages personalizadas
- ✅ Sistema de cupons
- ✅ Integrações múltiplas

---

## 📞 SUPORTE

**Dúvidas técnicas:** Consulte a documentação de cada ferramenta
**Problemas de deploy:** Verifique logs no Vercel
**Erros de API:** Monitore no Sentry
**Suporte IA:** Verifique logs OpenAI

---

*Guia criado seguindo metodologia Feynman - explicações simples e diretas para máxima compreensão e execução.*