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

module.exports = router;