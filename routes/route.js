import express from 'express';
import multer from "multer";
import { register, userlogin, adminlogin, getAllUsers, enabledisableuser, getAllUsersbyid, enableUser, userLogout } from '../Controller/usercontroller.js';
import {isAdmin } from '../middleware/auth.js';
import { categories, deletecategories, getcategories, getallcategories, updatecategories,findcategoryread,findcategoryreadId} from '../Controller/categorycontroller.js';
import { addproduct ,getproductId,getallproduct,deleteproduct,updateproduct,findproductread,findproductreadId} from "../Controller/productcontroller.js";
import { upload } from "../middleware/multer.js";
import { deleteOrderAdmin, getAllOrdersAdmin, updateOrderStatus } from '../Controller/ordercontroller.js';
// import {updateprofile } from '../Controller/usercontroller.js';
const router = express.Router()

router.post('/register', register)
router.post('/login', userlogin)
router.post("/admin/login", adminlogin)
router.get('/products',findproductread)
router.get('/products/:id',findproductreadId)
router.get('/categories',findcategoryread)
router.get('/categories/:id',findcategoryreadId)
router.delete('/logout', userLogout); 


router.use(isAdmin)

router.get("/admin/users", getAllUsers)
router.get("/admin/users/:id", getAllUsersbyid)
router.put("/getupdateuser/:id", enabledisableuser)
router.put("/admin/users/:id", enableUser);
router.post("/admin/categories", categories)
router.delete("/admin/categories/:id", deletecategories)
router.get("/admin/categories/:id", getcategories)
router.get("/admin/categories", getallcategories)
router.put("/admin/categories/:id", updatecategories)
router.post('/admin/products', upload.single('image'), addproduct)
router.get('/admin/products/:id', getproductId)
router.get('/admin/products', getallproduct)
router.delete('/admin/products/:id',deleteproduct)
router.put('/admin/products/:id',upload.single('image'), updateproduct)
router.get('/admin/order',getAllOrdersAdmin )
router.get('/admin/order',getAllOrdersAdmin )
router.put('/admin/order/:id',updateOrderStatus )
router.delete("/admin/orders/:id", deleteOrderAdmin);

export default router;

