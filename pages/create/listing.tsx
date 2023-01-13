/* eslint-disable @next/next/no-img-element */
import { useState, Component, useMemo, useEffect } from 'react'
import { PublicKey, Transaction } from '@solana/web3.js'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useWallet, useConnection } from '@solana/wallet-adapter-react'
import { NextPage } from 'next'
import Head from 'next/head'
import {
  createTransferInstruction,
  getAssociatedTokenAddress,
  NATIVE_MINT
} from '@solana/spl-token'
import { toast } from 'react-toastify'
import { LAMPORTS_PER_SOL, SystemProgram } from '@solana/web3.js'
// import styles from '../styles/Home.module.css'
// import { priceTag } from '@components/edition'
import { priceTag } from '../../components/edition'
import { createBurnCheckedInstruction } from '@solana/spl-token';
// import mintsOnSale from '../data/onsale'
import Footer from '../../components/Footer'
import EditionPage from "../../components/EditionPage";
import styles from '../../../styles/Home.module.css'
import NavBar from '../../components/NavBar'
import { useRouter } from 'next/router'

const CreateListing: NextPage = () => {
  const { publicKey, connected, sendTransaction } = useWallet()
  const { connection } = useConnection()
  const [error, setError] = useState<boolean>(false)
  const [confetti, setConfetti] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [index, setIndex] = useState<number>(0)
  const [mintsOnSale, setMintsOnSale] = useState<any[]>([])
  const [burned, setBurned] = useState<number>(0)
  const [totalBurned, setTotalBurned] = useState<number>(0)
  
  const router = useRouter()

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
        <h1>Listing goes here</h1>
      </main>
    </div>
  )
}

export default CreateListing
