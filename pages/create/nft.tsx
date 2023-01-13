/* eslint-disable @next/next/no-img-element */
import { useState, Component, useMemo, useEffect } from 'react'
import { useWallet, useConnection } from '@solana/wallet-adapter-react'
import { NextPage } from 'next'
import Head from 'next/head'
import { toast } from 'react-toastify'
import styles from '@/styles/Home.module.css'
import { useRouter } from 'next/router'
import NftMinter from '@/components/NftMinter'

const CreateNFT: NextPage = () => {
  return (
    <div className='flex flex-col min-h-screen'>
      {/* {confetti && <Confetti className='w-screen h-screen' />} */}
      <Head>
        <title>Banana Market - Create</title>
        <meta
          name='description'
          content='Open Editions from 0xBanana and friends'
        />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main className={styles.main}>
        <NftMinter/>
      </main>
    </div>
  )
}

export default CreateNFT
