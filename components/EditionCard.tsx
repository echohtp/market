import Link from "next/link"
import { EnvelopeIcon, PhoneIcon } from '@heroicons/react/20/solid'

import { useState, useMemo, useEffect } from "react"
import { Metaplex, Nft } from '@metaplex-foundation/js'
import { PublicKey } from '@solana/web3.js'
import { Connection } from '@solana/web3.js'


interface EditionCardProps {
  edition: string
  creator: any
}

const EditionCard = ({ creator, edition }: EditionCardProps) => {

  const [nft, setNft] = useState<Nft>()
  const [_edition, setEdition] = useState<any>()

  // get edition information 
  useEffect(() => {
    const connection = new Connection(process.env.NEXT_PUBLIC_RPC!)
    const metaplex = new Metaplex(connection)
    const nft = metaplex
      .nfts()
      .findByMint({ mintAddress: new PublicKey(edition) })
      .run().then((nft) => {
        if (nft.model != 'nft') return
        if (!nft.edition.isOriginal) return
        setNft(nft)
      })

  }, [edition])

  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg hover:scale-105 transform transition duration-200 ">
      <img className="w-full" src={nft?.json?.image} alt="Sunset in the mountains" />
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">
          
            <span>{nft?.json?.name}</span>
          
        </div>
        <p className="text-gray-700 text-base">
          {nft?.json?.description}
        </p>
      </div>
      <div className="px-6 pt-4 pb-2">
        {nft?.json?.attributes?.map((e) => <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">{e.trait_type}\\{e.value}</span>)}
      </div>
    </div>
  )
}


export default EditionCard