const dbo = require('../dbo/base')
const { messages } = require('joi-translation-pt-br')
const validation = require('../model/hospital')
const tableName = 'hospital'

const get = async (object) => {
  const { limit, page, order, direction, filters } = object

  const filterMap = {
    id: '=',
    name: 'like'
  }

  const fields = [`${tableName}.*`]
  let filtersObject = []

  if (filters) {
    filtersObject = filters.map((el) => {
      return {
        column: el.column,
        value: el.value,
        operator: filterMap[el.column],
        tableFilter: el.tableFilter,
      }
    })
  }

  return await dbo.get(tableName, filtersObject, limit, page, order, direction, fields)
}

const insert = async (object) => {
  try {
    await validation.object.validateAsync(object, {
      abortEarly: false,
      messages: messages,
    })
  } catch (error) {
    const errors = error.details.reduce((acc, curr) => {
      const field = curr.path.join('.')
      acc[field] = curr.message
      return acc
    }, {})

    return { errors }
  }

  return await dbo.insert(object, tableName)
}

const update = async (object, id) => {
  if (!id) {
    return false
  }
  try {
    await validation.object.validateAsync(object, {
      abortEarly: false,
      messages: messages,
    })
  } catch (error) {
    const errors = error.details.reduce((acc, curr) => {
      const field = curr.path.join('.')
      acc[field] = curr.message
      return acc
    }, {})

    return { errors }
  }
  return await dbo.update(object, id, tableName)
}

const remove = async (id) => {
  if (!id) {
    return false
  }
  return await dbo.remove(id, tableName)
}

module.exports = {
  get,
  insert,
  update,
  remove,
}