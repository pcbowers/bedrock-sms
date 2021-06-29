import Link from 'next/link'
import Image from 'next/image'

import LogoLight from '../public/bedrock_logo.png'
import LogoDark from '../public/bedrock_logo_dark.png'

import { useState, useEffect } from "react"
import { signOut } from 'next-auth/client'

export default function Navbar(props) {
  const [menuClass, setMenuClass] = useState("hidden")
  const [userClass, setUserClass] = useState("md:hidden")
  const [darkMode, setDarkMode] = useState("light");

  const toggleMenu = () => {
    setMenuClass(menuClass === "hidden" ? "block" : "hidden")
  }

  useEffect(() => {
    if (!localStorage.theme && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode("dark")
      document.documentElement.classList.add("dark")
    } else if (localStorage.theme) {
      setDarkMode(localStorage.theme)
      if (localStorage.theme === "dark") {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }
    } else {
      setDarkMode("light")
      document.documentElement.classList.remove("dark")
    }
  }, [])

  const toggleUser = () => {
    setUserClass(userClass === "md:hidden" ? "md:block" : "md:hidden")
  }

  const handleSignout = (e) => {
    e.preventDefault()
    signOut()
  }

  const toggleDarkMode = () => {
    localStorage.theme = darkMode === "dark" ? "light" : "dark"
    setDarkMode(localStorage.theme)
    if (darkMode === "dark") {
      setDarkMode("light")
      localStorage.theme = "light"
      document.documentElement.classList.remove("dark")
    } else {
      setDarkMode("dark")
      localStorage.theme = "dark"
      document.documentElement.classList.add("dark")
    }
  }

  let modeIcon
  if (darkMode !== "dark") {
    modeIcon = <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg >
  } else {
    modeIcon = <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  }

  return (
    <header>
      <nav className="bg-white shadow dark:bg-gray-800">
        <div className="container px-6 py-4 mx-auto">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex items-center justify-between">
              <div className="relative h-10 w-40 text-xl font-semibold text-gray-700">
                <Link href="/home"><a className="text-2xl font-bold text-gray-800 dark:text-white lg:text-3xl hover:text-gray-700 dark:hover:text-gray-300">
                  <div className="hidden dark:block">
                    <Image src={LogoDark} layout="fill" display="none" objectFit="contain" />
                  </div>
                  <div className="block dark:hidden">
                    <Image src={LogoLight} style="display: none;" layout="fill" objectFit="contain" />
                  </div>
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

                <Link href="/broadcast" >
                  <a className="px-2 py-1 mx-2 mt-2 text-sm font-medium text-gray-700 transition-colors duration-200 transform rounded-md md:mt-0 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700">Broadcast Message</a>
                </Link>

                <Link href="#" >
                  <a className="px-2 py-1 mx-2 mt-2 text-sm font-medium text-gray-700 transition-colors duration-200 transform rounded-md md:mt-0 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700">Edit Admins</a>
                </Link>

              </div>

              <div className="flex items-center mt-4 md:mt-0">
                <button className="mr-4 text-gray-600 md:block dark:text-gray-200 hover:text-gray-700 dark:hover:text-gray-400 focus:text-gray-700 dark:focus:text-gray-400 focus:outline-none" aria-label="show notifications" onClick={toggleDarkMode}>
                  {modeIcon}
                </button>

                <button type="button" className="flex items-center focus:outline-none" aria-label="toggle profile dropdown" onClick={toggleUser}>
                  <div className="relative w-8 h-8 overflow-hidden border-2 border-gray-400 rounded-full">
                    <Image src={props.user.image} layout="fill" objectFit="cover" alt="avatar" />
                  </div>

                  <h3 className="mx-2 text-sm font-medium text-gray-700 dark:text-gray-200 md:hidden">
                    Hello, <b>{props.user.name}. </b>
                    <a className="underline" onClick={handleSignout} >
                      Sign Out?
                    </a>
                  </h3>
                </button>

                <div className={"hidden bg-gray-100 md:block absolute lg:top-18 md:top-20 right-2 z-20 w-48 py-2 mt-2 bg-white rounded-md shadow-xl bg-gray-100 dark:bg-gray-600 " + userClass}>
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
      </nav >
    </header >
  )
}
