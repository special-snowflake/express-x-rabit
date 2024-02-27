const amqp = require('amqplib');
const dotenv = require('dotenv');
const { addData, deleteData, updateData } = require('./models');

dotenv.config();

const connectRabbitMQ = async () => {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    const channel = await connection.createChannel();
    await channel.assertQueue('qtest1');

    console.log('Connected to RabbitMQ');

    channel.consume('qtest1', async (message) => {
      const data = JSON.parse(message.content.toString());
      console.log('Received message:', data);
      const { Nama, Status, Id } = data.data;

      switch (data?.command) {
        case 'create':
          await addData(Nama, Status);
          break;
        case 'update':
          await updateData(Nama, Status, Id);
          break;
        case 'delete':
          await deleteData(Id);
          break;
        default:
          console.log('Invalid command:', data.command);
      }

      channel.ack(message);
    });
  } catch (error) {
    console.error('Error:', error.message);
  }
};

connectRabbitMQ();
