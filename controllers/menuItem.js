// controllers/menuItem.js
const { db } = require('../firebase');
const { validationResult } = require('express-validator');
const { validateFirestoreId } = require('../validators/fireStoreValidator');

const createMenuItem = async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
    
      const newMenuItem = {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        restaurantId: req.body.restaurantId,
        createdAt: new Date().toISOString(),
      };
    
      const menuItemRef = await db.collection('menuItems').add(newMenuItem);
      const menuItemDoc = await menuItemRef.get();
      const menuItem = { id: menuItemDoc.id, ...menuItemDoc.data() };
    
      res.status(201).json({ menuItem });
      } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Error creating menu item', error });
    }
  };
  
  const getAllMenuItems = async (req, res) => {
    try {
      const menuItemsRef = db.collection('menuItems');
      const snapshot = await menuItemsRef.get();
      const menuItems = [];
    
      snapshot.forEach((doc) => {
        menuItems.push({ id: doc.id, ...doc.data() });
      });
    
      res.status(200).json({ menuItems });
      } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Error getting menu item', error });
    }
  };
  
  const getMenuItem = async (req, res) => {
    try {
      if (!validateFirestoreId(req.params.id)) {
        return res.status(400).json({ error: 'Invalid ID format' });
      }
    
      const menuItemRef = db.collection('menuItems').doc(req.params.id);
      const menuItemDoc = await menuItemRef.get();
    
      if (!menuItemDoc.exists) {
        return res.status(404).json({ error: 'Menu item not found' });
      }
    
      const menuItem = { id: menuItemDoc.id, ...menuItemDoc.data() };
      res.status(200).json({ menuItem });
    
      } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Error getting menu item', error });
    }
  };
  
  
  const updateMenuItem = async (req, res) => {
    try {
      if (!validateFirestoreId(req.params.id)) {
        return res.status(400).json({ error: 'Invalid ID format' });
      }
    
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
    
      const menuItemRef = db.collection('menuItems').doc(req.params.id);
      const menuItemDoc = await menuItemRef.get();
    
      if (!menuItemDoc.exists) {
        return res.status(404).json({ error: 'Menu item not found' });
      }
    
      const updatedMenuItem = {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
      };
    
      await menuItemRef.update(updatedMenuItem);
      const updatedMenuItemDoc = await menuItemRef.get();
      const menuItem = { id: updatedMenuItemDoc.id, ...updatedMenuItemDoc.data() };
    
      res.status(200).json({ menuItem });
      } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Error updating menu item', error });
    }
  };
  
  const deleteMenuItem = async (req, res) => {
    try {
      if (!validateFirestoreId(req.params.id)) {
        return res.status(400).json({ error: 'Invalid ID format' });
      }
    
      const menuItemRef = db.collection('menuItems').doc(req.params.id);
      const menuItemDoc = await menuItemRef.get();
    
      if (!menuItemDoc.exists) {
        return res.status(404).json({ error: 'Menu item not found' });
      }
    
      await menuItemRef.delete();
      res.status(200).json({ message: 'Menu item deleted successfully' });
      } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Error deleting menu item', error });
    }
  };
  
  module.exports = {
    createMenuItem,
    updateMenuItem,
    deleteMenuItem,
    getMenuItem,
    getAllMenuItems
  };
  