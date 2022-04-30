# AmyWeb

**Production:** [![Build Status](https://travis-ci.com/saviocamacam/lacroix-web-front.svg?branch=master)](https://travis-ci.com/saviocamacam/lacroix-web-front)

**Development:** [![Build Status](https://travis-ci.com/saviocamacam/lacroix-web-front.svg?branch=development)](https://travis-ci.com/saviocamacam/lacroix-web-front)

:books: Sistema de Gerenciamento de Avaliação e Desempenho Escolar

## Tecnologias :wrench:

- [Angular](https://angular.io) para o frontend
- [NPM](https://www.npmjs.com) como gerenciador de pacotes
- [MongoDB](https://mongodb.com) para armazenar nossos dados e [Mongoose](https://mongoosejs.com) como ORM
- [MongoDB Compass](https://www.mongodb.com/products/compass) como interface gráfica para o MongoDB
  - Parâmetros para o uso da base de produção:
    - hostname: ds135540.mlab.com
    - port: 35540
    - Authentication: username/password
    - username: <u user>
    - password: <u pass>
    - Authentication Database: heroku_651d054x

    - Favorite Name: Production

- [Travis](https://travis-ci.com/download) para integração contínua
- [Git Kraken](https://www.gitkraken.com/download) para o estudo de branches
  - Serviço disponibilzado pelo GitLab:
    Exemplo para o repositório amy-web: https://gitlab.com/atlaensino/amy-web/network/master
- [Postman](https://www.getpostman.com/downloads/) e [Insomnia](https://insomnia.rest/download/) para teste de requisições
- [DbSchema](http://www.dbschema.com/download.html) e [NoSQLBooster](https://nosqlbooster.com/downloads) como GUI Tool para MongoDB
- [SendGrid](https://sendgrid.com/) como serviço de entrega de email
- [FreshDesk](https://freshdesk.com/br/) para suporte de software ao cliente

## Configurações e dicas para aumento de produtividade :rocket:

- Neste [site](https://dev.to/mokkapps/how-i-increased-my-productivity-with-visual-studio-code-gfo) encontra-se várias dicas de aumento de produtividade no desenvolvimento utilizando o **Visual Studio Code**, através de plugins e atalhos.
- Instalar o [ESlint](https://www.npmjs.com/package/eslint) e [Prettier](https://www.npmjs.com/package/prettier) para padronização e formatação de código.
- Instalar extensão do vscode ESlint
- Adicionar isto às configurações do vscode para manter o padrão de código entre os membros:

```
"[javascript]": {
    "editor.insertSpaces": true,
    "editor.tabSize": 2,
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "editor.formatOnSave": true,
  "prettier.eslintIntegration": true
```

- Features do EcmaScript (ES) 6/7/8 através de exemplos [aqui](https://blog.rocketseat.com.br/as-melhores-features-do-es6-es7-e-es8/).

- Extensões do vscode utilizadas:
  - Prettier - Code Formater
  - TypeScript Toolbox
  - Angular 7 and TypeScript/HTML VS Code Snippets
  - Angular Material v7 snippets
  - Ionic 3 ionView Snippets
  - Ionic 3 snippets
  - SCSS Formatter
  - SCSS IntelliSense

## Monitoramento de atividade

- [WakaTime](https://wakatime.com/)

## Executando localmente :house:

1.  Clone o repositórios
2.  Baixe as dependências do projeto
3.  Execute o script local/local_mac: `npm run local` | `npm run local_mac`

## Executando externamente :earth_americas:

- Aplicação em produção: www.atlaensino.com
- Aplicação para desenvolvimento: www.atlaensinodev.herokuapp.com

## Link do aplicativo
[Play Store](https://play.google.com/store/apps/details?id=com.atla.app)
[App Store](https://apps.apple.com/br/app/atla-ensino/id1447875221)