import { NextPage } from 'next'
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { useRouter } from 'next/router'
import CreatorPage from '@/components/CreatorPage'
import { useEffect } from 'react'
import { useState } from 'react'

const Creator: NextPage = () => {
  const { query } = useRouter()
  const [creator, setCreator] = useState<any>()

  useEffect(() => {

    console.log("fetching")
    console.log(query)


    fetch('../api/creators',
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(query.creator)
      }
    ).then((data)=> {return data.json()}).then((data)=>{
      console.log("found creator")
      console.log(data)
      setCreator(data[0])})

  }, [query])

  console.log(query)
  return (
    <div className='flex flex-col min-h-screen'>
      <Head>
        <title>Open Editions - Creator</title>
        <meta name='description' content='Open Editions from 0xBanana and friends' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main className={styles.main}>
        {creator != null  && 
        <CreatorPage creator={creator} />
        }
      </main>
      <Footer />
    </div>
  )
}

export default Creator
