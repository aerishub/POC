import Modal from "./modal";
import ReactCrop from "react-image-crop";
import { CroppedImg } from "../sharedFuctions";
import { Fragment, useEffect, useState, useRef } from "react";

function ImageCrop({
  // loading,
  onChange,
  maxSizeLimit,
  maxSizeLimitErrorMessage,
  acceptedFileTypes,
  acceptedFileTypesErrorMessage,
  imageSrc = null,
  circularCrop = false,
}) {
  const defaultCrop = {
    unit: "%", // Can be 'px' or '%'
    x: 25,
    y: 25,
    width: 50,
    height: 50,
    aspect: 1 / 1,
  };

  const inputRef = useRef(null);

  const [croppedImage, setCroppedImage] = useState(null);
  const [crop, setCrop] = useState(defaultCrop);
  const [errorMessage, setErrorMessage] = useState(null);
  const [image, setImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [name, setName] = useState(null);

  const handleChange = (event) => {
    const files = [...event.target.files];
    event.target.value = null;
    if (files.length > 0) {
      const { size, type } = files[0];
      if (maxSizeLimit && size > maxSizeLimit) {
        setErrorMessage(maxSizeLimitErrorMessage);
        return;
      }
      if (acceptedFileTypes && !acceptedFileTypes.split(",").includes(type)) {
        setErrorMessage(acceptedFileTypesErrorMessage);
        return;
      }
      setErrorMessage(null);
      setName(files[0].name);
      setSelectedImage(URL.createObjectURL(files[0]));
    }
  };

  useEffect(() => {
    selectedImage === null && setCrop(defaultCrop);
    console.log({ selectedImage });
  }, [selectedImage]);

  useEffect(() => {
    image && onChange(image);
  }, [image]);

  const renderImage = () => {
    if (image) {
      return <img src={URL.createObjectURL(image)} alt="pic" />;
    }
    if (imageSrc) {
      return <img src={imageSrc} alt="pic" />;
    }
    return (
      <img
        src={require("../../assets/images/image-large.svg").default}
        alt="pic"
      />
    );
  };

  return (
    <Fragment>
      <div className="uploadCompanyLogo">
        {renderImage()}
        <span
          className="editCompLogo"
          onClick={(event) => {
            event.preventDefault();
            inputRef.current.click();
          }}
        >
          Edit Logo
        </span>
        <input
          type="file"
          ref={inputRef}
          style={{ display: "none" }}
          onChange={(event) => {
            event.preventDefault();
            // if (loading) return;
            handleChange(event);
          }}
          accept={acceptedFileTypes}
        />
      </div>
      {errorMessage && (
        <div className="alertRibbon alertDanger">{errorMessage}</div>
      )}
      {Boolean(selectedImage) && (
        <Modal
          show={Boolean(selectedImage)}
          close={() => setSelectedImage(null)}
          header="Edit Image"
          body={
            <ReactCrop
              circularCrop={circularCrop}
              crop={crop}
              keepSelection={true}
              onChange={(_crop) => setCrop(_crop)}
              src={selectedImage}
              onImageLoaded={(_croppedImage) => setCroppedImage(_croppedImage)}
              minWidth={170}
              minHeight={170}
            ></ReactCrop>
          }
          accept={async () => {
            const _image = await CroppedImg(croppedImage, crop, name);
            setImage(_image);
            setSelectedImage(null);
          }}
          reject={() => setSelectedImage(null)}
        ></Modal>
      )}
    </Fragment>
  );
}

export default ImageCrop;
