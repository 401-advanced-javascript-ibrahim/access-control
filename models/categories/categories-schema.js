/* eslint-disable no-console */
/* eslint-disable no-undef */
/* eslint-disable new-cap */
/* eslint-disable camelcase */
/* eslint-disable strict */

'use strict';

const mongoose = require('mongoose');
require('../products/products-schema.js');

const categoriesSchema = mongoose.Schema({
  name: { type: String, required: true },
  display_name: { type: String, required: true },
  description: { type: String, required: true },
}, { toObject: { virtuals: true }, toJson: { virtuals: true } });

categoriesSchema.virtual('actualProducts', {
  ref: 'products',
  localField: 'name',
  foreignField: 'category',
  justOne: false,
});

categoriesSchema.pre('findOne', function () {
  try {
    this.populate('actualProducts');
  } catch (err) {
    console.error(err);
  }
});

module.exports = mongoose.model('categories', categoriesSchema);
