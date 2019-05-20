# Express Monitoring
[![codecov](https://codecov.io/gh/Horat1us/express-monitoring/branch/master/graph/badge.svg)](https://codecov.io/gh/Horat1us/express-monitoring)
[![Build Status](https://travis-ci.org/Horat1us/express-monitoring.svg?branch=master)](https://travis-ci.org/Horat1us/express-monitoring)

Package allows to define custom monitoring controls (rules)
and execute them using express handlers.

This NodeJS adaptation of [Horat1us/yii2-monitoring](https://github.com/Horat1us/yii2-monitoring)
package for PHP.

Written on Typescript.

## Installation
Using [NPM](https://www.npmjs.com/package/express-monitoring):
```bash
npm i express-monitoring
```

## Documentation
- [Apiary](https://yii2monitoring.docs.apiary.io/)
- [Blueprint API](https://github.com/Horat1us/yii2-monitoring/blob/1.2.1/apiary.apib)

## Structure
- [Controller](./src/Controller.ts) - controller with express request handlers
- [Control](./src/Control.ts) - interface for monitoring control items.
    - [Compose](./src/controls/Compose.ts) - pre-defined control to compose another controls.
    - [Dependency](./src/controls/Dependency.ts) - pre-defined control to block execution of another control.
- [FailureError](./src/FailureError.ts) - error class to be thrown in controls.

## Usage

You need to define your own [Control](./src/Control.ts) or use one of [pre-defined](./src/controls).
Then, just create [Controller](./src/Controller.ts) instance and add it to routes.

```typescript
// region Monitoring Controller Definition
// This should be placed to separate file
import * as monitoring from "express-monitoring";

// can also be async or return promise
const SomeControl: monitoring.Control = () => {
    // check for something
    const isSuccessful = false;
    
    if (!isSuccessful) {
        throw new monitoring.FailureError(
            "Something goes wrong.",
            0, // error code
            {}, // details, optional
            "NotSuccessful" // string error type
        );
    }
    
    return {}; // you also may return details
};

let controls = {
    "controlID": SomeControl, 
};
const Monitoring = new monitoring.Controller(controls);
// endregion

import * as express from "express";

const app = express();
const port = 3000;

app.get('/monitoring/:id', Monitoring.control); // route to check controls separately
app.get('/monitoring/full', Monitoring.full); // route to check all controls by one request


app.listen(3000, () => `Monitoring app listening on port ${port}`);
```

Then you can make request `GET http://localhost:3000/monitoring/controlID`.
For response examples see [Documentation](#documentation).

## License
[MIT](./LICENSE)
