import React from 'react';
import { MichelsonMap, TezosToolkit } from '@taquito/taquito';
import '../App.css';
import { REACT_APP_TEZOS_RPC_URL, NFT_CONTRACT_ADDRESS } from './globals'
import { useContract } from './hooks/use-contract';
import { useWallet } from './hooks/use-wallet';
import { useState, useEffect } from 'react';
import Entry from './components/Entry';

const noIdMessage = 
  <p class="subtitle centered">
    It looks like you don't have an ID yet!
    You can create one at the TUVS website.
  </p>

const noEntryMessage = 
  <p class="subtitle centered">
    Your ID doesn't have any entry for this game yet!
    Start playing to create an entry.
  </p>

const gameOverMessage =
  <p class="subtitle centered">

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
    const [awaiting, setAwaiting] = useState(false);

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
          setAwaiting(true);
          return op.confirmation();
        })
        .then((result) => {
          if(result.completed) {
            setAwaiting(false);
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
          setAwaiting(true);
          return op.confirmation();
        })
        .then((result) => {
          if(result.completed) {
            setAwaiting(false);
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
  
    function getValueByKey(key, defaultVal) {
      var val = defaultVal;

      if(entries) {
        if(entries[0]) {
          Array.from(entries[0].strings.entries()).forEach((item, i) => {
            if(item[0] === key) {
              val = item[1];
            }
          })
          Array.from(entries[0].nats.entries()).forEach((item, i) => {
            if(item[0] === key) {
              val = item[1].toNumber();
            }
          })
        }
      }

      return val;
    }

    function TUVS_ConnectionInterface () { 
      return (
        <div>
            <div class="buttonContainer"><p class="subtitle centered lessNarrow">This application runs on the
            Hangzhounet test network. A compatible account can be activated <a href="https://teztnets.xyz/hangzhounet-faucet" target="_blank">here</a>.</p></div>
            <div class="buttonContainer"></div>
            <div class="buttonContainer"><button onClick={connect}>Connect Wallet</button></div>
            {awaiting && <div class="buttonContainer"><div class="phrase">Awaiting previous transaction...</div></div>}
            {loadingEntries && <div class="dataContainer"><h1>Loading...</h1></div>}
            {initialized && !loadingEntries && !idRecieved &&
              <div class="buttonContainer">{noIdMessage}</div>
            }
            {initialized && !loadingEntries && entries.length == 0 &&
              <div class="buttonContainer">{noEntryMessage}</div>
            }
            <div>
              {entries.map((item, i) => {
                return <Entry key={i} data={item}/>;
              })}
            </div>
        </div>
      )
    }

    function TUVS_GameOverInterface (props) {

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
              <p>{props.field}</p>
              <input type={props.type} value={val} onChange={handleChange}></input>
            </label>
          </div>
        )
      }

      return (
        <div className="App-header">
          {props.score > props.highScore &&
            <div>
              <div class="buttonContainer"><h1 class="phrase">New High Score!</h1></div>
              <div class="buttonContainer"><p class="subtitle centered">
                Make sure you save this score to your digital identity!
              </p></div>
            </div>
          }
          {props.score < props.highScore &&
            <div class="buttonContainer"><h1 class="phrase">Game Over :(</h1></div>
          }
          { !submitted &&
            <div class="entryContainer">
              <p class="subtitle centered white heavy big">Score: {props.score}</p>
              <p class="subtitle centered white heavy big">High Score: {props.highScore}</p>
              <p class="subtitle centered narrow">
                Snake color is a hex number, and should be in the form #xxxxxx where x is a hex digit between 0 and F.
              </p>
              <form onSubmit={handleSubmit}>
                {gameOverFields.strings.map((string, i) => {
                  return <Field type="text" field={string} key={i}/>;
                })}
                {gameOverFields.nats.map((nat, i) => {
                  return <Field type="number" field={nat} key={i}/>;
                })}
                <div class="buttonContainer"><button onClick={handleSubmit}>Save to Identity</button></div>
              </form>
            </div>
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
      getValueByKey,
      connectToContract,
      setApplicationTitle,
      setUserDataFields,
      TUVS_ConnectionInterface,
      TUVS_GameOverInterface
    }

}

export default TUVS;