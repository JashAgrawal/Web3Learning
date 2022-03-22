var Web3 = require("web3");
var url = process.env.RPC_URL || "https://rpc-mumbai.matic.today";
var web3 = new Web3(url);
var fs = require("fs");
var SignedTx = require("./SignTranstaction");
(async () => {
  try {
    console.log("Starting Code");
    const contractName = "NeoBank";
    const artifactsPath = `./artifacts/${contractName}.json`;
    const metadata = JSON.parse(fs.readFileSync(artifactsPath));
    let contractAdrress = process.env.NeobankContractAddress;
    let contract = new web3.eth.Contract(metadata.abi, contractAdrress);
    const account = (await web3.eth.getAccounts()[0]) || process.env.AccAddress;
    //////////////////////////////////////////ACCOUNT CREATION/////////////////////////////////////////////////////
    async function AccCreation(nameId) {
      let accData = await web3.eth.accounts.create();
      await contract.methods
        .AccCreation(accData.address, accData.privateKey, nameId)
        .send({ from: account, gas: 900000 });
    }
    AccCreation("josephlel00")
      .then((res) => console.log("Created"))
      .catch(async (err) => {
        console.log("Error " + err);
      });
    ////////////////////////////////////////////////////GET ALL USERES//////////////////////////////////////////////////////////
    async function viewUsersss(nameId) {
      return await contract.methods.ViewUsers().call();
    }
    viewUsersss("josephlel00")
      .then((res) => console.log("users", res))
      .catch(async (err) => {
        console.log("Error " + err);
      });
    // ///////////////////////////////////////////////GET BALANCE///////////////////////////////////////////////////////////////
    async function getBalance(nameId) {
      return await contract.methods.GetBalance(nameId).call();
    }
    getBalance("josephlel00")
      .then((res) => console.log("Balance", res))
      .catch(async (err) => {
        console.log("Error " + err);
      });
    ////////////////////////////////////////////DEPOSIT//////////////////////////////////////////////////////////
    async function deposit(nameId, amount) {
      return await contract.methods
        .Deposit(nameId, amount)
        .send({ from: account, gas: 3000000 });
    }
    deposit("josephlel00", 500)
      .then((res) => console.log("DEPOSITED"))
      .catch(async (err) => {
        console.log("Error " + err);
      });
    //////////////////////////////////////////////DEPOSIT//////////////////////////////////////////////////////////
    async function withDraw(nameId, amount) {
      let userDetails = await contract.methods.getUserDetails(nameId).call();
      let userAddress = userDetails[0];
      let userPk = userDetails[1];
      //console.log(userDetails);
      await web3.eth.accounts.wallet.add(userPk);
      const tx = contract.methods.WithDraw(nameId, amount);
      //console.log(tx);
      const res = await SignedTx(tx, userPk, userAddress);
      await web3.eth.accounts.wallet.remove(userAddress);
      return res;
    }
    withDraw("josephlel00", 100)
      .then((res) => console.log("WithDrawed"))
      .catch(async (err) => {
        console.log("Error " + err);
      });
  } catch (e) {
    console.log("E", e);
  }
})();
