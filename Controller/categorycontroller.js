import mongoose from "mongoose";
import { Category } from "../Model/category.js";
import { Product } from "../Model/product.js";

// Add new category
export const categories = async (req, res) => {
  try {
    const { categoryname, categorydescription } = req.body;

    if (!categoryname || !categorydescription) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existcategory = await Category.findOne({
      categoryname: { $regex: `^${categoryname.trim()}$`, $options: "i" }
    });
    if (existcategory) {
      return res.status(400).json({ message: "This category already exists" });
    }

    const newCategory = new Category({
      categoryname: categoryname.trim(),
      categorydescription: categorydescription.trim(),
    });

    await newCategory.save();
    res.status(201).json({ message: "Category added successfully", category: newCategory });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete category
export const deletecategories = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const products = await Product.find({ Category: categoryId });

    if (products.length > 0) {
      return res.status(400).json({ message: "Products exist under this category." });
    }

    const deletedCategory = await Category.findByIdAndDelete(categoryId);

    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({ message: "Category deleted successfully", category: deletedCategory });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all categories
export const getallcategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.status(200).json(categories);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update category with duplicate check
export const updatecategories = async (req, res) => {
  try {
    const { categoryname, categorydescription } = req.body;

    if (!categoryname || !categorydescription) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const duplicate = await Category.findOne({
      categoryname: { $regex: `^${categoryname.trim()}$`, $options: "i" },
      _id: { $ne: req.params.id },
    });

    if (duplicate) {
      return res.status(400).json({ message: "Another category with this name already exists" });
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      { categoryname: categoryname.trim(), categorydescription: categorydescription.trim() },
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({ message: "Category updated successfully", category: updatedCategory });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get category by id
export const getcategories = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Find all categories
export const findcategoryread = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.status(200).json(categories);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const findcategoryreadId = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json(category);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
