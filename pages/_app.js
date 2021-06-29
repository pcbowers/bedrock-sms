import Head from 'next/head'

import 'tailwindcss/tailwind.css'
import '../styles/global.css'

import { Provider } from 'next-auth/client'


function MyApp({ Component, pageProps }) {

  return (
    <Provider session={pageProps.session}>
      <Head>
        <title>Bedrock SMS</title>
        <meta name="description" content="Bedrock SMS Admin Console" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </Provider>
  )
}

export default MyApp
