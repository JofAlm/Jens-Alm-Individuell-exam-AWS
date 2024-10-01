import AWS from "aws-sdk";

const dynamoDB = new AWS.DynamoDB.DocumentClient();

export const handler = async (event) => {
  console.log("Received event:", JSON.stringify(event, null, 2)); // Logga hela eventet

  try {
    // Försöker hämta alla meddelanden från DynamoDB
    console.log("Querying DynamoDB for all messages...");
    const result = await dynamoDB
      .scan({
        TableName: "Messages", // Kontrollera att detta är korrekt tabellnamn
      })
      .promise();

    console.log("DynamoDB query result:", result); // Logga resultatet från DynamoDB

    return {
      statusCode: 200,
      body: JSON.stringify(result.Items),
    };
  } catch (error) {
    console.error("Error retrieving messages:", error); // Logga eventuella fel
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Could not retrieve messages" }),
    };
  }
};
