// const { singletons, expectRevert } = require("@openzeppelin/test-helpers");
// const { migrateABI } = require("./helpers/migrate.js");
// const { getData } = require("./helpers/utils.js");
// const { Data } = require('./helpers/common');
//
//
// const SETTING = {
//     deploy_contracts: false,
//     run_setup: true
// }
//
// var data;
//
//
// describe("Nix", function () {
//     it("Migrate contracts", async function(){
//         if(SETTING.deploy_contracts) {
//             await migrate_contracts();
//             await migrate_abis();
//         }
//
//         if(SETTING.run_setup) {
//             await setup();
//         }
//     })
// })
//
//
// async function migrate_contracts() {
//       const DETAILS = 1;
//
//       const TestERC20 = await ethers.getContractFactory("TestERC20");
//       const MockRoyaltyEngineV1 = await ethers.getContractFactory("MockRoyaltyEngineV1");
//       const ERC721PresetMinterPauserAutoId  = await ethers.getContractFactory("ERC721PresetMinterPauserAutoId");
//       const Nix = await ethers.getContractFactory("Nix");
//       const NixHelper = await ethers.getContractFactory("NixHelper");
//       data = new Data();
//       await data.init();
//
//       console.log("        --- Setup Accounts, WETH, NFT and Nix Contracts ---");
//       erc1820Registry = await singletons.ERC1820Registry(data.deployer);
//       await data.addAccount(erc1820Registry._address, "ERC1820Registry");
//
//       const fixedSupply = ethers.utils.parseEther("5000");
//       const weth = await TestERC20.deploy("WETH", "Wrapped ETH", 18, fixedSupply);
//       await weth.deployed();
//       await data.setWeth(weth);
//
//       const royaltyEngine = await MockRoyaltyEngineV1.deploy(data.royalty1, data.royalty2);
//       await royaltyEngine.deployed();
//       await data.setRoyaltyEngine(royaltyEngine);
//
//       const nftA = await ERC721PresetMinterPauserAutoId.deploy("NFTeeA", "NFTA", "uri");
//       await data.setNFTA(nftA);
//       const nftATransactionReceipt = await data.nftA.deployTransaction.wait();
//       if (DETAILS > 0) {
//         await data.printEvents("Deployed NFTA", nftATransactionReceipt);
//       }
//       const nftB = await ERC721PresetMinterPauserAutoId.deploy("NFTeeB", "NFTB", "uri");
//       await data.setNFTB(nftB);
//       const nftBTransactionReceipt = await data.nftB.deployTransaction.wait();
//       if (DETAILS > 0) {
//         await data.printEvents("Deployed NFTB", nftBTransactionReceipt);
//       }
//       const nix = await Nix.deploy(weth.address, royaltyEngine.address);
//       // console.log(nix);
//       await nix.deployed();
//       await data.setNix(nix);
//       const nixTransactionReceipt = await data.nix.deployTransaction.wait();
//       if (DETAILS >= 0) {
//         await data.printEvents("txFee Deployed Nix", nixTransactionReceipt);
//       }
//
//       const nixHelper = await NixHelper.deploy(nix.address);
//       // console.log(nixHelper);
//       await nixHelper.deployed();
//       await data.setNixHelper(nixHelper);
//       const nixHelperTransactionReceipt = await data.nixHelper.deployTransaction.wait();
//       if (DETAILS >= 0) {
//         await data.printEvents("txFee Deployed NixHelper", nixHelperTransactionReceipt);
//       }
// }
//
// async function setup() {
//     data = await getData();
//     // //load weth balance
//
//     const transferWeth0Tx = await data.weth.transfer(data.maker0, ethers.utils.parseEther("100"));
//     const transferWeth1Tx = await data.weth.transfer(data.maker1, ethers.utils.parseEther("100"));
//     const transferWeth2Tx = await data.weth.transfer(data.taker0, ethers.utils.parseEther("100"));
//     const transferWeth3Tx = await data.weth.transfer(data.taker1, ethers.utils.parseEther("100"));
//     console.log("        > weth transfered");
//
//     //mint nfta
//     await data.nftA.mint(data.maker0);
//     await data.nftA.mint(data.maker0);
//     await data.nftA.mint(data.maker0);
//     await data.nftA.mint(data.taker0);
//     await data.nftA.mint(data.taker0);
//     await data.nftA.mint(data.taker0);
//     console.log("        > nftA minted");
//     //mint nftb
//     await data.nftB.mint(data.maker0);
//     await data.nftB.mint(data.maker0);
//     await data.nftB.mint(data.maker0);
//     await data.nftB.mint(data.taker0);
//     await data.nftB.mint(data.taker0);
//     await data.nftB.mint(data.taker0);
//     console.log("        > nftb minted");
//     // //WETH.approve
//     await data.weth.connect(data.deployerSigner).approve(data.nix.address, ethers.utils.parseEther("100"));
//     await data.weth.connect(data.maker0Signer).approve(data.nix.address, ethers.utils.parseEther("100"));
//     await data.weth.connect(data.maker1Signer).approve(data.nix.address, ethers.utils.parseEther("100"));
//     await data.weth.connect(data.taker0Signer).approve(data.nix.address, ethers.utils.parseEther("100"));
//     await data.weth.connect(data.taker1Signer).approve(data.nix.address, ethers.utils.parseEther("100"));
//     console.log("        > WETH approved");
//
//     // //NFTA.approve
//     await data.nftA.connect(data.maker0Signer).setApprovalForAll(data.nix.address, true);
//     await data.nftA.connect(data.maker1Signer).setApprovalForAll(data.nix.address, true);
//     await data.nftA.connect(data.taker0Signer).setApprovalForAll(data.nix.address, true);
//     await data.nftA.connect(data.taker1Signer).setApprovalForAll(data.nix.address, true);
//     console.log("        > NFTA approved");
// }
//
// async function migrate_abis() {
//     //weth
//     await migrateABI("TestERC20.sol", "TestERC20", "weth", data.weth.address);
//     console.log("        > TestERC20 ABI migrated");
//
//     await migrateABI("MockRoyaltyEngineV1.sol", "MockRoyaltyEngineV1", "MockRoyaltyEngineV1", data.royaltyEngine.address);
//     console.log("        > MockRoyaltyEngineV1 ABI migrated");
//
//     await migrateABI("ERC721PresetMinterPauserAutoId.sol", "ERC721PresetMinterPauserAutoId", "nftA", data.nftA.address);
//     console.log("        > nftA ABI migrated");
//
//     await migrateABI("ERC721PresetMinterPauserAutoId.sol", "ERC721PresetMinterPauserAutoId", "nftB", data.nftB.address);
//     console.log("        > nftB ABI migrated");
//
//     await migrateABI("Nix.sol", "Nix", "Nix", data.nix.address);
//     console.log("        > Nix ABI migrated");
//
//     await migrateABI("Nix.sol", "NixHelper", "NixHelper", data.nixHelper.address);
//     console.log("        > NixHelper ABI migrated");
//
// }
