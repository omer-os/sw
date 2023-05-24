// controllers/restaurant.js
const { db } = require('../firebase');
const { validateFirestoreId } = require('../validators/fireStoreValidator');
const { validationResult } = require('express-validator');
const { Restaurant } = require('../models/restaurantModel');

const createRestaurant = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error('Error:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }
  
    const ownerId = 1;
    const data = req.body;
    const restaurant = await Restaurant.create(ownerId, data);

  
    res.status(201).json(restaurant);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Error creating restaurant', error });
  }
};

const getRestaurant = async (req, res) => {
  try {
    const id = req.params.restaurantId;
    const restaurant = await Restaurant.getById(id);

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    res.status(200).json(restaurant);
  } catch (error) {
    console.error('Error getting restaurant:', error);
    res.status(500).json({ message: 'Error getting restaurant', error });
  }
};


const getAllRestaurants = async (req, res) => {
    try {
      const restaurantsRef = db.collection('restaurants');
      const snapshot = await restaurantsRef.get();
      const restaurants = [];
    
      snapshot.forEach((doc) => {
        const restaurant = new Restaurant(doc.data());
        restaurant.id = doc.id;
        restaurants.push(restaurant);
      });
    
      res.status(200).json({ restaurants });
      } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Error fetching restaurants'});
    }
  };
        
  const updateRestaurant = async (req, res) => {
    try {
      if (!validateFirestoreId(req.params.id)) {
        return res.status(400).json({ error: 'Invalid ID format' });
      }
    
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
    
      const restaurantRef = db.collection('restaurants').doc(req.params.id);
      const restaurantDoc = await restaurantRef.get();
    
      if (!restaurantDoc.exists) {
        return res.status(404).json({ error: 'Restaurant not found' });
      }
    
      const updatedRestaurant = {
        name: req.body.name,
        address: req.body.address,
        phone: req.body.phone,
      };
    
      await restaurantRef.update(updatedRestaurant);
      const updatedRestaurantDoc = await restaurantRef.get();
      const restaurant = { id: updatedRestaurantDoc.id, ...updatedRestaurantDoc.data() };
    
      res.status(200).json({ restaurant });
    
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Error updating restaurant'});
    }
  };
  
  const deleteRestaurant = async (req, res) => {
    try {
      if (!validateFirestoreId(req.params.id)) {
        return res.status(400).json({ error: 'Invalid ID format' });
      }
    
      const restaurantRef = db.collection('restaurants').doc(req.params.id);
      const restaurantDoc = await restaurantRef.get();
    
      if (!restaurantDoc.exists) {
        return res.status(404).json({ error: 'Restaurant not found' });
      }
    
      await restaurantRef.delete();
      res.status(200).json({ message: 'Restaurant deleted successfully' });
      } catch (error) {
      res.status(500).json({ message: 'Error deleting restaurant', error });
    }
  };
  
  module.exports = {
    createRestaurant,
    getAllRestaurants,
    updateRestaurant,
    deleteRestaurant,
    getRestaurant
  };
