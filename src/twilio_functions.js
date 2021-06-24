import { v4 as uuidv4 } from 'uuid';

const twilio = require('twilio')
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const service = client.notify.services(process.env.TWILIO_NOTIFY_SERVICE_SID);

// pluralizes an asynchronous call
const pluralizer = (func) => {
  return async (elements) => {
    return await Promise.all(elements.map(async (element) => {
      return await func(element)
    }));
  }
}

/*
contact {
  tags
  number
  bindingID
}
*/

export const listContact = async (bindingID) => {
  return await service.bindings(bindingID).fetch()
}

export const listContacts = async (tag = "all") => {
  return await service.bindings.list({
    tag: tag
  })
}

const deleteContact = async (bindingID) => {
  return await service.bindings(bindingID).remove()
}

export const deleteContacts = pluralizer(deleteContact)

const subscribeContact = async (contact) => {
  if (!contact.tag) contact.tag = [""]
  console.log(contact)
  return await service.bindings.create({
    identity: uuidv4(),
    bindingType: 'sms',
    tag: contact.tags,
    address: contact.number
  })
}

export const subscribeContacts = pluralizer(subscribeContact)

export const broadcastMessage = async (tag = "all", body) => {
  return await service.notifications.create({
    tag: tag,
    body: body
  })
}

export const respondToMessage = async (body) => {
  let twiml = new twilio.twiml.MessagingResponse()
  twiml.message(body)
  return twiml.toString()
}