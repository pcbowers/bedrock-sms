import Head from 'next/head'
import styles from '../styles/Admin.module.css'

import { useSession, getSession, signOut } from 'next-auth/client'

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

export default function Admin() {
  const [session] = useSession()

  const handleSignout = (e) => {
    e.preventDefault()
    signOut()
  }

  return <>
    <Head>
      <title>NextJS Auth Template</title>
      <meta name="description" content="NextJS Auth Template" />
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to the NextJS Auth Template
        </h1>
        <p className={styles.description}>
          You can view this page because you are signed in.
        </p>
        <p className={styles.description}>
          <a href="#" onClick={handleSignout} className="btn-signin">
            Sign out from {session.user.email}
          </a>
        </p>
      </main>
    </div>
  </>
}
