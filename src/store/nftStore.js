import create from "zustand";
import { devtools } from "zustand/middleware";
import { nftSupplyForOwner } from "../near/sharedFunctions";

const nftStore = (set) => ({
  loading: true,
  tokens: [],
  error: null,
  fetchNFTList: async () => {
    set(() => ({ loading: true }));
    try {
      const tokens = await nftSupplyForOwner();
      set({ tokens, error: null, loading: false });
    } catch (error) {
      console.log({ error });
      set({ error: null, loading: false });
    }
  },
});

export default create(devtools(nftStore));
