  var _tdrAjaxdata = {};
 ;
 (function ($) {
  'use strict'; 
   var settings = { //设置的初始值
    selectTitle: '请选择',
    input: '<input type="text" maxLength="20" placeholder="搜索关键词或ID">',
    valueName: "value", //select中OPTION的值
  	nameName: "name", //select中option的显示
    searchNoData: '<li style="color:#ddd">查无数据，换个词儿试试 /(ㄒoㄒ)/~~</li>',
    ajax:{},
    keyword: "", //当前select的value值
    ajaxTextInit:{}, //ajax的输入值保存
    pageIndex:1
  };
  
 function Dropdown(options, el) {
    this.$el = $(el);
    this.config = options;
    this.init(); 
    this.isInitSelect= true;
  }
 
  Dropdown.prototype = {
  	init:function(){
  		this.$el.append(this.templateOption());  			
  		this.bindEvent();  	
  		this.ajaxInit(true); 	  		
  	},
  	templateOption: function(){
  		var templateSearch = '<span class="dropdown-search">' + this.config.input + '</span>';
    	return '<a href="javascript:;" class="dropdown-display"><span class="dropdown-chose-list">'
    	+'<span class="placeholder">'+ this.config.selectTitle +'</span></span></a><div class="dropdown-main">'
    	+templateSearch+'<ul></ul>'
    	+'<div class="pagebottom">共<span class="pageCount"></span>页<span class="dropdown-pagepre"></span><span class="pageIndex">1</span><span class="dropdown-pagenext"></span></div></div>';
  	},
  	liCliFc: function(){
  		var $el = this.$el;
	 	 	$el.find("li.dropdown-option").each(function(){
 	 		$(this).on('click',function(){
 	 				$el.find("option").removeAttr('selected'); //清空原来选中
 					var text = $(this).text(),value = $(this).attr("data-value");
 					$el.find('span.placeholder').text(text);
 					$el.find("input").val(text);  					
 					$el.find("select").find("option[value='"+value+"']").attr("selected",true);//获取选中的value给select做选中
 					$el.removeClass('active');
 					return false;
 	 		});
 	 	});
  	},
  	bindEvent: function(){	//绑定事件
  		var $el = this.$el;   		  		
	    $(document).click(function(){ //点击其他部位隐藏下拉列表
		    $el.removeClass('active');	
     	});   	     
	  	$el.on('click',function(e){
	  		e.stopPropagation(); //阻止冒泡
  		 	$el.find('input').focus();
		 	$el.addClass('active');	//显示下拉列表		    	
	    }).on('keyup click', '.dropdown-search input',this.Bind(function (event) { //输入数据后操作	
	  		this.config.pageIndex = 1;
	  		this.config.keyword = $el.find('input').val();   
	  		this.ajaxInit();
	  	})).on('click','.dropdown-pagenext',this.Bind(function (event) { //输入数据后操作
	  		if(_tdrAjaxdata.TotalPage>this.config.pageIndex){
	  			this.config.pageIndex++;
	  			this.ajaxInit();
	  		}	 						
	  	})).on('click','.dropdown-pagepre',this.Bind(function (event) { //输入数据后操作
	 			if(this.config.pageIndex>1){
	 				this.config.pageIndex--;
					this.ajaxInit();
	 			}	 			
	  	}));	  	
  	},
  	ajaxInit:function(init){ //init为是否是select数据初始化  
  		var thisDrop = this; 		  		
		/*ajax参数配置*/
      	var self = thisDrop.config, obj = self.ajax["data"] ? self.ajax["data"] : {};
      	for(var item in obj){
      		 if (self[obj[item]]||self[obj[item]]==="") { //如果data中的key的值在pagelist里面有对应的值
                self['ajaxTextInit'][item] = obj[item];  //把对应的page:_current等存在  self['_pageInit']		         
            }
            if (self['ajaxTextInit'][item]) {
                obj[item] = self[self['ajaxTextInit'][item]]; //获取pageInit中item对应的值 
            }
      	}  
      	thisDrop.isInitSelect = init==true?true:false; //是否用select的值初始化
    
  		if (self.ajax["complete"]&&thisDrop.isInitSelect) {
            var a = self.ajax["complete"];
            var b = thisDrop.Bind(thisDrop.ajaxReturnUse);
            self.ajax["complete"] = function () {
                a();
                b();
            }
        } else {
            self.ajax["complete"] = thisDrop.Bind(thisDrop.ajaxReturnUse);
    	}
     
  	 	
    	/*ajax参数配置 end*/
    	$.ajax(thisDrop.config.ajax);        	   	    	  	   
    	    	
  	}, 
  	ajaxReturnUse:function(){
  		var thisDrop = this;
  		/*ajax返回参数配置*/  
	  	var dataArray = _tdrAjaxdata.Data?_tdrAjaxdata.Data:[];	 
		for(var i=0; i<dataArray.length;i++){//把原来数组中数据处key替换成固定的value,name   dataArray = [{value:2,name:"艾玛"}];
			dataArray[i].value = dataArray[i][thisDrop.config.valueName];
			dataArray[i].name = dataArray[i][thisDrop.config.nameName];
		}   
		/*ajax返回参数配置 end*/ 
		
    	/*获取返回数据后,对界面html配置*/  
		thisDrop.isInitSelect&&thisDrop.initSelect(dataArray);// select有value的时候的初始化		
			
    	thisDrop.dataProcessing(dataArray); //插入html
		/*获取返回数据后,对界面html配置 end*/
			
	  	thisDrop.pageConfig(); //分页配置
					
  	},
  	pageConfig:function(){//分页部分控制
	    var TotalPage = _tdrAjaxdata.TotalPage = Math.ceil(_tdrAjaxdata.TotalItem/_tdrAjaxdata.PageSize); //共有多少页,计算并保存	    
	    if(_tdrAjaxdata.TotalItem>_tdrAjaxdata.PageSize){
	    	this.$el.find(".pagebottom").show();
	    }else{
	    	this.$el.find(".pagebottom").hide();
	    }
	    this.$el.find("span.pageIndex").text(this.config.pageIndex);
	    this.$el.find("span.pageCount").text(_tdrAjaxdata.TotalPage)
  	},
  	addSelectHtml:function(obj){ //给select添加option
		this.$el.find("select").append('<option value="'+obj.value+'">'+obj.name+'</option>');
  	},
	dataProcessing:function(data){//获取到ajax数据以后 ,將数据拼接到html
		var $el = this.$el;	
		var self = this;
		//清空div	
		$el.find("select").empty();
		$el.find(".dropdown-main ul").empty();
		data = data?data:{};
		if(!data || JSON.stringify(data) == "{}" ){ //没有数据的时候提示
			$el.find(".dropdown-main ul").append(this.config.searchNoData);
		}else{	
			for(var i=0;i<data.length;i++){
				self.addSelectHtml(data[i]);
				$el.find(".dropdown-main ul").append('<li data-value="'+data[i].value+'" class="dropdown-option ">'+data[i].name+'</li>');
			}
			this.liCliFc();
		}	    	 
	},
	initSelect:function(data){ //获取到对应数据后 重置,可视select部分的数据
		var $el = this.$el;		
		if(!data || JSON.stringify(data) == "[]" || !this.config.keyword){ //获取到数据不存在的时候
			$el.find('span.placeholder').text('请选择品牌');			
		}else{
			var obj = data[0];
			//整理隐藏的select里的option
			this.addSelectHtml(obj);  	
		   	$el.find("select").find("option[value="+obj.value+"]").attr("selected",true);		   	
			$el.find('span.placeholder').text(obj.name);
		}		
	},
    Bind: function (handler, obj) {//通过bind改变对象的上下文结构
        if (obj == undefined) obj = this;
        if (handler.bind) {
            return handler.bind(obj);
        } else {
            var self = this, boundArgs = arguments;
            return function () {
                var args = [], i;
                for (i = 2; i < boundArgs.length; i++) { args.push(boundArgsp[i]); }
                for (i = 0; i < arguments.length; i++) { args.push(arguments[i]); }
                return handler.apply(obj, args);
            }
        }
    }
  };     
  
  $.fn.dropdown = function (options) {
    this.each(function (index, el) {
      $(el).data('dropdown', new Dropdown($.extend(true, {}, settings, options), el)); //给当前dom添加drapdown参数,new Dropdown方法,用options对setting进行深层替换
    });
    return this;
  }
})(jQuery);