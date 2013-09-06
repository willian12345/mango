/**
 * Ajax module
 */
;+function(){
    var _get = function(url, data, callback, config){
        var head = document.getElementsByTagName("head")[0];
        var script = document.createElement("script");
        var uniqueName;
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
        mango.isFunction(callback) ? callback : function(){};
        

        // Handle Script loading
        script.onload = function(){
            if(config.type==='JSONP'){
                window[uniqueName] = undefined;
                try{
                    delete window[uniqueName];
                }catch(e){}
            }
            head.removeChild( script );
        };

        head.appendChild(script);
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
        var url = opts.url
        ,type = (opts.type || 'GET').toUpperCase()
        ,sync = opts.sync || 'true'
        ,data = opts.data
        ,sendData = null
        ,request = new XMLHttpRequest()
        ,success = opts.success
        ,beforeSend = opts.beforeSend
        ,complete = opts.complete
        ,error = opts.error
        ,params = $.param(data);
        request.onerror = function() {
            ///
        };
        request.onreadystatechange = function() {
            // Is send success or get the page success
            if (request.readyState==4) {
                if(request.status==200){
                    if(/json/g.test(request.getResponseHeader("Content-Type"))){//json
                        if(mango.isFunction(success)){
                            mango.isFunction(success) && mango.success(eval('('+request.responseText+')'));
                        }
                    }else{//html,text
                        mango.isFunction(success) && success(request.responseText);
                    }
                }else{// some error occurence (status is: 202、400、404、500)
                    mango.isFunction(error) && error(request);
                }
                mango.isFunction(complete) && complete(request);
            }
        };
        if(data !== undefined){
            if(type === 'GET'){
                url += (match(/\?/) ? "&" : "?") + params;
            }
        }
        request.open(type, url, sync);
        if(type === 'POST'){
            request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            request.setRequestHeader('Content-Length', params.length);
            sendData = params || null;
        }
        mango.isFunction(beforeSend) && beforeSend();
        request.send(sendData);
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