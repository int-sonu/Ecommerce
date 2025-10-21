    import mongoose from "mongoose";
    import { Category } from '../Model/category.js';

    const productSchema = new mongoose.Schema({

        product_name: {
            type: String,
            required: true,
            unique: true
        },
        price: {
            type: Number,
            required: true,
            min: 0
        },
        image: {
            type: String,

        },
        Category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true
        },
        product_description: {
            type: String,
            required: true
        },
        product_brand: {
            type: String,
            required: true
        },
        created_at: {
            type: Date,
            default: Date.now
        }
    })
    export const Product = mongoose.model("Product", productSchema);
