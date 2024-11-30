import express from 'express';
import menuController from '../controllers/menuController.js';
import { upload } from '../config/multerConfig.js'; 
import { verifyToken,isAdmin } from '../middleware/middleware.js';

const router = express.Router();

router.post('/add-menu', verifyToken ,isAdmin ,upload.single('image') ,menuController.addMenuItem ) ;
router.get('/getItems',menuController.getAllItems) ;
router.get('/item/:id',menuController.getItemById) ; 
router.put('/edit/:id',verifyToken,isAdmin,upload.single('image'),menuController.editItemById) ;
router.delete('/delete/:id' ,verifyToken,isAdmin, menuController.deleteItemById) ;
router.get("/categories",menuController.getAllCategories)

export default router;