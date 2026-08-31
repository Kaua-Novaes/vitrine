-- Seed Demo Tenant and Initial Catalog for Testing (ANSI SQL Compatible with PostgreSQL and H2)

-- 1. Tenant: Gráfica Modelo
INSERT INTO tenants (id, name, slug, active, created_at, updated_at)
SELECT 'a0000000-0000-0000-0000-000000000001', 'Gráfica Modelo', 'grafica-modelo', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM tenants WHERE id = 'a0000000-0000-0000-0000-000000000001');

-- 2. Master User (email: admin@graficamodelo.com.br, password: admin123)
-- BCrypt hash for 'admin123': $2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG
INSERT INTO users (id, tenant_id, name, email, password_hash, role, active, created_at, updated_at)
SELECT 'b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Administrador Master', 'admin@graficamodelo.com.br', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'MASTER', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM users WHERE id = 'b0000000-0000-0000-0000-000000000001');

-- 3. Store Settings
INSERT INTO store_settings (id, tenant_id, logo_url, primary_color, secondary_color, background_color, text_color, whatsapp_number, whatsapp_message_template, created_at, updated_at)
SELECT 'c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=300&auto=format&fit=crop&q=80', '#2563EB', '#1E40AF', '#FFFFFF', '#1F2937', '5511999999999', 'Olá! Tenho interesse no produto da Gráfica Modelo. Gostaria de solicitar um orçamento.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM store_settings WHERE id = 'c0000000-0000-0000-0000-000000000001');

-- 4. Categories
INSERT INTO categories (id, tenant_id, name, slug, description, image_url, display_order, active, created_at, updated_at)
SELECT 'd0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Cartões de Visita', 'cartoes-de-visita', 'Cartões de visita premium em diversos papéis e acabamentos especiais.', 'https://images.unsplash.com/photo-1589330694653-dad6d3240a2b?w=600&auto=format&fit=crop&q=80', 1, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE id = 'd0000000-0000-0000-0000-000000000001');

INSERT INTO categories (id, tenant_id, name, slug, description, image_url, display_order, active, created_at, updated_at)
SELECT 'd0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'Adesivos & Rótulos', 'adesivos-e-rotulos', 'Adesivos em vinil fosco, brilho e transparente cortados no formato desejado.', 'https://images.unsplash.com/photo-1572375992501-4b0892d50c69?w=600&auto=format&fit=crop&q=80', 2, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE id = 'd0000000-0000-0000-0000-000000000002');

INSERT INTO categories (id, tenant_id, name, slug, description, image_url, display_order, active, created_at, updated_at)
SELECT 'd0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'Panfletos & Flyers', 'panfletos-e-flyers', 'Material promocional em papel couchê de alta definição para divulgação em massa.', 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=600&auto=format&fit=crop&q=80', 3, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE id = 'd0000000-0000-0000-0000-000000000003');

-- 5. Products
INSERT INTO products (id, tenant_id, name, slug, short_description, description, featured, display_order, active, created_at, updated_at)
SELECT 'e0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Cartão de Visita Couchê 300g com Verniz Localizado', 'cartao-couche-300g-verniz-localizado', 'Cartão premium com laminação fosca e aplicação de verniz brilho nos detalhes da sua marca.', 'Produzido em papel couchê 300g de alta espessura com acabamento de toque aveludado e brilho seletivo. Ideal para profissionais exigentes que desejam causar uma primeira impressão memorável.', TRUE, 1, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM products WHERE id = 'e0000000-0000-0000-0000-000000000001');

INSERT INTO products (id, tenant_id, name, slug, short_description, description, featured, display_order, active, created_at, updated_at)
SELECT 'e0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'Adesivo Vinil Redondo com Meio Corte', 'adesivo-vinil-redondo', 'Adesivos recortados à laser em vinil resistente à água, sol e atrito.', 'Perfeito para embalagens, sacolas, delivery e brindes. Resistente a baixas e altas temperaturas com cola permanente de alta fixação.', TRUE, 2, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM products WHERE id = 'e0000000-0000-0000-0000-000000000002');

INSERT INTO products (id, tenant_id, name, slug, short_description, description, featured, display_order, active, created_at, updated_at)
SELECT 'e0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'Panfleto Promocional Couchê 115g (10x14cm)', 'panfleto-promocional-couche-115g', 'Panfletos coloridos frente e verso com excelente custo-benefício para eventos e lançamentos.', 'Impressão offset de altíssima definição com cores vivas e papel leve com acabamento brilhante.', TRUE, 3, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM products WHERE id = 'e0000000-0000-0000-0000-000000000003');

-- 6. Product Categories Associations
INSERT INTO product_categories (product_id, category_id)
SELECT 'e0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001'
WHERE NOT EXISTS (SELECT 1 FROM product_categories WHERE product_id = 'e0000000-0000-0000-0000-000000000001' AND category_id = 'd0000000-0000-0000-0000-000000000001');

INSERT INTO product_categories (product_id, category_id)
SELECT 'e0000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000002'
WHERE NOT EXISTS (SELECT 1 FROM product_categories WHERE product_id = 'e0000000-0000-0000-0000-000000000002' AND category_id = 'd0000000-0000-0000-0000-000000000002');

INSERT INTO product_categories (product_id, category_id)
SELECT 'e0000000-0000-0000-0000-000000000003', 'd0000000-0000-0000-0000-000000000003'
WHERE NOT EXISTS (SELECT 1 FROM product_categories WHERE product_id = 'e0000000-0000-0000-0000-000000000003' AND category_id = 'd0000000-0000-0000-0000-000000000003');

-- 7. Product Images
INSERT INTO product_images (id, product_id, tenant_id, image_url, display_order, created_at)
SELECT 'f0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1589330694653-dad6d3240a2b?w=800&auto=format&fit=crop&q=80', 1, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM product_images WHERE id = 'f0000000-0000-0000-0000-000000000001');

INSERT INTO product_images (id, product_id, tenant_id, image_url, display_order, created_at)
SELECT 'f0000000-0000-0000-0000-000000000002', 'e0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1572375992501-4b0892d50c69?w=800&auto=format&fit=crop&q=80', 1, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM product_images WHERE id = 'f0000000-0000-0000-0000-000000000002');

INSERT INTO product_images (id, product_id, tenant_id, image_url, display_order, created_at)
SELECT 'f0000000-0000-0000-0000-000000000003', 'e0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&auto=format&fit=crop&q=80', 1, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM product_images WHERE id = 'f0000000-0000-0000-0000-000000000003');

-- 8. Banners
INSERT INTO banners (id, tenant_id, title, desktop_image_url, mobile_image_url, link_url, display_order, active, created_at, updated_at)
SELECT '11111111-1111-1111-1111-111111111111', 'a0000000-0000-0000-0000-000000000001', 'Imprima sua Identidade Visual com Qualidade Premium', 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1920&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1080&auto=format&fit=crop&q=80', '/produtos', 1, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM banners WHERE id = '11111111-1111-1111-1111-111111111111');

-- 9. Testimonials
INSERT INTO testimonials (id, tenant_id, name, text, display_order, active, created_at, updated_at)
SELECT '22222222-2222-2222-2222-222222222221', 'a0000000-0000-0000-0000-000000000001', 'Juliana Rossi (Arquiteta)', 'A qualidade dos cartões com verniz localizado superou todas as expectativas do meu escritório.', 1, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM testimonials WHERE id = '22222222-2222-2222-2222-222222222221');

INSERT INTO testimonials (id, tenant_id, name, text, display_order, active, created_at, updated_at)
SELECT '22222222-2222-2222-2222-222222222222', 'a0000000-0000-0000-0000-000000000001', 'Carlos Mendonça (Café Gourmet)', 'Os rótulos em vinil para nossas embalagens de café ficaram perfeitos e resistentes à água.', 2, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM testimonials WHERE id = '22222222-2222-2222-2222-222222222222');
