import Link from 'next/link'

import { useState } from "react"
import { signOut } from 'next-auth/client'

export default function Navbar(props) {
  const [menuClass, setMenuClass] = useState("hidden")
  const [userClass, setUserClass] = useState("md:hidden")

  const toggleMenu = () => {
    setMenuClass(menuClass === "hidden" ? "block" : "hidden")
  }

  const toggleUser = () => {
    setUserClass(userClass === "md:hidden" ? "md:block" : "md:hidden")
  }

  const handleSignout = (e) => {
    e.preventDefault()
    signOut()
  }

  return (
    <nav className="bg-white shadow dark:bg-gray-800">
      <div className="container px-6 py-4 mx-auto">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex items-center justify-between">
            <div className="h-8 text-xl font-semibold text-gray-700">
              <Link href="/home"><a className="text-2xl font-bold text-gray-800 dark:text-white lg:text-3xl hover:text-gray-700 dark:hover:text-gray-300">
                <img src="/bedrock_logo_dark.png" className="object-cover h-8 hidden dark:block" />
                <img src="/bedrock_logo.png" className="object-cover h-8 dark:hidden" />
              </a></Link>

            </div>

            <div className="flex md:hidden">
              <button type="button" className="text-gray-500 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-400 focus:outline-none focus:text-gray-600 dark:focus:text-gray-400" aria-label="toggle menu" onClick={toggleMenu}>
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                  <path fillRule="evenodd" d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"></path>
                </svg>
              </button>
            </div>
          </div>

          <div className={"flex-1 md:flex md:items-center md:justify-between " + menuClass}>
            <div className="flex flex-col -mx-4 md:flex-row md:items-center md:mx-8">
              <Link href="#" >
                <a className="px-2 py-1 mx-2 mt-2 text-sm font-medium text-gray-700 transition-colors duration-200 transform rounded-md md:mt-0 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700">Edit Contacts</a>
              </Link>

              <Link href="#" >
                <a className="px-2 py-1 mx-2 mt-2 text-sm font-medium text-gray-700 transition-colors duration-200 transform rounded-md md:mt-0 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700">Edit Keywords</a>
              </Link>

              <Link href="#" >
                <a className="px-2 py-1 mx-2 mt-2 text-sm font-medium text-gray-700 transition-colors duration-200 transform rounded-md md:mt-0 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700">Broadcast Message</a>
              </Link>

              <Link href="#" >
                <a className="px-2 py-1 mx-2 mt-2 text-sm font-medium text-gray-700 transition-colors duration-200 transform rounded-md md:mt-0 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700">Edit Admins</a>
              </Link>

            </div>

            <div className="flex items-center mt-4 md:mt-0">
              <button type="button" className="flex items-center focus:outline-none" aria-label="toggle profile dropdown" onClick={toggleUser}>
                <div className="w-8 h-8 overflow-hidden border-2 border-gray-400 rounded-full">
                  <img src={props.user.image} alt="avatar" className="object-fill w-full h-full" />
                </div>

                <h3 className="mx-2 text-sm font-medium text-gray-700 dark:text-gray-200 md:hidden">
                  Hello, <b>{props.user.name}. </b>
                  <a className="underline" onClick={handleSignout} >
                    Sign Out?
                  </a>
                </h3>
              </button>

              <div className={"hidden md:block absolute lg:top-16 md:top-20 right-2 z-20 w-48 py-2 mt-2 bg-white rounded-md shadow-xl bg-gray-100 dark:bg-gray-700 " + userClass}>
                <h3 className="text-center mx-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                  Hello, <b>{props.user.name}</b><br />
                  <a className="underline" onClick={handleSignout} >
                    Sign Out?
                  </a>
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}