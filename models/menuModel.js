const { model, Schema } = require('firebase/firestore');

const menuSchema = new Schema({
  restaurantId: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  createdAt: { type: Date, default: new Date() },
  updatedAt: { type: Date, default: new Date() },
});

module.exports = model('Menu', menuSchema);
