var fs = require('fs');

exports.imgManager = function(req, res) {
    var str = '';
    var i = 0;
    fs.readdir(__dirname + '/uploads/ueditor/', function(err, files) {
        if (err) throw err;

        var total = files.length;

        files.forEach(function(file) {
            str += file + 'ue_separate_ue';
            i++;

            // send file name string when all files was processed
            if(i === total) {
                res.end(str);
            }
        });
    });

};

exports.imgUp = function(req, res) {
    for (var i in req.files) {
        var title = req.body['pictitle'];
        var img = req.files[i];
        var pubPath = 'uploads/ueditor/' + img.name;
        res.json({
            'url': pubPath,
            'title': title,
            'original': img.name,
            'state': 'SUCCESS'
        });
    }
}