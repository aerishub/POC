import { useEffect, Fragment } from "react";
import nftStore from "../../../store/nftStore";
import Loader from "../../../util/components/loader";
import NFTBlock from "../NFTBlock";

export default function NFT() {
  const { loading, tokens, error, fetchNFTList } = nftStore((state) => state);

  useEffect(() => {
    fetchNFTList();
  }, []);

  return (
    <Fragment>
      <div className="innerTopBar">
        <h2>NFT</h2>
      </div>
      <div className="productList">
        {loading ? (
          <Loader />
        ) : (
          <div className="productListRow">
            {tokens.reverse().map((token, index) => (
              <div className="productListCol" key={index}>
                <NFTBlock {...token} key={index} transfer_token={true} />
              </div>
            ))}
          </div>
        )}
      </div>
    </Fragment>
  );
}
