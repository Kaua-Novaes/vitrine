-- V3: Add admin@vitrine.com.br user for demo compatibility
-- BCrypt for 'password123': $2a$10$7q5J4F1B3E0C6D8A2Z9Y0uW1V2U3T4S5R6Q7P8O9N0M1L2K3J4I5H
-- BCrypt for 'admin123': $2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG

INSERT INTO users (id, tenant_id, name, email, password_hash, role, active, created_at, updated_at)
SELECT 'b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'Administrador Vitrine', 'admin@vitrine.com.br', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'MASTER', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@vitrine.com.br');

-- Ensure demo user has known bcrypt hash for admin123
UPDATE users 
SET password_hash = '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG' 
WHERE email IN ('admin@graficamodelo.com.br', 'admin@vitrine.com.br');
