'use strict'
/*Used for getting specific employee in employee table
URL/getEmployee/{EmployeeID}
*400: missing employeeid in path*
*404: employee with employeeid not found*
*200: good request/items returned*
*500: error*
*/
const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
module.exports.handler = async (event) => {
    const params = {
        TableName: process.env.EMPLOYEES_TABLE,
        Key: {
            EmployeeID: parseInt(event.pathParameters.EmployeeID)
        }
    };
    if (!params.Key.EmployeeID){//if no employee id in path
            return{
                statusCode: 400,
                message: "Bad Request: Missing EmployeeID"
            }
        }
        
    try {
        const data = await dynamoDb.get(params).promise();  // Query DynamoDB using the employeeID
        
        if (!data.Item) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: 'Employee not found' }),
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify(data.Item),  // Return the employee data as JSON
        };
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error fetching data', error: err }),
        };
    }
};