const keys = require('./keys');

// express app set-up
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// postgres client set-up
const { Pool } = require('pg');
const pgClient = new Pool({
    user: keys.pgUser,
    host: keys.pgHost,
    database: keys.pgDatabase,
    password: keys.pgPassword,
    port: keys.pgPort
});
pgClient.on('error', () => console.log('Lost PG connection'));
pgClient.query('CREATE TABLE IF NOT EXISTS values (number INT)')
    .catch((err) => console.log(err));

// redis client set-up
const redis = require('redis');
const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000
});
const redisPublisher = redisClient.duplicate();

// express route handlers
app.get('/', (req, res) => {
    res.send('Hi there');
});
// return seen indices
app.get('/values/all', async (req, res) => {
    const values = await pgClient.query('SELECT DISTINCT * FROM values ORDER BY number ASC');
    res.send(values.rows);
});
// return calculated values
app.get('/values/current', async (req, res) => {
    redisClient.hgetall('values', (err, values) => {
        res.send(values);
    });
});
app.post('/values', async (req, res) => {
    const index = req.body.index;
    if (parseInt(index) > 40) {
        return res.status(422).send('Index too high');
    }
    redisClient.hget('values', index, (err, value) => {
        if (value) {
            return res.send({ working: false });
        }
        redisClient.hset('values', index, 'Nothing yet!');
        redisPublisher.publish('insert', index);
        pgClient.query('INSERT INTO values(number) VALUES($1)', [index]);
        res.send({ working: true });
    });
});
app.post('/reset', async (req, res) => {
    await pgClient.query('DELETE FROM values');
    redisClient.del('values', (err, values) => {
        res.send({ deleting: true });
    });
});
app.listen(5000, (err) => {
    console.log('Listening on port 5000');
});
