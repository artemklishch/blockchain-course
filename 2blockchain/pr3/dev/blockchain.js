const sha256 = require("sha256");

function Blockchain() {
  this.chain = [];
  this.pendingTransactions = [];
  this.createNewBlock(100, "0", "0"); // це так званий Genesis Block; 100, '0', '0' - довільні аргументи
  // оскільки в цей момент ми не маємо визначених значень nonce, previosBlockHash, hash
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
  // bitcoin.hashBlock( previosBlockHash,currentBlockData,nonce) - ми постійно змінюємо значення nonceдля того, щоб
  // кожен разотримувати інший хеш і сподіваємось отримати хеш, що буде співпадати
  // тим хешем, який шукаємо
  // => repeatedly hash block until it finds correct hash => '0000GFHFHGF' - спеціфичний хеш, який починається на 4 нулі
  // => uses current block data for the hash, but also the previos block hash
  // => continiously changes nonce value until it finds the correct hash
  // => returns to us the nonce value that creates the corrects hash
  let nonce = 0;
  let hash = this.hashBlock(previosBlockHash, currentBlockData, nonce);
  while (hash.substring(0, 4) !== "0000") {
    // тут для прикладу ми взяли хеш '0000GFHFHGF', який починається на 4 нулі
    // тому перевіряємо 4 нулі
    nonce++;
    hash = this.hashBlock(previosBlockHash, currentBlockData, nonce);
    console.log(hash);
  }
  return nonce; // повертаємо правильне значення  nonce, при якому створюється потрібний хеш, і з яким можемо працювати
};

module.exports = Blockchain;
