const express = require('express');

const routerLogin = express.Router();

const createToken = () => {
  const token1 = Math.random().toString(16).substr(2);
  const token2 = Math.random().toString(16).substr(2);
  const token = `${token1}${token2}`.slice(0, 16);
  return token;
};

routerLogin.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Campos invalidos' });
  } return res.status(200).json({ token: createToken() });
});

module.exports = routerLogin;
