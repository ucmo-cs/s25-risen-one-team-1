 'use strict'
 
 /*Used for creating and updating days
 Send a body with a Date: String, EmployeeID: Int, ProjectID: Int, HoursWorked: Number/Int/Decimal
 URL/createDay
 ***Both creating and updating require you to send all the data needed for a full day***
 *201: day successfully created*
 *400: bad request - client error - missing attributes in body*
 *500: Serverside error*
 */
 
 const AWS = require('aws-sdk');
 const dynamoDb = new AWS.DynamoDB.DocumentClient();
 
 module.exports.handler = async (event) => {
     const body = JSON.parse(event.body);
     const Date = body.Date;
     const EmployeeID = body.EmployeeID;
     const ProjectID = body.ProjectID;
     const HoursWorked = body.HoursWorked;
     const params = {//params: how we find the table and item to create/update
         TableName: process.env.DAYS_TABLE,
         Item: {//the item/row to be created
         Date: Date,
         EmployeeID: EmployeeID,
         ProjectID: body.ProjectID,
         HoursWorked: HoursWorked
         }
     };
 
     if(!ProjectID || !Date || !EmployeeID || !HoursWorked){//if one of these is empty, return bad request
         return {
             statusCode: 400,//400: bad request
             body: JSON.stringify("Bad Request, missing attributes in body.")
         }
     }
 
    if (typeof Date !== 'string' || typeof EmployeeID !== 'number' || typeof ProjectID !== 'number' || typeof HoursWorked !== 'number') {
        return {
            statusCode: 400, // 400: bad request
            body: JSON.stringify("Bad Request, invalid data types. Date must be a string, EmployeeID and ProjectID must be integers, and HoursWorked must be a number.")
        };
}

     try{
         await dynamoDb.put(params).promise();
         
         return{
             statusCode: 201,//201: created
             body: JSON.stringify({
                 message: 'Created Successfully',
                 Date: Date,//returning the data for validity
                 EmployeeID: EmployeeID,
                 ProjectID: ProjectID,
                 HoursWorked: HoursWorked
             })
         }
     }catch (e) {
         return {
             statusCode: 500,//500: bad request
             body: JSON.stringify("Internal server error: " + e)
         }
     }
 }