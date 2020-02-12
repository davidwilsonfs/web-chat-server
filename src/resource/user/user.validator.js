import { body, query } from 'express-validator/check';

const registerBodyvalidator = [
  body('username')
    .exists()
    .withMessage('Username é um campo obrigatório.')
    .isString()
    .withMessage('Deve ser uma string.'),
  body('urlImage')
    .exists()
    .withMessage('UrlImage é um campo obrigatório.')
    .isString()
    .withMessage('Deve ser uma string.'),
];

const validateQuery = [
  query('limit')
    .optional()
    .isInt()
    .withMessage('limit é um campo numérico.'),
  query('page')
    .optional()
    .isInt()
    .withMessage('page é um campo numérico.'),
];

export { registerBodyvalidator, validateQuery };
