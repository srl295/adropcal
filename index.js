const SwaggerClient = require('swagger-client');

const { PORT } = require('process').env;
const ical = require('ical-generator');
const http = require('http');
const fs = require('fs');
const config = require('./config.json');

const spec = JSON.parse(fs.readFileSync('./node_modules/api-spec/spec.json', 'utf-8'));

// fixup spec so that it only uses basic

spec.security = [{ basic: [] }];

const cli = new SwaggerClient({
    // spec: './node_modules/api-spec/spec.json',
    spec,
    contextUrl: 'https://api.azurestandard.com',
    url: 'https://api.azurestandard.com',
    authorizations: {
        basic: { username: config.user, password: config.pass },
    }
});

const calendar = ical({name: `Drop Calendar for ${config.drop || 'ALL'}`});
const port = PORT || 3000;

function createEntry() {
    const startTime = new Date();
    const endTime = new Date();
    endTime.setHours(startTime.getHours()+1);
    calendar.createEvent({
        start: startTime,
        end: endTime,
        summary: 'Example Event',
        description: 'It works ;)',
        location: 'my room',
        url: 'http://sebbo.net/'
    });
}

function serve() {
    http.createServer((req, res) => calendar.serve(res))
    .listen(port, '127.0.0.1', () => {
        console.log(`Server running at http://127.0.0.1:${port}/`);
    });    
}

async function main() {
    const client = await cli;

    if(!config.drop) {
        console.log('No drop specified.. listing');
        const drops = await client.apis.drop.findDrops();
//        console.dir(drops.body);
        return drops.body;
    }

    // get drop info
    const dropInfo = await client.apis.drop.findDropById({id: config.drop});
    console.dir(dropInfo.body);

    const {body: trips} = await client.apis.trip.findTrips({drop: config.drop});

    for(const trip of trips) {
        const {route, cutoff} = trip;
        const startTime = new Date(cutoff);
        const endTime = new Date(cutoff);
//        endTime.setHours(startTime.getHours()+1);
        calendar.createEvent({
            start: startTime,
            end: endTime,
            summary: `${dropInfo.body.name} Cutoff`,
            description: `Route: ${route}, Drop: #${config.drop}`,
            // location: 'my room',
            // url: 'http://sebbo.net/'
        });
    }

    serve(); // setup server
}

main().then(ok => console.dir({ok}), err => console.error(err));
