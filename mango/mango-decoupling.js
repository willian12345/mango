/*
 * Decoupling module
 * Include module: Deferred、Callbacks、Broadcast(pub/sub pattern)
 * Attention: it can independent use in your project 
 * author: willian.xiaodong
 * email: willian12345@126.com
 * Date: 2013-08-22
 * It's belong to mango project
 * github: https://github.com/willian12345/mango/
 */
;+function (window) {
	if(!window.$) window.$ = {};
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
}(window);
