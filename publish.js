import { argv } from 'node:process';
import { createClient } from 'redis';


if (argv.length !== 4) {
  console.log('Where are the arguments? | Invalid arguments');
  process.exit(0);
}

const topic = argv[2];
const message = argv[3];
console.log('topic:', topic);
console.log('message:', message);


const client = createClient();
client.on('error', (err) => console.log('Redis Client Error', err));
await client.connect();

const publisher = client.duplicate();
await publisher.connect();
await publisher.publish(topic, message);

process.on('SIGINT', () => {
    client.quit();
    publisher.quit();
    process.exit(0);
})