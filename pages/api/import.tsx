import clientPromise from "../../lib/mongodb";
import { NextApiRequest, NextApiResponse } from 'next'
import { NATIVE_MINT } from "@solana/spl-token";


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  try {

    console.log(req.body)

    const client = await clientPromise;
    const db = client.db("market");
    let bulkUpdateOps = [{ "insertOne": { "document": JSON.parse(req.body) } }]


    // for (const idx in imports) {
    //   bulkUpdateOps.push({ "insertOne": { "document": imports[idx] } });
    // }


    const editions = await db
      .collection("editions").bulkWrite(bulkUpdateOps).then(function (r) {

      });
    res.status(200).send(editions)
  } catch (e) {
    console.error(e);
    res.status(500).send(e)
  }
};