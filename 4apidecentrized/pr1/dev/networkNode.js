const express = require("express");
const app = express();
const { v1: uuid } = require("uuid");
const rp = require("request-promise"); // ця бібліотека дозволяє робити запити між нодами в мережі
const Blockchain = require("./blockchain");

const bitcoin = new Blockchain();
const nodeAddress = uuid().split("-").join("");
const port = process.argv[2]; // process.argv - відсилає до команди-скрипта, яка запускає сервер (в даному випадку - "nodemon --watch dev -e js dev/api.js 3001")
// і ця строка в команді представлена як масив елементів, де 3001 - третій елемент

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/blockchain", function (req, res) {
  res.send(bitcoin);
});

app.post("/transaction", function (req, res) {
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

  bitcoin.createNewTransaction(12.5, "00", nodeAddress);
  const newBlock = bitcoin.createNewBlock(nonce, previosBlockHash, blockHash);
  res.json({ note: "New block mined successfully!", block: newBlock });
});

// register a node and broadcast to reate the single network in order to make every separate node be aware about
// other ones - цей ендпоінт будет реєструвати та транслювати УРЛ іншим нодам в мережі
app.post("/register-and-broadcast-node", function (req, res) {
  const newNodeUrl = req.body.newNodeUrl;
  if (bitcoin.networkNodes.indexOf(newNodeUrl) === -1) {
    bitcoin.networkNodes.push(newNodeUrl);
  }
  const regsNodesPromises = [];
  bitcoin.networkNodes.forEach((networkNodeUrl) => {
    const requestOptions = {
      uri: networkNodeUrl + "/register-node",
      method: "POST",
      body: { newNodeUrl: newNodeUrl },
      json: true,
    };
    regsNodesPromises.push(rp(requestOptions));
  });
  Promise.all(regsNodesPromises)
    .then((data) => {
      const bulkRegisterOptions = {
        uri: newNodeUrl + "/register-nodes-bulk",
        method: "POST",
        body: {
          allNetworkNodes: [...bitcoin.networkNodes, bitcoin.currentNodeUrl],
        },
        json: true,
      };
      return rp(bulkRegisterOptions);
    })
    .then((data) => {
      res.json({ note: "New node registered with network successfully!" });
    });
});

// register node with the network - цей ендпоін буде приймати трансляцію УРЛ, згенеровану іншим нодом з однієї мережі,
// зроблену через ендпоінт "/register-and-broadcast-node"
// ми не поміщаємо все в один ендпоінт, а розділяємо, щоб уникнути нескінченного циклу
app.post("/register-node", function (req, res) {
  const newNodeUrl = req.body.newNodeUrl;
  const nodeNotAlreadeyPresent =
    bitcoin.networkNodes.indexOf(newNodeUrl) === -1;
  const notCurrentNode = bitcoin.currentNodeUrl !== newNodeUrl;
  if (nodeNotAlreadeyPresent && notCurrentNode) {
    bitcoin.networkNodes.push(newNodeUrl);
  }
  res.json({ note: "New node registered successfully." });
});

// цей запит приходить до нового ноду, який ми хочемо додати в мережу
// register multiple nodes at once - цей ендпоінт обробляє результат трансляції та реєстрацію поточного ноду
// нодами мережі, до якої ми приєднуємо поточний нод
// цей ендпоінт отримує запит від того ноду мережі, до якого був напралений початковий запит "/register-and-broadcast-node",
// той початковий нод і генерує цей запит
// з цим запитом приходять УРЛи всіх нодів мережі, до якої ми приєднуємо поточний нод
// цей запит буде завершувати реєстрацію цього поточного ноду в мережі з іншими нодами
app.post("/register-nodes-bulk", function (req, res) {
  const allNetworkNodes = req.body.allNetworkNodes;
  allNetworkNodes.forEach((networkNodeUrl) => {
    const nodeNotAlreadyPresent =
      bitcoin.networkNodes.indexOf(networkNodeUrl) === -1;
    const notCurrentNode = bitcoin.currentNodeUrl !== networkNodeUrl;
    if (nodeNotAlreadyPresent && notCurrentNode) {
      bitcoin.networkNodes.push(networkNodeUrl);
    }
  });
  res.json({ note: "Bulk registration successful" });
});

app.listen(port, function () {
  console.log("Listening on port " + port + "...");
});
