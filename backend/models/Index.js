// models/index.js
const sequelize = require('../config/db');
const User = require('./User');
const Store = require('./Store');
const Rating = require('./Rating');

// Associations
User.hasMany(Rating);
Rating.belongsTo(User);

Store.hasMany(Rating);
Rating.belongsTo(Store);

Store.belongsTo(User, { as: 'owner', foreignKey: 'ownerId' });

module.exports = { sequelize, User, Store, Rating };
