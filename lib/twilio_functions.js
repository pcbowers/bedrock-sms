import { v4 as uuidv4 } from 'uuid';
import { pluralizer, subset } from './general_functions';

// TWILIO SERVICE LIBRARIES
// Twilio Library
export const twilio = require('twilio')

// Twilio Client
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Twilio Notify Service
const service = client.notify.services(process.env.TWILIO_NOTIFY_SERVICE_SID);

// SUBSET FUNCTIONS
// Create a subset of the contact elements
const contactSubset = (contact) => {
  return subset({
    sid: "bindingId",
    identity: "id",
    address: "number",
    tags: "tags",
    dateUpdated: "dateUpdated",
  }, contact)
}

// Create a subset of the contact elements
const messageHistorySubset = (message) => {
  return subset({
    body: "message",
    direction: "direction",
    numSegments: "numSegments",
    from: "from",
    to: "to",
    dateSent: "dateSent",
    price: "price",
    status: "status",
    errorMessage: "errorMessage",
    errorCode: "errorCode",
    sid: "id"
  }, message)
}

const createMessageSubset = (message) => {
  return subset({
    id: "id",
    sid: "notifyId",
    tags: "tags",
    identities: "identities",
    body: "body",
    dateCreated: "date"
  }, message)
}

// TWILIO HELPER FUNCTIONS
// get a binding id based on a contact's id
const getBindingId = async (id) => {
  const results = await service.bindings.list({
    identity: id
  })
  if (results.length > 1) throw "contact ID did not match"
  return results[0].sid
}

// TWILIO EXPORTED FUNCTIONS
// get a single contact by id
export const getContact = async (id) => {
  const bindingId = await getBindingId(id)
  const contact = await service.bindings(bindingId).fetch()
  return contactSubset(contact)
}

// get a contact by tag
export const getContacts = async (tag = "") => {
  const contacts = await service.bindings.list({
    tag: tag
  })

  return contacts.map(contact => contactSubset(contact)).sort((a, b) => {
    return a.number.localeCompare(b.number, undefined, {
      numeric: true,
      sensitivity: 'base'
    })
  })
}

// create a contact with tags and number
export const createContact = async ({ tags = [], number }) => {
  const contact = await service.bindings.create({
    identity: uuidv4(),
    bindingType: 'sms',
    tag: tags,
    address: number
  })

  return contactSubset(contact)
}

// create contacts with tags and number
export const createContacts = pluralizer(createContact)

// delete a contact by id
export const deleteContact = async (id) => {
  const bindingId = await getBindingId(id)
  return await service.bindings(bindingId).remove()
}

// delete multiple contacts by id
export const deleteContacts = pluralizer(deleteContact)

// replace multiple tags for 1 contact by id
export const putContact = async ({ tags = [], id }) => {
  const { number } = await getContact(id)
  const contact = await service.bindings.create({
    identity: id,
    bindingType: 'sms',
    tag: tags,
    address: number
  })

  return contactSubset(contact)
}

// replace multiple tags for multiple contacts by id
export const putContacts = pluralizer(putContact)

// add multiple tags to 1 contact by id
export const patchContact = async ({ tags = [], id }) => {
  const { number, tags: oldTags } = await getContact(id)
  const contact = await service.bindings.create({
    identity: id,
    bindingType: 'sms',
    tag: [...new Set([...tags, ...oldTags])],
    address: number
  })

  return contactSubset(contact)
}

// add multiple tags to multiple contacts by id
export const patchContacts = pluralizer(patchContact)

// delete multiple tags for multiple contacts
export const deleteTags = async ({ tags = [], id }) => {
  const { number, tags: oldTags } = await getContact(id)
  const contact = await service.bindings.create({
    identity: id,
    bindingType: 'sms',
    tag: [...oldTags.filter(tag => !tags.includes(tag))],
    address: number
  })

  return contactSubset(contact)
}

export const getTags = async () => {
  const allUsers = await getContacts("all")
  return allUsers.reduce((acc, cur) => {
    return [
      ...acc,
      ...cur.tags.filter(tag => !acc.includes(tag))
    ]
  }, [])
}

export const getText = async (id) => {
  const message = await client.messages(id).fetch()
  return messageHistorySubset(message)
}

// get history of contact by id
export const getContactHistory = async (id) => {
  const { number } = await getContact(id)
  return [
    ...(await client.messages.list({
      from: number,
      to: process.env.TWILIO_NUMBER
    })).map(message => messageHistorySubset(message)),
    ...(await client.messages.list({
      from: process.env.TWILIO_NUMBER,
      to: number
    })).map(message => messageHistorySubset(message))
  ].sort((a, b) => Date.parse(a.dateSent) - Date.parse(b.dateSent))
}

// broadcast message by tag
export const createMessage = async ({ tag = "all", message }) => {
  const id = uuidv4()
  const msg = await service.notifications.create({
    tag: tag,
    body: message,
    deliveryCallbackUrl: process.env.NEXTAUTH_URL + "/api/messages/" + id
  })

  msg.id = id

  return createMessageSubset(msg)
}

export const createMessages = pluralizer(createMessage)

// create a twiml response
export const twimlResponse = async (body) => {
  let twiml = new twilio.twiml.MessagingResponse()
  twiml.message(body)
  return twiml.toString()
}