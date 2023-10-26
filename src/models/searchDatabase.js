const connection = require('./connection');

const searchDatabase = async () => {
  const [responseDB] = await connection.execute('SELECT * FROM talkers');
  const formatedResponse = responseDB.map((talker) => ({
    id: talker.id,
    name: talker.name,
    age: talker.age,
    talk: { watchedAt: talker.talk_watched_at, rate: talker.talk_rate },
  }));
  return { status: 200, data: formatedResponse };
};

module.exports = {
  searchDatabase,
};

// {
//   "id": 1,
//   "name": "Danielle Santos",
//   "age": 56,
//   "talk": {
//     "watchedAt": "22/10/2019",
//     "rate": 5,
//   },
// }