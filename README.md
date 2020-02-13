# Websocket API.

## APIs

- Cria Usuário no Cognito
- Deletar Usuário no Cognito
  ...

## Envs

Criar um arquivo `.env` e inserir variáveis de ambiente a esse arquivo da seguinte forma:

```
AUTH_DOMAIN=<DOMINIO DO SERVIÇO>
COGNITO_USER_EMAIL=<EMAIL DO USUARIO COGNITO PRE CADASTRADO>
COGNITO_PASSWORD=<PASSWORD DO USUARIO COGNITO PRE CADASTRADO>
COGNITO_PROPOSED_PASSWORD=<PASSWORD PROPOSTO NA ALTERAÇÃO DE PASSWORD DO USUARIO COGNITO PRE CADASTRADO>
COGNITO_ID=<ID DO USUARIO COGNITO PRE CADASTRADO>
```

# Test

Para realizar os testes é necessãrio seguir os seguintes passos:

1. Instalar as dependencias do projeto via: `npm install`
2. Implantar a aplicação na cloud: `npm run deploy-test`
3. criar o arquivo de `.env`
4. Executar os testes via: `npm test`

# Tools

Algumas ferramentas uteis durante testes manuais:

- Servidor de email (Temp Mail): https://temp-mail.org/pt/
- Postman: https://www.getpostman.com/
- ESLINT: https://www.npmjs.com/package/eslint

# Documentation

Documentação pública dos serviços da Hazel: https://documenter.getpostman.com/view/1147519/SVtR2Vhh
