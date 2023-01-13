// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from 'next'
import { Metaplex, keypairIdentity } from '@metaplex-foundation/js'
import { Connection, LAMPORTS_PER_SOL, PublicKey, Transaction, SystemProgram } from '@solana/web3.js'
import { Keypair } from '@solana/web3.js'
import bs58 from 'bs58'
import client, { Connection as ampConnection, Channel } from 'amqplib'
// import mintsOnSale from '../../data/onsale'
import clientPromise from "../../lib/mongodb";


type Data = {
  acct?: string
  error?: string
}

const SLOT_DIFFERENCE = 200

const verifyTx = async (connection: Connection, signature: string) => {
  console.log('verifying tx')

  let txResult = null
  let max = 3
  let i = 0
  do {
    txResult = await connection.getTransaction(signature, {
      commitment: 'confirmed',
      maxSupportedTransactionVersion: 0
    })
    if (txResult != null) break
  } while (i < max)

  return (txResult)
}

const verifySlot = async (connection: Connection, _slot: number) => {
  console.log('checking slot')
  const slot = await connection.getSlot()
  if (slot - SLOT_DIFFERENCE > _slot) return false
  return true
}

const verifyTill = () => {
  // const t1 =
  // txResult!.meta?.postTokenBalances?.at(1)?.uiTokenAmount.uiAmount || txResult!.meta?.postBalances?.at(1)

  // const t0 =
  // txResult!.meta?.preTokenBalances?.at(1)?.uiTokenAmount.uiAmount || txResult!.meta?.preBalances?.at(1)

  // console.log(t0, t1)

  // console.log('t0: ', t0)
  // console.log('t1: ', t1)
  // console.log('diff: ', Math.abs(Number(Number(t1! - t0!).toPrecision(2))))
  // console.log(Math.abs(Number(mintsOnSale[req.body.index].price * LAMPORTS_PER_SOL)))

  // if (Math.abs(Number(Number(t1! - t0!).toPrecision(2))) != Math.abs(Number(mintsOnSale[req.body.index].price * LAMPORTS_PER_SOL)))
  //   return res.status(200).send({ error: 'bad till' })

  return true
}

const verifyAccounts = () => {
  // const acctKeys = txResult?.transaction.message.getAccountKeys()
  // const sender = acctKeys?.get(0)?.toBase58()
  // const reciever = acctKeys?.get(1)

  //if (sender != req.body.address && (reciever?.toBase58() != mintsOnSale[req.body.index].bank || reciever?.toBase58() != mintsOnSale[req.body.index].bankAta))
  //return res.status(200).send({ error: 'bad accts' })
  return true
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

  console.log("=======event======");
  console.log(req.body)

  if (req.method != 'POST') {
    console.log("Not a post request")
    return res.status(200).send({ error: 'Not a post request' })
  }

  const paramters = Object.keys(req.body)

  if (!paramters.includes("signature") || !paramters.includes("address") || !paramters.includes("index") || !paramters.includes("receiver")) {
    console.log("Missing paramters");
    return res.status(200).send({ error: 'Missing parameters' })
  }


  const mongoclient = await clientPromise;
  const db = mongoclient.db("market");

  const mintsOnSale = await db
    .collection("editions")
    .find({})
    .toArray();



  const saleItem = mintsOnSale[req.body.index]
  const connection = new Connection(process.env.NEXT_PUBLIC_RPC!)

  // verify the tx
  const txResult = await verifyTx(connection, req.body.signature)
  if (!txResult) return res.status(200).send({ error: 'couldnt confirm tx' })

  // check against slot
  const slotResult = verifySlot(connection, txResult.slot)
  if (!slotResult) return res.status(200).send({ error: 'invalid slot' })

  console.log('slot ok')

  // console.log('checking paid amount')
  const tillResult = verifyTill()
  if (!tillResult) return res.status(200).send({ error: 'couldnt verify till' })


  const verifyAccountsResult = verifyAccounts()
  if (!verifyAccountsResult) return res.status(200).send({ error: 'couldnt verify accounts' })

  // SEND TO QUEUE
  const rabbitConnection: ampConnection = await client.connect(
    'amqp://username:password@localhost:5672'
  )

  // Create a channel
  const channel: Channel = await rabbitConnection.createChannel()

  // Makes the queue available to the client
  await channel.assertQueue('toMint')

  //Send a message to the queue
  channel.sendToQueue('toMint', Buffer.from(JSON.stringify({ mint: saleItem.mint, destination: req.body.address, authority: saleItem.authorty })))
  console.log("sent to queue")

  //close the connection
  await channel.close()
  res.status(200).send({})
}
