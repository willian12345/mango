<h1>Mango(芒果) javascript库</h1>

<h2><a name="" class="anchor" href="#"><span class="mini-icon mini-icon-link"></span></a>什么是mango</h2>
<p>mango是以webkit为内核的浏览器专门编写的javascript库, api高仿jquery api</p>
<p>mango在BSD协议下开源发布</p>

<h2><a name="" class="anchor" href="#"><span class="mini-icon mini-icon-link"></span></a>为什么会写mango.js</h2>
<p>因为webkit，现在越来越多的公司产品是用native程序包一个webkit内核用html5 来实现UI交互界面，而交互界面javascript又扮演着至关重要的角色。
Jquery几乎成了大多数公司选择的javascript库，如果你作为一个jser连jquery都不会用，那你就别混了，亲。
</p>
<p>但是jquery并不是专门针对webkit的</p>

<h2><a name="-1" class="anchor" href="#-1"><span class="mini-icon mini-icon-link"></span></a>jquery的包袱</h2>
<p>jquery的特点就是write less do more并兼容各型浏览器，这是伟大的创举，同时也是其包袱，各种兼容浏览器的代码，各种为了write less而发明的选择器，方便我们程序人员的同时它却是自己的包袱，这也至使其付出性能代价。</p>
<p>如果你的应用是安装在移动端，或者是应用在硬件性能并不怎么好的android设备上，你就会关心jquery的性能问题了</p>

<h2><a name="-1" class="anchor" href="#-1"><span class="mini-icon mini-icon-link"></span></a>mango放下了jquery的包袱 </h2>
<p>1、抛弃了各形浏览器兼容的代码专为webkit内核的浏览器而写；</p>
<p>2、直接使用了html5所原生支持的selector选择器；</p>
<p>3、使用最新的html5 提供的api 最大可能提升性能；</p>
<p>4、提供与jquery 95%一至的api,减少学习成本；</p>

<h2><a name="-1" class="anchor" href="#-1"><span class="mini-icon mini-icon-link"></span></a>mango是否是重复造轮子？ </h2>
<p>mango只是提供了与jquery api几乎一至的api，但它却是纯为webkit而生的，也有别于zepto之类的javascript库。Mango就是用来写webkit内核的web app的，更纯粹。</p>

<h2><a name="-1" class="anchor" href="#-1"><span class="mini-icon mini-icon-link"></span></a>mango的性能 </h2>
<p>经过测试mango的api性能</p>
<p>全面超越jquery1.3、jquery1.7、jquery2.0、zepto、jq.mobi</p>

<h2><a name="-1" class="anchor" href="#-1"><span class="mini-icon mini-icon-link"></span></a>自行选用mango的模块 </h2>
<p>根据web app的简繁程度可以自由选择mango所需要的模块来选择mango文件，达到最小化mango文件</p>

<hr />

<h2><a name="-1" class="anchor" href="#-1"><span class="mini-icon mini-icon-link"></span></a>mango的模块及api</h2>

<h3>DOM模块</h3>
<ul>
	<li>find</li>
	<li>remove</li>
	<li>empty</li>
	<li>html</li>
	<li>text</li>
	<li>show</li>
	<li>hide</li>
	<li>siblings</li>
	<li>add</li>
	<li>addBack</li>
	<li>end</li>
	<li>closest</li>
	<li>parents</li>
	<li>parentsUntil</li>
	<li>children</li>
	<li>contents</li>
	<li>eq</li>
	<li>get</li>
	<li>first</li>
	<li>last</li>
	<li>each</li>
	<li>prop</li>
	<li>removeProp</li>
	<li>attr</li>
	<li>removeAttr</li>
	<li>val</li>
	<li>data</li>
	<li>parent</li>
	<li>offset</li>
	<li>css</li>
	<li>has</li>
	<li>is</li>
	<li>filter</li>
	<li>index</li>
	<li>addClass</li>
	<li>removeClass</li>
	<li>toggleClass</li>
	<li>hasClass</li>
	<li>before</li>
	<li>after</li>
	<li>scrollLeft</li>
	<li>scrollTop</li>
	<li>append</li>
	<li>appendTo</li>
	<li>prepend</li>
	<li>prependTo</li>
	<li>next</li>
	<li>nextAll</li>
	<li>nextUntil</li>
	<li>prev</li>
	<li>prevall</li>
	<li>prevUntil</li>
	<li>width</li>
	<li>innerWidth</li>
	<li>outerWidth</li>
	<li>height</li>
	<li>innerHeight</li>
	<li>outerHeight</li>
</ul>

<h3>Events模块</h3>
<strong>注：支持自定义事件及事件命名空间 ，命名空间以’/’符分隔</strong>
<ul>
	<li>On</li>
	<li>Off</li>
	<li>Hover</li>
	<li>Trigger</li>
	<li>One</li>
</ul>
<strong>(各种快捷事件)</strong>
<p>click,dblclick,focusout,mousedown,mousemove,mouseout,mouseover,mouseup, change,select, focus, blur, scroll, resize,submit,keydown,keypress,keyup,error</p>

<h3>Ajax模块</h3>
<ul>
	<li>$.ajax</li>
	<li>$.getJson</li>
</ul>

<hr />

<h3>decoupling 解耦模块</h3>
<p>解耦模块中包含了: </p>
<p>Deferred、Callbacks、Broadcast</p>

<p>在很多情况下mango更建议使用Broadcast</p>
<p>Broadcast是一个强大的订阅发布系统（订阅者设计模式），</p>
<p>
	Deferred和Callbacks也是建议在Broadcast基础上的，这点与jquery的Deferred和Callbacks实现方式不一样
	mango刻意简化了Deferred和Callbacks
</p>

<hr />

<h2>静态方法</h2>
<ul>
	<li>$.extend</li>
	<li>$.param</li>
	<li>$.isArray</li>
	<li>$.isBoolean</li>
	<li>$.isDate</li>
	<li>$.isNumber</li>
	<li>$.isObject</li>
	<li>$.isFunction</li>
	<li>$.isRegExp</li>
	<li>$.isString</li>
	<li>$.each</li>
</ul>

<hr />

<h2>Todo list</h2>

<p>#ajax模块完善</p>
<p>#更多的静态方法增加</p>
<p>#更多的jquery api</p>

<hr />

<h2><a name="-1" class="anchor" href="#-1"><span class="mini-icon mini-icon-link"></span></a>如何使用</h2>
<p>在html中引用mango</p>
<pre><code>"mango.js"
</code></pre>
<p>接下来就可以像使用jquery一样使用mango了</p>