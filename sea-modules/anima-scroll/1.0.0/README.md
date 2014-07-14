# scroll

---

一个精简并重构过的模拟滚动组件

---

## Usage

````html
<div class="outer">
    <div class="am-viewport">
        <div class="active">
        	<section class="am-scroll">
				//content
        	</section>
        </div>
    </div>
</div>
````

```javascript
seajs.use('scroll', function(Scroll) {
	var scroll = new Scroll(el, options).init();
});
```

## 配置说明

### options参数释义

#### canMove `boolean`

* 是否允许页面(document)的touchmove事件

#### paddingTop `string`

* 上边缘空白

#### paddingBottom `string`

* 下边缘空白

#### isBounce `是否启用空白回弹效果`


## 方法

### scroll.enable()

启用滚动（Y轴）。

### scroll.disable()

停用滚动（Y轴）。

### scroll.getScrollHeight()

* @return {number} height

获取HTML元素区域的滚动高度。

### scroll.getScrollTop()

* @return {number} top

获取滚动位置。

### scroll.refresh()

刷新区域。

### scroll.offset(childEl)

* @param {HTMLElement} childEl 滚动区域内的元素
* @return {object} a rectangle object

返回区域内某元素的矩阵数据，包括`top/bottom/width/height/left/right`。

### scroll.scrollTo(y, isSmooth)

* @param {Number} y 滚动到的位置
* @param {Boolean} isSmooth 是否平滑滚动

滚动到区域中的某位置。

### scroll.scrollToElement(childEl, isSmooth)

* @param {HTMLElement} childEl 滚动到的元素
* @param {Boolean} isSmooth 是否平滑滚动

滚动到区域中的某元素。

### scroll.getViewHeight()

* @return {Number} height

获得区域的可见高度。

### 事件

在滚动的元素上，可以监听如下这些事件：

- scrollstart - 滚动开始
- scrollend - 滚动结束
- pulldown - 下拉
- pulldownend - 下拉结束
- pullup -上拉
- pullupend - 上拉结束
