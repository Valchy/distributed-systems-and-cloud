require('dotenv').config();
const AWS = require('aws-sdk');

// Set the AWS region and credentials
AWS.config.update({
	region: process.env.AWS_REGION,
	accessKeyId: process.env.AWS_ACCESS_KEY,
	secretAccessKey: process.env.AWS_ACCESS_SECRET
});

// Create an S3 client
const s3 = new AWS.S3();

// Specify the S3 bucket and file name
const bucketName = 'load-balancer-configuration';
const fileName = 'host-configuration.json';

// Set up parameters for the getObject operation
const params = {
	Bucket: bucketName,
	Key: fileName
};

// Call the getObject operation to retrieve the JSON file
module.exports = () =>
	new Promise((resolve, reject) => {
		s3.getObject(params, (err, data) => {
			if (err) {
				reject(err);
			} else {
				resolve(JSON.parse(data.Body.toString()));
			}
		});
	});
