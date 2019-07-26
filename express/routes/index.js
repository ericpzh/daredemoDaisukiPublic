module.exports = function (app, router) {
    app.use('/api', require('./home.js')(router));
    app.use('/api/users', require('./users.js'));
    app.use('/api/admins', require('./admins.js'));
    app.use('/api/vtubers', require('./vtubers.js'));
    app.use('/api/suggestions',require('./suggestions.js'));
};
