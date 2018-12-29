let mongoose = require('mongoose')
let serverURL = 'http://54.164.7.63:40445'
// let serverURL = 'http://10.192.32.92:40445'
mongoose.connect('mongodb://localhost:27017/fsn', { useNewUrlParser: true })

// module.export = mongoose

exports.mongoose = mongoose
exports.serverURL = serverURL
