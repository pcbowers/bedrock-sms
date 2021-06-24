import { getSession } from 'next-auth/client'

export async function getServerSideProps(context) {
  const session = await getSession(context)

  // not logged in
  if (!session) return {
    // instead of redirecting, one could return empty props and show a public page instead
    // return { props {} }
    redirect: {
      destination: '/api/auth/signin',
      permanent: false,
    }
  }

  // logged in
  // instead of redirecting, one could return empty props and show a public page instead
  // return { props {} }
  return {
    redirect: {
      destination: '/admin',
      permanent: false,
    }
  }
}

export default function Home() {
  return <></>
}