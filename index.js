const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const movieRoutes = require('./routes/Movies');
const userRoutes = require('./routes/User')
const cors = require('cors');

const app = express();
const PORT = process.env.PORT;
console.log(process.env.url);
mongoose.connect(process.env.URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
    console.log("Connected to Mongo Db");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDb", err);
  });

app.use(cors());
app.use(bodyParser.json());

app.use('/api', movieRoutes);
app.use('/user', userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


