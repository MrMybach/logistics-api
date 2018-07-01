module.exports = {
    order: (app, req, res) => {
        const orders = req.body;

        let response = {};

        if (!orders.length) {
            return res.status(400).json({ error: 'NO_ORDERS' });
        }

        response = app.services.order.handleOrder(orders);

        app.services.pdf.render(app, response);

        res.json(response);
    }
};
