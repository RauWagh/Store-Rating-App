// controllers/ratingController.js
const { Rating } = require('../models');

exports.submitRating = async (req, res) => {
  try {
    const { storeId, rating } = req.body;

    let userRating = await Rating.findOne({
      where: { userId: req.user.id, storeId },
    });

    if (userRating) {
      userRating.rating = rating;
      await userRating.save();
      return res.json({ message: 'Rating updated' });
    } else {
      await Rating.create({ userId: req.user.id, storeId, rating });
      return res.status(201).json({ message: 'Rating submitted' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
