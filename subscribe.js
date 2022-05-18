import { argv } from 'node:process';
import { createClient } from 'redis';

if (argv.length !== 3) {
    console.log('Where are the arguments? | Invalid arguments');
    process.exit(0);
}

const topic = argv[2];
console.log('topic:', topic);

const client = createClient();
client.on('error', (err) => console.log('Redis Client Error', err));
await client.connect();

const subscriber = client.duplicate();
await subscriber.connect();
await subscriber.subscribe(topic, (message) => {
    console.log('Got message from topic:', topic);
    console.log(message); // 'message'
});

process.on('SIGINT', () => {
    client.quit();
    subscriber.quit();
    process.exit(0);
})