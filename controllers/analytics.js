// controllers/analytics.js
const { db } = require('../firebase');
const { validateFirestoreId } = require('../validators/fireStoreValidator');
const { validationResult } = require('express-validator');

const getAllAnalytics = async (req, res) => {
  try {
    const analyticsRef = db.collection('analytics');
    const snapshot = await analyticsRef.get();
    const analytics = [];
  
    snapshot.forEach((doc) => {
      analytics.push({ id: doc.id, ...doc.data() });
    });
  
    res.status(200).json({ analytics });
    } catch (error) {
    console.error("Error getAllAnalytics: ", error);
    res.status(500).json({ message: 'Error fetching analytics data'});
  }
};

const getAnalytic = async (req, res) => {
  try {
    if (!validateFirestoreId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }
  
    const analyticRef = db.collection('analytics').doc(req.params.id);
    const analyticDoc = await analyticRef.get();
  
    if (!analyticDoc.exists) {
      return res.status(404).json({ error: 'Analytic not found' });
    }
  
    const analytic = { id: analyticDoc.id, ...analyticDoc.data() };
    res.status(200).json({ analytic });
    } catch (error) {
    console.error("Error getAnalytic: ", error);
    res.status(500).json({ message: 'Error fetching analytic data' });
  }
};

const createAnalytic = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    const newAnalytic = {
      restaurantId: req.body.restaurantId,
      date: req.body.date,
      views: req.body.views,
      createdAt: new Date().toISOString(),
    };
  
    const analyticRef = await db.collection('analytics').add(newAnalytic);
    const analyticDoc = await analyticRef.get();
    const analytic = { id: analyticDoc.id, ...analyticDoc.data() };
  
    res.status(201).json({ analytic });
  
  } catch {
    console.error("Error createAnalytic: ", error);
    res.status(500).json({ message: 'Error creating analytic data'});
  }

};






module.exports = {
  getAllAnalytics,
  getAnalytic,
  createAnalytic
};
