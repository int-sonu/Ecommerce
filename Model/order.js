import mongoose from "mongoose";
const orderSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
     items: [{
       product_name: {
        type: String,
        required: true,
        unique: true
    },
     quantity:{
        type:Number,
        required:true,
        default:1
        },

        price: {
        type: Number,
        required: true,
        min: 0
    },
    subtotal:{
        type:Number,
    },
    }],

    Total:{
         type:Number,

    },
    order_status:{
        type:String,
       enum: ['Ordered','shipped','delivered'],

    },

})
export const Order = mongoose.model("Order", orderSchema);
