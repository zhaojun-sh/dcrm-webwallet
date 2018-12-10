let express = require('express')
let app = express()
let bodyParser = require('body-parser')

app.use(express.static(require('path').join(__dirname,'public')))

app.all('*',function(req,res,next){
	res.header('Access-Control-Allow-Origin', '*')
	res.header('Access-Control-Allow-Headers', 'X-Requested-With')
	res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
	res.header('X-Powered-By', '3.2.1')
	res.header('Content-Type', 'application/json;charset=utf-8')
	next()
})

app.use(bodyParser.json({limit:'50mb'}))
app.use(bodyParser.urlencoded({limit:'50mb',extended:true}))

let sendInfo = require('./server/sendInfo')

app.use('/send', sendInfo)

let server = app.listen(8081, function () {
  console.log('success')
})
