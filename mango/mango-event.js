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