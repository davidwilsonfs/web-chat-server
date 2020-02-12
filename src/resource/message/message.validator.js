import { body, query } from 'express-validator/check';

const registerBodyvalidator = [
  body('message')
    .exists()
    .withMessage('Message é um campo obrigatório.')
    .isString()
    .withMessage('Deve ser uma string.'),
  body('channel')
    .exists()
    .withMessage('channel é um campo obrigatório.')
    .isString()
    .withMessage('channel ser uma string.'),
  body('user')
    .exists()
    .withMessage('user é um campo obrigatório.')
    .isString()
    .withMessage('user ser uma string.'),
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
