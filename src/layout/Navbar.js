import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import userStore from "../store/userStore";
import { toggleClasses } from "../util/sharedFuctions";

const Navbar = () => {
  const { user, signOut, requestSignIn } = userStore((state) => state);
  const [showDropDown, setShowDropDown] = React.useState(false);

  const dropDownRef = useRef(null);
  const imageRef = useRef(null);
  const nameRef = useRef(null);

  useEffect(() => {
    const closeDropdown = (e) => {
      const tags = [imageRef.current, nameRef.current, dropDownRef.current];
      if (!tags.includes(e.path[0])) {
        setShowDropDown(false);
      }
    };
    document.body.addEventListener("click", closeDropdown);
    return () => document.body.addEventListener("click", closeDropdown);
  }, []);

  return (
    <div className="headerTop">
      <div className="wrapper">
        <div className="headerTopInner">
          <h1 className="logo">
            <Link to="/">
              <img
                src={require("../assets/images/logo.svg").default}
                alt="logo"
              />
            </Link>
          </h1>
          <h1 className="logo-icon">
            <img
              src={require("../assets/images/logo-icon.svg").default}
              alt="logo"
            />
          </h1>
          <div className="mainMenu"></div>
          <div className="overlay"></div>
          <div className="headerRight">
            {user ? (
              <ul>
                <li
                  className={toggleClasses(
                    showDropDown,
                    "dropdown show",
                    "dropdown"
                  )}
                  onClick={() => {
                    setShowDropDown((prev) => !prev);
                  }}
                >
                  <div className="headUserProfile">
                    <img
                      src={require("../assets/images/icon-avatar.svg").default}
                      alt="profile-pic"
                      ref={imageRef}
                    />
                    <span
                      className="aerisIcon arrow-down cursorPointer"
                      ref={dropDownRef}
                    ></span>
                  </div>
                  <div
                    className={toggleClasses(
                      showDropDown,
                      "dropdownMenu dropdownRight show",
                      "dropdownMenu dropdownRight"
                    )}
                  >
                    <a
                      href={
                        "https://explorer.testnet.near.org/accounts/" +
                        user.account_id
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {user.account_id}
                    </a>
                    <div className="disFlex">
                      <span className="txtRight">NEAR</span>
                      <span className="txtRight">{user.balance} Ⓝ</span>
                    </div>
                    <hr />
                    <a
                      href="#"
                      className="cursorPointer"
                      onClick={(event) => {
                        event.preventDefault();
                        signOut();
                      }}
                    >
                      <img
                        src={
                          require("../assets/images/icon-log-out.svg").default
                        }
                      />
                      Sign Out
                    </a>
                  </div>
                </li>
              </ul>
            ) : (
              <button
                type="button"
                className="btnPrimary"
                onClick={requestSignIn}
              >
                Connect Your Wallet
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
