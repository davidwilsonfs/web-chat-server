import { body, query } from 'express-validator/check';

const registerBodyvalidator = [
  body('message')
    .exists()
    .withMessage('Message é um campo obrigatório.')
    .isString()
    .withMessage('Deve ser uma string.'),
  body('aliasChannel')
    .exists()
    .withMessage('aliasChannel é um campo obrigatório.')
    .isString()
    .withMessage('aliasChannel ser uma string.'),
  body('username')
    .exists()
    .withMessage('username é um campo obrigatório.')
    .isString()
    .withMessage('username ser uma string.'),
];

export { registerBodyvalidator };
