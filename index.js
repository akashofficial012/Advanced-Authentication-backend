const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Sequelize } = require('sequelize');
var bodyParser = require('body-parser')
dotenv.config();
const authRoute = require('./routes/authRoute');

const app = express();

const port = 3000;
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

app.use('/api/v1/', authRoute);

const sequelize = new Sequelize('authentication', 'postgres', 'Akash123', {
    host: '127.0.0.1',
    dialect: 'postgres'
  })
async function connectDb() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
      } catch (error) {
        console.error('Unable to connect to the database:', error);
      }
}

app.listen(port, async () => {
    await connectDb();
    console.log(`Server is running on port ${port}`);
});
