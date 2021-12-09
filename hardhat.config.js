require("@nomiclabs/hardhat-waffle");




const deployerSigner = "0x5268ff7a2a5fbffd8e2dbc1c857f8cf4b28fdea7d7c4efe7f7b9e08e7460e4fc";
const maker0Signer  = "0xad867370fa88acdc65408c3af6f67461dc69a9b5ffcdcdde5450c144f278ed68"
const maker1Signer = "0x4be17529c42cfd8eee16dd74214ddc79bdb595c355faaee8002ac839a42b041c"
const taker0Signer = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
const taker1Signer = "0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a"
const royalty1Signer = "0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6"
const royalty2Signer = "0x8b3a350cf5c34c9194ca85829a2df0ec3153be0318b5e2d3348e872092edffba"
const integratorSigner = "0x92db14e403b83dfe3df233f83dfa3a0d7096f21ca9b0d6d6b8d88b2b4ec1564e"

module.exports = {
  defaultNetwork: "ganache",
  networks: {
    ganache: {
      url: "http://localhost:8545",
      accounts: [
        deployerSigner,
        maker0Signer,
        maker1Signer,
        taker0Signer,
        taker1Signer,
        royalty1Signer,
        royalty2Signer,
        integratorSigner
      ]
    },
    rinkeby: {
      url: "https://rinkeby.infura.io/v3/68beca4f1871419c946f97d19e429cea",
      accounts: [
          "0x5268ff7a2a5fbffd8e2dbc1c857f8cf4b28fdea7d7c4efe7f7b9e08e7460e4fc"
      ]
    }
  },
  solidity: {
    compilers:[
        {
          version: "0.8.9",
          settings: {
            optimizer: {
              enabled: true,
              runs: 200
            }
          }
        }
    ]
  },

  paths: {
    sources: `./contracts`,
    tests: `./test2`,
    cache: `./cache`,
    artifacts: `./artifacts`
  },
  mocha: {
    timeout: 200000000
  }
}
