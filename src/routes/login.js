const express = require('express');
const { validateLogin, createToken } = require('../middlewares/validations');

const routerLogin = express.Router();

routerLogin.post('/login', validateLogin, (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Campos invalidos' });
  } return res.status(200).json({ token: createToken() });
});

module.exports = routerLogin;
