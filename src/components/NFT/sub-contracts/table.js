import { useHistory } from "react-router-dom";
import userStore from "../../../store/userStore";
import { AsciiToBase64, Base64ToAscii } from "../../../util/sharedFuctions";
import { mintNft, nftSupplyForOwner } from "../../../near/sharedFunctions";

export default function Table() {
  const history = useHistory();

  const { production_list, user } = userStore((state) => state);

  const production_image = (companyLogo) => {
    if (companyLogo) {
      return (
        <img
          src={companyLogo}
          alt="company logo"
          style={{ width: "24px", height: "24px" }}
        />
      );
    }
    return (
      <img
        src={require("../../../assets/images/icon-image.svg").default}
        width="24px"
        height="24px"
        alt="Aeris Hub"
      />
    );
  };

  return (
    <div className="wrapper">
      <div className="titleWithBtn">
        <h2>Sub Contract (#2fdd28) {">"} Production List</h2>
        <button
          className="btnSecondary"
          onClick={() => history.push("/production")}
          disabled={!user}
        >
          Add Production Details
        </button>
      </div>
      <div className="productsTblWrap">
        <div className="productsTbl">
          <table aria-describedby="productsTbl">
            <thead>
              <tr>
                <th className="categoryTH">Id</th>
                <th className="prodNameTH">Title</th>
                <th className="gradeTH txtCenter">Bundles</th>
                <th className="purityTH">Purity</th>
                <th className="createdOnTH">Weight</th>
                <th className="actionsTH">Actions</th>
              </tr>
            </thead>
            <tbody>
              {production_list.map((data, index) => (
                <tr key={index}>
                  <td className="actionsWrap">{data.packing_list_id}</td>
                  <td>
                    <div className="tblProdName">
                      {production_image(data.company_logo)}
                      <div>{data.product_title}</div>
                    </div>
                  </td>
                  <td className="txtCenter">{data.number_of_bundles}</td>
                  <td>{data.purity}%</td>
                  <td>{data.weight}MT</td>
                  <td>
                    <div className="actionsWrap">
                      <a
                        href="#"
                        className="editIcon"
                        onClick={(event) => {
                          event.preventDefault();
                          history.push(
                            `/production/${AsciiToBase64(data.packing_list_id)}`
                          );
                        }}
                      >
                        <img
                          src={
                            require("../../../assets/images/icon-edit-2.svg")
                              .default
                          }
                          alt="Aeris Hub"
                        />
                      </a>
                      <a
                        href="#"
                        className="boxIcon"
                        onClick={(event) => {
                          event.preventDefault();
                          mintNft(data);
                          // nftSupplyForOwner();
                        }}
                        title="Mint NFT"
                      >
                        <img
                          src={
                            require("../../../assets/images/icon-mint.svg")
                              .default
                          }
                          alt="Aeris Hub"
                        />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
