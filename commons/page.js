var _ = require('underscore') // 使用underscore库
module.exports = {
    pageGap: 7
    , pageSize: 10
    , start: 0
    , total: 0
    , pageNo: 0
    , allPages: 0
    , results: undefined
    , init: function () {
        if (this.pageNo == undefined) this.pageNo = 1;
        this.pageNo = parseInt(this.pageNo);
        if (this.pageNo <= 1) this.pageNo = 1;
        this.start = (this.pageNo - 1) * this.pageSize;
    }
    , end: function (total) {
        this.total = total;
        if (this.total == 0) {
            this.allPages = 0;
        } else {
            this.allPages = Math.ceil(this.total / this.pageSize);
        }
        return this;
    }
    , getBeginPageNo: function () {
        if (this.allPages <= this.pageGap) {
            return 1;
        }

        var begin = this.pageGap % 2 == 0 ? (this.pageNo - Math.floor(this.pageGap / 2)) + 1 : this.pageNo - Math.floor(this.pageGap / 2);
        if (begin <= 0) {
            return 1;
        }
        if (begin > (this.allPages - (this.pageGap - 1))) {
            return this.allPages - (this.pageGap - 1);
        }
        return begin;
    }
    , getEndPageNo: function () {
        if (this.allPages <= this.pageGap) {
            return this.allPages;
        }

        var end = this.pageNo + Math.floor(this.pageGap / 2);
        if (end >= this.allPages) {
            return this.allPages;
        }

        if (end < this.pageGap) {
            return this.pageGap;
        }
        return end;
    }
};