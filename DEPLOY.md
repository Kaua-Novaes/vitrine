# 🚀 Guia de Deploy em Produção (VPS)

Este documento contém o passo a passo completo para colocar a plataforma multi-tenant em produção na sua VPS.

---

## 1. Configuração do DNS (Crucial para Multi-Tenancy)

No seu provedor de domínio (ex: Cloudflare, Registro.br, Hostinger):

1. **Entrada A principal**:
   - Tipo: `A`
   - Nome: `@` (ou `vitrine.com.br`)
   - Conteúdo: `IP_DA_SUA_VPS`
   - TTL: Automático

2. **Entrada A Wildcard (Para todas as lojas de clientes)**:
   - Tipo: `A`
   - Nome: `*` (ou `*.vitrine.com.br`)
   - Conteúdo: `IP_DA_SUA_VPS`
   - TTL: Automático

*(Com o wildcard `*`, qualquer loja nova que você criar, ex: `grafica-modelo.vitrine.com.br`, já apontará automaticamente para a sua VPS sem precisar mexer no DNS de novo).*

---

## 2. Instalar Docker na VPS

Se a VPS for Ubuntu/Debian recém-criada:

```bash
# Atualizar pacotes
sudo apt update && sudo apt upgrade -y

# Instalar Docker e Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Instalar Nginx e Certbot
sudo apt install -y nginx certbot python3-certbot-nginx
```

---

## 3. Clonar o Repositório e Subir os Containers

```bash
# Clonar
git clone https://github.com/Kaua-Novaes/vitrine.git
cd vitrine

# Subir todos os serviços (PostgreSQL, Backend Spring Boot e Frontend Next.js)
docker compose up -d --build
```

Verifique se os 3 containers estão rodando:
```bash
docker compose ps
```

---

## 4. Configurar Nginx na VPS (Reverse Proxy + SSL)

Crie o arquivo de configuração no Nginx da VPS:

```bash
sudo nano /etc/nginx/sites-available/vitrine
```

Cole o conteúdo abaixo (substituindo `seudominio.com.br` pelo seu domínio real):

```nginx
server {
    server_name seudominio.com.br *.seudominio.com.br;

    client_max_body_size 10M;

    # API Backend (Spring Boot na porta 28080)
    location /api/ {
        proxy_pass http://localhost:28080/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Arquivos de Upload / Fotos (Servidos direto pelo backend na porta 28080)
    location /storage/ {
        proxy_pass http://localhost:28080/storage/;
        proxy_set_header Host $host;
    }

    # Frontend Next.js (Vitrine, Admin e Super Admin na porta 23000)
    location / {
        proxy_pass http://localhost:23000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Ative o site no Nginx e recarregue:
```bash
sudo ln -s /etc/nginx/sites-available/vitrine /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 5. Gerar Certificado SSL Gratuito (HTTPS)

Para gerar o certificado SSL com suporte a Wildcard:

```bash
sudo certbot --nginx -d seudominio.com.br -d *.seudominio.com.br
```

---

## 6. Pronto! 🎉
Sua plataforma estará 100% online em:
- **Painel Dono (Super Admin)**: `https://seudominio.com.br/super-admin`
- **Painel da Loja**: `https://seudominio.com.br/admin`
- **Vitrines dos Clientes**: `https://loja1.seudominio.com.br`
