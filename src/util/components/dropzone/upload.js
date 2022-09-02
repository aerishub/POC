import React, { useEffect } from "react";
import { Storage } from "aws-amplify";
import { nanoid } from "nanoid";

const FileUpload = ({
  file,
  uploaded,
  is_uploaded,
  remove_file,
  path,
  disabled,
  id,
}) => {
  const [progress, setProgress] = React.useState(is_uploaded ? 100 : 0);
  const [fileUploaded, setFileUploaded] = React.useState(file.uploaded);

  useEffect(() => {
    console.log({ fileUploaded });
  }, [fileUploaded]);

  const fileName = () => {
    const extension = file.name.split(".").pop();
    return `${nanoid()}.${extension}`;
  };

  const uploadFile = async (key = path + fileName()) => {
    try {
      Storage.put(key, file, {
        completeCallback: () => {
          console.log("completed");
          file.uploaded = true;
          file.path = key;
          setFileUploaded(true);
          uploaded();
        },
        progressCallback: (_progress) => {
          const { loaded, total } = _progress;
          setProgress((total / loaded) * 100);
          if (loaded === total) {
            file.uploaded = true;
            file.path = key;
            setFileUploaded(true);
            uploaded();
          }
        },
        errorCallback: (err) => {
          console.log({ err });
          file.uploaded = true;
          uploaded();
        },
      });
    } catch (error) {
      console.log({ error });
    }
  };

  const removeFile = async () => {
    try {
      await Storage.remove(path, { level: "public" });
      uploaded();
      remove_file(id);
    } catch (error) {
      console.log({ error });
    }
  };

  useEffect(() => {
    if (!is_uploaded) {
      uploadFile();
      uploaded();
    }
  }, []);

  return (
    <div className="progressBar">
      <span style={{ width: `${progress}%` }}>Progress</span>
      {fileUploaded && (
        <div className="removeFile" onClick={() => !disabled && removeFile()}>
          Remove
        </div>
      )}
    </div>
  );
};

export default FileUpload;
