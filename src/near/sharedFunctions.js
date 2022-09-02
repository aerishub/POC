import * as nearAPI from "near-api-js";
import userStore from "../store/userStore";
const { utils, Contract } = nearAPI;

const contract_account_id = "aerishub.testnet";

export const isSignedIn = (wallet) => {
  return wallet.isSignedIn();
};

export const signOut = async (wallet) => {
  return new Promise((resolve, reject) => {
    try {
      const res = wallet.signOut();
      resolve(res);
    } catch (error) {
      console.log({ error });
      reject(error);
    }
  });
};

export const convertToNear = (yoctoNear, upto = 2) => {
  return Number(utils.format.formatNearAmount(yoctoNear)).toFixed(upto);
};

export const convertToYoctoNear = (near) => {
  return utils.format.parseNearAmount(near);
};

export const accountDetails = (wallet) => {
  return wallet.account();
};

const getContract = (account) => {
  return new Contract(account, contract_account_id, {
    changeMethods: ["nft_mint", "nft_transfer"],
    viewMethods: [
      "nft_total_supply",
      "nft_tokens",
      "nft_supply_for_owner",
      "nft_tokens_for_owner",
    ],
  });
};

const certificate = (list) => {
  if (list.length === 0) {
    return [];
  }
  return list.map(
    ({ path }) =>
      "https://aeris-live-dev.s3.us-east-1.amazonaws.com/public/" + path
  );
};

const nft_token_payload = (payload) => {
  const {
    chemical_analysis_certificates,
    company_logo,
    esg_certificates,
    number_of_bundles,
    packing_list_id,
    product_title,
    purity,
    weight,
  } = payload;

  const { user } = userStore.getState();

  return {
    token_id: packing_list_id,
    metadata: {
      title: product_title,
      description: "",
      media: company_logo,
      number_of_bundles,
      purity: Number(purity).toString() + "%",
      weight: weight.toString() + "MT",
      chemical_analysis_certificates: certificate(
        chemical_analysis_certificates
      ),
      esg_certificates: certificate(esg_certificates),
    },
    receiver_id: user.account_id,
  };
};

export const mintNft = async (payload, near = "1000000000000000000000000") => {
  const { wallet } = userStore.getState();
  const contract = getContract(wallet.account());
  const nft_token_data = nft_token_payload(payload);
  try {
    await contract.nft_mint(nft_token_data, "300000000000000", near);
  } catch (error) {
    console.log({ error });
  }
};

export const nftSupplyForOwner = async () => {
  const { wallet, user } = userStore.getState();
  const contract = getContract(wallet.account());
  return new Promise(async (resolve, reject) => {
    try {
      const total_tokens = await contract.nft_supply_for_owner({
        account_id: user.account_id,
      });
      const tokens = await nftTokensForOwner(+total_tokens);
      console.log({ tokens });
      resolve(tokens);
    } catch (error) {
      console.log({ error });
      reject(error);
    }
  });
};

export const nftTokensForOwner = (limit) => {
  const { wallet, user } = userStore.getState();
  const contract = getContract(wallet.account());
  return new Promise(async (resolve, reject) => {
    try {
      const tokens = await contract.nft_tokens_for_owner({
        account_id: user.account_id,
        limit,
      });
      resolve(tokens);
    } catch (error) {
      console.log({ error });
      reject(error);
    }
  });
};

export const nftTotalSupply = async () => {
  const { wallet } = userStore.getState();
  const contract = getContract(wallet.account());
  return new Promise(async (resolve, reject) => {
    try {
      const total_tokens = await contract.nft_total_supply();
      const tokens = await nftTokenss(+total_tokens);
      resolve(tokens);
    } catch (error) {
      console.log({ error });
      reject(error);
    }
  });
};

export const nftTokenss = (limit) => {
  const { wallet } = userStore.getState();
  const contract = getContract(wallet.account());
  return new Promise(async (resolve, reject) => {
    try {
      const tokens = await contract.nft_tokens({
        from_index: "0",
        limit,
      });
      resolve(tokens);
    } catch (error) {
      console.log({ error });
      reject(error);
    }
  });
};

export const nftTransfer = async (receiver_id, token_id, near = "1") => {
  const { wallet } = userStore.getState();
  const contract = getContract(wallet.account());
  try {
    await contract.nft_transfer(
      {
        receiver_id,
        token_id,
      },
      "300000000000000",
      near
    );
  } catch (error) {
    console.log({ error });
  }
};
