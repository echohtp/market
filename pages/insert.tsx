/* eslint-disable @next/next/no-img-element */

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { useForm } from 'react-hook-form'
import { useState, Component, useMemo, useEffect } from 'react'
import { PublicKey, Transaction } from '@solana/web3.js'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useWallet, useConnection } from '@solana/wallet-adapter-react'
import { NextPage } from 'next'
import Head from 'next/head'
import Confetti from 'react-confetti'
import {
    createTransferInstruction,
    getAssociatedTokenAddress,
    NATIVE_MINT
} from '@solana/spl-token'
import { toast } from 'react-toastify'
import { LAMPORTS_PER_SOL, SystemProgram } from '@solana/web3.js'
import { TOKEN_PROGRAM_ID, } from '@solana/spl-token';

const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID: PublicKey = new PublicKey(
    'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL',
);

const Insert: NextPage = () => {

    const [inputWallet, setInputWallet] = useState<string>('')


    const formToDb = (d: any) => {
        return {
            creator: d.creator,
            twitter: `https://twitter.com/${d.twitter}`,
            open: true,
            authorty: '232PpcrPc6Kz7geafvbRzt5HnHP4kX88yvzUCN69WXQC',
            mint: d.mint,
            priceTags: [
                [
                    {
                        splToken: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
                        bank: d.bank,
                        bankAta: d.ata, // GET THIS
                        price: d.price,
                        symbol: '$BONK'
                    },
                    {
                        splToken: NATIVE_MINT.toBase58(),
                        bank: '232PpcrPc6Kz7geafvbRzt5HnHP4kX88yvzUCN69WXQC',
                        bankAta: '',
                        price: 0.1,
                        symbol: 'SOL'
                    },
                ],
            ]
        }
    }

    const onSubmit = (d: any) => {
        const dbEntry = formToDb(d)
        fetch('api/import', {
            method: "POST",
            body: JSON.stringify(dbEntry)
        } ).then(()=>console.log("done"))
    }

    const { register, handleSubmit, watch, formState: { errors } } = useForm();


    return (
        <div className='container'>
            <div className='w-[50%] mx-auto'>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='grid grid-flow-row'>

                        <div>
                            <label htmlFor="creator" className="block text-sm font-medium text-gray-700">
                                Creator
                            </label>
                            <div className="mt-1">
                                <input
                                    type={"text"}
                                    id="creator"
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    placeholder="artist name"
                                    {...register("creator")}
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="creator" className="block text-sm font-medium text-gray-700">
                                Twitter
                            </label>
                            <div className="mt-1">
                                <input
                                    type={"text"}
                                    {...register("twitter")}
                                    id="twitter"
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    placeholder="twitter name"
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="creator" className="block text-sm font-medium text-gray-700">
                                Mint
                            </label>
                            <div className="mt-1">
                                <input
                                    type={"text"}
                                    {...register("mint")}
                                    id="mint"
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    placeholder="artist name"
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="creator" className="block text-sm font-medium text-gray-700">
                                artist wallet
                            </label>
                            <div className="mt-1">
                                <input
                                    type={"text"}
                                    {...register("bank")}
                                    id="bank"
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    placeholder="artist wallet"
                                    onChange={(e) => {

                                        console.log(e.target.value)
                                        try {
                                            new PublicKey(e.target.value)
                                            setInputWallet(e.target.value)
                                        } catch {
                                            console.log('not valid p key')
                                        }
                                    }}
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="creator" className="block text-sm font-medium text-gray-700">
                                wallet bonk ata
                            </label>
                            <div className="mt-1">
                                <input
                                    type={"text"}
                                    {...register("ata")}
                                    id="ata"
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    placeholder="ata"
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="creator" className="block text-sm font-medium text-gray-700">
                                price in bonk
                            </label>
                            <div className="mt-1">
                                <input
                                    type="number"
                                    {...register("price")}
                                    id="price"
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    placeholder="price"
                                />
                            </div>
                        </div>
                        <button type='submit' className={`mt-8 flex w-full items-center justify-center rounded-md border border-transparent bg-[#7398B4] py-3 px-8 text-base font-medium text-white hover:bg-[#4C2FA2] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}>Add to db</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Insert
