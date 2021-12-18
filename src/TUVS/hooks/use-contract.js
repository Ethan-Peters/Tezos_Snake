import { useState } from 'react'
import { NFT_CONTRACT_ADDRESS } from '../globals';

export function useContract(tezos) {
    const [contract, setContract] = useState(null);
    const [error, setError] = useState("");
    const [storage, setStorage] = useState();
    const [loading, setLoading] = useState(false);
    const [operationsCount, setOperationsCounter] = useState(0);

    return {
        contract,
        error,
        storage,
        loading,
        operationsCount,
        connect,
        increaseOperationsCount,
    };

    function increaseOperationsCount() {
        setOperationsCounter(operationsCount + 1);
    }

    async function connect() {
        setLoading(true);
        try {
            const contractInstance = await tezos.wallet.at(NFT_CONTRACT_ADDRESS);
            setContract(contractInstance);
            setStorage(await contractInstance.storage());
            increaseOperationsCount();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }
}