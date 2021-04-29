const SHA256 = require('crypto-js/sha256');
var today = new Date();

/** Block Constructor
* Block contains:
 * @param index (position in list)
 * @param timestamp (block creation date)
 * @param data (details of transaction, eg. Deposit of .45 BTC, Sent by Adam, recieved by Beth)
 * @param previousHash (string of the hash of currents block's preceding block)
 * @returns block with parameter values
 */
class Block{
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

/** Takes the sum of Block's index, timestamp, data, previousHash and returns 256 bit hash value
 * @returns 256bit hash value (in hex)  
 */
    calculateHash() {
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }

    mineBlock(difficulty){
        while(this.hash.substring(0,difficulty) != Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }

        console.log("Block mined: " + this.hash);
    }
}
/** 
 * Create a blockchain
 * genesis block is first entry
 */
class Blockchain {
    constructor(){
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 10;
    }

/**
 * @returns Block with no previous hash (as it is the first block) to start the block chain
 */
    createGenesisBlock() {
        return new Block(0, today, "Genesis Block", "0");
    }

/**
 * @returns the latest block added to the chain
 */
    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

/**
 * adds block to block chain and makes newest block's previous hash the hash of the last block of the existing blockchain
 * calculates the hash of the newest block
 */
    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }
/**
 * checks to see if all of the currentBlock's hashes are equal to the initial hash (tampering with the block ie. changing the data, creates a new hash)
 * checks to see if the currentBlock's previous hash is equal to the hash of the previous block, establishing a agreement regarding the hash of the block
 * @returns false if conditions stated above are not met
 * @returns true otherwise
 */
    isChainValid(){
        for(let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            if(currentBlock.previousHash != previousBlock.hash) {
                return false;
            }
        }

        return true;
    }
}

let jag = new Blockchain(); // create blockchain

console.log('Mining Block 1...');
jag.addBlock(new Block(1, "05/04/2021", { amount: 4})); //add block
console.log("Jags genisis block: " + jag[0]);
console.log('Mining Block 2...');
jag.addBlock(new Block(2, "07/04/2021", { amount: 10})); // add block
