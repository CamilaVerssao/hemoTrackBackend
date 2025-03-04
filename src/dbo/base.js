const db = require('../config/db')

const get = async (
  tableName,
  filters = [],
  limit = null,
  page = 1,
  order = '',
  direction = '',
  fields = [],
  joins = [],
  tableOrder
) => {
  let offset = 0

  if (limit && limit != 'Infinity') {
    offset = (page - 1) * limit
  }

  let baseQuery = db(tableName).where(`${tableName}.deleted_at`, null)

  joins.forEach(({ joinType, tableJoin, paramTo, paramFrom, andParams }) => {
    if (joinType && tableJoin && paramTo && paramFrom) {
      baseQuery = baseQuery[joinType](tableJoin, function () {
        this.on(paramTo, '=', paramFrom)

        if (andParams && andParams.length > 0) {
          andParams.forEach((param) => {
            this.andOn(param.paramTo, '=', param.paramFrom)
          })
        }
      })
    }
  })

  for (const filter of filters) {
    const table = filter.tableFilter ? filter.tableFilter : filter.table || tableName
    if (
      (filter.column && filter.operator && filter.value !== undefined) ||
      (filter.column && filter.operator === 'is not null')
    ) {
      if (filter.operator === 'like') {
        baseQuery = baseQuery.where(`${table}.${filter.column}`, filter.operator, `%${filter.value}%`)
      } else if (filter.operator === 'not') {
        baseQuery = baseQuery.whereNotNull(`${table}.${filter.column}`)
      } else if (filter.operator === 'between') {
        filter.value[0] = `${filter.value[0]} 00:00:00`
        filter.value[1] = `${filter.value[1]} 23:59:59`
        baseQuery = baseQuery.whereBetween(`${table}.${filter.column}`, filter.value)
      } else if (filter.operator === 'is') {
        baseQuery = baseQuery.whereNull(`${table}.${filter.column}`)
      } else if (filter.operator === 'is not') {
        baseQuery = baseQuery.where(`${table}.${filter.column}`, '!=', filter.value)
      } else if (filter.operator === 'in') {
        baseQuery = baseQuery.whereIn(`${table}.${filter.column}`, filter.value)
      } else if (filter.operator === 'is not null') {
        baseQuery = baseQuery.whereNotNull(`${table}.${filter.column}`)
      } else {
        baseQuery = baseQuery.where(`${table}.${filter.column}`, filter.operator, filter.value)
      }
    }
  }

  if (order && direction) {
    if (tableOrder) {
      baseQuery = baseQuery.orderBy(`${tableOrder}.${order}`, direction)
    } else {
      baseQuery = baseQuery.orderBy(`${tableName}.${order}`, direction)
    }
  }

  if (limit && limit != 'Infinity') {
    baseQuery = baseQuery.limit(limit)
  }

  if (!offset) {
    offset = 0
  }

  const result = await baseQuery
    .clone()
    .select(fields)
    .offset(offset)
    .catch((error) => {
      console.log(error.message)
      return []
    })

  const count = await baseQuery
    .clone()
    .count(`${tableName}.id as quantity`)
    .first()
    .catch((error) => {
      console.log(error.message)
      return []
    })
  return {
    data: result,
    actualPage: page,
    total: count.quantity,
  }
}

const insert = async (object, tableName, fields = ['id'], trx = null) => {
  try {
    const queryBuilder = trx || db
    const insertedId = await queryBuilder(tableName).insert(object, fields).onConflict(fields).merge()
    return { id: insertedId }
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return { errors: err.code }
    } else {
      throw { errors: err.message }
    }
  }
}

const update = async (object, id, tableName, trx = null) => {
  try {
    const queryBuilder = trx || db

    const result = await queryBuilder(tableName).update(object).where('id', id)

    return result
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return { errors: err.code }
    } else {
      throw { errors: err.message }
    }
  }
}

const remove = async (id, tableName, trx = null) => {
  const queryBuilder = trx || db

  const result = await queryBuilder(tableName)
    .update({ deleted_at: new Date() })
    .where('id', id)
    .catch((err) => {
      console.log(err)
      throw { errors: err.code }
    })
  return result
}

const batchRemove = async (array, tableName, trx = null) => {
  if (!array || array.length < 1) {
    return false
  }

  const queryBuilder = trx || db

  const ids = array.map((object) => object.id)

  try {
    const result = await queryBuilder(tableName).update({ deleted_at: new Date() }).whereIn('id', ids)

    return result
  } catch (err) {
    console.log(err)
    return false
  }
}

const batchInsert = async (array, tableName, trx = null) => {
  const queryBuilder = trx || db

  const result = await queryBuilder.batchInsert(tableName, array, 100).catch((err) => {
    console.log(err.message)
    return null
  })
  return result
}

module.exports = {
  get,
  insert,
  update,
  remove,
  batchRemove,
  batchInsert
}