# template

---

移动端模板引擎

---

### 使用

````js
seajs.use('template', function(aTpl){

	aTpl(str, data);
	
	aTpl.compile(str).render(data);
	
	//aTpl(str)等同于aTpl.compile(str)
	//aTpl(str, data) 等同于 aTpl.compile(str).render(data)
	
})
````

### str `string`

模板id或原始模板字符串

````js

//左分割符为<%， 右分隔符为%>，暂不支持自定义
var str = 'I am <%=name%>';

//模板内支持JS逻辑,不要在逻辑中声明out变量，内部使用
var tpl = 
		'<% if(name){ %>'+
			'I am <%=name%>' +
		'<% }else{ %>'+
			'Hello world !'+
		'<% } %>';
		
````

### data `object`

数据源，尽量不要有太多冗余的数据

> 内部使用缓存机制增强模板解析性能，暂不支持命名空间等高级功能。