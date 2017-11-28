const dbConfig = {
    user: "root",
    password: "ujjval",
    database: "fitbit",
    host: "localhost"
}

const fitbitConfig  = {
    key: "228N83",
    secret: "70988bf544c4050c0068d455c7097898",
    callback_url: "http://localhost:3000/callbackUrl"
}

module.exports = {
    dbConfig,
    fitbitConfig
}