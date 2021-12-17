import React from 'react';
import { TezosToolkit } from '@taquito/taquito';
import './App.css';
import { REACT_APP_TEZOS_RPC_URL, NFT_CONTRACT_ADDRESS } from './globals'
import { useContract } from './hooks/use-contract';
import { useWallet } from './hooks/use-wallet';
import { useState, useEffect } from 'react';
import Entry from './components/Entry';

function TUVS(props) {

    const [entries, setEntries] = useState([]);

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
          const id = await storage.ledger.get(`${i}`);
          if(id === address) {
            const md = await storage.metadata.get(`${i}`);
            if(md) {
              Array.from(md.values()).forEach((entry, i) => {
                // if(entry[0] === props.title) {
                  o.push(entry);
                  props.callback();
                // }
              });
            }
          }
        }
        setEntries(o);
      } catch (e) {
        alert(e);
      }
    }
  
    return (
      <div>
        { props.interface === "Connect" &&
          <div className="App">
            <header className="App-header">
              <div>{walletError && <p>Wallet error: {walletError}</p>}</div>
              <div>{contractError && <p>Contract error: {contractError}</p>}</div>
              <button onClick={connect}>Connect Wallet</button>
              {initialized && entries.length == 0 && <button onClick={mint}>Mint</button>}
              <div>
                {entries.map((item, i) => {
                  return <Entry key={i} data={item}/>;
                })}
              </div>
            </header>
          </div>
        }
      </div>
    );
  
    async function connect() {
      await connectToWallet();
      await parseStorage();
    }

}

export default TUVS;