'use strict'

const router = require('express').Router()
const JSONStream = require('JSONStream')
const knex = require('../data/knex')
const startCase = require('lodash').startCase

const columns = [
  'name',
  'gender',
  'state',
  'year',
  'count'
]

router.get('/names/:name', (req, res) => {
  res.type('json')

  let sql = knex
    .select(columns)
    .from('names')
    .where('name', startCase(req.params.name.toLowerCase()))
    .stream()
  req.on('close', sql.end.bind(sql))

  sql.pipe(JSONStream.stringify()).pipe(res)
})

module.exports = router
