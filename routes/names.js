'use strict'

const router = require('express').Router()
const JSONStream = require('JSONStream')
const knex = require('../data/knex')
const startCase = require('lodash').startCase

router.get('/names/:name', (req, res) => {
  let sql = knex
    .select([ 'name', 'gender', 'state', 'year', 'count' ])
    .from('names')
    .where('name', startCase(req.params.name.toLowerCase()))
    .stream()
  req.on('close', sql.end.bind(sql))

  res.type('json')
  sql.pipe(JSONStream.stringify()).pipe(res)
})

module.exports = router
