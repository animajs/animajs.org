(function(){
	
var tpl = '' +
'## 如何使用Anima开发项目？ —— Anima 5分钟从入门到精通\n' +
'\n' +
'>前言：Anima和Arale的体系是一致化的，因此，如果你曾经[用Arale开发过组件或者项目](http://spmjs.io/documentation/develop-a-package)，那么恭喜你，会很快找到感觉，因为基本上没有太大区别。如果没有开发过也没关系，跟着这篇文章做一遍，你也一样会非常清楚的。\n' +
'\n' +
'>在使用Anima开发之前，我们非常推荐你先浏览一遍我们的[移动开发基础规范指南](http://gitlab.alibaba-inc.com/alipay/anima/issues/127)，可以预先了解在移动开发领域的一些`已知问题`和`最佳实践`推荐。\n' +
'\n' +
'>同时，欢迎加入`Anima金牌客服旺旺群`：253907639，使用过程中有任何问题，随时随地解决，免除后顾之忧。\n' +
'\n' +
'### 一个简单的例子\n' +
'//建设中...\n' +
'\n' +
'### 开发主要流程\n' +
'>用Anima开发一个项目，主流程只需要`5步`。没错，就是下面这5步：\n' +
' 1. [安装环境：node、amb](#1-node-amb)\n' +
' 1. [项目初始化](#2)\n' +
' 1. [安装Anima模块](#3-anima)\n' +
' 1. [开发、调试](#4)\n' +
' 1. [构建、发布](#5)\n' +
'\n' +
'接下来，我们会按照这5步分别进行详细的介绍。只需要花5分钟时间：）\n' +
'\n' +
'#### 1.安装环境：node、amb\n' +
'>注：[amb](https://github.com/animajs/amb)（Anima Mobile Builder）是`Anima配套的项目构建工具`，依赖于[node环境](http://nodejs.org/)和[spm3](https://github.com/spmjs/spm/tree/master)，基于[gulp](http://gulpjs.com/)，集成了项目初始化、安装、打包构建、编译发布等项目常用功能。使用amb可以让你的Anima开发过程愉悦而得心应手、极大地提升开发效率。\n' +
'\n' +
'- 先安装node环境：http://nodejs.org/download/ \n' +
'- 然后安装amb：\n' +
'\n' +
'````\n' +
'    $ npm install amb -g\n' +
'````\n' +
'amb安装完毕后，意味着spm3也已安装到你的系统中。\n' +
'\n' +
'>引申阅读：\n' +
'- [amb安装失败怎么办？](anima-amb-fail)\n' +
'- [关于spm3](http://spmjs.io/documentation)\n' +
'- [关于amb的详细介绍](https://github.com/animajs/amb)\n' +
'\n' +
'#### 2.项目初始化\n' +
'进入到你的workspace中，运行：\n' +
'\n' +
'    $ amb new <项目名>\n' +
'\n' +
'例如：\n' +
'\n' +
'    $ amb new foobar\n' +
'\n' +
'这时，发现已经创建了名叫"foobar"的目录和结构，里面初始化了一点初始信息，如下：\n' +
'\n' +
'    foobar\n' +
'      - src\n' +
'         - html\n' +
'           - index.html\n' +
'         - css\n' +
'           - index.css\n' +
'         - js\n' +
'           - index.js\n' +
'         - img\n' +
'           - anima.png\n' +
'      - package.json\n' +
'\n' +
'觉得这个目录嵌套太多？可以通过`--template simple`参数来指定"simple"清爽模板：\n' +
'\n' +
'    $ amb new foobar --template simple\n' +
'\n' +
'生成的目录如下：\n' +
'\n' +
'    foobar\n' +
'       - index.html\n' +
'       - index.css\n' +
'       - index.js\n' +
'       - img\n' +
'         - anima.png\n' +
'       - package.json\n' +
'\n' +
'清爽很多吧？具体的amb初始化的自定义设置，可以[查看这里](anima-amb)。\n' +
'\n' +
'#### 3.安装Anima模块\n' +
'>我们的foobar项目中需要做一些dom操作。我们首先可能会想到[zepto](http://zeptojs.com)。在这里郑重地向您推荐anima的一个基于zepto的优化分支版本：[anima-yocto](http://spmjs.io/package/anima-yocto)。它完全`基于zepto`，并进行了很多`定制和优化`。关于yocto的更详细信息，可以[点击这里](http://gitlab.alibaba-inc.com/animajs/yocto)详细了解。\n' +
'\n' +
'那么我们首先进入到项目中，运行amb install来安装yocto模块：\n' +
'\n' +
'    $ amb install anima-yocto\n' +
'\n' +
'在安装完毕后，会发现项目目录中多了一个叫`sea-modules`的文件夹。对，这里面就是存放anima-yocto组件代码的模块目录。\n' +
'\n' +
'另外，在package.json中，`dependencies`字段里会自动保存`"anima-yocto": "1.0.1"`这个依赖项。\n' +
'\n' +
'>需要更多的模块？[点击这里](http://spmjs.io/search?q=anima) 或者直接到 http://spmjs.io 搜索关键字"`anima`"查询。所有模块都可以直接用`amb install`的方式安装。截至目前为止，Anima仓库中已经有`30+`个模块了。如果进一步想了解这些模块的源码，可以[访问这里查看](http://gitlab.alibaba-inc.com/groups/animajs)。如有权限问题可直接联系 @完颜 。\n' +
'\n' +
'然后，打开`src/index.html`，挂载`Anima UI`样式（如果需要）：\n' +
'\n' +
'````html\n' +
'<link rel="stylesheet" type="text/css" href="https://a.alipayobjects.com/anima/dpl/1.1.0/amui.css" media="all">\n' +
'````\n' +
'\n' +
'>对于Anima UI库的详细说明，以及最新版本信息，请[点击这里查看](http://aliceui.org/mobile/)。\n' +
'\n' +
'>引申阅读：\n' +
'- [用spm来更精细化地安装、使用AnimaUI](anima-animaui)\n' +
'\n' +
'#### 4.开发、调试\n' +
'在上一步我们安装了anima-yocto模块，那么就需要在项目中去使用这个模块。\n' +
'\n' +
'我们打开`src/index.js`，编辑内容：\n' +
'\n' +
'````javascript\n' +
'    var $ = require(\'anima-yocto\'); //引用anima-yocto模块\n' +
'    $(\'body\').html(\'hello foobar\');\n' +
'````\n' +
'\n' +
'保存后，命令行运行`amb build`命令来进行本地简单构建，同时进行文件实时监听，以用于调试：\n' +
'\n' +
'    $ amb build -w\n' +
'\n' +
'可以发现，本地项目目录中多了一个"dist"目录，现在项目总目录如下：\n' +
'\n' +
'    foobar\n' +
'      - dist\n' +
'         - img\n' +
'           - anima.png\n' +
'         - index.html\n' +
'         - index.css\n' +
'         - index.js\n' +
'      - sea-modules\n' +
'      - src\n' +
'         - html\n' +
'           - index.html\n' +
'         - css\n' +
'           - index.css\n' +
'         - js\n' +
'           - index.js\n' +
'         - img\n' +
'           - anima.png\n' +
'      - package.json\n' +
'\n' +
'我们可以直接运行`dist/index.html`，查看我们的改动是否生效，并可以随时调试src文件并进行实时刷新。\n' +
'\n' +
'>注意：我们打开`dist/index.html`文件，可以发现，js是像这样直接引用的：`<script src="index.js"></script>` 。而没有用到我们熟悉的`seajs.use`。这是因为，在amb的打包策略中，已经将seajs的`最简功能`集成到包内了。\n' +
'\n' +
'>我们打开`dist/index.js`，可以发现所有的依赖模块都被打包到这个js文件中了。这是因为amb在打包移动项目时，是推荐通过整体打包方式部署的，以便于整体缓存并且减少连接数。如果不想这么做，可以[点击这里](anima-amb)查看其他打包构建方式。\n' +
'\n' +
'>因此，对于amb打包出来的文件，我们在html里只需用script标签直接引用即可。不需要做其他额外的操作。\n' +
'\n' +
'>引申阅读：\n' +
'- [amb build都做了那些事情？](anima-amb)\n' +
'- [构建详解](https://github.com/animajs/amb/wiki/Build)\n' +
'\n' +
'#### 5.构建、发布\n' +
'在项目开发并测试完毕后，我们准备最终构建线上状态的项目并进行发布。\n' +
'项目的发布时构建依然是用`amb build`命令，只是参数改为`--publish`\n' +
'\n' +
'    $ amb build --publish\n' +
'\n' +
'项目的发布时构建完毕。下面进行发布部署，激动人心的时刻到了！\n' +
'\n' +
'//建设中\n' +
'\n' +
'\n' +
'>引申阅读：\n' +
'- [amb build -publish都做了那些事情？](anima-amb)\n' +
'- [构建详解](https://github.com/animajs/amb/wiki/Build)\n' +
'\n' +
'### 常见问题FAQ\n' +
'- [常见问题FAQ](anima-faq)\n' +
'\n' +
'### 结语\n' +
'>说话算话，5个步骤完成后，是不是觉得很简单？5分钟的说法不算标题党吧？：）\n' +
'\n' +
'>如果整个过程中遇到任何问题或者建议，欢迎加入`Anima金牌客服旺旺群`：**253907639**，或者[在这里给我们留言](http://gitlab.alibaba-inc.com/alipay/anima/issues/101)。非常感谢！\n' +
'\n' +
'>另外，还有更重要的，下面的这些资源能让你进一步了解Anima项目过程，有兴趣的话推荐进一步阅读。Enjoy it。\n' +
'\n' +
'\n' +
'### 相关文档\n' +
'- AMB进阶使用指南\n' +
'- [如何开发一个H5"离线webapp包"项目](anima-howto-build-webapp)\n' +
'- [如何开发一个Anima模块/组件？](anima-howto-build-module)\n' +
'';
	var $ = function (id) { return document.getElementById(id); };
	var pre = $('preview');
	var container = pre.querySelector('.container');
	container.innerHTML = markdown.toHTML(tpl);
})()



