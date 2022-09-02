import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Amplify, Storage, Auth } from "aws-amplify";
import awsExports from "./aws-exports";

Amplify.configure({
  Auth: {
    identityPoolId: "us-east-1:cd9b0dd0-d2f0-42fc-8487-cd377882b000", //REQUIRED - Amazon Cognito Identity Pool ID
    region: "us-east-1", // REQUIRED - Amazon Cognito Region
    userPoolId: "us-east-1_ytwXgCrMV", //OPTIONAL - Amazon Cognito User Pool ID
    userPoolWebClientId: "61enl9qr9j6krv3vifpcmnu7ka", //OPTIONAL - Amazon Cognito Web Client ID
    mandatorySignIn: false, //OPTIONAL - Enforce user authentication prior to accessing AWS resources or not
  },
  Storage: {
    AWSS3: {
      bucket: "aeris-live-dev", //REQUIRED -  Amazon S3 bucket name
      region: "us-east-1", //OPTIONAL -  Amazon service region
      identityPoolId: "us-east-1:cd9b0dd0-d2f0-42fc-8487-cd377882b000",
      mandatorySignIn: false, //OPTIONAL - Enforce user authentication prior to accessing AWS resources or not
    },
  },
});

// const currentConfig = Auth.configure();
// const _currentConfig = Storage.configure();
// console.log({ currentConfig, _currentConfig, Storage, Auth });
// console.log({ Auth, Storage });

global.Buffer = global.Buffer || require("buffer").Buffer;

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
