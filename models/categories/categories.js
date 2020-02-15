/* eslint-disable no-undef */
/* eslint-disable strict */
'use strict';

const schema = require('./categories-schema.js');
const Model = require('../mongo.js');

class Categories extends Model { }

module.exports = new Categories(schema);