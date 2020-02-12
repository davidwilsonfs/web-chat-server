import { Router } from 'express';
import { authorized, refreshToken } from '../security/auth-strategy.security';

const authRouter = Router();

/**
 * @swagger
 *
 * /auth/refreshToken:
 *   post:
 *     summary: Auth
 *     description: Refreseh token
 *     security:
 *       - UserAuth: []
 *     tags:
 *       - Auth
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Client authorized
 *       401:
 *         description: Unauthorized
 */
authRouter.post('/refreshToken', authorized, refreshToken);

export default authRouter;
