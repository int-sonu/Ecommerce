
import { Category } from '../Model/category.js';

export const categories = async (req, res) => {
    try {
        const { categoryname, categorydescription } = req.body
        const existcategory = await Category.findOne({ categoryname })
        if (existcategory) {
            return res.status(404).json({ message: 'This category is already exist' })
        }
        const newCategory = new Category({ categoryname, categorydescription });
        await newCategory.save();


        res.status(201).json({
            message: "Category added successfully",
            newCategory
        });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}
export const deletecategories = async (req, res) => {
    try {
        const categoriesId = req.params.id;
        const deletedCategory = await Category.findByIdAndDelete(categoriesId);
        res.send(deletedCategory)
        res.status(201).json({
            message: "Category deleted successfully",
            deletedCategory
        });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export const getcategories = async (req, res) => {
    try {
        const getcategoryid = req.params.id;
        const getallcategoryId = await Category.findById(getcategoryid).populate("products");
        res.send(getallcategoryId)
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export const getallcategories = async (req, res) => {
    try {
        const getallcategory = await Category.find()
        res.send(getallcategory)
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export const updatecategories = async (req, res) => {
    try {
        const updatecategoriesId = req.params.id
        const updateData = req.body;
        const updatedCategory = await Category.findByIdAndUpdate(updatecategoriesId, updateData, { new: true })
        res.send(updatedCategory)
        if (!updatedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export const findcategoryread=async(req,res)=>{
    try{
        const findreadcatgory=await Category.find()
        res.send(findreadcatgory)
    }
     catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export const findcategoryreadId=async(req,res)=>{
    try{
        const findreadcatgoryId=await Category.findById(req.params.id)
        res.send(findreadcatgoryId)

    }
    catch(error){
                res.status(400).json({ error: error.message });
    }
}
