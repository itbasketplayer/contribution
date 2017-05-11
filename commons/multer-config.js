var multer  = require('multer');

var ueditor =  multer({
    dest:'public/uploads/ueditor',
    rename: function(fieldname,filename){
        return Date.now();
    }});

var header = multer({
    dest:'public/uploads/header',
    rename: function(fieldname,filename){
        return Date.now();
    }});

var config = {
    ueditor: ueditor,
    header:header
};

module.exports = config;