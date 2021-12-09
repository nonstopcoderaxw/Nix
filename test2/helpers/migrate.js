const axios = require('axios');
const fs = require('fs');

async function migrateABI(abiPath, contractName, deployedContractName, address){
    try{
          const abis = [];
          abis.push(await createABIInput(abiPath, contractName, deployedContractName, address));
          await axios.post("http://127.0.0.1:8081/addABI", abis);
          return true;
    }catch(e){
        console.log("error! Please ensure the private block explorer server running!")
    }
}

async function createABIInput(abiPath, contractName, deployedContractName, address){
        const filePath = `./artifacts/contracts/${abiPath}/${contractName}.json`;
        console.log("ABI Path:", filePath);
        console.log("==============================");
        const abi = JSON.parse((await fs.promises.readFile(filePath, 'utf8'))).abi;
        return    {
                    address: address,
                    abi: {contractName: deployedContractName, abi: abi}
                  };
}

module.exports = {
    migrateABI
}
