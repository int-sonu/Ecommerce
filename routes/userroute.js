import express from "express"
import { isAuthenticated } from '../middleware/auth.js';
import { findproductread,findproductreadId, getProductsByCategory } from "../Controller/productcontroller.js";
import { findcategoryread,findcategoryreadId } from '../Controller/categorycontroller.js';
import { updateProfileById, userLogout } from '../Controller/usercontroller.js';

// import {updateprofile } from '../Controller/usercontroller.js';
import { addcart ,findcart,deletecart,updateCartQuantity} from '../Controller/cartcontroller.js';
import { cancelOrder, createOrderFromCart, getAllOrders, getOrderById } from "../Controller/ordercontroller.js";

const route=express.Router()

route.delete('/logout', userLogout); 


route.use(isAuthenticated);

route.put('update/:id', updateProfileById);

route.get('/products/:id',findproductreadId)
route.get('/products',findproductread)

route.get('/categories',findcategoryread)
route.get('/categories/:id',findcategoryreadId)
route.get("/products/categories/:id", getProductsByCategory);

route.post('/cart/:id',isAuthenticated,addcart)
route.put('/cart/:productId',isAuthenticated,updateCartQuantity)
route.delete('/cart/:productId',isAuthenticated,deletecart)

route.get('/cart/:userId',isAuthenticated,findcart)
route.post("/order/create", isAuthenticated,createOrderFromCart);
route.get('/order',getAllOrders)
route.get('/order/:id',getOrderById)
route.get("/categories/:id/products", getProductsByCategory);
route.put("/order/cancel/:id", cancelOrder); 


// route.put('/updateuser/:id', updateprofile);


export default route;
