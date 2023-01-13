import clientPromise from "../../lib/mongodb";
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler (
    req: NextApiRequest,
    res: NextApiResponse<any>
  ) {
    try {
        const client = await clientPromise;
        const db = client.db("market");
        const burn = await db
            .collection("market")
            .find({})
            .toArray();
        let bobj = burn[0]
        await db
            .collection("market")
            .updateOne(bobj,{$set:{burned: Number(req.body) + bobj.burned}})
            res.status(200).send(Number(req.body) + bobj.burned)
    } catch (e) {
        console.error(e);
        res.status(500).send(e)
    }
 };