import React from "react";
import { formatFileSize } from "../../sharedFuctions";
import FileUpload from "./upload";

const FilePreview = ({ fileList, uploading, remove_file, path, disabled }) => {
  const handleUploading = () => {
    const isAllUploaded = fileList.every((file) => file.uploaded);
    uploading(!isAllUploaded);
  };

  return (
    <ul className="uploadList">
      {fileList.map((file, index) => {
        return (
          <li key={index}>
            <div className="iconImg">
              <img
                src={require("../../../assets/images/icon-img.svg").default}
                alt="Image"
              />
            </div>
            <div className="uploadDetail">
              <div className="fileDetail">
                <div className="fileName">{file.name}</div>
                <div className="fileSize">{formatFileSize(file.size)}</div>
              </div>
              <FileUpload
                file={file}
                path={path}
                id={file.id}
                is_uploaded={file.uploaded}
                uploaded={() => handleUploading()}
                remove_file={(id) => !disabled && remove_file(id)}
                disabled={disabled}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default FilePreview;
