import type { AppProps as Props } from 'next/app'
import Head from 'next/head'

export default function App({ Component, pageProps }: Props) {
  return (
    <>
      <Head>
        <title>Steam Login Example</title>
      </Head>

      <Component {...pageProps} />
    </>
  )
}