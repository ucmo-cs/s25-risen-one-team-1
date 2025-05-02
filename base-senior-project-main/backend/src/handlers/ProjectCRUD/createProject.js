'use strict'

/*Used for creating and updating projects
Send a body with a ProjectID: Int, ProjectName: String, EmployeesID: List of ints
URL/createProject
***Both creating and updating require you to send all the data needed for a full project***
*201: project successfully created*
*400: bad request - client error - missing attributes in body*
*500: Serverside error*
*/

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event) => {
    const body = JSON.parse(event.body);
    const ProjectID = body.ProjectID;
    const ProjectName = body.ProjectName;
    const EmployeesID = body.EmployeesID;
    const params = {//params: how we find the table and item to create/update
        TableName: process.env.PROJECTS_TABLE,
        Item: {//the item/row to be created
        ProjectID: ProjectID,
        ProjectName: ProjectName,
        EmployeesID: EmployeesID
        }
    };

    if(!ProjectID || !ProjectName || !EmployeesID){//if one of these is empty, return bad request
        return {
            statusCode: 400,//400: bad request
            body: JSON.stringify("Bad Request, missing attributes in body.")
        }
    }

    if (typeof ProjectID !== 'number' || typeof ProjectName !== 'string' || !Array.isArray(EmployeesID) || !EmployeesID.every(id => typeof id === 'number')) {
        return {
            statusCode: 400, // 400: bad request
            body: JSON.stringify("Bad Request, invalid data types. ProjectID must be an integer, ProjectName must be a string, and EmployeesID must be an array of integers.")
        };
    }
    try{
        await dynamoDb.put(params).promise();
        
        return{
            statusCode: 201,//201: created
            body: JSON.stringify({
                message: 'Created Successfully',
                ProjectID: ProjectID,//returning the data for validity
                ProjectName: ProjectName,
                Employees: EmployeesID
            })
        }
    }catch (e) {
        return {
            statusCode: 500,//internal server error
            body: JSON.stringify("Internal server error: " + e)
        }
    }
}