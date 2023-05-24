const { model, Schema } = require('firebase/firestore');

const menuItemSchema = new Schema({
  menuId: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  imageUrl: { type: String, required: true },
  createdAt: { type: Date, default: new Date() },
  updatedAt: { type: Date, default: new Date() },
  tags: [String],
});

module.exports = model('MenuItem', menuItemSchema);
