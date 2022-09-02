import { Fragment, useState } from "react";
import Modal from "../../util/components/modal";
import { nftTransfer } from "../../near/sharedFunctions";

export default function NFTBlock({
  token_id,
  owner_id,
  metadata,
  transfer_token,
}) {
  const {
    media,
    number_of_bundles,
    purity,
    title,
    weight,
    chemical_analysis_certificates,
    esg_certificates,
  } = metadata;

  const [showModal, setShowModal] = useState(false);
  const [recipientAddress, setRecipientAddress] = useState("");

  const logo = () => {
    if (media) {
      return <img src={media} alt="Aeris Hub" />;
    }
    return (
      <img
        src={require("../../assets/images/icon-image.svg").default}
        alt="Aeris Hub"
      />
    );
  };

  const getName = (url) => {
    return url.substring(url.lastIndexOf("/") + 1);
  };

  return (
    <div className="productCard">
      <div className="productCardTop">
        <div className="prodImg">{logo()}</div>
        <div className="prodTitle">
          <h3>{title}</h3>
          <div>
            <span className="hash">Id:</span>
            <span className="hashData">{token_id}</span>
          </div>
        </div>
      </div>
      <div className="productCardCenter">
        <div className="prodDtlsRow">
          <div className="prodDtlsCol">
            <div>Bundles:</div>
            <div className="dtlsData">{number_of_bundles}</div>
          </div>
          <div className="prodDtlsCol">
            <div>Purity:</div>
            <div className="dtlsData">{purity}</div>
          </div>
          <div className="prodDtlsCol">
            <div>Weight:</div>
            <div className="dtlsData">{weight}</div>
          </div>
          <div className="prodDtlsCol" style={{ minWidth: "50%" }}>
            <div>Chemical Analysis Certificates:</div>
            {chemical_analysis_certificates.map((certificate, index) => (
              <div className="dtlsData" key={index}>
                <a href={certificate} target="_blank">
                  {getName(certificate)}
                </a>
              </div>
            ))}
          </div>
          <div className="prodDtlsCol" style={{ minWidth: "50%" }}>
            <div>ESG Certificates:</div>
            {esg_certificates.map((certificate, index) => (
              <div className="dtlsData" key={index}>
                <a href={certificate} target="_blank">
                  {getName(certificate)}
                </a>
              </div>
            ))}
          </div>
          <div className="prodDtlsCol" style={{ minWidth: "75%" }}>
            <div>Owner:</div>
            <div className="dtlsData">{owner_id}</div>
          </div>
        </div>
      </div>
      {transfer_token && (
        <Fragment>
          <div className="productCardFooter">
            <button
              type="button"
              className="btnSecondary"
              onClick={() => setShowModal(true)}
            >
              Transfer
            </button>
          </div>
          <Fragment>
            {
              <Modal
                show={showModal}
                close={() => {
                  setShowModal(false);
                  setRecipientAddress("");
                }}
                header="Transfer NFT"
                body={
                  <div className="fldWrap fldErr">
                    <input
                      type="text"
                      placeholder="Recipient Address"
                      className="inputField"
                      autoComplete="off"
                      onChange={(event) =>
                        setRecipientAddress(event.target.value)
                      }
                    />
                    <label>
                      Enter a recipient address, then proceed to confirm your
                      transaction
                    </label>
                  </div>
                }
                accept={() => {
                  nftTransfer(recipientAddress, token_id);
                }}
                reject={() => {
                  setShowModal(false);
                  setRecipientAddress("");
                }}
              ></Modal>
            }
          </Fragment>
        </Fragment>
      )}
    </div>
  );
}
