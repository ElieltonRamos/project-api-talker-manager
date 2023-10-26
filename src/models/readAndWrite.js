const fs = require('fs/promises');
const { join } = require('path');

const readFileTalker = async () => {
  const filePath = join(__dirname, '../talker.json');
  const dataTalkers = await fs.readFile(join(filePath));
  return JSON.parse(dataTalkers);
};

const writeFileTalker = async (data) => {
  const filePath = join(__dirname, '../talker.json');
  await fs.writeFile((filePath), JSON.stringify(data));
};

module.exports = {
  readFileTalker,
  writeFileTalker,
};
