# Websocket API.

Api para fins de avaliação tecnica, que tem como principal objetivo fornecer um serviço em websocket para controle de um webchat WEB e uma API REST para controle de acesso dos usuários a WEBCHAT.

# Variaveis de Ambiente .env

Variaveis de ambiente que devem ser declaradas no arquivo `.env`

| Envs                           |                                          Descrição | Exemplos                |
| ------------------------------ | -------------------------------------------------: | ----------------------- |
| HOST                           |                                                 IP | localhost               |
| PORT                           |           porta em que o servidor ficará escutando | 8080                    |
| MDB_HOST                       |                               IP do banco de dados | localhost               |
| MDB_NAME                       |                             Nome do banco de dados | chat                    |
| MDB_PORT                       |                            Porta do banco de dados | 27017                   | 
| PROJECT                        |                                    Nome do Projeto | CHAT                    |
| SWAGGER_ROUTE                  |   Rota base para acessar a documentação do swagger | /api-docs               |
| SWAGGER_URL_STATS              |   Rota base para acessar os status da rota         | http://localhost:8986/swagger-stats/ui               |
| DEBUG                          |                     Chave de pesquisa para debugar | CHAT:\*                 |
| LOGS_PATH                      |             diretório em que os logs serão gerados | /logs                   |
| LOGS_FILENAME                  |                arquivo onde os logs serão escritos | /app.log                |
| JWT_PRIVATE_KEY                | Chave privada utilizada na autenticação do sistema | secr3t                  |
| JWT_EXPIRES_IN                 |          Tempo de vida do token  (TTL)        | 3600                |
| API_BASE_PATH                 |                  Rota base da API| /api               |
| API_URL                       |                  URL da API         | localhost:8986                |


## Install
Instalar npm e bower packages;

```
npm install
npm install -g bower
bower install
```

## Development
Todos os scripts rodam com  `npm run [script]`, por exemplo: `npm run dev`.

`build`        - gera o minified build na pasta `dist`  
`test`         - Executa todos os testes  
`start`        - Realiza o build e inicializa a aplicação a partir do dist 

Os scripts de execução estão todos no `package.json`.

# Documentation

Para acessar a documentação do swagger, acessar `http://localhost:<PORT>`. Para acessar o swagger status, para obter informações sobre a "saúde" da sua aplicação REST, acessar `http://localhost:<PORT>/<SWAGGER_URL_STATS>`
