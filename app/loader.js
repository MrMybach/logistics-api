const
    config = require('./config.js'),
    fs = require('fs'),
    routes = require('./routes.js'),
    bodyParser = require('body-parser');

module.exports = (app) => {
    return {
        load: () => {
            app.controllers = {};
            app.config = config;

            fs.readdir('./app/controllers', (error, files) => {
                if (error) {
                    throw new Error(error);
                }

                if (!files.length) {
                    throw new Error('NO_CONTROLLER_FILES_LOADED');
                }

                files.forEach((module) => {
                    const controller = module.replace('.js', '');

                    app.controllers[controller] = require('./controllers/' + controller);
                });
            });

            app.use(bodyParser.json());

            routes(app);

            console.log('');
            console.log('<============================================>');
            console.log('                                            ||');
            console.log('    App loaded!                             ||');
            console.log(`    Logistics API is running on port ${app.config.port}   ||`);
            console.log('                                            ||');
            console.log('<============================================>');
            console.log('');
        }
    }
};
