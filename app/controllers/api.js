const
    Redis = require('ioredis'),
    util = require('util');

module.exports = {
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

    orders: (app, req, res) => {
        const redis = new Redis(app.config.redis);

        redis.smembers('orders')
            .then((response) => {
                try {
                    const orders = response.map((order) => {
                        return JSON.parse(order);
                    });

                    res.render('orders', { orders: orders }, (error, html) => {
                        if (error) {
                            console.log(error);

                            return res.send(error);
                        }

                        res.send(html);
                    });

                } catch (error) {
                    console.log(error);

                    res.send('JSON_PARSE_ERROR');
                }
            }).catch(res.send);
    }
};
