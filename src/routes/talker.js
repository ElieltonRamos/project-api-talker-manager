const express = require('express');
const fs = require('fs/promises');
const { join } = require('path');

const routerTalker = express.Router();

const readFileTalker = async () => {
  const filePath = join(__dirname, '../talker.json');
  const dataTalkers = await fs.readFile(join(filePath));
  return JSON.parse(dataTalkers);
};

const writeFileTalker = async (data) => {
  const filePath = join(__dirname, '../talker.json');
  await fs.writeFile((filePath), JSON.stringify(data));
};

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
  console.log(req.body.talk);
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
  console.log(req.body);
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

routerTalker.get('/talker', async (_req, res) => {
  try {
    const talkers = await readFileTalker();
    if (talkers.length === 0) return res.status(200).send([]);
    res.status(200).send(talkers);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

routerTalker.get('/talker/:id', async (req, res) => {
  try {
    const paramsURL = req.params;
    const id = Number(paramsURL.id);
    const talkers = await readFileTalker();
    const talker = talkers.find((t) => t.id === id);
    if (!talker) throw Error;
    res.status(200).send(talker);
  } catch (err) {
    res.status(404).send({ message: 'Pessoa palestrante não encontrada' });
  }
});

routerTalker.post('/talker', validateToken, validadeName,
  validateAge, validateTalk, verifyRate, async (req, res) => {
    try {
      const dataTalkers = await readFileTalker();
      const { name, age, talk } = req.body;
      const id = dataTalkers.length + 1;
      const newTalker = { id, name, age, talk };
      dataTalkers.push(newTalker);
      await writeFileTalker(dataTalkers);
      return res.status(201).send(newTalker);
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  });

module.exports = routerTalker;
