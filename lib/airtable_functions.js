const airtable = require('airtable')
const base = new airtable({
  apiKey: process.env.AIRTABLE_API_KEY
}).base(process.env.AIRTABLE_BASE_KEY)

const TABLE = {
  logs: base("logs"),
  keywords: base("keywords"),
  admins: base("admins")
}

// Pluralize a single promise and connect them altogether
const pluralizer = (func) => {
  return async (elements) => {
    return await Promise.all(elements.map(async (element) => {
      return await func(element)
    }));
  }
}

const getRecord = async (table, id) => {
  return (await table.select({
    maxRecords: 1,
    filterByFormula: `{id}='${id}'`
  }).firstPage())[0]
}

export const createLog = async ({ tag, body, dateCreated, id }) => {
  console.log(id)
  return await TABLE.logs.create({
    id: id,
    tag: tag,
    body: body,
    date: dateCreated
  })
}

export const createLogs = pluralizer(createLog)

export const updateLog = async ({ id, body: { total, queued, failed, sent, delivered, undelivered, data } }) => {
  const record = await getRecord(TABLE.logs, id)
  return await TABLE.logs.update(record.id, {
    total,
    queued,
    failed,
    sent,
    delivered,
    undelivered,
    data
  })
}

export const updateLogs = pluralizer(updateLog)
