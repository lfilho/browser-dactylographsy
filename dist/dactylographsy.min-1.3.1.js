!function(a){function b(d){if(c[d])return c[d].exports;var e=c[d]={exports:{},id:d,loaded:!1};return a[d].call(e.exports,e,e.exports,b),e.loaded=!0,e.exports}var c={};return b.m=a,b.c=c,b.p="",b(0)}([function(a,b,c){a.exports=c(1)},function(a,b,c){"use strict";function d(a){return a&&a.__esModule?a:{"default":a}}var e=c(2),f=d(e),g=c(9),h=d(g);h["default"].polyfill(),"undefined"!=typeof window&&(window.dactylographsy=new f["default"]({autorun:!0}))},function(a,b,c){"use strict";function d(a){return a&&a.__esModule?a:{"default":a}}function e(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}var f=function(){function a(a,b){for(var c=0;c<b.length;c++){var d=b[c];d.enumerable=d.enumerable||!1,d.configurable=!0,"value"in d&&(d.writable=!0),Object.defineProperty(a,d.key,d)}}return function(b,c,d){return c&&a(b.prototype,c),d&&a(b,d),b}}();Object.defineProperty(b,"__esModule",{value:!0});var g=c(3),h=d(g),i=c(6),j=d(i),k=c(4),l=d(k),m=c(5),n=d(m),o=function(){function a(){var b=arguments.length<=0||void 0===arguments[0]?{}:arguments[0];e(this,a);var c=b.autorun,d=void 0===c?!1:c,f=b.enableLogging,g=void 0===f?!1:f;this.log=new l["default"]((0,n["default"])("dactylographsy-enableLogging",g)),this.hookIntoDom(),this.readConfiguration(),this.cache=new h["default"]({appPrefix:this.config.appPrefix}),d&&this.run()}return f(a,[{key:"hookIntoDom",value:function(){"undefined"!=typeof document&&(this.executingScript=document.getElementById("dactylographsy"),this.injectInto=document.body||document.head||document.getElementsByTagName("script")[0])}},{key:"readConfiguration",value:function(){this.manifestUrls=this.readAttrOnScript("manifests"),this.config=this.readAttrOnScript("config")}},{key:"refresh",value:function(){var a=this,b=arguments.length<=0||void 0===arguments[0]?!0:arguments[0];return Promise.all(this.manifestUrls.map(function(b){return new i.Manifest(b,a.config).get()})).then(function(c){return a.log.info("Fetched all manifests, "+c.length+" in total."),a.cache.set(c,"manifests","manifests"),new j["default"](b?a.injectInto:void 0,c,a.config).inject()})}},{key:"restore",value:function(){var a=this,b=arguments.length<=0||void 0===arguments[0]?!0:arguments[0];return this.cache.get("manifests").then(function(c){return a.log.info("Resotring with manifests in cache later refreshing via network (delayed)."),new j["default"](b?a.injectInto:void 0,c,a.config).inject()})}},{key:"readAttrOnScript",value:function(a){if(!this.executingScript)return!1;var b=this.executingScript.getAttribute("data-"+a);return b?JSON.parse(b):void 0}},{key:"run",value:function(){var a=this,b=(0,n["default"])("dactylographsy-ttl",this.config.ttl);return b&&this.cache.get("clt",0).then(function(c){c>=b?(a.log.info("Flushing cache due to exeeding TTL of "+b+"."),a.cache.flush()):a.cache.set(++c,"plain","clt")}),this.config.cacheManifests===!1?this.refresh():this.restore().then(function(b){var c=a.config.refreshDelay,d=void 0===c?5e3:c;return new Promise(function(c,e){window.setTimeout(function(){a.refresh(b).then(c,e)},d)})})["catch"](function(){return a.log.info("No manifests in cache, refreshing via network."),a.refresh()})}}]),a}();b["default"]=o},function(a,b,c){"use strict";function d(a){return a&&a.__esModule?a:{"default":a}}function e(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}var f=function(){function a(a,b){for(var c=0;c<b.length;c++){var d=b[c];d.enumerable=d.enumerable||!1,d.configurable=!0,"value"in d&&(d.writable=!0),Object.defineProperty(a,d.key,d)}}return function(b,c,d){return c&&a(b.prototype,c),d&&a(b,d),b}}();Object.defineProperty(b,"__esModule",{value:!0});var g=c(4),h=d(g),i=c(5),j=d(i),k=function(){function a(){var b=arguments.length<=0||void 0===arguments[0]?{}:arguments[0];e(this,a);var c="__dactylographsy",d=b.enableLogging,f=void 0===d?!1:d;this.log=new h["default"]((0,j["default"])("dactylographsy-enableLogging",f)),this.options=b,this.cachePrefix=this.options.cachePrefix||c,this.isSupported=this.supported(),this.options.appPrefix?this.cachePrefix=this.cachePrefix+"--"+this.options.appPrefix:this.options.cachePrefix||(this.cachePrefix+="__")}return f(a,[{key:"getPrefix",value:function(){return this.cachePrefix}},{key:"get",value:function(a,b){var c=this;return new Promise(function(d,e){c.isSupported||e();var f=JSON.parse(localStorage.getItem(c.cachePrefix+"-"+a));return null===f&&void 0!==b?(c.set(b,"plain",a),void d(b)):void(f?(c.log.info("Found item with key: "+a+" in cache."),d(f.code)):(c.log.info("Couldn't find item with key: "+a+" in cache."),e()))})}},{key:"has",value:function(a){return this.isSupported?null!==localStorage.getItem(this.cachePrefix+"-"+a):!1}},{key:"set",value:function(a,b,c){var d=arguments.length<=3||void 0===arguments[3]?!1:arguments[3];if(!this.isSupported)return!1;d&&this.dedupe(d);var e={now:+new Date,url:c,code:a,type:b,singularBy:"string"==typeof d?d:void 0};return localStorage.setItem(this.cachePrefix+"-"+c,JSON.stringify(e)),e}},{key:"flush",value:function(){if(!this.isSupported)return!1;for(var a in localStorage)a.indexOf(this.cachePrefix)>=0&&(this.log.log("Removing item "+a+" requested by flush."),localStorage.removeItem(a));return!0}},{key:"supported",value:function(){var a="__dactylographsy__feature-detection";try{return localStorage.setItem(a,a),localStorage.removeItem(a),!0}catch(b){return this.log.warn("Localstorage not supported in browser - no caching!"),!1}}},{key:"dedupe",value:function(a){for(var b in localStorage){var c=b.indexOf(this.cachePrefix)>=0,d=void 0;c&&(d=JSON.parse(localStorage.getItem(b)),"string"==typeof a&&"string"==typeof d.singularBy&&d.singularBy===a&&(this.log.log("Deduping by "+a+" before adding dupe in "+b+"."),localStorage.removeItem(b)))}}}]),a}();b["default"]=k},function(a,b){"use strict";function c(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}var d=function(){function a(a,b){for(var c=0;c<b.length;c++){var d=b[c];d.enumerable=d.enumerable||!1,d.configurable=!0,"value"in d&&(d.writable=!0),Object.defineProperty(a,d.key,d)}}return function(b,c,d){return c&&a(b.prototype,c),d&&a(b,d),b}}();Object.defineProperty(b,"__esModule",{value:!0});var e=function(){function a(){var b=arguments.length<=0||void 0===arguments[0]?!0:arguments[0];c(this,a),this.enabled=b,this.enabled&&(this.console=window.console)}return d(a,[{key:"log",value:function(){if(this.enabled){var a;(a=this.console).log.apply(a,arguments)}}},{key:"info",value:function(){if(this.enabled){var a;(a=this.console).info.apply(a,arguments)}}},{key:"warn",value:function(){if(this.enabled){var a;(a=this.console).warn.apply(a,arguments)}}},{key:"debug",value:function(){if(this.enabled){var a;(a=this.console).debug.apply(a,arguments)}}},{key:"error",value:function(){if(this.enabled){var a;(a=this.console).error.apply(a,arguments)}}}]),a}();b["default"]=e},function(a,b){"use strict";function c(a){var b=arguments.length<=1||void 0===arguments[1]?null:arguments[1],c=arguments.length<=2||void 0===arguments[2]?window.location.search:arguments[2],e=d(c);return e.hasOwnProperty(a)?e[a]:b}Object.defineProperty(b,"__esModule",{value:!0}),b["default"]=c;var d=function(a){var b=a,c=/[?&;](.+?)=([^&;]+)/g,d=void 0,e=void 0;if(d={},b)for(;e=c.exec(b);)d[e[1]]=decodeURIComponent(e[2]);return d}},function(a,b,c){"use strict";function d(a){return a&&a.__esModule?a:{"default":a}}function e(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}var f=function(){function a(a,b){for(var c=0;c<b.length;c++){var d=b[c];d.enumerable=d.enumerable||!1,d.configurable=!0,"value"in d&&(d.writable=!0),Object.defineProperty(a,d.key,d)}}return function(b,c,d){return c&&a(b.prototype,c),d&&a(b,d),b}}();Object.defineProperty(b,"__esModule",{value:!0}),b.Manifest=void 0;var g=c(7),h=c(8),i=d(h),j=c(4),k=d(j),l=c(5),m=d(l),n=(b.Manifest=function(){function a(b,c){e(this,a);var d=c.enableLogging,f=void 0===d?!1:d;this.log=new k["default"]((0,m["default"])("dactylographsy-enableLogging",f)),this.url=b}return f(a,[{key:"get",value:function(){var a=this;return(new i["default"]).get(this.url).then(function(b){var c=b.text,d=b.url;return a.log.info("Fetched manifest from url: "+d+"."),JSON.parse(c)},function(b){a.log.error("Could not fetch manifest with url: "+b.responseURL+"!")})}}]),a}(),function(){function a(b,c){var d=this,f=arguments.length<=2||void 0===arguments[2]?{}:arguments[2];e(this,a);var g=f.enableLogging,h=void 0===g?!1:g;this.log=new k["default"]((0,m["default"])("dactylographsy-enableLogging",h)),this.manifests={},this.injectInto=b,c.forEach(function(a){d.manifests[a["package"]]=a}),this.options=f,this.prefix=f.prefix,this.order=f.order}return f(a,[{key:"inject",value:function(){var a=this,b=function d(a){return a.reduce(function(a,b){return a.concat(Array.isArray(b)?d(b):b)},[])},c=function e(b){var c=arguments.length<=1||void 0===arguments[1]?0:arguments[1],d=b[c];void 0!==d&&(d.getAttribute("data-dactylographsy-uncached-js")?(a.injectInto.appendChild(d),d.addEventListener("load",function(){e(b,++c)}),d.addEventListener("error",function(){e(b,++c)})):(a.injectInto.appendChild(d),e(b,++c)))};return Promise.all(this.order.map(function(b){return a.manifests[b]?a.injectManifest(a.manifests[b]):(a.log.error("Couldn't find package "+b+" from injection order."),Promise.reject())})).then(function(a){var d=b(a);return c(d),Promise.resolve(d)})}},{key:"injectManifest",value:function(a){var b=this,c=Object.keys(a.hashes);return Promise.all(c.map(function(c){var d=a.hashes[c],e=void 0;return e=[a.rootUrl,a.packageUrl].filter(function(a){return void 0!==a&&null!==a}).join("/"),b.injectDependency(d,e)}))}},{key:"injectDependency",value:function(a,b){switch(a.extension){case".css":return new g.Css(void 0,this.options).inject(this.urls(a,b));case".js":return new g.Js(void 0,this.options).inject(this.urls(a,b));default:Promise.resolve(!1)}}},{key:"basename",value:function(a){return a.replace(/.*\/|\.[^.]*$/g,"")}},{key:"urls",value:function(a){var b=arguments.length<=1||void 0===arguments[1]?"":arguments[1],c=this.basename(a.file),d=void 0;return d=[this.prefix,b,a.path].filter(function(a){return void 0!==a&&null!==a}).join("/"),{printed:"/"+d+"/"+c+"-"+a.hash+a.extension,raw:"/"+d+"/"+c+a.extension,singularBy:"/"+d+"/"+c+a.extension}}}]),a}());b["default"]=n},function(a,b,c){"use strict";function d(a){return a&&a.__esModule?a:{"default":a}}function e(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}var f=function(){function a(a,b){for(var c=0;c<b.length;c++){var d=b[c];d.enumerable=d.enumerable||!1,d.configurable=!0,"value"in d&&(d.writable=!0),Object.defineProperty(a,d.key,d)}}return function(b,c,d){return c&&a(b.prototype,c),d&&a(b,d),b}}();Object.defineProperty(b,"__esModule",{value:!0}),b.Css=b.Js=void 0;var g=c(3),h=d(g),i=c(8),j=d(i),k=c(4),l=d(k),m=c(5),n=d(m);b.Js=function(){function a(b){var c=arguments.length<=1||void 0===arguments[1]?{}:arguments[1];e(this,a);var d=c.enableLogging,f=void 0===d?!1:d;f=(0,n["default"])("dactylographsy-enableLogging",f),this.injectInto=b,this.cache=new h["default"]({appPrefix:c.appPrefix,enableLogging:f}),this.cacheDelay=c.cacheDelay||5e3,this.log=new l["default"](f)}return f(a,[{key:"injectWithText",value:function(a,b){var c=this;return new Promise(function(d){var e=document.createElement("script");e.defer=!1,e.async=!1,e.setAttribute("data-dactylographsy-url",b),e.text="\n        "+a+"\n        //# sourceURL="+b+"\n      ",d(c.injectInto?c.injectInto.appendChild(e):e)})}},{key:"injectWithUrl",value:function(a){var b=this,c=arguments.length<=1||void 0===arguments[1]?"printed":arguments[1];return new Promise(function(d){var e=document.createElement("script"),f=a[c];b.log.info("Injecting JavaScript from "+f+"."),e.async=!1,e.defer=!1,e.setAttribute("data-dactylographsy-url",f),e.setAttribute("data-dactylographsy-uncached-js",!0),e.readyState?e.onreadystatechange=function(){("loaded"===e.readyState||"complete"===e.readyState)&&(e.onreadystatechange=null,b.ensureCache(f,a.singularBy,b.cacheDelay))}:(e.onload=function(){"printed"===c&&b.ensureCache(f,a.singularBy,b.cacheDelay)},e.onerror=function(){b.log.info("Could not fetch JavaScript from "+f+" - falling back to unprinted version."),"printed"===c&&b.injectWithUrl(a,"raw")}),e.src=f,d(b.injectInto?b.injectInto.appendChild(e):e)})}},{key:"ensureCache",value:function(a){var b=this,c=arguments.length<=1||void 0===arguments[1]?!1:arguments[1],d=arguments.length<=2||void 0===arguments[2]?0:arguments[2];return new Promise(function(e,f){b.cache.has(a)&&e(),b.log.info("Loading JavaScript from "+a+" for cache in "+d+"."),window.setTimeout(function(){return(new j["default"]).get(a).then(function(d){var f=d.text;b.cache.set(f,"js",a,c),b.log.info("Loaded JavaScript from "+a+" now cached."),e()})["catch"](function(){f()})},d)})}},{key:"inject",value:function(a){var b=this;return this.cache.get(a.printed).then(function(c){return b.injectWithText(c,a.printed)},function(){return b.injectWithUrl(a)})}}]),a}(),b.Css=function(){function a(b){var c=arguments.length<=1||void 0===arguments[1]?{}:arguments[1];e(this,a);var d=c.enableLogging,f=void 0===d?!1:d;f=(0,n["default"])("dactylographsy-enableLogging",f),this.injectInto=b,this.cache=new h["default"]({appPrefix:c.appPrefix}),this.cacheDelay=c.cacheDelay||5e3,this.log=new l["default"](f)}return f(a,[{key:"ensureCache",value:function(a){var b=this,c=arguments.length<=1||void 0===arguments[1]?!1:arguments[1],d=arguments.length<=2||void 0===arguments[2]?0:arguments[2];return new Promise(function(e,f){b.cache.has(a)&&e(),b.log.info("Loading CSS from "+a+" for cache in "+d+"."),window.setTimeout(function(){return(new j["default"]).get(a).then(function(d){var f=d.text;b.cache.set(f,"css",a,c),b.log.info("Loaded CSS from "+a+" now cached."),e()})["catch"](function(){f()})},d)})}},{key:"injectWithUrl",value:function(a){var b=this,c=arguments.length<=1||void 0===arguments[1]?"printed":arguments[1];return new Promise(function(d){var e=document.createElement("link"),f=a[c];e=document.createElement("link"),e.type="text/css",e.rel="stylesheet",e.setAttribute("data-dactylographsy-url",f),e.setAttribute("data-dactylographsy-uncached-css",!0),e.href=f,"printed"===c&&b.ensureCache(f,a.singularBy,b.cacheDelay)["catch"](function(){b.log.info("Could not fetch CSS from "+f+" - falling back to unprinted version."),b.injectWithUrl(a,"raw")}),d(b.injectInto?b.injectInto.appendChild(e):e)})}},{key:"injectWithText",value:function(a,b){var c=this;return new Promise(function(d){var e=document.createElement("link");e=document.createElement("style"),e.setAttribute("data-dactylographsy-url",b),e.textContent=a,d(c.injectInto?c.injectInto.appendChild(e):e)})}},{key:"inject",value:function(a){var b=this;return this.cache.get(a.printed).then(function(c){return b.injectWithText(c,a.printed)},function(){return b.injectWithUrl(a)})}}]),a}()},function(a,b){"use strict";function c(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}var d=function(){function a(a,b){for(var c=0;c<b.length;c++){var d=b[c];d.enumerable=d.enumerable||!1,d.configurable=!0,"value"in d&&(d.writable=!0),Object.defineProperty(a,d.key,d)}}return function(b,c,d){return c&&a(b.prototype,c),d&&a(b,d),b}}();Object.defineProperty(b,"__esModule",{value:!0});var e=function(){function a(){c(this,a)}return d(a,[{key:"get",value:function(a){var b=arguments.length<=1||void 0===arguments[1]?{}:arguments[1];return new Promise(function(c,d){var e=new XMLHttpRequest;"withCredentials"in e?e.open("GET",a,!0):"undefined"!=typeof XDomainRequest?(e=new XDomainRequest,e.open("GET",a)):e=null,b.withCredentials&&(e.withCredentials=!0),e.onload=function(){e.status>=400?d(e):c({xhr:e,text:e.responseText,url:e.responseURL})},e.onerror=function(){d(e)},e.send()})}}]),a}();b["default"]=e},function(a,b,c){var d;(function(a,e,f){(function(){"use strict";function g(a){return"function"==typeof a||"object"==typeof a&&null!==a}function h(a){return"function"==typeof a}function i(a){return"object"==typeof a&&null!==a}function j(a){V=a}function k(a){Z=a}function l(){return function(){a.nextTick(q)}}function m(){return function(){U(q)}}function n(){var a=0,b=new aa(q),c=document.createTextNode("");return b.observe(c,{characterData:!0}),function(){c.data=a=++a%2}}function o(){var a=new MessageChannel;return a.port1.onmessage=q,function(){a.port2.postMessage(0)}}function p(){return function(){setTimeout(q,1)}}function q(){for(var a=0;Y>a;a+=2){var b=da[a],c=da[a+1];b(c),da[a]=void 0,da[a+1]=void 0}Y=0}function r(){try{var a=c(12);return U=a.runOnLoop||a.runOnContext,m()}catch(b){return p()}}function s(){}function t(){return new TypeError("You cannot resolve a promise with itself")}function u(){return new TypeError("A promises callback cannot return that same promise.")}function v(a){try{return a.then}catch(b){return ha.error=b,ha}}function w(a,b,c,d){try{a.call(b,c,d)}catch(e){return e}}function x(a,b,c){Z(function(a){var d=!1,e=w(c,b,function(c){d||(d=!0,b!==c?A(a,c):C(a,c))},function(b){d||(d=!0,D(a,b))},"Settle: "+(a._label||" unknown promise"));!d&&e&&(d=!0,D(a,e))},a)}function y(a,b){b._state===fa?C(a,b._result):b._state===ga?D(a,b._result):E(b,void 0,function(b){A(a,b)},function(b){D(a,b)})}function z(a,b){if(b.constructor===a.constructor)y(a,b);else{var c=v(b);c===ha?D(a,ha.error):void 0===c?C(a,b):h(c)?x(a,b,c):C(a,b)}}function A(a,b){a===b?D(a,t()):g(b)?z(a,b):C(a,b)}function B(a){a._onerror&&a._onerror(a._result),F(a)}function C(a,b){a._state===ea&&(a._result=b,a._state=fa,0!==a._subscribers.length&&Z(F,a))}function D(a,b){a._state===ea&&(a._state=ga,a._result=b,Z(B,a))}function E(a,b,c,d){var e=a._subscribers,f=e.length;a._onerror=null,e[f]=b,e[f+fa]=c,e[f+ga]=d,0===f&&a._state&&Z(F,a)}function F(a){var b=a._subscribers,c=a._state;if(0!==b.length){for(var d,e,f=a._result,g=0;g<b.length;g+=3)d=b[g],e=b[g+c],d?I(c,d,e,f):e(f);a._subscribers.length=0}}function G(){this.error=null}function H(a,b){try{return a(b)}catch(c){return ia.error=c,ia}}function I(a,b,c,d){var e,f,g,i,j=h(c);if(j){if(e=H(c,d),e===ia?(i=!0,f=e.error,e=null):g=!0,b===e)return void D(b,u())}else e=d,g=!0;b._state!==ea||(j&&g?A(b,e):i?D(b,f):a===fa?C(b,e):a===ga&&D(b,e))}function J(a,b){try{b(function(b){A(a,b)},function(b){D(a,b)})}catch(c){D(a,c)}}function K(a,b){var c=this;c._instanceConstructor=a,c.promise=new a(s),c._validateInput(b)?(c._input=b,c.length=b.length,c._remaining=b.length,c._init(),0===c.length?C(c.promise,c._result):(c.length=c.length||0,c._enumerate(),0===c._remaining&&C(c.promise,c._result))):D(c.promise,c._validationError())}function L(a){return new ja(this,a).promise}function M(a){function b(a){A(e,a)}function c(a){D(e,a)}var d=this,e=new d(s);if(!X(a))return D(e,new TypeError("You must pass an array to race.")),e;for(var f=a.length,g=0;e._state===ea&&f>g;g++)E(d.resolve(a[g]),void 0,b,c);return e}function N(a){var b=this;if(a&&"object"==typeof a&&a.constructor===b)return a;var c=new b(s);return A(c,a),c}function O(a){var b=this,c=new b(s);return D(c,a),c}function P(){throw new TypeError("You must pass a resolver function as the first argument to the promise constructor")}function Q(){throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.")}function R(a){this._id=oa++,this._state=void 0,this._result=void 0,this._subscribers=[],s!==a&&(h(a)||P(),this instanceof R||Q(),J(this,a))}function S(){var a;if("undefined"!=typeof e)a=e;else if("undefined"!=typeof self)a=self;else try{a=Function("return this")()}catch(b){throw new Error("polyfill failed because global object is unavailable in this environment")}var c=a.Promise;(!c||"[object Promise]"!==Object.prototype.toString.call(c.resolve())||c.cast)&&(a.Promise=pa)}var T;T=Array.isArray?Array.isArray:function(a){return"[object Array]"===Object.prototype.toString.call(a)};var U,V,W,X=T,Y=0,Z=({}.toString,function(a,b){da[Y]=a,da[Y+1]=b,Y+=2,2===Y&&(V?V(q):W())}),$="undefined"!=typeof window?window:void 0,_=$||{},aa=_.MutationObserver||_.WebKitMutationObserver,ba="undefined"!=typeof a&&"[object process]"==={}.toString.call(a),ca="undefined"!=typeof Uint8ClampedArray&&"undefined"!=typeof importScripts&&"undefined"!=typeof MessageChannel,da=new Array(1e3);W=ba?l():aa?n():ca?o():void 0===$?r():p();var ea=void 0,fa=1,ga=2,ha=new G,ia=new G;K.prototype._validateInput=function(a){return X(a)},K.prototype._validationError=function(){return new Error("Array Methods must be provided an Array")},K.prototype._init=function(){this._result=new Array(this.length)};var ja=K;K.prototype._enumerate=function(){for(var a=this,b=a.length,c=a.promise,d=a._input,e=0;c._state===ea&&b>e;e++)a._eachEntry(d[e],e)},K.prototype._eachEntry=function(a,b){var c=this,d=c._instanceConstructor;i(a)?a.constructor===d&&a._state!==ea?(a._onerror=null,c._settledAt(a._state,b,a._result)):c._willSettleAt(d.resolve(a),b):(c._remaining--,c._result[b]=a)},K.prototype._settledAt=function(a,b,c){var d=this,e=d.promise;e._state===ea&&(d._remaining--,a===ga?D(e,c):d._result[b]=c),0===d._remaining&&C(e,d._result)},K.prototype._willSettleAt=function(a,b){var c=this;E(a,void 0,function(a){c._settledAt(fa,b,a)},function(a){c._settledAt(ga,b,a)})};var ka=L,la=M,ma=N,na=O,oa=0,pa=R;R.all=ka,R.race=la,R.resolve=ma,R.reject=na,R._setScheduler=j,R._setAsap=k,R._asap=Z,R.prototype={constructor:R,then:function(a,b){var c=this,d=c._state;if(d===fa&&!a||d===ga&&!b)return this;var e=new this.constructor(s),f=c._result;if(d){var g=arguments[d-1];Z(function(){I(d,e,g,f)})}else E(c,e,a,b);return e},"catch":function(a){return this.then(null,a)}};var qa=S,ra={Promise:pa,polyfill:qa};c(13).amd?(d=function(){return ra}.call(b,c,b,f),!(void 0!==d&&(f.exports=d))):"undefined"!=typeof f&&f.exports?f.exports=ra:"undefined"!=typeof this&&(this.ES6Promise=ra),qa()}).call(this)}).call(b,c(10),function(){return this}(),c(11)(a))},function(a,b){function c(){j=!1,g.length?i=g.concat(i):k=-1,i.length&&d()}function d(){if(!j){var a=setTimeout(c);j=!0;for(var b=i.length;b;){for(g=i,i=[];++k<b;)g&&g[k].run();k=-1,b=i.length}g=null,j=!1,clearTimeout(a)}}function e(a,b){this.fun=a,this.array=b}function f(){}var g,h=a.exports={},i=[],j=!1,k=-1;h.nextTick=function(a){var b=new Array(arguments.length-1);if(arguments.length>1)for(var c=1;c<arguments.length;c++)b[c-1]=arguments[c];i.push(new e(a,b)),1!==i.length||j||setTimeout(d,0)},e.prototype.run=function(){this.fun.apply(null,this.array)},h.title="browser",h.browser=!0,h.env={},h.argv=[],h.version="",h.versions={},h.on=f,h.addListener=f,h.once=f,h.off=f,h.removeListener=f,h.removeAllListeners=f,h.emit=f,h.binding=function(a){throw new Error("process.binding is not supported")},h.cwd=function(){return"/"},h.chdir=function(a){throw new Error("process.chdir is not supported")},h.umask=function(){return 0}},function(a,b){a.exports=function(a){return a.webpackPolyfill||(a.deprecate=function(){},a.paths=[],a.children=[],a.webpackPolyfill=1),a}},function(a,b){},function(a,b){a.exports=function(){throw new Error("define cannot be used indirect")}}]);