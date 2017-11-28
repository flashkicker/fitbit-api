var express = require('express');
var router = express.Router();

let FitbitApiClient = require('fitbit-node');

let fitbitModel = require('../models/fitbit')
let fitbitUtil = require('../utils/utilFitbit')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Fitbit' });
});

router.get('/callbackUrl', (req, res, next) => {
  fitbitUtil.getTokens(req.query.code)
  .then((tokens) => {
    return fitbitModel.saveTokens(tokens)
  }).then(() => {
    res.redirect('/');
  }).catch((err) => {
    res.render('index', {
      title: 'Express',
      error: err,
      errorMessage: 'This device already exists in the database' 
    });
  })
})

router.get('/profile', (req, res, next) => {
  let id = req.query.id;
  
  fitbitUtil.getProfile(id)
  .then((result) => {
    res.send(result)
  })
  .catch((err) => {
    console.log(err)
    res.send(err);
  })
})

router.get('/authorizeFitbit', (req, res, next) => {
  fitbitUrl = fitbitUtil.authorize()
  res.redirect(fitbitUrl);
})

module.exports = router;
