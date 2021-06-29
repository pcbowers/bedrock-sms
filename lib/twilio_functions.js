import { v4 as uuidv4 } from 'uuid';

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

// FUNCTIONAL PROGRAMMING FUNCTIONS
// Create a subset of the contact elements
const contactSubset = ({
  sid: bindingId,
  identity: id,
  address: number,
  tags,
  dateCreated,
  dateUpdated
}) => {
  return {
    bindingId,
    id,
    number,
    tags,
    dateCreated,
    dateUpdated
  }
}

// Create a subset of the contact elements
const messageSubset = ({
  body: message,
  direction,
  numSegments,
  from,
  to,
  dateSent,
  price,
  status,
  errorMessage
}) => {
  return {
    message,
    direction,
    numSegments,
    from,
    to,
    dateSent,
    price,
    status,
    errorMessage
  }
}

const createMessageSubset = ({
  sid: id,
  tags,
  identities,
  body,
  dateCreated
}) => {
  return {
    id,
    tags,
    identities,
    body,
    dateCreated,
  }
}

// Pluralize a single promise and connect them altogether
const pluralizer = (func) => {
  return async (elements) => {
    return await Promise.all(elements.map(async (element) => {
      return await func(element)
    }));
  }
}

// TWILIO HELPER FUNCTIONS
// get a binding id based on a contact's id
const getBindingId = async (id) => {
  return (await service.bindings.list({
    identity: id
  }))[0].sid
}

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

  return contacts.map(contact => contactSubset(contact))
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

export const putContacts = pluralizer(putContact)

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

export const patchContacts = pluralizer(patchContact)

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

// get history of contact by id
export const getContactHistory = async (id) => {
  const { number } = await getContact(id)
  return [
    ...(await client.messages.list({
      from: number,
      to: process.env.TWILIO_NUMBER
    })).map(message => messageSubset(message)),
    ...(await client.messages.list({
      from: process.env.TWILIO_NUMBER,
      to: number
    })).map(message => messageSubset(message))
  ].sort((a, b) => Date.parse(b.dateSent) - Date.parse(a.dateSent))
}

// broadcast message by tag
export const createMessage = async ({ tag = "all", message }) => {
  const msg = await service.notifications.create({
    tag: tag,
    body: message,
    deliveryCallbackUrl: process.env.NEXTAUTH_URL + "/api/twilio/status"
  })

  return createMessageSubset(msg)
}

export const createMessages = pluralizer(createMessage)

// create a twiml response
export const twimlResponse = async (body) => {
  let twiml = new twilio.twiml.MessagingResponse()
  twiml.message(body)
  return twiml.toString()
}