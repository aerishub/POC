export const toggleClasses = (
  Condition,
  classedIfSatisfy,
  classedIfNotSatisfy
) => {
  return Condition ? classedIfSatisfy : classedIfNotSatisfy;
};

export const formatFileSize = (bytes, decimals = 2) => {
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (
    parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + " " + sizes[i]
  );
};

export const blockInvalidCharForNumberField = (
  event,
  preventingValues = ["-"]
) => preventingValues.includes(event.key) && event.preventDefault();

export const canUpdateNumberField = (minValue, maxValue, value) =>
  value >= minValue && value <= maxValue;

export const restrictDecimalValue = (value, decimalPlace = 2) =>
  value.indexOf(".") >= 0
    ? value.substr(0, value.indexOf(".")) +
      value.substr(value.indexOf("."), decimalPlace + 1)
    : value;

export const Base64ToAscii = (base64String) => {
  return Buffer.from(base64String, "base64").toString("ascii");
};

export const AsciiToBase64 = (asciiString) => {
  return Buffer.from(asciiString).toString("base64");
};

export const FileToBase64 = (file, cb) => {
  let reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = function () {
    cb(reader.result);
  };
  reader.onerror = function (error) {
    console.log("Error: ", error);
  };
};

export const CroppedImg = (image, crop, name) => {
  console.log({ name })
  const canvas = document.createElement("canvas");
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  canvas.width = crop.width;
  canvas.height = crop.height;
  const ctx = canvas.getContext("2d");

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width,
    crop.height
  );
  // As Base64 string
  // const base64Image = canvas.toDataURL('image/jpeg');
  // As a blob
  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        blob.name = name;
        resolve(blob);
      },
      "image/jpeg",
      1
    );
  });
};
