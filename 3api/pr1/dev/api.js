const express = require("express");
const app = express();
const { v1: uuid } = require("uuid");
const Blockchain = require("./blockchain");

const bitcoin = new Blockchain();
const nodeAddress = uuid().split("-").join("");

// app.use("Access-Control-Allow-Origin", "*");
// app.use("Access-Control-Allow-Methods", "GET, POST");
// app.use("Access-Control-Allow-Headers", "Content-Type");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/blockchain", function (req, res) {
  res.send(bitcoin);
});

app.post("/transaction", function (req, res) {
  //   console.log(req.body);
  //   res.send(`The amount of the transaction is ${req.body.amount} bitcoin.`);
  const blockIndex = bitcoin.createNewTransaction(
    req.body.amount,
    req.body.sender,
    req.body.recipient
  );
  res.json({ note: `Transaction will be added in block ${blockIndex}` });
});

app.get("/mine", function (req, res) {
  const lastBlock = bitcoin.getLastBlock();
  const previosBlockHash = lastBlock["hash"];
  const currentBlockData = {
    transactions: bitcoin.pendingTransactions,
    index: lastBlock["index"] + 1,
  };
  const nonce = bitcoin.proofOfWork(previosBlockHash, currentBlockData);
  const blockHash = bitcoin.hashBlock(
    previosBlockHash,
    currentBlockData,
    nonce
  );

  bitcoin.createNewTransaction(12.5, "00", nodeAddress); // тут ми створюємо транзакцію як винагороду для того, хто змайнив блок
  // відправник зазначається як "00" конвенційно
  // отримувач в даному простому прикладі рандомно згенерований через uuid

  const newBlock = bitcoin.createNewBlock(nonce, previosBlockHash, blockHash);
  res.json({ note: "New block mined successfully!", block: newBlock });
});

app.listen(8080, function () {
  console.log("Listening on port 8080...");
});
