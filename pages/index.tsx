/* eslint-disable @next/next/no-img-element */
import { useState, Component, useMemo, useEffect } from 'react'
import { NextPage } from 'next'
import Head from 'next/head'
import { toast } from 'react-toastify'
import styles from '@/styles/Home.module.css'
import EditionCard from '@/components/EditionCard'
import Link from 'next/link'

const Home: NextPage = () => {
  const [mintsOnSale, setMintsOnSale] = useState<any[]>([])

  useEffect(() => {
    fetch('api/editions').then((d) => {
      console.log("we got some editions")
      return d.json()
    }).then((data) => {
      console.log(data)
      setMintsOnSale(data)
    })
  }, [])



  return (
    <div className='flex flex-col min-h-screen'>
      <Head>
        <title>Banana Market - Home</title>
        <meta
          name='description'
          content='Open Editions from 0xBanana and friends'
        />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main className={styles.main}>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {mintsOnSale.length > 0 && mintsOnSale.sort((a, b) => 0.5 - Math.random()).map((mint) =>
            <Link href={`edition/${mint.mint}`} passHref>
              <a>
              <EditionCard edition={mint.mint} creator={mint.creator} />
              </a>
            </Link>
          )}
        </div>
      </main>
    </div>
  )
}

export default Home
