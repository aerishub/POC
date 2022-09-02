const aws = {
  // aws_project_region: "us-east-1",
  // aws_cognito_identity_pool_id:
  //   "us-east-1:cd9b0dd0-d2f0-42fc-8487-cd377882b000",
  // aws_cognito_region: "us-east-1",
  // aws_user_pools_id: "us-east-1_ytwXgCrMV",
  // aws_user_pools_web_client_id: "61enl9qr9j6krv3vifpcmnu7ka",
  // aws_user_files_s3_bucket: "aeris-live-dev",
  // aws_user_files_s3_bucket_region: "us-east-1",
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
    },
  },
};

export default aws;
