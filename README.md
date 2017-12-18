# tdrDropdown
ajax加载的模糊查询动态生成列表的select

## demo 地址

[demo](https://xianhuiwangs.github.io/tdrDropdown/index.html)

### 如何使用

* 引入脚本和样式

```html
  <link rel="stylesheet" type="text/css" href="https://cdn.bootcss.com/bootstrap/3.3.7/css/bootstrap.min.css">
  <script src="https://code.jquery.com/jquery-1.7.2.min.js" type="text/javascript"></script>
  <link rel="stylesheet" type="text/css" href="ajaxselect/tdrDropDown.css">
  <script src="ajaxselect/tdrDropDown.js"></script>
```

* 标签定义

```html
	<!--单选模式-->
  <form action="">
    <div class="row">
		 <div class="col-sm-4">
    	 <div class="text-info">单选模式，Option渲染</div><br>
	     <div class="dropdown-sin-1 dropdown-single">
	          <select placeholder="请选择：测试placeholder"></select>		        
	        </div>
	      </div>
    </div>
  </form>
  
 <!--多选-->
 <select placeholder="请选择：测试placeholder" multiple></select>	
```
* 插件使用

```javascript
 	$(function(){
	 	$(".dropdown-sin-1").dropdown({
	  			 selectTitle: '请选择品牌',
	  			 input: '<input type="text" maxLength="20" placeholder="请输入品牌">' ,
	  			 searchNoData: '<li style="color:#ddd">查无数据</li>',
	  			 keyword:  $('.dropdown-sin-1 select').text(), //现有的select值
	  			 valueName: "BrandId", //select中OPTION的值
	  			 nameName: "BrandName", //select中option的显示
	  			 searchable: true, //查询功能 ,默认为true
	  			 ajax:{
				 	  	url:'http://10.130.0.205:8292/vehiclebrand/getpagedlist', //因ie8跨域问题,接口后台自己加 //输入搜索时候的ajax,初始化时候用原来的value获取当前name显示
	        		type:"get",  
	    		 		dataType:"json", 
	        		data:{
	        			brandname:'keyword',  
	        			pageindex: 'pageIndex',
	        			pagesize:10
	        		},
	        		success:function(data){
	        			_tdrAjaxdata = data; //将ajax数据存储到当前的dom
	        		}, 
						  error:function(){ 
						    console.log("error") 
						  } 
	        	}
	  		})
  		})
  	});
```

