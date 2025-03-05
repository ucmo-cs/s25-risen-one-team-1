'use strict'

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
module.exports.handler = async (event) => {
    const params = {
        TableName: process.env.PROJECTS_TABLE,
        Key: {
            ProjectID: parseInt(event.pathParameters.ProjectID)
        }
    };

    try {
        const data = await dynamoDb.get(params).promise();  // Query DynamoDB using the projectID
        
        if (!data.Item) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: 'Project not found' }),
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify(data.Item),  // Return the project data as JSON
        };
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error fetching data', error: err }),
        };
    }
};