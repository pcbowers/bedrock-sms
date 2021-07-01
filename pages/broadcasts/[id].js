import { getSession } from 'next-auth/client'
import { useRouter } from 'next/router'

import { useEffect, useState, useMemo } from 'react'

import Navbar from '../../components/Navbar'
import Table from '../../components/Table'

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
      setData((await (await fetch(url)).json()).body.data)
    })();
  }, [url])

  return data
}

function DisplayData({ data, message, id }) {
  const [newData, setNewData] = useState([])

  useEffect(() => {
    (async () => {
      if (data[0] && data[0].identity) {
        console.log('here')
        const results = await Promise.all(data.map(async datum => {
          return (await (await (fetch(`/api/texts/${datum.sid}`))).json()).body
        }))
        await fetch(`/api/texts/${id}`, {
          method: "POST",
          body: JSON.stringify(results),
          headers: {
            'Content-Type': 'application/json'
          }
        })
        setNewData(results)
      } else
        setNewData(data)
    })()
  }, [data, id])

  const columns = useMemo(() => [
    {
      Header: "To",
      accessor: "to"
    },
    {
      Header: "Status",
      accessor: "status",
    },
    {
      Header: "Error Message",
      accessor: "errorMessage"
    },
    {
      Header: "Error Code",
      accessor: "errorCode",
      Cell: function ErrorCode({ cell: { value } }) {
        return <>
          {!!value && (
            <a className="inline-flex items-center justify-center px-2 py-1 text-xs mr-1 font-bold leading-none text-gray-100 bg-yellow-600 rounded" target="_blank" rel="noreferrer" href={`https://www.twilio.com/docs/api/errors/${value}`}>
              {value}
            </a>
          )}
        </>
      }
    }
  ], [])

  return <>
    {(!newData || !newData.length) && (
      <p className="p-2 text-gray-800 dark:text-gray-100 text-center bg-gray-200 dark:bg-gray-800">
        Loading Message Statuses for
        <span className="font-bold"> &lsquo;{message}&lsquo;</span>
      </p>
    )}
    {(!!newData && !!newData.length) && (
      <>
        <div className="text-center mb-2">
          <span className="rounded-lg p-2 text-lg text-gray-800 dark:text-gray-100 text-center">
            Individual Broadcast Statuses:
            <span className="font-bold"> &lsquo;{message}&lsquo;</span>
          </span>
        </div>
        <Table columns={columns} data={newData} />
      </>
    )}
  </>
}

export default function ViewContact({ session }) {
  const router = useRouter()
  const { id, message } = router.query

  const data = useData(`/api/messages/${id}`)

  return <>
    <Navbar user={session.user} />
    <main className="w-full h-full mt-10 p-1 flex flex-wrap justify-center content-center items-center">
      <section className="block w-full p-6 mx-auto bg-white dark:bg-gray-700">
        {(!data || !data.length) && (
          <p className="p-2 text-gray-800 dark:text-gray-100 text-center bg-gray-200 dark:bg-gray-800">
            No User Data for Broadcast
            <span className="font-bold"> &lsquo;{decodeURIComponent(message)}&lsquo;</span>
          </p>
        )}
        {(!!data && !!data.length) && (
          <DisplayData data={data} message={decodeURIComponent(message)} id={id} />
        )}
      </section>
    </main>
  </>
}