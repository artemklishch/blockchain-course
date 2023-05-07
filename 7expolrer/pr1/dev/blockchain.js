const sha256 = require("sha256");
const currentNodeUrl = process.argv[3];
const { v1: uuid } = require("uuid");

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
    transactionId: uuid().split("-").join(""),
  };
  return newTransaction;
};
Blockchain.prototype.addTransactionToPendingTransactions = function (
  transactionObj
) {
  this.pendingTransactions.push(transactionObj);
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
Blockchain.prototype.chainIsValid = function (blockchain) {
  let validChain = true;
  for (let i = 1; i < blockchain.length; i++) {
    // ми ітеруємо не з 0 позиції, оскільки це генезис блок - специфічний блок,
    // який ми створюємо вручну і перед ним немає іншого блоку,
    //який ми перевіряємо на кожній ітерації всередині циклу
    const currentBlock = blockchain[i];
    const previosBlock = blockchain[i - 1];
    const currentBlockData = {
      transactions: currentBlock.transactions, // в "/mine" хендлері ми маємо це ж саме значення
      index: currentBlock["index"], // в "/mine" хендлері ми маємо це ж саме значення
    };
    const blockHash = this.hashBlock(
      previosBlock.hash,
      currentBlockData,
      currentBlock.nonce
    );
    if (blockHash.substring(0, 4) !== "0000") {
      // ми знаємо, що в іншому методі ми генеруємо хеш з тим, щоб він починався
      // з 4 нулів
      validChain = false;
    }
    if (currentBlock.previosBlockHash !== previosBlock.hash) {
      validChain = false;
    }
  }
  const genesisBlock = blockchain[0];
  const correctGenesisBlockNonce = genesisBlock.nonce === 100;
  const correctGenesisBlockPrevHash = genesisBlock.previosBlockHash === "0";
  const correctGenesisBlockHash = genesisBlock.hash === "0";
  const correctTransactions = genesisBlock.transactions.length === 0;
  if (
    !correctGenesisBlockHash ||
    !correctGenesisBlockNonce ||
    !correctGenesisBlockPrevHash ||
    !correctTransactions
  ) {
    validChain = false;
  }
  return validChain;
};
Blockchain.prototype.getBlock = function (blockHash) {
  let correctBlock = null;
  this.chain.forEach((block) => {
    if (block.hash === blockHash) {
      correctBlock = block;
    }
  });
  return correctBlock;
};
Blockchain.prototype.getTransaction = function (transactionId) {
  let correctTransaction = null;
  let correctBlock = null;
  this.chain.forEach((block) => {
    block.transactions.forEach((transaction) => {
      if (transaction.transactionId === transactionId) {
        correctTransaction = transaction;
        correctBlock = block;
      }
    });
  });
  return { transaction: correctTransaction, block: correctBlock };
};
Blockchain.prototype.getAddressData = function (address) {
  const addressTransactions = [];
  this.chain.forEach((block) => {
    block.transactions((transaction) => {
      if (transaction.sender === address || transaction.recepient === address) {
        addressTransactions.push(address);
      }
    });
  });
  let balance = 0;
  addressTransactions.forEach((transaction) => {
    if (transaction.recepient === address) {
      balance += transaction.amount;
    } else if (transaction.sender === address) {
      balance -= transaction.amount;
    }
  });
  return {
    addressTransactions: addressTransactions,
    addressBalance: balance,
  };
};

module.exports = Blockchain;
