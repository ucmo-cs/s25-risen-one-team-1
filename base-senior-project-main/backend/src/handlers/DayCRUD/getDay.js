'use strict'
/*Used for getting specific Day in Day table
URL/getDay/{Date}
*400: missing Date in path*
*404: Day with Date not found*
*200: good request/items returned*
*500: error*
*/
const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
module.exports.handler = async (event) => {
    const params = {
        TableName: process.env.DAYS_TABLE,
        Key: {
            Date: event.pathParameters.Date
        }
    };
    if (!params.Key.Date){//if no date in path
            return{
                statusCode: 400,
                message: "Bad Request: Missing Date"
            }
        }
        
    try {
        const data = await dynamoDb.get(params).promise();  // Query DynamoDB using the date
        
        if (!data.Item) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: 'Day Entry not found' }),
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify(data.Item),  // Return the day data as JSON
        };
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error fetching data', error: err }),
        };
    }
};