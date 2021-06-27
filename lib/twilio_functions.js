import { v4 as uuidv4 } from 'uuid';

export const twilio = require('twilio')
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const service = client.notify.services(process.env.TWILIO_NOTIFY_SERVICE_SID);

const pluralizer = (func) => {
  return async (elements) => {
    return await Promise.all(elements.map(async (element) => {
      return await func(element)
    }));
  }
}

// list a single contact
export const listContact = async (bindingID) => {
  return await service.bindings(bindingID).fetch()
}

// list contacts by tag
export const listContacts = async (tag = "") => {
  return await service.bindings.list({
    tag: tag
  })
}

// get history of contact by bindingID
export const historyContact = async (bindingID) => {
  const { address: number } = await listContact(bindingID)
  return [
    ...(await client.messages.list({
      from: number,
      to: process.env.TWILIO_NUMBER
    })),
    ...(await client.messages.list({
      from: process.env.TWILIO_NUMBER,
      to: number
    }))
  ].sort((a, b) => Date.parse(b.dateUpdated) - Date.parse(a.dateUpdated))
}

// delete a contact
export const deleteContact = async (bindingID) => {
  return await service.bindings(bindingID).remove()
}

// delete multiple contacts
export const deleteContacts = pluralizer(deleteContact)

// create a contact
export const createContact = async ([tags = [], number]) => {
  return await service.bindings.create({
    identity: uuidv4(),
    bindingType: 'sms',
    tag: tags,
    address: number
  })
}

// create contacts
export const createContacts = pluralizer(createContact)

export const updateContact = async ([tags = [], bindingID]) => {
  const { identity, address: number } = await listContact(bindingID)
  return await service.bindings.create({
    identity: identity,
    bindingType: 'sms',
    tag: tags,
    address: number
  })
}

export const updateContacts = pluralizer(updateContact)

export const patchContact = async ([newTags = [], bindingID]) => {
  const { identity, address: number, tags: oldTags } = (await listContact(bindingID))
  return await service.bindings.create({
    identity: identity,
    bindingType: 'sms',
    tag: [...new Set([...newTags, ...oldTags])],
    address: number
  })
}

export const patchContacts = pluralizer(patchContact)

// broadcast message by tag
export const messageBroadcast = async (tag = "", body) => {
  return await service.notifications.create({
    tag: tag,
    body: body,
    deliveryCallbackUrl: process.env.NEXTAUTH_URL + "/api/twilio/status"
  })
}

// create a twiml response
export const twimlResponse = async (body) => {
  let twiml = new twilio.twiml.MessagingResponse()
  twiml.message(body)
  return twiml.toString()
}