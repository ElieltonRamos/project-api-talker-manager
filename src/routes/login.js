const express = require('express');

const routerLogin = express.Router();

const createToken = () => {
  const token1 = Math.random().toString(16).substr(2);
  const token2 = Math.random().toString(16).substr(2);
  return `${token1}${token2}`.slice(0, 16);
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  const emailIsValid = emailRegex.test(email);
  switch (true) {
  case !email:
    return res.status(400).json({ message: 'O campo "email" é obrigatório' });
  case !emailIsValid:
    return res.status(400).json({ message: 'O "email" deve ter o formato "email@email.com"' });
  case !password:
    return res.status(400).json({ message: 'O campo "password" é obrigatório' });
  case password.length < 6:
    return res.status(400).json({ message: 'O "password" deve ter pelo menos 6 caracteres' });
  default:
    next();
  }
};

routerLogin.post('/login', validateLogin, (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Campos invalidos' });
  } return res.status(200).json({ token: createToken() });
});

module.exports = routerLogin;
