var Web3 = require("web3");
var url = process.env.RPC_URL || "https://rpc-mumbai.matic.today";
var web3 = new Web3(url);
var fs = require("fs");
const SignedTx = async (tx, PrivateKey, AccAdress) => {
  try {
    const gasPrice = await web3.eth.getGasPrice();
    const nonce = await web3.eth.getTransactionCount(AccAdress);
    const networkId = await web3.eth.net.getId();
    const data = tx.encodeABI();
    const gas = await tx.estimateGas({ from: AccAdress });
    const txData = {
      from: AccAdress,
      data,
      gas,
      gasPrice,
      nonce: nonce,
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
        web3.eth
          .sendSignedTransaction(signedTx.rawTransaction)
          .then((res) => {
            console.log("p2 - success");
          })
          .catch((err) => console.log(err));
      })
      .then(function (receipt) {
        console.log("p1 - success");
        return receipt;
      })
      .catch((err) => {
        console.log("ERROR1: " + err);
      });
    return ab;
  } catch (e) {
    console.log("Error :- ", e);
    return e;
  }
};
module.exports = SignedTx;
