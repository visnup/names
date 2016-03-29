'use strict'

const throng = require('throng')

throng({
  workers: process.env.WEB_CONCURRENCY,
  lifetime: Infinity
}, start)

function start(id) {
  const express = require('express')
  const compression = require('compression')

  let app = express()

  app.set('port', process.env.PORT || 8000)

  app.use(compression())
  app.use(express.static(__dirname + '/public', {
    maxAge: '1y',
    setHeaders: (res, path) => {
      if (path.match(/\.html$/)) {
        res.setHeader('Cache-Control', 'max-age=0')
      }
    }
  }))

  app.use(require('morgan')('short'))

  app.use(require('./routes/names'))

  app.listen(app.get('port'), () => {
    console.log(`[worker.${id}] Listening on http://0.0.0.0:${app.get('port')}`)
  })
}
