# Demo

---

## Normal usage

###CSS

````css
.outer {
    height:300px;
}
.am-viewport{
    background-color:#000; width:100%; height:100%; overflow:hidden;
    }
.am-viewport .active{
    color:black; border:1px solid #ccc; box-sizing: border-box; height:100%; overflow:hidden;
}
.am-viewport .active p{
    margin: 0 0 20px;
}
.am-viewport .inactive{
    color:white; border:1px solid #ccc; box-sizing: border-box; height:100%; overflow:hidden;
}
.am-scroll{background:#ccc;}
````
###HTML

````html
<div class="outer">
    <div class="am-viewport">
        <div class="active">
        	<section class="am-scroll">
        		<p>content...</p>
        		<p>content...</p>
        		<p>content...</p>
        		<p>content...</p>
        		<p>content...</p>
        		<p>content...</p>
        		<p>content...</p>
        		<p>content...</p>
        		<p>content...</p>
        		<p>content...</p>
        		<p>content...</p>
        		<p>content...</p>
        		<p>content...</p>
        	</section>
        </div>
    </div>
</div>
````

###JS

````javascript
seajs.use('../index', function(Scroll) {
    var scrollEl = document.querySelector('.am-scroll');
	var scroll = new Scroll(scrollEl).init();
});
````
