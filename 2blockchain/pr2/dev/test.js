const Blockchain = require("./blockchain");

const bitcoin = new Blockchain();
// bitcoin.createNewBlock(2389, "HGJHGR&J", "GHFSFGSXRXR");
// bitcoin.createNewBlock(5389, "HGJFGHHGR&J", "SKFGSXRXR");
// bitcoin.createNewBlock(2389, "HGKL&J", "KLLLSFGSXRXR");

bitcoin.createNewBlock(2389, "HGJHGR&J", "GHFSFGSXRXR");

bitcoin.createNewTransaction(100, "ALEXYGBHJGY", "JENGT&%FGH");

bitcoin.createNewBlock(5389, "HGJFGHHGR&J", "SKFGSXRXR");

bitcoin.createNewTransaction(200, "ALEXYGKKBHJGY", "JENHJGT&%FGH");
bitcoin.createNewTransaction(250, "ALEXY*(GKKBHJGY", "JENHJUIGT&%FGH");
bitcoin.createNewTransaction(10, "ALEXYGLLKKBHJGY", "JEJKJKHJGT&%FGH");

bitcoin.createNewBlock(2389, "HGKL&J", "KLLLSFGSXRXR");

console.log("bitcoin", bitcoin);
console.log("bitcoin", bitcoin.chain[2]);
