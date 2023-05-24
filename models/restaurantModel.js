const { db } = require('../firebase');
const { validateRequired, validateString, validateEmail, validatePhone} = require('../validators/baseValidators');

const collection_name = "restaurants"
class Restaurant {
  constructor(id, ownerId, data) {
    this.id = id;
    this.ownerId = ownerId;
    this.name = data.name;
    this.address = data.address;
    this.city = data.city;
    this.country = data.country;
    this.zipCode = data.zipCode;
    this.phone = data.phone;
    this.email = data.email;
    this.website = data.website;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
    this.ratings = data.ratings || 0;
    this.operatingHours = data.operatingHours || {};
    this.socialMediaLinks = data.socialMediaLinks || {};
    this.features = data.features || [];
    this.tags = data.tags || [];
  }

  static async create(ownerId, data) {
    validateRequired('Owner ID', ownerId);
    validateString('Owner ID', ownerId);
    validateString('Name', data.name, 2, 50);
    validatePhone(data.phone);

    const ref = db.collection(collection_name).doc();
    const restaurant = new Restaurant(ref.id, ownerId, data);
    await ref.set(restaurant);
    return restaurant;
  }

  static async getById(id) {
    const snapshot = await db.collection(collection_name).doc(id).get();
    if (!snapshot.exists) {
      return null;
    }
    const data = snapshot.data();
    return new Restaurant(snapshot.id, data.ownerId, data);
  }


  async save() {
    try {
      this.updatedAt = new Date();
      await db.collection('restaurants').doc(this.id).set(this);
    } catch (error) {
      console.error('Error saving restaurant:', error);
      throw new Error('Error saving restaurant');
    }
  }
}

module.exports = Restaurant;
