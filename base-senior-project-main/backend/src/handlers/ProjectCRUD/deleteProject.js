'use-strict'

/*Used for deleting projects
URL/deleteProject/{ProjectID}
*Returns 204 whether or not anything was actually deleted*
*204: Successful Delete*
*400: Error on client: Missing ProjectID in path*
*500: Error on server*
*/

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event) => {

    const params = {
        TableName: process.env.PROJECTS_TABLE,//get table name
        Key: {//deletes based off the id given in the path
            ProjectID: parseInt(event.pathParameters.ProjectID)
        }
    };

    if (!params.Key.ProjectID){//if no project id in path
        return{
            statusCode: 400,
            message: "Bad Request: Missing ProjectID"
        }
    }

    try {
        const data = await dynamoDb.delete(params).promise(); //delete project 
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