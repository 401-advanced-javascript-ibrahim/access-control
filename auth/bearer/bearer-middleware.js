/* eslint-disable strict */

'use strict';

const Users = require('../user.js');

module.exports = (req, res, next) => {
  if (!req.headers.authorization) { next('Nope'); }

  let token = req.headers.authorization.split(' ').pop();
  Users.authenticateToken(token)
    .then(validUser =>{
      console.log('bearer',validUser);
      req.user = validUser;
      next();
    })
    .catch(e => next(e));
};

