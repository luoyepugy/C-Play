/*
 * Ext Core Library 3.0
 * http://extjs.com/
 * Copyright(c) 2006-2009, Ext JS, LLC.
 * 
 * MIT Licensed - http://extjs.com/license/mit.txt
 * 
 */


// for old browsers
window.undefined = window.undefined;



Ext = {
    
    version: '3.0'
};


Ext.apply = function(o, c, defaults){
    // no "this" reference for friendly out of scope calls
    if(defaults){
        Ext.apply(o, defaults);
    }
    if(o && c && typeof c == 'object'){
        for(var p in c){
            o[p] = c[p];
        }
    }
    return o;
};

(function(){
    var idSeed = 0,
        ua = navigator.userAgent.toLowerCase(),
        check = function(r){
            return r.test(ua);
        },
        isStrict = document.compatMode == "CSS1Compat",
        isOpera = check(/opera/),
        isChrome = check(/chrome/),
        isWebKit = check(/webkit/),
        isSafari = !isChrome && check(/safari/),
        isSafari3 = isSafari && check(/version\/3/),
        isSafari4 = isSafari && check(/version\/4/),
        isIE = !isOpera && check(/msie/),
        isIE7 = isIE && check(/msie 7/),
        isIE8 = isIE && check(/msie 8/),
        isIE6 = isIE && !isIE7 && !isIE8,
        isGecko = !isWebKit && check(/gecko/),
        isGecko3 = isGecko && check(/rv:1\.9/),
        isBorderBox = isIE && !isStrict,
        isWindows = check(/windows|win32/),
        isMac = check(/macintosh|mac os x/),
        isAir = check(/adobeair/),
        isLinux = check(/linux/),
        isSecure = /^https/i.test(window.location.protocol);

    // remove css image flicker
    if(isIE6){
        try{
            document.execCommand("BackgroundImageCache", false, true);
        }catch(e){}
    }

    Ext.apply(Ext, {
        
        isStrict : isStrict,
        
        isSecure : isSecure,
        
        isReady : false,

        

        
        enableGarbageCollector : true,

        
        enableListenerCollection : false,

        
        USE_NATIVE_JSON : false,

        
        applyIf : function(o, c){
            if(o){
                for(var p in c){
                    if(Ext.isEmpty(o[p])){ 
                        o[p] = c[p]; 
                    }
                }
            }
            return o;
        },

        
        id : function(el, prefix){
            return (el = Ext.getDom(el) || {}).id = el.id || (prefix || "ext-gen") + (++idSeed);
        },

        
        extend : function(){
            // inline overrides
            var io = function(o){
                for(var m in o){
                    this[m] = o[m];
                }
            };
            var oc = Object.prototype.constructor;

            return function(sb, sp, overrides){
                if(Ext.isObject(sp)){
                    overrides = sp;
                    sp = sb;
                    sb = overrides.constructor != oc ? overrides.constructor : function(){sp.apply(this, arguments);};
                }
                var F = function(){},
                    sbp,
                    spp = sp.prototype;

                F.prototype = spp;
                sbp = sb.prototype = new F();
                sbp.constructor=sb;
                sb.superclass=spp;
                if(spp.constructor == oc){
                    spp.constructor=sp;
                }
                sb.override = function(o){
                    Ext.override(sb, o);
                };
                sbp.superclass = sbp.supr = (function(){
                    return spp;
                });
                sbp.override = io;
                Ext.override(sb, overrides);
                sb.extend = function(o){Ext.extend(sb, o);};
                return sb;
            };
        }(),

        
        override : function(origclass, overrides){
            if(overrides){
                var p = origclass.prototype;
                Ext.apply(p, overrides);
                if(Ext.isIE && overrides.toString != origclass.toString){
                    p.toString = overrides.toString;
                }
            }
        },

        
        namespace : function(){
            var o, d;
            Ext.each(arguments, function(v) {
                d = v.split(".");
                o = window[d[0]] = window[d[0]] || {};
                Ext.each(d.slice(1), function(v2){
                    o = o[v2] = o[v2] || {};
                });
            });
            return o;
        },

        
        urlEncode: function(o, pre){
            var undef, buf = [], key, e = encodeURIComponent;

	        for(key in o){
	            undef = typeof o[key] == 'undefined';
	            Ext.each(undef ? key : o[key], function(val, i){
	                buf.push("&", e(key), "=", (val != key || !undef) ? e(val) : "");
	            });
	        }
	        if(!pre){
	            buf.shift();
	            pre = "";
	        }
	        return pre + buf.join('');
        },

        
        urlDecode : function(string, overwrite){
            var obj = {},
                pairs = string.split('&'),
                d = decodeURIComponent,
                name,
                value;
            Ext.each(pairs, function(pair) {
                pair = pair.split('=');
                name = d(pair[0]);
                value = d(pair[1]);
                obj[name] = overwrite || !obj[name] ? value :
                            [].concat(obj[name]).concat(value);
            });
            return obj;
        },

        
        toArray : function(){
            return isIE ?
                function(a, i, j, res){
                    res = [];
                    Ext.each(a, function(v) {
                        res.push(v);
                    });
                    return res.slice(i || 0, j || res.length);
                } :
                function(a, i, j){
                    return Array.prototype.slice.call(a, i || 0, j || a.length);
                }
        }(),

        
        each: function(array, fn, scope){
            if(Ext.isEmpty(array, true)){
                return;
            }
            if(typeof array.length == "undefined" || Ext.isPrimitive(array)){
                array = [array];
            }
            for(var i = 0, len = array.length; i < len; i++){
                if(fn.call(scope || array[i], array[i], i, array) === false){
                    return i;
                };
            }
        },

        
        getDom : function(el){
            if(!el || !document){
                return null;
            }
            return el.dom ? el.dom : (typeof el == 'string' ? document.getElementById(el) : el);
        },

        
        getBody : function(){
            return Ext.get(document.body || document.documentElement);
        },

        
        removeNode : isIE ? function(){
            var d;
            return function(n){
                if(n && n.tagName != 'BODY'){
                    d = d || document.createElement('div');
                    d.appendChild(n);
                    d.innerHTML = '';
                }
            }
        }() : function(n){
            if(n && n.parentNode && n.tagName != 'BODY'){
                n.parentNode.removeChild(n);
            }
        },

        
        isEmpty : function(v, allowBlank){
            return v === null || v === undefined || ((Ext.isArray(v) && !v.length)) || (!allowBlank ? v === '' : false);
        },

        
        isArray : function(v){
            return Object.prototype.toString.apply(v) === '[object Array]';
        },

        
        isObject : function(v){
            return v && typeof v == "object";
        },

        
        isPrimitive : function(v){
            var t = typeof v;
            return t == 'string' || t == 'number' || t == 'boolean';
        },

        
        isFunction : function(v){
            return typeof v == "function";
        },

        
        isOpera : isOpera,
        
        isWebKit: isWebKit,
        
        isChrome : isChrome,
        
        isSafari : isSafari,
        
        isSafari3 : isSafari3,
        
        isSafari4 : isSafari4,
        
        isSafari2 : isSafari && !(isSafari3 || isSafari4),
        
        isIE : isIE,
        
        isIE6 : isIE6,
        
        isIE7 : isIE7,
        
        isIE8 : isIE8,
        
        isGecko : isGecko,
        
        isGecko2 : isGecko && !isGecko3,
        
        isGecko3 : isGecko3,
        
        isBorderBox : isBorderBox,
        
        isLinux : isLinux,
        
        isWindows : isWindows,
        
        isMac : isMac,
        
        isAir : isAir
    });

    
    Ext.ns = Ext.namespace;
})();

Ext.ns("Ext", "Ext.util", "Ext.lib", "Ext.data");



Ext.apply(Function.prototype, {
     
    createInterceptor : function(fcn, scope){
        var method = this;
        return !Ext.isFunction(fcn) ?
                this :
                function() {
                    var me = this,
                        args = arguments;
                    fcn.target = me;
                    fcn.method = method;
                    return (fcn.apply(scope || me || window, args) !== false) ?
                            method.apply(me || window, args) :
                            null;
                };
    },

     
    createCallback : function(){
        // make args available, in function below
        var args = arguments,
            method = this;
        return function() {
            return method.apply(window, args);
        };
    },

    
    createDelegate : function(obj, args, appendArgs){
        var method = this;
        return function() {
            var callArgs = args || arguments;
            if (appendArgs === true){
                callArgs = Array.prototype.slice.call(arguments, 0);
                callArgs = callArgs.concat(args);
            }else if (typeof appendArgs == "number"){
                callArgs = Array.prototype.slice.call(arguments, 0); // copy arguments first
                var applyArgs = [appendArgs, 0].concat(args); // create method call params
                Array.prototype.splice.apply(callArgs, applyArgs); // splice them in
            }
            return method.apply(obj || window, callArgs);
        };
    },

    
    defer : function(millis, obj, args, appendArgs){
        var fn = this.createDelegate(obj, args, appendArgs);
        if(millis > 0){
            return setTimeout(fn, millis);
        }
        fn();
        return 0;
    }
});


Ext.applyIf(String, {
    
    format : function(format){
        var args = Ext.toArray(arguments, 1);
        return format.replace(/\{(\d+)\}/g, function(m, i){
            return args[i];
        });
    }
});


Ext.applyIf(Array.prototype, {
    
    indexOf : function(o){
       for (var i = 0, len = this.length; i < len; i++){
           if(this[i] == o) return i;
       }
       return -1;
    },

    
    remove : function(o){
       var index = this.indexOf(o);
       if(index != -1){
           this.splice(index, 1);
       }
       return this;
    }
});


Ext.util.TaskRunner = function(interval){
    interval = interval || 10;
    var tasks = [], 
    	removeQueue = [],
    	id = 0,
    	running = false,

    	// private
    	stopThread = function(){
	        running = false;
	        clearInterval(id);
	        id = 0;
	    },

    	// private
    	startThread = function(){
	        if(!running){
	            running = true;
	            id = setInterval(runTasks, interval);
	        }
	    },

    	// private
    	removeTask = function(t){
	        removeQueue.push(t);
	        if(t.onStop){
	            t.onStop.apply(t.scope || t);
	        }
	    },
	    
    	// private
    	runTasks = function(){
	    	var rqLen = removeQueue.length,
	    		now = new Date().getTime();	    			    		
	    
	        if(rqLen > 0){
	            for(var i = 0; i < rqLen; i++){
	                tasks.remove(removeQueue[i]);
	            }
	            removeQueue = [];
	            if(tasks.length < 1){
	                stopThread();
	                return;
	            }
	        }	        
	        for(var i = 0, t, itime, rt, len = tasks.length; i < len; ++i){
	            t = tasks[i];
	            itime = now - t.taskRunTime;
	            if(t.interval <= itime){
	                rt = t.run.apply(t.scope || t, t.args || [++t.taskRunCount]);
	                t.taskRunTime = now;
	                if(rt === false || t.taskRunCount === t.repeat){
	                    removeTask(t);
	                    return;
	                }
	            }
	            if(t.duration && t.duration <= (now - t.taskStartTime)){
	                removeTask(t);
	            }
	        }
	    };

    
    this.start = function(task){
        tasks.push(task);
        task.taskStartTime = new Date().getTime();
        task.taskRunTime = 0;
        task.taskRunCount = 0;
        startThread();
        return task;
    };

    
    this.stop = function(task){
        removeTask(task);
        return task;
    };

    
    this.stopAll = function(){
        stopThread();
        for(var i = 0, len = tasks.length; i < len; i++){
            if(tasks[i].onStop){
                tasks[i].onStop();
            }
        }
        tasks = [];
        removeQueue = [];
    };
};


Ext.TaskMgr = new Ext.util.TaskRunner();
(function(){
	var libFlyweight;
	
	function fly(el) {
        if (!libFlyweight) {
            libFlyweight = new Ext.Element.Flyweight();
        }
        libFlyweight.dom = el;
        return libFlyweight;
    }
    
    
(function(){
	var doc = document,
		isCSS1 = doc.compatMode == "CSS1Compat",
		MAX = Math.max,		
		PARSEINT = parseInt;
		
	Ext.lib.Dom = {
	    isAncestor : function(p, c) {
		    var ret = false;
			
			p = Ext.getDom(p);
			c = Ext.getDom(c);
			if (p && c) {
				if (p.contains) {
					return p.contains(c);
				} else if (p.compareDocumentPosition) {
					return !!(p.compareDocumentPosition(c) & 16);
				} else {
					while (c = c.parentNode) {
						ret = c == p || ret;	        			
					}
				}	            
			}	
			return ret;
		},
		
        getViewWidth : function(full) {
            return full ? this.getDocumentWidth() : this.getViewportWidth();
        },

        getViewHeight : function(full) {
            return full ? this.getDocumentHeight() : this.getViewportHeight();
        },

        getDocumentHeight: function() {            
            return MAX(!isCSS1 ? doc.body.scrollHeight : doc.documentElement.scrollHeight, this.getViewportHeight());
        },

        getDocumentWidth: function() {            
            return MAX(!isCSS1 ? doc.body.scrollWidth : doc.documentElement.scrollWidth, this.getViewportWidth());
        },

        getViewportHeight: function(){
	        return Ext.isIE ? 
	        	   (Ext.isStrict ? doc.documentElement.clientHeight : doc.body.clientHeight) :
	        	   self.innerHeight;
        },

        getViewportWidth : function() {
	        return !Ext.isStrict && !Ext.isOpera ? doc.body.clientWidth :
	        	   Ext.isIE ? doc.documentElement.clientWidth : self.innerWidth;
        },
        
        getY : function(el) {
            return this.getXY(el)[1];
        },

        getX : function(el) {
            return this.getXY(el)[0];
        },

        getXY : function(el) {
            var p, 
            	pe, 
            	b,
            	bt, 
            	bl,     
            	dbd,       	
            	x = 0,
            	y = 0, 
            	scroll,
            	hasAbsolute, 
            	bd = (doc.body || doc.documentElement),
            	ret = [0,0];
            	
            el = Ext.getDom(el);

            if(el != bd){
	            if (el.getBoundingClientRect) {
	                b = el.getBoundingClientRect();
	                scroll = fly(document).getScroll();
	                ret = [b.left + scroll.left, b.top + scroll.top];
	            } else {  
		            p = el;		
		            hasAbsolute = fly(el).isStyle("position", "absolute");
		
		            while (p) {
			            pe = fly(p);		
		                x += p.offsetLeft;
		                y += p.offsetTop;
		
		                hasAbsolute = hasAbsolute || pe.isStyle("position", "absolute");
		                		
		                if (Ext.isGecko) {		                    
		                    y += bt = PARSEINT(pe.getStyle("borderTopWidth"), 10) || 0;
		                    x += bl = PARSEINT(pe.getStyle("borderLeftWidth"), 10) || 0;	
		
		                    if (p != el && !pe.isStyle('overflow','visible')) {
		                        x += bl;
		                        y += bt;
		                    }
		                }
		                p = p.offsetParent;
		            }
		
		            if (Ext.isSafari && hasAbsolute) {
		                x -= bd.offsetLeft;
		                y -= bd.offsetTop;
		            }
		
		            if (Ext.isGecko && !hasAbsolute) {
		                dbd = fly(bd);
		                x += PARSEINT(dbd.getStyle("borderLeftWidth"), 10) || 0;
		                y += PARSEINT(dbd.getStyle("borderTopWidth"), 10) || 0;
		            }
		
		            p = el.parentNode;
		            while (p && p != bd) {
		                if (!Ext.isOpera || (p.tagName != 'TR' && !fly(p).isStyle("display", "inline"))) {
		                    x -= p.scrollLeft;
		                    y -= p.scrollTop;
		                }
		                p = p.parentNode;
		            }
		            ret = [x,y];
	            }
         	}
            return ret
        },

        setXY : function(el, xy) {
            (el = Ext.fly(el, '_setXY')).position();
            
            var pts = el.translatePoints(xy),
            	style = el.dom.style,
            	pos;            	
            
            for (pos in pts) {	            
	            if(!isNaN(pts[pos])) style[pos] = pts[pos] + "px"
            }
        },

        setX : function(el, x) {
            this.setXY(el, [x, false]);
        },

        setY : function(el, y) {
            this.setXY(el, [false, y]);
        }
    };
})();
Ext.lib.Event = function() {
    var loadComplete = false,
    	listeners = [],
    	unloadListeners = [],
    	retryCount = 0,
    	onAvailStack = [],
    	_interval,
    	locked = false,
    	win = window,
    	doc = document,
    	
    	// constants        	
    	POLL_RETRYS = 200,
        POLL_INTERVAL = 20,
        EL = 0,
        TYPE = 1,
        FN = 2,
        WFN = 3,
        OBJ = 3,
        ADJ_SCOPE = 4,            
        // private
        doAdd = function() {
            var ret;
            if (win.addEventListener) {
                ret = function(el, eventName, fn, capture) {
                    if (eventName == 'mouseenter') {
                        fn = fn.createInterceptor(checkRelatedTarget);
                        el.addEventListener('mouseover', fn, (capture));
                    } else if (eventName == 'mouseleave') {
                        fn = fn.createInterceptor(checkRelatedTarget);
                        el.addEventListener('mouseout', fn, (capture));
                    } else {
                        el.addEventListener(eventName, fn, (capture));
                    }
                    return fn;
                };
            } else if (win.attachEvent) {
                ret = function(el, eventName, fn, capture) {
                    el.attachEvent("on" + eventName, fn);
                    return fn;
                };
            } else {
                ret = function(){};
            }
            return ret;
        }(),	
		// private
        doRemove = function(){
            var ret;
            if (win.removeEventListener) {
                ret = function (el, eventName, fn, capture) {
                    if (eventName == 'mouseenter') {
                        eventName = 'mouseover'
                    } else if (eventName == 'mouseleave') {
                        eventName = 'mouseout'
                    }                        
                    el.removeEventListener(eventName, fn, (capture));
                };
            } else if (win.detachEvent) {
                ret = function (el, eventName, fn) {
                    el.detachEvent("on" + eventName, fn);
                };
            } else {
                ret = function(){};
            }
            return ret;
        }();        

    var isXUL = Ext.isGecko ? function(node){ 
        return Object.prototype.toString.call(node) == '[object XULElement]';
    } : function(){};
        
    var isTextNode = Ext.isGecko ? function(node){
        try{
            return node.nodeType == 3;
        }catch(e) {
            return false;
        }

    } : function(node){
        return node.nodeType == 3;
    };
        
    function checkRelatedTarget(e) {
        var related = pub.getRelatedTarget(e);
        return !(isXUL(related) || elContains(e.currentTarget,related));
    }

    function elContains(parent, child) {
       if(parent && parent.firstChild){  
         while(child) {
            if(child === parent) {
                return true;
            }
            try {
                child = child.parentNode;
            } catch(e) {
                // In FF if you mouseout an text input element
                // thats inside a div sometimes it randomly throws
                // Permission denied to get property HTMLDivElement.parentNode
                // See https://bugzilla.mozilla.org/show_bug.cgi?id=208427
                
                return false;
            }                
            if(child && (child.nodeType != 1)) {
                child = null;
            }
          }
        }
        return false;
    }

     	
    // private	
    function _getCacheIndex(el, eventName, fn) {
        var index = -1;
        Ext.each(listeners, function (v,i) {
            if(v && v[FN] == fn && v[EL] == el && v[TYPE] == eventName) {
	            index = i;
            }
        });
        return index;
    }
                	
	// private
    function _tryPreloadAttach() {
        var ret = false,            	
        	notAvail = [],
            element,
        	tryAgain = !loadComplete || (retryCount > 0);	                	
        
        if (!locked) {
            locked = true;
            
            Ext.each(onAvailStack, function (v,i,a){
            	if(v && (element = doc.getElementById(v.id))){
	            	if(!v.checkReady || loadComplete || element.nextSibling || (doc && doc.body)) {
		            	element = v.override ? (v.override === true ? v.obj : v.override) : element;
		            	v.fn.call(element, v.obj);
		            	onAvailStack[i] = null;
	            	} else {
		            	notAvail.push(item);
	            	}
            	}	
            });

            retryCount = (notAvail.length == 0) ? 0 : retryCount - 1;

            if (tryAgain) {	
                startInterval();
            } else {
                clearInterval(_interval);
                _interval = null;
            }

            ret = !(locked = false);
		}
		return ret;
    }
    
    // private	        	
	function startInterval() {            
        if(!_interval){                    
            var callback = function() {
                _tryPreloadAttach();
            };
            _interval = setInterval(callback, POLL_INTERVAL);
        }
    }
    
    // private 
    function getScroll() {
        var scroll = Ext.fly(doc).getScroll();
        return [scroll.top, scroll.top];
    }
        
    // private
    function getPageCoord (ev, xy) {
        ev = ev.browserEvent || ev;
        var coord  = ev['page' + xy];
        if (!coord && 0 != coord) {
            coord = ev['client' + xy] || 0;

            if (Ext.isIE) {
                coord += getScroll()[xy == "X" ? 0 : 1];
            }
        }

        return coord;
    }

    var pub =  {
        onAvailable : function(p_id, p_fn, p_obj, p_override) {	            
            onAvailStack.push({ 
                id:         p_id,
                fn:         p_fn,
                obj:        p_obj,
                override:   p_override,
                checkReady: false });

            retryCount = POLL_RETRYS;
            startInterval();
        },


        addListener: function(el, eventName, fn) {
			var ret;				
			el = Ext.getDom(el);				
			if (el && fn) {
				if ("unload" == eventName) {
				    ret = !!(unloadListeners[unloadListeners.length] = [el, eventName, fn]);					
				} else {
                    listeners.push([el, eventName, fn, ret = doAdd(el, eventName, fn, false)]);
				}
			}
			return !!ret;
        },

        removeListener: function(el, eventName, fn) {
            var ret = false,
            	index, 
            	cacheItem;

            el = Ext.getDom(el);

            if(!fn) { 	                
                ret = this.purgeElement(el, false, eventName);
            } else if ("unload" == eventName) {	
                Ext.each(unloadListeners, function(v, i, a) {
	                if( v && v[0] == el && v[1] == eventName && v[2] == fn) {
		                unloadListeners.splice(i, 1);
	                	ret = true;
                	}
                });
            } else {	
                index = arguments[3] || _getCacheIndex(el, eventName, fn);
                cacheItem = listeners[index];
                
                if (el && cacheItem) {
	                doRemove(el, eventName, cacheItem[WFN], false);		
	                cacheItem[WFN] = cacheItem[FN] = null;		                 
	                listeners.splice(index, 1);		
	                ret = true;
                }
            }
            return ret;
        },

        getTarget : function(ev) {
            ev = ev.browserEvent || ev;                
            return this.resolveTextNode(ev.target || ev.srcElement);
        },

        resolveTextNode : function(node) {
            return node && !isXUL(node) && isTextNode(node) ? node.parentNode : node;
        },

        getRelatedTarget : function(ev) {
            ev = ev.browserEvent || ev;
            return this.resolveTextNode(ev.relatedTarget || 
				    (ev.type == "mouseout" ? ev.toElement :
				     ev.type == "mouseover" ? ev.fromElement : null));
        },
        
        getPageX : function(ev) {
            return getPageCoord(ev, "X");
        },

        getPageY : function(ev) {
            return getPageCoord(ev, "Y");
        },


        getXY : function(ev) {	                           
            return [this.getPageX(ev), this.getPageY(ev)];
        },

// Is this useful?  Removing to save space unless use case exists.
//             getTime: function(ev) {
//                 ev = ev.browserEvent || ev;
//                 if (!ev.time) {
//                     var t = new Date().getTime();
//                     try {
//                         ev.time = t;
//                     } catch(ex) {
//                         return t;
//                     }
//                 }

//                 return ev.time;
//             },

        stopEvent : function(ev) {		                      
            this.stopPropagation(ev);
            this.preventDefault(ev);
        },

        stopPropagation : function(ev) {
            ev = ev.browserEvent || ev;
            if (ev.stopPropagation) {
                ev.stopPropagation();
            } else {
                ev.cancelBubble = true;
            }
        },

        preventDefault : function(ev) {
            ev = ev.browserEvent || ev;
            if (ev.preventDefault) {
                ev.preventDefault();
            } else {
                ev.returnValue = false;
            }
        },
        
        getEvent : function(e) {
            e = e || win.event;
            if (!e) {
                var c = this.getEvent.caller;
                while (c) {
                    e = c.arguments[0];
                    if (e && Event == e.constructor) {
                        break;
                    }
                    c = c.caller;
                }
            }
            return e;
        },

        getCharCode : function(ev) {
            ev = ev.browserEvent || ev;
            return ev.charCode || ev.keyCode || 0;
        },

        //clearCache: function() {},

        _load : function(e) {
            loadComplete = true;
            var EU = Ext.lib.Event;    
            if (Ext.isIE && e !== true) {
		// IE8 complains that _load is null or not an object
		// so lets remove self via arguments.callee
                doRemove(win, "load", arguments.callee);
            }
        },            
        
        purgeElement : function(el, recurse, eventName) {
			var me = this;
			Ext.each( me.getListeners(el, eventName), function(v){
				if(v) me.removeListener(el, v.type, v.fn);
			});

            if (recurse && el && el.childNodes) {
                Ext.each(el.childNodes, function(v){
	                me.purgeElement(v, recurse, eventName);
                });
            }
        },

        getListeners : function(el, eventName) {
            var me = this,
            	results = [], 
            	searchLists;

			if (eventName){  
                searchLists = eventName == 'unload' ? unloadListeners : listeners;
            }else{
                searchLists = listeners.concat(unloadListeners);
            }

			Ext.each(searchLists, function(v, i){
				if (v && v[EL] == el && (!eventName || eventName == v[TYPE])) {
					results.push({
                                type:   v[TYPE],
                                fn:     v[FN],
                                obj:    v[OBJ],
                                adjust: v[ADJ_SCOPE],
                                index:  i
                            });
				}	
			});                

            return results.length ? results : null;
        },

        _unload : function(e) {
             var EU = Ext.lib.Event, 
            	i, 
            	j, 
            	l, 
            	len, 
            	index,
            	scope;
            	

			Ext.each(unloadListeners, function(v) {
				if (v) {
                    try{
					    scope =  v[ADJ_SCOPE] ? (v[ADJ_SCOPE] === true ? v[OBJ] : v[ADJ_SCOPE]) :  win;	
					    v[FN].call(scope, EU.getEvent(e), v[OBJ]);
                    }catch(e){}
				}	
			});		

            unloadListeners = null;

            if (listeners && (j = listeners.length)) {                    
                while (j) {                        
                    if (l = listeners[index = --j]) {
                        EU.removeListener(l[EL], l[TYPE], l[FN], index);
                    }                        
                }
                //EU.clearCache();
            }

            doRemove(win, "unload", EU._unload);
        }            
    };        
    
    // Initialize stuff.
    pub.on = pub.addListener;
    pub.un = pub.removeListener;
    if (doc && doc.body) {
        pub._load(true);
    } else {
        doAdd(win, "load", pub._load);
    }
    doAdd(win, "unload", pub._unload);    
    _tryPreloadAttach();
    
    return pub;
}();

    Ext.lib.Ajax = function() {	    
	    var activeX = ['MSXML2.XMLHTTP.3.0',
			           'MSXML2.XMLHTTP',
			           'Microsoft.XMLHTTP'];
			           
		// private
		function setHeader(o) {
	        var conn = o.conn,
	        	prop;
	        
	        function setTheHeaders(conn, headers){
		     	for (prop in headers) {
                    if (headers.hasOwnProperty(prop)) {
                        conn.setRequestHeader(prop, headers[prop]);
                    }
                }   
	        }		
	        
            if (pub.defaultHeaders) {
	            setTheHeaders(conn, pub.defaultHeaders);
            }

            if (pub.headers) {
				setTheHeaders(conn, pub.headers);
                pub.headers = null;                
            }
        }    
        
        // private
        function createExceptionObject(tId, callbackArg, isAbort, isTimeout) {	        
            return {
	            tId : tId,
	            status : isAbort ? -1 : 0,
	            statusText : isAbort ? 'transaction aborted' : 'communication failure',
                    isAbort: true,
                    isTimeout: true,
	            argument : callbackArg
            };
        }  
        
        // private 
        function initHeader(label, value) {         
			(pub.headers = pub.headers || {})[label] = value;			            
        }
	    
        // private
        function createResponseObject(o, callbackArg) {
            var headerObj = {},
            	headerStr,            	
            	conn = o.conn;            	

            try {
                headerStr = o.conn.getAllResponseHeaders();                
                Ext.each(headerStr.split('\n'), function(v){
	            	var t = v.indexOf(':');
                    headerObj[v.substr(0, t)] = v.substr(t + 1);
                });
            } catch(e) {}
                        
            return {
		        tId : o.tId,
	            status : conn.status,
	            statusText : conn.statusText,
	            getResponseHeader : function(header){return headerObj[header];},
                getAllResponseHeaders : function(){return headerStr},
	            responseText : conn.responseText,
	            responseXML : conn.responseXML,
	            argument : callbackArg
        	};
        }
        
        // private
        function releaseObject(o) {
            o.conn = null;
            o = null;
        }        
	    
        // private
        function handleTransactionResponse(o, callback, isAbort, isTimeout) {
            if (!callback) {
                releaseObject(o);
                return;
            }

            var httpStatus, responseObject;

            try {
                if (o.conn.status !== undefined && o.conn.status != 0) {
                    httpStatus = o.conn.status;
                }
                else {
                    httpStatus = 13030;
                }
            }
            catch(e) {
                httpStatus = 13030;
            }

            if ((httpStatus >= 200 && httpStatus < 300) || (Ext.isIE && httpStatus == 1223)) {
                responseObject = createResponseObject(o, callback.argument);
                if (callback.success) {
                    if (!callback.scope) {
                        callback.success(responseObject);
                    }
                    else {
                        callback.success.apply(callback.scope, [responseObject]);
                    }
                }
            }
            else {
                switch (httpStatus) {
                    case 12002:
                    case 12029:
                    case 12030:
                    case 12031:
                    case 12152:
                    case 13030:
                        responseObject = createExceptionObject(o.tId, callback.argument, (isAbort ? isAbort : false), isTimeout);
                        if (callback.failure) {
                            if (!callback.scope) {
                                callback.failure(responseObject);
                            }
                            else {
                                callback.failure.apply(callback.scope, [responseObject]);
                            }
                        }
                        break;
                    default:
                        responseObject = createResponseObject(o, callback.argument);
                        if (callback.failure) {
                            if (!callback.scope) {
                                callback.failure(responseObject);
                            }
                            else {
                                callback.failure.apply(callback.scope, [responseObject]);
                            }
                        }
                }
            }

            releaseObject(o);
            responseObject = null;
        }  
        
        // private
        function handleReadyState(o, callback){
	    callback = callback || {};
            var conn = o.conn,
            	tId = o.tId,
            	poll = pub.poll,
		cbTimeout = callback.timeout || null;

            if (cbTimeout) {
                pub.timeout[tId] = setTimeout(function() {
                    pub.abort(o, callback, true);
                }, cbTimeout);
            }

            poll[tId] = setInterval(
                function() {
                    if (conn && conn.readyState == 4) {
                        clearInterval(poll[tId]);
                        poll[tId] = null;

                        if (cbTimeout) {
                            clearTimeout(pub.timeout[tId]);
                            pub.timeout[tId] = null;
                        }

                        handleTransactionResponse(o, callback);
                    }
                },
                pub.pollInterval);
        }
        
        // private
        function asyncRequest(method, uri, callback, postData) {
            var o = getConnectionObject() || null;

            if (o) {
                o.conn.open(method, uri, true);

                if (pub.useDefaultXhrHeader) {                    
                	initHeader('X-Requested-With', pub.defaultXhrHeader);
                }

                if(postData && pub.useDefaultHeader && (!pub.headers || !pub.headers['Content-Type'])){
                    initHeader('Content-Type', pub.defaultPostHeader);
                }

                if (pub.defaultHeaders || pub.headers) {
                    setHeader(o);
                }

                handleReadyState(o, callback);
                o.conn.send(postData || null);
            }
            return o;
        }
        
        // private
        function getConnectionObject() {
            var o;      	

            try {
                if (o = createXhrObject(pub.transactionId)) {
                    pub.transactionId++;
                }
            } catch(e) {
            } finally {
                return o;
            }
        }
	       
        // private
        function createXhrObject(transactionId) {
            var http;
            	
            try {
                http = new XMLHttpRequest();                
            } catch(e) {
                for (var i = 0; i < activeX.length; ++i) {	            
                    try {
                        http = new ActiveXObject(activeX[i]);                        
                        break;
                    } catch(e) {}
                }
            } finally {
                return {conn : http, tId : transactionId};
            }
        }
	         
	    var pub = {
	        request : function(method, uri, cb, data, options) {
			    if(options){
			        var me = this,		        
			        	xmlData = options.xmlData,
			        	jsonData = options.jsonData;
			        	
			        Ext.applyIf(me, options);	        
		            
		            if(xmlData || jsonData){
			            initHeader('Content-Type', xmlData ? 'text/xml' : 'application/json');
			            data = xmlData || (Ext.isObject(jsonData) ? Ext.encode(jsonData) : jsonData);
			        }
			    }		    		    
			    return asyncRequest(method || options.method || "POST", uri, cb, data);
	        },
	
	        serializeForm : function(form) {
		        var fElements = form.elements || (document.forms[form] || Ext.getDom(form)).elements,
	            	hasSubmit = false,
	            	encoder = encodeURIComponent,
		        	element,
	            	options, 
	            	name, 
	            	val,             	
	            	data = '',
	            	type;
	            	
		        Ext.each(fElements, function(element) {		            
	                name = element.name;	             
					type = element.type;
					
	                if (!element.disabled && name){
		                if(/select-(one|multiple)/i.test(type)){			                
				            Ext.each(element.options, function(opt) {
					            if (opt.selected) {
						            data += String.format("{0}={1}&", 						            					  
						            					 encoder(name),						            					 
						            					  (opt.hasAttribute ? opt.hasAttribute('value') : opt.getAttribute('value') !== null) ? encoder(opt.value) : encoder(opt.text));
                                }								
                            });
		                } else if(!/file|undefined|reset|button/i.test(type)) {
			                if(!(/radio|checkbox/i.test(type) && !element.checked) && !(type == 'submit' && hasSubmit)){
                                    
                                data += encoder(name) + '=' + encoder(element.value) + '&';                     
                                hasSubmit = /submit/i.test(type);    
                            } 		                
		                } 
	                }
	            });
	            return data.substr(0, data.length - 1);
	        },
	        
	        useDefaultHeader : true,
	        defaultPostHeader : 'application/x-www-form-urlencoded; charset=UTF-8',
	        useDefaultXhrHeader : true,
	        defaultXhrHeader : 'XMLHttpRequest',        
	        poll : {},
	        timeout : {},
	        pollInterval : 50,
	        transactionId : 0,
	        
//	This is never called - Is it worth exposing this?  		        
// 	        setProgId : function(id) {
// 	            activeX.unshift(id);
// 	        },

//	This is never called - Is it worth exposing this?  	
// 	        setDefaultPostHeader : function(b) {
// 	            this.useDefaultHeader = b;
// 	        },
	        
//	This is never called - Is it worth exposing this?  	
// 	        setDefaultXhrHeader : function(b) {
// 	            this.useDefaultXhrHeader = b;
// 	        },

//	This is never called - Is it worth exposing this?        	
// 	        setPollingInterval : function(i) {
// 	            if (typeof i == 'number' && isFinite(i)) {
// 	                this.pollInterval = i;
// 	            }
// 	        },
	        
//	This is never called - Is it worth exposing this?
// 	        resetDefaultHeaders : function() {
// 	            this.defaultHeaders = null;
// 	        },
	
	        abort : function(o, callback, isTimeout) {
		        var me = this,
		        	tId = o.tId,
		        	isAbort = false;
		        
	            if (me.isCallInProgress(o)) {
	                o.conn.abort();
	                clearInterval(me.poll[tId]);
	               	me.poll[tId] = null;
	                if (isTimeout) {
	                    me.timeout[tId] = null;
	                }
					
	                handleTransactionResponse(o, callback, (isAbort = true), isTimeout);                
	            }
	            return isAbort;
	        },
	
	        isCallInProgress : function(o) {
	            // if there is a connection and readyState is not 0 or 4
	            return o.conn && !{0:true,4:true}[o.conn.readyState];	        
	        }
	    };
	    return pub;
    }();
(function(){    
    var EXTLIB = Ext.lib,
        noNegatives = /width|height|opacity|padding/i,
        offsetAttribute = /^((width|height)|(top|left))$/,
        defaultUnit = /width|height|top$|bottom$|left$|right$/i,
        offsetUnit =  /\d+(em|%|en|ex|pt|in|cm|mm|pc)$/i,
        isset = function(v){
            return typeof v !== 'undefined';
        },
        now = function(){
            return new Date();    
        };
        
    EXTLIB.Anim = {
        motion : function(el, args, duration, easing, cb, scope) {
            return this.run(el, args, duration, easing, cb, scope, Ext.lib.Motion);
        },

        run : function(el, args, duration, easing, cb, scope, type) {
            type = type || Ext.lib.AnimBase;
            if (typeof easing == "string") {
                easing = Ext.lib.Easing[easing];
            }
            var anim = new type(el, args, duration, easing);
            anim.animateX(function() {
                if(Ext.isFunction(cb)){
                    cb.call(scope);
                }
            });
            return anim;
        }
    };
    
    EXTLIB.AnimBase = function(el, attributes, duration, method) {
        if (el) {
            this.init(el, attributes, duration, method);
        }
    };

    EXTLIB.AnimBase.prototype = {
        doMethod: function(attr, start, end) {
            var me = this;
            return me.method(me.curFrame, start, end - start, me.totalFrames);
        },


        setAttr: function(attr, val, unit) {
            if (noNegatives.test(attr) && val < 0) {
                val = 0;
            }
            Ext.fly(this.el, '_anim').setStyle(attr, val + unit);
        },


        getAttr: function(attr) {
            var el = Ext.fly(this.el),
                val = el.getStyle(attr),
                a = offsetAttribute.exec(attr) || []

            if (val !== 'auto' && !offsetUnit.test(val)) {
                return parseFloat(val);
            }

            return (!!(a[2]) || (el.getStyle('position') == 'absolute' && !!(a[3]))) ? el.dom['offset' + a[0].charAt(0).toUpperCase() + a[0].substr(1)] : 0;
        },


        getDefaultUnit: function(attr) {
            return defaultUnit.test(attr) ? 'px' : '';
        },

        animateX : function(callback, scope) {
            var me = this,
                f = function() {
                me.onComplete.removeListener(f);
                if (Ext.isFunction(callback)) {
                    callback.call(scope || me, me);
                }
            };
            me.onComplete.addListener(f, me);
            me.animate();
        },


        setRunAttr: function(attr) {            
            var me = this,
                a = this.attributes[attr],
                to = a.to,
                by = a.by,
                from = a.from,
                unit = a.unit,
                ra = (this.runAttrs[attr] = {}),
                end;

            if (!isset(to) && !isset(by)){
                return false;
            }

            var start = isset(from) ? from : me.getAttr(attr);
            if (isset(to)) {
                end = to;
            }else if(isset(by)) {
                if (Ext.isArray(start)){
                    end = [];
                    Ext.each(start, function(v, i){
                        end[i] = v + by[i];
                    });
                }else{
                    end = start + by;
                }
            }

            Ext.apply(ra, {
                start: start,
                end: end,
                unit: isset(unit) ? unit : me.getDefaultUnit(attr)
            });
        },


        init: function(el, attributes, duration, method) {
            var me = this,
                actualFrames = 0,
                mgr = EXTLIB.AnimMgr;
                
            Ext.apply(me, {
                isAnimated: false,
                startTime: null,
                el: Ext.getDom(el),
                attributes: attributes || {},
                duration: duration || 1,
                method: method || EXTLIB.Easing.easeNone,
                useSec: true,
                curFrame: 0,
                totalFrames: mgr.fps,
                runAttrs: {},
                animate: function(){
                    var me = this,
                        d = me.duration;
                    
                    if(me.isAnimated){
                        return false;
                    }

                    me.curFrame = 0;
                    me.totalFrames = me.useSec ? Math.ceil(mgr.fps * d) : d;
                    mgr.registerElement(me); 
                },
                
                stop: function(finish){
                    var me = this;
                
                    if(finish){
                        me.curFrame = me.totalFrames;
                        me._onTween.fire();
                    }
                    mgr.stop(me);
                }
            });

            var onStart = function(){
                var me = this,
                    attr;
                
                me.onStart.fire();
                me.runAttrs = {};
                for(attr in this.attributes){
                    this.setRunAttr(attr);
                }

                me.isAnimated = true;
                me.startTime = now();
                actualFrames = 0;
            };


            var onTween = function(){
                var me = this;

                me.onTween.fire({
                    duration: now() - me.startTime,
                    curFrame: me.curFrame
                });

                var ra = me.runAttrs;
                for (var attr in ra) {
                    this.setAttr(attr, me.doMethod(attr, ra[attr].start, ra[attr].end), ra[attr].unit);
                }

                ++actualFrames;
            };

            var onComplete = function() {
                var me = this,
                    actual = (now() - me.startTime) / 1000,
                    data = {
                        duration: actual,
                        frames: actualFrames,
                        fps: actualFrames / actual
                    };

                me.isAnimated = false;
                actualFrames = 0;
                me.onComplete.fire(data);
            };

            me.onStart = new Ext.util.Event(me);
            me.onTween = new Ext.util.Event(me);            
            me.onComplete = new Ext.util.Event(me);
            (me._onStart = new Ext.util.Event(me)).addListener(onStart);
            (me._onTween = new Ext.util.Event(me)).addListener(onTween);
            (me._onComplete = new Ext.util.Event(me)).addListener(onComplete); 
        }
    };


    Ext.lib.AnimMgr = new function() {
        var me = this,
            thread = null,
            queue = [],
            tweenCount = 0;


        Ext.apply(me, {
            fps: 1000,
            delay: 1,
            registerElement: function(tween){
                queue.push(tween);
                ++tweenCount;
                tween._onStart.fire();
                me.start();
            },
            
            unRegister: function(tween, index){
                tween._onComplete.fire();
                index = index || getIndex(tween);
                if (index != -1) {
                    queue.splice(index, 1);
                }

                if (--tweenCount <= 0) {
                    me.stop();
                }
            },
            
            start: function(){
                if(thread === null){
                    thread = setInterval(me.run, me.delay);
                }
            },
            
            stop: function(tween){
                if(!tween){
                    clearInterval(thread);
                    for(var i = 0, len = queue.length; i < len; ++i){
                        if(queue[0].isAnimated){
                            me.unRegister(queue[0], 0);
                        }
                    }

                    queue = [];
                    thread = null;
                    tweenCount = 0;
                }else{
                    me.unRegister(tween);
                }
            },
            
            run: function(){
                var tf;
                Ext.each(queue, function(tween){
                    if(tween && tween.isAnimated){
                        tf = tween.totalFrames;
                        if(tween.curFrame < tf || tf === null){
                            ++tween.curFrame;
                            if(tween.useSec){
                                correctFrame(tween);
                            }
                            tween._onTween.fire();
                        }else{
                            me.stop(tween);
                        }
                    }
                }, me);
            }
        });

        var getIndex = function(anim) {
            var out = -1;
            Ext.each(queue, function(item, idx){
                if(item == anim){
                    out = idx;
                    return false;
                }
            });
            return out;
        };


        var correctFrame = function(tween) {
            var frames = tween.totalFrames,
                frame = tween.curFrame,
                duration = tween.duration,
                expected = (frame * duration * 1000 / frames),
                elapsed = (now() - tween.startTime),
                tweak = 0;

            if(elapsed < duration * 1000){
                tweak = Math.round((elapsed / expected - 1) * frame);
            }else{
                tweak = frames - (frame + 1);
            }
            if(tweak > 0 && isFinite(tweak)){
                if(tween.curFrame + tweak >= frames){
                    tweak = frames - (frame + 1);
                }
                tween.curFrame += tweak;
            }
        };
    };

    EXTLIB.Bezier = new function() {

        this.getPosition = function(points, t) {
            var n = points.length,
                tmp = [],
                c = 1 - t, 
                i,
                j;

            for (i = 0; i < n; ++i) {
                tmp[i] = [points[i][0], points[i][1]];
            }

            for (j = 1; j < n; ++j) {
                for (i = 0; i < n - j; ++i) {
                    tmp[i][0] = c * tmp[i][0] + t * tmp[parseInt(i + 1, 10)][0];
                    tmp[i][1] = c * tmp[i][1] + t * tmp[parseInt(i + 1, 10)][1];
                }
            }

            return [ tmp[0][0], tmp[0][1] ];

        };
    };


    EXTLIB.Easing = {
        easeNone: function (t, b, c, d) {
            return c * t / d + b;
        },


        easeIn: function (t, b, c, d) {
            return c * (t /= d) * t + b;
        },


        easeOut: function (t, b, c, d) {
            return -c * (t /= d) * (t - 2) + b;
        }
    };

    (function() {
        EXTLIB.Motion = function(el, attributes, duration, method) {
            if (el) {
                EXTLIB.Motion.superclass.constructor.call(this, el, attributes, duration, method);
            }
        };

        Ext.extend(EXTLIB.Motion, Ext.lib.AnimBase);

        var superclass = EXTLIB.Motion.superclass,
            proto = EXTLIB.Motion.prototype,
            pointsRe = /^points$/i;

        Ext.apply(EXTLIB.Motion.prototype, {
            setAttr: function(attr, val, unit){
                var me = this,
                    setAttr = superclass.setAttr;
                    
                if (pointsRe.test(attr)) {
                    unit = unit || 'px';
                    setAttr.call(me, 'left', val[0], unit);
                    setAttr.call(me, 'top', val[1], unit);
                } else {
                    setAttr.call(me, attr, val, unit);
                }
            },
            
            getAttr: function(attr){
                var me = this,
                    getAttr = superclass.getAttr;
                    
                return pointsRe.test(attr) ? [getAttr.call(me, 'left'), getAttr.call(me, 'top')] : getAttr.call(me, attr);
            },
            
            doMethod: function(attr, start, end){
                var me = this;
                
                return pointsRe.test(attr)
                        ? EXTLIB.Bezier.getPosition(me.runAttrs[attr], me.method(me.curFrame, 0, 100, me.totalFrames) / 100)
                        : superclass.doMethod.call(me, attr, start, end);
            },
            
            setRunAttr: function(attr){
                if(pointsRe.test(attr)){
                    
                    var me = this,
                        el = this.el,
                        points = this.attributes.points,
                        control = points.control || [],
                        from = points.from,
                        to = points.to,
                        by = points.by,
                        DOM = EXTLIB.Dom,
                        start,
                        i,
                        end,
                        len,
                        ra;
                  

                    if(control.length > 0 && !Ext.isArray(control[0])){
                        control = [control];
                    }else{
                        
                    }

                    Ext.fly(el, '_anim').position();
                    DOM.setXY(el, isset(from) ? from : DOM.getXY(el));
                    start = me.getAttr('points');


                    if(isset(to)){
                        end = translateValues.call(me, to, start);
                        for (i = 0,len = control.length; i < len; ++i) {
                            control[i] = translateValues.call(me, control[i], start);
                        }
                    } else if (isset(by)) {
                        end = [start[0] + by[0], start[1] + by[1]];

                        for (i = 0,len = control.length; i < len; ++i) {
                            control[i] = [ start[0] + control[i][0], start[1] + control[i][1] ];
                        }
                    }

                    ra = this.runAttrs[attr] = [start];
                    if (control.length > 0) {
                        ra = ra.concat(control);
                    }

                    ra[ra.length] = end;
                }else{
                    superclass.setRunAttr.call(this, attr);
                }
            }
        });

        var translateValues = function(val, start) {
            var pageXY = EXTLIB.Dom.getXY(this.el);
            return [val[0] - pageXY[0] + start[0], val[1] - pageXY[1] + start[1]];
        };
    })();
})();
// Easing functions
(function(){
	// shortcuts to aid compression
	var abs = Math.abs,
	 	pi = Math.PI,
	 	asin = Math.asin,
	 	pow = Math.pow,
	 	sin = Math.sin,
		EXTLIB = Ext.lib;
	 	
    Ext.apply(EXTLIB.Easing, {
        
        easeBoth: function (t, b, c, d) {
	        return ((t /= d / 2) < 1)  ?  c / 2 * t * t + b  :  -c / 2 * ((--t) * (t - 2) - 1) + b;               
        },
        
        easeInStrong: function (t, b, c, d) {
            return c * (t /= d) * t * t * t + b;
        },

        easeOutStrong: function (t, b, c, d) {
            return -c * ((t = t / d - 1) * t * t * t - 1) + b;
        },

        easeBothStrong: function (t, b, c, d) {
            return ((t /= d / 2) < 1)  ?  c / 2 * t * t * t * t + b  :  -c / 2 * ((t -= 2) * t * t * t - 2) + b;
        },

        elasticIn: function (t, b, c, d, a, p) {
	        if (t == 0 || (t /= d) == 1) {
                return t == 0 ? b : b + c;
            }	            
            p = p || (d * .3);	            

			var s;
			if (a >= abs(c)) {
				s = p / (2 * pi) * asin(c / a);
			} else {
				a = c;
				s = p / 4;
			}
	
            return -(a * pow(2, 10 * (t -= 1)) * sin((t * d - s) * (2 * pi) / p)) + b;
            	      
        }, 	
	
		elasticOut: function (t, b, c, d, a, p) {
	        if (t == 0 || (t /= d) == 1) {
                return t == 0 ? b : b + c;
            }	            
            p = p || (d * .3);	            

			var s;
			if (a >= abs(c)) {
				s = p / (2 * pi) * asin(c / a);
			} else {
				a = c;
				s = p / 4;
			}
	
            return a * pow(2, -10 * t) * sin((t * d - s) * (2 * pi) / p) + c + b;	 
        }, 	
	
        elasticBoth: function (t, b, c, d, a, p) {
            if (t == 0 || (t /= d / 2) == 2) {
                return t == 0 ? b : b + c;
            }		         	
	            
            p = p || (d * (.3 * 1.5)); 	            

            var s;
            if (a >= abs(c)) {
	            s = p / (2 * pi) * asin(c / a);
            } else {
	            a = c;
                s = p / 4;
            }

            return t < 1 ?
            	   	-.5 * (a * pow(2, 10 * (t -= 1)) * sin((t * d - s) * (2 * pi) / p)) + b :
                    a * pow(2, -10 * (t -= 1)) * sin((t * d - s) * (2 * pi) / p) * .5 + c + b;
        },

        backIn: function (t, b, c, d, s) {
            s = s ||  1.70158; 	            
            return c * (t /= d) * t * ((s + 1) * t - s) + b;
        },


        backOut: function (t, b, c, d, s) {
            if (!s) {
                s = 1.70158;
            }
            return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
        },


        backBoth: function (t, b, c, d, s) {
            s = s || 1.70158; 	            

            return ((t /= d / 2 ) < 1) ?
                    c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b : 	            
            		c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
        },


        bounceIn: function (t, b, c, d) {
            return c - EXTLIB.Easing.bounceOut(d - t, 0, c, d) + b;
        },


        bounceOut: function (t, b, c, d) {
        if ((t /= d) < (1 / 2.75)) {
                return c * (7.5625 * t * t) + b;
            } else if (t < (2 / 2.75)) {
                return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
            } else if (t < (2.5 / 2.75)) {
                return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
            }
            return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
        },


        bounceBoth: function (t, b, c, d) {
            return (t < d / 2) ?
                   EXTLIB.Easing.bounceIn(t * 2, 0, c, d) * .5 + b : 
            	   EXTLIB.Easing.bounceOut(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
        }
    });
})();

(function() {
    var EXTLIB = Ext.lib;
	// Color Animation
	EXTLIB.Anim.color = function(el, args, duration, easing, cb, scope) {
	    return EXTLIB.Anim.run(el, args, duration, easing, cb, scope, EXTLIB.ColorAnim);
	}
	
    EXTLIB.ColorAnim = function(el, attributes, duration, method) {
        EXTLIB.ColorAnim.superclass.constructor.call(this, el, attributes, duration, method);
    };

    Ext.extend(EXTLIB.ColorAnim, EXTLIB.AnimBase);

    var superclass = EXTLIB.ColorAnim.superclass,
    	colorRE = /color$/i,
    	transparentRE = /^transparent|rgba\(0, 0, 0, 0\)$/,
        rgbRE = /^rgb\(([0-9]+)\s*,\s*([0-9]+)\s*,\s*([0-9]+)\)$/i,
        hexRE= /^#?([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})$/i,
        hex3RE = /^#?([0-9A-F]{1})([0-9A-F]{1})([0-9A-F]{1})$/i,
        isset = function(v){
            return typeof v !== 'undefined';
        }
         	
   	// private	
    function parseColor(s) {	
        var pi = parseInt,
            base,
            out = null,
            c;
        
	    if (s.length == 3) {
            return s;
        }
        
        Ext.each([hexRE, rgbRE, hex3RE], function(re, idx){
            base = (idx % 2 == 0) ? 16 : 10;
            c = re.exec(s);
            if(c && c.length == 4){
                out = [pi(c[1], base), pi(c[2], base), pi(c[3], base)];
                return false;
            }
        });
        return out;
    }	

    Ext.apply(EXTLIB.ColorAnim.prototype, {
        getAttr : function(attr) {
            var me = this,
                el = me.el,
                val;                
            if(colorRE.test(attr)){
                while(el && transparentRE.test(val = Ext.fly(el).getStyle(attr))){
                    el = el.parentNode;
                    val = "fff";
                }
            }else{
                val = superclass.getAttr.call(me, attr);
            }
            return val;
        },

        doMethod : function(attr, start, end) {
            var me = this,
            	val,
            	floor = Math.floor;            

            if(colorRE.test(attr)){
                val = [];
             
	            Ext.each(start, function(v, i) {
                    val[i] = superclass.doMethod.call(me, attr, v, end[i]);
                });

                val = 'rgb(' + floor(val[0]) + ',' + floor(val[1]) + ',' + floor(val[2]) + ')';
            }else{
                val = superclass.doMethod.call(me, attr, start, end);
            }
            return val;
        },

        setRunAttr : function(attr) {
            var me = this,
                a = me.attributes[attr],
                to = a.to,
                by = a.by,
                ra;
                
            superclass.setRunAttr.call(me, attr);
            ra = me.runAttrs[attr];
            if(colorRE.test(attr)){
                var start = parseColor(ra.start),
                    end = parseColor(ra.end);

                if(!isset(to) && isset(by)){
                    end = parseColor(by);
                    Ext.each(start, function(item, idx){
                        end[i] = item + end[i];
                    });
                }
                ra.start = start;
                ra.end = end;
            }
        }
	});
})();	

	
(function() {
	    // Scroll Animation	
    var EXTLIB = Ext.lib;
	EXTLIB.Anim.scroll = function(el, args, duration, easing, cb, scope) {	        
	    return EXTLIB.Anim.run(el, args, duration, easing, cb, scope, EXTLIB.Scroll);
	}
	
    EXTLIB.Scroll = function(el, attributes, duration, method) {
        if(el){
            EXTLIB.Scroll.superclass.constructor.call(this, el, attributes, duration, method);
        }
    };

    Ext.extend(EXTLIB.Scroll, EXTLIB.ColorAnim);

    var superclass = EXTLIB.Scroll.superclass,
    	SCROLL = 'scroll';

    Ext.apply(EXTLIB.Scroll.prototype, {

        doMethod : function(attr, start, end) {
            var val,
            	me = this,
            	curFrame = me.curFrame,
            	totalFrames = me.totalFrames;

            if(attr == SCROLL){
                val = [me.method(curFrame, start[0], end[0] - start[0], totalFrames),
                       me.method(curFrame, start[1], end[1] - start[1], totalFrames)];
            }else{
                val = superclass.doMethod.call(me, attr, start, end);
            }
            return val;
        },

        getAttr : function(attr) {
            var me = this;

            if (attr == SCROLL) {
                return [me.el.scrollLeft, me.el.scrollTop];
            }else{
                return superclass.getAttr.call(me, attr);
            }
        },

        setAttr : function(attr, val, unit) {
            var me = this;

            if(attr == SCROLL){
                me.el.scrollLeft = val[0];
                me.el.scrollTop = val[1];
            }else{
                superclass.setAttr.call(me, attr, val, unit);
            }
        }
    });
})();
	
	if(Ext.isIE) {
        function fnCleanUp() {
            var p = Function.prototype;
            delete p.createSequence;
            delete p.defer;
            delete p.createDelegate;
            delete p.createCallback;
            delete p.createInterceptor;

            window.detachEvent("onunload", fnCleanUp);
        }
        window.attachEvent("onunload", fnCleanUp);
    }
})();
(function(){

var EXTUTIL = Ext.util, 
    TOARRAY = Ext.toArray, 
    EACH = Ext.each, 
    ISOBJECT = Ext.isObject,
    TRUE = true,
    FALSE = false;

EXTUTIL.Observable = function(){
    
    var me = this, e = me.events;
    if(me.listeners){
        me.on(me.listeners);
        delete me.listeners;
    }
    me.events = e || {};
};

EXTUTIL.Observable.prototype = function(){
    var filterOptRe = /^(?:scope|delay|buffer|single)$/, toLower = function(s){
        return s.toLowerCase();    
    };
        
    return {
        
    
        fireEvent : function(){
            var a = TOARRAY(arguments),
                ename = toLower(a[0]),
                me = this,
                ret = TRUE,
                ce = me.events[ename],
                q,
                c;
            if (me.eventsSuspended === TRUE) {
                if (q = me.suspendedEventsQueue) {
                    q.push(a);
                }
            }
            else if(ISOBJECT(ce) && ce.bubble){
                if(ce.fire.apply(ce, a.slice(1)) === FALSE) {
                    return FALSE;
                }
                c = me.getBubbleTarget && me.getBubbleTarget();
                if(c && c.enableBubble) {
                    c.enableBubble(ename);
                    return c.fireEvent.apply(c, a);
                }
            }
            else {            
                if (ISOBJECT(ce)) {
                    a.shift();
                    ret = ce.fire.apply(ce, a);
                }
            }
            return ret;
        },

        
        addListener : function(eventName, fn, scope, o){
            var me = this,
                e,
                oe,
                isF,
            ce;
            if (ISOBJECT(eventName)) {
                o = eventName;
                for (e in o){
                    oe = o[e];
                    if (!filterOptRe.test(e)) {
                        me.addListener(e, oe.fn || oe, oe.scope || o.scope, oe.fn ? oe : o);
                    }
                }
            } else {
                eventName = toLower(eventName);
                ce = me.events[eventName] || TRUE;
                if (typeof ce == "boolean") {
                    me.events[eventName] = ce = new EXTUTIL.Event(me, eventName);
                }
                ce.addListener(fn, scope, ISOBJECT(o) ? o : {});
            }
        },

        
        removeListener : function(eventName, fn, scope){
            var ce = this.events[toLower(eventName)];
            if (ISOBJECT(ce)) {
                ce.removeListener(fn, scope);
            }
        },

        
        purgeListeners : function(){
            var events = this.events,
                evt,
                key;
            for(key in events){
                evt = events[key];
                if(ISOBJECT(evt)){
                    evt.clearListeners();
                }
            }
        },

        
        addEvents : function(o){
            var me = this;
            me.events = me.events || {};
            if (typeof o == 'string') {
                EACH(arguments, function(a) {
                    me.events[a] = me.events[a] || TRUE;
                });
            } else {
                Ext.applyIf(me.events, o);
            }
        },

        
        hasListener : function(eventName){
            var e = this.events[eventName];
            return ISOBJECT(e) && e.listeners.length > 0;
        },

        
        suspendEvents : function(queueSuspended){
            this.eventsSuspended = TRUE;
            if (queueSuspended){
                this.suspendedEventsQueue = [];
            }
        },

        
        resumeEvents : function(){
            var me = this;
            me.eventsSuspended = !delete me.suspendedEventQueue;
            EACH(me.suspendedEventsQueue, function(e) {
                me.fireEvent.apply(me, e);
            });
        }
    }
}();

var OBSERVABLE = EXTUTIL.Observable.prototype;

OBSERVABLE.on = OBSERVABLE.addListener;

OBSERVABLE.un = OBSERVABLE.removeListener;


EXTUTIL.Observable.releaseCapture = function(o){
    o.fireEvent = OBSERVABLE.fireEvent;
};

function createTargeted(h, o, scope){
    return function(){
        if(o.target == arguments[0]){
            h.apply(scope, TOARRAY(arguments));
        }
    };
};

function createBuffered(h, o, scope){
    var task = new EXTUTIL.DelayedTask();
    return function(){
        task.delay(o.buffer, h, scope, TOARRAY(arguments));
    };
}
    
function createSingle(h, e, fn, scope){
    return function(){
        e.removeListener(fn, scope);
        return h.apply(scope, arguments);
    };
}
    
function createDelayed(h, o, scope){
    return function(){
        var args = TOARRAY(arguments);
        (function(){
            h.apply(scope, args);
        }).defer(o.delay || 10);
    };
};

EXTUTIL.Event = function(obj, name){
    this.name = name;
    this.obj = obj;
    this.listeners = [];
};

EXTUTIL.Event.prototype = {
    addListener : function(fn, scope, options){
        var me = this,
            l;
        scope = scope || me.obj;
        if(!me.isListening(fn, scope)){
            l = me.createListener(fn, scope, options);
            if(me.firing){ // if we are currently firing this event, don't disturb the listener loop                                    
                me.listeners = me.listeners.slice(0);                
            }
            me.listeners.push(l);
        }
    },

    createListener: function(fn, scope, o){
        o = o || {}, scope = scope || this.obj;
        var l = {
            fn: fn,
            scope: scope,
            options: o
        }, h = fn;
        if(o.target){
            h = createTargeted(h, o, scope);
        }
        if(o.delay){
            h = createDelayed(h, o, scope);
        }
        if(o.single){
            h = createSingle(h, this, fn, scope);
        }
        if(o.buffer){
            h = createBuffered(h, o, scope);
        }
        l.fireFn = h;
        return l;
    },

    findListener : function(fn, scope){ 
        var s, ret = -1;
        EACH(this.listeners, function(l, i) {
            s = l.scope;
            if(l.fn == fn && (s == scope || s == this.obj)){
                ret = i;
                return FALSE;
            }
        },
        this);
        return ret;
    },

    isListening : function(fn, scope){
        return this.findListener(fn, scope) != -1;
    },

    removeListener : function(fn, scope){
        var index,
            me = this,
            ret = FALSE;
        if((index = me.findListener(fn, scope)) != -1){
            if (me.firing) {
                me.listeners = me.listeners.slice(0);
            }
            me.listeners.splice(index, 1);
            ret = TRUE;
        }
        return ret;
    },

    clearListeners : function(){
        this.listeners = [];
    },

    fire : function(){
        var me = this,
            args = TOARRAY(arguments),
            ret = TRUE;

        EACH(me.listeners, function(l) {
            me.firing = TRUE;
            if (l.fireFn.apply(l.scope || me.obj || window, args) === FALSE) {
                return ret = me.firing = FALSE;
            }
        });
        me.firing = FALSE;
        return ret;
    }
};
})();

Ext.DomHelper = function(){
    var tempTableEl = null,
    	emptyTags = /^(?:br|frame|hr|img|input|link|meta|range|spacer|wbr|area|param|col)$/i,
    	tableRe = /^table|tbody|tr|td$/i,
    	pub,
    	// kill repeat to save bytes
    	afterbegin = "afterbegin",
    	afterend = "afterend",
    	beforebegin = "beforebegin",
    	beforeend = "beforeend",
    	ts = '<table>',
        te = '</table>',
        tbs = ts+'<tbody>',
        tbe = '</tbody>'+te,
        trs = tbs + '<tr>',
        tre = '</tr>'+tbe;
        
    // private
    function doInsert(el, o, returnElement, pos, sibling, append){        
        var newNode = pub.insertHtml(pos, Ext.getDom(el), createHtml(o));        
        return returnElement ? Ext.get(newNode, true) : newNode;
    }

    // build as innerHTML where available
    function createHtml(o){
	    var b = "",
	    	attr,
	    	val,
	    	key,
	    	keyVal,
	    	cn;
	    	
        if(typeof o == 'string'){
            b = o;
        } else if (Ext.isArray(o)) {            
	        Ext.each(o, function(v) {    
                b += createHtml(v);
            });            
        } else {
	        b += "<" + (o.tag = o.tag || "div");
	        for(attr in o){		        
		        val = o[attr];		        	
		        if (!/tag|children|cn|html$/i.test(attr) && !Ext.isFunction(val)) {		            			        
		            if (Ext.isObject(val)) {	
		            	b += " " + attr + "='";
	                    for (key in val) {
		                    keyVal = val[key];
		                    b += !Ext.isFunction(keyVal) ? key + ":" + keyVal + ";" : "";	                        
	                    }
	                    b += "'";			          
	                } else {		                
		             	b += " " + ({cls : "class", htmlFor : "for"}[attr] || attr) + "='" + val + "'";   
	                }
	            }
	        }
	        // Now either just close the tag or try to add children and close the tag.
	        if (emptyTags.test(o.tag)) {
	            b += "/>";
	        } else {
	            b += ">";
	            if (cn = o.children || o.cn) {
	                b += createHtml(cn);
	            } else if(o.html){
	                b += o.html;
	            }
	            b += "</" + o.tag + ">";
        	}	        
        }        
        return b;
    };    

    function ieTable(depth, s, h, e){
        tempTableEl.innerHTML = [s, h, e].join('');
        var i = -1, 
        	el = tempTableEl;
        while(++i < depth){
            el = el.firstChild;
        }
        return el;
    };

    
    function insertIntoTable(tag, where, el, html) {        
	    var node,
        	before;
        	
        tempTableEl = tempTableEl || document.createElement('div');        
        		
  	    if(tag == 'td' && (where == afterbegin || where == beforeend) ||
  	       !/td|tr|tbody/i.test(tag) && (where == beforebegin || where == afterend)) { 
            return;
        }
        before = where == beforebegin ? el :
		 		 where == afterend ? el.nextSibling :
				 where == afterbegin ? el.firstChild : null;
				    
        if (where == beforebegin || where == afterend) {	        
        	el = el.parentNode;
    	}
        
        if (tag == 'td' || (tag == "tr" && (where == beforeend || where == afterbegin))) {
	        node = ieTable(4, trs, html, tre);
        } else if ((tag == "tbody" && (where == beforeend || where == afterbegin)) || 
        		   (tag == "tr" && (where == beforebegin || where == afterend))) {
	        node = ieTable(3, tbs, html, tbe);
        } else {
	     	node = ieTable(2, ts, html, te);   
        }  
        el.insertBefore(node, before);
        return node;
    };


    pub = {
	    
	    markup : function(o){
	        return createHtml(o);
	    },	    
	
	    
	    insertHtml : function(where, el, html){
	        var hash = {},
	        	hashVal,
 	        	setStart,
	        	range,
	        	frag,
	        	rangeEl,
	        	rs;
	        
	        where = where.toLowerCase();	
	        // add these here because they are used in both branches of the condition.	
	        hash[beforebegin] = ['BeforeBegin', 'previousSibling'];	 
	        hash[afterend] = ['AfterEnd', 'nextSibling'];	            
	           
	        if (el.insertAdjacentHTML) {
	            if(tableRe.test(el.tagName) && (rs = insertIntoTable(el.tagName.toLowerCase(), where, el, html))){
	            	return rs;	                
	            }
	            // add these two to the hash.
	            hash[afterbegin] = ['AfterBegin', 'firstChild'];
	            hash[beforeend] = ['BeforeEnd', 'lastChild'];	            
	            if (hashVal = hash[where]) {
		        	el.insertAdjacentHTML(hashVal[0], html);
	            	return el[hashVal[1]];           	
	            }	            
	        } else {
		        range = el.ownerDocument.createRange();	        		        
		        setStart = "setStart" + (/end/i.test(where) ? "After" : "Before");
		        if (hash[where]) {
			     	range[setStart](el);
			     	frag = range.createContextualFragment(html);
			     	el.parentNode.insertBefore(frag, where == beforebegin ? el : el.nextSibling);   
			     	return el[(where == beforebegin ? "previous" : "next") + "Sibling"];
		        } else {			        
			        rangeEl = (where == afterbegin ? "first" : "last") + "Child";
			        if (el.firstChild) {
				        range[setStart](el[rangeEl]);
				        frag = range.createContextualFragment(html);
				        where == afterbegin ? el.insertBefore(frag, el.firstChild) : el.appendChild(frag);			       	
			        } else {
		 	            el.innerHTML = html;	    	        
	 	            }
	 	            return el[rangeEl];
		        }
	        }
	        throw 'Illegal insertion point -> "' + where + '"';
	    },
	
	    
	    insertBefore : function(el, o, returnElement){
	        return doInsert(el, o, returnElement, beforebegin);
	    },
	
	    
	    insertAfter : function(el, o, returnElement){
	        return doInsert(el, o, returnElement, afterend, "nextSibling");
	    },
	
	    
	    insertFirst : function(el, o, returnElement){
	        return doInsert(el, o, returnElement, afterbegin, "firstChild");
	    },	    
	
	    
	    append : function(el, o, returnElement){
		    return doInsert(el, o, returnElement, beforeend, "", true);
	    },
	
	    
	    overwrite : function(el, o, returnElement){
	        el = Ext.getDom(el);
	        el.innerHTML = createHtml(o);
	        return returnElement ? Ext.get(el.firstChild) : el.firstChild;
	    },
	    
	    createHtml : createHtml
    };    
    return pub;
}();

Ext.Template = function(html){
    var me = this,
    	a = arguments,
    	buf = [];

    if (Ext.isArray(html)) {
        html = html.join("");
    } else if (a.length > 1) {
	    Ext.each(a, function(v) {
            if (Ext.isObject(v)) {
                Ext.apply(me, v);
            } else {
                buf.push(v);
            }
        });
        html = buf.join('');
    }

    
    me.html = html;
    if (me.compiled) {
        me.compile();
    }
};
Ext.Template.prototype = {
    
    applyTemplate : function(values){
		var me = this;

        return me.compiled ?
        		me.compiled(values) :
				me.html.replace(me.re, function(m, name){
		        	return values[name] !== undefined ? values[name] : "";
		        });
	},

    
    set : function(html, compile){
	    var me = this;
        me.html = html;
        me.compiled = null;
        return compile ? me.compile() : me;
    },

    
    re : /\{([\w-]+)\}/g,

    
    compile : function(){
        var me = this,
        	sep = Ext.isGecko ? "+" : ",";

        function fn(m, name){                        
	        name = "values['" + name + "']";
	        return "'"+ sep + '(' + name + " == undefined ? '' : " + name + ')' + sep + "'";
        }
                
        eval("this.compiled = function(values){ return " + (Ext.isGecko ? "'" : "['") +
             me.html.replace(/\\/g, '\\\\').replace(/(\r\n|\n)/g, '\\n').replace(/'/g, "\\'").replace(this.re, fn) +
             (Ext.isGecko ?  "';};" : "'].join('');};"));
        return me;
    },

    
    insertFirst: function(el, values, returnElement){
        return this.doInsert('afterBegin', el, values, returnElement);
    },

    
    insertBefore: function(el, values, returnElement){
        return this.doInsert('beforeBegin', el, values, returnElement);
    },

    
    insertAfter : function(el, values, returnElement){
        return this.doInsert('afterEnd', el, values, returnElement);
    },

    
    append : function(el, values, returnElement){
        return this.doInsert('beforeEnd', el, values, returnElement);
    },

    doInsert : function(where, el, values, returnEl){
        el = Ext.getDom(el);
        var newNode = Ext.DomHelper.insertHtml(where, el, this.applyTemplate(values));
        return returnEl ? Ext.get(newNode, true) : newNode;
    },

    
    overwrite : function(el, values, returnElement){
        el = Ext.getDom(el);
        el.innerHTML = this.applyTemplate(values);
        return returnElement ? Ext.get(el.firstChild, true) : el.firstChild;
    }
};

Ext.Template.prototype.apply = Ext.Template.prototype.applyTemplate;


Ext.Template.from = function(el, config){
    el = Ext.getDom(el);
    return new Ext.Template(el.value || el.innerHTML, config || '');
};


Ext.DomQuery = function(){
    var cache = {}, 
    	simpleCache = {}, 
    	valueCache = {},
    	nonSpace = /\S/,
    	trimRe = /^\s+|\s+$/g,
    	tplRe = /\{(\d+)\}/g,
    	modeRe = /^(\s?[\/>+~]\s?|\s|$)/,
    	tagTokenRe = /^(#)?([\w-\*]+)/,
    	nthRe = /(\d*)n\+?(\d*)/, 
    	nthRe2 = /\D/,
    	// This is for IE MSXML which does not support expandos.
	    // IE runs the same speed using setAttribute, however FF slows way down
	    // and Safari completely fails so they need to continue to use expandos.
	    isIE = window.ActiveXObject ? true : false,
        isOpera = Ext.isOpera,
	    key = 30803;
	    
    // this eval is stop the compressor from
	// renaming the variable to something shorter
	eval("var batch = 30803;");    	

    function child(p, index){
        var i = 0,
        	n = p.firstChild;
        while(n){
            if(n.nodeType == 1){
               if(++i == index){
                   return n;
               }
            }
            n = n.nextSibling;
        }
        return null;
    };

    function next(n){
        while((n = n.nextSibling) && n.nodeType != 1);
        return n;
    };

    function prev(n){
        while((n = n.previousSibling) && n.nodeType != 1);
        return n;
    };

    function children(d){
        var n = d.firstChild, ni = -1,
        	nx;
 	    while(n){
 	        nx = n.nextSibling;
 	        if(n.nodeType == 3 && !nonSpace.test(n.nodeValue)){
 	            d.removeChild(n);
 	        }else{
 	            n.nodeIndex = ++ni;
 	        }
 	        n = nx;
 	    }
 	    return this;
 	};

    function byClassName(c, a, v){
        if(!v){
            return c;
        }
        var r = [], ri = -1, cn;
        for(var i = 0, ci; ci = c[i]; i++){
            if((' '+ci.className+' ').indexOf(v) != -1){
                r[++ri] = ci;
            }
        }
        return r;
    };

    function attrValue(n, attr){
        if(!n.tagName && typeof n.length != "undefined"){
            n = n[0];
        }
        if(!n){
            return null;
        }
        if(attr == "for"){
            return n.htmlFor;
        }
        if(attr == "class" || attr == "className"){
            return n.className;
        }
        return n.getAttribute(attr) || n[attr];

    };

    function getNodes(ns, mode, tagName){
        var result = [], ri = -1, cs;
        if(!ns){
            return result;
        }
        tagName = tagName || "*";
        if(typeof ns.getElementsByTagName != "undefined"){
            ns = [ns];
        }
        if(!mode){
            for(var i = 0, ni; ni = ns[i]; i++){
                cs = ni.getElementsByTagName(tagName);
                for(var j = 0, ci; ci = cs[j]; j++){
                    result[++ri] = ci;
                }
            }
        }else if(mode == "/" || mode == ">"){
            var utag = tagName.toUpperCase();
            for(var i = 0, ni, cn; ni = ns[i]; i++){
                cn = isOpera ? ni.childNodes : (ni.children || ni.childNodes);
                for(var j = 0, cj; cj = cn[j]; j++){
                    if(cj.nodeName == utag || cj.nodeName == tagName  || tagName == '*'){
                        result[++ri] = cj;
                    }
                }
            }
        }else if(mode == "+"){
            var utag = tagName.toUpperCase();
            for(var i = 0, n; n = ns[i]; i++){
                while((n = n.nextSibling) && n.nodeType != 1);
                if(n && (n.nodeName == utag || n.nodeName == tagName || tagName == '*')){
                    result[++ri] = n;
                }
            }
        }else if(mode == "~"){
            var utag = tagName.toUpperCase();
            for(var i = 0, n; n = ns[i]; i++){
                while((n = n.nextSibling)){
                    if (n.nodeName == utag || n.nodeName == tagName || tagName == '*'){
                        result[++ri] = n;
                    }
                }
            }
        }
        return result;
    };

    function concat(a, b){
        if(b.slice){
            return a.concat(b);
        }
        for(var i = 0, l = b.length; i < l; i++){
            a[a.length] = b[i];
        }
        return a;
    }

    function byTag(cs, tagName){
        if(cs.tagName || cs == document){
            cs = [cs];
        }
        if(!tagName){
            return cs;
        }
        var r = [], ri = -1;
        tagName = tagName.toLowerCase();
        for(var i = 0, ci; ci = cs[i]; i++){
            if(ci.nodeType == 1 && ci.tagName.toLowerCase()==tagName){
                r[++ri] = ci;
            }
        }
        return r;
    };

    function byId(cs, attr, id){
        if(cs.tagName || cs == document){
            cs = [cs];
        }
        if(!id){
            return cs;
        }
        var r = [], ri = -1;
        for(var i = 0,ci; ci = cs[i]; i++){
            if(ci && ci.id == id){
                r[++ri] = ci;
                return r;
            }
        }
        return r;
    };

    function byAttribute(cs, attr, value, op, custom){
        var r = [], 
        	ri = -1, 
        	st = custom=="{",
        	f = Ext.DomQuery.operators[op];
        for(var i = 0, ci; ci = cs[i]; i++){
            if(ci.nodeType != 1){
                continue;
            }
            var a;
            if(st){
                a = Ext.DomQuery.getStyle(ci, attr);
            }
            else if(attr == "class" || attr == "className"){
                a = ci.className;
            }else if(attr == "for"){
                a = ci.htmlFor;
            }else if(attr == "href"){
                a = ci.getAttribute("href", 2);
            }else{
                a = ci.getAttribute(attr);
            }
            if((f && f(a, value)) || (!f && a)){
                r[++ri] = ci;
            }
        }
        return r;
    };

    function byPseudo(cs, name, value){
        return Ext.DomQuery.pseudos[name](cs, value);
    };

    function nodupIEXml(cs){
        var d = ++key, 
        	r;
        cs[0].setAttribute("_nodup", d);
        r = [cs[0]];
        for(var i = 1, len = cs.length; i < len; i++){
            var c = cs[i];
            if(!c.getAttribute("_nodup") != d){
                c.setAttribute("_nodup", d);
                r[r.length] = c;
            }
        }
        for(var i = 0, len = cs.length; i < len; i++){
            cs[i].removeAttribute("_nodup");
        }
        return r;
    }

    function nodup(cs){
        if(!cs){
            return [];
        }
        var len = cs.length, c, i, r = cs, cj, ri = -1;
        if(!len || typeof cs.nodeType != "undefined" || len == 1){
            return cs;
        }
        if(isIE && typeof cs[0].selectSingleNode != "undefined"){
            return nodupIEXml(cs);
        }
        var d = ++key;
        cs[0]._nodup = d;
        for(i = 1; c = cs[i]; i++){
            if(c._nodup != d){
                c._nodup = d;
            }else{
                r = [];
                for(var j = 0; j < i; j++){
                    r[++ri] = cs[j];
                }
                for(j = i+1; cj = cs[j]; j++){
                    if(cj._nodup != d){
                        cj._nodup = d;
                        r[++ri] = cj;
                    }
                }
                return r;
            }
        }
        return r;
    }

    function quickDiffIEXml(c1, c2){
        var d = ++key,
        	r = [];
        for(var i = 0, len = c1.length; i < len; i++){
            c1[i].setAttribute("_qdiff", d);
        }        
        for(var i = 0, len = c2.length; i < len; i++){
            if(c2[i].getAttribute("_qdiff") != d){
                r[r.length] = c2[i];
            }
        }
        for(var i = 0, len = c1.length; i < len; i++){
           c1[i].removeAttribute("_qdiff");
        }
        return r;
    }

    function quickDiff(c1, c2){
        var len1 = c1.length,
        	d = ++key,
        	r = [];
        if(!len1){
            return c2;
        }
        if(isIE && c1[0].selectSingleNode){
            return quickDiffIEXml(c1, c2);
        }        
        for(var i = 0; i < len1; i++){
            c1[i]._qdiff = d;
        }        
        for(var i = 0, len = c2.length; i < len; i++){
            if(c2[i]._qdiff != d){
                r[r.length] = c2[i];
            }
        }
        return r;
    }

    function quickId(ns, mode, root, id){
        if(ns == root){
           var d = root.ownerDocument || root;
           return d.getElementById(id);
        }
        ns = getNodes(ns, mode, "*");
        return byId(ns, null, id);
    }

    return {
        getStyle : function(el, name){
            return Ext.fly(el).getStyle(name);
        },
        
        compile : function(path, type){
            type = type || "select";

            var fn = ["var f = function(root){\n var mode; ++batch; var n = root || document;\n"],
            	q = path, mode, lq,
            	tk = Ext.DomQuery.matchers,
            	tklen = tk.length,
            	mm,
            	// accept leading mode switch
            	lmode = q.match(modeRe);
            
            if(lmode && lmode[1]){
                fn[fn.length] = 'mode="'+lmode[1].replace(trimRe, "")+'";';
                q = q.replace(lmode[1], "");
            }
            // strip leading slashes
            while(path.substr(0, 1)=="/"){
                path = path.substr(1);
            }

            while(q && lq != q){
                lq = q;
                var tm = q.match(tagTokenRe);
                if(type == "select"){
                    if(tm){
                        if(tm[1] == "#"){
                            fn[fn.length] = 'n = quickId(n, mode, root, "'+tm[2]+'");';
                        }else{
                            fn[fn.length] = 'n = getNodes(n, mode, "'+tm[2]+'");';
                        }
                        q = q.replace(tm[0], "");
                    }else if(q.substr(0, 1) != '@'){
                        fn[fn.length] = 'n = getNodes(n, mode, "*");';
                    }
                }else{
                    if(tm){
                        if(tm[1] == "#"){
                            fn[fn.length] = 'n = byId(n, null, "'+tm[2]+'");';
                        }else{
                            fn[fn.length] = 'n = byTag(n, "'+tm[2]+'");';
                        }
                        q = q.replace(tm[0], "");
                    }
                }
                while(!(mm = q.match(modeRe))){
                    var matched = false;
                    for(var j = 0; j < tklen; j++){
                        var t = tk[j];
                        var m = q.match(t.re);
                        if(m){
                            fn[fn.length] = t.select.replace(tplRe, function(x, i){
                                                    return m[i];
                                                });
                            q = q.replace(m[0], "");
                            matched = true;
                            break;
                        }
                    }
                    // prevent infinite loop on bad selector
                    if(!matched){
                        throw 'Error parsing selector, parsing failed at "' + q + '"';
                    }
                }
                if(mm[1]){
                    fn[fn.length] = 'mode="'+mm[1].replace(trimRe, "")+'";';
                    q = q.replace(mm[1], "");
                }
            }
            fn[fn.length] = "return nodup(n);\n}";
            eval(fn.join(""));
            return f;
        },

        
        select : function(path, root, type){
            if(!root || root == document){
                root = document;
            }
            if(typeof root == "string"){
                root = document.getElementById(root);
            }
            var paths = path.split(","),
            	results = [];
            for(var i = 0, len = paths.length; i < len; i++){
                var p = paths[i].replace(trimRe, "");
                if(!cache[p]){
                    cache[p] = Ext.DomQuery.compile(p);
                    if(!cache[p]){
                        throw p + " is not a valid selector";
                    }
                }
                var result = cache[p](root);
                if(result && result != document){
                    results = results.concat(result);
                }
            }
            if(paths.length > 1){
                return nodup(results);
            }
            return results;
        },

        
        selectNode : function(path, root){
            return Ext.DomQuery.select(path, root)[0];
        },

        
        selectValue : function(path, root, defaultValue){
            path = path.replace(trimRe, "");
            if(!valueCache[path]){
                valueCache[path] = Ext.DomQuery.compile(path, "select");
            }
            var n = valueCache[path](root),
            	v;
            n = n[0] ? n[0] : n;
            v = (n && n.firstChild ? n.firstChild.nodeValue : null);
            return ((v === null||v === undefined||v==='') ? defaultValue : v);
        },

        
        selectNumber : function(path, root, defaultValue){
            var v = Ext.DomQuery.selectValue(path, root, defaultValue || 0);
            return parseFloat(v);
        },

        
        is : function(el, ss){
            if(typeof el == "string"){
                el = document.getElementById(el);
            }
            var isArray = Ext.isArray(el),
            	result = Ext.DomQuery.filter(isArray ? el : [el], ss);
            return isArray ? (result.length == el.length) : (result.length > 0);
        },

        
        filter : function(els, ss, nonMatches){
            ss = ss.replace(trimRe, "");
            if(!simpleCache[ss]){
                simpleCache[ss] = Ext.DomQuery.compile(ss, "simple");
            }
            var result = simpleCache[ss](els);
            return nonMatches ? quickDiff(result, els) : result;
        },

        
        matchers : [{
                re: /^\.([\w-]+)/,
                select: 'n = byClassName(n, null, " {1} ");'
            }, {
                re: /^\:([\w-]+)(?:\(((?:[^\s>\/]*|.*?))\))?/,
                select: 'n = byPseudo(n, "{1}", "{2}");'
            },{
                re: /^(?:([\[\{])(?:@)?([\w-]+)\s?(?:(=|.=)\s?['"]?(.*?)["']?)?[\]\}])/,
                select: 'n = byAttribute(n, "{2}", "{4}", "{3}", "{1}");'
            }, {
                re: /^#([\w-]+)/,
                select: 'n = byId(n, null, "{1}");'
            },{
                re: /^@([\w-]+)/,
                select: 'return {firstChild:{nodeValue:attrValue(n, "{1}")}};'
            }
        ],

        
        operators : {
            "=" : function(a, v){
                return a == v;
            },
            "!=" : function(a, v){
                return a != v;
            },
            "^=" : function(a, v){
                return a && a.substr(0, v.length) == v;
            },
            "$=" : function(a, v){
                return a && a.substr(a.length-v.length) == v;
            },
            "*=" : function(a, v){
                return a && a.indexOf(v) !== -1;
            },
            "%=" : function(a, v){
                return (a % v) == 0;
            },
            "|=" : function(a, v){
                return a && (a == v || a.substr(0, v.length+1) == v+'-');
            },
            "~=" : function(a, v){
                return a && (' '+a+' ').indexOf(' '+v+' ') != -1;
            }
        },

        
        pseudos : {
            "first-child" : function(c){
                var r = [], ri = -1, n;
                for(var i = 0, ci; ci = n = c[i]; i++){
                    while((n = n.previousSibling) && n.nodeType != 1);
                    if(!n){
                        r[++ri] = ci;
                    }
                }
                return r;
            },

            "last-child" : function(c){
                var r = [], ri = -1, n;
                for(var i = 0, ci; ci = n = c[i]; i++){
                    while((n = n.nextSibling) && n.nodeType != 1);
                    if(!n){
                        r[++ri] = ci;
                    }
                }
                return r;
            },

            "nth-child" : function(c, a) {
                var r = [], ri = -1,
                	m = nthRe.exec(a == "even" && "2n" || a == "odd" && "2n+1" || !nthRe2.test(a) && "n+" + a || a),
                	f = (m[1] || 1) - 0, l = m[2] - 0;
                for(var i = 0, n; n = c[i]; i++){
                    var pn = n.parentNode;
                    if (batch != pn._batch) {
                        var j = 0;
                        for(var cn = pn.firstChild; cn; cn = cn.nextSibling){
                            if(cn.nodeType == 1){
                               cn.nodeIndex = ++j;
                            }
                        }
                        pn._batch = batch;
                    }
                    if (f == 1) {
                        if (l == 0 || n.nodeIndex == l){
                            r[++ri] = n;
                        }
                    } else if ((n.nodeIndex + l) % f == 0){
                        r[++ri] = n;
                    }
                }

                return r;
            },

            "only-child" : function(c){
                var r = [], ri = -1;;
                for(var i = 0, ci; ci = c[i]; i++){
                    if(!prev(ci) && !next(ci)){
                        r[++ri] = ci;
                    }
                }
                return r;
            },

            "empty" : function(c){
                var r = [], ri = -1;
                for(var i = 0, ci; ci = c[i]; i++){
                    var cns = ci.childNodes, j = 0, cn, empty = true;
                    while(cn = cns[j]){
                        ++j;
                        if(cn.nodeType == 1 || cn.nodeType == 3){
                            empty = false;
                            break;
                        }
                    }
                    if(empty){
                        r[++ri] = ci;
                    }
                }
                return r;
            },

            "contains" : function(c, v){
                var r = [], ri = -1;
                for(var i = 0, ci; ci = c[i]; i++){
                    if((ci.textContent||ci.innerText||'').indexOf(v) != -1){
                        r[++ri] = ci;
                    }
                }
                return r;
            },

            "nodeValue" : function(c, v){
                var r = [], ri = -1;
                for(var i = 0, ci; ci = c[i]; i++){
                    if(ci.firstChild && ci.firstChild.nodeValue == v){
                        r[++ri] = ci;
                    }
                }
                return r;
            },

            "checked" : function(c){
                var r = [], ri = -1;
                for(var i = 0, ci; ci = c[i]; i++){
                    if(ci.checked == true){
                        r[++ri] = ci;
                    }
                }
                return r;
            },

            "not" : function(c, ss){
                return Ext.DomQuery.filter(c, ss, true);
            },

            "any" : function(c, selectors){
                var ss = selectors.split('|'),
                	r = [], ri = -1, s;
                for(var i = 0, ci; ci = c[i]; i++){
                    for(var j = 0; s = ss[j]; j++){
                        if(Ext.DomQuery.is(ci, s)){
                            r[++ri] = ci;
                            break;
                        }
                    }
                }
                return r;
            },

            "odd" : function(c){
                return this["nth-child"](c, "odd");
            },

            "even" : function(c){
                return this["nth-child"](c, "even");
            },

            "nth" : function(c, a){
                return c[a-1] || [];
            },

            "first" : function(c){
                return c[0] || [];
            },

            "last" : function(c){
                return c[c.length-1] || [];
            },

            "has" : function(c, ss){
                var s = Ext.DomQuery.select,
                	r = [], ri = -1;
                for(var i = 0, ci; ci = c[i]; i++){
                    if(s(ss, ci).length > 0){
                        r[++ri] = ci;
                    }
                }
                return r;
            },

            "next" : function(c, ss){
                var is = Ext.DomQuery.is,
                	r = [], ri = -1;
                for(var i = 0, ci; ci = c[i]; i++){
                    var n = next(ci);
                    if(n && is(n, ss)){
                        r[++ri] = ci;
                    }
                }
                return r;
            },

            "prev" : function(c, ss){
                var is = Ext.DomQuery.is,
                	r = [], ri = -1;
                for(var i = 0, ci; ci = c[i]; i++){
                    var n = prev(ci);
                    if(n && is(n, ss)){
                        r[++ri] = ci;
                    }
                }
                return r;
            }
        }
    };
}();


Ext.query = Ext.DomQuery.select;


Ext.EventManager = function(){
    var docReadyEvent, 
    	docReadyProcId, 
    	docReadyState = false,    	
    	E = Ext.lib.Event,
    	D = Ext.lib.Dom,
    	DOC = document,
    	WINDOW = window,
    	IEDEFERED = "ie-deferred-loader",
    	DOMCONTENTLOADED = "DOMContentLoaded",
    	elHash = {},
    	propRe = /^(?:scope|delay|buffer|single|stopEvent|preventDefault|stopPropagation|normalized|args|delegate)$/;

    /// There is some jquery work around stuff here that isn't needed in Ext Core.
    function addListener(el, ename, fn, wrap, scope){	    
        var id = Ext.id(el),
        	es = elHash[id] = elHash[id] || {};     	
       
        (es[ename] = es[ename] || []).push([fn, wrap, scope]);
        E.on(el, ename, wrap);

        // this is a workaround for jQuery and should somehow be removed from Ext Core in the future
        // without breaking ExtJS.
        if(ename == "mousewheel" && el.addEventListener){ // workaround for jQuery
        	var args = ["DOMMouseScroll", wrap, false];
        	el.addEventListener.apply(el, args);
            E.on(window, 'unload', function(){
	            el.removeEventListener.apply(el, args);                
            });
        }
        if(ename == "mousedown" && el == document){ // fix stopped mousedowns on the document
            Ext.EventManager.stoppedMouseDownEvent.addListener(wrap);
        }
    };
    
    function fireDocReady(){
        if(!docReadyState){            
            Ext.isReady = docReadyState = true;
            if(docReadyProcId){
                clearInterval(docReadyProcId);
            }
            if(Ext.isGecko || Ext.isOpera) {
                DOC.removeEventListener(DOMCONTENTLOADED, fireDocReady, false);
            }
            if(Ext.isIE){
                var defer = DOC.getElementById(IEDEFERED);
                if(defer){
                    defer.onreadystatechange = null;
                    defer.parentNode.removeChild(defer);
                }
            }
            if(docReadyEvent){
                docReadyEvent.fire();
                docReadyEvent.clearListeners();
            }
        }
    };

    function initDocReady(){
	    var COMPLETE = "complete";
	    	
        docReadyEvent = new Ext.util.Event();
        if (Ext.isGecko || Ext.isOpera) {
            DOC.addEventListener(DOMCONTENTLOADED, fireDocReady, false);
        } else if (Ext.isIE){
            DOC.write("<s"+'cript id=' + IEDEFERED + ' defer="defer" src="/'+'/:"></s'+"cript>");            
            DOC.getElementById(IEDEFERED).onreadystatechange = function(){
                if(this.readyState == COMPLETE){
                    fireDocReady();
                }
            };
        } else if (Ext.isWebKit){
            docReadyProcId = setInterval(function(){                
                if(DOC.readyState == COMPLETE) {
                    fireDocReady();
                 }
            }, 10);
        }
        // no matter what, make sure it fires on load
        E.on(WINDOW, "load", fireDocReady);
    };

    function createTargeted(h, o){
        return function(){
	        var args = Ext.toArray(arguments);
            if(o.target == Ext.EventObject.setEvent(args[0]).target){
                h.apply(this, args);
            }
        };
    };    
    
    function createBuffered(h, o){
        var task = new Ext.util.DelayedTask(h);
        return function(e){
            // create new event object impl so new events don't wipe out properties            
            task.delay(o.buffer, h, null, [new Ext.EventObjectImpl(e)]);
        };
    };

    function createSingle(h, el, ename, fn, scope){
        return function(e){
            Ext.EventManager.removeListener(el, ename, fn, scope);
            h(e);
        };
    };

    function createDelayed(h, o){
        return function(e){
            // create new event object impl so new events don't wipe out properties   
            e = new Ext.EventObjectImpl(e);
            setTimeout(function(){
                h(e);
            }, o.delay || 10);
        };
    };

    function listen(element, ename, opt, fn, scope){
        var o = !Ext.isObject(opt) ? {} : opt,
        	el = Ext.getDom(element);
        	
        fn = fn || o.fn; 
        scope = scope || o.scope;
        
        if(!el){
            throw "Error listening for \"" + ename + '\". Element "' + element + '" doesn\'t exist.';
        }
        function h(e){
            // prevent errors while unload occurring
            if(!Ext){// !window[xname]){  ==> can't we do this? 
                return;
            }
            e = Ext.EventObject.setEvent(e);
            var t;
            if (o.delegate) {
                if(!(t = e.getTarget(o.delegate, el))){
                    return;
                }
            } else {
                t = e.target;
            }            
            if (o.stopEvent) {
                e.stopEvent();
            }
            if (o.preventDefault) {
               e.preventDefault();
            }
            if (o.stopPropagation) {
                e.stopPropagation();
            }
            if (o.normalized) {
                e = e.browserEvent;
            }
            
            fn.call(scope || el, e, t, o);
        };
        if(o.target){
            h = createTargeted(h, o);
        }
        if(o.delay){
            h = createDelayed(h, o);
        }
        if(o.single){
            h = createSingle(h, el, ename, fn, scope);
        }
        if(o.buffer){
            h = createBuffered(h, o);
        }

        addListener(el, ename, fn, h, scope);
        return h;
    };

    var pub = {
	    
		addListener : function(element, eventName, fn, scope, options){		     		     		     
            if(Ext.isObject(eventName)){                
	            var o = eventName, e, val;
                for(e in o){
	                val = o[e];
                    if(!propRe.test(e)){                            		         
	                    if(Ext.isFunction(val)){
	                        // shared options
	                        listen(element, e, o, val, o.scope);
	                    }else{
	                        // individual options
	                        listen(element, e, val);
	                    }
                    }
                }
            } else {
            	listen(element, eventName, options, fn, scope);
        	}
        },
        
        
        removeListener : function(element, eventName, fn, scope){            
            var el = Ext.getDom(element),
                id = Ext.id(el),
        	    wrap;      
	        
	        Ext.each((elHash[id] || {})[eventName], function (v,i,a) {
			    if (Ext.isArray(v) && v[0] == fn && (!scope || v[2] == scope)) {		        			        
			        E.un(el, eventName, wrap = v[1]);
			        a.splice(i,1);
			        return false;			        
		        }
	        });	

            // jQuery workaround that should be removed from Ext Core
	        if(eventName == "mousewheel" && el.addEventListener && wrap){
	            el.removeEventListener("DOMMouseScroll", wrap, false);
	        }
            	        
	        if(eventName == "mousedown" && el == DOC && wrap){ // fix stopped mousedowns on the document
	            Ext.EventManager.stoppedMouseDownEvent.removeListener(wrap);
	        }
        },
        
        
        removeAll : function(el){
	        var id = Ext.id(el = Ext.getDom(el)), 
				es = elHash[id], 				
				ename;
	       
	        for(ename in es){
	            if(es.hasOwnProperty(ename)){	                    
	                Ext.each(es[ename], function(v) {
	                    E.un(el, ename, v.wrap);                    
	                });
	            }            
	        }
	        elHash[id] = null;       
        },

        
        onDocumentReady : function(fn, scope, options){
            if(docReadyState){ // if it already fired
                docReadyEvent.addListener(fn, scope, options);
                docReadyEvent.fire();
                docReadyEvent.clearListeners();               
            } else {
                if(!docReadyEvent) initDocReady();
                options = options || {};
	            options.delay = options.delay || 1;	            
	            docReadyEvent.addListener(fn, scope, options);
            }
        },
        
        elHash : elHash   
    };
     
    pub.on = pub.addListener;
    
    pub.un = pub.removeListener;

    pub.stoppedMouseDownEvent = new Ext.util.Event();
    return pub;
}();

Ext.onReady = Ext.EventManager.onDocumentReady;


//Initialize doc classes
(function(){
    
    var initExtCss = function(){
        // find the body element
        var bd = document.body || document.getElementsByTagName('body')[0];
        if(!bd){ return false; }
        var cls = [' ',
                Ext.isIE ? "ext-ie " + (Ext.isIE6 ? 'ext-ie6' : (Ext.isIE7 ? 'ext-ie7' : 'ext-ie8'))
                : Ext.isGecko ? "ext-gecko " + (Ext.isGecko2 ? 'ext-gecko2' : 'ext-gecko3')
                : Ext.isOpera ? "ext-opera"
                : Ext.isWebKit ? "ext-webkit" : ""];

        if(Ext.isSafari){
            cls.push("ext-safari " + (Ext.isSafari2 ? 'ext-safari2' : (Ext.isSafari3 ? 'ext-safari3' : 'ext-safari4')));
        }else if(Ext.isChrome){
            cls.push("ext-chrome");
        }

        if(Ext.isMac){
            cls.push("ext-mac");
        }
        if(Ext.isLinux){
            cls.push("ext-linux");
        }
        if(Ext.isBorderBox){
            cls.push('ext-border-box');
        }
        if(Ext.isStrict){ // add to the parent to allow for selectors like ".ext-strict .ext-ie"
            var p = bd.parentNode;
            if(p){
                p.className += ' ext-strict';
            }
        }
        bd.className += cls.join(' ');
        return true;
    }

    if(!initExtCss()){
        Ext.onReady(initExtCss);
    }
})();



Ext.EventObject = function(){
    var E = Ext.lib.Event,
    	// safari keypress events for special keys return bad keycodes
    	safariKeys = {
	        3 : 13, // enter
	        63234 : 37, // left
	        63235 : 39, // right
	        63232 : 38, // up
	        63233 : 40, // down
	        63276 : 33, // page up
	        63277 : 34, // page down
	        63272 : 46, // delete
	        63273 : 36, // home
	        63275 : 35  // end
    	},
    	// normalize button clicks
    	btnMap = Ext.isIE ? {1:0,4:1,2:2} :
                (Ext.isWebKit ? {1:0,2:1,3:2} : {0:0,1:1,2:2});

    Ext.EventObjectImpl = function(e){
        if(e){
            this.setEvent(e.browserEvent || e);
        }
    };

    Ext.EventObjectImpl.prototype = {
           
        setEvent : function(e){
	        var me = this;
            if(e == me || (e && e.browserEvent)){ // already wrapped
                return e;
            }
            me.browserEvent = e;
            if(e){
                // normalize buttons
                me.button = e.button ? btnMap[e.button] : (e.which ? e.which - 1 : -1);
                if(e.type == 'click' && me.button == -1){
                    me.button = 0;
                }
                me.type = e.type;
                me.shiftKey = e.shiftKey;
                // mac metaKey behaves like ctrlKey
                me.ctrlKey = e.ctrlKey || e.metaKey || false;
                me.altKey = e.altKey;
                // in getKey these will be normalized for the mac
                me.keyCode = e.keyCode;
                me.charCode = e.charCode;
                // cache the target for the delayed and or buffered events
                me.target = E.getTarget(e);
                // same for XY
                me.xy = E.getXY(e);
            }else{
                me.button = -1;
                me.shiftKey = false;
                me.ctrlKey = false;
                me.altKey = false;
                me.keyCode = 0;
                me.charCode = 0;
                me.target = null;
                me.xy = [0, 0];
            }
            return me;
        },

        
        stopEvent : function(){
	        var me = this;
            if(me.browserEvent){
                if(me.browserEvent.type == 'mousedown'){
                    Ext.EventManager.stoppedMouseDownEvent.fire(me);
                }
                E.stopEvent(me.browserEvent);
            }
        },

        
        preventDefault : function(){
            if(this.browserEvent){
                E.preventDefault(this.browserEvent);
            }
        },        

        
        stopPropagation : function(){
	        var me = this;
            if(me.browserEvent){
                if(me.browserEvent.type == 'mousedown'){
                    Ext.EventManager.stoppedMouseDownEvent.fire(me);
                }
                E.stopPropagation(me.browserEvent);
            }
        },

        
        getCharCode : function(){
            return this.charCode || this.keyCode;
        },

        
        getKey : function(){
            return this.normalizeKey(this.keyCode || this.charCode)
        },
		
		// private
		normalizeKey: function(k){
			return Ext.isSafari ? (safariKeys[k] || k) : k; 
		},

        
        getPageX : function(){
            return this.xy[0];
        },

        
        getPageY : function(){
            return this.xy[1];
        },

//         
//         getTime : function(){
//             if(this.browserEvent){
//                 return E.getTime(this.browserEvent);
//             }
//             return null;
//         },

        
        getXY : function(){
            return this.xy;
        },

        
        getTarget : function(selector, maxDepth, returnEl){
            return selector ? Ext.fly(this.target).findParent(selector, maxDepth, returnEl) : (returnEl ? Ext.get(this.target) : this.target);
        },

        
        getRelatedTarget : function(){
            return this.browserEvent ? E.getRelatedTarget(this.browserEvent) : null;
        },

        
        getWheelDelta : function(){
            var e = this.browserEvent;
            var delta = 0;
            if(e.wheelDelta){ 
                delta = e.wheelDelta/120;
            }else if(e.detail){ 
                delta = -e.detail/3;
            }
            return delta;
        },
		
		
		within : function(el, related, allowEl){
            if(el){
			    var t = this[related ? "getRelatedTarget" : "getTarget"]();
			    return t && ((allowEl ? (t == Ext.getDom(el)) : false) || Ext.fly(el).contains(t));
            }
            return false;
		}
	 };

    return new Ext.EventObjectImpl();
}();

(function(){
var DOC = document;

Ext.Element = function(element, forceNew){
    var dom = typeof element == "string" ?
              DOC.getElementById(element) : element,
        id;

    if(!dom) return null;

    id = dom.id;

    if(!forceNew && id && Ext.Element.cache[id]){ // element object already exists
        return Ext.Element.cache[id];
    }

    
    this.dom = dom;

    
    this.id = id || Ext.id(dom);
};

var D = Ext.lib.Dom,
    DH = Ext.DomHelper,
    E = Ext.lib.Event,
    A = Ext.lib.Anim,
    El = Ext.Element;

El.prototype = {
    
    set : function(o, useSet){
        var el = this.dom,
            attr,
            val;        
       
        for(attr in o){
            val = o[attr];
            if (attr != "style" && !Ext.isFunction(val)) {
                if (attr == "cls" ) {
                    el.className = val;
                } else if (o.hasOwnProperty(attr)) {
                    if (useSet || !!el.setAttribute) el.setAttribute(attr, val);
                    else el[attr] = val;
                }
            }
        }
        if(o.style){
            Ext.DomHelper.applyStyles(el, o.style);
        }
        return this;
    },
    
//  Mouse events
    
    
    
    
    
    
    
    
    
    
//  Keyboard events
    
    
    


//  HTML frame/object events
    
    
    
    
    
    

//  Form events
    
    
    
    
    
    

//  User Interface events
    
    
    

//  DOM Mutation events
    
    
    
    
    
    
    

    
    defaultUnit : "px",

    
    is : function(simpleSelector){
        return Ext.DomQuery.is(this.dom, simpleSelector);
    },

    
    focus : function(defer,  dom) {
        var me = this,
            dom = dom || me.dom;
        try{
            if(Number(defer)){
                me.focus.defer(defer, null, [null, dom]);
            }else{
                dom.focus();
            }
        }catch(e){}
        return me;
    },

    
    blur : function() {
        try{
            this.dom.blur();
        }catch(e){}
        return this;
    },

    
    getValue : function(asNumber){
        var val = this.dom.value;
        return asNumber ? parseInt(val, 10) : val;
    },

    
    addListener : function(eventName, fn, scope, options){
        Ext.EventManager.on(this.dom,  eventName, fn, scope || this, options);
        return this;
    },

    
    removeListener : function(eventName, fn, scope){
        Ext.EventManager.removeListener(this.dom,  eventName, fn, scope || this);
        return this;
    },

    
    removeAllListeners : function(){
        Ext.EventManager.removeAll(this.dom);
        return this;
    },

    
    addUnits : function(size){
        if(size === "" || size == "auto" || size === undefined){
            size = size || '';
        } else if(!isNaN(size) || !unitPattern.test(size)){
            size = size + (this.defaultUnit || 'px');
        }
        return size;
    },

    
    load : function(url, params, cb){
        Ext.Ajax.request(Ext.apply({
            params: params,
            url: url.url || url,
            callback: cb,
            el: this.dom,
            indicatorText: url.indicatorText || ''
        }, Ext.isObject(url) ? url : {}));
        return this;
    },

    
    isBorderBox : function(){
        return noBoxAdjust[(this.dom.tagName || "").toLowerCase()] || Ext.isBorderBox;
    },

    
    remove : function(){
        var me = this,
            dom = me.dom;
        
        me.removeAllListeners();
        delete El.cache[dom.id];
        delete El.dataCache[dom.id]
        Ext.removeNode(dom);
    },

    
    hover : function(overFn, outFn, scope, options){
        var me = this;
        me.on('mouseenter', overFn, scope || me.dom, options);
        me.on('mouseleave', outFn, scope || me.dom, options);
        return me;
    },

    
    contains : function(el){
        return !el ? false : Ext.lib.Dom.isAncestor(this.dom, el.dom ? el.dom : el);
    },

    
    getAttributeNS : function(ns, name){
        return this.getAttribute(name, ns); 
    },
    
    
    getAttribute : Ext.isIE ? function(name, ns){
        var d = this.dom,
            type = typeof d[ns + ":" + name];

        if(['undefined', 'unknown'].indexOf(type) == -1){
            return d[ns + ":" + name];
        }
        return d[name];
    } : function(name, ns){
        var d = this.dom;
        return d.getAttributeNS(ns, name) || d.getAttribute(ns + ":" + name) || d.getAttribute(name) || d[name];
    },
    
    update : function(html) {
        this.dom.innerHTML = html;
    }
};

var ep = El.prototype;

El.addMethods = function(o){
   Ext.apply(ep, o);
};


ep.on = ep.addListener;


ep.un = ep.removeListener;


ep.autoBoxAdjust = true;

// private
var unitPattern = /\d+(px|em|%|en|ex|pt|in|cm|mm|pc)$/i,
    docEl;


El.cache = {};
El.dataCache = {};


El.get = function(el){
    var ex,
        elm,
        id;
    if(!el){ return null; }
    if (typeof el == "string") { // element id
        if (!(elm = DOC.getElementById(el))) {
            return null;
        }
        if (ex = El.cache[el]) {
            ex.dom = elm;
        } else {
            ex = El.cache[el] = new El(elm);
        }
        return ex;
    } else if (el.tagName) { // dom element
        if(!(id = el.id)){
            id = Ext.id(el);
        }
        if(ex = El.cache[id]){
            ex.dom = el;
        }else{
            ex = El.cache[id] = new El(el);
        }
        return ex;
    } else if (el instanceof El) {
        if(el != docEl){
            el.dom = DOC.getElementById(el.id) || el.dom; // refresh dom element in case no longer valid,
                                                          // catch case where it hasn't been appended
            El.cache[el.id] = el; // in case it was created directly with Element(), let's cache it
        }
        return el;
    } else if(el.isComposite) {
        return el;
    } else if(Ext.isArray(el)) {
        return El.select(el);
    } else if(el == DOC) {
        // create a bogus element object representing the document object
        if(!docEl){
            var f = function(){};
            f.prototype = El.prototype;
            docEl = new f();
            docEl.dom = DOC;
        }
        return docEl;
    }
    return null;
};

// private method for getting and setting element data
El.data = function(el, key, value){
    var c = El.dataCache[el.id];
    if(!c){
        c = El.dataCache[el.id] = {};
    }
    if(arguments.length == 2){
        return c[key];    
    }else{
        c[key] = value;
    }
};

// private
// Garbage collection - uncache elements/purge listeners on orphaned elements
// so we don't hold a reference and cause the browser to retain them
function garbageCollect(){
    if(!Ext.enableGarbageCollector){
        clearInterval(El.collectorThread);
    } else {
        var eid,
            el,
            d;

        for(eid in El.cache){
            el = El.cache[eid];
            d = el.dom;
            // -------------------------------------------------------
            // Determining what is garbage:
            // -------------------------------------------------------
            // !d
            // dom node is null, definitely garbage
            // -------------------------------------------------------
            // !d.parentNode
            // no parentNode == direct orphan, definitely garbage
            // -------------------------------------------------------
            // !d.offsetParent && !document.getElementById(eid)
            // display none elements have no offsetParent so we will
            // also try to look it up by it's id. However, check
            // offsetParent first so we don't do unneeded lookups.
            // This enables collection of elements that are not orphans
            // directly, but somewhere up the line they have an orphan
            // parent.
            // -------------------------------------------------------
            if(!d || !d.parentNode || (!d.offsetParent && !DOC.getElementById(eid))){
                delete El.cache[eid];
                if(d && Ext.enableListenerCollection){
                    Ext.EventManager.removeAll(d);
                }
            }
        }
    }
}
El.collectorThreadId = setInterval(garbageCollect, 30000);

var flyFn = function(){};
flyFn.prototype = El.prototype;

// dom is optional
El.Flyweight = function(dom){
    this.dom = dom;
};

El.Flyweight.prototype = new flyFn();
El.Flyweight.prototype.isFlyweight = true;
El._flyweights = {};


El.fly = function(el, named){
    var ret = null;
    named = named || '_global';

    if (el = Ext.getDom(el)) {
        (El._flyweights[named] = El._flyweights[named] || new El.Flyweight()).dom = el;
        ret = El._flyweights[named];
    }
    return ret;
};


Ext.get = El.get;


Ext.fly = El.fly;

// speedy lookup for elements never to box adjust
var noBoxAdjust = Ext.isStrict ? {
    select:1
} : {
    input:1, select:1, textarea:1
};
if(Ext.isIE || Ext.isGecko){
    noBoxAdjust['button'] = 1;
}


Ext.EventManager.on(window, 'unload', function(){
    delete El.cache;
    delete El.dataCache;
    delete El._flyweights;
});
})();


Ext.Element.addMethods(function(){
	var PARENTNODE = 'parentNode',
		NEXTSIBLING = 'nextSibling',
		PREVIOUSSIBLING = 'previousSibling',
		DQ = Ext.DomQuery,
		GET = Ext.get;
	
	return {
		
	    findParent : function(simpleSelector, maxDepth, returnEl){
	        var p = this.dom,
	        	b = document.body, 
	        	depth = 0, 	        	
	        	stopEl;	        
            if(Ext.isGecko && Object.prototype.toString.call(p) == '[object XULElement]') {
                return null;
            }
	        maxDepth = maxDepth || 50;
	        if (isNaN(maxDepth)) {
	            stopEl = Ext.getDom(maxDepth);
	            maxDepth = 10;
	        }
	        while(p && p.nodeType == 1 && depth < maxDepth && p != b && p != stopEl){
	            if(DQ.is(p, simpleSelector)){
	                return returnEl ? GET(p) : p;
	            }
	            depth++;
	            p = p.parentNode;
	        }
	        return null;
	    },
	
	    
	    findParentNode : function(simpleSelector, maxDepth, returnEl){
	        var p = Ext.fly(this.dom.parentNode, '_internal');
	        return p ? p.findParent(simpleSelector, maxDepth, returnEl) : null;
	    },
	
	    
	    up : function(simpleSelector, maxDepth){
	        return this.findParentNode(simpleSelector, maxDepth, true);
	    },
	
	    
	    select : function(selector, unique){
	        return Ext.Element.select(selector, unique, this.dom);
	    },
	
	    
	    query : function(selector, unique){
	        return DQ.select(selector, this.dom);
	    },
	
	    
	    child : function(selector, returnDom){
	        var n = DQ.selectNode(selector, this.dom);
	        return returnDom ? n : GET(n);
	    },
	
	    
	    down : function(selector, returnDom){
	        var n = DQ.selectNode(" > " + selector, this.dom);
	        return returnDom ? n : GET(n);
	    },
	
		 
	    parent : function(selector, returnDom){
	        return this.matchNode(PARENTNODE, PARENTNODE, selector, returnDom);
	    },
	
	     
	    next : function(selector, returnDom){
	        return this.matchNode(NEXTSIBLING, NEXTSIBLING, selector, returnDom);
	    },
	
	    
	    prev : function(selector, returnDom){
	        return this.matchNode(PREVIOUSSIBLING, PREVIOUSSIBLING, selector, returnDom);
	    },
	
	
	    
	    first : function(selector, returnDom){
	        return this.matchNode(NEXTSIBLING, 'firstChild', selector, returnDom);
	    },
	
	    
	    last : function(selector, returnDom){
	        return this.matchNode(PREVIOUSSIBLING, 'lastChild', selector, returnDom);
	    },
	    
	    matchNode : function(dir, start, selector, returnDom){
	        var n = this.dom[start];
	        while(n){
	            if(n.nodeType == 1 && (!selector || DQ.is(n, selector))){
	                return !returnDom ? GET(n) : n;
	            }
	            n = n[dir];
	        }
	        return null;
	    }	
    }
}());

Ext.Element.addMethods(
function() {
	var GETDOM = Ext.getDom,
		GET = Ext.get,
		DH = Ext.DomHelper,
        isEl = function(el){
            return  (el.nodeType || el.dom || typeof el == 'string');  
        };
	
	return {
	    
	    appendChild: function(el){        
	        return GET(el).appendTo(this);        
	    },
	
	    
	    appendTo: function(el){        
	        GETDOM(el).appendChild(this.dom);        
	        return this;
	    },
	
	    
	    insertBefore: function(el){  	          
	        (el = GETDOM(el)).parentNode.insertBefore(this.dom, el);
	        return this;
	    },
	
	    
	    insertAfter: function(el){
	        (el = GETDOM(el)).parentNode.insertBefore(this.dom, el.nextSibling);
	        return this;
	    },
	
	    
	    insertFirst: function(el, returnDom){
            el = el || {};
            if(isEl(el)){ // element
                el = GETDOM(el);
                this.dom.insertBefore(el, this.dom.firstChild);
                return !returnDom ? GET(el) : el;
            }else{ // dh config
                return this.createChild(el, this.dom.firstChild, returnDom);
            }
    },
	
	    
	    replace: function(el){
	        el = GET(el);
	        this.insertBefore(el);
	        el.remove();
	        return this;
	    },
	
	    
	    replaceWith: function(el){
		    var me = this,
		    	Element = Ext.Element;
            if(isEl(el)){
                el = GETDOM(el);
                me.dom.parentNode.insertBefore(el, me.dom);
            }else{
                el = DH.insertBefore(me.dom, el);
            }
	        
	        delete Element.cache[me.id];
	        Ext.removeNode(me.dom);      
	        me.id = Ext.id(me.dom = el);
	        return Element.cache[me.id] = me;        
	    },
	    
		
		createChild: function(config, insertBefore, returnDom){
		    config = config || {tag:'div'};
		    return insertBefore ? 
		    	   DH.insertBefore(insertBefore, config, returnDom !== true) :	
		    	   DH[!this.dom.firstChild ? 'overwrite' : 'append'](this.dom, config,  returnDom !== true);
		},
		
		
		wrap: function(config, returnDom){        
		    var newEl = DH.insertBefore(this.dom, config || {tag: "div"}, !returnDom);
		    newEl.dom ? newEl.dom.appendChild(this.dom) : newEl.appendChild(this.dom);
		    return newEl;
		},
		
		
		insertHtml : function(where, html, returnEl){
		    var el = DH.insertHtml(where, this.dom, html);
		    return returnEl ? Ext.get(el) : el;
		}
	}
}());

Ext.Element.addMethods(function(){  
    // local style camelizing for speed
    var propCache = {},
        camelRe = /(-[a-z])/gi,
        classReCache = {},
        view = document.defaultView,
        propFloat = Ext.isIE ? 'styleFloat' : 'cssFloat',
        opacityRe = /alpha\(opacity=(.*)\)/i,
        trimRe = /^\s+|\s+$/g,
        EL = Ext.Element,   
        PADDING = "padding",
        MARGIN = "margin",
        BORDER = "border",
        LEFT = "-left",
        RIGHT = "-right",
        TOP = "-top",
        BOTTOM = "-bottom",
        WIDTH = "-width",       
        // special markup used throughout Ext when box wrapping elements    
        borders = {l: BORDER + LEFT + WIDTH, r: BORDER + RIGHT + WIDTH, t: BORDER + TOP + WIDTH, b: BORDER + BOTTOM + WIDTH},
        paddings = {l: PADDING + LEFT, r: PADDING + RIGHT, t: PADDING + TOP, b: PADDING + BOTTOM},
        margins = {l: MARGIN + LEFT, r: MARGIN + RIGHT, t: MARGIN + TOP, b: MARGIN + BOTTOM},
        data = Ext.Element.data;
        
    
    // private  
    function camelFn(m, a) {
        return a.charAt(1).toUpperCase();
    }
    
    // private (needs to be called => addStyles.call(this, sides, styles))
    function addStyles(sides, styles){
        var val = 0;    
        
        Ext.each(sides.match(/\w/g), function(s) {
            if (s = parseInt(this.getStyle(styles[s]), 10)) {
                val += Math.abs(s);      
            }
        },
        this);
        return val;
    }

    function chkCache(prop) {
        return propCache[prop] || (propCache[prop] = prop == 'float' ? propFloat : prop.replace(camelRe, camelFn));

    }
            
    return {    
        // private  ==> used by Fx  
        adjustWidth : function(width) {
            var me = this;      
            if(typeof width == "number" && me.autoBoxAdjust && !me.isBorderBox()){
               width -= (me.getBorderWidth("lr") + me.getPadding("lr"));
               width = width < 0 ? 0 : width;
            }
            return width;
        },
        
        // private   ==> used by Fx 
        adjustHeight : function(height) {
            var me = this;      
            if(typeof height == "number" && me.autoBoxAdjust && !me.isBorderBox()){
               height -= (me.getBorderWidth("tb") + me.getPadding("tb"));
               height = height < 0 ? 0 : height;
            }
            return height;
        },
    
    
        
        addClass : function(className){
            var me = this;
            Ext.each(className, function(v) {
                me.dom.className += (!me.hasClass(v) && v ? " " + v : "");  
            });
            return me;
        },
    
        
        radioClass : function(className){
            Ext.each(this.dom.parentNode.childNodes, function(v) {
                if(v.nodeType == 1) {
                    Ext.fly(v).removeClass(className);          
                }
            });
            return this.addClass(className);
        },
    
        
        removeClass : function(className){
            var me = this;
            if (me.dom.className) {
                Ext.each(className, function(v) {               
                    me.dom.className = me.dom.className.replace(
                        classReCache[v] = classReCache[v] || new RegExp('(?:^|\\s+)' + v + '(?:\\s+|$)', "g"), 
                        " ");               
                });    
            }
            return me;
        },
    
        
        toggleClass : function(className){
            return this.hasClass(className) ? this.removeClass(className) : this.addClass(className);
        },
    
        
        hasClass : function(className){
            return className && (' '+this.dom.className+' ').indexOf(' '+className+' ') != -1;
        },
    
        
        replaceClass : function(oldClassName, newClassName){
            return this.removeClass(oldClassName).addClass(newClassName);
        },
        
        isStyle : function(style, val) {
            return this.getStyle(style) == val;  
        },
    
        
        getStyle : function(){         
            return view && view.getComputedStyle ?
                function(prop){
                    var el = this.dom,
                        v,                  
                        cs;
                    if(el == document) return null;
                    prop = chkCache(prop);
                    return (v = el.style[prop]) ? v : 
                           (cs = view.getComputedStyle(el, "")) ? cs[prop] : null;
                } :
                function(prop){      
                    var el = this.dom, 
                        m, 
                        cs;     
                        
                    if(el == document) return null;      
                    if (prop == 'opacity') {
                        if (el.style.filter.match) {                       
                            if(m = el.style.filter.match(opacityRe)){
                                var fv = parseFloat(m[1]);
                                if(!isNaN(fv)){
                                    return fv ? fv / 100 : 0;
                                }
                            }
                        }
                        return 1;
                    }
                    prop = chkCache(prop);  
                    return el.style[prop] || ((cs = el.currentStyle) ? cs[prop] : null);
                };
        }(),
        
        
        getColor : function(attr, defaultValue, prefix){
            var h, 
                v = this.getStyle(attr),
                color = prefix || "#";
            
            if(!v || v == "transparent" || v == "inherit") {
                return defaultValue;
            }             
            if (/^r/.test(v)) {             
                Ext.each(v.slice(4, v.length -1).split(","), function(s) {
                    h = (s * 1).toString(16);
                    color += h < 16 ? "0" + h : h;
                });
            } else {
                color += v.replace("#","").replace(/^(\w)(\w)(\w)$/, "$1$1$2$2$3$3");
            }           
            return color.length > 5 ? color.toLowerCase() : defaultValue;
        },
    
        
        setStyle : function(prop, value){
            var tmp, 
                style,
                camel;
            if (!Ext.isObject(prop)) {
                tmp = {};
                tmp[prop] = value;          
                prop = tmp;
            }
            for (style in prop) {
                value = prop[style];            
                style == 'opacity' ? 
                    this.setOpacity(value) : 
                    this.dom.style[chkCache(style)] = value;
            }
            return this;
        },
        
        
         setOpacity : function(opacity, animate){
            var me = this,
                s = me.dom.style;
                
            if(!animate || !me.anim){            
                if(Ext.isIE){
                    var opac = opacity < 1 ? 'alpha(opacity=' + opacity * 100 + ')' : '', 
                    val = s.filter.replace(opacityRe, '').replace(trimRe, '');

                    s.zoom = 1;
                    s.filter = val + (val.length > 0 ? ' ' : '') + opac;
                }else{
                    s.opacity = opacity;
                }
            }else{
                me.anim({opacity: {to: opacity}}, me.preanim(arguments, 1), null, .35, 'easeIn');
            }
            return me;
        },
        
        
        clearOpacity : function(){
            var style = this.dom.style;
            if(Ext.isIE){
                if(!Ext.isEmpty(style.filter)){
                    style.filter = style.filter.replace(opacityRe, '').replace(trimRe, '');
                }
            }else{
                style.opacity = style['-moz-opacity'] = style['-khtml-opacity'] = '';
            }
            return this;
        },
    
        
        getHeight : function(contentHeight){
            var h = this.dom.offsetHeight || 0;
            h = !contentHeight ? h : h - this.getBorderWidth("tb") - this.getPadding("tb");
            return h < 0 ? 0 : h;
        },
    
        
        getWidth : function(contentWidth){
            var w = this.dom.offsetWidth || 0;
            w = !contentWidth ? w : w - this.getBorderWidth("lr") - this.getPadding("lr");
            return w < 0 ? 0 : w;
        },
    
        
        setWidth : function(width, animate){
            var me = this;
            width = me.adjustWidth(width);
            !animate || !me.anim ? 
                me.dom.style.width = me.addUnits(width) :
                me.anim({width : {to : width}}, me.preanim(arguments, 1));
            return me;
        },
    
        
         setHeight : function(height, animate){
            var me = this;
            height = me.adjustHeight(height);
            !animate || !me.anim ? 
                me.dom.style.height = me.addUnits(height) :
                me.anim({height : {to : height}}, me.preanim(arguments, 1));
            return me;
        },
        
        
        getBorderWidth : function(side){
            return addStyles.call(this, side, borders);
        },
    
        
        getPadding : function(side){
            return addStyles.call(this, side, paddings);
        },
    
        
        clip : function(){
            var me = this
                dom = me.dom;
                
            if(!data(dom, 'isClipped')){
                data(dom, 'isClipped', true);
                data(dom, 'originalClip,', {
                    o: me.getStyle("overflow"),
                    x: me.getStyle("overflow-x"),
                    y: me.getStyle("overflow-y")
                });
                me.setStyle("overflow", "hidden");
                me.setStyle("overflow-x", "hidden");
                me.setStyle("overflow-y", "hidden");
            }
            return me;
        },
    
        
        unclip : function(){
            var me = this,
                dom = me.dom;
                
            if(data(dom, 'isClipped')){
                data(dom, 'isClipped', false);
                var o = data(dom, 'originalClip');
                if(o.o){
                    me.setStyle("overflow", o.o);
                }
                if(o.x){
                    me.setStyle("overflow-x", o.x);
                }
                if(o.y){
                    me.setStyle("overflow-y", o.y);
                }
            }
            return me;
        },
        
        addStyles : addStyles,
        margins : margins
    }
}()         
);

(function(){
var D = Ext.lib.Dom,
        LEFT = "left",
        RIGHT = "right",
        TOP = "top",
        BOTTOM = "bottom",
        POSITION = "position",
        STATIC = "static",
        RELATIVE = "relative",
        AUTO = "auto",
        ZINDEX = "z-index";

function animTest(args, animate, i) {
	return this.preanim && !!animate ? this.preanim(args, i) : false	
}

Ext.Element.addMethods({
	
    getX : function(){
        return D.getX(this.dom);
    },

    
    getY : function(){
        return D.getY(this.dom);
    },

    
    getXY : function(){
        return D.getXY(this.dom);
    },

    
    getOffsetsTo : function(el){
        var o = this.getXY(),
        	e = Ext.fly(el, '_internal').getXY();
        return [o[0]-e[0],o[1]-e[1]];
    },

    
    setX : function(x, animate){	    
	    return this.setXY([x, this.getY()], animTest.call(this, arguments, animate, 1));
    },

    
    setY : function(y, animate){	    
	    return this.setXY([this.getX(), y], animTest.call(this, arguments, animate, 1));
    },

    
    setLeft : function(left){
        this.setStyle(LEFT, this.addUnits(left));
        return this;
    },

    
    setTop : function(top){
        this.setStyle(TOP, this.addUnits(top));
        return this;
    },

    
    setRight : function(right){
        this.setStyle(RIGHT, this.addUnits(right));
        return this;
    },

    
    setBottom : function(bottom){
        this.setStyle(BOTTOM, this.addUnits(bottom));
        return this;
    },

    
    setXY : function(pos, animate){
	    var me = this;
        if(!animate || !me.anim){
            D.setXY(me.dom, pos);
        }else{
            me.anim({points: {to: pos}}, me.preanim(arguments, 1), 'motion');
        }
        return me;
    },

    
    setLocation : function(x, y, animate){
        return this.setXY([x, y], animTest.call(this, arguments, animate, 2));
    },

    
    moveTo : function(x, y, animate){
        return this.setXY([x, y], animTest.call(this, arguments, animate, 2));        
    },    
    
    
    getLeft : function(local){
	    return !local ? this.getX() : parseInt(this.getStyle(LEFT), 10) || 0;
    },

    
    getRight : function(local){
	    var me = this;
	    return !local ? me.getX() + me.getWidth() : (me.getLeft(true) + me.getWidth()) || 0;
    },

    
    getTop : function(local) {
	    return !local ? this.getY() : parseInt(this.getStyle(TOP), 10) || 0;
    },

    
    getBottom : function(local){
	    var me = this;
	    return !local ? me.getY() + me.getHeight() : (me.getTop(true) + me.getHeight()) || 0;
    },

    
    position : function(pos, zIndex, x, y){
	    var me = this;
	    
        if(!pos && me.isStyle(POSITION, STATIC)){           
            me.setStyle(POSITION, RELATIVE);           
        } else if(pos) {
            me.setStyle(POSITION, pos);
        }
        if(zIndex){
            me.setStyle(ZINDEX, zIndex);
        }
        if(x || y) me.setXY([x || false, y || false]);
    },

    
    clearPositioning : function(value){
        value = value || '';
        this.setStyle({
            left : value,
            right : value,
            top : value,
            bottom : value,
            "z-index" : "",
            position : STATIC
        });
        return this;
    },

    
    getPositioning : function(){
        var l = this.getStyle(LEFT);
        var t = this.getStyle(TOP);
        return {
            "position" : this.getStyle(POSITION),
            "left" : l,
            "right" : l ? "" : this.getStyle(RIGHT),
            "top" : t,
            "bottom" : t ? "" : this.getStyle(BOTTOM),
            "z-index" : this.getStyle(ZINDEX)
        };
    },
    
    
    setPositioning : function(pc){
	    var me = this,
	    	style = me.dom.style;
	    	
        me.setStyle(pc);
        
        if(pc.right == AUTO){
            style.right = "";
        }
        if(pc.bottom == AUTO){
            style.bottom = "";
        }
        
        return me;
    },    
	
    
    translatePoints : function(x, y){        	     
	    y = isNaN(x[1]) ? y : x[1];
        x = isNaN(x[0]) ? x : x[0];
        var me = this,
        	relative = me.isStyle(POSITION, RELATIVE),
        	o = me.getXY(),
        	l = parseInt(me.getStyle(LEFT), 10),
        	t = parseInt(me.getStyle(TOP), 10);
        
        l = !isNaN(l) ? l : (relative ? 0 : me.dom.offsetLeft);
        t = !isNaN(t) ? t : (relative ? 0 : me.dom.offsetTop);        

        return {left: (x - o[0] + l), top: (y - o[1] + t)}; 
    },
    
    animTest : animTest
});
})();

Ext.Element.addMethods({
    
    isScrollable : function(){
        var dom = this.dom;
        return dom.scrollHeight > dom.clientHeight || dom.scrollWidth > dom.clientWidth;
    },

    
    scrollTo : function(side, value){
        this.dom["scroll" + (/top/i.test(side) ? "Top" : "Left")] = value;
        return this;
    },

    
    getScroll : function(){
        var d = this.dom, 
            doc = document,
            body = doc.body,
            docElement = doc.documentElement,
            l,
            t,
            ret;

        if(d == doc || d == body){
            if(Ext.isIE && Ext.isStrict){
                l = docElement.scrollLeft; 
                t = docElement.scrollTop;
            }else{
                l = window.pageXOffset;
                t = window.pageYOffset;
            }
            ret = {left: l || (body ? body.scrollLeft : 0), top: t || (body ? body.scrollTop : 0)};
        }else{
            ret = {left: d.scrollLeft, top: d.scrollTop};
        }
        return ret;
    }
});


Ext.Element.VISIBILITY = 1;

Ext.Element.DISPLAY = 2;

Ext.Element.addMethods(function(){
    var VISIBILITY = "visibility",
        DISPLAY = "display",
        HIDDEN = "hidden",
        NONE = "none",      
        ORIGINALDISPLAY = 'originalDisplay',
        VISMODE = 'visibilityMode',
        ELDISPLAY = Ext.Element.DISPLAY,
        data = Ext.Element.data,
        getDisplay = function(dom){
            var d = data(dom, ORIGINALDISPLAY);
            if(d === undefined){
                data(dom, ORIGINALDISPLAY, d = '');
            }
            return d;
        },
        getVisMode = function(dom){
            var m = data(dom, VISMODE);
            if(m === undefined){
                data(dom, VISMODE, m = 1)
            }
            return m;
        };
    
    return {
        
        originalDisplay : "",
        visibilityMode : 1,
        
        
        setVisibilityMode : function(visMode){  
            data(this.dom, VISMODE, visMode);
            return this;
        },
        
        
        animate : function(args, duration, onComplete, easing, animType){       
            this.anim(args, {duration: duration, callback: onComplete, easing: easing}, animType);
            return this;
        },
    
        
        anim : function(args, opt, animType, defaultDur, defaultEase, cb){
            animType = animType || 'run';
            opt = opt || {};
            var me = this,              
                anim = Ext.lib.Anim[animType](
                    me.dom, 
                    args,
                    (opt.duration || defaultDur) || .35,
                    (opt.easing || defaultEase) || 'easeOut',
                    function(){
                        if(cb) cb.call(me);
                        if(opt.callback) opt.callback.call(opt.scope || me, me, opt);
                    },
                    me
                );
            opt.anim = anim;
            return anim;
        },
    
        // private legacy anim prep
        preanim : function(a, i){
            return !a[i] ? false : (Ext.isObject(a[i]) ? a[i]: {duration: a[i+1], callback: a[i+2], easing: a[i+3]});
        },
        
        
        isVisible : function() {
            return !this.isStyle(VISIBILITY, HIDDEN) && !this.isStyle(DISPLAY, NONE);
        },
        
        
         setVisible : function(visible, animate){
            var me = this,
                dom = me.dom,
                isDisplay = getVisMode(this.dom) == ELDISPLAY;
                
            if (!animate || !me.anim) {
                if(isDisplay){
                    me.setDisplayed(visible);
                }else{
                    me.fixDisplay();
                    dom.style.visibility = visible ? "visible" : HIDDEN;
                }
            }else{
                // closure for composites            
                if(visible){
                    me.setOpacity(.01);
                    me.setVisible(true);
                }
                me.anim({opacity: { to: (visible?1:0) }},
                        me.preanim(arguments, 1),
                        null,
                        .35,
                        'easeIn',
                        function(){
                             if(!visible){
                                 dom.style[isDisplay ? DISPLAY : VISIBILITY] = (isDisplay) ? NONE : HIDDEN;                     
                                 Ext.fly(dom).setOpacity(1);
                             }
                        });
            }
            return me;
        },
    
        
        toggle : function(animate){
            var me = this;
            me.setVisible(!me.isVisible(), me.preanim(arguments, 0));
            return me;
        },
    
        
        setDisplayed : function(value) {            
            if(typeof value == "boolean"){
               value = value ? getDisplay(this.dom) : NONE;
            }
            this.setStyle(DISPLAY, value);
            return this;
        },
        
        // private
        fixDisplay : function(){
            var me = this;
            if(me.isStyle(DISPLAY, NONE)){
                me.setStyle(VISIBILITY, HIDDEN);
                me.setStyle(DISPLAY, getDisplay(this.dom)); // first try reverting to default
                if(me.isStyle(DISPLAY, NONE)){ // if that fails, default to block
                    me.setStyle(DISPLAY, "block");
                }
            }
        },
    
        
        hide : function(animate){
            this.setVisible(false, this.preanim(arguments, 0));
            return this;
        },
    
        
        show : function(animate){
            this.setVisible(true, this.preanim(arguments, 0));
            return this;
        }
    }
}());
(function(){
    // contants
    var NULL = null,
        UNDEFINED = undefined,
        TRUE = true,
        FALSE = false,
        SETX = "setX",
        SETY = "setY",
        SETXY = "setXY",
        LEFT = "left",
        BOTTOM = "bottom",
        TOP = "top",
        RIGHT = "right",
        HEIGHT = "height",
        WIDTH = "width",
        POINTS = "points",
        HIDDEN = "hidden",
        ABSOLUTE = "absolute",
        VISIBLE = "visible",
        MOTION = "motion",
        POSITION = "position",
        EASEOUT = "easeOut",
        
        flyEl = new Ext.Element.Flyweight(),
        queues = {},
        getObject = function(o){
            return o || {};
        },
        fly = function(dom){
            flyEl.dom = dom;
            flyEl.id = Ext.id(dom);
            return flyEl;
        },
        
        getQueue = function(id){
            if(!queues[id]){
                queues[id] = [];
            }
            return queues[id];
        },
        setQueue = function(id, value){
            queues[id] = value;
        };
        
//Notifies Element that fx methods are available
Ext.enableFx = TRUE;


Ext.Fx = {
    
    // private - calls the function taking arguments from the argHash based on the key.  Returns the return value of the function.
    //           this is useful for replacing switch statements (for example).
    switchStatements : function(key, fn, argHash){
        return fn.apply(this, argHash[key]);
    },
    
    
    slideIn : function(anchor, o){ 
        o = getObject(o);
        var me = this,
            dom = me.dom,
            st = dom.style,
            xy,
            r,
            b,              
            wrap,               
            after,
            st,
            args, 
            pt,
            bw,
            bh;
            
        anchor = anchor || "t";

        me.queueFx(o, function(){            
            xy = fly(dom).getXY();
            // fix display to visibility
            fly(dom).fixDisplay();            
            
            // restore values after effect
            r = fly(dom).getFxRestore();      
            b = {x: xy[0], y: xy[1], 0: xy[0], 1: xy[1], width: dom.offsetWidth, height: dom.offsetHeight};
            b.right = b.x + b.width;
            b.bottom = b.y + b.height;
            
            // fixed size for slide
            fly(dom).setWidth(b.width).setHeight(b.height);            
            
            // wrap if needed
            wrap = fly(dom).fxWrap(r.pos, o, HIDDEN);
            
            st.visibility = VISIBLE;
            st.position = ABSOLUTE;
            
            // clear out temp styles after slide and unwrap
            function after(){
                 fly(dom).fxUnwrap(wrap, r.pos, o);
                 st.width = r.width;
                 st.height = r.height;
                 fly(dom).afterFx(o);
            }
            
            // time to calculate the positions        
            pt = {to: [b.x, b.y]}; 
            bw = {to: b.width};
            bh = {to: b.height};
                
            function argCalc(wrap, style, ww, wh, sXY, sXYval, s1, s2, w, h, p){                    
                var ret = {};
                fly(wrap).setWidth(ww).setHeight(wh);
                if(fly(wrap)[sXY]){
                    fly(wrap)[sXY](sXYval);                  
                }
                style[s1] = style[s2] = "0";                    
                if(w){
                    ret.width = w
                };
                if(h){
                    ret.height = h;
                }
                if(p){
                    ret.points = p;
                }
                return ret;
            };

            args = fly(dom).switchStatements(anchor.toLowerCase(), argCalc, {
                    t  : [wrap, st, b.width, 0, NULL, NULL, LEFT, BOTTOM, NULL, bh, NULL],
                    l  : [wrap, st, 0, b.height, NULL, NULL, RIGHT, TOP, bw, NULL, NULL],
                    r  : [wrap, st, b.width, b.height, SETX, b.right, LEFT, TOP, NULL, NULL, pt],
                    b  : [wrap, st, b.width, b.height, SETY, b.bottom, LEFT, TOP, NULL, bh, pt],
                    tl : [wrap, st, 0, 0, NULL, NULL, RIGHT, BOTTOM, bw, bh, pt],
                    bl : [wrap, st, 0, 0, SETY, b.y + b.height, RIGHT, TOP, bw, bh, pt],
                    br : [wrap, st, 0, 0, SETXY, [b.right, b.bottom], LEFT, TOP, bw, bh, pt],
                    tr : [wrap, st, 0, 0, SETX, b.x + b.width, LEFT, BOTTOM, bw, bh, pt]
                });
            
            st.visibility = VISIBLE;
            fly(wrap).show();

            arguments.callee.anim = fly(wrap).fxanim(args,
                o,
                MOTION,
                .5,
                EASEOUT, 
                after);
        });
        return me;
    },
    
    
    slideOut : function(anchor, o){
        o = getObject(o);
        var me = this,
            dom = me.dom,
            st = dom.style,
            xy = me.getXY(),
            wrap,
            r,
            b,
            a,
            zero = {to: 0}; 
                    
        anchor = anchor || "t";

        me.queueFx(o, function(){
            
            // restore values after effect
            r = fly(dom).getFxRestore(); 
            b = {x: xy[0], y: xy[1], 0: xy[0], 1: xy[1], width: dom.offsetWidth, height: dom.offsetHeight};
            b.right = b.x + b.width;
            b.bottom = b.y + b.height;
                
            // fixed size for slide   
            fly(dom).setWidth(b.width).setHeight(b.height);

            // wrap if needed
            wrap = fly(dom).fxWrap(r.pos, o, VISIBLE);
                
            st.visibility = VISIBLE;
            st.position = ABSOLUTE;
            fly(wrap).setWidth(b.width).setHeight(b.height);            

            function after(){
                o.useDisplay ? fly(dom).setDisplayed(FALSE) : fly(dom).hide();                
                fly(dom).fxUnwrap(wrap, r.pos, o);
                st.width = r.width;
                st.height = r.height;
                fly(dom).afterFx(o);
            }            
            
            function argCalc(style, s1, s2, p1, v1, p2, v2, p3, v3){                    
                var ret = {};
                
                style[s1] = style[s2] = "0";
                ret[p1] = v1;               
                if(p2){
                    ret[p2] = v2;               
                }
                if(p3){
                    ret[p3] = v3;
                }
                
                return ret;
            };
            
            a = fly(dom).switchStatements(anchor.toLowerCase(), argCalc, {
                t  : [st, LEFT, BOTTOM, HEIGHT, zero],
                l  : [st, RIGHT, TOP, WIDTH, zero],
                r  : [st, LEFT, TOP, WIDTH, zero, POINTS, {to : [b.right, b.y]}],
                b  : [st, LEFT, TOP, HEIGHT, zero, POINTS, {to : [b.x, b.bottom]}],
                tl : [st, RIGHT, BOTTOM, WIDTH, zero, HEIGHT, zero],
                bl : [st, RIGHT, TOP, WIDTH, zero, HEIGHT, zero, POINTS, {to : [b.x, b.bottom]}],
                br : [st, LEFT, TOP, WIDTH, zero, HEIGHT, zero, POINTS, {to : [b.x + b.width, b.bottom]}],
                tr : [st, LEFT, BOTTOM, WIDTH, zero, HEIGHT, zero, POINTS, {to : [b.right, b.y]}]
            });
            
            arguments.callee.anim = fly(wrap).fxanim(a,
                o,
                MOTION,
                .5,
                EASEOUT, 
                after);
        });
        return me;
    },

    
    puff : function(o){
        o = getObject(o);
        var me = this,
            dom = me.dom,
            st = dom.style,
            width,
            height,
            r;

        me.queueFx(o, function(){
            width = fly(dom).getWidth();
            height = fly(dom).getHeight();
            fly(dom).clearOpacity();
            fly(dom).show();

            // restore values after effect
            r = fly(dom).getFxRestore();                   
            
            function after(){
                o.useDisplay ? fly(dom).setDisplayed(FALSE) : fly(dom).hide();                  
                fly(dom).clearOpacity();  
                fly(dom).setPositioning(r.pos);
                st.width = r.width;
                st.height = r.height;
                st.fontSize = '';
                fly(dom).afterFx(o);
            }   

            arguments.callee.anim = fly(dom).fxanim({
                    width : {to : fly(dom).adjustWidth(width * 2)},
                    height : {to : fly(dom).adjustHeight(height * 2)},
                    points : {by : [-width * .5, -height * .5]},
                    opacity : {to : 0},
                    fontSize: {to : 200, unit: "%"}
                },
                o,
                MOTION,
                .5,
                EASEOUT,
                 after);
        });
        return me;
    },

    
    switchOff : function(o){
        o = getObject(o);
        var me = this,
            dom = me.dom,
            st = dom.style,
            r;

        me.queueFx(o, function(){
            fly(dom).clearOpacity();
            fly(dom).clip();

            // restore values after effect
            r = fly(dom).getFxRestore();
                
            function after(){
                o.useDisplay ? fly(dom).setDisplayed(FALSE) : fly(dom).hide();  
                fly(dom).clearOpacity();
                fly(dom).setPositioning(r.pos);
                st.width = r.width;
                st.height = r.height;   
                fly(dom).afterFx(o);
            };

            fly(dom).fxanim({opacity : {to : 0.3}}, 
                NULL, 
                NULL, 
                .1, 
                NULL, 
                function(){                                 
                    fly(dom).clearOpacity();
                        (function(){                            
                            fly(dom).fxanim({
                                height : {to : 1},
                                points : {by : [0, fly(dom).getHeight() * .5]}
                            }, 
                            o, 
                            MOTION, 
                            0.3, 
                            'easeIn', 
                            after);
                        }).defer(100);
                });
        });
        return me;
    },

     
    highlight : function(color, o){
        o = getObject(o);
        var me = this,
            dom = me.dom,
            attr = o.attr || "backgroundColor",
            a = {},
            restore;

        me.queueFx(o, function(){
            fly(dom).clearOpacity();
            fly(dom).show();

            function after(){
                dom.style[attr] = restore;
                fly(dom).afterFx(o);
            }            
            restore = dom.style[attr];
            a[attr] = {from: color || "ffff9c", to: o.endColor || fly(dom).getColor(attr) || "ffffff"};
            arguments.callee.anim = fly(dom).fxanim(a,
                o,
                'color',
                1,
                'easeIn', 
                after);
        });
        return me;
    },

   
    frame : function(color, count, o){
        o = getObject(o);
        var me = this,
            dom = me.dom,
            proxy,
            active;

        me.queueFx(o, function(){
            color = color || "#C3DAF9"
            if(color.length == 6){
                color = "#" + color;
            }            
            count = count || 1;
            fly(dom).show();

            var xy = fly(dom).getXY(),
                b = {x: xy[0], y: xy[1], 0: xy[0], 1: xy[1], width: dom.offsetWidth, height: dom.offsetHeight},
                queue = function(){
                    proxy = fly(document.body || document.documentElement).createChild({
                        style:{
                            visbility: HIDDEN,
                            position : ABSOLUTE,
                            "z-index": 35000, // yee haw
                            border : "0px solid " + color
                        }
                    });
                    return proxy.queueFx({}, animFn);
                };
            
            
            arguments.callee.anim = {
                isAnimated: true,
                stop: function() {
                    count = 0;
                    proxy.stopFx();
                }
            };
            
            function animFn(){
                var scale = Ext.isBorderBox ? 2 : 1;
                active = proxy.anim({
                    top : {from : b.y, to : b.y - 20},
                    left : {from : b.x, to : b.x - 20},
                    borderWidth : {from : 0, to : 10},
                    opacity : {from : 1, to : 0},
                    height : {from : b.height, to : b.height + 20 * scale},
                    width : {from : b.width, to : b.width + 20 * scale}
                },{
                    duration: o.duration || 1,
                    callback: function() {
                        proxy.remove();
                        --count > 0 ? queue() : fly(dom).afterFx(o);
                    }
                });
                arguments.callee.anim = {
                    isAnimated: true,
                    stop: function(){
                        active.stop();
                    }
                };
            };
            queue();
        });
        return me;
    },

   
    pause : function(seconds){        
        var dom = this.dom,
            t;

        this.queueFx({}, function(){
            t = setTimeout(function(){
                fly(dom).afterFx({});
            }, seconds * 1000);
            arguments.callee.anim = {
                isAnimated: true,
                stop: function(){
                    clearTimeout(t);
                    fly(dom).afterFx({});
                }
            };
        });
        return this;
    },

   
    fadeIn : function(o){
        o = getObject(o);
        var me = this,
            dom = me.dom,
            to = o.endOpacity || 1;
        
        me.queueFx(o, function(){
            fly(dom).setOpacity(0);
            fly(dom).fixDisplay();
            dom.style.visibility = VISIBLE;
            arguments.callee.anim = fly(dom).fxanim({opacity:{to:to}},
                o, NULL, .5, EASEOUT, function(){
                if(to == 1){
                    fly(dom).clearOpacity();
                }
                fly(dom).afterFx(o);
            });
        });
        return me;
    },

   
    fadeOut : function(o){
        o = getObject(o);
        var me = this,
            dom = me.dom,
            style = dom.style,
            to = o.endOpacity || 0;         
        
        me.queueFx(o, function(){  
            arguments.callee.anim = fly(dom).fxanim({ 
                opacity : {to : to}},
                o, 
                NULL, 
                .5, 
                EASEOUT, 
                function(){
                    if(to == 0){
                        Ext.Element.data(dom, 'visibilityMode') == Ext.Element.DISPLAY || o.useDisplay ? 
                            style.display = "none" :
                            style.visibility = HIDDEN;
                            
                        fly(dom).clearOpacity();
                    }
                    fly(dom).afterFx(o);
            });
        });
        return me;
    },

   
    scale : function(w, h, o){
        this.shift(Ext.apply({}, o, {
            width: w,
            height: h
        }));
        return this;
    },

   
    shift : function(o){
        o = getObject(o);
        var dom = this.dom,
            a = {};
                
        this.queueFx(o, function(){
            for (var prop in o) {
                if (o[prop] != UNDEFINED) {                                                 
                    a[prop] = {to : o[prop]};                   
                }
            } 
            
            a.width ? a.width.to = fly(dom).adjustWidth(o.width) : a;
            a.height ? a.height.to = fly(dom).adjustWidth(o.height) : a;   
            
            if (a.x || a.y || a.xy) {
                a.points = a.xy || 
                           {to : [ a.x ? a.x.to : fly(dom).getX(),
                                   a.y ? a.y.to : fly(dom).getY()]};                  
            }

            arguments.callee.anim = fly(dom).fxanim(a,
                o, 
                MOTION, 
                .35, 
                EASEOUT, 
                function(){
                    fly(dom).afterFx(o);
                });
        });
        return this;
    },

    
    ghost : function(anchor, o){
        o = getObject(o);
        var me = this,
            dom = me.dom,
            st = dom.style,
            a = {opacity: {to: 0}, points: {}},
            pt = a.points,
            r,
            w,
            h;
            
        anchor = anchor || "b";

        me.queueFx(o, function(){
            // restore values after effect
            r = fly(dom).getFxRestore();
            w = fly(dom).getWidth();
            h = fly(dom).getHeight();
            
            function after(){
                o.useDisplay ? fly(dom).setDisplayed(FALSE) : fly(dom).hide();   
                fly(dom).clearOpacity();
                fly(dom).setPositioning(r.pos);
                st.width = r.width;
                st.height = r.height;
                fly(dom).afterFx(o);
            }
                
            pt.by = fly(dom).switchStatements(anchor.toLowerCase(), function(v1,v2){ return [v1, v2];}, {
               t  : [0, -h],
               l  : [-w, 0],
               r  : [w, 0],
               b  : [0, h],
               tl : [-w, -h],
               bl : [-w, h],
               br : [w, h],
               tr : [w, -h] 
            });
                
            arguments.callee.anim = fly(dom).fxanim(a,
                o,
                MOTION,
                .5,
                EASEOUT, after);
        });
        return me;
    },

    
    syncFx : function(){
        var me = this;
        me.fxDefaults = Ext.apply(me.fxDefaults || {}, {
            block : FALSE,
            concurrent : TRUE,
            stopFx : FALSE
        });
        return me;
    },

    
    sequenceFx : function(){
        var me = this;
        me.fxDefaults = Ext.apply(me.fxDefaults || {}, {
            block : FALSE,
            concurrent : FALSE,
            stopFx : FALSE
        });
        return me;
    },

    
    nextFx : function(){        
        var ef = getQueue(this.dom.id)[0];
        if(ef){
            ef.call(this);
        }
    },

    
    hasActiveFx : function(){
        return getQueue(this.dom.id)[0];
    },

    
    stopFx : function(finish){
        var me = this,
            id = me.dom.id;
        if(me.hasActiveFx()){
            var cur = getQueue(id)[0];
            if(cur && cur.anim){
                if(cur.anim.isAnimated){
                    setQueue(id, [cur]); //clear
                    cur.anim.stop(finish !== undefined ? finish : TRUE);
                }else{
                    setQueue(id, []);
                }
            }
        }
        return me;
    },

    
    beforeFx : function(o){
        if(this.hasActiveFx() && !o.concurrent){
           if(o.stopFx){
               this.stopFx();
               return TRUE;
           }
           return FALSE;
        }
        return TRUE;
    },

    
    hasFxBlock : function(){
        var q = getQueue(this.dom.id);
        return q && q[0] && q[0].block;
    },

    
    queueFx : function(o, fn){
        var me = this;
        if(!me.hasFxBlock()){
            Ext.applyIf(o, me.fxDefaults);
            if(!o.concurrent){
                var run = me.beforeFx(o);
                fn.block = o.block;
                getQueue(me.dom.id).push(fn);
                if(run){
                    me.nextFx();
                }
            }else{
                fn.call(me);
            }
        }
        return me;
    },

    
    fxWrap : function(pos, o, vis){ 
        var dom = this.dom,
            wrap,
            wrapXY;
        if(!o.wrap || !(wrap = Ext.getDom(o.wrap))){            
            if(o.fixPosition){
                wrapXY = fly(dom).getXY();
            }
            var div = document.createElement("div");
            div.style.visibility = vis;
            wrap = dom.parentNode.insertBefore(div, dom);
            fly(wrap).setPositioning(pos);
            if(fly(wrap).isStyle(POSITION, "static")){
                fly(wrap).position("relative");
            }
            fly(dom).clearPositioning('auto');
            fly(wrap).clip();
            wrap.appendChild(dom);
            if(wrapXY){
                fly(wrap).setXY(wrapXY);
            }
        }
        return wrap;
    },

    
    fxUnwrap : function(wrap, pos, o){      
        var dom = this.dom;
        fly(dom).clearPositioning();
        fly(dom).setPositioning(pos);
        if(!o.wrap){
            wrap.parentNode.insertBefore(dom, wrap);
            fly(wrap).remove();
        }
    },

    
    getFxRestore : function(){
        var st = this.dom.style;
        return {pos: this.getPositioning(), width: st.width, height : st.height};
    },

    
    afterFx : function(o){
        var dom = this.dom,
            id = dom.id;
        if(o.afterStyle){
            fly(dom).setStyle(o.afterStyle);            
        }
        if(o.afterCls){
            fly(dom).addClass(o.afterCls);
        }
        if(o.remove == TRUE){
            fly(dom).remove();
        }
        if(o.callback){
            o.callback.call(o.scope, fly(dom));
        }
        if(!o.concurrent){
            getQueue(id).shift();
            fly(dom).nextFx();
        }
    },

    
    fxanim : function(args, opt, animType, defaultDur, defaultEase, cb){
        animType = animType || 'run';
        opt = opt || {};
        var anim = Ext.lib.Anim[animType](
                this.dom, 
                args,
                (opt.duration || defaultDur) || .35,
                (opt.easing || defaultEase) || EASEOUT,
                cb,            
                this
            );
        opt.anim = anim;
        return anim;
    }
};

// backwards compat
Ext.Fx.resize = Ext.Fx.scale;

//When included, Ext.Fx is automatically applied to Element so that all basic
//effects are available directly via the Element API
Ext.Element.addMethods(Ext.Fx);
})();

Ext.CompositeElementLite = function(els, root){
    this.elements = [];
    this.add(els, root);
    this.el = new Ext.Element.Flyweight();
};

Ext.CompositeElementLite.prototype = {
	isComposite: true,	
	
    getCount : function(){
        return this.elements.length;
    },    
	add : function(els){
        if(els){
            if (Ext.isArray(els)) {
                this.elements = this.elements.concat(els);
            } else {
                var yels = this.elements;                	                
	            Ext.each(els, function(e) {
                    yels.push(e);
                });
            }
        }
        return this;
    },
    invoke : function(fn, args){
        var els = this.elements,
        	el = this.el;        
	    Ext.each(els, function(e) {    
            el.dom = e;
        	Ext.Element.prototype[fn].apply(el, args);
        });
        return this;
    },
    
    item : function(index){
	    var me = this;
        if(!me.elements[index]){
            return null;
        }
        me.el.dom = me.elements[index];
        return me.el;
    },

    // fixes scope with flyweight
    addListener : function(eventName, handler, scope, opt){
        Ext.each(this.elements, function(e) {
	        Ext.EventManager.on(e, eventName, handler, scope || e, opt);
        });
        return this;
    },
    
    each : function(fn, scope){       
        var me = this,
        	el = me.el;
       
	    Ext.each(me.elements, function(e,i) {    
            el.dom = e;
        	return fn.call(scope || el, el, me, i);
        });
        return me;
    },
    
    
    indexOf : function(el){
        return this.elements.indexOf(Ext.getDom(el));
    },
    
        
    replaceElement : function(el, replacement, domReplace){
        var index = !isNaN(el) ? el : this.indexOf(el),
        	d;
        if(index > -1){
            replacement = Ext.getDom(replacement);
            if(domReplace){
                d = this.elements[index];
                d.parentNode.insertBefore(replacement, d);
                Ext.removeNode(d);
            }
            this.elements.splice(index, 1, replacement);
        }
        return this;
    },
    
    
    clear : function(){
        this.elements = [];
    }
}

Ext.CompositeElementLite.prototype.on = Ext.CompositeElementLite.prototype.addListener;

(function(){
var fnName,
	ElProto = Ext.Element.prototype,
	CelProto = Ext.CompositeElementLite.prototype;
	
for(var fnName in ElProto){
    if(Ext.isFunction(ElProto[fnName])){
	    (function(fnName){ 
		    CelProto[fnName] = CelProto[fnName] || function(){
		    	return this.invoke(fnName, arguments);
	    	};
    	}).call(CelProto, fnName);
    }
};
})();

if(Ext.DomQuery){
    Ext.Element.selectorFunction = Ext.DomQuery.select;
} 


Ext.Element.select = function(selector, unique, root){
    var els;
    if(typeof selector == "string"){
        els = Ext.Element.selectorFunction(selector, root);
    }else if(selector.length !== undefined){
        els = selector;
    }else{
        throw "Invalid selector";
    }
    return new Ext.CompositeElementLite(els);
};

Ext.select = Ext.Element.select;
(function(){
    var BEFOREREQUEST = "beforerequest",
        REQUESTCOMPLETE = "requestcomplete",
        REQUESTEXCEPTION = "requestexception",
        UNDEFINED = undefined,
        LOAD = 'load',
        POST = 'POST',
        GET = 'GET',
        WINDOW = window;
    
    
    Ext.data.Connection = function(config){    
        Ext.apply(this, config);
        this.addEvents(
            
            BEFOREREQUEST,
            
            REQUESTCOMPLETE,
            
            REQUESTEXCEPTION
        );
        Ext.data.Connection.superclass.constructor.call(this);
    };

    // private
    function handleResponse(response){
        this.transId = false;
        var options = response.argument.options;
        response.argument = options ? options.argument : null;
        this.fireEvent(REQUESTCOMPLETE, this, response, options);
        if(options.success) options.success.call(options.scope, response, options);
        if(options.callback) options.callback.call(options.scope, options, true, response);
    }

    // private
    function handleFailure(response, e){
        this.transId = false;
        var options = response.argument.options;
        response.argument = options ? options.argument : null;
        this.fireEvent(REQUESTEXCEPTION, this, response, options, e);
        if(options.failure) options.failure.call(options.scope, response, options);
        if(options.callback) options.callback.call(options.scope, options, false, response);
    }

    // private
    function doFormUpload(o, ps, url){
        var id = Ext.id(),
            doc = document,
            frame = doc.createElement('iframe'),
            form = Ext.getDom(o.form),
            hiddens = [],
            hd;
            
        frame.id = frame.name = id;         
        frame.className = 'x-hidden';        
        frame.src = Ext.SSL_SECURE_URL; // for IE        
        doc.body.appendChild(frame);

        if(Ext.isIE){
            doc.frames[id].name = id;
        }
        
        form.target = id;
        form.method = POST;
        form.enctype = form.encoding = 'multipart/form-data';        
        form.action = url || "";
        
        // add dynamic params            
        ps = Ext.urlDecode(ps, false);
        for(var k in ps){
            if(ps.hasOwnProperty(k)){
                hd = doc.createElement('input');
                hd.type = 'hidden';                    
                hd.value = ps[hd.name = k];
                form.appendChild(hd);
                hiddens.push(hd);
            }
        }        

        function cb(){
            var me = this,
                // bogus response object
                r = {responseText : '',
                     responseXML : null,
                     argument : o.argument},
                doc,
                firstChild;

            try { 
                doc = frame.contentWindow.document || frame.contentDocument || WINDOW.frames[id].document;
                if (doc) {
                    if (doc.body) {
                        if (/textarea/i.test((firstChild = doc.body.firstChild || {}).tagName)) { // json response wrapped in textarea                        
                            r.responseText = firstChild.value;
                        } else {
                            r.responseText = doc.body.innerHTML;
                        }
                    } else {
                        r.responseXML = doc.XMLDocument || doc;
                       }
                }
            }
            catch(e) {}

            Ext.EventManager.removeListener(frame, LOAD, cb, me);

            me.fireEvent(REQUESTCOMPLETE, me, r, o);

            Ext.callback(o.success, o.scope, [r, o]);
            Ext.callback(o.callback, o.scope, [o, true, r]);

            if(!me.debugUploads){
                setTimeout(function(){Ext.removeNode(frame);}, 100);
            }
        }

        Ext.EventManager.on(frame, LOAD, cb, this);
        form.submit();
        
        Ext.each(hiddens, function(h) {
            Ext.removeNode(h);
        });
    }

    Ext.extend(Ext.data.Connection, Ext.util.Observable, {
        
        
        
        
        
        timeout : 30000,
        
        autoAbort:false,
    
        
        disableCaching: true,
        
        
        disableCachingParam: '_dc',
        
        
        request : function(o){
            var me = this;
            if(me.fireEvent(BEFOREREQUEST, me, o)){
                if (o.el) {
                    if(!Ext.isEmpty(o.indicatorText)){
                        me.indicatorText = '<div class="loading-indicator">'+o.indicatorText+"</div>";
                    }
                    if(me.indicatorText) {
                        Ext.getDom(o.el).innerHTML = me.indicatorText;                        
                    }
                    o.success = (Ext.isFunction(o.success) ? o.success : function(){}).createInterceptor(function(response) {
                        Ext.getDom(o.el).innerHTML = response.responseText;
                    });
                }
                
                var p = o.params,
                    url = o.url || me.url,                
                    method,
                    cb = {success: handleResponse,
                          failure: handleFailure,
                          scope: me,
                          argument: {options: o},
                          timeout : o.timeout || me.timeout
                    },
                    form,                    
                    serForm;                    
                  
                     
                if (Ext.isFunction(p)) {
                    p = p.call(o.scope||WINDOW, o);
                }
                                                           
                p = Ext.urlEncode(me.extraParams, typeof p == 'object' ? Ext.urlEncode(p) : p);    
                
                if (Ext.isFunction(url)) {
                    url = url.call(o.scope || WINDOW, o);
                }
    
                if(form = Ext.getDom(o.form)){
                    url = url || form.action;
                     if(o.isUpload || /multipart\/form-data/i.test(form.getAttribute("enctype"))) { 
                         return doFormUpload.call(me, o, p, url);
                     }
                    serForm = Ext.lib.Ajax.serializeForm(form);                    
                    p = p ? (p + '&' + serForm) : serForm;
                }
                
                method = o.method || me.method || ((p || o.xmlData || o.jsonData) ? POST : GET);
                
                if(method === GET && (me.disableCaching && o.disableCaching !== false) || o.disableCaching === true){
                    var dcp = o.disableCachingParam || me.disableCachingParam;
                    url += (url.indexOf('?') != -1 ? '&' : '?') + dcp + '=' + (new Date().getTime());
                }
                
                o.headers = Ext.apply(o.headers || {}, me.defaultHeaders || {});
                
                if(o.autoAbort === true || me.autoAbort) {
                    me.abort();
                }
                 
                if((method == GET || o.xmlData || o.jsonData) && p){
                    url += (/\?/.test(url) ? '&' : '?') + p;  
                    p = '';
                }
                return me.transId = Ext.lib.Ajax.request(method, url, cb, p, o);
            }else{                
                return o.callback ? o.callback.apply(o.scope, [o,UNDEFINED,UNDEFINED]) : null;
            }
        },
    
        
        isLoading : function(transId){
            return transId ? Ext.lib.Ajax.isCallInProgress(transId) : !! this.transId;            
        },
    
        
        abort : function(transId){
            if(transId || this.isLoading()){
                Ext.lib.Ajax.abort(transId || this.transId);
            }
        }
    });
})();


Ext.Ajax = new Ext.data.Connection({
    
    
    
    
    
    

    

    
    
    
    
    
    

    
    autoAbort : false,

    
    serializeForm : function(form){
        return Ext.lib.Ajax.serializeForm(form);
    }
});


Ext.util.DelayedTask = function(fn, scope, args){
    var me = this,
    	id,    	
    	call = function(){
    		clearInterval(id);
	        id = null;
	        fn.apply(scope, args || []);
	    };
	    
    
    me.delay = function(delay, newFn, newScope, newArgs){
        me.cancel();
        fn = newFn || fn;
        scope = newScope || scope;
        args = newArgs || args;
        id = setInterval(call, delay);
    };

    
    me.cancel = function(){
        if(id){
            clearInterval(id);
            id = null;
        }
    };
};

Ext.util.JSON = new (function(){
    var useHasOwn = !!{}.hasOwnProperty,
        isNative = Ext.USE_NATIVE_JSON && JSON && JSON.toString() == '[object JSON]';

    // crashes Safari in some instances
    //var validRE = /^("(\\.|[^"\\\n\r])*?"|[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t])+?$/;

    var pad = function(n) {
        return n < 10 ? "0" + n : n;
    };

    var m = {
        "\b": '\\b',
        "\t": '\\t',
        "\n": '\\n',
        "\f": '\\f',
        "\r": '\\r',
        '"' : '\\"',
        "\\": '\\\\'
    };

    var encodeString = function(s){
        if (/["\\\x00-\x1f]/.test(s)) {
            return '"' + s.replace(/([\x00-\x1f\\"])/g, function(a, b) {
                var c = m[b];
                if(c){
                    return c;
                }
                c = b.charCodeAt();
                return "\\u00" +
                    Math.floor(c / 16).toString(16) +
                    (c % 16).toString(16);
            }) + '"';
        }
        return '"' + s + '"';
    };

    var encodeArray = function(o){
        var a = ["["], b, i, l = o.length, v;
            for (i = 0; i < l; i += 1) {
                v = o[i];
                switch (typeof v) {
                    case "undefined":
                    case "function":
                    case "unknown":
                        break;
                    default:
                        if (b) {
                            a.push(',');
                        }
                        a.push(v === null ? "null" : Ext.util.JSON.encode(v));
                        b = true;
                }
            }
            a.push("]");
            return a.join("");
    };

    this.encodeDate = function(o){
        return '"' + o.getFullYear() + "-" +
                pad(o.getMonth() + 1) + "-" +
                pad(o.getDate()) + "T" +
                pad(o.getHours()) + ":" +
                pad(o.getMinutes()) + ":" +
                pad(o.getSeconds()) + '"';
    };

    
    this.encode = isNative ? JSON.stringify : function(o){
        if(typeof o == "undefined" || o === null){
            return "null";
        }else if(Ext.isArray(o)){
            return encodeArray(o);
        }else if(Object.prototype.toString.apply(o) === '[object Date]'){
            return Ext.util.JSON.encodeDate(o);
        }else if(typeof o == "string"){
            return encodeString(o);
        }else if(typeof o == "number"){
            return isFinite(o) ? String(o) : "null";
        }else if(typeof o == "boolean"){
            return String(o);
        }else {
            var a = ["{"], b, i, v;
            for (i in o) {
                if(!useHasOwn || o.hasOwnProperty(i)) {
                    v = o[i];
                    switch (typeof v) {
                    case "undefined":
                    case "function":
                    case "unknown":
                        break;
                    default:
                        if(b){
                            a.push(',');
                        }
                        a.push(this.encode(i), ":",
                                v === null ? "null" : this.encode(v));
                        b = true;
                    }
                }
            }
            a.push("}");
            return a.join("");
        }
    };

    
    this.decode = isNative ? JSON.parse : function(json){
        return eval("(" + json + ')');    
    };
})();

Ext.encode = Ext.util.JSON.encode;

Ext.decode = Ext.util.JSON.decode;
/**

 * @class Ext.Element

 */

Ext.Element.addMethods({

    /**

     * Gets the x,y coordinates specified by the anchor position on the element.

     * @param {String} anchor (optional) The specified anchor position (defaults to "c").  See {@link #alignTo}

     * for details on supported anchor positions.

     * @param {Boolean} local (optional) True to get the local (element top/left-relative) anchor position instead

     * of page coordinates

     * @param {Object} size (optional) An object containing the size to use for calculating anchor position

     * {width: (target width), height: (target height)} (defaults to the element's current size)

     * @return {Array} [x, y] An array containing the element's x and y coordinates

     */

    getAnchorXY : function(anchor, local, s){

        //Passing a different size is useful for pre-calculating anchors,

        //especially for anchored animations that change the el size.

		anchor = (anchor || "tl").toLowerCase();

        s = s || {};

        

        var me = this,        

        	vp = me.dom == document.body || me.dom == document,

        	w = s.width || vp ? Ext.lib.Dom.getViewWidth() : me.getWidth(),

        	h = s.height || vp ? Ext.lib.Dom.getViewHeight() : me.getHeight(),         	        	

        	xy,       	

        	r = Math.round,

        	o = me.getXY(),

        	scroll = me.getScroll(),

        	extraX = vp ? scroll.left : !local ? o[0] : 0,

        	extraY = vp ? scroll.top : !local ? o[1] : 0,

        	hash = {

	        	c  : [r(w * 0.5), r(h * 0.5)],

	        	t  : [r(w * 0.5), 0],

	        	l  : [0, r(h * 0.5)],

	        	r  : [w, r(h * 0.5)],

	        	b  : [r(w * 0.5), h],

	        	tl : [0, 0],	

	        	bl : [0, h],

	        	br : [w, h],

	        	tr : [w, 0]

        	};

        

        xy = hash[anchor];	

        return [xy[0] + extraX, xy[1] + extraY]; 

    },



    /**

     * Anchors an element to another element and realigns it when the window is resized.

     * @param {Mixed} element The element to align to.

     * @param {String} position The position to align to.

     * @param {Array} offsets (optional) Offset the positioning by [x, y]

     * @param {Boolean/Object} animate (optional) True for the default animation or a standard Element animation config object

     * @param {Boolean/Number} monitorScroll (optional) True to monitor body scroll and reposition. If this parameter

     * is a number, it is used as the buffer delay (defaults to 50ms).

     * @param {Function} callback The function to call after the animation finishes

     * @return {Ext.Element} this

     */

    anchorTo : function(el, alignment, offsets, animate, monitorScroll, callback){        

	    var me = this,

            dom = me.dom;

	    

	    function action(){

            Ext.fly(dom).alignTo(el, alignment, offsets, animate);

            Ext.callback(callback, Ext.fly(dom));

        }

        

        Ext.EventManager.onWindowResize(action, me);

        

        if(!Ext.isEmpty(monitorScroll)){

            Ext.EventManager.on(window, 'scroll', action, me,

                {buffer: !isNaN(monitorScroll) ? monitorScroll : 50});

        }

        action.call(me); // align immediately

        return me;

    },



    /**

     * Gets the x,y coordinates to align this element with another element. See {@link #alignTo} for more info on the

     * supported position values.

     * @param {Mixed} element The element to align to.

     * @param {String} position The position to align to.

     * @param {Array} offsets (optional) Offset the positioning by [x, y]

     * @return {Array} [x, y]

     */

    getAlignToXY : function(el, p, o){	    

        el = Ext.get(el);

        

        if(!el || !el.dom){

            throw "Element.alignToXY with an element that doesn't exist";

        }

        

        o = o || [0,0];

        p = (p == "?" ? "tl-bl?" : (!/-/.test(p) && p !== "" ? "tl-" + p : p || "tl-bl")).toLowerCase();       

                

        var me = this,

        	d = me.dom,

        	a1,

        	a2,

        	x,

        	y,

        	//constrain the aligned el to viewport if necessary

        	w,

        	h,

        	r,

        	dw = Ext.lib.Dom.getViewWidth() -10, // 10px of margin for ie

        	dh = Ext.lib.Dom.getViewHeight()-10, // 10px of margin for ie

        	p1y,

        	p1x,        	

        	p2y,

        	p2x,

        	swapY,

        	swapX,

        	doc = document,

        	docElement = doc.documentElement,

        	docBody = doc.body,

        	scrollX = (docElement.scrollLeft || docBody.scrollLeft || 0)+5,

        	scrollY = (docElement.scrollTop || docBody.scrollTop || 0)+5,

        	c = false, //constrain to viewport

        	p1 = "", 

        	p2 = "",

        	m = p.match(/^([a-z]+)-([a-z]+)(\?)?$/);

        

        if(!m){

           throw "Element.alignTo with an invalid alignment " + p;

        }

        

        p1 = m[1]; 

        p2 = m[2]; 

        c = !!m[3];



        //Subtract the aligned el's internal xy from the target's offset xy

        //plus custom offset to get the aligned el's new offset xy

        a1 = me.getAnchorXY(p1, true);

        a2 = el.getAnchorXY(p2, false);



        x = a2[0] - a1[0] + o[0];

        y = a2[1] - a1[1] + o[1];



        if(c){    

	       w = me.getWidth();

           h = me.getHeight();

           r = el.getRegion();       

           //If we are at a viewport boundary and the aligned el is anchored on a target border that is

           //perpendicular to the vp border, allow the aligned el to slide on that border,

           //otherwise swap the aligned el to the opposite border of the target.

           p1y = p1.charAt(0);

           p1x = p1.charAt(p1.length-1);

           p2y = p2.charAt(0);

           p2x = p2.charAt(p2.length-1);

           swapY = ((p1y=="t" && p2y=="b") || (p1y=="b" && p2y=="t"));

           swapX = ((p1x=="r" && p2x=="l") || (p1x=="l" && p2x=="r"));          

           



           if (x + w > dw + scrollX) {

                x = swapX ? r.left-w : dw+scrollX-w;

           }

           if (x < scrollX) {

               x = swapX ? r.right : scrollX;

           }

           if (y + h > dh + scrollY) {

                y = swapY ? r.top-h : dh+scrollY-h;

            }

           if (y < scrollY){

               y = swapY ? r.bottom : scrollY;

           }

        }

        return [x,y];

    },



    /**

     * Aligns this element with another element relative to the specified anchor points. If the other element is the

     * document it aligns it to the viewport.

     * The position parameter is optional, and can be specified in any one of the following formats:

     * <ul>

     *   <li><b>Blank</b>: Defaults to aligning the element's top-left corner to the target's bottom-left corner ("tl-bl").</li>

     *   <li><b>One anchor (deprecated)</b>: The passed anchor position is used as the target element's anchor point.

     *       The element being aligned will position its top-left corner (tl) to that point.  <i>This method has been

     *       deprecated in favor of the newer two anchor syntax below</i>.</li>

     *   <li><b>Two anchors</b>: If two values from the table below are passed separated by a dash, the first value is used as the

     *       element's anchor point, and the second value is used as the target's anchor point.</li>

     * </ul>

     * In addition to the anchor points, the position parameter also supports the "?" character.  If "?" is passed at the end of

     * the position string, the element will attempt to align as specified, but the position will be adjusted to constrain to

     * the viewport if necessary.  Note that the element being aligned might be swapped to align to a different position than

     * that specified in order to enforce the viewport constraints.

     * Following are all of the supported anchor positions:

<pre>

Value  Description

-----  -----------------------------

tl     The top left corner (default)

t      The center of the top edge

tr     The top right corner

l      The center of the left edge

c      In the center of the element

r      The center of the right edge

bl     The bottom left corner

b      The center of the bottom edge

br     The bottom right corner

</pre>

Example Usage:

<pre><code>

// align el to other-el using the default positioning ("tl-bl", non-constrained)

el.alignTo("other-el");



// align the top left corner of el with the top right corner of other-el (constrained to viewport)

el.alignTo("other-el", "tr?");



// align the bottom right corner of el with the center left edge of other-el

el.alignTo("other-el", "br-l?");



// align the center of el with the bottom left corner of other-el and

// adjust the x position by -6 pixels (and the y position by 0)

el.alignTo("other-el", "c-bl", [-6, 0]);

</code></pre>

     * @param {Mixed} element The element to align to.

     * @param {String} position The position to align to.

     * @param {Array} offsets (optional) Offset the positioning by [x, y]

     * @param {Boolean/Object} animate (optional) true for the default animation or a standard Element animation config object

     * @return {Ext.Element} this

     */

    alignTo : function(element, position, offsets, animate){

	    var me = this;

        return me.setXY(me.getAlignToXY(element, position, offsets),

          		        me.preanim && !!animate ? me.preanim(arguments, 3) : false);

    },

    

    // private ==>  used outside of core

    adjustForConstraints : function(xy, parent, offsets){

        return this.getConstrainToXY(parent || document, false, offsets, xy) ||  xy;

    },



    // private ==>  used outside of core

    getConstrainToXY : function(el, local, offsets, proposedXY){   

	    var os = {top:0, left:0, bottom:0, right: 0};



        return function(el, local, offsets, proposedXY){

            el = Ext.get(el);

            offsets = offsets ? Ext.applyIf(offsets, os) : os;



            var vw, vh, vx = 0, vy = 0;

            if(el.dom == document.body || el.dom == document){

                vw =Ext.lib.Dom.getViewWidth();

                vh = Ext.lib.Dom.getViewHeight();

            }else{

                vw = el.dom.clientWidth;

                vh = el.dom.clientHeight;

                if(!local){

                    var vxy = el.getXY();

                    vx = vxy[0];

                    vy = vxy[1];

                }

            }



            var s = el.getScroll();



            vx += offsets.left + s.left;

            vy += offsets.top + s.top;



            vw -= offsets.right;

            vh -= offsets.bottom;



            var vr = vx+vw;

            var vb = vy+vh;



            var xy = proposedXY || (!local ? this.getXY() : [this.getLeft(true), this.getTop(true)]);

            var x = xy[0], y = xy[1];

            var w = this.dom.offsetWidth, h = this.dom.offsetHeight;



            // only move it if it needs it

            var moved = false;



            // first validate right/bottom

            if((x + w) > vr){

                x = vr - w;

                moved = true;

            }

            if((y + h) > vb){

                y = vb - h;

                moved = true;

            }

            // then make sure top/left isn't negative

            if(x < vx){

                x = vx;

                moved = true;

            }

            if(y < vy){

                y = vy;

                moved = true;

            }

            return moved ? [x, y] : false;

        };

    }(),

	    

	    

	        

//         el = Ext.get(el);

//         offsets = Ext.applyIf(offsets || {}, {top : 0, left : 0, bottom : 0, right : 0});



//         var	me = this,

//         	doc = document,

//         	s = el.getScroll(),

//         	vxy = el.getXY(),

//         	vx = offsets.left + s.left, 

//         	vy = offsets.top + s.top,            	

//         	vw = -offsets.right, 

//         	vh = -offsets.bottom, 

//         	vr,

//         	vb,

//         	xy = proposedXY || (!local ? me.getXY() : [me.getLeft(true), me.getTop(true)]),

//         	x = xy[0],

//         	y = xy[1],

//         	w = me.dom.offsetWidth, h = me.dom.offsetHeight,

//         	moved = false; // only move it if it needs it

//       

//         	

//         if(el.dom == doc.body || el.dom == doc){

//             vw += Ext.lib.Dom.getViewWidth();

//             vh += Ext.lib.Dom.getViewHeight();

//         }else{

//             vw += el.dom.clientWidth;

//             vh += el.dom.clientHeight;

//             if(!local){                    

//                 vx += vxy[0];

//                 vy += vxy[1];

//             }

//         }



//         // first validate right/bottom

//         if(x + w > vx + vw){

//             x = vx + vw - w;

//             moved = true;

//         }

//         if(y + h > vy + vh){

//             y = vy + vh - h;

//             moved = true;

//         }

//         // then make sure top/left isn't negative

//         if(x < vx){

//             x = vx;

//             moved = true;

//         }

//         if(y < vy){

//             y = vy;

//             moved = true;

//         }

//         return moved ? [x, y] : false;

//    },

    

    /**

    * Calculates the x, y to center this element on the screen

    * @return {Array} The x, y values [x, y]

    */

    getCenterXY : function(){

        return this.getAlignToXY(document, 'c-c');

    },



    /**

    * Centers the Element in either the viewport, or another Element.

    * @param {Mixed} centerIn (optional) The element in which to center the element.

    */

    center : function(centerIn){

        return this.alignTo(centerIn || document, 'c-c');        

    }    

});
//Ext.Element.addMethods(function(){var VISIBILITY="visibility",DISPLAY="display",HIDDEN="hidden",NONE="none",XMASKED="x-masked",XMASKEDRELATIVE="x-masked-relative",data=Ext.Element.data;return{isVisible:function(deep){var vis=!this.isStyle(VISIBILITY,HIDDEN)&&!this.isStyle(DISPLAY,NONE),p=this.dom.parentNode;if(deep!==true||!vis){return vis;}while(p&&!/body/i.test(p.tagName)){if(!Ext.fly(p,'_isVisible').isVisible()){return false;}p=p.parentNode;}return true;},isDisplayed:function(){return!this.isStyle(DISPLAY,NONE);},enableDisplayMode:function(display){this.setVisibilityMode(Ext.Element.DISPLAY);if(!Ext.isEmpty(display)){data(this.dom,'originalDisplay',display);}return this;},mask:function(msg,msgCls){var me=this,dom=me.dom,dh=Ext.DomHelper,EXTELMASKMSG="ext-el-mask-msg",el,mask;if(me.getStyle("position")=="static"){me.addClass(XMASKEDRELATIVE);}if((el=data(dom,'maskMsg'))){el.remove();}if((el=data(dom,'mask'))){el.remove();}mask=dh.append(dom,{cls:"ext-el-mask"},true);data(dom,'mask',mask);me.addClass(XMASKED);mask.setDisplayed(true);if(typeof msg=='string'){var mm=dh.append(dom,{cls:EXTELMASKMSG,cn:{tag:'div'}},true);data(dom,'maskMsg',mm);mm.dom.className=msgCls?EXTELMASKMSG+" "+msgCls:EXTELMASKMSG;mm.dom.firstChild.innerHTML=msg;mm.setDisplayed(true);mm.center(me);}if(Ext.isIE&&!(Ext.isIE7&&Ext.isStrict)&&me.getStyle('height')=='auto'){mask.setSize(undefined,me.getHeight());}return mask;},unmask:function(){var me=this,dom=me.dom,mask=data(dom,'mask'),maskMsg=data(dom,'maskMsg');if(mask){if(maskMsg){maskMsg.remove();data(dom,'maskMsg',undefined);}mask.remove();data(dom,'mask',undefined);}me.removeClass([XMASKED,XMASKEDRELATIVE]);},isMasked:function(){var m=data(this.dom,'mask');return m&&m.isVisible();},createShim:function(){var el=document.createElement('iframe'),shim;el.frameBorder='0';el.className='ext-shim';if(Ext.isIE&&Ext.isSecure){el.src=Ext.SSL_SECURE_URL;}shim=Ext.get(this.dom.parentNode.insertBefore(el,this.dom));shim.autoBoxAdjust=false;return shim;}};}());
/*!
 * Ext JS Library 3.0.0
 * Copyright(c) 2006-2009 Ext JS, LLC
 * licensing@extjs.com
 * http://www.extjs.com/license
 */
/**
 * @class Ext.Element
 */
Ext.Element.addMethods(
function(){
    var VISIBILITY = "visibility",
        DISPLAY = "display",
        HIDDEN = "hidden",
        NONE = "none",
	    XMASKED = "x-masked",
		XMASKEDRELATIVE = "x-masked-relative",
        data = Ext.Element.data;
		
	return {
		/**
	     * Checks whether the element is currently visible using both visibility and display properties.
	     * @param {Boolean} deep (optional) True to walk the dom and see if parent elements are hidden (defaults to false)
	     * @return {Boolean} True if the element is currently visible, else false
	     */
	    isVisible : function(deep) {
	        var vis = !this.isStyle(VISIBILITY,HIDDEN) && !this.isStyle(DISPLAY,NONE),
	        	p = this.dom.parentNode;
	        if(deep !== true || !vis){
	            return vis;
	        }	        
	        while(p && !/body/i.test(p.tagName)){
	            if(!Ext.fly(p, '_isVisible').isVisible()){
	                return false;
	            }
	            p = p.parentNode;
	        }
	        return true;
	    },
	    
	    /**
	     * Returns true if display is not "none"
	     * @return {Boolean}
	     */
	    isDisplayed : function() {
	        return !this.isStyle(DISPLAY, NONE);
	    },
	    
		/**
	     * Convenience method for setVisibilityMode(Element.DISPLAY)
	     * @param {String} display (optional) What to set display to when visible
	     * @return {Ext.Element} this
	     */
	    enableDisplayMode : function(display){	    
	        this.setVisibilityMode(Ext.Element.DISPLAY);
	        if(!Ext.isEmpty(display)){
                data(this.dom, 'originalDisplay', display);
            }
	        return this;
	    },
	    
		/**
	     * Puts a mask over this element to disable user interaction. Requires core.css.
	     * This method can only be applied to elements which accept child nodes.
	     * @param {String} msg (optional) A message to display in the mask
	     * @param {String} msgCls (optional) A css class to apply to the msg element
	     * @return {Element} The mask element
	     */
	    mask : function(msg, msgCls){
		    var me = this,
		    	dom = me.dom,
		    	dh = Ext.DomHelper,
		    	EXTELMASKMSG = "ext-el-mask-msg",
                el, 
                mask;
		    	
	        if(me.getStyle("position") == "static"){
	            me.addClass(XMASKEDRELATIVE);
	        }
	        if((el = data(dom, 'maskMsg'))){
	            el.remove();
	        }
	        if((el = data(dom, 'mask'))){
	            el.remove();
	        }
	
            mask = dh.append(dom, {cls : "ext-el-mask"}, true);
	        data(dom, 'mask', mask);
	
	        me.addClass(XMASKED);
	        mask.setDisplayed(true);
	        if(typeof msg == 'string'){
                var mm = dh.append(dom, {cls : EXTELMASKMSG, cn:{tag:'div'}}, true);
                data(dom, 'maskMsg', mm);
	            mm.dom.className = msgCls ? EXTELMASKMSG + " " + msgCls : EXTELMASKMSG;
	            mm.dom.firstChild.innerHTML = msg;
	            mm.setDisplayed(true);
	            mm.center(me);
	        }
	        if(Ext.isIE && !(Ext.isIE7 && Ext.isStrict && Ext.isIE8) && me.getStyle('height') == 'auto'){ // ie will not expand full height automatically
	            mask.setSize(undefined, me.getHeight());
	        }
	        return mask;
	    },
	
	    /**
	     * Removes a previously applied mask.
	     */
	    unmask : function(){
		    var me = this,
                dom = me.dom,
		    	mask = data(dom, 'mask'),
		    	maskMsg = data(dom, 'maskMsg');
	        if(mask){
	            if(maskMsg){
	                maskMsg.remove();
                    data(dom, 'maskMsg', undefined);
	            }
	            mask.remove();
                data(dom, 'mask', undefined);
	        }
	        me.removeClass([XMASKED, XMASKEDRELATIVE]);
	    },
	
	    /**
	     * Returns true if this element is masked
	     * @return {Boolean}
	     */
	    isMasked : function(){
            var m = data(this.dom, 'mask');
	        return m && m.isVisible();
	    },
	    
	    /**
	     * Creates an iframe shim for this element to keep selects and other windowed objects from
	     * showing through.
	     * @return {Ext.Element} The new shim element
	     */
	    createShim : function(){
	        var el = document.createElement('iframe'),        	
	        	shim;
	        el.frameBorder = '0';
	        el.className = 'ext-shim';
	        if(Ext.isIE && Ext.isSecure){
	            el.src = Ext.SSL_SECURE_URL;
	        }
	        shim = Ext.get(this.dom.parentNode.insertBefore(el, this.dom));
	        shim.autoBoxAdjust = false;
	        return shim;
	    }
    };
}());
/*!
 * Ext JS Library 3.0.0
 * Copyright(c) 2006-2009 Ext JS, LLC
 * licensing@extjs.com
 * http://www.extjs.com/license
 */
/**
 * @class Ext.Element
 */

// special markup used throughout Ext when box wrapping elements
Ext.Element.boxMarkup = '<div class="{0}-tl"><div class="{0}-tr"><div class="{0}-tc"></div></div></div><div class="{0}-ml"><div class="{0}-mr"><div class="{0}-mc"></div></div></div><div class="{0}-bl"><div class="{0}-br"><div class="{0}-bc"></div></div></div>';

Ext.Element.addMethods(function(){
	var INTERNAL = "_internal";
	return {
	    /**
	     * More flexible version of {@link #setStyle} for setting style properties.
	     * @param {String/Object/Function} styles A style specification string, e.g. "width:100px", or object in the form {width:"100px"}, or
	     * a function which returns such a specification.
	     * @return {Ext.Element} this
	     */
	    applyStyles : function(style){
	        Ext.DomHelper.applyStyles(this.dom, style);
	        return this;
	    },

		/**
	     * Returns an object with properties matching the styles requested.
	     * For example, el.getStyles('color', 'font-size', 'width') might return
	     * {'color': '#FFFFFF', 'font-size': '13px', 'width': '100px'}.
	     * @param {String} style1 A style name
	     * @param {String} style2 A style name
	     * @param {String} etc.
	     * @return {Object} The style object
	     */
	    getStyles : function(){
		    var ret = {};
		    Ext.each(arguments, function(v) {
			   ret[v] = this.getStyle(v);
		    },
		    this);
		    return ret;
	    },

		getStyleSize : function(){
	        var me = this,
	        	w,
	        	h,
	        	d = this.dom,
	        	s = d.style;
	        if(s.width && s.width != 'auto'){
	            w = parseInt(s.width, 10);
	            if(me.isBorderBox()){
	               w -= me.getFrameWidth('lr');
	            }
	        }
	        if(s.height && s.height != 'auto'){
	            h = parseInt(s.height, 10);
	            if(me.isBorderBox()){
	               h -= me.getFrameWidth('tb');
	            }
	        }
	        return {width: w || me.getWidth(true), height: h || me.getHeight(true)};
	    },

	    // private  ==> used by ext full
		setOverflow : function(v){
			var dom = this.dom;
	    	if(v=='auto' && Ext.isMac && Ext.isGecko2){ // work around stupid FF 2.0/Mac scroll bar bug
	    		dom.style.overflow = 'hidden';
	        	(function(){dom.style.overflow = 'auto';}).defer(1);
	    	}else{
	    		dom.style.overflow = v;
	    	}
		},

	   /**
		* <p>Wraps the specified element with a special 9 element markup/CSS block that renders by default as
		* a gray container with a gradient background, rounded corners and a 4-way shadow.</p>
		* <p>This special markup is used throughout Ext when box wrapping elements ({@link Ext.Button},
		* {@link Ext.Panel} when <tt>{@link Ext.Panel#frame frame=true}</tt>, {@link Ext.Window}).  The markup
		* is of this form:</p>
		* <pre><code>
Ext.Element.boxMarkup =
    &#39;&lt;div class="{0}-tl">&lt;div class="{0}-tr">&lt;div class="{0}-tc">&lt;/div>&lt;/div>&lt;/div>
     &lt;div class="{0}-ml">&lt;div class="{0}-mr">&lt;div class="{0}-mc">&lt;/div>&lt;/div>&lt;/div>
     &lt;div class="{0}-bl">&lt;div class="{0}-br">&lt;div class="{0}-bc">&lt;/div>&lt;/div>&lt;/div>&#39;;
		* </code></pre>
		* <p>Example usage:</p>
		* <pre><code>
// Basic box wrap
Ext.get("foo").boxWrap();

// You can also add a custom class and use CSS inheritance rules to customize the box look.
// 'x-box-blue' is a built-in alternative -- look at the related CSS definitions as an example
// for how to create a custom box wrap style.
Ext.get("foo").boxWrap().addClass("x-box-blue");
		* </code></pre>
		* @param {String} class (optional) A base CSS class to apply to the containing wrapper element
		* (defaults to <tt>'x-box'</tt>). Note that there are a number of CSS rules that are dependent on
		* this name to make the overall effect work, so if you supply an alternate base class, make sure you
		* also supply all of the necessary rules.
		* @return {Ext.Element} this
		*/
	    boxWrap : function(cls){
	        cls = cls || 'x-box';
	        var el = Ext.get(this.insertHtml("beforeBegin", "<div class='" + cls + "'>" + String.format(Ext.Element.boxMarkup, cls) + "</div>"));        //String.format('<div class="{0}">'+Ext.Element.boxMarkup+'</div>', cls)));
	        Ext.DomQuery.selectNode('.' + cls + '-mc', el.dom).appendChild(this.dom);
	        return el;
	    },

        /**
         * Set the size of this Element. If animation is true, both width and height will be animated concurrently.
         * @param {Mixed} width The new width. This may be one of:<div class="mdetail-params"><ul>
         * <li>A Number specifying the new width in this Element's {@link #defaultUnit}s (by default, pixels).</li>
         * <li>A String used to set the CSS width style. Animation may <b>not</b> be used.
         * <li>A size object in the format <code>{width: widthValue, height: heightValue}</code>.</li>
         * </ul></div>
         * @param {Mixed} height The new height. This may be one of:<div class="mdetail-params"><ul>
         * <li>A Number specifying the new height in this Element's {@link #defaultUnit}s (by default, pixels).</li>
         * <li>A String used to set the CSS height style. Animation may <b>not</b> be used.</li>
         * </ul></div>
         * @param {Boolean/Object} animate (optional) true for the default animation or a standard Element animation config object
         * @return {Ext.Element} this
         */
	    setSize : function(width, height, animate){
			var me = this;
			if(Ext.isObject(width)){ // in case of object from getSize()
			    height = width.height;
			    width = width.width;
			}
			width = me.adjustWidth(width);
			height = me.adjustHeight(height);
			if(!animate || !me.anim){
			    me.dom.style.width = me.addUnits(width);
			    me.dom.style.height = me.addUnits(height);
			}else{
			    me.anim({width: {to: width}, height: {to: height}}, me.preanim(arguments, 2));
			}
			return me;
	    },

	    /**
	     * Returns either the offsetHeight or the height of this element based on CSS height adjusted by padding or borders
	     * when needed to simulate offsetHeight when offsets aren't available. This may not work on display:none elements
	     * if a height has not been set using CSS.
	     * @return {Number}
	     */
	    getComputedHeight : function(){
		    var me = this,
	        	h = Math.max(me.dom.offsetHeight, me.dom.clientHeight);
	        if(!h){
	            h = parseInt(me.getStyle('height'), 10) || 0;
	            if(!me.isBorderBox()){
	                h += me.getFrameWidth('tb');
	            }
	        }
	        return h;
	    },

	    /**
	     * Returns either the offsetWidth or the width of this element based on CSS width adjusted by padding or borders
	     * when needed to simulate offsetWidth when offsets aren't available. This may not work on display:none elements
	     * if a width has not been set using CSS.
	     * @return {Number}
	     */
	    getComputedWidth : function(){
	        var w = Math.max(this.dom.offsetWidth, this.dom.clientWidth);
	        if(!w){
	            w = parseInt(this.getStyle('width'), 10) || 0;
	            if(!this.isBorderBox()){
	                w += this.getFrameWidth('lr');
	            }
	        }
	        return w;
	    },

	    /**
	     * Returns the sum width of the padding and borders for the passed "sides". See getBorderWidth()
	     for more information about the sides.
	     * @param {String} sides
	     * @return {Number}
	     */
	    getFrameWidth : function(sides, onlyContentBox){
	        return onlyContentBox && this.isBorderBox() ? 0 : (this.getPadding(sides) + this.getBorderWidth(sides));
	    },

	    /**
	     * Sets up event handlers to add and remove a css class when the mouse is over this element
	     * @param {String} className
	     * @return {Ext.Element} this
	     */
	    addClassOnOver : function(className){
	        this.hover(
	            function(){
	                Ext.fly(this, INTERNAL).addClass(className);
	            },
	            function(){
	                Ext.fly(this, INTERNAL).removeClass(className);
	            }
	        );
	        return this;
	    },

	    /**
	     * Sets up event handlers to add and remove a css class when this element has the focus
	     * @param {String} className
	     * @return {Ext.Element} this
	     */
	    addClassOnFocus : function(className){
		    this.on("focus", function(){
		        Ext.fly(this, INTERNAL).addClass(className);
		    }, this.dom);
		    this.on("blur", function(){
		        Ext.fly(this, INTERNAL).removeClass(className);
		    }, this.dom);
		    return this;
	    },

	    /**
	     * Sets up event handlers to add and remove a css class when the mouse is down and then up on this element (a click effect)
	     * @param {String} className
	     * @return {Ext.Element} this
	     */
	    addClassOnClick : function(className){
	        var dom = this.dom;
	        this.on("mousedown", function(){
	            Ext.fly(dom, INTERNAL).addClass(className);
	            var d = Ext.getDoc(),
	            	fn = function(){
		                Ext.fly(dom, INTERNAL).removeClass(className);
		                d.removeListener("mouseup", fn);
		            };
	            d.on("mouseup", fn);
	        });
	        return this;
	    },

	    /**
	     * Returns the width and height of the viewport.
        * <pre><code>
        var vpSize = Ext.getBody().getViewSize();

        // all Windows created afterwards will have a default value of 90% height and 95% width
        Ext.Window.override({
            width: vpSize.width * 0.9,
            height: vpSize.height * 0.95
        });
        // To handle window resizing you would have to hook onto onWindowResize.
        </code></pre>
	     * @return {Object} An object containing the viewport's size {width: (viewport width), height: (viewport height)}
	     */
	    getViewSize : function(){
	        var doc = document,
	        	d = this.dom,
	        	extdom = Ext.lib.Dom,
	        	isDoc = (d == doc || d == doc.body);
	        return { width : (isDoc ? extdom.getViewWidth() : d.clientWidth),
	        		 height : (isDoc ? extdom.getViewHeight() : d.clientHeight) };
	    },

	    /**
	     * Returns the size of the element.
	     * @param {Boolean} contentSize (optional) true to get the width/size minus borders and padding
	     * @return {Object} An object containing the element's size {width: (element width), height: (element height)}
	     */
	    getSize : function(contentSize){
	        return {width: this.getWidth(contentSize), height: this.getHeight(contentSize)};
	    },

	    /**
	     * Forces the browser to repaint this element
	     * @return {Ext.Element} this
	     */
	    repaint : function(){
	        var dom = this.dom;
	        this.addClass("x-repaint");
	        setTimeout(function(){
	            Ext.fly(dom).removeClass("x-repaint");
	        }, 1);
	        return this;
	    },

	    /**
	     * Disables text selection for this element (normalized across browsers)
	     * @return {Ext.Element} this
	     */
	    unselectable : function(){
	        this.dom.unselectable = "on";
	        return this.swallowEvent("selectstart", true).
	        		    applyStyles("-moz-user-select:none;-khtml-user-select:none;").
	        		    addClass("x-unselectable");
	    },

	    /**
	     * Returns an object with properties top, left, right and bottom representing the margins of this element unless sides is passed,
	     * then it returns the calculated width of the sides (see getPadding)
	     * @param {String} sides (optional) Any combination of l, r, t, b to get the sum of those sides
	     * @return {Object/Number}
	     */
	    getMargins : function(side){
		    var me = this,
		    	key,
		    	hash = {t:"top", l:"left", r:"right", b: "bottom"},
		    	o = {};

		    if (!side) {
		        for (key in me.margins){
		        	o[hash[key]] = parseInt(me.getStyle(me.margins[key]), 10) || 0;
                }
		        return o;
	        } else {
	            return me.addStyles.call(me, side, me.margins);
	        }
	    }
    };
}());
/*Element.alignment.js*/Ext.Element.addMethods({getAnchorXY:function(e,k,p){e=(e||"tl").toLowerCase();p=p||{};var j=this,b=j.dom==document.body||j.dom==document,m=p.width||b?Ext.lib.Dom.getViewWidth():j.getWidth(),g=p.height||b?Ext.lib.Dom.getViewHeight():j.getHeight(),n,a=Math.round,c=j.getXY(),l=j.getScroll(),i=b?l.left:!k?c[0]:0,f=b?l.top:!k?c[1]:0,d={c:[a(m*0.5),a(g*0.5)],t:[a(m*0.5),0],l:[0,a(g*0.5)],r:[m,a(g*0.5)],b:[a(m*0.5),g],tl:[0,0],bl:[0,g],br:[m,g],tr:[m,0]};n=d[e];return[n[0]+i,n[1]+f]},anchorTo:function(b,f,c,a,h,i){var g=this,e=g.dom;function d(){Ext.fly(e).alignTo(b,f,c,a);Ext.callback(i,Ext.fly(e))}Ext.EventManager.onWindowResize(d,g);if(!Ext.isEmpty(h)){Ext.EventManager.on(window,"scroll",d,g,{buffer:!isNaN(h)?h:50})}d.call(g);return g},getAlignToXY:function(f,z,A){f=Ext.get(f);if(!f||!f.dom){throw"Element.alignToXY with an element that doesn't exist"}A=A||[0,0];z=(z=="?"?"tl-bl?":(!/-/.test(z)&&z!==""?"tl-"+z:z||"tl-bl")).toLowerCase();var J=this,G=J.dom,L,K,l,k,q,E,u,s=Ext.lib.Dom.getViewWidth()-10,F=Ext.lib.Dom.getViewHeight()-10,b,g,i,j,t,v,M=document,I=M.documentElement,n=M.body,D=(I.scrollLeft||n.scrollLeft||0)+5,C=(I.scrollTop||n.scrollTop||0)+5,H=false,e="",a="",B=z.match(/^([a-z]+)-([a-z]+)(\?)?$/);if(!B){throw"Element.alignTo with an invalid alignment "+z}e=B[1];a=B[2];H=!!B[3];L=J.getAnchorXY(e,true);K=f.getAnchorXY(a,false);l=K[0]-L[0]+A[0];k=K[1]-L[1]+A[1];if(H){q=J.getWidth();E=J.getHeight();u=f.getRegion();b=e.charAt(0);g=e.charAt(e.length-1);i=a.charAt(0);j=a.charAt(a.length-1);t=((b=="t"&&i=="b")||(b=="b"&&i=="t"));v=((g=="r"&&j=="l")||(g=="l"&&j=="r"));if(l+q>s+D){l=v?u.left-q:s+D-q}if(l<D){l=v?u.right:D}if(k+E>F+C){k=t?u.top-E:F+C-E}if(k<C){k=t?u.bottom:C}}return[l,k]},alignTo:function(c,a,e,b){var d=this;return d.setXY(d.getAlignToXY(c,a,e),d.preanim&&!!b?d.preanim(arguments,3):false)},adjustForConstraints:function(c,a,b){return this.getConstrainToXY(a||document,false,b,c)||c},getConstrainToXY:function(b,a,c,e){var d={top:0,left:0,bottom:0,right:0};return function(g,v,j,l){g=Ext.get(g);j=j?Ext.applyIf(j,d):d;var u,B,t=0,r=0;if(g.dom==document.body||g.dom==document){u=Ext.lib.Dom.getViewWidth();B=Ext.lib.Dom.getViewHeight()}else{u=g.dom.clientWidth;B=g.dom.clientHeight;if(!v){var q=g.getXY();t=q[0];r=q[1]}}var p=g.getScroll();t+=j.left+p.left;r+=j.top+p.top;u-=j.right;B-=j.bottom;var z=t+u;var f=r+B;var i=l||(!v?this.getXY():[this.getLeft(true),this.getTop(true)]);var n=i[0],m=i[1];var o=this.dom.offsetWidth,A=this.dom.offsetHeight;var k=false;if((n+o)>z){n=z-o;k=true}if((m+A)>f){m=f-A;k=true}if(n<t){n=t;k=true}if(m<r){m=r;k=true}return k?[n,m]:false}}(),getCenterXY:function(){return this.getAlignToXY(document,"c-c")},center:function(a){return this.alignTo(a||document,"c-c")}});
/*Element.fx-more.js*/Ext.Element.addMethods(function(){var d="visibility",b="display",a="hidden",g="none",c="x-masked",f="x-masked-relative",e=Ext.Element.data;return{isVisible:function(h){var i=!this.isStyle(d,a)&&!this.isStyle(b,g),j=this.dom.parentNode;if(h!==true||!i){return i}while(j&&!/body/i.test(j.tagName)){if(!Ext.fly(j,"_isVisible").isVisible()){return false}j=j.parentNode}return true},isDisplayed:function(){return !this.isStyle(b,g)},enableDisplayMode:function(h){this.setVisibilityMode(Ext.Element.DISPLAY);if(!Ext.isEmpty(h)){e(this.dom,"originalDisplay",h)}return this},mask:function(i,m){var o=this,k=o.dom,n=Ext.DomHelper,l="ext-el-mask-msg",h,p;if(o.getStyle("position")=="static"){o.addClass(f)}if((h=e(k,"maskMsg"))){h.remove()}if((h=e(k,"mask"))){h.remove()}p=n.append(k,{cls:"ext-el-mask"},true);e(k,"mask",p);o.addClass(c);p.setDisplayed(true);if(typeof i=="string"){var j=n.append(k,{cls:l,cn:{tag:"div"}},true);e(k,"maskMsg",j);j.dom.className=m?l+" "+m:l;j.dom.firstChild.innerHTML=i;j.setDisplayed(true);j.center(o)}if(Ext.isIE&&!(Ext.isIE7&&Ext.isStrict)&&o.getStyle("height")=="auto"){p.setSize(undefined,o.getHeight())}return p},unmask:function(){var j=this,k=j.dom,h=e(k,"mask"),i=e(k,"maskMsg");if(h){if(i){i.remove();e(k,"maskMsg",undefined)}h.remove();e(k,"mask",undefined)}j.removeClass([c,f])},isMasked:function(){var h=e(this.dom,"mask");return h&&h.isVisible()},createShim:function(){var h=document.createElement("iframe"),i;h.frameBorder="0";h.className="ext-shim";if(Ext.isIE&&Ext.isSecure){h.src=Ext.SSL_SECURE_URL}i=Ext.get(this.dom.parentNode.insertBefore(h,this.dom));i.autoBoxAdjust=false;return i}}}());
/*Element.style-more.js*/Ext.Element.boxMarkup='<div class="{0}-tl"><div class="{0}-tr"><div class="{0}-tc"></div></div></div><div class="{0}-ml"><div class="{0}-mr"><div class="{0}-mc"></div></div></div><div class="{0}-bl"><div class="{0}-br"><div class="{0}-bc"></div></div></div>';Ext.Element.addMethods(function(){var a="_internal";return{applyStyles:function(b){Ext.DomHelper.applyStyles(this.dom,b);return this},getStyles:function(){var b={};Ext.each(arguments,function(c){b[c]=this.getStyle(c)},this);return b},getStyleSize:function(){var f=this,b,e,g=this.dom,c=g.style;if(c.width&&c.width!="auto"){b=parseInt(c.width,10);if(f.isBorderBox()){b-=f.getFrameWidth("lr")}}if(c.height&&c.height!="auto"){e=parseInt(c.height,10);if(f.isBorderBox()){e-=f.getFrameWidth("tb")}}return{width:b||f.getWidth(true),height:e||f.getHeight(true)}},setOverflow:function(b){var c=this.dom;if(b=="auto"&&Ext.isMac&&Ext.isGecko2){c.style.overflow="hidden";(function(){c.style.overflow="auto"}).defer(1)}else{c.style.overflow=b}},boxWrap:function(b){b=b||"x-box";var c=Ext.get(this.insertHtml("beforeBegin","<div class='"+b+"'>"+String.format(Ext.Element.boxMarkup,b)+"</div>"));Ext.DomQuery.selectNode("."+b+"-mc",c.dom).appendChild(this.dom);return c},setSize:function(d,b,c){var e=this;if(Ext.isObject(d)){b=d.height;d=d.width}d=e.adjustWidth(d);b=e.adjustHeight(b);if(!c||!e.anim){e.dom.style.width=e.addUnits(d);e.dom.style.height=e.addUnits(b)}else{e.anim({width:{to:d},height:{to:b}},e.preanim(arguments,2))}return e},getComputedHeight:function(){var c=this,b=Math.max(c.dom.offsetHeight,c.dom.clientHeight);if(!b){b=parseInt(c.getStyle("height"),10)||0;if(!c.isBorderBox()){b+=c.getFrameWidth("tb")}}return b},getComputedWidth:function(){var b=Math.max(this.dom.offsetWidth,this.dom.clientWidth);if(!b){b=parseInt(this.getStyle("width"),10)||0;if(!this.isBorderBox()){b+=this.getFrameWidth("lr")}}return b},getFrameWidth:function(c,b){return b&&this.isBorderBox()?0:(this.getPadding(c)+this.getBorderWidth(c))},addClassOnOver:function(b){this.hover(function(){Ext.fly(this,a).addClass(b)},function(){Ext.fly(this,a).removeClass(b)});return this},addClassOnFocus:function(b){this.on("focus",function(){Ext.fly(this,a).addClass(b)},this.dom);this.on("blur",function(){Ext.fly(this,a).removeClass(b)},this.dom);return this},addClassOnClick:function(b){var c=this.dom;this.on("mousedown",function(){Ext.fly(c,a).addClass(b);var f=Ext.getDoc(),e=function(){Ext.fly(c,a).removeClass(b);f.removeListener("mouseup",e)};f.on("mouseup",e)});return this},getViewSize:function(){var e=document,f=this.dom,c=Ext.lib.Dom,b=(f==e||f==e.body);return{width:(b?c.getViewWidth():f.clientWidth),height:(b?c.getViewHeight():f.clientHeight)}},getSize:function(b){return{width:this.getWidth(b),height:this.getHeight(b)}},repaint:function(){var b=this.dom;this.addClass("x-repaint");setTimeout(function(){Ext.fly(b).removeClass("x-repaint")},1);return this},unselectable:function(){this.dom.unselectable="on";return this.swallowEvent("selectstart",true).applyStyles("-moz-user-select:none;-khtml-user-select:none;").addClass("x-unselectable")},getMargins:function(c){var d=this,b,e={t:"top",l:"left",r:"right",b:"bottom"},f={};if(!c){for(b in d.margins){f[e[b]]=parseInt(d.getStyle(d.margins[b]),10)||0}return f}else{return d.addStyles.call(d,c,d.margins)}}}}());
/*Event.more.js*/Ext.apply(Ext.EventManager,function(){var c,i,e,b,a=Ext.lib.Dom,j=Ext.lib.Event,h=/^(?:scope|delay|buffer|single|stopEvent|preventDefault|stopPropagation|normalized|args|delegate)$/,g=0,f=0,d=Ext.isWebKit?Ext.num(navigator.userAgent.match(/AppleWebKit\/(\d+)/)[1])>=525:!((Ext.isGecko&&!Ext.isWindows)||Ext.isOpera);return{doResizeEvent:function(){var l=a.getViewHeight(),k=a.getViewWidth();if(f!=l||g!=k){c.fire(g=k,f=l)}},onWindowResize:function(m,l,k){if(!c){c=new Ext.util.Event();i=new Ext.util.DelayedTask(this.doResizeEvent);j.on(window,"resize",this.fireWindowResize,this)}c.addListener(m,l,k)},fireWindowResize:function(){if(c){if((Ext.isIE||Ext.isAir)&&i){i.delay(50)}else{c.fire(a.getViewWidth(),a.getViewHeight())}}},onTextResize:function(n,m,k){if(!e){e=new Ext.util.Event();var l=new Ext.Element(document.createElement("div"));l.dom.className="x-text-resize";l.dom.innerHTML="X";l.appendTo(document.body);b=l.dom.offsetHeight;setInterval(function(){if(l.dom.offsetHeight!=b){e.fire(b,b=l.dom.offsetHeight)}},this.textResizeInterval)}e.addListener(n,m,k)},removeResizeListener:function(l,k){if(c){c.removeListener(l,k)}},fireResize:function(){if(c){c.fire(a.getViewWidth(),a.getViewHeight())}},textResizeInterval:50,ieDeferSrc:false,useKeydown:d}}());Ext.EventManager.on=Ext.EventManager.addListener;Ext.apply(Ext.EventObjectImpl.prototype,{BACKSPACE:8,TAB:9,NUM_CENTER:12,ENTER:13,RETURN:13,SHIFT:16,CTRL:17,CONTROL:17,ALT:18,PAUSE:19,CAPS_LOCK:20,ESC:27,SPACE:32,PAGE_UP:33,PAGEUP:33,PAGE_DOWN:34,PAGEDOWN:34,END:35,HOME:36,LEFT:37,UP:38,RIGHT:39,DOWN:40,PRINT_SCREEN:44,INSERT:45,DELETE:46,ZERO:48,ONE:49,TWO:50,THREE:51,FOUR:52,FIVE:53,SIX:54,SEVEN:55,EIGHT:56,NINE:57,A:65,B:66,C:67,D:68,E:69,F:70,G:71,H:72,I:73,J:74,K:75,L:76,M:77,N:78,O:79,P:80,Q:81,R:82,S:83,T:84,U:85,V:86,W:87,X:88,Y:89,Z:90,CONTEXT_MENU:93,NUM_ZERO:96,NUM_ONE:97,NUM_TWO:98,NUM_THREE:99,NUM_FOUR:100,NUM_FIVE:101,NUM_SIX:102,NUM_SEVEN:103,NUM_EIGHT:104,NUM_NINE:105,NUM_MULTIPLY:106,NUM_PLUS:107,NUM_MINUS:109,NUM_PERIOD:110,NUM_DIVISION:111,F1:112,F2:113,F3:114,F4:115,F5:116,F6:117,F7:118,F8:119,F9:120,F10:121,F11:122,F12:123,isNavKeyPress:function(){var b=this,a=this.normalizeKey(b.keyCode);return(a>=33&&a<=40)||a==b.RETURN||a==b.TAB||a==b.ESC},isSpecialKey:function(){var a=this.normalizeKey(this.keyCode);return(this.type=="keypress"&&this.ctrlKey)||this.isNavKeyPress()||(a==this.BACKSPACE)||(a>=16&&a<=20)||(a>=44&&a<=45)},getPoint:function(){return new Ext.lib.Point(this.xy[0],this.xy[1])},hasModifier:function(){return((this.ctrlKey||this.altKey)||this.shiftKey)}});
var swfobject=function(){var aq="undefined",aD="object",ab="Shockwave Flash",X="ShockwaveFlash.ShockwaveFlash",aE="application/x-shockwave-flash",ac="SWFObjectExprInst",ax="onreadystatechange",af=window,aL=document,aB=navigator,aa=false,Z=[aN],aG=[],ag=[],al=[],aJ,ad,ap,at,ak=false,aU=false,aH,an,aI=true,ah=function(){var a=typeof aL.getElementById!=aq&&typeof aL.getElementsByTagName!=aq&&typeof aL.createElement!=aq,e=aB.userAgent.toLowerCase(),c=aB.platform.toLowerCase(),h=c?/win/.test(c):/win/.test(e),j=c?/mac/.test(c):/mac/.test(e),g=/webkit/.test(e)?parseFloat(e.replace(/^.*webkit\/(\d+(\.\d+)?).*$/,"$1")):false,d=!+"\v1",f=[0,0,0],k=null;if(typeof aB.plugins!=aq&&typeof aB.plugins[ab]==aD){k=aB.plugins[ab].description;if(k&&!(typeof aB.mimeTypes!=aq&&aB.mimeTypes[aE]&&!aB.mimeTypes[aE].enabledPlugin)){aa=true;d=false;k=k.replace(/^.*\s+(\S+\s+\S+$)/,"$1");f[0]=parseInt(k.replace(/^(.*)\..*$/,"$1"),10);f[1]=parseInt(k.replace(/^.*\.(.*)\s.*$/,"$1"),10);f[2]=/[a-zA-Z]/.test(k)?parseInt(k.replace(/^.*[a-zA-Z]+(.*)$/,"$1"),10):0}}else{if(typeof af.ActiveXObject!=aq){try{var i=new ActiveXObject(X);if(i){k=i.GetVariable("$version");if(k){d=true;k=k.split(" ")[1].split(",");f=[parseInt(k[0],10),parseInt(k[1],10),parseInt(k[2],10)]}}}catch(b){}}}return{w3:a,pv:f,wk:g,ie:d,win:h,mac:j}}(),aK=function(){if(!ah.w3){return}if((typeof aL.readyState!=aq&&aL.readyState=="complete")||(typeof aL.readyState==aq&&(aL.getElementsByTagName("body")[0]||aL.body))){aP()}if(!ak){if(typeof aL.addEventListener!=aq){aL.addEventListener("DOMContentLoaded",aP,false)}if(ah.ie&&ah.win){aL.attachEvent(ax,function(){if(aL.readyState=="complete"){aL.detachEvent(ax,arguments.callee);aP()}});if(af==top){(function(){if(ak){return}try{aL.documentElement.doScroll("left")}catch(a){setTimeout(arguments.callee,0);return}aP()})()}}if(ah.wk){(function(){if(ak){return}if(!/loaded|complete/.test(aL.readyState)){setTimeout(arguments.callee,0);return}aP()})()}aC(aP)}}();function aP(){if(ak){return}try{var b=aL.getElementsByTagName("body")[0].appendChild(ar("span"));b.parentNode.removeChild(b)}catch(a){return}ak=true;var d=Z.length;for(var c=0;c<d;c++){Z[c]()}}function aj(a){if(ak){a()}else{Z[Z.length]=a}}function aC(a){if(typeof af.addEventListener!=aq){af.addEventListener("load",a,false)}else{if(typeof aL.addEventListener!=aq){aL.addEventListener("load",a,false)}else{if(typeof af.attachEvent!=aq){aM(af,"onload",a)}else{if(typeof af.onload=="function"){var b=af.onload;af.onload=function(){b();a()}}else{af.onload=a}}}}}function aN(){if(aa){Y()}else{am()}}function Y(){var d=aL.getElementsByTagName("body")[0];var b=ar(aD);b.setAttribute("type",aE);var a=d.appendChild(b);if(a){var c=0;(function(){if(typeof a.GetVariable!=aq){var e=a.GetVariable("$version");if(e){e=e.split(" ")[1].split(",");ah.pv=[parseInt(e[0],10),parseInt(e[1],10),parseInt(e[2],10)]}}else{if(c<10){c++;setTimeout(arguments.callee,10);return}}d.removeChild(b);a=null;am()})()}else{am()}}function am(){var g=aG.length;if(g>0){for(var h=0;h<g;h++){var c=aG[h].id;var l=aG[h].callbackFn;var a={success:false,id:c};if(ah.pv[0]>0){var i=aS(c);if(i){if(ao(aG[h].swfVersion)&&!(ah.wk&&ah.wk<312)){ay(c,true);if(l){a.success=true;a.ref=av(c);l(a)}}else{if(aG[h].expressInstall&&au()){var e={};e.data=aG[h].expressInstall;e.width=i.getAttribute("width")||"0";e.height=i.getAttribute("height")||"0";if(i.getAttribute("class")){e.styleclass=i.getAttribute("class")}if(i.getAttribute("align")){e.align=i.getAttribute("align")}var f={};var d=i.getElementsByTagName("param");var k=d.length;for(var j=0;j<k;j++){if(d[j].getAttribute("name").toLowerCase()!="movie"){f[d[j].getAttribute("name")]=d[j].getAttribute("value")}}ae(e,f,c,l)}else{aF(i);if(l){l(a)}}}}}else{ay(c,true);if(l){var b=av(c);if(b&&typeof b.SetVariable!=aq){a.success=true;a.ref=b}l(a)}}}}}function av(b){var d=null;var c=aS(b);if(c&&c.nodeName=="OBJECT"){if(typeof c.SetVariable!=aq){d=c}else{var a=c.getElementsByTagName(aD)[0];if(a){d=a}}}return d}function au(){return !aU&&ao("6.0.65")&&(ah.win||ah.mac)&&!(ah.wk&&ah.wk<312)}function ae(f,d,h,e){aU=true;ap=e||null;at={success:false,id:h};var a=aS(h);if(a){if(a.nodeName=="OBJECT"){aJ=aO(a);ad=null}else{aJ=a;ad=h}f.id=ac;if(typeof f.width==aq||(!/%$/.test(f.width)&&parseInt(f.width,10)<310)){f.width="310"}if(typeof f.height==aq||(!/%$/.test(f.height)&&parseInt(f.height,10)<137)){f.height="137"}aL.title=aL.title.slice(0,47)+" - Flash Player Installation";var b=ah.ie&&ah.win?"ActiveX":"PlugIn",c="MMredirectURL="+af.location.toString().replace(/&/g,"%26")+"&MMplayerType="+b+"&MMdoctitle="+aL.title;if(typeof d.flashvars!=aq){d.flashvars+="&"+c}else{d.flashvars=c}if(ah.ie&&ah.win&&a.readyState!=4){var g=ar("div");h+="SWFObjectNew";g.setAttribute("id",h);a.parentNode.insertBefore(g,a);a.style.display="none";(function(){if(a.readyState==4){a.parentNode.removeChild(a)}else{setTimeout(arguments.callee,10)}})()}aA(f,d,h)}}function aF(a){if(ah.ie&&ah.win&&a.readyState!=4){var b=ar("div");a.parentNode.insertBefore(b,a);b.parentNode.replaceChild(aO(a),b);a.style.display="none";(function(){if(a.readyState==4){a.parentNode.removeChild(a)}else{setTimeout(arguments.callee,10)}})()}else{a.parentNode.replaceChild(aO(a),a)}}function aO(b){var d=ar("div");if(ah.win&&ah.ie){d.innerHTML=b.innerHTML}else{var e=b.getElementsByTagName(aD)[0];if(e){var a=e.childNodes;if(a){var f=a.length;for(var c=0;c<f;c++){if(!(a[c].nodeType==1&&a[c].nodeName=="PARAM")&&!(a[c].nodeType==8)){d.appendChild(a[c].cloneNode(true))}}}}}return d}function aA(e,g,c){var d,a=aS(c);if(ah.wk&&ah.wk<312){return d}if(a){if(typeof e.id==aq){e.id=c}if(ah.ie&&ah.win){var f="";for(var i in e){if(e[i]!=Object.prototype[i]){if(i.toLowerCase()=="data"){g.movie=e[i]}else{if(i.toLowerCase()=="styleclass"){f+=' class="'+e[i]+'"'}else{if(i.toLowerCase()!="classid"){f+=" "+i+'="'+e[i]+'"'}}}}}var h="";for(var j in g){if(g[j]!=Object.prototype[j]){h+='<param name="'+j+'" value="'+g[j]+'" />'}}a.outerHTML='<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"'+f+">"+h+"</object>";ag[ag.length]=e.id;d=aS(e.id)}else{var b=ar(aD);b.setAttribute("type",aE);for(var k in e){if(e[k]!=Object.prototype[k]){if(k.toLowerCase()=="styleclass"){b.setAttribute("class",e[k])}else{if(k.toLowerCase()!="classid"){b.setAttribute(k,e[k])}}}}for(var l in g){if(g[l]!=Object.prototype[l]&&l.toLowerCase()!="movie"){aQ(b,l,g[l])}}a.parentNode.replaceChild(b,a);d=b}}return d}function aQ(b,d,c){var a=ar("param");a.setAttribute("name",d);a.setAttribute("value",c);b.appendChild(a)}function aw(a){var b=aS(a);if(b&&b.nodeName=="OBJECT"){if(ah.ie&&ah.win){b.style.display="none";(function(){if(b.readyState==4){aT(a)}else{setTimeout(arguments.callee,10)}})()}else{b.parentNode.removeChild(b)}}}function aT(a){var b=aS(a);if(b){for(var c in b){if(typeof b[c]=="function"){b[c]=null}}b.parentNode.removeChild(b)}}function aS(a){var c=null;try{c=aL.getElementById(a)}catch(b){}return c}function ar(a){return aL.createElement(a)}function aM(a,c,b){a.attachEvent(c,b);al[al.length]=[a,c,b]}function ao(a){var b=ah.pv,c=a.split(".");c[0]=parseInt(c[0],10);c[1]=parseInt(c[1],10)||0;c[2]=parseInt(c[2],10)||0;return(b[0]>c[0]||(b[0]==c[0]&&b[1]>c[1])||(b[0]==c[0]&&b[1]==c[1]&&b[2]>=c[2]))?true:false}function az(b,f,a,c){if(ah.ie&&ah.mac){return}var e=aL.getElementsByTagName("head")[0];if(!e){return}var g=(a&&typeof a=="string")?a:"screen";if(c){aH=null;an=null}if(!aH||an!=g){var d=ar("style");d.setAttribute("type","text/css");d.setAttribute("media",g);aH=e.appendChild(d);if(ah.ie&&ah.win&&typeof aL.styleSheets!=aq&&aL.styleSheets.length>0){aH=aL.styleSheets[aL.styleSheets.length-1]}an=g}if(ah.ie&&ah.win){if(aH&&typeof aH.addRule==aD){aH.addRule(b,f)}}else{if(aH&&typeof aL.createTextNode!=aq){aH.appendChild(aL.createTextNode(b+" {"+f+"}"))}}}function ay(a,c){if(!aI){return}var b=c?"visible":"hidden";if(ak&&aS(a)){aS(a).style.visibility=b}else{az("#"+a,"visibility:"+b)}}function ai(b){var a=/[\\\"<>\.;]/;var c=a.exec(b)!=null;return c&&typeof encodeURIComponent!=aq?encodeURIComponent(b):b}var aR=function(){if(ah.ie&&ah.win){window.attachEvent("onunload",function(){var a=al.length;for(var b=0;b<a;b++){al[b][0].detachEvent(al[b][1],al[b][2])}var d=ag.length;for(var c=0;c<d;c++){aw(ag[c])}for(var e in ah){ah[e]=null}ah=null;for(var f in swfobject){swfobject[f]=null}swfobject=null})}}();return{registerObject:function(a,e,c,b){if(ah.w3&&a&&e){var d={};d.id=a;d.swfVersion=e;d.expressInstall=c;d.callbackFn=b;aG[aG.length]=d;ay(a,false)}else{if(b){b({success:false,id:a})}}},getObjectById:function(a){if(ah.w3){return av(a)}},embedSWF:function(k,e,h,f,c,a,b,i,g,j){var d={success:false,id:e};if(ah.w3&&!(ah.wk&&ah.wk<312)&&k&&e&&h&&f&&c){ay(e,false);aj(function(){h+="";f+="";var q={};if(g&&typeof g===aD){for(var o in g){q[o]=g[o]}}q.data=k;q.width=h;q.height=f;var n={};if(i&&typeof i===aD){for(var p in i){n[p]=i[p]}}if(b&&typeof b===aD){for(var l in b){if(typeof n.flashvars!=aq){n.flashvars+="&"+l+"="+b[l]}else{n.flashvars=l+"="+b[l]}}}if(ao(c)){var m=aA(q,n,e);if(q.id==e){ay(e,true)}d.success=true;d.ref=m}else{if(a&&au()){q.data=a;ae(q,n,e,j);return}else{ay(e,true)}}if(j){j(d)}})}else{if(j){j(d)}}},switchOffAutoHideShow:function(){aI=false},ua:ah,getFlashPlayerVersion:function(){return{major:ah.pv[0],minor:ah.pv[1],release:ah.pv[2]}},hasFlashPlayerVersion:ao,createSWF:function(a,b,c){if(ah.w3){return aA(a,b,c)}else{return undefined}},showExpressInstall:function(b,a,d,c){if(ah.w3&&au()){ae(b,a,d,c)}},removeSWF:function(a){if(ah.w3){aw(a)}},createCSS:function(b,a,c,d){if(ah.w3){az(b,a,c,d)}},addDomLoadEvent:aj,addLoadEvent:aC,getQueryParamValue:function(b){var a=aL.location.search||aL.location.hash;if(a){if(/\?/.test(a)){a=a.split("?")[1]}if(b==null){return ai(a)}var c=a.split("&");for(var d=0;d<c.length;d++){if(c[d].substring(0,c[d].indexOf("="))==b){return ai(c[d].substring((c[d].indexOf("=")+1)))}}}return""},expressInstallCallback:function(){if(aU){var a=aS(ac);if(a&&aJ){a.parentNode.replaceChild(aJ,a);if(ad){ay(ad,true);if(ah.ie&&ah.win){aJ.style.display="block"}}if(ap){ap(at)}}aU=false}}}}();
Ext.Ajax.defaultHeaders = {
    'accept':'json'
};
Ext.Ajax.defaultHeaders = {
    'accept':'json'
};