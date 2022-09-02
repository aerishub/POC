import * as nearAPI from "near-api-js";

const { keyStores } = nearAPI;

export const config = {
  networkId: "testnet",
  keyStore: new keyStores.BrowserLocalStorageKeyStore(),
  nodeUrl: "https://rpc.testnet.near.org",
  walletUrl: "https://wallet.testnet.near.org",
  helperUrl: "https://helper.testnet.near.org",
  explorerUrl: "https://explorer.testnet.near.org",
};

// connect to NEAR
// export const near = await connect(config);

// create wallet connection
// export const wallet = new WalletConnection(near);
