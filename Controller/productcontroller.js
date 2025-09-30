import multer from "multer";
import { Product } from "../Model/product.js";

export const addproduct = async (req, res) => {
    try {
        const { product_name, price, Category, product_description, product_brand } = req.body;

        const image = req.file ? req.file.filename : null;
        const existproduct = await Product.findOne({ product_name });
        if (existproduct) {
            return res.status(400).json({ message: 'This product already exists' });
        }

        const newProduct = new Product({product_name,price,Category,product_description,product_brand,image})

        await newProduct.save();
        res.status(201).json({ message: "Product added successfully", product: newProduct });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getproductId = async (req, res) => {
    try {
        const productbyid = req.params.id
        const getallproductid = await Product.findById(productbyid)
        res.send(getallproductid)

    }

    catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export const getallproduct = async (req, res) => {
    try {
        const findallproduct = await Product.find()
        res.send(findallproduct)
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export const updateproduct = async (req, res) => {
    try {
        const findupdateproductId = req.params.id
        const updateData = req.body;

        const updatedproduct = await Product.findByIdAndUpdate(findupdateproductId, updateData, { new: true })
        res.send(updatedproduct)
        res.status(201).json({
            message: "Product Updated successfully",
            newUser
        });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}
export const deleteproduct = async (req, res) => {
    try {
        const deleteproductId = req.params.id
        const deletedproduct = await Product.findByIdAndDelete(deleteproductId)
        res.send(deletedproduct)
        res.status(201).json({
            message: "Product deleted successfully",
            newUser
        });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }

}


export const findproductread=async(req,res)=>{
    try{
        const findreadproduct = await Product.find()
        res.send(findreadproduct)
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }

}


export const findproductreadId=async(req,res)=>{
    try{
        const findreadproductId = await Product.findById(req.params.id)
        res.send(findreadproductId)
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }

}
