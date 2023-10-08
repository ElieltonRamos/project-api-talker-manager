const validadeName = (req, res, next) => {
  const { name } = req.body;
  switch (true) {
  case !name:
    return res.status(400).send({ message: 'O campo "name" é obrigatório' });
  case name.length <= 3:
    return res.status(400).send({ message: 'O "name" deve ter pelo menos 3 caracteres' });
  default: next();
  }
};

const validateAge = (req, res, next) => {
  const { age } = req.body;
  const msgNotInt = 'O campo "age" deve ser um número inteiro igual ou maior que 18';
  switch (true) {
  case !age:
    return res.status(400).send({ message: 'O campo "age" é obrigatório' });
  case Math.floor(age) !== age || typeof age !== 'number' || age < 18:
    return res.status(400).send({ message: msgNotInt });
  default: next();
  }
};

const validateToken = (req, res, next) => {
  const { authorization } = req.headers;
  switch (true) {
  case !authorization:
    return res.status(401).send({ message: 'Token não encontrado' });
  case authorization.length !== 16:
    return res.status(401).send({ message: 'Token inválido' });
  default: next();
  }
};

const verifyRate = (req, res, next) => {
  const { rate } = req.body.talk;
  const ratesValids = [1, 2, 3, 4, 5];
  const message = 'O campo "rate" deve ser um número inteiro entre 1 e 5';
  switch (true) {
  case rate === undefined || typeof rate !== 'number':
    return res.status(400).send({ message: 'O campo "rate" é obrigatório' });
  case !ratesValids.includes(rate):
    return res.status(400).send({ message });
  default: next();
  }
};

const validateTalk = (req, res, next) => {
  const { talk } = req.body;
  const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
  switch (true) {
  case !talk:
    return res.status(400).send({ message: 'O campo "talk" é obrigatório' });
  case !talk.watchedAt:
    return res.status(400).send({ message: 'O campo "watchedAt" é obrigatório' });
  case !dateRegex.test(talk.watchedAt):
    return res.status(400).send({ message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' });
  default: next();
  }
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

const createToken = () => {
  // exemplo de token => authorization = 7mqaVRXJSp886CGr
  const token1 = Math.random().toString(16).substr(2);
  const token2 = Math.random().toString(16).substr(2);
  return `${token1}${token2}`.slice(0, 16);
};

module.exports = {
  validadeName,
  validateAge,
  validateToken,
  verifyRate,
  validateTalk,
  validateLogin,
  createToken,
};
