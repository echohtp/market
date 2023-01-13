import { NextPage } from 'next'
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useEffect, useMemo } from 'react'

import { useState } from 'react'
import EditionPage from '@/components/EditionPageV2'
import { useRouter } from 'next/router'



const Edition: NextPage = (props) => {
  const { query } = useRouter()
  const [edition, setEdition] = useState<any>()
  const [loading, setLoading] = useState<boolean>(true)
  // get listing data from db
  useEffect(() => {
    fetch('../api/editions', {
      method: "POST",
      body: JSON.stringify(query.edition)
    }).then((d) => { return d.json() })
      .then((d) => { setEdition(d); setLoading(false) })
  }, [query])


  return (
    <div className='flex flex-col min-h-screen'>
      <Head>
        <title>Open Editions - About</title>
        <meta name='description' content='Open Editions from 0xBanana and friends' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main className={styles.main}>
        {!loading &&
          <EditionPage edition={edition} open={true} doIt={() => { }} />
        }
      </main>
    </div>
  )
}

export default Edition
