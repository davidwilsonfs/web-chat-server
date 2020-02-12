import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import swStats from 'swagger-stats';
import { log } from './boot.logger';

/**
 * Configura o swagger para gerar a documentação
 * da API
 * @param {Express} app express app
 */
export default app => {
  log('SWAGGER', 'Inicializando a documentação da API');

  const swaggerDefinition = {
    info: {
      title: 'Node Swagger API',
      version: '1.0.0',
      description: `Demonstrating how to describe a RESTful API with Swagger. Status da api ${process.env.SWAGGER_URL_STATS}`,
    },
    host: `${process.env.API_URL}`,
    basePath: `${process.env.API_BASE_PATH}`,
    securityDefinitions: {
      UserAuth: {
        type: 'apiKey',
        description: 'User Authorization',
        name: 'Authorization',
        in: 'header',
      },
    },
  };

  // options for the swagger docs
  const options = {
    swaggerDefinition,
    apis: ['./**/*.routing.js'],
  };

  // initialize swagger-jsdoc
  const swaggerSpec = swaggerJSDoc(options);

  const swaggerOptions = {
    docExpansion: 'none',
    tagsSorter: 'alpha',
    operationsSorter: 'method',
  };

  app.use(
    `${process.env.SWAGGER_ROUTE}`,
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, false, swaggerOptions)
  );

  app.get('/', (req, res) => res.redirect(`${process.env.SWAGGER_ROUTE}`));
  app.use(swStats.getMiddleware({ swaggerSpec }));
};
