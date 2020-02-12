import { body, param, query } from 'express-validator/check';

const registerBodyvalidator = [
  body('alias')
    .exists()
    .withMessage('alias é um campo obrigatório.')
    .isString()
    .withMessage('Deve ser uma string.'),
];

const validatorMongoId = [
  param('id')
    .optional()
    .isMongoId()
    .withMessage('ID deve ser um mongo ID.'),
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

export { registerBodyvalidator, validatorMongoId, validateQuery };
