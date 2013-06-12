;(function(window){
    _mango = {};
    var objectTypes = ["Array", "Boolean", "Date", "Number", "Object", "RegExp", "String", 'Function'];
    for(var i = 0, c; c = objectTypes[i++];){
        _mango['is'+c] = (function(type){
            return function(obj){
                if(!obj) return false;
                return Object.prototype.toString.call(obj) == "[object " + type + "]";
            }
        })(c);
    }
    var Mango = function (selector, context) {
        context = context || document;
        if(!selector) return null;
        if(selector.context){// mango 直接返回
            return selector;
        }else if(selector.nodeType){// dom
            this[0] = selector;
            this.length = 1;
            this.context = selector;
            return this;
        }else if(_mango.isString(selector)){
            this.length = 0;
            var matched = [];
            selector.split(',').forEach(function(v,i){
                var a = v.substr(0,1);
                if(a === '#'){
                    matched.push(context.querySelector(v))
                }else if(a === '.'){
                    Mango.each(context.querySelectorAll(v),function(ele, i){
                        this[this.length] = ele;
                        this.length++;
                        // console.log(this, ele, i)
                    }.bind(this));
                }
            }.bind(this));
            if(matched.length === 1){
                this[0] = matched[0];
                this.length = 1;
            }
            this.context = context;
            return this;
        }else if(_mango.isArray(selector)){
            selector.forEach(function (v, i) {
                this[i] = v;
            }.bind(this));
            this.length = selector.length;
            this.context = context;
            return this;
        }else if(_mango.isFunction(selector)){
            window.document.addEventListener('DOMContentLoaded', function () {
                selector();
            }, false)
        }

    };
    Mango.each = function (object, callback) {
        for(var i=0,j=object.length; i<j; i++){
            callback.call(this, object[i], i);
        }
    };
    Mango.prev = function (node) {
        node = node.previousSibling;
        while(node.nodeType!=1){
            node=node.previousSibling;
            if(!node) return null;
        };
        return node;
    };
    Mango.next = function (node) {
        node = node.nextSibling;
        while(node.nodeType!=1){
            node=node.nextSibling;
            if(!node) return null;
        };
        return node;
    };
    Mango.prototype = {
        constructor: Mango
        ,find: function (query) {
            var self = this;
            var results = [];
            Mango.each(self, function (node) {
                if(node){
                    var r = node.querySelectorAll(query);
                    if(r){
                        Mango.each(r, function (node){
                            results.push(node);
                        });
                    }
                }
            });
            return mango(results);
        }
        ,addClass: function (className) {
            Mango.each(this, function (node) {
                node && node.classList.add(className);
            });
            return this;
        }
        ,removeClass: function (className) {
            Mango.each(this, function (node) {
                node && node.classList.remove(className);
            });
            return this;  
        }
        ,hasClass: function (className) {
            return this[0].classList.contains(className);
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
        ,siblings: function (filter) {///
            var results = [];
            Mango.each(this, function (node) {
                var parent = node.parentNode;
                var child = parent.childNodes;
                if(child.length){
                    for(var i=0,j=child.length; i<j; i++){
                        if(child[i] != node && child[i].nodeType === 1){
                            results.push(child[i])
                        }
                    }
                }
            });
            return mango(results);
        }
        ,prev: function () {
            var results = [];
            Mango.each(this, function (node) {
                var prev = Mango.prev(node);
                if(prev){
                    results.push(prev);
                }
            });
            return mango(results);
        }
        ,next: function () {
            var results = [];
            Mango.each(this, function (node) {
                var next = Mango.next(node);
                if(next){
                    results.push(next);
                }
            });
            return mango(results);
        }
        ,eq: function (i) {
            return mango(this[i]);
        }
        ,get: function (i) {
            return this[i];
        }
        ,each: function (callback) {
            Mango.each(this, function (v, i) {
                callback.call(v, v, i);
            });
        }
        ,prop: function (name, value) {
            if(!this[0]){
                if(value === undefined){
                    return undefined;
                }
                return this;
            }
            if(value !== undefined){
                Mango.each(this, function (node) {
                    node[name] = value
                });
                return this;
            }else{
                return this[0][name];
            }
        }
        ,attr: function (name, value) {
            if(!this[0]){
                if(value === undefined){
                    return undefined;
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
        ,data: function (name, value) {
            if(!this[0]){
                if(value === undefined){
                    return undefined;
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
    };
    var mango = (function(){
        return function (selector, context) {
            return new Mango(selector, context);
        }
    })();
    mango.extend = function() {
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
        if ( typeof target !== "object" && !_mango.isFunction(target) )
            target = {};

        // extend jQuery itself if only one argument is passed
        if ( length == i ) {
            target = this;
            --i;
        }

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
                        target[ name ] = mango.extend( deep, 
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
    mango.extend(mango, _mango);
    mango.param = function( a ) {
        var s = [ ];

        function add( key, value ){
            s[ s.length ] = encodeURIComponent(key) + '=' + encodeURIComponent(value);
        };

        // If an array was passed in, assume that it is an array
        // of form elements
        if ( mango.isArray(a) || a.jquery )
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
    }
    mango.ajax = function (opts) {
        var url = opts.url;
        var type = (opts.type || 'GET').toUpperCase();
        var sync = opts.sync || 'true';
        var data = opts.data;
        var sendData = null;
        var request = new XMLHttpRequest();
        var success = opts.success;

        request.onreadystatechange = function() {
            //判断是否发送成功，是否找到请求页面等 
            if (request.readyState==4 && request.status==200) {
                if(/json/g.test(request.getResponseHeader("Content-Type"))){
                    if(mango.isFunction(success)){
                        success(eval('('+request.responseText+')'));
                    }
                }
            } 
        }
        if(data !== undefined){
            if(type === 'GET'){
                url += '?' + $.param(data);    
            }
        }
        request.open(type, url, sync);
        if(type === 'POST'){
            request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            sendData = $.param(data) || null;
        }
        request.send(sendData);
    };
    mango.getJSON = function (url, callback) {
        var head = document.getElementsByTagName("head")[0];
        var script = document.createElement("script");
        var randomFunc = 'jsonp' + Date.now() + Math.ceil(Math.random() * 10000);
        window[randomFunc] = callback;
        if(url){
            url = url.replace(/=\?/g, ('='+randomFunc));
        }
        script.src = url;
        script.async = true;
        // Handle Script loading
        script.onload = function(){
            head.removeChild( script );
        };

        head.appendChild(script);
    }
    window.mango = window.$ = mango;    
})(this);