module.exports = (app) => {
    app.post('/order', (req, res) => {
        app.controllers.api.order.apply(this, [ app, req, res ]);
    });

    app.get('/orders', (req, res) => {
        app.controllers.api.orders.apply(this, [ app, req, res ]);
    });
};
