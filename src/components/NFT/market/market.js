import { Fragment, useEffect } from "react";
import marketStore from "../../../store/marketStore";
import Loader from "../../../util/components/loader";
import NFTBlock from "../NFTBlock";

export default function Market() {
  const { loading, tokens, error, fetchNFTList } = marketStore(
    (state) => state
  );

  useEffect(() => {
    fetchNFTList();
  }, []);

  return (
    <Fragment>
      <div className="innerTopBar">
        <h2>Market Place</h2>
      </div>
      <div className="productList">
        {loading ? (
          <Loader />
        ) : (
          <div className="productListRow">
            {tokens.reverse().map((token, index) => (
              <div className="productListCol" key={index}>
                <NFTBlock {...token} key={index} />
              </div>
            ))}
          </div>
        )}
      </div>
    </Fragment>
  );
}
