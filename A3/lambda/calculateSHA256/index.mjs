import { createHash } from 'crypto';
import axios from 'axios';

export const handler = async (event, context) => {
  
  // Calculate Hash
  const hashValue = createHash('sha256').update(event.value).digest('hex');
  
  // Create a JSON Payload
  const reqBody = {
    "banner": "B00952865",
    "result": hashValue,
    "arn": context.invokedFunctionArn,
    "action": event.action,
    "value": event.value
  };
  
  // Send to Server
  await axios.post(event.course_uri, reqBody)
  .then(function (response) {
    console.log("Hash sent to",event.course_uri);
    console.log(response.data);
  })
  .catch(function (error) {
   console.error("Something went wrong.");
   console.error(error);
  });
  
};
