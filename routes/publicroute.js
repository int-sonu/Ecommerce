import express from 'express'
import { adminlogin, checkAuth, checkAuthenticator, register, userlogin, userLogout } from '../Controller/usercontroller.js'
import { findproductread, findproductreadId } from '../Controller/productcontroller.js'
import { findcategoryread, findcategoryreadId } from '../Controller/categorycontroller.js'
const publicrouter = express.Router()
publicrouter.post('/register', register)
publicrouter.post('/login', userlogin)
publicrouter.post("/admin/login", adminlogin)
publicrouter.get('/products', findproductread)
publicrouter.get('/products/:id', findproductreadId)
publicrouter.get('/categories', findcategoryread)
publicrouter.get('/categories/:id', findcategoryreadId)
publicrouter.delete('/logout', userLogout);
publicrouter.get("/check-auth", checkAuth);
publicrouter.get("/checked-auth", checkAuthenticator);
export default publicrouter