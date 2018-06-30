module.exports = {
    order: (app, req, res) => {
        const orders = req.body;

        if (!orders.length) {
            return res.status(500).json({ error: 'NO_ORDERS' });
        }

        res.json({ proccessing: true });
    }
};
