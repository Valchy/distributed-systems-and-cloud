require('dotenv').config();
const AWS = require('aws-sdk');

const { createUser } = require('./database');

const queueURL = process.env.AWS_QUEUE_URL;

// Set the AWS region and credentials
AWS.config.update({
	region: process.env.AWS_REGION,
	accessKeyId: process.env.AWS_ACCESS_KEY,
	secretAccessKey: process.env.AWS_ACCESS_SECRET
});

// Create an SQS service object
const sqs = new AWS.SQS();

const processMessage = message => {
	// Print the message body to the console
	console.log('Message processed:', message.Body);

	// Delete the message from the queue
	sqs.deleteMessage(
		{
			QueueUrl: queueURL,
			ReceiptHandle: message.ReceiptHandle
		},
		err => {
			// Error handling
			if (err) console.log('Error deleting message:', err);
			else {
				console.log('Message deleted from the queue');

				// Create user in db
				createUser(message.Body, saveSuccess => {
					console.log(`User ${saveSuccess ? 'successfully saved to db!' : 'failed to be saved...'}`);
				});
			}
		}
	);
};

// Start polling for messages
(() => {
	setInterval(() => {
		sqs.receiveMessage(
			{
				QueueUrl: queueURL,
				MaxNumberOfMessages: 1,
				WaitTimeSeconds: 5
			},
			(err, data) => {
				// Error handling
				if (err) return console.log('Error receiving message:', err);

				if (data.Messages && data.Messages.length > 0) {
					// Process the received message
					processMessage(data.Messages[0]);
				}
			}
		);
	}, 5000);
})();

// Send the request to SQS
module.exports = msg =>
	sqs.sendMessage(
		{
			MessageBody: msg,
			QueueUrl: queueURL
		},
		(err, data) => {
			// Error handling
			if (err) console.log('Error sending message:', err);
			else console.log('Message sent successfully:', data.MessageId);
		}
	);
