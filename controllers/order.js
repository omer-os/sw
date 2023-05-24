// controllers/order.js
const { db } = require('../firebase');
const { validateFirestoreId } = require('../validators/fireStoreValidator');
const { validationResult } = require('express-validator');


const getAllOrders = async (req, res) => {
    try {

      const ordersRef = db.collection('orders');
      const snapshot = await ordersRef.get();
      const orders = [];
    
      snapshot.forEach((doc) => {
        orders.push({ id: doc.id, ...doc.data() });
      });
    
      res.status(200).json({ orders });

      } catch (error) {
      res.status(500).json({ message: 'Error fetching orders', error });
    }
  };

const getOrder = async (req, res) => {
  try {

    if (!validateFirestoreId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }
  
    const orderRef = db.collection('orders').doc(req.params.id);
    const orderDoc = await orderRef.get();
  
    if (!orderDoc.exists) {
      return res.status(404).json({ error: 'Order not found' });
    }
  
    const order = { id: orderDoc.id, ...orderDoc.data() };
    res.status(200).json({ order });

    
  } catch {
    res.status(500).json({ message: 'Error fetching the order', error });

  }
}

  
const placeOrder = async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
    
      const newOrder = {
        userId: req.body.userId,
        restaurantId: req.body.restaurantId,
        menuItems: req.body.menuItems,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
    
      const orderRef = await db.collection('orders').add(newOrder);
      const orderDoc = await orderRef.get();
      const order = { id: orderDoc.id, ...orderDoc.data() };
    
      res.status(201).json({ order });
      } catch (error) {
      res.status(500).json({ message: 'Error placing order', error });
    }
  };

const updateOrder  = async (req, res) => {
  try {
    if (!validateFirestoreId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }
  
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    const orderRef = db.collection('orders').doc(req.params.id);
    const orderDoc = await orderRef.get();
  
    if (!orderDoc.exists) {
      return res.status(404).json({ error: 'Order not found' });
    }
  
    const updatedOrder = {
      status: req.body.status,
    };
  
    await orderRef.update(updatedOrder);
    const updatedOrderDoc = await orderRef.get();
    const order = { id: updatedOrderDoc.id, ...updatedOrderDoc.data() };
  
    res.status(200).json({ order });
  
  } catch (error) {
    res.status(500).json({ message: 'Error updating order', error });
  }
};
  
const deleteOrder = async (req, res) => {
    try {
      if (!validateFirestoreId(req.params.id)) {
        return res.status(400).json({ error: 'Invalid ID format' });
      }
    
      const orderRef = db.collection('orders').doc(req.params.id);
      const orderDoc = await orderRef.get();
    
      if (!orderDoc.exists) {
        return res.status(404).json({ error: 'Order not found' });
      }
    
      await orderRef.delete();
      res.status(200).json({ message: 'Order deleted successfully' });
      } catch (error) {
      res.status(500).json({ message: 'Error deleting order', error });
    }
  };
  
  module.exports = {
    placeOrder,
    getAllOrders,
    getOrder,
    updateOrder ,
    deleteOrder,
  };
   

