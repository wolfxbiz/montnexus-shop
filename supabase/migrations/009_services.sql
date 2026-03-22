-- ─── Services Marketplace ───

CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES creators(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  short_desc TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL CHECK (category IN ('design', 'dev', 'consulting', 'writing', 'audio-video')),
  cover_url TEXT,
  delivery_time_days INTEGER NOT NULL DEFAULT 7,
  published BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_services_creator ON services(creator_id);
CREATE INDEX idx_services_slug ON services(slug);
CREATE INDEX idx_services_published ON services(published);
CREATE INDEX idx_services_category ON services(category);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published services"
  ON services FOR SELECT
  USING (published = true);

CREATE POLICY "Creators can read own services"
  ON services FOR SELECT
  USING (auth.uid() = (SELECT user_id FROM creators WHERE id = services.creator_id));

CREATE POLICY "Creators can insert own services"
  ON services FOR INSERT
  WITH CHECK (auth.uid() = (SELECT user_id FROM creators WHERE id = services.creator_id));

CREATE POLICY "Creators can update own services"
  ON services FOR UPDATE
  USING (auth.uid() = (SELECT user_id FROM creators WHERE id = services.creator_id));

CREATE POLICY "Creators can delete own services"
  ON services FOR DELETE
  USING (auth.uid() = (SELECT user_id FROM creators WHERE id = services.creator_id));

-- ─── Service Tiers ───

CREATE TABLE service_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  name TEXT NOT NULL CHECK (name IN ('basic', 'standard', 'premium')),
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  price_cents INTEGER NOT NULL,
  delivery_time_days INTEGER NOT NULL DEFAULT 7,
  revisions INTEGER NOT NULL DEFAULT 1,
  features JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(service_id, name)
);

CREATE INDEX idx_service_tiers_service ON service_tiers(service_id);

ALTER TABLE service_tiers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read tiers of published services"
  ON service_tiers FOR SELECT
  USING (EXISTS (SELECT 1 FROM services WHERE services.id = service_tiers.service_id AND services.published = true));

CREATE POLICY "Creators can read own tiers"
  ON service_tiers FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM services
    JOIN creators ON creators.id = services.creator_id
    WHERE services.id = service_tiers.service_id AND creators.user_id = auth.uid()
  ));

CREATE POLICY "Creators can insert own tiers"
  ON service_tiers FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM services
    JOIN creators ON creators.id = services.creator_id
    WHERE services.id = service_tiers.service_id AND creators.user_id = auth.uid()
  ));

CREATE POLICY "Creators can update own tiers"
  ON service_tiers FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM services
    JOIN creators ON creators.id = services.creator_id
    WHERE services.id = service_tiers.service_id AND creators.user_id = auth.uid()
  ));

CREATE POLICY "Creators can delete own tiers"
  ON service_tiers FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM services
    JOIN creators ON creators.id = services.creator_id
    WHERE services.id = service_tiers.service_id AND creators.user_id = auth.uid()
  ));

-- ─── Service Orders ───

CREATE TABLE service_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE RESTRICT,
  tier_id UUID NOT NULL REFERENCES service_tiers(id) ON DELETE RESTRICT,
  client_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  creator_id UUID NOT NULL REFERENCES creators(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'inquiry' CHECK (status IN ('inquiry', 'accepted', 'in_progress', 'delivered', 'revision', 'completed', 'cancelled')),
  brief TEXT,
  stripe_session_id TEXT,
  stripe_payment_intent TEXT,
  amount_cents INTEGER NOT NULL,
  due_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_service_orders_client ON service_orders(client_id);
CREATE INDEX idx_service_orders_creator ON service_orders(creator_id);
CREATE INDEX idx_service_orders_service ON service_orders(service_id);
CREATE INDEX idx_service_orders_status ON service_orders(status);

ALTER TABLE service_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients can read own orders"
  ON service_orders FOR SELECT
  USING (auth.uid() = client_id);

CREATE POLICY "Creators can read orders for their services"
  ON service_orders FOR SELECT
  USING (auth.uid() = (SELECT user_id FROM creators WHERE id = service_orders.creator_id));

CREATE POLICY "Authenticated users can create orders"
  ON service_orders FOR INSERT
  WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Creators can update order status"
  ON service_orders FOR UPDATE
  USING (auth.uid() = (SELECT user_id FROM creators WHERE id = service_orders.creator_id));

-- ─── Service Messages ───

CREATE TABLE service_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_order_id UUID NOT NULL REFERENCES service_orders(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  attachment_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_service_messages_order ON service_messages(service_order_id);

ALTER TABLE service_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Order participants can read messages"
  ON service_messages FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM service_orders
    WHERE service_orders.id = service_messages.service_order_id
    AND (service_orders.client_id = auth.uid() OR
         auth.uid() = (SELECT user_id FROM creators WHERE id = service_orders.creator_id))
  ));

CREATE POLICY "Order participants can send messages"
  ON service_messages FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM service_orders
      WHERE service_orders.id = service_messages.service_order_id
      AND (service_orders.client_id = auth.uid() OR
           auth.uid() = (SELECT user_id FROM creators WHERE id = service_orders.creator_id))
    )
  );
