import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import "./App.css";
import Header from "./Header";
import MainContent from "./MainContent";
import MyForm from "./MyForm";
import abi from "./utils/WavePortal.json";

const App = () => {
  const [text, setText] = useState("");
  const [currentAccount, setCurrentAccount] = useState("");
  const [allWaves, setAllWaves] = useState([]);
  const contractAddress = "0x29Ded8a47fdEF3b4aCd7Ab9Ddc35065095Db603e";
  const contractABI = abi.abi;
  const [waveLoader, setWaveLoader] = useState(false);
  const [sendMessageLoader, setSendMessageLoader] = useState(false);

  const getAllWaves = async () => {
    try {
      setWaveLoader(true);
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        const waves = await wavePortalContract.getAllWaves();

        let wavesCleaned = [];
        waves.forEach((wave) => {
          wavesCleaned.push({
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message,
          });
        });

        let wavesReversed = [];
        wavesCleaned.forEach((e) => {
          wavesReversed.unshift(e);
        });
        /*
         * Store our data in React State
         */
        setAllWaves(wavesReversed);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setWaveLoader(false);
    }
  };

  useEffect(() => {
    let wavePortalContract;
  
    const onNewWave = (from, timestamp, message) => {
      console.log("NewWave", from, timestamp, message);
      setAllWaves((prevState) => [
        ...prevState,
        {
          address: from,
          timestamp: new Date(timestamp * 1000),
          message: message,
        },
      ]);
    };
  
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
  
      wavePortalContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );
      wavePortalContract.on("NewWave", onNewWave);
    }
  
    return () => {
      if (wavePortalContract) {
        wavePortalContract.off("NewWave", onNewWave);
      }
    };
  }, []);


  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);
        setWaveLoader(true);
        await getAllWaves();
        setWaveLoader(false);
      } else {
        console.log("No authorized account found");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const wave = async (t) => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        const waveTxn = await wavePortalContract.wave(t);
        console.log("Mining...", waveTxn.hash);
        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);
        setSendMessageLoader(false);
        await getAllWaves();
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, [currentAccount]);

  function handleFormSubmit(event) {
    setSendMessageLoader(true);
    wave(text);
    setText("");
    event.preventDefault();
  }

  return (
    <>
      <div className="col-lg-8 mx-auto p-3 py-md-5">
        <Header addr={currentAccount} status={currentAccount} />

        <MainContent />

        <hr className="col-12 mb-5 mt-5" />

        {sendMessageLoader && (
          <div class="alert alert-success" role="alert">
            <h4 class="alert-heading">Well done!</h4>
            <p>
              Confirm transaction and wait until miners pack your message into
              the blockchain. It can take up to 3 min.
            </p>
          </div>
        )}

        {currentAccount && (
          <div className="row">
            <div className="col">
              <form onSubmit={handleFormSubmit} className="">
                <input
                  placeholder="your message"
                  id="sendMessage"
                  className="form-control"
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
                <label htmlFor="sendMessage" className=" "></label>

                <div className="col">
                  <input
                    className="btn btn-outline-success"
                    //onClick={wave(text)}
                    type="submit"
                    value="Send"
                  />
                </div>
              </form>
            </div>
          </div>
        )}

        {!currentAccount && (
          <div className="row">
            {" "}
            <div className="col offset-md-9">
              <button
                className="btn btn-lg btn-outline-info"
                onClick={connectWallet}
              >
                Connect Wallet
              </button>
            </div>
          </div>
        )}

        {waveLoader && (
          <div class="alert alert-info" role="alert">
            is loading...
          </div>
        )}

        {
          <div className="row mt-8">
            <div className="col ">
              {" "}
              <p className="">📮 Received {allWaves.length} messages:</p>
            </div>
          </div>
        }

        {!waveLoader &&
          allWaves.map((wave, index) => {
            return (
              <div className="card my-3 " key={index}>
                <div class="card-header">
                  {wave.timestamp.toString().slice(0, 25)}
                </div>
                <div className="p-2 fs-6 text">from: {wave.address}</div>

                <div className="p-2 fs-3 text"> {wave.message}</div>
              </div>
            );
          })}
      </div>
    </>
  );
};

export default App;
