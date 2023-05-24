const { db } = require('../firebase');

const collection_name = "users";

class User {
  constructor(id, email, displayName, phoneNumber, createdAt, updatedAt, roles) {
    this.id = id;
    this.email = email;
    this.displayName = displayName;
    this.phoneNumber = phoneNumber;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
    this.roles = roles || [];
  }

  static async createWithPassword(email, password, displayName, phoneNumber, roles = []) {
    try {
      const userRecord = await admin.auth().createUser({
        email,
        password,
        displayName,
        phoneNumber,
      });
      
      const user = new User(userRecord.uid, email, displayName, phoneNumber, new Date(), new Date(), roles);
      await db.collection(collection_name).doc(userRecord.uid).set(user);
      return user;
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('Error creating user');
    }
  }

  static async authenticate(email, password) {
    try {
      const userRecord = await admin.auth().getUserByEmail(email);
      const idToken = await admin.auth().createCustomToken(userRecord.uid);
      return idToken;
    } catch (error) {
      console.error('Error authenticating user:', error);
      throw new Error('Error authenticating user');
    }
  }

  static async reauthenticate(id, password) {
    try {
      const userRecord = await admin.auth().getUser(id);
      const idToken = await admin.auth().createCustomToken(userRecord.uid);
      return idToken;
    } catch (error) {
      console.error('Error re-authenticating user:', error);
      throw new Error('Error re-authenticating user');
    }
  }

  static async getById(id) {
    try {
      const snapshot = await db.collection(collection_name).doc(id).get();
      if (!snapshot.exists) {
        return null;
      }
      const data = snapshot.data();
      return new User(id, data.email, data.displayName, data.phoneNumber, data.createdAt.toDate(), data.updatedAt.toDate(), data.roles);
    } catch (error) {
      console.error('Error getting user:', error);
      throw new Error('Error getting user');
    }
  }

  async save() {
    try {
      this.updatedAt = new Date();
      await db.collection(collection_name).doc(this.id).set(this);
    } catch (error) {
      console.error('Error saving user:', error);
      throw new Error('Error saving user');
    }
  }

  async isSubscribed() {
    // implement subscription validation logic here
    // for example, you might check a 'subscriptionEnd' field in the User document
  }


}

module.exports = User;
