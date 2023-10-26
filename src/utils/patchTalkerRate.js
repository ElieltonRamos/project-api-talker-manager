const { readFileTalker, writeFileTalker } = require('./readAndWrite');

const validationRate = (rate) => {
  console.log(rate);
  const ratesValids = [1, 2, 3, 4, 5];

  if (rate === undefined || Number.isNaN(rate)) {
    return {
      status: 400,
      data: {
        message: 'O campo "rate" é obrigatório',
      },
    };
  }

  if (!ratesValids.includes(rate)) {
    return {
      status: 400,
      data: { message: 'O campo "rate" deve ser um número inteiro entre 1 e 5' },
    };
  }
};

const patchTalkerRate = async (id, rate) => {
  const talkers = await readFileTalker();
  const rateValidation = validationRate(rate);

  if (rateValidation) return rateValidation;

  const indexTalker = talkers.indexOf(talkers.find((t) => t.id === id));
  talkers[indexTalker].talk.rate = rate;
  await writeFileTalker(talkers);

  return { status: 204 };
};

module.exports = {
  patchTalkerRate,
};