var interface = {};
interface.hoverFunc = function(){
    $(".searchItem").hover(function(){
        $(this).addClass("cur");
    },function(){
        $(this).removeClass("cur")
    });
};
interface.voteClick = function(){
    $(".voteButton").hover(function(){
        if(!$(this).hasClass("hadVote")){
            $(this).css({opacity:0.6});
        };
    },function(){
        if(!$(this).hasClass("hadVote")){
            $(this).css({opacity:1});
        };
    }).click(function(){
        if(!$(this).hasClass("hadVote")){
            $(this).addClass("hadVote");
            $(this).next().animate({
                opacity:1
            },2000).animate({
                opacity:0
            },1000);
        }
    })
};
interface.showMore = function(){
    $(".checkAll").click(function(){
        var textInfo = $(this).prev(".textInfo");
        if(textInfo.height() <= 78){
            $(this).html("收起&nbsp;&gt;&gt;")
            textInfo.css({height:"auto"});
            var allHeight=$(this).parents(".searchItemCon").height();
            $(this).parents(".searchItemTop").css({height:allHeight+20});
        }else{
            $(this).html("查看全部&gt;&gt;");
            textInfo.css({height:""});
            $(this).parents(".searchItemTop").css({height:""});
        }
    })
};
