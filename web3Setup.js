var Web3 = require("web3");
var url = process.env.RPC_URL || "https://rpc-mumbai.matic.today";
var web3 = new Web3(url);
var fs = require("fs");
(async () => {
  try {
    console.log("Starting Code");
    const contractName = "NeoBank";
    const artifactsPath = `./artifacts/${contractName}.json`;
    const metadata = JSON.parse(fs.readFileSync(artifactsPath));
    const toAddress = "0x9a613bff5a78db807e3ac07d3eea047670eeae6b";
    var AccAdress = process.env.AccAddress;
    var PrivateKey = process.env.AccPrivateKey;
    await web3.eth.accounts.wallet.add(PrivateKey);
    let contractAdrress = process.env.NeobankContractAddress;
    let contract = new web3.eth.Contract(metadata.abi, contractAdrress);
    let networkId = await web3.eth.net.getId();
    var accounts = web3.eth.accounts;
    // console.log(accounts);

    const tx = contract.methods.transferss(AccAdress, toAddress, 10000);
    // console.log(tx);
    const gas = await tx.estimateGas({ from: AccAdress });
    const gasPrice = await web3.eth.getGasPrice();
    const data = tx.encodeABI();
    const nonce = await web3.eth.getTransactionCount(AccAdress);
    const txData = {
      from: AccAdress,
      to: toAddress,
      data,
      gas,
      gasPrice,
      nonce: nonce,
      value: 10000,
      common: {
        customChain: {
          networkId: networkId,
          chainId: 80001,
        },
      },
    };

    const ab = await web3.eth.accounts
      .signTransaction(txData, PrivateKey)
      .then((signedTx) => {
        console.log("abc");
        web3.eth.sendSignedTransaction(signedTx.rawTransaction).then((res) => {
          console.log("dfg");
        });
      })
      .then(function (receipt) {
        console.log("suc");
        return true;
      })
      .catch((err) => {
        console.log("ERROR 1: " + err);
        return false;
      });
  } catch (e) {
    console.log(e);
  }
})();
