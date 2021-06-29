import { getSession } from 'next-auth/client'

import Navbar from '../components/Navbar'
import SMSCalculator from '../lib/sms_calculator'

import { useState, useEffect } from 'react'

export async function getServerSideProps(context) {
  const session = await getSession(context)
  if (session) return { props: { session } }
  return {
    redirect: {
      destination: '/api/auth/signin',
      permanent: false,
    }
  }
}

export default function BroadcastMessage({ session }) {
  const [message, setMessage] = useState("")
  const [tag, setTag] = useState("")
  const [calculator, setCalculator] = useState(SMSCalculator.getCount(""))

  useEffect(() => {
    setCalculator(SMSCalculator.getCount(message))
  }, [message])

  const handleSubmit = async (e) => {
    e.preventDefault()

    const body = { message: message }
    if (tag) body.tag = tag

    const results = await fetch("/api/messages", {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const obj = await results.json()

    if (obj.error) {
      alert(obj.error)
    } else {
      alert(`Message was broadcasted successfully at ${obj.body[0].dateCreated}\n\nid: ${obj.body[0].id}\nbody: "${obj.body[0].body}"\ntag: ${obj.body[0].tags[0]}`)
    }

    setMessage("")
  }

  return <>
    <Navbar user={session.user} />
    <main className="w-full h-full mt-10 flex justify-center content-center items-center">
      <section className="bg-gray-200 w-full max-w-2xl px-6 py-4 mx-1 bg-white rounded-md shadow-md dark:bg-gray-800">
        <form onSubmit={handleSubmit}>
          <div className="w-full mb-4">
            <label className="block mb-2 text-xl font-medium text-gray-600 dark:text-gray-200">Tag</label>
            <input type="text" className="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring" placeholder="Optional Contact Tag" value={tag} onChange={e => setTag(e.target.value)} />
          </div>
          <div className="w-full">
            <label className="block mb-2 text-xl font-medium text-gray-600 dark:text-gray-200">Message</label>
            <textarea className="block w-full h-40 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring" placeholder="Message to be Broadcast" value={message} onChange={e => setMessage(e.target.value)}></textarea>
            <div className="text-right text-gray-400 dark:text-gray-500">{calculator.remaining}/{calculator.maxCharCount} chars remaining ({calculator.numberOfSMS} SMS Messages)</div>
          </div>
          <div className="flex justify-center mt-6">
            <input type="submit" className="px-4 py-2 text-white transition-colors duration-200 transform bg-yellow-600 rounded-md hover:bg-yellow-700 focus:outline-none focus:bg-yellow-700" value="Send Message" />
          </div>
        </form>
      </section>
    </main>

  </>
}
