import create from "zustand";
import { devtools } from "zustand/middleware";
import { config } from "../near/connect";
import {
  isSignedIn,
  accountDetails,
  convertToNear,
  nftSupplyForOwner,
} from "../near/sharedFunctions";
import { connect, WalletConnection } from "near-api-js";
import { Auth } from "aws-amplify";

const contract_account_id = "aerishub.testnet";

const userStore = (set, get) => ({
  user: null,
  wallet: null,
  loading: true,
  production_list: [],
  cognitoSignIn: async (
    username = "akash.roy+6@digitalavenues.com",
    password = "Password@123"
  ) => {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await Auth.currentAuthenticatedUser();
        if (user) {
          resolve(user);
        }
      } catch (error) {
        try {
          const _user = await Auth.signIn({
            username,
            password,
          });
          resolve(_user);
        } catch (error) {
          console.log({ error });
          reject(error);
        }
        // console.log({ error });
        // reject(error);
      }
    });
  },
  signOut: async () => {
    try {
      const { wallet } = get();
      await wallet.signOut();
      set(() => ({ user: null, production_list: [] }));
    } catch (error) {
      console.log({ error });
    }
  },
  setWallet: async () => {
    await get().cognitoSignIn();
    // connect to NEAR
    const near = await connect(config);
    // create wallet connection
    const _wallet = new WalletConnection(near);

    set(() => ({ wallet: _wallet }));

    const is_signed_in = await isSignedIn(_wallet);

    if (is_signed_in) {
      const wallet_account_details = accountDetails(_wallet);

      const balance = await wallet_account_details.getAccountBalance();

      const account_info = {
        account_id: wallet_account_details.accountId,
        balance: convertToNear(balance?.available),
      };

      set(() => ({ user: account_info }));

      const { setProductionList } = get();

      setProductionList(account_info);
    }

    set(() => ({ loading: false }));
  },
  requestSignIn: async () => {
    const { wallet } = get();
    wallet.requestSignIn(contract_account_id, "nft-token");
  },
  setProductionList: async (user) => {
    const production_list =
      JSON.parse(localStorage.getItem(user.account_id)) || [];
    const tokens = await nftSupplyForOwner();
    const token_ids = tokens.map((token) => token.token_id);
    let filtered_production_list = [];
    for (const production of production_list) {
      filtered_production_list = token_ids.includes(production.packing_list_id)
        ? [...filtered_production_list]
        : [...filtered_production_list, production];
    }
    localStorage.setItem(
      user.account_id,
      JSON.stringify(filtered_production_list)
    );
    set(() => ({ production_list: filtered_production_list }));
  },
  addProduction: (production) => {
    const { user, production_list } = get();
    production_list.push(production);
    localStorage.setItem(user.account_id, JSON.stringify(production_list));
    set(() => ({ production_list }));
  },
  updateProduction: (production) => {
    const { user, production_list } = get();
    const { packing_list_id } = production;
    let updated_production_list = [];
    for (const item of production_list) {
      updated_production_list =
        item.packing_list_id == packing_list_id
          ? [...updated_production_list, production]
          : [...updated_production_list, item];
    }
    localStorage.setItem(
      user.account_id,
      JSON.stringify(updated_production_list)
    );
    set(() => ({ production_list: updated_production_list }));
  },
});

export default create(devtools(userStore));
