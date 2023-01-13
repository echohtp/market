import ProgressBar from "./ProgressBar";
import { useMemo, useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import { NFTStorage } from 'nft.storage'
import ClipLoader from "react-spinners/ClipLoader";
import { imgopt } from "@/data/util";
import { useWallet } from "@solana/wallet-adapter-react";
import { nftStorage } from "@metaplex-foundation/js-plugin-nft-storage";
import {
    Metaplex,
    walletAdapterIdentity,
    toMetaplexFileFromBrowser,
    createNftBuilder,
    createNftOperation
} from '@metaplex-foundation/js'
import { Connection, Keypair, PublicKey } from '@solana/web3.js'
import base58 from "bs58";
import { toast } from "react-toastify";
const NFT_STORAGE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGE4MzUxNTc2MzcwZkNCYTBjMTFENjI5NDMyQzc1QzNEMWY3NTY3ZDIiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY1Mzg0NjM5NTcwOSwibmFtZSI6ImJ0b29scyJ9.TvmQRbJ3ThgxewEDKqUUNJeaMNF68T8FXFoCbGQ2LgA'


const initSteps = [
    { id: 'Step 1', name: 'Upload', href: '#', status: 'current' },
    { id: 'Step 2', name: 'Details', href: '#', status: 'upcoming' },
    // { id: 'Step 3', name: 'Mint', href: '#', status: 'upcoming' },
]

const nftstorage = new NFTStorage({ token: NFT_STORAGE_KEY })


export default function NftMinter() {

    const wallet = useWallet()

    const connection = new Connection(process.env.NEXT_PUBLIC_RPC!)
    const metaplex = Metaplex.make(connection).use(
        walletAdapterIdentity(useWallet())
    )


    const fileTypes = ["jpeg", "PNG", "GIF", "JPEG", "jpg", "mp4", "MP4", "html", "HTML", "GLB", "glb", "avi", "AVI", "mov", "MOV"];
    const coverFileTypes = ["jpeg", "PNG", "png", "JPEG", "jpg"]


    const [steps, setSteps] = useState<any>(initSteps)
    const [stepIndex, setStepIndex] = useState<number>(0)



    // NFT Settings State
    const [nftName, setNftName] = useState<string>("")
    const [nftDescription, setNftDescription] = useState<string>("")
    const [file, setFile] = useState(null);
    const [fileType, setFileType] = useState<string>("")
    const [fileCoverType, setFileCoverType] = useState<string>("")

    const [fileCid, setFileCid] = useState<string | null>()
    const [fileCoverCid, setFileCoverCid] = useState<string | null>()
    const [royaltyWallets, setRoyaltyWallets] = useState<{ address: string, share: number }[]>([])
    const [royaltyPercent, setRoyaltyPercent] = useState<number>(15)
    const [loading, setLoading] = useState<boolean>(false)
    const [loadingCover, setLoadingCover] = useState<boolean>(false)
    const [metaplexData, setMetaplexData] = useState<any>({
        name: '',
        description: '',
        symbol: '',
        animation_url: '',
        seller_fee_basis_points: 0,
        image: '',
        properties: {
            category: '',
            files: [],
            creators: []
        }
    })



    const handleChange = async (file: any) => {
        setLoading(true)
        const filePlus = await toMetaplexFileFromBrowser(file[0])
        const cid = await nftstorage.storeBlob(new Blob([filePlus.buffer]))
        setFile(file);
        setFileType(file[0].type)
        setFileCid(cid)
        setLoading(false)
    };

    const handleCoverChange = async (file: any) => {
        setLoadingCover(true)
        const filePlus = await toMetaplexFileFromBrowser(file[0])
        const cid = await nftstorage.storeBlob(new Blob([filePlus.buffer]))
        setFileCoverType(file[0].type)
        setFileCoverCid(cid)
        setLoadingCover(false)

    }

    useMemo(() => {
        if (wallet.connected) {
            setRoyaltyWallets([{ address: wallet.publicKey!.toBase58(), share: 100 }])
        }
    }, [wallet])


    return (
        <div className="w-full h-screen">
            <ProgressBar steps={steps} />
            <div className="flex pt-10 w-full">
                {stepIndex == 0 &&
                    <div className="grid grid-flow-rows mx-auto">
                        <div>

                            {loading &&
                                <ClipLoader
                                    color={"#000000"}
                                    loading={loading}
                                    size={150}
                                    aria-label="Loading Spinner"
                                    data-testid="loader"
                                />
                            }

                            {
                                !loading && fileType.includes("image") && fileCid &&
                                <img className="w-96" src={imgopt(`https://ipfs.io/ipfs/${fileCid}`, 400)} />
                            }

                            {
                                !loading && fileType.includes("video") && fileCid &&
                                <video className="w-96" src={`https://ipfs.io/ipfs/${fileCid}`} controls />
                            }
                            {!loading &&
                                <>
                                    <p>Replace file</p>
                                    <FileUploader
                                        multiple={true}
                                        handleChange={handleChange}
                                        name="file"
                                        types={fileTypes}
                                    />
                                </>
                            }


                        </div>
                        {fileType.includes("video") &&
                            <div>
                                upload cover image area
                                {loadingCover &&
                                    <ClipLoader
                                        color={"#000000"}
                                        loading={loadingCover}
                                        size={150}
                                        aria-label="Loading Spinner"
                                        data-testid="loader"
                                    />
                                }
                                {!loadingCover &&
                                    <img className="w-96" src={imgopt(`https://ipfs.io/ipfs/${fileCoverCid}`, 400)} />
                                }
                                <FileUploader
                                    multiple={true}
                                    handleChange={handleCoverChange}
                                    name="file"
                                    types={coverFileTypes}
                                />
                            </div>
                        }
                        <div className="mt-10"><button className="w-52 border rounded-full h-12" onClick={() => {
                            // DO MORE VALIDATION HERE
                            let _steps = steps
                            _steps[stepIndex].status = "complete"
                            if (_steps[stepIndex + 1] != null) {
                                _steps[stepIndex + 1].status = "current"
                            }
                            setSteps(_steps)
                            if (stepIndex + 1 != _steps.length) {
                                setStepIndex(stepIndex + 1)
                            }
                        }}>Next</button></div>
                    </div>
                }

                {stepIndex == 1 &&
                    <div className="grid grid-flow-rows mx-auto w-full">
                        <div className="grid grid-cols-1 md:lg:grid-cols-2 gap-6">

                            <div className="grid grid-flow-rows">
                                {/* NFT NAME */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        Name *
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            type="text"
                                            name="name"
                                            id="name"
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            placeholder=""
                                            onChange={(e) => {
                                                setNftName(e.target.value)
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* NFT Description */}
                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                        Description
                                    </label>
                                    <div className="mt-1">
                                        <textarea
                                            rows={4}
                                            name="description"
                                            id="description"
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            defaultValue={''}
                                            onChange={(e) => {
                                                setNftDescription(e.target.value)
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* NFT Royalty */}
                                <div>
                                    <label htmlFor="royalty" className="block text-sm font-medium text-gray-700">
                                        Royalty *
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            type="number"
                                            name="royalty"
                                            id="royalty"
                                            min={0}
                                            max={100}
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            placeholder={`${String(royaltyPercent)}%`}
                                        />
                                    </div>
                                </div>

                                {/* NFT Attributes */}


                            </div>


                            {/* left side  */}
                            <div>
                                {fileType.includes('video') &&
                                    <video src={`https://ipfs.io/ipfs/${fileCid}`} controls poster={`https://ipfs.io/ipfs/${fileCoverCid}`} />
                                }
                                {fileType.includes('image') &&
                                    <img src={`https://ipfs.io/ipfs/${fileCid}`} />
                                }
                                <p>{nftName}</p>
                            </div>

                        </div>
                        <div><button className="w-52 border rounded-full h-12" onClick={async () => {

                            let _metaplexData = metaplexData
                            _metaplexData.name = nftName
                            _metaplexData.description = nftDescription
                            _metaplexData.seller_fee_basis_points = royaltyPercent * 100
                            _metaplexData.properties.creators = royaltyWallets
                            _metaplexData.properties.category = fileType.split('/')[0]

                            if (!fileType.includes('image')) {
                                _metaplexData.animation_url = `https://ipfs.io/ipfs/${fileCid}`
                                _metaplexData.image = `https://ipfs.io/ipfs/${fileCoverCid}`
                                _metaplexData.properties.files = [{ uri: `https://ipfs.io/ipfs/${fileCid}`, type: fileType }, { uri: `https://ipfs.io/ipfs/${fileCoverCid}`, type: fileCoverType }]
                            } else {
                                _metaplexData.image = `https://ipfs.io/ipfs/${fileCid}`
                                _metaplexData.properties.files = [{ uri: `https://ipfs.io/ipfs/${fileCid}`, type: fileType }]
                                delete (_metaplexData.animation_url)
                            }

                            _metaplexData.properties.creators.push({ address: process.env.NEXT_PUBLIC_SERVER_WALLET, share: 0 })

                            console.log(_metaplexData)
                            // const { uri } = await metaplex.nfts().uploadMetadata(_metaplexData).run()
                            const cid = await nftstorage.storeBlob(new Blob([_metaplexData]))

                            console.log("metadata cid: ", cid)


                            try {
                                const { nft } = await metaplex.nfts().create({
                                    name: nftName,
                                    sellerFeeBasisPoints: royaltyPercent * 100,
                                    uri: `https://ipfs.io/ipfs/${cid}`
                                }).run()

                                await metaplex.nfts().update({
                                    nftOrSft: nft,
                                    newUpdateAuthority: new PublicKey(process.env.NEXT_PUBLIC_SERVER_WALLET!)
                                }).run()

                                // add the nft mint to the creators mint array
                                fetch('../api/mint', {
                                    method: "POST",
                                    body: JSON.stringify({wallet: wallet.publicKey?.toBase58(), mint: nft.address.toBase58()})
                                })
                            } catch {
                                toast.error("Unable to complete mint process, you may need to import this nft into the marketplace!")
                            }


                        }}>Mint</button></div>
                    </div>
                }
            </div>
        </div>
    )
}