import { Aggregate } from 'mongoose';
import { Cart } from '../Model/cart.js';
import { Product } from '../Model/product.js';
import mongoose from 'mongoose';

export const addcart = async (req, res) => {
  try {
    const user = req.session?.user;
    const { productId, quantity } = req.body;

    const existingProduct = await Product.findById(productId);
    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    let userCart = await Cart.findOne({ user: user._id });

    if (userCart) {
      const itemExists = await Cart.findOne({
        user: user._id,
        "items.Product": productId
      });

      if (itemExists) {
        await Cart.updateOne(
          { user: user._id, "items.Product": productId },
          { $inc: { "items.$.quantity": quantity } }
        );

        userCart = await Cart.findOne({ user: user._id });

        return res.status(200).json({
          message: "Cart updated successfully",
          cart: userCart
        });
      } else {
        await Cart.updateOne(
          { user: user._id },
          { $push: { items: { Product: productId, quantity } } }
        );
        userCart = await Cart.findOne({ user: user._id });

        return res.status(200).json({
          message: "Product added into cart successfully",
          cart: userCart
        });
      }

    } else {
      const newCart = new Cart({
        user: user._id,
        items: [{ Product: productId, quantity }]
      });

      await newCart.save();

      return res.status(200).json({
        message: "Product added into cart successfully",
        cart: newCart
      });
    }

  } catch (error) {
    console.error("Cart error:", error);
    res.status(400).json({ error: error.message });
  }
};

export const updateCartQuantity = async (req, res) => {
  try {
    const user = req.session.user;
    const { productId } = req.params;
    const { quantity } = req.body;

    const existingProduct = await Product.findById(productId);
    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    const updatedCart = await Cart.findOneAndUpdate(
      { user: user._id, "items.Product": productId },
      { $set: { "items.$.quantity": quantity } },
      { new: true }
    );

    if (!updatedCart) {
      return res.status(404).json({ message: "Product not found in cart " });
    }

    return res.status(200).json({
      message: "Cart updated successfully", cart: updatedCart
    });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};



export const deletecart = async (req, res) => {
  try {
    const user = req.session.user;
    const { productId } = req.params;

    const existingProduct = await Product.findById(productId);
    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    const updatedCart = await Cart.findOneAndUpdate(
      { user: user._id },
      { $pull: { items: { Product: productId } } },
      { new: true }
    );

    if (!updatedCart) {
      return res.status(404).json({ message: " cart does not exist" });
    }

    return res.status(200).json({
      message: "product deleted successfully", cart: updatedCart
    });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


export const findcart = async (req, res) => {
  try {
    const userId = req.session.user._id;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const cartData = await Cart.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
        },
      },
      { $unwind: "$items" },
      {
        $lookup: {
          from: "products",
          localField: "items.Product",
          foreignField: "_id",
          as: "productdetails",
        },
      },
      { $unwind: "$productdetails" },
      {
        $addFields: {
          "items.product_name": "$productdetails.product_name",
          "items.price": "$productdetails.price",
          "items.subtotal": {
            $multiply: ["$items.quantity", "$productdetails.price"],
          },
        },
      },
      {
        $group: {
          _id: "$_id",
          user: { $first: "$user" },
          items: { $push: "$items" },
          total: { $sum: "$items.subtotal" },
        },
      },
    ]);

    if (cartData.length === 0) {
      return res.status(404).json({ message: "Cart is empty" });
    }

    res.status(200).json(cartData);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
