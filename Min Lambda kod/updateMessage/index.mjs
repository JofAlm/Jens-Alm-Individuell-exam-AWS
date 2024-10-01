import AWS from "aws-sdk";

// Initiera DynamoDB-klienten
const dynamoDB = new AWS.DynamoDB.DocumentClient();

// Lambda-funktion för att uppdatera ett meddelande
export const handler = async (event) => {
  try {
    // Hämta username och id från URL path parameters
    const { username, id } = event.pathParameters;
    // Hämta texten som ska uppdateras från request body (JSON-format)
    const { text } = JSON.parse(event.body);

    // Kontrollera att text finns med i förfrågan
    if (!text) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Text is required" }),
      };
    }

    // Uppdatera meddelandet i DynamoDB-tabellen "Messages"
    const result = await dynamoDB
      .update({
        TableName: "Messages", // Namn på DynamoDB-tabellen
        Key: {
          username: username, // Partition Key (username)
          id: id, // Sort Key (id)
        },
        // Specificera att textfältet ska uppdateras
        UpdateExpression: "set #text = :text",
        // Använd ett alias för textfältet (eftersom 'text' är ett reserverat ord)
        ExpressionAttributeNames: { "#text": "text" },
        // Sätt det nya värdet för textfältet
        ExpressionAttributeValues: { ":text": text },
        // Returnera de uppdaterade attributen efter uppdateringen
        ReturnValues: "ALL_NEW",
      })
      .promise();

    // Returnera det uppdaterade meddelandet och status 200 (OK)
    return {
      statusCode: 200,
      body: JSON.stringify(result.Attributes),
    };
  } catch (error) {
    // Hantera eventuella fel under processen och returnera status 500 (Server Error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Could not update message" }),
    };
  }
};
