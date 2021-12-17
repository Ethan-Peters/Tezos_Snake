import React from 'react';
import { TezosToolkit } from '@taquito/taquito';
import './App.css';
import { REACT_APP_TEZOS_RPC_URL, NFT_CONTRACT_ADDRESS } from './globals'
import { useContract } from './hooks/use-contract';
import { useWallet } from './hooks/use-wallet';
import { useState, useEffect } from 'react';
import Identity from './components/Identity';

function TUVS() {

    const [owned, setOwned] = useState([]);

    const tezos = new TezosToolkit(REACT_APP_TEZOS_RPC_URL)
  
    const {
      initialized,
      address,
      error: walletError,
      loading: walletLoading,
      wallet,
      connect: connectToWallet,
    } = useWallet(tezos);
    const {
      storage,
      error: contractError,
      loading: contractLoading,
      contract,
      operationsCount,
      connect: connectToContract,
      increaseOperationsCount,
    } = useContract(tezos);
  
    useEffect(() => {
      connectToContract();
    }, [])
  
    useEffect(() => {
      parseStorage();
    }, [storage, address]);
  
    async function mint() {
      tezos.setWalletProvider(wallet);
      tezos.wallet
        .at(NFT_CONTRACT_ADDRESS)
        .then((contract) => contract.methods.mint_id([address]).send())
        .then((op) => {
          alert("Awaiting confirmation");
          return op.confirmation();
        })
        .then((result) => {
          if(result.completed) {
            alert("Complete!");
          }
          else {
            alert("Error :(");
          }
        })
        .finally(() => {
          connectToContract();
        })
        .catch((err) => alert(JSON.stringify(err)));
    }
  
    async function parseStorage() {
      if(!storage || !wallet) {
        return;
      }
      try {
        console.log("parsing storage");
        let numTokens = await storage.next_token_id;
        let o = [];
        for(let i = 0; i < numTokens; i++) {
          if(await storage.ledger.get(`${i}`) === address) {
            console.log("pushing");
            // let entry = storage.metadata.get(`${i}`);
            // storage.metadata.get(`${i}`).map((item, i) => {
            //   o.push(item);
            // })
            // console.log(typeof(entry[0]));
            // if(entry) {
            //   console.log("entry found");
            //   o.push(entry.title)
            // }
            const md = await storage.metadata.get(`${i}`);
            // md.forEach((entry, i) => {
            //   console.log(entry.title)
            // })
            // const entry = await md.get("First Entry!");
            // console.log(entry.nats[0]);
            o.push(md);
          }
        }
        setOwned(o);
      } catch (e) {
        alert(e);
      }
    }
  
    return (
      <div className="App">
        <header className="App-header">
          <h1>Tezos User Verification System</h1>
          <div>{walletError && <p>Wallet error: {walletError}</p>}</div>
          <div>{contractError && <p>Contract error: {contractError}</p>}</div>
          <button onClick={connect}>Connect Wallet</button>
          {initialized && owned.length == 0 && <button onClick={mint}>Mint</button>}
          <div>
            {owned.map((item, i) => {
              return <Identity key={i} entries={item}/>;
              <h1>Identity!</h1>
            })}
          </div>
        </header>
      </div>
    );
  
    async function connect() {
      await connectToWallet();
      await parseStorage();
    }

}

export default TUVS;