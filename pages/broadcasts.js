import { getSession } from 'next-auth/client'

import Link from 'next/link'

import Navbar from '../components/Navbar'
import SMSCalculator from '../lib/sms_calculator'
import Table from '../components/Table'

import { useState, useEffect, useMemo } from 'react'

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

export function Actions({ row }) {
  return (
    <div className="flex item-center justify-center">
      <Link href={{
        pathname: `/broadcasts/${row.original.id}`,
        query: { message: encodeURIComponent(row.original.body) }
      }}>
        <a>
          <div className="w-4 mr-2 transform hover:text-yellow-600 hover:scale-110">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
        </a>
      </Link>
    </div>
  )
}


export default function BroadcastMessage({ session }) {
  const [message, setMessage] = useState("")
  const [tag, setTag] = useState("all")
  const [tags, setTags] = useState([])
  const [calculator, setCalculator] = useState(SMSCalculator.getCount(""))
  const [data, setData] = useState([])

  useEffect(() => {
    (async () => {
      const results = await (await fetch("/api/tags")).json()
      setTags(results.body)
    })();

    (async () => {
      const results = await (await fetch("/api/messages")).json()
      setData(results.body)
    })();
  }, [])

  useEffect(() => {
    setCalculator(SMSCalculator.getCount(message))
  }, [message])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (message === "") {
      alert("You must enter a broadcast message.")
      return
    }

    const body = { message: message }
    if (tag) body.tag = tag

    const results = await (await fetch("/api/messages", {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json'
      }
    })).json()

    if (results.error) {
      alert(results.error)
    } else {
      setData([
        ...results.body,
        ...data
      ])
    }

    setMessage("")
  }

  const columns = useMemo(() => [
    {
      Header: "Message",
      accessor: "body"
    },
    {
      Header: "Tag",
      accessor: "tag",
    },
    {
      Header: "Date Sent",
      accessor: "date",
      Cell: function DateCells({ cell: { value } }) {
        return new Date(value).toLocaleString("en-US", {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric'
        })
      }
    },
    {
      Header: "Total",
      accessor: "total"
    },
    {
      Header: "Queued",
      accessor: "queued"
    },
    {
      Header: "Failed",
      accessor: "failed"
    },
    {
      Header: "Sent",
      accessor: "sent"
    },
    {
      Header: "Delivered",
      accessor: "delivered"
    },
    {
      Header: "Undelivered",
      accessor: "undelivered"
    },
    {
      Header: "Actions",
      Cell: function ActionCells({ data, row }) {
        return <Actions data={data} row={row} setData={setData} />
      }
    }
  ], [])

  return <>
    <Navbar user={session.user} />
    <main className="w-full h-full mt-10 flex flex-wrap justify-center content-center items-center">
      <section className="block flex-1 bg-gray-200 w-full max-w-2xl px-6 py-4 mx-1 bg-white rounded-md shadow-md dark:bg-gray-800">
        <form onSubmit={handleSubmit}>
          <div className="w-full mb-4">
            <label className="block mb-2 text-xl font-medium text-gray-600 dark:text-gray-200">Tag</label>
            <select className="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring capitalize" value={tag} onChange={e => setTag(e.target.value)}>
              <option value="all">all</option>
              {tags.map(tag => {
                return <option value={tag} key={tag}>{tag}</option>
              })}
            </select>
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
      <section className="block w-full p-6 mx-auto bg-white dark:bg-gray-700">
        <Table columns={columns} data={data} />
      </section>
    </main>
  </>
}
