import Link from 'next/link'
import { useMemo } from 'react'
import { PublicKey } from '@solana/web3.js'
import { Connection } from '@solana/web3.js'
import { useState } from 'react'
import Lightbox from 'react-image-lightbox'
import BuyNow from './BuyNow'
import { Metaplex, Nft } from '@metaplex-foundation/js'
import { imgopt } from '../data/util'

// feature flags
const LinkToCreator = false
export interface priceTag {
  splToken: string
  bank: string
  bankAta: string | null
  price: number
  symbol: string
  collabWallets?: string[]
}
export interface EditionProps {
  connected: boolean
  doIt: any
  index: number
  priceTags: priceTag[][]
  creator: string
  mint: string
  open: boolean
}

export const Edition = (props: EditionProps) => {
  const {
    connected,
    priceTags,
    doIt,
    index,
    creator,
    mint,
    open
  } = props
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [editionsMinted, setEditionsMinted] = useState<number>(0)
  const [nft, setNft] = useState<Nft|null>(null)

  const updateEdition = useMemo(async () => {
    const connection = new Connection(process.env.NEXT_PUBLIC_RPC!)
    const metaplex = new Metaplex(connection)
    const nft = await metaplex
      .nfts()
      .findByMint({ mintAddress: new PublicKey(mint) })
      .run()
    if (nft.model != 'nft') return
    if (!nft.edition.isOriginal) return
    setNft(nft)
    setEditionsMinted(nft.edition.supply.toNumber())
  }, [mint])

  return (
    <div className='flex justify-center pt-5'>
      <a className='inline-block overflow-hidden transition duration-300 ease-in-out shadow-xl cursor-pointer rounded-3xl max-h-xs'>
        <div className='relative w-full overflow-hidden bg-black group rounded-t-3xl'>
          {isOpen && (
            <Lightbox
              mainSrc={imgopt(nft?.json?.image!, 1000)}
              onCloseRequest={() => setIsOpen(false)}
              imageTitle={
                name + ' -----> Press the (+) button if the image doesnt load'
              }
              imageCaption={nft?.json?.description}
            />
          )}
          { nft?.json?.animation_url == null && 
          <img
            src={imgopt(nft?.json?.image!, 600)}
            className='object-fit duration-700 transform backdrop-opacity-100 max-h-54'
            onClick={() => setIsOpen(true)}
          /> } 
          
        </div>
        <div className='bg-white'>
          <div className='px-3'>
            <div className='px-3'>
              <p className='py-2 truncate lg:text-xl md:text-xl sm:text-md'>
                {nft?.name} 
              </p>
              <div className='items-center avatar'>
                    {/* <div className='w-8 rounded-full'>
                      <img
                        src={`https://market.holaplex.com/images/gradients/gradient-${0 +
                          1}.png`}
                      />
                    </div> */}
                    <p className=''>By: {creator}</p>
                  </div>
              {/* <p className='pb-2 truncate'>
                <i>{nft?.json?.description}</i>
              </p> */}

              {LinkToCreator ? (
                <Link href={`/${creator}`}>
                  <div className='items-center avatar'>
                    <div className='w-8 rounded-full'>
                      <img
                        src={`https://market.holaplex.com/images/gradients/gradient-${0 +
                          1}.png`}
                      />
                    </div>
                    <p className='pl-2'>{creator}</p>
                  </div>
                </Link>
              ) : (
                <></>
              )}
            </div>

            <div className='flex justify-center'>
              <div className='w-full bg-white'>
                {!connected && (
                  <div className='pt-2 pb-6 text-center'>
                    <p className='mt-2 font-sans font-light text-slate-700'>
                      Connect wallet to mint.
                    </p>
                  </div>
                )}
                {connected && 
                  (open ? (
                  <>
                    <div className='grid pb-6 text-center grid-cols'>
                      {priceTags.map((tag: priceTag[], idx: number) => (
                        <div className='w-full py-1' key={index}>
                          <BuyNow
                          open={true}
                            priceTag={tag}
                            index={idx}
                            editionIndex={index}
                            doIt={doIt}
                          />
                        </div>
                      ))}
                    </div>
                  </>
                  )
                : (
                  <>
                    <div className='px-3 pt-2 pb-6 mx-4 text-center'>
                      <h1>Count down timer goes here if applicable</h1>
                      <h1>if not, put a link to a secondary marketplace</h1>
                    </div>
                  </>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className='pb-2 text-center text-gray-400 bg-white'>
          <h1><i>{editionsMinted ? `${editionsMinted} editions minted`: `be the first to mint`}</i></h1>
        </div>
      </a>
    </div>
  )
}
