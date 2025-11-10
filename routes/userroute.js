import express from "express";
import { isAuthenticated } from "../middleware/usermiddleware.js";
import { findproductread, findproductreadId, getProductsByCategory } from "../Controller/productcontroller.js";
import { findcategoryread, findcategoryreadId } from "../Controller/categorycontroller.js";
import { getAllUsers, getAllUsersbyid, register,  updateProfile,  userlogin, userLogout } from "../Controller/usercontroller.js";
import { addcart, findcart, deletecart, updateCartQuantity } from "../Controller/cartcontroller.js";
import { cancelOrder, createOrderFromCart, getAllOrders, getOrderById, removeOrder } from "../Controller/ordercontroller.js";
import { upload } from "../middleware/multer.js";

const route = express.Router();

// Logout route
route.delete("/logout", userLogout);

route.post('/login', userlogin)
route.use(isAuthenticated);

route.get("/users/:id", getAllUsersbyid);
route.get("/users", getAllUsers);
route.put("/profile",  updateProfile);

route.post('/register', register)
// Product routes
route.get("/products/:id", findproductreadId);
route.get("/products", findproductread);
route.get("/products/category/:id", getProductsByCategory);

// Category routes
route.get("/categories", findcategoryread);
route.get("/categories/:id", findcategoryreadId);
route.get("/categories/:id/products", getProductsByCategory);

// Cart routes
route.post("/cart/:id", addcart);
route.put("/cart/:productId", updateCartQuantity);
route.delete("/cart/:productId", deletecart);
route.get("/cart/:userId", findcart);

// Order routes
route.post("/order/create", createOrderFromCart);
route.get("/order", getAllOrders);
route.get("/order/:id", getOrderById);
route.put("/order/cancel/:id", cancelOrder);
route.delete("order/remove/:id", removeOrder);

export default route;
