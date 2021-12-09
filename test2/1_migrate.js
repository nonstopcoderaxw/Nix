const { singletons, expectRevert } = require("@openzeppelin/test-helpers");
const { migrateABI } = require("./helpers/migrate.js");
const { saveObj, loadObj, clearObj } = require("./helpers/utils.js");
const { Data } = require('./helpers/common');
const fs = require("fs");
const Web3 = require('web3');
const GanacheUtils = require("./helpers/ganacheUtils.js");


const SETTING = {
    run_pre_deploy: false,
    run_deploy_contracts: true,
    run_contract_actions: true
}

const ADDR = {
    WETH: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    RoyaltyEngineV1: "0x0385603ab55642cb4dd5de3ae9e306809991804f", //mainnet address deployed at 13443251
    Loot: "0xff9c1b15b16263c61d017ee9f65c50e4ae0113d7" //claimable from bn:13108966, tokenId 7770
}

const Loot_TokenId_to_Claim = "6771";
const Num_loot_to_mint = 20;


var snapshotIds = {};
var deployed_contracts = {};
var web3;

describe("Nix", function () {
    it("Migrate contracts", async function(){

        if(SETTING.run_pre_deploy) {
            await mint_loot();
            await weth_deposit();

            await takeSnapshot("pre_deploy_done");
        }


        if(SETTING.run_deploy_contracts) {
            await revertToSnapshot("pre_deploy_done"); // after revert, the original snapshot will be gone.
            await takeSnapshot("pre_deploy_done");

            await migrate_contracts();
            await migrate_abis();
        }

        if(SETTING.run_contract_actions) {
            await weth_approve();
            await actions();
        }
    })
})


async function migrate_contracts() {
      //deploy MockRoyaltyEngineV1
      const signers = await getSigners();
      const MockRoyaltyEngineV1 = await ethers.getContractFactory("MockRoyaltyEngineV1");
      ADDR.RoyaltyEngineV1 = (await MockRoyaltyEngineV1.deploy(signers.royalty1.address, signers.royalty2.address)).address;

      //deploy Nix, NixHelper
      const Nix = await ethers.getContractFactory("Nix");
      const NixHelper = await ethers.getContractFactory("NixHelper");

      const nix = await Nix.deploy(ADDR.WETH, ADDR.RoyaltyEngineV1);
      deployed_contracts["Nix"] = nix.address;

      const nixHelper = await NixHelper.deploy(nix.address);
      deployed_contracts["NixHelper"] = nixHelper.address;

      await saveObj("deployed_contracts", deployed_contracts);

      console.log("migrate_contracts done!");
}

async function mint_loot() {

    //mint a loot
    const abi = [
      "function claim(uint256 tokenId) public"
    ];

    const signers = await getSigners();

    const Loot = new ethers.Contract(ADDR.Loot, abi, signers.maker0);

    var num_loot_to_mint = Num_loot_to_mint;
    var loot_TokenId_to_Claim = parseInt(Loot_TokenId_to_Claim);
    while (num_loot_to_mint > 0) {
        await Loot.claim(loot_TokenId_to_Claim++);
        num_loot_to_mint--;
    }

    console.log("mint_loot done!");

}

async function actions() {

    await addOrder();
    await executeOrders();
}

async function setApprovalForAll() {
    deployed_contracts = await loadObj("deployed_contracts");

    const abi = [
      "function setApprovalForAll(address operator, bool approved) public"
    ];

    const signers = await getSigners();
    const Loot = new ethers.Contract(ADDR.Loot, abi, signers.maker0);
    await Loot.setApprovalForAll(deployed_contracts.Nix, true);

}

async function weth_approve() {
    const signers = await getSigners();
    const to = (await loadObj("deployed_contracts")).Nix;

    const abi = [
      "function approve(address to, uint256 amount) public"
    ];

    const Weth = new ethers.Contract(ADDR.WETH, abi, signers.maker0);

    await Weth.approve(to, ethers.constants.MaxUint256);
    await Weth.connect(signers.taker0).approve(to, ethers.constants.MaxUint256);
    await Weth.connect(signers.taker1).approve(to, ethers.constants.MaxUint256);
    await Weth.connect(signers.maker0).approve(to, ethers.constants.MaxUint256);
    await Weth.connect(signers.maker1).approve(to, ethers.constants.MaxUint256);

    console.log("weth_approve done!");

}

async function weth_deposit() {
    const amountToDep = ethers.BigNumber.from(
        ethers.utils.parseEther("2000")
        .toString()
    );

    const signers = await getSigners();

    const abi = [
      "function deposit() public payable"
    ];

    const Weth = new ethers.Contract(ADDR.WETH, abi, signers.maker0);
    await Weth.deposit({value: amountToDep});

    await Weth.connect(signers.taker0).deposit({value: amountToDep});

    console.log("weth_deposit done!");
}

async function addOrder() {
    deployed_contracts = await loadObj("deployed_contracts");

    await setApprovalForAll();

    const signers = await getSigners();

    const token = "0xff9c1b15b16263c61d017ee9f65c50e4ae0113d7";
    const taker = ethers.constants.AddressZero;
    const buyOrSell = "1";
    const anyOrAll = "0";
    const tokenIds = [ "6771", "6772", "6773", "6774", "6775", "6776", "6777", "6778", "6779", "6780", "6781", "6782", "6783", "6784", "6785", "6786", "6787", "6788", "6789", "6790" ];
    // function(){
    //     const _tokenIds = [];
    //     var num_loot_to_mint = Num_loot_to_mint;
    //     var loot_TokenId_to_Claim = parseInt(Loot_TokenId_to_Claim);
    //     while (num_loot_to_mint > 0) {
    //         _tokenIds.push(loot_TokenId_to_Claim);
    //         loot_TokenId_to_Claim++
    //         num_loot_to_mint--;
    //     }
    //     return _tokenIds;
    // }();
    console.log("tokenIds", tokenIds);
    const price = ethers.utils.parseEther("1");
    const expiry = "0";
    const tradeMax = "20";
    const royaltyFactor = "100";
    const integrator = ethers.constants.AddressZero;

    const deployed_nix = await ethers.getContractAt("Nix", deployed_contracts.Nix, signers.maker0);
    await deployed_nix.addOrder(token,
                                taker,
                                buyOrSell,
                                anyOrAll,
                                tokenIds,
                                price,
                                expiry,
                                tradeMax,
                                royaltyFactor,
                                integrator);

    console.log("addOrder done!");

}


async function executeOrders() {
    deployed_contracts = await loadObj("deployed_contracts");
    const signers = await getSigners();

    const tokenList = ["0xff9c1b15b16263c61d017ee9f65c50e4ae0113d7"];
    const orderIndexes = ["0"];
    const tokenIdsList = [["6784", "6785", "6786", "6787", "6788", "6789", "6790"]];
    const _totalCost = ethers.BigNumber.from(
        ethers.utils.parseEther("7")
    );
    const netAmount = (-_totalCost).toString();

    const royaltyFactor = "0";
    const integrator = ethers.constants.AddressZero;

    const deployed_nix = await ethers.getContractAt("Nix", deployed_contracts.Nix, signers.taker0);
    await deployed_nix.executeOrders(tokenList,
                                     orderIndexes,
                                     tokenIdsList,
                                     netAmount,
                                     royaltyFactor,
                                     integrator);

    console.log("executeOrders done!");

}

async function getSigners() {
    const _signers = await ethers.getSigners();

    return {
        deployer : _signers[0],
        maker0 : _signers[1],
        maker1 : _signers[2],
        taker0 : _signers[3],
        taker1 : _signers[4],
        royalty1 : _signers[5],
        royalty2 : _signers[6],
        integrator : _signers[7]
    }
}

async function init_web3(){
    return new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}

async function takeSnapshot(name) {
    if(!web3) web3 = await init_web3();

    GanacheUtils.initialize(web3);

    if(!snapshotIds) snapshotIds = await loadObj("snapshotIds");

    snapshotIds[name] = await (async function(){
        const snapshot = await GanacheUtils.takeSnapshot();
        return snapshot["result"];
    })();

    await saveObj("snapshotIds", snapshotIds);
}

async function revertToSnapshot(name) {
    if(!web3) web3 = await init_web3();

    GanacheUtils.initialize(web3);
    snapshotIds = await loadObj("snapshotIds");
    await GanacheUtils.revertToSnapshot(snapshotIds[name]);
}

async function migrate_abis() {

    await migrateABI("Nix.sol", "Nix", "Nix", deployed_contracts.Nix);
    console.log("        > Nix ABI migrated");

    await migrateABI("Nix.sol", "NixHelper", "NixHelper", deployed_contracts.NixHelper);
    console.log("        > NixHelper ABI migrated");
}
