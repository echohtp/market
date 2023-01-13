import clientPromise from "../../lib/mongodb";
import { Transaction, Keypair, Connection  } from '@solana/web3.js'
import { NextApiRequest, NextApiResponse } from 'next'
const bs58 = require('bs58')
import { Metaplex, keypairIdentity, bundlrStorage, createNftBuilder } from '@metaplex-foundation/js'
import BN from 'bn.js'
interface mintResponse { 
    tx: string
}

export default async function handler (
    req: NextApiRequest,
    res: NextApiResponse<any>
  ) {

    if (req.method != 'POST') {
        console.log("Not a post request")
        return res.status(200).send({ error: 'Not a post request' })
      }

      try {
        const client = await clientPromise;
        const db = client.db("market");

        await db
            .collection("creators")
            .findOneAndUpdate({wallet: req.body.wallet},{$push: {editions: req.body.mint}}, {upsert: true})
        
    } catch (e) {
        console.error(e);
        res.status(500).send(e)
    }




      console.log(req.body)
      return res.status(200).send({})

    
 };