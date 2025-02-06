/*
  # Initial Schema Setup for EcoCidade

  1. New Tables
    - `users`
      - User profile information and preferences
    - `products`
      - Sustainable product catalog
    - `categories`
      - Product categories
    - `certifications`
      - Product certifications and badges
    - `searches`
      - User search history and analytics

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  username text NOT NULL,
  is_premium boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  preferences jsonb DEFAULT '{
    "categories": [],
    "priceRange": {"min": 0, "max": 1000},
    "sustainabilityPreferences": []
  }'::jsonb
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  icon text,
  created_at timestamptz DEFAULT now()
);

-- Certifications table
CREATE TABLE IF NOT EXISTS certifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  icon text,
  created_at timestamptz DEFAULT now()
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price decimal NOT NULL,
  category_id uuid REFERENCES categories(id),
  image_url text,
  sustainability_score integer CHECK (sustainability_score >= 0 AND sustainability_score <= 10),
  affiliate_link text,
  platform text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Product certifications junction table
CREATE TABLE IF NOT EXISTS product_certifications (
  product_id uuid REFERENCES products(id),
  certification_id uuid REFERENCES certifications(id),
  PRIMARY KEY (product_id, certification_id)
);

-- Search history table
CREATE TABLE IF NOT EXISTS searches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  query text NOT NULL,
  results_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE searches ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can read their own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Products policies
CREATE POLICY "Anyone can read products"
  ON products
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Categories policies
CREATE POLICY "Anyone can read categories"
  ON categories
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Certifications policies
CREATE POLICY "Anyone can read certifications"
  ON certifications
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Product certifications policies
CREATE POLICY "Anyone can read product certifications"
  ON product_certifications
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Searches policies
CREATE POLICY "Users can read their own searches"
  ON searches
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own searches"
  ON searches
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Insert initial categories
INSERT INTO categories (name, slug, description, icon) VALUES
  ('Alimentação Sustentável', 'food', 'Produtos alimentícios sustentáveis e orgânicos', 'Utensils'),
  ('Moda e Acessórios', 'fashion', 'Moda sustentável e acessórios eco-friendly', 'ShoppingBag'),
  ('Energia e Eletrodomésticos', 'energy', 'Produtos para eficiência energética', 'Zap'),
  ('Beleza e Cuidados', 'beauty', 'Produtos de beleza naturais e sustentáveis', 'Sparkles'),
  ('Casa e Jardim', 'home', 'Produtos sustentáveis para casa e jardim', 'Home'),
  ('Mobilidade', 'mobility', 'Soluções de mobilidade sustentável', 'Car')
ON CONFLICT (slug) DO NOTHING;

-- Insert initial certifications
INSERT INTO certifications (name, description) VALUES
  ('Orgânico', 'Certificação para produtos orgânicos'),
  ('Comércio Justo', 'Certificação de comércio justo'),
  ('Vegano', 'Certificação para produtos veganos'),
  ('Reciclável', 'Certificação de produto reciclável'),
  ('Biodegradável', 'Certificação de produto biodegradável')
ON CONFLICT DO NOTHING;