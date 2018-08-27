const
    config = require('./config.js'),
    express = require('express'),
    path = require('path'),
    fs = require('fs'),
    routes = require('./routes.js'),
    bodyParser = require('body-parser'),
    filesLoader = (app, type) => {
        fs.readdir(`./app/${type}`, (error, files) => {
            app[type] = {};

            if (error) {
                throw new Error(error);
            }

            if (!files.length) {
                throw new Error('NO_FILES_LOADED');
            }

            files.forEach((module) => {
                const moduleToLoad = module.replace('.js', '');

                app[type][moduleToLoad] = require(`./${type}/${moduleToLoad}`);
            });

            console.info(`${type} are loaded!`)
        });
    }

module.exports = (app) => {
    return {
        /**
         * Odpowiada m.in. za załadowanie kontrolerów i serwisów do aplikacji
         * @return {undefined}
         */
        load: async () => {
            try {
                app.config = config;
                app.controllers = await filesLoader(app, 'controllers');
                app.services = await filesLoader(app, 'services');

                app.use(bodyParser.json());
                app.use('/public', express.static(path.join(__dirname, '../public')));
                app.set('view engine', 'pug');

                routes(app);

                console.log('');
                console.log('<============================================>');
                console.log('                                            ||');
                console.log('    App loaded! 👍                          ||');
                console.log(`    Logistics API is running on port ${app.config.port}   ||`);
                console.log('                                            ||');
                console.log('<============================================>');
                console.log('');
            } catch(error) {
                throw new Error('LAUNCHING_ERROR_🔥')
            }
        }
    }
};
