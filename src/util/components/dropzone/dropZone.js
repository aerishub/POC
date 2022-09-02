import React, { useReducer, useRef, useState } from "react";
import FilePreview from "./filePreview";
import * as md5 from "md5";
import { nanoid } from "nanoid";
import { useDidUpdateEffect } from "../../hooks/useDidUpdateEffect";

// reducer function to handle state changes
const reducer = (state, action) => {
  switch (action.type) {
    case "SET_IN_DROP_ZONE":
      return { ...state, inDropZone: action.inDropZone };
    case "ADD_FILE_TO_LIST":
      return { ...state, fileList: action.files };
    case "REMOVE_FILE_FROM_LIST":
      return {
        ...state,
        fileList: state.fileList.filter((f) => {
          return f.id !== action.id;
        }),
      };
    case "FILE_UPLOADING":
      return {
        ...state,
        isUploading: action.isUploading,
      };
    case "UPLOADED_FILES":
      return { ...state, fileList: action.files };
    default:
      return state;
  }
};

const DropZone = ({
  allowMultipleFileUpload,
  multipleFileUploadAtATime,
  acceptedFileTypes,
  uploading,
  path = "",
  sizeLimit = 0,
  disabled = false,
  selectedFiles,
  header = "Upload Image",
  supportedFileTypesMessage = "",
  maximumFileSizeExceededMessage = "",
  docSupported = false,
  docxSupported = false,
  uploadedFiles = [],
}) => {
  const handleUploadedFiles = (files) => {
    if (files && files.length > 0) {
      return files.map(({ path, name, size, hash }) => {
        return { path, name, size, hash, uploaded: true, id: nanoid() };
      });
    }
    return [];
  };

  // destructuring state and dispatch, initializing fileList to empty array
  const [data, dispatch] = useReducer(reducer, {
    inDropZone: false,
    fileList: handleUploadedFiles(uploadedFiles),
    isUploading: false,
  });

  const [errorMessage, setErrorMessage] = useState(null);

  useDidUpdateEffect(() => {
    if (!data.isUploading) {
      const files = data.fileList.map(({ path, name, size, hash }) => {
        return { path, name, size, hash };
      });
      selectedFiles(files);
    }
  }, [data]);

  const inputRef = useRef(null);

  // onDragEnter sets inDropZone to true
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch({ type: "SET_IN_DROP_ZONE", inDropZone: true });
  };

  // onDragLeave sets inDropZone to false
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();

    dispatch({ type: "SET_IN_DROP_ZONE", inDropZone: false });
  };

  // onDragOver sets inDropZone to true
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // set dropEffect to copy i.e copy of the source item
    e.dataTransfer.dropEffect = "copy";
    dispatch({ type: "SET_IN_DROP_ZONE", inDropZone: true });
  };

  // onDrop sets inDropZone to false and adds files to fileList
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // get files from event on the dataTransfer object as an array
    let files = [...e.dataTransfer.files];
    addNewFiles(files);
    dispatch({ type: "SET_IN_DROP_ZONE", inDropZone: false });
  };

  // handle file selection via input element
  const handleFileSelect = (e) => {
    // get files from event on the input element as an array
    const files = [...e.target.files];
    e.target.value = null;
    addNewFiles(files);
  };

  const file_extension = (name) => {
    const dotIndex = name.lastIndexOf(".");
    return name.substring(dotIndex + 1, name.length);
  };

  const addNewFiles = (files) => {
    if (disabled) {
      return;
    }
    files = files.map((f) => {
      f.hash = md5(f);
      f.uploaded = false;
      f.id = nanoid();
      return f;
    });
    // ensure a file or files are selected
    if (files && files.length > 0) {
      files = files.filter((f) => {
        if (
          !(
            acceptedFileTypes.split(",").includes(f.type) ||
            (docSupported && file_extension(f.name) === "doc") ||
            (docxSupported && file_extension(f.name) === "docx")
          )
        ) {
          setErrorMessage(supportedFileTypesMessage);
          return false;
        }
        if (sizeLimit && f.size > sizeLimit) {
          setErrorMessage(maximumFileSizeExceededMessage);
          return false;
        }
        setErrorMessage(null);
        return true;
      });

      if (allowMultipleFileUpload) {
        // loop over existing files
        const existingFiles = data.fileList.map((f) => f.name);
        // check if file already exists, if so, don't add to fileList
        // this is to prevent duplicates
        files = files.filter((f) => !existingFiles.includes(f.name));
      }

      // dispatch action to add selected file or files to fileList
      allowMultipleFileUpload
        ? dispatch({
            type: "ADD_FILE_TO_LIST",
            files: [...data.fileList, ...files],
          })
        : addFileToList(files);
    }
  };

  const addFileToList = (files) => {
    const is_exist = data.fileList.find((f) => f.name === files[0].name);
    if (!is_exist) {
      dispatch({ type: "ADD_FILE_TO_LIST", files: [] });
      setTimeout(() => {
        dispatch({ type: "ADD_FILE_TO_LIST", files });
      }, 100);
    }
  };

  const removeFile = (id) => {
    dispatch({ type: "REMOVE_FILE_FROM_LIST", id });
  };

  const convertSizeLimitToMB = (sizeLimit) => {
    return sizeLimit / 1024 / 1024;
  };

  return (
    <React.Fragment>
      <div className="uploadWrap">
        <label>{header}</label>
        <div
          className={
            data.inDropZone ? "uploadBlk dragDropSelector" : "uploadBlk"
          }
          onDragEnter={(e) => handleDragEnter(e)}
          onDragOver={(e) => handleDragOver(e)}
          onDragLeave={(e) => handleDragLeave(e)}
          onDrop={(e) => handleDrop(e)}
          onClick={() => inputRef.current.click()}
        >
          <span className="uploadIcon">
            <img
              src={
                require("../../../assets/images/icon-upload-image.svg").default
              }
              alt="Upload"
            />
          </span>
          <input
            id="fileSelect"
            type="file"
            multiple={multipleFileUploadAtATime}
            onChange={(e) => handleFileSelect(e)}
            ref={inputRef}
            style={{ display: "none" }}
            accept={acceptedFileTypes}
          />
          <div className="uploadNote">
            <strong>Drag and drop or browse to choose a file</strong>
            {supportedFileTypesMessage && (
              <span>{supportedFileTypesMessage}</span>
            )}
            {sizeLimit && (
              <span>Maximum size is {convertSizeLimitToMB(sizeLimit)} MB</span>
            )}
          </div>
        </div>
        <React.Fragment>
          {errorMessage && (
            <div className="alertRibbon alertDanger">{errorMessage}</div>
          )}
        </React.Fragment>
        <ul className="uploadList">
          <FilePreview
            fileList={data.fileList}
            uploading={(value) => {
              dispatch({ type: "FILE_UPLOADING", isUploading: value });
              uploading(value);
            }}
            remove_file={(id) => removeFile(id)}
            path={path}
            disabled={disabled}
          />
        </ul>
      </div>
    </React.Fragment>
  );
};

export default DropZone;
