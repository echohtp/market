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
        <div className="mintOnSale__text">
        <p className="text-gray-700 text-base">
        {nft?.json?.description && nft?.json?.description?.length >= 200 && (
          <>{nft?.json?.description.substring(0,200)}...</>
        )}
        {nft?.json?.description && nft?.json?.description?.length < 200 && (
          <>{nft?.json?.description}</>
        )}
        </p>
        {/* Started doing an expand more button before realizing the entire card is a link */}
        {/*
        {nft?.json?.description && nft?.json?.description?.length > 150 && (
          <div className="mintOnSale__text--expand">
          <svg xmlns="http://www.w3.org/2000/svg" width="1.5rem" height="1.5rem" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 960 560" enable-background="new 0 0 960 560">
          <g id="Rounded_Rectangle_33_copy_4_1_">
            <path d="M480,344.181L268.869,131.889c-15.756-15.859-41.3-15.859-57.054,0c-15.754,15.857-15.754,41.57,0,57.431l237.632,238.937   c8.395,8.451,19.562,12.254,30.553,11.698c10.993,0.556,22.159-3.247,30.555-11.698l237.631-238.937   c15.756-15.86,15.756-41.571,0-57.431s-41.299-15.859-57.051,0L480,344.181z"/>
          </g>
          </svg>
          </div>
        )} */}
        </div>
      </div>
      <div className="px-6 pt-4 pb-2">
        {nft?.json?.attributes?.map((e) => <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">{e.trait_type}\\{e.value}</span>)}
      </div>
    </div>
  )
}


export default EditionCard