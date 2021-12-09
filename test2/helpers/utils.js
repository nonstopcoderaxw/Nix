const fs = require("fs");
const SAVE_TO_PATH = "./test2/data";


async function saveObj(objName, obj) {
    await createFile(`${SAVE_TO_PATH}/${objName}.json`, JSON.stringify(obj));
}

async function loadObj(objName) {
    return JSON.parse(await readFile(`${SAVE_TO_PATH}/${objName}.json`));
}

async function clearObj(objName) {
    await saveObj(objName, "");
}

async function createFile(fileName, body){
    await fs.promises.writeFile(fileName, body);
    return true;
}

async function readFile(fileName){
    return await fs.promises.readFile(fileName, 'utf8');
}

module.exports = {
    saveObj, loadObj, clearObj
}

// const axios = require('axios');
// const _ethers = hre.ethers;
// const { Data } = require('./common.js');
//
//
// async function getData() {
//     const data = new Data();
//     await data.init();
//
//     const deployed_contracts = await getContracts(data.deployerSigner);
//     await data.setWeth(deployed_contracts.weth);
//     await data.setRoyaltyEngine(deployed_contracts.mockRoyaltyEngineV1);
//     await data.setNFTA(deployed_contracts.nftA);
//     await data.setNFTB(deployed_contracts.nftB);
//     await data.setNix(deployed_contracts.nix);
//     await data.setNixHelper(deployed_contracts.nixHelper);
//
//     return data;
// }
//
// async function getContracts(signer){
//     const addresses = (await axios.get("http://127.0.0.1:8081/contractsWithDetails.json")).data;
//     var weth, mockRoyaltyEngineV1, nftA, nftB, nix, nixHelper;
//     for(var i = 0; i < addresses.length; i++){
//         if(addresses[i].contractName == "weth"){
//             weth = await ethers.getContractAt("TestERC20", addresses[i].contractAddress, signer);
//         }
//
//         if(addresses[i].contractName == "MockRoyaltyEngineV1"){
//             mockRoyaltyEngineV1 = await ethers.getContractAt("MockRoyaltyEngineV1", addresses[i].contractAddress, signer);
//         }
//
//         if(addresses[i].contractName == "nftA"){
//             nftA = await ethers.getContractAt("ERC721PresetMinterPauserAutoId", addresses[i].contractAddress, signer);
//         }
//
//         if(addresses[i].contractName == "nftB"){
//             nftB = await ethers.getContractAt("ERC721PresetMinterPauserAutoId", addresses[i].contractAddress, signer);
//         }
//
//         if(addresses[i].contractName == "Nix"){
//             nix = await ethers.getContractAt("Nix", addresses[i].contractAddress, signer);
//         }
//
//         if(addresses[i].contractName == "NixHelper"){
//             nixHelper = await ethers.getContractAt("NixHelper", addresses[i].contractAddress, signer);
//         }
//     }
//
//
//
//     return {
//         weth: weth,
//         mockRoyaltyEngineV1: mockRoyaltyEngineV1,
//         nftA: nftA,
//         nftB: nftB,
//         nix: nix,
//         nixHelper: nixHelper
//     }
// }
//
//
// module.exports = {
//     getContracts, getData
// }
