const
    Redis = require('ioredis'),
    util = require('util');

module.exports = {
    /**
     * Zapisuje zamówienie
     * @param  {object} app instancja Express'a
     * @param  {object} req obiekt request'u
     * @param  {object} res obiekt response'a
     * @return {object} json z zamówieniem
     */
    order: (app, req, res) => {
        const
            redis = new Redis(app.config.redis),
            orders = req.body;

        let response = {};

        if (!orders.length) {
            return res.status(400).json({ error: 'NO_ORDERS' });
        }

        response = app.services.order.handleOrder(orders);

        app.services.pdf.render(app, response);

        redis.sadd('orders', JSON.stringify(response))
            .then(() => {
                res.json(response);
            }).catch(res.json);
    },

    /**
     * Zwraca wszystkie zamówienia
     * @param  {object} app instancja Express'a
     * @param  {object} req obiekt request'u
     * @param  {object} res obiekt response'a
     * @return {object} json z zamówieniem
     */
    orders: (app, req, res) => {
        const redis = new Redis(app.config.redis);

        redis.smembers('orders')
            .then((docs) => {
                if (!docs.length) {
                    return res.json({
                        orders_count: 0,
                        text: 'No orders'
                    });
                }

                try {
                    const orders = docs.map((order) => {
                        return JSON.parse(order);
                    });

                    res.json(orders);
                } catch (error) {
                    console.log(error);

                    res.status(500).json({ error: 'JSON_PARSE_ERROR' });
                }
            }).catch(res.send);
    }
};
