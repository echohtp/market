import { Metaplex, Nft } from '@metaplex-foundation/js'
import { PublicKey } from '@solana/web3.js'
import { Connection } from '@solana/web3.js'
import Link from 'next/link'
import { useState, useMemo } from 'react'
import { StarIcon } from '@heroicons/react/20/solid'
import { RadioGroup } from '@headlessui/react'
import { CurrencyDollarIcon, GlobeAmericasIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import BuyNow from './BuyNow'
import { imgopt } from '../data/util'



function classNames(...classes: any) {
    return classes.filter(Boolean).join(' ')
}

interface EditionPageProps {
    edition: any
    doIt: any
    index: number
    setIndex: any
    length: number
    open: boolean
}

interface PriceTag {
    price: number
    symbol: string
}

export default function EditionPage({ edition, doIt, index, setIndex, length, open }: EditionPageProps) {

    const [nft, setNft] = useState<Nft | null>()
    const [editionsMinted, setEditionsMinted] = useState<number>(0)

    const updateEdition = useMemo(async () => {
        const connection = new Connection(process.env.NEXT_PUBLIC_RPC!)
        const metaplex = new Metaplex(connection)
        const nft = await metaplex
            .nfts()
            .findByMint({ mintAddress: new PublicKey(edition.mint) })
            .run()
        if (nft.model != 'nft') return
        if (!nft.edition.isOriginal) return
        setNft(nft)
        setEditionsMinted(nft.edition.supply.toNumber())
    }, [edition])


    const policies = [
        { name: 'International delivery', icon: GlobeAmericasIcon, description: 'Get your order in 2 years' },
        { name: 'Loyalty rewards', icon: CurrencyDollarIcon, description: "Don't look at other tees" },
    ]


    const product = {
        name: nft?.json?.name,
        price: '',
        rating: 3.9,
        reviewCount: 512,
        href: '#',
        breadcrumbs: [
            { id: 1, name: edition.creator, href: edition.twitter },
        ],
        images: [
            {
                id: 1,
                imageSrc: nft?.json?.image,
                imageAlt: "Back of women's Basic Tee in black.",
                primary: true,
            }
        ],
        colors: [
            // { name: 'Black', bgColor: 'bg-gray-900', selectedColor: 'ring-gray-900' },
            // { name: 'Heather Grey', bgColor: 'bg-gray-400', selectedColor: 'ring-gray-400' },
        ],
        sizes: [
            { name: 'XXS', inStock: true },
            { name: 'XS', inStock: true },
            { name: 'S', inStock: true },
            { name: 'M', inStock: true },
            { name: 'L', inStock: true },
            { name: 'XL', inStock: false },
        ],
        description: (nft?.json?.description?.charAt(0) == '"' && nft?.json?.description?.charAt(nft?.json?.description.length - 1) == '"') ? nft?.json?.description.substring(1, nft?.json?.description.length - 1) : nft?.json?.description,
        details: [
            nft?.json?.attributes?.map((e) => (String(e.trait_type + ": " + e.value)))
        ],
    }

    const [selectedColor, setSelectedColor] = useState(product.colors[0])
    const [selectedSize, setSelectedSize] = useState(product.sizes[2])

    console.log("open: ", open)

    return (
        <div className="bg-white">
            <div className="pt-6 pb-16 sm:pb-24">
                <nav aria-label="Breadcrumb" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <ol role="list" className="flex items-center space-x-4">
                        {product.breadcrumbs.map((breadcrumb) => (
                            <li key={breadcrumb.id}>
                                <div className="flex items-center">
                                    <a href={breadcrumb.href} className="mr-4 text-sm font-medium text-gray-900 underline" target={"_blank"}>
                                        {breadcrumb.name}
                                    </a>
                                    <svg
                                        viewBox="0 0 6 20"
                                        xmlns="http://www.w3.org/2000/svg"
                                        aria-hidden="true"
                                        className="h-5 w-auto text-gray-300"
                                    >
                                        <path d="M4.878 4.34H3.551L.27 16.532h1.327l3.281-12.19z" fill="currentColor" />
                                    </svg>
                                </div>
                            </li>
                        ))}
                        <li className="text-sm">
                            <p aria-current="page" className="font-medium text-gray-500 hover:text-gray-600">
                                {product.name}
                            </p>
                        </li>
                    </ol>
                </nav>
                <div className="mx-auto mt-8 max-w-2xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
                    <div className="lg:grid lg:auto-rows-min lg:grid-cols-12 lg:gap-x-8">
                        <div className="lg:col-span-5 lg:col-start-8">
                            <div className="flex justify-between">
                                <h1 className="text-4xl font-medium text-gray-900">{product.name}</h1>
                                <p className="text-xl font-medium text-gray-900">{product.price}</p>
                                <div>
                                    {
                                        (index == 0) ?
                                            <Link href={String(length - 1)} passHref><button className='inline-block items-center justify-center h-12 w-24 rounded-md border bg-transparent bg-[#7398B4] text-base font-medium text-white hover:bg-[#4C2FA2] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 pr-2 hover:cursor-pointer' >Prev</button></Link>

                                            :
                                            <Link href={String(index - 1)} passHref><button className='inline-block items-center justify-center h-12 w-24 rounded-md border bg-transparent bg-[#7398B4] text-base font-medium text-white hover:bg-[#4C2FA2] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 pr-2 hover:cursor-pointer' >Prev</button></Link>
                                    }

                                    {
                                        (index == length - 1) ?
                                            <Link href={String(0)} passHref><button className='inline-block items-center justify-center h-12 w-24 rounded-md border bg-transparent bg-[#7398B4] text-base font-medium text-white hover:bg-[#4C2FA2] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 pr-2 hover:cursor-pointer' >Next</button></Link>

                                            :
                                            <Link href={String(index + 1)} passHref><button className='inline-block items-center justify-center h-12 w-24 rounded-md border bg-transparent bg-[#7398B4] text-base font-medium text-white hover:bg-[#4C2FA2] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 pr-2 hover:cursor-pointer' >Next</button></Link>
                                    }

                                </div>
                            </div>
                            <div className='flex justify-between'>
                                <h1 className='text-gray-500 mt-1 ml-1'><i>{editionsMinted ? `${editionsMinted} editions minted` : `Be the first to mint`}</i></h1>
                            </div>
                            {/* <div className='flex justify-between pt-4'>
                                <p className='text-xl pt-1 pl-1'>{edition.priceTags[0]

                                    .map((pt: PriceTag) => `${pt.price.toLocaleString()} ${pt.symbol} & `)
                                    .join('')
                                    .slice(0, -2)}
                                </p>
                            </div> */}

                        </div>

                        {/* Image gallery */}
                        <div className="mt-8 lg:col-span-7 lg:col-start-1 lg:row-span-3 lg:row-start-1 lg:mt-0">
                            <h2 className="sr-only">Images</h2>

                            <div className="grid grid-cols-1 lg:grid-cols-2 lg:grid-rows-3 lg:gap-8">
                                {edition.creator == 'under3mg' || edition.creator == 'r2me2' || edition.creator == 'graffito' || edition.creator == 'Alice Wong' || edition.creator == 'BlockFramez' || edition.creator == 'SatChaser' || edition.creator == 'Netherfriends' ?
                                    <video className="lg:col-span-2 lg:row-span-2" poster={String(nft?.json?.image)} controls autoPlay src={String(nft?.json?.animation_url!)} /> :
                                    <img
                                        key={0}
                                        src={imgopt(nft?.json?.image!, 600)}
                                        alt={""}
                                        className={classNames(
                                            true ? 'lg:col-span-2 lg:row-span-2' : 'hidden lg:block',
                                            'rounded-lg'
                                        )}
                                    />
                                }

                            </div>
                        </div>

                        <div className="mt-0 lg:col-span-5">
                            <form>
                                {edition.priceTags.map((tag: any[], idx: number) => (
                                    <div className='w-full mt-auto py-1' key={idx}>
                                        <p className='text-xl pt-1 pl-1'>{edition.priceTags[idx]

                                            .map((pt: PriceTag) => `${pt.price.toLocaleString()} ${pt.symbol} & `)
                                            .join('')
                                            .slice(0, -2)}
                                        </p>
                                        <BuyNow
                                            open={open}
                                            priceTag={tag}
                                            index={idx}
                                            editionIndex={index}
                                            doIt={doIt}
                                        />
                                    </div>
                                ))}
                            </form>

                            {/* Product details */}
                            <div className="mt-10">
                                <h2 className="text-lg font-medium text-gray-900">Description</h2>

                                <div
                                    className="prose prose-sm mt-4 text-gray-500"
                                >
                                    <p>{product.description}</p>
                                </div>
                            </div>

                            {nft?.json?.attributes && nft?.json.attributes.length > 0 &&
                                <div className="mt-8 border-t border-gray-200 pt-8">
                                    <h2 className="text-lg font-medium text-gray-900">Attributes</h2>

                                    <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 mt-10">
                                        {nft?.json?.attributes?.map((policy) => (
                                            <div key={policy.trait_type} className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-center">
                                                <dt>
                                                    {/* <policy.icon className="mx-auto h-6 w-6 flex-shrink-0 text-gray-400" aria-hidden="true" /> */}
                                                    <span className="mt-4 text-sm font-medium text-gray-900">{policy.trait_type}</span>
                                                </dt>
                                                <dd className="mt-1 text-sm text-gray-500">{policy.value}</dd>
                                            </div>
                                        ))}
                                    </dl>
                                </div>
                            }
                            {/* Policies */}
                            <section aria-labelledby="policies-heading" className="mt-10">
                                <h2 id="policies-heading" className="sr-only">
                                    Our Policies
                                </h2>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
