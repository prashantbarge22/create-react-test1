import React, { Component }  from 'react';
import { useEffect, useState } from "react";
import { tokenAddress } from "./config";
const Web3 = require("web3")
const TokenABI = require("./abi/Token.json");
const SwapABI = require("./abi/RenderverseSwap.json");

require('dotenv').config()


const config = require("./config");

function App() {
  const[address,setAddress] = useState("");
  const[tokenContract,setTokenContract] = useState({});
  const[swapContract , setSwapContract] = useState({});
  const[swapAddress,setSwapAddress] = useState("");
  const[value,setValue] = useState(0);

  useEffect(async ()=>{
    await loadBlockchainData();
    await loadContracts();   
  },[]);

  window.ethereum.on('accountsChanged', function (accounts) {
      setAddress(accounts[0]);
   })

 async function loadBlockchainData() {
    await window.ethereum.enable();
    console.log(Web3)
    window.web3 = await new Web3(Web3.givenProvider || "ws://localhost:7545")
     await window.web3.eth.getAccounts().then(result=>{
       console.log(result)
       setAddress(result[0]);
     })
  }

  async function loadContracts(){
   let tokenContractLoaded = new window.web3.eth.Contract(TokenABI.abi,config.tokenAddress);
   let swapContractLoaded = new window.web3.eth.Contract(SwapABI.abi,config.swapAddress);
   setSwapContract(swapContractLoaded);
   setTokenContract(tokenContractLoaded);
   console.log(swapContractLoaded);
   console.log(tokenContractLoaded)
  }

  async function showOwner(){
    tokenContract.methods.owner().call().then(result=>{
      console.log(result);
    })
  }

  async function changeBool(){
    tokenContract.methods.changeBool().send({
      from:address,
      gas:210000,
      value:0,
    }).on("error",(err)=>{
        window.alert(err);
    }).on("transactionHash",(result)=>{
        console.log(result);
    }).on("receipt",(result)=>{
        console.log(result);
    })
  }

  async function preSale(){
   swapContract.methods.preSale(swapAddress).send({
     from:address,
     gas:210000,
     value:value*(10**18),
     arguments:[swapAddress]
   }).on("error",(err)=>{
    window.alert(err.message);
}).on("transactionHash",(result)=>{
  window.alert(result);
    console.log(result);
}).on("receipt",(result)=>{
  window.alert(result);
    console.log(result);
})
  }

  return (
    <div className="App">
     <div>{address}</div>
     <button onClick={showOwner}>click</button>
     <button onClick={changeBool}>changeBool</button>
     <div>
       <div>
         <label>Ethers</label>
       <input type="text" onChange={(element)=>{setValue(element.target.value)}}></input>
       </div>
       <div>
       <label>Address</label>
       <input type="text" onChange={(element)=>{setSwapAddress(element.target.value)}}></input>
       </div>
       <div>tokens you will get is  ={value*0.12} </div>
       <button onClick={preSale}>Presale</button>
     </div>
    </div>
  );
}

export default App;
