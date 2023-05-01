const sha256 = require("sha256");
const currentNodeUrl = process.argv[3];

function Blockchain() {
  this.chain = [];
  this.pendingTransactions = [];
  this.currentNodeUrl = currentNodeUrl;
  this.networkNodes = [];
  this.createNewBlock(100, "0", "0");
}

Blockchain.prototype.createNewBlock = function (nonce, previosBlockHash, hash) {
  const newBlock = {
    index: this.chain.length + 1,
    timestamp: Date.now(),
    transactions: this.pendingTransactions,
    nonce: nonce,
    hash: hash,
    previosBlockHash: previosBlockHash,
  };
  this.pendingTransactions = [];
  this.chain.push(newBlock);
  return newBlock;
};
Blockchain.prototype.getLastBlock = function () {
  return this.chain[this.chain.length - 1];
};
Blockchain.prototype.createNewTransaction = function (
  amount,
  sender,
  recepient
) {
  const newTransaction = {
    amount: amount,
    sender: sender,
    recepient: recepient,
  };
  this.pendingTransactions.push(newTransaction);
  return this.getLastBlock()["index"] + 1;
};
Blockchain.prototype.hashBlock = function (
  previosBlockHash,
  currentBlockData,
  nonce
) {
  const dataAsSttring =
    previosBlockHash + nonce.toString() + JSON.stringify(currentBlockData);
  const hash = sha256(dataAsSttring);
  return hash;
};
Blockchain.prototype.proofOfWork = function (
  previosBlockHash,
  currentBlockData
) {
  let nonce = 0;
  let hash = this.hashBlock(previosBlockHash, currentBlockData, nonce);
  while (hash.substring(0, 4) !== "0000") {
    nonce++;
    hash = this.hashBlock(previosBlockHash, currentBlockData, nonce);
  }
  return nonce;
};

module.exports = Blockchain;
