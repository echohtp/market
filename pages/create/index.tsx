/* eslint-disable @next/next/no-img-element */
import { useState, Component, useMemo, useEffect } from 'react'
import { PublicKey, Transaction } from '@solana/web3.js'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useWallet, useConnection } from '@solana/wallet-adapter-react'
import { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import {
  createTransferInstruction,
  getAssociatedTokenAddress,
  NATIVE_MINT
} from '@solana/spl-token'
import { toast } from 'react-toastify'
import { LAMPORTS_PER_SOL, SystemProgram } from '@solana/web3.js'
import EditionPage from "@/components/EditionPage";
import styles from '@/styles/Home.module.css'
import { useRouter } from 'next/router'

const Create: NextPage = () => {
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
        <div className='grid md:grid-cols-2 md:grid-flow-cols gap-4'>
          <div>
          <Link href={"/create/nft"} passHref>
            <button className="h-48 w-48 border border-black rounded-lg">Create NFT</button>
            </Link>
          </div>
          <div>
          <Link href={"/create/listing"} passHref>
          <button className="h-48 w-48 border border-black rounded-lg">Create Listing</button>
          </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Create
