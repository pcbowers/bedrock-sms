import { pluralizer, subset } from './general_functions'

// AIRTABLE SERVICE LIBRARIES
// main airtable import
const airtable = require('airtable')
const base = new airtable({
  apiKey: process.env.AIRTABLE_API_KEY
}).base(process.env.AIRTABLE_BASE_KEY)


// all the tables for airtable
const TABLE = {
  logs: base("logs"),
  keywords: base("keywords"),
  admins: base("admins")
}

// SUBSET FUNCTIONS
// Create a subset of the record
const recordSubset = (record) => {
  const newRecord = subset({ _rawJson: "json" }, record).json
  const newJson = subset({ id: "recordId", fields: "fields" }, newRecord)
  if (newJson.fields.data) newJson.fields.data = JSON.parse(newJson.fields.data)

  return newJson
}

const logSubset = (record) => {
  const newRecord = recordSubset(record)
  const fields = subset({
    id: "id",
    tag: "tag",
    body: "body",
    date: "date",
    total: "total",
    queued: "queued",
    failed: "failed",
    sent: "sent",
    undelivered: "undelivered",
    delivered: "delivered",
    data: "data"
  }, newRecord.fields)

  return {
    recordID: newRecord.recordId,
    ...fields
  }
}

const keywordSubset = (record) => {
  const newRecord = recordSubset(record)
  const fields = subset({
    name: "name",
    message: "message",
    function: "function",
    admin_only: "admin_only"
  }, newRecord.fields)

  return {
    recordID: newRecord.recordId,
    ...fields
  }
}

const adminSubset = (record) => {
  const newRecord = recordSubset(record)
  const fields = subset({
    email: "email",
    phone: "phone"
  }, newRecord.fields)

  return {
    recordID: newRecord.recordId,
    ...fields
  }
}

// AIRTABLE HELPER FUNCTIONS
// get a record based on a unique field
const getRecord = async (table, [name, value]) => {
  return (await table.select({
    maxRecords: 1,
    filterByFormula: `{${name}}='${value}'`
  }).firstPage())[0]
}

// AIRTABLE EXPORTED FUNCTIONS
// get a single log entry
export const getLog = async (id) => {
  return logSubset(await getRecord(TABLE.logs, ["id", id]))
}

// get multiple log entries
export const getLogs = async (tag) => {
  const options = {}
  if (tag) options.filterByFormula = `{tag}='${tag}'`
  return (await TABLE.logs.select(options).all()).map(record => {
    return logSubset(record)
  }).sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
}

// get a single keyword entry
export const getKeyword = async (keyword) => {
  return keywordSubset(await getRecord(TABLE.keywords, ["name", keyword]))
}


// get multiple keyword entries
export const getKeywords = async (func) => {
  const options = {}
  if (func) options.filterByFormula = `{function}='${func}'`
  return (await TABLE.keywords.select(options).all()).map(record => {
    return keywordSubset(record)
  })
}

// get a single admin entry
export const getAdmin = async (email) => {
  return adminSubset(await getRecord(TABLE.admins, ["email", email]))
}

// get multiple admin entries
export const getAdmins = async () => {
  return (await TABLE.admins.select().all()).map(record => {
    return adminSubset(record)
  })
}


// create a single log
export const createLog = async ({
  tag,
  body,
  date,
  id
}) => {
  return logSubset(await TABLE.logs.create({
    tag,
    body,
    date,
    id
  }))
}

// create multiple logs
export const createLogs = pluralizer(createLog)

// update a single log
export const updateLog = async ({
  id,
  body: {
    total,
    queued,
    failed,
    sent,
    delivered,
    undelivered,
    data
  }
}) => {
  const record = await getRecord(TABLE.logs, ["id", id])
  return logSubset(await TABLE.logs.update(record.id, {
    total,
    queued,
    failed,
    sent,
    delivered,
    undelivered,
    data
  }))
}

// update multiple logs
export const updateLogs = pluralizer(updateLog)

export const updateLogData = async ({
  id,
  data
}) => {
  const record = await getRecord(TABLE.logs, ["id", id])
  console.log(data)
  return logSubset(await TABLE.logs.update(record.id, {
    data
  }))
}
