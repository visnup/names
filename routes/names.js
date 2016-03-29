'use strict'

const router = require('express').Router()
const jsoncsv = require('json-csv')
const knex = require('../data/knex')
const startCase = require('lodash').startCase

const columns = [
  'name',
  'gender',
  'state',
  'year',
  'count'
]
const fields = columns.map((name) => {
  return { name, label: name }
})

router.get('/names/:name', (req, res) => {
  res.set('Cache-Control', 'public, max-age=86400') // 1d
  res.type('csv')

  let sql = knex
    .select(columns)
    .from('names')
    .where('name', startCase(req.params.name.toLowerCase()))
    .stream()
  req.on('close', sql.end.bind(sql))

  sql.pipe(jsoncsv.csv({ fields })).pipe(res)
})

module.exports = router
