import { Router } from 'express';
import * as userController from './user.controller';
import { registerBodyvalidator } from './user.validator';
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
 *     responses:
 *       200:
 *         description: list of all
 */
userRouter.get('/', authorized, userController.getAllUsers);

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
 *     description: Insere um novo usuário no chat de conversas geral
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
userRouter.post('/join', registerBodyvalidator, userController.joinUserOnChat);

/**
 * @swagger
 * /users/left/{username}:
 *   delete:
 *     summary: Remove o usuário do chat de conversas
 *     description: Remove um usuário da base de dados
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
userRouter.delete('/left/:username', authorized, userController.leftUserOnChat);

/**
 * @swagger
 * /users/channel/{channelAlias}:
 *   get:
 *     summary: Retorna os usuários do canal
 *     description: Retorna todos os usuários ativos no canal pelo seu alias
 *     security:
 *       - UserAuth: []
 *     tags:
 *       - Users
 *     parameters:
 *       - name: channelAlias
 *         description: Nome do canal.
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
userRouter.get('/channel/:channelAlias', authorized, userController.getUsersByChannel);

export default userRouter;
