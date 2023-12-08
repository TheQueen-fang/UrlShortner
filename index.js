const express = require('express');

const { connectToMongoDB } = require('../UrlShortner/Connect');

const cookieParser = require('cookie-parser');

const {restrictToLoggedinUserOnly } = require('./middleware/auth');
const path = require('path');
const URL = require('./Models/url')
const urlRoute = require('./Routes/urlRoutes');

const staticRoute = require('./Routes/staticRouter');
const userRoute = require('./Routes/user');


const app = express();
const PORT = 8001;

connectToMongoDB('mongodb://127.0.0.1:27017/short-url')
  .then(() => {
    console.log('MongoDB Connected !');
  });

app.set('view engine', 'ejs');

//we need to mention where we have save our ejs file

app.set('views', path.resolve('./view'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/url', restrictToLoggedinUserOnly,urlRoute);
app.use('/user', userRoute);
app.use('/', staticRoute);
app.get('/test', async (req, res) => {
  const allUrls = await URL.find({});

  return res.render('home', {
    urls: allUrls,
  });
})
 
app.use('/url', urlRoute);
app.get('/url/:shortId', async (req, res) => {
  const shortId = req.params.shortId;

  const entry = await URL.findOneAndUpdate({
    shortId
  }, {
    $push: {
      visitHistory: {timestamp:Date.now()},
    }
  });
  res.redirect(entry.redirectURL);
});
app.listen(PORT, (() => {
  console.log(`Server Started at PORT ${PORT} `); 
}))