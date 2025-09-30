import express from "express"
import { isAuthenticated } from '../middleware/auth.js';
import { findproductread,findproductreadId} from "../Controller/productcontroller.js";
import { findcategoryread,findcategoryreadId } from '../Controller/categorycontroller.js';
import { updateProfileById, userLogout } from '../Controller/usercontroller.js';

// import {updateprofile } from '../Controller/usercontroller.js';
import { addcart ,findcart,deletecart,updateCartQuantity} from '../Controller/cartcontroller.js';
import { createOrderFromCart, getAllOrders, getOrderById } from "../Controller/ordercontroller.js";

const route=express.Router()

route.delete('/logout', userLogout); 


route.use(isAuthenticated);

route.put('update/:id', updateProfileById);

route.get('/products/:id',findproductreadId)
route.get('/products',findproductread)

route.get('/categories',findcategoryread)
route.get('/categories/:id',findcategoryreadId)

route.post('/cart',addcart)
route.put('/cart/:productId',updateCartQuantity)
route.delete('/cart/:productId',deletecart)

route.get('/cart/:userId',findcart)
route.post("/order/create", createOrderFromCart);
route.get('/order',getAllOrders)
route.get('/order/:id',getOrderById)


// route.put('/updateuser/:id', updateprofile);


export default route;
