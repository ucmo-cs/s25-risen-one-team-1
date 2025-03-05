'use strict'

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event) => {
    const body = JSON.parse(event.body);
    const ProjectID = body.ProjectID;
    const ProjectName = body.ProjectName;
    const EmployeesID = body.EmployeesID;
    const params = {
        TableName: process.env.PROJECTS_TABLE,
        Item: {
        ProjectID: ProjectID,
        ProjectName: ProjectName,
        EmployeesID: EmployeesID
        }
    };

    try{
        await dynamoDb.put(params).promise();
        
        return{
            statusCode: 201,
            body: JSON.stringify({
                message: 'Created Successfully',
                ProjectID: ProjectID,
                ProjectName: ProjectName,
                Employees: EmployeesID
            })
        }
    }catch (e) {
        return {
            statuscode: 400,
            body: JSON.stringify("Bad Request: " + e)
        }
    }
}