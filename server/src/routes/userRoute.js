import express from 'express';
import userController from '../controllers/userController.js';
import { verifyToken, isAdmin } from '../middleware/middleware.js';

const router = express.Router();

router.get('/getAllUsers', verifyToken , userController.getAllUsers);
router.put('/updateRole/:userId',verifyToken,isAdmin, userController.updateUserRole);

export default router;