// controllers/storeController.js
const { Store, Rating, User } = require('../models');

exports.createStore = async (req, res) => {
  try {
    const { name, email, address, ownerId } = req.body;
    const store = await Store.create({ name, email, address, ownerId });
    res.status(201).json(store);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllStores = async (req, res) => {
  try {
    const stores = await Store.findAll({
      include: [
        {
          model: Rating,
          attributes: ['rating'],
        },
      ],
    });

    const formatted = stores.map((store) => {
      const ratings = store.Ratings.map((r) => r.rating);
      const avg = ratings.length
        ? ratings.reduce((a, b) => a + b) / ratings.length
        : 0;

      return {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        averageRating: avg.toFixed(2),
      };
    });

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getStoreRatingsByOwner = async (req, res) => {
  try {
    const store = await Store.findOne({
      where: { ownerId: req.user.id },
      include: [
        {
          model: Rating,
          include: [{ model: User, attributes: ['name', 'email'] }],
        },
      ],
    });

    if (!store) return res.status(404).json({ error: 'Store not found' });

    const averageRating =
      store.Ratings.reduce((sum, r) => sum + r.rating, 0) /
      (store.Ratings.length || 1);

    res.json({
      storeName: store.name,
      ratings: store.Ratings,
      averageRating: averageRating.toFixed(2),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
