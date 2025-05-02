import express from 'express';
import { SignUp, SignIn, UpdateUser, DeleteUser, GetUser } from '../controllers/UserController';

const router = express.Router();

router.post('/signup', SignUp as express.RequestHandler);
router.post('/signin', SignIn as express.RequestHandler);
router.put('/update', UpdateUser);
router.delete('/delete/:username', DeleteUser);
router.get('/get/:username', GetUser);

export default router;

