const { model, Schema } = require('firebase/firestore');

const orderSchema = new Schema({
  userId: { type: String, required: true },
  restaurantId: { type: String, required: true },
  menuItems: [String],
  totalAmount: { type: Number, required: true },
  status: { type: String, required: true },
  createdAt: { type: Date, default: new Date() },
  updatedAt: { type: Date, default: new Date() },
});

module.exports = model('Order', orderSchema);
