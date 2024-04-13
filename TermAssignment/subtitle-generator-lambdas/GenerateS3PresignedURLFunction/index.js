const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const {
  SESv2Client,
  CreateEmailIdentityCommand,
  GetEmailIdentityCommand,
} = require("@aws-sdk/client-sesv2");

exports.handler = async function (event) {
  // Extract the input file name and email of the user.
  const body = JSON.parse(event.body);
  const fileName = body.fileName;
  const email = body.email;

  // Check if the email identity already exists in AWS SES
  const sesClient = new SESv2Client();
  const identityParams = { EmailIdentity: email };
  const getEmailIdentityCommand = new GetEmailIdentityCommand(identityParams);
  let emailIdentityResponse;
  try {
    emailIdentityResponse = await sesClient.send(getEmailIdentityCommand);
  } catch (error) {
    // If the email identity doesn"t exist, create it and send verification email
    if (error.name === "NotFoundException") {
      const createEmailIdentityParams = { EmailIdentity: email };
      const createEmailIdentityCommand = new CreateEmailIdentityCommand(
        createEmailIdentityParams
      );
      await sesClient.send(createEmailIdentityCommand);
      console.log("Verification email sent to", email);

      return {
        statusCode: 200,
        body: JSON.stringify({
          preSignedURL: null,
          isEmailVerified: false,
        }),
        headers: {
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "OPTIONS,POST",
        },
      };
    } else {
      throw error;
    }
  }

  // If email identity is created but not successfully verified, don't send preSignedURL, let user verify first.
  if (emailIdentityResponse.VerificationStatus !== "SUCCESS") {
    console.log("Email", email, "verification is not successful yet.");
    return {
      statusCode: 200,
      body: JSON.stringify({
        preSignedURL: null,
        isEmailVerified: false,
      }),
      headers: {
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST",
      },
    };
  }

  console.log("Email", email, "is already verified.");

  // Create a Pre-signed URL for the S3 Object with given file name and email as a tag
  const s3Client = new S3Client();
  const s3Command = new PutObjectCommand({
    Bucket: process.env.INPUT_BUCKET_NAME,
    Key: fileName,
    Tagging: `email=${email}`,
  });
  const s3Response = await getSignedUrl(s3Client, s3Command, {
    expiresIn: 3600,
    unhoistableHeaders: new Set(["x-amz-tagging"]),
  });
  console.log("S3 Response", s3Response);

  // Send the Pre-signed URL to frontend, so that user can directly upload to S3
  return {
    statusCode: 200,
    body: JSON.stringify({
      preSignedURL: s3Response,
      isEmailVerified: true,
    }),
    headers: {
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS,POST",
    },
  };
};
