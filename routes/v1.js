/* eslint-disable new-cap */
/* eslint-disable no-unused-vars */
/* eslint-disable strict */

'use strict';

const express = require('express');
const router = express.Router();

const User = require('../auth/user.js');
const authMiddleware = require('../auth/auth-middleware.js');
const oauthMiddleware = require('../auth/oauth/outh-middleware.js');
const bearerMiddleware = require('../auth/bearer/bearer-middleware.js');
const acl = require('../auth/acl/acl-middleware.js');
const categories = require('../models/categories/categories.js');
const products = require('../models/products/products.js');


/**
 * returns the route you trying to hit
 * @param {object} req
 * @param {object} res
 * @param {*} next
 * @returns {Function}
 */
function getModel(req, res, next) {
  let model = req.params.model;

  switch (model) {
  case 'categories':
    req.model = categories;
    next();
    return;
  case 'products':
    req.model = products;
    next();
    return;
  default:
    next('invalid');
    return;
  }
}


router.param('model', getModel);

router.post('/signup', signup);
router.post('/signin', authMiddleware, signin);
router.get('/userList', getUser);
router.get('/oauth', oauthMiddleware, oauth);
router.get('/user', bearerMiddleware, bearer);
router.get('/public', getUser);
router.get('/private', authMiddleware, signin);
router.get('/readonly', bearerMiddleware, acl('read'), aclOk);
router.get('/create', bearerMiddleware, acl('create'), aclOk);
router.get('/update', bearerMiddleware, acl('update'), aclOk);
router.get('/delete', bearerMiddleware, acl('delete'), aclOk);
router.get('/everything', bearerMiddleware, acl('read, create, update, delete'), aclOk);

router.get('/api/v1/:model', bearerMiddleware, acl('read'), getAllModel);
router.get('/api/v1/:model/:id', bearerMiddleware, acl('read'), getOneModel);
router.post('/api/v1/:model', bearerMiddleware, acl('create'), createModel);
router.put('/api/v1/:model/:id', bearerMiddleware, acl('update'), updateModel);
router.delete('/api/v1/:model/:id', bearerMiddleware, acl('delete'), deleteModel);

/**
 * The REST version of get method
 */
function getAllModel(req, res, next) {
  req.model.get()
    .then(results => {
      let count = results.length;
      res.json({ count, results });
    })
    .catch(next);
}

function getOneModel(req, res, next) {
  let _id = req.params.id;
  req.model
    .get(_id)
    .then(results => {
      res.json(results);
    })
    .catch(next);
}

/**
   * The REST version of create method
   */
function createModel(req, res, next) {
  let record = req.body;
  req.model
    .create(record)
    .then(results => {
      res.json(results);
    })
    .catch(next);
}

/**
   * The REST version of update method
   */
function updateModel(req, res, next) {
  let record = req.body;
  let _id = req.params.id;
  console.log('v1', record);
  req.model.update(_id, record)
    .then(results => {
      console.log('v1', results);
      res.json(results);
    })
    .catch(next);
}

/**
   * The REST version of delete method
   */
function deleteModel(req, res, next) {
  let _id = req.params.id;
  req.model.delete(_id)
    .then(results => {
      res.json(results);
    })
    .catch(next);
}

function signup(req, res, next) {
  let user = new User(req.body);
  user.save()
    .then(user => {
      req.token = user.signupTokenGenerator(user);
      req.user = user;
      res.status(200).send(req.token);
    })
    .catch(next);
}

function signin(req, res, next) {
  res.send(req.token);
}

function getUser(req, res, next) {
  User.list()
    .then(data => {
      res.status(200).json(data);
    });
}

function oauth(req, res, next) {
  res.json(req.token);
}

function bearer(req, res, next) {
  res.status(200).json([req.user.username, req.user.role]);
}

function aclOk(req, res, next) {
  res.status(200).send('WORKS!');
}

module.exports = router;