import AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid"; // Används för att skapa unika ID:n

const dynamoDB = new AWS.DynamoDB.DocumentClient();

export const handler = async (event) => {
  try {
    console.log("Received event:", JSON.stringify(event)); // Logga hela eventet

    // Försök att tolka body och logga den
    const { username, text } = JSON.parse(event.body);
    console.log("Parsed body:", { username, text });

    if (!username || !text) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Username and text are required" }),
      };
    }

    const message = {
      username,
      id: uuidv4(),
      text,
      createdAt: new Date().toISOString(),
    };

    // Logga meddelandet som ska sparas
    console.log("Message to be saved:", message);

    await dynamoDB
      .put({
        TableName: "Messages",
        Item: message,
      })
      .promise();

    return {
      statusCode: 201,
      body: JSON.stringify(message),
    };
  } catch (error) {
    console.error("Error creating message:", error); // Logga eventuella fel
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Could not create message" }),
    };
  }
};
