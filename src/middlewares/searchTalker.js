const { readFileTalker } = require('../models/readAndWrite');

const searchTalkerName = (q, rate, talkers) => {
  const talkersFilterName = talkers.filter((t) => t.name.includes(q));
  if (q === undefined && rate === undefined) return { status: 200, data: [] };
  if (q && !rate) return { status: 200, data: talkersFilterName };
};

const searchTalkerRate = (q, rate, talkers) => {
  const talkersFilterRate = talkers.filter((element) => element.talk.rate === Number(rate));
  const ratesValids = [1, 2, 3, 4, 5];
  if (q === undefined && !ratesValids.includes(Number(rate))) {
    return {
      status: 400,
      data: { message: 'O campo "rate" deve ser um número inteiro entre 1 e 5' },
    };
  }

  if (!q && rate) return { status: 200, data: talkersFilterRate };
};

const searchTalkerAndRate = (q, rate, talkers) => {
  const talkersFilterNameAndRate = talkers.filter((t) => t.name
    .includes(q) && t.talk.rate === Number(rate));

  if (q && rate) {
    return { status: 200, data: talkersFilterNameAndRate };
  }
};

const searchTalker = async (q, rate) => {
  const talkers = await readFileTalker();

  const responseNameAndRate = searchTalkerAndRate(q, rate, talkers);
  const responseName = searchTalkerName(q, rate, talkers);
  const responseRate = searchTalkerRate(q, rate, talkers);

  if (responseNameAndRate) return responseNameAndRate;
  if (responseName) return responseName;
  if (responseRate) return responseRate;

  return { status: 200, data: talkers };
};

module.exports = {
  searchTalker,
  searchTalkerName,
  searchTalkerRate,
  searchTalkerAndRate,
};
