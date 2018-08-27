const
    fs = require('fs'),
    path = require('path'),
    pdf = require('html-pdf');

/**
 * Sprawdza czy istnieje folder w systemie plików. Jesli nie, to go tworzy
 * @param  {string} directory ścieżka do folderu
 * @return {undefined}
 */
function checkDirectory(directory) {
    try {
        fs.statSync(directory);
    } catch(e) {
        fs.mkdirSync(directory);
    }
}

module.exports = {
    /**
     * Renderuje PDF'a zamówienia
     * @param  {object} app  instancja Express'a
     * @param  {object} data dane do wyrenderowania pdf'a
     * @return {string}      uri do wygenerowanego pliku pdf
     */
    render: (app, data) => {
        checkDirectory(path.join(__dirname, '../../public'));

        app.render('order.pug', {
                title: 'Order',
                response: data
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
