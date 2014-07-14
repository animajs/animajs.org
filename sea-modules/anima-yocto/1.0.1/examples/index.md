# Demo

---

## Normal usage

解决点透问题

````css

.container{position:relative;}
.tap{width:100px;height:100px;position:absolute;left:1;top:1;}
.click{width:300px;height:200px;text-align:right;}
.red{background:red;}
.blue{background:blue;}

````

````html

<div class="container">
	<div class="tap red" id="Tap">tap red</div>
	<div class="click blue">click blue</div>
</div>

<div id="JS_Newtap" class="newtap" style="margin-top:20px;">new tap</div>

<a href="">刷新</a>

````



````javascript
seajs.use('index', function($) {
console.log($.Event)
console.log($.ajax)

    $('.tap').tap(function(e){
    	alert('111');
    })
    $('.click').click(function(e){
    	alert('点透了');
    })
    
/*    
document.querySelectorAll('.tap')[0].addEventListener('touchstart', function(){
    	//alert(1);
    	document.querySelectorAll('.tap')[0].style.display = 'none';
    });
*/
    document.getElementById('JS_Newtap').addEventListener('touchstart', function(){
    	//alert(1);
    	document.querySelectorAll('.newtap')[0].style.display = 'none';
    });
    

    
});

````
