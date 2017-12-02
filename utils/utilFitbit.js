const FitbitApiClient = require('fitbit-node');

const fitbitConfig = require('../config/config.js').fitbitConfig
const fitbitModel = require('../models/fitbit')

const client = new FitbitApiClient(fitbitConfig.key, fitbitConfig.secret);

function authorize() {
  return authUrl = client.getAuthorizeUrl('activity location profile settings', fitbitConfig.callback_url);
}

function getTokens(authCode) {
  return new Promise((resolve, reject) => {
    client.getAccessToken(authCode, fitbitConfig.callback_url)
    .then((tokens) => {
      if(tokens) {
        resolve({
          fitbitUserId: tokens.user_id,
          refreshToken: tokens.refresh_token,
          accessToken: tokens.access_token
        });
      }
      else {
        reject();
      }
    })
  })
}

function refreshTokens(id) {  
  return new Promise((resolve, reject) => {
    
    fitbitModel.loadTokens(id)
    .then((tokens) => {
      let refreshToken = tokens[0].REFRESHTOKEN
      let accessToken = tokens[0].ACCESSTOKEN
      
      return client.refreshAccessToken(accessToken, refreshToken)
    })
    .then((results) => {
      return fitbitModel.updateTokens(id, results.access_token, results.refresh_token)
    })
    .then(() => {
      resolve()
    })
    .catch((err) => {
      reject(err)
    })
  })
}

function getProfile(id) {
  return new Promise((resolve, reject) => {
    refreshTokens(id)
    .then(() => {
      return fitbitModel.getAccessToken(id)
    })
    .then((result) => {
      let accessToken = result[0].ACCESSTOKEN
      return client.get("/profile.json", accessToken)
    })
    .then((results) => {
      resolve(results[0].user);
    })
    .catch((err) => {
      reject(err);
    }) 
  })    
}

function formatDate(date) {
  var d = new Date(date),
  month = '' + (d.getMonth() + 1),
  day = '' + d.getDate(),
  year = d.getFullYear();
  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;
  return [year, month, day].join('-');
}

function getSteps(id) {
  return new Promise((resolve, reject) => {
    refreshTokens(id)
    .then(() => {
      return fitbitModel.getAccessToken(id)
    })
    .then((result) => {
      let accessToken = result[0].ACCESSTOKEN
      return client.get(`/activities/steps/date/${formatDate(new Date())}.json`, accessToken)
    })
    .then((results) => {
      resolve(results)
    })
    .catch((err) => {
      reject(err)
    })
  })
}

function getActivities(id) {
  return new Promise((resolve, reject) => {
    refreshTokens(id)
    .then(() => {
      return fitbitModel.getAccessToken(id)
    })
    .then((result) => {
      let accessToken = result[0].ACCESSTOKEN
      return client.get(`/activities/list/date/2017-11-24.json`, accessToken)
    })
    .then((results) => {
      resolve(results)
    })
    .catch((err) => {
      reject(err)
    })
  })
}

module.exports = {
  authorize,
  getTokens,
  refreshTokens,
  getProfile,
  formatDate,
  getSteps,
  getActivities
}