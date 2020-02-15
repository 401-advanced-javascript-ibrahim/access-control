/* eslint-disable no-undef */
/* eslint-disable strict */

'use strict';

const schema = require('./products-schema.js');
const Model = require('../mongo.js');

class Products extends Model { }

module.exports = new Products(schema);