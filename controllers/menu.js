// controllers/menu.js
const { db } = require('../firebase');
const { validationResult } = require('express-validator');
const { validateFirestoreId } = require('../validators/fireStoreValidator');
const { Menu } = require('../models/menuModel');


const createMenu = async (req, res) => {
  try {
    const menuData = {
      restaurantId: req.params.restaurantId,
      ...req.body,
    };

    // Validate the data using the model schema
    const newMenu = new Menu(menuData);

    // Save the data to Firestore
    const docRef = await db.collection('menus').add(newMenu);

    // Return the created document
    res.status(201).json({ message: 'Menu created successfully', id: docRef.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMenus = async (req, res) => {
  try {
    const menusSnapshot = await db
      .collection('menus')
      .where('restaurantId', '==', req.params.restaurantId)
      .get();
    const menus = [];

    menusSnapshot.forEach((doc) => {
      const menu = new Menu(doc.data());
      menu.id = doc.id;
      menus.push(menu);
    });

    res.status(200).json({ menus });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMenu = async (req, res) => {
  try {
    const menuSnapshot = await db.collection('menus').doc(req.params.menuId).get();

    if (!menuSnapshot.exists) {
      res.status(404).json({ message: 'Menu not found' });
      return;
    }

    const menu = new Menu(menuSnapshot.data());
    menu.id = menuSnapshot.id;

    res.status(200).json({ menu });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


module.exports = {
  getMenu,
  createMenu
};
