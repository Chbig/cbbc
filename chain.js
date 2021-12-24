const Block = require("./block");
const Libp2p = require("libp2p");
const TCP = require("libp2p-tcp");
const { NOISE } = require("libp2p-noise");
const MPLEX = require("libp2p-mplex");
const process = require("process");

class BlockChain {
  constructor() {
    this.blockchain = [this.startGenesisBlock()];

    // TODO : récupérer la liste des noeuds du réseau depuis le noeud d'amorcage

    // On crée le noeud sur le réseau
    this.node = await Libp2p.create({
      addresses: {
        // add a listen address (localhost) to accept TCP connections on a random port
        listen: ["/ip4/127.0.0.1/tcp/0"],
      },
      modules: {
        transport: [TCP],
        connEncryption: [NOISE],
        streamMuxer: [MPLEX],
      },
    });

    // TODO : On communique aux autres noeuds l'adresse du noeud
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
    for (let i = 1; i < this.blockchain.length; i++) {
      const currBlock = this.blockchain[i];
      const prevBlock = this.blockchain[i - 1];

      // On vérifie la signature su bloque courrant
      if (currBlock.hash !== currBlock.computeHash()) {
        return false;
      }

      // On vérifie la signature du block précédent
      if (currBlock.prevHash !== prevBlock.hash) {
        return false;
      }
    }
    return true; // Tous les bloques de la chaine sont valide
  }
}

let a = new Block({ from: "Joe", to: "Jane" });
let b = new Block({ from: "Jane", to: "Joe" });

let chain = new BlockChain();
chain.addNewBlock(a);
chain.addNewBlock(b);
console.log(chain);
console.log("Validity: " + chain.checkChainValidity());
