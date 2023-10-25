const { readFileTalker } = require('./readAndWrite');

// routerTalker.get('/talker/search', validateToken, async (req, res) => {
//   const { q, rate } = req.query;
//   const { status, data } = await searchTalker(q, rate);
//   res.status(status).send(data);
// });

const searchTalkerName = (q, rate, talkersFilterName) => {
  if (q === undefined && rate === undefined) return { status: 200, data: [] };
  if (q && !rate) return { status: 200, data: talkersFilterName };
};

const searchTalkerRate = (q, rate, talkersFilterRate, rateNumber) => {
  const ratesValids = [1, 2, 3, 4, 5];
  if (q === undefined && !ratesValids.includes(rateNumber)) {
    return { status: 400, 
      data: { message: 'O campo "rate" deve ser um número inteiro entre 1 e 5' } };
  }

  if (!q && rate) return { status: 200, data: talkersFilterRate };
};

const searchTalker = async (q, rate) => {
  const rateNumber = Number(rate);
  const talkers = await readFileTalker();
  const talkersFilterName = talkers.filter((t) => t.name.includes(q));
  const talkersFilterRate = talkers.filter((element) => element.talk.rate === rateNumber);

  if (q && rate) {
    return { status: 200, data: talkersFilterRate.filter((element) => element.name.includes(q)) };
  }

  const responseName = searchTalkerName(q, rate, talkersFilterName);
  const responseRate = searchTalkerRate(q, rate, talkersFilterRate, rateNumber);

  if (responseName) return responseName;
  if (responseRate) return responseRate;

  return { status: 200, data: talkers };
};

module.exports = {
  searchTalker,
  searchTalkerName,
  searchTalkerRate,
};
