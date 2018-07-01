module.exports = (() => {
    const config = {
        port: 3000,
        redis: {
            port: 6379,
            host: 'localhost',
            password: '',
            db: 1
        }
    };

    return config;
})();
