const Blockchain = require("./blockchain");
const bitcoin = new Blockchain();

// const previosBlockHash = "GHJGFR67F8GHVJHGJH";
// const currentBlockData = [
//   {
//     amount: 10,
//     sender: "HJKHKJH87VHGJ",
//     recepient: "HHJJJHJHHHHJJ",
//   },
//   {
//     amount: 30,
//     sender: "HJUUYUIYKHKJH87VHGJ",
//     recepient: "HHJJJBNCXXDXEHJHHHHJJ",
//   },
//   {
//     amount: 200,
//     sender: "H787HJJGFHTJKHKJH87VHGJ",
//     recepient: "HHJJJHJHLKLKJHJGHHHJJ",
//   },
// ];
// // const nonce = 100;

// // console.log(
// //   "first",
// //   bitcoin.hashBlock(previosBlockHash, currentBlockData, nonce)
// // );
// // console.log("first", bitcoin.proofOfWork(previosBlockHash, currentBlockData)); // 22486
// console.log(
//   "first",
//   bitcoin.hashBlock(previosBlockHash, currentBlockData, 22486)
// );

console.log("first", bitcoin);
