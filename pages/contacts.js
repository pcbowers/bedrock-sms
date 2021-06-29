import { getSession } from 'next-auth/client'
import { useEffect, useState } from 'react'

import Navbar from '../components/Navbar'

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

export default function EditContacts({ session }) {
  const [contacts, setContacts] = useState(null)

  useEffect(async () => {
    setContacts(await (await (await fetch("/api/contacts?tag=all")).json()))
  }, [])

  return <>
    <Navbar user={session.user} />
    <pre className="text-gray-700 dark:text-gray-100">{JSON.stringify(contacts, null, 2)}</pre>
  </>
}
