const
    _ = require('lodash'),
    cuid = require('cuid'),
    options = {
        priceLimit: 400,
        lightFactor: 10,
        heavyFactor:  5,
        heavyExtraFactor: 2000,
        maxTruckLoad: 1000,
        maxPackageWeight: 500
    };

/**
 * Oblicza cenę zamówienia
 * @param  {object} orders
 * @return {integer}  cena zamówienia
 */
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

/**
 * Dzieli zamówienie na ładunki
 * @param  {object} orders
 * @return {object} zamówienia rozdystrybuowane na ładunki
 */
function distributeLoads(orders) {
    let sortedOrders = _.sortBy(orders, 'weight'),
        orderChunk = [],
        allChunks = [];

    for (let i = 0; i < sortedOrders.length; i++ ) {
        const shouldPop = isOverload(orderChunk, sortedOrders[i]);

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

/**
 * Sprawdza czy ładunek osiągnął maksymalną ładowność ciężarówki
 * @param  {object}  collection ładunki do transportu
 * @param  {object}  nextItem   następny ładunek do sprawdzenia
 * @return {Boolean}
 */
function isOverload(collection, nextItem) {
    const currnetSum = _.sumBy(collection, 'weight') || 0;

    return (currnetSum + nextItem.weight) > options.maxTruckLoad;
}

module.exports = {
    /**
     * Buduje ustrukturyzowany obiekt zamówienia
     * @param  {object} orders obiekt zamówienia
     * @return {object}        ustrukturyzowany obiekt zamówienia z podziałem na transporty
     */
    handleOrder: (orders) => {
        const
            price = calculatePrice(orders),
            loads = distributeLoads(orders);

        return {
            price: price,
            trucks: loads.map((load) => {
                return {
                    truckID: cuid(),
                    load: load
                }
            })
        }
    }
};
