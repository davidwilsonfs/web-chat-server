# Websocket API.

Api para fins de avaliação tecnica, que tem como principal objetivo fornecer um Websocket API e uma API REST para controle de um webchat WEB. Foi utilizado NodeJs em conjunto com MongoDB.

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


## Instalação
Instalar npm packages;

```
npm install
```


## Scripts do sistema
Todos os scripts rodam com  `npm run [script]`, por exemplo: `npm run dev`.

`build`        - gera o minified build na pasta `dist`  
`dev`          - Roda a aplicação em modo de desenvolvimento  
`test`         - Executa todos os testes  
`start`        - Realiza o build e inicializa a aplicação a partir do dist


Os scripts de execução estão todos no `package.json`. Para a aplicação se conectar ao banco de dados, é necessário a instalação do MongoDB. [LINK](https://www.mongodb.com/cloud/atlas/lp/general/try?utm_source=google&utm_campaign=gs_americas_brazil_search_brand_atlas_desktop&utm_term=mongodb%20download&utm_medium=cpc_paid_search&utm_ad=e&gclid=CjwKCAiAhJTyBRAvEiwAln2qB96ILb5SO8IGse1GFIhCkW7vknF-r6kDAjXcDvgxlw43sECKsXgC0BoCWeAQAvD_BwE). 


## Executando dentro do container DOCKER

Para executar a aplicação dentro de um container é necessário executar os seguintes comandos:

`docker-compose build`        - gera a imagem da API a partir do `Dockerfile`  
`docker-compose up -d`          - Orquestra os containers da API e do MongoDB e levanta a aplicação
   
# Documentation da API

Para acessar a documentação do swagger, acessar `http://localhost:<PORT>`. Para acessar o swagger status, para obter informações sobre a "saúde" da sua aplicação REST, acessar `http://localhost:<PORT>/<SWAGGER_URL_STATS>`
