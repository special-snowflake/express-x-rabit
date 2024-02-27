const express = require('express');
const amqp = require('amqplib');
const bodyParser = require('body-parser');
const models = require('./models');
require('dotenv').config();

const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;
app.use(bodyParser.json());

const sendMessageToQueue = async (message) => {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    const channel = await connection.createChannel();
    await channel.assertQueue('qtest1');
    await channel.sendToQueue('qtest1', Buffer.from(JSON.stringify(message)));
    console.log('Message sent to queue:', message);
  } catch (error) {
    console.error('Error sending message to queue:', error.message);
  }
};

app.get('/api/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await models.getDetail(id);
    if (result.length === 0)
      return res.status(404).json({
        message: 'Data tidak ditemukan'
      });
    return res.json(result);
  } catch (error) {}
  return res.status(500).json({
    message: 'Something went wrong!'
  });
});

app.get('/api', async (req, res) => {
  const page = req.query.page || 1;
  const limit = 20;
  const offset = (page - 1) * limit;
  try {
    const result = await models.getList(limit, offset);
    return res.json(result);
  } catch (error) {}
  return res.status(500).json({
    message: 'Something went wrong!'
  });
});

app.post('/api', async (req, res) => {
  const { Nama, Status } = req.body;
  try {
    const result = await models.addData(Nama, Status);
    return res.json({
      message: 'Data berhasil ditambahkan',
      id: result?.insertId
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: error?.message || 'Internal server error' });
  }
});

app.put('/api/:id', async (req, res) => {
  const { id } = req.params;
  const { Nama, Status } = req.body;

  try {
    await models.updateData(Nama, Status, id);
    return res.json({ message: 'Data Berhasil Diperbarui' });
  } catch (error) {
    res
      .status(500)
      .json({ message: error?.message || 'Internal server error' });
  }
});

app.delete('/api/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await models.deleteData(id);
    return res.json({ message: 'Data Berhasil Dihapus' });
  } catch (error) {
    res
      .status(500)
      .json({ message: error?.message || 'Internal server error' });
  }
});

app.post('/api/work', (req, res) => {
  const data = req.body;
  const message = {
    command: 'create',
    data
  };
  sendMessageToQueue(message);
  return res.json({ message: 'Message sent to worker' });
});

app.delete('/api/work/:id', (req, res) => {
  const { id } = req.params;
  const message = {
    command: 'delete',
    data: {
      Id: id
    }
  };
  sendMessageToQueue(message);
  return res.json({ message: 'Message sent to worker' });
});

app.put('/api/work/:id', (req, res) => {
  const { id } = req.params;
  const body = req.body;
  const message = {
    command: 'update',
    data: {
      ...body,
      Id: id
    }
  };
  sendMessageToQueue(message);
  return res.json({ message: 'Message sent to worker' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
