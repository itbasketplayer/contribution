var _ = require('underscore');
var logger = require('../../commons/logging').getLogger(module);
var async = require('async');
var mysqldb = require('../../repositorys/mysqldb');

var controller = {

    get: function (req, res) {
        var id = req.param("id");
        res.render("pc/publish-award",{id:id});
    }
};

module.exports = controller;