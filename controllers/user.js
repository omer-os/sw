// controllers/user.js
const db = require("../firebase");
const admin = require("firebase-admin");
const { validateFirestoreId } = require("../validators/fireStoreValidator");
const { User } = require("../models/userModel");

// const { OAuth2Client } = require('google-auth-library');
// const client = new OAuth2Client(CLIENT_ID);
// const CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID'; // Replace with your actual Google Client ID

const { validationResult } = require("express-validator");
// const User = require("../models/userModel");

const registerUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error("Error:", errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, displayName, phoneNumber, roles = ["user"] } = req.body;

    const newUser = await User.create(email, displayName, phoneNumber, roles);
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Error registering user", error });
  }
};

const loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { email, password } = req.body;

    const userRecord = await admin.auth().getUserByEmail(email);

    if (!userRecord) {
      return res.status(404).json({ message: "User not found" });
    }

    const customToken = await admin.auth().createCustomToken(userRecord.uid);

    res.status(200).json({ token: customToken, user: userRecord });
  } catch (error) {
    res.status(500).json({ message: "Error logging in user", error });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const usersRef = db.collection("users");
    const snapshot = await usersRef.get();
    const users = [];

    snapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: "Error getting users", error });
  }
};

const getUser = async (req, res) => {
  try {
    if (!validateFirestoreId(req.params.id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    const userRef = db.collection("users").doc(req.params.id);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = { id: userDoc.id, ...userDoc.data() };
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Error logging in user", error });
  }
};

const createUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const newUser = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      createdAt: new Date().toISOString(),
    };

    const userRef = await db.collection("users").add(newUser);
    const userDoc = await userRef.get();
    const user = { id: userDoc.id, ...userDoc.data() };

    res.status(201).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Error creating new user", error });
  }
};

const updateUser = async (req, res) => {
  try {
    if (!validateFirestoreId(req.params.id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userRef = db.collection("users").doc(req.params.id);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: "User not found" });
    }

    const updatedUser = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    };

    await userRef.update(updatedUser);
    const updatedUserDoc = await userRef.get();
    const user = { id: updatedUserDoc.id, ...updatedUserDoc.data() };

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error });
  }
};

const deleteUser = async (req, res) => {
  try {
    if (!validateFirestoreId(req.params.id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    const userRef = db.collection("users").doc(req.params.id);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: "User not found" });
    }

    await userRef.delete();
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
};
const signInWithGoogle = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { idToken } = req.body;

  try {
    // Verify the Google ID token
    const ticket = await client.verifyIdToken({
      idToken,
      audience: CLIENT_ID,
    });
    const { email, name, picture } = ticket.getPayload();

    // Check if the user exists in the Firebase database
    const userRecord = await admin.auth().getUserByEmail(email);

    // If the user doesn't exist, create a new user in Firebase
    if (!userRecord) {
      const newUser = await admin.auth().createUser({
        email,
        displayName: name,
        photoURL: picture,
        emailVerified: true,
      });

      // Add any additional logic for creating a new user, e.g., storing user data in Firestore

    }

    // Generate a custom token for the user to sign in to your app with Firebase
    const customToken = await admin.auth().createCustomToken(userRecord.uid);

    res.status(200).json({ token: customToken, user: { email, name, picture } });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to sign in with Google' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
};
