import React from 'react';
import { MichelsonMap, TezosToolkit } from '@taquito/taquito';
import '../App.css';
import { REACT_APP_TEZOS_RPC_URL, NFT_CONTRACT_ADDRESS } from './globals'
import { useContract } from './hooks/use-contract';
import { useWallet } from './hooks/use-wallet';
import { useState, useEffect } from 'react';
import Entry from './components/Entry';

const noIdMessage = 
  <p>
    It looks like you don't have an ID yet!
    You can create one at the TUVS website.
  </p>

const noEntryMessage = 
  <p>
    Your ID doesn't have any entry for this game yet!
    Start playing to create an entry.
  </p>

function TUVS() {

    const [entries, setEntries] = useState([]);
    const [idRecieved, setIdRecieved] = useState(false);
    const [id, setId] = useState();
    const [tokenId, setTokenId] = useState(0);
    const [title, setTitle] = useState("");
    const [loadingEntries, setLoadingEntries] = useState(false);
    const [entryData, setEntryData] = useState({});
    const [gameOverFields, setGameOverFields] = useState({});
    const [strings, setStrings] = useState(new MichelsonMap());
    const [nats, setNats] = useState(new MichelsonMap());

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
        .catch((err) => alert("ERROR: " + JSON.stringify(err)));
    }

    async function createEntry() {
      const n = nats;
      entryData.nats.forEach((pair, i) => {
        n.set(pair[0], pair[1]);
      });
      setNats(n);
      const s = strings;
      entryData.strings.forEach((pair, i) => {
        alert("mistake");
        s.set(pair[0], pair[1]);
      });
      setStrings(s);

      const create_entry_params = [
        {
          token_id: tokenId,
          metadata: {
            title: title,
            nats: nats,
            strings: strings
          }
        }
      ]

      tezos.setWalletProvider(wallet);
      tezos.wallet
        .at(NFT_CONTRACT_ADDRESS)
        .then((contract) => contract.methods.create_entry(create_entry_params).send())
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
        setLoadingEntries(true);
        console.log("parsing storage");
        let numTokens = await storage.next_token_id;
        let o = [];
        for(let i = 0; i < numTokens; i++) {
          const id = await storage.ledger.get(`${i}`);
          if(id === address) {
            setIdRecieved(true);
            setId(id);
            setTokenId(i);
            const md = await storage.metadata.get(`${i}`);
            if(md) {
              Array.from(md.values()).forEach((entry, i) => {
                console.log(entry.title);
                if(entry.title === title) {
                  o.push(entry);
                }
              });
            }
            break;
          }
        }
        setEntries(o);
        setLoadingEntries(false);
      } catch (e) {
        alert(e);
      }
    }
  
    function TUVS_ConnectionInterface () { 
      return (
        <div>
            <div>{walletError && <p>Wallet error: {walletError}</p>}</div>
            <div>{contractError && <p>Contract error: {contractError}</p>}</div>
            <div class="buttonContainer"><button onClick={connect}>Connect Wallet</button></div>
            {loadingEntries && <p>Loading...</p>}
            {initialized && !loadingEntries && !idRecieved && noIdMessage}
            {initialized && !loadingEntries && entries.length == 0 && noEntryMessage}
            <div>
              {entries.map((item, i) => {
                return <Entry key={i} data={item}/>;
              })}
            </div>
        </div>
      )
    }

    function TUVS_GameOverInterface () {

      const [submitted, setSubmitted] = useState(false);

      function handleSubmit(e) {
        createEntry();
        setSubmitted(true);
        e.preventDefault();
      }

      function Field (props) {
        const [val, setVal] = useState("");

        function handleChange (e) {
          setVal(e.target.value);
          const mm = (props.type === "text") ? strings : nats;
          mm.set(props.field, e.target.value);
          (props.type === "text") ? setStrings(mm) : setNats(mm);
        }

        return (
          <div>
            <label>
              {props.field}
              <input type={props.type} value={val} onChange={handleChange}></input>
            </label>
          </div>
        )
      }

      return (
        <div className="App-header">
          <h1>Game Over :(</h1>
          { !submitted &&
            <form onSubmit={handleSubmit}>
              {gameOverFields.strings.map((string, i) => {
                return <Field type="text" field={string} key={i}/>;
              })}
              {gameOverFields.nats.map((nat, i) => {
                return <Field type="number" field={nat} key={i}/>;
              })}
              <input type="submit" value="Create Entry" />
            </form>
          }
        </div>
      )
    }
  
    async function connect() {
      await connectToWallet();
      await parseStorage();
    }

    function setApplicationTitle(appTitle) {
      setTitle(appTitle);
    }

    function setUserDataFields(_entryData, _gameOverFields) {
      setEntryData(_entryData);
      setGameOverFields(_gameOverFields);
    }

    return {
      idRecieved,
      connectToContract,
      setApplicationTitle,
      setUserDataFields,
      TUVS_ConnectionInterface,
      TUVS_GameOverInterface
    }

}

export default TUVS;