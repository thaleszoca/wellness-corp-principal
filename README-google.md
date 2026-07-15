# Como ativar o Login com Google

O código já está pronto. Falta só você criar um projeto no Google e pegar uma
chave chamada **Client ID**. Siga os passos abaixo (leva ~10 minutos).

## 1. Acesse o Google Cloud Console
- Entre em: https://console.cloud.google.com
- Faça login com sua conta Google.

## 2. Crie um projeto
- No topo, clique no seletor de projetos → **Novo projeto**.
- Dê um nome (ex.: `Wellness`) → **Criar**.
- Espere criar e selecione esse projeto.

## 3. Configure a "Tela de consentimento OAuth"
- Menu (☰) → **APIs e serviços** → **Tela de permissão OAuth**.
- Tipo de usuário: **Externo** → **Criar**.
- Preencha só o obrigatório:
  - Nome do app: `Wellness`
  - E-mail de suporte: seu e-mail
  - E-mail do desenvolvedor: seu e-mail
- **Salvar e continuar** até o fim (pode pular escopos e usuários de teste).
- Em "Usuários de teste", **adicione seu próprio e-mail** (e o do seu amigo, se quiser que ele teste).

## 4. Crie o Client ID
- Menu → **APIs e serviços** → **Credenciais**.
- **+ Criar credenciais** → **ID do cliente OAuth**.
- Tipo de aplicativo: **Aplicativo da Web**.
- Em **Origens JavaScript autorizadas**, clique em "Adicionar URI" e coloque **exatamente**:
  ```
  http://localhost
  ```
- Clique em **Criar**.
- Vai aparecer uma janela com o **ID do cliente** — copie ele. É algo como:
  ```
  123456789-abcdefg.apps.googleusercontent.com
  ```

## 5. Cole o Client ID em DOIS lugares
Abra e substitua `COLE_SEU_CLIENT_ID_AQUI...` pelo ID que você copiou:

1. `backend/config/google.php`
2. `src/js/pages/login.js` (a linha `const GOOGLE_CLIENT_ID = ...`)

> Os dois precisam ter **o mesmo** Client ID. Ele não é secreto, pode ficar no código.

## 6. Teste
- XAMPP: Apache + MySQL ligados.
- Rode a migração do banco **uma vez** (phpMyAdmin → aba SQL → cole o conteúdo de
  `backend/database/migration-google.sql` → Executar).
- Abra: `http://localhost/wellness/src/pages/auth/login.html`
- Clique em **Continuar com Google** → escolha sua conta → deve entrar no app.

## Observações
- Só funciona acessando por **http://localhost/...** (não por Live Server nem clique duplo).
- Enquanto o app estiver em "modo de teste" no Google, só os e-mails que você
  adicionou como "usuários de teste" conseguem entrar. Isso é normal.
