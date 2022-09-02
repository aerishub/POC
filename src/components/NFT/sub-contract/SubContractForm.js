import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubContractSchema } from "../../../schemas/SubContract";
import {
  toggleClasses,
  blockInvalidCharForNumberField,
  canUpdateNumberField,
  restrictDecimalValue,
} from "../../../../src/util/sharedFuctions";
import { useHistory, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import DropZone from "../../../../src/util/components/dropzone/dropZone";
import userStore from "../../../store/userStore";
import ImageCrop from "../../../util/components/imageCrop";
import toast from "react-hot-toast";
import { Base64ToAscii } from "../../../util/sharedFuctions";
import { Storage as S3 } from "aws-amplify";
import { nanoid } from "nanoid";

export default function SubContractForm() {
  const min_purity = 0;
  const max_purity = 100;

  const { id } = useParams();

  const history = useHistory();

  const { user, addProduction, updateProduction, production_list } = userStore(
    (state) => state
  );

  useEffect(() => {
    if (!user) {
      history.push("/");
    }
  }, []);

  const production_details = (id) => {
    if (id) {
      return production_list.find(
        (item) => item.packing_list_id === Base64ToAscii(id)
      );
    } else {
      return {};
    }
  };

  const setCertificates = (field_name, id) => {
    const { esg_certificates, chemical_analysis_certificates } =
      production_details(id);
    if (field_name === "esg_certificates") {
      return esg_certificates;
    }
    if (field_name === "chemical_analysis_certificates") {
      return chemical_analysis_certificates;
    }
  };

  const [companyLogo, setCompanyLogo] = useState(
    id ? production_details(id).company_logo : ""
  );
  const [esgCertificates, setEsgCertificates] = useState(
    id ? setCertificates("esg_certificates", id) : []
  );
  const [esgCertificatesUploading, setEsgCertificatesUploading] =
    useState(false);

  const [chemicalAnalysisCertificates, setChemicalAnalysisCertificates] =
    useState(id ? setCertificates("chemical_analysis_certificates", id) : []);
  const [
    chemicalAnalysisCertificatesUploading,
    setChemicalAnalysisCertificatesUploading,
  ] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setFocus,
    control,
  } = useForm({
    resolver: yupResolver(SubContractSchema),
    mode: "all",
    defaultValues: {
      product_title: "",
      packing_list_id: "",
      purity: "",
      number_of_bundles: "",
      weight: "",
      ...production_details(id),
    },
  });

  useEffect(() => {
    if (id) {
      const details = production_details(id);
      Object.keys(details).length === 0 && history.push("/");
    }
    setFocus("product_title");
  }, []);

  const submit = async (data) => {
    let company_logo = "";
    if (typeof companyLogo !== "string") {
      const extension = companyLogo.name.split(".").pop();
      const key = `poc/media/images/company-logo/${nanoid()}.${extension}`;
      await S3.put(key, companyLogo);
      company_logo =
        "https://aeris-live-dev.s3.us-east-1.amazonaws.com/public/" + key;
    } else {
      company_logo = companyLogo;
    }
    if (id) {
      updateProduction({
        ...data,
        company_logo,
        esg_certificates: esgCertificates,
        chemical_analysis_certificates: chemicalAnalysisCertificates,
      });
      toast.success("Production Details updated successfully");
    } else {
      addProduction({
        ...data,
        company_logo,
        esg_certificates: esgCertificates,
        chemical_analysis_certificates: chemicalAnalysisCertificates,
      });
      toast.success("Production Details added successfully");
    }
    history.push("/");
  };

  return (
    <div className="accContent">
      <form onSubmit={(event) => event.preventDefault()}>
        <div className="rowBlk">
          <div className="colBlk6">
            <div
              className={toggleClasses(
                Boolean(errors.product_title),
                "fldWrap fldErr",
                "fldWrap"
              )}
            >
              <input
                type="text"
                placeholder="Product title*"
                className="inputField"
                autoComplete="off"
                {...register("product_title", {
                  setValueAs: (value) => value && value.trim(),
                })}
              />
              <label>Product Title*</label>
              <div className="errMsg">{errors.product_title?.message}</div>
            </div>
            <div
              className={toggleClasses(
                Boolean(errors.packing_list_id),
                "fldWrap fldErr",
                "fldWrap"
              )}
            >
              <input
                type="text"
                placeholder="Product title*"
                className="inputField"
                autoComplete="off"
                {...register("packing_list_id", {
                  setValueAs: (value) => value && value.trim(),
                })}
                disabled={Boolean(id)}
              />
              <label>Packing List Id*</label>
              <div className="errMsg">{errors.packing_list_id?.message}</div>
            </div>
            <div
              className={toggleClasses(
                Boolean(errors.number_of_bundles),
                "fldWrap fldErr",
                "fldWrap"
              )}
            >
              <input
                type="text"
                placeholder="Number of Bundles*"
                className="inputField txtRight"
                autoComplete="off"
                {...register("number_of_bundles")}
              />
              <label>Number of Bundles*</label>
              <div className="errMsg">{errors.number_of_bundles?.message}</div>
            </div>
          </div>
          <div className="colBlk6">
            <div className="fldWrap">
              <label className="nonFloatingLbl">Company Logo*</label>
              <ImageCrop
                imageSrc={companyLogo}
                onChange={(logo) => setCompanyLogo(logo)}
                maxSizeLimit={2 * 1024 * 1024}
                maxSizeLimitErrorMessage="Maximum size is 2 MB"
                acceptedFileTypes="image/jpg,image/jpeg,image/png"
                acceptedFileTypesErrorMessage="Supported file formats are .jpg, .jpeg, .png"
              />
            </div>
          </div>
        </div>
        <div className="rowBlk">
          <div className="colBlk6">
            <div
              className={toggleClasses(
                Boolean(errors.purity),
                "fldWrap fldErr",
                "fldWrap"
              )}
            >
              <Controller
                control={control}
                name="purity"
                render={({ field: { onChange, ref, value, onBlur } }) => (
                  <input
                    type="number"
                    placeholder="Purity in %"
                    onKeyDown={blockInvalidCharForNumberField}
                    step="0.01"
                    className="inputField txtRight"
                    value={value}
                    onBlur={onBlur}
                    onChange={(event) => {
                      const isUpdatable = canUpdateNumberField(
                        min_purity,
                        max_purity,
                        event.target.value
                      );
                      isUpdatable &&
                        onChange(restrictDecimalValue(event.target.value));
                    }}
                    ref={ref}
                  />
                )}
              />
              <label>Purity* (In %)</label>
              <div className="errMsg">{errors.purity?.message}</div>
            </div>
          </div>
          <div className="colBlk6">
            <div
              className={toggleClasses(
                Boolean(errors.weight),
                "fldWrap fldErr",
                "fldWrap"
              )}
            >
              <input
                type="text"
                placeholder="Weight*"
                className="inputField txtRight"
                autoComplete="off"
                {...register("weight")}
              />
              <label>Weight* (MT)</label>
              <div className="errMsg">{errors.weight?.message}</div>
            </div>
          </div>
        </div>
        <div className="rowBlk">
          <div className="colBlk6">
            <div className="uploadWrap">
              <DropZone
                allowMultipleFileUpload={true}
                multipleFileUploadAtATime={true}
                acceptedFileTypes="application/msword,application/vnd.ms-excel,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,pplication/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,application/pdf,image/jpg,image/jpeg,image/png,''"
                uploading={setChemicalAnalysisCertificatesUploading}
                path={`poc/media/${user?.account_id}/images/chemical-analysis-certificates/`}
                sizeLimit={5 * 1024 * 1024}
                selectedFiles={(_files) =>
                  setChemicalAnalysisCertificates(_files)
                }
                supportedFileTypesMessage="Supported file types will be .jpg, .jpeg, .png, .doc, .docx, .xls, .xlsx., .pdf"
                maximumFileSizeExceededMessage="Maximum size of each document will be 5 MB"
                header="Chemical Analysis Certificate"
                docSupported={true}
                docxSupported={true}
                uploadedFiles={chemicalAnalysisCertificates}
              />
            </div>
          </div>
          <div className="colBlk6">
            <div className="uploadWrap">
              <DropZone
                allowMultipleFileUpload={true}
                multipleFileUploadAtATime={true}
                acceptedFileTypes="application/msword,application/vnd.ms-excel,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,pplication/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,application/pdf,image/jpg,image/jpeg,image/png,''"
                uploading={setEsgCertificatesUploading}
                path={`poc/media/${user?.account_id}/images/esg-certificate/`}
                sizeLimit={5 * 1024 * 1024}
                selectedFiles={(_files) => setEsgCertificates(_files)}
                supportedFileTypesMessage="Supported file types will be .jpg, .jpeg, .png, .doc, .docx, .xls, .xlsx., .pdf"
                maximumFileSizeExceededMessage="Maximum size of each document will be 5 MB"
                header="ESG Certificate"
                docSupported={true}
                docxSupported={true}
                uploadedFiles={esgCertificates}
              />
            </div>
          </div>
        </div>
        <div className="btnWrap">
          <button className="btnSecondary" onClick={() => history.push("/")}>
            Cancel
          </button>
          <button
            className="btnPrimary"
            disabled={
              !isValid ||
              esgCertificatesUploading ||
              chemicalAnalysisCertificatesUploading ||
              !companyLogo
            }
            onClick={handleSubmit(submit)}
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
