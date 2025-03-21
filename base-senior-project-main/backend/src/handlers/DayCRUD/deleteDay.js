 'use-strict'
 
 /*Used for deleting Days
 URL/deleteDay/{Date}
 *Returns 204 whether or not anything was actually deleted*
 *204: Successful Delete*
 *400: Error on client: Missing Date in path*
 *500: Error on server*
 */
 
 const AWS = require('aws-sdk');
 const dynamoDb = new AWS.DynamoDB.DocumentClient();
 
 module.exports.handler = async (event) => {
 
     const params = {
         TableName: process.env.DAYS_TABLE,//get table name
         Key: {//deletes based off the date given in the path
             Date: event.pathParameters.Date
         }
     };
 
     if (!params.Key.Date){//if no Date in path
         return{
             statusCode: 400,
             message: "Bad Request: Missing Date"
         }
     }
 
     try {
         const data = await dynamoDb.delete(params).promise(); //delete Date 
         return {//no error-return 204
             statusCode: 204,//no content
         };
     }catch (error) {
         // Handle any errors that occurred during the delete operation
         console.error('Error deleting item:', error);
         return {
           statusCode: 500, // Internal Server Error
           body: JSON.stringify({ message: 'Failed to delete item', error: error.message }),
         };
     }
 }