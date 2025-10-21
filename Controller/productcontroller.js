import multer from "multer";
import { Product } from "../Model/product.js";

export const addproduct = async (req, res) => {
  try {
    const { product_name, price, Category, product_description, product_brand } = req.body;
    const image = req.file ? req.file.filename : null;

    const existproduct = await Product.findOne({ product_name });
    if (existproduct) {
      return res.status(400).json({ message: "This product already exists" });
    }

    const newProduct = new Product({
      product_name,
      price,
      Category,
      product_description,
      product_brand,
      image,
    });

    await newProduct.save();
    res.status(201).json({ message: "Product added successfully", product: newProduct });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getproductId = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId).populate("Category", "categoryname");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getallproduct = async (req, res) => {
  try {
    const products = await Product.find().populate("Category", "categoryname");
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Error fetching products" });
  }
};
export const updateproduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const { product_name, price, category, product_description, product_brand } = req.body; // lowercase
    const image = req.file ? req.file.filename : undefined;

    const updateData = { product_name, price, Category: category, product_description, product_brand };
    if (image) updateData.image = image;

    const updatedProduct = await Product.findByIdAndUpdate(productId, updateData, {
      new: true,
    }).populate("Category", "categoryname");

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteproduct = async (req, res) => {
  try {
    const deleteProductId = req.params.id;
    const deletedProduct = await Product.findByIdAndDelete(deleteProductId);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product deleted successfully",
      product: deletedProduct,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const findproductread = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const findproductreadId = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getProductsByCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const products = await Product.find({ Category: categoryId }).populate("Category", "categoryname");

    if (!products || products.length === 0) {
      return res.status(404).json({ message: "No products found for this category" });
    }

    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products by category:", error);
    res.status(500).json({ message: "Error fetching products by category", error });
  }
};
