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
  <form action="">
    <div class="row">
		 <div class="col-sm-4">
    	 <div class="text-info">单选模式，Option渲染</div><br>
	     <div class="dropdown-sin-1 dropdown-single"></div> 
  	 </div>  	
    </div>
  </form>
  	
```
* 插件使用

```javascript
 	$(".dropdown-sin-1").dropdown({
		 selectTitle: '品牌', //'请选择'+品牌
		 regReplace: {"value":"BrandId","name":"BrandName"}, //给select赋值时候对应的字段
		 submitValue: "BrandId" ,//提交时候input的name值
			 selectInfo: { //初始select值
	  			value: ["84"],
			 		text: ["新霸电动车"]
			 },
		 searchable: true, //查询功能 ,默认为true
		 ismultiterm: true ,// 是否多选,默认为true
		 ajax:{
		 	  url:'http://10.130.0.205:8292/vehiclebrand/getpagedlist', //因ie8跨域问题,接口后台自己加 //输入搜索时候的ajax,初始化时候用原来的value获取当前name显示
    		type:"get"  ,
		 		dataType:"json" ,
    		data:{
    			brandname:'keyword',
    			pageindex: 'pageIndex',
    			pagesize:10 // 当前每页显示多少条
    		},
    		success:function(data){           			
    			$(".dropdown-sin-1").data("dropdown")._tdrAjaxdata = {
    				PageIndex: data.PageIndex, //当前页码
						TotalItem: data.TotalItem, //共有多少条数据
						Data: data.Data //获取到拿来操作的数组列表
    			}
    		},        		
			  error:function(){ 
			    console.log("error") 
			  } 
			}
	});	
```

