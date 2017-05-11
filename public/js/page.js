jr = {};

jr.select = function () {

    var selectItems = [];

    $("input[name='items']:checked").each(function () {
        selectItems.push($(this).val());
    });

    return selectItems;
};

jr.search = function () {
    $("#pageNo").val("1");
    $('#totalForm').attr("method", "get").submit();
};

jr.jumpPage = function (pageNo) {
    if ($("#totalForm").html()) {
        $("#totalForm").append("<input type='hidden' name='pageNo' value='" + pageNo + "' />").submit();
    }
};