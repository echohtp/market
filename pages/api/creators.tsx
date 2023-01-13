import clientPromise from "../../lib/mongodb";
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler (
    req: NextApiRequest,
    res: NextApiResponse<any>
  ) {

    if (req.method == "POST")
    try {
        const client = await clientPromise;
        const db = client.db("market");
        console.log("looking for creator:")
        console.log(req.body)
        const editions = await db
            .collection("creators")
            .find({creator: req.body})
            .toArray();
            res.status(200).send(editions)
    } catch (e) {
        console.error(e);
        res.status(500).send(e)
    }
 };