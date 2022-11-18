# ADropCal

Azure Drop Calendar Calculator

## What is this?

Uses the public [API](https://github.com/azurestandard/api-spec.git) for <https://azurestandard.com>, looks up your drop, and puts the output in iCal format.

## How to use

Create a `config.json` file with

```json
{
    "user": "yourAccount@example.com",
    "pass": "yourPass",
    "drop": 0000000
}
```

Note if you don't know the drop number (you can get it from the webpage) the
program will list all drops you can 'see' when it runs

`npm i && node index.js`

The calendar is then presented at <http://127.0.0.1:3000> (or alternate `$PORT`).

Access for example http://127.0.0.1:3000/drops.ics and it will download or subscribe an .ics file with the drop cutoff dates

## License

Copyright (C) 2022 Code Hive Tx LLC

[Apache-2.0](./LICENSE)

Not affiliated with or endorsed by Azure Standard in any way. Completely unrelated to Microsoft Azure.

## Author

Steven R. Loomis / @srl295 of <https://codehivetx.us>

