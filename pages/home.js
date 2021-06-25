import Head from 'next/head'

import { useSession, getSession } from 'next-auth/client'

import Navbar from '../components/Navbar';

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

export default function PrivateHome() {
  const [session] = useSession()

  const handleSignout = (e) => {
    e.preventDefault()
    signOut()
  }

  return <>
    <Head>
      <title>Bedrock SMS</title>
      <meta name="description" content="NextJS Auth Template" />
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <header>
      <Navbar user={session.user} />
    </header>

    <main className="w-full h-full mt-10 flex justify-center content-center items-center">
      <section className="container p-6 mx-auto bg-white dark:bg-gray-800">
        <h2 className="text-center text-xl font-medium text-gray-800 capitalize dark:text-white md:text-2xl">Hello <span className="text-yellow-600">{session.user.name}</span>.</h2>
        <h3 className="text-center text-lg font-medium text-gray-800 capitalize dark:text-white md:text:xl">What do you want to do today?</h3>

        <div className="flex items-center justify-center">
          <div className="grid gap-8 mt-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <div className="w-full max-w-xs text-center transition-all duration-500 hover:bg-gray-200 dark:hover:bg-gray-700 hover:shadow-2xl pb-3 rounded-lg">
              <img className="object-cover object-center w-full h-48 mx-auto rounded-lg" src="https://images.unsplash.com/photo-1528642474498-1af0c17fd8c3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" alt="avatar" />

              <div className="mt-2">
                <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200">Edit Contacts</h3>
                <span className="mt-1 font-medium text-gray-600 dark:text-gray-300">Coming Soon</span>
              </div>
            </div>

            <div className="w-full max-w-xs text-center transition-all duration-500 hover:bg-gray-200 dark:hover:bg-gray-700 hover:shadow-2xl pb-3 rounded-lg">
              <img className="object-cover object-center w-full h-48 mx-auto rounded-lg" src="https://images.unsplash.com/photo-1597392582469-a697322d5c16?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80" alt="avatar" />

              <div className="mt-2">
                <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200">Edit Keywords</h3>
                <span className="mt-1 font-medium text-gray-600 dark:text-gray-300">Coming Soon</span>
              </div>
            </div>

            <div className="w-full max-w-xs text-center transition-all duration-500 hover:bg-gray-200 dark:hover:bg-gray-700 hover:shadow-2xl pb-3 rounded-lg">
              <img className="object-cover object-center w-full h-48 mx-auto rounded-lg" src="https://images.unsplash.com/photo-1545987796-200677ee1011?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80" alt="avatar" />

              <div className="mt-2">
                <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200">Broadcast Message</h3>
                <span className="mt-1 font-medium text-gray-600 dark:text-gray-300">Coming Soon</span>
              </div>
            </div>

            <div className="w-full max-w-xs text-center transition-all duration-500 hover:bg-gray-200 dark:hover:bg-gray-700 hover:shadow-2xl pb-3 rounded-lg">
              <img className="object-cover object-center w-full h-48 mx-auto rounded-lg" src="https://images.unsplash.com/photo-1616531770192-6eaea74c2456?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80" alt="avatar" />

              <div className="mt-2">
                <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200">Edit Admins</h3>
                <span className="mt-1 font-medium text-gray-600 dark:text-gray-300">Coming Soon</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  </>
}
