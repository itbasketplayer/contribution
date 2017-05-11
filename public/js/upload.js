

function upload(prefix,requestPath,uploadForm,callback) {
	$(function(){
		$("body").on("click",function(){
			$(".mask"). hide();
			$(".loadingwrap").remove();
		})
	});
	this.prefix = prefix;
	this.callback = callback;
	this.requestPath = requestPath;
	this.uploadForm = uploadForm; 
}
function uploadShowTips(contTxt){
	var tips = $('<div class="czx_shanchuqueren"><div class="czx_zhifuheader"><a class="closeBtn" href="###"></a><span>提示</span></div><div class="czx_zhifuCont"><div class="contTxt">'+contTxt+'</div></div><div class="czx_zhifufooter"><a id="confirm" class="confirm" href="javascript:;" style="margin: 10px 0 0 120px;">确定</a></div></div>');
	
	$("#showTip").append(tips);
	$("#showTip").show();
	$(".czx_shanchuqueren").show();
	$(".mask").show();
	hideTip(".closeBtn",".czx_shanchuqueren");
	hideTip(".confirm",".czx_shanchuqueren");
}
upload.prototype.render = function() {
	
	this.buildUploadForm(this.uploadForm)
	this.click();
	this.change();
	
}

upload.prototype.click = function() {
	var self = this;
	$("#"+self.prefix+"Btn").click(function(){
		$("#"+self.prefix+"File").click();
	});
	
}
upload.prototype.change = function() {
	
	var self = this;
	$("#"+self.prefix+"File").change(function() {
	
		if(this.value == null || this.value == ''){
			return false;
		}
		var filename = this.value.substring(this.value.lastIndexOf("\\")+1,this.value.length);
		var fileType = /^(.*)+[.]+((gif)|(jpeg)|(png)|(jpg)|(JPG)|(JPEG)|(PNG)|(GIF))$/;
		if(fileType.test(filename) == false && filename!=''){
			uploadShowTips("您上传的格式不支持");	
			return false;
		}
		
		
		$("#"+self.prefix+"FileName").attr("value" , filename);
		$("body").append("<div class='loadingwrap'><span class='loading'>&nbsp;</span><div id='runBack'>点击后台上传</div></div><div class='mask' style='display:block'></div>");
				//alert("succ");.
		$("#"+self.prefix+"Form").ajaxSubmit({
			 url : ctx.fileUploadUrl+"/image/upload",
			 type : "POST",
			 dataType : "text",
			 success : function(data) {
				
				//取消loading
		    	var array =  $.parseJSON(data);
	    		
		    	if(array.status == 'fail'){
		    		
		    		uploadShowTips("上传图片不超过2m");
		    		return false;
		    	} 
		    	
				$(".mask").hide();
				$(".loadingwrap").remove();
				if (typeof(data) != 'undefined') {
					self.callback(self.prefix, array.imagePath );
				}
		    }
		 });
	});
	
}

upload.prototype.buildUploadForm = function(uploadForm) {
	var tmpForm = $("<form id='"+this.prefix+"Form'  method='post' enctype='multipart/form-data'></form>");
	tmpForm.append("<input style='position:absolute; filter:alpha(opacity=1); opacity:.01; width:88px; height:24px;' type='file' id='"+this.prefix+"File' name='"+this.requestPath+"' class='edui-image-file' hidefocus='' accept='image/gif,image/jpeg,image/png,image/jpg,image/bmp' />");
	tmpForm.append("<input type='hidden' name='requestPath' value='"+this.requestPath+"'/>");
	tmpForm.append("<input type='hidden' name='fileName' id='"+this.prefix+"FileName'/>");
	$("#" + uploadForm).append(tmpForm);
	
}