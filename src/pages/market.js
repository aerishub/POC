import Wrapper from "../components/NFT/Wrapper";
import MarketComponent from "../components/NFT/market/market";

function Market() {
  return (
    <Wrapper>
      <div className="userContWrap">
        <MarketComponent />
      </div>
    </Wrapper>
  );
}

export default Market;
