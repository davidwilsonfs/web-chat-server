import { Router } from 'express';
import * as userController from './user.controller';
import { registerBodyvalidator, validateQuery } from './user.validator';
import { authorized } from '../../core/security/auth-strategy.security';

const userRouter = Router();

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retorna todos os usuários
 *     description: Retorna todos os usuários que estão nos chats
 *     security:
 *       - UserAuth: []
 *     tags:
 *       - Users
 *     parameters:
 *       - name: limit
 *         description: Limite da quantidade de documentos por pagina
 *         in: query
 *         required: false
 *         type: string
 *       - name: page
 *         description: Pagina dos documentos
 *         in: query
 *         required: false
 *         type: string
 *     responses:
 *       200:
 *         description: list of all
 */
userRouter.get('/', validateQuery, authorized, userController.getAll);

/**
 * @swagger
 * /users/available/{username}:
 *   get:
 *     summary: Retorna se o usuário esta disponivel
 *     description: Retorna se o nome do usuário está disponivel
 *     tags:
 *       - Users
 *     parameters:
 *       - name: username
 *         description: username
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: informa se o username está disponivel
 *       400:
 *         description: Bad Request
 */
userRouter.get('/available/:username', userController.getAvailable);

/**
 * @swagger
 * /users/join:
 *   post:
 *     summary: Insere o usuário no chat de conversas
 *     description: Insere um novo usuário na base de dados
 *     tags:
 *       - Users
 *     parameters:
 *       - name: username
 *         description: Nome.
 *         in: formData
 *         required: true
 *         type: string
 *       - name: urlImage
 *         description: Url de uma imagen.
 *         in: formData
 *         required: true
 *         type: string
 *     responses:
 *       201:
 *         description: Created
 *       400:
 *         description: Bad Request
 */
userRouter.post('/join', registerBodyvalidator, userController.joinUser);

/**
 * @swagger
 * /users/left/{username}:
 *   post:
 *     summary: Remove o usuário do chat de conversas
 *     description: Rem,ove um  usuário da base de dados
 *     security:
 *       - UserAuth: []
 *     tags:
 *       - Users
 *     parameters:
 *       - name: username
 *         description: Nome.
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Deleted
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Not Found
 */
userRouter.post('/left/:username', authorized, userController.leftUser);

/**
 * @swagger
 * /users/channel/{alias}:
 *   get:
 *     summary: Retorna os usuários do canal
 *     description: Retorna todos os usuários ativos no canal
 *     security:
 *       - UserAuth: []
 *     tags:
 *       - Users
 *     parameters:
 *       - name: alias
 *         description: Nome.
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Created
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Not Found
 */
userRouter.get('/channel/:alias', authorized, userController.getUsersByChannel);

export default userRouter;
