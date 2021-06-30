import { getSession } from 'next-auth/client'
import { useEffect, useMemo, useState } from 'react'

import Navbar from '../components/Navbar'
import Table from '../components/Table'

import Link from 'next/link'

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

const Tags = ({ values }) => {
  return (
    <>
      {values.map((tag, idx) => {
        return (
          <span key={idx} className="inline-flex items-center justify-center px-2 py-1 text-xs mr-1 font-bold leading-none text-gray-100 bg-yellow-600 rounded">
            {tag}
          </span>
        )
      })}
    </>
  );
}

const Actions = ({ data, row, setData }) => {
  return (
    <div className="flex item-center justify-center">
      <button onClick={async () => {
        let newTags = prompt(`To update the tags for ${row.original.number}, simply write in your tags separated by a comma. Make sure each tag only contains lowercase letters a-z.`, row.original.tags.join(","))
        if (newTags !== null && new RegExp("^[a-z,]*$").test(newTags)) {
          if (newTags === "") newTags = []
          else newTags = newTags.split(",")
          try {
            await fetch(`/api/contacts/${row.original.id}`, {
              method: "PUT",
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(newTags)
            })
            const newData = data.map(element => {
              if (element.id === row.original.id) element.tags = newTags
              return element
            })
            setData(newData)
          } catch (error) {
            alert(`Update failed. See the following message: ${error.message}`)
          }
        } else if (newTags !== null) {
          alert("Please try again. The tags must only include lowercase letters")
        }
      }}>
        <div className="w-4 mr-2 transform hover:text-purple-500 hover:scale-110">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </div>
      </button>
      <button onClick={async () => {
        const sure = confirm(`Are you sure you want to delete ${row.original.number}?`)
        if (sure) {
          try {
            await fetch(`/api/contacts/${row.original.id}`, { method: "DELETE" })
            const newData = data.filter(element => element.id !== row.original.id)
            setData(newData)
          } catch (error) {
            alert(`Delete failed. See the following message: ${error.message}`)
          }
        }
      }}>
        <div className="w-4 mr-2 transform hover:text-purple-500 hover:scale-110">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>
      </button>
    </div>
  )
}

export default function EditContacts({ session }) {
  const [data, setData] = useState([])

  useEffect(() => {
    (async () => {
      const results = await (await fetch("/api/contacts?tag=all")).json()
      setData(results.body)
    })()
  }, [])

  const addContacts = async () => {
    let newNumbers = prompt(`To add new numbers, simply write in the numbers you would like to add below. Make sure each # is formatted like so: +12345678901.`)
    if (newNumbers !== null && new RegExp("^[0-9+,]*$").test(newNumbers)) {
      if (newNumbers === "") newNumbers = []
      else newNumbers = newNumbers.split(",").map(number => ({ number }))
      try {
        if (newNumbers.length) {
          const newData = await (await fetch(`/api/contacts`, {
            method: "POST",
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(newNumbers)
          })).json()
          const updatedData = [
            ...newData.body,
            ...data
          ]
          setData(updatedData)
        }
      } catch (error) {
        alert(`Creation failed. See the following message: ${error.message}`)
      }
    } else if (newNumbers !== null) {
      alert("Please try again. The tags must only include lowercase letters")
    }
  }

  const columns = useMemo(() => [
    {
      Header: "Number",
      accessor: "number"
    },
    {
      Header: "Tags",
      accessor: "tags",
      Cell: ({ cell: { value } }) => <Tags values={value} />
    },
    {
      Header: "Last Updated",
      accessor: "dateUpdated",
      Cell: ({ cell: { value } }) => new Date(value).toLocaleString("en-US", {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
      })
    },
    {
      Header: "Actions",
      Cell: ({ data, row }) => <Actions data={data} row={row} setData={setData} />
    }
  ])

  return <>
    <Navbar user={session.user} />
    <main className="w-full h-full mt-10 flex justify-center content-center items-center">
      <section className="container p-6 mx-auto bg-white dark:bg-gray-700">
        <div className="w-full text-center">
          <button onClick={addContacts} className="px-4 py-2 text-white transition-colors duration-200 transform bg-yellow-600 rounded-md hover:bg-yellow-700 focus:outline-none focus:bg-yellow-700" value="Send Message">
            Add New Contacts
          </button>
        </div>
        <Table columns={columns} data={data} />
      </section>
    </main>

    {/* <pre className="text-gray-700 dark:text-gray-100">{JSON.stringify(contacts, null, 2)}</pre> */}
  </>
}
