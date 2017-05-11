var submit = {};

$(function () {

    submit.isMobile = /^0?(13[0-9]|15[012356789]|18[0123456789]|14[57]|17[0123456789])[0-9]{8}$/;
    submit.InterValObj;
    submit.count = ctx.interval_second; //间隔函数，1秒执行
    submit.curCount;
    submit.mobileCodeSended = false;
    submit.mobileCodeCorrect = false;

    $('#phoneNo').blur(function () {
        checkMobile(getMobile());
    });

    $('#mobileCodeBtn').click(function () {
        submit.curCount = submit.count;
        if (!checkMobile(getMobile())) {
            return false;
        }
        sendMobileCode(getMobile());
    });
    //此处执行
    stepOption();

});

function getTitle(){
    return $("#title").val();
}

function getContent(){
    return $("#content").val();
}

function getUserName(){
    return $("#userName").val();
}

function getMobile() {
    return $("#phoneNo").val();
}

function getMobileCode() {
    return $("#mobileCodeInput").val();
}

function checkMobile(mobile) {

    if (mobile == '') {
        $("#phoneNo").next("em").find(".errorInfo").addClass("fontRed").html("请输入手机号码！");
        return false;
    } else if (!submit.isMobile.test(mobile)) {
        $("#phoneNo").next("em").find(".errorInfo").addClass("fontRed").html("您输入的手机号码有误！");
        return false;
    } else {
        $("#phoneNo").next("em").find(".errorInfo").addClass("fontRed").html("");
        return true;
    }

}

function checkMobileCodeInput(mobileCode) {
    if (mobileCode == '') {
        $("#mobileCodeBtn").next("em").find(".errorInfo").addClass("fontRed").html("请输入手机验证码！");
        return false;
    }else if (mobileCode.length < 6 && submit.mobileCodeSended) {
        $("#mobileCodeBtn").next("em").find(".errorInfo").addClass("fontRed").html("手机验证码为6位！");
        return false;
    } else {
        $("#mobileCodeBtn").next("em").find(".errorInfo").addClass("fontRed").html("");
        return true;
    }
}

function sendMobileCode(mobile) {
    //发送验证码手机
    $.ajax({
        url: ctx.web_domain + "/pc/sendMobileCode?mobile=" + mobile,
        type: "get",
        dataType: "json",
        async: false,
        error: function (XMLHttpRequest, textStatus, errorThrown) {
        },
        success: function (result) {
            if (result) {
                //设置button效果，开始计时
                $('#mobileCodeBtn').attr("disabled", true);
                $("this").val(submit.curCount + "秒内输入");
                submit.InterValObj = window.setInterval(SetDivRemainTime, 1000); //启动计时器，1秒执行一次
                submit.mobileCodeSended = true;
            } else {
                $("#mobileCodeBtn").next("em").find(".errorInfo").addClass("fontRed").html("手机验证码发送失败！");
            }
        }
    })
}

function checkDivMobileCodeIsCorr(mobile, mobileCode) {

    $.ajax({
        url: ctx.web_domain + "/pc/checkMobileCode?mobileCode="
        + mobileCode + "&mobile="
        + mobile,
        type: "get",
        dataType: "json",
        async: false,
        error: function (XMLHttpRequest,
                         textStatus, errorThrown) {
        },
        success: function (result) {
            submit.mobileCodeCorrect = result;
        }
    });
    if (!submit.mobileCodeCorrect) {
        $("#mobileCodeBtn").next("em").find(".errorInfo").addClass("fontRed").html("手机验证码错误！");
    }

    return submit.mobileCodeCorrect;

}

//timer处理函数
function SetDivRemainTime() {
    if (submit.curCount == 0) {
        window.clearInterval(submit.InterValObj);//停止计时器
        $("#mobileCodeBtn").removeAttr("disabled");//启用按钮
        $("#mobileCodeBtn").val("重新发送验证码");
    }
    else {
        submit.curCount--;
        $("#mobileCodeBtn").val(submit.curCount + "秒内输入");
    }
}

function fillSubmitConfirmInfo() {
    $("#title_c").html(getTitle);
    $("#content_c").html(getContent());
    $("#userName_c").html(getUserName());
    $("#avatarImg_c").attr("src", $("#imgId_avatar_upload").attr("src"));
    $("#phoneNo_c").html(getMobile());
}

function stepOption() {
    $(".valueLimit").keyup(function () {
        var val = $(this).val();
        var valNumber = val.length;
        $(this).next("em").find(".errorInfo").removeClass("fontRed").html("您还可以输入" + (20 - valNumber) + "个字！");
    });
    $(".textareaLimit").keyup(function () {
        var val = $(this).val();
        var valNumber = val.length;
        $(this).next("em").find(".errorInfo").removeClass("fontRed").html("您还可以输入" + (500 - valNumber) + "个字！");
    });
    //提交作品
    $("#uploadZuoPin").click(function () {
        var canNext = true;
        var title = getTitle();
        var content = getContent();
        if (title == '') {
            $("#title").next("em").find(".errorInfo").addClass("fontRed").html("标题不能为空！");
            canNext = false;
        }
        if (content == '') {
            $("#content").next("em").find(".errorInfo").addClass("fontRed").html("内容不能为空！");
            canNext = false;
        }
        if (canNext) {
            $(this).parents(".stepOption").hide().next().show();
        }
    });
    //填写个人信息
    $("#userInfo").click(function () {
        var canNext = true;
        if (getUserName() == '') {
            $("#userName").next("em").find(".errorInfo").addClass("fontRed").html("姓名不能为空！");
            canNext = false;
        }else{
            $("#userName").next("em").find(".errorInfo").addClass("fontRed").html("");
        }
        //检查手机号
        if(!checkMobile(getMobile())){
            canNext = false;
        }else{
            $("#phoneNo").next("em").find(".errorInfo").addClass("fontRed").html("");
        }
        //检查手机验证码
        if(!checkMobileCodeInput(getMobileCode())){
            canNext = false;
        }else{
            $("#mobileCodeBtn").next("em").find(".errorInfo").addClass("fontRed").html("");
        }

        //提前判断，不请求后端
        //与后端手机验证码比较
        if(canNext){
            canNext = checkDivMobileCodeIsCorr(getMobile(), getMobileCode());
        }

        if (canNext) {
            $(this).parents(".stepOption").hide().next().show();
            //填充确认页面信息
            fillSubmitConfirmInfo();
        }
    });
    //确认提交
    $("#submitInfo").click(function () {
        var submit_data = {};
        submit_data.title = getTitle();
        submit_data.content = getContent();
        submit_data.userName = getUserName();
        submit_data.avatar = $("#avatar_upload").val();
        submit_data.phoneNo = getMobile();
        submit_data.activityId = $("#activityId").val();
        $.ajax({
            url: ctx.web_domain + "/pc/submit",
            type: "post",
            dataType: "json",
            data:submit_data,
            async: false,
            error: function (XMLHttpRequest,
                             textStatus, errorThrown) {
            },
            success: function (result) {
                if(result){
                    $("#submitInfo").parents(".stepOption").hide().next().show();
                }else{
                    alert("失败");
                }
            }
        });

    });

    $(".stepPrev").click(function () {
        $(this).parents(".stepOption").hide().prev().show();
    });

    $(".infoTable table td:even").css({borderLeft: 'none'});
    $(".infoTable table td").last().css({borderBottom: 'none'});
    $(".infoTable table td").eq(-2).css({borderBottom: 'none'});
}
