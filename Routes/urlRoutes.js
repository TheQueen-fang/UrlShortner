const express = require('express');

const {handleGenerateNewShortURL,handleGetAnalytics}=require('../Controller/urlController')
const router = express.Router();

router.post('/', handleGenerateNewShortURL);

router.get('/analytics/:shortId', handleGetAnalytics);

module.exports = router;

