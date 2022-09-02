import LeftMenu from "./LeftMenu";

export default function Wrapper({ children }) {
  return (
    <div className="mainContentWrapper" style={{ minHeight: "93vh" }}>
      <div className="mainBodyContainer">
        <div className="wrapper">
          <h2>AerisHub | NEAR Protocol - NFT</h2>
          <div className="userProfileWrap viewProfile">
            <LeftMenu />
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
