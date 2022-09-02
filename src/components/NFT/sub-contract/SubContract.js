import SubContractForm from "./SubContractForm";
import userStore from "../../../store/userStore";
import { useHistory, useParams } from "react-router-dom";
import { useEffect } from "react";
import { nanoid } from "nanoid";

export default function SubContract() {
  const history = useHistory();
  const { user } = userStore((state) => state);
  const { id } = useParams();

  useEffect(() => {
    if (!user) {
      history.push("/");
    }
  }, []);

  const header = () => {
    return id ? (
      <h2>Edit Production Details</h2>
    ) : (
      <h2>Add New Production Details</h2>
    );
  };

  return (
    <div className="mainContentWrapper">
      <div className="mainBodyContainer">
        <div className="wrapper">
          {header()}
          <div className="subHeading">
            Please fill the fields below with your information
          </div>
          <ul className="accordionList">
            <li className="active">
              <div className="accHeading">Production Details {">"} Sub Contract Id - (#{nanoid(5)})</div>
              <SubContractForm />
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
