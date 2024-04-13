const {
  TranscribeClient,
  StartTranscriptionJobCommand,
} = require("@aws-sdk/client-transcribe");
const { S3Client, GetObjectTaggingCommand } = require("@aws-sdk/client-s3");
const { randomUUID } = require("crypto");

exports.handler = async function (event, context) {
  // Get the S3 URI of the object uploaded in the bucket.
  const s3BucketName = event["Records"][0]["s3"]["bucket"]["name"];
  const s3ObjectKey = event["Records"][0]["s3"]["object"]["key"];
  const s3InputObjectUri = `s3://${s3BucketName}/${s3ObjectKey}`;
  console.log("Input: ", s3InputObjectUri);

  // Retrieve email tag from the S3 object.
  const s3Client = new S3Client();
  const s3TagInput = {
    Bucket: s3BucketName,
    Key: s3ObjectKey,
  };

  const s3TagResponse = await s3Client.send(
    new GetObjectTaggingCommand(s3TagInput)
  );
  const emailTag = s3TagResponse.TagSet.find((tag) => tag.Key === "email");

  // Create a Transcription Job with the email as tag.
  const transcribeClient = new TranscribeClient();
  const transcribeInput = {
    TranscriptionJobName: s3ObjectKey + "_" + randomUUID(),
    IdentifyMultipleLanguages: true,
    LanguageOptions: ["en-US", "fr-CA"], // same media file can contain english + french combined.
    Media: {
      MediaFileUri: s3InputObjectUri,
    },
    Subtitles: {
      Formats: ["srt"],
      OutputStartIndex: 1,
    },
    Tags: [
      {
        Key: "email",
        Value: emailTag.Value,
      },
    ],
  };
  const transcribeCommand = new StartTranscriptionJobCommand(transcribeInput);
  const transcribeResponse = await transcribeClient.send(transcribeCommand);

  console.log("TranscribeClient response: ", transcribeResponse);
  return transcribeResponse;
};
