'use strict'

/*Used for creating and updating employees
Send a body with a EmployeeID: Int, EmployeeName: String, ProjectID: Int
URL/createEmployee
***Both creating and updating require you to send all the data needed for a full employee***
*201: employee successfully created*
*400: bad request - client error - missing attributes in body*
*500: Serverside error*
*/

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event) => {
    const body = JSON.parse(event.body);
    const EmployeeID = body.EmployeeID;
    const EmployeeName = body.EmployeeName;
    const ProjectID = body.ProjectID;
    const params = {//params: how we find the table and item to create/update
        TableName: process.env.EMPLOYEES_TABLE,
        Item: {//the item/row to be created
        EmployeeID: EmployeeID,
        EmployeeName: body.EmployeeName,
        ProjectID: body.ProjectID
        }
    };

    if(!ProjectID || !EmployeeName || !EmployeeID){//if one of these is empty, return bad request
        return {
            statusCode: 400,//400: bad request
            body: JSON.stringify("Bad Request, missing attributes in body.")
        }
    }
    if (typeof ProjectID !== 'number' || typeof EmployeeName !== 'string' || typeof EmployeeID !== 'number') {
        return {
            statusCode: 400, // 400: bad request
            body: JSON.stringify("Bad Request, invalid data types. ProjectID must be an integer, Employee must be a string, and EmployeesID must be an integers.")
        };
    }

    try{
        await dynamoDb.put(params).promise();
        
        return{
            statusCode: 201,//201: created
            body: JSON.stringify({
                message: 'Created Successfully',
                EmployeeID: EmployeeID,//returning the data for validity
                EmployeeName: EmployeeName,
                ProjectID: ProjectID
            })
        }
    }catch (e) {
        return {
            statusCode: 500,//500: bad request
            body: JSON.stringify("Internal server error: " + e)
        }
    }
}