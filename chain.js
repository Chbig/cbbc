const Block = require("./block");

class BlockChain {
    constructor() {
        this.blockchain = [this.startGenesisBlock()];
    }
    startGenesisBlock() {
        return new Block({});
    }
    obtainLatestBlock() {
        return this.blockchain[this.blockchain.length - 1];
    }

    // Ajoute un nouveau bloque dans la chaine si celui-ci est valide
    addNewBlock(newBlock) { 
        // TODO : comment certifier que le bloque est valide ? Consensus ?

        newBlock.prevHash = this.obtainLatestBlock().hash; // On ajoute la signature du block précédent au nouveau block
        newBlock.hash = newBlock.computeHash(); // On calcul la signature du nouveau bloque
        this.blockchain.push(newBlock); // On ajoute le nouveau bloque à la chaine

        // TODO : communiquer avec les autres noeux sur l'ajout du bloque
    }
   
    // On vérifie la validité de toute la chaine
    checkChainValidity() { 
        for(let i = 1; i < this.blockchain.length; i++) {
            const currBlock = this.blockchain[i];
            const prevBlock = this.blockchain[i -1];
            
            // On vérifie la signature su bloque courrant
            if(currBlock.hash !== currBlock.computeHash()) { 
                return false;
            }
          
            // On vérifie la signature du block précédent
            if(currBlock.prevHash !== prevBlock.hash) {                 
              return false;
            }
            
        }
        return true; // Tous les bloques de la chaine sont valide
    }
}


let a = new Block({from: "Joe", to: "Jane"});
let b = new Block({from: "Jane", to: "Joe"});

 
let chain = new BlockChain();
chain.addNewBlock(a);
chain.addNewBlock(b);
console.log(chain); 
console.log("Validity: " + chain.checkChainValidity());