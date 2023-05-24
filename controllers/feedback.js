// controllers/feedback.js
const { db } = require('../firebase');
const { validationResult } = require('express-validator');
const { validateFirestoreId } = require('../validators/fireStoreValidator');

exports.getFeedbacks = async (req, res) => {
  const feedbacksRef = db.collection('feedbacks');
  const snapshot = await feedbacksRef.get();
  const feedbacks = [];

  snapshot.forEach((doc) => {
    feedbacks.push({ id: doc.id, ...doc.data() });
  });

  res.status(200).json({ feedbacks });
};

exports.getFeedback = async (req, res) => {
  if (!validateFirestoreId(req.params.id)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }

  const feedbackRef = db.collection('feedbacks').doc(req.params.id);
  const feedbackDoc = await feedbackRef.get();

  if (!feedbackDoc.exists) {
    return res.status(404).json({ error: 'Feedback not found' });
  }

  const feedback = { id: feedbackDoc.id, ...feedbackDoc.data() };
  res.status(200).json({ feedback });
};

exports.createFeedback = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const newFeedback = {
    userId: req.body.userId,
    restaurantId: req.body.restaurantId,
    content: req.body.content,
    rating: req.body.rating,
    createdAt: new Date().toISOString(),
  };

  const feedbackRef = await db.collection('feedbacks').add(newFeedback);
  const feedbackDoc = await feedbackRef.get();
  const feedback = { id: feedbackDoc.id, ...feedbackDoc.data() };

  res.status(201).json({ feedback });
};

exports.updateFeedback = async (req, res) => {
  if (!validateFirestoreId(req.params.id)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const feedbackRef = db.collection('feedbacks').doc(req.params.id);
  const feedbackDoc = await feedbackRef.get();

  if (!feedbackDoc.exists) {
    return res.status(404).json({ error: 'Feedback not found' });
  }

  const updatedFeedback = {
    content: req.body.content,
    rating: req.body.rating,
  };

  await feedbackRef.update(updatedFeedback);
  const updatedFeedbackDoc = await feedbackRef.get();
  const feedback = { id: updatedFeedbackDoc.id, ...updatedFeedbackDoc.data() };

  res.status(200).json({ feedback });
};

exports.deleteFeedback = async (req, res) => {
  if (!validateFirestoreId(req.params.id)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }

  const feedbackRef = db.collection('feedbacks').doc(req.params.id);
  const feedbackDoc = await feedbackRef.get();

  if (!feedbackDoc.exists) {
    return res.status(404).json({ error: 'Feedback not found' });
  }

  await feedbackRef.delete();
  res.status(200).json({ message: 'Feedback deleted successfully' });
};
