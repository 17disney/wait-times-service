const path = require('path')
const express = require('express')
const config = require('config-lite')(__dirname)
const routes = require('./routes')
const pkg = require('./package')
const winston = require('winston')
const expressWinston = require('express-winston')
const http = require('http')
const fs = require('fs')
const app = express()

app.use((req, res, next) => {
  res.retErr = (err, code = 400) => {
    res.json({ err, code })
  }
  res.retData = data => {
    res.json(data)
  }
  next()
})

// 路由
routes(app)

// 正常请求的日志
app.use(
  expressWinston.logger({
    transports: [
      new winston.transports.Console({
        json: true,
        colorize: true
      }),
      new winston.transports.File({
        filename: 'logs/success.log'
      })
    ]
  })
)

// 错误请求的日志
app.use(
  expressWinston.errorLogger({
    transports: [
      new winston.transports.Console({
        json: true,
        colorize: true
      }),
      new winston.transports.File({
        filename: 'logs/error.log'
      })
    ]
  })
)

//错误返回
app.use((err, req, res, next) => {
  res.retErr(err.message)
})

if (process.env.NODE_ENV === 'production') {
  http.createServer(app).listen(config.port)
} else {
  http.createServer(app).listen(8013)
}
console.log('Disney-Api')
