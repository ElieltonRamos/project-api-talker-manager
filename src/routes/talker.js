const express = require('express');
const fs = require('fs/promises');
const { join } = require('path');

const router = express.Router();

const readFileTalker = async () => {
  const filePath = join(__dirname, '../talker.json');
  const dataTalkers = await fs.readFile(join(filePath));
  return JSON.parse(dataTalkers);
};

router.get('/talker', async (_req, res) => {
  try {
    const talkers = await readFileTalker();
    if (talkers.length === 0) return res.status(200).send([]);
    res.status(200).send(talkers);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

router.get('/talker/:id', async (req, res) => {
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

module.exports = router;