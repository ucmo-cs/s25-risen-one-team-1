'use strict'

/*Used for getting every employee in the employees table
URL/getAllEmployees
*404: no items in table*
*200: good request/items returned*
*500: error*
*/

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
module.exports.handler = async (event) => {
    const params = {
        TableName: process.env.EMPLOYEES_TABLE,
    };

    try {
        const data = await dynamoDb.scan(params).promise();  // Query DynamoDB for all Employees
        
        if (!data.Items || data.Items.length === 0) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: 'Employees not found' }),
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify(data.Items),  // Return the employees data as JSON
        };
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error fetching data', error: err }),
        };
    }
};