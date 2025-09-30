import mongoose from "mongoose";
import { Cart } from "../Model/cart.js";
import { Order } from "../Model/order.js";
import { Product } from "../Model/product.js";
export const createOrderFromCart = async (req, res) => {
    try {
        const userId = req.session.user._id;
        if (!userId) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        const cart = await Cart.findOne({ user: userId }).populate("items.Product");
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }
        let totalAmount = 0;

        const orderItems = cart.items.map(item => {
            const subtotal = item.quantity * item.Product.price;
            totalAmount += subtotal;
            return {
                product_name: item.Product.product_name,
                quantity: item.quantity,
                price: item.Product.price,
                subtotal: subtotal
            };
        });
        const newOrder = new Order({
            user: userId,
            items: orderItems,
            Total: totalAmount,
            order_status: "Ordered"
        });

        await newOrder.save();

        await Cart.updateOne(
            { user: userId }, { $set: { items: [] } }
        );

        res.status(201).json({ message: "Order created successfully", order: newOrder });

    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ error: error.message });
    }
};



export const getAllOrders = async (req, res) => {
  try {
    const userId = req.session.user._id;
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const orders = await Order.find({ user: userId });
    res.send(orders);

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


export const getOrderById = async (req, res) => {
  try {
    const userId = req.session.user?._id;
    const orderId = req.params.id; 

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const order = await Order.findOne({ _id: orderId, user: userId });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order);

  } catch (error) {
    console.error("Error fetching order by ID:", error);
    res.status(400).json({ error: error.message });
  }
};



//admin
export const getAllOrdersAdmin = async (req, res) => {
  try {
    const user = req.session.Admin;
    if (user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const orders = await Order.find() .populate("user", "username email") 
    res.status(200).json({ orders });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;     
    const { status } = req.body;

    const admin = req.session.Admin;
    if (!admin || admin.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { order_status: status },
      { new: true }   
    ).populate("user", "username email");

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({
      message: "Order status updated successfully",
      order: updatedOrder,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const deleteOrderAdmin = async (req, res) => {
  try {
    const admin = req.session.Admin;
    const { id } = req.params; 
    if (!admin || admin.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    if (order.order_status === "delivered") {
      return res.status(400).json({ message: "Delivered orders cannot be deleted" });
    }
    await Order.findByIdAndDelete(id);

    res.status(200).json({ message: "Order deleted successfully by admin" });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ error: error.message });
  }
};


