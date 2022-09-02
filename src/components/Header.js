import { Fragment } from "react";
import userStore from "../store/userStore";

function Header() {
  const { user, signOut, requestSignIn } = userStore((state) => state);

  const renderAccountDetails = () => {
    return user ? (
      <Fragment>
        <span>Balance: {user.balance} </span>
        <span>ID: {user.account_id}</span>
        <div>
          <button type="button" className="actionBtn" onClick={signOut}>
            Disconnect Your Wallet
          </button>
        </div>
      </Fragment>
    ) : (
      <div>
        <button type="button" className="actionBtn" onClick={requestSignIn}>
          Connect Your Wallet
        </button>
      </div>
    );
  };

  return <div className="titleRight">{renderAccountDetails()}</div>;
}

export default Header;
