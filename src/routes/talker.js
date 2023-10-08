const express = require('express');
const { readFileTalker, writeFileTalker } = require('../middlewares/readAndWrite');
const { validateToken, validadeName, validateAge,
  validateTalk, verifyRate } = require('../middlewares/validations');

const routerTalker = express.Router();

routerTalker.get('/talker', async (_req, res) => {
  try {
    const talkers = await readFileTalker();
    if (talkers.length === 0) return res.status(200).send([]);
    res.status(200).send(talkers);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

routerTalker.get('/talker/search', validateToken, async (req, res) => {
  try {
    const { q } = req.query;
    const talkers = await readFileTalker();
    if (!q) return res.status(200).send(talkers);
    const talkersFilter = talkers.filter((t) => t.name.includes(q));
    if (talkersFilter.length === 0) return res.status(200).send([]);
    res.status(200).send(talkersFilter);
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
