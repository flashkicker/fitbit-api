var db = require('mysql2-db');
let FitbitApiClient = require('fitbit-node');

const fitbitConfig = require('../config/config.js').fitbitConfig
const dbConfig = require('../config/config').dbConfig

let client = new FitbitApiClient(fitbitConfig.key, fitbitConfig.secret);

function saveTokens(tokens) {
  return new Promise((resolve, reject) => {
    let stage = db.stage(dbConfig);
    stage
    .execute("INSERT INTO device(ID, REFRESHTOKEN, ACCESSTOKEN) values(?, ?, ?)", [tokens.fitbitUserId, tokens.refreshToken, tokens.accessToken])
    .finale((err, result) => {
      if(err) { reject(err) }
      else { resolve() }
    })
  })
}

function getAccessToken(id) {
  return new Promise((resolve, reject) => {
    let stage = db.stage(dbConfig);
    stage
    .query("SELECT ACCESSTOKEN FROM device WHERE ID=?", [id])
    .finale((err, result) => {
      if(err) { reject(err) }
      else { resolve(result) }
    })
  })
}

function getRefreshToken(id) {
  return new Promise((resolve, reject) => {
    let stage = db.stage(dbConfig);
    stage
    .query("SELECT REFRESHTOKEN FROM device WHERE ID=?", [id])
    .finale((err, result) => {
      if(err) { reject(err) }
      else { resolve(result) }
    })
  })
}

function updateTokens(id, accessToken, refreshToken) {
  return new Promise((resolve, reject) => {
    let stage = db.stage(dbConfig);
    stage
    .execute("UPDATE device SET ACCESSTOKEN=?, REFRESHTOKEN=? WHERE ID=?", [accessToken, refreshToken, id])
    .finale((err, result) => {
      if(err) { reject(err) }
      else { resolve() }
    })
  })
}

module.exports = {
  saveTokens,
  getAccessToken,
  getRefreshToken,
  updateTokens
}




