const { readFileTalker } = require('../models/readAndWrite');

const searchDateEmpty = async (req, res, next) => {
  const { q, rate, date } = req.query;
  const talkers = await readFileTalker();

  if (!q && !rate && date === '') {
    return res.status(200).json(talkers);
  }
  next();
};

const isValidDate = async (req, res, next) => {
  const { date } = req.query;
  const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;

  if (date !== undefined && !dateRegex.test(date)) {
    return res.status(400).json({
      message: 'O parâmetro "date" deve ter o formato "dd/mm/aaaa"',
    });
  }
  next();
};

const searchDateTalker = async (req, res, next) => {
  const { q, rate, date } = req.query;
  const talkers = await readFileTalker();
  const filterTalkers = talkers.filter((talker) => talker.talk.watchedAt === date);

  if (!q && !rate && date) {
    return res.status(200).json(filterTalkers);
  }

  next();
};

const searchDateRate = async (req, res, next) => {
  const { q, rate, date } = req.query;
  const talkers = await readFileTalker();
  const filterDateAndRate = talkers.filter((talker) => talker.talk.watchedAt === date
    && talker.talk.rate === Number(rate));

  if (!q && rate && date) {
    return res.status(200).json(filterDateAndRate);
  }

  next();
};

const searchDateName = async (req, res, next) => {
  const { q, rate, date } = req.query;
  const talkers = await readFileTalker();
  const filterDateAndName = talkers.filter((talker) => talker.talk.watchedAt === date
    && talker.name.includes(q));

  if (!rate && q && date) {
    return res.status(200).json(filterDateAndName);
  }

  next();
};

const seachDateRateName = async (req, res, next) => {
  const { q, rate, date } = req.query;
  const talkers = await readFileTalker();
  const filterDateAndRateAndName = talkers.filter((talker) => talker.talk.watchedAt === date
    && talker.talk.rate === Number(rate) && talker.name.includes(q));

  if (q && rate && date) {
    return res.status(200).json(filterDateAndRateAndName);
  }

  next();
};

module.exports = {
  searchDateRate,
  searchDateTalker,
  searchDateName,
  seachDateRateName,
  searchDateEmpty,
  isValidDate,
};