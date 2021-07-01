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

export function Actions({ data, row, setData }) {
  return (
    <div className="flex item-center justify-center">
      <button onClick={async () => {
        let newNumber = prompt(`To update the number for ${row.original.email}, simply write in your new number in the following format: +12345678901`, row.original.phone)
        if (newNumber !== null && new RegExp("^[0-9+,]*$").test(newNumber)) {
          try {
            await fetch(`/api/admins/${row.original.email}`, {
              method: "PUT",
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(newNumber)
            })
            const newData = data.map(element => {
              if (element.email === row.original.email) element.phone = newNumber
              return element
            })
            setData(newData)
          } catch (error) {
            alert(`Update failed. See the following message: ${error.message}`)
          }
        } else if (newNumber !== null) {
          alert("Please try again. The number must be formatted properly.")
        }
      }}>
        <div className="w-4 mr-2 transform hover:text-yellow-600 hover:scale-110">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </div>
      </button>
      <button onClick={async () => {
        const sure = confirm(`Are you sure you want to delete ${row.original.email}?`)
        if (sure) {
          try {
            await fetch(`/api/admins/${row.original.email}`, { method: "DELETE" })
            const newData = data.filter(element => element.email !== row.original.email)
            setData(newData)
          } catch (error) {
            alert(`Delete failed. See the following message: ${error.message}`)
          }
        }
      }}>
        <div className="w-4 mr-2 transform hover:text-yellow-600 hover:scale-110">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>
      </button>
    </div>
  )
}

export default function EditAdmins({ session }) {
  const [data, setData] = useState([])

  useEffect(() => {
    (async () => {
      const results = await (await fetch("/api/admins")).json()
      console.log(results)
      setData(results.body)
    })()
  }, [])

  const addAdmins = async () => {
    let newAdmins = prompt(`To add new admins, simply write in the admin emails you would like to add below. Make sure each email is formatted like so: email@example.com.`)
    if (newAdmins !== null) {
      if (newAdmins === "") newAdmins = []
      else newAdmins = newAdmins.split(",").map(email => ({ email }))
      try {
        if (newAdmins.length) {
          const newData = await (await fetch(`/api/admins`, {
            method: "POST",
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(newAdmins)
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
    } else if (newAdmins !== null) {
      alert("Please try again. The emails must be valid.")
    }
  }

  const columns = useMemo(() => [
    {
      Header: "Email",
      accessor: "email"
    },
    {
      Header: "Phone Number",
      accessor: "phone",
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
    <main className="w-full h-full mt-10 flex justify-center content-center items-center">
      <section className="container p-6 mx-auto bg-white dark:bg-gray-700">
        <div className="w-full text-center">
          <button onClick={addAdmins} className="px-4 py-2 text-white transition-colors duration-200 transform bg-yellow-600 rounded-md hover:bg-yellow-700 focus:outline-none focus:bg-yellow-700" value="Send Message">
            Add New Admins
          </button>
        </div>
        <Table columns={columns} data={data} />
      </section>
    </main>

    {/* <pre className="text-gray-700 dark:text-gray-100">{JSON.stringify(contacts, null, 2)}</pre> */}
  </>
}
