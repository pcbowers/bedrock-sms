
import Image from 'next/image'
import Link from 'next/link'

import { getSession } from 'next-auth/client'

import ContactImage from "../public/contact.jpg"
import KeywordImage from "../public/keyword.jpg"
import BroadcastImage from "../public/broadcast.jpg"
import AdminImage from "../public/admin.jpg"

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

export default function PrivateHome({ session }) {
  return <>
    <Navbar user={session.user} />

    <main className="w-full h-full mt-10 flex justify-center content-center items-center">
      <section className="container p-6 mx-auto bg-white dark:bg-gray-700">
        <h2 className="text-center text-xl font-medium text-gray-800 capitalize dark:text-white md:text-2xl">Hello <span className="text-yellow-600">{session.user.name}</span>.</h2>
        <h3 className="text-center text-lg font-medium text-gray-800 capitalize dark:text-white md:text:xl">What do you want to do today?</h3>

        <div className="flex items-center justify-center">
          <div className="grid gap-8 mt-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <Link href="/contacts">
              <a>
                <div className="w-full max-w-xs text-center transition-all duration-500 hover:bg-gray-200 dark:hover:bg-gray-600 hover:shadow-2xl pb-3 rounded-lg">
                  <Image className="object-cover object-center w-full h-48 mx-auto rounded-lg" src={ContactImage} alt="avatar" />
                  <div className="mt-2">
                    <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200">Edit Contacts</h3>
                  </div>
                </div>
              </a>
            </Link>

            <Link href="#">
              <a>
                <div className="w-full max-w-xs text-center transition-all duration-500 hover:bg-gray-200 dark:hover:bg-gray-600 hover:shadow-2xl pb-3 rounded-lg">
                  <Image className="object-cover object-center w-full h-48 mx-auto rounded-lg" src={KeywordImage} alt="avatar" />
                  <div className="mt-2">
                    <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200">Edit Keywords</h3>
                    <span className="mt-1 font-medium text-gray-600 dark:text-gray-300">Coming Soon</span>
                  </div>
                </div>
              </a>
            </Link>

            <Link href="/broadcast">
              <a>
                <div className="w-full max-w-xs text-center transition-all duration-500 hover:bg-gray-200 dark:hover:bg-gray-600 hover:shadow-2xl pb-3 rounded-lg">
                  <Image className="object-cover object-center w-full h-48 mx-auto rounded-lg" src={BroadcastImage} alt="avatar" />
                  <div className="mt-2">
                    <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200">Broadcast Message</h3>
                  </div>
                </div>
              </a>
            </Link>

            <Link href="#">
              <a>
                <div className="w-full max-w-xs text-center transition-all duration-500 hover:bg-gray-200 dark:hover:bg-gray-600 hover:shadow-2xl pb-3 rounded-lg">
                  <Image className="object-cover object-center w-full h-48 mx-auto rounded-lg" src={AdminImage} alt="avatar" />
                  <div className="mt-2">
                    <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200">Edit Admins</h3>
                    <span className="mt-1 font-medium text-gray-600 dark:text-gray-300">Coming Soon</span>
                  </div>
                </div>
              </a>
            </Link>
          </div>
        </div>
      </section>
    </main>
  </>
}
