import clientPromise from "../../lib/mongodb";
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {

    if (req.method == "GET") {
        try {
            const client = await clientPromise;
            const db = client.db("market");

            const editions = await db
                .collection("editions")
                .find({})
                .toArray();
            res.status(200).send(editions)
        } catch (e) {
            console.error(e);
            res.status(500).send(e)
        }
    }

    if (req.method == "POST"){
        try {
            const client = await clientPromise;
            const db = client.db("market");

            const editions = await db
                .collection("editions")
                .findOne({"mint": req.body.slice(1, -1)})
                console.log("returning record ", editions)
                
            res.status(200).send(editions)
        } catch (e) {
            console.error(e);
            res.status(500).send(e)
        }
    }
};