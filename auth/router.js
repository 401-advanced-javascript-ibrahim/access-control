/* eslint-disable new-cap */
/* eslint-disable no-unused-vars */
/* eslint-disable strict */

'use strict';

const express = require('express');
const router = express.Router();

const User = require('./user.js');
const authMiddleware = require('./auth-middleware.js');
const oauthMiddleware = require('./oauth/outh-middleware.js');
const bearerMiddleware = require('./bearer/bearer-middleware.js');
const acl = require('./acl/acl-middleware.js');

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