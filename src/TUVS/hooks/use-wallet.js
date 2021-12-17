import { useState } from 'react';
import { BeaconWallet } from '@taquito/beacon-wallet'
import { PREFERRED_NETWORK_TYPE } from '../globals.js'

export function useWallet(tezos) {
    const [initialized, setInit] = useState(false);
    const [address, setAddress] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [wallet, setWallet] = useState(undefined);

    return { initialized, address, error, loading, wallet, connect };

    async function connect() {
        try {
            setLoading(true);
            const { address } = await initWallet();
            setInit(true);
            setAddress(address);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    async function initWallet() {
        const options = {
            name: "Tezos User Verification System",
            preferredNetwork: PREFERRED_NETWORK_TYPE,
            colorMode: 'dark'
        };
        const wallet = new BeaconWallet(options);
        const network = { type: PREFERRED_NETWORK_TYPE };
        await wallet.requestPermissions({ network });
        setWallet(wallet);
        tezos.setWalletProvider(wallet);
        const address = await wallet.getPKH();
        return { address };
    }
    
}