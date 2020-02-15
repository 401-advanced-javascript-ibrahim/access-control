/* eslint-disable comma-dangle */
/* eslint-disable no-console */
/* eslint-disable camelcase */
/* eslint-disable no-undef */
/* eslint-disable new-cap */
/* eslint-disable strict */

'use strict';

class Model_CRUD {

  /**
         * Model constructor
         * @param {object} schema
         */
  constructor(schema) {
    this.schema = schema;
  }

  /**
         * read one or more records
         * @param {string} id
         * @returns {Array}
         */
  get(_id) {
    if (_id) {
      return this.schema.find({ _id });
    } else {
      return this.schema.find({});
    }
  }

  /**
         * save a record to the data base
         * @param {object} obj
         * @returns {object}
         */
  create(obj) {
    let newObject = new this.schema(obj);
    return newObject.save();
  }

  /**
         * update a record based on its id
         * @param {string} _id
         * @param {object} updatedObj
         * @returns {object}
         */
  update(_id, updatedObj) {
    console.log('mongo', updatedObj);
    return this.schema.findByIdAndUpdate(_id, updatedObj, { new: true });
  }

  /**
         *
         * @param {string} id
         * @returns {object}
         */
  delete(id) {
    return this.schema.findByIdAndDelete(id);
  }
}

module.exports = Model_CRUD;