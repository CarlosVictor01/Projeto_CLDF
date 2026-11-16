# CLDF — Educação para a Cidadania

Aplicação de demonstração com React, TypeScript e uma API Node executada junto com o Vite. O administrador publica quizzes e acompanha as participações e o ranking por quiz. O participante abre um link, responde e recebe 16 pontos por acerto.

## Executar

Use Node.js 22.12 ou superior e pnpm. No terminal, dentro da pasta do projeto:

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Abra http://localhost:8443. No notebook da apresentação, com as dependências já instaladas e o Node fornecido pelo Codex, o comando equivalente no PowerShell é:

```powershell
& "$env:USERPROFILE\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe" ".\node_modules\vite\bin\vite.js"
```

Para conferir a compilação e testar a versão compilada, encerre o servidor de desenvolvimento e execute `pnpm build` e `pnpm preview`. A API funciona nos dois modos. Para outra porta, defina a variável `PORT`.

## Demonstrar

1. Entre em **/admin** com usuário **admin** e senha **admin**. Abra **Criar novo quiz**, preencha as perguntas, marque o gabarito e salve.
2. Abra o link de participação em outra aba. Entre com e-mail e senha ou escolha **Criar conta** e informe nome, e-mail e senha (mínimo de 6 caracteres). O sistema retorna ao quiz após o login. Se for compartilhar na rede local, abra o painel pelo endereço de rede do notebook exibido pelo Vite e copie o link de participação. Os dispositivos precisam alcançar esse endereço.
3. Em **Admin → Quizzes publicados**, selecione o quiz e crie uma **Nova turma** para cada palestra. Selecione o evento e clique em **Gerar QR Code**. No notebook, confira o endereço de rede exibido antes de projetar o código.
4. Abra **Inscritos e ranking** para acompanhar a turma. O painel atualiza a cada cinco segundos. O aluno entra na lista após acessar o evento autenticado, e a primeira entrega define a pontuação no ranking daquela turma. A turma de demonstração de Cidadania contém dez alunos fictícios. As turmas novas começam vazias.

O desafio educativo original da jornada é um exemplo fixo. Os quizzes criados no painel usam seus próprios links. Os indicadores de progresso da jornada são ilustrativos.

## Persistência e API

O primeiro salvamento cria `data/quizzes.json`. O arquivo guarda contas, hashes de senha com salt, perguntas, gabaritos e tentativas concluídas. Os dados sobrevivem ao reinício e a pasta é ignorada pelo Git. Com o servidor parado, copie o arquivo para fazer backup. Para testes, a variável `QUIZ_DATA_FILE` permite usar outro arquivo (fora das pastas públicas). Execute um único processo de servidor por arquivo. Cada gravação substitui o JSON por renomeação após escrever uma cópia temporária.

| Método e rota | Finalidade |
| --- | --- |
| POST /api/quizzes | Publica um quiz com título e questões. Cada questão contém text, options e correct (índice a partir de zero). Retorna id. |
| GET /api/quizzes | Lista os quizzes e os relatórios por evento (admin). |
| POST /api/turmas | Cria evento para quizId com o nome indicado em name (admin). |
| POST /api/quizzes/:id/inscricao | Inscreve o participante no evento e entrega suas questões. O id identifica a turma. |
| GET /api/quizzes/:id | Entrega o título, as perguntas e as alternativas ao participante. |
| POST /api/quizzes/:id/respostas | Recebe answers (índices na ordem das perguntas) e key (identificador da tentativa). Retorna correct, total e score. Reenviar a mesma tentativa mantém uma única participação. |

As requisições POST usam JSON. O servidor valida o gabarito e calcula os acertos. No ranking de cada evento, vale a primeira tentativa concluída por participante. Links antigos identificam a turma inicial do quiz. Tentativas antigas anônimas continuam nas estatísticas gerais.

## Alcance da demonstração

Esta versão destina-se a uma rede de demonstração confiável. O painel e as estatísticas exigem sessão administrativa. O acesso ao quiz exige sessão de participante. Cada perfil possui seu próprio cookie HttpOnly, com validade de oito horas. Reiniciar a API encerra as sessões. A validação de e-mail verifica o formato. Para sair, use **Sair** no painel ou na área do participante. A senha administrativa da demonstração pode ser substituída pela variável de ambiente CLDF_ADMIN_PASSWORD antes de iniciar o servidor. Use HTTPS e uma senha administrativa forte ao hospedar o sistema. O GitHub Pages serve arquivos estáticos: publicar apenas a pasta dist não inicia a API.

