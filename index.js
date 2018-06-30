const
    express = require('express'),
    config = require('./app/config.js'),
    loader = require('./app/loader.js'),
    app = express();

app.listen(config.port, loader(app).load());
