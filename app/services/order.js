const
    _ = require('lodash'),
    options = {
        priceLimit: 400,
        lightFactor: 10,
        heavyFactor:  5,
        heavyExtraFactor: 2000,
        maxTruckLoad: 1000,
        maxPackageWeight: 500
    };

function calculatePrice(orders) {
    let ordersPrice = 0;

    orders.forEach((order) => {
        if (order.weight <= options.priceLimit) {
            ordersPrice = ordersPrice + options.lightFactor * order.weight;
        } else {
            ordersPrice = ordersPrice + options.heavyExtraFactor + options.heavyFactor * order.weight;
        }
    });

    return ordersPrice / 1000;
}

function distributeLoads(orders) {
    let sortedOrders = _.sortBy(orders, 'weight'),
        orderChunk = [],
        allChunks = [];

    for (let i = 0; i < sortedOrders.length; i++ ) {
        const shouldPop = checkSum(orderChunk, sortedOrders[i]);

        if (!shouldPop) {
            orderChunk.push(sortedOrders[i]);
        } else {
            allChunks.push(orderChunk);
            orderChunk = [];

            orderChunk.push(sortedOrders[i]);
        }
    }

    if (orderChunk.length) {
        allChunks.push(orderChunk);
    }

    return allChunks;
}

function checkSum(collection, nextItem) {
    let currnetSum = collection.length !== 0 ? _.sumBy(collection, 'weight') : 0;

    return (currnetSum + nextItem.weight) > options.maxTruckLoad;
}

module.exports = {
    handleOrder: (orders) => {
        const
            price = calculatePrice(orders),
            loads = distributeLoads(orders);

        return {
            price: price,
            trucks: loads.map((load) => {
                return {
                    truckID: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
                    load: load
                }
            })
        }
    }
};
