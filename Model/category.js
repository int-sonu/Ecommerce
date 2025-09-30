import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({

    categoryname: {
        type: String,
        required: true,
        trim: true
    },
    categorydescription: {
        type: String,
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    }


})
export const Category = mongoose.model("Category", categorySchema);
