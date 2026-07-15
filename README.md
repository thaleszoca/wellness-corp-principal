# Wellness

Plataforma de bem-estar (projeto com front-end em HTML/CSS/JS e back-end em PHP + MySQL/MariaDB via XAMPP).

## Como rodar o projeto na sua máquina

Siga estes passos na ordem.

### 1. Instale o XAMPP
Baixe e instale o XAMPP: https://www.apachefriends.org
(Ele já vem com Apache, PHP e MariaDB/MySQL — tudo que o projeto precisa.)

### 2. Clone o repositório dentro da pasta `htdocs`
O projeto **precisa** ficar dentro de `htdocs` do XAMPP, senão o PHP não roda.

No Windows, a pasta costuma ser `C:\xampp\htdocs`. Abra o terminal ali e clone:

```bash
cd C:\xampp\htdocs
git clone <URL-DO-REPOSITORIO> wellness
```

Ao final você deve ter a pasta `C:\xampp\htdocs\wellness`.

### 3. Ligue o Apache e o MySQL
Abra o **XAMPP Control Panel** e clique em **Start** nas linhas do **Apache** e do **MySQL**. As duas precisam ficar verdes.

### 4. Crie o banco de dados
1. Acesse o phpMyAdmin: http://localhost/phpmyadmin
2. Clique na aba **Importar** (no topo)
3. Escolha o arquivo [`backend/database/wellness.sql`](backend/database/wellness.sql) deste projeto
4. Clique em **Executar**

Isso cria o banco `wellness` e a tabela `usuarios` automaticamente.

### 5. Acesse o projeto
Abra no navegador (sempre pelo `localhost`, **nunca** por clique duplo ou Live Server):

```
http://localhost/wellness/src/pages/auth/cadastro.html
```

Pronto! Já dá pra cadastrar e fazer login.

## Observações importantes

- **Sempre acesse por `http://localhost/wellness/...`** — quem executa o PHP é o Apache. Abrir o `.html` por clique duplo (`file:///...`) ou pelo Live Server do VS Code **não funciona** com PHP.
- A conexão com o banco está em [`backend/config/conexao.php`](backend/config/conexao.php) com o usuário padrão do XAMPP (`root`, sem senha). Se o seu XAMPP tiver outra senha para o MySQL, ajuste ali.
- O arquivo `backend/database/wellness.sql` guarda apenas a **estrutura** do banco (sem dados de usuários). Cada pessoa cria seus próprios cadastros localmente.
