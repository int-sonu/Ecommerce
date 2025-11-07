import multer from "multer";
import { Product } from "../Model/product.js";
import { Category } from "../Model/category.js";

export const addproduct = async (req, res) => {
  try {
    const { product_name, price, Category: categoryId, product_description, product_brand, stock } = req.body;
    const image = req.file ? req.file.filename : null;

    const categoryExists = await Category.findById(categoryId);
    if (!categoryExists) {
      return res.status(400).json({ message: "The selected category must exist." });
    }

    const existproduct = await Product.findOne({
      product_name: { $regex: `^${product_name.trim()}$`, $options: "i" },
      Category: categoryId
    });

    if (existproduct) {
      return res.status(400).json({ message: "This product already exists in this category" });
    }

    const newProduct = new Product({
      product_name: product_name.trim(),
      price,
      Category: categoryId,
      product_description: product_description.trim(),
      product_brand: product_brand.trim(),
      image,
      stock
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
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getallproduct = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const search = req.query.search || "";
    const skip = (page - 1) * limit;

    const query = {
      $or: [
        { product_name: { $regex: search, $options: "i" } },
        { product_brand: { $regex: search, $options: "i" } }
      ]
    };

    const totalProducts = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate("Category", "categoryname")
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      products,
      totalPages: Math.ceil(totalProducts / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error: error.message });
  }
};

export const updateproduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const { product_name, price, category, product_description, product_brand, stock } = req.body;
    const image = req.file ? req.file.filename : undefined;

    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ message: "The selected category must exist." });
    }

    const duplicate = await Product.findOne({
      product_name: { $regex: `^${product_name.trim()}$`, $options: "i" },
      Category: category,
      _id: { $ne: productId }
    });

    if (duplicate) {
      return res.status(400).json({ message: "Another product with this name already exists in this category" });
    }

    const updateData = {
      product_name: product_name.trim(),
      price,
      Category: category,
      product_description: product_description.trim(),
      product_brand: product_brand.trim(),
      stock
    };
    if (image) updateData.image = image;

    const updatedProduct = await Product.findByIdAndUpdate(productId, updateData, {
      new: true
    }).populate("Category", "categoryname");

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteproduct = async (req, res) => {
  try {
    const deleteProductId = req.params.id;
    const existingProduct = await Product.findById(deleteProductId);

    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    const categoryExists = await Category.findById(existingProduct.Category);
    if (!categoryExists) {
      return res.status(400).json({ message: "The selected category must exist before deletion." });
    }

    const deletedProduct = await Product.findByIdAndDelete(deleteProductId);

    res.status(200).json({
      message: "Product deleted successfully",
      product: deletedProduct
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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const search = req.query.search || "";
    const sortBy = req.query.sortBy || "newest"; 
    const skip = (page - 1) * limit;

    const categoryExists = await Category.findById(categoryId);
    if (!categoryExists) {
      return res.status(400).json({ message: "The selected category must exist." });
    }

    const query = { Category: categoryId };
    if (search) {
      query.$or = [
        { product_name: { $regex: search, $options: "i" } },
        { product_brand: { $regex: search, $options: "i" } }
      ];
    }

    let sortOption = {};
    if (sortBy === "priceAsc") sortOption = { price: 1 };
    else if (sortBy === "priceDesc") sortOption = { price: -1 };
    else if (sortBy === "nameAsc") sortOption = { product_name: 1 };
    else if (sortBy === "nameDesc") sortOption = { product_name: -1 };
    else sortOption = { createdAt: -1 }; 
    const totalProducts = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate("Category", "categoryname")
      .sort(sortOption) 
      .skip(skip)
      .limit(limit);

    if (!products || products.length === 0) {
      return res.status(404).json({ message: "No products found for this category" });
    }

    res.status(200).json({
      products,
      totalPages: Math.ceil(totalProducts / limit),
      currentPage: page,
      totalProducts
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching products by category", error: error.message });
  }
};
