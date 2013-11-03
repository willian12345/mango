/*
 * mango JavaScript Library v1.0
 * just for webkit
 * author: willian.xiaodong
 * email: willian12345@126.com
 * Date: 2013-06-15
 * github: https://github.com/willian12345/mango
 */
;+function(window, undefined){
    'use strict';
    var Mango, mango, _mango = {},  guid=0, Events = {}, EventTrigger, TypeOF, _extend
    , domReady = false, domReadyCallbacks
    // check for HTML strings
    ,rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*)$/
    // Match a standalone tag
    ,rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/
    ,rtagNameExpr = /^<(\w+)\s*\/?>$/
    ,rForUpperCase = /-(.)/g
    ,rUnit = /em|px|%/
    ,indexOf = Array.prototype.indexOf
    ,splice = Array.prototype.splice
    ,slice = Array.prototype.slice;
    ;
    TypeOF = (function(){
        // create functions which is object's type check
        var typeObject = {};
        var o = ["Array", "Boolean", "Date", "Number", "Object", "RegExp", "String", 'Function'];
        for(var i = 0, c; c = o[i++];){
            typeObject['is'+c] = (function(type){
                return function(obj){
                    if(!obj) return false;
                    return Object.prototype.toString.call(obj) == "[object " + type + "]";
                }
            })(c);
        }
        return typeObject;
    })();
    // The extend core is from jquery
    _extend = function() {
        // copy reference to target object
        var target = arguments[0] || {}, i = 1, length = arguments.length, deep = false, options;

        // Handle a deep copy situation
        if ( typeof target === "boolean" ) {
            deep = target;
            target = arguments[1] || {};
            // skip the boolean and the target
            i = 2;
        }

        // Handle case when target is a string or something (possible in deep copy)
        if ( typeof target !== "object" && !TypeOF.isFunction(target) )
            target = {};

        for ( ; i < length; i++ )
            // Only deal with non-null/undefined values
            if ( (options = arguments[ i ]) != null )
                // Extend the base object
                for ( var name in options ) {
                    var src = target[ name ], copy = options[ name ];

                    // Prevent never-ending loop
                    if ( target === copy )
                        continue;

                    // Recurse if we're merging object values
                    if ( deep && copy && typeof copy === "object" && !copy.nodeType )
                        target[ name ] = _extend( deep, 
                            // Never move original objects, clone them
                            src || ( copy.length != null ? [ ] : { } )
                        , copy );

                    // Don't bring in undefined values
                    else if ( copy !== undefined )
                        target[ name ] = copy;

                }

        // Return the modified object
        return target;
    }; 

    /**
     * main Function
     */
    Mango = function (selector, context, prevObject) {
        var self = this;
        if(typeof context === 'string')
            context = document.querySelector(context);
        context = context || document;
        if(!selector){
            this.length = 0;
            return this;  
        }
        if(selector instanceof Mango){// mango
            return selector;
        }else if(selector.nodeType || selector.document){// dom
            this[0] = selector;
            this.length = 1;
            this.context = selector;
        }else if(typeof selector === 'string'){// string
            this.length = 0;
            var _sHtml, _dom;
            if(selector === 'body'){
                this[0] = document.body;
                this.length = 1;
            }else{
                 var _html = selector.match(rquickExpr);
                 if( _html ){// selector have to convert to html
                    _sHtml = rtagNameExpr.exec(selector);
                    if(_sHtml){
                        _dom = document.createElement(_sHtml[1]);
                        this[0] = _dom;
                        this.length = 1;
                    }else{
                        _dom = document.createElement('div');
                        _dom.innerHTML = selector;
                        if(_dom.childElementCount === 1){
                            this[0] = _dom.childNodes[0];
                            this.length = 1; 
                        }else if(_dom.childElementCount > 1){
                            for(var i=0,j=_dom.childElementCount; i<j; i++){
                                this[this.length] = _dom.childNodes[i];
                                this.length++;
                            }
                        }
                        _dom = null;
                    }
                } else {
                    Mango.each(context.querySelectorAll(selector),function(ele, i){
                        self[self.length] = ele;
                        self.length++;
                    });
                }
            }
            this.context = context;
        }else if(selector instanceof NodeList){//Nodelist
            return this.pushStack(selector);
        }else if(TypeOF.isFunction(selector)){//function
            if(domReady){
                selector.call(document, this);
            }else{
                if(!domReadyCallbacks){
                    domReadyCallbacks = [];
                }
                domReadyCallbacks.push(selector);
            }
        }

        if(prevObject){
            this.prevObject = prevObject;
        }
        return this;
    };
    Mango.prototype.constructor = Mango;
    
    document.addEventListener('DOMContentLoaded', function () {
        domReady = true;
        var cb;
        if(domReadyCallbacks && domReadyCallbacks.length){
            while(cb = domReadyCallbacks.shift()){
                cb.call(document, mango);
            }
        }
    }, false);

    Mango.each = function (object, callback) {
        for(var i=0,j=object.length; i<j; i++){
            var result = callback.call(this, object[i], i);
            if(result === false){
                break;
            }
        }
    };
    Mango.merge = function (first, second) {
        var l = second.length,
            i = first.length,
            j = 0;

        if ( typeof l === "number" ) {
            for ( ; j < l; j++ ) {
                first[ i++ ] = second[ j ];
            }
        } else {
            while ( second[j] !== undefined ) {
                first[ i++ ] = second[ j++ ];
            }
        }

        first.length = i;

        return first;
    };
    Mango.prev = function (node) {
        return node.previousElementSibling;
    };
    Mango.next = function (node) {
        return node.nextElementSibling;
    };

    // main function for interface
    mango = (function(){
        return function (selector, context, _prevObject) {
            return new Mango(selector, context, _prevObject);
        }
    })();
    
    // merge into mango
    _extend(mango, TypeOF);
    mango.extend = _extend;
    // Assign mango to window and pretend to jQuery
    window.jQuery = window.mango = window.$ = mango;
    // Expose plugin interface
    window.$.fn = Mango.prototype;
    $.each = Mango.each;

    // uuid from jq.mobi
    $.uuid = function () {
        var S4 = function () {
            return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
        }
        return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
    };
    // trim, trimLeft, trimRight
    ['trim','trimLeft', 'trimRight'].forEach(function(v){
        $[v] = function (str) {
            return str[v]();
        };
    });
    $.unique = function (arr) {
        for (var i = 0; i<arr.length; i++) {
            if (arr.indexOf(arr[i]) != i) {
                arr.splice(i,1);
                i--;
            };
        };
        return arr;
    };

    /**
     * Dom module
     */
    ;+function(){
        mango.extend($.fn, {
            // Optimize the results that returned from operation
            pushStack: function(elems) {
                var ret = Mango.merge(new this.constructor(), elems);
                ret.prevObject = this;
                ret.context = this.context;
                return ret;
            }
            ,find: function (query) {
                var matched = [];
                this.each(function (node) {
                    if(node && node.nodeType != 3){// text node have not querySelector
                        var r = node.querySelectorAll(query);
                        if(r){
                            Mango.each(r, function (node){
                                matched.push(node);
                            });
                        }
                    }
                });
                return this.pushStack(matched);
            }
            ,remove: function () {
                this.each(function (node) {
                    node.parentNode.removeChild(node);
                });
                return this;
            }
            ,empty: function () {
                this.each(function(){
                    this.innerHTML = '';
                });
            }
            ,html: function (str) {
                var r;
                if(str){
                    Mango.each(this, function (node) {
                        node.innerHTML = str;
                    });
                }else{
                    return this[0] && this[0].innerHTML;
                }
                return this;
            }
            ,text: function (str) {
                var r;
                if(str){
                    Mango.each(this, function (node) {
                        node.innerText = str;
                    });
                }else{
                    return this[0] && this[0].innerText;
                }
                return this;
            }
            ,show: function () {
                Mango.each(this, function(node){
                    var status = node._mangodisplaystatus;
                    status = (status!==undefined) ? status : 'block';
                    var d = window.getComputedStyle(node)['display'];
                    if(d === 'none'){
                        node.style.display = status;
                    }
                });
                return this;
            }
            ,hide: function () {
                Mango.each(this, function(node){
                    var d = window.getComputedStyle(node)['display'];
                    node._mangodisplaystatus = d;
                    if(d !== 'none'){
                        node.style.display = 'none';
                    }
                });
                return this;
            }
            ,siblings: function (filter) {///
                var matched = [];
                Mango.each(this, function (node) {
                    var parent = node.parentNode;
                    var child = parent.childNodes;
                    if(child.length){
                        for(var i=0,j=child.length; i<j; i++){
                            if(child[i] != node && child[i].nodeType === 1){
                                matched.push(child[i])
                            }
                        }
                    }
                });
                return this.pushStack(matched);
            }
            ,add: function (selector, context) {
                var self = this;
                if(selector){
                    mango(selector, context).each(function(){
                        var addNode = this;
                        var has = false;
                        self.each(function(){
                            if(addNode === this){
                                has = true;
                                return false
                            }
                        });
                        if(!has){
                            self[self.length] = addNode;
                            self.length++;
                        }
                    });
                }
                return this;
            }
            ,addBack: function () {
                return this.prevObject && this.add(this.prevObject);
            }
            ,end: function () {
                return $(this.prevObject);
            }
            ,closest: function (selector) {
                var matched = [];
                if(!selector) return this;
                this.each(function(node){
                    while(node = node.parentElement){
                        if(node.webkitMatchesSelector(selector)){
                            matched.push(node);
                            break;
                        }
                    }
                });
                return this.pushStack(matched);
            }
            ,parents: function (selector) {
                var matched = [];
                this.each(function (node) {
                    while(node = node.parentElement){
                        if(selector){
                            if(node.webkitMatchesSelector(selector))
                                matched.push(node);
                        }else{
                            matched.push(node);
                        }
                    }
                });
                return this.pushStack(matched);
            }
            ,parentsUntil: function (selector) {
                var matched = [];
                this.each(function (node) {
                    while(node = node.parentElement){
                        if(selector){
                            if($(node).is(selector)){
                                break;
                            }else{
                                matched.push(node);
                            }
                        }else{
                            matched.push(node);
                        }
                    }
                });
                return this.pushStack(matched);
            }
            ,children: function (selector){
                var matched = [];
                this.each(function(node){
                    var c = node.children;
                    for(var i=0, j=c.length; i<j;i++){
                        if(selector){
                            if(n.webkitMatchesSelector(selector));
                                matched.push(n);
                        }else{
                            matched.push(c[i]);
                        }
                    }
                });
                return this.pushStack(matched);
            }
            ,contents: function () {
                var matched = [];
                this.each(function(node){
                    var c = node.childNodes;
                    for(var i=0, j=c.length; i<j;i++){
                        matched.push(c[i]);
                    }
                });
                return this.pushStack(matched);
            }
            ,eq: function (i) {
                return mango(this[i], this, this);
            }
            ,get: function (i) {
                return this[i];
            }
            ,first: function () {
                return mango(this[0]);
            }
            ,last: function () {
                return mango(this[this.length-1]);
            }
            ,each: function (callback) {
                Mango.each(this, function (v, i) {
                    return callback.call(v, v, i);
                });
                return this;
            }
            ,prop: function (name, value) {
                if(!this[0]){
                    if(value === undefined){
                        return undefined;
                    }
                    return this;
                }
                if(TypeOF.isObject(name)){
                    for(var v in name){
                        mango(this).prop(v, name[v]);
                    }
                    return this;
                }
                if(value !== undefined){
                    Mango.each(this, function (node) {
                        node[name] = value;
                    });
                    return this;
                }else{
                    return this[0][name];
                }
            }
            ,removeProp: function (propName) {
                return this.each(function(node){
                    delete node[propName];
                });
            }
            ,attr: function (name, value) {
                if(!this[0]){
                    if(value === undefined){
                        return undefined;
                    }
                    return this;
                }
                if(TypeOF.isObject(name)){
                    for(var v in name){
                        mango(this).attr(v, name[v]);
                    }
                    return this;
                }
                if(value !== undefined){
                    Mango.each(this, function (node) {
                        node.setAttribute(name, value+'')
                    });
                    return this;
                }else{
                    return this[0].getAttribute(name);
                }
            }
            ,removeAttr: function (attrName) {
                if(attrName){
                    Mango.each(this, function (node) {
                        node.removeAttribute(attrName);
                    });
                }
                return this;
            }
            ,val: function (value) {
                if(!this[0]){
                    if(value === undefined){
                        return undefined;
                    }
                    return this;
                }
                if(value !== undefined){
                    Mango.each(this, function (node) {
                        node.value = value;
                    });
                    return this;
                }else{
                    return this[0].value;
                }
            }
            ,data: function (name, value) {
                if(!this[0]){
                    if(value === undefined){
                        return undefined;
                    }
                    return this;
                }
                if(TypeOF.isObject(name)){
                    for(var v in name){
                        mango(this).data(v, name[v]);
                    }
                    return this;
                }
                if(value !== undefined){
                    Mango.each(this, function (node) {
                        node.dataset[name] = value;
                    });
                    return this;
                }else{
                    return this[0].dataset[name];
                }
            }
            ,parent: function (selector) {
                var matched = [];
                Mango.each(this, function (node) {
                    var node = node.parentElement;
                    if(selector){
                        if(node.webkitMatchesSelector(selector))
                            matched.push(node);
                    }else{
                        matched.push(node);
                    }
                });
                return this.pushStack(matched);
            }
            ,offset: function () {
                var dom = this[0] ,offsetParent;
                if(!dom){
                    return null;
                }
                var x = dom.getBoundingClientRect().left + document.documentElement.scrollLeft;
                var y = dom.getBoundingClientRect().top + document.documentElement.scrollTop;
                return {left: x, top: y};
            }
            ,position: function(){
                var borderWidth,borderHeight,s, dom = this[0];
                if(!dom){
                    return null;
                }
                s = window.getComputedStyle(dom.offsetParent);
                borderWidth = parseInt(s['border-left-width'], 10);
                borderHeight = parseInt(s['border-top-width'], 10);
                return {left:parseInt(dom.offsetLeft,10) + borderWidth, top: parseInt(dom.offsetTop,10) + borderHeight};
            }
            ,css: function (p, v) {
                var s, i, cssBat;
                if(TypeOF.isObject(p)){
                    cssBat = '';
                    // faster
                    for(var _v in p){
                        cssBat += _v + ':'+ p[_v] +';';
                    }
                    // slow
                    // s = JSON.stringify(p).replace(/\",/g, function(){
                    //     return ';';
                    // });
                    // s = s.replace(/[\{\}\"]/g,'');
                    this.each(function(node){
                        node.style.cssText += cssBat;
                    });
                    return this;
                }
                if(v !== undefined){
                    var strArr = [];
                    // Uppercase the letter which after the '-'
                    p = p.replace(rForUpperCase, function($1,$2) {
                        return $2.toUpperCase(); 
                    });
                    // lowercase the first letter
                    if($.isNumber(v*1) && !rUnit.test(v)){///
                        v += 'px';
                    }
                    Mango.each(this, function (node) {
                        node.style[p] = v;
                    });
                }else{
                    s = window.getComputedStyle(this[0]);
                    if(s){
                        return s[p];
                    }
                    return undefined;
                    
                }
                return this;
            }
            ,has: function (selector) {
                var matched;
                if(!selector) return this;
                matched = [];
                this.each(function(node){
                    if(node.webkitMatchesSelector(selector))
                        matched.push(node);
                });
                return this.pushStack(matched);
            }
            ,is: function (p) {
                if(!p) return false;
                if(TypeOF.isString(p)){
                    return this[0].webkitMatchesSelector(p);
                }else if(TypeOF.isObject(p) && p instanceof Mango){
                    return this[0] === p[0];
                }else if(p.nodeType){
                    return this[0] === p;
                }else if(TypeOF.isFunction(p)){
                    return p.call(this[0]);
                }
                return false;
            }
            ,filter: function (p) {
                var matched;
                if(!p) return this;
                matched = [];
                if(TypeOF.isString(p)){
                    return this.has(p);
                }else if(TypeOF.isObject(p) && p instanceof Mango){
                    this.each(function(node){
                        if(node === p[0]){
                            matched.push(node);
                        }
                    });
                }else if(p.nodeType){
                    this.each(function(node){
                        if(node === p){
                            matched.push(node);
                        }
                    });
                }else if(TypeOF.isFunction(p)){
                    this.each(function(node, i){
                        if(p.call(this[0], i)){
                            matched.push(node);
                        }
                    });
                }
                return this.pushStack(matched);
            }
            ,index: function(selector){
                var dom, i = -1, n = this[0];
                if(!n) return i;
                if(!selector) return indexOf.call(n.parentElement.children, n);
                dom = (selector instanceof Mango) ? selector[0] : selector;
                this.each(function(node, _i){
                    if(node == dom){
                        i = _i;
                    }
                });
                return i;
            }
            // The splice which make mango to pretend to array object
            ,splice: splice
        });
        // extend addClass,removeClass,toggleClass,hasClass
        +function(){
            var classList = {addClass: 'add', removeClass: 'remove', toggleClass: 'toggle'};
            for(var k in classList){
                +function(_k){
                    Mango.prototype[_k] = function (className) {
                        Mango.each(this, function (node) {
                            node && node.classList[classList[_k]](className);
                        });
                        return this;
                    }
                }(k);
            }
            Mango.prototype.hasClass = function (className){///
                var ret = false;
                Mango.each(this, function (node) {
                    ret = node && node.classList['contains'](className);
                });
                return ret;
            }
        }();
        // extend before,after
        ['before', 'after'].forEach(function(v){
            var add;
            if(v === 'before'){
                add = function (target, el, selector) {
                    if(rquickExpr.test(selector)){// pure html string
                        target.insertAdjacentHTML('beforeBegin', selector);// call new api
                    }else{
                        target.parentElement.insertBefore(el.cloneNode(true), target);    
                    }
                }
            }else{
                add = function (target, el, selector) {
                    if(rquickExpr.test(selector)){// pure html string
                        target.insertAdjacentHTML('afterEnd', selector);// call new api
                    }else{
                        target.parentElement.insertBefore(el.cloneNode(true), target.nextElementSibling);
                    }
                }
            }
            
            Mango.prototype[v] = function (selector) {
                var self = this, $selector = mango(selector);
                Mango.each(this, function(target){
                    Mango.each($selector, function (el) {
                       add(target, el, selector);
                    });
                });
                return this;
            }
        });
        // extend scrollLeft scrollTop
        ['scrollLeft', 'scrollTop'].forEach(function(v){
            Mango.prototype[v] = function (value) {
                if(TypeOF.isNumber(value)){
                    this.each(function(node){
                        node[v] = value;
                    });
                }
                return this[0][v];
            }
        });
        // extend append,prepend,appendTo, prependTo
        ['append','prepend'].forEach(function(v){
            var add;
            if(v === 'append'){
                add = function (parent, child, selector) {
                    var c,remove;
                    if(selector.length>1){
                        c = child.cloneNode(true);
                        remove = true;
                    }else{
                        c = child;
                    }
                    parent.appendChild(c);
                    if(remove){///
                        child.parentNode && child.parentNode.removeChild(child);
                    }
                }
            } else {
                add = function (parent, child, selector) {
                    var c,remove;
                    if(selector.length>1){
                        c = child.cloneNode(true);
                        remove = true;
                    }else{
                        c = child;
                    }
                    parent.insertBefore(c, parent.firstChild);
                    if(remove){///
                        child.parentNode && child.parentNode.removeChild(child);
                    }
                }
            }
            Mango.prototype[v + 'To'] = function (selector) {
                var self = this;
                Mango.each(mango(selector), function(target){
                    Mango.each(self, function (el) {
                        add(target, el, selector);
                    });
                });

                return this;
            }
            Mango.prototype[v] = function (child) {
                mango(child)[v + 'To'](this);
                return this;
            }
        });
        
        // extend next, prev, nextAll, prevAll, nextUntil, prevUntil
        ['next','prev'].forEach(function(v){
            Mango.prototype[v] = function(selector){
                var results = [];
                this.each(function (node) {
                    var _node = Mango[v](node);
                    if(_node){
                        if(selector){
                            if(_node.webkitMatchesSelector(selector))
                                results.push(_node);
                        }else{
                            results.push(_node);
                        }
                    }
                });
                return this.pushStack(results);
            };
            Mango.prototype[v + 'All'] = function (selector) {
                var results = [];
                this.each(function (node) {
                    while(node = Mango[v](node)){
                        if(selector){
                            if(node.webkitMatchesSelector(selector))
                                results.push(node);
                        }else{
                            results.push(node);
                        }
                    }
                });
                return this.pushStack(results);
            };
            Mango.prototype[v + 'Until'] = function(selector){
                var results = [];
                this.each(function (node) {
                    while(node = Mango[v](node)){
                        if(selector){
                            if($(node).is(selector)){
                                break;
                            }else{
                                results.push(node);
                            }
                        }else{
                            results.push(node);
                        }
                    }
                });
                return this.pushStack(results);
            };
        });
        // extend width,height,innerWidth, outerWidth, innerHeight, outerHeight
        ['Width', 'Height'].forEach(function(v) {
            var _v = v.toLowerCase();
            Mango.prototype[_v] = function (value) {
                var re;
                if(value===undefined){
                    if(!this[0]) return undefined;
                    re = window.getComputedStyle(this[0]);
                    if(re){
                        return parseInt(re[_v]);
                    }
                    // return this[0]['client' + v];
                }else{
                    if(typeof value === 'string'){
                        if(!rUnit.test(value)){
                            value += 'px';
                        }
                    }
                    this.each(function(el){
                        el.style[_v] = value;
                    });
                }
                return this;
            }
            // include padding+border
            Mango.prototype['inner' + v] = function (value) {
                if(value === undefined){
                    if(!this[0]) return undefined;
                    return this[0]['offset' + v];
                }
                return this;
            }
            // include padding+border+margin
            Mango.prototype['outer' + v] = function (value) {
                var s, mtb, mlr;
                if(value === undefined){
                    if(!this[0]) return undefined;
                    s = window.getComputedStyle(this[0]);
                    mtb = parseInt(s['margin-top']) + parseInt(s['margin-bottom']);
                    mlr = parseInt(s['margin-left']) + parseInt(s['margin-right']);
                    return this[0]['offset' + v] + ((v==='Width') ? mlr : mtb);
                }
                return this;
            }
        });
    }();
    
    /**
     * Event module
     */
    ;+function(){
        mango.extend($.fn, {
            on: function (eventName, selector, cb) {
                var _cb = cb, eventDispacher;
                
                if(!eventName) return this;

                if(!_cb){
                    _cb = selector;
                    selector = null;
                }

                Mango.each(this, function (el) {
                    // The private attribute '_mangodomid'
                    // is make relationship between dom and Events object
                    var _id = el._mangodomid;
                    if(!_id){
                        _id = guid++;
                        el._mangodomid =  _id;
                        Events[_id] = {};
                    }
                    if(!Events[_id][eventName]){
                        Events[_id][eventName] = {
                            type: eventName
                            ,handles: []
                        };
                    }

                    // window.Events = Events;///

                    var handle = function () {
                        var e, arr, tagName, className, _el, _selector, currentTarget, e = arguments[0];
                        _el = e.srcElement;
                        // check event namespace
                        if(e._privateEvent && e._privateEvent != eventName){
                            return ;
                        }
                        
                        if(selector){
                            //!!(container.compareDocumentPosition(maybe) & 16)
                            if(_el.webkitMatchesSelector(selector)){ // check delegate element
                                _cb.apply(_el, slice.call(arguments, 0));
                            }
                        }else{
                            _cb.apply(el, slice.call(arguments, 0));
                        }
                    }
                    // Add eventListener without event namespace
                    el.addEventListener(eventName.split('/')[0], handle, false);

                    // push handle to Events for removeEventListener later
                    Events[_id][eventName].handles.push(handle);
                });

                return this;
            }
            ,off: function (eventName) {
                if(!eventName) return this;
                Mango.each(this, function(el){
                    var _id = el._mangodomid;
                    if(_id){
                        Events[_id][eventName].handles.forEach(function(handle){
                            el.removeEventListener(eventName.split('/')[0], handle, false);
                        });
                        Events[_id][eventName].handles.length = 0;
                    }
                });
            }
            ,hover: function (hoverIn, hoverOut) {
                if(TypeOF.isFunction(hoverIn)){
                    Mango.each(this, function(el){
                        var $el = mango(el);
                        $el.on('mouseover', function(e){
                            // mouseEnter
                            if(el === e.srcElement && !el.contains(e.relatedTarget)){
                                hoverIn.call(el, e);
                            }
                        });
                        if(TypeOF.isFunction(hoverOut)){
                            $el.on('mouseout', function(e){
                                // mouseLeave
                                if(el === e.srcElement && !el.contains(e.relatedTarget)){
                                    hoverOut.call(el, e);
                                }
                            });
                        }
                    });
                }
                return this;
            }
            ,trigger: function (eventType, extraParam) {
                var privateEvent = null, eventNamespace;
                if(!eventType) return this;

                eventNamespace = eventType.split('/');
                if(eventNamespace.length > 1){
                    privateEvent = eventType;
                }
                Mango.each(this, function(el) {
                    EventTrigger.trigger(el, eventNamespace[0], privateEvent, extraParam);
                });
                return this;
            }
            ,one: function (eventName, delegate, cb) {
                if(!cb){
                    cb = delegate;
                    delegate = null;
                }
                this.each(function(node){
                    var $node = mango(node);
                    $node.on(eventName, delegate, function(e){
                        cb.call(this, e);
                        $node.off(eventName);
                    });
                });
            }
        });
        //Extend some events
        ['click','dblclick','focusout','mousedown','mousemove','mouseout','mouseover','mouseup', 'change',
         'select', 'focus', 'blur', 'scroll', 'resize','submit','keydown','keypress','keyup','error'].forEach(function(v){
            Mango.prototype[v] = function(cb) {
                this.each(function(node){
                    !!cb ? $(node).on(v,cb): $(node).trigger(v);
                });
            }
        });
        // w3c original event model
        EventTrigger = {
            trigger: function (element, eventName, _privateEvent, extraParam){
                var options = _extend(EventTrigger.defaultOptions, arguments[2] || {});
                var oEvent, eventType = null;
                var eventId;
                for (var name in EventTrigger.eventMatchers){
                    if (EventTrigger.eventMatchers[name].test(eventName)) { eventType = name; break; }
                }
                if (!eventType){
                    // custom event bubbling
                    mango(element).parents().addBack().each(function(){
                        var _id = this['_mangodomid'], d = [{srcElement: element}];
                        if(mango.isArray(extraParam)) d = d.concat(extraParam);
                        if(_id !== undefined){
                            Events[_id][eventName].handles.forEach(function(eventCb){
                                eventCb.apply(this, d);
                            }.bind(this));
                        }
                    });
                    return ;
                }

                if (document.createEvent){
                    oEvent = document.createEvent(eventType);
                    oEvent._privateEvent = _privateEvent;
                    if (eventType == 'HTMLEvents'){
                        oEvent.initEvent(eventName, options.bubbles, options.cancelable);
                    }else{
                        oEvent.initMouseEvent(eventName, options.bubbles, options.cancelable, document.defaultView,
                        options.button, options.pointerX, options.pointerY, options.pointerX, options.pointerY,
                        options.ctrlKey, options.altKey, options.shiftKey, options.metaKey, options.button, element);
                    }
                    element.dispatchEvent(oEvent);
                }
                return element;
            }
            ,eventMatchers: {
                'HTMLEvents': /^(?:load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll)$/
                ,'MouseEvents': /^(?:click|dblclick|mouse(?:down|up|over|move|out))$/
                ,'TouchEvents': /^(?:touch(?:start|end|move))$/
            }
            ,defaultOptions: {
                pointerX: 0,
                pointerY: 0,
                button: 0,
                ctrlKey: false,
                altKey: false,
                shiftKey: false,
                metaKey: false,
                bubbles: true,
                cancelable: true
            }
        };
    }();

    /**
     * Ajax module
     */
    ;+function(){
        var empty = function () {};
        var ajaxSettings = {
            type: 'GET',
            beforeSend: empty,
            success: empty,
            error: empty,
            complete: empty,
            context: undefined,
            timeout: 0,
            crossDomain:false
        };
        var _get = function(url, data, callback, config){
            var uniqueName, abortTimeout = '';
            var head = document.getElementsByTagName("head")[0];
            var script = document.createElement("script");
            if (config.scriptCharset) script.charset = config.scriptCharset;
            if(!callback) callback = data;
            if(config.type === 'JSONP'){
                uniqueName = 'jsonp' + Date.now() + Math.ceil(Math.random() * 10000);
                if(url) url = url.replace(/=\?/g, ('='+uniqueName));
                if($.isObject(data)) url += '&' + $.param(data);
                window[uniqueName] = callback;
            }
            script.src = url;
            script.async = true;
        
            // Handle Script loading
            script.onload = function(){
                if(config.type==='JSONP'){
                    clearTimeout(abortTimeout);
                    window[uniqueName] = undefined;
                    try{
                        delete window[uniqueName];
                    }catch(e){}
                }
                head.removeChild(script);
            };
            if(config.error){
               script.onerror=function(){
                  clearTimeout(abortTimeout);
                  config.error.call(context, "", 'error');
               }
            }
            head.appendChild(script);
            if (config.timeout > 0) {
                abortTimeout = setTimeout(function() {
                    mango.isFunction(config.error) && config.error.call(this, "", 'timeout');
                }, config.timeout);
            };
        };
        mango.param = function( a ) {
            var s = [ ];
            function add( key, value ){
                s[ s.length ] = encodeURIComponent(key) + '=' + encodeURIComponent(value);
            };
            // If an array was passed in, assume that it is an array
            // of form elements
            if ( mango.isArray(a))
                // Serialize the form elements
                Mango.each( a, function(){
                    add( this.name, this.value );
                });

            // Otherwise, assume that it's an object of key/value pairs
            else
                // Serialize the key/values
                for ( var j in a )
                    // If the value is an array then the key names need to be repeated
                    if ( mango.isArray(a[j]) )
                        Mango.each( a[j], function(){
                            add( j, this );
                        });
                    else
                        add( j, mango.isFunction(a[j]) ? a[j]() : a[j] );

            // Return the resulting serialization
            return s.join("&").replace(/%20/g, "+");
        };
        mango.ajax = function (opts) {
            var opts = opts || {};
            for (var key in ajaxSettings) {
                if (!opts[key])
                    opts[key] = ajaxSettings[key];
            }
            var url = opts.url
            ,type = (opts.type).toUpperCase()
            ,sync = opts.sync || 'true'
            ,data = opts.data
            ,dataType
            ,sendData = null
            ,xhr = new XMLHttpRequest()
            ,success = opts.success
            ,beforeSend = opts.beforeSend
            ,complete = opts.complete
            ,error = opts.error
            ,isError = false
            ,context = opts.context
            ,abortTimeout
            ,params = $.param(data);
            if (!opts.contentType)
                opts.contentType = "application/x-www-form-urlencoded";

            if (!opts.dataType){
                opts.dataType = "text/html";
            } else {
                switch (opts.dataType) {
                    case "script":
                        opts.dataType = 'text/javascript, application/javascript';
                        break;
                    case "json":
                        opts.dataType = 'application/json';
                        break;
                    case "xml":
                        opts.dataType = 'application/xml, text/xml';
                        break;
                    case "html":
                        opts.dataType = 'text/html';
                        break;
                    case "text":
                        opts.dataType = 'text/plain';
                        break;
                    default:
                        opts.dataType = "text/html";
                        break;
                    case "jsonp":
                        return _get(opts.url, data, success,{type:'JSONP'});
                        break;
                }
            }
            xhr.onerror = function() {
                error.call(context, xhr, 'error');
            };
            xhr.onreadystatechange = function() {
                var mime = opts.dataType, resp;
                // Is send success or get the page success
                if (xhr.readyState == 4) {
                    clearTimeout(abortTimeout);
                    if(xhr.status == 200){
                        // /json/g.test(xhr.getResponseHeader("Content-Type"))
                        // mime is json and the responseText is not empty
                        if(mime === 'application/json' && !(/^\s*$/.test(xhr.responseText))){
                            // mango.isFunction(success) && mango.success(eval('('+xhr.responseText+')'));
                            try{
                                resp = JSON.parse(xhr.responseText);
                            }catch(e){
                                isError = e;
                            }
                            
                        }else{//html,text
                            resp = xhr.responseText;
                        }
                        if (isError) {
                            error.call(context, xhr, 'error');
                        }else{
                            success.call(context, resp, 'success', xhr);    
                        }
                    }else{// some error occurence (status is: 202、400、404、500)
                        isError = true;
                        error.call(context, xhr, 'error');
                    }
                    complete.call(context, xhr, isError?'error':'success');
                }
            };
            if(data !== undefined){
                if(type === 'GET'){
                    url += (match(/\?/) ? "&" : "?") + params;
                }
            }
            xhr.open(type, url, sync);
            if(type === 'POST'){
                xhr.setRequestHeader('Content-type', opts.contentType);
                xhr.setRequestHeader('Content-Length', params.length);
                sendData = params || null;
            }
            if(mango.isFunction(beforeSend)){// stop xhr request when beforeSend return false 
                if(beforeSend.call(context, xhr, opts) === false){
                    xhr.abort();
                    return false;
                }
            }
            if (opts.timeout > 0){
                abortTimeout = setTimeout(function() {
                    xhr.onreadystatechange = empty;
                    xhr.abort();
                    error.call(context, xhr, 'timeout');
                }, opts.timeout);
            }
            xhr.send(sendData);
        };

        mango.getJSON = function (url, data, callback) {
            _get(url, data, callback,{type:'JSONP'});
        };
        /// The faster request of get which send some data to server
        mango.beacon = function(url, params, callback, error){
            var beacon = new Image();
            beacon.src = url + '?' + $.param(params);
            beacon.onload = function () {
                callback();
            };
            if(mango.isFunction(error)) beacon.onerror = function () { error();}
        };
    }();

    /**
     * Decoupling module
     */
    ;+function () {
        /**
         * Broadcast module
         * The Broadcast core from ArbiterJS
         * !(——_——) The Arbiter have some bugs 
         * Broadcast just fixed these bugs and add some useful functions
         */
        var Broadcast = function () {
            var subscriptions = {};
            var wildcard_subscriptions = {};
            var persistent_messages = {};
            var id_lookup = {};
            var new_id = 1;
            return {
                'create': function() { return Broadcast(); }
                ,'sub': function() {
                    var msg, messages, subscription_list, persisted_subscription_list, subscription, func, options={}, context, wildcard=false, priority=0, id, return_ids=[];
                    if (arguments.length<2) { return null; }
                    messages = arguments[0];
                    func = arguments[arguments.length-1]; // Function is always last argument
                    if (arguments.length>2) { options = arguments[1] || {}; }
                    if (arguments.length>3) { context = arguments[2]; }

                    if (options.priority) {
                        priority = options.priority;
                    }
                    if (typeof messages=="string") {
                        messages = messages.split(/[,\s]+/);
                    }
                    for (var i=0; i<messages.length; i++) {
                        msg = messages[i];
                        // If the message ends in *, it's a wildcard subscription
                        if (/\*$/.test(msg)) {
                            wildcard = true;
                            msg = msg.replace(/\*$/,'');
                            subscription_list = wildcard_subscriptions[msg];                
                            if (!subscription_list) {
                                wildcard_subscriptions[msg] = subscription_list = [];
                            }
                        }
                        else {
                            subscription_list = subscriptions[msg];             
                            if (!subscription_list) {
                                subscriptions[msg] = subscription_list = [];
                            }
                        }
                        id = new_id++;
                        func._Broadcast_subid = id;/// inject id to func for delete
                        subscription = {'id':id,'f':func,p:priority,self:context,'options':options, msg: msg};
                        id_lookup[id] = subscription;
                        subscription_list.push ( subscription );
                        // Sort the list by priority
                        subscription_list = subscription_list.sort( function(a,b) {
                            return (a.p>b.p?-1:a.p==b.p?0:1);
                        } );
                        // Put it back in after sorting
                        if (wildcard) {
                            wildcard_subscriptions[msg] = subscription_list;
                        }
                        else {
                            subscriptions[msg] = subscription_list;
                        }
                        return_ids.push(id);
                        
                        // Check to see if there are any persistent messages that need
                        // to be fired immediately
                        if (!options.persist && persistent_messages[msg]) {
                            persisted_subscription_list = persistent_messages[msg];
                            for (var j=0; j<persisted_subscription_list.length; j++) {
                                subscription.f.call( subscription.self, persisted_subscription_list[j], {persist:true} );
                            }
                        }
                    }
                    // Return an array of id's, or just 1
                    if (messages.length>1) {
                        return return_ids;
                    }
                    return return_ids[0];
                }
                
                ,'pub': function(msg, data, options) {
                    var async_timeout=10,result,overall_result=true,cancelable=true,internal_data={},subscriber, wildcard_msg;
                    var subscription_list = subscriptions[msg] || [];
                    options = options || {};
                    // Look through wildcard subscriptions to find any that apply
                    for (wildcard_msg in wildcard_subscriptions) {
                        if (msg.indexOf(wildcard_msg)==0) {
                            subscription_list = subscription_list.concat( wildcard_subscriptions[wildcard_msg] );
                        }
                    }
                    if (options.persist===true) {
                        if (!persistent_messages[msg]) {
                            persistent_messages[msg] = [];
                        }
                        persistent_messages[msg].push( data );
                    }
                    if (subscription_list.length==0) { 
                        return overall_result; 
                    }
                    if (typeof options.cancelable=="boolean") {
                        cancelable = options.cancelable;
                    }
                    for (var i=0; i<subscription_list.length; i++) {
                        subscriber = subscription_list[i];
                        if (subscriber.unsubscribed) { 
                            continue; // Ignore unsubscribed listeners
                        }
                        try {
                            // Publisher OR subscriber may request async
                            if (options.async===true || (subscriber.options && subscriber.options.async)) {
                                setTimeout( (function(inner_subscriber) {
                                    return function() {
                                        inner_subscriber.f.call( inner_subscriber.self, data, msg, internal_data );
                                    };
                                })(subscriber), async_timeout++ );
                            }
                            else {
                                result = subscriber.f.call( subscriber.self, data, msg, internal_data );
                                if (cancelable && result===false) {
                                    break;
                                }
                            }
                        }
                        catch(e) {
                            overall_result = false;
                        }
                    }
                    return overall_result;
                }
                
                ,'unsub': function(id, remove) {
                    if(typeof id != 'number') id = id._Broadcast_subid;///
                    if (id_lookup[id]) {
                        if(!remove){
                            id_lookup[id].unsubscribed = true;
                        }else{
                            var msg = id_lookup[id].msg,
                            subscription_list = subscriptions[msg];
                            for( var l = subscription_list.length, i= l-1; i>=0; i-- ){
                                subscription_list[i]['id'] == id && subscription_list.splice(i,1);
                            }
                            subscription_list.length == 0 && delete subscriptions[msg];
                            delete id_lookup[id];
                        }
                        return true;
                    }
                    return false;
                }
                
                ,'resub': function(id) {
                    if (id_lookup[id]) {
                        id_lookup[id].unsubscribed = false;
                        return true;
                    }
                    return false;
                }
            };
        };
        $.Broadcast = Broadcast();

        /* Callbacks module */
        var _Callback = function (config) {
            this.bc = $.Broadcast.create();
            this.msg = 'callbacks';
        };
        _Callback.prototype = {
            add: function (fn) {
                return this.bc.sub(this.msg, fn);
            }
            ,fire: function (o) {
                this.bc.pub(this.msg, o);
            }
            ,remove: function (id) {
                this.bc.unsub(id, true);
            }
        };
        $.Callbacks = (function(){
            return function () {
                return new _Callback();
            }
        })();

        /* Deferred module */
        var _Deferred = function(){
            var deferred
            ,sucs = new _Callback()
            ,fails = new _Callback()
            ,always = new _Callback()
            ,state = "pending"
            ,promise = {
                always: function (f) {
                    always.add(f);
                    return this;
                }
                ,done: function(f){
                    sucs.add(f);
                    return this;
                }
                ,fail: function (f){
                    fails.add(f);
                    return this;
                }
                ,state: function(){
                    return state;
                }
                ,then: function(s, f){
                    sucs.add(s);
                    fails.add(f);
                    return this;
                }   
                ,promise: function( obj ) {
                    if ( obj == null ) {
                        obj = promise;
                    } else {
                        for ( var key in promise ) {
                            obj[ key ] = promise[ key ];
                        }
                    }
                    return obj;
                }
            };
            deferred = promise.promise({});
            deferred.resolve = function(args){
                sucs.fire(args);
                always.fire(args);
            };
            deferred.reject = function(args){
                fails.fire(args);
                always.fire(args);
            };
            return deferred.then(function(){
                state = 'resolved';
            }, function(){
                state = 'rejected';
            });
        };
        $.Deferred = (function(){
            return function () {
                return new _Deferred();
            }
        })();
        /* when */
        $.when = function (){
            var args = Array.prototype.slice.call(arguments, 0)
            ,l = args.length
            ,count = l
            ,arg
            ,dtd = $.Deferred()
            ,resolveFunc = function () {
                --count;
                if(!count){
                    dtd.resolve();
                }
            };
            for (var i = l - 1; i >= 0; i--) {
                arg = args[i];
                if(arg && arg.promise && (typeof args[i].promise === 'function')){// deferred
                    args[i].promise().then(resolveFunc, dtd.reject);
                }else if(typeof args[i] === 'function'){// function
                    --count;
                    args[i]();
                }else{// object
                    --count;
                }
            };

            return dtd.promise();
        };
    }();
}(window);