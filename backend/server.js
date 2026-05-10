require('dotenv').config();
const { app } = require('./app');

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Mind Maze backend running on port ${PORT}`);
  console.log(`Health check → http://localhost:${PORT}/health`);
});
