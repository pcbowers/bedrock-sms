import { getSession } from 'next-auth/client'
import { useRouter } from 'next/router'

import { useEffect, useState, useRef } from 'react'

import Navbar from '../../components/Navbar'

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

function useData(url) {
  const [data, setData] = useState([])

  useEffect(() => {
    (async () => {
      setData((await (await fetch(url)).json()).body)
    })();
  }, [url])

  return data
}

function IncomingMessage({ datum }) {
  return <>
    <div className="bg-yellow-100 float-left w-3/4 mx-4 my-2 p-2 rounded-lg break-words">
      {datum.message}
    </div>
    <p className="float-left text-left ml-5 text-xs text-gray-500 w-3/4">
      {
        new Date(datum.dateSent).toLocaleString("en-US", {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
        })
      } | {
        `${datum.numSegments} ${datum.numSegments === "1" ? "Segment" : "segment"} (${datum.status}) `
      }
      {datum.errorCode && (
        <a className="underline" target="_blank" rel="noreferrer" href={`https://www.twilio.com/docs/api/errors/${datum.errorCode}`}>
          {"error: " + (datum.errorMessage || datum.errorCode)}
        </a>
      )}
    </p>
  </>
}

function OutgoingMessage({ datum }) {
  return <>
    <div className="bg-yellow-500 float-right w-3/4 mx-4 my-2 p-2 rounded-lg break-words">
      {datum.message}
    </div>
    <p className="float-right text-right mr-5 text-xs text-gray-500 w-3/4">
      {
        new Date(datum.dateSent).toLocaleString("en-US", {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
        })
      } | {
        `${datum.numSegments} ${datum.numSegments === "1" ? "Segment" : "segment"} (${datum.status}) `
      }
      {datum.errorCode && (
        <a className="underline" target="_blank" rel="noreferrer" href={`https://www.twilio.com/docs/api/errors/${datum.errorCode}`}>
          {"error: " + (datum.errorMessage || datum.errorCode)}
        </a>
      )}
    </p>
  </>
}

function Messages({ data, userData }) {
  if (!data && userData && userData.number) {
    return (
      <p className="text-gray-800 dark:text-gray-100 text-center">
        There have been no messages in the past 13 months for {userData.number}.
      </p>
    )
  } else if (!data || !userData) {
    return (
      <p className="text-gray-800 dark:text-gray-100 text-center">
        There have been no messages in the past 13 months.
      </p>
    )
  } else {
    return <>
      <h3 className="text-gray-800 dark:text-gray-100 text-center text-xl mb-5 font-medium">
        Message History for {userData.number} (13 Months)
      </h3>
      {
        data.map((datum) => {
          if (datum.direction === "inbound") return <IncomingMessage key={datum.id} datum={datum} />
          return <OutgoingMessage key={datum.id} datum={datum} />
        })
      }
    </>
  }
}

export default function ViewContact({ session }) {
  const router = useRouter()
  const { id } = router.query

  const data = useData(`/api/contacts/${id}/history`)
  const userData = useData(`/api/contacts/${id}`)

  const divRef = useRef(null);

  useEffect(() => {
    divRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [data]);

  return <>
    <Navbar user={session.user} />
    <main className="w-full h-full mt-10 p-1 flex flex-wrap justify-center content-center items-center">
      <section className="block flex-1 mb-10 bg-gray-200 w-full max-w-2xl px-6 py-4 bg-white rounded-md shadow-md dark:bg-gray-800">
        <Messages data={data} userData={userData} />
        <div ref={divRef} className="block float-right"></div>
      </section>
    </main>
  </>
}