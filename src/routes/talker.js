const express = require('express');
const { readFileTalker, writeFileTalker } = require('../models/readAndWrite');
const { searchTalker } = require('../middlewares/searchTalker');
const { validateToken, validadeName, validateAge,
  validateTalk, verifyRate } = require('../middlewares/validations');

const { searchDateTalker, seachDateRateName,
  searchDateName, searchDateRate, searchDateEmpty,
  isValidDate } = require('../middlewares/searchDate');

const { patchTalkerRate } = require('../middlewares/patchTalkerRate');
const { searchDatabase } = require('../models/searchDatabase');

const routerTalker = express.Router();

routerTalker.get('/talker/db', async (req, res) => {
  const { status, data } = await searchDatabase();
  res.status(status).send(data);
});

routerTalker.patch('/talker/rate/:id', validateToken, async (req, res) => {
  const { id } = req.params;
  const { rate } = req.body;
  const rateNumber = Number(rate);
  const idNumber = Number(id);
  const { status, data } = await patchTalkerRate(idNumber, rateNumber);
  res.status(status).send(data);
});

routerTalker.get('/talker', async (_req, res) => {
  try {
    const talkers = await readFileTalker();
    if (talkers.length === 0) return res.status(200).send([]);
    res.status(200).send(talkers);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

routerTalker.get('/talker/search', validateToken, searchDateEmpty, isValidDate, searchDateTalker,
  searchDateRate, searchDateName, seachDateRateName, async (req, res) => {
    const { q, rate } = req.query;
    const { status, data } = await searchTalker(q, rate);
    res.status(status).send(data);
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

routerTalker.put('/talker/:id', validateToken, validadeName, validateAge,
  validateTalk, verifyRate, async (req, res) => {
    try {
      const talkers = await readFileTalker();
      const paramsURL = req.params;
      const id = Number(paramsURL.id);
      const { name, age, talk } = req.body;
      const talkerIndex = talkers.findIndex((t) => t.id === id);
      if (talkerIndex === -1) throw Error;
      talkers[talkerIndex] = { id, name, age, talk };
      await writeFileTalker(talkers);
      res.status(200).send(talkers[talkerIndex]);
    } catch (err) {
      res.status(404).send({ message: 'Pessoa palestrante não encontrada' });
    }
  });

routerTalker.delete('/talker/:id', validateToken, async (req, res) => {
  try {
    const talkers = await readFileTalker();
    const paramsURL = req.params;
    const id = Number(paramsURL.id);
    const newTalkers = talkers.filter((t) => t.id !== id);
    await writeFileTalker(newTalkers);
    res.status(204).send();
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

module.exports = routerTalker;
