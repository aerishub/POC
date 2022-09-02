import React, { useEffect } from "react";

const Modal = ({
  show,
  header,
  body,
  close,
  accept = null,
  reject = null,
  acceptBtnText = "OK",
  rejectBtnText = "Cancel",
  size = "md",
}) => {
  const [showModal, setShowModal] = React.useState(show);
  useEffect(() => {
    setShowModal(show);
  }, [show]);

  const modalInnerClass = () => {
    if (size === "sm") {
      return "modalInnerWrap sm";
    }
    if (size === "md") {
      return "modalInnerWrap md";
    }
    if (size === "lg") {
      return "modalInnerWrap lg";
    }
    return "modalInnerWrap";
  };

  return (
    <div className={showModal ? "customModal show" : "customModal"}>
      <div className={modalInnerClass()}>
        <div className="modalHeader">
          <h4>{header}</h4>
          <a
            className="close"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setShowModal(false);
              close();
            }}
          >
            &times;
          </a>
          <div className="modalBody">{body}</div>
        </div>
        {accept || reject ? (
          <div className="modalFooter">
            <button className="btnSecondary" onClick={reject}>
              {rejectBtnText}
            </button>
            <button className="btnPrimary" onClick={accept}>
              {acceptBtnText}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Modal;
