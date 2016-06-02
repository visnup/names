'use strict'

const router = require('express').Router()
const JSONStream = require('JSONStream')
const knex = require('../data/knex')
const startCase = require('lodash').startCase

router.get('/names/:name', (req, res) => {
  // if name has a non-word character, treat it as all data
  let name = req.params.name
  name = !name || name.match(/\W/)
    ? null
    : startCase(name.toLowerCase())

  let sql = knex
    .select([ 'name', 'gender', 'state', 'year', 'count' ])
    .from('names')
    .where('name', name)
    .stream()
  req.on('close', sql.end.bind(sql))

  res.type('json')
  res.set('Cache-Control', 'public, max-age=60'); // 1m
  sql.pipe(JSONStream.stringify()).pipe(res)
})

module.exports = router
