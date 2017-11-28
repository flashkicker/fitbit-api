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
  let refreshToken;
  let accessToken;
  
  return new Promise((resolve, reject) => {
    fitbitModel.getRefreshToken(id)
    .then((rToken) => {
      refreshToken = rToken[0].REFRESHTOKEN
      return fitbitModel.getAccessToken(id)
    })
    .then((aToken) => {
      accessToken = aToken[0].ACCESSTOKEN
      return client.refreshAccessToken(accessToken, refreshToken)
    })
    .then((results) => {
      console.log(results)
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
      console.log(result)
      let accessToken = result[0].ACCESSTOKEN
      console.log(accessToken)
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

module.exports = {
  authorize,
  getTokens,
  refreshTokens,
  getProfile
}