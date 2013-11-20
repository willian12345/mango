/*
 * mango dom&core
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
                if(!this[0]){
                    return {left:0, top:0};
                }
                return {left:this[0].offsetLeft, top:this[0].offsetTop};
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
}(window);