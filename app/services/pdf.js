const
    fs = require('fs'),
    path = require('path'),
    pdf = require('html-pdf');

function checkDirectory(directory) {
    try {
        fs.statSync(directory);
    } catch(e) {
        fs.mkdirSync(directory);
    }
}

module.exports = {
    render: (app, response) => {
        checkDirectory(path.join(__dirname, '../../public'));

        app.render('order.pug', {
                title: 'Order',
                response: response
            }, (error, html) => {
                if (error) {
                    console.log('HTML_RENDER_ERROR');
                }

                pdf
                    .create(html, { format: 'Letter' })
                    .toFile(path.join(__dirname, `../../public/${Date.now()}.pdf`), (error, file) => {
                        if (error) {
                            console.log('PDF_GENERATE_ERROR');
                        }
                    const fileName = file.filename.split('/').pop();

                    console.log(`PDF generated on: http://localhost:${app.config.port}/public/${fileName}`);
                });
        });
    }
};
