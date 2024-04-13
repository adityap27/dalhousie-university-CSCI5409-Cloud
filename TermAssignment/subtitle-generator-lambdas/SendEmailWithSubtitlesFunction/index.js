const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");
const {
  TranscribeClient,
  GetTranscriptionJobCommand,
} = require("@aws-sdk/client-transcribe");

exports.handler = async (event, context) => {
  // Fetch the completed TranscriptionJob.
  const transcribeClient = new TranscribeClient();
  const transcribeInput = {
    TranscriptionJobName: event.detail.TranscriptionJobName,
  };
  const transcribeCommand = new GetTranscriptionJobCommand(transcribeInput);
  const transcribeResponse = await transcribeClient.send(transcribeCommand);

  // Extract subtitle URL, media file name and email from transcribeResponse.
  const subtitleUrl =
    transcribeResponse.TranscriptionJob.Subtitles.SubtitleFileUris[0];
  const mediaFileName =
    transcribeResponse.TranscriptionJob.Media.MediaFileUri.split("/").pop();
  const emailTag = transcribeResponse.TranscriptionJob.Tags.find(
    (tag) => tag.Key === "email"
  );

  // Create HTML message with subtitle URL and media file name.
  const subject = `Subtitles Generated - ${mediaFileName}`;
  const htmlBody = `<p><b>File Name</b>: ${mediaFileName}</p>
                            <p><b>Subtitle URL</b>: <a href="${subtitleUrl}">Download Subtitles.</a></p>`;

  // Send the email to user with .srt file URL and input media file name.
  const sesClient = new SESClient();
  const sesCommand = new SendEmailCommand({
    Source: process.env.SES_SENDER,
    Destination: {
      ToAddresses: [emailTag.Value],
    },
    Message: {
      Subject: {
        Data: subject,
      },
      Body: {
        Html: {
          Data: htmlBody,
        },
      },
    },
  });
  const sesResponse = await sesClient.send(sesCommand);

  console.log("SESClient response: ", sesResponse);

  return sesResponse;
};
