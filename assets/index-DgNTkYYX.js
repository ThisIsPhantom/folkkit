(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const d of document.querySelectorAll('link[rel="modulepreload"]'))c(d);new MutationObserver(d=>{for(const f of d)if(f.type==="childList")for(const h of f.addedNodes)h.tagName==="LINK"&&h.rel==="modulepreload"&&c(h)}).observe(document,{childList:!0,subtree:!0});function s(d){const f={};return d.integrity&&(f.integrity=d.integrity),d.referrerPolicy&&(f.referrerPolicy=d.referrerPolicy),d.crossOrigin==="use-credentials"?f.credentials="include":d.crossOrigin==="anonymous"?f.credentials="omit":f.credentials="same-origin",f}function c(d){if(d.ep)return;d.ep=!0;const f=s(d);fetch(d.href,f)}})();var qc={exports:{}},Zi={};var ch;function wy(){if(ch)return Zi;ch=1;var n=Symbol.for("react.transitional.element"),r=Symbol.for("react.fragment");function s(c,d,f){var h=null;if(f!==void 0&&(h=""+f),d.key!==void 0&&(h=""+d.key),"key"in d){f={};for(var y in d)y!=="key"&&(f[y]=d[y])}else f=d;return d=f.ref,{$$typeof:n,type:c,key:h,ref:d!==void 0?d:null,props:f}}return Zi.Fragment=r,Zi.jsx=s,Zi.jsxs=s,Zi}var uh;function xy(){return uh||(uh=1,qc.exports=wy()),qc.exports}var p=xy(),Vc={exports:{}},ue={};var dh;function Ay(){if(dh)return ue;dh=1;var n=Symbol.for("react.transitional.element"),r=Symbol.for("react.portal"),s=Symbol.for("react.fragment"),c=Symbol.for("react.strict_mode"),d=Symbol.for("react.profiler"),f=Symbol.for("react.consumer"),h=Symbol.for("react.context"),y=Symbol.for("react.forward_ref"),g=Symbol.for("react.suspense"),b=Symbol.for("react.memo"),L=Symbol.for("react.lazy"),z=Symbol.for("react.activity"),w=Symbol.iterator;function I(T){return T===null||typeof T!="object"?null:(T=w&&T[w]||T["@@iterator"],typeof T=="function"?T:null)}var j={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},C=Object.assign,O={};function q(T,x,_){this.props=T,this.context=x,this.refs=O,this.updater=_||j}q.prototype.isReactComponent={},q.prototype.setState=function(T,x){if(typeof T!="object"&&typeof T!="function"&&T!=null)throw Error("takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,T,x,"setState")},q.prototype.forceUpdate=function(T){this.updater.enqueueForceUpdate(this,T,"forceUpdate")};function te(){}te.prototype=q.prototype;function B(T,x,_){this.props=T,this.context=x,this.refs=O,this.updater=_||j}var ne=B.prototype=new te;ne.constructor=B,C(ne,q.prototype),ne.isPureReactComponent=!0;var ce=Array.isArray;function fe(){}var ae={H:null,A:null,T:null,S:null},Ae=Object.prototype.hasOwnProperty;function Ne(T,x,_){var W=_.ref;return{$$typeof:n,type:T,key:x,ref:W!==void 0?W:null,props:_}}function Pe(T,x){return Ne(T.type,x,T.props)}function Fe(T){return typeof T=="object"&&T!==null&&T.$$typeof===n}function tt(T){var x={"=":"=0",":":"=2"};return"$"+T.replace(/[=:]/g,function(_){return x[_]})}var de=/\/+/g;function pt(T,x){return typeof T=="object"&&T!==null&&T.key!=null?tt(""+T.key):x.toString(36)}function Ue(T){switch(T.status){case"fulfilled":return T.value;case"rejected":throw T.reason;default:switch(typeof T.status=="string"?T.then(fe,fe):(T.status="pending",T.then(function(x){T.status==="pending"&&(T.status="fulfilled",T.value=x)},function(x){T.status==="pending"&&(T.status="rejected",T.reason=x)})),T.status){case"fulfilled":return T.value;case"rejected":throw T.reason}}throw T}function D(T,x,_,W,V){var X=typeof T;(X==="undefined"||X==="boolean")&&(T=null);var Te=!1;if(T===null)Te=!0;else switch(X){case"bigint":case"string":case"number":Te=!0;break;case"object":switch(T.$$typeof){case n:case r:Te=!0;break;case L:return Te=T._init,D(Te(T._payload),x,_,W,V)}}if(Te)return V=V(T),Te=W===""?"."+pt(T,0):W,ce(V)?(_="",Te!=null&&(_=Te.replace(de,"$&/")+"/"),D(V,x,_,"",function(Ft){return Ft})):V!=null&&(Fe(V)&&(V=Pe(V,_+(V.key==null||T&&T.key===V.key?"":(""+V.key).replace(de,"$&/")+"/")+Te)),x.push(V)),1;Te=0;var Ye=W===""?".":W+":";if(ce(T))for(var Ce=0;Ce<T.length;Ce++)W=T[Ce],X=Ye+pt(W,Ce),Te+=D(W,x,_,X,V);else if(Ce=I(T),typeof Ce=="function")for(T=Ce.call(T),Ce=0;!(W=T.next()).done;)W=W.value,X=Ye+pt(W,Ce++),Te+=D(W,x,_,X,V);else if(X==="object"){if(typeof T.then=="function")return D(Ue(T),x,_,W,V);throw x=String(T),Error("Objects are not valid as a React child (found: "+(x==="[object Object]"?"object with keys {"+Object.keys(T).join(", ")+"}":x)+"). If you meant to render a collection of children, use an array instead.")}return Te}function P(T,x,_){if(T==null)return T;var W=[],V=0;return D(T,W,"","",function(X){return x.call(_,X,V++)}),W}function ee(T){if(T._status===-1){var x=T._result;x=x(),x.then(function(_){(T._status===0||T._status===-1)&&(T._status=1,T._result=_)},function(_){(T._status===0||T._status===-1)&&(T._status=2,T._result=_)}),T._status===-1&&(T._status=0,T._result=x)}if(T._status===1)return T._result.default;throw T._result}var be=typeof reportError=="function"?reportError:function(T){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var x=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof T=="object"&&T!==null&&typeof T.message=="string"?String(T.message):String(T),error:T});if(!window.dispatchEvent(x))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",T);return}console.error(T)},he={map:P,forEach:function(T,x,_){P(T,function(){x.apply(this,arguments)},_)},count:function(T){var x=0;return P(T,function(){x++}),x},toArray:function(T){return P(T,function(x){return x})||[]},only:function(T){if(!Fe(T))throw Error("React.Children.only expected to receive a single React element child.");return T}};return ue.Activity=z,ue.Children=he,ue.Component=q,ue.Fragment=s,ue.Profiler=d,ue.PureComponent=B,ue.StrictMode=c,ue.Suspense=g,ue.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=ae,ue.__COMPILER_RUNTIME={__proto__:null,c:function(T){return ae.H.useMemoCache(T)}},ue.cache=function(T){return function(){return T.apply(null,arguments)}},ue.cacheSignal=function(){return null},ue.cloneElement=function(T,x,_){if(T==null)throw Error("The argument must be a React element, but you passed "+T+".");var W=C({},T.props),V=T.key;if(x!=null)for(X in x.key!==void 0&&(V=""+x.key),x)!Ae.call(x,X)||X==="key"||X==="__self"||X==="__source"||X==="ref"&&x.ref===void 0||(W[X]=x[X]);var X=arguments.length-2;if(X===1)W.children=_;else if(1<X){for(var Te=Array(X),Ye=0;Ye<X;Ye++)Te[Ye]=arguments[Ye+2];W.children=Te}return Ne(T.type,V,W)},ue.createContext=function(T){return T={$$typeof:h,_currentValue:T,_currentValue2:T,_threadCount:0,Provider:null,Consumer:null},T.Provider=T,T.Consumer={$$typeof:f,_context:T},T},ue.createElement=function(T,x,_){var W,V={},X=null;if(x!=null)for(W in x.key!==void 0&&(X=""+x.key),x)Ae.call(x,W)&&W!=="key"&&W!=="__self"&&W!=="__source"&&(V[W]=x[W]);var Te=arguments.length-2;if(Te===1)V.children=_;else if(1<Te){for(var Ye=Array(Te),Ce=0;Ce<Te;Ce++)Ye[Ce]=arguments[Ce+2];V.children=Ye}if(T&&T.defaultProps)for(W in Te=T.defaultProps,Te)V[W]===void 0&&(V[W]=Te[W]);return Ne(T,X,V)},ue.createRef=function(){return{current:null}},ue.forwardRef=function(T){return{$$typeof:y,render:T}},ue.isValidElement=Fe,ue.lazy=function(T){return{$$typeof:L,_payload:{_status:-1,_result:T},_init:ee}},ue.memo=function(T,x){return{$$typeof:b,type:T,compare:x===void 0?null:x}},ue.startTransition=function(T){var x=ae.T,_={};ae.T=_;try{var W=T(),V=ae.S;V!==null&&V(_,W),typeof W=="object"&&W!==null&&typeof W.then=="function"&&W.then(fe,be)}catch(X){be(X)}finally{x!==null&&_.types!==null&&(x.types=_.types),ae.T=x}},ue.unstable_useCacheRefresh=function(){return ae.H.useCacheRefresh()},ue.use=function(T){return ae.H.use(T)},ue.useActionState=function(T,x,_){return ae.H.useActionState(T,x,_)},ue.useCallback=function(T,x){return ae.H.useCallback(T,x)},ue.useContext=function(T){return ae.H.useContext(T)},ue.useDebugValue=function(){},ue.useDeferredValue=function(T,x){return ae.H.useDeferredValue(T,x)},ue.useEffect=function(T,x){return ae.H.useEffect(T,x)},ue.useEffectEvent=function(T){return ae.H.useEffectEvent(T)},ue.useId=function(){return ae.H.useId()},ue.useImperativeHandle=function(T,x,_){return ae.H.useImperativeHandle(T,x,_)},ue.useInsertionEffect=function(T,x){return ae.H.useInsertionEffect(T,x)},ue.useLayoutEffect=function(T,x){return ae.H.useLayoutEffect(T,x)},ue.useMemo=function(T,x){return ae.H.useMemo(T,x)},ue.useOptimistic=function(T,x){return ae.H.useOptimistic(T,x)},ue.useReducer=function(T,x,_){return ae.H.useReducer(T,x,_)},ue.useRef=function(T){return ae.H.useRef(T)},ue.useState=function(T){return ae.H.useState(T)},ue.useSyncExternalStore=function(T,x,_){return ae.H.useSyncExternalStore(T,x,_)},ue.useTransition=function(){return ae.H.useTransition()},ue.version="19.2.8",ue}var fh;function wu(){return fh||(fh=1,Vc.exports=Ay()),Vc.exports}var A=wu(),Kc={exports:{}},Qi={},Xc={exports:{}},Zc={};var ph;function Fy(){return ph||(ph=1,(function(n){function r(D,P){var ee=D.length;D.push(P);e:for(;0<ee;){var be=ee-1>>>1,he=D[be];if(0<d(he,P))D[be]=P,D[ee]=he,ee=be;else break e}}function s(D){return D.length===0?null:D[0]}function c(D){if(D.length===0)return null;var P=D[0],ee=D.pop();if(ee!==P){D[0]=ee;e:for(var be=0,he=D.length,T=he>>>1;be<T;){var x=2*(be+1)-1,_=D[x],W=x+1,V=D[W];if(0>d(_,ee))W<he&&0>d(V,_)?(D[be]=V,D[W]=ee,be=W):(D[be]=_,D[x]=ee,be=x);else if(W<he&&0>d(V,ee))D[be]=V,D[W]=ee,be=W;else break e}}return P}function d(D,P){var ee=D.sortIndex-P.sortIndex;return ee!==0?ee:D.id-P.id}if(n.unstable_now=void 0,typeof performance=="object"&&typeof performance.now=="function"){var f=performance;n.unstable_now=function(){return f.now()}}else{var h=Date,y=h.now();n.unstable_now=function(){return h.now()-y}}var g=[],b=[],L=1,z=null,w=3,I=!1,j=!1,C=!1,O=!1,q=typeof setTimeout=="function"?setTimeout:null,te=typeof clearTimeout=="function"?clearTimeout:null,B=typeof setImmediate<"u"?setImmediate:null;function ne(D){for(var P=s(b);P!==null;){if(P.callback===null)c(b);else if(P.startTime<=D)c(b),P.sortIndex=P.expirationTime,r(g,P);else break;P=s(b)}}function ce(D){if(C=!1,ne(D),!j)if(s(g)!==null)j=!0,fe||(fe=!0,tt());else{var P=s(b);P!==null&&Ue(ce,P.startTime-D)}}var fe=!1,ae=-1,Ae=5,Ne=-1;function Pe(){return O?!0:!(n.unstable_now()-Ne<Ae)}function Fe(){if(O=!1,fe){var D=n.unstable_now();Ne=D;var P=!0;try{e:{j=!1,C&&(C=!1,te(ae),ae=-1),I=!0;var ee=w;try{t:{for(ne(D),z=s(g);z!==null&&!(z.expirationTime>D&&Pe());){var be=z.callback;if(typeof be=="function"){z.callback=null,w=z.priorityLevel;var he=be(z.expirationTime<=D);if(D=n.unstable_now(),typeof he=="function"){z.callback=he,ne(D),P=!0;break t}z===s(g)&&c(g),ne(D)}else c(g);z=s(g)}if(z!==null)P=!0;else{var T=s(b);T!==null&&Ue(ce,T.startTime-D),P=!1}}break e}finally{z=null,w=ee,I=!1}P=void 0}}finally{P?tt():fe=!1}}}var tt;if(typeof B=="function")tt=function(){B(Fe)};else if(typeof MessageChannel<"u"){var de=new MessageChannel,pt=de.port2;de.port1.onmessage=Fe,tt=function(){pt.postMessage(null)}}else tt=function(){q(Fe,0)};function Ue(D,P){ae=q(function(){D(n.unstable_now())},P)}n.unstable_IdlePriority=5,n.unstable_ImmediatePriority=1,n.unstable_LowPriority=4,n.unstable_NormalPriority=3,n.unstable_Profiling=null,n.unstable_UserBlockingPriority=2,n.unstable_cancelCallback=function(D){D.callback=null},n.unstable_forceFrameRate=function(D){0>D||125<D?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):Ae=0<D?Math.floor(1e3/D):5},n.unstable_getCurrentPriorityLevel=function(){return w},n.unstable_next=function(D){switch(w){case 1:case 2:case 3:var P=3;break;default:P=w}var ee=w;w=P;try{return D()}finally{w=ee}},n.unstable_requestPaint=function(){O=!0},n.unstable_runWithPriority=function(D,P){switch(D){case 1:case 2:case 3:case 4:case 5:break;default:D=3}var ee=w;w=D;try{return P()}finally{w=ee}},n.unstable_scheduleCallback=function(D,P,ee){var be=n.unstable_now();switch(typeof ee=="object"&&ee!==null?(ee=ee.delay,ee=typeof ee=="number"&&0<ee?be+ee:be):ee=be,D){case 1:var he=-1;break;case 2:he=250;break;case 5:he=1073741823;break;case 4:he=1e4;break;default:he=5e3}return he=ee+he,D={id:L++,callback:P,priorityLevel:D,startTime:ee,expirationTime:he,sortIndex:-1},ee>be?(D.sortIndex=ee,r(b,D),s(g)===null&&D===s(b)&&(C?(te(ae),ae=-1):C=!0,Ue(ce,ee-be))):(D.sortIndex=he,r(g,D),j||I||(j=!0,fe||(fe=!0,tt()))),D},n.unstable_shouldYield=Pe,n.unstable_wrapCallback=function(D){var P=w;return function(){var ee=w;w=P;try{return D.apply(this,arguments)}finally{w=ee}}}})(Zc)),Zc}var hh;function Ry(){return hh||(hh=1,Xc.exports=Fy()),Xc.exports}var Qc={exports:{}},wt={};var mh;function Ny(){if(mh)return wt;mh=1;var n=wu();function r(g){var b="https://react.dev/errors/"+g;if(1<arguments.length){b+="?args[]="+encodeURIComponent(arguments[1]);for(var L=2;L<arguments.length;L++)b+="&args[]="+encodeURIComponent(arguments[L])}return"Minified React error #"+g+"; visit "+b+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function s(){}var c={d:{f:s,r:function(){throw Error(r(522))},D:s,C:s,L:s,m:s,X:s,S:s,M:s},p:0,findDOMNode:null},d=Symbol.for("react.portal");function f(g,b,L){var z=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:d,key:z==null?null:""+z,children:g,containerInfo:b,implementation:L}}var h=n.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;function y(g,b){if(g==="font")return"";if(typeof b=="string")return b==="use-credentials"?b:""}return wt.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=c,wt.createPortal=function(g,b){var L=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!b||b.nodeType!==1&&b.nodeType!==9&&b.nodeType!==11)throw Error(r(299));return f(g,b,null,L)},wt.flushSync=function(g){var b=h.T,L=c.p;try{if(h.T=null,c.p=2,g)return g()}finally{h.T=b,c.p=L,c.d.f()}},wt.preconnect=function(g,b){typeof g=="string"&&(b?(b=b.crossOrigin,b=typeof b=="string"?b==="use-credentials"?b:"":void 0):b=null,c.d.C(g,b))},wt.prefetchDNS=function(g){typeof g=="string"&&c.d.D(g)},wt.preinit=function(g,b){if(typeof g=="string"&&b&&typeof b.as=="string"){var L=b.as,z=y(L,b.crossOrigin),w=typeof b.integrity=="string"?b.integrity:void 0,I=typeof b.fetchPriority=="string"?b.fetchPriority:void 0;L==="style"?c.d.S(g,typeof b.precedence=="string"?b.precedence:void 0,{crossOrigin:z,integrity:w,fetchPriority:I}):L==="script"&&c.d.X(g,{crossOrigin:z,integrity:w,fetchPriority:I,nonce:typeof b.nonce=="string"?b.nonce:void 0})}},wt.preinitModule=function(g,b){if(typeof g=="string")if(typeof b=="object"&&b!==null){if(b.as==null||b.as==="script"){var L=y(b.as,b.crossOrigin);c.d.M(g,{crossOrigin:L,integrity:typeof b.integrity=="string"?b.integrity:void 0,nonce:typeof b.nonce=="string"?b.nonce:void 0})}}else b==null&&c.d.M(g)},wt.preload=function(g,b){if(typeof g=="string"&&typeof b=="object"&&b!==null&&typeof b.as=="string"){var L=b.as,z=y(L,b.crossOrigin);c.d.L(g,L,{crossOrigin:z,integrity:typeof b.integrity=="string"?b.integrity:void 0,nonce:typeof b.nonce=="string"?b.nonce:void 0,type:typeof b.type=="string"?b.type:void 0,fetchPriority:typeof b.fetchPriority=="string"?b.fetchPriority:void 0,referrerPolicy:typeof b.referrerPolicy=="string"?b.referrerPolicy:void 0,imageSrcSet:typeof b.imageSrcSet=="string"?b.imageSrcSet:void 0,imageSizes:typeof b.imageSizes=="string"?b.imageSizes:void 0,media:typeof b.media=="string"?b.media:void 0})}},wt.preloadModule=function(g,b){if(typeof g=="string")if(b){var L=y(b.as,b.crossOrigin);c.d.m(g,{as:typeof b.as=="string"&&b.as!=="script"?b.as:void 0,crossOrigin:L,integrity:typeof b.integrity=="string"?b.integrity:void 0})}else c.d.m(g)},wt.requestFormReset=function(g){c.d.r(g)},wt.unstable_batchedUpdates=function(g,b){return g(b)},wt.useFormState=function(g,b,L){return h.H.useFormState(g,b,L)},wt.useFormStatus=function(){return h.H.useHostTransitionStatus()},wt.version="19.2.8",wt}var gh;function Iy(){if(gh)return Qc.exports;gh=1;function n(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n)}catch(r){console.error(r)}}return n(),Qc.exports=Ny(),Qc.exports}var yh;function Ly(){if(yh)return Qi;yh=1;var n=Ry(),r=wu(),s=Iy();function c(e){var t="https://react.dev/errors/"+e;if(1<arguments.length){t+="?args[]="+encodeURIComponent(arguments[1]);for(var a=2;a<arguments.length;a++)t+="&args[]="+encodeURIComponent(arguments[a])}return"Minified React error #"+e+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function d(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function f(e){var t=e,a=e;if(e.alternate)for(;t.return;)t=t.return;else{e=t;do t=e,(t.flags&4098)!==0&&(a=t.return),e=t.return;while(e)}return t.tag===3?a:null}function h(e){if(e.tag===13){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function y(e){if(e.tag===31){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function g(e){if(f(e)!==e)throw Error(c(188))}function b(e){var t=e.alternate;if(!t){if(t=f(e),t===null)throw Error(c(188));return t!==e?null:e}for(var a=e,o=t;;){var i=a.return;if(i===null)break;var l=i.alternate;if(l===null){if(o=i.return,o!==null){a=o;continue}break}if(i.child===l.child){for(l=i.child;l;){if(l===a)return g(i),e;if(l===o)return g(i),t;l=l.sibling}throw Error(c(188))}if(a.return!==o.return)a=i,o=l;else{for(var u=!1,m=i.child;m;){if(m===a){u=!0,a=i,o=l;break}if(m===o){u=!0,o=i,a=l;break}m=m.sibling}if(!u){for(m=l.child;m;){if(m===a){u=!0,a=l,o=i;break}if(m===o){u=!0,o=l,a=i;break}m=m.sibling}if(!u)throw Error(c(189))}}if(a.alternate!==o)throw Error(c(190))}if(a.tag!==3)throw Error(c(188));return a.stateNode.current===a?e:t}function L(e){var t=e.tag;if(t===5||t===26||t===27||t===6)return e;for(e=e.child;e!==null;){if(t=L(e),t!==null)return t;e=e.sibling}return null}var z=Object.assign,w=Symbol.for("react.element"),I=Symbol.for("react.transitional.element"),j=Symbol.for("react.portal"),C=Symbol.for("react.fragment"),O=Symbol.for("react.strict_mode"),q=Symbol.for("react.profiler"),te=Symbol.for("react.consumer"),B=Symbol.for("react.context"),ne=Symbol.for("react.forward_ref"),ce=Symbol.for("react.suspense"),fe=Symbol.for("react.suspense_list"),ae=Symbol.for("react.memo"),Ae=Symbol.for("react.lazy"),Ne=Symbol.for("react.activity"),Pe=Symbol.for("react.memo_cache_sentinel"),Fe=Symbol.iterator;function tt(e){return e===null||typeof e!="object"?null:(e=Fe&&e[Fe]||e["@@iterator"],typeof e=="function"?e:null)}var de=Symbol.for("react.client.reference");function pt(e){if(e==null)return null;if(typeof e=="function")return e.$$typeof===de?null:e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case C:return"Fragment";case q:return"Profiler";case O:return"StrictMode";case ce:return"Suspense";case fe:return"SuspenseList";case Ne:return"Activity"}if(typeof e=="object")switch(e.$$typeof){case j:return"Portal";case B:return e.displayName||"Context";case te:return(e._context.displayName||"Context")+".Consumer";case ne:var t=e.render;return e=e.displayName,e||(e=t.displayName||t.name||"",e=e!==""?"ForwardRef("+e+")":"ForwardRef"),e;case ae:return t=e.displayName||null,t!==null?t:pt(e.type)||"Memo";case Ae:t=e._payload,e=e._init;try{return pt(e(t))}catch{}}return null}var Ue=Array.isArray,D=r.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,P=s.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,ee={pending:!1,data:null,method:null,action:null},be=[],he=-1;function T(e){return{current:e}}function x(e){0>he||(e.current=be[he],be[he]=null,he--)}function _(e,t){he++,be[he]=e.current,e.current=t}var W=T(null),V=T(null),X=T(null),Te=T(null);function Ye(e,t){switch(_(X,t),_(V,e),_(W,null),t.nodeType){case 9:case 11:e=(e=t.documentElement)&&(e=e.namespaceURI)?kp(e):0;break;default:if(e=t.tagName,t=t.namespaceURI)t=kp(t),e=Cp(t,e);else switch(e){case"svg":e=1;break;case"math":e=2;break;default:e=0}}x(W),_(W,e)}function Ce(){x(W),x(V),x(X)}function Ft(e){e.memoizedState!==null&&_(Te,e);var t=W.current,a=Cp(t,e.type);t!==a&&(_(V,e),_(W,a))}function un(e){V.current===e&&(x(W),x(V)),Te.current===e&&(x(Te),qi._currentValue=ee)}var Xe,Rt;function bt(e){if(Xe===void 0)try{throw Error()}catch(a){var t=a.stack.trim().match(/\n( *(at )?)/);Xe=t&&t[1]||"",Rt=-1<a.stack.indexOf(`
    at`)?" (<anonymous>)":-1<a.stack.indexOf("@")?"@unknown:0:0":""}return`
`+Xe+e+Rt}var wn=!1;function ta(e,t){if(!e||wn)return"";wn=!0;var a=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{var o={DetermineComponentFrameRoot:function(){try{if(t){var G=function(){throw Error()};if(Object.defineProperty(G.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(G,[])}catch(H){var N=H}Reflect.construct(e,[],G)}else{try{G.call()}catch(H){N=H}e.call(G.prototype)}}else{try{throw Error()}catch(H){N=H}(G=e())&&typeof G.catch=="function"&&G.catch(function(){})}}catch(H){if(H&&N&&typeof H.stack=="string")return[H.stack,N.stack]}return[null,null]}};o.DetermineComponentFrameRoot.displayName="DetermineComponentFrameRoot";var i=Object.getOwnPropertyDescriptor(o.DetermineComponentFrameRoot,"name");i&&i.configurable&&Object.defineProperty(o.DetermineComponentFrameRoot,"name",{value:"DetermineComponentFrameRoot"});var l=o.DetermineComponentFrameRoot(),u=l[0],m=l[1];if(u&&m){var E=u.split(`
`),R=m.split(`
`);for(i=o=0;o<E.length&&!E[o].includes("DetermineComponentFrameRoot");)o++;for(;i<R.length&&!R[i].includes("DetermineComponentFrameRoot");)i++;if(o===E.length||i===R.length)for(o=E.length-1,i=R.length-1;1<=o&&0<=i&&E[o]!==R[i];)i--;for(;1<=o&&0<=i;o--,i--)if(E[o]!==R[i]){if(o!==1||i!==1)do if(o--,i--,0>i||E[o]!==R[i]){var M=`
`+E[o].replace(" at new "," at ");return e.displayName&&M.includes("<anonymous>")&&(M=M.replace("<anonymous>",e.displayName)),M}while(1<=o&&0<=i);break}}}finally{wn=!1,Error.prepareStackTrace=a}return(a=e?e.displayName||e.name:"")?bt(a):""}function Ca(e,t){switch(e.tag){case 26:case 27:case 5:return bt(e.type);case 16:return bt("Lazy");case 13:return e.child!==t&&t!==null?bt("Suspense Fallback"):bt("Suspense");case 19:return bt("SuspenseList");case 0:case 15:return ta(e.type,!1);case 11:return ta(e.type.render,!1);case 1:return ta(e.type,!0);case 31:return bt("Activity");default:return""}}function Da(e){try{var t="",a=null;do t+=Ca(e,a),a=e,e=e.return;while(e);return t}catch(o){return`
Error generating stack: `+o.message+`
`+o.stack}}var $=Object.prototype.hasOwnProperty,oe=n.unstable_scheduleCallback,Q=n.unstable_cancelCallback,De=n.unstable_shouldYield,ge=n.unstable_requestPaint,Ie=n.unstable_now,Re=n.unstable_getCurrentPriorityLevel,Lt=n.unstable_ImmediatePriority,dn=n.unstable_UserBlockingPriority,je=n.unstable_NormalPriority,Qt=n.unstable_LowPriority,Ha=n.unstable_IdlePriority,lr=n.log,oo=n.unstable_setDisableYieldValue,ct=null,Nt=null;function xn(e){if(typeof lr=="function"&&oo(e),Nt&&typeof Nt.setStrictMode=="function")try{Nt.setStrictMode(ct,e)}catch{}}var Tt=Math.clz32?Math.clz32:io,le=Math.log,na=Math.LN2;function io(e){return e>>>=0,e===0?32:31-(le(e)/na|0)|0}var fn=256,aa=262144,ro=4194304;function pn(e){var t=e&42;if(t!==0)return t;switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:return 64;case 128:return 128;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:return e&261888;case 262144:case 524288:case 1048576:case 2097152:return e&3932160;case 4194304:case 8388608:case 16777216:case 33554432:return e&62914560;case 67108864:return 67108864;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 0;default:return e}}function ja(e,t,a){var o=e.pendingLanes;if(o===0)return 0;var i=0,l=e.suspendedLanes,u=e.pingedLanes;e=e.warmLanes;var m=o&134217727;return m!==0?(o=m&~l,o!==0?i=pn(o):(u&=m,u!==0?i=pn(u):a||(a=m&~e,a!==0&&(i=pn(a))))):(m=o&~l,m!==0?i=pn(m):u!==0?i=pn(u):a||(a=o&~e,a!==0&&(i=pn(a)))),i===0?0:t!==0&&t!==i&&(t&l)===0&&(l=i&-i,a=t&-t,l>=a||l===32&&(a&4194048)!==0)?t:i}function hn(e,t){return(e.pendingLanes&~(e.suspendedLanes&~e.pingedLanes)&t)===0}function Gl(e,t){switch(e){case 1:case 2:case 4:case 8:case 64:return t+250;case 16:case 32:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t+5e3;case 4194304:case 8388608:case 16777216:case 33554432:return-1;case 67108864:case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function ei(){var e=ro;return ro<<=1,(ro&62914560)===0&&(ro=4194304),e}function Ma(e){for(var t=[],a=0;31>a;a++)t.push(e);return t}function Dn(e,t){e.pendingLanes|=t,t!==268435456&&(e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0)}function za(e,t,a,o,i,l){var u=e.pendingLanes;e.pendingLanes=a,e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0,e.expiredLanes&=a,e.entangledLanes&=a,e.errorRecoveryDisabledLanes&=a,e.shellSuspendCounter=0;var m=e.entanglements,E=e.expirationTimes,R=e.hiddenUpdates;for(a=u&~a;0<a;){var M=31-Tt(a),G=1<<M;m[M]=0,E[M]=-1;var N=R[M];if(N!==null)for(R[M]=null,M=0;M<N.length;M++){var H=N[M];H!==null&&(H.lane&=-536870913)}a&=~G}o!==0&&lo(e,o,0),l!==0&&i===0&&e.tag!==0&&(e.suspendedLanes|=l&~(u&~t))}function lo(e,t,a){e.pendingLanes|=t,e.suspendedLanes&=~t;var o=31-Tt(t);e.entangledLanes|=t,e.entanglements[o]=e.entanglements[o]|1073741824|a&261930}function Ua(e,t){var a=e.entangledLanes|=t;for(e=e.entanglements;a;){var o=31-Tt(a),i=1<<o;i&t|e[o]&t&&(e[o]|=t),a&=~i}}function sr(e,t){var a=t&-t;return a=(a&42)!==0?1:so(a),(a&(e.suspendedLanes|t))!==0?0:a}function so(e){switch(e){case 2:e=1;break;case 8:e=4;break;case 32:e=16;break;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:e=128;break;case 268435456:e=134217728;break;default:e=0}return e}function ti(e){return e&=-e,2<e?8<e?(e&134217727)!==0?32:268435456:8:2}function ni(){var e=P.p;return e!==0?e:(e=window.event,e===void 0?32:nh(e.type))}function ai(e,t){var a=P.p;try{return P.p=e,t()}finally{P.p=a}}var mn=Math.random().toString(36).slice(2),ut="__reactFiber$"+mn,dt="__reactProps$"+mn,oa="__reactContainer$"+mn,oi="__reactEvents$"+mn,Bl="__reactListeners$"+mn,cr="__reactHandles$"+mn,ii="__reactResources$"+mn,ia="__reactMarker$"+mn;function $a(e){delete e[ut],delete e[dt],delete e[oi],delete e[Bl],delete e[cr]}function gn(e){var t=e[ut];if(t)return t;for(var a=e.parentNode;a;){if(t=a[oa]||a[ut]){if(a=t.alternate,t.child!==null||a!==null&&a.child!==null)for(e=$p(e);e!==null;){if(a=e[ut])return a;e=$p(e)}return t}e=a,a=e.parentNode}return null}function ra(e){if(e=e[ut]||e[oa]){var t=e.tag;if(t===5||t===6||t===13||t===31||t===26||t===27||t===3)return e}return null}function Ga(e){var t=e.tag;if(t===5||t===26||t===27||t===6)return e.stateNode;throw Error(c(33))}function la(e){var t=e[ii];return t||(t=e[ii]={hoistableStyles:new Map,hoistableScripts:new Map}),t}function nt(e){e[ia]=!0}var ur=new Set,co={};function yn(e,t){sa(e,t),sa(e+"Capture",t)}function sa(e,t){for(co[e]=t,e=0;e<t.length;e++)ur.add(t[e])}var dr=RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"),ri={},fr={};function li(e){return $.call(fr,e)?!0:$.call(ri,e)?!1:dr.test(e)?fr[e]=!0:(ri[e]=!0,!1)}function uo(e,t,a){if(li(t))if(a===null)e.removeAttribute(t);else{switch(typeof a){case"undefined":case"function":case"symbol":e.removeAttribute(t);return;case"boolean":var o=t.toLowerCase().slice(0,5);if(o!=="data-"&&o!=="aria-"){e.removeAttribute(t);return}}e.setAttribute(t,""+a)}}function fo(e,t,a){if(a===null)e.removeAttribute(t);else{switch(typeof a){case"undefined":case"function":case"symbol":case"boolean":e.removeAttribute(t);return}e.setAttribute(t,""+a)}}function Jt(e,t,a,o){if(o===null)e.removeAttribute(a);else{switch(typeof o){case"undefined":case"function":case"symbol":case"boolean":e.removeAttribute(a);return}e.setAttributeNS(t,a,""+o)}}function kt(e){switch(typeof e){case"bigint":case"boolean":case"number":case"string":case"undefined":return e;case"object":return e;default:return""}}function si(e){var t=e.type;return(e=e.nodeName)&&e.toLowerCase()==="input"&&(t==="checkbox"||t==="radio")}function pr(e,t,a){var o=Object.getOwnPropertyDescriptor(e.constructor.prototype,t);if(!e.hasOwnProperty(t)&&typeof o<"u"&&typeof o.get=="function"&&typeof o.set=="function"){var i=o.get,l=o.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return i.call(this)},set:function(u){a=""+u,l.call(this,u)}}),Object.defineProperty(e,t,{enumerable:o.enumerable}),{getValue:function(){return a},setValue:function(u){a=""+u},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}function ci(e){if(!e._valueTracker){var t=si(e)?"checked":"value";e._valueTracker=pr(e,t,""+e[t])}}function hr(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var a=t.getValue(),o="";return e&&(o=si(e)?e.checked?"true":"false":e.value),e=o,e!==a?(t.setValue(e),!0):!1}function po(e){if(e=e||(typeof document<"u"?document:void 0),typeof e>"u")return null;try{return e.activeElement||e.body}catch{return e.body}}var _l=/[\n"\\]/g;function Ct(e){return e.replace(_l,function(t){return"\\"+t.charCodeAt(0).toString(16)+" "})}function k(e,t,a,o,i,l,u,m){e.name="",u!=null&&typeof u!="function"&&typeof u!="symbol"&&typeof u!="boolean"?e.type=u:e.removeAttribute("type"),t!=null?u==="number"?(t===0&&e.value===""||e.value!=t)&&(e.value=""+kt(t)):e.value!==""+kt(t)&&(e.value=""+kt(t)):u!=="submit"&&u!=="reset"||e.removeAttribute("value"),t!=null?K(e,u,kt(t)):a!=null?K(e,u,kt(a)):o!=null&&e.removeAttribute("value"),i==null&&l!=null&&(e.defaultChecked=!!l),i!=null&&(e.checked=i&&typeof i!="function"&&typeof i!="symbol"),m!=null&&typeof m!="function"&&typeof m!="symbol"&&typeof m!="boolean"?e.name=""+kt(m):e.removeAttribute("name")}function Y(e,t,a,o,i,l,u,m){if(l!=null&&typeof l!="function"&&typeof l!="symbol"&&typeof l!="boolean"&&(e.type=l),t!=null||a!=null){if(!(l!=="submit"&&l!=="reset"||t!=null)){ci(e);return}a=a!=null?""+kt(a):"",t=t!=null?""+kt(t):a,m||t===e.value||(e.value=t),e.defaultValue=t}o=o??i,o=typeof o!="function"&&typeof o!="symbol"&&!!o,e.checked=m?e.checked:!!o,e.defaultChecked=!!o,u!=null&&typeof u!="function"&&typeof u!="symbol"&&typeof u!="boolean"&&(e.name=u),ci(e)}function K(e,t,a){t==="number"&&po(e.ownerDocument)===e||e.defaultValue===""+a||(e.defaultValue=""+a)}function se(e,t,a,o){if(e=e.options,t){t={};for(var i=0;i<a.length;i++)t["$"+a[i]]=!0;for(a=0;a<e.length;a++)i=t.hasOwnProperty("$"+e[a].value),e[a].selected!==i&&(e[a].selected=i),i&&o&&(e[a].defaultSelected=!0)}else{for(a=""+kt(a),t=null,i=0;i<e.length;i++){if(e[i].value===a){e[i].selected=!0,o&&(e[i].defaultSelected=!0);return}t!==null||e[i].disabled||(t=e[i])}t!==null&&(t.selected=!0)}}function ye(e,t,a){if(t!=null&&(t=""+kt(t),t!==e.value&&(e.value=t),a==null)){e.defaultValue!==t&&(e.defaultValue=t);return}e.defaultValue=a!=null?""+kt(a):""}function Ze(e,t,a,o){if(t==null){if(o!=null){if(a!=null)throw Error(c(92));if(Ue(o)){if(1<o.length)throw Error(c(93));o=o[0]}a=o}a==null&&(a=""),t=a}a=kt(t),e.defaultValue=a,o=e.textContent,o===a&&o!==""&&o!==null&&(e.value=o),ci(e)}function We(e,t){if(t){var a=e.firstChild;if(a&&a===e.lastChild&&a.nodeType===3){a.nodeValue=t;return}}e.textContent=t}var Dt=new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));function ht(e,t,a){var o=t.indexOf("--")===0;a==null||typeof a=="boolean"||a===""?o?e.setProperty(t,""):t==="float"?e.cssFloat="":e[t]="":o?e.setProperty(t,a):typeof a!="number"||a===0||Dt.has(t)?t==="float"?e.cssFloat=a:e[t]=(""+a).trim():e[t]=a+"px"}function ho(e,t,a){if(t!=null&&typeof t!="object")throw Error(c(62));if(e=e.style,a!=null){for(var o in a)!a.hasOwnProperty(o)||t!=null&&t.hasOwnProperty(o)||(o.indexOf("--")===0?e.setProperty(o,""):o==="float"?e.cssFloat="":e[o]="");for(var i in t)o=t[i],t.hasOwnProperty(i)&&a[i]!==o&&ht(e,i,o)}else for(var l in t)t.hasOwnProperty(l)&&ht(e,l,t[l])}function bn(e){if(e.indexOf("-")===-1)return!1;switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var Em=new Map([["acceptCharset","accept-charset"],["htmlFor","for"],["httpEquiv","http-equiv"],["crossOrigin","crossorigin"],["accentHeight","accent-height"],["alignmentBaseline","alignment-baseline"],["arabicForm","arabic-form"],["baselineShift","baseline-shift"],["capHeight","cap-height"],["clipPath","clip-path"],["clipRule","clip-rule"],["colorInterpolation","color-interpolation"],["colorInterpolationFilters","color-interpolation-filters"],["colorProfile","color-profile"],["colorRendering","color-rendering"],["dominantBaseline","dominant-baseline"],["enableBackground","enable-background"],["fillOpacity","fill-opacity"],["fillRule","fill-rule"],["floodColor","flood-color"],["floodOpacity","flood-opacity"],["fontFamily","font-family"],["fontSize","font-size"],["fontSizeAdjust","font-size-adjust"],["fontStretch","font-stretch"],["fontStyle","font-style"],["fontVariant","font-variant"],["fontWeight","font-weight"],["glyphName","glyph-name"],["glyphOrientationHorizontal","glyph-orientation-horizontal"],["glyphOrientationVertical","glyph-orientation-vertical"],["horizAdvX","horiz-adv-x"],["horizOriginX","horiz-origin-x"],["imageRendering","image-rendering"],["letterSpacing","letter-spacing"],["lightingColor","lighting-color"],["markerEnd","marker-end"],["markerMid","marker-mid"],["markerStart","marker-start"],["overlinePosition","overline-position"],["overlineThickness","overline-thickness"],["paintOrder","paint-order"],["panose-1","panose-1"],["pointerEvents","pointer-events"],["renderingIntent","rendering-intent"],["shapeRendering","shape-rendering"],["stopColor","stop-color"],["stopOpacity","stop-opacity"],["strikethroughPosition","strikethrough-position"],["strikethroughThickness","strikethrough-thickness"],["strokeDasharray","stroke-dasharray"],["strokeDashoffset","stroke-dashoffset"],["strokeLinecap","stroke-linecap"],["strokeLinejoin","stroke-linejoin"],["strokeMiterlimit","stroke-miterlimit"],["strokeOpacity","stroke-opacity"],["strokeWidth","stroke-width"],["textAnchor","text-anchor"],["textDecoration","text-decoration"],["textRendering","text-rendering"],["transformOrigin","transform-origin"],["underlinePosition","underline-position"],["underlineThickness","underline-thickness"],["unicodeBidi","unicode-bidi"],["unicodeRange","unicode-range"],["unitsPerEm","units-per-em"],["vAlphabetic","v-alphabetic"],["vHanging","v-hanging"],["vIdeographic","v-ideographic"],["vMathematical","v-mathematical"],["vectorEffect","vector-effect"],["vertAdvY","vert-adv-y"],["vertOriginX","vert-origin-x"],["vertOriginY","vert-origin-y"],["wordSpacing","word-spacing"],["writingMode","writing-mode"],["xmlnsXlink","xmlns:xlink"],["xHeight","x-height"]]),vm=/^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;function mr(e){return vm.test(""+e)?"javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')":e}function Hn(){}var Pl=null;function Yl(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var mo=null,go=null;function Iu(e){var t=ra(e);if(t&&(e=t.stateNode)){var a=e[dt]||null;e:switch(e=t.stateNode,t.type){case"input":if(k(e,a.value,a.defaultValue,a.defaultValue,a.checked,a.defaultChecked,a.type,a.name),t=a.name,a.type==="radio"&&t!=null){for(a=e;a.parentNode;)a=a.parentNode;for(a=a.querySelectorAll('input[name="'+Ct(""+t)+'"][type="radio"]'),t=0;t<a.length;t++){var o=a[t];if(o!==e&&o.form===e.form){var i=o[dt]||null;if(!i)throw Error(c(90));k(o,i.value,i.defaultValue,i.defaultValue,i.checked,i.defaultChecked,i.type,i.name)}}for(t=0;t<a.length;t++)o=a[t],o.form===e.form&&hr(o)}break e;case"textarea":ye(e,a.value,a.defaultValue);break e;case"select":t=a.value,t!=null&&se(e,!!a.multiple,t,!1)}}}var Wl=!1;function Lu(e,t,a){if(Wl)return e(t,a);Wl=!0;try{var o=e(t);return o}finally{if(Wl=!1,(mo!==null||go!==null)&&(nl(),mo&&(t=mo,e=go,go=mo=null,Iu(t),e)))for(t=0;t<e.length;t++)Iu(e[t])}}function ui(e,t){var a=e.stateNode;if(a===null)return null;var o=a[dt]||null;if(o===null)return null;a=o[t];e:switch(t){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(o=!o.disabled)||(e=e.type,o=!(e==="button"||e==="input"||e==="select"||e==="textarea")),e=!o;break e;default:e=!1}if(e)return null;if(a&&typeof a!="function")throw Error(c(231,t,typeof a));return a}var jn=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),ql=!1;if(jn)try{var di={};Object.defineProperty(di,"passive",{get:function(){ql=!0}}),window.addEventListener("test",di,di),window.removeEventListener("test",di,di)}catch{ql=!1}var ca=null,Vl=null,gr=null;function ku(){if(gr)return gr;var e,t=Vl,a=t.length,o,i="value"in ca?ca.value:ca.textContent,l=i.length;for(e=0;e<a&&t[e]===i[e];e++);var u=a-e;for(o=1;o<=u&&t[a-o]===i[l-o];o++);return gr=i.slice(e,1<o?1-o:void 0)}function yr(e){var t=e.keyCode;return"charCode"in e?(e=e.charCode,e===0&&t===13&&(e=13)):e=t,e===10&&(e=13),32<=e||e===13?e:0}function br(){return!0}function Cu(){return!1}function Ht(e){function t(a,o,i,l,u){this._reactName=a,this._targetInst=i,this.type=o,this.nativeEvent=l,this.target=u,this.currentTarget=null;for(var m in e)e.hasOwnProperty(m)&&(a=e[m],this[m]=a?a(l):l[m]);return this.isDefaultPrevented=(l.defaultPrevented!=null?l.defaultPrevented:l.returnValue===!1)?br:Cu,this.isPropagationStopped=Cu,this}return z(t.prototype,{preventDefault:function(){this.defaultPrevented=!0;var a=this.nativeEvent;a&&(a.preventDefault?a.preventDefault():typeof a.returnValue!="unknown"&&(a.returnValue=!1),this.isDefaultPrevented=br)},stopPropagation:function(){var a=this.nativeEvent;a&&(a.stopPropagation?a.stopPropagation():typeof a.cancelBubble!="unknown"&&(a.cancelBubble=!0),this.isPropagationStopped=br)},persist:function(){},isPersistent:br}),t}var Ba={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},Tr=Ht(Ba),fi=z({},Ba,{view:0,detail:0}),Om=Ht(fi),Kl,Xl,pi,Er=z({},fi,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:Ql,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return"movementX"in e?e.movementX:(e!==pi&&(pi&&e.type==="mousemove"?(Kl=e.screenX-pi.screenX,Xl=e.screenY-pi.screenY):Xl=Kl=0,pi=e),Kl)},movementY:function(e){return"movementY"in e?e.movementY:Xl}}),Du=Ht(Er),Sm=z({},Er,{dataTransfer:0}),wm=Ht(Sm),xm=z({},fi,{relatedTarget:0}),Zl=Ht(xm),Am=z({},Ba,{animationName:0,elapsedTime:0,pseudoElement:0}),Fm=Ht(Am),Rm=z({},Ba,{clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),Nm=Ht(Rm),Im=z({},Ba,{data:0}),Hu=Ht(Im),Lm={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},km={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},Cm={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function Dm(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):(e=Cm[e])?!!t[e]:!1}function Ql(){return Dm}var Hm=z({},fi,{key:function(e){if(e.key){var t=Lm[e.key]||e.key;if(t!=="Unidentified")return t}return e.type==="keypress"?(e=yr(e),e===13?"Enter":String.fromCharCode(e)):e.type==="keydown"||e.type==="keyup"?km[e.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:Ql,charCode:function(e){return e.type==="keypress"?yr(e):0},keyCode:function(e){return e.type==="keydown"||e.type==="keyup"?e.keyCode:0},which:function(e){return e.type==="keypress"?yr(e):e.type==="keydown"||e.type==="keyup"?e.keyCode:0}}),jm=Ht(Hm),Mm=z({},Er,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),ju=Ht(Mm),zm=z({},fi,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:Ql}),Um=Ht(zm),$m=z({},Ba,{propertyName:0,elapsedTime:0,pseudoElement:0}),Gm=Ht($m),Bm=z({},Er,{deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0}),_m=Ht(Bm),Pm=z({},Ba,{newState:0,oldState:0}),Ym=Ht(Pm),Wm=[9,13,27,32],Jl=jn&&"CompositionEvent"in window,hi=null;jn&&"documentMode"in document&&(hi=document.documentMode);var qm=jn&&"TextEvent"in window&&!hi,Mu=jn&&(!Jl||hi&&8<hi&&11>=hi),zu=" ",Uu=!1;function $u(e,t){switch(e){case"keyup":return Wm.indexOf(t.keyCode)!==-1;case"keydown":return t.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function Gu(e){return e=e.detail,typeof e=="object"&&"data"in e?e.data:null}var yo=!1;function Vm(e,t){switch(e){case"compositionend":return Gu(t);case"keypress":return t.which!==32?null:(Uu=!0,zu);case"textInput":return e=t.data,e===zu&&Uu?null:e;default:return null}}function Km(e,t){if(yo)return e==="compositionend"||!Jl&&$u(e,t)?(e=ku(),gr=Vl=ca=null,yo=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case"compositionend":return Mu&&t.locale!=="ko"?null:t.data;default:return null}}var Xm={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function Bu(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t==="input"?!!Xm[e.type]:t==="textarea"}function _u(e,t,a,o){mo?go?go.push(o):go=[o]:mo=o,t=cl(t,"onChange"),0<t.length&&(a=new Tr("onChange","change",null,a,o),e.push({event:a,listeners:t}))}var mi=null,gi=null;function Zm(e){Ap(e,0)}function vr(e){var t=Ga(e);if(hr(t))return e}function Pu(e,t){if(e==="change")return t}var Yu=!1;if(jn){var es;if(jn){var ts="oninput"in document;if(!ts){var Wu=document.createElement("div");Wu.setAttribute("oninput","return;"),ts=typeof Wu.oninput=="function"}es=ts}else es=!1;Yu=es&&(!document.documentMode||9<document.documentMode)}function qu(){mi&&(mi.detachEvent("onpropertychange",Vu),gi=mi=null)}function Vu(e){if(e.propertyName==="value"&&vr(gi)){var t=[];_u(t,gi,e,Yl(e)),Lu(Zm,t)}}function Qm(e,t,a){e==="focusin"?(qu(),mi=t,gi=a,mi.attachEvent("onpropertychange",Vu)):e==="focusout"&&qu()}function Jm(e){if(e==="selectionchange"||e==="keyup"||e==="keydown")return vr(gi)}function eg(e,t){if(e==="click")return vr(t)}function tg(e,t){if(e==="input"||e==="change")return vr(t)}function ng(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}var Bt=typeof Object.is=="function"?Object.is:ng;function yi(e,t){if(Bt(e,t))return!0;if(typeof e!="object"||e===null||typeof t!="object"||t===null)return!1;var a=Object.keys(e),o=Object.keys(t);if(a.length!==o.length)return!1;for(o=0;o<a.length;o++){var i=a[o];if(!$.call(t,i)||!Bt(e[i],t[i]))return!1}return!0}function Ku(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function Xu(e,t){var a=Ku(e);e=0;for(var o;a;){if(a.nodeType===3){if(o=e+a.textContent.length,e<=t&&o>=t)return{node:a,offset:t-e};e=o}e:{for(;a;){if(a.nextSibling){a=a.nextSibling;break e}a=a.parentNode}a=void 0}a=Ku(a)}}function Zu(e,t){return e&&t?e===t?!0:e&&e.nodeType===3?!1:t&&t.nodeType===3?Zu(e,t.parentNode):"contains"in e?e.contains(t):e.compareDocumentPosition?!!(e.compareDocumentPosition(t)&16):!1:!1}function Qu(e){e=e!=null&&e.ownerDocument!=null&&e.ownerDocument.defaultView!=null?e.ownerDocument.defaultView:window;for(var t=po(e.document);t instanceof e.HTMLIFrameElement;){try{var a=typeof t.contentWindow.location.href=="string"}catch{a=!1}if(a)e=t.contentWindow;else break;t=po(e.document)}return t}function ns(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&(t==="input"&&(e.type==="text"||e.type==="search"||e.type==="tel"||e.type==="url"||e.type==="password")||t==="textarea"||e.contentEditable==="true")}var ag=jn&&"documentMode"in document&&11>=document.documentMode,bo=null,as=null,bi=null,os=!1;function Ju(e,t,a){var o=a.window===a?a.document:a.nodeType===9?a:a.ownerDocument;os||bo==null||bo!==po(o)||(o=bo,"selectionStart"in o&&ns(o)?o={start:o.selectionStart,end:o.selectionEnd}:(o=(o.ownerDocument&&o.ownerDocument.defaultView||window).getSelection(),o={anchorNode:o.anchorNode,anchorOffset:o.anchorOffset,focusNode:o.focusNode,focusOffset:o.focusOffset}),bi&&yi(bi,o)||(bi=o,o=cl(as,"onSelect"),0<o.length&&(t=new Tr("onSelect","select",null,t,a),e.push({event:t,listeners:o}),t.target=bo)))}function _a(e,t){var a={};return a[e.toLowerCase()]=t.toLowerCase(),a["Webkit"+e]="webkit"+t,a["Moz"+e]="moz"+t,a}var To={animationend:_a("Animation","AnimationEnd"),animationiteration:_a("Animation","AnimationIteration"),animationstart:_a("Animation","AnimationStart"),transitionrun:_a("Transition","TransitionRun"),transitionstart:_a("Transition","TransitionStart"),transitioncancel:_a("Transition","TransitionCancel"),transitionend:_a("Transition","TransitionEnd")},is={},ed={};jn&&(ed=document.createElement("div").style,"AnimationEvent"in window||(delete To.animationend.animation,delete To.animationiteration.animation,delete To.animationstart.animation),"TransitionEvent"in window||delete To.transitionend.transition);function Pa(e){if(is[e])return is[e];if(!To[e])return e;var t=To[e],a;for(a in t)if(t.hasOwnProperty(a)&&a in ed)return is[e]=t[a];return e}var td=Pa("animationend"),nd=Pa("animationiteration"),ad=Pa("animationstart"),og=Pa("transitionrun"),ig=Pa("transitionstart"),rg=Pa("transitioncancel"),od=Pa("transitionend"),id=new Map,rs="abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");rs.push("scrollEnd");function Tn(e,t){id.set(e,t),yn(t,[e])}var Or=typeof reportError=="function"?reportError:function(e){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var t=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof e=="object"&&e!==null&&typeof e.message=="string"?String(e.message):String(e),error:e});if(!window.dispatchEvent(t))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",e);return}console.error(e)},en=[],Eo=0,ls=0;function Sr(){for(var e=Eo,t=ls=Eo=0;t<e;){var a=en[t];en[t++]=null;var o=en[t];en[t++]=null;var i=en[t];en[t++]=null;var l=en[t];if(en[t++]=null,o!==null&&i!==null){var u=o.pending;u===null?i.next=i:(i.next=u.next,u.next=i),o.pending=i}l!==0&&rd(a,i,l)}}function wr(e,t,a,o){en[Eo++]=e,en[Eo++]=t,en[Eo++]=a,en[Eo++]=o,ls|=o,e.lanes|=o,e=e.alternate,e!==null&&(e.lanes|=o)}function ss(e,t,a,o){return wr(e,t,a,o),xr(e)}function Ya(e,t){return wr(e,null,null,t),xr(e)}function rd(e,t,a){e.lanes|=a;var o=e.alternate;o!==null&&(o.lanes|=a);for(var i=!1,l=e.return;l!==null;)l.childLanes|=a,o=l.alternate,o!==null&&(o.childLanes|=a),l.tag===22&&(e=l.stateNode,e===null||e._visibility&1||(i=!0)),e=l,l=l.return;return e.tag===3?(l=e.stateNode,i&&t!==null&&(i=31-Tt(a),e=l.hiddenUpdates,o=e[i],o===null?e[i]=[t]:o.push(t),t.lane=a|536870912),l):null}function xr(e){if(50<$i)throw $i=0,yc=null,Error(c(185));for(var t=e.return;t!==null;)e=t,t=e.return;return e.tag===3?e.stateNode:null}var vo={};function lg(e,t,a,o){this.tag=e,this.key=a,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.refCleanup=this.ref=null,this.pendingProps=t,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=o,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function _t(e,t,a,o){return new lg(e,t,a,o)}function cs(e){return e=e.prototype,!(!e||!e.isReactComponent)}function Mn(e,t){var a=e.alternate;return a===null?(a=_t(e.tag,t,e.key,e.mode),a.elementType=e.elementType,a.type=e.type,a.stateNode=e.stateNode,a.alternate=e,e.alternate=a):(a.pendingProps=t,a.type=e.type,a.flags=0,a.subtreeFlags=0,a.deletions=null),a.flags=e.flags&65011712,a.childLanes=e.childLanes,a.lanes=e.lanes,a.child=e.child,a.memoizedProps=e.memoizedProps,a.memoizedState=e.memoizedState,a.updateQueue=e.updateQueue,t=e.dependencies,a.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext},a.sibling=e.sibling,a.index=e.index,a.ref=e.ref,a.refCleanup=e.refCleanup,a}function ld(e,t){e.flags&=65011714;var a=e.alternate;return a===null?(e.childLanes=0,e.lanes=t,e.child=null,e.subtreeFlags=0,e.memoizedProps=null,e.memoizedState=null,e.updateQueue=null,e.dependencies=null,e.stateNode=null):(e.childLanes=a.childLanes,e.lanes=a.lanes,e.child=a.child,e.subtreeFlags=0,e.deletions=null,e.memoizedProps=a.memoizedProps,e.memoizedState=a.memoizedState,e.updateQueue=a.updateQueue,e.type=a.type,t=a.dependencies,e.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext}),e}function Ar(e,t,a,o,i,l){var u=0;if(o=e,typeof e=="function")cs(e)&&(u=1);else if(typeof e=="string")u=fy(e,a,W.current)?26:e==="html"||e==="head"||e==="body"?27:5;else e:switch(e){case Ne:return e=_t(31,a,t,i),e.elementType=Ne,e.lanes=l,e;case C:return Wa(a.children,i,l,t);case O:u=8,i|=24;break;case q:return e=_t(12,a,t,i|2),e.elementType=q,e.lanes=l,e;case ce:return e=_t(13,a,t,i),e.elementType=ce,e.lanes=l,e;case fe:return e=_t(19,a,t,i),e.elementType=fe,e.lanes=l,e;default:if(typeof e=="object"&&e!==null)switch(e.$$typeof){case B:u=10;break e;case te:u=9;break e;case ne:u=11;break e;case ae:u=14;break e;case Ae:u=16,o=null;break e}u=29,a=Error(c(130,e===null?"null":typeof e,"")),o=null}return t=_t(u,a,t,i),t.elementType=e,t.type=o,t.lanes=l,t}function Wa(e,t,a,o){return e=_t(7,e,o,t),e.lanes=a,e}function us(e,t,a){return e=_t(6,e,null,t),e.lanes=a,e}function sd(e){var t=_t(18,null,null,0);return t.stateNode=e,t}function ds(e,t,a){return t=_t(4,e.children!==null?e.children:[],e.key,t),t.lanes=a,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}var cd=new WeakMap;function tn(e,t){if(typeof e=="object"&&e!==null){var a=cd.get(e);return a!==void 0?a:(t={value:e,source:t,stack:Da(t)},cd.set(e,t),t)}return{value:e,source:t,stack:Da(t)}}var Oo=[],So=0,Fr=null,Ti=0,nn=[],an=0,ua=null,An=1,Fn="";function zn(e,t){Oo[So++]=Ti,Oo[So++]=Fr,Fr=e,Ti=t}function ud(e,t,a){nn[an++]=An,nn[an++]=Fn,nn[an++]=ua,ua=e;var o=An;e=Fn;var i=32-Tt(o)-1;o&=~(1<<i),a+=1;var l=32-Tt(t)+i;if(30<l){var u=i-i%5;l=(o&(1<<u)-1).toString(32),o>>=u,i-=u,An=1<<32-Tt(t)+i|a<<i|o,Fn=l+e}else An=1<<l|a<<i|o,Fn=e}function fs(e){e.return!==null&&(zn(e,1),ud(e,1,0))}function ps(e){for(;e===Fr;)Fr=Oo[--So],Oo[So]=null,Ti=Oo[--So],Oo[So]=null;for(;e===ua;)ua=nn[--an],nn[an]=null,Fn=nn[--an],nn[an]=null,An=nn[--an],nn[an]=null}function dd(e,t){nn[an++]=An,nn[an++]=Fn,nn[an++]=ua,An=t.id,Fn=t.overflow,ua=e}var Et=null,qe=null,we=!1,da=null,on=!1,hs=Error(c(519));function fa(e){var t=Error(c(418,1<arguments.length&&arguments[1]!==void 0&&arguments[1]?"text":"HTML",""));throw Ei(tn(t,e)),hs}function fd(e){var t=e.stateNode,a=e.type,o=e.memoizedProps;switch(t[ut]=e,t[dt]=o,a){case"dialog":ve("cancel",t),ve("close",t);break;case"iframe":case"object":case"embed":ve("load",t);break;case"video":case"audio":for(a=0;a<Bi.length;a++)ve(Bi[a],t);break;case"source":ve("error",t);break;case"img":case"image":case"link":ve("error",t),ve("load",t);break;case"details":ve("toggle",t);break;case"input":ve("invalid",t),Y(t,o.value,o.defaultValue,o.checked,o.defaultChecked,o.type,o.name,!0);break;case"select":ve("invalid",t);break;case"textarea":ve("invalid",t),Ze(t,o.value,o.defaultValue,o.children)}a=o.children,typeof a!="string"&&typeof a!="number"&&typeof a!="bigint"||t.textContent===""+a||o.suppressHydrationWarning===!0||Ip(t.textContent,a)?(o.popover!=null&&(ve("beforetoggle",t),ve("toggle",t)),o.onScroll!=null&&ve("scroll",t),o.onScrollEnd!=null&&ve("scrollend",t),o.onClick!=null&&(t.onclick=Hn),t=!0):t=!1,t||fa(e,!0)}function pd(e){for(Et=e.return;Et;)switch(Et.tag){case 5:case 31:case 13:on=!1;return;case 27:case 3:on=!0;return;default:Et=Et.return}}function wo(e){if(e!==Et)return!1;if(!we)return pd(e),we=!0,!1;var t=e.tag,a;if((a=t!==3&&t!==27)&&((a=t===5)&&(a=e.type,a=!(a!=="form"&&a!=="button")||kc(e.type,e.memoizedProps)),a=!a),a&&qe&&fa(e),pd(e),t===13){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(c(317));qe=Up(e)}else if(t===31){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(c(317));qe=Up(e)}else t===27?(t=qe,Aa(e.type)?(e=Mc,Mc=null,qe=e):qe=t):qe=Et?ln(e.stateNode.nextSibling):null;return!0}function qa(){qe=Et=null,we=!1}function ms(){var e=da;return e!==null&&(Ut===null?Ut=e:Ut.push.apply(Ut,e),da=null),e}function Ei(e){da===null?da=[e]:da.push(e)}var gs=T(null),Va=null,Un=null;function pa(e,t,a){_(gs,t._currentValue),t._currentValue=a}function $n(e){e._currentValue=gs.current,x(gs)}function ys(e,t,a){for(;e!==null;){var o=e.alternate;if((e.childLanes&t)!==t?(e.childLanes|=t,o!==null&&(o.childLanes|=t)):o!==null&&(o.childLanes&t)!==t&&(o.childLanes|=t),e===a)break;e=e.return}}function bs(e,t,a,o){var i=e.child;for(i!==null&&(i.return=e);i!==null;){var l=i.dependencies;if(l!==null){var u=i.child;l=l.firstContext;e:for(;l!==null;){var m=l;l=i;for(var E=0;E<t.length;E++)if(m.context===t[E]){l.lanes|=a,m=l.alternate,m!==null&&(m.lanes|=a),ys(l.return,a,e),o||(u=null);break e}l=m.next}}else if(i.tag===18){if(u=i.return,u===null)throw Error(c(341));u.lanes|=a,l=u.alternate,l!==null&&(l.lanes|=a),ys(u,a,e),u=null}else u=i.child;if(u!==null)u.return=i;else for(u=i;u!==null;){if(u===e){u=null;break}if(i=u.sibling,i!==null){i.return=u.return,u=i;break}u=u.return}i=u}}function xo(e,t,a,o){e=null;for(var i=t,l=!1;i!==null;){if(!l){if((i.flags&524288)!==0)l=!0;else if((i.flags&262144)!==0)break}if(i.tag===10){var u=i.alternate;if(u===null)throw Error(c(387));if(u=u.memoizedProps,u!==null){var m=i.type;Bt(i.pendingProps.value,u.value)||(e!==null?e.push(m):e=[m])}}else if(i===Te.current){if(u=i.alternate,u===null)throw Error(c(387));u.memoizedState.memoizedState!==i.memoizedState.memoizedState&&(e!==null?e.push(qi):e=[qi])}i=i.return}e!==null&&bs(t,e,a,o),t.flags|=262144}function Rr(e){for(e=e.firstContext;e!==null;){if(!Bt(e.context._currentValue,e.memoizedValue))return!0;e=e.next}return!1}function Ka(e){Va=e,Un=null,e=e.dependencies,e!==null&&(e.firstContext=null)}function vt(e){return hd(Va,e)}function Nr(e,t){return Va===null&&Ka(e),hd(e,t)}function hd(e,t){var a=t._currentValue;if(t={context:t,memoizedValue:a,next:null},Un===null){if(e===null)throw Error(c(308));Un=t,e.dependencies={lanes:0,firstContext:t},e.flags|=524288}else Un=Un.next=t;return a}var sg=typeof AbortController<"u"?AbortController:function(){var e=[],t=this.signal={aborted:!1,addEventListener:function(a,o){e.push(o)}};this.abort=function(){t.aborted=!0,e.forEach(function(a){return a()})}},cg=n.unstable_scheduleCallback,ug=n.unstable_NormalPriority,it={$$typeof:B,Consumer:null,Provider:null,_currentValue:null,_currentValue2:null,_threadCount:0};function Ts(){return{controller:new sg,data:new Map,refCount:0}}function vi(e){e.refCount--,e.refCount===0&&cg(ug,function(){e.controller.abort()})}var Oi=null,Es=0,Ao=0,Fo=null;function dg(e,t){if(Oi===null){var a=Oi=[];Es=0,Ao=Sc(),Fo={status:"pending",value:void 0,then:function(o){a.push(o)}}}return Es++,t.then(md,md),t}function md(){if(--Es===0&&Oi!==null){Fo!==null&&(Fo.status="fulfilled");var e=Oi;Oi=null,Ao=0,Fo=null;for(var t=0;t<e.length;t++)(0,e[t])()}}function fg(e,t){var a=[],o={status:"pending",value:null,reason:null,then:function(i){a.push(i)}};return e.then(function(){o.status="fulfilled",o.value=t;for(var i=0;i<a.length;i++)(0,a[i])(t)},function(i){for(o.status="rejected",o.reason=i,i=0;i<a.length;i++)(0,a[i])(void 0)}),o}var gd=D.S;D.S=function(e,t){ep=Ie(),typeof t=="object"&&t!==null&&typeof t.then=="function"&&dg(e,t),gd!==null&&gd(e,t)};var Xa=T(null);function vs(){var e=Xa.current;return e!==null?e:_e.pooledCache}function Ir(e,t){t===null?_(Xa,Xa.current):_(Xa,t.pool)}function yd(){var e=vs();return e===null?null:{parent:it._currentValue,pool:e}}var Ro=Error(c(460)),Os=Error(c(474)),Lr=Error(c(542)),kr={then:function(){}};function bd(e){return e=e.status,e==="fulfilled"||e==="rejected"}function Td(e,t,a){switch(a=e[a],a===void 0?e.push(t):a!==t&&(t.then(Hn,Hn),t=a),t.status){case"fulfilled":return t.value;case"rejected":throw e=t.reason,vd(e),e;default:if(typeof t.status=="string")t.then(Hn,Hn);else{if(e=_e,e!==null&&100<e.shellSuspendCounter)throw Error(c(482));e=t,e.status="pending",e.then(function(o){if(t.status==="pending"){var i=t;i.status="fulfilled",i.value=o}},function(o){if(t.status==="pending"){var i=t;i.status="rejected",i.reason=o}})}switch(t.status){case"fulfilled":return t.value;case"rejected":throw e=t.reason,vd(e),e}throw Qa=t,Ro}}function Za(e){try{var t=e._init;return t(e._payload)}catch(a){throw a!==null&&typeof a=="object"&&typeof a.then=="function"?(Qa=a,Ro):a}}var Qa=null;function Ed(){if(Qa===null)throw Error(c(459));var e=Qa;return Qa=null,e}function vd(e){if(e===Ro||e===Lr)throw Error(c(483))}var No=null,Si=0;function Cr(e){var t=Si;return Si+=1,No===null&&(No=[]),Td(No,e,t)}function wi(e,t){t=t.props.ref,e.ref=t!==void 0?t:null}function Dr(e,t){throw t.$$typeof===w?Error(c(525)):(e=Object.prototype.toString.call(t),Error(c(31,e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e)))}function Od(e){function t(S,v){if(e){var F=S.deletions;F===null?(S.deletions=[v],S.flags|=16):F.push(v)}}function a(S,v){if(!e)return null;for(;v!==null;)t(S,v),v=v.sibling;return null}function o(S){for(var v=new Map;S!==null;)S.key!==null?v.set(S.key,S):v.set(S.index,S),S=S.sibling;return v}function i(S,v){return S=Mn(S,v),S.index=0,S.sibling=null,S}function l(S,v,F){return S.index=F,e?(F=S.alternate,F!==null?(F=F.index,F<v?(S.flags|=67108866,v):F):(S.flags|=67108866,v)):(S.flags|=1048576,v)}function u(S){return e&&S.alternate===null&&(S.flags|=67108866),S}function m(S,v,F,U){return v===null||v.tag!==6?(v=us(F,S.mode,U),v.return=S,v):(v=i(v,F),v.return=S,v)}function E(S,v,F,U){var ie=F.type;return ie===C?M(S,v,F.props.children,U,F.key):v!==null&&(v.elementType===ie||typeof ie=="object"&&ie!==null&&ie.$$typeof===Ae&&Za(ie)===v.type)?(v=i(v,F.props),wi(v,F),v.return=S,v):(v=Ar(F.type,F.key,F.props,null,S.mode,U),wi(v,F),v.return=S,v)}function R(S,v,F,U){return v===null||v.tag!==4||v.stateNode.containerInfo!==F.containerInfo||v.stateNode.implementation!==F.implementation?(v=ds(F,S.mode,U),v.return=S,v):(v=i(v,F.children||[]),v.return=S,v)}function M(S,v,F,U,ie){return v===null||v.tag!==7?(v=Wa(F,S.mode,U,ie),v.return=S,v):(v=i(v,F),v.return=S,v)}function G(S,v,F){if(typeof v=="string"&&v!==""||typeof v=="number"||typeof v=="bigint")return v=us(""+v,S.mode,F),v.return=S,v;if(typeof v=="object"&&v!==null){switch(v.$$typeof){case I:return F=Ar(v.type,v.key,v.props,null,S.mode,F),wi(F,v),F.return=S,F;case j:return v=ds(v,S.mode,F),v.return=S,v;case Ae:return v=Za(v),G(S,v,F)}if(Ue(v)||tt(v))return v=Wa(v,S.mode,F,null),v.return=S,v;if(typeof v.then=="function")return G(S,Cr(v),F);if(v.$$typeof===B)return G(S,Nr(S,v),F);Dr(S,v)}return null}function N(S,v,F,U){var ie=v!==null?v.key:null;if(typeof F=="string"&&F!==""||typeof F=="number"||typeof F=="bigint")return ie!==null?null:m(S,v,""+F,U);if(typeof F=="object"&&F!==null){switch(F.$$typeof){case I:return F.key===ie?E(S,v,F,U):null;case j:return F.key===ie?R(S,v,F,U):null;case Ae:return F=Za(F),N(S,v,F,U)}if(Ue(F)||tt(F))return ie!==null?null:M(S,v,F,U,null);if(typeof F.then=="function")return N(S,v,Cr(F),U);if(F.$$typeof===B)return N(S,v,Nr(S,F),U);Dr(S,F)}return null}function H(S,v,F,U,ie){if(typeof U=="string"&&U!==""||typeof U=="number"||typeof U=="bigint")return S=S.get(F)||null,m(v,S,""+U,ie);if(typeof U=="object"&&U!==null){switch(U.$$typeof){case I:return S=S.get(U.key===null?F:U.key)||null,E(v,S,U,ie);case j:return S=S.get(U.key===null?F:U.key)||null,R(v,S,U,ie);case Ae:return U=Za(U),H(S,v,F,U,ie)}if(Ue(U)||tt(U))return S=S.get(F)||null,M(v,S,U,ie,null);if(typeof U.then=="function")return H(S,v,F,Cr(U),ie);if(U.$$typeof===B)return H(S,v,F,Nr(v,U),ie);Dr(v,U)}return null}function Z(S,v,F,U){for(var ie=null,Le=null,J=v,me=v=0,Se=null;J!==null&&me<F.length;me++){J.index>me?(Se=J,J=null):Se=J.sibling;var ke=N(S,J,F[me],U);if(ke===null){J===null&&(J=Se);break}e&&J&&ke.alternate===null&&t(S,J),v=l(ke,v,me),Le===null?ie=ke:Le.sibling=ke,Le=ke,J=Se}if(me===F.length)return a(S,J),we&&zn(S,me),ie;if(J===null){for(;me<F.length;me++)J=G(S,F[me],U),J!==null&&(v=l(J,v,me),Le===null?ie=J:Le.sibling=J,Le=J);return we&&zn(S,me),ie}for(J=o(J);me<F.length;me++)Se=H(J,S,me,F[me],U),Se!==null&&(e&&Se.alternate!==null&&J.delete(Se.key===null?me:Se.key),v=l(Se,v,me),Le===null?ie=Se:Le.sibling=Se,Le=Se);return e&&J.forEach(function(La){return t(S,La)}),we&&zn(S,me),ie}function re(S,v,F,U){if(F==null)throw Error(c(151));for(var ie=null,Le=null,J=v,me=v=0,Se=null,ke=F.next();J!==null&&!ke.done;me++,ke=F.next()){J.index>me?(Se=J,J=null):Se=J.sibling;var La=N(S,J,ke.value,U);if(La===null){J===null&&(J=Se);break}e&&J&&La.alternate===null&&t(S,J),v=l(La,v,me),Le===null?ie=La:Le.sibling=La,Le=La,J=Se}if(ke.done)return a(S,J),we&&zn(S,me),ie;if(J===null){for(;!ke.done;me++,ke=F.next())ke=G(S,ke.value,U),ke!==null&&(v=l(ke,v,me),Le===null?ie=ke:Le.sibling=ke,Le=ke);return we&&zn(S,me),ie}for(J=o(J);!ke.done;me++,ke=F.next())ke=H(J,S,me,ke.value,U),ke!==null&&(e&&ke.alternate!==null&&J.delete(ke.key===null?me:ke.key),v=l(ke,v,me),Le===null?ie=ke:Le.sibling=ke,Le=ke);return e&&J.forEach(function(Sy){return t(S,Sy)}),we&&zn(S,me),ie}function Be(S,v,F,U){if(typeof F=="object"&&F!==null&&F.type===C&&F.key===null&&(F=F.props.children),typeof F=="object"&&F!==null){switch(F.$$typeof){case I:e:{for(var ie=F.key;v!==null;){if(v.key===ie){if(ie=F.type,ie===C){if(v.tag===7){a(S,v.sibling),U=i(v,F.props.children),U.return=S,S=U;break e}}else if(v.elementType===ie||typeof ie=="object"&&ie!==null&&ie.$$typeof===Ae&&Za(ie)===v.type){a(S,v.sibling),U=i(v,F.props),wi(U,F),U.return=S,S=U;break e}a(S,v);break}else t(S,v);v=v.sibling}F.type===C?(U=Wa(F.props.children,S.mode,U,F.key),U.return=S,S=U):(U=Ar(F.type,F.key,F.props,null,S.mode,U),wi(U,F),U.return=S,S=U)}return u(S);case j:e:{for(ie=F.key;v!==null;){if(v.key===ie)if(v.tag===4&&v.stateNode.containerInfo===F.containerInfo&&v.stateNode.implementation===F.implementation){a(S,v.sibling),U=i(v,F.children||[]),U.return=S,S=U;break e}else{a(S,v);break}else t(S,v);v=v.sibling}U=ds(F,S.mode,U),U.return=S,S=U}return u(S);case Ae:return F=Za(F),Be(S,v,F,U)}if(Ue(F))return Z(S,v,F,U);if(tt(F)){if(ie=tt(F),typeof ie!="function")throw Error(c(150));return F=ie.call(F),re(S,v,F,U)}if(typeof F.then=="function")return Be(S,v,Cr(F),U);if(F.$$typeof===B)return Be(S,v,Nr(S,F),U);Dr(S,F)}return typeof F=="string"&&F!==""||typeof F=="number"||typeof F=="bigint"?(F=""+F,v!==null&&v.tag===6?(a(S,v.sibling),U=i(v,F),U.return=S,S=U):(a(S,v),U=us(F,S.mode,U),U.return=S,S=U),u(S)):a(S,v)}return function(S,v,F,U){try{Si=0;var ie=Be(S,v,F,U);return No=null,ie}catch(J){if(J===Ro||J===Lr)throw J;var Le=_t(29,J,null,S.mode);return Le.lanes=U,Le.return=S,Le}}}var Ja=Od(!0),Sd=Od(!1),ha=!1;function Ss(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,lanes:0,hiddenCallbacks:null},callbacks:null}}function ws(e,t){e=e.updateQueue,t.updateQueue===e&&(t.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,callbacks:null})}function ma(e){return{lane:e,tag:0,payload:null,callback:null,next:null}}function ga(e,t,a){var o=e.updateQueue;if(o===null)return null;if(o=o.shared,(He&2)!==0){var i=o.pending;return i===null?t.next=t:(t.next=i.next,i.next=t),o.pending=t,t=xr(e),rd(e,null,a),t}return wr(e,o,t,a),xr(e)}function xi(e,t,a){if(t=t.updateQueue,t!==null&&(t=t.shared,(a&4194048)!==0)){var o=t.lanes;o&=e.pendingLanes,a|=o,t.lanes=a,Ua(e,a)}}function xs(e,t){var a=e.updateQueue,o=e.alternate;if(o!==null&&(o=o.updateQueue,a===o)){var i=null,l=null;if(a=a.firstBaseUpdate,a!==null){do{var u={lane:a.lane,tag:a.tag,payload:a.payload,callback:null,next:null};l===null?i=l=u:l=l.next=u,a=a.next}while(a!==null);l===null?i=l=t:l=l.next=t}else i=l=t;a={baseState:o.baseState,firstBaseUpdate:i,lastBaseUpdate:l,shared:o.shared,callbacks:o.callbacks},e.updateQueue=a;return}e=a.lastBaseUpdate,e===null?a.firstBaseUpdate=t:e.next=t,a.lastBaseUpdate=t}var As=!1;function Ai(){if(As){var e=Fo;if(e!==null)throw e}}function Fi(e,t,a,o){As=!1;var i=e.updateQueue;ha=!1;var l=i.firstBaseUpdate,u=i.lastBaseUpdate,m=i.shared.pending;if(m!==null){i.shared.pending=null;var E=m,R=E.next;E.next=null,u===null?l=R:u.next=R,u=E;var M=e.alternate;M!==null&&(M=M.updateQueue,m=M.lastBaseUpdate,m!==u&&(m===null?M.firstBaseUpdate=R:m.next=R,M.lastBaseUpdate=E))}if(l!==null){var G=i.baseState;u=0,M=R=E=null,m=l;do{var N=m.lane&-536870913,H=N!==m.lane;if(H?(Oe&N)===N:(o&N)===N){N!==0&&N===Ao&&(As=!0),M!==null&&(M=M.next={lane:0,tag:m.tag,payload:m.payload,callback:null,next:null});e:{var Z=e,re=m;N=t;var Be=a;switch(re.tag){case 1:if(Z=re.payload,typeof Z=="function"){G=Z.call(Be,G,N);break e}G=Z;break e;case 3:Z.flags=Z.flags&-65537|128;case 0:if(Z=re.payload,N=typeof Z=="function"?Z.call(Be,G,N):Z,N==null)break e;G=z({},G,N);break e;case 2:ha=!0}}N=m.callback,N!==null&&(e.flags|=64,H&&(e.flags|=8192),H=i.callbacks,H===null?i.callbacks=[N]:H.push(N))}else H={lane:N,tag:m.tag,payload:m.payload,callback:m.callback,next:null},M===null?(R=M=H,E=G):M=M.next=H,u|=N;if(m=m.next,m===null){if(m=i.shared.pending,m===null)break;H=m,m=H.next,H.next=null,i.lastBaseUpdate=H,i.shared.pending=null}}while(!0);M===null&&(E=G),i.baseState=E,i.firstBaseUpdate=R,i.lastBaseUpdate=M,l===null&&(i.shared.lanes=0),va|=u,e.lanes=u,e.memoizedState=G}}function wd(e,t){if(typeof e!="function")throw Error(c(191,e));e.call(t)}function xd(e,t){var a=e.callbacks;if(a!==null)for(e.callbacks=null,e=0;e<a.length;e++)wd(a[e],t)}var Io=T(null),Hr=T(0);function Ad(e,t){e=Kn,_(Hr,e),_(Io,t),Kn=e|t.baseLanes}function Fs(){_(Hr,Kn),_(Io,Io.current)}function Rs(){Kn=Hr.current,x(Io),x(Hr)}var Pt=T(null),rn=null;function ya(e){var t=e.alternate;_(at,at.current&1),_(Pt,e),rn===null&&(t===null||Io.current!==null||t.memoizedState!==null)&&(rn=e)}function Ns(e){_(at,at.current),_(Pt,e),rn===null&&(rn=e)}function Fd(e){e.tag===22?(_(at,at.current),_(Pt,e),rn===null&&(rn=e)):ba()}function ba(){_(at,at.current),_(Pt,Pt.current)}function Yt(e){x(Pt),rn===e&&(rn=null),x(at)}var at=T(0);function jr(e){for(var t=e;t!==null;){if(t.tag===13){var a=t.memoizedState;if(a!==null&&(a=a.dehydrated,a===null||Hc(a)||jc(a)))return t}else if(t.tag===19&&(t.memoizedProps.revealOrder==="forwards"||t.memoizedProps.revealOrder==="backwards"||t.memoizedProps.revealOrder==="unstable_legacy-backwards"||t.memoizedProps.revealOrder==="together")){if((t.flags&128)!==0)return t}else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}return null}var Gn=0,pe=null,$e=null,rt=null,Mr=!1,Lo=!1,eo=!1,zr=0,Ri=0,ko=null,pg=0;function Qe(){throw Error(c(321))}function Is(e,t){if(t===null)return!1;for(var a=0;a<t.length&&a<e.length;a++)if(!Bt(e[a],t[a]))return!1;return!0}function Ls(e,t,a,o,i,l){return Gn=l,pe=t,t.memoizedState=null,t.updateQueue=null,t.lanes=0,D.H=e===null||e.memoizedState===null?df:Ws,eo=!1,l=a(o,i),eo=!1,Lo&&(l=Nd(t,a,o,i)),Rd(e),l}function Rd(e){D.H=Li;var t=$e!==null&&$e.next!==null;if(Gn=0,rt=$e=pe=null,Mr=!1,Ri=0,ko=null,t)throw Error(c(300));e===null||lt||(e=e.dependencies,e!==null&&Rr(e)&&(lt=!0))}function Nd(e,t,a,o){pe=e;var i=0;do{if(Lo&&(ko=null),Ri=0,Lo=!1,25<=i)throw Error(c(301));if(i+=1,rt=$e=null,e.updateQueue!=null){var l=e.updateQueue;l.lastEffect=null,l.events=null,l.stores=null,l.memoCache!=null&&(l.memoCache.index=0)}D.H=ff,l=t(a,o)}while(Lo);return l}function hg(){var e=D.H,t=e.useState()[0];return t=typeof t.then=="function"?Ni(t):t,e=e.useState()[0],($e!==null?$e.memoizedState:null)!==e&&(pe.flags|=1024),t}function ks(){var e=zr!==0;return zr=0,e}function Cs(e,t,a){t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~a}function Ds(e){if(Mr){for(e=e.memoizedState;e!==null;){var t=e.queue;t!==null&&(t.pending=null),e=e.next}Mr=!1}Gn=0,rt=$e=pe=null,Lo=!1,Ri=zr=0,ko=null}function It(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return rt===null?pe.memoizedState=rt=e:rt=rt.next=e,rt}function ot(){if($e===null){var e=pe.alternate;e=e!==null?e.memoizedState:null}else e=$e.next;var t=rt===null?pe.memoizedState:rt.next;if(t!==null)rt=t,$e=e;else{if(e===null)throw pe.alternate===null?Error(c(467)):Error(c(310));$e=e,e={memoizedState:$e.memoizedState,baseState:$e.baseState,baseQueue:$e.baseQueue,queue:$e.queue,next:null},rt===null?pe.memoizedState=rt=e:rt=rt.next=e}return rt}function Ur(){return{lastEffect:null,events:null,stores:null,memoCache:null}}function Ni(e){var t=Ri;return Ri+=1,ko===null&&(ko=[]),e=Td(ko,e,t),t=pe,(rt===null?t.memoizedState:rt.next)===null&&(t=t.alternate,D.H=t===null||t.memoizedState===null?df:Ws),e}function $r(e){if(e!==null&&typeof e=="object"){if(typeof e.then=="function")return Ni(e);if(e.$$typeof===B)return vt(e)}throw Error(c(438,String(e)))}function Hs(e){var t=null,a=pe.updateQueue;if(a!==null&&(t=a.memoCache),t==null){var o=pe.alternate;o!==null&&(o=o.updateQueue,o!==null&&(o=o.memoCache,o!=null&&(t={data:o.data.map(function(i){return i.slice()}),index:0})))}if(t==null&&(t={data:[],index:0}),a===null&&(a=Ur(),pe.updateQueue=a),a.memoCache=t,a=t.data[t.index],a===void 0)for(a=t.data[t.index]=Array(e),o=0;o<e;o++)a[o]=Pe;return t.index++,a}function Bn(e,t){return typeof t=="function"?t(e):t}function Gr(e){var t=ot();return js(t,$e,e)}function js(e,t,a){var o=e.queue;if(o===null)throw Error(c(311));o.lastRenderedReducer=a;var i=e.baseQueue,l=o.pending;if(l!==null){if(i!==null){var u=i.next;i.next=l.next,l.next=u}t.baseQueue=i=l,o.pending=null}if(l=e.baseState,i===null)e.memoizedState=l;else{t=i.next;var m=u=null,E=null,R=t,M=!1;do{var G=R.lane&-536870913;if(G!==R.lane?(Oe&G)===G:(Gn&G)===G){var N=R.revertLane;if(N===0)E!==null&&(E=E.next={lane:0,revertLane:0,gesture:null,action:R.action,hasEagerState:R.hasEagerState,eagerState:R.eagerState,next:null}),G===Ao&&(M=!0);else if((Gn&N)===N){R=R.next,N===Ao&&(M=!0);continue}else G={lane:0,revertLane:R.revertLane,gesture:null,action:R.action,hasEagerState:R.hasEagerState,eagerState:R.eagerState,next:null},E===null?(m=E=G,u=l):E=E.next=G,pe.lanes|=N,va|=N;G=R.action,eo&&a(l,G),l=R.hasEagerState?R.eagerState:a(l,G)}else N={lane:G,revertLane:R.revertLane,gesture:R.gesture,action:R.action,hasEagerState:R.hasEagerState,eagerState:R.eagerState,next:null},E===null?(m=E=N,u=l):E=E.next=N,pe.lanes|=G,va|=G;R=R.next}while(R!==null&&R!==t);if(E===null?u=l:E.next=m,!Bt(l,e.memoizedState)&&(lt=!0,M&&(a=Fo,a!==null)))throw a;e.memoizedState=l,e.baseState=u,e.baseQueue=E,o.lastRenderedState=l}return i===null&&(o.lanes=0),[e.memoizedState,o.dispatch]}function Ms(e){var t=ot(),a=t.queue;if(a===null)throw Error(c(311));a.lastRenderedReducer=e;var o=a.dispatch,i=a.pending,l=t.memoizedState;if(i!==null){a.pending=null;var u=i=i.next;do l=e(l,u.action),u=u.next;while(u!==i);Bt(l,t.memoizedState)||(lt=!0),t.memoizedState=l,t.baseQueue===null&&(t.baseState=l),a.lastRenderedState=l}return[l,o]}function Id(e,t,a){var o=pe,i=ot(),l=we;if(l){if(a===void 0)throw Error(c(407));a=a()}else a=t();var u=!Bt(($e||i).memoizedState,a);if(u&&(i.memoizedState=a,lt=!0),i=i.queue,$s(Cd.bind(null,o,i,e),[e]),i.getSnapshot!==t||u||rt!==null&&rt.memoizedState.tag&1){if(o.flags|=2048,Co(9,{destroy:void 0},kd.bind(null,o,i,a,t),null),_e===null)throw Error(c(349));l||(Gn&127)!==0||Ld(o,t,a)}return a}function Ld(e,t,a){e.flags|=16384,e={getSnapshot:t,value:a},t=pe.updateQueue,t===null?(t=Ur(),pe.updateQueue=t,t.stores=[e]):(a=t.stores,a===null?t.stores=[e]:a.push(e))}function kd(e,t,a,o){t.value=a,t.getSnapshot=o,Dd(t)&&Hd(e)}function Cd(e,t,a){return a(function(){Dd(t)&&Hd(e)})}function Dd(e){var t=e.getSnapshot;e=e.value;try{var a=t();return!Bt(e,a)}catch{return!0}}function Hd(e){var t=Ya(e,2);t!==null&&$t(t,e,2)}function zs(e){var t=It();if(typeof e=="function"){var a=e;if(e=a(),eo){xn(!0);try{a()}finally{xn(!1)}}}return t.memoizedState=t.baseState=e,t.queue={pending:null,lanes:0,dispatch:null,lastRenderedReducer:Bn,lastRenderedState:e},t}function jd(e,t,a,o){return e.baseState=a,js(e,$e,typeof o=="function"?o:Bn)}function mg(e,t,a,o,i){if(Pr(e))throw Error(c(485));if(e=t.action,e!==null){var l={payload:i,action:e,next:null,isTransition:!0,status:"pending",value:null,reason:null,listeners:[],then:function(u){l.listeners.push(u)}};D.T!==null?a(!0):l.isTransition=!1,o(l),a=t.pending,a===null?(l.next=t.pending=l,Md(t,l)):(l.next=a.next,t.pending=a.next=l)}}function Md(e,t){var a=t.action,o=t.payload,i=e.state;if(t.isTransition){var l=D.T,u={};D.T=u;try{var m=a(i,o),E=D.S;E!==null&&E(u,m),zd(e,t,m)}catch(R){Us(e,t,R)}finally{l!==null&&u.types!==null&&(l.types=u.types),D.T=l}}else try{l=a(i,o),zd(e,t,l)}catch(R){Us(e,t,R)}}function zd(e,t,a){a!==null&&typeof a=="object"&&typeof a.then=="function"?a.then(function(o){Ud(e,t,o)},function(o){return Us(e,t,o)}):Ud(e,t,a)}function Ud(e,t,a){t.status="fulfilled",t.value=a,$d(t),e.state=a,t=e.pending,t!==null&&(a=t.next,a===t?e.pending=null:(a=a.next,t.next=a,Md(e,a)))}function Us(e,t,a){var o=e.pending;if(e.pending=null,o!==null){o=o.next;do t.status="rejected",t.reason=a,$d(t),t=t.next;while(t!==o)}e.action=null}function $d(e){e=e.listeners;for(var t=0;t<e.length;t++)(0,e[t])()}function Gd(e,t){return t}function Bd(e,t){if(we){var a=_e.formState;if(a!==null){e:{var o=pe;if(we){if(qe){t:{for(var i=qe,l=on;i.nodeType!==8;){if(!l){i=null;break t}if(i=ln(i.nextSibling),i===null){i=null;break t}}l=i.data,i=l==="F!"||l==="F"?i:null}if(i){qe=ln(i.nextSibling),o=i.data==="F!";break e}}fa(o)}o=!1}o&&(t=a[0])}}return a=It(),a.memoizedState=a.baseState=t,o={pending:null,lanes:0,dispatch:null,lastRenderedReducer:Gd,lastRenderedState:t},a.queue=o,a=sf.bind(null,pe,o),o.dispatch=a,o=zs(!1),l=Ys.bind(null,pe,!1,o.queue),o=It(),i={state:t,dispatch:null,action:e,pending:null},o.queue=i,a=mg.bind(null,pe,i,l,a),i.dispatch=a,o.memoizedState=e,[t,a,!1]}function _d(e){var t=ot();return Pd(t,$e,e)}function Pd(e,t,a){if(t=js(e,t,Gd)[0],e=Gr(Bn)[0],typeof t=="object"&&t!==null&&typeof t.then=="function")try{var o=Ni(t)}catch(u){throw u===Ro?Lr:u}else o=t;t=ot();var i=t.queue,l=i.dispatch;return a!==t.memoizedState&&(pe.flags|=2048,Co(9,{destroy:void 0},gg.bind(null,i,a),null)),[o,l,e]}function gg(e,t){e.action=t}function Yd(e){var t=ot(),a=$e;if(a!==null)return Pd(t,a,e);ot(),t=t.memoizedState,a=ot();var o=a.queue.dispatch;return a.memoizedState=e,[t,o,!1]}function Co(e,t,a,o){return e={tag:e,create:a,deps:o,inst:t,next:null},t=pe.updateQueue,t===null&&(t=Ur(),pe.updateQueue=t),a=t.lastEffect,a===null?t.lastEffect=e.next=e:(o=a.next,a.next=e,e.next=o,t.lastEffect=e),e}function Wd(){return ot().memoizedState}function Br(e,t,a,o){var i=It();pe.flags|=e,i.memoizedState=Co(1|t,{destroy:void 0},a,o===void 0?null:o)}function _r(e,t,a,o){var i=ot();o=o===void 0?null:o;var l=i.memoizedState.inst;$e!==null&&o!==null&&Is(o,$e.memoizedState.deps)?i.memoizedState=Co(t,l,a,o):(pe.flags|=e,i.memoizedState=Co(1|t,l,a,o))}function qd(e,t){Br(8390656,8,e,t)}function $s(e,t){_r(2048,8,e,t)}function yg(e){pe.flags|=4;var t=pe.updateQueue;if(t===null)t=Ur(),pe.updateQueue=t,t.events=[e];else{var a=t.events;a===null?t.events=[e]:a.push(e)}}function Vd(e){var t=ot().memoizedState;return yg({ref:t,nextImpl:e}),function(){if((He&2)!==0)throw Error(c(440));return t.impl.apply(void 0,arguments)}}function Kd(e,t){return _r(4,2,e,t)}function Xd(e,t){return _r(4,4,e,t)}function Zd(e,t){if(typeof t=="function"){e=e();var a=t(e);return function(){typeof a=="function"?a():t(null)}}if(t!=null)return e=e(),t.current=e,function(){t.current=null}}function Qd(e,t,a){a=a!=null?a.concat([e]):null,_r(4,4,Zd.bind(null,t,e),a)}function Gs(){}function Jd(e,t){var a=ot();t=t===void 0?null:t;var o=a.memoizedState;return t!==null&&Is(t,o[1])?o[0]:(a.memoizedState=[e,t],e)}function ef(e,t){var a=ot();t=t===void 0?null:t;var o=a.memoizedState;if(t!==null&&Is(t,o[1]))return o[0];if(o=e(),eo){xn(!0);try{e()}finally{xn(!1)}}return a.memoizedState=[o,t],o}function Bs(e,t,a){return a===void 0||(Gn&1073741824)!==0&&(Oe&261930)===0?e.memoizedState=t:(e.memoizedState=a,e=np(),pe.lanes|=e,va|=e,a)}function tf(e,t,a,o){return Bt(a,t)?a:Io.current!==null?(e=Bs(e,a,o),Bt(e,t)||(lt=!0),e):(Gn&42)===0||(Gn&1073741824)!==0&&(Oe&261930)===0?(lt=!0,e.memoizedState=a):(e=np(),pe.lanes|=e,va|=e,t)}function nf(e,t,a,o,i){var l=P.p;P.p=l!==0&&8>l?l:8;var u=D.T,m={};D.T=m,Ys(e,!1,t,a);try{var E=i(),R=D.S;if(R!==null&&R(m,E),E!==null&&typeof E=="object"&&typeof E.then=="function"){var M=fg(E,o);Ii(e,t,M,Vt(e))}else Ii(e,t,o,Vt(e))}catch(G){Ii(e,t,{then:function(){},status:"rejected",reason:G},Vt())}finally{P.p=l,u!==null&&m.types!==null&&(u.types=m.types),D.T=u}}function bg(){}function _s(e,t,a,o){if(e.tag!==5)throw Error(c(476));var i=af(e).queue;nf(e,i,t,ee,a===null?bg:function(){return of(e),a(o)})}function af(e){var t=e.memoizedState;if(t!==null)return t;t={memoizedState:ee,baseState:ee,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:Bn,lastRenderedState:ee},next:null};var a={};return t.next={memoizedState:a,baseState:a,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:Bn,lastRenderedState:a},next:null},e.memoizedState=t,e=e.alternate,e!==null&&(e.memoizedState=t),t}function of(e){var t=af(e);t.next===null&&(t=e.alternate.memoizedState),Ii(e,t.next.queue,{},Vt())}function Ps(){return vt(qi)}function rf(){return ot().memoizedState}function lf(){return ot().memoizedState}function Tg(e){for(var t=e.return;t!==null;){switch(t.tag){case 24:case 3:var a=Vt();e=ma(a);var o=ga(t,e,a);o!==null&&($t(o,t,a),xi(o,t,a)),t={cache:Ts()},e.payload=t;return}t=t.return}}function Eg(e,t,a){var o=Vt();a={lane:o,revertLane:0,gesture:null,action:a,hasEagerState:!1,eagerState:null,next:null},Pr(e)?cf(t,a):(a=ss(e,t,a,o),a!==null&&($t(a,e,o),uf(a,t,o)))}function sf(e,t,a){var o=Vt();Ii(e,t,a,o)}function Ii(e,t,a,o){var i={lane:o,revertLane:0,gesture:null,action:a,hasEagerState:!1,eagerState:null,next:null};if(Pr(e))cf(t,i);else{var l=e.alternate;if(e.lanes===0&&(l===null||l.lanes===0)&&(l=t.lastRenderedReducer,l!==null))try{var u=t.lastRenderedState,m=l(u,a);if(i.hasEagerState=!0,i.eagerState=m,Bt(m,u))return wr(e,t,i,0),_e===null&&Sr(),!1}catch{}if(a=ss(e,t,i,o),a!==null)return $t(a,e,o),uf(a,t,o),!0}return!1}function Ys(e,t,a,o){if(o={lane:2,revertLane:Sc(),gesture:null,action:o,hasEagerState:!1,eagerState:null,next:null},Pr(e)){if(t)throw Error(c(479))}else t=ss(e,a,o,2),t!==null&&$t(t,e,2)}function Pr(e){var t=e.alternate;return e===pe||t!==null&&t===pe}function cf(e,t){Lo=Mr=!0;var a=e.pending;a===null?t.next=t:(t.next=a.next,a.next=t),e.pending=t}function uf(e,t,a){if((a&4194048)!==0){var o=t.lanes;o&=e.pendingLanes,a|=o,t.lanes=a,Ua(e,a)}}var Li={readContext:vt,use:$r,useCallback:Qe,useContext:Qe,useEffect:Qe,useImperativeHandle:Qe,useLayoutEffect:Qe,useInsertionEffect:Qe,useMemo:Qe,useReducer:Qe,useRef:Qe,useState:Qe,useDebugValue:Qe,useDeferredValue:Qe,useTransition:Qe,useSyncExternalStore:Qe,useId:Qe,useHostTransitionStatus:Qe,useFormState:Qe,useActionState:Qe,useOptimistic:Qe,useMemoCache:Qe,useCacheRefresh:Qe};Li.useEffectEvent=Qe;var df={readContext:vt,use:$r,useCallback:function(e,t){return It().memoizedState=[e,t===void 0?null:t],e},useContext:vt,useEffect:qd,useImperativeHandle:function(e,t,a){a=a!=null?a.concat([e]):null,Br(4194308,4,Zd.bind(null,t,e),a)},useLayoutEffect:function(e,t){return Br(4194308,4,e,t)},useInsertionEffect:function(e,t){Br(4,2,e,t)},useMemo:function(e,t){var a=It();t=t===void 0?null:t;var o=e();if(eo){xn(!0);try{e()}finally{xn(!1)}}return a.memoizedState=[o,t],o},useReducer:function(e,t,a){var o=It();if(a!==void 0){var i=a(t);if(eo){xn(!0);try{a(t)}finally{xn(!1)}}}else i=t;return o.memoizedState=o.baseState=i,e={pending:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:i},o.queue=e,e=e.dispatch=Eg.bind(null,pe,e),[o.memoizedState,e]},useRef:function(e){var t=It();return e={current:e},t.memoizedState=e},useState:function(e){e=zs(e);var t=e.queue,a=sf.bind(null,pe,t);return t.dispatch=a,[e.memoizedState,a]},useDebugValue:Gs,useDeferredValue:function(e,t){var a=It();return Bs(a,e,t)},useTransition:function(){var e=zs(!1);return e=nf.bind(null,pe,e.queue,!0,!1),It().memoizedState=e,[!1,e]},useSyncExternalStore:function(e,t,a){var o=pe,i=It();if(we){if(a===void 0)throw Error(c(407));a=a()}else{if(a=t(),_e===null)throw Error(c(349));(Oe&127)!==0||Ld(o,t,a)}i.memoizedState=a;var l={value:a,getSnapshot:t};return i.queue=l,qd(Cd.bind(null,o,l,e),[e]),o.flags|=2048,Co(9,{destroy:void 0},kd.bind(null,o,l,a,t),null),a},useId:function(){var e=It(),t=_e.identifierPrefix;if(we){var a=Fn,o=An;a=(o&~(1<<32-Tt(o)-1)).toString(32)+a,t="_"+t+"R_"+a,a=zr++,0<a&&(t+="H"+a.toString(32)),t+="_"}else a=pg++,t="_"+t+"r_"+a.toString(32)+"_";return e.memoizedState=t},useHostTransitionStatus:Ps,useFormState:Bd,useActionState:Bd,useOptimistic:function(e){var t=It();t.memoizedState=t.baseState=e;var a={pending:null,lanes:0,dispatch:null,lastRenderedReducer:null,lastRenderedState:null};return t.queue=a,t=Ys.bind(null,pe,!0,a),a.dispatch=t,[e,t]},useMemoCache:Hs,useCacheRefresh:function(){return It().memoizedState=Tg.bind(null,pe)},useEffectEvent:function(e){var t=It(),a={impl:e};return t.memoizedState=a,function(){if((He&2)!==0)throw Error(c(440));return a.impl.apply(void 0,arguments)}}},Ws={readContext:vt,use:$r,useCallback:Jd,useContext:vt,useEffect:$s,useImperativeHandle:Qd,useInsertionEffect:Kd,useLayoutEffect:Xd,useMemo:ef,useReducer:Gr,useRef:Wd,useState:function(){return Gr(Bn)},useDebugValue:Gs,useDeferredValue:function(e,t){var a=ot();return tf(a,$e.memoizedState,e,t)},useTransition:function(){var e=Gr(Bn)[0],t=ot().memoizedState;return[typeof e=="boolean"?e:Ni(e),t]},useSyncExternalStore:Id,useId:rf,useHostTransitionStatus:Ps,useFormState:_d,useActionState:_d,useOptimistic:function(e,t){var a=ot();return jd(a,$e,e,t)},useMemoCache:Hs,useCacheRefresh:lf};Ws.useEffectEvent=Vd;var ff={readContext:vt,use:$r,useCallback:Jd,useContext:vt,useEffect:$s,useImperativeHandle:Qd,useInsertionEffect:Kd,useLayoutEffect:Xd,useMemo:ef,useReducer:Ms,useRef:Wd,useState:function(){return Ms(Bn)},useDebugValue:Gs,useDeferredValue:function(e,t){var a=ot();return $e===null?Bs(a,e,t):tf(a,$e.memoizedState,e,t)},useTransition:function(){var e=Ms(Bn)[0],t=ot().memoizedState;return[typeof e=="boolean"?e:Ni(e),t]},useSyncExternalStore:Id,useId:rf,useHostTransitionStatus:Ps,useFormState:Yd,useActionState:Yd,useOptimistic:function(e,t){var a=ot();return $e!==null?jd(a,$e,e,t):(a.baseState=e,[e,a.queue.dispatch])},useMemoCache:Hs,useCacheRefresh:lf};ff.useEffectEvent=Vd;function qs(e,t,a,o){t=e.memoizedState,a=a(o,t),a=a==null?t:z({},t,a),e.memoizedState=a,e.lanes===0&&(e.updateQueue.baseState=a)}var Vs={enqueueSetState:function(e,t,a){e=e._reactInternals;var o=Vt(),i=ma(o);i.payload=t,a!=null&&(i.callback=a),t=ga(e,i,o),t!==null&&($t(t,e,o),xi(t,e,o))},enqueueReplaceState:function(e,t,a){e=e._reactInternals;var o=Vt(),i=ma(o);i.tag=1,i.payload=t,a!=null&&(i.callback=a),t=ga(e,i,o),t!==null&&($t(t,e,o),xi(t,e,o))},enqueueForceUpdate:function(e,t){e=e._reactInternals;var a=Vt(),o=ma(a);o.tag=2,t!=null&&(o.callback=t),t=ga(e,o,a),t!==null&&($t(t,e,a),xi(t,e,a))}};function pf(e,t,a,o,i,l,u){return e=e.stateNode,typeof e.shouldComponentUpdate=="function"?e.shouldComponentUpdate(o,l,u):t.prototype&&t.prototype.isPureReactComponent?!yi(a,o)||!yi(i,l):!0}function hf(e,t,a,o){e=t.state,typeof t.componentWillReceiveProps=="function"&&t.componentWillReceiveProps(a,o),typeof t.UNSAFE_componentWillReceiveProps=="function"&&t.UNSAFE_componentWillReceiveProps(a,o),t.state!==e&&Vs.enqueueReplaceState(t,t.state,null)}function to(e,t){var a=t;if("ref"in t){a={};for(var o in t)o!=="ref"&&(a[o]=t[o])}if(e=e.defaultProps){a===t&&(a=z({},a));for(var i in e)a[i]===void 0&&(a[i]=e[i])}return a}function mf(e){Or(e)}function gf(e){console.error(e)}function yf(e){Or(e)}function Yr(e,t){try{var a=e.onUncaughtError;a(t.value,{componentStack:t.stack})}catch(o){setTimeout(function(){throw o})}}function bf(e,t,a){try{var o=e.onCaughtError;o(a.value,{componentStack:a.stack,errorBoundary:t.tag===1?t.stateNode:null})}catch(i){setTimeout(function(){throw i})}}function Ks(e,t,a){return a=ma(a),a.tag=3,a.payload={element:null},a.callback=function(){Yr(e,t)},a}function Tf(e){return e=ma(e),e.tag=3,e}function Ef(e,t,a,o){var i=a.type.getDerivedStateFromError;if(typeof i=="function"){var l=o.value;e.payload=function(){return i(l)},e.callback=function(){bf(t,a,o)}}var u=a.stateNode;u!==null&&typeof u.componentDidCatch=="function"&&(e.callback=function(){bf(t,a,o),typeof i!="function"&&(Oa===null?Oa=new Set([this]):Oa.add(this));var m=o.stack;this.componentDidCatch(o.value,{componentStack:m!==null?m:""})})}function vg(e,t,a,o,i){if(a.flags|=32768,o!==null&&typeof o=="object"&&typeof o.then=="function"){if(t=a.alternate,t!==null&&xo(t,a,i,!0),a=Pt.current,a!==null){switch(a.tag){case 31:case 13:return rn===null?al():a.alternate===null&&Je===0&&(Je=3),a.flags&=-257,a.flags|=65536,a.lanes=i,o===kr?a.flags|=16384:(t=a.updateQueue,t===null?a.updateQueue=new Set([o]):t.add(o),Ec(e,o,i)),!1;case 22:return a.flags|=65536,o===kr?a.flags|=16384:(t=a.updateQueue,t===null?(t={transitions:null,markerInstances:null,retryQueue:new Set([o])},a.updateQueue=t):(a=t.retryQueue,a===null?t.retryQueue=new Set([o]):a.add(o)),Ec(e,o,i)),!1}throw Error(c(435,a.tag))}return Ec(e,o,i),al(),!1}if(we)return t=Pt.current,t!==null?((t.flags&65536)===0&&(t.flags|=256),t.flags|=65536,t.lanes=i,o!==hs&&(e=Error(c(422),{cause:o}),Ei(tn(e,a)))):(o!==hs&&(t=Error(c(423),{cause:o}),Ei(tn(t,a))),e=e.current.alternate,e.flags|=65536,i&=-i,e.lanes|=i,o=tn(o,a),i=Ks(e.stateNode,o,i),xs(e,i),Je!==4&&(Je=2)),!1;var l=Error(c(520),{cause:o});if(l=tn(l,a),Ui===null?Ui=[l]:Ui.push(l),Je!==4&&(Je=2),t===null)return!0;o=tn(o,a),a=t;do{switch(a.tag){case 3:return a.flags|=65536,e=i&-i,a.lanes|=e,e=Ks(a.stateNode,o,e),xs(a,e),!1;case 1:if(t=a.type,l=a.stateNode,(a.flags&128)===0&&(typeof t.getDerivedStateFromError=="function"||l!==null&&typeof l.componentDidCatch=="function"&&(Oa===null||!Oa.has(l))))return a.flags|=65536,i&=-i,a.lanes|=i,i=Tf(i),Ef(i,e,a,o),xs(a,i),!1}a=a.return}while(a!==null);return!1}var Xs=Error(c(461)),lt=!1;function Ot(e,t,a,o){t.child=e===null?Sd(t,null,a,o):Ja(t,e.child,a,o)}function vf(e,t,a,o,i){a=a.render;var l=t.ref;if("ref"in o){var u={};for(var m in o)m!=="ref"&&(u[m]=o[m])}else u=o;return Ka(t),o=Ls(e,t,a,u,l,i),m=ks(),e!==null&&!lt?(Cs(e,t,i),_n(e,t,i)):(we&&m&&fs(t),t.flags|=1,Ot(e,t,o,i),t.child)}function Of(e,t,a,o,i){if(e===null){var l=a.type;return typeof l=="function"&&!cs(l)&&l.defaultProps===void 0&&a.compare===null?(t.tag=15,t.type=l,Sf(e,t,l,o,i)):(e=Ar(a.type,null,o,t,t.mode,i),e.ref=t.ref,e.return=t,t.child=e)}if(l=e.child,!oc(e,i)){var u=l.memoizedProps;if(a=a.compare,a=a!==null?a:yi,a(u,o)&&e.ref===t.ref)return _n(e,t,i)}return t.flags|=1,e=Mn(l,o),e.ref=t.ref,e.return=t,t.child=e}function Sf(e,t,a,o,i){if(e!==null){var l=e.memoizedProps;if(yi(l,o)&&e.ref===t.ref)if(lt=!1,t.pendingProps=o=l,oc(e,i))(e.flags&131072)!==0&&(lt=!0);else return t.lanes=e.lanes,_n(e,t,i)}return Zs(e,t,a,o,i)}function wf(e,t,a,o){var i=o.children,l=e!==null?e.memoizedState:null;if(e===null&&t.stateNode===null&&(t.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),o.mode==="hidden"){if((t.flags&128)!==0){if(l=l!==null?l.baseLanes|a:a,e!==null){for(o=t.child=e.child,i=0;o!==null;)i=i|o.lanes|o.childLanes,o=o.sibling;o=i&~l}else o=0,t.child=null;return xf(e,t,l,a,o)}if((a&536870912)!==0)t.memoizedState={baseLanes:0,cachePool:null},e!==null&&Ir(t,l!==null?l.cachePool:null),l!==null?Ad(t,l):Fs(),Fd(t);else return o=t.lanes=536870912,xf(e,t,l!==null?l.baseLanes|a:a,a,o)}else l!==null?(Ir(t,l.cachePool),Ad(t,l),ba(),t.memoizedState=null):(e!==null&&Ir(t,null),Fs(),ba());return Ot(e,t,i,a),t.child}function ki(e,t){return e!==null&&e.tag===22||t.stateNode!==null||(t.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),t.sibling}function xf(e,t,a,o,i){var l=vs();return l=l===null?null:{parent:it._currentValue,pool:l},t.memoizedState={baseLanes:a,cachePool:l},e!==null&&Ir(t,null),Fs(),Fd(t),e!==null&&xo(e,t,o,!0),t.childLanes=i,null}function Wr(e,t){return t=Vr({mode:t.mode,children:t.children},e.mode),t.ref=e.ref,e.child=t,t.return=e,t}function Af(e,t,a){return Ja(t,e.child,null,a),e=Wr(t,t.pendingProps),e.flags|=2,Yt(t),t.memoizedState=null,e}function Og(e,t,a){var o=t.pendingProps,i=(t.flags&128)!==0;if(t.flags&=-129,e===null){if(we){if(o.mode==="hidden")return e=Wr(t,o),t.lanes=536870912,ki(null,e);if(Ns(t),(e=qe)?(e=zp(e,on),e=e!==null&&e.data==="&"?e:null,e!==null&&(t.memoizedState={dehydrated:e,treeContext:ua!==null?{id:An,overflow:Fn}:null,retryLane:536870912,hydrationErrors:null},a=sd(e),a.return=t,t.child=a,Et=t,qe=null)):e=null,e===null)throw fa(t);return t.lanes=536870912,null}return Wr(t,o)}var l=e.memoizedState;if(l!==null){var u=l.dehydrated;if(Ns(t),i)if(t.flags&256)t.flags&=-257,t=Af(e,t,a);else if(t.memoizedState!==null)t.child=e.child,t.flags|=128,t=null;else throw Error(c(558));else if(lt||xo(e,t,a,!1),i=(a&e.childLanes)!==0,lt||i){if(o=_e,o!==null&&(u=sr(o,a),u!==0&&u!==l.retryLane))throw l.retryLane=u,Ya(e,u),$t(o,e,u),Xs;al(),t=Af(e,t,a)}else e=l.treeContext,qe=ln(u.nextSibling),Et=t,we=!0,da=null,on=!1,e!==null&&dd(t,e),t=Wr(t,o),t.flags|=4096;return t}return e=Mn(e.child,{mode:o.mode,children:o.children}),e.ref=t.ref,t.child=e,e.return=t,e}function qr(e,t){var a=t.ref;if(a===null)e!==null&&e.ref!==null&&(t.flags|=4194816);else{if(typeof a!="function"&&typeof a!="object")throw Error(c(284));(e===null||e.ref!==a)&&(t.flags|=4194816)}}function Zs(e,t,a,o,i){return Ka(t),a=Ls(e,t,a,o,void 0,i),o=ks(),e!==null&&!lt?(Cs(e,t,i),_n(e,t,i)):(we&&o&&fs(t),t.flags|=1,Ot(e,t,a,i),t.child)}function Ff(e,t,a,o,i,l){return Ka(t),t.updateQueue=null,a=Nd(t,o,a,i),Rd(e),o=ks(),e!==null&&!lt?(Cs(e,t,l),_n(e,t,l)):(we&&o&&fs(t),t.flags|=1,Ot(e,t,a,l),t.child)}function Rf(e,t,a,o,i){if(Ka(t),t.stateNode===null){var l=vo,u=a.contextType;typeof u=="object"&&u!==null&&(l=vt(u)),l=new a(o,l),t.memoizedState=l.state!==null&&l.state!==void 0?l.state:null,l.updater=Vs,t.stateNode=l,l._reactInternals=t,l=t.stateNode,l.props=o,l.state=t.memoizedState,l.refs={},Ss(t),u=a.contextType,l.context=typeof u=="object"&&u!==null?vt(u):vo,l.state=t.memoizedState,u=a.getDerivedStateFromProps,typeof u=="function"&&(qs(t,a,u,o),l.state=t.memoizedState),typeof a.getDerivedStateFromProps=="function"||typeof l.getSnapshotBeforeUpdate=="function"||typeof l.UNSAFE_componentWillMount!="function"&&typeof l.componentWillMount!="function"||(u=l.state,typeof l.componentWillMount=="function"&&l.componentWillMount(),typeof l.UNSAFE_componentWillMount=="function"&&l.UNSAFE_componentWillMount(),u!==l.state&&Vs.enqueueReplaceState(l,l.state,null),Fi(t,o,l,i),Ai(),l.state=t.memoizedState),typeof l.componentDidMount=="function"&&(t.flags|=4194308),o=!0}else if(e===null){l=t.stateNode;var m=t.memoizedProps,E=to(a,m);l.props=E;var R=l.context,M=a.contextType;u=vo,typeof M=="object"&&M!==null&&(u=vt(M));var G=a.getDerivedStateFromProps;M=typeof G=="function"||typeof l.getSnapshotBeforeUpdate=="function",m=t.pendingProps!==m,M||typeof l.UNSAFE_componentWillReceiveProps!="function"&&typeof l.componentWillReceiveProps!="function"||(m||R!==u)&&hf(t,l,o,u),ha=!1;var N=t.memoizedState;l.state=N,Fi(t,o,l,i),Ai(),R=t.memoizedState,m||N!==R||ha?(typeof G=="function"&&(qs(t,a,G,o),R=t.memoizedState),(E=ha||pf(t,a,E,o,N,R,u))?(M||typeof l.UNSAFE_componentWillMount!="function"&&typeof l.componentWillMount!="function"||(typeof l.componentWillMount=="function"&&l.componentWillMount(),typeof l.UNSAFE_componentWillMount=="function"&&l.UNSAFE_componentWillMount()),typeof l.componentDidMount=="function"&&(t.flags|=4194308)):(typeof l.componentDidMount=="function"&&(t.flags|=4194308),t.memoizedProps=o,t.memoizedState=R),l.props=o,l.state=R,l.context=u,o=E):(typeof l.componentDidMount=="function"&&(t.flags|=4194308),o=!1)}else{l=t.stateNode,ws(e,t),u=t.memoizedProps,M=to(a,u),l.props=M,G=t.pendingProps,N=l.context,R=a.contextType,E=vo,typeof R=="object"&&R!==null&&(E=vt(R)),m=a.getDerivedStateFromProps,(R=typeof m=="function"||typeof l.getSnapshotBeforeUpdate=="function")||typeof l.UNSAFE_componentWillReceiveProps!="function"&&typeof l.componentWillReceiveProps!="function"||(u!==G||N!==E)&&hf(t,l,o,E),ha=!1,N=t.memoizedState,l.state=N,Fi(t,o,l,i),Ai();var H=t.memoizedState;u!==G||N!==H||ha||e!==null&&e.dependencies!==null&&Rr(e.dependencies)?(typeof m=="function"&&(qs(t,a,m,o),H=t.memoizedState),(M=ha||pf(t,a,M,o,N,H,E)||e!==null&&e.dependencies!==null&&Rr(e.dependencies))?(R||typeof l.UNSAFE_componentWillUpdate!="function"&&typeof l.componentWillUpdate!="function"||(typeof l.componentWillUpdate=="function"&&l.componentWillUpdate(o,H,E),typeof l.UNSAFE_componentWillUpdate=="function"&&l.UNSAFE_componentWillUpdate(o,H,E)),typeof l.componentDidUpdate=="function"&&(t.flags|=4),typeof l.getSnapshotBeforeUpdate=="function"&&(t.flags|=1024)):(typeof l.componentDidUpdate!="function"||u===e.memoizedProps&&N===e.memoizedState||(t.flags|=4),typeof l.getSnapshotBeforeUpdate!="function"||u===e.memoizedProps&&N===e.memoizedState||(t.flags|=1024),t.memoizedProps=o,t.memoizedState=H),l.props=o,l.state=H,l.context=E,o=M):(typeof l.componentDidUpdate!="function"||u===e.memoizedProps&&N===e.memoizedState||(t.flags|=4),typeof l.getSnapshotBeforeUpdate!="function"||u===e.memoizedProps&&N===e.memoizedState||(t.flags|=1024),o=!1)}return l=o,qr(e,t),o=(t.flags&128)!==0,l||o?(l=t.stateNode,a=o&&typeof a.getDerivedStateFromError!="function"?null:l.render(),t.flags|=1,e!==null&&o?(t.child=Ja(t,e.child,null,i),t.child=Ja(t,null,a,i)):Ot(e,t,a,i),t.memoizedState=l.state,e=t.child):e=_n(e,t,i),e}function Nf(e,t,a,o){return qa(),t.flags|=256,Ot(e,t,a,o),t.child}var Qs={dehydrated:null,treeContext:null,retryLane:0,hydrationErrors:null};function Js(e){return{baseLanes:e,cachePool:yd()}}function ec(e,t,a){return e=e!==null?e.childLanes&~a:0,t&&(e|=qt),e}function If(e,t,a){var o=t.pendingProps,i=!1,l=(t.flags&128)!==0,u;if((u=l)||(u=e!==null&&e.memoizedState===null?!1:(at.current&2)!==0),u&&(i=!0,t.flags&=-129),u=(t.flags&32)!==0,t.flags&=-33,e===null){if(we){if(i?ya(t):ba(),(e=qe)?(e=zp(e,on),e=e!==null&&e.data!=="&"?e:null,e!==null&&(t.memoizedState={dehydrated:e,treeContext:ua!==null?{id:An,overflow:Fn}:null,retryLane:536870912,hydrationErrors:null},a=sd(e),a.return=t,t.child=a,Et=t,qe=null)):e=null,e===null)throw fa(t);return jc(e)?t.lanes=32:t.lanes=536870912,null}var m=o.children;return o=o.fallback,i?(ba(),i=t.mode,m=Vr({mode:"hidden",children:m},i),o=Wa(o,i,a,null),m.return=t,o.return=t,m.sibling=o,t.child=m,o=t.child,o.memoizedState=Js(a),o.childLanes=ec(e,u,a),t.memoizedState=Qs,ki(null,o)):(ya(t),tc(t,m))}var E=e.memoizedState;if(E!==null&&(m=E.dehydrated,m!==null)){if(l)t.flags&256?(ya(t),t.flags&=-257,t=nc(e,t,a)):t.memoizedState!==null?(ba(),t.child=e.child,t.flags|=128,t=null):(ba(),m=o.fallback,i=t.mode,o=Vr({mode:"visible",children:o.children},i),m=Wa(m,i,a,null),m.flags|=2,o.return=t,m.return=t,o.sibling=m,t.child=o,Ja(t,e.child,null,a),o=t.child,o.memoizedState=Js(a),o.childLanes=ec(e,u,a),t.memoizedState=Qs,t=ki(null,o));else if(ya(t),jc(m)){if(u=m.nextSibling&&m.nextSibling.dataset,u)var R=u.dgst;u=R,o=Error(c(419)),o.stack="",o.digest=u,Ei({value:o,source:null,stack:null}),t=nc(e,t,a)}else if(lt||xo(e,t,a,!1),u=(a&e.childLanes)!==0,lt||u){if(u=_e,u!==null&&(o=sr(u,a),o!==0&&o!==E.retryLane))throw E.retryLane=o,Ya(e,o),$t(u,e,o),Xs;Hc(m)||al(),t=nc(e,t,a)}else Hc(m)?(t.flags|=192,t.child=e.child,t=null):(e=E.treeContext,qe=ln(m.nextSibling),Et=t,we=!0,da=null,on=!1,e!==null&&dd(t,e),t=tc(t,o.children),t.flags|=4096);return t}return i?(ba(),m=o.fallback,i=t.mode,E=e.child,R=E.sibling,o=Mn(E,{mode:"hidden",children:o.children}),o.subtreeFlags=E.subtreeFlags&65011712,R!==null?m=Mn(R,m):(m=Wa(m,i,a,null),m.flags|=2),m.return=t,o.return=t,o.sibling=m,t.child=o,ki(null,o),o=t.child,m=e.child.memoizedState,m===null?m=Js(a):(i=m.cachePool,i!==null?(E=it._currentValue,i=i.parent!==E?{parent:E,pool:E}:i):i=yd(),m={baseLanes:m.baseLanes|a,cachePool:i}),o.memoizedState=m,o.childLanes=ec(e,u,a),t.memoizedState=Qs,ki(e.child,o)):(ya(t),a=e.child,e=a.sibling,a=Mn(a,{mode:"visible",children:o.children}),a.return=t,a.sibling=null,e!==null&&(u=t.deletions,u===null?(t.deletions=[e],t.flags|=16):u.push(e)),t.child=a,t.memoizedState=null,a)}function tc(e,t){return t=Vr({mode:"visible",children:t},e.mode),t.return=e,e.child=t}function Vr(e,t){return e=_t(22,e,null,t),e.lanes=0,e}function nc(e,t,a){return Ja(t,e.child,null,a),e=tc(t,t.pendingProps.children),e.flags|=2,t.memoizedState=null,e}function Lf(e,t,a){e.lanes|=t;var o=e.alternate;o!==null&&(o.lanes|=t),ys(e.return,t,a)}function ac(e,t,a,o,i,l){var u=e.memoizedState;u===null?e.memoizedState={isBackwards:t,rendering:null,renderingStartTime:0,last:o,tail:a,tailMode:i,treeForkCount:l}:(u.isBackwards=t,u.rendering=null,u.renderingStartTime=0,u.last=o,u.tail=a,u.tailMode=i,u.treeForkCount=l)}function kf(e,t,a){var o=t.pendingProps,i=o.revealOrder,l=o.tail;o=o.children;var u=at.current,m=(u&2)!==0;if(m?(u=u&1|2,t.flags|=128):u&=1,_(at,u),Ot(e,t,o,a),o=we?Ti:0,!m&&e!==null&&(e.flags&128)!==0)e:for(e=t.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&Lf(e,a,t);else if(e.tag===19)Lf(e,a,t);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break e;for(;e.sibling===null;){if(e.return===null||e.return===t)break e;e=e.return}e.sibling.return=e.return,e=e.sibling}switch(i){case"forwards":for(a=t.child,i=null;a!==null;)e=a.alternate,e!==null&&jr(e)===null&&(i=a),a=a.sibling;a=i,a===null?(i=t.child,t.child=null):(i=a.sibling,a.sibling=null),ac(t,!1,i,a,l,o);break;case"backwards":case"unstable_legacy-backwards":for(a=null,i=t.child,t.child=null;i!==null;){if(e=i.alternate,e!==null&&jr(e)===null){t.child=i;break}e=i.sibling,i.sibling=a,a=i,i=e}ac(t,!0,a,null,l,o);break;case"together":ac(t,!1,null,null,void 0,o);break;default:t.memoizedState=null}return t.child}function _n(e,t,a){if(e!==null&&(t.dependencies=e.dependencies),va|=t.lanes,(a&t.childLanes)===0)if(e!==null){if(xo(e,t,a,!1),(a&t.childLanes)===0)return null}else return null;if(e!==null&&t.child!==e.child)throw Error(c(153));if(t.child!==null){for(e=t.child,a=Mn(e,e.pendingProps),t.child=a,a.return=t;e.sibling!==null;)e=e.sibling,a=a.sibling=Mn(e,e.pendingProps),a.return=t;a.sibling=null}return t.child}function oc(e,t){return(e.lanes&t)!==0?!0:(e=e.dependencies,!!(e!==null&&Rr(e)))}function Sg(e,t,a){switch(t.tag){case 3:Ye(t,t.stateNode.containerInfo),pa(t,it,e.memoizedState.cache),qa();break;case 27:case 5:Ft(t);break;case 4:Ye(t,t.stateNode.containerInfo);break;case 10:pa(t,t.type,t.memoizedProps.value);break;case 31:if(t.memoizedState!==null)return t.flags|=128,Ns(t),null;break;case 13:var o=t.memoizedState;if(o!==null)return o.dehydrated!==null?(ya(t),t.flags|=128,null):(a&t.child.childLanes)!==0?If(e,t,a):(ya(t),e=_n(e,t,a),e!==null?e.sibling:null);ya(t);break;case 19:var i=(e.flags&128)!==0;if(o=(a&t.childLanes)!==0,o||(xo(e,t,a,!1),o=(a&t.childLanes)!==0),i){if(o)return kf(e,t,a);t.flags|=128}if(i=t.memoizedState,i!==null&&(i.rendering=null,i.tail=null,i.lastEffect=null),_(at,at.current),o)break;return null;case 22:return t.lanes=0,wf(e,t,a,t.pendingProps);case 24:pa(t,it,e.memoizedState.cache)}return _n(e,t,a)}function Cf(e,t,a){if(e!==null)if(e.memoizedProps!==t.pendingProps)lt=!0;else{if(!oc(e,a)&&(t.flags&128)===0)return lt=!1,Sg(e,t,a);lt=(e.flags&131072)!==0}else lt=!1,we&&(t.flags&1048576)!==0&&ud(t,Ti,t.index);switch(t.lanes=0,t.tag){case 16:e:{var o=t.pendingProps;if(e=Za(t.elementType),t.type=e,typeof e=="function")cs(e)?(o=to(e,o),t.tag=1,t=Rf(null,t,e,o,a)):(t.tag=0,t=Zs(null,t,e,o,a));else{if(e!=null){var i=e.$$typeof;if(i===ne){t.tag=11,t=vf(null,t,e,o,a);break e}else if(i===ae){t.tag=14,t=Of(null,t,e,o,a);break e}}throw t=pt(e)||e,Error(c(306,t,""))}}return t;case 0:return Zs(e,t,t.type,t.pendingProps,a);case 1:return o=t.type,i=to(o,t.pendingProps),Rf(e,t,o,i,a);case 3:e:{if(Ye(t,t.stateNode.containerInfo),e===null)throw Error(c(387));o=t.pendingProps;var l=t.memoizedState;i=l.element,ws(e,t),Fi(t,o,null,a);var u=t.memoizedState;if(o=u.cache,pa(t,it,o),o!==l.cache&&bs(t,[it],a,!0),Ai(),o=u.element,l.isDehydrated)if(l={element:o,isDehydrated:!1,cache:u.cache},t.updateQueue.baseState=l,t.memoizedState=l,t.flags&256){t=Nf(e,t,o,a);break e}else if(o!==i){i=tn(Error(c(424)),t),Ei(i),t=Nf(e,t,o,a);break e}else for(e=t.stateNode.containerInfo,e.nodeType===9?e=e.body:e=e.nodeName==="HTML"?e.ownerDocument.body:e,qe=ln(e.firstChild),Et=t,we=!0,da=null,on=!0,a=Sd(t,null,o,a),t.child=a;a;)a.flags=a.flags&-3|4096,a=a.sibling;else{if(qa(),o===i){t=_n(e,t,a);break e}Ot(e,t,o,a)}t=t.child}return t;case 26:return qr(e,t),e===null?(a=Pp(t.type,null,t.pendingProps,null))?t.memoizedState=a:we||(a=t.type,e=t.pendingProps,o=ul(X.current).createElement(a),o[ut]=t,o[dt]=e,St(o,a,e),nt(o),t.stateNode=o):t.memoizedState=Pp(t.type,e.memoizedProps,t.pendingProps,e.memoizedState),null;case 27:return Ft(t),e===null&&we&&(o=t.stateNode=Gp(t.type,t.pendingProps,X.current),Et=t,on=!0,i=qe,Aa(t.type)?(Mc=i,qe=ln(o.firstChild)):qe=i),Ot(e,t,t.pendingProps.children,a),qr(e,t),e===null&&(t.flags|=4194304),t.child;case 5:return e===null&&we&&((i=o=qe)&&(o=Jg(o,t.type,t.pendingProps,on),o!==null?(t.stateNode=o,Et=t,qe=ln(o.firstChild),on=!1,i=!0):i=!1),i||fa(t)),Ft(t),i=t.type,l=t.pendingProps,u=e!==null?e.memoizedProps:null,o=l.children,kc(i,l)?o=null:u!==null&&kc(i,u)&&(t.flags|=32),t.memoizedState!==null&&(i=Ls(e,t,hg,null,null,a),qi._currentValue=i),qr(e,t),Ot(e,t,o,a),t.child;case 6:return e===null&&we&&((e=a=qe)&&(a=ey(a,t.pendingProps,on),a!==null?(t.stateNode=a,Et=t,qe=null,e=!0):e=!1),e||fa(t)),null;case 13:return If(e,t,a);case 4:return Ye(t,t.stateNode.containerInfo),o=t.pendingProps,e===null?t.child=Ja(t,null,o,a):Ot(e,t,o,a),t.child;case 11:return vf(e,t,t.type,t.pendingProps,a);case 7:return Ot(e,t,t.pendingProps,a),t.child;case 8:return Ot(e,t,t.pendingProps.children,a),t.child;case 12:return Ot(e,t,t.pendingProps.children,a),t.child;case 10:return o=t.pendingProps,pa(t,t.type,o.value),Ot(e,t,o.children,a),t.child;case 9:return i=t.type._context,o=t.pendingProps.children,Ka(t),i=vt(i),o=o(i),t.flags|=1,Ot(e,t,o,a),t.child;case 14:return Of(e,t,t.type,t.pendingProps,a);case 15:return Sf(e,t,t.type,t.pendingProps,a);case 19:return kf(e,t,a);case 31:return Og(e,t,a);case 22:return wf(e,t,a,t.pendingProps);case 24:return Ka(t),o=vt(it),e===null?(i=vs(),i===null&&(i=_e,l=Ts(),i.pooledCache=l,l.refCount++,l!==null&&(i.pooledCacheLanes|=a),i=l),t.memoizedState={parent:o,cache:i},Ss(t),pa(t,it,i)):((e.lanes&a)!==0&&(ws(e,t),Fi(t,null,null,a),Ai()),i=e.memoizedState,l=t.memoizedState,i.parent!==o?(i={parent:o,cache:o},t.memoizedState=i,t.lanes===0&&(t.memoizedState=t.updateQueue.baseState=i),pa(t,it,o)):(o=l.cache,pa(t,it,o),o!==i.cache&&bs(t,[it],a,!0))),Ot(e,t,t.pendingProps.children,a),t.child;case 29:throw t.pendingProps}throw Error(c(156,t.tag))}function Pn(e){e.flags|=4}function ic(e,t,a,o,i){if((t=(e.mode&32)!==0)&&(t=!1),t){if(e.flags|=16777216,(i&335544128)===i)if(e.stateNode.complete)e.flags|=8192;else if(rp())e.flags|=8192;else throw Qa=kr,Os}else e.flags&=-16777217}function Df(e,t){if(t.type!=="stylesheet"||(t.state.loading&4)!==0)e.flags&=-16777217;else if(e.flags|=16777216,!Kp(t))if(rp())e.flags|=8192;else throw Qa=kr,Os}function Kr(e,t){t!==null&&(e.flags|=4),e.flags&16384&&(t=e.tag!==22?ei():536870912,e.lanes|=t,Mo|=t)}function Ci(e,t){if(!we)switch(e.tailMode){case"hidden":t=e.tail;for(var a=null;t!==null;)t.alternate!==null&&(a=t),t=t.sibling;a===null?e.tail=null:a.sibling=null;break;case"collapsed":a=e.tail;for(var o=null;a!==null;)a.alternate!==null&&(o=a),a=a.sibling;o===null?t||e.tail===null?e.tail=null:e.tail.sibling=null:o.sibling=null}}function Ve(e){var t=e.alternate!==null&&e.alternate.child===e.child,a=0,o=0;if(t)for(var i=e.child;i!==null;)a|=i.lanes|i.childLanes,o|=i.subtreeFlags&65011712,o|=i.flags&65011712,i.return=e,i=i.sibling;else for(i=e.child;i!==null;)a|=i.lanes|i.childLanes,o|=i.subtreeFlags,o|=i.flags,i.return=e,i=i.sibling;return e.subtreeFlags|=o,e.childLanes=a,t}function wg(e,t,a){var o=t.pendingProps;switch(ps(t),t.tag){case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return Ve(t),null;case 1:return Ve(t),null;case 3:return a=t.stateNode,o=null,e!==null&&(o=e.memoizedState.cache),t.memoizedState.cache!==o&&(t.flags|=2048),$n(it),Ce(),a.pendingContext&&(a.context=a.pendingContext,a.pendingContext=null),(e===null||e.child===null)&&(wo(t)?Pn(t):e===null||e.memoizedState.isDehydrated&&(t.flags&256)===0||(t.flags|=1024,ms())),Ve(t),null;case 26:var i=t.type,l=t.memoizedState;return e===null?(Pn(t),l!==null?(Ve(t),Df(t,l)):(Ve(t),ic(t,i,null,o,a))):l?l!==e.memoizedState?(Pn(t),Ve(t),Df(t,l)):(Ve(t),t.flags&=-16777217):(e=e.memoizedProps,e!==o&&Pn(t),Ve(t),ic(t,i,e,o,a)),null;case 27:if(un(t),a=X.current,i=t.type,e!==null&&t.stateNode!=null)e.memoizedProps!==o&&Pn(t);else{if(!o){if(t.stateNode===null)throw Error(c(166));return Ve(t),null}e=W.current,wo(t)?fd(t):(e=Gp(i,o,a),t.stateNode=e,Pn(t))}return Ve(t),null;case 5:if(un(t),i=t.type,e!==null&&t.stateNode!=null)e.memoizedProps!==o&&Pn(t);else{if(!o){if(t.stateNode===null)throw Error(c(166));return Ve(t),null}if(l=W.current,wo(t))fd(t);else{var u=ul(X.current);switch(l){case 1:l=u.createElementNS("http://www.w3.org/2000/svg",i);break;case 2:l=u.createElementNS("http://www.w3.org/1998/Math/MathML",i);break;default:switch(i){case"svg":l=u.createElementNS("http://www.w3.org/2000/svg",i);break;case"math":l=u.createElementNS("http://www.w3.org/1998/Math/MathML",i);break;case"script":l=u.createElement("div"),l.innerHTML="<script><\/script>",l=l.removeChild(l.firstChild);break;case"select":l=typeof o.is=="string"?u.createElement("select",{is:o.is}):u.createElement("select"),o.multiple?l.multiple=!0:o.size&&(l.size=o.size);break;default:l=typeof o.is=="string"?u.createElement(i,{is:o.is}):u.createElement(i)}}l[ut]=t,l[dt]=o;e:for(u=t.child;u!==null;){if(u.tag===5||u.tag===6)l.appendChild(u.stateNode);else if(u.tag!==4&&u.tag!==27&&u.child!==null){u.child.return=u,u=u.child;continue}if(u===t)break e;for(;u.sibling===null;){if(u.return===null||u.return===t)break e;u=u.return}u.sibling.return=u.return,u=u.sibling}t.stateNode=l;e:switch(St(l,i,o),i){case"button":case"input":case"select":case"textarea":o=!!o.autoFocus;break e;case"img":o=!0;break e;default:o=!1}o&&Pn(t)}}return Ve(t),ic(t,t.type,e===null?null:e.memoizedProps,t.pendingProps,a),null;case 6:if(e&&t.stateNode!=null)e.memoizedProps!==o&&Pn(t);else{if(typeof o!="string"&&t.stateNode===null)throw Error(c(166));if(e=X.current,wo(t)){if(e=t.stateNode,a=t.memoizedProps,o=null,i=Et,i!==null)switch(i.tag){case 27:case 5:o=i.memoizedProps}e[ut]=t,e=!!(e.nodeValue===a||o!==null&&o.suppressHydrationWarning===!0||Ip(e.nodeValue,a)),e||fa(t,!0)}else e=ul(e).createTextNode(o),e[ut]=t,t.stateNode=e}return Ve(t),null;case 31:if(a=t.memoizedState,e===null||e.memoizedState!==null){if(o=wo(t),a!==null){if(e===null){if(!o)throw Error(c(318));if(e=t.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(c(557));e[ut]=t}else qa(),(t.flags&128)===0&&(t.memoizedState=null),t.flags|=4;Ve(t),e=!1}else a=ms(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=a),e=!0;if(!e)return t.flags&256?(Yt(t),t):(Yt(t),null);if((t.flags&128)!==0)throw Error(c(558))}return Ve(t),null;case 13:if(o=t.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(i=wo(t),o!==null&&o.dehydrated!==null){if(e===null){if(!i)throw Error(c(318));if(i=t.memoizedState,i=i!==null?i.dehydrated:null,!i)throw Error(c(317));i[ut]=t}else qa(),(t.flags&128)===0&&(t.memoizedState=null),t.flags|=4;Ve(t),i=!1}else i=ms(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=i),i=!0;if(!i)return t.flags&256?(Yt(t),t):(Yt(t),null)}return Yt(t),(t.flags&128)!==0?(t.lanes=a,t):(a=o!==null,e=e!==null&&e.memoizedState!==null,a&&(o=t.child,i=null,o.alternate!==null&&o.alternate.memoizedState!==null&&o.alternate.memoizedState.cachePool!==null&&(i=o.alternate.memoizedState.cachePool.pool),l=null,o.memoizedState!==null&&o.memoizedState.cachePool!==null&&(l=o.memoizedState.cachePool.pool),l!==i&&(o.flags|=2048)),a!==e&&a&&(t.child.flags|=8192),Kr(t,t.updateQueue),Ve(t),null);case 4:return Ce(),e===null&&Fc(t.stateNode.containerInfo),Ve(t),null;case 10:return $n(t.type),Ve(t),null;case 19:if(x(at),o=t.memoizedState,o===null)return Ve(t),null;if(i=(t.flags&128)!==0,l=o.rendering,l===null)if(i)Ci(o,!1);else{if(Je!==0||e!==null&&(e.flags&128)!==0)for(e=t.child;e!==null;){if(l=jr(e),l!==null){for(t.flags|=128,Ci(o,!1),e=l.updateQueue,t.updateQueue=e,Kr(t,e),t.subtreeFlags=0,e=a,a=t.child;a!==null;)ld(a,e),a=a.sibling;return _(at,at.current&1|2),we&&zn(t,o.treeForkCount),t.child}e=e.sibling}o.tail!==null&&Ie()>el&&(t.flags|=128,i=!0,Ci(o,!1),t.lanes=4194304)}else{if(!i)if(e=jr(l),e!==null){if(t.flags|=128,i=!0,e=e.updateQueue,t.updateQueue=e,Kr(t,e),Ci(o,!0),o.tail===null&&o.tailMode==="hidden"&&!l.alternate&&!we)return Ve(t),null}else 2*Ie()-o.renderingStartTime>el&&a!==536870912&&(t.flags|=128,i=!0,Ci(o,!1),t.lanes=4194304);o.isBackwards?(l.sibling=t.child,t.child=l):(e=o.last,e!==null?e.sibling=l:t.child=l,o.last=l)}return o.tail!==null?(e=o.tail,o.rendering=e,o.tail=e.sibling,o.renderingStartTime=Ie(),e.sibling=null,a=at.current,_(at,i?a&1|2:a&1),we&&zn(t,o.treeForkCount),e):(Ve(t),null);case 22:case 23:return Yt(t),Rs(),o=t.memoizedState!==null,e!==null?e.memoizedState!==null!==o&&(t.flags|=8192):o&&(t.flags|=8192),o?(a&536870912)!==0&&(t.flags&128)===0&&(Ve(t),t.subtreeFlags&6&&(t.flags|=8192)):Ve(t),a=t.updateQueue,a!==null&&Kr(t,a.retryQueue),a=null,e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(a=e.memoizedState.cachePool.pool),o=null,t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(o=t.memoizedState.cachePool.pool),o!==a&&(t.flags|=2048),e!==null&&x(Xa),null;case 24:return a=null,e!==null&&(a=e.memoizedState.cache),t.memoizedState.cache!==a&&(t.flags|=2048),$n(it),Ve(t),null;case 25:return null;case 30:return null}throw Error(c(156,t.tag))}function xg(e,t){switch(ps(t),t.tag){case 1:return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 3:return $n(it),Ce(),e=t.flags,(e&65536)!==0&&(e&128)===0?(t.flags=e&-65537|128,t):null;case 26:case 27:case 5:return un(t),null;case 31:if(t.memoizedState!==null){if(Yt(t),t.alternate===null)throw Error(c(340));qa()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 13:if(Yt(t),e=t.memoizedState,e!==null&&e.dehydrated!==null){if(t.alternate===null)throw Error(c(340));qa()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 19:return x(at),null;case 4:return Ce(),null;case 10:return $n(t.type),null;case 22:case 23:return Yt(t),Rs(),e!==null&&x(Xa),e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 24:return $n(it),null;case 25:return null;default:return null}}function Hf(e,t){switch(ps(t),t.tag){case 3:$n(it),Ce();break;case 26:case 27:case 5:un(t);break;case 4:Ce();break;case 31:t.memoizedState!==null&&Yt(t);break;case 13:Yt(t);break;case 19:x(at);break;case 10:$n(t.type);break;case 22:case 23:Yt(t),Rs(),e!==null&&x(Xa);break;case 24:$n(it)}}function Di(e,t){try{var a=t.updateQueue,o=a!==null?a.lastEffect:null;if(o!==null){var i=o.next;a=i;do{if((a.tag&e)===e){o=void 0;var l=a.create,u=a.inst;o=l(),u.destroy=o}a=a.next}while(a!==i)}}catch(m){ze(t,t.return,m)}}function Ta(e,t,a){try{var o=t.updateQueue,i=o!==null?o.lastEffect:null;if(i!==null){var l=i.next;o=l;do{if((o.tag&e)===e){var u=o.inst,m=u.destroy;if(m!==void 0){u.destroy=void 0,i=t;var E=a,R=m;try{R()}catch(M){ze(i,E,M)}}}o=o.next}while(o!==l)}}catch(M){ze(t,t.return,M)}}function jf(e){var t=e.updateQueue;if(t!==null){var a=e.stateNode;try{xd(t,a)}catch(o){ze(e,e.return,o)}}}function Mf(e,t,a){a.props=to(e.type,e.memoizedProps),a.state=e.memoizedState;try{a.componentWillUnmount()}catch(o){ze(e,t,o)}}function Hi(e,t){try{var a=e.ref;if(a!==null){switch(e.tag){case 26:case 27:case 5:var o=e.stateNode;break;case 30:o=e.stateNode;break;default:o=e.stateNode}typeof a=="function"?e.refCleanup=a(o):a.current=o}}catch(i){ze(e,t,i)}}function Rn(e,t){var a=e.ref,o=e.refCleanup;if(a!==null)if(typeof o=="function")try{o()}catch(i){ze(e,t,i)}finally{e.refCleanup=null,e=e.alternate,e!=null&&(e.refCleanup=null)}else if(typeof a=="function")try{a(null)}catch(i){ze(e,t,i)}else a.current=null}function zf(e){var t=e.type,a=e.memoizedProps,o=e.stateNode;try{e:switch(t){case"button":case"input":case"select":case"textarea":a.autoFocus&&o.focus();break e;case"img":a.src?o.src=a.src:a.srcSet&&(o.srcset=a.srcSet)}}catch(i){ze(e,e.return,i)}}function rc(e,t,a){try{var o=e.stateNode;qg(o,e.type,a,t),o[dt]=t}catch(i){ze(e,e.return,i)}}function Uf(e){return e.tag===5||e.tag===3||e.tag===26||e.tag===27&&Aa(e.type)||e.tag===4}function lc(e){e:for(;;){for(;e.sibling===null;){if(e.return===null||Uf(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.tag===27&&Aa(e.type)||e.flags&2||e.child===null||e.tag===4)continue e;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function sc(e,t,a){var o=e.tag;if(o===5||o===6)e=e.stateNode,t?(a.nodeType===9?a.body:a.nodeName==="HTML"?a.ownerDocument.body:a).insertBefore(e,t):(t=a.nodeType===9?a.body:a.nodeName==="HTML"?a.ownerDocument.body:a,t.appendChild(e),a=a._reactRootContainer,a!=null||t.onclick!==null||(t.onclick=Hn));else if(o!==4&&(o===27&&Aa(e.type)&&(a=e.stateNode,t=null),e=e.child,e!==null))for(sc(e,t,a),e=e.sibling;e!==null;)sc(e,t,a),e=e.sibling}function Xr(e,t,a){var o=e.tag;if(o===5||o===6)e=e.stateNode,t?a.insertBefore(e,t):a.appendChild(e);else if(o!==4&&(o===27&&Aa(e.type)&&(a=e.stateNode),e=e.child,e!==null))for(Xr(e,t,a),e=e.sibling;e!==null;)Xr(e,t,a),e=e.sibling}function $f(e){var t=e.stateNode,a=e.memoizedProps;try{for(var o=e.type,i=t.attributes;i.length;)t.removeAttributeNode(i[0]);St(t,o,a),t[ut]=e,t[dt]=a}catch(l){ze(e,e.return,l)}}var Yn=!1,st=!1,cc=!1,Gf=typeof WeakSet=="function"?WeakSet:Set,mt=null;function Ag(e,t){if(e=e.containerInfo,Ic=yl,e=Qu(e),ns(e)){if("selectionStart"in e)var a={start:e.selectionStart,end:e.selectionEnd};else e:{a=(a=e.ownerDocument)&&a.defaultView||window;var o=a.getSelection&&a.getSelection();if(o&&o.rangeCount!==0){a=o.anchorNode;var i=o.anchorOffset,l=o.focusNode;o=o.focusOffset;try{a.nodeType,l.nodeType}catch{a=null;break e}var u=0,m=-1,E=-1,R=0,M=0,G=e,N=null;t:for(;;){for(var H;G!==a||i!==0&&G.nodeType!==3||(m=u+i),G!==l||o!==0&&G.nodeType!==3||(E=u+o),G.nodeType===3&&(u+=G.nodeValue.length),(H=G.firstChild)!==null;)N=G,G=H;for(;;){if(G===e)break t;if(N===a&&++R===i&&(m=u),N===l&&++M===o&&(E=u),(H=G.nextSibling)!==null)break;G=N,N=G.parentNode}G=H}a=m===-1||E===-1?null:{start:m,end:E}}else a=null}a=a||{start:0,end:0}}else a=null;for(Lc={focusedElem:e,selectionRange:a},yl=!1,mt=t;mt!==null;)if(t=mt,e=t.child,(t.subtreeFlags&1028)!==0&&e!==null)e.return=t,mt=e;else for(;mt!==null;){switch(t=mt,l=t.alternate,e=t.flags,t.tag){case 0:if((e&4)!==0&&(e=t.updateQueue,e=e!==null?e.events:null,e!==null))for(a=0;a<e.length;a++)i=e[a],i.ref.impl=i.nextImpl;break;case 11:case 15:break;case 1:if((e&1024)!==0&&l!==null){e=void 0,a=t,i=l.memoizedProps,l=l.memoizedState,o=a.stateNode;try{var Z=to(a.type,i);e=o.getSnapshotBeforeUpdate(Z,l),o.__reactInternalSnapshotBeforeUpdate=e}catch(re){ze(a,a.return,re)}}break;case 3:if((e&1024)!==0){if(e=t.stateNode.containerInfo,a=e.nodeType,a===9)Dc(e);else if(a===1)switch(e.nodeName){case"HEAD":case"HTML":case"BODY":Dc(e);break;default:e.textContent=""}}break;case 5:case 26:case 27:case 6:case 4:case 17:break;default:if((e&1024)!==0)throw Error(c(163))}if(e=t.sibling,e!==null){e.return=t.return,mt=e;break}mt=t.return}}function Bf(e,t,a){var o=a.flags;switch(a.tag){case 0:case 11:case 15:qn(e,a),o&4&&Di(5,a);break;case 1:if(qn(e,a),o&4)if(e=a.stateNode,t===null)try{e.componentDidMount()}catch(u){ze(a,a.return,u)}else{var i=to(a.type,t.memoizedProps);t=t.memoizedState;try{e.componentDidUpdate(i,t,e.__reactInternalSnapshotBeforeUpdate)}catch(u){ze(a,a.return,u)}}o&64&&jf(a),o&512&&Hi(a,a.return);break;case 3:if(qn(e,a),o&64&&(e=a.updateQueue,e!==null)){if(t=null,a.child!==null)switch(a.child.tag){case 27:case 5:t=a.child.stateNode;break;case 1:t=a.child.stateNode}try{xd(e,t)}catch(u){ze(a,a.return,u)}}break;case 27:t===null&&o&4&&$f(a);case 26:case 5:qn(e,a),t===null&&o&4&&zf(a),o&512&&Hi(a,a.return);break;case 12:qn(e,a);break;case 31:qn(e,a),o&4&&Yf(e,a);break;case 13:qn(e,a),o&4&&Wf(e,a),o&64&&(e=a.memoizedState,e!==null&&(e=e.dehydrated,e!==null&&(a=Hg.bind(null,a),ty(e,a))));break;case 22:if(o=a.memoizedState!==null||Yn,!o){t=t!==null&&t.memoizedState!==null||st,i=Yn;var l=st;Yn=o,(st=t)&&!l?Vn(e,a,(a.subtreeFlags&8772)!==0):qn(e,a),Yn=i,st=l}break;case 30:break;default:qn(e,a)}}function _f(e){var t=e.alternate;t!==null&&(e.alternate=null,_f(t)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(t=e.stateNode,t!==null&&$a(t)),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}var Ke=null,jt=!1;function Wn(e,t,a){for(a=a.child;a!==null;)Pf(e,t,a),a=a.sibling}function Pf(e,t,a){if(Nt&&typeof Nt.onCommitFiberUnmount=="function")try{Nt.onCommitFiberUnmount(ct,a)}catch{}switch(a.tag){case 26:st||Rn(a,t),Wn(e,t,a),a.memoizedState?a.memoizedState.count--:a.stateNode&&(a=a.stateNode,a.parentNode.removeChild(a));break;case 27:st||Rn(a,t);var o=Ke,i=jt;Aa(a.type)&&(Ke=a.stateNode,jt=!1),Wn(e,t,a),Pi(a.stateNode),Ke=o,jt=i;break;case 5:st||Rn(a,t);case 6:if(o=Ke,i=jt,Ke=null,Wn(e,t,a),Ke=o,jt=i,Ke!==null)if(jt)try{(Ke.nodeType===9?Ke.body:Ke.nodeName==="HTML"?Ke.ownerDocument.body:Ke).removeChild(a.stateNode)}catch(l){ze(a,t,l)}else try{Ke.removeChild(a.stateNode)}catch(l){ze(a,t,l)}break;case 18:Ke!==null&&(jt?(e=Ke,jp(e.nodeType===9?e.body:e.nodeName==="HTML"?e.ownerDocument.body:e,a.stateNode),Yo(e)):jp(Ke,a.stateNode));break;case 4:o=Ke,i=jt,Ke=a.stateNode.containerInfo,jt=!0,Wn(e,t,a),Ke=o,jt=i;break;case 0:case 11:case 14:case 15:Ta(2,a,t),st||Ta(4,a,t),Wn(e,t,a);break;case 1:st||(Rn(a,t),o=a.stateNode,typeof o.componentWillUnmount=="function"&&Mf(a,t,o)),Wn(e,t,a);break;case 21:Wn(e,t,a);break;case 22:st=(o=st)||a.memoizedState!==null,Wn(e,t,a),st=o;break;default:Wn(e,t,a)}}function Yf(e,t){if(t.memoizedState===null&&(e=t.alternate,e!==null&&(e=e.memoizedState,e!==null))){e=e.dehydrated;try{Yo(e)}catch(a){ze(t,t.return,a)}}}function Wf(e,t){if(t.memoizedState===null&&(e=t.alternate,e!==null&&(e=e.memoizedState,e!==null&&(e=e.dehydrated,e!==null))))try{Yo(e)}catch(a){ze(t,t.return,a)}}function Fg(e){switch(e.tag){case 31:case 13:case 19:var t=e.stateNode;return t===null&&(t=e.stateNode=new Gf),t;case 22:return e=e.stateNode,t=e._retryCache,t===null&&(t=e._retryCache=new Gf),t;default:throw Error(c(435,e.tag))}}function Zr(e,t){var a=Fg(e);t.forEach(function(o){if(!a.has(o)){a.add(o);var i=jg.bind(null,e,o);o.then(i,i)}})}function Mt(e,t){var a=t.deletions;if(a!==null)for(var o=0;o<a.length;o++){var i=a[o],l=e,u=t,m=u;e:for(;m!==null;){switch(m.tag){case 27:if(Aa(m.type)){Ke=m.stateNode,jt=!1;break e}break;case 5:Ke=m.stateNode,jt=!1;break e;case 3:case 4:Ke=m.stateNode.containerInfo,jt=!0;break e}m=m.return}if(Ke===null)throw Error(c(160));Pf(l,u,i),Ke=null,jt=!1,l=i.alternate,l!==null&&(l.return=null),i.return=null}if(t.subtreeFlags&13886)for(t=t.child;t!==null;)qf(t,e),t=t.sibling}var En=null;function qf(e,t){var a=e.alternate,o=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:Mt(t,e),zt(e),o&4&&(Ta(3,e,e.return),Di(3,e),Ta(5,e,e.return));break;case 1:Mt(t,e),zt(e),o&512&&(st||a===null||Rn(a,a.return)),o&64&&Yn&&(e=e.updateQueue,e!==null&&(o=e.callbacks,o!==null&&(a=e.shared.hiddenCallbacks,e.shared.hiddenCallbacks=a===null?o:a.concat(o))));break;case 26:var i=En;if(Mt(t,e),zt(e),o&512&&(st||a===null||Rn(a,a.return)),o&4){var l=a!==null?a.memoizedState:null;if(o=e.memoizedState,a===null)if(o===null)if(e.stateNode===null){e:{o=e.type,a=e.memoizedProps,i=i.ownerDocument||i;t:switch(o){case"title":l=i.getElementsByTagName("title")[0],(!l||l[ia]||l[ut]||l.namespaceURI==="http://www.w3.org/2000/svg"||l.hasAttribute("itemprop"))&&(l=i.createElement(o),i.head.insertBefore(l,i.querySelector("head > title"))),St(l,o,a),l[ut]=e,nt(l),o=l;break e;case"link":var u=qp("link","href",i).get(o+(a.href||""));if(u){for(var m=0;m<u.length;m++)if(l=u[m],l.getAttribute("href")===(a.href==null||a.href===""?null:a.href)&&l.getAttribute("rel")===(a.rel==null?null:a.rel)&&l.getAttribute("title")===(a.title==null?null:a.title)&&l.getAttribute("crossorigin")===(a.crossOrigin==null?null:a.crossOrigin)){u.splice(m,1);break t}}l=i.createElement(o),St(l,o,a),i.head.appendChild(l);break;case"meta":if(u=qp("meta","content",i).get(o+(a.content||""))){for(m=0;m<u.length;m++)if(l=u[m],l.getAttribute("content")===(a.content==null?null:""+a.content)&&l.getAttribute("name")===(a.name==null?null:a.name)&&l.getAttribute("property")===(a.property==null?null:a.property)&&l.getAttribute("http-equiv")===(a.httpEquiv==null?null:a.httpEquiv)&&l.getAttribute("charset")===(a.charSet==null?null:a.charSet)){u.splice(m,1);break t}}l=i.createElement(o),St(l,o,a),i.head.appendChild(l);break;default:throw Error(c(468,o))}l[ut]=e,nt(l),o=l}e.stateNode=o}else Vp(i,e.type,e.stateNode);else e.stateNode=Wp(i,o,e.memoizedProps);else l!==o?(l===null?a.stateNode!==null&&(a=a.stateNode,a.parentNode.removeChild(a)):l.count--,o===null?Vp(i,e.type,e.stateNode):Wp(i,o,e.memoizedProps)):o===null&&e.stateNode!==null&&rc(e,e.memoizedProps,a.memoizedProps)}break;case 27:Mt(t,e),zt(e),o&512&&(st||a===null||Rn(a,a.return)),a!==null&&o&4&&rc(e,e.memoizedProps,a.memoizedProps);break;case 5:if(Mt(t,e),zt(e),o&512&&(st||a===null||Rn(a,a.return)),e.flags&32){i=e.stateNode;try{We(i,"")}catch(Z){ze(e,e.return,Z)}}o&4&&e.stateNode!=null&&(i=e.memoizedProps,rc(e,i,a!==null?a.memoizedProps:i)),o&1024&&(cc=!0);break;case 6:if(Mt(t,e),zt(e),o&4){if(e.stateNode===null)throw Error(c(162));o=e.memoizedProps,a=e.stateNode;try{a.nodeValue=o}catch(Z){ze(e,e.return,Z)}}break;case 3:if(pl=null,i=En,En=dl(t.containerInfo),Mt(t,e),En=i,zt(e),o&4&&a!==null&&a.memoizedState.isDehydrated)try{Yo(t.containerInfo)}catch(Z){ze(e,e.return,Z)}cc&&(cc=!1,Vf(e));break;case 4:o=En,En=dl(e.stateNode.containerInfo),Mt(t,e),zt(e),En=o;break;case 12:Mt(t,e),zt(e);break;case 31:Mt(t,e),zt(e),o&4&&(o=e.updateQueue,o!==null&&(e.updateQueue=null,Zr(e,o)));break;case 13:Mt(t,e),zt(e),e.child.flags&8192&&e.memoizedState!==null!=(a!==null&&a.memoizedState!==null)&&(Jr=Ie()),o&4&&(o=e.updateQueue,o!==null&&(e.updateQueue=null,Zr(e,o)));break;case 22:i=e.memoizedState!==null;var E=a!==null&&a.memoizedState!==null,R=Yn,M=st;if(Yn=R||i,st=M||E,Mt(t,e),st=M,Yn=R,zt(e),o&8192)e:for(t=e.stateNode,t._visibility=i?t._visibility&-2:t._visibility|1,i&&(a===null||E||Yn||st||no(e)),a=null,t=e;;){if(t.tag===5||t.tag===26){if(a===null){E=a=t;try{if(l=E.stateNode,i)u=l.style,typeof u.setProperty=="function"?u.setProperty("display","none","important"):u.display="none";else{m=E.stateNode;var G=E.memoizedProps.style,N=G!=null&&G.hasOwnProperty("display")?G.display:null;m.style.display=N==null||typeof N=="boolean"?"":(""+N).trim()}}catch(Z){ze(E,E.return,Z)}}}else if(t.tag===6){if(a===null){E=t;try{E.stateNode.nodeValue=i?"":E.memoizedProps}catch(Z){ze(E,E.return,Z)}}}else if(t.tag===18){if(a===null){E=t;try{var H=E.stateNode;i?Mp(H,!0):Mp(E.stateNode,!1)}catch(Z){ze(E,E.return,Z)}}}else if((t.tag!==22&&t.tag!==23||t.memoizedState===null||t===e)&&t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break e;for(;t.sibling===null;){if(t.return===null||t.return===e)break e;a===t&&(a=null),t=t.return}a===t&&(a=null),t.sibling.return=t.return,t=t.sibling}o&4&&(o=e.updateQueue,o!==null&&(a=o.retryQueue,a!==null&&(o.retryQueue=null,Zr(e,a))));break;case 19:Mt(t,e),zt(e),o&4&&(o=e.updateQueue,o!==null&&(e.updateQueue=null,Zr(e,o)));break;case 30:break;case 21:break;default:Mt(t,e),zt(e)}}function zt(e){var t=e.flags;if(t&2){try{for(var a,o=e.return;o!==null;){if(Uf(o)){a=o;break}o=o.return}if(a==null)throw Error(c(160));switch(a.tag){case 27:var i=a.stateNode,l=lc(e);Xr(e,l,i);break;case 5:var u=a.stateNode;a.flags&32&&(We(u,""),a.flags&=-33);var m=lc(e);Xr(e,m,u);break;case 3:case 4:var E=a.stateNode.containerInfo,R=lc(e);sc(e,R,E);break;default:throw Error(c(161))}}catch(M){ze(e,e.return,M)}e.flags&=-3}t&4096&&(e.flags&=-4097)}function Vf(e){if(e.subtreeFlags&1024)for(e=e.child;e!==null;){var t=e;Vf(t),t.tag===5&&t.flags&1024&&t.stateNode.reset(),e=e.sibling}}function qn(e,t){if(t.subtreeFlags&8772)for(t=t.child;t!==null;)Bf(e,t.alternate,t),t=t.sibling}function no(e){for(e=e.child;e!==null;){var t=e;switch(t.tag){case 0:case 11:case 14:case 15:Ta(4,t,t.return),no(t);break;case 1:Rn(t,t.return);var a=t.stateNode;typeof a.componentWillUnmount=="function"&&Mf(t,t.return,a),no(t);break;case 27:Pi(t.stateNode);case 26:case 5:Rn(t,t.return),no(t);break;case 22:t.memoizedState===null&&no(t);break;case 30:no(t);break;default:no(t)}e=e.sibling}}function Vn(e,t,a){for(a=a&&(t.subtreeFlags&8772)!==0,t=t.child;t!==null;){var o=t.alternate,i=e,l=t,u=l.flags;switch(l.tag){case 0:case 11:case 15:Vn(i,l,a),Di(4,l);break;case 1:if(Vn(i,l,a),o=l,i=o.stateNode,typeof i.componentDidMount=="function")try{i.componentDidMount()}catch(R){ze(o,o.return,R)}if(o=l,i=o.updateQueue,i!==null){var m=o.stateNode;try{var E=i.shared.hiddenCallbacks;if(E!==null)for(i.shared.hiddenCallbacks=null,i=0;i<E.length;i++)wd(E[i],m)}catch(R){ze(o,o.return,R)}}a&&u&64&&jf(l),Hi(l,l.return);break;case 27:$f(l);case 26:case 5:Vn(i,l,a),a&&o===null&&u&4&&zf(l),Hi(l,l.return);break;case 12:Vn(i,l,a);break;case 31:Vn(i,l,a),a&&u&4&&Yf(i,l);break;case 13:Vn(i,l,a),a&&u&4&&Wf(i,l);break;case 22:l.memoizedState===null&&Vn(i,l,a),Hi(l,l.return);break;case 30:break;default:Vn(i,l,a)}t=t.sibling}}function uc(e,t){var a=null;e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(a=e.memoizedState.cachePool.pool),e=null,t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(e=t.memoizedState.cachePool.pool),e!==a&&(e!=null&&e.refCount++,a!=null&&vi(a))}function dc(e,t){e=null,t.alternate!==null&&(e=t.alternate.memoizedState.cache),t=t.memoizedState.cache,t!==e&&(t.refCount++,e!=null&&vi(e))}function vn(e,t,a,o){if(t.subtreeFlags&10256)for(t=t.child;t!==null;)Kf(e,t,a,o),t=t.sibling}function Kf(e,t,a,o){var i=t.flags;switch(t.tag){case 0:case 11:case 15:vn(e,t,a,o),i&2048&&Di(9,t);break;case 1:vn(e,t,a,o);break;case 3:vn(e,t,a,o),i&2048&&(e=null,t.alternate!==null&&(e=t.alternate.memoizedState.cache),t=t.memoizedState.cache,t!==e&&(t.refCount++,e!=null&&vi(e)));break;case 12:if(i&2048){vn(e,t,a,o),e=t.stateNode;try{var l=t.memoizedProps,u=l.id,m=l.onPostCommit;typeof m=="function"&&m(u,t.alternate===null?"mount":"update",e.passiveEffectDuration,-0)}catch(E){ze(t,t.return,E)}}else vn(e,t,a,o);break;case 31:vn(e,t,a,o);break;case 13:vn(e,t,a,o);break;case 23:break;case 22:l=t.stateNode,u=t.alternate,t.memoizedState!==null?l._visibility&2?vn(e,t,a,o):ji(e,t):l._visibility&2?vn(e,t,a,o):(l._visibility|=2,Do(e,t,a,o,(t.subtreeFlags&10256)!==0||!1)),i&2048&&uc(u,t);break;case 24:vn(e,t,a,o),i&2048&&dc(t.alternate,t);break;default:vn(e,t,a,o)}}function Do(e,t,a,o,i){for(i=i&&((t.subtreeFlags&10256)!==0||!1),t=t.child;t!==null;){var l=e,u=t,m=a,E=o,R=u.flags;switch(u.tag){case 0:case 11:case 15:Do(l,u,m,E,i),Di(8,u);break;case 23:break;case 22:var M=u.stateNode;u.memoizedState!==null?M._visibility&2?Do(l,u,m,E,i):ji(l,u):(M._visibility|=2,Do(l,u,m,E,i)),i&&R&2048&&uc(u.alternate,u);break;case 24:Do(l,u,m,E,i),i&&R&2048&&dc(u.alternate,u);break;default:Do(l,u,m,E,i)}t=t.sibling}}function ji(e,t){if(t.subtreeFlags&10256)for(t=t.child;t!==null;){var a=e,o=t,i=o.flags;switch(o.tag){case 22:ji(a,o),i&2048&&uc(o.alternate,o);break;case 24:ji(a,o),i&2048&&dc(o.alternate,o);break;default:ji(a,o)}t=t.sibling}}var Mi=8192;function Ho(e,t,a){if(e.subtreeFlags&Mi)for(e=e.child;e!==null;)Xf(e,t,a),e=e.sibling}function Xf(e,t,a){switch(e.tag){case 26:Ho(e,t,a),e.flags&Mi&&e.memoizedState!==null&&py(a,En,e.memoizedState,e.memoizedProps);break;case 5:Ho(e,t,a);break;case 3:case 4:var o=En;En=dl(e.stateNode.containerInfo),Ho(e,t,a),En=o;break;case 22:e.memoizedState===null&&(o=e.alternate,o!==null&&o.memoizedState!==null?(o=Mi,Mi=16777216,Ho(e,t,a),Mi=o):Ho(e,t,a));break;default:Ho(e,t,a)}}function Zf(e){var t=e.alternate;if(t!==null&&(e=t.child,e!==null)){t.child=null;do t=e.sibling,e.sibling=null,e=t;while(e!==null)}}function zi(e){var t=e.deletions;if((e.flags&16)!==0){if(t!==null)for(var a=0;a<t.length;a++){var o=t[a];mt=o,Jf(o,e)}Zf(e)}if(e.subtreeFlags&10256)for(e=e.child;e!==null;)Qf(e),e=e.sibling}function Qf(e){switch(e.tag){case 0:case 11:case 15:zi(e),e.flags&2048&&Ta(9,e,e.return);break;case 3:zi(e);break;case 12:zi(e);break;case 22:var t=e.stateNode;e.memoizedState!==null&&t._visibility&2&&(e.return===null||e.return.tag!==13)?(t._visibility&=-3,Qr(e)):zi(e);break;default:zi(e)}}function Qr(e){var t=e.deletions;if((e.flags&16)!==0){if(t!==null)for(var a=0;a<t.length;a++){var o=t[a];mt=o,Jf(o,e)}Zf(e)}for(e=e.child;e!==null;){switch(t=e,t.tag){case 0:case 11:case 15:Ta(8,t,t.return),Qr(t);break;case 22:a=t.stateNode,a._visibility&2&&(a._visibility&=-3,Qr(t));break;default:Qr(t)}e=e.sibling}}function Jf(e,t){for(;mt!==null;){var a=mt;switch(a.tag){case 0:case 11:case 15:Ta(8,a,t);break;case 23:case 22:if(a.memoizedState!==null&&a.memoizedState.cachePool!==null){var o=a.memoizedState.cachePool.pool;o!=null&&o.refCount++}break;case 24:vi(a.memoizedState.cache)}if(o=a.child,o!==null)o.return=a,mt=o;else e:for(a=e;mt!==null;){o=mt;var i=o.sibling,l=o.return;if(_f(o),o===a){mt=null;break e}if(i!==null){i.return=l,mt=i;break e}mt=l}}}var Rg={getCacheForType:function(e){var t=vt(it),a=t.data.get(e);return a===void 0&&(a=e(),t.data.set(e,a)),a},cacheSignal:function(){return vt(it).controller.signal}},Ng=typeof WeakMap=="function"?WeakMap:Map,He=0,_e=null,Ee=null,Oe=0,Me=0,Wt=null,Ea=!1,jo=!1,fc=!1,Kn=0,Je=0,va=0,ao=0,pc=0,qt=0,Mo=0,Ui=null,Ut=null,hc=!1,Jr=0,ep=0,el=1/0,tl=null,Oa=null,ft=0,Sa=null,zo=null,Xn=0,mc=0,gc=null,tp=null,$i=0,yc=null;function Vt(){return(He&2)!==0&&Oe!==0?Oe&-Oe:D.T!==null?Sc():ni()}function np(){if(qt===0)if((Oe&536870912)===0||we){var e=aa;aa<<=1,(aa&3932160)===0&&(aa=262144),qt=e}else qt=536870912;return e=Pt.current,e!==null&&(e.flags|=32),qt}function $t(e,t,a){(e===_e&&(Me===2||Me===9)||e.cancelPendingCommit!==null)&&(Uo(e,0),wa(e,Oe,qt,!1)),Dn(e,a),((He&2)===0||e!==_e)&&(e===_e&&((He&2)===0&&(ao|=a),Je===4&&wa(e,Oe,qt,!1)),Nn(e))}function ap(e,t,a){if((He&6)!==0)throw Error(c(327));var o=!a&&(t&127)===0&&(t&e.expiredLanes)===0||hn(e,t),i=o?kg(e,t):Tc(e,t,!0),l=o;do{if(i===0){jo&&!o&&wa(e,t,0,!1);break}else{if(a=e.current.alternate,l&&!Ig(a)){i=Tc(e,t,!1),l=!1;continue}if(i===2){if(l=t,e.errorRecoveryDisabledLanes&l)var u=0;else u=e.pendingLanes&-536870913,u=u!==0?u:u&536870912?536870912:0;if(u!==0){t=u;e:{var m=e;i=Ui;var E=m.current.memoizedState.isDehydrated;if(E&&(Uo(m,u).flags|=256),u=Tc(m,u,!1),u!==2){if(fc&&!E){m.errorRecoveryDisabledLanes|=l,ao|=l,i=4;break e}l=Ut,Ut=i,l!==null&&(Ut===null?Ut=l:Ut.push.apply(Ut,l))}i=u}if(l=!1,i!==2)continue}}if(i===1){Uo(e,0),wa(e,t,0,!0);break}e:{switch(o=e,l=i,l){case 0:case 1:throw Error(c(345));case 4:if((t&4194048)!==t)break;case 6:wa(o,t,qt,!Ea);break e;case 2:Ut=null;break;case 3:case 5:break;default:throw Error(c(329))}if((t&62914560)===t&&(i=Jr+300-Ie(),10<i)){if(wa(o,t,qt,!Ea),ja(o,0,!0)!==0)break e;Xn=t,o.timeoutHandle=Dp(op.bind(null,o,a,Ut,tl,hc,t,qt,ao,Mo,Ea,l,"Throttled",-0,0),i);break e}op(o,a,Ut,tl,hc,t,qt,ao,Mo,Ea,l,null,-0,0)}}break}while(!0);Nn(e)}function op(e,t,a,o,i,l,u,m,E,R,M,G,N,H){if(e.timeoutHandle=-1,G=t.subtreeFlags,G&8192||(G&16785408)===16785408){G={stylesheets:null,count:0,imgCount:0,imgBytes:0,suspenseyImages:[],waitingForImages:!0,waitingForViewTransition:!1,unsuspend:Hn},Xf(t,l,G);var Z=(l&62914560)===l?Jr-Ie():(l&4194048)===l?ep-Ie():0;if(Z=hy(G,Z),Z!==null){Xn=l,e.cancelPendingCommit=Z(fp.bind(null,e,t,l,a,o,i,u,m,E,M,G,null,N,H)),wa(e,l,u,!R);return}}fp(e,t,l,a,o,i,u,m,E)}function Ig(e){for(var t=e;;){var a=t.tag;if((a===0||a===11||a===15)&&t.flags&16384&&(a=t.updateQueue,a!==null&&(a=a.stores,a!==null)))for(var o=0;o<a.length;o++){var i=a[o],l=i.getSnapshot;i=i.value;try{if(!Bt(l(),i))return!1}catch{return!1}}if(a=t.child,t.subtreeFlags&16384&&a!==null)a.return=t,t=a;else{if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return!0;t=t.return}t.sibling.return=t.return,t=t.sibling}}return!0}function wa(e,t,a,o){t&=~pc,t&=~ao,e.suspendedLanes|=t,e.pingedLanes&=~t,o&&(e.warmLanes|=t),o=e.expirationTimes;for(var i=t;0<i;){var l=31-Tt(i),u=1<<l;o[l]=-1,i&=~u}a!==0&&lo(e,a,t)}function nl(){return(He&6)===0?(Gi(0),!1):!0}function bc(){if(Ee!==null){if(Me===0)var e=Ee.return;else e=Ee,Un=Va=null,Ds(e),No=null,Si=0,e=Ee;for(;e!==null;)Hf(e.alternate,e),e=e.return;Ee=null}}function Uo(e,t){var a=e.timeoutHandle;a!==-1&&(e.timeoutHandle=-1,Xg(a)),a=e.cancelPendingCommit,a!==null&&(e.cancelPendingCommit=null,a()),Xn=0,bc(),_e=e,Ee=a=Mn(e.current,null),Oe=t,Me=0,Wt=null,Ea=!1,jo=hn(e,t),fc=!1,Mo=qt=pc=ao=va=Je=0,Ut=Ui=null,hc=!1,(t&8)!==0&&(t|=t&32);var o=e.entangledLanes;if(o!==0)for(e=e.entanglements,o&=t;0<o;){var i=31-Tt(o),l=1<<i;t|=e[i],o&=~l}return Kn=t,Sr(),a}function ip(e,t){pe=null,D.H=Li,t===Ro||t===Lr?(t=Ed(),Me=3):t===Os?(t=Ed(),Me=4):Me=t===Xs?8:t!==null&&typeof t=="object"&&typeof t.then=="function"?6:1,Wt=t,Ee===null&&(Je=1,Yr(e,tn(t,e.current)))}function rp(){var e=Pt.current;return e===null?!0:(Oe&4194048)===Oe?rn===null:(Oe&62914560)===Oe||(Oe&536870912)!==0?e===rn:!1}function lp(){var e=D.H;return D.H=Li,e===null?Li:e}function sp(){var e=D.A;return D.A=Rg,e}function al(){Je=4,Ea||(Oe&4194048)!==Oe&&Pt.current!==null||(jo=!0),(va&134217727)===0&&(ao&134217727)===0||_e===null||wa(_e,Oe,qt,!1)}function Tc(e,t,a){var o=He;He|=2;var i=lp(),l=sp();(_e!==e||Oe!==t)&&(tl=null,Uo(e,t)),t=!1;var u=Je;e:do try{if(Me!==0&&Ee!==null){var m=Ee,E=Wt;switch(Me){case 8:bc(),u=6;break e;case 3:case 2:case 9:case 6:Pt.current===null&&(t=!0);var R=Me;if(Me=0,Wt=null,$o(e,m,E,R),a&&jo){u=0;break e}break;default:R=Me,Me=0,Wt=null,$o(e,m,E,R)}}Lg(),u=Je;break}catch(M){ip(e,M)}while(!0);return t&&e.shellSuspendCounter++,Un=Va=null,He=o,D.H=i,D.A=l,Ee===null&&(_e=null,Oe=0,Sr()),u}function Lg(){for(;Ee!==null;)cp(Ee)}function kg(e,t){var a=He;He|=2;var o=lp(),i=sp();_e!==e||Oe!==t?(tl=null,el=Ie()+500,Uo(e,t)):jo=hn(e,t);e:do try{if(Me!==0&&Ee!==null){t=Ee;var l=Wt;t:switch(Me){case 1:Me=0,Wt=null,$o(e,t,l,1);break;case 2:case 9:if(bd(l)){Me=0,Wt=null,up(t);break}t=function(){Me!==2&&Me!==9||_e!==e||(Me=7),Nn(e)},l.then(t,t);break e;case 3:Me=7;break e;case 4:Me=5;break e;case 7:bd(l)?(Me=0,Wt=null,up(t)):(Me=0,Wt=null,$o(e,t,l,7));break;case 5:var u=null;switch(Ee.tag){case 26:u=Ee.memoizedState;case 5:case 27:var m=Ee;if(u?Kp(u):m.stateNode.complete){Me=0,Wt=null;var E=m.sibling;if(E!==null)Ee=E;else{var R=m.return;R!==null?(Ee=R,ol(R)):Ee=null}break t}}Me=0,Wt=null,$o(e,t,l,5);break;case 6:Me=0,Wt=null,$o(e,t,l,6);break;case 8:bc(),Je=6;break e;default:throw Error(c(462))}}Cg();break}catch(M){ip(e,M)}while(!0);return Un=Va=null,D.H=o,D.A=i,He=a,Ee!==null?0:(_e=null,Oe=0,Sr(),Je)}function Cg(){for(;Ee!==null&&!De();)cp(Ee)}function cp(e){var t=Cf(e.alternate,e,Kn);e.memoizedProps=e.pendingProps,t===null?ol(e):Ee=t}function up(e){var t=e,a=t.alternate;switch(t.tag){case 15:case 0:t=Ff(a,t,t.pendingProps,t.type,void 0,Oe);break;case 11:t=Ff(a,t,t.pendingProps,t.type.render,t.ref,Oe);break;case 5:Ds(t);default:Hf(a,t),t=Ee=ld(t,Kn),t=Cf(a,t,Kn)}e.memoizedProps=e.pendingProps,t===null?ol(e):Ee=t}function $o(e,t,a,o){Un=Va=null,Ds(t),No=null,Si=0;var i=t.return;try{if(vg(e,i,t,a,Oe)){Je=1,Yr(e,tn(a,e.current)),Ee=null;return}}catch(l){if(i!==null)throw Ee=i,l;Je=1,Yr(e,tn(a,e.current)),Ee=null;return}t.flags&32768?(we||o===1?e=!0:jo||(Oe&536870912)!==0?e=!1:(Ea=e=!0,(o===2||o===9||o===3||o===6)&&(o=Pt.current,o!==null&&o.tag===13&&(o.flags|=16384))),dp(t,e)):ol(t)}function ol(e){var t=e;do{if((t.flags&32768)!==0){dp(t,Ea);return}e=t.return;var a=wg(t.alternate,t,Kn);if(a!==null){Ee=a;return}if(t=t.sibling,t!==null){Ee=t;return}Ee=t=e}while(t!==null);Je===0&&(Je=5)}function dp(e,t){do{var a=xg(e.alternate,e);if(a!==null){a.flags&=32767,Ee=a;return}if(a=e.return,a!==null&&(a.flags|=32768,a.subtreeFlags=0,a.deletions=null),!t&&(e=e.sibling,e!==null)){Ee=e;return}Ee=e=a}while(e!==null);Je=6,Ee=null}function fp(e,t,a,o,i,l,u,m,E){e.cancelPendingCommit=null;do il();while(ft!==0);if((He&6)!==0)throw Error(c(327));if(t!==null){if(t===e.current)throw Error(c(177));if(l=t.lanes|t.childLanes,l|=ls,za(e,a,l,u,m,E),e===_e&&(Ee=_e=null,Oe=0),zo=t,Sa=e,Xn=a,mc=l,gc=i,tp=o,(t.subtreeFlags&10256)!==0||(t.flags&10256)!==0?(e.callbackNode=null,e.callbackPriority=0,Mg(je,function(){return yp(),null})):(e.callbackNode=null,e.callbackPriority=0),o=(t.flags&13878)!==0,(t.subtreeFlags&13878)!==0||o){o=D.T,D.T=null,i=P.p,P.p=2,u=He,He|=4;try{Ag(e,t,a)}finally{He=u,P.p=i,D.T=o}}ft=1,pp(),hp(),mp()}}function pp(){if(ft===1){ft=0;var e=Sa,t=zo,a=(t.flags&13878)!==0;if((t.subtreeFlags&13878)!==0||a){a=D.T,D.T=null;var o=P.p;P.p=2;var i=He;He|=4;try{qf(t,e);var l=Lc,u=Qu(e.containerInfo),m=l.focusedElem,E=l.selectionRange;if(u!==m&&m&&m.ownerDocument&&Zu(m.ownerDocument.documentElement,m)){if(E!==null&&ns(m)){var R=E.start,M=E.end;if(M===void 0&&(M=R),"selectionStart"in m)m.selectionStart=R,m.selectionEnd=Math.min(M,m.value.length);else{var G=m.ownerDocument||document,N=G&&G.defaultView||window;if(N.getSelection){var H=N.getSelection(),Z=m.textContent.length,re=Math.min(E.start,Z),Be=E.end===void 0?re:Math.min(E.end,Z);!H.extend&&re>Be&&(u=Be,Be=re,re=u);var S=Xu(m,re),v=Xu(m,Be);if(S&&v&&(H.rangeCount!==1||H.anchorNode!==S.node||H.anchorOffset!==S.offset||H.focusNode!==v.node||H.focusOffset!==v.offset)){var F=G.createRange();F.setStart(S.node,S.offset),H.removeAllRanges(),re>Be?(H.addRange(F),H.extend(v.node,v.offset)):(F.setEnd(v.node,v.offset),H.addRange(F))}}}}for(G=[],H=m;H=H.parentNode;)H.nodeType===1&&G.push({element:H,left:H.scrollLeft,top:H.scrollTop});for(typeof m.focus=="function"&&m.focus(),m=0;m<G.length;m++){var U=G[m];U.element.scrollLeft=U.left,U.element.scrollTop=U.top}}yl=!!Ic,Lc=Ic=null}finally{He=i,P.p=o,D.T=a}}e.current=t,ft=2}}function hp(){if(ft===2){ft=0;var e=Sa,t=zo,a=(t.flags&8772)!==0;if((t.subtreeFlags&8772)!==0||a){a=D.T,D.T=null;var o=P.p;P.p=2;var i=He;He|=4;try{Bf(e,t.alternate,t)}finally{He=i,P.p=o,D.T=a}}ft=3}}function mp(){if(ft===4||ft===3){ft=0,ge();var e=Sa,t=zo,a=Xn,o=tp;(t.subtreeFlags&10256)!==0||(t.flags&10256)!==0?ft=5:(ft=0,zo=Sa=null,gp(e,e.pendingLanes));var i=e.pendingLanes;if(i===0&&(Oa=null),ti(a),t=t.stateNode,Nt&&typeof Nt.onCommitFiberRoot=="function")try{Nt.onCommitFiberRoot(ct,t,void 0,(t.current.flags&128)===128)}catch{}if(o!==null){t=D.T,i=P.p,P.p=2,D.T=null;try{for(var l=e.onRecoverableError,u=0;u<o.length;u++){var m=o[u];l(m.value,{componentStack:m.stack})}}finally{D.T=t,P.p=i}}(Xn&3)!==0&&il(),Nn(e),i=e.pendingLanes,(a&261930)!==0&&(i&42)!==0?e===yc?$i++:($i=0,yc=e):$i=0,Gi(0)}}function gp(e,t){(e.pooledCacheLanes&=t)===0&&(t=e.pooledCache,t!=null&&(e.pooledCache=null,vi(t)))}function il(){return pp(),hp(),mp(),yp()}function yp(){if(ft!==5)return!1;var e=Sa,t=mc;mc=0;var a=ti(Xn),o=D.T,i=P.p;try{P.p=32>a?32:a,D.T=null,a=gc,gc=null;var l=Sa,u=Xn;if(ft=0,zo=Sa=null,Xn=0,(He&6)!==0)throw Error(c(331));var m=He;if(He|=4,Qf(l.current),Kf(l,l.current,u,a),He=m,Gi(0,!1),Nt&&typeof Nt.onPostCommitFiberRoot=="function")try{Nt.onPostCommitFiberRoot(ct,l)}catch{}return!0}finally{P.p=i,D.T=o,gp(e,t)}}function bp(e,t,a){t=tn(a,t),t=Ks(e.stateNode,t,2),e=ga(e,t,2),e!==null&&(Dn(e,2),Nn(e))}function ze(e,t,a){if(e.tag===3)bp(e,e,a);else for(;t!==null;){if(t.tag===3){bp(t,e,a);break}else if(t.tag===1){var o=t.stateNode;if(typeof t.type.getDerivedStateFromError=="function"||typeof o.componentDidCatch=="function"&&(Oa===null||!Oa.has(o))){e=tn(a,e),a=Tf(2),o=ga(t,a,2),o!==null&&(Ef(a,o,t,e),Dn(o,2),Nn(o));break}}t=t.return}}function Ec(e,t,a){var o=e.pingCache;if(o===null){o=e.pingCache=new Ng;var i=new Set;o.set(t,i)}else i=o.get(t),i===void 0&&(i=new Set,o.set(t,i));i.has(a)||(fc=!0,i.add(a),e=Dg.bind(null,e,t,a),t.then(e,e))}function Dg(e,t,a){var o=e.pingCache;o!==null&&o.delete(t),e.pingedLanes|=e.suspendedLanes&a,e.warmLanes&=~a,_e===e&&(Oe&a)===a&&(Je===4||Je===3&&(Oe&62914560)===Oe&&300>Ie()-Jr?(He&2)===0&&Uo(e,0):pc|=a,Mo===Oe&&(Mo=0)),Nn(e)}function Tp(e,t){t===0&&(t=ei()),e=Ya(e,t),e!==null&&(Dn(e,t),Nn(e))}function Hg(e){var t=e.memoizedState,a=0;t!==null&&(a=t.retryLane),Tp(e,a)}function jg(e,t){var a=0;switch(e.tag){case 31:case 13:var o=e.stateNode,i=e.memoizedState;i!==null&&(a=i.retryLane);break;case 19:o=e.stateNode;break;case 22:o=e.stateNode._retryCache;break;default:throw Error(c(314))}o!==null&&o.delete(t),Tp(e,a)}function Mg(e,t){return oe(e,t)}var rl=null,Go=null,vc=!1,ll=!1,Oc=!1,xa=0;function Nn(e){e!==Go&&e.next===null&&(Go===null?rl=Go=e:Go=Go.next=e),ll=!0,vc||(vc=!0,Ug())}function Gi(e,t){if(!Oc&&ll){Oc=!0;do for(var a=!1,o=rl;o!==null;){if(e!==0){var i=o.pendingLanes;if(i===0)var l=0;else{var u=o.suspendedLanes,m=o.pingedLanes;l=(1<<31-Tt(42|e)+1)-1,l&=i&~(u&~m),l=l&201326741?l&201326741|1:l?l|2:0}l!==0&&(a=!0,Sp(o,l))}else l=Oe,l=ja(o,o===_e?l:0,o.cancelPendingCommit!==null||o.timeoutHandle!==-1),(l&3)===0||hn(o,l)||(a=!0,Sp(o,l));o=o.next}while(a);Oc=!1}}function zg(){Ep()}function Ep(){ll=vc=!1;var e=0;xa!==0&&Kg()&&(e=xa);for(var t=Ie(),a=null,o=rl;o!==null;){var i=o.next,l=vp(o,t);l===0?(o.next=null,a===null?rl=i:a.next=i,i===null&&(Go=a)):(a=o,(e!==0||(l&3)!==0)&&(ll=!0)),o=i}ft!==0&&ft!==5||Gi(e),xa!==0&&(xa=0)}function vp(e,t){for(var a=e.suspendedLanes,o=e.pingedLanes,i=e.expirationTimes,l=e.pendingLanes&-62914561;0<l;){var u=31-Tt(l),m=1<<u,E=i[u];E===-1?((m&a)===0||(m&o)!==0)&&(i[u]=Gl(m,t)):E<=t&&(e.expiredLanes|=m),l&=~m}if(t=_e,a=Oe,a=ja(e,e===t?a:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),o=e.callbackNode,a===0||e===t&&(Me===2||Me===9)||e.cancelPendingCommit!==null)return o!==null&&o!==null&&Q(o),e.callbackNode=null,e.callbackPriority=0;if((a&3)===0||hn(e,a)){if(t=a&-a,t===e.callbackPriority)return t;switch(o!==null&&Q(o),ti(a)){case 2:case 8:a=dn;break;case 32:a=je;break;case 268435456:a=Ha;break;default:a=je}return o=Op.bind(null,e),a=oe(a,o),e.callbackPriority=t,e.callbackNode=a,t}return o!==null&&o!==null&&Q(o),e.callbackPriority=2,e.callbackNode=null,2}function Op(e,t){if(ft!==0&&ft!==5)return e.callbackNode=null,e.callbackPriority=0,null;var a=e.callbackNode;if(il()&&e.callbackNode!==a)return null;var o=Oe;return o=ja(e,e===_e?o:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),o===0?null:(ap(e,o,t),vp(e,Ie()),e.callbackNode!=null&&e.callbackNode===a?Op.bind(null,e):null)}function Sp(e,t){if(il())return null;ap(e,t,!0)}function Ug(){Zg(function(){(He&6)!==0?oe(Lt,zg):Ep()})}function Sc(){if(xa===0){var e=Ao;e===0&&(e=fn,fn<<=1,(fn&261888)===0&&(fn=256)),xa=e}return xa}function wp(e){return e==null||typeof e=="symbol"||typeof e=="boolean"?null:typeof e=="function"?e:mr(""+e)}function xp(e,t){var a=t.ownerDocument.createElement("input");return a.name=t.name,a.value=t.value,e.id&&a.setAttribute("form",e.id),t.parentNode.insertBefore(a,t),e=new FormData(e),a.parentNode.removeChild(a),e}function $g(e,t,a,o,i){if(t==="submit"&&a&&a.stateNode===i){var l=wp((i[dt]||null).action),u=o.submitter;u&&(t=(t=u[dt]||null)?wp(t.formAction):u.getAttribute("formAction"),t!==null&&(l=t,u=null));var m=new Tr("action","action",null,o,i);e.push({event:m,listeners:[{instance:null,listener:function(){if(o.defaultPrevented){if(xa!==0){var E=u?xp(i,u):new FormData(i);_s(a,{pending:!0,data:E,method:i.method,action:l},null,E)}}else typeof l=="function"&&(m.preventDefault(),E=u?xp(i,u):new FormData(i),_s(a,{pending:!0,data:E,method:i.method,action:l},l,E))},currentTarget:i}]})}}for(var wc=0;wc<rs.length;wc++){var xc=rs[wc],Gg=xc.toLowerCase(),Bg=xc[0].toUpperCase()+xc.slice(1);Tn(Gg,"on"+Bg)}Tn(td,"onAnimationEnd"),Tn(nd,"onAnimationIteration"),Tn(ad,"onAnimationStart"),Tn("dblclick","onDoubleClick"),Tn("focusin","onFocus"),Tn("focusout","onBlur"),Tn(og,"onTransitionRun"),Tn(ig,"onTransitionStart"),Tn(rg,"onTransitionCancel"),Tn(od,"onTransitionEnd"),sa("onMouseEnter",["mouseout","mouseover"]),sa("onMouseLeave",["mouseout","mouseover"]),sa("onPointerEnter",["pointerout","pointerover"]),sa("onPointerLeave",["pointerout","pointerover"]),yn("onChange","change click focusin focusout input keydown keyup selectionchange".split(" ")),yn("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),yn("onBeforeInput",["compositionend","keypress","textInput","paste"]),yn("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" ")),yn("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" ")),yn("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var Bi="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),_g=new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(Bi));function Ap(e,t){t=(t&4)!==0;for(var a=0;a<e.length;a++){var o=e[a],i=o.event;o=o.listeners;e:{var l=void 0;if(t)for(var u=o.length-1;0<=u;u--){var m=o[u],E=m.instance,R=m.currentTarget;if(m=m.listener,E!==l&&i.isPropagationStopped())break e;l=m,i.currentTarget=R;try{l(i)}catch(M){Or(M)}i.currentTarget=null,l=E}else for(u=0;u<o.length;u++){if(m=o[u],E=m.instance,R=m.currentTarget,m=m.listener,E!==l&&i.isPropagationStopped())break e;l=m,i.currentTarget=R;try{l(i)}catch(M){Or(M)}i.currentTarget=null,l=E}}}}function ve(e,t){var a=t[oi];a===void 0&&(a=t[oi]=new Set);var o=e+"__bubble";a.has(o)||(Fp(t,e,2,!1),a.add(o))}function Ac(e,t,a){var o=0;t&&(o|=4),Fp(a,e,o,t)}var sl="_reactListening"+Math.random().toString(36).slice(2);function Fc(e){if(!e[sl]){e[sl]=!0,ur.forEach(function(a){a!=="selectionchange"&&(_g.has(a)||Ac(a,!1,e),Ac(a,!0,e))});var t=e.nodeType===9?e:e.ownerDocument;t===null||t[sl]||(t[sl]=!0,Ac("selectionchange",!1,t))}}function Fp(e,t,a,o){switch(nh(t)){case 2:var i=yy;break;case 8:i=by;break;default:i=Bc}a=i.bind(null,t,a,e),i=void 0,!ql||t!=="touchstart"&&t!=="touchmove"&&t!=="wheel"||(i=!0),o?i!==void 0?e.addEventListener(t,a,{capture:!0,passive:i}):e.addEventListener(t,a,!0):i!==void 0?e.addEventListener(t,a,{passive:i}):e.addEventListener(t,a,!1)}function Rc(e,t,a,o,i){var l=o;if((t&1)===0&&(t&2)===0&&o!==null)e:for(;;){if(o===null)return;var u=o.tag;if(u===3||u===4){var m=o.stateNode.containerInfo;if(m===i)break;if(u===4)for(u=o.return;u!==null;){var E=u.tag;if((E===3||E===4)&&u.stateNode.containerInfo===i)return;u=u.return}for(;m!==null;){if(u=gn(m),u===null)return;if(E=u.tag,E===5||E===6||E===26||E===27){o=l=u;continue e}m=m.parentNode}}o=o.return}Lu(function(){var R=l,M=Yl(a),G=[];e:{var N=id.get(e);if(N!==void 0){var H=Tr,Z=e;switch(e){case"keypress":if(yr(a)===0)break e;case"keydown":case"keyup":H=jm;break;case"focusin":Z="focus",H=Zl;break;case"focusout":Z="blur",H=Zl;break;case"beforeblur":case"afterblur":H=Zl;break;case"click":if(a.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":H=Du;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":H=wm;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":H=Um;break;case td:case nd:case ad:H=Fm;break;case od:H=Gm;break;case"scroll":case"scrollend":H=Om;break;case"wheel":H=_m;break;case"copy":case"cut":case"paste":H=Nm;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":H=ju;break;case"toggle":case"beforetoggle":H=Ym}var re=(t&4)!==0,Be=!re&&(e==="scroll"||e==="scrollend"),S=re?N!==null?N+"Capture":null:N;re=[];for(var v=R,F;v!==null;){var U=v;if(F=U.stateNode,U=U.tag,U!==5&&U!==26&&U!==27||F===null||S===null||(U=ui(v,S),U!=null&&re.push(_i(v,U,F))),Be)break;v=v.return}0<re.length&&(N=new H(N,Z,null,a,M),G.push({event:N,listeners:re}))}}if((t&7)===0){e:{if(N=e==="mouseover"||e==="pointerover",H=e==="mouseout"||e==="pointerout",N&&a!==Pl&&(Z=a.relatedTarget||a.fromElement)&&(gn(Z)||Z[oa]))break e;if((H||N)&&(N=M.window===M?M:(N=M.ownerDocument)?N.defaultView||N.parentWindow:window,H?(Z=a.relatedTarget||a.toElement,H=R,Z=Z?gn(Z):null,Z!==null&&(Be=f(Z),re=Z.tag,Z!==Be||re!==5&&re!==27&&re!==6)&&(Z=null)):(H=null,Z=R),H!==Z)){if(re=Du,U="onMouseLeave",S="onMouseEnter",v="mouse",(e==="pointerout"||e==="pointerover")&&(re=ju,U="onPointerLeave",S="onPointerEnter",v="pointer"),Be=H==null?N:Ga(H),F=Z==null?N:Ga(Z),N=new re(U,v+"leave",H,a,M),N.target=Be,N.relatedTarget=F,U=null,gn(M)===R&&(re=new re(S,v+"enter",Z,a,M),re.target=F,re.relatedTarget=Be,U=re),Be=U,H&&Z)t:{for(re=Pg,S=H,v=Z,F=0,U=S;U;U=re(U))F++;U=0;for(var ie=v;ie;ie=re(ie))U++;for(;0<F-U;)S=re(S),F--;for(;0<U-F;)v=re(v),U--;for(;F--;){if(S===v||v!==null&&S===v.alternate){re=S;break t}S=re(S),v=re(v)}re=null}else re=null;H!==null&&Rp(G,N,H,re,!1),Z!==null&&Be!==null&&Rp(G,Be,Z,re,!0)}}e:{if(N=R?Ga(R):window,H=N.nodeName&&N.nodeName.toLowerCase(),H==="select"||H==="input"&&N.type==="file")var Le=Pu;else if(Bu(N))if(Yu)Le=tg;else{Le=Jm;var J=Qm}else H=N.nodeName,!H||H.toLowerCase()!=="input"||N.type!=="checkbox"&&N.type!=="radio"?R&&bn(R.elementType)&&(Le=Pu):Le=eg;if(Le&&(Le=Le(e,R))){_u(G,Le,a,M);break e}J&&J(e,N,R),e==="focusout"&&R&&N.type==="number"&&R.memoizedProps.value!=null&&K(N,"number",N.value)}switch(J=R?Ga(R):window,e){case"focusin":(Bu(J)||J.contentEditable==="true")&&(bo=J,as=R,bi=null);break;case"focusout":bi=as=bo=null;break;case"mousedown":os=!0;break;case"contextmenu":case"mouseup":case"dragend":os=!1,Ju(G,a,M);break;case"selectionchange":if(ag)break;case"keydown":case"keyup":Ju(G,a,M)}var me;if(Jl)e:{switch(e){case"compositionstart":var Se="onCompositionStart";break e;case"compositionend":Se="onCompositionEnd";break e;case"compositionupdate":Se="onCompositionUpdate";break e}Se=void 0}else yo?$u(e,a)&&(Se="onCompositionEnd"):e==="keydown"&&a.keyCode===229&&(Se="onCompositionStart");Se&&(Mu&&a.locale!=="ko"&&(yo||Se!=="onCompositionStart"?Se==="onCompositionEnd"&&yo&&(me=ku()):(ca=M,Vl="value"in ca?ca.value:ca.textContent,yo=!0)),J=cl(R,Se),0<J.length&&(Se=new Hu(Se,e,null,a,M),G.push({event:Se,listeners:J}),me?Se.data=me:(me=Gu(a),me!==null&&(Se.data=me)))),(me=qm?Vm(e,a):Km(e,a))&&(Se=cl(R,"onBeforeInput"),0<Se.length&&(J=new Hu("onBeforeInput","beforeinput",null,a,M),G.push({event:J,listeners:Se}),J.data=me)),$g(G,e,R,a,M)}Ap(G,t)})}function _i(e,t,a){return{instance:e,listener:t,currentTarget:a}}function cl(e,t){for(var a=t+"Capture",o=[];e!==null;){var i=e,l=i.stateNode;if(i=i.tag,i!==5&&i!==26&&i!==27||l===null||(i=ui(e,a),i!=null&&o.unshift(_i(e,i,l)),i=ui(e,t),i!=null&&o.push(_i(e,i,l))),e.tag===3)return o;e=e.return}return[]}function Pg(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5&&e.tag!==27);return e||null}function Rp(e,t,a,o,i){for(var l=t._reactName,u=[];a!==null&&a!==o;){var m=a,E=m.alternate,R=m.stateNode;if(m=m.tag,E!==null&&E===o)break;m!==5&&m!==26&&m!==27||R===null||(E=R,i?(R=ui(a,l),R!=null&&u.unshift(_i(a,R,E))):i||(R=ui(a,l),R!=null&&u.push(_i(a,R,E)))),a=a.return}u.length!==0&&e.push({event:t,listeners:u})}var Yg=/\r\n?/g,Wg=/\u0000|\uFFFD/g;function Np(e){return(typeof e=="string"?e:""+e).replace(Yg,`
`).replace(Wg,"")}function Ip(e,t){return t=Np(t),Np(e)===t}function Ge(e,t,a,o,i,l){switch(a){case"children":typeof o=="string"?t==="body"||t==="textarea"&&o===""||We(e,o):(typeof o=="number"||typeof o=="bigint")&&t!=="body"&&We(e,""+o);break;case"className":fo(e,"class",o);break;case"tabIndex":fo(e,"tabindex",o);break;case"dir":case"role":case"viewBox":case"width":case"height":fo(e,a,o);break;case"style":ho(e,o,l);break;case"data":if(t!=="object"){fo(e,"data",o);break}case"src":case"href":if(o===""&&(t!=="a"||a!=="href")){e.removeAttribute(a);break}if(o==null||typeof o=="function"||typeof o=="symbol"||typeof o=="boolean"){e.removeAttribute(a);break}o=mr(""+o),e.setAttribute(a,o);break;case"action":case"formAction":if(typeof o=="function"){e.setAttribute(a,"javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");break}else typeof l=="function"&&(a==="formAction"?(t!=="input"&&Ge(e,t,"name",i.name,i,null),Ge(e,t,"formEncType",i.formEncType,i,null),Ge(e,t,"formMethod",i.formMethod,i,null),Ge(e,t,"formTarget",i.formTarget,i,null)):(Ge(e,t,"encType",i.encType,i,null),Ge(e,t,"method",i.method,i,null),Ge(e,t,"target",i.target,i,null)));if(o==null||typeof o=="symbol"||typeof o=="boolean"){e.removeAttribute(a);break}o=mr(""+o),e.setAttribute(a,o);break;case"onClick":o!=null&&(e.onclick=Hn);break;case"onScroll":o!=null&&ve("scroll",e);break;case"onScrollEnd":o!=null&&ve("scrollend",e);break;case"dangerouslySetInnerHTML":if(o!=null){if(typeof o!="object"||!("__html"in o))throw Error(c(61));if(a=o.__html,a!=null){if(i.children!=null)throw Error(c(60));e.innerHTML=a}}break;case"multiple":e.multiple=o&&typeof o!="function"&&typeof o!="symbol";break;case"muted":e.muted=o&&typeof o!="function"&&typeof o!="symbol";break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"defaultValue":case"defaultChecked":case"innerHTML":case"ref":break;case"autoFocus":break;case"xlinkHref":if(o==null||typeof o=="function"||typeof o=="boolean"||typeof o=="symbol"){e.removeAttribute("xlink:href");break}a=mr(""+o),e.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href",a);break;case"contentEditable":case"spellCheck":case"draggable":case"value":case"autoReverse":case"externalResourcesRequired":case"focusable":case"preserveAlpha":o!=null&&typeof o!="function"&&typeof o!="symbol"?e.setAttribute(a,""+o):e.removeAttribute(a);break;case"inert":case"allowFullScreen":case"async":case"autoPlay":case"controls":case"default":case"defer":case"disabled":case"disablePictureInPicture":case"disableRemotePlayback":case"formNoValidate":case"hidden":case"loop":case"noModule":case"noValidate":case"open":case"playsInline":case"readOnly":case"required":case"reversed":case"scoped":case"seamless":case"itemScope":o&&typeof o!="function"&&typeof o!="symbol"?e.setAttribute(a,""):e.removeAttribute(a);break;case"capture":case"download":o===!0?e.setAttribute(a,""):o!==!1&&o!=null&&typeof o!="function"&&typeof o!="symbol"?e.setAttribute(a,o):e.removeAttribute(a);break;case"cols":case"rows":case"size":case"span":o!=null&&typeof o!="function"&&typeof o!="symbol"&&!isNaN(o)&&1<=o?e.setAttribute(a,o):e.removeAttribute(a);break;case"rowSpan":case"start":o==null||typeof o=="function"||typeof o=="symbol"||isNaN(o)?e.removeAttribute(a):e.setAttribute(a,o);break;case"popover":ve("beforetoggle",e),ve("toggle",e),uo(e,"popover",o);break;case"xlinkActuate":Jt(e,"http://www.w3.org/1999/xlink","xlink:actuate",o);break;case"xlinkArcrole":Jt(e,"http://www.w3.org/1999/xlink","xlink:arcrole",o);break;case"xlinkRole":Jt(e,"http://www.w3.org/1999/xlink","xlink:role",o);break;case"xlinkShow":Jt(e,"http://www.w3.org/1999/xlink","xlink:show",o);break;case"xlinkTitle":Jt(e,"http://www.w3.org/1999/xlink","xlink:title",o);break;case"xlinkType":Jt(e,"http://www.w3.org/1999/xlink","xlink:type",o);break;case"xmlBase":Jt(e,"http://www.w3.org/XML/1998/namespace","xml:base",o);break;case"xmlLang":Jt(e,"http://www.w3.org/XML/1998/namespace","xml:lang",o);break;case"xmlSpace":Jt(e,"http://www.w3.org/XML/1998/namespace","xml:space",o);break;case"is":uo(e,"is",o);break;case"innerText":case"textContent":break;default:(!(2<a.length)||a[0]!=="o"&&a[0]!=="O"||a[1]!=="n"&&a[1]!=="N")&&(a=Em.get(a)||a,uo(e,a,o))}}function Nc(e,t,a,o,i,l){switch(a){case"style":ho(e,o,l);break;case"dangerouslySetInnerHTML":if(o!=null){if(typeof o!="object"||!("__html"in o))throw Error(c(61));if(a=o.__html,a!=null){if(i.children!=null)throw Error(c(60));e.innerHTML=a}}break;case"children":typeof o=="string"?We(e,o):(typeof o=="number"||typeof o=="bigint")&&We(e,""+o);break;case"onScroll":o!=null&&ve("scroll",e);break;case"onScrollEnd":o!=null&&ve("scrollend",e);break;case"onClick":o!=null&&(e.onclick=Hn);break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"innerHTML":case"ref":break;case"innerText":case"textContent":break;default:if(!co.hasOwnProperty(a))e:{if(a[0]==="o"&&a[1]==="n"&&(i=a.endsWith("Capture"),t=a.slice(2,i?a.length-7:void 0),l=e[dt]||null,l=l!=null?l[a]:null,typeof l=="function"&&e.removeEventListener(t,l,i),typeof o=="function")){typeof l!="function"&&l!==null&&(a in e?e[a]=null:e.hasAttribute(a)&&e.removeAttribute(a)),e.addEventListener(t,o,i);break e}a in e?e[a]=o:o===!0?e.setAttribute(a,""):uo(e,a,o)}}}function St(e,t,a){switch(t){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"img":ve("error",e),ve("load",e);var o=!1,i=!1,l;for(l in a)if(a.hasOwnProperty(l)){var u=a[l];if(u!=null)switch(l){case"src":o=!0;break;case"srcSet":i=!0;break;case"children":case"dangerouslySetInnerHTML":throw Error(c(137,t));default:Ge(e,t,l,u,a,null)}}i&&Ge(e,t,"srcSet",a.srcSet,a,null),o&&Ge(e,t,"src",a.src,a,null);return;case"input":ve("invalid",e);var m=l=u=i=null,E=null,R=null;for(o in a)if(a.hasOwnProperty(o)){var M=a[o];if(M!=null)switch(o){case"name":i=M;break;case"type":u=M;break;case"checked":E=M;break;case"defaultChecked":R=M;break;case"value":l=M;break;case"defaultValue":m=M;break;case"children":case"dangerouslySetInnerHTML":if(M!=null)throw Error(c(137,t));break;default:Ge(e,t,o,M,a,null)}}Y(e,l,m,E,R,u,i,!1);return;case"select":ve("invalid",e),o=u=l=null;for(i in a)if(a.hasOwnProperty(i)&&(m=a[i],m!=null))switch(i){case"value":l=m;break;case"defaultValue":u=m;break;case"multiple":o=m;default:Ge(e,t,i,m,a,null)}t=l,a=u,e.multiple=!!o,t!=null?se(e,!!o,t,!1):a!=null&&se(e,!!o,a,!0);return;case"textarea":ve("invalid",e),l=i=o=null;for(u in a)if(a.hasOwnProperty(u)&&(m=a[u],m!=null))switch(u){case"value":o=m;break;case"defaultValue":i=m;break;case"children":l=m;break;case"dangerouslySetInnerHTML":if(m!=null)throw Error(c(91));break;default:Ge(e,t,u,m,a,null)}Ze(e,o,i,l);return;case"option":for(E in a)a.hasOwnProperty(E)&&(o=a[E],o!=null)&&(E==="selected"?e.selected=o&&typeof o!="function"&&typeof o!="symbol":Ge(e,t,E,o,a,null));return;case"dialog":ve("beforetoggle",e),ve("toggle",e),ve("cancel",e),ve("close",e);break;case"iframe":case"object":ve("load",e);break;case"video":case"audio":for(o=0;o<Bi.length;o++)ve(Bi[o],e);break;case"image":ve("error",e),ve("load",e);break;case"details":ve("toggle",e);break;case"embed":case"source":case"link":ve("error",e),ve("load",e);case"area":case"base":case"br":case"col":case"hr":case"keygen":case"meta":case"param":case"track":case"wbr":case"menuitem":for(R in a)if(a.hasOwnProperty(R)&&(o=a[R],o!=null))switch(R){case"children":case"dangerouslySetInnerHTML":throw Error(c(137,t));default:Ge(e,t,R,o,a,null)}return;default:if(bn(t)){for(M in a)a.hasOwnProperty(M)&&(o=a[M],o!==void 0&&Nc(e,t,M,o,a,void 0));return}}for(m in a)a.hasOwnProperty(m)&&(o=a[m],o!=null&&Ge(e,t,m,o,a,null))}function qg(e,t,a,o){switch(t){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"input":var i=null,l=null,u=null,m=null,E=null,R=null,M=null;for(H in a){var G=a[H];if(a.hasOwnProperty(H)&&G!=null)switch(H){case"checked":break;case"value":break;case"defaultValue":E=G;default:o.hasOwnProperty(H)||Ge(e,t,H,null,o,G)}}for(var N in o){var H=o[N];if(G=a[N],o.hasOwnProperty(N)&&(H!=null||G!=null))switch(N){case"type":l=H;break;case"name":i=H;break;case"checked":R=H;break;case"defaultChecked":M=H;break;case"value":u=H;break;case"defaultValue":m=H;break;case"children":case"dangerouslySetInnerHTML":if(H!=null)throw Error(c(137,t));break;default:H!==G&&Ge(e,t,N,H,o,G)}}k(e,u,m,E,R,M,l,i);return;case"select":H=u=m=N=null;for(l in a)if(E=a[l],a.hasOwnProperty(l)&&E!=null)switch(l){case"value":break;case"multiple":H=E;default:o.hasOwnProperty(l)||Ge(e,t,l,null,o,E)}for(i in o)if(l=o[i],E=a[i],o.hasOwnProperty(i)&&(l!=null||E!=null))switch(i){case"value":N=l;break;case"defaultValue":m=l;break;case"multiple":u=l;default:l!==E&&Ge(e,t,i,l,o,E)}t=m,a=u,o=H,N!=null?se(e,!!a,N,!1):!!o!=!!a&&(t!=null?se(e,!!a,t,!0):se(e,!!a,a?[]:"",!1));return;case"textarea":H=N=null;for(m in a)if(i=a[m],a.hasOwnProperty(m)&&i!=null&&!o.hasOwnProperty(m))switch(m){case"value":break;case"children":break;default:Ge(e,t,m,null,o,i)}for(u in o)if(i=o[u],l=a[u],o.hasOwnProperty(u)&&(i!=null||l!=null))switch(u){case"value":N=i;break;case"defaultValue":H=i;break;case"children":break;case"dangerouslySetInnerHTML":if(i!=null)throw Error(c(91));break;default:i!==l&&Ge(e,t,u,i,o,l)}ye(e,N,H);return;case"option":for(var Z in a)N=a[Z],a.hasOwnProperty(Z)&&N!=null&&!o.hasOwnProperty(Z)&&(Z==="selected"?e.selected=!1:Ge(e,t,Z,null,o,N));for(E in o)N=o[E],H=a[E],o.hasOwnProperty(E)&&N!==H&&(N!=null||H!=null)&&(E==="selected"?e.selected=N&&typeof N!="function"&&typeof N!="symbol":Ge(e,t,E,N,o,H));return;case"img":case"link":case"area":case"base":case"br":case"col":case"embed":case"hr":case"keygen":case"meta":case"param":case"source":case"track":case"wbr":case"menuitem":for(var re in a)N=a[re],a.hasOwnProperty(re)&&N!=null&&!o.hasOwnProperty(re)&&Ge(e,t,re,null,o,N);for(R in o)if(N=o[R],H=a[R],o.hasOwnProperty(R)&&N!==H&&(N!=null||H!=null))switch(R){case"children":case"dangerouslySetInnerHTML":if(N!=null)throw Error(c(137,t));break;default:Ge(e,t,R,N,o,H)}return;default:if(bn(t)){for(var Be in a)N=a[Be],a.hasOwnProperty(Be)&&N!==void 0&&!o.hasOwnProperty(Be)&&Nc(e,t,Be,void 0,o,N);for(M in o)N=o[M],H=a[M],!o.hasOwnProperty(M)||N===H||N===void 0&&H===void 0||Nc(e,t,M,N,o,H);return}}for(var S in a)N=a[S],a.hasOwnProperty(S)&&N!=null&&!o.hasOwnProperty(S)&&Ge(e,t,S,null,o,N);for(G in o)N=o[G],H=a[G],!o.hasOwnProperty(G)||N===H||N==null&&H==null||Ge(e,t,G,N,o,H)}function Lp(e){switch(e){case"css":case"script":case"font":case"img":case"image":case"input":case"link":return!0;default:return!1}}function Vg(){if(typeof performance.getEntriesByType=="function"){for(var e=0,t=0,a=performance.getEntriesByType("resource"),o=0;o<a.length;o++){var i=a[o],l=i.transferSize,u=i.initiatorType,m=i.duration;if(l&&m&&Lp(u)){for(u=0,m=i.responseEnd,o+=1;o<a.length;o++){var E=a[o],R=E.startTime;if(R>m)break;var M=E.transferSize,G=E.initiatorType;M&&Lp(G)&&(E=E.responseEnd,u+=M*(E<m?1:(m-R)/(E-R)))}if(--o,t+=8*(l+u)/(i.duration/1e3),e++,10<e)break}}if(0<e)return t/e/1e6}return navigator.connection&&(e=navigator.connection.downlink,typeof e=="number")?e:5}var Ic=null,Lc=null;function ul(e){return e.nodeType===9?e:e.ownerDocument}function kp(e){switch(e){case"http://www.w3.org/2000/svg":return 1;case"http://www.w3.org/1998/Math/MathML":return 2;default:return 0}}function Cp(e,t){if(e===0)switch(t){case"svg":return 1;case"math":return 2;default:return 0}return e===1&&t==="foreignObject"?0:e}function kc(e,t){return e==="textarea"||e==="noscript"||typeof t.children=="string"||typeof t.children=="number"||typeof t.children=="bigint"||typeof t.dangerouslySetInnerHTML=="object"&&t.dangerouslySetInnerHTML!==null&&t.dangerouslySetInnerHTML.__html!=null}var Cc=null;function Kg(){var e=window.event;return e&&e.type==="popstate"?e===Cc?!1:(Cc=e,!0):(Cc=null,!1)}var Dp=typeof setTimeout=="function"?setTimeout:void 0,Xg=typeof clearTimeout=="function"?clearTimeout:void 0,Hp=typeof Promise=="function"?Promise:void 0,Zg=typeof queueMicrotask=="function"?queueMicrotask:typeof Hp<"u"?function(e){return Hp.resolve(null).then(e).catch(Qg)}:Dp;function Qg(e){setTimeout(function(){throw e})}function Aa(e){return e==="head"}function jp(e,t){var a=t,o=0;do{var i=a.nextSibling;if(e.removeChild(a),i&&i.nodeType===8)if(a=i.data,a==="/$"||a==="/&"){if(o===0){e.removeChild(i),Yo(t);return}o--}else if(a==="$"||a==="$?"||a==="$~"||a==="$!"||a==="&")o++;else if(a==="html")Pi(e.ownerDocument.documentElement);else if(a==="head"){a=e.ownerDocument.head,Pi(a);for(var l=a.firstChild;l;){var u=l.nextSibling,m=l.nodeName;l[ia]||m==="SCRIPT"||m==="STYLE"||m==="LINK"&&l.rel.toLowerCase()==="stylesheet"||a.removeChild(l),l=u}}else a==="body"&&Pi(e.ownerDocument.body);a=i}while(a);Yo(t)}function Mp(e,t){var a=e;e=0;do{var o=a.nextSibling;if(a.nodeType===1?t?(a._stashedDisplay=a.style.display,a.style.display="none"):(a.style.display=a._stashedDisplay||"",a.getAttribute("style")===""&&a.removeAttribute("style")):a.nodeType===3&&(t?(a._stashedText=a.nodeValue,a.nodeValue=""):a.nodeValue=a._stashedText||""),o&&o.nodeType===8)if(a=o.data,a==="/$"){if(e===0)break;e--}else a!=="$"&&a!=="$?"&&a!=="$~"&&a!=="$!"||e++;a=o}while(a)}function Dc(e){var t=e.firstChild;for(t&&t.nodeType===10&&(t=t.nextSibling);t;){var a=t;switch(t=t.nextSibling,a.nodeName){case"HTML":case"HEAD":case"BODY":Dc(a),$a(a);continue;case"SCRIPT":case"STYLE":continue;case"LINK":if(a.rel.toLowerCase()==="stylesheet")continue}e.removeChild(a)}}function Jg(e,t,a,o){for(;e.nodeType===1;){var i=a;if(e.nodeName.toLowerCase()!==t.toLowerCase()){if(!o&&(e.nodeName!=="INPUT"||e.type!=="hidden"))break}else if(o){if(!e[ia])switch(t){case"meta":if(!e.hasAttribute("itemprop"))break;return e;case"link":if(l=e.getAttribute("rel"),l==="stylesheet"&&e.hasAttribute("data-precedence"))break;if(l!==i.rel||e.getAttribute("href")!==(i.href==null||i.href===""?null:i.href)||e.getAttribute("crossorigin")!==(i.crossOrigin==null?null:i.crossOrigin)||e.getAttribute("title")!==(i.title==null?null:i.title))break;return e;case"style":if(e.hasAttribute("data-precedence"))break;return e;case"script":if(l=e.getAttribute("src"),(l!==(i.src==null?null:i.src)||e.getAttribute("type")!==(i.type==null?null:i.type)||e.getAttribute("crossorigin")!==(i.crossOrigin==null?null:i.crossOrigin))&&l&&e.hasAttribute("async")&&!e.hasAttribute("itemprop"))break;return e;default:return e}}else if(t==="input"&&e.type==="hidden"){var l=i.name==null?null:""+i.name;if(i.type==="hidden"&&e.getAttribute("name")===l)return e}else return e;if(e=ln(e.nextSibling),e===null)break}return null}function ey(e,t,a){if(t==="")return null;for(;e.nodeType!==3;)if((e.nodeType!==1||e.nodeName!=="INPUT"||e.type!=="hidden")&&!a||(e=ln(e.nextSibling),e===null))return null;return e}function zp(e,t){for(;e.nodeType!==8;)if((e.nodeType!==1||e.nodeName!=="INPUT"||e.type!=="hidden")&&!t||(e=ln(e.nextSibling),e===null))return null;return e}function Hc(e){return e.data==="$?"||e.data==="$~"}function jc(e){return e.data==="$!"||e.data==="$?"&&e.ownerDocument.readyState!=="loading"}function ty(e,t){var a=e.ownerDocument;if(e.data==="$~")e._reactRetry=t;else if(e.data!=="$?"||a.readyState!=="loading")t();else{var o=function(){t(),a.removeEventListener("DOMContentLoaded",o)};a.addEventListener("DOMContentLoaded",o),e._reactRetry=o}}function ln(e){for(;e!=null;e=e.nextSibling){var t=e.nodeType;if(t===1||t===3)break;if(t===8){if(t=e.data,t==="$"||t==="$!"||t==="$?"||t==="$~"||t==="&"||t==="F!"||t==="F")break;if(t==="/$"||t==="/&")return null}}return e}var Mc=null;function Up(e){e=e.nextSibling;for(var t=0;e;){if(e.nodeType===8){var a=e.data;if(a==="/$"||a==="/&"){if(t===0)return ln(e.nextSibling);t--}else a!=="$"&&a!=="$!"&&a!=="$?"&&a!=="$~"&&a!=="&"||t++}e=e.nextSibling}return null}function $p(e){e=e.previousSibling;for(var t=0;e;){if(e.nodeType===8){var a=e.data;if(a==="$"||a==="$!"||a==="$?"||a==="$~"||a==="&"){if(t===0)return e;t--}else a!=="/$"&&a!=="/&"||t++}e=e.previousSibling}return null}function Gp(e,t,a){switch(t=ul(a),e){case"html":if(e=t.documentElement,!e)throw Error(c(452));return e;case"head":if(e=t.head,!e)throw Error(c(453));return e;case"body":if(e=t.body,!e)throw Error(c(454));return e;default:throw Error(c(451))}}function Pi(e){for(var t=e.attributes;t.length;)e.removeAttributeNode(t[0]);$a(e)}var sn=new Map,Bp=new Set;function dl(e){return typeof e.getRootNode=="function"?e.getRootNode():e.nodeType===9?e:e.ownerDocument}var Zn=P.d;P.d={f:ny,r:ay,D:oy,C:iy,L:ry,m:ly,X:cy,S:sy,M:uy};function ny(){var e=Zn.f(),t=nl();return e||t}function ay(e){var t=ra(e);t!==null&&t.tag===5&&t.type==="form"?of(t):Zn.r(e)}var Bo=typeof document>"u"?null:document;function _p(e,t,a){var o=Bo;if(o&&typeof t=="string"&&t){var i=Ct(t);i='link[rel="'+e+'"][href="'+i+'"]',typeof a=="string"&&(i+='[crossorigin="'+a+'"]'),Bp.has(i)||(Bp.add(i),e={rel:e,crossOrigin:a,href:t},o.querySelector(i)===null&&(t=o.createElement("link"),St(t,"link",e),nt(t),o.head.appendChild(t)))}}function oy(e){Zn.D(e),_p("dns-prefetch",e,null)}function iy(e,t){Zn.C(e,t),_p("preconnect",e,t)}function ry(e,t,a){Zn.L(e,t,a);var o=Bo;if(o&&e&&t){var i='link[rel="preload"][as="'+Ct(t)+'"]';t==="image"&&a&&a.imageSrcSet?(i+='[imagesrcset="'+Ct(a.imageSrcSet)+'"]',typeof a.imageSizes=="string"&&(i+='[imagesizes="'+Ct(a.imageSizes)+'"]')):i+='[href="'+Ct(e)+'"]';var l=i;switch(t){case"style":l=_o(e);break;case"script":l=Po(e)}sn.has(l)||(e=z({rel:"preload",href:t==="image"&&a&&a.imageSrcSet?void 0:e,as:t},a),sn.set(l,e),o.querySelector(i)!==null||t==="style"&&o.querySelector(Yi(l))||t==="script"&&o.querySelector(Wi(l))||(t=o.createElement("link"),St(t,"link",e),nt(t),o.head.appendChild(t)))}}function ly(e,t){Zn.m(e,t);var a=Bo;if(a&&e){var o=t&&typeof t.as=="string"?t.as:"script",i='link[rel="modulepreload"][as="'+Ct(o)+'"][href="'+Ct(e)+'"]',l=i;switch(o){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":l=Po(e)}if(!sn.has(l)&&(e=z({rel:"modulepreload",href:e},t),sn.set(l,e),a.querySelector(i)===null)){switch(o){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":if(a.querySelector(Wi(l)))return}o=a.createElement("link"),St(o,"link",e),nt(o),a.head.appendChild(o)}}}function sy(e,t,a){Zn.S(e,t,a);var o=Bo;if(o&&e){var i=la(o).hoistableStyles,l=_o(e);t=t||"default";var u=i.get(l);if(!u){var m={loading:0,preload:null};if(u=o.querySelector(Yi(l)))m.loading=5;else{e=z({rel:"stylesheet",href:e,"data-precedence":t},a),(a=sn.get(l))&&zc(e,a);var E=u=o.createElement("link");nt(E),St(E,"link",e),E._p=new Promise(function(R,M){E.onload=R,E.onerror=M}),E.addEventListener("load",function(){m.loading|=1}),E.addEventListener("error",function(){m.loading|=2}),m.loading|=4,fl(u,t,o)}u={type:"stylesheet",instance:u,count:1,state:m},i.set(l,u)}}}function cy(e,t){Zn.X(e,t);var a=Bo;if(a&&e){var o=la(a).hoistableScripts,i=Po(e),l=o.get(i);l||(l=a.querySelector(Wi(i)),l||(e=z({src:e,async:!0},t),(t=sn.get(i))&&Uc(e,t),l=a.createElement("script"),nt(l),St(l,"link",e),a.head.appendChild(l)),l={type:"script",instance:l,count:1,state:null},o.set(i,l))}}function uy(e,t){Zn.M(e,t);var a=Bo;if(a&&e){var o=la(a).hoistableScripts,i=Po(e),l=o.get(i);l||(l=a.querySelector(Wi(i)),l||(e=z({src:e,async:!0,type:"module"},t),(t=sn.get(i))&&Uc(e,t),l=a.createElement("script"),nt(l),St(l,"link",e),a.head.appendChild(l)),l={type:"script",instance:l,count:1,state:null},o.set(i,l))}}function Pp(e,t,a,o){var i=(i=X.current)?dl(i):null;if(!i)throw Error(c(446));switch(e){case"meta":case"title":return null;case"style":return typeof a.precedence=="string"&&typeof a.href=="string"?(t=_o(a.href),a=la(i).hoistableStyles,o=a.get(t),o||(o={type:"style",instance:null,count:0,state:null},a.set(t,o)),o):{type:"void",instance:null,count:0,state:null};case"link":if(a.rel==="stylesheet"&&typeof a.href=="string"&&typeof a.precedence=="string"){e=_o(a.href);var l=la(i).hoistableStyles,u=l.get(e);if(u||(i=i.ownerDocument||i,u={type:"stylesheet",instance:null,count:0,state:{loading:0,preload:null}},l.set(e,u),(l=i.querySelector(Yi(e)))&&!l._p&&(u.instance=l,u.state.loading=5),sn.has(e)||(a={rel:"preload",as:"style",href:a.href,crossOrigin:a.crossOrigin,integrity:a.integrity,media:a.media,hrefLang:a.hrefLang,referrerPolicy:a.referrerPolicy},sn.set(e,a),l||dy(i,e,a,u.state))),t&&o===null)throw Error(c(528,""));return u}if(t&&o!==null)throw Error(c(529,""));return null;case"script":return t=a.async,a=a.src,typeof a=="string"&&t&&typeof t!="function"&&typeof t!="symbol"?(t=Po(a),a=la(i).hoistableScripts,o=a.get(t),o||(o={type:"script",instance:null,count:0,state:null},a.set(t,o)),o):{type:"void",instance:null,count:0,state:null};default:throw Error(c(444,e))}}function _o(e){return'href="'+Ct(e)+'"'}function Yi(e){return'link[rel="stylesheet"]['+e+"]"}function Yp(e){return z({},e,{"data-precedence":e.precedence,precedence:null})}function dy(e,t,a,o){e.querySelector('link[rel="preload"][as="style"]['+t+"]")?o.loading=1:(t=e.createElement("link"),o.preload=t,t.addEventListener("load",function(){return o.loading|=1}),t.addEventListener("error",function(){return o.loading|=2}),St(t,"link",a),nt(t),e.head.appendChild(t))}function Po(e){return'[src="'+Ct(e)+'"]'}function Wi(e){return"script[async]"+e}function Wp(e,t,a){if(t.count++,t.instance===null)switch(t.type){case"style":var o=e.querySelector('style[data-href~="'+Ct(a.href)+'"]');if(o)return t.instance=o,nt(o),o;var i=z({},a,{"data-href":a.href,"data-precedence":a.precedence,href:null,precedence:null});return o=(e.ownerDocument||e).createElement("style"),nt(o),St(o,"style",i),fl(o,a.precedence,e),t.instance=o;case"stylesheet":i=_o(a.href);var l=e.querySelector(Yi(i));if(l)return t.state.loading|=4,t.instance=l,nt(l),l;o=Yp(a),(i=sn.get(i))&&zc(o,i),l=(e.ownerDocument||e).createElement("link"),nt(l);var u=l;return u._p=new Promise(function(m,E){u.onload=m,u.onerror=E}),St(l,"link",o),t.state.loading|=4,fl(l,a.precedence,e),t.instance=l;case"script":return l=Po(a.src),(i=e.querySelector(Wi(l)))?(t.instance=i,nt(i),i):(o=a,(i=sn.get(l))&&(o=z({},a),Uc(o,i)),e=e.ownerDocument||e,i=e.createElement("script"),nt(i),St(i,"link",o),e.head.appendChild(i),t.instance=i);case"void":return null;default:throw Error(c(443,t.type))}else t.type==="stylesheet"&&(t.state.loading&4)===0&&(o=t.instance,t.state.loading|=4,fl(o,a.precedence,e));return t.instance}function fl(e,t,a){for(var o=a.querySelectorAll('link[rel="stylesheet"][data-precedence],style[data-precedence]'),i=o.length?o[o.length-1]:null,l=i,u=0;u<o.length;u++){var m=o[u];if(m.dataset.precedence===t)l=m;else if(l!==i)break}l?l.parentNode.insertBefore(e,l.nextSibling):(t=a.nodeType===9?a.head:a,t.insertBefore(e,t.firstChild))}function zc(e,t){e.crossOrigin==null&&(e.crossOrigin=t.crossOrigin),e.referrerPolicy==null&&(e.referrerPolicy=t.referrerPolicy),e.title==null&&(e.title=t.title)}function Uc(e,t){e.crossOrigin==null&&(e.crossOrigin=t.crossOrigin),e.referrerPolicy==null&&(e.referrerPolicy=t.referrerPolicy),e.integrity==null&&(e.integrity=t.integrity)}var pl=null;function qp(e,t,a){if(pl===null){var o=new Map,i=pl=new Map;i.set(a,o)}else i=pl,o=i.get(a),o||(o=new Map,i.set(a,o));if(o.has(e))return o;for(o.set(e,null),a=a.getElementsByTagName(e),i=0;i<a.length;i++){var l=a[i];if(!(l[ia]||l[ut]||e==="link"&&l.getAttribute("rel")==="stylesheet")&&l.namespaceURI!=="http://www.w3.org/2000/svg"){var u=l.getAttribute(t)||"";u=e+u;var m=o.get(u);m?m.push(l):o.set(u,[l])}}return o}function Vp(e,t,a){e=e.ownerDocument||e,e.head.insertBefore(a,t==="title"?e.querySelector("head > title"):null)}function fy(e,t,a){if(a===1||t.itemProp!=null)return!1;switch(e){case"meta":case"title":return!0;case"style":if(typeof t.precedence!="string"||typeof t.href!="string"||t.href==="")break;return!0;case"link":if(typeof t.rel!="string"||typeof t.href!="string"||t.href===""||t.onLoad||t.onError)break;return t.rel==="stylesheet"?(e=t.disabled,typeof t.precedence=="string"&&e==null):!0;case"script":if(t.async&&typeof t.async!="function"&&typeof t.async!="symbol"&&!t.onLoad&&!t.onError&&t.src&&typeof t.src=="string")return!0}return!1}function Kp(e){return!(e.type==="stylesheet"&&(e.state.loading&3)===0)}function py(e,t,a,o){if(a.type==="stylesheet"&&(typeof o.media!="string"||matchMedia(o.media).matches!==!1)&&(a.state.loading&4)===0){if(a.instance===null){var i=_o(o.href),l=t.querySelector(Yi(i));if(l){t=l._p,t!==null&&typeof t=="object"&&typeof t.then=="function"&&(e.count++,e=hl.bind(e),t.then(e,e)),a.state.loading|=4,a.instance=l,nt(l);return}l=t.ownerDocument||t,o=Yp(o),(i=sn.get(i))&&zc(o,i),l=l.createElement("link"),nt(l);var u=l;u._p=new Promise(function(m,E){u.onload=m,u.onerror=E}),St(l,"link",o),a.instance=l}e.stylesheets===null&&(e.stylesheets=new Map),e.stylesheets.set(a,t),(t=a.state.preload)&&(a.state.loading&3)===0&&(e.count++,a=hl.bind(e),t.addEventListener("load",a),t.addEventListener("error",a))}}var $c=0;function hy(e,t){return e.stylesheets&&e.count===0&&gl(e,e.stylesheets),0<e.count||0<e.imgCount?function(a){var o=setTimeout(function(){if(e.stylesheets&&gl(e,e.stylesheets),e.unsuspend){var l=e.unsuspend;e.unsuspend=null,l()}},6e4+t);0<e.imgBytes&&$c===0&&($c=62500*Vg());var i=setTimeout(function(){if(e.waitingForImages=!1,e.count===0&&(e.stylesheets&&gl(e,e.stylesheets),e.unsuspend)){var l=e.unsuspend;e.unsuspend=null,l()}},(e.imgBytes>$c?50:800)+t);return e.unsuspend=a,function(){e.unsuspend=null,clearTimeout(o),clearTimeout(i)}}:null}function hl(){if(this.count--,this.count===0&&(this.imgCount===0||!this.waitingForImages)){if(this.stylesheets)gl(this,this.stylesheets);else if(this.unsuspend){var e=this.unsuspend;this.unsuspend=null,e()}}}var ml=null;function gl(e,t){e.stylesheets=null,e.unsuspend!==null&&(e.count++,ml=new Map,t.forEach(my,e),ml=null,hl.call(e))}function my(e,t){if(!(t.state.loading&4)){var a=ml.get(e);if(a)var o=a.get(null);else{a=new Map,ml.set(e,a);for(var i=e.querySelectorAll("link[data-precedence],style[data-precedence]"),l=0;l<i.length;l++){var u=i[l];(u.nodeName==="LINK"||u.getAttribute("media")!=="not all")&&(a.set(u.dataset.precedence,u),o=u)}o&&a.set(null,o)}i=t.instance,u=i.getAttribute("data-precedence"),l=a.get(u)||o,l===o&&a.set(null,i),a.set(u,i),this.count++,o=hl.bind(this),i.addEventListener("load",o),i.addEventListener("error",o),l?l.parentNode.insertBefore(i,l.nextSibling):(e=e.nodeType===9?e.head:e,e.insertBefore(i,e.firstChild)),t.state.loading|=4}}var qi={$$typeof:B,Provider:null,Consumer:null,_currentValue:ee,_currentValue2:ee,_threadCount:0};function gy(e,t,a,o,i,l,u,m,E){this.tag=1,this.containerInfo=e,this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.next=this.pendingContext=this.context=this.cancelPendingCommit=null,this.callbackPriority=0,this.expirationTimes=Ma(-1),this.entangledLanes=this.shellSuspendCounter=this.errorRecoveryDisabledLanes=this.expiredLanes=this.warmLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=Ma(0),this.hiddenUpdates=Ma(null),this.identifierPrefix=o,this.onUncaughtError=i,this.onCaughtError=l,this.onRecoverableError=u,this.pooledCache=null,this.pooledCacheLanes=0,this.formState=E,this.incompleteTransitions=new Map}function Xp(e,t,a,o,i,l,u,m,E,R,M,G){return e=new gy(e,t,a,u,E,R,M,G,m),t=1,l===!0&&(t|=24),l=_t(3,null,null,t),e.current=l,l.stateNode=e,t=Ts(),t.refCount++,e.pooledCache=t,t.refCount++,l.memoizedState={element:o,isDehydrated:a,cache:t},Ss(l),e}function Zp(e){return e?(e=vo,e):vo}function Qp(e,t,a,o,i,l){i=Zp(i),o.context===null?o.context=i:o.pendingContext=i,o=ma(t),o.payload={element:a},l=l===void 0?null:l,l!==null&&(o.callback=l),a=ga(e,o,t),a!==null&&($t(a,e,t),xi(a,e,t))}function Jp(e,t){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var a=e.retryLane;e.retryLane=a!==0&&a<t?a:t}}function Gc(e,t){Jp(e,t),(e=e.alternate)&&Jp(e,t)}function eh(e){if(e.tag===13||e.tag===31){var t=Ya(e,67108864);t!==null&&$t(t,e,67108864),Gc(e,67108864)}}function th(e){if(e.tag===13||e.tag===31){var t=Vt();t=so(t);var a=Ya(e,t);a!==null&&$t(a,e,t),Gc(e,t)}}var yl=!0;function yy(e,t,a,o){var i=D.T;D.T=null;var l=P.p;try{P.p=2,Bc(e,t,a,o)}finally{P.p=l,D.T=i}}function by(e,t,a,o){var i=D.T;D.T=null;var l=P.p;try{P.p=8,Bc(e,t,a,o)}finally{P.p=l,D.T=i}}function Bc(e,t,a,o){if(yl){var i=_c(o);if(i===null)Rc(e,t,o,bl,a),ah(e,o);else if(Ey(i,e,t,a,o))o.stopPropagation();else if(ah(e,o),t&4&&-1<Ty.indexOf(e)){for(;i!==null;){var l=ra(i);if(l!==null)switch(l.tag){case 3:if(l=l.stateNode,l.current.memoizedState.isDehydrated){var u=pn(l.pendingLanes);if(u!==0){var m=l;for(m.pendingLanes|=2,m.entangledLanes|=2;u;){var E=1<<31-Tt(u);m.entanglements[1]|=E,u&=~E}Nn(l),(He&6)===0&&(el=Ie()+500,Gi(0))}}break;case 31:case 13:m=Ya(l,2),m!==null&&$t(m,l,2),nl(),Gc(l,2)}if(l=_c(o),l===null&&Rc(e,t,o,bl,a),l===i)break;i=l}i!==null&&o.stopPropagation()}else Rc(e,t,o,null,a)}}function _c(e){return e=Yl(e),Pc(e)}var bl=null;function Pc(e){if(bl=null,e=gn(e),e!==null){var t=f(e);if(t===null)e=null;else{var a=t.tag;if(a===13){if(e=h(t),e!==null)return e;e=null}else if(a===31){if(e=y(t),e!==null)return e;e=null}else if(a===3){if(t.stateNode.current.memoizedState.isDehydrated)return t.tag===3?t.stateNode.containerInfo:null;e=null}else t!==e&&(e=null)}}return bl=e,null}function nh(e){switch(e){case"beforetoggle":case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"toggle":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 2;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 8;case"message":switch(Re()){case Lt:return 2;case dn:return 8;case je:case Qt:return 32;case Ha:return 268435456;default:return 32}default:return 32}}var Yc=!1,Fa=null,Ra=null,Na=null,Vi=new Map,Ki=new Map,Ia=[],Ty="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");function ah(e,t){switch(e){case"focusin":case"focusout":Fa=null;break;case"dragenter":case"dragleave":Ra=null;break;case"mouseover":case"mouseout":Na=null;break;case"pointerover":case"pointerout":Vi.delete(t.pointerId);break;case"gotpointercapture":case"lostpointercapture":Ki.delete(t.pointerId)}}function Xi(e,t,a,o,i,l){return e===null||e.nativeEvent!==l?(e={blockedOn:t,domEventName:a,eventSystemFlags:o,nativeEvent:l,targetContainers:[i]},t!==null&&(t=ra(t),t!==null&&eh(t)),e):(e.eventSystemFlags|=o,t=e.targetContainers,i!==null&&t.indexOf(i)===-1&&t.push(i),e)}function Ey(e,t,a,o,i){switch(t){case"focusin":return Fa=Xi(Fa,e,t,a,o,i),!0;case"dragenter":return Ra=Xi(Ra,e,t,a,o,i),!0;case"mouseover":return Na=Xi(Na,e,t,a,o,i),!0;case"pointerover":var l=i.pointerId;return Vi.set(l,Xi(Vi.get(l)||null,e,t,a,o,i)),!0;case"gotpointercapture":return l=i.pointerId,Ki.set(l,Xi(Ki.get(l)||null,e,t,a,o,i)),!0}return!1}function oh(e){var t=gn(e.target);if(t!==null){var a=f(t);if(a!==null){if(t=a.tag,t===13){if(t=h(a),t!==null){e.blockedOn=t,ai(e.priority,function(){th(a)});return}}else if(t===31){if(t=y(a),t!==null){e.blockedOn=t,ai(e.priority,function(){th(a)});return}}else if(t===3&&a.stateNode.current.memoizedState.isDehydrated){e.blockedOn=a.tag===3?a.stateNode.containerInfo:null;return}}}e.blockedOn=null}function Tl(e){if(e.blockedOn!==null)return!1;for(var t=e.targetContainers;0<t.length;){var a=_c(e.nativeEvent);if(a===null){a=e.nativeEvent;var o=new a.constructor(a.type,a);Pl=o,a.target.dispatchEvent(o),Pl=null}else return t=ra(a),t!==null&&eh(t),e.blockedOn=a,!1;t.shift()}return!0}function ih(e,t,a){Tl(e)&&a.delete(t)}function vy(){Yc=!1,Fa!==null&&Tl(Fa)&&(Fa=null),Ra!==null&&Tl(Ra)&&(Ra=null),Na!==null&&Tl(Na)&&(Na=null),Vi.forEach(ih),Ki.forEach(ih)}function El(e,t){e.blockedOn===t&&(e.blockedOn=null,Yc||(Yc=!0,n.unstable_scheduleCallback(n.unstable_NormalPriority,vy)))}var vl=null;function rh(e){vl!==e&&(vl=e,n.unstable_scheduleCallback(n.unstable_NormalPriority,function(){vl===e&&(vl=null);for(var t=0;t<e.length;t+=3){var a=e[t],o=e[t+1],i=e[t+2];if(typeof o!="function"){if(Pc(o||a)===null)continue;break}var l=ra(a);l!==null&&(e.splice(t,3),t-=3,_s(l,{pending:!0,data:i,method:a.method,action:o},o,i))}}))}function Yo(e){function t(E){return El(E,e)}Fa!==null&&El(Fa,e),Ra!==null&&El(Ra,e),Na!==null&&El(Na,e),Vi.forEach(t),Ki.forEach(t);for(var a=0;a<Ia.length;a++){var o=Ia[a];o.blockedOn===e&&(o.blockedOn=null)}for(;0<Ia.length&&(a=Ia[0],a.blockedOn===null);)oh(a),a.blockedOn===null&&Ia.shift();if(a=(e.ownerDocument||e).$$reactFormReplay,a!=null)for(o=0;o<a.length;o+=3){var i=a[o],l=a[o+1],u=i[dt]||null;if(typeof l=="function")u||rh(a);else if(u){var m=null;if(l&&l.hasAttribute("formAction")){if(i=l,u=l[dt]||null)m=u.formAction;else if(Pc(i)!==null)continue}else m=u.action;typeof m=="function"?a[o+1]=m:(a.splice(o,3),o-=3),rh(a)}}}function lh(){function e(l){l.canIntercept&&l.info==="react-transition"&&l.intercept({handler:function(){return new Promise(function(u){return i=u})},focusReset:"manual",scroll:"manual"})}function t(){i!==null&&(i(),i=null),o||setTimeout(a,20)}function a(){if(!o&&!navigation.transition){var l=navigation.currentEntry;l&&l.url!=null&&navigation.navigate(l.url,{state:l.getState(),info:"react-transition",history:"replace"})}}if(typeof navigation=="object"){var o=!1,i=null;return navigation.addEventListener("navigate",e),navigation.addEventListener("navigatesuccess",t),navigation.addEventListener("navigateerror",t),setTimeout(a,100),function(){o=!0,navigation.removeEventListener("navigate",e),navigation.removeEventListener("navigatesuccess",t),navigation.removeEventListener("navigateerror",t),i!==null&&(i(),i=null)}}}function Wc(e){this._internalRoot=e}Ol.prototype.render=Wc.prototype.render=function(e){var t=this._internalRoot;if(t===null)throw Error(c(409));var a=t.current,o=Vt();Qp(a,o,e,t,null,null)},Ol.prototype.unmount=Wc.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var t=e.containerInfo;Qp(e.current,2,null,e,null,null),nl(),t[oa]=null}};function Ol(e){this._internalRoot=e}Ol.prototype.unstable_scheduleHydration=function(e){if(e){var t=ni();e={blockedOn:null,target:e,priority:t};for(var a=0;a<Ia.length&&t!==0&&t<Ia[a].priority;a++);Ia.splice(a,0,e),a===0&&oh(e)}};var sh=r.version;if(sh!=="19.2.8")throw Error(c(527,sh,"19.2.8"));P.findDOMNode=function(e){var t=e._reactInternals;if(t===void 0)throw typeof e.render=="function"?Error(c(188)):(e=Object.keys(e).join(","),Error(c(268,e)));return e=b(t),e=e!==null?L(e):null,e=e===null?null:e.stateNode,e};var Oy={bundleType:0,version:"19.2.8",rendererPackageName:"react-dom",currentDispatcherRef:D,reconcilerVersion:"19.2.8"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var Sl=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!Sl.isDisabled&&Sl.supportsFiber)try{ct=Sl.inject(Oy),Nt=Sl}catch{}}return Qi.createRoot=function(e,t){if(!d(e))throw Error(c(299));var a=!1,o="",i=mf,l=gf,u=yf;return t!=null&&(t.unstable_strictMode===!0&&(a=!0),t.identifierPrefix!==void 0&&(o=t.identifierPrefix),t.onUncaughtError!==void 0&&(i=t.onUncaughtError),t.onCaughtError!==void 0&&(l=t.onCaughtError),t.onRecoverableError!==void 0&&(u=t.onRecoverableError)),t=Xp(e,1,!1,null,null,a,o,null,i,l,u,lh),e[oa]=t.current,Fc(e),new Wc(t)},Qi.hydrateRoot=function(e,t,a){if(!d(e))throw Error(c(299));var o=!1,i="",l=mf,u=gf,m=yf,E=null;return a!=null&&(a.unstable_strictMode===!0&&(o=!0),a.identifierPrefix!==void 0&&(i=a.identifierPrefix),a.onUncaughtError!==void 0&&(l=a.onUncaughtError),a.onCaughtError!==void 0&&(u=a.onCaughtError),a.onRecoverableError!==void 0&&(m=a.onRecoverableError),a.formState!==void 0&&(E=a.formState)),t=Xp(e,1,!0,t,a??null,o,i,E,l,u,m,lh),t.context=Zp(null),a=t.current,o=Vt(),o=so(o),i=ma(o),i.callback=null,ga(a,i,o),a=o,t.current.lanes=a,Dn(t,a),Nn(t),e[oa]=t.current,Fc(e),new Ol(t)},Qi.version="19.2.8",Qi}var bh;function ky(){if(bh)return Kc.exports;bh=1;function n(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n)}catch(r){console.error(r)}}return n(),Kc.exports=Ly(),Kc.exports}var Cy=ky();function Kt(n){return Object.freeze(n.trim().split(/\s+/))}const Dy=Object.freeze({text:Kt(`
    base64-encode base64-decode base32-encode base32-decode url-encode url-decode html-encode html-decode hex-encode hex-decode binary-encode binary-decode unicode-escape unicode-unescape rot13 morse-encode morse-decode html-to-text text-to-nato hash-identify atbash encoding-detect caesar-cipher hex-to-rgb-batch text-to-phonetic vigenere ascii-table text-dedupe text-sort-lines number-lines unicode-styled soundex word-wrap-smart nato-alphabet pig-latin readability-score text-diff-inline acronym-gen text-sentence-ops text-center markdown-toc text-extract-quotes text-summarize text-char-frequency text-find-replace lorem-words haiku-checker spongecase text-anagram-finder text-password-phrase word-cloud-text morse-advanced text-braille phonetic-alphabet text-reverse-cipher
  `),qr:Kt("text-to-qr qr-to-text"),image:Kt("image-to-base64 base64-to-image file-to-base64"),hash:Kt("sha1 sha256 sha384 sha512 sha224 all-hashes"),crypto:Kt("file-sha256 file-sha512 random-password random-hex random-base64 random-uuid-bulk text-hash-all checksum-all hash-compare hmac-gen xor-cipher crc32-calc adler32-calc"),data:Kt(`
    json-prettify json-minify json-escape json-unescape csv-to-json tsv-to-json json-to-tsv env-to-json json-to-markdown-table markdown-table-to-json ini-to-json json-to-ini ndjson-to-json json-to-ndjson properties-to-json json-to-properties json-merge csv-stats json-pick csv-transpose jsonl-to-json csv-sort json-group-by json-count tsv-csv-convert json-to-sql csv-to-html json-to-csv-advanced csv-filter data-url-converter yaml-to-env csv-stats-summary json-to-zod msgpack-preview graphql-schema json-to-prisma protobuf-gen markdown-to-json json-normalize avro-schema har-to-curl openapi-gen
  `),web:Kt(`
    text-diff xml-to-json regex-tester css-minify html-minify js-minify js-prettify url-parser cron-parser json-to-querystring querystring-to-json json-to-yaml yaml-to-json json-to-xml html-prettify css-prettify toml-to-json json-validate html-to-jsx json-to-toml svg-optimize css-vars-extract tailwind-to-css json-sort-keys htaccess-gen markdown-table-format word-frequency reading-time user-agent-parse json-to-csv csv-to-json-array markdown-link-extract html-entity-ref json-to-env endian-swap json-to-graphql unicode-lookup text-encoding-view json-to-python json-to-php json-to-typescript sql-format sql-minify json-path csv-to-html-table html-to-markdown base64url-encode base64url-decode backslash-escape backslash-unescape punycode-encode punycode-decode number-words markdown-to-html json-schema-validate epoch-batch semver-compare url-parse url-builder data-uri ipv6-expand ipv6-compress md-table-to-csv csv-to-md-table curl-builder curl-to-fetch text-dedup line-sort line-number xml-format xml-minify column-align text-wrap placeholder-image css-unit slug-gen case-detect json-diff css-gradient css-shadow dotenv-validate emoji-lookup text-to-emoji regex-escape regex-unescape timezone-convert unix-perm docker-run-gen gitignore-gen json-to-go json-to-rust md-link-check text-pad html-table-to-csv json-to-kotlin json-to-java json-schema-gen duration-format sql-insert-to-json text-reverse-words string-multiply anagram-check json-to-csharp json-to-swift bit-calculator css-specificity uuid-validate css-animation-gen openapi-summary har-parse matrix-ops text-normalize unit-prefix http-headers-parse semver-parse json-pointer color-contrast-ratio text-inflect yaml-to-toml json-to-table git-log-parse sql-to-json-schema markdown-escape ip-range json-to-form-data css-to-js-obj ts-type-gen mime-lookup open-graph-meta http-status-lookup cors-headers cookie-parser csp-generator nginx-location-gen fetch-to-axios webpack-import-gen dockerfile-gen api-mock-gen regex-to-code env-validator http-header-gen sql-schema-gen json-diff-compare github-actions-gen robots-txt-gen schema-org-gen docker-compose-gen package-json-gen git-commit-lint
  `),number:Kt(`
    dec-to-hex hex-to-dec dec-to-bin bin-to-dec dec-to-oct oct-to-dec dec-to-roman roman-to-dec number-base bytes-format scientific-notation fraction-decimal prime-check fibonacci gcd-lcm collatz integer-overflow number-sequence modular-arithmetic prime-factorization digit-ops fibonacci-gen ieee754 pascal-triangle binary-arithmetic statistics-calc roman-numeral-convert bitwise-ops matrix-2x2 unit-fraction quadratic-solver complex-number trig-calc log-calc prime-sieve mod-arith-advanced sequence-gen percentage-solver combinatorics number-properties base-arithmetic continued-fraction interest-calc number-curiosities
  `),color:Kt(`
    color-convert color-palette color-contrast color-blindness color-shades color-gradient oklch-convert color-mix css-custom-props color-temperature color-tints-shades color-harmonies color-lighten-darken color-random color-extract css-to-color-vars color-wcag-audit color-to-tailwind color-from-image color-css-variables color-mix-calculator color-luminance
  `),utility:Kt(`
    timestamp-to-date date-to-timestamp uuid-generate jwt-decode lorem-ipsum char-count case-convert reverse-text sort-lines dedupe-lines line-numbers shuffle-lines trim-lines remove-empty-lines wrap-lines extract-emails extract-urls extract-numbers slugify string-escape string-unescape number-format csv-to-markdown markdown-to-csv epoch-now list-to-json json-to-list ip-to-decimal decimal-to-ip markdown-preview epoch-convert placeholder-img css-units aspect-ratio docker-run-to-compose regex-replace base-convert jwt-create number-to-words date-diff text-frequency json-path-extract text-to-nato-table cidr-calc named-colors rot-n number-base-table lorem-sentences fake-data ip-info crontab-gen chmod-calc text-stats string-reverse nato-converter wcag-contrast json-flatten json-unflatten color-scheme unicode-inspector ascii-art typescript-gen http-status password-strength luhn-check num-stats morse-code css-clamp percentage-calc loan-calc bmi-calc password-entropy tls-cert-info xpath-tester color-mix-ratio timezone-list email-address-parse text-columns compound-interest isbn-validate age-calc tip-calc aspect-ratio-exact pace-calc ppi-calc levenshtein discount-calc grade-calc fuel-cost recipe-scale paint-calc mortgage-calc time-between loan-amortization calories-burned screen-size-calc water-intake wind-chill retirement-calc tax-bracket speed-distance-time ohms-law number-system-table body-fat-calc electricity-cost ideal-weight blood-pressure unit-price-compare inflation-calc heart-rate-zones running-pace savings-goal timezone-offset recipe-nutrition fuel-calc sleep-cycle dna-calc date-calculator event-countdown
  `),imageFormat:Kt(`
    png-to-jpg jpg-to-png png-to-webp jpg-to-webp webp-to-png webp-to-jpg bmp-to-png any-to-png any-to-jpg any-to-webp image-resize image-compress svg-to-png image-rotate image-flip-h image-flip-v image-grayscale image-invert image-crop-square image-sepia image-brightness image-contrast
  `),media:Kt(`
    video-to-audio video-to-wav audio-to-mp3 audio-to-wav audio-to-ogg video-to-mp4 video-to-webm video-to-gif audio-to-aac audio-to-flac video-to-audio-ogg audio-to-m4a video-trim audio-trim
  `),pdf:Kt(`
    images-to-pdf merge-pdf pdf-page-count pdf-split pdf-extract-range text-to-pdf pdf-metadata pdf-rotate
  `)}),Hy=Object.freeze([Object.freeze({id:"all",name:"All"}),Object.freeze({id:"encode",name:"Encode / Decode"}),Object.freeze({id:"hash",name:"Hash"}),Object.freeze({id:"data",name:"Data"}),Object.freeze({id:"web",name:"Web"}),Object.freeze({id:"number",name:"Number"}),Object.freeze({id:"color",name:"Color"}),Object.freeze({id:"utility",name:"Utility"}),Object.freeze({id:"image",name:"Image"}),Object.freeze({id:"media",name:"Media"}),Object.freeze({id:"document",name:"Document"})]);function Ji(n){const r=n.split(`
`),s={};let c=null;for(const d of r){const f=d.trimEnd();if(!f||f.startsWith("#"))continue;const h=f.match(/^(\s*)- (.*)$/);if(h){c&&!Array.isArray(s[c])&&(s[c]=[]),c&&s[c].push(Th(h[2]));continue}const y=f.match(/^(\s*)([^:]+):\s*(.*)$/);if(y){const g=y[2].trim(),b=y[3].trim();c=g,b?s[g]=Th(b):s[g]={}}}return JSON.stringify(s,null,2)}function Th(n){return n==="true"||n==="True"?!0:n==="false"||n==="False"?!1:n==="null"||n==="Null"||n==="~"?null:/^-?\d+$/.test(n)?parseInt(n,10):/^-?\d+\.\d+$/.test(n)?parseFloat(n):n.startsWith('"')&&n.endsWith('"')||n.startsWith("'")&&n.endsWith("'")?n.slice(1,-1):n}function kn(n,r){const s="  ".repeat(r);if(n===null)return"null";if(typeof n=="boolean"||typeof n=="number")return String(n);if(typeof n=="string")return n.includes(`
`)||n.includes(":")||n.includes("#")?`"${n.replace(/"/g,'\\"')}"`:n;if(Array.isArray(n))return n.length===0?"[]":n.map(c=>{if(typeof c=="object"&&c!==null){const d=kn(c,r+1),f=d.split(`
`)[0],h=d.split(`
`).slice(1).map(y=>s+"  "+y).join(`
`);return`${s}- ${f}${h?`
`+h:""}`}return`${s}- ${kn(c,r+1)}`}).join(`
`);if(typeof n=="object"){const c=Object.entries(n);return c.length===0?"{}":c.map(([d,f])=>typeof f=="object"&&f!==null?`${s}${d}:
${kn(f,r+1)}`:`${s}${d}: ${kn(f,r+1)}`).join(`
`)}return String(n)}function wl(n){const r={};let s=r;for(const c of n.split(`
`)){const d=c.trim();if(!d||d.startsWith("#"))continue;const f=d.match(/^\[([^\]]+)\]$/);if(f){const y=f[1].split(".");s=r;for(const g of y)s[g]||(s[g]={}),s=s[g];continue}const h=d.match(/^([^=]+)=\s*(.+)$/);if(h){const y=h[1].trim();let g=h[2].trim();if(g==="true")s[y]=!0;else if(g==="false")s[y]=!1;else if(/^-?\d+$/.test(g))s[y]=parseInt(g);else if(/^-?\d+\.\d+$/.test(g))s[y]=parseFloat(g);else if(g.startsWith('"')&&g.endsWith('"')||g.startsWith("'")&&g.endsWith("'"))s[y]=g.slice(1,-1);else if(g.startsWith("[")&&g.endsWith("]"))try{s[y]=JSON.parse(g)}catch{s[y]=g}else s[y]=g}}return r}function nr(n){const r=String(n||"").trim().match(/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i);if(!r)return null;const s=r[1],c=s.length===3?s.split("").map(f=>f+f).join(""):s,d=parseInt(c,16);return{r:d>>16&255,g:d>>8&255,b:d&255}}function xl({r:n,g:r,b:s}){n/=255,r/=255,s/=255;const c=Math.max(n,r,s),d=Math.min(n,r,s),f=(c+d)/2;if(c===d)return{h:0,s:0,l:Math.round(f*100)};const h=c-d,y=f>.5?h/(2-c-d):h/(c+d);let g;return c===n?g=((r-s)/h+(r<s?6:0))/6:c===r?g=((s-n)/h+2)/6:g=((n-r)/h+4)/6,{h:Math.round(g*360),s:Math.round(y*100),l:Math.round(f*100)}}function Ko({h:n,s:r,l:s}){if(n/=360,r/=100,s/=100,r===0){const h=Math.round(s*255);return{r:h,g:h,b:h}}const c=(h,y,g)=>(g<0&&(g+=1),g>1&&(g-=1),g<1/6?h+(y-h)*6*g:g<1/2?y:g<2/3?h+(y-h)*(2/3-g)*6:h),d=s<.5?s*(1+r):s+r-s*r,f=2*s-d;return{r:Math.round(c(f,d,n+1/3)*255),g:Math.round(c(f,d,n)*255),b:Math.round(c(f,d,n-1/3)*255)}}function Dl({r:n,g:r,b:s}){return"#"+[n,r,s].map(c=>c.toString(16).padStart(2,"0")).join("")}function Xo(n){const r=String(n||"").trim(),s=r.match(/^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i)||r.match(/^rgb\(\s*(\d+)\s+(\d+)\s+(\d+)\s*\)$/i);if(!s)return null;const c={r:+s[1],g:+s[2],b:+s[3]};return[c.r,c.g,c.b].every(d=>d>=0&&d<=255)?c:null}function Zo(n){const r=String(n||"").trim(),s=r.match(/^hsl\(\s*(\d+)\s*,\s*(\d+)\s*%\s*,\s*(\d+)\s*%\s*\)$/i)||r.match(/^hsl\(\s*(\d+)\s+(\d+)\s*%\s+(\d+)\s*%\s*\)$/i);if(!s)return null;const c={h:+s[1],s:+s[2],l:+s[3]};return c.h<=360&&c.s<=100&&c.l<=100?c:null}function Al({r:n,g:r,b:s}){n/=255,r/=255,s/=255;const c=Math.max(n,r,s),d=Math.min(n,r,s),f=c-d;let h=0;return f!==0&&(c===n?h=((r-s)/f+(r<s?6:0))/6:c===r?h=((s-n)/f+2)/6:h=((n-r)/f+4)/6),{h:Math.round(h*360),s:Math.round((c===0?0:f/c)*100),v:Math.round(c*100)}}function Qo({h:n,s:r,v:s}){n/=360,r/=100,s/=100;const c=Math.floor(n*6),d=n*6-c,f=s*(1-r),h=s*(1-d*r),y=s*(1-(1-d)*r);let g,b,L;switch(c%6){case 0:[g,b,L]=[s,y,f];break;case 1:[g,b,L]=[h,s,f];break;case 2:[g,b,L]=[f,s,y];break;case 3:[g,b,L]=[f,h,s];break;case 4:[g,b,L]=[y,f,s];break;default:[g,b,L]=[s,f,h]}return{r:Math.round(g*255),g:Math.round(b*255),b:Math.round(L*255)}}function Jo(n){const r=String(n||"").trim(),s=r.match(/^hsv\(\s*(\d+)\s*,\s*(\d+)\s*%\s*,\s*(\d+)\s*%\s*\)$/i)||r.match(/^hsv\(\s*(\d+)\s+(\d+)\s*%\s+(\d+)\s*%\s*\)$/i);if(!s)return null;const c={h:+s[1],s:+s[2],v:+s[3]};return c.h<=360&&c.s<=100&&c.v<=100?c:null}function Eh(n){return n&&[n.r,n.g,n.b].every(r=>Number.isInteger(r)&&r>=0&&r<=255)}function vh(n,r){return n&&Number.isInteger(n.h)&&n.h>=0&&n.h<=360&&Number.isInteger(n.s)&&n.s>=0&&n.s<=100&&Number.isInteger(n[r])&&n[r]>=0&&n[r]<=100}function jy(n,r){const s=String(r||"").trim();let c=null;if(n==="color-hex")c=nr(s);else if(n==="color-rgb"){const d=Xo(s);Eh(d)&&(c=d)}else if(n==="color-hsl"){const d=Zo(s);vh(d,"l")&&(c=Ko(d))}else if(n==="color-hsv"){const d=Jo(s);vh(d,"v")&&(c=Qo(d))}return Eh(c)?Dl(c):null}const On=1024*1024,hu=5*On,My=64*1024,jb="image/png,image/jpeg,.png,.jpg,.jpeg";function Jc(n,r){return Object.freeze({lowMemory:Object.freeze(n),standard:Object.freeze(r)})}const Zt=Object.freeze({pdf:Jc({perFile:25*On,total:60*On,maxFiles:8},{perFile:100*On,total:250*On,maxFiles:20}),images:Jc({perFile:25*On,total:100*On,maxFiles:12},{perFile:80*On,total:300*On,maxFiles:32}),media:Jc({perFile:75*On,total:null,maxFiles:4},{perFile:250*On,total:null,maxFiles:8})}),Fl=Object.freeze({unsupported_type:Object.freeze({ok:!1,code:"unsupported_type",messageKey:"errors.unsupportedType"}),too_large:Object.freeze({ok:!1,code:"too_large",messageKey:"errors.tooLarge"}),resource_limit:Object.freeze({ok:!1,code:"resource_limit",messageKey:"errors.resourceLimit"})});function zy(n=globalThis){const r=Number(n?.deviceMemory??n?.navigator?.deviceMemory),s=Number(n?.viewportWidth??n?.innerWidth??n?.document?.documentElement?.clientWidth);return Number.isFinite(r)&&r<=4||Number.isFinite(s)&&s<768}function Uy(n,r=globalThis){return n?zy(r)?n.lowMemory:n.standard:null}function $y(n,r){if(!r||r==="*")return!0;const s=String(n.type||"").toLowerCase(),c=String(n.name||"").toLowerCase(),d=r.split(",").map(b=>b.trim().toLowerCase()).filter(Boolean),f=d.filter(b=>b.startsWith(".")),h=d.filter(b=>!b.startsWith(".")),y=f.some(b=>c.endsWith(b)),g=h.some(b=>b.endsWith("/*")?s.startsWith(b.slice(0,-1)):s===b);return f.length>0&&c.includes(".")&&!y||s&&h.length>0&&!g?!1:d.some(b=>{const L=b.trim().toLowerCase();return L?L.startsWith(".")?c.endsWith(L):L.endsWith("/*")?s.startsWith(L.slice(0,-1)):s===L:!1})}function Gy(n){return n==="image/png"?"png":n==="image/jpeg"||n==="image/jpg"?"jpeg":null}function By(n){return n.endsWith(".png")?"png":n.endsWith(".jpg")||n.endsWith(".jpeg")?"jpeg":null}function _y(n,r){if(n?.limits!==Zt.images)return!1;const s=String(r.type||"").toLowerCase(),c=String(r.name||"").toLowerCase(),d=Gy(String(r.type||"").toLowerCase()),f=By(c),h=c.lastIndexOf("."),y=h>=0&&h<c.length-1;return s&&!d||y&&!f||!d&&!f?!0:!!(d&&f&&d!==f)}function Xh(n,r,s=globalThis){const c=Array.from(r||[]);if(c.some(h=>_y(n,h)||!$y(h,n?.acceptTypes)))return Fl.unsupported_type;const d=Uy(n?.limits,s);if(!d)return{ok:!0};if(Number.isInteger(d.maxFiles)&&c.length>d.maxFiles)return Fl.resource_limit;if(c.some(h=>Number(h.size)>d.perFile))return Fl.too_large;const f=c.reduce((h,y)=>h+Number(y.size||0),0);return d.total!=null&&f>d.total?Fl.too_large:{ok:!0}}const Rl=Object.freeze({"text-5-mib":hu,"text-64-kib":My});function gt({formatId:n,from:r,to:s,compatibility:c,input:d,expected:f,additionalCases:h=[],inputLimitClass:y="text-5-mib",nameDe:g,nameEn:b,descriptionDe:L,descriptionEn:z}){if(!["compatible","incompatible-but-implemented"].includes(c))throw new Error(`Format evidence ${n} needs an explicit compatibility state.`);for(const w of h)if(!["compatible","incompatible-but-implemented"].includes(w.compatibility))throw new Error(`Additional format evidence ${n} needs an explicit compatibility state.`);return Object.freeze({evidenceId:`format:${n}`,subjectKind:"format",subjectId:n,formatId:n,executor:"format-exact",from:r,to:s,compatibility:c,input:d,expected:f,additionalCases:Object.freeze(h.map(w=>Object.freeze({...w}))),inputLimitClass:y,category:"format",tier:"advanced",runtimeClass:"main-thread",outputNaming:"inline-text",nameDe:g,nameEn:b,descriptionDe:L,descriptionEn:z})}const zl=Object.freeze([gt({formatId:"text",from:"text",to:"base64",compatibility:"compatible",input:"Folkkit",expected:"Rm9sa2tpdA==",nameDe:"Text",nameEn:"Text",descriptionDe:"Text lokal in ein belegtes Zielformat umwandeln.",descriptionEn:"Convert text locally to an evidenced target format."}),gt({formatId:"base64",from:"base64",to:"text",compatibility:"compatible",input:"Rm9sa2tpdA==",expected:"Folkkit",nameDe:"Base64",nameEn:"Base64",descriptionDe:"Base64 lokal in Text decodieren.",descriptionEn:"Decode Base64 to text locally."}),gt({formatId:"base58",from:"text",to:"base58",compatibility:"compatible",input:"Folkkit",expected:"3fp86L69TR",inputLimitClass:"text-64-kib",additionalCases:[{from:"base58",to:"text",compatibility:"compatible",input:"3fp86L69TR",expected:"Folkkit"}],nameDe:"Base58",nameEn:"Base58",descriptionDe:"Base58 bis 64 KiB lokal in Text decodieren.",descriptionEn:"Decode Base58 up to 64 KiB to text locally."}),gt({formatId:"url",from:"url",to:"text",compatibility:"compatible",input:"Folkkit%20lokal",expected:"Folkkit lokal",nameDe:"URL-Codierung",nameEn:"URL encoding",descriptionDe:"Percent-codierten URL-Text lokal decodieren.",descriptionEn:"Decode percent-encoded URL text locally."}),gt({formatId:"html-ent",from:"text",to:"html-ent",compatibility:"compatible",input:"<b>&",expected:"&lt;b&gt;&amp;",nameDe:"HTML-Entities",nameEn:"HTML entities",descriptionDe:"HTML-Sonderzeichen lokal als Entities codieren.",descriptionEn:"Encode HTML special characters as entities locally."}),gt({formatId:"hex",from:"hex",to:"text",compatibility:"compatible",input:"46 6f 6c 6b 6b 69 74",expected:"Folkkit",nameDe:"Hexadezimal",nameEn:"Hexadecimal",descriptionDe:"Hexadezimalwerte lokal in Text decodieren.",descriptionEn:"Decode hexadecimal values to text locally."}),gt({formatId:"binary",from:"binary",to:"text",compatibility:"compatible",input:"01000110 01101111 01101100 01101011 01101011 01101001 01110100",expected:"Folkkit",nameDe:"Binär",nameEn:"Binary",descriptionDe:"Binärwerte lokal in Text decodieren.",descriptionEn:"Decode binary values to text locally."}),gt({formatId:"unicode",from:"unicode",to:"text",compatibility:"compatible",input:"\\u0046\\u006f\\u006c\\u006b\\u006b\\u0069\\u0074",expected:"Folkkit",nameDe:"Unicode-Escapes",nameEn:"Unicode escapes",descriptionDe:"Unicode-Escape-Sequenzen lokal in Text decodieren.",descriptionEn:"Decode Unicode escape sequences to text locally."}),gt({formatId:"uppercase",from:"uppercase",to:"lowercase",compatibility:"compatible",input:"FOLKKIT",expected:"folkkit",nameDe:"GROSSBUCHSTABEN",nameEn:"UPPERCASE",descriptionDe:"Grossbuchstaben lokal in Kleinbuchstaben umwandeln.",descriptionEn:"Convert uppercase text to lowercase locally."}),gt({formatId:"lowercase",from:"lowercase",to:"uppercase",compatibility:"compatible",input:"folkkit",expected:"FOLKKIT",nameDe:"kleinbuchstaben",nameEn:"lowercase",descriptionDe:"Kleinbuchstaben lokal in Grossbuchstaben umwandeln.",descriptionEn:"Convert lowercase text to uppercase locally."}),gt({formatId:"json",from:"json",to:"json-min",compatibility:"compatible",input:'{"name": "Folkkit"}',expected:'{"name":"Folkkit"}',nameDe:"JSON",nameEn:"JSON",descriptionDe:"JSON lokal minimieren.",descriptionEn:"Minify JSON locally."}),gt({formatId:"json-min",from:"json-min",to:"json",compatibility:"compatible",input:'{"name":"Folkkit"}',expected:`{
  "name": "Folkkit"
}`,nameDe:"Minimiertes JSON",nameEn:"Minified JSON",descriptionDe:"Minimiertes JSON lokal formatieren.",descriptionEn:"Format minified JSON locally."}),gt({formatId:"decimal",from:"decimal",to:"numhex",compatibility:"compatible",input:"255",expected:"0xFF",nameDe:"Dezimal",nameEn:"Decimal",descriptionDe:"Eine Dezimalzahl lokal in Hexadezimal umwandeln.",descriptionEn:"Convert a decimal number to hexadecimal locally."}),gt({formatId:"numhex",from:"numhex",to:"decimal",compatibility:"compatible",input:"0xFF",expected:"255",nameDe:"Hexadezimalzahl",nameEn:"Hexadecimal number",descriptionDe:"Eine Hexadezimalzahl lokal in Dezimal umwandeln.",descriptionEn:"Convert a hexadecimal number to decimal locally."}),gt({formatId:"numbin",from:"numbin",to:"decimal",compatibility:"compatible",input:"0b1010",expected:"10",nameDe:"Binärzahl",nameEn:"Binary number",descriptionDe:"Eine Binärzahl lokal in Dezimal umwandeln.",descriptionEn:"Convert a binary number to decimal locally."}),gt({formatId:"numoct",from:"numoct",to:"decimal",compatibility:"compatible",input:"0o10",expected:"8",nameDe:"Oktalzahl",nameEn:"Octal number",descriptionDe:"Eine Oktalzahl lokal in Dezimal umwandeln.",descriptionEn:"Convert an octal number to decimal locally."}),gt({formatId:"color-hex",from:"color-hex",to:"color-rgb",compatibility:"compatible",input:"#ff0000",expected:"rgb(255, 0, 0)",nameDe:"Farbe HEX",nameEn:"Color HEX",descriptionDe:"Einen HEX-Farbwert lokal in RGB umwandeln.",descriptionEn:"Convert a HEX color value to RGB locally."}),gt({formatId:"color-rgb",from:"color-rgb",to:"color-hex",compatibility:"compatible",input:"rgb(255, 0, 0)",expected:"#ff0000",nameDe:"Farbe RGB",nameEn:"Color RGB",descriptionDe:"Einen RGB-Farbwert lokal in HEX umwandeln.",descriptionEn:"Convert an RGB color value to HEX locally."})]);function At(n,r,s={}){return Object.freeze({evidenceId:`tool:${n}`,subjectKind:"tool",subjectId:n,executor:r,...s})}const Py=[["base64-encode","Folkkit","Rm9sa2tpdA=="],["base64-decode","Rm9sa2tpdA==","Folkkit"],["url-encode","Folkkit & lokal","Folkkit%20%26%20lokal"],["url-decode","Folkkit%20%26%20lokal","Folkkit & lokal"],["html-encode","<b>&</b>","&lt;b&gt;&amp;&lt;/b&gt;"],["html-decode","&lt;b&gt;&amp;&lt;/b&gt;","<b>&</b>"],["hex-encode","Hi","48 69"],["hex-decode","48 69","Hi"],["binary-encode","Hi","01001000 01101001"],["binary-decode","01001000 01101001","Hi"],["unicode-escape","Hi ✓","\\u0048\\u0069\\u0020\\u2713"],["unicode-unescape","\\u0048\\u0069","Hi"],["rot13","Folkkit","Sbyxxvg"],["atbash","Abc","Zyx"],["sha256","Folkkit","9b7c7fc175ad695c18d03e20295ea1b502cab00fc6ef3fb780c4ae512ff62275"],["json-prettify",'{"a":1}',`{
  "a": 1
}`],["json-minify",'{ "a": 1 }','{"a":1}'],["json-escape",`line
break`,'"line\\nbreak"'],["csv-to-json",`name,age
Ada,36`,`[
  {
    "name": "Ada",
    "age": "36"
  }
]`],["dec-to-hex","255","0xFF"],["hex-to-dec","ff","255"],["dec-to-bin","10","0b1010"],["bin-to-dec","1010","10"],["dec-to-oct","8","0o10"],["oct-to-dec","10","8"],["color-convert","#ff0000",`HEX:  #ff0000
RGB:  rgb(255, 0, 0)
HSL:  hsl(0, 100%, 50%)`],["css-minify","body { color: red; }","body{color:red}"],["json-validate",'{"ok":true}',`Valid JSON

Type: object
Content: 1 keys
Size: 11 chars
Minified: 11 chars`],["base64url-encode","Folkkit","Rm9sa2tpdA"],["base64url-decode","Rm9sa2tpdA","Folkkit"],["slug-gen","Hello Folkkit!",`Hello Folkkit!
  → hello-folkkit`],["char-count","one two",`Characters:  7
Words:       2
Lines:       1
Bytes:       7`],["reverse-text","Folkkit","tikkloF"],["aspect-ratio","1920x1080",`Dimensions: 1920 x 1080
Ratio:      16:9
Decimal:    1.7778

Nearest common: 16:9 (Widescreen / HD)

-- Common sizes at this ratio --
  853 x 480
  1280 x 720
  1920 x 1080
  2560 x 1440
  3840 x 2160`]],Yy=Py.map(([n,r,s])=>At(n,"tool-text-cases",{cases:Object.freeze([{input:r,expected:s,match:"exact"}])})),Wy=At("percentage-calc","tool-text-cases",{cases:Object.freeze([{input:"15% of 200",expected:"15% of 200 = 30",match:"exact"},{input:"15% von 200",expected:"15% von 200 = 30",match:"exact"}])}),qy=[At("loan-calc","tool-text-cases",{cases:Object.freeze([{input:"1000 12% 1",expected:"Monthly payment:  $88.85",match:"contains"},{input:"1000 5% 0",expected:"(invalid values)",match:"exact"},{input:"1000 5% 101",expected:"(invalid values)",match:"exact"},{input:"1000000000001 5% 30",expected:"(invalid values)",match:"exact"},{input:"1000 101% 30",expected:"(invalid values)",match:"exact"},{input:"99999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999 5% 30",expected:"(invalid values)",match:"exact"}])}),At("bmi-calc","tool-text-cases",{cases:Object.freeze([{input:"70kg 175cm",expected:"BMI:      22.9",match:"contains"}])})],Vy=[At("text-to-qr","tool-qr-generate",{input:"Folkkit evidence",expectedFilename:"folkkit-qr.svg"}),At("merge-pdf","tool-pdf-behavior",{operation:"merge"}),At("pdf-page-count","tool-pdf-behavior",{operation:"page-count"}),At("pdf-split","tool-pdf-behavior",{operation:"split"}),At("pdf-extract-range","tool-pdf-behavior",{operation:"extract-range"}),At("text-to-pdf","tool-pdf-behavior",{operation:"text-to-pdf"}),At("pdf-metadata","tool-pdf-behavior",{operation:"metadata"}),At("pdf-rotate","tool-pdf-behavior",{operation:"rotate"})],Ky=[At("images-to-pdf","browser-e2e"),At("png-to-jpg","browser-e2e"),At("jpg-to-png","browser-e2e"),At("audio-to-mp3","browser-e2e")],Xy=Object.freeze([...Yy,Wy,...qy,...Vy,...Ky]);Object.freeze([...zl,...Xy]);const Zy=Object.freeze(zl.map(n=>n.formatId)),xu=Object.freeze(zl.flatMap(n=>[Object.freeze({evidenceId:n.evidenceId,from:n.from,to:n.to,compatibility:n.compatibility,implementationEvidenceId:n.evidenceId,inputLimitClass:n.inputLimitClass}),...n.additionalCases.map((r,s)=>Object.freeze({evidenceId:`${n.evidenceId}:${s+2}`,from:r.from,to:r.to,compatibility:r.compatibility,implementationEvidenceId:`${n.evidenceId}:${s+2}`,inputLimitClass:n.inputLimitClass}))])),Qy=new Set(xu.map(n=>`${n.from}→${n.to}`));function jl(n){return zl.find(r=>r.formatId===n)||null}function Sn(n,r){return typeof n=="string"&&typeof r=="string"&&Qy.has(`${n}→${r}`)}function Jy(n){return typeof n!="string"?[]:xu.filter(r=>r.from===n).map(r=>r.to)}function e0(n,r){if(!Sn(n,r))return null;const s=jl(n),c=jl(r),d=Rl[s?.inputLimitClass]||Rl["text-5-mib"],f=Rl[c?.inputLimitClass]||Rl["text-5-mib"];return Math.min(d,f)}const Au=[{id:"text",name:"Text",group:"Text",placeholder:"Type or paste text..."},{id:"base64",name:"Base64",group:"Text",placeholder:"SGVsbG8gV29ybGQ="},{id:"base32",name:"Base32",group:"Text",placeholder:"JBSWY3DPEBLW64TMMQ======"},{id:"base58",name:"Base58",group:"Text",placeholder:"StV1DL6CwTryKyV"},{id:"url",name:"URL Encoded",group:"Text",placeholder:"hello%20world"},{id:"html-ent",name:"HTML Entities",group:"Text",placeholder:"&lt;div&gt;hello&lt;/div&gt;"},{id:"hex",name:"Hex",group:"Text",placeholder:"48 65 6c 6c 6f"},{id:"binary",name:"Binary",group:"Text",placeholder:"01001000 01100101 01101100 01101100 01101111"},{id:"unicode",name:"Unicode Escaped",group:"Text",placeholder:"\\u0048\\u0065\\u006c\\u006c\\u006f"},{id:"morse",name:"Morse Code",group:"Text",placeholder:".... . .-.. .-.. ---"},{id:"nato",name:"NATO Phonetic",group:"Text",placeholder:"Alfa Bravo Charlie"},{id:"rot13",name:"ROT13",group:"Text",placeholder:"Uryyb Jbeyq"},{id:"reverse",name:"Reversed",group:"Text",placeholder:"dlroW olleH"},{id:"json-escaped",name:"JSON String",group:"Text",placeholder:'"Hello\\nWorld\\t\\"quoted\\"" '},{id:"uppercase",name:"UPPERCASE",group:"Case",placeholder:"HELLO WORLD"},{id:"lowercase",name:"lowercase",group:"Case",placeholder:"hello world"},{id:"titlecase",name:"Title Case",group:"Case",placeholder:"Hello World"},{id:"camelcase",name:"camelCase",group:"Case",placeholder:"helloWorld"},{id:"snakecase",name:"snake_case",group:"Case",placeholder:"hello_world"},{id:"kebabcase",name:"kebab-case",group:"Case",placeholder:"hello-world"},{id:"markdown",name:"Markdown",group:"Markup",placeholder:"# Hello **world**"},{id:"html-markup",name:"HTML",group:"Markup",placeholder:"<h1>Hello <strong>world</strong></h1>"},{id:"plain",name:"Plain Text",group:"Markup",placeholder:"Hello world"},{id:"json",name:"JSON",group:"Data",placeholder:'{"key": "value"}'},{id:"json-min",name:"JSON Minified",group:"Data",placeholder:'{"key":"value"}'},{id:"yaml",name:"YAML",group:"Data",placeholder:`key: value
items:
  - one
  - two`},{id:"csv",name:"CSV",group:"Data",placeholder:`name,age
Alice,30
Bob,25`},{id:"tsv",name:"TSV",group:"Data",placeholder:`name	age
Alice	30
Bob	25`},{id:"xml",name:"XML",group:"Data",placeholder:"<root><item>hello</item></root>"},{id:"querystring",name:"Query String",group:"Data",placeholder:"key=value&foo=bar"},{id:"toml",name:"TOML",group:"Data",placeholder:`key = "value"
[section]
name = "test"`},{id:"timestamp",name:"Unix Timestamp",group:"Time",placeholder:"1700000000"},{id:"iso-date",name:"ISO 8601",group:"Time",placeholder:"2024-01-15T12:00:00Z"},{id:"human-date",name:"Human Date",group:"Time",placeholder:"Mon, 15 Jan 2024 12:00:00 GMT"},{id:"sha1",name:"SHA-1 Hash",group:"Hash"},{id:"sha256",name:"SHA-256 Hash",group:"Hash"},{id:"sha384",name:"SHA-384 Hash",group:"Hash"},{id:"sha512",name:"SHA-512 Hash",group:"Hash"},{id:"md5",name:"MD5 Hash",group:"Hash"},{id:"decimal",name:"Decimal",group:"Number",placeholder:"255"},{id:"numhex",name:"Hexadecimal",group:"Number",placeholder:"0xFF"},{id:"numbin",name:"Binary (Num)",group:"Number",placeholder:"0b11111111"},{id:"numoct",name:"Octal",group:"Number",placeholder:"0o377"},{id:"roman",name:"Roman Numeral",group:"Number",placeholder:"CCLV"},{id:"bits",name:"Bits",group:"Data Size",placeholder:"8388608"},{id:"bytes",name:"Bytes",group:"Data Size",placeholder:"1048576"},{id:"kilobytes",name:"Kilobytes",group:"Data Size",placeholder:"1024"},{id:"megabytes",name:"Megabytes",group:"Data Size",placeholder:"1"},{id:"gigabytes",name:"Gigabytes",group:"Data Size",placeholder:"0.5"},{id:"kib",name:"Kibibytes (KiB)",group:"Data Size",placeholder:"1000"},{id:"mib",name:"Mebibytes (MiB)",group:"Data Size",placeholder:"0.977"},{id:"gib",name:"Gibibytes (GiB)",group:"Data Size",placeholder:"0.00095"},{id:"celsius",name:"Celsius",group:"Temperature",placeholder:"100"},{id:"fahrenheit",name:"Fahrenheit",group:"Temperature",placeholder:"212"},{id:"kelvin",name:"Kelvin",group:"Temperature",placeholder:"373.15"},{id:"inches",name:"Inches",group:"Length",placeholder:"12"},{id:"cm",name:"Centimeters",group:"Length",placeholder:"30.48"},{id:"mm",name:"Millimeters",group:"Length",placeholder:"304.8"},{id:"feet",name:"Feet",group:"Length",placeholder:"1"},{id:"meters",name:"Meters",group:"Length",placeholder:"0.3048"},{id:"miles",name:"Miles",group:"Distance",placeholder:"1"},{id:"km",name:"Kilometers",group:"Distance",placeholder:"1.609"},{id:"yards",name:"Yards",group:"Distance",placeholder:"1760"},{id:"nautmiles",name:"Nautical Miles",group:"Distance",placeholder:"0.8684"},{id:"kg",name:"Kilograms",group:"Weight",placeholder:"1"},{id:"lb",name:"Pounds",group:"Weight",placeholder:"2.205"},{id:"oz",name:"Ounces",group:"Weight",placeholder:"35.274"},{id:"grams",name:"Grams",group:"Weight",placeholder:"1000"},{id:"ton-metric",name:"Tonnes (metric)",group:"Weight",placeholder:"0.001"},{id:"ton-short",name:"Short Tons (US)",group:"Weight",placeholder:"0.0011"},{id:"stone",name:"Stones",group:"Weight",placeholder:"0.1575"},{id:"mph",name:"Miles/hour",group:"Speed",placeholder:"60"},{id:"kmh",name:"km/hour",group:"Speed",placeholder:"96.56"},{id:"ms",name:"Meters/sec",group:"Speed",placeholder:"26.82"},{id:"knots",name:"Knots",group:"Speed",placeholder:"52.14"},{id:"sqft",name:"Square Feet",group:"Area",placeholder:"100"},{id:"sqm",name:"Square Meters",group:"Area",placeholder:"9.29"},{id:"acres",name:"Acres",group:"Area",placeholder:"1"},{id:"hectares",name:"Hectares",group:"Area",placeholder:"0.4047"},{id:"liters",name:"Liters",group:"Volume",placeholder:"1"},{id:"gallons",name:"Gallons (US)",group:"Volume",placeholder:"0.2642"},{id:"ml",name:"Milliliters",group:"Volume",placeholder:"1000"},{id:"floz",name:"Fluid Ounces",group:"Volume",placeholder:"33.814"},{id:"cups",name:"Cups",group:"Volume",placeholder:"4.227"},{id:"dur-seconds",name:"Seconds",group:"Duration",placeholder:"3600"},{id:"dur-minutes",name:"Minutes",group:"Duration",placeholder:"60"},{id:"dur-hours",name:"Hours",group:"Duration",placeholder:"1"},{id:"dur-days",name:"Days",group:"Duration",placeholder:"0.0417"},{id:"joules",name:"Joules",group:"Energy",placeholder:"1000"},{id:"calories",name:"Calories",group:"Energy",placeholder:"239.006"},{id:"kcal",name:"Kilocalories",group:"Energy",placeholder:"0.239"},{id:"kwh",name:"Kilowatt-hours",group:"Energy",placeholder:"0.000278"},{id:"btu",name:"BTU",group:"Energy",placeholder:"0.9478"},{id:"psi",name:"PSI",group:"Pressure",placeholder:"14.696"},{id:"bar",name:"Bar",group:"Pressure",placeholder:"1.01325"},{id:"atm",name:"Atmospheres",group:"Pressure",placeholder:"1"},{id:"pascal",name:"Pascals",group:"Pressure",placeholder:"101325"},{id:"mmhg",name:"mmHg",group:"Pressure",placeholder:"760"},{id:"degrees",name:"Degrees",group:"Angle",placeholder:"180"},{id:"radians",name:"Radians",group:"Angle",placeholder:"3.14159"},{id:"gradians",name:"Gradians",group:"Angle",placeholder:"200"},{id:"terabytes",name:"Terabytes",group:"Data Size",placeholder:"0.001"},{id:"petabytes",name:"Petabytes",group:"Data Size",placeholder:"0.000001"},{id:"hz",name:"Hertz",group:"Frequency",placeholder:"1000"},{id:"khz",name:"Kilohertz",group:"Frequency",placeholder:"1"},{id:"mhz",name:"Megahertz",group:"Frequency",placeholder:"0.001"},{id:"ghz",name:"Gigahertz",group:"Frequency",placeholder:"0.000001"},{id:"watts",name:"Watts",group:"Power",placeholder:"1000"},{id:"kilowatts",name:"Kilowatts",group:"Power",placeholder:"1"},{id:"horsepower",name:"Horsepower",group:"Power",placeholder:"1.341"},{id:"btuh",name:"BTU/hour",group:"Power",placeholder:"3412.14"},{id:"mpg",name:"Miles/gallon",group:"Fuel Economy",placeholder:"30"},{id:"kml",name:"km/Liter",group:"Fuel Economy",placeholder:"12.75"},{id:"l100km",name:"L/100km",group:"Fuel Economy",placeholder:"7.84"},{id:"bps",name:"Bits/sec",group:"Data Rate",placeholder:"1000000"},{id:"kbps",name:"Kbps",group:"Data Rate",placeholder:"1000"},{id:"mbps",name:"Mbps",group:"Data Rate",placeholder:"1"},{id:"gbps",name:"Gbps",group:"Data Rate",placeholder:"0.001"},{id:"tsp",name:"Teaspoons",group:"Cooking",placeholder:"3"},{id:"tbsp",name:"Tablespoons",group:"Cooking",placeholder:"1"},{id:"cup-cook",name:"Cups (US)",group:"Cooking",placeholder:"0.0625"},{id:"braille",name:"Braille",group:"Text",placeholder:"⠓⠑⠇⠇⠕"},{id:"piglatin",name:"Pig Latin",group:"Text",placeholder:"ellohay orldway"},{id:"leetspeak",name:"Leet Speak",group:"Text",placeholder:"h3ll0 w0rld"},{id:"base64url",name:"Base64 URL",group:"Text",placeholder:"SGVsbG8gV29ybGQ"},{id:"atbash",name:"Atbash",group:"Text",placeholder:"Svool Dliow"},{id:"rankine",name:"Rankine",group:"Temperature",placeholder:"671.67"},{id:"turns",name:"Turns",group:"Angle",placeholder:"0.5"},{id:"tbps",name:"Tbps",group:"Data Rate",placeholder:"0.000001"},{id:"color-hex",name:"Color HEX",group:"Color",placeholder:"#ff6b35"},{id:"color-rgb",name:"Color RGB",group:"Color",placeholder:"rgb(255, 107, 53)"},{id:"color-hsl",name:"Color HSL",group:"Color",placeholder:"hsl(16, 100%, 60%)"},{id:"color-hsv",name:"Color HSV",group:"Color",placeholder:"hsv(16, 79%, 100%)"},{id:"color-cmyk",name:"Color CMYK",group:"Color",placeholder:"cmyk(0%, 58%, 79%, 0%)"},{id:"pint-cook",name:"Pints (US)",group:"Cooking",placeholder:"0.03125"},{id:"qt-cook",name:"Quarts (US)",group:"Cooking",placeholder:"0.015625"},{id:"floz-cook",name:"Fluid Oz (US)",group:"Cooking",placeholder:"0.5"},{id:"dur-ms",name:"Milliseconds",group:"Duration",placeholder:"3600000"},{id:"dur-weeks",name:"Weeks",group:"Duration",placeholder:"0.006"},{id:"dur-us",name:"Microseconds",group:"Duration",placeholder:"3600000000"},{id:"dur-ns",name:"Nanoseconds",group:"Duration",placeholder:"3.6e12"},{id:"dur-months",name:"Months",group:"Duration",placeholder:"0.00137"},{id:"dur-years",name:"Years",group:"Duration",placeholder:"0.000114"},{id:"megajoules",name:"Megajoules",group:"Energy",placeholder:"0.001"},{id:"fps",name:"Feet/sec",group:"Speed",placeholder:"88"},{id:"mach",name:"Mach",group:"Speed",placeholder:"0.0767"},{id:"micrometers",name:"Micrometers",group:"Length",placeholder:"304800"},{id:"nanometers",name:"Nanometers",group:"Length",placeholder:"304800000"},{id:"light-year",name:"Light Years",group:"Distance",placeholder:"1"},{id:"au",name:"Astronomical Units",group:"Distance",placeholder:"63241"},{id:"gallon-us",name:"Gallons (US)",group:"Cooking",placeholder:"1"},{id:"milligrams",name:"Milligrams",group:"Weight",placeholder:"453592"},{id:"micrograms",name:"Micrograms",group:"Weight",placeholder:"453592000"},{id:"carats",name:"Carats",group:"Weight",placeholder:"5000"},{id:"btu-per-hr",name:"BTU/hour",group:"Power",placeholder:"3412"},{id:"calories-per-sec",name:"cal/sec",group:"Power",placeholder:"239"},{id:"rpm",name:"RPM",group:"Frequency",placeholder:"60"},{id:"radians-per-sec",name:"Radians/sec (ω)",group:"Frequency",placeholder:"6.2832"},{id:"troy-oz",name:"Troy Ounce",group:"Weight",placeholder:"32.15"},{id:"sqkm",name:"Square Kilometers",group:"Area",placeholder:"1"},{id:"sqmiles",name:"Square Miles",group:"Area",placeholder:"0.3861"},{id:"sqinches",name:"Square Inches",group:"Area",placeholder:"1550"},{id:"sqcm",name:"Square Centimeters",group:"Area",placeholder:"92.9"},{id:"kpa",name:"Kilopascals (kPa)",group:"Pressure",placeholder:"101.325"},{id:"hpa",name:"Hectopascals (hPa)",group:"Pressure",placeholder:"1013.25"},{id:"arcminutes",name:"Arcminutes",group:"Angle",placeholder:"10800"},{id:"arcseconds",name:"Arcseconds",group:"Angle",placeholder:"648000"},{id:"cubic-m",name:"Cubic Meters",group:"Volume",placeholder:"0.001"},{id:"cubic-ft",name:"Cubic Feet",group:"Volume",placeholder:"0.0353"},{id:"newtons",name:"Newtons",group:"Force",placeholder:"9.807"},{id:"pound-force",name:"Pound-force (lbf)",group:"Force",placeholder:"2.205"},{id:"kg-force",name:"Kilogram-force (kgf)",group:"Force",placeholder:"1"},{id:"dyne",name:"Dyne",group:"Force",placeholder:"980665"},{id:"kilonewtons",name:"Kilonewtons",group:"Force",placeholder:"0.009807"},{id:"lux",name:"Lux",group:"Illuminance",placeholder:"500"},{id:"foot-candle",name:"Foot-candle",group:"Illuminance",placeholder:"46.45"},{id:"millilux",name:"Millilux",group:"Illuminance",placeholder:"500000"},{id:"pt",name:"Points (pt)",group:"Typography",placeholder:"72"},{id:"pica",name:"Picas",group:"Typography",placeholder:"6"},{id:"px",name:"Pixels (96 DPI)",group:"Typography",placeholder:"96"},{id:"kgm3",name:"kg/m³",group:"Density",placeholder:"1000"},{id:"gcm3",name:"g/cm³",group:"Density",placeholder:"1"},{id:"lbft3",name:"lb/ft³",group:"Density",placeholder:"62.43"},{id:"lbgal",name:"lb/gal (US)",group:"Density",placeholder:"8.34"},{id:"ampere",name:"Amperes (A)",group:"Electric",placeholder:"1"},{id:"milliamp",name:"Milliamperes (mA)",group:"Electric",placeholder:"1000"},{id:"microamp",name:"Microamperes (μA)",group:"Electric",placeholder:"1000000"},{id:"kiloamp",name:"Kiloamperes (kA)",group:"Electric",placeholder:"0.001"},{id:"volt",name:"Volts (V)",group:"Voltage",placeholder:"120"},{id:"millivolt",name:"Millivolts (mV)",group:"Voltage",placeholder:"120000"},{id:"kilovolt",name:"Kilovolts (kV)",group:"Voltage",placeholder:"0.12"},{id:"microvolt",name:"Microvolts (μV)",group:"Voltage",placeholder:"120000000"},{id:"ohm",name:"Ohms (Ω)",group:"Resistance",placeholder:"1000"},{id:"kilohm",name:"Kilohms (kΩ)",group:"Resistance",placeholder:"1"},{id:"megohm",name:"Megohms (MΩ)",group:"Resistance",placeholder:"0.001"},{id:"milliohm",name:"Milliohms (mΩ)",group:"Resistance",placeholder:"1000000"},{id:"ms2",name:"m/s²",group:"Acceleration",placeholder:"9.81"},{id:"gforce",name:"g-force",group:"Acceleration",placeholder:"1"},{id:"fts2",name:"ft/s²",group:"Acceleration",placeholder:"32.17"},{id:"cms2",name:"cm/s² (Gal)",group:"Acceleration",placeholder:"981"},{id:"nm-torque",name:"Newton-meters (N·m)",group:"Torque",placeholder:"100"},{id:"lb-ft",name:"Pound-feet (lb·ft)",group:"Torque",placeholder:"73.76"},{id:"lb-in",name:"Pound-inches (lb·in)",group:"Torque",placeholder:"885.1"},{id:"kg-cm",name:"Kilogram-cm (kg·cm)",group:"Torque",placeholder:"1019.7"},{id:"newton",name:"Newtons (N)",group:"Force",placeholder:"9.81"},{id:"kilonewton",name:"Kilonewtons (kN)",group:"Force",placeholder:"0.00981"},{id:"kgforce",name:"Kilogram-force (kgf)",group:"Force",placeholder:"1"},{id:"footcandle",name:"Footcandle (fc)",group:"Illuminance",placeholder:"46.45"},{id:"phot",name:"Phot (ph)",group:"Illuminance",placeholder:"0.05"},{id:"nox",name:"Nox (nx)",group:"Illuminance",placeholder:"500000"},{id:"farad",name:"Farad (F)",group:"Capacitance",placeholder:"0.000001"},{id:"microfarad",name:"Microfarad (μF)",group:"Capacitance",placeholder:"1"},{id:"nanofarad",name:"Nanofarad (nF)",group:"Capacitance",placeholder:"1000"},{id:"picofarad",name:"Picofarad (pF)",group:"Capacitance",placeholder:"1000000"},{id:"terahertz",name:"Terahertz (THz)",group:"Frequency",placeholder:"0.001"},{id:"gigahertz",name:"Gigahertz (GHz)",group:"Frequency",placeholder:"1"},{id:"percent",name:"Percent (%)",group:"Number",placeholder:"75"},{id:"decimal-frac",name:"Decimal Fraction",group:"Number",placeholder:"0.75"},{id:"ppm",name:"Parts per Million (ppm)",group:"Number",placeholder:"750000"},{id:"ppb",name:"Parts per Billion (ppb)",group:"Number",placeholder:"750000000"},{id:"pt-type",name:"Point (pt)",group:"Typography",placeholder:"72"},{id:"screen-px",name:"Screen Pixel (96 DPI)",group:"Typography",placeholder:"96"},{id:"twip",name:"Twip (1/1440 in)",group:"Typography",placeholder:"1440"}],Zh=new Set(Zy),Fu=Au.filter(n=>Zh.has(n.id));function Cn(n,r="de"){const s=Au.find(d=>d.id===n),c=jl(n);return!s||!c?null:{...s,name:r==="en"?c.nameEn:c.nameDe}}function t0(n="de"){return Fu.map(r=>Cn(r.id,n))}async function er(n,r){const s=new TextEncoder().encode(r),c=await crypto.subtle.digest(n,s);return Array.from(new Uint8Array(c)).map(d=>d.toString(16).padStart(2,"0")).join("")}const Qh="123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";function eu(n){const r=new TextEncoder().encode(n);let s=0n;for(const d of r)s=s*256n+BigInt(d);let c="";for(;s>0n;)c=Qh[Number(s%58n)]+c,s/=58n;for(const d of r)if(d===0)c="1"+c;else break;return c||"1"}function tu(n){const r=n.trim();let s=0n;for(const y of r){const g=Qh.indexOf(y);if(g<0)throw new Error("bad char");s=s*58n+BigInt(g)}const d=s.toString(16).padStart(2,"0").match(/.{2}/g).map(y=>parseInt(y,16));let f=0;for(const y of r)if(y==="1")f++;else break;const h=new Uint8Array([...Array(f).fill(0),...d]);return new TextDecoder().decode(h)}const Jh={a:"⠁",b:"⠃",c:"⠉",d:"⠙",e:"⠑",f:"⠋",g:"⠛",h:"⠓",i:"⠊",j:"⠚",k:"⠅",l:"⠇",m:"⠍",n:"⠝",o:"⠕",p:"⠏",q:"⠟",r:"⠗",s:"⠎",t:"⠞",u:"⠥",v:"⠧",w:"⠺",x:"⠭",y:"⠽",z:"⠵",1:"⠼⠁",2:"⠼⠃",3:"⠼⠉",4:"⠼⠙",5:"⠼⠑",6:"⠼⠋",7:"⠼⠛",8:"⠼⠓",9:"⠼⠊",0:"⠼⠚"," ":" ",".":"⠲",",":"⠂","?":"⠦","!":"⠖",";":"⠆",":":"⠒","-":"⠤","'":"⠄",'"':"⠦","/":"⠌","(":"⠐⠣",")":"⠐⠜"},ar={};for(const[n,r]of Object.entries(Jh))ar[r]||(ar[r]=n);function Qn(n){let r="";for(const s of n.toLowerCase())r+=Jh[s]||s;return r}function tr(n){let r="",s=0;const c=Array.from(n);for(;s<c.length;){if(s+1<c.length){const f=c[s]+c[s+1];if(ar[f]){r+=ar[f],s+=2;continue}}const d=c[s];r+=ar[d]||d,s++}return r}function nu(n){return n.replace(/\b([a-zA-Z]+)\b/g,r=>{const s=r.toLowerCase(),c=r[0]===r[0].toUpperCase(),d="aeiou";let f;if(d.includes(s[0]))f=s+"yay";else{let h=0;for(;h<s.length&&!d.includes(s[h]);)h++;f=s.slice(h)+s.slice(0,h)+"ay"}return c?f.charAt(0).toUpperCase()+f.slice(1):f})}function au(n){return n.replace(/\b([a-zA-Z]+)\b/g,r=>{const s=r.toLowerCase(),c=r[0]===r[0].toUpperCase();let d;if(s.endsWith("yay"))d=s.slice(0,-3);else if(s.endsWith("ay")){const f=s.slice(0,-2),h="aeiou";let y=f.length;for(let g=f.length-1;g>=0&&!h.includes(f[g]);g--)y=g;d=f.slice(y)+f.slice(0,y)}else d=s;return c?d.charAt(0).toUpperCase()+d.slice(1):d})}const mu={a:"4",e:"3",i:"1",o:"0",s:"5",t:"7",b:"8",g:"9",l:"|"},Nl=Object.fromEntries(Object.entries(mu).map(([n,r])=>[r,n]));function Oh(n){const r=new TextEncoder().encode(n);function s(z,w){let I=z[0],j=z[1],C=z[2],O=z[3];const q=(ce,fe,ae,Ae,Ne,Pe,Fe)=>(ce=c(c(ce,fe&ae|~fe&Ae),c(Ne,Fe)),c(ce<<Pe|ce>>>32-Pe,fe)),te=(ce,fe,ae,Ae,Ne,Pe,Fe)=>(ce=c(c(ce,fe&Ae|ae&~Ae),c(Ne,Fe)),c(ce<<Pe|ce>>>32-Pe,fe)),B=(ce,fe,ae,Ae,Ne,Pe,Fe)=>(ce=c(c(ce,fe^ae^Ae),c(Ne,Fe)),c(ce<<Pe|ce>>>32-Pe,fe)),ne=(ce,fe,ae,Ae,Ne,Pe,Fe)=>(ce=c(c(ce,ae^(fe|~Ae)),c(Ne,Fe)),c(ce<<Pe|ce>>>32-Pe,fe));I=q(I,j,C,O,w[0],7,-680876936),O=q(O,I,j,C,w[1],12,-389564586),C=q(C,O,I,j,w[2],17,606105819),j=q(j,C,O,I,w[3],22,-1044525330),I=q(I,j,C,O,w[4],7,-176418897),O=q(O,I,j,C,w[5],12,1200080426),C=q(C,O,I,j,w[6],17,-1473231341),j=q(j,C,O,I,w[7],22,-45705983),I=q(I,j,C,O,w[8],7,1770035416),O=q(O,I,j,C,w[9],12,-1958414417),C=q(C,O,I,j,w[10],17,-42063),j=q(j,C,O,I,w[11],22,-1990404162),I=q(I,j,C,O,w[12],7,1804603682),O=q(O,I,j,C,w[13],12,-40341101),C=q(C,O,I,j,w[14],17,-1502002290),j=q(j,C,O,I,w[15],22,1236535329),I=te(I,j,C,O,w[1],5,-165796510),O=te(O,I,j,C,w[6],9,-1069501632),C=te(C,O,I,j,w[11],14,643717713),j=te(j,C,O,I,w[0],20,-373897302),I=te(I,j,C,O,w[5],5,-701558691),O=te(O,I,j,C,w[10],9,38016083),C=te(C,O,I,j,w[15],14,-660478335),j=te(j,C,O,I,w[4],20,-405537848),I=te(I,j,C,O,w[9],5,568446438),O=te(O,I,j,C,w[14],9,-1019803690),C=te(C,O,I,j,w[3],14,-187363961),j=te(j,C,O,I,w[8],20,1163531501),I=te(I,j,C,O,w[13],5,-1444681467),O=te(O,I,j,C,w[2],9,-51403784),C=te(C,O,I,j,w[7],14,1735328473),j=te(j,C,O,I,w[12],20,-1926607734),I=B(I,j,C,O,w[5],4,-378558),O=B(O,I,j,C,w[8],11,-2022574463),C=B(C,O,I,j,w[11],16,1839030562),j=B(j,C,O,I,w[14],23,-35309556),I=B(I,j,C,O,w[1],4,-1530992060),O=B(O,I,j,C,w[4],11,1272893353),C=B(C,O,I,j,w[7],16,-155497632),j=B(j,C,O,I,w[10],23,-1094730640),I=B(I,j,C,O,w[13],4,681279174),O=B(O,I,j,C,w[0],11,-358537222),C=B(C,O,I,j,w[3],16,-722521979),j=B(j,C,O,I,w[6],23,76029189),I=B(I,j,C,O,w[9],4,-640364487),O=B(O,I,j,C,w[12],11,-421815835),C=B(C,O,I,j,w[15],16,530742520),j=B(j,C,O,I,w[2],23,-995338651),I=ne(I,j,C,O,w[0],6,-198630844),O=ne(O,I,j,C,w[7],10,1126891415),C=ne(C,O,I,j,w[14],15,-1416354905),j=ne(j,C,O,I,w[5],21,-57434055),I=ne(I,j,C,O,w[12],6,1700485571),O=ne(O,I,j,C,w[3],10,-1894986606),C=ne(C,O,I,j,w[10],15,-1051523),j=ne(j,C,O,I,w[1],21,-2054922799),I=ne(I,j,C,O,w[8],6,1873313359),O=ne(O,I,j,C,w[15],10,-30611744),C=ne(C,O,I,j,w[6],15,-1560198380),j=ne(j,C,O,I,w[13],21,1309151649),I=ne(I,j,C,O,w[4],6,-145523070),O=ne(O,I,j,C,w[11],10,-1120210379),C=ne(C,O,I,j,w[2],15,718787259),j=ne(j,C,O,I,w[9],21,-343485551),z[0]=c(I,z[0]),z[1]=c(j,z[1]),z[2]=c(C,z[2]),z[3]=c(O,z[3])}function c(z,w){return z+w&4294967295}function d(z){const w=[];for(let I=0;I<64;I+=4)w[I>>2]=z[I]+(z[I+1]<<8)+(z[I+2]<<16)+(z[I+3]<<24);return w}const f=r.length;let h=[128],y=f+1;for(;y%64!==56;)h.push(0),y++;const g=[1732584193,-271733879,-1732584194,271733878],b=new Uint8Array(f+h.length+8);b.set(r),b.set(h,f);const L=f*8;b[b.length-8]=L&255,b[b.length-7]=L>>8&255,b[b.length-6]=L>>16&255,b[b.length-5]=L>>24&255;for(let z=0;z<b.length;z+=64)s(g,d(b.slice(z,z+64)));return g.map(z=>{let w="";for(let I=0;I<4;I++)w+=(z>>I*8&255).toString(16).padStart(2,"0");return w}).join("")}function Sh(n){const r=[[1e3,"M"],[900,"CM"],[500,"D"],[400,"CD"],[100,"C"],[90,"XC"],[50,"L"],[40,"XL"],[10,"X"],[9,"IX"],[5,"V"],[4,"IV"],[1,"I"]];let s="";for(const[c,d]of r)for(;n>=c;)s+=d,n-=c;return s}function wh(n){const r={I:1,V:5,X:10,L:50,C:100,D:500,M:1e3};let s=0;const c=n.trim().toUpperCase();for(let d=0;d<c.length;d++){const f=r[c[d]];if(!f)throw new Error("invalid roman numeral");const h=r[c[d+1]]||0;f<h?s-=f:s+=f}return s}function xh(n){const r=JSON.parse(n);return kn(r,0)}const Jn={A:".-",B:"-...",C:"-.-.",D:"-..",E:".",F:"..-.",G:"--.",H:"....",I:"..",J:".---",K:"-.-",L:".-..",M:"--",N:"-.",O:"---",P:".--.",Q:"--.-",R:".-.",S:"...",T:"-",U:"..-",V:"...-",W:".--",X:"-..-",Y:"-.--",Z:"--..",0:"-----",1:".----",2:"..---",3:"...--",4:"....-",5:".....",6:"-....",7:"--...",8:"---..",9:"----."," ":"/"},Il=Object.fromEntries(Object.entries(Jn).map(([n,r])=>[r,n])),Wo={A:"Alfa",B:"Bravo",C:"Charlie",D:"Delta",E:"Echo",F:"Foxtrot",G:"Golf",H:"Hotel",I:"India",J:"Juliet",K:"Kilo",L:"Lima",M:"Mike",N:"November",O:"Oscar",P:"Papa",Q:"Quebec",R:"Romeo",S:"Sierra",T:"Tango",U:"Uniform",V:"Victor",W:"Whiskey",X:"X-ray",Y:"Yankee",Z:"Zulu"},em={"text→base64":n=>btoa(unescape(encodeURIComponent(n))),"base64→text":n=>decodeURIComponent(escape(atob(n.trim()))),"text→base58":n=>eu(n),"base58→text":n=>tu(n),"text→base32":n=>{const r="ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",s=new TextEncoder().encode(n);let c="";for(const f of s)c+=f.toString(2).padStart(8,"0");for(;c.length%5;)c+="0";let d="";for(let f=0;f<c.length;f+=5)d+=r[parseInt(c.slice(f,f+5),2)];for(;d.length%8;)d+="=";return d},"base32→text":n=>{const r="ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",s=n.trim().replace(/=+$/,"").toUpperCase();let c="";for(const f of s){const h=r.indexOf(f);if(h<0)throw new Error("bad char");c+=h.toString(2).padStart(5,"0")}const d=[];for(let f=0;f+8<=c.length;f+=8)d.push(parseInt(c.slice(f,f+8),2));return new TextDecoder().decode(new Uint8Array(d))},"text→url":n=>encodeURIComponent(n),"url→text":n=>decodeURIComponent(n),"text→html-ent":n=>n.replace(/[&<>"']/g,r=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[r]),"html-ent→text":n=>{const r=document.createElement("textarea");return r.innerHTML=n,r.value},"text→hex":n=>Array.from(new TextEncoder().encode(n)).map(r=>r.toString(16).padStart(2,"0")).join(" "),"hex→text":n=>{const r=n.replace(/\s+/g,""),s=new Uint8Array(r.match(/.{2}/g).map(c=>parseInt(c,16)));return new TextDecoder().decode(s)},"text→binary":n=>Array.from(new TextEncoder().encode(n)).map(r=>r.toString(2).padStart(8,"0")).join(" "),"binary→text":n=>{const r=n.trim().split(/\s+/);return new TextDecoder().decode(new Uint8Array(r.map(s=>parseInt(s,2))))},"text→unicode":n=>Array.from(n).map(r=>{const s=r.codePointAt(0);return s>65535?`\\u{${s.toString(16)}}`:`\\u${s.toString(16).padStart(4,"0")}`}).join(""),"unicode→text":n=>n.replace(/\\u\{([0-9a-fA-F]+)\}|\\u([0-9a-fA-F]{4})/g,(r,s,c)=>String.fromCodePoint(parseInt(s||c,16))),"text→morse":n=>n.toUpperCase().split("").map(r=>Jn[r]||r).join(" "),"morse→text":n=>n.trim().split(" ").map(r=>Il[r]||r).join(""),"text→nato":n=>n.toUpperCase().split("").map(r=>r===" "?"/":Wo[r]||r).join(" "),"text→uppercase":n=>n.toUpperCase(),"text→lowercase":n=>n.toLowerCase(),"text→titlecase":n=>n.replace(/\b\w/g,r=>r.toUpperCase()),"text→camelcase":n=>n.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g,(r,s)=>s.toUpperCase()),"text→snakecase":n=>n.replace(/([a-z])([A-Z])/g,"$1_$2").replace(/[\s-]+/g,"_").toLowerCase(),"text→kebabcase":n=>n.replace(/([a-z])([A-Z])/g,"$1-$2").replace(/[\s_]+/g,"-").toLowerCase(),"uppercase→text":n=>n,"lowercase→text":n=>n,"titlecase→text":n=>n,"camelcase→text":n=>n.replace(/([A-Z])/g," $1").trim().toLowerCase(),"snakecase→text":n=>n.replace(/_/g," "),"kebabcase→text":n=>n.replace(/-/g," "),"uppercase→lowercase":n=>n.toLowerCase(),"lowercase→uppercase":n=>n.toUpperCase(),"text→rot13":n=>n.replace(/[a-zA-Z]/g,r=>{const s=r<="Z"?65:97;return String.fromCharCode((r.charCodeAt(0)-s+13)%26+s)}),"rot13→text":n=>n.replace(/[a-zA-Z]/g,r=>{const s=r<="Z"?65:97;return String.fromCharCode((r.charCodeAt(0)-s+13)%26+s)}),"text→braille":n=>Qn(n),"braille→text":n=>tr(n),"text→piglatin":n=>nu(n),"piglatin→text":n=>au(n),"text→leetspeak":n=>Array.from(n).map(r=>mu[r.toLowerCase()]||r).join(""),"leetspeak→text":n=>Array.from(n).map(r=>Nl[r]||r).join(""),"text→base64url":n=>btoa(unescape(encodeURIComponent(n))).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,""),"base64url→text":n=>{const r=n.trim().replace(/-/g,"+").replace(/_/g,"/");return decodeURIComponent(escape(atob(r+"=".repeat((4-r.length%4)%4))))},"base64url→base64":n=>{const r=n.trim().replace(/-/g,"+").replace(/_/g,"/");return r+"=".repeat((4-r.length%4)%4)},"base64→base64url":n=>n.trim().replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,""),"base64url→hex":n=>{const r=n.trim().replace(/-/g,"+").replace(/_/g,"/"),s=Uint8Array.from(atob(r+"=".repeat((4-r.length%4)%4)),c=>c.charCodeAt(0));return Array.from(s).map(c=>c.toString(16).padStart(2,"0")).join(" ")},"text→atbash":n=>n.replace(/[a-zA-Z]/g,r=>{const s=r<="Z"?65:97;return String.fromCharCode(s+25-(r.charCodeAt(0)-s))}),"atbash→text":n=>n.replace(/[a-zA-Z]/g,r=>{const s=r<="Z"?65:97;return String.fromCharCode(s+25-(r.charCodeAt(0)-s))}),"atbash→morse":n=>n.replace(/[a-zA-Z]/g,s=>{const c=s<="Z"?65:97;return String.fromCharCode(c+25-(s.charCodeAt(0)-c))}).toUpperCase().split("").map(s=>Jn[s]||s).join(" "),"atbash→braille":n=>Qn(n.replace(/[a-zA-Z]/g,r=>{const s=r<="Z"?65:97;return String.fromCharCode(s+25-(r.charCodeAt(0)-s))})),"rot13→atbash":n=>n.replace(/[a-zA-Z]/g,s=>{const c=s<="Z"?65:97;return String.fromCharCode((s.charCodeAt(0)-c+13)%26+c)}).replace(/[a-zA-Z]/g,s=>{const c=s<="Z"?65:97;return String.fromCharCode(c+25-(s.charCodeAt(0)-c))}),"atbash→rot13":n=>n.replace(/[a-zA-Z]/g,s=>{const c=s<="Z"?65:97;return String.fromCharCode(c+25-(s.charCodeAt(0)-c))}).replace(/[a-zA-Z]/g,s=>{const c=s<="Z"?65:97;return String.fromCharCode((s.charCodeAt(0)-c+13)%26+c)}),"reverse→base64":n=>btoa(unescape(encodeURIComponent(n))),"reverse→morse":n=>n.toUpperCase().split("").map(r=>Jn[r]||r).join(" "),"reverse→braille":n=>Qn(n),"morse→braille":n=>Qn(n.trim().split(" ").map(r=>Il[r]||r).join("")),"braille→morse":n=>tr(n).toUpperCase().split("").map(r=>Jn[r]||r).join(" "),"base64→braille":n=>Qn(decodeURIComponent(escape(atob(n.trim())))),"braille→base64":n=>btoa(unescape(encodeURIComponent(tr(n)))),"leetspeak→morse":n=>Array.from(n).map(s=>Nl[s]||s).join("").toUpperCase().split("").map(s=>Jn[s]||s).join(" "),"leetspeak→braille":n=>Qn(Array.from(n).map(r=>Nl[r]||r).join("")),"piglatin→braille":n=>Qn(au(n)),"braille→piglatin":n=>nu(tr(n)),"morse→binary":n=>{const r=n.trim().split(" ").map(s=>Il[s]||s).join("");return Array.from(new TextEncoder().encode(r)).map(s=>s.toString(2).padStart(8,"0")).join(" ")},"binary→morse":n=>new TextDecoder().decode(new Uint8Array(n.trim().split(/\s+/).map(s=>parseInt(s,2)))).toUpperCase().split("").map(s=>Jn[s]||s).join(" "),"rot13→morse":n=>n.replace(/[a-zA-Z]/g,r=>{const s=r<="Z"?65:97;return String.fromCharCode((r.charCodeAt(0)-s+13)%26+s)}).toUpperCase().split("").map(r=>Jn[r]||r).join(" "),"rot13→braille":n=>Qn(n.replace(/[a-zA-Z]/g,r=>{const s=r<="Z"?65:97;return String.fromCharCode((r.charCodeAt(0)-s+13)%26+s)})),"morse→nato":n=>n.trim().split(" ").map(s=>Il[s]||s).join("").toUpperCase().split("").map(s=>s===" "?"/":Wo[s]||s).join(" "),"nato→morse":n=>{const r=Object.fromEntries(Object.entries(Wo).map(([c,d])=>[d.toLowerCase(),c]));return n.split(/\s+/).map(c=>c==="/"?" ":r[c.toLowerCase()]||c).join("").toUpperCase().split("").map(c=>Jn[c]||c).join(" ")},"braille→nato":n=>tr(n).toUpperCase().split("").map(s=>s===" "?"/":Wo[s]||s).join(" "),"nato→braille":n=>{const r=Object.fromEntries(Object.entries(Wo).map(([c,d])=>[d.toLowerCase(),c])),s=n.split(/\s+/).map(c=>c==="/"?" ":r[c.toLowerCase()]||c).join("");return Qn(s)},"reverse→leetspeak":n=>Array.from(n).map(r=>mu[r.toLowerCase()]||r).join(""),"leetspeak→reverse":n=>[...Array.from(n).map(r=>Nl[r]||r).join("")].reverse().join(""),"reverse→piglatin":n=>nu([...n].reverse().join("")),"piglatin→reverse":n=>[...au(n)].reverse().join(""),"text→reverse":n=>[...n].reverse().join(""),"reverse→text":n=>[...n].reverse().join(""),"text→json-escaped":n=>JSON.stringify(n),"json-escaped→text":n=>JSON.parse(n.trim()),"markdown→html-markup":n=>{let r=n;return r=r.replace(/^### (.+)$/gm,"<h3>$1</h3>"),r=r.replace(/^## (.+)$/gm,"<h2>$1</h2>"),r=r.replace(/^# (.+)$/gm,"<h1>$1</h1>"),r=r.replace(/\*\*\*(.+?)\*\*\*/g,"<strong><em>$1</em></strong>"),r=r.replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>"),r=r.replace(/\*(.+?)\*/g,"<em>$1</em>"),r=r.replace(/`(.+?)`/g,"<code>$1</code>"),r=r.replace(/\[(.+?)\]\((.+?)\)/g,'<a href="$2">$1</a>'),r},"html-markup→plain":n=>{const r=document.createElement("div");return r.innerHTML=n,r.textContent||""},"json→json-min":n=>JSON.stringify(JSON.parse(n)),"json-min→json":n=>JSON.stringify(JSON.parse(n),null,2),"json→csv":n=>{const r=JSON.parse(n);if(!Array.isArray(r)||!r.length)throw new Error("expected array");const s=Object.keys(r[0]),c=d=>{const f=String(d??"");return/[,"\n]/.test(f)?`"${f.replace(/"/g,'""')}"`:f};return[s.map(c).join(","),...r.map(d=>s.map(f=>c(d[f])).join(","))].join(`
`)},"csv→json":n=>{const r=n.trim().split(`
`),s=d=>{const f=[];let h="",y=!1;for(let g=0;g<d.length;g++){const b=d[g];y?b==='"'&&d[g+1]==='"'?(h+='"',g++):b==='"'?y=!1:h+=b:b==='"'?y=!0:b===","?(f.push(h),h=""):h+=b}return f.push(h),f},c=s(r[0]);return JSON.stringify(r.slice(1).map(d=>{const f=s(d),h={};return c.forEach((y,g)=>h[y]=f[g]??""),h}),null,2)},"csv→tsv":n=>{const r=s=>{const c=[];let d="",f=!1;for(let h=0;h<s.length;h++){const y=s[h];f?y==='"'&&s[h+1]==='"'?(d+='"',h++):y==='"'?f=!1:d+=y:y==='"'?f=!0:y===","?(c.push(d),d=""):d+=y}return c.push(d),c};return n.trim().split(`
`).map(s=>r(s).join("	")).join(`
`)},"tsv→csv":n=>{const r=s=>{const c=String(s??"");return/[,"\n]/.test(c)?`"${c.replace(/"/g,'""')}"`:c};return n.trim().split(`
`).map(s=>s.split("	").map(r).join(",")).join(`
`)},"json→tsv":n=>{const r=JSON.parse(n);if(!Array.isArray(r)||!r.length)throw new Error("expected array");const s=Object.keys(r[0]);return[s.join("	"),...r.map(c=>s.map(d=>String(c[d]??"").replace(/\t/g," ")).join("	"))].join(`
`)},"tsv→json":n=>{const r=n.trim().split(`
`),s=r[0].split("	");return JSON.stringify(r.slice(1).map(c=>{const d=c.split("	"),f={};return s.forEach((h,y)=>f[h]=d[y]??""),f}),null,2)},"tsv→yaml":n=>{const r=n.trim().split(`
`),s=r[0].split("	"),c=r.slice(1).map(d=>{const f=d.split("	"),h={};return s.forEach((y,g)=>h[y]=f[g]??""),h});return kn(c,0)},"tsv→xml":n=>{const r=n.trim().split(`
`),s=r[0].split("	");return`<?xml version="1.0"?>
<data>
`+r.slice(1).map(d=>{const f=d.split("	");return`  <row>
`+s.map((h,y)=>`    <${h}>${(f[y]||"").replace(/&/g,"&amp;").replace(/</g,"&lt;")}</${h}>`).join(`
`)+`
  </row>`}).join(`
`)+`
</data>`},"json→yaml":n=>xh(n),"yaml→json":n=>Ji(n),"json→toml":n=>{const r=JSON.parse(n),s=[];function c(d,f){for(const[h,y]of Object.entries(d))if(y!==null&&typeof y=="object"&&!Array.isArray(y)){const g=f?`${f}.${h}`:h;s.push(`
[${g}]`),c(y,g)}else{const g=typeof y=="string"?`"${y}"`:JSON.stringify(y);s.push(`${h} = ${g}`)}}return c(r,""),s.join(`
`).trim()},"toml→json":n=>JSON.stringify(wl(n),null,2),"json→querystring":n=>{const r=JSON.parse(n),s=new URLSearchParams;for(const[c,d]of Object.entries(r))s.set(c,String(d));return s.toString()},"querystring→json":n=>{const r=new URLSearchParams(n.trim().replace(/^\?/,"")),s={};for(const[c,d]of r)s[c]=d;return JSON.stringify(s,null,2)},"yaml→csv":n=>{const r=Ji(n),s=JSON.parse(r);if(!Array.isArray(s))throw new Error("need array");const c=Object.keys(s[0]),d=f=>{const h=String(f??"");return/[,"\n]/.test(h)?`"${h.replace(/"/g,'""')}"`:h};return[c.map(d).join(","),...s.map(f=>c.map(h=>d(f[h])).join(","))].join(`
`)},"xml→json":n=>{const s=new DOMParser().parseFromString(n,"text/xml");if(s.querySelector("parsererror"))throw new Error("invalid XML");function c(d){const f={};if(d.attributes)for(const h of d.attributes)f["@"+h.name]=h.value;for(const h of d.childNodes)if(h.nodeType===3){const y=h.textContent.trim();if(y){if(!Object.keys(f).length)return y;f["#text"]=y}}else if(h.nodeType===1){const y=c(h);f[h.nodeName]?(Array.isArray(f[h.nodeName])||(f[h.nodeName]=[f[h.nodeName]]),f[h.nodeName].push(y)):f[h.nodeName]=y}return f}return JSON.stringify({[s.documentElement.nodeName]:c(s.documentElement)},null,2)},"text→sha1":n=>er("SHA-1",n),"text→sha256":n=>er("SHA-256",n),"text→sha384":n=>er("SHA-384",n),"text→sha512":n=>er("SHA-512",n),"text→md5":n=>Oh(n),"base64→sha256":async n=>{const r=decodeURIComponent(escape(atob(n.trim())));return er("SHA-256",r)},"base64→md5":n=>{const r=decodeURIComponent(escape(atob(n.trim())));return Oh(r)},"timestamp→iso-date":n=>{const r=Number(n.trim()),s=r>1e12?r:r*1e3;return new Date(s).toISOString()},"timestamp→human-date":n=>{const r=Number(n.trim()),s=r>1e12?r:r*1e3;return new Date(s).toUTCString()},"iso-date→timestamp":n=>String(Math.floor(new Date(n.trim()).getTime()/1e3)),"iso-date→human-date":n=>new Date(n.trim()).toUTCString(),"human-date→timestamp":n=>String(Math.floor(new Date(n.trim()).getTime()/1e3)),"human-date→iso-date":n=>new Date(n.trim()).toISOString(),"text→timestamp":n=>{const r=new Date(n.trim());if(isNaN(r.getTime()))throw new Error("bad date");return String(Math.floor(r.getTime()/1e3))},"text→iso-date":n=>{const r=new Date(n.trim());if(isNaN(r.getTime()))throw new Error("bad date");return r.toISOString()},"decimal→numhex":n=>"0x"+parseInt(n.trim(),10).toString(16).toUpperCase(),"numhex→decimal":n=>String(parseInt(n.trim().replace(/^0x/i,""),16)),"decimal→numbin":n=>"0b"+parseInt(n.trim(),10).toString(2),"numbin→decimal":n=>String(parseInt(n.trim().replace(/^0b/i,""),2)),"decimal→numoct":n=>"0o"+parseInt(n.trim(),10).toString(8),"numoct→decimal":n=>String(parseInt(n.trim().replace(/^0o/i,""),8)),"numhex→numbin":n=>"0b"+parseInt(n.trim().replace(/^0x/i,""),16).toString(2),"numbin→numhex":n=>"0x"+parseInt(n.trim().replace(/^0b/i,""),2).toString(16).toUpperCase(),"decimal→roman":n=>{const r=parseInt(n.trim(),10);if(isNaN(r)||r<1||r>3999)throw new Error("1-3999 only");return Sh(r)},"roman→decimal":n=>String(wh(n)),"numhex→roman":n=>{const r=parseInt(n.trim().replace(/^0x/i,""),16);return Sh(r)},"roman→numhex":n=>"0x"+wh(n).toString(16).toUpperCase(),"base64→hex":n=>{const r=Uint8Array.from(atob(n.trim()),s=>s.charCodeAt(0));return Array.from(r).map(s=>s.toString(16).padStart(2,"0")).join(" ")},"hex→base64":n=>{const s=n.replace(/\s+/g,"").match(/.{2}/g).map(c=>parseInt(c,16));return btoa(String.fromCharCode(...s))},"base64→base32":n=>{const r=Uint8Array.from(atob(n.trim()),f=>f.charCodeAt(0)),s="ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";let c="";for(const f of r)c+=f.toString(2).padStart(8,"0");for(;c.length%5;)c+="0";let d="";for(let f=0;f<c.length;f+=5)d+=s[parseInt(c.slice(f,f+5),2)];for(;d.length%8;)d+="=";return d},"base32→base64":n=>{const r="ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",s=n.trim().replace(/=+$/,"").toUpperCase();let c="";for(const f of s){const h=r.indexOf(f);if(h<0)throw new Error("bad char");c+=h.toString(2).padStart(5,"0")}const d=[];for(let f=0;f+8<=c.length;f+=8)d.push(parseInt(c.slice(f,f+8),2));return btoa(String.fromCharCode(...d))},"base64→binary":n=>{const r=Uint8Array.from(atob(n.trim()),s=>s.charCodeAt(0));return Array.from(r).map(s=>s.toString(2).padStart(8,"0")).join(" ")},"binary→base64":n=>{const r=n.trim().split(/\s+/).map(s=>parseInt(s,2));return btoa(String.fromCharCode(...r))},"hex→binary":n=>n.replace(/\s+/g,"").match(/.{2}/g).map(s=>parseInt(s,16).toString(2).padStart(8,"0")).join(" "),"binary→hex":n=>n.trim().split(/\s+/).map(r=>parseInt(r,2).toString(16).padStart(2,"0")).join(" "),"url→base64":n=>btoa(unescape(encodeURIComponent(decodeURIComponent(n)))),"base64→url":n=>encodeURIComponent(decodeURIComponent(escape(atob(n.trim())))),"url→hex":n=>{const r=decodeURIComponent(n);return Array.from(new TextEncoder().encode(r)).map(s=>s.toString(16).padStart(2,"0")).join(" ")},"hex→url":n=>{const r=n.replace(/\s+/g,""),s=new Uint8Array(r.match(/.{2}/g).map(c=>parseInt(c,16)));return encodeURIComponent(new TextDecoder().decode(s))},"base32→hex":n=>{const r="ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",s=n.trim().replace(/=+$/,"").toUpperCase();let c="";for(const f of s){const h=r.indexOf(f);if(h<0)throw new Error("bad char");c+=h.toString(2).padStart(5,"0")}const d=[];for(let f=0;f+8<=c.length;f+=8)d.push(parseInt(c.slice(f,f+8),2));return d.map(f=>f.toString(16).padStart(2,"0")).join(" ")},"hex→base32":n=>{const r="ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",c=n.replace(/\s+/g,"").match(/.{2}/g).map(h=>parseInt(h,16));let d="";for(const h of c)d+=h.toString(2).padStart(8,"0");for(;d.length%5;)d+="0";let f="";for(let h=0;h<d.length;h+=5)f+=r[parseInt(d.slice(h,h+5),2)];for(;f.length%8;)f+="=";return f},"base58→base64":n=>btoa(unescape(encodeURIComponent(tu(n)))),"base64→base58":n=>eu(decodeURIComponent(escape(atob(n.trim())))),"base58→hex":n=>{const r=tu(n);return Array.from(new TextEncoder().encode(r)).map(s=>s.toString(16).padStart(2,"0")).join(" ")},"hex→base58":n=>{const r=n.replace(/\s+/g,""),s=new Uint8Array(r.match(/.{2}/g).map(c=>parseInt(c,16)));return eu(new TextDecoder().decode(s))},"json→xml":n=>{const r=JSON.parse(n);function s(d,f){if(d==null)return`<${f}/>`;if(Array.isArray(d))return d.map(h=>s(h,f)).join(`
`);if(typeof d=="object"){const h=Object.entries(d).map(([y,g])=>s(g,y)).join(`
  `);return`<${f}>
  ${h}
</${f}>`}return`<${f}>${String(d).replace(/&/g,"&amp;").replace(/</g,"&lt;")}</${f}>`}const c=Object.keys(r);return c.length===1?`<?xml version="1.0"?>
`+s(r[c[0]],c[0]):`<?xml version="1.0"?>
`+s(r,"root")},"xml→yaml":n=>{const s=new DOMParser().parseFromString(n,"text/xml");if(s.querySelector("parsererror"))throw new Error("invalid XML");function c(f){const h={};if(f.attributes)for(const y of f.attributes)h["@"+y.name]=y.value;for(const y of f.childNodes)if(y.nodeType===3){const g=y.textContent.trim();if(g){if(!Object.keys(h).length)return g;h["#text"]=g}}else if(y.nodeType===1){const g=c(y);h[y.nodeName]?(Array.isArray(h[y.nodeName])||(h[y.nodeName]=[h[y.nodeName]]),h[y.nodeName].push(g)):h[y.nodeName]=g}return h}const d={[s.documentElement.nodeName]:c(s.documentElement)};return kn(d,0)},"csv→yaml":n=>{const r=n.trim().split(`
`),s=f=>{const h=[];let y="",g=!1;for(let b=0;b<f.length;b++){const L=f[b];g?L==='"'&&f[b+1]==='"'?(y+='"',b++):L==='"'?g=!1:y+=L:L==='"'?g=!0:L===","?(h.push(y),y=""):y+=L}return h.push(y),h},c=s(r[0]),d=r.slice(1).map(f=>{const h=s(f),y={};return c.forEach((g,b)=>y[g]=h[b]??""),y});return kn(d,0)},"toml→yaml":n=>kn(wl(n),0),"yaml→toml":n=>{const r=Ji(n),s=JSON.parse(r),c=[];function d(f,h){for(const[y,g]of Object.entries(f))if(g!==null&&typeof g=="object"&&!Array.isArray(g)){const b=h?`${h}.${y}`:y;c.push(`
[${b}]`),d(g,b)}else{const b=typeof g=="string"?`"${g}"`:JSON.stringify(g);c.push(`${y} = ${b}`)}}return d(s,""),c.join(`
`).trim()},"json-min→yaml":n=>xh(JSON.stringify(JSON.parse(n))),"yaml→json-min":n=>JSON.stringify(JSON.parse(Ji(n))),"json-min→csv":n=>{const r=JSON.parse(n);if(!Array.isArray(r)||!r.length)throw new Error("expected array");const s=Object.keys(r[0]),c=d=>{const f=String(d??"");return/[,"\n]/.test(f)?`"${f.replace(/"/g,'""')}"`:f};return[s.map(c).join(","),...r.map(d=>s.map(f=>c(d[f])).join(","))].join(`
`)},"json-min→toml":n=>{const r=JSON.parse(n),s=[];function c(d,f){for(const[h,y]of Object.entries(d))if(y!==null&&typeof y=="object"&&!Array.isArray(y)){const g=f?`${f}.${h}`:h;s.push(`
[${g}]`),c(y,g)}else{const g=typeof y=="string"?`"${y}"`:JSON.stringify(y);s.push(`${h} = ${g}`)}}return c(r,""),s.join(`
`).trim()},"csv→toml":n=>{const r=n.trim().split(`
`),s=f=>{const h=[];let y="",g=!1;for(let b=0;b<f.length;b++){const L=f[b];g?L==='"'&&f[b+1]==='"'?(y+='"',b++):L==='"'?g=!1:y+=L:L==='"'?g=!0:L===","?(h.push(y),y=""):y+=L}return h.push(y),h},c=s(r[0]);return r.slice(1).map(f=>{const h=s(f),y={};return c.forEach((g,b)=>y[g]=h[b]??""),y}).map(f=>{const h=`[[item]]
`,y=Object.entries(f).map(([g,b])=>/^-?\d+$/.test(b)?`${g} = ${b}`:/^-?\d+\.\d+$/.test(b)?`${g} = ${b}`:b==="true"||b==="false"?`${g} = ${b}`:`${g} = "${b}"`).join(`
`);return h+y}).join(`

`)},"toml→csv":n=>{const r=wl(n),c=Object.values(r).find(h=>Array.isArray(h))||[r];if(!Array.isArray(c)||!c.length)throw new Error("no tabular data");const d=Object.keys(c[0]),f=h=>{const y=String(h??"");return/[,"\n]/.test(y)?`"${y.replace(/"/g,'""')}"`:y};return[d.map(f).join(","),...c.map(h=>d.map(y=>f(h[y])).join(","))].join(`
`)},"querystring→yaml":n=>{const r=new URLSearchParams(n.trim().replace(/^\?/,"")),s={};for(const[c,d]of r)s[c]=d;return kn(s,0)},"yaml→querystring":n=>{const r=Ji(n),s=JSON.parse(r),c=new URLSearchParams;for(const[d,f]of Object.entries(s))c.set(d,String(f));return c.toString()},"querystring→toml":n=>{const r=new URLSearchParams(n.trim().replace(/^\?/,"")),s=[];for(const[c,d]of r)/^-?\d+$/.test(d)?s.push(`${c} = ${d}`):d==="true"||d==="false"?s.push(`${c} = ${d}`):s.push(`${c} = "${d}"`);return s.join(`
`)},"nato→text":n=>{const r=Object.fromEntries(Object.entries(Wo).map(([s,c])=>[c.toLowerCase(),s]));return n.split(/\s+/).map(s=>s==="/"?" ":r[s.toLowerCase()]||s).join("")},"bytes→kilobytes":n=>(parseFloat(n.trim())/1024).toPrecision(6).replace(/\.?0+$/,""),"bytes→megabytes":n=>(parseFloat(n.trim())/(1024*1024)).toPrecision(6).replace(/\.?0+$/,""),"bytes→gigabytes":n=>(parseFloat(n.trim())/(1024*1024*1024)).toPrecision(6).replace(/\.?0+$/,""),"kilobytes→bytes":n=>String(Math.round(parseFloat(n.trim())*1024)),"kilobytes→megabytes":n=>(parseFloat(n.trim())/1024).toPrecision(6).replace(/\.?0+$/,""),"kilobytes→gigabytes":n=>(parseFloat(n.trim())/(1024*1024)).toPrecision(6).replace(/\.?0+$/,""),"megabytes→bytes":n=>String(Math.round(parseFloat(n.trim())*1024*1024)),"megabytes→kilobytes":n=>String(Math.round(parseFloat(n.trim())*1024)),"megabytes→gigabytes":n=>(parseFloat(n.trim())/1024).toPrecision(6).replace(/\.?0+$/,""),"gigabytes→bytes":n=>String(Math.round(parseFloat(n.trim())*1024*1024*1024)),"gigabytes→kilobytes":n=>String(Math.round(parseFloat(n.trim())*1024*1024)),"gigabytes→megabytes":n=>String(Math.round(parseFloat(n.trim())*1024)),"bits→bytes":n=>(parseFloat(n.trim())/8).toPrecision(6).replace(/\.?0+$/,""),"bytes→bits":n=>String(Math.round(parseFloat(n.trim())*8)),"bits→kilobytes":n=>(parseFloat(n.trim())/8/1024).toPrecision(6).replace(/\.?0+$/,""),"bits→megabytes":n=>(parseFloat(n.trim())/8/1048576).toPrecision(6).replace(/\.?0+$/,""),"kilobytes→bits":n=>String(Math.round(parseFloat(n.trim())*1024*8)),"megabytes→bits":n=>String(Math.round(parseFloat(n.trim())*1048576*8)),"bits→gigabytes":n=>(parseFloat(n.trim())/8/1073741824).toPrecision(6).replace(/\.?0+$/,""),"gigabytes→bits":n=>String(Math.round(parseFloat(n.trim())*1073741824*8)),"bits→terabytes":n=>(parseFloat(n.trim())/8/1099511627776).toPrecision(6).replace(/\.?0+$/,""),"terabytes→bits":n=>String(Math.round(parseFloat(n.trim())*1099511627776*8)),"bits→petabytes":n=>(parseFloat(n.trim())/8/0x4000000000000).toPrecision(6).replace(/\.?0+$/,""),"petabytes→bits":n=>String(Math.round(parseFloat(n.trim())*0x4000000000000*8)),"bits→kib":n=>(parseFloat(n.trim())/8/1024).toPrecision(6).replace(/\.?0+$/,""),"kib→bits":n=>String(Math.round(parseFloat(n.trim())*1024*8)),"bits→mib":n=>(parseFloat(n.trim())/8/1048576).toPrecision(6).replace(/\.?0+$/,""),"mib→bits":n=>String(Math.round(parseFloat(n.trim())*1048576*8)),"bits→gib":n=>(parseFloat(n.trim())/8/1073741824).toPrecision(6).replace(/\.?0+$/,""),"gib→bits":n=>String(Math.round(parseFloat(n.trim())*1073741824*8)),"bytes→kib":n=>(parseFloat(n.trim())/1024).toPrecision(6).replace(/\.?0+$/,""),"kib→bytes":n=>String(Math.round(parseFloat(n.trim())*1024)),"bytes→mib":n=>(parseFloat(n.trim())/1048576).toPrecision(6).replace(/\.?0+$/,""),"mib→bytes":n=>String(Math.round(parseFloat(n.trim())*1048576)),"bytes→gib":n=>(parseFloat(n.trim())/1073741824).toPrecision(6).replace(/\.?0+$/,""),"gib→bytes":n=>String(Math.round(parseFloat(n.trim())*1073741824)),"kib→mib":n=>(parseFloat(n.trim())/1024).toPrecision(6).replace(/\.?0+$/,""),"mib→kib":n=>String(Math.round(parseFloat(n.trim())*1024)),"kib→gib":n=>(parseFloat(n.trim())/1048576).toPrecision(6).replace(/\.?0+$/,""),"gib→kib":n=>String(Math.round(parseFloat(n.trim())*1048576)),"mib→gib":n=>(parseFloat(n.trim())/1024).toPrecision(6).replace(/\.?0+$/,""),"gib→mib":n=>String(Math.round(parseFloat(n.trim())*1024)),"kilobytes→kib":n=>(parseFloat(n.trim())*1e3/1024).toPrecision(6).replace(/\.?0+$/,""),"kib→kilobytes":n=>(parseFloat(n.trim())*1024/1e3).toPrecision(6).replace(/\.?0+$/,""),"megabytes→mib":n=>(parseFloat(n.trim())*1e6/1048576).toPrecision(6).replace(/\.?0+$/,""),"mib→megabytes":n=>(parseFloat(n.trim())*1048576/1e6).toPrecision(6).replace(/\.?0+$/,""),"gigabytes→gib":n=>(parseFloat(n.trim())*1e9/1073741824).toPrecision(6).replace(/\.?0+$/,""),"gib→gigabytes":n=>(parseFloat(n.trim())*1073741824/1e9).toPrecision(6).replace(/\.?0+$/,""),"celsius→fahrenheit":n=>(parseFloat(n.trim())*9/5+32).toFixed(2)+" °F","celsius→kelvin":n=>(parseFloat(n.trim())+273.15).toFixed(2)+" K","fahrenheit→celsius":n=>((parseFloat(n.trim())-32)*5/9).toFixed(2)+" °C","fahrenheit→kelvin":n=>((parseFloat(n.trim())-32)*5/9+273.15).toFixed(2)+" K","kelvin→celsius":n=>(parseFloat(n.trim())-273.15).toFixed(2)+" °C","kelvin→fahrenheit":n=>((parseFloat(n.trim())-273.15)*9/5+32).toFixed(2)+" °F","celsius→rankine":n=>((parseFloat(n.trim())+273.15)*1.8).toFixed(2)+" °R","rankine→celsius":n=>(parseFloat(n.trim())/1.8-273.15).toFixed(2)+" °C","fahrenheit→rankine":n=>(parseFloat(n.trim())+459.67).toFixed(2)+" °R","rankine→fahrenheit":n=>(parseFloat(n.trim())-459.67).toFixed(2)+" °F","kelvin→rankine":n=>(parseFloat(n.trim())*1.8).toFixed(2)+" °R","rankine→kelvin":n=>(parseFloat(n.trim())/1.8).toFixed(4)+" K","numoct→numhex":n=>"0x"+parseInt(n.trim().replace(/^0o/i,""),8).toString(16).toUpperCase(),"numhex→numoct":n=>"0o"+parseInt(n.trim().replace(/^0x/i,""),16).toString(8),"numoct→numbin":n=>"0b"+parseInt(n.trim().replace(/^0o/i,""),8).toString(2),"numbin→numoct":n=>"0o"+parseInt(n.trim().replace(/^0b/i,""),2).toString(8),"markdown→plain":n=>{let r=n;return r=r.replace(/^#{1,6}\s+/gm,""),r=r.replace(/\*\*\*(.+?)\*\*\*/g,"$1"),r=r.replace(/\*\*(.+?)\*\*/g,"$1"),r=r.replace(/\*(.+?)\*/g,"$1"),r=r.replace(/~~(.+?)~~/g,"$1"),r=r.replace(/`(.+?)`/g,"$1"),r=r.replace(/\[(.+?)\]\(.+?\)/g,"$1"),r=r.replace(/!\[.*?\]\(.+?\)/g,""),r=r.replace(/^>\s?/gm,""),r=r.replace(/^[-*+]\s/gm,""),r=r.replace(/^\d+\.\s/gm,""),r=r.replace(/^---+$/gm,""),r.trim()},"json-min→querystring":n=>{const r=JSON.parse(n),s=new URLSearchParams;for(const[c,d]of Object.entries(r))s.set(c,String(d));return s.toString()},"querystring→json-min":n=>{const r=new URLSearchParams(n.trim().replace(/^\?/,"")),s={};for(const[c,d]of r)s[c]=d;return JSON.stringify(s)},"inches→cm":n=>(parseFloat(n)*2.54).toFixed(4).replace(/\.?0+$/,""),"cm→inches":n=>(parseFloat(n)/2.54).toFixed(4).replace(/\.?0+$/,""),"inches→mm":n=>(parseFloat(n)*25.4).toFixed(2).replace(/\.?0+$/,""),"mm→inches":n=>(parseFloat(n)/25.4).toFixed(4).replace(/\.?0+$/,""),"inches→feet":n=>(parseFloat(n)/12).toFixed(4).replace(/\.?0+$/,""),"feet→inches":n=>(parseFloat(n)*12).toFixed(2).replace(/\.?0+$/,""),"inches→meters":n=>(parseFloat(n)*.0254).toFixed(4).replace(/\.?0+$/,""),"meters→inches":n=>(parseFloat(n)/.0254).toFixed(2).replace(/\.?0+$/,""),"cm→mm":n=>(parseFloat(n)*10).toFixed(2).replace(/\.?0+$/,""),"mm→cm":n=>(parseFloat(n)/10).toFixed(4).replace(/\.?0+$/,""),"cm→meters":n=>(parseFloat(n)/100).toFixed(4).replace(/\.?0+$/,""),"meters→cm":n=>(parseFloat(n)*100).toFixed(2).replace(/\.?0+$/,""),"cm→feet":n=>(parseFloat(n)/30.48).toFixed(4).replace(/\.?0+$/,""),"feet→cm":n=>(parseFloat(n)*30.48).toFixed(2).replace(/\.?0+$/,""),"mm→meters":n=>(parseFloat(n)/1e3).toFixed(4).replace(/\.?0+$/,""),"meters→mm":n=>(parseFloat(n)*1e3).toFixed(2).replace(/\.?0+$/,""),"feet→meters":n=>(parseFloat(n)*.3048).toFixed(4).replace(/\.?0+$/,""),"meters→feet":n=>(parseFloat(n)/.3048).toFixed(4).replace(/\.?0+$/,""),"mm→feet":n=>(parseFloat(n)/304.8).toFixed(4).replace(/\.?0+$/,""),"feet→mm":n=>(parseFloat(n)*304.8).toFixed(2).replace(/\.?0+$/,""),"kg→lb":n=>(parseFloat(n)*2.20462).toFixed(4).replace(/\.?0+$/,""),"lb→kg":n=>(parseFloat(n)/2.20462).toFixed(4).replace(/\.?0+$/,""),"kg→oz":n=>(parseFloat(n)*35.274).toFixed(2).replace(/\.?0+$/,""),"oz→kg":n=>(parseFloat(n)/35.274).toFixed(4).replace(/\.?0+$/,""),"kg→grams":n=>(parseFloat(n)*1e3).toFixed(2).replace(/\.?0+$/,""),"grams→kg":n=>(parseFloat(n)/1e3).toFixed(4).replace(/\.?0+$/,""),"lb→oz":n=>(parseFloat(n)*16).toFixed(2).replace(/\.?0+$/,""),"oz→lb":n=>(parseFloat(n)/16).toFixed(4).replace(/\.?0+$/,""),"lb→grams":n=>(parseFloat(n)*453.592).toFixed(2).replace(/\.?0+$/,""),"grams→lb":n=>(parseFloat(n)/453.592).toFixed(4).replace(/\.?0+$/,""),"oz→grams":n=>(parseFloat(n)*28.3495).toFixed(2).replace(/\.?0+$/,""),"grams→oz":n=>(parseFloat(n)/28.3495).toFixed(4).replace(/\.?0+$/,""),"kg→ton-metric":n=>(parseFloat(n)/1e3).toFixed(6).replace(/\.?0+$/,""),"ton-metric→kg":n=>(parseFloat(n)*1e3).toFixed(2).replace(/\.?0+$/,""),"kg→ton-short":n=>(parseFloat(n)/907.185).toFixed(6).replace(/\.?0+$/,""),"ton-short→kg":n=>(parseFloat(n)*907.185).toFixed(2).replace(/\.?0+$/,""),"kg→stone":n=>(parseFloat(n)/6.35029).toFixed(4).replace(/\.?0+$/,""),"stone→kg":n=>(parseFloat(n)*6.35029).toFixed(4).replace(/\.?0+$/,""),"lb→stone":n=>(parseFloat(n)/14).toFixed(4).replace(/\.?0+$/,""),"stone→lb":n=>(parseFloat(n)*14).toFixed(2).replace(/\.?0+$/,""),"ton-metric→lb":n=>(parseFloat(n)*2204.62).toFixed(2).replace(/\.?0+$/,""),"lb→ton-metric":n=>(parseFloat(n)/2204.62).toFixed(6).replace(/\.?0+$/,""),"ton-metric→ton-short":n=>(parseFloat(n)*1.10231).toFixed(4).replace(/\.?0+$/,""),"ton-short→ton-metric":n=>(parseFloat(n)/1.10231).toFixed(4).replace(/\.?0+$/,""),"ton-short→lb":n=>(parseFloat(n)*2e3).toFixed(2).replace(/\.?0+$/,""),"lb→ton-short":n=>(parseFloat(n)/2e3).toFixed(6).replace(/\.?0+$/,""),"miles→km":n=>(parseFloat(n)*1.60934).toFixed(4).replace(/\.?0+$/,""),"km→miles":n=>(parseFloat(n)/1.60934).toFixed(4).replace(/\.?0+$/,""),"miles→yards":n=>(parseFloat(n)*1760).toFixed(2).replace(/\.?0+$/,""),"yards→miles":n=>(parseFloat(n)/1760).toFixed(6).replace(/\.?0+$/,""),"miles→meters":n=>(parseFloat(n)*1609.34).toFixed(2).replace(/\.?0+$/,""),"meters→miles":n=>(parseFloat(n)/1609.34).toFixed(6).replace(/\.?0+$/,""),"miles→nautmiles":n=>(parseFloat(n)*.868976).toFixed(4).replace(/\.?0+$/,""),"nautmiles→miles":n=>(parseFloat(n)/.868976).toFixed(4).replace(/\.?0+$/,""),"km→yards":n=>(parseFloat(n)*1093.61).toFixed(2).replace(/\.?0+$/,""),"yards→km":n=>(parseFloat(n)/1093.61).toFixed(6).replace(/\.?0+$/,""),"km→meters":n=>(parseFloat(n)*1e3).toFixed(2).replace(/\.?0+$/,""),"meters→km":n=>(parseFloat(n)/1e3).toFixed(6).replace(/\.?0+$/,""),"km→nautmiles":n=>(parseFloat(n)*.539957).toFixed(4).replace(/\.?0+$/,""),"nautmiles→km":n=>(parseFloat(n)/.539957).toFixed(4).replace(/\.?0+$/,""),"yards→meters":n=>(parseFloat(n)*.9144).toFixed(4).replace(/\.?0+$/,""),"meters→yards":n=>(parseFloat(n)/.9144).toFixed(4).replace(/\.?0+$/,""),"yards→feet":n=>(parseFloat(n)*3).toFixed(2).replace(/\.?0+$/,""),"feet→yards":n=>(parseFloat(n)/3).toFixed(4).replace(/\.?0+$/,""),"nautmiles→meters":n=>(parseFloat(n)*1852).toFixed(2).replace(/\.?0+$/,""),"meters→nautmiles":n=>(parseFloat(n)/1852).toFixed(6).replace(/\.?0+$/,""),"mph→kmh":n=>(parseFloat(n)*1.60934).toFixed(4).replace(/\.?0+$/,""),"kmh→mph":n=>(parseFloat(n)/1.60934).toFixed(4).replace(/\.?0+$/,""),"mph→ms":n=>(parseFloat(n)*.44704).toFixed(4).replace(/\.?0+$/,""),"ms→mph":n=>(parseFloat(n)/.44704).toFixed(4).replace(/\.?0+$/,""),"mph→knots":n=>(parseFloat(n)*.868976).toFixed(4).replace(/\.?0+$/,""),"knots→mph":n=>(parseFloat(n)/.868976).toFixed(4).replace(/\.?0+$/,""),"kmh→ms":n=>(parseFloat(n)/3.6).toFixed(4).replace(/\.?0+$/,""),"ms→kmh":n=>(parseFloat(n)*3.6).toFixed(4).replace(/\.?0+$/,""),"kmh→knots":n=>(parseFloat(n)*.539957).toFixed(4).replace(/\.?0+$/,""),"knots→kmh":n=>(parseFloat(n)/.539957).toFixed(4).replace(/\.?0+$/,""),"ms→knots":n=>(parseFloat(n)*1.94384).toFixed(4).replace(/\.?0+$/,""),"knots→ms":n=>(parseFloat(n)/1.94384).toFixed(4).replace(/\.?0+$/,""),"fps→mph":n=>(parseFloat(n)*.681818).toFixed(4).replace(/\.?0+$/,""),"mph→fps":n=>(parseFloat(n)*1.46667).toFixed(4).replace(/\.?0+$/,""),"fps→ms":n=>(parseFloat(n)*.3048).toFixed(4).replace(/\.?0+$/,""),"ms→fps":n=>(parseFloat(n)/.3048).toFixed(4).replace(/\.?0+$/,""),"fps→kmh":n=>(parseFloat(n)*1.09728).toFixed(4).replace(/\.?0+$/,""),"kmh→fps":n=>(parseFloat(n)/1.09728).toFixed(4).replace(/\.?0+$/,""),"fps→knots":n=>(parseFloat(n)*.592484).toFixed(4).replace(/\.?0+$/,""),"knots→fps":n=>(parseFloat(n)/.592484).toFixed(4).replace(/\.?0+$/,""),"mach→ms":n=>(parseFloat(n)*343).toFixed(2).replace(/\.?0+$/,""),"ms→mach":n=>(parseFloat(n)/343).toFixed(6).replace(/\.?0+$/,""),"mach→mph":n=>(parseFloat(n)*767.269).toFixed(2).replace(/\.?0+$/,""),"mph→mach":n=>(parseFloat(n)/767.269).toFixed(6).replace(/\.?0+$/,""),"mach→kmh":n=>(parseFloat(n)*1235.52).toFixed(2).replace(/\.?0+$/,""),"kmh→mach":n=>(parseFloat(n)/1235.52).toFixed(6).replace(/\.?0+$/,""),"mach→knots":n=>(parseFloat(n)*667.607).toFixed(2).replace(/\.?0+$/,""),"knots→mach":n=>(parseFloat(n)/667.607).toFixed(6).replace(/\.?0+$/,""),"mach→fps":n=>(parseFloat(n)*1125.33).toFixed(2).replace(/\.?0+$/,""),"fps→mach":n=>(parseFloat(n)/1125.33).toFixed(6).replace(/\.?0+$/,""),"sqft→sqm":n=>(parseFloat(n)*.092903).toFixed(4).replace(/\.?0+$/,""),"sqm→sqft":n=>(parseFloat(n)/.092903).toFixed(4).replace(/\.?0+$/,""),"sqft→acres":n=>(parseFloat(n)/43560).toFixed(6).replace(/\.?0+$/,""),"acres→sqft":n=>(parseFloat(n)*43560).toFixed(2).replace(/\.?0+$/,""),"sqft→hectares":n=>(parseFloat(n)/107639).toFixed(6).replace(/\.?0+$/,""),"hectares→sqft":n=>(parseFloat(n)*107639).toFixed(2).replace(/\.?0+$/,""),"sqm→acres":n=>(parseFloat(n)/4046.86).toFixed(6).replace(/\.?0+$/,""),"acres→sqm":n=>(parseFloat(n)*4046.86).toFixed(2).replace(/\.?0+$/,""),"sqm→hectares":n=>(parseFloat(n)/1e4).toFixed(6).replace(/\.?0+$/,""),"hectares→sqm":n=>(parseFloat(n)*1e4).toFixed(2).replace(/\.?0+$/,""),"acres→hectares":n=>(parseFloat(n)*.404686).toFixed(6).replace(/\.?0+$/,""),"hectares→acres":n=>(parseFloat(n)/.404686).toFixed(4).replace(/\.?0+$/,""),"liters→gallons":n=>(parseFloat(n)*.264172).toFixed(4).replace(/\.?0+$/,""),"gallons→liters":n=>(parseFloat(n)/.264172).toFixed(4).replace(/\.?0+$/,""),"liters→ml":n=>(parseFloat(n)*1e3).toFixed(2).replace(/\.?0+$/,""),"ml→liters":n=>(parseFloat(n)/1e3).toFixed(4).replace(/\.?0+$/,""),"liters→floz":n=>(parseFloat(n)*33.814).toFixed(4).replace(/\.?0+$/,""),"floz→liters":n=>(parseFloat(n)/33.814).toFixed(4).replace(/\.?0+$/,""),"liters→cups":n=>(parseFloat(n)*4.22675).toFixed(4).replace(/\.?0+$/,""),"cups→liters":n=>(parseFloat(n)/4.22675).toFixed(4).replace(/\.?0+$/,""),"gallons→ml":n=>(parseFloat(n)*3785.41).toFixed(2).replace(/\.?0+$/,""),"ml→gallons":n=>(parseFloat(n)/3785.41).toFixed(6).replace(/\.?0+$/,""),"gallons→floz":n=>(parseFloat(n)*128).toFixed(2).replace(/\.?0+$/,""),"floz→gallons":n=>(parseFloat(n)/128).toFixed(4).replace(/\.?0+$/,""),"gallons→cups":n=>(parseFloat(n)*16).toFixed(2).replace(/\.?0+$/,""),"cups→gallons":n=>(parseFloat(n)/16).toFixed(4).replace(/\.?0+$/,""),"ml→floz":n=>(parseFloat(n)*.033814).toFixed(4).replace(/\.?0+$/,""),"floz→ml":n=>(parseFloat(n)/.033814).toFixed(2).replace(/\.?0+$/,""),"ml→cups":n=>(parseFloat(n)*.00422675).toFixed(4).replace(/\.?0+$/,""),"cups→ml":n=>(parseFloat(n)/.00422675).toFixed(2).replace(/\.?0+$/,""),"floz→cups":n=>(parseFloat(n)/8).toFixed(4).replace(/\.?0+$/,""),"cups→floz":n=>(parseFloat(n)*8).toFixed(2).replace(/\.?0+$/,""),"dur-seconds→dur-minutes":n=>(parseFloat(n)/60).toFixed(4).replace(/\.?0+$/,""),"dur-minutes→dur-seconds":n=>(parseFloat(n)*60).toFixed(2).replace(/\.?0+$/,""),"dur-seconds→dur-hours":n=>(parseFloat(n)/3600).toFixed(6).replace(/\.?0+$/,""),"dur-hours→dur-seconds":n=>(parseFloat(n)*3600).toFixed(2).replace(/\.?0+$/,""),"dur-seconds→dur-days":n=>(parseFloat(n)/86400).toFixed(6).replace(/\.?0+$/,""),"dur-days→dur-seconds":n=>(parseFloat(n)*86400).toFixed(2).replace(/\.?0+$/,""),"dur-minutes→dur-hours":n=>(parseFloat(n)/60).toFixed(4).replace(/\.?0+$/,""),"dur-hours→dur-minutes":n=>(parseFloat(n)*60).toFixed(2).replace(/\.?0+$/,""),"dur-minutes→dur-days":n=>(parseFloat(n)/1440).toFixed(6).replace(/\.?0+$/,""),"dur-days→dur-minutes":n=>(parseFloat(n)*1440).toFixed(2).replace(/\.?0+$/,""),"dur-hours→dur-days":n=>(parseFloat(n)/24).toFixed(4).replace(/\.?0+$/,""),"dur-days→dur-hours":n=>(parseFloat(n)*24).toFixed(2).replace(/\.?0+$/,""),"dur-ms→dur-days":n=>(parseFloat(n)/864e5).toFixed(8).replace(/\.?0+$/,""),"dur-days→dur-ms":n=>(parseFloat(n)*864e5).toFixed(0),"dur-weeks→dur-seconds":n=>(parseFloat(n)*604800).toFixed(0),"dur-seconds→dur-weeks":n=>(parseFloat(n)/604800).toFixed(8).replace(/\.?0+$/,""),"dur-weeks→dur-ms":n=>(parseFloat(n)*6048e5).toFixed(0),"dur-ms→dur-weeks":n=>(parseFloat(n)/6048e5).toFixed(10).replace(/\.?0+$/,""),"joules→calories":n=>(parseFloat(n)*.239006).toFixed(4).replace(/\.?0+$/,""),"calories→joules":n=>(parseFloat(n)/.239006).toFixed(4).replace(/\.?0+$/,""),"joules→kcal":n=>(parseFloat(n)/4184).toFixed(6).replace(/\.?0+$/,""),"kcal→joules":n=>(parseFloat(n)*4184).toFixed(2).replace(/\.?0+$/,""),"joules→kwh":n=>(parseFloat(n)/36e5).toFixed(8).replace(/\.?0+$/,""),"kwh→joules":n=>(parseFloat(n)*36e5).toFixed(2).replace(/\.?0+$/,""),"joules→btu":n=>(parseFloat(n)*947817e-9).toFixed(6).replace(/\.?0+$/,""),"btu→joules":n=>(parseFloat(n)/947817e-9).toFixed(2).replace(/\.?0+$/,""),"calories→kcal":n=>(parseFloat(n)/1e3).toFixed(4).replace(/\.?0+$/,""),"kcal→calories":n=>(parseFloat(n)*1e3).toFixed(2).replace(/\.?0+$/,""),"calories→kwh":n=>(parseFloat(n)/860421).toFixed(8).replace(/\.?0+$/,""),"kwh→calories":n=>(parseFloat(n)*860421).toFixed(2).replace(/\.?0+$/,""),"calories→btu":n=>(parseFloat(n)*.003968).toFixed(6).replace(/\.?0+$/,""),"btu→calories":n=>(parseFloat(n)/.003968).toFixed(2).replace(/\.?0+$/,""),"kcal→kwh":n=>(parseFloat(n)/860.421).toFixed(6).replace(/\.?0+$/,""),"kwh→kcal":n=>(parseFloat(n)*860.421).toFixed(2).replace(/\.?0+$/,""),"kcal→btu":n=>(parseFloat(n)*3.96832).toFixed(4).replace(/\.?0+$/,""),"btu→kcal":n=>(parseFloat(n)/3.96832).toFixed(4).replace(/\.?0+$/,""),"kwh→btu":n=>(parseFloat(n)*3412.14).toFixed(2).replace(/\.?0+$/,""),"btu→kwh":n=>(parseFloat(n)/3412.14).toFixed(6).replace(/\.?0+$/,""),"megajoules→joules":n=>(parseFloat(n)*1e6).toFixed(0),"joules→megajoules":n=>(parseFloat(n)/1e6).toFixed(8).replace(/\.?0+$/,""),"megajoules→kwh":n=>(parseFloat(n)/3.6).toFixed(6).replace(/\.?0+$/,""),"kwh→megajoules":n=>(parseFloat(n)*3.6).toFixed(4).replace(/\.?0+$/,""),"megajoules→kcal":n=>(parseFloat(n)*239.006).toFixed(2).replace(/\.?0+$/,""),"kcal→megajoules":n=>(parseFloat(n)/239.006).toFixed(6).replace(/\.?0+$/,""),"megajoules→btu":n=>(parseFloat(n)*947.817).toFixed(2).replace(/\.?0+$/,""),"btu→megajoules":n=>(parseFloat(n)/947.817).toFixed(6).replace(/\.?0+$/,""),"psi→bar":n=>(parseFloat(n)*.0689476).toFixed(4).replace(/\.?0+$/,""),"bar→psi":n=>(parseFloat(n)/.0689476).toFixed(4).replace(/\.?0+$/,""),"psi→atm":n=>(parseFloat(n)*.068046).toFixed(4).replace(/\.?0+$/,""),"atm→psi":n=>(parseFloat(n)/.068046).toFixed(4).replace(/\.?0+$/,""),"psi→pascal":n=>(parseFloat(n)*6894.76).toFixed(2).replace(/\.?0+$/,""),"pascal→psi":n=>(parseFloat(n)/6894.76).toFixed(6).replace(/\.?0+$/,""),"psi→mmhg":n=>(parseFloat(n)*51.7149).toFixed(4).replace(/\.?0+$/,""),"mmhg→psi":n=>(parseFloat(n)/51.7149).toFixed(4).replace(/\.?0+$/,""),"bar→atm":n=>(parseFloat(n)*.986923).toFixed(4).replace(/\.?0+$/,""),"atm→bar":n=>(parseFloat(n)/.986923).toFixed(4).replace(/\.?0+$/,""),"bar→pascal":n=>(parseFloat(n)*1e5).toFixed(2).replace(/\.?0+$/,""),"pascal→bar":n=>(parseFloat(n)/1e5).toFixed(6).replace(/\.?0+$/,""),"bar→mmhg":n=>(parseFloat(n)*750.062).toFixed(4).replace(/\.?0+$/,""),"mmhg→bar":n=>(parseFloat(n)/750.062).toFixed(6).replace(/\.?0+$/,""),"atm→pascal":n=>(parseFloat(n)*101325).toFixed(2).replace(/\.?0+$/,""),"pascal→atm":n=>(parseFloat(n)/101325).toFixed(8).replace(/\.?0+$/,""),"atm→mmhg":n=>(parseFloat(n)*760).toFixed(4).replace(/\.?0+$/,""),"mmhg→atm":n=>(parseFloat(n)/760).toFixed(6).replace(/\.?0+$/,""),"pascal→mmhg":n=>(parseFloat(n)*.00750062).toFixed(4).replace(/\.?0+$/,""),"mmhg→pascal":n=>(parseFloat(n)/.00750062).toFixed(2).replace(/\.?0+$/,""),"degrees→radians":n=>(parseFloat(n)*Math.PI/180).toFixed(6).replace(/\.?0+$/,""),"radians→degrees":n=>(parseFloat(n)*180/Math.PI).toFixed(4).replace(/\.?0+$/,""),"degrees→gradians":n=>(parseFloat(n)*10/9).toFixed(4).replace(/\.?0+$/,""),"gradians→degrees":n=>(parseFloat(n)*9/10).toFixed(4).replace(/\.?0+$/,""),"radians→gradians":n=>(parseFloat(n)*200/Math.PI).toFixed(4).replace(/\.?0+$/,""),"gradians→radians":n=>(parseFloat(n)*Math.PI/200).toFixed(6).replace(/\.?0+$/,""),"turns→degrees":n=>(parseFloat(n)*360).toFixed(4).replace(/\.?0+$/,""),"degrees→turns":n=>(parseFloat(n)/360).toFixed(6).replace(/\.?0+$/,""),"turns→radians":n=>(parseFloat(n)*2*Math.PI).toFixed(6).replace(/\.?0+$/,""),"radians→turns":n=>(parseFloat(n)/(2*Math.PI)).toFixed(6).replace(/\.?0+$/,""),"turns→gradians":n=>(parseFloat(n)*400).toFixed(4).replace(/\.?0+$/,""),"gradians→turns":n=>(parseFloat(n)/400).toFixed(6).replace(/\.?0+$/,""),"gigabytes→terabytes":n=>(parseFloat(n)/1024).toFixed(6).replace(/\.?0+$/,""),"terabytes→gigabytes":n=>(parseFloat(n)*1024).toFixed(2).replace(/\.?0+$/,""),"terabytes→petabytes":n=>(parseFloat(n)/1024).toFixed(8).replace(/\.?0+$/,""),"petabytes→terabytes":n=>(parseFloat(n)*1024).toFixed(2).replace(/\.?0+$/,""),"megabytes→terabytes":n=>(parseFloat(n)/1048576).toFixed(8).replace(/\.?0+$/,""),"terabytes→megabytes":n=>(parseFloat(n)*1048576).toFixed(2).replace(/\.?0+$/,""),"kilobytes→terabytes":n=>(parseFloat(n)/1073741824).toFixed(10).replace(/\.?0+$/,""),"terabytes→kilobytes":n=>(parseFloat(n)*1073741824).toFixed(0),"bytes→terabytes":n=>(parseFloat(n)/1099511627776).toFixed(12).replace(/\.?0+$/,""),"terabytes→bytes":n=>(parseFloat(n)*1099511627776).toFixed(0),"megabytes→petabytes":n=>(parseFloat(n)/1073741824).toFixed(10).replace(/\.?0+$/,""),"petabytes→megabytes":n=>(parseFloat(n)*1073741824).toFixed(0),"gigabytes→petabytes":n=>(parseFloat(n)/1048576).toFixed(8).replace(/\.?0+$/,""),"petabytes→gigabytes":n=>(parseFloat(n)*1048576).toFixed(2).replace(/\.?0+$/,""),"bytes→petabytes":n=>(parseFloat(n)/0x4000000000000).toFixed(15).replace(/\.?0+$/,""),"petabytes→bytes":n=>(parseFloat(n)*0x4000000000000).toFixed(0),"kilobytes→petabytes":n=>(parseFloat(n)/1099511627776).toFixed(12).replace(/\.?0+$/,""),"petabytes→kilobytes":n=>(parseFloat(n)*1099511627776).toFixed(0),"hz→khz":n=>(parseFloat(n)/1e3).toFixed(4).replace(/\.?0+$/,""),"khz→hz":n=>(parseFloat(n)*1e3).toFixed(2).replace(/\.?0+$/,""),"hz→mhz":n=>(parseFloat(n)/1e6).toFixed(6).replace(/\.?0+$/,""),"mhz→hz":n=>(parseFloat(n)*1e6).toFixed(0),"hz→ghz":n=>(parseFloat(n)/1e9).toFixed(9).replace(/\.?0+$/,""),"ghz→hz":n=>(parseFloat(n)*1e9).toFixed(0),"khz→mhz":n=>(parseFloat(n)/1e3).toFixed(4).replace(/\.?0+$/,""),"mhz→khz":n=>(parseFloat(n)*1e3).toFixed(2).replace(/\.?0+$/,""),"khz→ghz":n=>(parseFloat(n)/1e6).toFixed(6).replace(/\.?0+$/,""),"ghz→khz":n=>(parseFloat(n)*1e6).toFixed(2).replace(/\.?0+$/,""),"mhz→ghz":n=>(parseFloat(n)/1e3).toFixed(4).replace(/\.?0+$/,""),"ghz→mhz":n=>(parseFloat(n)*1e3).toFixed(2).replace(/\.?0+$/,""),"watts→kilowatts":n=>(parseFloat(n)/1e3).toFixed(4).replace(/\.?0+$/,""),"kilowatts→watts":n=>(parseFloat(n)*1e3).toFixed(2).replace(/\.?0+$/,""),"watts→horsepower":n=>(parseFloat(n)/745.7).toFixed(4).replace(/\.?0+$/,""),"horsepower→watts":n=>(parseFloat(n)*745.7).toFixed(2).replace(/\.?0+$/,""),"watts→btuh":n=>(parseFloat(n)*3.41214).toFixed(4).replace(/\.?0+$/,""),"btuh→watts":n=>(parseFloat(n)/3.41214).toFixed(4).replace(/\.?0+$/,""),"kilowatts→horsepower":n=>(parseFloat(n)*1.34102).toFixed(4).replace(/\.?0+$/,""),"horsepower→kilowatts":n=>(parseFloat(n)/1.34102).toFixed(4).replace(/\.?0+$/,""),"kilowatts→btuh":n=>(parseFloat(n)*3412.14).toFixed(2).replace(/\.?0+$/,""),"btuh→kilowatts":n=>(parseFloat(n)/3412.14).toFixed(6).replace(/\.?0+$/,""),"horsepower→btuh":n=>(parseFloat(n)*2544.43).toFixed(2).replace(/\.?0+$/,""),"btuh→horsepower":n=>(parseFloat(n)/2544.43).toFixed(6).replace(/\.?0+$/,""),"mpg→kml":n=>(parseFloat(n)*.425144).toFixed(4).replace(/\.?0+$/,""),"kml→mpg":n=>(parseFloat(n)/.425144).toFixed(4).replace(/\.?0+$/,""),"mpg→l100km":n=>(235.215/parseFloat(n)).toFixed(4).replace(/\.?0+$/,""),"l100km→mpg":n=>(235.215/parseFloat(n)).toFixed(4).replace(/\.?0+$/,""),"kml→l100km":n=>(100/parseFloat(n)).toFixed(4).replace(/\.?0+$/,""),"l100km→kml":n=>(100/parseFloat(n)).toFixed(4).replace(/\.?0+$/,""),"bps→kbps":n=>(parseFloat(n)/1e3).toFixed(4).replace(/\.?0+$/,""),"kbps→bps":n=>(parseFloat(n)*1e3).toFixed(0),"bps→mbps":n=>(parseFloat(n)/1e6).toFixed(6).replace(/\.?0+$/,""),"mbps→bps":n=>(parseFloat(n)*1e6).toFixed(0),"bps→gbps":n=>(parseFloat(n)/1e9).toFixed(9).replace(/\.?0+$/,""),"gbps→bps":n=>(parseFloat(n)*1e9).toFixed(0),"kbps→mbps":n=>(parseFloat(n)/1e3).toFixed(4).replace(/\.?0+$/,""),"mbps→kbps":n=>(parseFloat(n)*1e3).toFixed(2).replace(/\.?0+$/,""),"kbps→gbps":n=>(parseFloat(n)/1e6).toFixed(6).replace(/\.?0+$/,""),"gbps→kbps":n=>(parseFloat(n)*1e6).toFixed(2).replace(/\.?0+$/,""),"mbps→gbps":n=>(parseFloat(n)/1e3).toFixed(4).replace(/\.?0+$/,""),"gbps→mbps":n=>(parseFloat(n)*1e3).toFixed(2).replace(/\.?0+$/,""),"gbps→tbps":n=>(parseFloat(n)/1e3).toFixed(6).replace(/\.?0+$/,""),"tbps→gbps":n=>(parseFloat(n)*1e3).toFixed(2).replace(/\.?0+$/,""),"mbps→tbps":n=>(parseFloat(n)/1e6).toFixed(8).replace(/\.?0+$/,""),"tbps→mbps":n=>(parseFloat(n)*1e6).toFixed(2).replace(/\.?0+$/,""),"kbps→tbps":n=>(parseFloat(n)/1e9).toFixed(12).replace(/\.?0+$/,""),"tbps→kbps":n=>(parseFloat(n)*1e9).toFixed(0),"bps→tbps":n=>(parseFloat(n)/1e12).toFixed(14).replace(/\.?0+$/,""),"tbps→bps":n=>(parseFloat(n)*1e12).toFixed(0),"tsp→tbsp":n=>(parseFloat(n)/3).toFixed(4).replace(/\.?0+$/,""),"tbsp→tsp":n=>(parseFloat(n)*3).toFixed(2).replace(/\.?0+$/,""),"tsp→cup-cook":n=>(parseFloat(n)/48).toFixed(4).replace(/\.?0+$/,""),"cup-cook→tsp":n=>(parseFloat(n)*48).toFixed(2).replace(/\.?0+$/,""),"tsp→ml":n=>(parseFloat(n)*4.92892).toFixed(4).replace(/\.?0+$/,""),"ml→tsp":n=>(parseFloat(n)/4.92892).toFixed(4).replace(/\.?0+$/,""),"tbsp→cup-cook":n=>(parseFloat(n)/16).toFixed(4).replace(/\.?0+$/,""),"cup-cook→tbsp":n=>(parseFloat(n)*16).toFixed(2).replace(/\.?0+$/,""),"tbsp→ml":n=>(parseFloat(n)*14.7868).toFixed(4).replace(/\.?0+$/,""),"ml→tbsp":n=>(parseFloat(n)/14.7868).toFixed(4).replace(/\.?0+$/,""),"cup-cook→ml":n=>(parseFloat(n)*236.588).toFixed(2).replace(/\.?0+$/,""),"ml→cup-cook":n=>(parseFloat(n)/236.588).toFixed(4).replace(/\.?0+$/,""),"toml→querystring":n=>{const r=wl(n),s=new URLSearchParams;for(const[c,d]of Object.entries(r))typeof d!="object"&&s.set(c,String(d));return s.toString()},"json-min→xml":n=>{const r=JSON.parse(n);function s(d,f){if(d==null)return`<${f}/>`;if(Array.isArray(d))return d.map(h=>s(h,f)).join(`
`);if(typeof d=="object"){const h=Object.entries(d).map(([y,g])=>s(g,y)).join(`
  `);return`<${f}>
  ${h}
</${f}>`}return`<${f}>${String(d).replace(/&/g,"&amp;").replace(/</g,"&lt;")}</${f}>`}const c=Object.keys(r);return c.length===1?`<?xml version="1.0"?>
`+s(r[c[0]],c[0]):`<?xml version="1.0"?>
`+s(r,"root")},"xml→json-min":n=>{const s=new DOMParser().parseFromString(n,"text/xml");if(s.querySelector("parsererror"))throw new Error("invalid XML");function c(d){const f={};if(d.attributes)for(const h of d.attributes)f["@"+h.name]=h.value;for(const h of d.childNodes)if(h.nodeType===3){const y=h.textContent.trim();if(y){if(!Object.keys(f).length)return y;f["#text"]=y}}else if(h.nodeType===1){const y=c(h);f[h.nodeName]?(Array.isArray(f[h.nodeName])||(f[h.nodeName]=[f[h.nodeName]]),f[h.nodeName].push(y)):f[h.nodeName]=y}return f}return JSON.stringify({[s.documentElement.nodeName]:c(s.documentElement)})},"csv→xml":n=>{const r=n.trim().split(`
`),s=f=>{const h=[];let y="",g=!1;for(let b=0;b<f.length;b++){const L=f[b];g?L==='"'&&f[b+1]==='"'?(y+='"',b++):L==='"'?g=!1:y+=L:L==='"'?g=!0:L===","?(h.push(y),y=""):y+=L}return h.push(y),h},c=s(r[0]);return`<?xml version="1.0"?>
<data>
`+r.slice(1).map(f=>{const h=s(f);return`  <row>
`+c.map((y,g)=>`    <${y}>${(h[g]||"").replace(/&/g,"&amp;").replace(/</g,"&lt;")}</${y}>`).join(`
`)+`
  </row>`}).join(`
`)+`
</data>`},"xml→csv":n=>{const s=new DOMParser().parseFromString(n,"text/xml");if(s.querySelector("parsererror"))throw new Error("invalid XML");const c=s.documentElement.children;if(!c.length)throw new Error("no data");const d=[...c[0].children].map(y=>y.nodeName),f=y=>{const g=String(y??"");return/[,"\n]/.test(g)?`"${g.replace(/"/g,'""')}"`:g},h=[...c].map(y=>d.map(g=>f(y.querySelector(g)?.textContent||"")).join(","));return[d.join(","),...h].join(`
`)},"html-markup→markdown":n=>{let r=n;return r=r.replace(/<h1[^>]*>(.*?)<\/h1>/gi,"# $1"),r=r.replace(/<h2[^>]*>(.*?)<\/h2>/gi,"## $1"),r=r.replace(/<h3[^>]*>(.*?)<\/h3>/gi,"### $1"),r=r.replace(/<h4[^>]*>(.*?)<\/h4>/gi,"#### $1"),r=r.replace(/<strong[^>]*>(.*?)<\/strong>/gi,"**$1**"),r=r.replace(/<b[^>]*>(.*?)<\/b>/gi,"**$1**"),r=r.replace(/<em[^>]*>(.*?)<\/em>/gi,"*$1*"),r=r.replace(/<i[^>]*>(.*?)<\/i>/gi,"*$1*"),r=r.replace(/<code[^>]*>(.*?)<\/code>/gi,"`$1`"),r=r.replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi,"[$2]($1)"),r=r.replace(/<br\s*\/?>/gi,`
`),r=r.replace(/<p[^>]*>(.*?)<\/p>/gi,`$1
`),r=r.replace(/<li[^>]*>(.*?)<\/li>/gi,"- $1"),r=r.replace(/<\/?[^>]+>/g,""),r=r.replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&quot;/g,'"'),r.trim()},"plain→html-markup":n=>n.split(/\n\n+/).map(r=>`<p>${r.replace(/\n/g,"<br>")}</p>`).join(`
`),"color-hex→color-rgb":n=>{const r=nr(n.trim());if(!r)throw new Error("bad hex");return`rgb(${r.r}, ${r.g}, ${r.b})`},"color-hex→color-hsl":n=>{const r=nr(n.trim());if(!r)throw new Error("bad hex");const s=xl(r);return`hsl(${s.h}, ${s.s}%, ${s.l}%)`},"color-rgb→color-hex":n=>{const r=Xo(n);if(!r)throw new Error("bad rgb");return"#"+[r.r,r.g,r.b].map(s=>s.toString(16).padStart(2,"0")).join("")},"color-rgb→color-hsl":n=>{const r=Xo(n);if(!r)throw new Error("bad rgb");const s=xl(r);return`hsl(${s.h}, ${s.s}%, ${s.l}%)`},"color-hsl→color-hex":n=>{const r=Zo(n);if(!r)throw new Error("bad hsl");const s=Ko(r);return"#"+[s.r,s.g,s.b].map(c=>c.toString(16).padStart(2,"0")).join("")},"color-hsl→color-rgb":n=>{const r=Zo(n);if(!r)throw new Error("bad hsl");const s=Ko(r);return`rgb(${s.r}, ${s.g}, ${s.b})`},"color-hex→color-hsv":n=>{const r=nr(n.trim());if(!r)throw new Error("bad hex");const s=Al(r);return`hsv(${s.h}, ${s.s}%, ${s.v}%)`},"color-rgb→color-hsv":n=>{const r=Xo(n);if(!r)throw new Error("bad rgb");const s=Al(r);return`hsv(${s.h}, ${s.s}%, ${s.v}%)`},"color-hsl→color-hsv":n=>{const r=Zo(n);if(!r)throw new Error("bad hsl");const s=Ko(r),c=Al(s);return`hsv(${c.h}, ${c.s}%, ${c.v}%)`},"color-hsv→color-hex":n=>{const r=Jo(n);if(!r)throw new Error("bad hsv");const s=Qo(r);return"#"+[s.r,s.g,s.b].map(c=>c.toString(16).padStart(2,"0")).join("")},"color-hsv→color-rgb":n=>{const r=Jo(n);if(!r)throw new Error("bad hsv");const s=Qo(r);return`rgb(${s.r}, ${s.g}, ${s.b})`},"color-hsv→color-hsl":n=>{const r=Jo(n);if(!r)throw new Error("bad hsv");const s=Qo(r),c=xl(s);return`hsl(${c.h}, ${c.s}%, ${c.l}%)`},"color-hex→color-cmyk":n=>{const r=nr(n.trim());if(!r)throw new Error("bad hex");const s=r.r/255,c=r.g/255,d=r.b/255,f=1-Math.max(s,c,d);if(f===1)return"cmyk(0%, 0%, 0%, 100%)";const h=(1-s-f)/(1-f),y=(1-c-f)/(1-f),g=(1-d-f)/(1-f);return`cmyk(${Math.round(h*100)}%, ${Math.round(y*100)}%, ${Math.round(g*100)}%, ${Math.round(f*100)}%)`},"color-cmyk→color-hex":n=>{const r=n.match(/cmyk\(\s*([\d.]+)%?\s*,\s*([\d.]+)%?\s*,\s*([\d.]+)%?\s*,\s*([\d.]+)%?\s*\)/i);if(!r)throw new Error("bad cmyk");const[s,c,d,f]=[r[1],r[2],r[3],r[4]].map(b=>parseFloat(b)/100),h=Math.round(255*(1-s)*(1-f)),y=Math.round(255*(1-c)*(1-f)),g=Math.round(255*(1-d)*(1-f));return"#"+[h,y,g].map(b=>Math.max(0,Math.min(255,b)).toString(16).padStart(2,"0")).join("")},"color-rgb→color-cmyk":n=>{const r=Xo(n);if(!r)throw new Error("bad rgb");const s=r.r/255,c=r.g/255,d=r.b/255,f=1-Math.max(s,c,d);if(f===1)return"cmyk(0%, 0%, 0%, 100%)";const h=(1-s-f)/(1-f),y=(1-c-f)/(1-f),g=(1-d-f)/(1-f);return`cmyk(${Math.round(h*100)}%, ${Math.round(y*100)}%, ${Math.round(g*100)}%, ${Math.round(f*100)}%)`},"color-cmyk→color-rgb":n=>{const r=n.match(/cmyk\(\s*([\d.]+)%?\s*,\s*([\d.]+)%?\s*,\s*([\d.]+)%?\s*,\s*([\d.]+)%?\s*\)/i);if(!r)throw new Error("bad cmyk");const[s,c,d,f]=[r[1],r[2],r[3],r[4]].map(b=>parseFloat(b)/100),h=Math.round(255*(1-s)*(1-f)),y=Math.round(255*(1-c)*(1-f)),g=Math.round(255*(1-d)*(1-f));return`rgb(${Math.max(0,Math.min(255,h))}, ${Math.max(0,Math.min(255,y))}, ${Math.max(0,Math.min(255,g))})`},"color-cmyk→color-hsl":n=>{const r=n.match(/cmyk\(\s*([\d.]+)%?\s*,\s*([\d.]+)%?\s*,\s*([\d.]+)%?\s*,\s*([\d.]+)%?\s*\)/i);if(!r)throw new Error("bad cmyk");const[s,c,d,f]=[r[1],r[2],r[3],r[4]].map(g=>parseFloat(g)/100),h={r:Math.round(255*(1-s)*(1-f)),g:Math.round(255*(1-c)*(1-f)),b:Math.round(255*(1-d)*(1-f))},y=xl(h);return`hsl(${y.h}, ${y.s}%, ${y.l}%)`},"color-hsl→color-cmyk":n=>{const r=Zo(n);if(!r)throw new Error("bad hsl");const s=Ko(r),c=s.r/255,d=s.g/255,f=s.b/255,h=1-Math.max(c,d,f);if(h===1)return"cmyk(0%, 0%, 0%, 100%)";const y=(1-c-h)/(1-h),g=(1-d-h)/(1-h),b=(1-f-h)/(1-h);return`cmyk(${Math.round(y*100)}%, ${Math.round(g*100)}%, ${Math.round(b*100)}%, ${Math.round(h*100)}%)`},"tsp→floz-cook":n=>(parseFloat(n)/6).toFixed(4).replace(/\.?0+$/,""),"floz-cook→tsp":n=>(parseFloat(n)*6).toFixed(2).replace(/\.?0+$/,""),"tbsp→floz-cook":n=>(parseFloat(n)/2).toFixed(4).replace(/\.?0+$/,""),"floz-cook→tbsp":n=>(parseFloat(n)*2).toFixed(2).replace(/\.?0+$/,""),"cup-cook→floz-cook":n=>(parseFloat(n)*8).toFixed(2).replace(/\.?0+$/,""),"floz-cook→cup-cook":n=>(parseFloat(n)/8).toFixed(4).replace(/\.?0+$/,""),"floz-cook→ml":n=>(parseFloat(n)*29.5735).toFixed(2).replace(/\.?0+$/,""),"ml→floz-cook":n=>(parseFloat(n)/29.5735).toFixed(4).replace(/\.?0+$/,""),"pint-cook→cup-cook":n=>(parseFloat(n)*2).toFixed(2).replace(/\.?0+$/,""),"cup-cook→pint-cook":n=>(parseFloat(n)/2).toFixed(4).replace(/\.?0+$/,""),"pint-cook→floz-cook":n=>(parseFloat(n)*16).toFixed(2).replace(/\.?0+$/,""),"floz-cook→pint-cook":n=>(parseFloat(n)/16).toFixed(4).replace(/\.?0+$/,""),"pint-cook→ml":n=>(parseFloat(n)*473.176).toFixed(2).replace(/\.?0+$/,""),"ml→pint-cook":n=>(parseFloat(n)/473.176).toFixed(4).replace(/\.?0+$/,""),"qt-cook→pint-cook":n=>(parseFloat(n)*2).toFixed(2).replace(/\.?0+$/,""),"pint-cook→qt-cook":n=>(parseFloat(n)/2).toFixed(4).replace(/\.?0+$/,""),"qt-cook→cup-cook":n=>(parseFloat(n)*4).toFixed(2).replace(/\.?0+$/,""),"cup-cook→qt-cook":n=>(parseFloat(n)/4).toFixed(4).replace(/\.?0+$/,""),"qt-cook→ml":n=>(parseFloat(n)*946.353).toFixed(2).replace(/\.?0+$/,""),"ml→qt-cook":n=>(parseFloat(n)/946.353).toFixed(4).replace(/\.?0+$/,""),"qt-cook→floz-cook":n=>(parseFloat(n)*32).toFixed(2).replace(/\.?0+$/,""),"floz-cook→qt-cook":n=>(parseFloat(n)/32).toFixed(4).replace(/\.?0+$/,""),"kib→megabytes":n=>(parseFloat(n)/976.5625).toFixed(6).replace(/\.?0+$/,""),"megabytes→kib":n=>(parseFloat(n)*976.5625).toFixed(2).replace(/\.?0+$/,""),"meters→micrometers":n=>(parseFloat(n)*1e6).toExponential(4).replace(/\.?0+e/,"e"),"micrometers→meters":n=>(parseFloat(n)*1e-6).toExponential(4).replace(/\.?0+e/,"e"),"mm→micrometers":n=>(parseFloat(n)*1e3).toFixed(2).replace(/\.?0+$/,""),"micrometers→mm":n=>(parseFloat(n)/1e3).toFixed(6).replace(/\.?0+$/,""),"cm→micrometers":n=>(parseFloat(n)*1e4).toFixed(2).replace(/\.?0+$/,""),"micrometers→cm":n=>(parseFloat(n)/1e4).toFixed(6).replace(/\.?0+$/,""),"inches→micrometers":n=>(parseFloat(n)*25400).toFixed(2).replace(/\.?0+$/,""),"micrometers→inches":n=>(parseFloat(n)/25400).toFixed(6).replace(/\.?0+$/,""),"micrometers→nanometers":n=>(parseFloat(n)*1e3).toFixed(2).replace(/\.?0+$/,""),"nanometers→micrometers":n=>(parseFloat(n)/1e3).toFixed(6).replace(/\.?0+$/,""),"mm→nanometers":n=>(parseFloat(n)*1e6).toFixed(0),"nanometers→mm":n=>(parseFloat(n)*1e-6).toFixed(8).replace(/\.?0+$/,""),"nanometers→meters":n=>(parseFloat(n)*1e-9).toExponential(4),"meters→nanometers":n=>(parseFloat(n)*1e9).toExponential(4),"nanometers→cm":n=>(parseFloat(n)*1e-7).toExponential(4),"cm→nanometers":n=>(parseFloat(n)*1e7).toExponential(4),"nanometers→inches":n=>(parseFloat(n)/254e5).toExponential(4),"inches→nanometers":n=>(parseFloat(n)*254e5).toExponential(4),"light-year→km":n=>(parseFloat(n)*9461e9).toExponential(4),"km→light-year":n=>(parseFloat(n)/9461e9).toExponential(4),"light-year→miles":n=>(parseFloat(n)*5879e9).toExponential(4),"miles→light-year":n=>(parseFloat(n)/5879e9).toExponential(4),"light-year→au":n=>(parseFloat(n)*63241.1).toFixed(1),"au→light-year":n=>(parseFloat(n)/63241.1).toExponential(6),"au→km":n=>(parseFloat(n)*1496e5).toExponential(4),"km→au":n=>(parseFloat(n)/1496e5).toExponential(6),"au→miles":n=>(parseFloat(n)*9296e4).toExponential(4),"miles→au":n=>(parseFloat(n)/9296e4).toExponential(6),"light-year→meters":n=>(parseFloat(n)*9461e12).toExponential(4),"meters→light-year":n=>(parseFloat(n)/9461e12).toExponential(6),"au→meters":n=>(parseFloat(n)*1496e8).toExponential(4),"meters→au":n=>(parseFloat(n)/1496e8).toExponential(6),"au→yards":n=>(parseFloat(n)*1636e8).toExponential(4),"yards→au":n=>(parseFloat(n)/1636e8).toExponential(6),"oz→carats":n=>(parseFloat(n)*141.748).toFixed(3).replace(/\.?0+$/,""),"carats→oz":n=>(parseFloat(n)/141.748).toFixed(6).replace(/\.?0+$/,""),"milligrams→carats":n=>(parseFloat(n)/200).toFixed(6).replace(/\.?0+$/,""),"carats→milligrams":n=>(parseFloat(n)*200).toFixed(2).replace(/\.?0+$/,""),"micrograms→oz":n=>(parseFloat(n)/283495231e-1).toExponential(4),"oz→micrograms":n=>(parseFloat(n)*283495231e-1).toExponential(4),"micrograms→kg":n=>(parseFloat(n)*1e-9).toExponential(4),"kg→micrograms":n=>(parseFloat(n)*1e9).toExponential(4),"gallon-us→cup-cook":n=>(parseFloat(n)*16).toFixed(2).replace(/\.?0+$/,""),"cup-cook→gallon-us":n=>(parseFloat(n)/16).toFixed(4).replace(/\.?0+$/,""),"gallon-us→floz-cook":n=>(parseFloat(n)*128).toFixed(2).replace(/\.?0+$/,""),"floz-cook→gallon-us":n=>(parseFloat(n)/128).toFixed(6).replace(/\.?0+$/,""),"gallon-us→ml":n=>(parseFloat(n)*3785.41).toFixed(2).replace(/\.?0+$/,""),"ml→gallon-us":n=>(parseFloat(n)/3785.41).toFixed(6).replace(/\.?0+$/,""),"gallon-us→pint-cook":n=>(parseFloat(n)*8).toFixed(2).replace(/\.?0+$/,""),"pint-cook→gallon-us":n=>(parseFloat(n)/8).toFixed(4).replace(/\.?0+$/,""),"gallon-us→qt-cook":n=>(parseFloat(n)*4).toFixed(2).replace(/\.?0+$/,""),"qt-cook→gallon-us":n=>(parseFloat(n)/4).toFixed(4).replace(/\.?0+$/,""),"gallon-us→liters":n=>(parseFloat(n)*3.78541).toFixed(4).replace(/\.?0+$/,""),"liters→gallon-us":n=>(parseFloat(n)/3.78541).toFixed(4).replace(/\.?0+$/,""),"watts→btu-per-hr":n=>(parseFloat(n)*3.41214).toFixed(4).replace(/\.?0+$/,""),"btu-per-hr→watts":n=>(parseFloat(n)/3.41214).toFixed(4).replace(/\.?0+$/,""),"horsepower→btu-per-hr":n=>(parseFloat(n)*2544.43).toFixed(2).replace(/\.?0+$/,""),"btu-per-hr→horsepower":n=>(parseFloat(n)/2544.43).toFixed(6).replace(/\.?0+$/,""),"kilowatts→btu-per-hr":n=>(parseFloat(n)*3412.14).toFixed(2).replace(/\.?0+$/,""),"btu-per-hr→kilowatts":n=>(parseFloat(n)/3412.14).toFixed(6).replace(/\.?0+$/,""),"watts→calories-per-sec":n=>(parseFloat(n)/4.184).toFixed(4).replace(/\.?0+$/,""),"calories-per-sec→watts":n=>(parseFloat(n)*4.184).toFixed(4).replace(/\.?0+$/,""),"horsepower→calories-per-sec":n=>(parseFloat(n)*745.7/4.184).toFixed(4).replace(/\.?0+$/,""),"calories-per-sec→horsepower":n=>(parseFloat(n)*4.184/745.7).toFixed(6).replace(/\.?0+$/,""),"hz→rpm":n=>(parseFloat(n)*60).toFixed(4).replace(/\.?0+$/,""),"rpm→hz":n=>(parseFloat(n)/60).toFixed(6).replace(/\.?0+$/,""),"hz→radians-per-sec":n=>(parseFloat(n)*2*Math.PI).toFixed(4).replace(/\.?0+$/,""),"radians-per-sec→hz":n=>(parseFloat(n)/(2*Math.PI)).toFixed(6).replace(/\.?0+$/,""),"rpm→radians-per-sec":n=>(parseFloat(n)*Math.PI/30).toFixed(4).replace(/\.?0+$/,""),"radians-per-sec→rpm":n=>(parseFloat(n)*30/Math.PI).toFixed(4).replace(/\.?0+$/,""),"troy-oz→kg":n=>(parseFloat(n)*.0311035).toFixed(6).replace(/\.?0+$/,""),"kg→troy-oz":n=>(parseFloat(n)/.0311035).toFixed(4).replace(/\.?0+$/,""),"troy-oz→milligrams":n=>(parseFloat(n)*31103.5).toFixed(2).replace(/\.?0+$/,""),"milligrams→troy-oz":n=>(parseFloat(n)/31103.5).toFixed(8).replace(/\.?0+$/,""),"troy-oz→carats":n=>(parseFloat(n)*155.517).toFixed(3).replace(/\.?0+$/,""),"carats→troy-oz":n=>(parseFloat(n)/155.517).toFixed(6).replace(/\.?0+$/,""),"troy-oz→lb":n=>(parseFloat(n)*.0685714).toFixed(6).replace(/\.?0+$/,""),"lb→troy-oz":n=>(parseFloat(n)/.0685714).toFixed(4).replace(/\.?0+$/,""),"calories-per-sec→kilowatts":n=>(parseFloat(n)*4.184/1e3).toFixed(6).replace(/\.?0+$/,""),"kilowatts→calories-per-sec":n=>(parseFloat(n)*1e3/4.184).toFixed(4).replace(/\.?0+$/,""),"rpm→khz":n=>(parseFloat(n)/6e4).toExponential(4),"khz→rpm":n=>(parseFloat(n)*6e4).toFixed(2).replace(/\.?0+$/,""),"radians-per-sec→khz":n=>(parseFloat(n)/(2*Math.PI*1e3)).toExponential(4),"khz→radians-per-sec":n=>(parseFloat(n)*2*Math.PI*1e3).toFixed(4).replace(/\.?0+$/,""),"sqm→sqkm":n=>(parseFloat(n)/1e6).toFixed(8).replace(/\.?0+$/,""),"sqkm→sqm":n=>(parseFloat(n)*1e6).toFixed(0),"sqft→sqkm":n=>(parseFloat(n)/107639104e-1).toFixed(10).replace(/\.?0+$/,""),"sqkm→sqft":n=>(parseFloat(n)*107639104e-1).toFixed(2).replace(/\.?0+$/,""),"sqkm→acres":n=>(parseFloat(n)*247.105).toFixed(4).replace(/\.?0+$/,""),"acres→sqkm":n=>(parseFloat(n)/247.105).toFixed(6).replace(/\.?0+$/,""),"sqkm→hectares":n=>(parseFloat(n)*100).toFixed(4).replace(/\.?0+$/,""),"hectares→sqkm":n=>(parseFloat(n)/100).toFixed(6).replace(/\.?0+$/,""),"sqmiles→sqkm":n=>(parseFloat(n)*2.58999).toFixed(4).replace(/\.?0+$/,""),"sqkm→sqmiles":n=>(parseFloat(n)/2.58999).toFixed(4).replace(/\.?0+$/,""),"sqmiles→sqft":n=>(parseFloat(n)*27878400).toFixed(0),"sqft→sqmiles":n=>(parseFloat(n)/27878400).toFixed(8).replace(/\.?0+$/,""),"sqmiles→acres":n=>(parseFloat(n)*640).toFixed(2).replace(/\.?0+$/,""),"acres→sqmiles":n=>(parseFloat(n)/640).toFixed(6).replace(/\.?0+$/,""),"sqmiles→sqm":n=>(parseFloat(n)*25899881e-1).toFixed(2).replace(/\.?0+$/,""),"sqm→sqmiles":n=>(parseFloat(n)/25899881e-1).toFixed(8).replace(/\.?0+$/,""),"sqinches→sqft":n=>(parseFloat(n)/144).toFixed(4).replace(/\.?0+$/,""),"sqft→sqinches":n=>(parseFloat(n)*144).toFixed(2).replace(/\.?0+$/,""),"sqinches→sqcm":n=>(parseFloat(n)*6.4516).toFixed(4).replace(/\.?0+$/,""),"sqcm→sqinches":n=>(parseFloat(n)/6.4516).toFixed(4).replace(/\.?0+$/,""),"sqcm→sqm":n=>(parseFloat(n)/1e4).toFixed(6).replace(/\.?0+$/,""),"sqm→sqcm":n=>(parseFloat(n)*1e4).toFixed(2).replace(/\.?0+$/,""),"sqinches→sqm":n=>(parseFloat(n)/1550).toFixed(6).replace(/\.?0+$/,""),"sqm→sqinches":n=>(parseFloat(n)*1550).toFixed(2).replace(/\.?0+$/,""),"pascal→kpa":n=>(parseFloat(n)/1e3).toFixed(6).replace(/\.?0+$/,""),"kpa→pascal":n=>(parseFloat(n)*1e3).toFixed(2).replace(/\.?0+$/,""),"bar→kpa":n=>(parseFloat(n)*100).toFixed(2).replace(/\.?0+$/,""),"kpa→bar":n=>(parseFloat(n)/100).toFixed(4).replace(/\.?0+$/,""),"atm→kpa":n=>(parseFloat(n)*101.325).toFixed(4).replace(/\.?0+$/,""),"kpa→atm":n=>(parseFloat(n)/101.325).toFixed(6).replace(/\.?0+$/,""),"psi→kpa":n=>(parseFloat(n)*6.89476).toFixed(4).replace(/\.?0+$/,""),"kpa→psi":n=>(parseFloat(n)/6.89476).toFixed(4).replace(/\.?0+$/,""),"mmhg→kpa":n=>(parseFloat(n)*.133322).toFixed(6).replace(/\.?0+$/,""),"kpa→mmhg":n=>(parseFloat(n)/.133322).toFixed(4).replace(/\.?0+$/,""),"kpa→hpa":n=>(parseFloat(n)*10).toFixed(2).replace(/\.?0+$/,""),"hpa→kpa":n=>(parseFloat(n)/10).toFixed(4).replace(/\.?0+$/,""),"pascal→hpa":n=>(parseFloat(n)/100).toFixed(4).replace(/\.?0+$/,""),"hpa→pascal":n=>(parseFloat(n)*100).toFixed(2).replace(/\.?0+$/,""),"bar→hpa":n=>(parseFloat(n)*1e3).toFixed(2).replace(/\.?0+$/,""),"hpa→bar":n=>(parseFloat(n)/1e3).toFixed(6).replace(/\.?0+$/,""),"atm→hpa":n=>(parseFloat(n)*1013.25).toFixed(2).replace(/\.?0+$/,""),"hpa→atm":n=>(parseFloat(n)/1013.25).toFixed(6).replace(/\.?0+$/,""),"psi→hpa":n=>(parseFloat(n)*68.9476).toFixed(4).replace(/\.?0+$/,""),"hpa→psi":n=>(parseFloat(n)/68.9476).toFixed(4).replace(/\.?0+$/,""),"mmhg→hpa":n=>(parseFloat(n)*1.33322).toFixed(4).replace(/\.?0+$/,""),"hpa→mmhg":n=>(parseFloat(n)/1.33322).toFixed(4).replace(/\.?0+$/,""),"degrees→arcminutes":n=>(parseFloat(n)*60).toFixed(4).replace(/\.?0+$/,""),"arcminutes→degrees":n=>(parseFloat(n)/60).toFixed(6).replace(/\.?0+$/,""),"degrees→arcseconds":n=>(parseFloat(n)*3600).toFixed(4).replace(/\.?0+$/,""),"arcseconds→degrees":n=>(parseFloat(n)/3600).toFixed(6).replace(/\.?0+$/,""),"arcminutes→arcseconds":n=>(parseFloat(n)*60).toFixed(4).replace(/\.?0+$/,""),"arcseconds→arcminutes":n=>(parseFloat(n)/60).toFixed(6).replace(/\.?0+$/,""),"radians→arcminutes":n=>(parseFloat(n)*180/Math.PI*60).toFixed(4).replace(/\.?0+$/,""),"arcminutes→radians":n=>(parseFloat(n)/60*Math.PI/180).toFixed(8).replace(/\.?0+$/,""),"turns→arcminutes":n=>(parseFloat(n)*21600).toFixed(4).replace(/\.?0+$/,""),"arcminutes→turns":n=>(parseFloat(n)/21600).toFixed(8).replace(/\.?0+$/,""),"ml→cubic-m":n=>(parseFloat(n)*1e-6).toExponential(4),"cubic-m→ml":n=>(parseFloat(n)*1e6).toFixed(0),"arcseconds→radians":n=>(parseFloat(n)/3600*Math.PI/180).toFixed(10).replace(/\.?0+$/,""),"radians→arcseconds":n=>(parseFloat(n)*180/Math.PI*3600).toFixed(4).replace(/\.?0+$/,""),"arcseconds→turns":n=>(parseFloat(n)/1296e3).toFixed(10).replace(/\.?0+$/,""),"turns→arcseconds":n=>(parseFloat(n)*1296e3).toFixed(2).replace(/\.?0+$/,""),"arcseconds→gradians":n=>(parseFloat(n)/3240).toFixed(6).replace(/\.?0+$/,""),"gradians→arcseconds":n=>(parseFloat(n)*3240).toFixed(2).replace(/\.?0+$/,""),"sqcm→sqft":n=>(parseFloat(n)/929.03).toFixed(6).replace(/\.?0+$/,""),"sqft→sqcm":n=>(parseFloat(n)*929.03).toFixed(4).replace(/\.?0+$/,""),"sqcm→sqkm":n=>(parseFloat(n)*1e-10).toExponential(4),"sqkm→sqcm":n=>(parseFloat(n)*1e10).toExponential(4),"sqcm→hectares":n=>(parseFloat(n)*1e-8).toExponential(4),"hectares→sqcm":n=>(parseFloat(n)*1e8).toFixed(0),"sqcm→acres":n=>(parseFloat(n)*247105e-13).toExponential(4),"acres→sqcm":n=>(parseFloat(n)/247105e-13).toExponential(4),"stone→grams":n=>(parseFloat(n)*6350.29).toFixed(2).replace(/\.?0+$/,""),"grams→stone":n=>(parseFloat(n)/6350.29).toFixed(6).replace(/\.?0+$/,""),"stone→oz":n=>(parseFloat(n)*224).toFixed(2).replace(/\.?0+$/,""),"oz→stone":n=>(parseFloat(n)/224).toFixed(6).replace(/\.?0+$/,""),"stone→ton-metric":n=>(parseFloat(n)*.00635029).toFixed(6).replace(/\.?0+$/,""),"ton-metric→stone":n=>(parseFloat(n)/.00635029).toFixed(4).replace(/\.?0+$/,""),"camelcase→snakecase":n=>n.replace(/([A-Z])/g,"_$1").toLowerCase().replace(/^_/,""),"snakecase→camelcase":n=>n.replace(/_([a-z])/g,(r,s)=>s.toUpperCase()),"camelcase→kebabcase":n=>n.replace(/([A-Z])/g,"-$1").toLowerCase().replace(/^-/,""),"kebabcase→camelcase":n=>n.replace(/-([a-z])/g,(r,s)=>s.toUpperCase()),"snakecase→kebabcase":n=>n.replace(/_/g,"-"),"kebabcase→snakecase":n=>n.replace(/-/g,"_"),"titlecase→camelcase":n=>n.replace(/\s+(\w)/g,(r,s)=>s.toUpperCase()).replace(/^\w/,r=>r.toLowerCase()),"titlecase→snakecase":n=>n.toLowerCase().replace(/\s+/g,"_"),"titlecase→kebabcase":n=>n.toLowerCase().replace(/\s+/g,"-"),"plain→lowercase":n=>n.toLowerCase(),"plain→uppercase":n=>n.toUpperCase(),"plain→titlecase":n=>n.replace(/\b\w/g,r=>r.toUpperCase()),"roman→binary":n=>{const r=n.trim().toUpperCase(),s={M:1e3,CM:900,D:500,CD:400,C:100,XC:90,L:50,XL:40,X:10,IX:9,V:5,IV:4,I:1};let c=0,d=0;for(const[f,h]of Object.entries(s))for(;r.startsWith(f,d);)c+=h,d+=f.length;return c===0?"(invalid roman numeral)":c.toString(2)},"binary→roman":n=>{const r=parseInt(n.trim(),2);if(isNaN(r)||r<=0||r>3999)return"(out of range for roman numerals: 1-3999)";const s=[[1e3,"M"],[900,"CM"],[500,"D"],[400,"CD"],[100,"C"],[90,"XC"],[50,"L"],[40,"XL"],[10,"X"],[9,"IX"],[5,"V"],[4,"IV"],[1,"I"]];let c="",d=r;for(const[f,h]of s)for(;d>=f;)c+=h,d-=f;return c},"newtons→pound-force":n=>(parseFloat(n)*.224809).toFixed(4).replace(/\.?0+$/,""),"pound-force→newtons":n=>(parseFloat(n)*4.44822).toFixed(4).replace(/\.?0+$/,""),"newtons→kg-force":n=>(parseFloat(n)/9.80665).toFixed(4).replace(/\.?0+$/,""),"kg-force→newtons":n=>(parseFloat(n)*9.80665).toFixed(4).replace(/\.?0+$/,""),"newtons→dyne":n=>(parseFloat(n)*1e5).toFixed(2).replace(/\.?0+$/,""),"dyne→newtons":n=>(parseFloat(n)*1e-5).toFixed(8).replace(/\.?0+$/,""),"newtons→kilonewtons":n=>(parseFloat(n)/1e3).toFixed(6).replace(/\.?0+$/,""),"kilonewtons→newtons":n=>(parseFloat(n)*1e3).toFixed(2).replace(/\.?0+$/,""),"pound-force→kg-force":n=>(parseFloat(n)*.453592).toFixed(4).replace(/\.?0+$/,""),"kg-force→pound-force":n=>(parseFloat(n)*2.20462).toFixed(4).replace(/\.?0+$/,""),"kilonewtons→pound-force":n=>(parseFloat(n)*224.809).toFixed(4).replace(/\.?0+$/,""),"pound-force→kilonewtons":n=>(parseFloat(n)/224.809).toFixed(6).replace(/\.?0+$/,""),"kilonewtons→kg-force":n=>(parseFloat(n)*101.972).toFixed(4).replace(/\.?0+$/,""),"kg-force→kilonewtons":n=>(parseFloat(n)/101.972).toFixed(6).replace(/\.?0+$/,""),"lux→foot-candle":n=>(parseFloat(n)*.0929).toFixed(4).replace(/\.?0+$/,""),"foot-candle→lux":n=>(parseFloat(n)*10.7639).toFixed(4).replace(/\.?0+$/,""),"lux→millilux":n=>(parseFloat(n)*1e3).toFixed(2).replace(/\.?0+$/,""),"millilux→lux":n=>(parseFloat(n)/1e3).toFixed(6).replace(/\.?0+$/,""),"foot-candle→millilux":n=>(parseFloat(n)*10763.9).toFixed(2).replace(/\.?0+$/,""),"millilux→foot-candle":n=>(parseFloat(n)/10763.9).toFixed(8).replace(/\.?0+$/,""),"lowercase→titlecase":n=>n.replace(/\b\w/g,r=>r.toUpperCase()),"lowercase→snakecase":n=>n.trim().replace(/\s+/g,"_"),"lowercase→kebabcase":n=>n.trim().replace(/\s+/g,"-"),"lowercase→camelcase":n=>n.replace(/\s+(\w)/g,(r,s)=>s.toUpperCase()),"uppercase→titlecase":n=>n.toLowerCase().replace(/\b\w/g,r=>r.toUpperCase()),"uppercase→snakecase":n=>n.toLowerCase().replace(/\s+/g,"_"),"uppercase→kebabcase":n=>n.toLowerCase().replace(/\s+/g,"-"),"snakecase→uppercase":n=>n.toUpperCase(),"kebabcase→uppercase":n=>n.toUpperCase().replace(/-/g,"_"),"markdown→text":n=>n.replace(/#{1,6}\s+/g,"").replace(/\*\*(.+?)\*\*/g,"$1").replace(/\*(.+?)\*/g,"$1").replace(/__(.+?)__/g,"$1").replace(/_(.+?)_/g,"$1").replace(/`{3}[\s\S]*?`{3}/g,"").replace(/`(.+?)`/g,"$1").replace(/\[(.+?)\]\(.+?\)/g,"$1").replace(/!\[.*?\]\(.+?\)/g,"").replace(/^[-*+]\s+/gm,"").replace(/^\d+\.\s+/gm,"").replace(/^>\s+/gm,"").replace(/^[-*_]{3,}$/gm,"").replace(/\n{3,}/g,`

`).trim(),"plain→camelcase":n=>n.trim().toLowerCase().replace(/[^a-z0-9]+(.)/g,(r,s)=>s.toUpperCase()),"plain→snakecase":n=>n.trim().toLowerCase().replace(/[^a-z0-9]+/g,"_").replace(/^_|_$/g,""),"plain→kebabcase":n=>n.trim().toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,""),"pt→pica":n=>(parseFloat(n)/12).toFixed(4).replace(/\.?0+$/,""),"pica→pt":n=>(parseFloat(n)*12).toFixed(4).replace(/\.?0+$/,""),"pt→px":n=>(parseFloat(n)*96/72).toFixed(4).replace(/\.?0+$/,""),"px→pt":n=>(parseFloat(n)*72/96).toFixed(4).replace(/\.?0+$/,""),"pt→inches":n=>(parseFloat(n)/72).toFixed(6).replace(/\.?0+$/,""),"inches→pt":n=>(parseFloat(n)*72).toFixed(4).replace(/\.?0+$/,""),"pt→mm":n=>(parseFloat(n)*25.4/72).toFixed(4).replace(/\.?0+$/,""),"mm→pt":n=>(parseFloat(n)*72/25.4).toFixed(4).replace(/\.?0+$/,""),"pt→cm":n=>(parseFloat(n)*2.54/72).toFixed(6).replace(/\.?0+$/,""),"cm→pt":n=>(parseFloat(n)*72/2.54).toFixed(4).replace(/\.?0+$/,""),"pica→inches":n=>(parseFloat(n)/6).toFixed(6).replace(/\.?0+$/,""),"inches→pica":n=>(parseFloat(n)*6).toFixed(4).replace(/\.?0+$/,""),"pica→px":n=>(parseFloat(n)*16).toFixed(2).replace(/\.?0+$/,""),"px→pica":n=>(parseFloat(n)/16).toFixed(4).replace(/\.?0+$/,""),"px→inches":n=>(parseFloat(n)/96).toFixed(6).replace(/\.?0+$/,""),"inches→px":n=>(parseFloat(n)*96).toFixed(2).replace(/\.?0+$/,""),"px→mm":n=>(parseFloat(n)*25.4/96).toFixed(4).replace(/\.?0+$/,""),"mm→px":n=>(parseFloat(n)*96/25.4).toFixed(4).replace(/\.?0+$/,""),"px→cm":n=>(parseFloat(n)*2.54/96).toFixed(6).replace(/\.?0+$/,""),"cm→px":n=>(parseFloat(n)*96/2.54).toFixed(4).replace(/\.?0+$/,""),"kgm3→gcm3":n=>(parseFloat(n)/1e3).toFixed(6).replace(/\.?0+$/,""),"gcm3→kgm3":n=>(parseFloat(n)*1e3).toFixed(2).replace(/\.?0+$/,""),"kgm3→lbft3":n=>(parseFloat(n)*.0624279).toFixed(4).replace(/\.?0+$/,""),"lbft3→kgm3":n=>(parseFloat(n)*16.0185).toFixed(4).replace(/\.?0+$/,""),"kgm3→lbgal":n=>(parseFloat(n)*.0083454).toFixed(6).replace(/\.?0+$/,""),"lbgal→kgm3":n=>(parseFloat(n)*119.826).toFixed(4).replace(/\.?0+$/,""),"gcm3→lbft3":n=>(parseFloat(n)*62.4279).toFixed(4).replace(/\.?0+$/,""),"lbft3→gcm3":n=>(parseFloat(n)/62.4279).toFixed(6).replace(/\.?0+$/,""),"gcm3→lbgal":n=>(parseFloat(n)*8.3454).toFixed(4).replace(/\.?0+$/,""),"lbgal→gcm3":n=>(parseFloat(n)/8.3454).toFixed(6).replace(/\.?0+$/,""),"lbft3→lbgal":n=>(parseFloat(n)/7.48052).toFixed(6).replace(/\.?0+$/,""),"lbgal→lbft3":n=>(parseFloat(n)*7.48052).toFixed(4).replace(/\.?0+$/,""),"ampere→milliamp":n=>(parseFloat(n)*1e3).toFixed(4).replace(/\.?0+$/,""),"milliamp→ampere":n=>(parseFloat(n)/1e3).toFixed(6).replace(/\.?0+$/,""),"ampere→microamp":n=>(parseFloat(n)*1e6).toFixed(2).replace(/\.?0+$/,""),"microamp→ampere":n=>(parseFloat(n)*1e-6).toFixed(9).replace(/\.?0+$/,""),"ampere→kiloamp":n=>(parseFloat(n)/1e3).toFixed(6).replace(/\.?0+$/,""),"kiloamp→ampere":n=>(parseFloat(n)*1e3).toFixed(2).replace(/\.?0+$/,""),"milliamp→microamp":n=>(parseFloat(n)*1e3).toFixed(4).replace(/\.?0+$/,""),"microamp→milliamp":n=>(parseFloat(n)/1e3).toFixed(6).replace(/\.?0+$/,""),"milliamp→kiloamp":n=>(parseFloat(n)*1e-6).toFixed(9).replace(/\.?0+$/,""),"kiloamp→milliamp":n=>(parseFloat(n)*1e6).toFixed(2).replace(/\.?0+$/,""),"volt→millivolt":n=>(parseFloat(n)*1e3).toFixed(4).replace(/\.?0+$/,""),"millivolt→volt":n=>(parseFloat(n)/1e3).toFixed(6).replace(/\.?0+$/,""),"volt→kilovolt":n=>(parseFloat(n)/1e3).toFixed(6).replace(/\.?0+$/,""),"kilovolt→volt":n=>(parseFloat(n)*1e3).toFixed(4).replace(/\.?0+$/,""),"volt→microvolt":n=>(parseFloat(n)*1e6).toFixed(2).replace(/\.?0+$/,""),"microvolt→volt":n=>(parseFloat(n)*1e-6).toFixed(9).replace(/\.?0+$/,""),"millivolt→kilovolt":n=>(parseFloat(n)*1e-6).toFixed(9).replace(/\.?0+$/,""),"kilovolt→millivolt":n=>(parseFloat(n)*1e6).toFixed(2).replace(/\.?0+$/,""),"millivolt→microvolt":n=>(parseFloat(n)*1e3).toFixed(4).replace(/\.?0+$/,""),"microvolt→millivolt":n=>(parseFloat(n)/1e3).toFixed(6).replace(/\.?0+$/,""),"cubic-m→liters":n=>(parseFloat(n)*1e3).toFixed(4).replace(/\.?0+$/,""),"liters→cubic-m":n=>(parseFloat(n)/1e3).toFixed(6).replace(/\.?0+$/,""),"cubic-m→gallons":n=>(parseFloat(n)*264.172).toFixed(4).replace(/\.?0+$/,""),"gallons→cubic-m":n=>(parseFloat(n)/264.172).toFixed(6).replace(/\.?0+$/,""),"cubic-ft→liters":n=>(parseFloat(n)*28.3168).toFixed(4).replace(/\.?0+$/,""),"liters→cubic-ft":n=>(parseFloat(n)/28.3168).toFixed(6).replace(/\.?0+$/,""),"cubic-ft→gallons":n=>(parseFloat(n)*7.48052).toFixed(4).replace(/\.?0+$/,""),"gallons→cubic-ft":n=>(parseFloat(n)/7.48052).toFixed(4).replace(/\.?0+$/,""),"cubic-m→cubic-ft":n=>(parseFloat(n)*35.3147).toFixed(4).replace(/\.?0+$/,""),"cubic-ft→cubic-m":n=>(parseFloat(n)/35.3147).toFixed(6).replace(/\.?0+$/,""),"milligrams→grams":n=>(parseFloat(n)/1e3).toFixed(6).replace(/\.?0+$/,""),"grams→milligrams":n=>(parseFloat(n)*1e3).toFixed(4).replace(/\.?0+$/,""),"milligrams→kg":n=>(parseFloat(n)*1e-6).toFixed(9).replace(/\.?0+$/,""),"kg→milligrams":n=>(parseFloat(n)*1e6).toFixed(2).replace(/\.?0+$/,""),"milligrams→oz":n=>(parseFloat(n)*35274e-9).toFixed(8).replace(/\.?0+$/,""),"oz→milligrams":n=>(parseFloat(n)*28349.5).toFixed(2).replace(/\.?0+$/,""),"micrograms→milligrams":n=>(parseFloat(n)/1e3).toFixed(6).replace(/\.?0+$/,""),"milligrams→micrograms":n=>(parseFloat(n)*1e3).toFixed(4).replace(/\.?0+$/,""),"micrograms→grams":n=>(parseFloat(n)*1e-6).toFixed(9).replace(/\.?0+$/,""),"grams→micrograms":n=>(parseFloat(n)*1e6).toFixed(2).replace(/\.?0+$/,""),"carats→grams":n=>(parseFloat(n)*.2).toFixed(4).replace(/\.?0+$/,""),"grams→carats":n=>(parseFloat(n)*5).toFixed(4).replace(/\.?0+$/,""),"troy-oz→grams":n=>(parseFloat(n)*31.1035).toFixed(4).replace(/\.?0+$/,""),"grams→troy-oz":n=>(parseFloat(n)/31.1035).toFixed(6).replace(/\.?0+$/,""),"troy-oz→oz":n=>(parseFloat(n)*1.09714).toFixed(4).replace(/\.?0+$/,""),"oz→troy-oz":n=>(parseFloat(n)/1.09714).toFixed(6).replace(/\.?0+$/,""),"dur-ms→dur-seconds":n=>(parseFloat(n)/1e3).toFixed(4).replace(/\.?0+$/,""),"dur-seconds→dur-ms":n=>(parseFloat(n)*1e3).toFixed(2).replace(/\.?0+$/,""),"dur-ms→dur-minutes":n=>(parseFloat(n)/6e4).toFixed(6).replace(/\.?0+$/,""),"dur-minutes→dur-ms":n=>(parseFloat(n)*6e4).toFixed(2).replace(/\.?0+$/,""),"dur-ms→dur-hours":n=>(parseFloat(n)/36e5).toFixed(8).replace(/\.?0+$/,""),"dur-hours→dur-ms":n=>(parseFloat(n)*36e5).toFixed(2).replace(/\.?0+$/,""),"dur-weeks→dur-hours":n=>(parseFloat(n)*168).toFixed(4).replace(/\.?0+$/,""),"dur-hours→dur-weeks":n=>(parseFloat(n)/168).toFixed(6).replace(/\.?0+$/,""),"dur-weeks→dur-minutes":n=>(parseFloat(n)*10080).toFixed(2).replace(/\.?0+$/,""),"dur-minutes→dur-weeks":n=>(parseFloat(n)/10080).toFixed(8).replace(/\.?0+$/,""),"dur-weeks→dur-days":n=>(parseFloat(n)*7).toFixed(4).replace(/\.?0+$/,""),"dur-days→dur-weeks":n=>(parseFloat(n)/7).toFixed(6).replace(/\.?0+$/,""),"color-hsv→color-cmyk":n=>{const r=Jo(n);if(!r)throw new Error("bad hsv");const s=Qo(r),c=s.r/255,d=s.g/255,f=s.b/255,h=1-Math.max(c,d,f);return h===1?"cmyk(0%, 0%, 0%, 100%)":`cmyk(${Math.round((1-c-h)/(1-h)*100)}%, ${Math.round((1-d-h)/(1-h)*100)}%, ${Math.round((1-f-h)/(1-h)*100)}%, ${Math.round(h*100)}%)`},"color-cmyk→color-hsv":n=>{const r=n.match(/cmyk\(\s*([\d.]+)%[^,]*,\s*([\d.]+)%[^,]*,\s*([\d.]+)%[^,]*,\s*([\d.]+)%/i);if(!r)throw new Error("bad cmyk");const[s,c,d,f]=[parseFloat(r[1])/100,parseFloat(r[2])/100,parseFloat(r[3])/100,parseFloat(r[4])/100],h={r:Math.round(255*(1-s)*(1-f)),g:Math.round(255*(1-c)*(1-f)),b:Math.round(255*(1-d)*(1-f))},y=Al(h);return`hsv(${y.h}, ${y.s}%, ${y.v}%)`},"ohm→kilohm":n=>(parseFloat(n)/1e3).toFixed(6).replace(/\.?0+$/,""),"kilohm→ohm":n=>(parseFloat(n)*1e3).toFixed(4).replace(/\.?0+$/,""),"ohm→megohm":n=>(parseFloat(n)*1e-6).toFixed(9).replace(/\.?0+$/,""),"megohm→ohm":n=>(parseFloat(n)*1e6).toFixed(2).replace(/\.?0+$/,""),"ohm→milliohm":n=>(parseFloat(n)*1e3).toFixed(4).replace(/\.?0+$/,""),"milliohm→ohm":n=>(parseFloat(n)/1e3).toFixed(6).replace(/\.?0+$/,""),"kilohm→megohm":n=>(parseFloat(n)/1e3).toFixed(6).replace(/\.?0+$/,""),"megohm→kilohm":n=>(parseFloat(n)*1e3).toFixed(4).replace(/\.?0+$/,""),"milliohm→kilohm":n=>(parseFloat(n)*1e-6).toFixed(9).replace(/\.?0+$/,""),"kilohm→milliohm":n=>(parseFloat(n)*1e6).toFixed(2).replace(/\.?0+$/,""),"ms2→gforce":n=>(parseFloat(n)/9.80665).toFixed(6).replace(/\.?0+$/,""),"gforce→ms2":n=>(parseFloat(n)*9.80665).toFixed(4).replace(/\.?0+$/,""),"ms2→fts2":n=>(parseFloat(n)*3.28084).toFixed(4).replace(/\.?0+$/,""),"fts2→ms2":n=>(parseFloat(n)/3.28084).toFixed(6).replace(/\.?0+$/,""),"ms2→cms2":n=>(parseFloat(n)*100).toFixed(4).replace(/\.?0+$/,""),"cms2→ms2":n=>(parseFloat(n)/100).toFixed(6).replace(/\.?0+$/,""),"gforce→fts2":n=>(parseFloat(n)*32.1741).toFixed(4).replace(/\.?0+$/,""),"fts2→gforce":n=>(parseFloat(n)/32.1741).toFixed(6).replace(/\.?0+$/,""),"gforce→cms2":n=>(parseFloat(n)*980.665).toFixed(4).replace(/\.?0+$/,""),"cms2→gforce":n=>(parseFloat(n)/980.665).toFixed(6).replace(/\.?0+$/,""),"fts2→cms2":n=>(parseFloat(n)*30.48).toFixed(4).replace(/\.?0+$/,""),"cms2→fts2":n=>(parseFloat(n)/30.48).toFixed(6).replace(/\.?0+$/,""),"nm-torque→lb-ft":n=>(parseFloat(n)*.737562).toFixed(4).replace(/\.?0+$/,""),"lb-ft→nm-torque":n=>(parseFloat(n)*1.35582).toFixed(4).replace(/\.?0+$/,""),"nm-torque→lb-in":n=>(parseFloat(n)*8.85075).toFixed(4).replace(/\.?0+$/,""),"lb-in→nm-torque":n=>(parseFloat(n)*.112985).toFixed(6).replace(/\.?0+$/,""),"nm-torque→kg-cm":n=>(parseFloat(n)*10.1972).toFixed(4).replace(/\.?0+$/,""),"kg-cm→nm-torque":n=>(parseFloat(n)*.098066).toFixed(6).replace(/\.?0+$/,""),"lb-ft→lb-in":n=>(parseFloat(n)*12).toFixed(4).replace(/\.?0+$/,""),"lb-in→lb-ft":n=>(parseFloat(n)/12).toFixed(6).replace(/\.?0+$/,""),"lb-ft→kg-cm":n=>(parseFloat(n)*13.8255).toFixed(4).replace(/\.?0+$/,""),"kg-cm→lb-ft":n=>(parseFloat(n)/13.8255).toFixed(6).replace(/\.?0+$/,""),"lb-in→kg-cm":n=>(parseFloat(n)*1.15212).toFixed(4).replace(/\.?0+$/,""),"kg-cm→lb-in":n=>(parseFloat(n)/1.15212).toFixed(6).replace(/\.?0+$/,""),"newton→kilonewton":n=>(parseFloat(n)/1e3).toFixed(8).replace(/\.?0+$/,""),"kilonewton→newton":n=>(parseFloat(n)*1e3).toFixed(4).replace(/\.?0+$/,""),"newton→pound-force":n=>(parseFloat(n)*.224809).toFixed(6).replace(/\.?0+$/,""),"pound-force→newton":n=>(parseFloat(n)*4.44822).toFixed(6).replace(/\.?0+$/,""),"newton→kgforce":n=>(parseFloat(n)*.101972).toFixed(6).replace(/\.?0+$/,""),"kgforce→newton":n=>(parseFloat(n)*9.80665).toFixed(6).replace(/\.?0+$/,""),"newton→dyne":n=>(parseFloat(n)*1e5).toFixed(4).replace(/\.?0+$/,""),"dyne→newton":n=>(parseFloat(n)/1e5).toFixed(10).replace(/\.?0+$/,""),"kilonewton→pound-force":n=>(parseFloat(n)*224.809).toFixed(4).replace(/\.?0+$/,""),"pound-force→kilonewton":n=>(parseFloat(n)*.00444822).toFixed(8).replace(/\.?0+$/,""),"kilonewton→kgforce":n=>(parseFloat(n)*101.972).toFixed(4).replace(/\.?0+$/,""),"kgforce→kilonewton":n=>(parseFloat(n)*.00980665).toFixed(8).replace(/\.?0+$/,""),"pound-force→kgforce":n=>(parseFloat(n)*.453592).toFixed(6).replace(/\.?0+$/,""),"kgforce→pound-force":n=>(parseFloat(n)*2.20462).toFixed(6).replace(/\.?0+$/,""),"pound-force→dyne":n=>(parseFloat(n)*444822).toFixed(2).replace(/\.?0+$/,""),"dyne→pound-force":n=>(parseFloat(n)*224809e-11).toFixed(12).replace(/\.?0+$/,""),"lux→footcandle":n=>(parseFloat(n)*.092903).toFixed(6).replace(/\.?0+$/,""),"footcandle→lux":n=>(parseFloat(n)*10.7639).toFixed(4).replace(/\.?0+$/,""),"lux→phot":n=>(parseFloat(n)*1e-4).toFixed(8).replace(/\.?0+$/,""),"phot→lux":n=>(parseFloat(n)*1e4).toFixed(4).replace(/\.?0+$/,""),"lux→nox":n=>(parseFloat(n)*1e3).toFixed(4).replace(/\.?0+$/,""),"nox→lux":n=>(parseFloat(n)/1e3).toFixed(8).replace(/\.?0+$/,""),"footcandle→phot":n=>(parseFloat(n)*.00929).toFixed(6).replace(/\.?0+$/,""),"phot→footcandle":n=>(parseFloat(n)/.00929).toFixed(4).replace(/\.?0+$/,""),"farad→microfarad":n=>(parseFloat(n)*1e6).toFixed(4).replace(/\.?0+$/,""),"microfarad→farad":n=>(parseFloat(n)*1e-6).toFixed(12).replace(/\.?0+$/,""),"farad→nanofarad":n=>(parseFloat(n)*1e9).toFixed(4).replace(/\.?0+$/,""),"nanofarad→farad":n=>(parseFloat(n)*1e-9).toFixed(15).replace(/\.?0+$/,""),"farad→picofarad":n=>(parseFloat(n)*1e12).toFixed(4).replace(/\.?0+$/,""),"picofarad→farad":n=>(parseFloat(n)*1e-12).toFixed(18).replace(/\.?0+$/,""),"microfarad→nanofarad":n=>(parseFloat(n)*1e3).toFixed(4).replace(/\.?0+$/,""),"nanofarad→microfarad":n=>(parseFloat(n)/1e3).toFixed(8).replace(/\.?0+$/,""),"microfarad→picofarad":n=>(parseFloat(n)*1e6).toFixed(4).replace(/\.?0+$/,""),"picofarad→microfarad":n=>(parseFloat(n)*1e-6).toFixed(12).replace(/\.?0+$/,""),"nanofarad→picofarad":n=>(parseFloat(n)*1e3).toFixed(4).replace(/\.?0+$/,""),"picofarad→nanofarad":n=>(parseFloat(n)/1e3).toFixed(8).replace(/\.?0+$/,""),"terahertz→gigahertz":n=>(parseFloat(n)*1e3).toFixed(4).replace(/\.?0+$/,""),"gigahertz→terahertz":n=>(parseFloat(n)/1e3).toFixed(8).replace(/\.?0+$/,""),"terahertz→megahertz":n=>(parseFloat(n)*1e6).toFixed(4).replace(/\.?0+$/,""),"megahertz→terahertz":n=>(parseFloat(n)*1e-6).toFixed(12).replace(/\.?0+$/,""),"terahertz→kilohertz":n=>(parseFloat(n)*1e9).toFixed(4).replace(/\.?0+$/,""),"kilohertz→terahertz":n=>(parseFloat(n)*1e-9).toFixed(15).replace(/\.?0+$/,""),"terahertz→hertz":n=>(parseFloat(n)*1e12).toFixed(4).replace(/\.?0+$/,""),"hertz→terahertz":n=>(parseFloat(n)*1e-12).toFixed(18).replace(/\.?0+$/,""),"gigahertz→megahertz":n=>(parseFloat(n)*1e3).toFixed(4).replace(/\.?0+$/,""),"megahertz→gigahertz":n=>(parseFloat(n)/1e3).toFixed(8).replace(/\.?0+$/,""),"gigahertz→kilohertz":n=>(parseFloat(n)*1e6).toFixed(4).replace(/\.?0+$/,""),"kilohertz→gigahertz":n=>(parseFloat(n)*1e-6).toFixed(12).replace(/\.?0+$/,""),"gigahertz→hertz":n=>(parseFloat(n)*1e9).toFixed(4).replace(/\.?0+$/,""),"hertz→gigahertz":n=>(parseFloat(n)*1e-9).toFixed(15).replace(/\.?0+$/,""),"percent→decimal-frac":n=>(parseFloat(n)/100).toFixed(6).replace(/\.?0+$/,""),"decimal-frac→percent":n=>(parseFloat(n)*100).toFixed(4).replace(/\.?0+$/,""),"percent→ppm":n=>(parseFloat(n)*1e4).toFixed(4).replace(/\.?0+$/,""),"ppm→percent":n=>(parseFloat(n)/1e4).toFixed(8).replace(/\.?0+$/,""),"percent→ppb":n=>(parseFloat(n)*1e7).toFixed(4).replace(/\.?0+$/,""),"ppb→percent":n=>(parseFloat(n)/1e7).toFixed(12).replace(/\.?0+$/,""),"decimal-frac→ppm":n=>(parseFloat(n)*1e6).toFixed(4).replace(/\.?0+$/,""),"ppm→decimal-frac":n=>(parseFloat(n)*1e-6).toFixed(12).replace(/\.?0+$/,""),"decimal-frac→ppb":n=>(parseFloat(n)*1e9).toFixed(4).replace(/\.?0+$/,""),"ppb→decimal-frac":n=>(parseFloat(n)*1e-9).toFixed(15).replace(/\.?0+$/,""),"ppm→ppb":n=>(parseFloat(n)*1e3).toFixed(4).replace(/\.?0+$/,""),"ppb→ppm":n=>(parseFloat(n)/1e3).toFixed(8).replace(/\.?0+$/,""),"pt-type→pica":n=>(parseFloat(n)/12).toFixed(6).replace(/\.?0+$/,""),"pica→pt-type":n=>(parseFloat(n)*12).toFixed(4).replace(/\.?0+$/,""),"pt-type→screen-px":n=>(parseFloat(n)*96/72).toFixed(4).replace(/\.?0+$/,""),"screen-px→pt-type":n=>(parseFloat(n)*72/96).toFixed(4).replace(/\.?0+$/,""),"pt-type→twip":n=>(parseFloat(n)*20).toFixed(4).replace(/\.?0+$/,""),"twip→pt-type":n=>(parseFloat(n)/20).toFixed(6).replace(/\.?0+$/,""),"pt-type→mm":n=>(parseFloat(n)*25.4/72).toFixed(6).replace(/\.?0+$/,""),"mm→pt-type":n=>(parseFloat(n)*72/25.4).toFixed(4).replace(/\.?0+$/,""),"pt-type→inch":n=>(parseFloat(n)/72).toFixed(8).replace(/\.?0+$/,""),"inch→pt-type":n=>(parseFloat(n)*72).toFixed(4).replace(/\.?0+$/,""),"pt-type→cm":n=>(parseFloat(n)*2.54/72).toFixed(6).replace(/\.?0+$/,""),"cm→pt-type":n=>(parseFloat(n)*72/2.54).toFixed(4).replace(/\.?0+$/,""),"pica→mm":n=>(parseFloat(n)*25.4/6).toFixed(4).replace(/\.?0+$/,""),"mm→pica":n=>(parseFloat(n)*6/25.4).toFixed(6).replace(/\.?0+$/,""),"pica→inch":n=>(parseFloat(n)/6).toFixed(6).replace(/\.?0+$/,""),"inch→pica":n=>(parseFloat(n)*6).toFixed(4).replace(/\.?0+$/,""),"pica→cm":n=>(parseFloat(n)*2.54/6).toFixed(4).replace(/\.?0+$/,""),"cm→pica":n=>(parseFloat(n)*6/2.54).toFixed(6).replace(/\.?0+$/,""),"pica→screen-px":n=>(parseFloat(n)*96/6).toFixed(4).replace(/\.?0+$/,""),"screen-px→pica":n=>(parseFloat(n)*6/96).toFixed(6).replace(/\.?0+$/,""),"screen-px→mm":n=>(parseFloat(n)*25.4/96).toFixed(6).replace(/\.?0+$/,""),"mm→screen-px":n=>(parseFloat(n)*96/25.4).toFixed(4).replace(/\.?0+$/,""),"screen-px→inch":n=>(parseFloat(n)/96).toFixed(8).replace(/\.?0+$/,""),"inch→screen-px":n=>(parseFloat(n)*96).toFixed(4).replace(/\.?0+$/,""),"screen-px→cm":n=>(parseFloat(n)*2.54/96).toFixed(6).replace(/\.?0+$/,""),"cm→screen-px":n=>(parseFloat(n)*96/2.54).toFixed(4).replace(/\.?0+$/,""),"twip→mm":n=>(parseFloat(n)*25.4/1440).toFixed(6).replace(/\.?0+$/,""),"mm→twip":n=>(parseFloat(n)*1440/25.4).toFixed(4).replace(/\.?0+$/,""),"twip→inch":n=>(parseFloat(n)/1440).toFixed(8).replace(/\.?0+$/,""),"inch→twip":n=>(parseFloat(n)*1440).toFixed(4).replace(/\.?0+$/,""),"twip→screen-px":n=>(parseFloat(n)*96/1440).toFixed(6).replace(/\.?0+$/,""),"screen-px→twip":n=>(parseFloat(n)*1440/96).toFixed(4).replace(/\.?0+$/,""),"twip→pica":n=>(parseFloat(n)/240).toFixed(6).replace(/\.?0+$/,""),"pica→twip":n=>(parseFloat(n)*240).toFixed(4).replace(/\.?0+$/,""),"dur-us→dur-ms":n=>(parseFloat(n)/1e3).toFixed(6).replace(/\.?0+$/,""),"dur-ms→dur-us":n=>(parseFloat(n)*1e3).toFixed(2).replace(/\.?0+$/,""),"dur-us→dur-seconds":n=>(parseFloat(n)/1e6).toFixed(9).replace(/\.?0+$/,""),"dur-seconds→dur-us":n=>(parseFloat(n)*1e6).toFixed(2).replace(/\.?0+$/,""),"dur-us→dur-ns":n=>(parseFloat(n)*1e3).toFixed(2).replace(/\.?0+$/,""),"dur-ns→dur-us":n=>(parseFloat(n)/1e3).toFixed(6).replace(/\.?0+$/,""),"dur-ns→dur-ms":n=>(parseFloat(n)/1e6).toFixed(9).replace(/\.?0+$/,""),"dur-ms→dur-ns":n=>(parseFloat(n)*1e6).toFixed(2).replace(/\.?0+$/,""),"dur-ns→dur-seconds":n=>(parseFloat(n)/1e9).toFixed(12).replace(/\.?0+$/,""),"dur-seconds→dur-ns":n=>(parseFloat(n)*1e9).toFixed(2).replace(/\.?0+$/,""),"dur-ns→dur-minutes":n=>(parseFloat(n)/6e10).toFixed(14).replace(/\.?0+$/,""),"dur-minutes→dur-ns":n=>(parseFloat(n)*6e10).toFixed(0),"dur-months→dur-days":n=>(parseFloat(n)*30.4375).toFixed(4).replace(/\.?0+$/,""),"dur-days→dur-months":n=>(parseFloat(n)/30.4375).toFixed(6).replace(/\.?0+$/,""),"dur-months→dur-weeks":n=>(parseFloat(n)*4.34821).toFixed(4).replace(/\.?0+$/,""),"dur-weeks→dur-months":n=>(parseFloat(n)/4.34821).toFixed(6).replace(/\.?0+$/,""),"dur-months→dur-hours":n=>(parseFloat(n)*730.5).toFixed(2).replace(/\.?0+$/,""),"dur-hours→dur-months":n=>(parseFloat(n)/730.5).toFixed(8).replace(/\.?0+$/,""),"dur-months→dur-seconds":n=>(parseFloat(n)*2629800).toFixed(0),"dur-seconds→dur-months":n=>(parseFloat(n)/2629800).toFixed(10).replace(/\.?0+$/,""),"dur-years→dur-months":n=>(parseFloat(n)*12).toFixed(4).replace(/\.?0+$/,""),"dur-months→dur-years":n=>(parseFloat(n)/12).toFixed(6).replace(/\.?0+$/,""),"dur-years→dur-days":n=>(parseFloat(n)*365.25).toFixed(4).replace(/\.?0+$/,""),"dur-days→dur-years":n=>(parseFloat(n)/365.25).toFixed(8).replace(/\.?0+$/,""),"dur-years→dur-weeks":n=>(parseFloat(n)*52.1775).toFixed(4).replace(/\.?0+$/,""),"dur-weeks→dur-years":n=>(parseFloat(n)/52.1775).toFixed(8).replace(/\.?0+$/,""),"dur-years→dur-hours":n=>(parseFloat(n)*8766).toFixed(2).replace(/\.?0+$/,""),"dur-hours→dur-years":n=>(parseFloat(n)/8766).toFixed(8).replace(/\.?0+$/,""),"dur-years→dur-seconds":n=>(parseFloat(n)*31557600).toFixed(0),"dur-seconds→dur-years":n=>(parseFloat(n)/31557600).toFixed(10).replace(/\.?0+$/,""),"dur-years→dur-minutes":n=>(parseFloat(n)*525960).toFixed(0),"dur-minutes→dur-years":n=>(parseFloat(n)/525960).toFixed(10).replace(/\.?0+$/,"")},ou={};for(const n of Object.keys(em)){const[r,s]=n.split("→");ou[r]||(ou[r]=[]),ou[r].push(s)}const n0={"kg-force":"kgforce",kgforce:"kg-force"};function Ah(n){const r=n0[n];return r?[n,r]:[n]}function In(n){return Zh.has(n)?Jy(n):[]}function Fh(n,r){for(const s of Ah(n))for(const c of Ah(r)){const d=em[`${s}→${c}`];if(d)return d}return null}const a0=Object.freeze({shell:Object.freeze({skip:"Zum Inhalt springen",home:"Startseite",tools:"Werkzeuge",privacyStatus:"Lokale Verarbeitung",localeLabel:"Sprache wählen",themeToggle:"Dunkles Design",menuOpen:"Menü öffnen",menuClose:"Menü schliessen",mobileNavigation:"Mobile Navigation",primaryNavigation:"Hauptnavigation",privacy:"Datenschutz",openSource:"Open Source",licenses:"Lizenzen",terms:"Nutzungsbedingungen",contact:"Kontakt",source:"Quellcode",footerNavigation:"Fussnavigation",footerNote:"Folkkit verarbeitet Dateiinhalte lokal in deinem Browser."}),home:Object.freeze({eyebrow:"Werkzeuge für den Alltag",title:"Dateien bearbeiten, ohne sie hochzuladen.",intro:"PDFs ordnen, QR-Codes erstellen und Formate umwandeln. Die Verarbeitung läuft direkt auf deinem Gerät.",privacyTitle:"Deine Dateien bleiben in diesem Browser.",privacyBody:"Folkkit überträgt keine Dateiinhalte zur Verarbeitung. Der statische Webhost kann beim Seitenaufruf technische Zugriffsdaten erhalten.",pdfTitle:"PDF bearbeiten",pdfBody:"PDFs zusammenführen, Seiten extrahieren oder drehen.",qrTitle:"QR-Code erstellen",qrBody:"Text oder einen Link lokal in einen QR-Code umwandeln.",convertTitle:"Datei konvertieren",convertBody:"Mit einer einfachen Formatumwandlung beginnen.",catalogLink:"Alle freigegebenen Werkzeuge ansehen"}),catalog:Object.freeze({toolCount:"{count} Werkzeuge",eyebrow:"Werkzeugkatalog",title:"Alle freigegebenen Werkzeuge",intro:"Hier erscheinen nur Werkzeuge, die den aktuellen Freigabestatus erfüllen.",openTool:"{name} öffnen"}),workspace:Object.freeze({eyebrow:"Lokaler Arbeitsbereich",title:"Datei lokal bearbeiten",intro:"Wähle eine Eingabe. Verarbeitung und Ergebnis bleiben in dieser Sitzung auf deinem Gerät.",dropOverlay:"Datei zum Konvertieren ablegen",unsupportedDrop:"Dieser Dateityp kann hier nicht automatisch geöffnet werden. Wähle ein freigegebenes Werkzeug.",pairTitle:"{from} in {to}",pairDescription:"{from} lokal in {to} umwandeln. Dateiinhalte werden nicht hochgeladen.",toolDescription:"{name} lokal im Browser verwenden. Dateiinhalte werden nicht hochgeladen."}),keyboardHelp:Object.freeze({title:"Tastaturkürzel",convertGroup:"Konvertierungsbereich",focusInput:"Eingabefeld fokussieren",swap:"Eingabe ↔ Ausgabe tauschen",copyOutput:"Ausgabe kopieren",reset:"Konvertierung zurücksetzen",toggleBatch:"Stapelmodus umschalten",backToFormats:"Zurück zur Formatauswahl",globalGroup:"Allgemein",toggleTheme:"Zwischen hellem und dunklem Design wechseln",thisHelp:"Diese Hilfe",footer:"Mit ? oder Esc schliessen",close:"Tastaturhilfe schliessen",closeVisible:"Schliessen"}),workspaceTools:Object.freeze({input:"Eingabe",output:"Ergebnis",inputText:"Eingabetext",conversionResult:"Konvertierungsergebnis",toolInputText:"Werkzeugeingabe",toolOutputText:"Werkzeugergebnis",formatInputPlaceholder:"Wert eingeben oder einfügen",resultPlaceholder:"Ergebnis erscheint hier",parametersPlaceholder:"Parameter eingeben",clear:"Zurücksetzen",clearInput:"Eingabe löschen",selectFile:"Datei auswählen",selectFiles:"PDF-Dateien auswählen",dropFile:"Datei hier ablegen oder auswählen",dropFiles:"Dateien hier ablegen oder auswählen",convert:"Konvertieren",parameters:"Werkzeugparameter",progressLabel:"Fortschritt",processing:"Verarbeitung läuft: {progress}",loadingRuntime:"Medienmodul wird lokal geladen.",loadingTool:"Werkzeug wird lokal geladen.",mediaModuleUnavailable:"Das Medienmodul ist offline noch nicht verfügbar. Stelle die Internetverbindung wieder her und versuche es erneut.",toolModuleUnavailable:"Dieses Werkzeugmodul ist offline noch nicht verfügbar. Stelle die Internetverbindung wieder her und versuche es erneut.",retryModule:"Erneut versuchen",cancel:"Abbrechen",download:"Herunterladen",copy:"Kopieren",copied:"Ergebnis kopiert",copiedToClipboard:"In Zwischenablage kopiert",copiedOutput:"Ausgabe kopiert",linkCopied:"Link kopiert",shareLinkCopied:"Freigabelink kopiert",discard:"Verwerfen",previewAlt:"Lokale Ergebnisvorschau",shareTool:"Werkzeug teilen",moreFiles:"{count} weitere Dateien",detected:"erkannt",selectInput:"Eingabe auswählen: {name}",selectOutput:"Ausgabeformat auswählen: {name}",swap:"Formate tauschen",noReverseConversion:"Keine umgekehrte Konvertierung verfügbar",enableBatch:"Stapelmodus aktivieren",disableBatch:"Stapelmodus deaktivieren",addFavourite:"Formatpaar zu Favoriten hinzufügen",removeFavourite:"Formatpaar aus Favoriten entfernen",pickColor:"Farbe auswählen",copyResult:"Ergebnis kopieren",downloadResult:"Ergebnis herunterladen",useAsInput:"Ergebnis als Eingabe verwenden",wordWrapOn:"Zeilenumbruch aktiv",wordWrapOff:"Zeilenumbruch inaktiv",showLineNumbers:"Zeilennummern anzeigen",hideLineNumbers:"Zeilennummern ausblenden",shareConversion:"Konvertierung teilen",colorPreview:"Farbvorschau",base64Preview:"Base64-Vorschau",chain:"Weiterverarbeiten",generate:"Erzeugen",saveResult:"Ergebnis speichern",inputStats:"Zeichen {characters} · Wörter {words} · Zeilen {lines}",outputStats:"Zeichen {characters} · Zeilen {lines}",characterCount:"Zeichen: {count}",byteCount:"{count} Bytes"}),history:Object.freeze({consent:"Der lokale Verlauf wird erst nach deiner Zustimmung in diesem Browser gespeichert.",enable:"Lokalen Verlauf aktivieren",recent:"Letzte Konvertierungen",deleteAndDisable:"Verlauf löschen und deaktivieren",empty:"Noch kein lokaler Verlauf.",remove:"Aus Verlauf entfernen",copy:"Ergebnis kopieren",reuse:"Wiederverwenden",copied:"In Zwischenablage kopiert",now:"jetzt",minutesAgo:"vor {count} Min.",hoursAgo:"vor {count} Std.",daysAgo:"vor {count} Tagen"}),toolPicker:Object.freeze({searchConversions:"Konvertierungen durchsuchen",searchFormats:"Formate durchsuchen",searchConversionsPlaceholder:"Alle Konvertierungen durchsuchen …",searchFormatsPlaceholder:"Formate durchsuchen …",formats:"Formate",tools:"Werkzeuge",noResults:"Keine Ergebnisse",noFormats:"Keine Formate gefunden",noItems:"Keine Einträge in dieser Kategorie",recent:"Zuletzt verwendet",tabs:Object.freeze({text:"Text",encode:"Codierung",data:"Daten",number:"Zahlen",hash:"Prüfwerte",color:"Farben",units:"Einheiten",image:"Bilder",media:"Audio und Video",document:"PDF und Dokumente",utility:"Hilfsmittel"}),groups:Object.freeze({Text:"Text",Case:"Gross- und Kleinschreibung",Data:"Daten",Number:"Zahlen",Color:"Farben",Recent:"Zuletzt verwendet"})}),errorBoundary:Object.freeze({message:"Bei diesem Werkzeug ist ein Fehler aufgetreten.",retry:"Erneut versuchen"}),errors:Object.freeze({unsupportedType:"Dieser Dateityp wird von diesem Werkzeug nicht unterstützt.",unsupportedPair:"Für dieses Formatpaar existiert keine Konvertierung.",unsupportedBrowser:"QR-Codes können in diesem Browser nicht gelesen werden.",tooLarge:"Die ausgewählte Datei ist für dieses Gerät zu gross.",invalidFile:"Die Datei ist beschädigt oder ungültig.",outOfMemory:"Der verfügbare Speicher reicht für diese Verarbeitung nicht aus.",cancelled:"Der Vorgang wurde abgebrochen.",conversionFailed:"Die Verarbeitung ist fehlgeschlagen.",mediaRuntimeUnavailable:"FFmpeg-Core und WASM sind offline nicht verfügbar. Stelle die Internetverbindung wieder her und versuche es erneut.",resourceLimit:"Die Eingabe überschreitet die sichere Verarbeitungsgrenze."}),formatCompatibility:Object.freeze({warningTitle:"Diese Dateiformate sind nicht miteinander kompatibel.",warningBody:"Die vorhandene Konvertierungsfunktion ist nur für einen bewussten Spezialfall vorgesehen. Prüfe das Ergebnis sorgfältig.",confirmation:"Ich weiss, was ich mache, und verstehe, dass diese Dateiformate nicht miteinander kompatibel sind."}),labels:Object.freeze({experimental:"Experimentell",mediaWarning:"Experimentell. Das lokale Medienmodul benötigt je nach Datei viel Speicher und Rechenleistung."}),categories:Object.freeze({encode:"QR und Codierung",hash:"Prüfwerte",data:"Daten",number:"Zahlen",color:"Farben",utility:"Hilfsmittel",image:"Bilder",media:"Audio und Video",document:"PDF und Dokumente"}),tools:Object.freeze({base64Encode:Object.freeze({name:"Base64 codieren",description:"Text lokal in Base64 umwandeln",placeholder:"Text eingeben oder einfügen"}),base64Decode:Object.freeze({name:"Base64 decodieren",description:"Base64 lokal in Text zurückwandeln"}),urlEncode:Object.freeze({name:"URL codieren",description:"Text für eine URL percent-codieren"}),urlDecode:Object.freeze({name:"URL decodieren",description:"Percent-codierten URL-Text zurückwandeln"}),htmlEncode:Object.freeze({name:"HTML-Zeichen maskieren",description:"HTML-Sonderzeichen durch Entities ersetzen"}),htmlDecode:Object.freeze({name:"HTML-Entities decodieren",description:"HTML-Entities in Zeichen zurückwandeln"}),hexEncode:Object.freeze({name:"Text in Hex",description:"Text lokal in Hexadezimalwerte umwandeln"}),hexDecode:Object.freeze({name:"Hex in Text",description:"Hexadezimalwerte lokal in Text umwandeln"}),binaryEncode:Object.freeze({name:"Text in Binär",description:"Text lokal in Binärwerte umwandeln"}),binaryDecode:Object.freeze({name:"Binär in Text",description:"Binärwerte lokal in Text umwandeln"}),unicodeEscape:Object.freeze({name:"Unicode maskieren",description:"Text in Unicode-Escape-Sequenzen umwandeln"}),unicodeUnescape:Object.freeze({name:"Unicode-Escapes decodieren",description:"Unicode-Escape-Sequenzen in Text zurückwandeln"}),rot13:Object.freeze({name:"ROT13",description:"ROT13 lokal auf Text anwenden"}),atbash:Object.freeze({name:"Atbash",description:"Das lateinische Alphabet lokal spiegeln"}),sha256:Object.freeze({name:"SHA-256-Prüfwert",description:"Einen SHA-256-Prüfwert berechnen, ohne eine Passwort- oder Sicherheitsprüfung zu versprechen"}),jsonPrettify:Object.freeze({name:"JSON formatieren",description:"JSON mit Einrückungen lesbar formatieren"}),jsonMinify:Object.freeze({name:"JSON minimieren",description:"Unnötige Leerzeichen aus JSON entfernen"}),jsonEscape:Object.freeze({name:"JSON-String maskieren",description:"Text als JSON-String maskieren"}),csvToJson:Object.freeze({name:"CSV in JSON",description:"Eine begrenzte CSV-Tabelle lokal in ein JSON-Array umwandeln"}),decToHex:Object.freeze({name:"Dezimal in Hex",description:"Eine Dezimalzahl in Hexadezimal umwandeln"}),hexToDec:Object.freeze({name:"Hex in Dezimal",description:"Eine Hexadezimalzahl in Dezimal umwandeln"}),decToBin:Object.freeze({name:"Dezimal in Binär",description:"Eine Dezimalzahl in Binär umwandeln"}),binToDec:Object.freeze({name:"Binär in Dezimal",description:"Eine Binärzahl in Dezimal umwandeln"}),decToOct:Object.freeze({name:"Dezimal in Oktal",description:"Eine Dezimalzahl in Oktal umwandeln"}),octToDec:Object.freeze({name:"Oktal in Dezimal",description:"Eine Oktalzahl in Dezimal umwandeln"}),colorConvert:Object.freeze({name:"Farbwert umwandeln",description:"Zwischen HEX, RGB und HSL umwandeln"}),cssMinify:Object.freeze({name:"CSS minimieren",description:"Kommentare und unnötige Leerzeichen aus CSS entfernen"}),jsonValidate:Object.freeze({name:"JSON-Syntax prüfen",description:"JSON-Syntax lokal parsen und Fehler anzeigen"}),base64urlEncode:Object.freeze({name:"Base64URL codieren",description:"Text in URL-sicheres Base64 umwandeln"}),base64urlDecode:Object.freeze({name:"Base64URL decodieren",description:"URL-sicheres Base64 in Text zurückwandeln"}),slugGen:Object.freeze({name:"URL-Slug erstellen",description:"Text in einen einfachen URL-Slug umwandeln"}),charCount:Object.freeze({name:"Zeichen und Wörter zählen",description:"Zeichen, Wörter, Zeilen und Bytes lokal zählen"}),reverseText:Object.freeze({name:"Text umkehren",description:"Die Reihenfolge der Zeichen umkehren"}),percentageCalc:Object.freeze({name:"Prozent berechnen",description:"Einfache Prozentaufgaben lokal berechnen",placeholder:"15% von 200"}),aspectRatio:Object.freeze({name:"Seitenverhältnis berechnen",description:"Ein begrenztes Seitenverhältnis aus Breite und Höhe berechnen"}),loanCalc:Object.freeze({name:"Kreditrate berechnen",description:"Monatsrate, Gesamtkosten und Tilgungsverlauf aus Betrag, Zinssatz und Laufzeit schätzen",placeholder:"250000 4.5% 30",notice:"Nur eine lokale Rechenhilfe, keine Finanzberatung."}),bmiCalc:Object.freeze({name:"BMI berechnen",description:"Den Body-Mass-Index aus Gewicht und Grösse berechnen",placeholder:"70kg 175cm",notice:"Nur eine allgemeine Rechenhilfe, keine medizinische Beratung."}),pngToJpg:Object.freeze({name:"PNG in JPEG",description:"Ein PNG-Bild lokal in JPEG umwandeln"}),jpgToPng:Object.freeze({name:"JPEG in PNG",description:"Ein JPEG-Bild lokal in PNG umwandeln"}),audioToMp3:Object.freeze({name:"Audio in MP3",description:"Eine Audiodatei lokal in MP3 umwandeln"}),textToQr:Object.freeze({name:"Text in QR-Code",description:"QR-Code aus Text oder einem Link erstellen",placeholder:"Text oder Link eingeben"}),imagesToPdf:Object.freeze({name:"Bilder in PDF",description:"Mehrere Bilder zu einem PDF zusammenführen"}),mergePdf:Object.freeze({name:"PDFs zusammenführen",description:"Mehrere PDF-Dateien zu einer Datei zusammenführen"}),pdfPageCount:Object.freeze({name:"PDF-Seiten zählen",description:"Anzahl Seiten einer PDF-Datei ermitteln"}),pdfSplit:Object.freeze({name:"PDF-Seite extrahieren",description:"Eine einzelne Seite aus einer PDF-Datei extrahieren",parameterPlaceholder:"Seitennummer, zum Beispiel 1"}),pdfExtractRange:Object.freeze({name:"PDF-Seiten extrahieren",description:"Einen Seitenbereich aus einer PDF-Datei extrahieren",parameterPlaceholder:"Seitenbereich, zum Beispiel 1-5 oder 1,3,5"}),textToPdf:Object.freeze({name:"Text in PDF",description:"Klartext in ein einfaches PDF-Dokument umwandeln",placeholder:"Text eingeben oder einfügen"}),pdfMetadata:Object.freeze({name:"PDF-Metadaten",description:"Titel, Autor und weitere PDF-Metadaten anzeigen"}),pdfRotate:Object.freeze({name:"PDF-Seiten drehen",description:"Alle Seiten einer PDF-Datei drehen",parameterPlaceholder:"Grad: 90, 180 oder 270"})})}),o0=Object.freeze({shell:Object.freeze({skip:"Skip to content",home:"Home",tools:"Tools",privacyStatus:"Local processing",localeLabel:"Choose language",themeToggle:"Dark theme",menuOpen:"Open menu",menuClose:"Close menu",mobileNavigation:"Mobile navigation",primaryNavigation:"Primary navigation",privacy:"Privacy",openSource:"Open source",licenses:"Licenses",terms:"Terms",contact:"Contact",source:"Source code",footerNavigation:"Footer navigation",footerNote:"Folkkit processes file contents locally in your browser."}),home:Object.freeze({eyebrow:"Everyday tools",title:"Work with files without uploading them.",intro:"Organize PDFs, create QR codes, and change formats. Processing runs directly on your device.",privacyTitle:"Your files stay in this browser.",privacyBody:"Folkkit does not send file contents away for processing. The static web host may receive technical access data when you open the site.",pdfTitle:"Edit PDF",pdfBody:"Merge PDFs, extract pages, or rotate them.",qrTitle:"Create QR code",qrBody:"Turn text or a link into a QR code locally.",convertTitle:"Convert file",convertBody:"Start with a straightforward format conversion.",catalogLink:"View all released tools"}),catalog:Object.freeze({toolCount:"{count} tools",eyebrow:"Tool catalog",title:"All released tools",intro:"Only tools that meet the current release status appear here.",openTool:"Open {name}"}),workspace:Object.freeze({eyebrow:"Local workspace",title:"Work with a file locally",intro:"Choose an input. Processing and results stay on your device for this session.",dropOverlay:"Drop the file to convert it",unsupportedDrop:"This file type cannot be opened automatically here. Choose a released tool.",pairTitle:"{from} to {to}",pairDescription:"Convert {from} to {to} locally in your browser. File contents are not uploaded.",toolDescription:"Use {name} locally in your browser. File contents are not uploaded."}),keyboardHelp:Object.freeze({title:"Keyboard Shortcuts",convertGroup:"Convert Panel",focusInput:"Focus input field",swap:"Swap from ↔ to",copyOutput:"Copy output",reset:"Reset conversion",toggleBatch:"Toggle batch mode",backToFormats:"Back to format mode",globalGroup:"Global",toggleTheme:"Toggle dark/light theme",thisHelp:"This help",footer:"Press ? or Esc to close",close:"Close keyboard help",closeVisible:"Close"}),workspaceTools:Object.freeze({input:"Input",output:"Result",inputText:"Input text",conversionResult:"Conversion result",toolInputText:"Tool input",toolOutputText:"Tool result",formatInputPlaceholder:"Enter or paste a value",resultPlaceholder:"The result will appear here",parametersPlaceholder:"Enter parameters",clear:"Reset",clearInput:"Clear input",selectFile:"Choose file",selectFiles:"Choose PDF files",dropFile:"Drop a file here or choose one",dropFiles:"Drop files here or choose them",convert:"Convert",parameters:"Tool parameters",progressLabel:"Progress",processing:"Processing: {progress}",loadingRuntime:"Loading the local media module.",loadingTool:"Loading the tool locally.",mediaModuleUnavailable:"The media module is not available offline yet. Reconnect to the internet and try again.",toolModuleUnavailable:"This tool module is not available offline yet. Reconnect to the internet and try again.",retryModule:"Try again",cancel:"Cancel",download:"Download",copy:"Copy",copied:"Result copied",copiedToClipboard:"Copied to clipboard",copiedOutput:"Output copied",linkCopied:"Link copied",shareLinkCopied:"Share link copied",discard:"Discard",previewAlt:"Local result preview",shareTool:"Share this tool",moreFiles:"{count} more files",detected:"detected",selectInput:"Choose input: {name}",selectOutput:"Choose output format: {name}",swap:"Swap formats",noReverseConversion:"No reverse conversion available",enableBatch:"Enable batch mode",disableBatch:"Disable batch mode",addFavourite:"Add format pair to favourites",removeFavourite:"Remove format pair from favourites",pickColor:"Choose a colour",copyResult:"Copy result",downloadResult:"Download result",useAsInput:"Use result as input",wordWrapOn:"Word wrap on",wordWrapOff:"Word wrap off",showLineNumbers:"Show line numbers",hideLineNumbers:"Hide line numbers",shareConversion:"Share conversion",colorPreview:"Colour preview",base64Preview:"Base64 preview",chain:"Continue with",generate:"Generate",saveResult:"Save result",inputStats:"Characters {characters} · words {words} · lines {lines}",outputStats:"Characters {characters} · lines {lines}",characterCount:"Characters: {count}",byteCount:"{count} bytes"}),history:Object.freeze({consent:"Local history is stored in this browser only after you enable it.",enable:"Enable local history",recent:"Recent conversions",deleteAndDisable:"Delete history and disable it",empty:"No local history yet.",remove:"Remove from history",copy:"Copy result",reuse:"Reuse",copied:"Copied to clipboard",now:"now",minutesAgo:"{count} min ago",hoursAgo:"{count} hr ago",daysAgo:"{count} days ago"}),toolPicker:Object.freeze({searchConversions:"Search conversions",searchFormats:"Search formats",searchConversionsPlaceholder:"Search all conversions…",searchFormatsPlaceholder:"Search formats…",formats:"Formats",tools:"Tools",noResults:"No results",noFormats:"No formats found",noItems:"No items in this category",recent:"Recent",tabs:Object.freeze({text:"Text",encode:"Encoding",data:"Data",number:"Numbers",hash:"Checksums",color:"Colours",units:"Units",image:"Images",media:"Audio and video",document:"PDF and documents",utility:"Utilities"}),groups:Object.freeze({Text:"Text",Case:"Letter case",Data:"Data",Number:"Numbers",Color:"Colours",Recent:"Recent"})}),errorBoundary:Object.freeze({message:"Something went wrong with this tool.",retry:"Try again"}),errors:Object.freeze({unsupportedType:"This file type is not supported by this tool.",unsupportedPair:"No conversion exists for this format pair.",unsupportedBrowser:"QR codes cannot be read in this browser.",tooLarge:"The selected file is too large for this device.",invalidFile:"The file is damaged or invalid.",outOfMemory:"There is not enough available memory for this conversion.",cancelled:"The operation was cancelled.",conversionFailed:"Processing failed.",mediaRuntimeUnavailable:"FFmpeg core and WASM are not available offline. Reconnect to the internet and try again.",resourceLimit:"The input exceeds the safe processing limit."}),formatCompatibility:Object.freeze({warningTitle:"These file formats are not compatible with each other.",warningBody:"The available conversion is intended only for a deliberate specialist case. Check the result carefully.",confirmation:"I know what I am doing and understand that these file formats are not compatible with each other."}),labels:Object.freeze({experimental:"Experimental",mediaWarning:"Experimental. The local media module may need substantial memory and processing power for some files."}),categories:Object.freeze({encode:"QR and encoding",hash:"Checksums",data:"Data",number:"Numbers",color:"Colors",utility:"Utilities",image:"Images",media:"Audio and video",document:"PDF and documents"}),tools:Object.freeze({base64Encode:Object.freeze({name:"Base64 encode",description:"Convert text to Base64 locally",placeholder:"Type or paste text"}),base64Decode:Object.freeze({name:"Base64 decode",description:"Convert Base64 back to text locally"}),urlEncode:Object.freeze({name:"URL encode",description:"Percent-encode text for a URL"}),urlDecode:Object.freeze({name:"URL decode",description:"Convert percent-encoded URL text back to text"}),htmlEncode:Object.freeze({name:"Escape HTML characters",description:"Replace HTML special characters with entities"}),htmlDecode:Object.freeze({name:"Decode HTML entities",description:"Convert HTML entities back to characters"}),hexEncode:Object.freeze({name:"Text to hex",description:"Convert text to hexadecimal values locally"}),hexDecode:Object.freeze({name:"Hex to text",description:"Convert hexadecimal values to text locally"}),binaryEncode:Object.freeze({name:"Text to binary",description:"Convert text to binary values locally"}),binaryDecode:Object.freeze({name:"Binary to text",description:"Convert binary values to text locally"}),unicodeEscape:Object.freeze({name:"Unicode escape",description:"Convert text to Unicode escape sequences"}),unicodeUnescape:Object.freeze({name:"Decode Unicode escapes",description:"Convert Unicode escape sequences back to text"}),rot13:Object.freeze({name:"ROT13",description:"Apply ROT13 to text locally"}),atbash:Object.freeze({name:"Atbash",description:"Mirror the Latin alphabet locally"}),sha256:Object.freeze({name:"SHA-256 checksum",description:"Calculate a SHA-256 checksum without claiming password or security validation"}),jsonPrettify:Object.freeze({name:"Format JSON",description:"Format JSON with readable indentation"}),jsonMinify:Object.freeze({name:"Minify JSON",description:"Remove unnecessary whitespace from JSON"}),jsonEscape:Object.freeze({name:"Escape JSON string",description:"Escape text as a JSON string"}),csvToJson:Object.freeze({name:"CSV to JSON",description:"Convert a bounded CSV table to a JSON array locally"}),decToHex:Object.freeze({name:"Decimal to hex",description:"Convert a decimal number to hexadecimal"}),hexToDec:Object.freeze({name:"Hex to decimal",description:"Convert a hexadecimal number to decimal"}),decToBin:Object.freeze({name:"Decimal to binary",description:"Convert a decimal number to binary"}),binToDec:Object.freeze({name:"Binary to decimal",description:"Convert a binary number to decimal"}),decToOct:Object.freeze({name:"Decimal to octal",description:"Convert a decimal number to octal"}),octToDec:Object.freeze({name:"Octal to decimal",description:"Convert an octal number to decimal"}),colorConvert:Object.freeze({name:"Convert color value",description:"Convert between HEX, RGB, and HSL"}),cssMinify:Object.freeze({name:"Minify CSS",description:"Remove comments and unnecessary whitespace from CSS"}),jsonValidate:Object.freeze({name:"Check JSON syntax",description:"Parse JSON syntax locally and show errors"}),base64urlEncode:Object.freeze({name:"Base64URL encode",description:"Convert text to URL-safe Base64"}),base64urlDecode:Object.freeze({name:"Base64URL decode",description:"Convert URL-safe Base64 back to text"}),slugGen:Object.freeze({name:"Create URL slug",description:"Convert text to a simple URL slug"}),charCount:Object.freeze({name:"Count characters and words",description:"Count characters, words, lines, and bytes locally"}),reverseText:Object.freeze({name:"Reverse text",description:"Reverse the order of characters"}),percentageCalc:Object.freeze({name:"Percentage calculator",description:"Calculate simple percentage expressions locally",placeholder:"15% of 200"}),aspectRatio:Object.freeze({name:"Aspect ratio calculator",description:"Calculate a bounded aspect ratio from width and height"}),loanCalc:Object.freeze({name:"Loan payment calculator",description:"Estimate monthly payment, total cost, and amortization from amount, rate, and term",placeholder:"250000 4.5% 30",notice:"Local calculation aid only, not financial advice."}),bmiCalc:Object.freeze({name:"BMI calculator",description:"Calculate body mass index from weight and height",placeholder:"70kg 175cm",notice:"General calculation aid only, not medical advice."}),pngToJpg:Object.freeze({name:"PNG to JPEG",description:"Convert a PNG image to JPEG locally"}),jpgToPng:Object.freeze({name:"JPEG to PNG",description:"Convert a JPEG image to PNG locally"}),audioToMp3:Object.freeze({name:"Audio to MP3",description:"Convert an audio file to MP3 locally"}),textToQr:Object.freeze({name:"Text to QR code",description:"Create a QR code from text or a link",placeholder:"Type text or a link"}),imagesToPdf:Object.freeze({name:"Images to PDF",description:"Combine several images into one PDF"}),mergePdf:Object.freeze({name:"Merge PDFs",description:"Combine several PDF files into one file"}),pdfPageCount:Object.freeze({name:"Count PDF pages",description:"Find the number of pages in a PDF file"}),pdfSplit:Object.freeze({name:"Extract PDF page",description:"Extract one page from a PDF file",parameterPlaceholder:"Page number, for example 1"}),pdfExtractRange:Object.freeze({name:"Extract PDF pages",description:"Extract a page range from a PDF file",parameterPlaceholder:"Page range, for example 1-5 or 1,3,5"}),textToPdf:Object.freeze({name:"Text to PDF",description:"Convert plain text into a simple PDF document",placeholder:"Type or paste text"}),pdfMetadata:Object.freeze({name:"PDF metadata",description:"View a PDF title, author, and other metadata"}),pdfRotate:Object.freeze({name:"Rotate PDF pages",description:"Rotate every page in a PDF file",parameterPlaceholder:"Degrees: 90, 180, or 270"})})}),tm=A.createContext(null);function et(){const n=A.useContext(tm);if(!n)throw new Error("useI18n must be used within an I18nProvider");return n}const i0=Object.freeze({de:a0,en:o0});function Ul(n){return n==="en"?"en":"de"}function ea(n,r,s={}){const c=r.split(".").reduce((d,f)=>d?.[f],n);if(typeof c!="string")throw new Error(`Missing translation: ${r}`);return c.replace(/\{(\w+)\}/g,(d,f)=>String(s[f]??`{${f}}`))}function Ru(n){return i0[Ul(n)]}const Rh=Object.freeze(["core","advanced","experimental","hidden"]),nm=Object.freeze({text:"encode",qr:"encode",image:"image",hash:"hash",crypto:"hash",data:"data",web:"web",number:"number",color:"color",utility:"utility",imageFormat:"image",media:"media",pdf:"document"}),r0=Object.freeze({text:"Hidden pending a named bounded-output fixture and localized release copy.",qr:"Hidden pending QR capability verification.",image:"Hidden pending exact input signatures, Blob result normalization, and image fixtures.",hash:"Hidden pending digest fixtures and copy that does not imply password or security validation.",crypto:"Hidden because cryptographic, password, or randomness claims require a separate security review.",data:"Hidden pending bounded structured-data fixtures and output-size review.",web:"Hidden pending per-tool review of validators, generators, and any live-lookup implication.",number:"Hidden pending bounded numerical fixtures and expansion limits.",color:"Hidden pending deterministic color fixtures and review of accessibility claims.",utility:"Hidden pending per-tool review for dated data, professional advice, and bounded output.",imageFormat:"Hidden pending exact PNG/JPEG validation, Canvas cleanup, and Blob result fixtures.",media:"Hidden pending same-origin FFmpeg network and cancellation evidence.",pdf:"Hidden pending PDF runtime evidence."}),l0=Object.freeze({"qr-to-text":"Hidden until a real successful decode fixture passes in a supported browser."});function xt({module:n,category:r=nm[n],tier:s,translationKey:c,runtimeClass:d,inputLimitClass:f,outputNaming:h,evidenceId:y,...g}){return Object.freeze({module:n,category:r,tier:s,translationKey:c,runtimeClass:d,inputLimitClass:f,outputNaming:h,evidenceId:y,...g})}function xe(n,r,s,c={}){return xt({module:r,category:c.category,tier:"advanced",translationKey:s,runtimeClass:c.runtimeClass||"main-thread",inputLimitClass:"text-5-mib",outputNaming:"inline-text",evidenceId:`tool:${n}`,placeholderKey:c.placeholderKey,noticeKey:c.noticeKey})}function s0(n,r,s,c={}){return xt({module:"media",tier:"experimental",translationKey:r,runtimeClass:"ffmpeg-wasm",inputLimitClass:"media-device",outputNaming:"converter-filename",evidenceId:`tool:${n}`,acceptsFile:!0,acceptTypes:s,isMediaConverter:!0,limits:Zt.media,noticeKey:"labels.mediaWarning",hasTextInput:c.hasTextInput,parameterPlaceholderKey:c.parameterPlaceholderKey})}const c0=Object.freeze({"base64-encode":xt({module:"text",tier:"advanced",translationKey:"base64Encode",runtimeClass:"main-thread",inputLimitClass:"text-5-mib",outputNaming:"inline-text",evidenceId:"tool:base64-encode",placeholderKey:"tools.base64Encode.placeholder"}),"base64-decode":xe("base64-decode","text","base64Decode"),"url-encode":xe("url-encode","text","urlEncode"),"url-decode":xe("url-decode","text","urlDecode"),"html-encode":xe("html-encode","text","htmlEncode"),"html-decode":xe("html-decode","text","htmlDecode"),"hex-encode":xe("hex-encode","text","hexEncode"),"hex-decode":xe("hex-decode","text","hexDecode"),"binary-encode":xe("binary-encode","text","binaryEncode"),"binary-decode":xe("binary-decode","text","binaryDecode"),"unicode-escape":xe("unicode-escape","text","unicodeEscape"),"unicode-unescape":xe("unicode-unescape","text","unicodeUnescape"),rot13:xe("rot13","text","rot13"),atbash:xe("atbash","text","atbash"),sha256:xe("sha256","hash","sha256",{runtimeClass:"web-crypto"}),"json-prettify":xe("json-prettify","data","jsonPrettify"),"json-minify":xe("json-minify","data","jsonMinify"),"json-escape":xe("json-escape","data","jsonEscape"),"csv-to-json":xe("csv-to-json","data","csvToJson"),"dec-to-hex":xe("dec-to-hex","number","decToHex"),"hex-to-dec":xe("hex-to-dec","number","hexToDec"),"dec-to-bin":xe("dec-to-bin","number","decToBin"),"bin-to-dec":xe("bin-to-dec","number","binToDec"),"dec-to-oct":xe("dec-to-oct","number","decToOct"),"oct-to-dec":xe("oct-to-dec","number","octToDec"),"color-convert":xe("color-convert","color","colorConvert"),"css-minify":xe("css-minify","web","cssMinify",{category:"data"}),"json-validate":xe("json-validate","web","jsonValidate",{category:"data"}),"base64url-encode":xe("base64url-encode","web","base64urlEncode",{category:"encode"}),"base64url-decode":xe("base64url-decode","web","base64urlDecode",{category:"encode"}),"slug-gen":xe("slug-gen","web","slugGen",{category:"utility"}),"char-count":xe("char-count","utility","charCount"),"reverse-text":xe("reverse-text","utility","reverseText"),"percentage-calc":xe("percentage-calc","utility","percentageCalc",{placeholderKey:"tools.percentageCalc.placeholder"}),"aspect-ratio":xe("aspect-ratio","utility","aspectRatio"),"loan-calc":xt({module:"utility",tier:"advanced",translationKey:"loanCalc",runtimeClass:"main-thread",inputLimitClass:"text-5-mib",outputNaming:"inline-text",evidenceId:"tool:loan-calc",placeholderKey:"tools.loanCalc.placeholder",noticeKey:"tools.loanCalc.notice"}),"bmi-calc":xt({module:"utility",tier:"advanced",translationKey:"bmiCalc",runtimeClass:"main-thread",inputLimitClass:"text-5-mib",outputNaming:"inline-text",evidenceId:"tool:bmi-calc",placeholderKey:"tools.bmiCalc.placeholder",noticeKey:"tools.bmiCalc.notice"}),"png-to-jpg":xt({module:"imageFormat",tier:"advanced",translationKey:"pngToJpg",runtimeClass:"canvas",inputLimitClass:"image-device",outputNaming:"converter-filename",evidenceId:"tool:png-to-jpg",acceptsFile:!0,acceptTypes:"image/png,.png",isMediaConverter:!0,limits:Zt.images}),"jpg-to-png":xt({module:"imageFormat",tier:"advanced",translationKey:"jpgToPng",runtimeClass:"canvas",inputLimitClass:"image-device",outputNaming:"converter-filename",evidenceId:"tool:jpg-to-png",acceptsFile:!0,acceptTypes:"image/jpeg,.jpg,.jpeg",isMediaConverter:!0,limits:Zt.images}),"audio-to-mp3":s0("audio-to-mp3","audioToMp3","audio/*"),"text-to-qr":xt({module:"qr",tier:"core",translationKey:"textToQr",runtimeClass:"main-thread",inputLimitClass:"text-5-mib",outputNaming:"generated-image",evidenceId:"tool:text-to-qr",showsPreview:!0,placeholderKey:"tools.textToQr.placeholder"}),"images-to-pdf":xt({module:"pdf",tier:"core",translationKey:"imagesToPdf",runtimeClass:"pdf-lib",inputLimitClass:"image-device",outputNaming:"converter-filename",evidenceId:"tool:images-to-pdf",acceptsFile:!0,acceptTypes:"image/png,image/jpeg,.png,.jpg,.jpeg",multipleFiles:!0,isMediaConverter:!0,limits:Zt.images}),"merge-pdf":xt({module:"pdf",tier:"core",translationKey:"mergePdf",runtimeClass:"pdf-lib",inputLimitClass:"pdf-device",outputNaming:"converter-filename",evidenceId:"tool:merge-pdf",acceptsFile:!0,acceptTypes:"application/pdf,.pdf",multipleFiles:!0,isMediaConverter:!0,limits:Zt.pdf}),"pdf-page-count":xt({module:"pdf",tier:"core",translationKey:"pdfPageCount",runtimeClass:"pdf-lib",inputLimitClass:"pdf-device",outputNaming:"inline-text",evidenceId:"tool:pdf-page-count",acceptsFile:!0,acceptTypes:"application/pdf,.pdf",isMediaConverter:!0,limits:Zt.pdf}),"pdf-split":xt({module:"pdf",tier:"core",translationKey:"pdfSplit",runtimeClass:"pdf-lib",inputLimitClass:"pdf-device",outputNaming:"converter-filename",evidenceId:"tool:pdf-split",acceptsFile:!0,acceptTypes:"application/pdf,.pdf",isMediaConverter:!0,hasTextInput:!0,parameterPlaceholderKey:"tools.pdfSplit.parameterPlaceholder",limits:Zt.pdf}),"pdf-extract-range":xt({module:"pdf",tier:"core",translationKey:"pdfExtractRange",runtimeClass:"pdf-lib",inputLimitClass:"pdf-device",outputNaming:"converter-filename",evidenceId:"tool:pdf-extract-range",acceptsFile:!0,acceptTypes:"application/pdf,.pdf",isMediaConverter:!0,hasTextInput:!0,parameterPlaceholderKey:"tools.pdfExtractRange.parameterPlaceholder",limits:Zt.pdf}),"text-to-pdf":xt({module:"pdf",tier:"core",translationKey:"textToPdf",runtimeClass:"pdf-lib",inputLimitClass:"text-5-mib",outputNaming:"converter-filename",evidenceId:"tool:text-to-pdf",placeholderKey:"tools.textToPdf.placeholder"}),"pdf-metadata":xt({module:"pdf",tier:"core",translationKey:"pdfMetadata",runtimeClass:"pdf-lib",inputLimitClass:"pdf-device",outputNaming:"inline-text",evidenceId:"tool:pdf-metadata",acceptsFile:!0,acceptTypes:"application/pdf,.pdf",isMediaConverter:!0,limits:Zt.pdf}),"pdf-rotate":xt({module:"pdf",tier:"core",translationKey:"pdfRotate",runtimeClass:"pdf-lib",inputLimitClass:"pdf-device",outputNaming:"converter-filename",evidenceId:"tool:pdf-rotate",acceptsFile:!0,acceptTypes:"application/pdf,.pdf",isMediaConverter:!0,hasTextInput:!0,parameterPlaceholderKey:"tools.pdfRotate.parameterPlaceholder",limits:Zt.pdf})}),$l=Object.freeze(Object.entries(Dy).flatMap(([n,r])=>r.map(s=>{const c=c0[s];return Object.freeze(c?{id:s,...c}:{id:s,module:n,category:nm[n],tier:"hidden",translationKey:s,hiddenReason:l0[s]||r0[n]})})));Object.freeze(Au.map(n=>{const r=jl(n.id);return Object.freeze(r?{id:n.id,kind:"format",category:r.category,tier:r.tier,runtimeClass:r.runtimeClass,inputLimitClass:r.inputLimitClass,outputNaming:r.outputNaming,evidenceId:r.evidenceId,nameDe:r.nameDe,nameEn:r.nameEn,descriptionDe:r.descriptionDe,descriptionEn:r.descriptionEn}:{id:n.id,kind:"format",category:"format",tier:"hidden",hiddenReason:"Hidden pending an independent literal fixture with exact output and a defensible input limit."})}));$l.filter(n=>n.tier!=="hidden").length;function u0(n,r){const s=Ru(r),c={...n,tierLabel:n.tier==="experimental"?ea(s,"labels.experimental"):null,name:ea(s,`tools.${n.translationKey}.name`),description:ea(s,`tools.${n.translationKey}.description`),categoryName:ea(s,`categories.${n.category}`)};return n.placeholderKey&&(c.placeholder=ea(s,n.placeholderKey)),n.parameterPlaceholderKey&&(c.textPlaceholder=ea(s,n.parameterPlaceholderKey)),n.noticeKey&&(c.notice=ea(s,n.noticeKey)),c}function am(n="de"){const r=Ul(n);return $l.filter(s=>s.tier!=="hidden").sort((s,c)=>Rh.indexOf(s.tier)-Rh.indexOf(c.tier)).map(s=>u0(s,r))}function d0(n="de"){const r=Ru(Ul(n)),s=new Set($l.filter(c=>c.tier!=="hidden").map(c=>c.category));return Hy.filter(c=>s.has(c.id)).map(c=>({id:c.id,name:ea(r,`categories.${c.id}`)}))}const Gt=Object.freeze({locale:"folkkit:locale",theme:"folkkit:theme",favorites:"folkkit:favorites",recentTools:"folkkit:recent-tools",historyEnabled:"folkkit:history-enabled",contentHistory:"folkkit:content-history",installDismissed:"folkkit:install-dismissed"});function f0(){return localStorage.getItem(Gt.historyEnabled)==="true"}function gu(n){if(n===!0){localStorage.setItem(Gt.historyEnabled,"true");return}localStorage.removeItem(Gt.historyEnabled)}function p0(){try{const n=JSON.parse(localStorage.getItem(Gt.contentHistory)||"[]");return Array.isArray(n)?n:[]}catch{return[]}}function yu(n){Array.isArray(n)&&localStorage.setItem(Gt.contentHistory,JSON.stringify(n))}function h0(){localStorage.removeItem(Gt.contentHistory)}function m0(){const n=localStorage.getItem(Gt.theme);return n==="light"||n==="dark"?n:window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}function g0(){const[n,r]=A.useState(m0);return A.useEffect(()=>{document.documentElement.setAttribute("data-theme",n),localStorage.setItem(Gt.theme,n);const c=document.querySelector('meta[name="theme-color"]');c&&c.setAttribute("content",n==="dark"?"#1f2826":"#f4eee5")},[n]),{theme:n,toggle:()=>r(c=>c==="light"?"dark":"light")}}const om="https://github.com/ThisIsPhantom/folkkit";function y0(n){if(!/^[0-9a-f]{40}$/.test(n))throw new Error("Build information requires an exact 40-character Git commit.");return Object.freeze({commit:n,sourceUrl:`${om}/tree/${n}`})}const Nh="fa309fb06475bdb7cf79d66ee029b2b2e005fec4",bu=/^[0-9a-f]{40}$/.test(Nh)?y0(Nh):Object.freeze({commit:"development",sourceUrl:om});function b0({onNavigate:n}){const{t:r}=et(),s=[["privacy","/privacy"],["openSource","/open-source"],["licenses","/licenses"],["terms","/terms"],["contact","/contact"]];return p.jsx("footer",{className:"site-footer",children:p.jsxs("div",{className:"site-footer__inner",children:[p.jsx("p",{children:r("shell.footerNote")}),p.jsx("nav",{"aria-label":r("shell.footerNavigation"),children:p.jsxs("ul",{role:"list",className:"site-footer__links",children:[s.map(([c,d])=>p.jsx("li",{children:p.jsx("a",{href:d,onClick:f=>{f.preventDefault(),n(d)},children:r(`shell.${c}`)})},c)),p.jsx("li",{children:p.jsx("a",{href:bu.sourceUrl,children:r("shell.source")})})]})})]})})}function Tu({compact:n=!1}){const{t:r}=et();return p.jsxs("p",{className:`privacy-status${n?" privacy-status--compact":""}`,children:[p.jsx("span",{className:"privacy-status__dot","aria-hidden":"true"}),p.jsx("span",{children:r("shell.privacyStatus")})]})}function Ll({active:n,children:r,href:s,onNavigate:c}){const d=f=>{f.preventDefault(),c(s)};return p.jsx("a",{className:"site-nav__link",href:s,"aria-current":n?"page":void 0,onClick:d,children:r})}function T0({route:n,onNavigate:r,locale:s,onLocaleChange:c,theme:d,onThemeToggle:f}){const{t:h}=et(),[y,g]=A.useState(!1),b=L=>{g(!1),r(L)};return p.jsxs("header",{className:"site-header",children:[p.jsxs("div",{className:"site-header__inner",children:[p.jsxs("div",{className:"site-header__brand-group",children:[p.jsx("a",{className:"wordmark display",href:"/","aria-label":h("shell.home"),onClick:L=>{L.preventDefault(),b("/")},children:"Folkkit"}),p.jsx(Tu,{compact:!0})]}),p.jsxs("nav",{className:"site-nav site-nav--desktop","aria-label":h("shell.primaryNavigation"),children:[p.jsx(Ll,{href:"/",active:n==="home",onNavigate:b,children:h("shell.home")}),p.jsx(Ll,{href:"/tools",active:n==="catalog",onNavigate:b,children:h("shell.tools")})]}),p.jsxs("div",{className:"site-header__actions",children:[p.jsxs("div",{className:"locale-switch",role:"group","aria-label":h("shell.localeLabel"),children:[p.jsx("button",{type:"button","aria-pressed":s==="de",onClick:()=>c("de"),children:"Deutsch"}),p.jsx("button",{type:"button","aria-pressed":s==="en",onClick:()=>c("en"),children:"English"})]}),p.jsx("button",{className:"theme-button",type:"button","aria-pressed":d==="dark",onClick:f,children:h("shell.themeToggle")}),p.jsx("button",{className:"menu-button",type:"button","aria-expanded":y,"aria-controls":"mobile-navigation","aria-label":h(y?"shell.menuClose":"shell.menuOpen"),onClick:()=>g(L=>!L),children:h(y?"shell.menuClose":"shell.menuOpen")})]})]}),y&&p.jsxs("nav",{id:"mobile-navigation",className:"site-nav site-nav--mobile","aria-label":h("shell.mobileNavigation"),children:[p.jsx(Ll,{href:"/",active:n==="home",onNavigate:b,children:h("shell.home")}),p.jsx(Ll,{href:"/tools",active:n==="catalog",onNavigate:b,children:h("shell.tools")}),p.jsx(Tu,{})]})]})}function E0({locale:n,onLocaleChange:r,route:s,onNavigate:c,children:d}){const{theme:f,toggle:h}=g0(),{t:y}=et(),g=A.useCallback(()=>h(),[h]);return A.useEffect(()=>{const b=L=>{const z=["INPUT","TEXTAREA","SELECT"].includes(document.activeElement?.tagName);(L.metaKey||L.ctrlKey)&&L.key.toLowerCase()==="d"&&!z&&(L.preventDefault(),g())};return window.addEventListener("keydown",b),()=>window.removeEventListener("keydown",b)},[g]),p.jsxs("div",{className:"shell",children:[p.jsx("a",{className:"skip-link",href:"#main-content",children:y("shell.skip")}),p.jsx(T0,{route:s,onNavigate:c,locale:n,onLocaleChange:r,theme:f,onThemeToggle:g}),p.jsx("main",{id:"main-content",className:`shell__main shell__main--${s}`,tabIndex:"-1",children:d}),p.jsx(b0,{onNavigate:c})]})}function v0({entries:n,onSelect:r}){const{t:s}=et();return p.jsxs("div",{className:"catalog-page page-frame",children:[p.jsxs("header",{className:"page-heading heading-group",children:[p.jsx("p",{className:"eyebrow",children:s("catalog.eyebrow")}),p.jsx("h1",{className:"display",children:s("catalog.title")}),p.jsx("p",{children:s("catalog.intro")}),p.jsx("p",{className:"catalog-count",children:s("catalog.toolCount",{count:n.length})})]}),p.jsx("ul",{className:"catalog-list",role:"list",children:n.map(c=>p.jsx("li",{children:p.jsxs("button",{type:"button",onClick:()=>r({kind:"tool",toolId:c.id}),"aria-label":s("catalog.openTool",{name:c.name}),children:[p.jsxs("span",{className:"catalog-list__copy",children:[p.jsx("span",{className:"catalog-list__title",children:c.name}),p.jsx("span",{className:"catalog-list__description",children:c.description})]}),p.jsxs("span",{className:"catalog-list__meta",children:[p.jsx("span",{children:c.categoryName}),c.tierLabel&&p.jsx("span",{className:"tier-badge",children:c.tierLabel})]})]})},c.id))})]})}const or=Object.freeze({privacy:Object.freeze({testId:"privacy",eyebrow:"Transparente Datenbearbeitung",title:"Datenschutz",intro:"Folkkit verarbeitet ausgewählte Inhalte im Browser. Beim Laden der Website können trotzdem technische Zugriffsdaten anfallen. Diese Erklärung trennt beide Vorgänge.",operatorTitle:"Verantwortliche Stelle",operatorMissing:"Die öffentlichen Betreiberangaben wurden für diesen privaten Vorabstand noch nicht freigegeben. Ein Release-Build bleibt gesperrt, bis Name und Kontakt-E-Mail genehmigt und hinterlegt sind.",sourcesLabel:"Offizielle Orientierung",sources:Object.freeze([Object.freeze({id:"edoeb-privacy-statements",label:"EDÖB: Datenschutzerklärungen im Internet",url:"https://www.edoeb.admin.ch/de/datenschutzerklaerungen-im-internet"}),Object.freeze({id:"edoeb-information-duty",label:"EDÖB: Informationspflicht",url:"https://www.edoeb.admin.ch/de/informationspflicht"})]),sections:Object.freeze([Object.freeze({id:"local-processing",title:"Lokale Dateiverarbeitung",paragraphs:Object.freeze(["Ausgewählte Dateien, eingefügte Inhalte, Vorschauen und Ergebnisse verarbeitet Folkkit lokal im Browser auf deinem Gerät. Diese Inhalte werden nicht zur Bearbeitung an einen Anwendungsserver übertragen.","Die Verarbeitung kann Arbeitsspeicher, Prozessor und lokale Browserfunktionen beanspruchen. Beim Verwerfen, Zurücksetzen oder Verlassen eines Werkzeugs entfernt Folkkit seine temporären Objekt-URLs und Arbeitsspeicherverweise, soweit der Browser dies zulässt."])}),Object.freeze({id:"same-origin-cache",title:"Website-Dateien und Offline-Cache",paragraphs:Object.freeze(["Der Browser lädt HTML, JavaScript, CSS, Manifest, Favicon sowie bei Bedarf PDF-, QR- und FFmpeg-Module inklusive WebAssembly vom gleichen Ursprung wie die Website.","Ein Service Worker kann diese Anwendungsdateien für die Offline-Nutzung im Cache Storage speichern. Ausgewählte Dateien, Eingaben, Vorschauen, Ergebnisse und die optionale Inhaltschronik werden nicht in diesem Offline-Cache gespeichert."])}),Object.freeze({id:"history",title:"Optionale lokale Inhaltschronik",paragraphs:Object.freeze(["Inhalte bleiben standardmässig nur während der aktuellen Sitzung verfügbar. Eine lokale Inhaltschronik speichert begrenzte Ein- und Ausgaben im Local Storage dieses Browsers erst, wenn du sie ausdrücklich aktivierst.","Du kannst einzelne Einträge löschen, die ganze Inhaltschronik löschen oder die Einwilligung widerrufen. Beim Widerruf entfernt Folkkit die gespeicherte Inhaltschronik auf diesem Gerät."])}),Object.freeze({id:"host-logs",title:"Technische Zugriffsprotokolle bei Hosttech",paragraphs:Object.freeze(["Ob Hosttech technische Zugriffsprotokolle erstellt und welche Daten sie enthalten, hängt von der aktiven Hosting-Konfiguration ab. Mögliche Felder sind IP-Adresse, Zeitpunkt, angeforderter Pfad, Referrer und User-Agent.","Umfang, Zweck und Aufbewahrungsdauer müssen vor der öffentlichen Veröffentlichung anhand dieser Konfiguration bestätigt werden. Für diese Vorabversion liegt dazu keine verifizierte Konfiguration vor."])}),Object.freeze({id:"no-tracking",title:"Keine Analytik, Werbung oder Telemetrie",paragraphs:Object.freeze(["Folkkit V1 enthält keine Analytik, keine Telemetrie, keine Werbeskripte und keine Anzeigen. Das passive AdSense-Metadatum im HTML-Head bezeichnet lediglich ein mögliches künftiges Eigentümerkonto. Dieses Metadatum löst selbst keine Netzwerkverbindung, Cookies oder Anzeigenlaufzeit aus.","Externe Links zu EDÖB, GNU, GitHub oder FFmpeg werden erst aufgerufen, wenn du ihnen folgst. Dann gelten die Datenschutzbestimmungen des jeweiligen Ziels."])}),Object.freeze({id:"preferences-rights",title:"Einstellungen und Anliegen",paragraphs:Object.freeze(["Sprache, Design, Favoriten, zuletzt verwendete Werkzeug-IDs und die Entscheidung zur Inhaltschronik können lokal im Browser gespeichert werden. Diese Einstellungen enthalten standardmässig keine ausgewählten Dateien oder konvertierten Ergebnisse.","Datenschutzanliegen und Begehren zu Auskunft, Berichtigung oder Löschung können über die auf der Kontaktseite veröffentlichte Kontakt-E-Mail eingereicht werden, sobald die genehmigten Angaben für den öffentlichen Release hinterlegt sind."])})])}),source:Object.freeze({testId:"open-source",eyebrow:"Nachvollziehbarer Build",title:"Open Source",intro:"Folkkit kennzeichnet jeden Build mit dem vollständigen Git-Commit, aus dem er erzeugt wurde.",revisionLabel:"Build-Revision",revisionLink:"Exakte Revision auf GitHub öffnen",availabilityNote:"Der Revisionslink belegt für sich allein keinen öffentlichen Zugriff. Vor einer öffentlichen Bereitstellung muss genau diese Revision öffentlich und ohne Anmeldung zugänglich sein. Das Repository bleibt während dieser Vorabentwicklung privat.",sourcesLabel:"Projektquellen",sources:Object.freeze([Object.freeze({id:"upstream",label:"Upstream: MercuriusDream/convert-everything",url:"https://github.com/MercuriusDream/convert-everything"}),Object.freeze({id:"gnu-agpl",label:"GNU Affero General Public License 3.0",url:"https://www.gnu.org/licenses/agpl-3.0.html"})]),sections:Object.freeze([Object.freeze({id:"license",title:"Folkkit-Lizenz",paragraphs:Object.freeze(["Folkkit ist als Gesamtwerk ausschliesslich unter AGPL-3.0-only veröffentlicht. Der vollständige Lizenztext liegt im Repository in der Datei LICENSE.","Der sichtbare Quellcode-Link bereitet die Bereitstellung des korrespondierenden Quellcodes für den exakten öffentlichen Build vor. Eine öffentliche Website darf erst freigegeben werden, wenn der verlinkte Commit tatsächlich öffentlich abrufbar ist."])}),Object.freeze({id:"upstream",title:"Herkunft und Änderungen",paragraphs:Object.freeze(["Folkkit basiert auf Convert Everything von MercuriusDream. Die Git-Historie, Urheberhinweise und der Upstream-Verweis bleiben erhalten.","Folkkit ergänzt unter anderem die zweisprachige Oberfläche, lokale Datenschutzkontrollen, Laufzeitgrenzen, Offline-Verhalten sowie diese Rechts- und Quellcodeflächen."])})])}),licenses:Object.freeze({testId:"licenses",eyebrow:"Lizenznachweise",title:"Lizenzen",intro:"Folkkit und die mitgelieferten Laufzeitkomponenten unterliegen ihren jeweiligen Lizenzen. Die generierten Hinweise stammen aus der gesperrten Abhängigkeitsstruktur und dem manuellen Laufzeit-Asset-Register.",noticesTitle:"Generierte Hinweise zu Drittkomponenten",noticesIntro:"Die folgende Datei wird deterministisch aus bun.lock und scripts/runtime-assets.json erzeugt. Sie umfasst direkte und transitive Laufzeitpakete, das Favicon, den Verzicht auf eingebettete Schriftdateien sowie FFmpeg-JavaScript und WebAssembly.",sourcesLabel:"Primäre Lizenzquellen",sources:Object.freeze([Object.freeze({id:"gnu-agpl",label:"GNU Affero General Public License 3.0",url:"https://www.gnu.org/licenses/agpl-3.0.html"}),Object.freeze({id:"ffmpeg-legal",label:"FFmpeg: Lizenz und rechtliche Hinweise",url:"https://ffmpeg.org/legal.html"})]),sections:Object.freeze([Object.freeze({id:"folkkit",title:"Folkkit und Upstream",paragraphs:Object.freeze(["Folkkit bleibt AGPL-3.0-only. Die Lizenz erlaubt Nutzung, Änderung und Weitergabe unter ihren Bedingungen und enthält Haftungs- und Gewährleistungsausschlüsse im gesetzlich zulässigen Umfang.","Die Herkunft von MercuriusDream/convert-everything sowie dessen Historie und Hinweise bleiben Teil des Projekts."])}),Object.freeze({id:"ffmpeg",title:"FFmpeg und ffmpeg.wasm",paragraphs:Object.freeze(["FFmpeg steht überwiegend unter LGPL-2.1-or-later; optionale Bestandteile können GPL-2.0-or-later unterliegen. Das ausgelieferte Paket @ffmpeg/core 0.12.10 deklariert GPL-2.0-or-later. Die erzeugten Hinweise führen die konkreten Paket- und Asset-Angaben auf.","Die FFmpeg-Core-Dateien werden als JavaScript und WebAssembly vom gleichen Ursprung ausgeliefert. Ihre Registrierung ausserhalb der JavaScript-Abhängigkeitsliste verhindert, dass WASM bei der Lizenzprüfung übersehen wird."])})])}),terms:Object.freeze({testId:"terms",eyebrow:"Rahmen der Nutzung",title:"Nutzungsbedingungen",intro:"Diese Bedingungen beschreiben den technischen Zweck und die Grenzen von Folkkit V1. Sie sind keine Zusicherung für einen bestimmten Verwendungszweck.",sourcesLabel:"Lizenzgrundlage",sources:Object.freeze([Object.freeze({id:"gnu-agpl",label:"GNU Affero General Public License 3.0",url:"https://www.gnu.org/licenses/agpl-3.0.html"}),Object.freeze({id:"source",label:"Quellcode und Build-Revision",url:"/open-source"})]),sections:Object.freeze([Object.freeze({id:"scope",title:"Zweck und Verfügbarkeit",paragraphs:Object.freeze(["Folkkit stellt kostenlose, kontolose Browserwerkzeuge für gelegentliche Datei-, Text-, PDF-, QR- und Rechenaufgaben bereit. Es besteht kein Anspruch auf dauernde Verfügbarkeit, Fehlerfreiheit oder Unterstützung eines bestimmten Browsers oder Dateiformats.","Werkzeuge können Eingaben wegen Dateigrösse, Format, Gerätespeicher oder fehlender Browserfunktionen ablehnen. Experimentelle Medienwerkzeuge können besonders viel Arbeitsspeicher und Rechenleistung benötigen."])}),Object.freeze({id:"responsibility",title:"Eigene Verantwortung",paragraphs:Object.freeze(["Du bist dafür verantwortlich, dass du Dateien und Inhalte bearbeiten darfst und Ergebnisse vor ihrer weiteren Verwendung prüfst. Bewahre wichtige Originale und Sicherungskopien ausserhalb von Folkkit auf.","Folkkit prüft nicht, ob ein Ergebnis für einen bestimmten rechtlichen Zweck genügt, und übernimmt keine Gewähr dafür, dass ein Ergebnis rechtlich wirksam oder konform ist."])}),Object.freeze({id:"medical",title:"Gesundheitsbezogene Rechenhilfe",paragraphs:Object.freeze(["Der BMI-Rechner ist nur eine allgemeine Rechenhilfe und keine medizinische Beratung, Diagnose oder Behandlungsempfehlung. Besprich gesundheitliche Fragen mit einer qualifizierten Fachperson.","Ein Rechenergebnis berücksichtigt keine individuelle Krankengeschichte, keine Körperzusammensetzung und keine weiteren medizinischen Faktoren."])}),Object.freeze({id:"finance",title:"Finanzbezogene Rechenhilfe",paragraphs:Object.freeze(["Der Kreditrechner ist nur eine vereinfachte Rechenhilfe und keine Finanzberatung, Kreditzusage oder Offerte. Konditionen, Gebühren, Steuern, Rundungen und Zahlungspläne können in der Praxis abweichen.","Triff keine finanzielle Entscheidung allein aufgrund eines Folkkit-Ergebnisses. Prüfe die massgeblichen Vertragsunterlagen und hole bei Bedarf fachliche Beratung ein."])}),Object.freeze({id:"license",title:"Open-Source-Lizenz und Drittkomponenten",paragraphs:Object.freeze(["Folkkit wird unter AGPL-3.0-only bereitgestellt. Für Drittkomponenten gelten die auf der Lizenzseite aufgeführten Bedingungen und Hinweise.","Soweit das anwendbare Recht es zulässt, gelten die Gewährleistungs- und Haftungsregeln der jeweiligen Open-Source-Lizenzen. Zwingende gesetzliche Rechte bleiben unberührt."])})])}),contact:Object.freeze({testId:"contact",eyebrow:"Betreiber und Anfragen",title:"Kontakt",intro:"Die öffentliche Kontaktseite darf nur genehmigte Betreiberangaben anzeigen.",operatorTitle:"Öffentliche Betreiberangaben",operatorMissing:"Die öffentlichen Betreiberangaben wurden für diesen privaten Vorabstand noch nicht freigegeben. Ein Release-Build bleibt bis zur Hinterlegung von Name und Kontakt-E-Mail gesperrt.",emailLabel:"E-Mail schreiben",sourcesLabel:"Weitere Informationen",sources:Object.freeze([Object.freeze({id:"privacy",label:"Datenschutzerklärung",url:"/privacy"}),Object.freeze({id:"source",label:"Quellcode und Build-Revision",url:"/open-source"})]),sections:Object.freeze([Object.freeze({id:"requests",title:"Anliegen",paragraphs:Object.freeze(["Nutze die veröffentlichte Kontakt-E-Mail für Fragen zum Betrieb, zum Datenschutz oder zur Ausübung datenschutzrechtlicher Rechte.","Übermittle keine vertraulichen Dateiinhalte, Gesundheitsdaten, Finanzdaten oder Zugangsdaten per unverschlüsselter E-Mail."])}),Object.freeze({id:"tool-support",title:"Technische Hinweise",paragraphs:Object.freeze(["Nenne bei einem technischen Problem das Werkzeug, den Browser, die ungefähre Dateigrösse und die angezeigte Fehlermeldung. Sende die betroffene Datei nur nach einer ausdrücklichen und geeigneten sicheren Absprache.","Folkkit enthält keine Telemetrie. Der Betreiber erhält deshalb nicht automatisch Informationen über fehlgeschlagene Verarbeitungsvorgänge."])})])})}),ir=Object.freeze({privacy:Object.freeze({testId:"privacy",eyebrow:"Transparent data processing",title:"Privacy",intro:"Folkkit processes selected content in the browser. Technical access data may still arise when the website loads. This notice separates those two processes.",operatorTitle:"Controller",operatorMissing:"The public operator details have not yet been approved for this private pre-release. A release build remains blocked until the approved name and contact email are provided.",sourcesLabel:"Official guidance",sources:Object.freeze([Object.freeze({id:"edoeb-privacy-statements",label:"FDPIC: Privacy policies on the internet",url:"https://www.edoeb.admin.ch/de/datenschutzerklaerungen-im-internet"}),Object.freeze({id:"edoeb-information-duty",label:"FDPIC: Duty to provide information",url:"https://www.edoeb.admin.ch/de/informationspflicht"})]),sections:Object.freeze([Object.freeze({id:"local-processing",title:"Local file processing",paragraphs:Object.freeze(["Folkkit processes selected files, pasted content, previews, and results locally in the browser on your device. It does not transfer that content to an application server for processing.","Processing may use memory, processor capacity, and local browser features. When you discard or reset work or leave a tool, Folkkit removes its temporary object URLs and memory references as far as the browser permits."])}),Object.freeze({id:"same-origin-cache",title:"Website files and offline cache",paragraphs:Object.freeze(["The browser loads HTML, JavaScript, CSS, the manifest, the favicon, and, when needed, PDF, QR, and FFmpeg modules including WebAssembly from the same origin as the website.","A service worker may store these application files in Cache Storage for offline use. Selected files, inputs, previews, results, and optional content history are not stored in that offline cache."])}),Object.freeze({id:"history",title:"Optional local content history",paragraphs:Object.freeze(["Content is available only for the current session by default. Local content history stores limited inputs and outputs in this browser's Local Storage only after you explicitly enable it.","You can delete individual entries, clear all content history, or withdraw consent. When you withdraw consent, Folkkit removes the stored content history from this device."])}),Object.freeze({id:"host-logs",title:"Technical access logs at Hosttech",paragraphs:Object.freeze(["Whether Hosttech creates technical access logs and which data they contain depends on the active hosting configuration. Possible fields are the IP address, timestamp, requested path, referrer, and user agent.","The scope, purpose, and retention period must be confirmed against that configuration before public release. No verified configuration is available for this pre-release."])}),Object.freeze({id:"no-tracking",title:"No analytics, advertising, or telemetry",paragraphs:Object.freeze(["Folkkit V1 contains no analytics, telemetry, advertising scripts, or ads. Passive AdSense ownership metadata in the HTML head merely identifies a possible future owner account. The metadata itself causes no network connection, cookies, or advertising runtime.","External links to the FDPIC, GNU, GitHub, or FFmpeg are opened only when you follow them. The destination's privacy terms then apply."])}),Object.freeze({id:"preferences-rights",title:"Preferences and requests",paragraphs:Object.freeze(["Language, theme, favourites, recent tool IDs, and the content history choice may be stored locally in the browser. By default, these preferences contain no selected files or converted results.","Privacy questions and requests for access, correction, or deletion can be submitted through the contact email published on the contact page once approved details are configured for public release."])})])}),source:Object.freeze({testId:"open-source",eyebrow:"Verifiable build",title:"Open source",intro:"Folkkit identifies every build with the full Git commit from which it was created.",revisionLabel:"Build revision",revisionLink:"Open exact revision on GitHub",availabilityNote:"The revision link does not by itself mean that the repository is publicly accessible. Before public deployment, this exact revision must be available without signing in. The repository remains private during this pre-release development.",sourcesLabel:"Project sources",sources:Object.freeze([Object.freeze({id:"upstream",label:"Upstream: MercuriusDream/convert-everything",url:"https://github.com/MercuriusDream/convert-everything"}),Object.freeze({id:"gnu-agpl",label:"GNU Affero General Public License 3.0",url:"https://www.gnu.org/licenses/agpl-3.0.html"})]),sections:Object.freeze([Object.freeze({id:"license",title:"Folkkit license",paragraphs:Object.freeze(["Folkkit as a whole is released exclusively under AGPL-3.0-only. The full license text is stored in the repository as LICENSE.","The visible source link prepares access to the Corresponding Source for the exact public build. A public website may be released only when the linked commit is actually publicly accessible."])}),Object.freeze({id:"upstream",title:"Origin and modifications",paragraphs:Object.freeze(["Folkkit is based on Convert Everything by MercuriusDream. The Git history, copyright notices, and upstream reference remain intact.","Folkkit adds the bilingual interface, local privacy controls, runtime limits, offline behaviour, and these legal and source surfaces, among other changes."])})])}),licenses:Object.freeze({testId:"licenses",eyebrow:"License records",title:"Licenses",intro:"Folkkit and its bundled runtime components are subject to their respective licenses. The generated notices come from the locked dependency graph and the manually maintained runtime asset register.",noticesTitle:"Generated third-party notices",noticesIntro:"The following file is generated deterministically from bun.lock and scripts/runtime-assets.json. It covers direct and transitive runtime packages, the favicon, the absence of embedded font files, and the FFmpeg JavaScript and WebAssembly assets.",sourcesLabel:"Primary license sources",sources:Object.freeze([Object.freeze({id:"gnu-agpl",label:"GNU Affero General Public License 3.0",url:"https://www.gnu.org/licenses/agpl-3.0.html"}),Object.freeze({id:"ffmpeg-legal",label:"FFmpeg: License and legal considerations",url:"https://ffmpeg.org/legal.html"})]),sections:Object.freeze([Object.freeze({id:"folkkit",title:"Folkkit and upstream",paragraphs:Object.freeze(["Folkkit remains AGPL-3.0-only. The license permits use, modification, and redistribution under its conditions and includes warranty and liability disclaimers to the extent permitted by law.","The origin in MercuriusDream/convert-everything, its history, and its notices remain part of the project."])}),Object.freeze({id:"ffmpeg",title:"FFmpeg and ffmpeg.wasm",paragraphs:Object.freeze(["FFmpeg is mostly licensed under LGPL-2.1-or-later, while optional parts may be covered by GPL-2.0-or-later. The shipped @ffmpeg/core 0.12.10 package declares GPL-2.0-or-later. The generated notices list the concrete package and asset metadata.","FFmpeg core files are served as same-origin JavaScript and WebAssembly. Registering them outside the JavaScript dependency list prevents the WASM asset from being missed during license review."])})])}),terms:Object.freeze({testId:"terms",eyebrow:"Terms of use",title:"Terms",intro:"These terms describe the technical purpose and limits of Folkkit V1. They do not promise fitness for a particular use.",sourcesLabel:"License basis",sources:Object.freeze([Object.freeze({id:"gnu-agpl",label:"GNU Affero General Public License 3.0",url:"https://www.gnu.org/licenses/agpl-3.0.html"}),Object.freeze({id:"source",label:"Source code and build revision",url:"/open-source"})]),sections:Object.freeze([Object.freeze({id:"scope",title:"Purpose and availability",paragraphs:Object.freeze(["Folkkit provides free, accountless browser tools for occasional file, text, PDF, QR, and calculation tasks. There is no entitlement to continuous availability, error-free operation, or support for a particular browser or file format.","Tools may reject input because of file size, format, device memory, or missing browser capabilities. Experimental media tools may require substantial memory and processor capacity."])}),Object.freeze({id:"responsibility",title:"Your responsibility",paragraphs:Object.freeze(["You are responsible for having the right to process files and content and for checking results before further use. Keep important originals and backups outside Folkkit.","Folkkit does not check whether output meets a particular legal requirement and gives no guarantee that output is legally effective or compliant."])}),Object.freeze({id:"medical",title:"Health calculation aid",paragraphs:Object.freeze(["The BMI calculator is a general calculation aid only. It is not medical advice, a diagnosis, or a treatment recommendation. Discuss health questions with a qualified professional.","A calculation does not account for individual medical history, body composition, or other medical factors."])}),Object.freeze({id:"finance",title:"Financial calculation aid",paragraphs:Object.freeze(["The loan calculator is a simplified calculation aid only. It is not financial advice, a credit decision, or an offer. Terms, fees, taxes, rounding, and payment schedules may differ in practice.","Do not make a financial decision based only on a Folkkit result. Check the relevant contract documents and obtain professional advice if needed."])}),Object.freeze({id:"license",title:"Open-source license and third-party components",paragraphs:Object.freeze(["Folkkit is provided under AGPL-3.0-only. The conditions and notices shown on the licenses page apply to third-party components.","To the extent permitted by applicable law, the warranty and liability terms of the respective open-source licenses apply. Mandatory statutory rights remain unaffected."])})])}),contact:Object.freeze({testId:"contact",eyebrow:"Operator and requests",title:"Contact",intro:"The public contact page may display only approved operator details.",operatorTitle:"Public operator details",operatorMissing:"The public operator details have not yet been approved for this private pre-release. A release build remains blocked until the name and contact email are provided.",emailLabel:"Send email",sourcesLabel:"More information",sources:Object.freeze([Object.freeze({id:"privacy",label:"Privacy notice",url:"/privacy"}),Object.freeze({id:"source",label:"Source code and build revision",url:"/open-source"})]),sections:Object.freeze([Object.freeze({id:"requests",title:"Requests",paragraphs:Object.freeze(["Use the published contact email for questions about operation, privacy, or the exercise of data protection rights.","Do not send confidential file contents, health data, financial data, or credentials by unencrypted email."])}),Object.freeze({id:"tool-support",title:"Technical information",paragraphs:Object.freeze(["For a technical problem, state the tool, browser, approximate file size, and displayed error message. Send the affected file only after an explicit arrangement through a suitable secure channel.","Folkkit contains no telemetry. The operator therefore receives no automatic information about failed processing operations."])})])})}),O0={VITE_PUBLIC_CONTACT_EMAIL:"ruskoigor25@gmail.com",VITE_PUBLIC_OPERATOR_NAME:"Igor Rusko"},Ih=Object.freeze({VITE_PUBLIC_OPERATOR_NAME:"Example Operator",VITE_PUBLIC_CONTACT_EMAIL:"operator@example.com"});function Lh(n){return typeof n=="string"?n.trim():""}function S0(n={}){return Object.freeze({name:Lh(n.VITE_PUBLIC_OPERATOR_NAME),email:Lh(n.VITE_PUBLIC_CONTACT_EMAIL)})}function w0(n){const r=[];return n.name?n.name.toLowerCase()===Ih.VITE_PUBLIC_OPERATOR_NAME.toLowerCase()&&r.push("VITE_PUBLIC_OPERATOR_NAME still contains the example value."):r.push("VITE_PUBLIC_OPERATOR_NAME is required."),n.email?n.email.toLowerCase()===Ih.VITE_PUBLIC_CONTACT_EMAIL.toLowerCase()?r.push("VITE_PUBLIC_CONTACT_EMAIL still contains the example value."):/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(n.email)||r.push("VITE_PUBLIC_CONTACT_EMAIL must be a valid email address."):r.push("VITE_PUBLIC_CONTACT_EMAIL is required."),r}function im(n){return w0(n).length===0}const x0=O0||{},ka=S0(x0);function rr({content:n,children:r}){const s=`legal-title-${n.testId}`;return p.jsxs("article",{className:"legal-page page-frame","aria-labelledby":s,"data-testid":`legal-page-${n.testId}`,children:[p.jsxs("header",{className:"legal-page__header",children:[p.jsx("p",{className:"eyebrow",children:n.eyebrow}),p.jsx("h1",{id:s,className:"display",children:n.title}),p.jsx("p",{children:n.intro})]}),r,p.jsx("div",{className:"legal-page__sections",children:n.sections.map(c=>p.jsxs("section",{id:c.id,"aria-labelledby":`${n.testId}-${c.id}`,children:[p.jsx("h2",{id:`${n.testId}-${c.id}`,children:c.title}),c.paragraphs.map(d=>p.jsx("p",{children:d},d))]},c.id))}),p.jsxs("section",{className:"legal-page__sources","aria-labelledby":`${n.testId}-sources`,children:[p.jsx("h2",{id:`${n.testId}-sources`,children:n.sourcesLabel}),p.jsx("ul",{children:n.sources.map(c=>p.jsx("li",{children:p.jsx("a",{href:c.url,children:c.label})},c.id))})]})]})}function A0(){const{locale:n}=et(),r=(n==="en"?ir:or).contact,s=im(ka);return p.jsx(rr,{content:r,children:p.jsxs("section",{className:"legal-page__operator","aria-labelledby":"contact-operator",children:[p.jsx("h2",{id:"contact-operator",children:r.operatorTitle}),s?p.jsxs("address",{children:[p.jsx("strong",{children:ka.name}),p.jsxs("a",{href:`mailto:${ka.email}`,children:[r.emailLabel,": ",ka.email]})]}):p.jsx("p",{className:"legal-page__gate",children:r.operatorMissing})]})})}const F0=[{kind:"pdf",title:"home.pdfTitle",body:"home.pdfBody"},{kind:"qr",title:"home.qrTitle",body:"home.qrBody"},{kind:"convert",title:"home.convertTitle",body:"home.convertBody",primary:!0}];function R0({onOpenCore:n,onOpenCatalog:r}){const{t:s}=et();return p.jsxs("div",{className:"home-page page-frame",children:[p.jsxs("section",{className:"home-hero","aria-labelledby":"home-title",children:[p.jsxs("div",{className:"heading-group",children:[p.jsx("p",{className:"eyebrow",children:s("home.eyebrow")}),p.jsx("h1",{id:"home-title",className:"display",children:s("home.title")}),p.jsx("p",{className:"home-hero__intro",children:s("home.intro")})]}),p.jsxs("div",{className:"privacy-promise",children:[p.jsx(Tu,{}),p.jsx("h2",{children:s("home.privacyTitle")}),p.jsx("p",{children:s("home.privacyBody")})]})]}),p.jsxs("section",{className:"core-entry-section","aria-label":s("home.eyebrow"),children:[p.jsx("div",{className:"core-entry-grid",children:F0.map(c=>p.jsxs("button",{className:`core-entry${c.primary?" core-entry--primary":""}`,type:"button","aria-label":s(c.title),onClick:()=>n(c.kind),children:[p.jsx("span",{className:"core-entry__title",children:s(c.title)}),p.jsx("span",{className:"core-entry__body",children:s(c.body)})]},c.kind))}),p.jsx("button",{className:"catalog-link",type:"button",onClick:r,children:s("home.catalogLink")})]})]})}const N0=`# Folkkit Third-Party Notices

This file is generated deterministically from \`bun.lock\` and \`scripts/runtime-assets.json\`. Do not edit it manually.

## Application license and upstream attribution

- Folkkit is licensed under \`AGPL-3.0-only\`.
- License text: GNU Affero General Public License 3.0
- Upstream project: MercuriusDream/convert-everything

## Bundled runtime packages

The locked runtime graph contains 41 direct and transitive packages. License identifiers and source links come from the installed package metadata for the exact locked versions. Available license, licence, copying, and notice files are preserved below.

### @ffmpeg/core 0.12.10

- License: \`GPL-2.0-or-later\`
- Source: [external reference listed in repository notices]

<details>
<summary>scripts/license-texts/GPL-2.0-or-later.txt</summary>

\`\`\`text
                    GNU GENERAL PUBLIC LICENSE
                       Version 2, June 1991

 Copyright (C) 1989, 1991 Free Software Foundation, Inc.,
 [external reference listed in repository notices]
 Everyone is permitted to copy and distribute verbatim copies
 of this license document, but changing it is not allowed.

                            Preamble

  The licenses for most software are designed to take away your
freedom to share and change it.  By contrast, the GNU General Public
License is intended to guarantee your freedom to share and change free
software--to make sure the software is free for all its users.  This
General Public License applies to most of the Free Software
Foundation's software and to any other program whose authors commit to
using it.  (Some other Free Software Foundation software is covered by
the GNU Lesser General Public License instead.)  You can apply it to
your programs, too.

  When we speak of free software, we are referring to freedom, not
price.  Our General Public Licenses are designed to make sure that you
have the freedom to distribute copies of free software (and charge for
this service if you wish), that you receive source code or can get it
if you want it, that you can change the software or use pieces of it
in new free programs; and that you know you can do these things.

  To protect your rights, we need to make restrictions that forbid
anyone to deny you these rights or to ask you to surrender the rights.
These restrictions translate to certain responsibilities for you if you
distribute copies of the software, or if you modify it.

  For example, if you distribute copies of such a program, whether
gratis or for a fee, you must give the recipients all the rights that
you have.  You must make sure that they, too, receive or can get the
source code.  And you must show them these terms so they know their
rights.

  We protect your rights with two steps: (1) copyright the software, and
(2) offer you this license which gives you legal permission to copy,
distribute and/or modify the software.

  Also, for each author's protection and ours, we want to make certain
that everyone understands that there is no warranty for this free
software.  If the software is modified by someone else and passed on, we
want its recipients to know that what they have is not the original, so
that any problems introduced by others will not reflect on the original
authors' reputations.

  Finally, any free program is threatened constantly by software
patents.  We wish to avoid the danger that redistributors of a free
program will individually obtain patent licenses, in effect making the
program proprietary.  To prevent this, we have made it clear that any
patent must be licensed for everyone's free use or not licensed at all.

  The precise terms and conditions for copying, distribution and
modification follow.

                    GNU GENERAL PUBLIC LICENSE
   TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION

  0. This License applies to any program or other work which contains
a notice placed by the copyright holder saying it may be distributed
under the terms of this General Public License.  The "Program", below,
refers to any such program or work, and a "work based on the Program"
means either the Program or any derivative work under copyright law:
that is to say, a work containing the Program or a portion of it,
either verbatim or with modifications and/or translated into another
language.  (Hereinafter, translation is included without limitation in
the term "modification".)  Each licensee is addressed as "you".

Activities other than copying, distribution and modification are not
covered by this License; they are outside its scope.  The act of
running the Program is not restricted, and the output from the Program
is covered only if its contents constitute a work based on the
Program (independent of having been made by running the Program).
Whether that is true depends on what the Program does.

  1. You may copy and distribute verbatim copies of the Program's
source code as you receive it, in any medium, provided that you
conspicuously and appropriately publish on each copy an appropriate
copyright notice and disclaimer of warranty; keep intact all the
notices that refer to this License and to the absence of any warranty;
and give any other recipients of the Program a copy of this License
along with the Program.

You may charge a fee for the physical act of transferring a copy, and
you may at your option offer warranty protection in exchange for a fee.

  2. You may modify your copy or copies of the Program or any portion
of it, thus forming a work based on the Program, and copy and
distribute such modifications or work under the terms of Section 1
above, provided that you also meet all of these conditions:

    a) You must cause the modified files to carry prominent notices
    stating that you changed the files and the date of any change.

    b) You must cause any work that you distribute or publish, that in
    whole or in part contains or is derived from the Program or any
    part thereof, to be licensed as a whole at no charge to all third
    parties under the terms of this License.

    c) If the modified program normally reads commands interactively
    when run, you must cause it, when started running for such
    interactive use in the most ordinary way, to print or display an
    announcement including an appropriate copyright notice and a
    notice that there is no warranty (or else, saying that you provide
    a warranty) and that users may redistribute the program under
    these conditions, and telling the user how to view a copy of this
    License.  (Exception: if the Program itself is interactive but
    does not normally print such an announcement, your work based on
    the Program is not required to print an announcement.)

These requirements apply to the modified work as a whole.  If
identifiable sections of that work are not derived from the Program,
and can be reasonably considered independent and separate works in
themselves, then this License, and its terms, do not apply to those
sections when you distribute them as separate works.  But when you
distribute the same sections as part of a whole which is a work based
on the Program, the distribution of the whole must be on the terms of
this License, whose permissions for other licensees extend to the
entire whole, and thus to each and every part regardless of who wrote it.

Thus, it is not the intent of this section to claim rights or contest
your rights to work written entirely by you; rather, the intent is to
exercise the right to control the distribution of derivative or
collective works based on the Program.

In addition, mere aggregation of another work not based on the Program
with the Program (or with a work based on the Program) on a volume of
a storage or distribution medium does not bring the other work under
the scope of this License.

  3. You may copy and distribute the Program (or a work based on it,
under Section 2) in object code or executable form under the terms of
Sections 1 and 2 above provided that you also do one of the following:

    a) Accompany it with the complete corresponding machine-readable
    source code, which must be distributed under the terms of Sections
    1 and 2 above on a medium customarily used for software interchange; or,

    b) Accompany it with a written offer, valid for at least three
    years, to give any third party, for a charge no more than your
    cost of physically performing source distribution, a complete
    machine-readable copy of the corresponding source code, to be
    distributed under the terms of Sections 1 and 2 above on a medium
    customarily used for software interchange; or,

    c) Accompany it with the information you received as to the offer
    to distribute corresponding source code.  (This alternative is
    allowed only for noncommercial distribution and only if you
    received the program in object code or executable form with such
    an offer, in accord with Subsection b above.)

The source code for a work means the preferred form of the work for
making modifications to it.  For an executable work, complete source
code means all the source code for all modules it contains, plus any
associated interface definition files, plus the scripts used to
control compilation and installation of the executable.  However, as a
special exception, the source code distributed need not include
anything that is normally distributed (in either source or binary
form) with the major components (compiler, kernel, and so on) of the
operating system on which the executable runs, unless that component
itself accompanies the executable.

If distribution of executable or object code is made by offering
access to copy from a designated place, then offering equivalent
access to copy the source code from the same place counts as
distribution of the source code, even though third parties are not
compelled to copy the source along with the object code.

  4. You may not copy, modify, sublicense, or distribute the Program
except as expressly provided under this License.  Any attempt
otherwise to copy, modify, sublicense or distribute the Program is
void, and will automatically terminate your rights under this License.
However, parties who have received copies, or rights, from you under
this License will not have their licenses terminated so long as such
parties remain in full compliance.

  5. You are not required to accept this License, since you have not
signed it.  However, nothing else grants you permission to modify or
distribute the Program or its derivative works.  These actions are
prohibited by law if you do not accept this License.  Therefore, by
modifying or distributing the Program (or any work based on the
Program), you indicate your acceptance of this License to do so, and
all its terms and conditions for copying, distributing or modifying
the Program or works based on it.

  6. Each time you redistribute the Program (or any work based on the
Program), the recipient automatically receives a license from the
original licensor to copy, distribute or modify the Program subject to
these terms and conditions.  You may not impose any further
restrictions on the recipients' exercise of the rights granted herein.
You are not responsible for enforcing compliance by third parties to
this License.

  7. If, as a consequence of a court judgment or allegation of patent
infringement or for any other reason (not limited to patent issues),
conditions are imposed on you (whether by court order, agreement or
otherwise) that contradict the conditions of this License, they do not
excuse you from the conditions of this License.  If you cannot
distribute so as to satisfy simultaneously your obligations under this
License and any other pertinent obligations, then as a consequence you
may not distribute the Program at all.  For example, if a patent
license would not permit royalty-free redistribution of the Program by
all those who receive copies directly or indirectly through you, then
the only way you could satisfy both it and this License would be to
refrain entirely from distribution of the Program.

If any portion of this section is held invalid or unenforceable under
any particular circumstance, the balance of the section is intended to
apply and the section as a whole is intended to apply in other
circumstances.

It is not the purpose of this section to induce you to infringe any
patents or other property right claims or to contest validity of any
such claims; this section has the sole purpose of protecting the
integrity of the free software distribution system, which is
implemented by public license practices.  Many people have made
generous contributions to the wide range of software distributed
through that system in reliance on consistent application of that
system; it is up to the author/donor to decide if he or she is willing
to distribute software through any other system and a licensee cannot
impose that choice.

This section is intended to make thoroughly clear what is believed to
be a consequence of the rest of this License.

  8. If the distribution and/or use of the Program is restricted in
certain countries either by patents or by copyrighted interfaces, the
original copyright holder who places the Program under this License
may add an explicit geographical distribution limitation excluding
those countries, so that distribution is permitted only in or among
countries not thus excluded.  In such case, this License incorporates
the limitation as if written in the body of this License.

  9. The Free Software Foundation may publish revised and/or new versions
of the General Public License from time to time.  Such new versions will
be similar in spirit to the present version, but may differ in detail to
address new problems or concerns.

Each version is given a distinguishing version number.  If the Program
specifies a version number of this License which applies to it and "any
later version", you have the option of following the terms and conditions
either of that version or of any later version published by the Free
Software Foundation.  If the Program does not specify a version number of
this License, you may choose any version ever published by the Free Software
Foundation.

  10. If you wish to incorporate parts of the Program into other free
programs whose distribution conditions are different, write to the author
to ask for permission.  For software which is copyrighted by the Free
Software Foundation, write to the Free Software Foundation; we sometimes
make exceptions for this.  Our decision will be guided by the two goals
of preserving the free status of all derivatives of our free software and
of promoting the sharing and reuse of software generally.

                            NO WARRANTY

  11. BECAUSE THE PROGRAM IS LICENSED FREE OF CHARGE, THERE IS NO WARRANTY
FOR THE PROGRAM, TO THE EXTENT PERMITTED BY APPLICABLE LAW.  EXCEPT WHEN
OTHERWISE STATED IN WRITING THE COPYRIGHT HOLDERS AND/OR OTHER PARTIES
PROVIDE THE PROGRAM "AS IS" WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESSED
OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE.  THE ENTIRE RISK AS
TO THE QUALITY AND PERFORMANCE OF THE PROGRAM IS WITH YOU.  SHOULD THE
PROGRAM PROVE DEFECTIVE, YOU ASSUME THE COST OF ALL NECESSARY SERVICING,
REPAIR OR CORRECTION.

  12. IN NO EVENT UNLESS REQUIRED BY APPLICABLE LAW OR AGREED TO IN WRITING
WILL ANY COPYRIGHT HOLDER, OR ANY OTHER PARTY WHO MAY MODIFY AND/OR
REDISTRIBUTE THE PROGRAM AS PERMITTED ABOVE, BE LIABLE TO YOU FOR DAMAGES,
INCLUDING ANY GENERAL, SPECIAL, INCIDENTAL OR CONSEQUENTIAL DAMAGES ARISING
OUT OF THE USE OR INABILITY TO USE THE PROGRAM (INCLUDING BUT NOT LIMITED
TO LOSS OF DATA OR DATA BEING RENDERED INACCURATE OR LOSSES SUSTAINED BY
YOU OR THIRD PARTIES OR A FAILURE OF THE PROGRAM TO OPERATE WITH ANY OTHER
PROGRAMS), EVEN IF SUCH HOLDER OR OTHER PARTY HAS BEEN ADVISED OF THE
POSSIBILITY OF SUCH DAMAGES.

                     END OF TERMS AND CONDITIONS

            How to Apply These Terms to Your New Programs

  If you develop a new program, and you want it to be of the greatest
possible use to the public, the best way to achieve this is to make it
free software which everyone can redistribute and change under these terms.

  To do so, attach the following notices to the program.  It is safest
to attach them to the start of each source file to most effectively
convey the exclusion of warranty; and each file should have at least
the "copyright" line and a pointer to where the full notice is found.

    <one line to give the program's name and a brief idea of what it does.>
    Copyright (C) <year>  <name of author>

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License along
    with this program; if not, see [external reference listed in repository notices].

Also add information on how to contact you by electronic and paper mail.

If the program is interactive, make it output a short notice like this
when it starts in an interactive mode:

    Gnomovision version 69, Copyright (C) year name of author
    Gnomovision comes with ABSOLUTELY NO WARRANTY; for details type \`show w'.
    This is free software, and you are welcome to redistribute it
    under certain conditions; type \`show c' for details.

The hypothetical commands \`show w' and \`show c' should show the appropriate
parts of the General Public License.  Of course, the commands you use may
be called something other than \`show w' and \`show c'; they could even be
mouse-clicks or menu items--whatever suits your program.

You should also get your employer (if you work as a programmer) or your
school, if any, to sign a "copyright disclaimer" for the program, if
necessary.  Here is a sample; alter the names:

  Yoyodyne, Inc., hereby disclaims all copyright interest in the program
  \`Gnomovision' (which makes passes at compilers) written by James Hacker.

  <signature of Moe Ghoul>, 1 April 1989
  Moe Ghoul, President of Vice

This General Public License does not permit incorporating your program into
proprietary programs.  If your program is a subroutine library, you may
consider it more useful to permit linking proprietary applications with the
library.  If this is what you want to do, use the GNU Lesser General
Public License instead of this License.
\`\`\`

</details>

### @ffmpeg/ffmpeg 0.12.15

- License: \`MIT\`
- Source: [external reference listed in repository notices]

<details>
<summary>scripts/license-texts/MIT-ffmpegwasm.txt</summary>

\`\`\`text
MIT License

Copyright (c) 2019 Jerome Wu

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
\`\`\`

</details>

### @ffmpeg/types 0.12.4

- License: \`MIT\`
- Source: [external reference listed in repository notices]

<details>
<summary>scripts/license-texts/MIT-ffmpegwasm.txt</summary>

\`\`\`text
MIT License

Copyright (c) 2019 Jerome Wu

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
\`\`\`

</details>

### @ffmpeg/util 0.12.2

- License: \`MIT\`
- Source: [external reference listed in repository notices]

<details>
<summary>scripts/license-texts/MIT-ffmpegwasm.txt</summary>

\`\`\`text
MIT License

Copyright (c) 2019 Jerome Wu

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
\`\`\`

</details>

### @pdf-lib/standard-fonts 1.0.0

- License: \`MIT\`
- Source: [external reference listed in repository notices]

<details>
<summary>LICENSE.md</summary>

\`\`\`text
MIT License

Copyright (c) 2018 Andrew Dillon

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
\`\`\`

</details>

### @pdf-lib/upng 1.0.1

- License: \`MIT\`
- Source: [external reference listed in repository notices]

<details>
<summary>LICENSE</summary>

\`\`\`text
MIT License

Copyright (c) 2017 Photopea

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
\`\`\`

</details>

### ansi-regex 5.0.1

- License: \`MIT\`
- Source: [external reference listed in repository notices]

<details>
<summary>license</summary>

\`\`\`text
MIT License

Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
\`\`\`

</details>

### ansi-styles 4.3.0

- License: \`MIT\`
- Source: [external reference listed in repository notices]

<details>
<summary>license</summary>

\`\`\`text
MIT License

Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
\`\`\`

</details>

### camelcase 5.3.1

- License: \`MIT\`
- Source: [external reference listed in repository notices]

<details>
<summary>license</summary>

\`\`\`text
MIT License

Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
\`\`\`

</details>

### cliui 6.0.0

- License: \`ISC\`
- Source: [external reference listed in repository notices]

<details>
<summary>LICENSE.txt</summary>

\`\`\`text
Copyright (c) 2015, Contributors

Permission to use, copy, modify, and/or distribute this software
for any purpose with or without fee is hereby granted, provided
that the above copyright notice and this permission notice
appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES
OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE
LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES
OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS,
WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION,
ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
\`\`\`

</details>

### color-convert 2.0.1

- License: \`MIT\`
- Source: [external reference listed in repository notices]

<details>
<summary>LICENSE</summary>

\`\`\`text
Copyright (c) 2011-2016 Heather Arthur <fayearthur@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
\`\`\`

</details>

### color-name 1.1.4

- License: \`MIT\`
- Source: [external reference listed in repository notices]

<details>
<summary>LICENSE</summary>

\`\`\`text
The MIT License (MIT)
Copyright (c) 2015 Dmitry Ivanov

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
\`\`\`

</details>

### decamelize 1.2.0

- License: \`MIT\`
- Source: [external reference listed in repository notices]

<details>
<summary>license</summary>

\`\`\`text
The MIT License (MIT)

Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
\`\`\`

</details>

### dijkstrajs 1.0.3

- License: \`MIT\`
- Source: [external reference listed in repository notices]

<details>
<summary>LICENSE.md</summary>

\`\`\`\`text
\`\`\`
Dijkstra path-finding functions. Adapted from the Dijkstar Python project.

Copyright (C) 2008
  Wyatt Baldwin <self@wyattbaldwin.com>
  All rights reserved

Licensed under the MIT license.

  [external reference listed in repository notices]

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
\`\`\`
\`\`\`\`

</details>

### emoji-regex 8.0.0

- License: \`MIT\`
- Source: [external reference listed in repository notices]

<details>
<summary>LICENSE-MIT.txt</summary>

\`\`\`text
Copyright Mathias Bynens [external reference listed in repository notices]

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
\`\`\`

</details>

### find-up 5.0.0

- License: \`MIT\`
- Source: [external reference listed in repository notices]

<details>
<summary>license</summary>

\`\`\`text
MIT License

Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> ([external reference listed in repository notices])

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
\`\`\`

</details>

### get-caller-file 2.0.5

- License: \`ISC\`
- Source: [external reference listed in repository notices]

<details>
<summary>LICENSE.md</summary>

\`\`\`text
ISC License (ISC)
Copyright 2018 Stefan Penner

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
\`\`\`

</details>

### is-fullwidth-code-point 3.0.0

- License: \`MIT\`
- Source: [external reference listed in repository notices]

<details>
<summary>license</summary>

\`\`\`text
MIT License

Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
\`\`\`

</details>

### locate-path 6.0.0

- License: \`MIT\`
- Source: [external reference listed in repository notices]

<details>
<summary>license</summary>

\`\`\`text
MIT License

Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> ([external reference listed in repository notices])

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
\`\`\`

</details>

### p-limit 3.1.0

- License: \`MIT\`
- Source: [external reference listed in repository notices]

<details>
<summary>license</summary>

\`\`\`text
MIT License

Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> ([external reference listed in repository notices])

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
\`\`\`

</details>

### p-locate 5.0.0

- License: \`MIT\`
- Source: [external reference listed in repository notices]

<details>
<summary>license</summary>

\`\`\`text
MIT License

Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> ([external reference listed in repository notices])

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
\`\`\`

</details>

### pako 1.0.11

- License: \`(MIT AND Zlib)\`
- Source: [external reference listed in repository notices]

<details>
<summary>node_modules/pako/LICENSE</summary>

\`\`\`text
(The MIT License)

Copyright (C) 2014-2017 by Vitaly Puzrin and Andrei Tuputcyn

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
\`\`\`

</details>

<details>
<summary>node_modules/pako/lib/zlib/README</summary>

\`\`\`text
Content of this folder follows zlib C sources as close as possible.
That's intended to simplify maintainability and guarantee equal API
and result.

Key differences:

- Everything is in JavaScript.
- No platform-dependent blocks.
- Some things like crc32 rewritten to keep size small and make JIT
  work better.
- Some code is different due missed features in JS (macros, pointers,
  structures, header files)
- Specific API methods are not implemented (see notes in root readme)

This port is based on zlib 1.2.8.

This port is under zlib license (see below) with contribution and addition of javascript
port under expat license (see LICENSE at root of project)

Copyright:
(C) 1995-2013 Jean-loup Gailly and Mark Adler
(C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin


From zlib's README
=============================================================================

Acknowledgments:

  The deflate format used by zlib was defined by Phil Katz.  The deflate and
  zlib specifications were written by L.  Peter Deutsch.  Thanks to all the
  people who reported problems and suggested various improvements in zlib; they
  are too numerous to cite here.

Copyright notice:

 (C) 1995-2013 Jean-loup Gailly and Mark Adler

Copyright (c) <''year''> <''copyright holders''>

This software is provided 'as-is', without any express or implied
warranty. In no event will the authors be held liable for any damages
arising from the use of this software.

Permission is granted to anyone to use this software for any purpose,
including commercial applications, and to alter it and redistribute it
freely, subject to the following restrictions:

1. The origin of this software must not be misrepresented; you must not
   claim that you wrote the original software. If you use this software
   in a product, an acknowledgment in the product documentation would be
   appreciated but is not required.
2. Altered source versions must be plainly marked as such, and must not be
   misrepresented as being the original software.
3. This notice may not be removed or altered from any source distribution.


  Jean-loup Gailly        Mark Adler
  jloup@gzip.org          madler@alumni.caltech.edu
\`\`\`

</details>

### path-exists 4.0.0

- License: \`MIT\`
- Source: [external reference listed in repository notices]

<details>
<summary>license</summary>

\`\`\`text
MIT License

Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
\`\`\`

</details>

### pdf-lib 1.17.1

- License: \`MIT\`
- Source: [external reference listed in repository notices]

<details>
<summary>LICENSE.md</summary>

\`\`\`text
MIT License

Copyright (c) 2019 Andrew Dillon

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
\`\`\`

</details>

### pngjs 5.0.0

- License: \`MIT\`
- Source: [external reference listed in repository notices]

<details>
<summary>LICENSE</summary>

\`\`\`text
pngjs2 original work Copyright (c) 2015 Luke Page & Original Contributors
pngjs derived work Copyright (c) 2012 Kuba Niegowski

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
\`\`\`

</details>

### qrcode 1.5.4

- License: \`MIT\`
- Source: [external reference listed in repository notices]

<details>
<summary>license</summary>

\`\`\`text
The MIT License (MIT)

Copyright (c) 2012 Ryan Day

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
\`\`\`

</details>

### react 19.2.8

- License: \`MIT\`
- Source: [external reference listed in repository notices]

<details>
<summary>LICENSE</summary>

\`\`\`text
MIT License

Copyright (c) Meta Platforms, Inc. and affiliates.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
\`\`\`

</details>

### react-dom 19.2.8

- License: \`MIT\`
- Source: [external reference listed in repository notices]

<details>
<summary>LICENSE</summary>

\`\`\`text
MIT License

Copyright (c) Meta Platforms, Inc. and affiliates.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
\`\`\`

</details>

### require-directory 2.1.1

- License: \`MIT\`
- Source: [external reference listed in repository notices]

<details>
<summary>LICENSE</summary>

\`\`\`text
The MIT License (MIT)

Copyright (c) 2011 Troy Goode <troygoode@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a
copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be included
in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
\`\`\`

</details>

### require-main-filename 2.0.0

- License: \`ISC\`
- Source: [external reference listed in repository notices]

<details>
<summary>LICENSE.txt</summary>

\`\`\`text
Copyright (c) 2016, Contributors

Permission to use, copy, modify, and/or distribute this software
for any purpose with or without fee is hereby granted, provided
that the above copyright notice and this permission notice
appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES
OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE
LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES
OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS,
WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION,
ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
\`\`\`

</details>

### scheduler 0.27.0

- License: \`MIT\`
- Source: [external reference listed in repository notices]

<details>
<summary>LICENSE</summary>

\`\`\`text
MIT License

Copyright (c) Meta Platforms, Inc. and affiliates.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
\`\`\`

</details>

### set-blocking 2.0.0

- License: \`ISC\`
- Source: [external reference listed in repository notices]

<details>
<summary>LICENSE.txt</summary>

\`\`\`text
Copyright (c) 2016, Contributors

Permission to use, copy, modify, and/or distribute this software
for any purpose with or without fee is hereby granted, provided
that the above copyright notice and this permission notice
appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES
OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE
LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES
OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS,
WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION,
ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
\`\`\`

</details>

### string-width 4.2.3

- License: \`MIT\`
- Source: [external reference listed in repository notices]

<details>
<summary>license</summary>

\`\`\`text
MIT License

Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
\`\`\`

</details>

### strip-ansi 6.0.1

- License: \`MIT\`
- Source: [external reference listed in repository notices]

<details>
<summary>license</summary>

\`\`\`text
MIT License

Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
\`\`\`

</details>

### tslib 1.14.1

- License: \`0BSD\`
- Source: [external reference listed in repository notices]

<details>
<summary>LICENSE.txt</summary>

\`\`\`text
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
\`\`\`

</details>

### which-module 2.0.1

- License: \`ISC\`
- Source: [external reference listed in repository notices]

<details>
<summary>LICENSE</summary>

\`\`\`text
Copyright (c) 2016, Contributors

Permission to use, copy, modify, and/or distribute this software for any purpose
with or without fee is hereby granted, provided that the above copyright notice
and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND
FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS
OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER
TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF
THIS SOFTWARE.
\`\`\`

</details>

### wrap-ansi 6.2.0

- License: \`MIT\`
- Source: [external reference listed in repository notices]

<details>
<summary>license</summary>

\`\`\`text
MIT License

Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
\`\`\`

</details>

### y18n 4.0.3

- License: \`ISC\`
- Source: [external reference listed in repository notices]

<details>
<summary>LICENSE</summary>

\`\`\`text
Copyright (c) 2015, Contributors

Permission to use, copy, modify, and/or distribute this software for any purpose
with or without fee is hereby granted, provided that the above copyright notice
and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND
FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS
OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER
TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF
THIS SOFTWARE.
\`\`\`

</details>

### yargs 15.4.1

- License: \`MIT\`
- Source: [external reference listed in repository notices]

<details>
<summary>LICENSE</summary>

\`\`\`text
MIT License

Copyright 2010 James Halliday (mail@substack.net); Modified work Copyright 2014 Contributors (ben@npmjs.com)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
\`\`\`

</details>

### yargs-parser 18.1.3

- License: \`ISC\`
- Source: [external reference listed in repository notices]

<details>
<summary>LICENSE.txt</summary>

\`\`\`text
Copyright (c) 2016, Contributors

Permission to use, copy, modify, and/or distribute this software
for any purpose with or without fee is hereby granted, provided
that the above copyright notice and this permission notice
appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES
OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE
LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES
OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS,
WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION,
ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
\`\`\`

</details>

### yocto-queue 0.1.0

- License: \`MIT\`
- Source: [external reference listed in repository notices]

<details>
<summary>license</summary>

\`\`\`text
MIT License

Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> ([external reference listed in repository notices])

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
\`\`\`

</details>

## Manually registered runtime assets

These assets require an explicit record because a JavaScript lockfile alone does not prove coverage of copied files or WebAssembly.

### FFmpeg / ffmpeg.wasm runtime assets 0.12.10

- License: \`GPL-2.0-or-later\`
- Source: [external reference listed in repository notices]
- Deployed paths: \`public/vendor/ffmpeg/ffmpeg-core.js\`, \`public/vendor/ffmpeg/ffmpeg-core.wasm\`
- FFmpeg licensing: [external reference listed in repository notices]
- GNU GPL 2.0: [external reference listed in repository notices]
- GNU LGPL 2.1: [external reference listed in repository notices]

<details>
<summary>scripts/license-texts/GPL-2.0-or-later.txt</summary>

\`\`\`text
                    GNU GENERAL PUBLIC LICENSE
                       Version 2, June 1991

 Copyright (C) 1989, 1991 Free Software Foundation, Inc.,
 [external reference listed in repository notices]
 Everyone is permitted to copy and distribute verbatim copies
 of this license document, but changing it is not allowed.

                            Preamble

  The licenses for most software are designed to take away your
freedom to share and change it.  By contrast, the GNU General Public
License is intended to guarantee your freedom to share and change free
software--to make sure the software is free for all its users.  This
General Public License applies to most of the Free Software
Foundation's software and to any other program whose authors commit to
using it.  (Some other Free Software Foundation software is covered by
the GNU Lesser General Public License instead.)  You can apply it to
your programs, too.

  When we speak of free software, we are referring to freedom, not
price.  Our General Public Licenses are designed to make sure that you
have the freedom to distribute copies of free software (and charge for
this service if you wish), that you receive source code or can get it
if you want it, that you can change the software or use pieces of it
in new free programs; and that you know you can do these things.

  To protect your rights, we need to make restrictions that forbid
anyone to deny you these rights or to ask you to surrender the rights.
These restrictions translate to certain responsibilities for you if you
distribute copies of the software, or if you modify it.

  For example, if you distribute copies of such a program, whether
gratis or for a fee, you must give the recipients all the rights that
you have.  You must make sure that they, too, receive or can get the
source code.  And you must show them these terms so they know their
rights.

  We protect your rights with two steps: (1) copyright the software, and
(2) offer you this license which gives you legal permission to copy,
distribute and/or modify the software.

  Also, for each author's protection and ours, we want to make certain
that everyone understands that there is no warranty for this free
software.  If the software is modified by someone else and passed on, we
want its recipients to know that what they have is not the original, so
that any problems introduced by others will not reflect on the original
authors' reputations.

  Finally, any free program is threatened constantly by software
patents.  We wish to avoid the danger that redistributors of a free
program will individually obtain patent licenses, in effect making the
program proprietary.  To prevent this, we have made it clear that any
patent must be licensed for everyone's free use or not licensed at all.

  The precise terms and conditions for copying, distribution and
modification follow.

                    GNU GENERAL PUBLIC LICENSE
   TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION

  0. This License applies to any program or other work which contains
a notice placed by the copyright holder saying it may be distributed
under the terms of this General Public License.  The "Program", below,
refers to any such program or work, and a "work based on the Program"
means either the Program or any derivative work under copyright law:
that is to say, a work containing the Program or a portion of it,
either verbatim or with modifications and/or translated into another
language.  (Hereinafter, translation is included without limitation in
the term "modification".)  Each licensee is addressed as "you".

Activities other than copying, distribution and modification are not
covered by this License; they are outside its scope.  The act of
running the Program is not restricted, and the output from the Program
is covered only if its contents constitute a work based on the
Program (independent of having been made by running the Program).
Whether that is true depends on what the Program does.

  1. You may copy and distribute verbatim copies of the Program's
source code as you receive it, in any medium, provided that you
conspicuously and appropriately publish on each copy an appropriate
copyright notice and disclaimer of warranty; keep intact all the
notices that refer to this License and to the absence of any warranty;
and give any other recipients of the Program a copy of this License
along with the Program.

You may charge a fee for the physical act of transferring a copy, and
you may at your option offer warranty protection in exchange for a fee.

  2. You may modify your copy or copies of the Program or any portion
of it, thus forming a work based on the Program, and copy and
distribute such modifications or work under the terms of Section 1
above, provided that you also meet all of these conditions:

    a) You must cause the modified files to carry prominent notices
    stating that you changed the files and the date of any change.

    b) You must cause any work that you distribute or publish, that in
    whole or in part contains or is derived from the Program or any
    part thereof, to be licensed as a whole at no charge to all third
    parties under the terms of this License.

    c) If the modified program normally reads commands interactively
    when run, you must cause it, when started running for such
    interactive use in the most ordinary way, to print or display an
    announcement including an appropriate copyright notice and a
    notice that there is no warranty (or else, saying that you provide
    a warranty) and that users may redistribute the program under
    these conditions, and telling the user how to view a copy of this
    License.  (Exception: if the Program itself is interactive but
    does not normally print such an announcement, your work based on
    the Program is not required to print an announcement.)

These requirements apply to the modified work as a whole.  If
identifiable sections of that work are not derived from the Program,
and can be reasonably considered independent and separate works in
themselves, then this License, and its terms, do not apply to those
sections when you distribute them as separate works.  But when you
distribute the same sections as part of a whole which is a work based
on the Program, the distribution of the whole must be on the terms of
this License, whose permissions for other licensees extend to the
entire whole, and thus to each and every part regardless of who wrote it.

Thus, it is not the intent of this section to claim rights or contest
your rights to work written entirely by you; rather, the intent is to
exercise the right to control the distribution of derivative or
collective works based on the Program.

In addition, mere aggregation of another work not based on the Program
with the Program (or with a work based on the Program) on a volume of
a storage or distribution medium does not bring the other work under
the scope of this License.

  3. You may copy and distribute the Program (or a work based on it,
under Section 2) in object code or executable form under the terms of
Sections 1 and 2 above provided that you also do one of the following:

    a) Accompany it with the complete corresponding machine-readable
    source code, which must be distributed under the terms of Sections
    1 and 2 above on a medium customarily used for software interchange; or,

    b) Accompany it with a written offer, valid for at least three
    years, to give any third party, for a charge no more than your
    cost of physically performing source distribution, a complete
    machine-readable copy of the corresponding source code, to be
    distributed under the terms of Sections 1 and 2 above on a medium
    customarily used for software interchange; or,

    c) Accompany it with the information you received as to the offer
    to distribute corresponding source code.  (This alternative is
    allowed only for noncommercial distribution and only if you
    received the program in object code or executable form with such
    an offer, in accord with Subsection b above.)

The source code for a work means the preferred form of the work for
making modifications to it.  For an executable work, complete source
code means all the source code for all modules it contains, plus any
associated interface definition files, plus the scripts used to
control compilation and installation of the executable.  However, as a
special exception, the source code distributed need not include
anything that is normally distributed (in either source or binary
form) with the major components (compiler, kernel, and so on) of the
operating system on which the executable runs, unless that component
itself accompanies the executable.

If distribution of executable or object code is made by offering
access to copy from a designated place, then offering equivalent
access to copy the source code from the same place counts as
distribution of the source code, even though third parties are not
compelled to copy the source along with the object code.

  4. You may not copy, modify, sublicense, or distribute the Program
except as expressly provided under this License.  Any attempt
otherwise to copy, modify, sublicense or distribute the Program is
void, and will automatically terminate your rights under this License.
However, parties who have received copies, or rights, from you under
this License will not have their licenses terminated so long as such
parties remain in full compliance.

  5. You are not required to accept this License, since you have not
signed it.  However, nothing else grants you permission to modify or
distribute the Program or its derivative works.  These actions are
prohibited by law if you do not accept this License.  Therefore, by
modifying or distributing the Program (or any work based on the
Program), you indicate your acceptance of this License to do so, and
all its terms and conditions for copying, distributing or modifying
the Program or works based on it.

  6. Each time you redistribute the Program (or any work based on the
Program), the recipient automatically receives a license from the
original licensor to copy, distribute or modify the Program subject to
these terms and conditions.  You may not impose any further
restrictions on the recipients' exercise of the rights granted herein.
You are not responsible for enforcing compliance by third parties to
this License.

  7. If, as a consequence of a court judgment or allegation of patent
infringement or for any other reason (not limited to patent issues),
conditions are imposed on you (whether by court order, agreement or
otherwise) that contradict the conditions of this License, they do not
excuse you from the conditions of this License.  If you cannot
distribute so as to satisfy simultaneously your obligations under this
License and any other pertinent obligations, then as a consequence you
may not distribute the Program at all.  For example, if a patent
license would not permit royalty-free redistribution of the Program by
all those who receive copies directly or indirectly through you, then
the only way you could satisfy both it and this License would be to
refrain entirely from distribution of the Program.

If any portion of this section is held invalid or unenforceable under
any particular circumstance, the balance of the section is intended to
apply and the section as a whole is intended to apply in other
circumstances.

It is not the purpose of this section to induce you to infringe any
patents or other property right claims or to contest validity of any
such claims; this section has the sole purpose of protecting the
integrity of the free software distribution system, which is
implemented by public license practices.  Many people have made
generous contributions to the wide range of software distributed
through that system in reliance on consistent application of that
system; it is up to the author/donor to decide if he or she is willing
to distribute software through any other system and a licensee cannot
impose that choice.

This section is intended to make thoroughly clear what is believed to
be a consequence of the rest of this License.

  8. If the distribution and/or use of the Program is restricted in
certain countries either by patents or by copyrighted interfaces, the
original copyright holder who places the Program under this License
may add an explicit geographical distribution limitation excluding
those countries, so that distribution is permitted only in or among
countries not thus excluded.  In such case, this License incorporates
the limitation as if written in the body of this License.

  9. The Free Software Foundation may publish revised and/or new versions
of the General Public License from time to time.  Such new versions will
be similar in spirit to the present version, but may differ in detail to
address new problems or concerns.

Each version is given a distinguishing version number.  If the Program
specifies a version number of this License which applies to it and "any
later version", you have the option of following the terms and conditions
either of that version or of any later version published by the Free
Software Foundation.  If the Program does not specify a version number of
this License, you may choose any version ever published by the Free Software
Foundation.

  10. If you wish to incorporate parts of the Program into other free
programs whose distribution conditions are different, write to the author
to ask for permission.  For software which is copyrighted by the Free
Software Foundation, write to the Free Software Foundation; we sometimes
make exceptions for this.  Our decision will be guided by the two goals
of preserving the free status of all derivatives of our free software and
of promoting the sharing and reuse of software generally.

                            NO WARRANTY

  11. BECAUSE THE PROGRAM IS LICENSED FREE OF CHARGE, THERE IS NO WARRANTY
FOR THE PROGRAM, TO THE EXTENT PERMITTED BY APPLICABLE LAW.  EXCEPT WHEN
OTHERWISE STATED IN WRITING THE COPYRIGHT HOLDERS AND/OR OTHER PARTIES
PROVIDE THE PROGRAM "AS IS" WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESSED
OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE.  THE ENTIRE RISK AS
TO THE QUALITY AND PERFORMANCE OF THE PROGRAM IS WITH YOU.  SHOULD THE
PROGRAM PROVE DEFECTIVE, YOU ASSUME THE COST OF ALL NECESSARY SERVICING,
REPAIR OR CORRECTION.

  12. IN NO EVENT UNLESS REQUIRED BY APPLICABLE LAW OR AGREED TO IN WRITING
WILL ANY COPYRIGHT HOLDER, OR ANY OTHER PARTY WHO MAY MODIFY AND/OR
REDISTRIBUTE THE PROGRAM AS PERMITTED ABOVE, BE LIABLE TO YOU FOR DAMAGES,
INCLUDING ANY GENERAL, SPECIAL, INCIDENTAL OR CONSEQUENTIAL DAMAGES ARISING
OUT OF THE USE OR INABILITY TO USE THE PROGRAM (INCLUDING BUT NOT LIMITED
TO LOSS OF DATA OR DATA BEING RENDERED INACCURATE OR LOSSES SUSTAINED BY
YOU OR THIRD PARTIES OR A FAILURE OF THE PROGRAM TO OPERATE WITH ANY OTHER
PROGRAMS), EVEN IF SUCH HOLDER OR OTHER PARTY HAS BEEN ADVISED OF THE
POSSIBILITY OF SUCH DAMAGES.

                     END OF TERMS AND CONDITIONS

            How to Apply These Terms to Your New Programs

  If you develop a new program, and you want it to be of the greatest
possible use to the public, the best way to achieve this is to make it
free software which everyone can redistribute and change under these terms.

  To do so, attach the following notices to the program.  It is safest
to attach them to the start of each source file to most effectively
convey the exclusion of warranty; and each file should have at least
the "copyright" line and a pointer to where the full notice is found.

    <one line to give the program's name and a brief idea of what it does.>
    Copyright (C) <year>  <name of author>

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License along
    with this program; if not, see [external reference listed in repository notices].

Also add information on how to contact you by electronic and paper mail.

If the program is interactive, make it output a short notice like this
when it starts in an interactive mode:

    Gnomovision version 69, Copyright (C) year name of author
    Gnomovision comes with ABSOLUTELY NO WARRANTY; for details type \`show w'.
    This is free software, and you are welcome to redistribute it
    under certain conditions; type \`show c' for details.

The hypothetical commands \`show w' and \`show c' should show the appropriate
parts of the General Public License.  Of course, the commands you use may
be called something other than \`show w' and \`show c'; they could even be
mouse-clicks or menu items--whatever suits your program.

You should also get your employer (if you work as a programmer) or your
school, if any, to sign a "copyright disclaimer" for the program, if
necessary.  Here is a sample; alter the names:

  Yoyodyne, Inc., hereby disclaims all copyright interest in the program
  \`Gnomovision' (which makes passes at compilers) written by James Hacker.

  <signature of Moe Ghoul>, 1 April 1989
  Moe Ghoul, President of Vice

This General Public License does not permit incorporating your program into
proprietary programs.  If your program is a subroutine library, you may
consider it more useful to permit linking proprietary applications with the
library.  If this is what you want to do, use the GNU Lesser General
Public License instead of this License.
\`\`\`

</details>

<details>
<summary>scripts/license-texts/LGPL-2.1-or-later.txt</summary>

\`\`\`text
                  GNU LESSER GENERAL PUBLIC LICENSE
                       Version 2.1, February 1999

 Copyright (C) 1991, 1999 Free Software Foundation, Inc.
 [external reference listed in repository notices]
 Everyone is permitted to copy and distribute verbatim copies
 of this license document, but changing it is not allowed.

[This is the first released version of the Lesser GPL.  It also counts
 as the successor of the GNU Library Public License, version 2, hence
 the version number 2.1.]

                            Preamble

  The licenses for most software are designed to take away your
freedom to share and change it.  By contrast, the GNU General Public
Licenses are intended to guarantee your freedom to share and change
free software--to make sure the software is free for all its users.

  This license, the Lesser General Public License, applies to some
specially designated software packages--typically libraries--of the
Free Software Foundation and other authors who decide to use it.  You
can use it too, but we suggest you first think carefully about whether
this license or the ordinary General Public License is the better
strategy to use in any particular case, based on the explanations below.

  When we speak of free software, we are referring to freedom of use,
not price.  Our General Public Licenses are designed to make sure that
you have the freedom to distribute copies of free software (and charge
for this service if you wish); that you receive source code or can get
it if you want it; that you can change the software and use pieces of
it in new free programs; and that you are informed that you can do
these things.

  To protect your rights, we need to make restrictions that forbid
distributors to deny you these rights or to ask you to surrender these
rights.  These restrictions translate to certain responsibilities for
you if you distribute copies of the library or if you modify it.

  For example, if you distribute copies of the library, whether gratis
or for a fee, you must give the recipients all the rights that we gave
you.  You must make sure that they, too, receive or can get the source
code.  If you link other code with the library, you must provide
complete object files to the recipients, so that they can relink them
with the library after making changes to the library and recompiling
it.  And you must show them these terms so they know their rights.

  We protect your rights with a two-step method: (1) we copyright the
library, and (2) we offer you this license, which gives you legal
permission to copy, distribute and/or modify the library.

  To protect each distributor, we want to make it very clear that
there is no warranty for the free library.  Also, if the library is
modified by someone else and passed on, the recipients should know
that what they have is not the original version, so that the original
author's reputation will not be affected by problems that might be
introduced by others.
\f
  Finally, software patents pose a constant threat to the existence of
any free program.  We wish to make sure that a company cannot
effectively restrict the users of a free program by obtaining a
restrictive license from a patent holder.  Therefore, we insist that
any patent license obtained for a version of the library must be
consistent with the full freedom of use specified in this license.

  Most GNU software, including some libraries, is covered by the
ordinary GNU General Public License.  This license, the GNU Lesser
General Public License, applies to certain designated libraries, and
is quite different from the ordinary General Public License.  We use
this license for certain libraries in order to permit linking those
libraries into non-free programs.

  When a program is linked with a library, whether statically or using
a shared library, the combination of the two is legally speaking a
combined work, a derivative of the original library.  The ordinary
General Public License therefore permits such linking only if the
entire combination fits its criteria of freedom.  The Lesser General
Public License permits more lax criteria for linking other code with
the library.

  We call this license the "Lesser" General Public License because it
does Less to protect the user's freedom than the ordinary General
Public License.  It also provides other free software developers Less
of an advantage over competing non-free programs.  These disadvantages
are the reason we use the ordinary General Public License for many
libraries.  However, the Lesser license provides advantages in certain
special circumstances.

  For example, on rare occasions, there may be a special need to
encourage the widest possible use of a certain library, so that it becomes
a de-facto standard.  To achieve this, non-free programs must be
allowed to use the library.  A more frequent case is that a free
library does the same job as widely used non-free libraries.  In this
case, there is little to gain by limiting the free library to free
software only, so we use the Lesser General Public License.

  In other cases, permission to use a particular library in non-free
programs enables a greater number of people to use a large body of
free software.  For example, permission to use the GNU C Library in
non-free programs enables many more people to use the whole GNU
operating system, as well as its variant, the GNU/Linux operating
system.

  Although the Lesser General Public License is Less protective of the
users' freedom, it does ensure that the user of a program that is
linked with the Library has the freedom and the wherewithal to run
that program using a modified version of the Library.

  The precise terms and conditions for copying, distribution and
modification follow.  Pay close attention to the difference between a
"work based on the library" and a "work that uses the library".  The
former contains code derived from the library, whereas the latter must
be combined with the library in order to run.
\f
                  GNU LESSER GENERAL PUBLIC LICENSE
   TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION

  0. This License Agreement applies to any software library or other
program which contains a notice placed by the copyright holder or
other authorized party saying it may be distributed under the terms of
this Lesser General Public License (also called "this License").
Each licensee is addressed as "you".

  A "library" means a collection of software functions and/or data
prepared so as to be conveniently linked with application programs
(which use some of those functions and data) to form executables.

  The "Library", below, refers to any such software library or work
which has been distributed under these terms.  A "work based on the
Library" means either the Library or any derivative work under
copyright law: that is to say, a work containing the Library or a
portion of it, either verbatim or with modifications and/or translated
straightforwardly into another language.  (Hereinafter, translation is
included without limitation in the term "modification".)

  "Source code" for a work means the preferred form of the work for
making modifications to it.  For a library, complete source code means
all the source code for all modules it contains, plus any associated
interface definition files, plus the scripts used to control compilation
and installation of the library.

  Activities other than copying, distribution and modification are not
covered by this License; they are outside its scope.  The act of
running a program using the Library is not restricted, and output from
such a program is covered only if its contents constitute a work based
on the Library (independent of the use of the Library in a tool for
writing it).  Whether that is true depends on what the Library does
and what the program that uses the Library does.

  1. You may copy and distribute verbatim copies of the Library's
complete source code as you receive it, in any medium, provided that
you conspicuously and appropriately publish on each copy an
appropriate copyright notice and disclaimer of warranty; keep intact
all the notices that refer to this License and to the absence of any
warranty; and distribute a copy of this License along with the
Library.

  You may charge a fee for the physical act of transferring a copy,
and you may at your option offer warranty protection in exchange for a
fee.
\f
  2. You may modify your copy or copies of the Library or any portion
of it, thus forming a work based on the Library, and copy and
distribute such modifications or work under the terms of Section 1
above, provided that you also meet all of these conditions:

    a) The modified work must itself be a software library.

    b) You must cause the files modified to carry prominent notices
    stating that you changed the files and the date of any change.

    c) You must cause the whole of the work to be licensed at no
    charge to all third parties under the terms of this License.

    d) If a facility in the modified Library refers to a function or a
    table of data to be supplied by an application program that uses
    the facility, other than as an argument passed when the facility
    is invoked, then you must make a good faith effort to ensure that,
    in the event an application does not supply such function or
    table, the facility still operates, and performs whatever part of
    its purpose remains meaningful.

    (For example, a function in a library to compute square roots has
    a purpose that is entirely well-defined independent of the
    application.  Therefore, Subsection 2d requires that any
    application-supplied function or table used by this function must
    be optional: if the application does not supply it, the square
    root function must still compute square roots.)

These requirements apply to the modified work as a whole.  If
identifiable sections of that work are not derived from the Library,
and can be reasonably considered independent and separate works in
themselves, then this License, and its terms, do not apply to those
sections when you distribute them as separate works.  But when you
distribute the same sections as part of a whole which is a work based
on the Library, the distribution of the whole must be on the terms of
this License, whose permissions for other licensees extend to the
entire whole, and thus to each and every part regardless of who wrote
it.

Thus, it is not the intent of this section to claim rights or contest
your rights to work written entirely by you; rather, the intent is to
exercise the right to control the distribution of derivative or
collective works based on the Library.

In addition, mere aggregation of another work not based on the Library
with the Library (or with a work based on the Library) on a volume of
a storage or distribution medium does not bring the other work under
the scope of this License.

  3. You may opt to apply the terms of the ordinary GNU General Public
License instead of this License to a given copy of the Library.  To do
this, you must alter all the notices that refer to this License, so
that they refer to the ordinary GNU General Public License, version 2,
instead of to this License.  (If a newer version than version 2 of the
ordinary GNU General Public License has appeared, then you can specify
that version instead if you wish.)  Do not make any other change in
these notices.
\f
  Once this change is made in a given copy, it is irreversible for
that copy, so the ordinary GNU General Public License applies to all
subsequent copies and derivative works made from that copy.

  This option is useful when you wish to copy part of the code of
the Library into a program that is not a library.

  4. You may copy and distribute the Library (or a portion or
derivative of it, under Section 2) in object code or executable form
under the terms of Sections 1 and 2 above provided that you accompany
it with the complete corresponding machine-readable source code, which
must be distributed under the terms of Sections 1 and 2 above on a
medium customarily used for software interchange.

  If distribution of object code is made by offering access to copy
from a designated place, then offering equivalent access to copy the
source code from the same place satisfies the requirement to
distribute the source code, even though third parties are not
compelled to copy the source along with the object code.

  5. A program that contains no derivative of any portion of the
Library, but is designed to work with the Library by being compiled or
linked with it, is called a "work that uses the Library".  Such a
work, in isolation, is not a derivative work of the Library, and
therefore falls outside the scope of this License.

  However, linking a "work that uses the Library" with the Library
creates an executable that is a derivative of the Library (because it
contains portions of the Library), rather than a "work that uses the
library".  The executable is therefore covered by this License.
Section 6 states terms for distribution of such executables.

  When a "work that uses the Library" uses material from a header file
that is part of the Library, the object code for the work may be a
derivative work of the Library even though the source code is not.
Whether this is true is especially significant if the work can be
linked without the Library, or if the work is itself a library.  The
threshold for this to be true is not precisely defined by law.

  If such an object file uses only numerical parameters, data
structure layouts and accessors, and small macros and small inline
functions (ten lines or less in length), then the use of the object
file is unrestricted, regardless of whether it is legally a derivative
work.  (Executables containing this object code plus portions of the
Library will still fall under Section 6.)

  Otherwise, if the work is a derivative of the Library, you may
distribute the object code for the work under the terms of Section 6.
Any executables containing that work also fall under Section 6,
whether or not they are linked directly with the Library itself.
\f
  6. As an exception to the Sections above, you may also combine or
link a "work that uses the Library" with the Library to produce a
work containing portions of the Library, and distribute that work
under terms of your choice, provided that the terms permit
modification of the work for the customer's own use and reverse
engineering for debugging such modifications.

  You must give prominent notice with each copy of the work that the
Library is used in it and that the Library and its use are covered by
this License.  You must supply a copy of this License.  If the work
during execution displays copyright notices, you must include the
copyright notice for the Library among them, as well as a reference
directing the user to the copy of this License.  Also, you must do one
of these things:

    a) Accompany the work with the complete corresponding
    machine-readable source code for the Library including whatever
    changes were used in the work (which must be distributed under
    Sections 1 and 2 above); and, if the work is an executable linked
    with the Library, with the complete machine-readable "work that
    uses the Library", as object code and/or source code, so that the
    user can modify the Library and then relink to produce a modified
    executable containing the modified Library.  (It is understood
    that the user who changes the contents of definitions files in the
    Library will not necessarily be able to recompile the application
    to use the modified definitions.)

    b) Use a suitable shared library mechanism for linking with the
    Library.  A suitable mechanism is one that (1) uses at run time a
    copy of the library already present on the user's computer system,
    rather than copying library functions into the executable, and (2)
    will operate properly with a modified version of the library, if
    the user installs one, as long as the modified version is
    interface-compatible with the version that the work was made with.

    c) Accompany the work with a written offer, valid for at
    least three years, to give the same user the materials
    specified in Subsection 6a, above, for a charge no more
    than the cost of performing this distribution.

    d) If distribution of the work is made by offering access to copy
    from a designated place, offer equivalent access to copy the above
    specified materials from the same place.

    e) Verify that the user has already received a copy of these
    materials or that you have already sent this user a copy.

  For an executable, the required form of the "work that uses the
Library" must include any data and utility programs needed for
reproducing the executable from it.  However, as a special exception,
the materials to be distributed need not include anything that is
normally distributed (in either source or binary form) with the major
components (compiler, kernel, and so on) of the operating system on
which the executable runs, unless that component itself accompanies
the executable.

  It may happen that this requirement contradicts the license
restrictions of other proprietary libraries that do not normally
accompany the operating system.  Such a contradiction means you cannot
use both them and the Library together in an executable that you
distribute.
\f
  7. You may place library facilities that are a work based on the
Library side-by-side in a single library together with other library
facilities not covered by this License, and distribute such a combined
library, provided that the separate distribution of the work based on
the Library and of the other library facilities is otherwise
permitted, and provided that you do these two things:

    a) Accompany the combined library with a copy of the same work
    based on the Library, uncombined with any other library
    facilities.  This must be distributed under the terms of the
    Sections above.

    b) Give prominent notice with the combined library of the fact
    that part of it is a work based on the Library, and explaining
    where to find the accompanying uncombined form of the same work.

  8. You may not copy, modify, sublicense, link with, or distribute
the Library except as expressly provided under this License.  Any
attempt otherwise to copy, modify, sublicense, link with, or
distribute the Library is void, and will automatically terminate your
rights under this License.  However, parties who have received copies,
or rights, from you under this License will not have their licenses
terminated so long as such parties remain in full compliance.

  9. You are not required to accept this License, since you have not
signed it.  However, nothing else grants you permission to modify or
distribute the Library or its derivative works.  These actions are
prohibited by law if you do not accept this License.  Therefore, by
modifying or distributing the Library (or any work based on the
Library), you indicate your acceptance of this License to do so, and
all its terms and conditions for copying, distributing or modifying
the Library or works based on it.

  10. Each time you redistribute the Library (or any work based on the
Library), the recipient automatically receives a license from the
original licensor to copy, distribute, link with or modify the Library
subject to these terms and conditions.  You may not impose any further
restrictions on the recipients' exercise of the rights granted herein.
You are not responsible for enforcing compliance by third parties with
this License.
\f
  11. If, as a consequence of a court judgment or allegation of patent
infringement or for any other reason (not limited to patent issues),
conditions are imposed on you (whether by court order, agreement or
otherwise) that contradict the conditions of this License, they do not
excuse you from the conditions of this License.  If you cannot
distribute so as to satisfy simultaneously your obligations under this
License and any other pertinent obligations, then as a consequence you
may not distribute the Library at all.  For example, if a patent
license would not permit royalty-free redistribution of the Library by
all those who receive copies directly or indirectly through you, then
the only way you could satisfy both it and this License would be to
refrain entirely from distribution of the Library.

If any portion of this section is held invalid or unenforceable under any
particular circumstance, the balance of the section is intended to apply,
and the section as a whole is intended to apply in other circumstances.

It is not the purpose of this section to induce you to infringe any
patents or other property right claims or to contest validity of any
such claims; this section has the sole purpose of protecting the
integrity of the free software distribution system which is
implemented by public license practices.  Many people have made
generous contributions to the wide range of software distributed
through that system in reliance on consistent application of that
system; it is up to the author/donor to decide if he or she is willing
to distribute software through any other system and a licensee cannot
impose that choice.

This section is intended to make thoroughly clear what is believed to
be a consequence of the rest of this License.

  12. If the distribution and/or use of the Library is restricted in
certain countries either by patents or by copyrighted interfaces, the
original copyright holder who places the Library under this License may add
an explicit geographical distribution limitation excluding those countries,
so that distribution is permitted only in or among countries not thus
excluded.  In such case, this License incorporates the limitation as if
written in the body of this License.

  13. The Free Software Foundation may publish revised and/or new
versions of the Lesser General Public License from time to time.
Such new versions will be similar in spirit to the present version,
but may differ in detail to address new problems or concerns.

Each version is given a distinguishing version number.  If the Library
specifies a version number of this License which applies to it and
"any later version", you have the option of following the terms and
conditions either of that version or of any later version published by
the Free Software Foundation.  If the Library does not specify a
license version number, you may choose any version ever published by
the Free Software Foundation.
\f
  14. If you wish to incorporate parts of the Library into other free
programs whose distribution conditions are incompatible with these,
write to the author to ask for permission.  For software which is
copyrighted by the Free Software Foundation, write to the Free
Software Foundation; we sometimes make exceptions for this.  Our
decision will be guided by the two goals of preserving the free status
of all derivatives of our free software and of promoting the sharing
and reuse of software generally.

                            NO WARRANTY

  15. BECAUSE THE LIBRARY IS LICENSED FREE OF CHARGE, THERE IS NO
WARRANTY FOR THE LIBRARY, TO THE EXTENT PERMITTED BY APPLICABLE LAW.
EXCEPT WHEN OTHERWISE STATED IN WRITING THE COPYRIGHT HOLDERS AND/OR
OTHER PARTIES PROVIDE THE LIBRARY "AS IS" WITHOUT WARRANTY OF ANY
KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
PURPOSE.  THE ENTIRE RISK AS TO THE QUALITY AND PERFORMANCE OF THE
LIBRARY IS WITH YOU.  SHOULD THE LIBRARY PROVE DEFECTIVE, YOU ASSUME
THE COST OF ALL NECESSARY SERVICING, REPAIR OR CORRECTION.

  16. IN NO EVENT UNLESS REQUIRED BY APPLICABLE LAW OR AGREED TO IN
WRITING WILL ANY COPYRIGHT HOLDER, OR ANY OTHER PARTY WHO MAY MODIFY
AND/OR REDISTRIBUTE THE LIBRARY AS PERMITTED ABOVE, BE LIABLE TO YOU
FOR DAMAGES, INCLUDING ANY GENERAL, SPECIAL, INCIDENTAL OR
CONSEQUENTIAL DAMAGES ARISING OUT OF THE USE OR INABILITY TO USE THE
LIBRARY (INCLUDING BUT NOT LIMITED TO LOSS OF DATA OR DATA BEING
RENDERED INACCURATE OR LOSSES SUSTAINED BY YOU OR THIRD PARTIES OR A
FAILURE OF THE LIBRARY TO OPERATE WITH ANY OTHER SOFTWARE), EVEN IF
SUCH HOLDER OR OTHER PARTY HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH
DAMAGES.

                     END OF TERMS AND CONDITIONS
\f
           How to Apply These Terms to Your New Libraries

  If you develop a new library, and you want it to be of the greatest
possible use to the public, we recommend making it free software that
everyone can redistribute and change.  You can do so by permitting
redistribution under these terms (or, alternatively, under the terms of the
ordinary General Public License).

  To apply these terms, attach the following notices to the library.  It is
safest to attach them to the start of each source file to most effectively
convey the exclusion of warranty; and each file should have at least the
"copyright" line and a pointer to where the full notice is found.

    <one line to give the library's name and a brief idea of what it does.>
    Copyright (C) <year>  <name of author>

    This library is free software; you can redistribute it and/or
    modify it under the terms of the GNU Lesser General Public
    License as published by the Free Software Foundation; either
    version 2.1 of the License, or (at your option) any later version.

    This library is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
    Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public
    License along with this library; if not, see [external reference listed in repository notices].

Also add information on how to contact you by electronic and paper mail.

You should also get your employer (if you work as a programmer) or your
school, if any, to sign a "copyright disclaimer" for the library, if
necessary.  Here is a sample; alter the names:

  Yoyodyne, Inc., hereby disclaims all copyright interest in the
  library \`Frob' (a library for tweaking knobs) written by James Random Hacker.

  <signature of Moe Ghoul>, 1 April 1990
  Moe Ghoul, President of Vice

That's all there is to it!
\`\`\`

</details>

<details>
<summary>scripts/license-texts/MIT-ffmpegwasm.txt</summary>

\`\`\`text
MIT License

Copyright (c) 2019 Jerome Wu

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
\`\`\`

</details>

### Folkkit favicon 1

- License: \`AGPL-3.0-only\`
- Source: [external reference listed in repository notices]
- Deployed paths: \`public/favicon.svg\`
- GNU AGPL 3.0: [external reference listed in repository notices]

<details>
<summary>LICENSE</summary>

\`\`\`text
                    GNU AFFERO GENERAL PUBLIC LICENSE
                       Version 3, 19 November 2007

 Copyright (C) 2007 Free Software Foundation, Inc. [external reference listed in repository notices]
 Everyone is permitted to copy and distribute verbatim copies
 of this license document, but changing it is not allowed.

                            Preamble

  The GNU Affero General Public License is a free, copyleft license for
software and other kinds of works, specifically designed to ensure
cooperation with the community in the case of network server software.

  The licenses for most software and other practical works are designed
to take away your freedom to share and change the works.  By contrast,
our General Public Licenses are intended to guarantee your freedom to
share and change all versions of a program--to make sure it remains free
software for all its users.

  When we speak of free software, we are referring to freedom, not
price.  Our General Public Licenses are designed to make sure that you
have the freedom to distribute copies of free software (and charge for
them if you wish), that you receive source code or can get it if you
want it, that you can change the software or use pieces of it in new
free programs, and that you know you can do these things.

  Developers that use our General Public Licenses protect your rights
with two steps: (1) assert copyright on the software, and (2) offer
you this License which gives you legal permission to copy, distribute
and/or modify the software.

  A secondary benefit of defending all users' freedom is that
improvements made in alternate versions of the program, if they
receive widespread use, become available for other developers to
incorporate.  Many developers of free software are heartened and
encouraged by the resulting cooperation.  However, in the case of
software used on network servers, this result may fail to come about.
The GNU General Public License permits making a modified version and
letting the public access it on a server without ever releasing its
source code to the public.

  The GNU Affero General Public License is designed specifically to
ensure that, in such cases, the modified source code becomes available
to the community.  It requires the operator of a network server to
provide the source code of the modified version running there to the
users of that server.  Therefore, public use of a modified version, on
a publicly accessible server, gives the public access to the source
code of the modified version.

  An older license, called the Affero General Public License and
published by Affero, was designed to accomplish similar goals.  This is
a different license, not a version of the Affero GPL, but Affero has
released a new version of the Affero GPL which permits relicensing under
this license.

  The precise terms and conditions for copying, distribution and
modification follow.

                       TERMS AND CONDITIONS

  0. Definitions.

  "This License" refers to version 3 of the GNU Affero General Public License.

  "Copyright" also means copyright-like laws that apply to other kinds of
works, such as semiconductor masks.

  "The Program" refers to any copyrightable work licensed under this
License.  Each licensee is addressed as "you".  "Licensees" and
"recipients" may be individuals or organizations.

  To "modify" a work means to copy from or adapt all or part of the work
in a fashion requiring copyright permission, other than the making of an
exact copy.  The resulting work is called a "modified version" of the
earlier work or a work "based on" the earlier work.

  A "covered work" means either the unmodified Program or a work based
on the Program.

  To "propagate" a work means to do anything with it that, without
permission, would make you directly or secondarily liable for
infringement under applicable copyright law, except executing it on a
computer or modifying a private copy.  Propagation includes copying,
distribution (with or without modification), making available to the
public, and in some countries other activities as well.

  To "convey" a work means any kind of propagation that enables other
parties to make or receive copies.  Mere interaction with a user through
a computer network, with no transfer of a copy, is not conveying.

  An interactive user interface displays "Appropriate Legal Notices"
to the extent that it includes a convenient and prominently visible
feature that (1) displays an appropriate copyright notice, and (2)
tells the user that there is no warranty for the work (except to the
extent that warranties are provided), that licensees may convey the
work under this License, and how to view a copy of this License.  If
the interface presents a list of user commands or options, such as a
menu, a prominent item in the list meets this criterion.

  1. Source Code.

  The "source code" for a work means the preferred form of the work
for making modifications to it.  "Object code" means any non-source
form of a work.

  A "Standard Interface" means an interface that either is an official
standard defined by a recognized standards body, or, in the case of
interfaces specified for a particular programming language, one that
is widely used among developers working in that language.

  The "System Libraries" of an executable work include anything, other
than the work as a whole, that (a) is included in the normal form of
packaging a Major Component, but which is not part of that Major
Component, and (b) serves only to enable use of the work with that
Major Component, or to implement a Standard Interface for which an
implementation is available to the public in source code form.  A
"Major Component", in this context, means a major essential component
(kernel, window system, and so on) of the specific operating system
(if any) on which the executable work runs, or a compiler used to
produce the work, or an object code interpreter used to run it.

  The "Corresponding Source" for a work in object code form means all
the source code needed to generate, install, and (for an executable
work) run the object code and to modify the work, including scripts to
control those activities.  However, it does not include the work's
System Libraries, or general-purpose tools or generally available free
programs which are used unmodified in performing those activities but
which are not part of the work.  For example, Corresponding Source
includes interface definition files associated with source files for
the work, and the source code for shared libraries and dynamically
linked subprograms that the work is specifically designed to require,
such as by intimate data communication or control flow between those
subprograms and other parts of the work.

  The Corresponding Source need not include anything that users
can regenerate automatically from other parts of the Corresponding
Source.

  The Corresponding Source for a work in source code form is that
same work.

  2. Basic Permissions.

  All rights granted under this License are granted for the term of
copyright on the Program, and are irrevocable provided the stated
conditions are met.  This License explicitly affirms your unlimited
permission to run the unmodified Program.  The output from running a
covered work is covered by this License only if the output, given its
content, constitutes a covered work.  This License acknowledges your
rights of fair use or other equivalent, as provided by copyright law.

  You may make, run and propagate covered works that you do not
convey, without conditions so long as your license otherwise remains
in force.  You may convey covered works to others for the sole purpose
of having them make modifications exclusively for you, or provide you
with facilities for running those works, provided that you comply with
the terms of this License in conveying all material for which you do
not control copyright.  Those thus making or running the covered works
for you must do so exclusively on your behalf, under your direction
and control, on terms that prohibit them from making any copies of
your copyrighted material outside their relationship with you.

  Conveying under any other circumstances is permitted solely under
the conditions stated below.  Sublicensing is not allowed; section 10
makes it unnecessary.

  3. Protecting Users' Legal Rights From Anti-Circumvention Law.

  No covered work shall be deemed part of an effective technological
measure under any applicable law fulfilling obligations under article
11 of the WIPO copyright treaty adopted on 20 December 1996, or
similar laws prohibiting or restricting circumvention of such
measures.

  When you convey a covered work, you waive any legal power to forbid
circumvention of technological measures to the extent such circumvention
is effected by exercising rights under this License with respect to
the covered work, and you disclaim any intention to limit operation or
modification of the work as a means of enforcing, against the work's
users, your or third parties' legal rights to forbid circumvention of
technological measures.

  4. Conveying Verbatim Copies.

  You may convey verbatim copies of the Program's source code as you
receive it, in any medium, provided that you conspicuously and
appropriately publish on each copy an appropriate copyright notice;
keep intact all notices stating that this License and any
non-permissive terms added in accord with section 7 apply to the code;
keep intact all notices of the absence of any warranty; and give all
recipients a copy of this License along with the Program.

  You may charge any price or no price for each copy that you convey,
and you may offer support or warranty protection for a fee.

  5. Conveying Modified Source Versions.

  You may convey a work based on the Program, or the modifications to
produce it from the Program, in the form of source code under the
terms of section 4, provided that you also meet all of these conditions:

    a) The work must carry prominent notices stating that you modified
    it, and giving a relevant date.

    b) The work must carry prominent notices stating that it is
    released under this License and any conditions added under section
    7.  This requirement modifies the requirement in section 4 to
    "keep intact all notices".

    c) You must license the entire work, as a whole, under this
    License to anyone who comes into possession of a copy.  This
    License will therefore apply, along with any applicable section 7
    additional terms, to the whole of the work, and all its parts,
    regardless of how they are packaged.  This License gives no
    permission to license the work in any other way, but it does not
    invalidate such permission if you have separately received it.

    d) If the work has interactive user interfaces, each must display
    Appropriate Legal Notices; however, if the Program has interactive
    interfaces that do not display Appropriate Legal Notices, your
    work need not make them do so.

  A compilation of a covered work with other separate and independent
works, which are not by their nature extensions of the covered work,
and which are not combined with it such as to form a larger program,
in or on a volume of a storage or distribution medium, is called an
"aggregate" if the compilation and its resulting copyright are not
used to limit the access or legal rights of the compilation's users
beyond what the individual works permit.  Inclusion of a covered work
in an aggregate does not cause this License to apply to the other
parts of the aggregate.

  6. Conveying Non-Source Forms.

  You may convey a covered work in object code form under the terms
of sections 4 and 5, provided that you also convey the
machine-readable Corresponding Source under the terms of this License,
in one of these ways:

    a) Convey the object code in, or embodied in, a physical product
    (including a physical distribution medium), accompanied by the
    Corresponding Source fixed on a durable physical medium
    customarily used for software interchange.

    b) Convey the object code in, or embodied in, a physical product
    (including a physical distribution medium), accompanied by a
    written offer, valid for at least three years and valid for as
    long as you offer spare parts or customer support for that product
    model, to give anyone who possesses the object code either (1) a
    copy of the Corresponding Source for all the software in the
    product that is covered by this License, on a durable physical
    medium customarily used for software interchange, for a price no
    more than your reasonable cost of physically performing this
    conveying of source, or (2) access to copy the
    Corresponding Source from a network server at no charge.

    c) Convey individual copies of the object code with a copy of the
    written offer to provide the Corresponding Source.  This
    alternative is allowed only occasionally and noncommercially, and
    only if you received the object code with such an offer, in accord
    with subsection 6b.

    d) Convey the object code by offering access from a designated
    place (gratis or for a charge), and offer equivalent access to the
    Corresponding Source in the same way through the same place at no
    further charge.  You need not require recipients to copy the
    Corresponding Source along with the object code.  If the place to
    copy the object code is a network server, the Corresponding Source
    may be on a different server (operated by you or a third party)
    that supports equivalent copying facilities, provided you maintain
    clear directions next to the object code saying where to find the
    Corresponding Source.  Regardless of what server hosts the
    Corresponding Source, you remain obligated to ensure that it is
    available for as long as needed to satisfy these requirements.

    e) Convey the object code using peer-to-peer transmission, provided
    you inform other peers where the object code and Corresponding
    Source of the work are being offered to the general public at no
    charge under subsection 6d.

  A separable portion of the object code, whose source code is excluded
from the Corresponding Source as a System Library, need not be
included in conveying the object code work.

  A "User Product" is either (1) a "consumer product", which means any
tangible personal property which is normally used for personal, family,
or household purposes, or (2) anything designed or sold for incorporation
into a dwelling.  In determining whether a product is a consumer product,
doubtful cases shall be resolved in favor of coverage.  For a particular
product received by a particular user, "normally used" refers to a
typical or common use of that class of product, regardless of the status
of the particular user or of the way in which the particular user
actually uses, or expects or is expected to use, the product.  A product
is a consumer product regardless of whether the product has substantial
commercial, industrial or non-consumer uses, unless such uses represent
the only significant mode of use of the product.

  "Installation Information" for a User Product means any methods,
procedures, authorization keys, or other information required to install
and execute modified versions of a covered work in that User Product from
a modified version of its Corresponding Source.  The information must
suffice to ensure that the continued functioning of the modified object
code is in no case prevented or interfered with solely because
modification has been made.

  If you convey an object code work under this section in, or with, or
specifically for use in, a User Product, and the conveying occurs as
part of a transaction in which the right of possession and use of the
User Product is transferred to the recipient in perpetuity or for a
fixed term (regardless of how the transaction is characterized), the
Corresponding Source conveyed under this section must be accompanied
by the Installation Information.  But this requirement does not apply
if neither you nor any third party retains the ability to install
modified object code on the User Product (for example, the work has
been installed in ROM).

  The requirement to provide Installation Information does not include a
requirement to continue to provide support service, warranty, or updates
for a work that has been modified or installed by the recipient, or for
the User Product in which it has been modified or installed.  Access to a
network may be denied when the modification itself materially and
adversely affects the operation of the network or violates the rules and
protocols for communication across the network.

  Corresponding Source conveyed, and Installation Information provided,
in accord with this section must be in a format that is publicly
documented (and with an implementation available to the public in
source code form), and must require no special password or key for
unpacking, reading or copying.

  7. Additional Terms.

  "Additional permissions" are terms that supplement the terms of this
License by making exceptions from one or more of its conditions.
Additional permissions that are applicable to the entire Program shall
be treated as though they were included in this License, to the extent
that they are valid under applicable law.  If additional permissions
apply only to part of the Program, that part may be used separately
under those permissions, but the entire Program remains governed by
this License without regard to the additional permissions.

  When you convey a copy of a covered work, you may at your option
remove any additional permissions from that copy, or from any part of
it.  (Additional permissions may be written to require their own
removal in certain cases when you modify the work.)  You may place
additional permissions on material, added by you to a covered work,
for which you have or can give appropriate copyright permission.

  Notwithstanding any other provision of this License, for material you
add to a covered work, you may (if authorized by the copyright holders of
that material) supplement the terms of this License with terms:

    a) Disclaiming warranty or limiting liability differently from the
    terms of sections 15 and 16 of this License; or

    b) Requiring preservation of specified reasonable legal notices or
    author attributions in that material or in the Appropriate Legal
    Notices displayed by works containing it; or

    c) Prohibiting misrepresentation of the origin of that material, or
    requiring that modified versions of such material be marked in
    reasonable ways as different from the original version; or

    d) Limiting the use for publicity purposes of names of licensors or
    authors of the material; or

    e) Declining to grant rights under trademark law for use of some
    trade names, trademarks, or service marks; or

    f) Requiring indemnification of licensors and authors of that
    material by anyone who conveys the material (or modified versions of
    it) with contractual assumptions of liability to the recipient, for
    any liability that these contractual assumptions directly impose on
    those licensors and authors.

  All other non-permissive additional terms are considered "further
restrictions" within the meaning of section 10.  If the Program as you
received it, or any part of it, contains a notice stating that it is
governed by this License along with a term that is a further
restriction, you may remove that term.  If a license document contains
a further restriction but permits relicensing or conveying under this
License, you may add to a covered work material governed by the terms
of that license document, provided that the further restriction does
not survive such relicensing or conveying.

  If you add terms to a covered work in accord with this section, you
must place, in the relevant source files, a statement of the
additional terms that apply to those files, or a notice indicating
where to find the applicable terms.

  Additional terms, permissive or non-permissive, may be stated in the
form of a separately written license, or stated as exceptions;
the above requirements apply either way.

  8. Termination.

  You may not propagate or modify a covered work except as expressly
provided under this License.  Any attempt otherwise to propagate or
modify it is void, and will automatically terminate your rights under
this License (including any patent licenses granted under the third
paragraph of section 11).

  However, if you cease all violation of this License, then your
license from a particular copyright holder is reinstated (a)
provisionally, unless and until the copyright holder explicitly and
finally terminates your license, and (b) permanently, if the copyright
holder fails to notify you of the violation by some reasonable means
prior to 60 days after the cessation.

  Moreover, your license from a particular copyright holder is
reinstated permanently if the copyright holder notifies you of the
violation by some reasonable means, this is the first time you have
received notice of violation of this License (for any work) from that
copyright holder, and you cure the violation prior to 30 days after
your receipt of the notice.

  Termination of your rights under this section does not terminate the
licenses of parties who have received copies or rights from you under
this License.  If your rights have been terminated and not permanently
reinstated, you do not qualify to receive new licenses for the same
material under section 10.

  9. Acceptance Not Required for Having Copies.

  You are not required to accept this License in order to receive or
run a copy of the Program.  Ancillary propagation of a covered work
occurring solely as a consequence of using peer-to-peer transmission
to receive a copy likewise does not require acceptance.  However,
nothing other than this License grants you permission to propagate or
modify any covered work.  These actions infringe copyright if you do
not accept this License.  Therefore, by modifying or propagating a
covered work, you indicate your acceptance of this License to do so.

  10. Automatic Licensing of Downstream Recipients.

  Each time you convey a covered work, the recipient automatically
receives a license from the original licensors, to run, modify and
propagate that work, subject to this License.  You are not responsible
for enforcing compliance by third parties with this License.

  An "entity transaction" is a transaction transferring control of an
organization, or substantially all assets of one, or subdividing an
organization, or merging organizations.  If propagation of a covered
work results from an entity transaction, each party to that
transaction who receives a copy of the work also receives whatever
licenses to the work the party's predecessor in interest had or could
give under the previous paragraph, plus a right to possession of the
Corresponding Source of the work from the predecessor in interest, if
the predecessor has it or can get it with reasonable efforts.

  You may not impose any further restrictions on the exercise of the
rights granted or affirmed under this License.  For example, you may
not impose a license fee, royalty, or other charge for exercise of
rights granted under this License, and you may not initiate litigation
(including a cross-claim or counterclaim in a lawsuit) alleging that
any patent claim is infringed by making, using, selling, offering for
sale, or importing the Program or any portion of it.

  11. Patents.

  A "contributor" is a copyright holder who authorizes use under this
License of the Program or a work on which the Program is based.  The
work thus licensed is called the contributor's "contributor version".

  A contributor's "essential patent claims" are all patent claims
owned or controlled by the contributor, whether already acquired or
hereafter acquired, that would be infringed by some manner, permitted
by this License, of making, using, or selling its contributor version,
but do not include claims that would be infringed only as a
consequence of further modification of the contributor version.  For
purposes of this definition, "control" includes the right to grant
patent sublicenses in a manner consistent with the requirements of
this License.

  Each contributor grants you a non-exclusive, worldwide, royalty-free
patent license under the contributor's essential patent claims, to
make, use, sell, offer for sale, import and otherwise run, modify and
propagate the contents of its contributor version.

  In the following three paragraphs, a "patent license" is any express
agreement or commitment, however denominated, not to enforce a patent
(such as an express permission to practice a patent or covenant not to
sue for patent infringement).  To "grant" such a patent license to a
party means to make such an agreement or commitment not to enforce a
patent against the party.

  If you convey a covered work, knowingly relying on a patent license,
and the Corresponding Source of the work is not available for anyone
to copy, free of charge and under the terms of this License, through a
publicly available network server or other readily accessible means,
then you must either (1) cause the Corresponding Source to be so
available, or (2) arrange to deprive yourself of the benefit of the
patent license for this particular work, or (3) arrange, in a manner
consistent with the requirements of this License, to extend the patent
license to downstream recipients.  "Knowingly relying" means you have
actual knowledge that, but for the patent license, your conveying the
covered work in a country, or your recipient's use of the covered work
in a country, would infringe one or more identifiable patents in that
country that you have reason to believe are valid.

  If, pursuant to or in connection with a single transaction or
arrangement, you convey, or propagate by procuring conveyance of, a
covered work, and grant a patent license to some of the parties
receiving the covered work authorizing them to use, propagate, modify
or convey a specific copy of the covered work, then the patent license
you grant is automatically extended to all recipients of the covered
work and works based on it.

  A patent license is "discriminatory" if it does not include within
the scope of its coverage, prohibits the exercise of, or is
conditioned on the non-exercise of one or more of the rights that are
specifically granted under this License.  You may not convey a covered
work if you are a party to an arrangement with a third party that is
in the business of distributing software, under which you make payment
to the third party based on the extent of your activity of conveying
the work, and under which the third party grants, to any of the
parties who would receive the covered work from you, a discriminatory
patent license (a) in connection with copies of the covered work
conveyed by you (or copies made from those copies), or (b) primarily
for and in connection with specific products or compilations that
contain the covered work, unless you entered into that arrangement,
or that patent license was granted, prior to 28 March 2007.

  Nothing in this License shall be construed as excluding or limiting
any implied license or other defenses to infringement that may
otherwise be available to you under applicable patent law.

  12. No Surrender of Others' Freedom.

  If conditions are imposed on you (whether by court order, agreement or
otherwise) that contradict the conditions of this License, they do not
excuse you from the conditions of this License.  If you cannot convey a
covered work so as to satisfy simultaneously your obligations under this
License and any other pertinent obligations, then as a consequence you may
not convey it at all.  For example, if you agree to terms that obligate you
to collect a royalty for further conveying from those to whom you convey
the Program, the only way you could satisfy both those terms and this
License would be to refrain entirely from conveying the Program.

  13. Remote Network Interaction; Use with the GNU General Public License.

  Notwithstanding any other provision of this License, if you modify the
Program, your modified version must prominently offer all users
interacting with it remotely through a computer network (if your version
supports such interaction) an opportunity to receive the Corresponding
Source of your version by providing access to the Corresponding Source
from a network server at no charge, through some standard or customary
means of facilitating copying of software.  This Corresponding Source
shall include the Corresponding Source for any work covered by version 3
of the GNU General Public License that is incorporated pursuant to the
following paragraph.

  Notwithstanding any other provision of this License, you have
permission to link or combine any covered work with a work licensed
under version 3 of the GNU General Public License into a single
combined work, and to convey the resulting work.  The terms of this
License will continue to apply to the part which is the covered work,
but the work with which it is combined will remain governed by version
3 of the GNU General Public License.

  14. Revised Versions of this License.

  The Free Software Foundation may publish revised and/or new versions of
the GNU Affero General Public License from time to time.  Such new versions
will be similar in spirit to the present version, but may differ in detail to
address new problems or concerns.

  Each version is given a distinguishing version number.  If the
Program specifies that a certain numbered version of the GNU Affero General
Public License "or any later version" applies to it, you have the
option of following the terms and conditions either of that numbered
version or of any later version published by the Free Software
Foundation.  If the Program does not specify a version number of the
GNU Affero General Public License, you may choose any version ever published
by the Free Software Foundation.

  If the Program specifies that a proxy can decide which future
versions of the GNU Affero General Public License can be used, that proxy's
public statement of acceptance of a version permanently authorizes you
to choose that version for the Program.

  Later license versions may give you additional or different
permissions.  However, no additional obligations are imposed on any
author or copyright holder as a result of your choosing to follow a
later version.

  15. Disclaimer of Warranty.

  THERE IS NO WARRANTY FOR THE PROGRAM, TO THE EXTENT PERMITTED BY
APPLICABLE LAW.  EXCEPT WHEN OTHERWISE STATED IN WRITING THE COPYRIGHT
HOLDERS AND/OR OTHER PARTIES PROVIDE THE PROGRAM "AS IS" WITHOUT WARRANTY
OF ANY KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING, BUT NOT LIMITED TO,
THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
PURPOSE.  THE ENTIRE RISK AS TO THE QUALITY AND PERFORMANCE OF THE PROGRAM
IS WITH YOU.  SHOULD THE PROGRAM PROVE DEFECTIVE, YOU ASSUME THE COST OF
ALL NECESSARY SERVICING, REPAIR OR CORRECTION.

  16. Limitation of Liability.

  IN NO EVENT UNLESS REQUIRED BY APPLICABLE LAW OR AGREED TO IN WRITING
WILL ANY COPYRIGHT HOLDER, OR ANY OTHER PARTY WHO MODIFIES AND/OR CONVEYS
THE PROGRAM AS PERMITTED ABOVE, BE LIABLE TO YOU FOR DAMAGES, INCLUDING ANY
GENERAL, SPECIAL, INCIDENTAL OR CONSEQUENTIAL DAMAGES ARISING OUT OF THE
USE OR INABILITY TO USE THE PROGRAM (INCLUDING BUT NOT LIMITED TO LOSS OF
DATA OR DATA BEING RENDERED INACCURATE OR LOSSES SUSTAINED BY YOU OR THIRD
PARTIES OR A FAILURE OF THE PROGRAM TO OPERATE WITH ANY OTHER PROGRAMS),
EVEN IF SUCH HOLDER OR OTHER PARTY HAS BEEN ADVISED OF THE POSSIBILITY OF
SUCH DAMAGES.

  17. Interpretation of Sections 15 and 16.

  If the disclaimer of warranty and limitation of liability provided
above cannot be given local legal effect according to their terms,
reviewing courts shall apply local law that most closely approximates
an absolute waiver of all civil liability in connection with the
Program, unless a warranty or assumption of liability accompanies a
copy of the Program in return for a fee.

                     END OF TERMS AND CONDITIONS

            How to Apply These Terms to Your New Programs

  If you develop a new program, and you want it to be of the greatest
possible use to the public, the best way to achieve this is to make it
free software which everyone can redistribute and change under these terms.

  To do so, attach the following notices to the program.  It is safest
to attach them to the start of each source file to most effectively
state the exclusion of warranty; and each file should have at least
the "copyright" line and a pointer to where the full notice is found.

    <one line to give the program's name and a brief idea of what it does.>
    Copyright (C) <year>  <name of author>

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see [external reference listed in repository notices].

Also add information on how to contact you by electronic and paper mail.

  If your software can interact with users remotely through a computer
network, you should also make sure that it provides a way for users to
get its source.  For example, if your program is a web application, its
interface could display a "Source" link that leads users to an archive
of the code.  There are many ways you could offer source, and different
solutions will be better for different programs; see section 13 for the
specific requirements.

  You should also get your employer (if you work as a programmer) or school,
if any, to sign a "copyright disclaimer" for the program, if necessary.
For more information on this, and how to apply and follow the GNU AGPL, see
[external reference listed in repository notices].
\`\`\`

</details>

## Fonts

No font files are distributed. Folkkit distributes no font files. Its CSS uses system font stacks supplied by the user's operating system and browser.
`;function I0(){const{locale:n}=et(),r=(n==="en"?ir:or).licenses;return p.jsx(rr,{content:r,children:p.jsxs("section",{className:"legal-page__notices","aria-labelledby":"third-party-notices",children:[p.jsx("h2",{id:"third-party-notices",children:r.noticesTitle}),p.jsx("p",{children:r.noticesIntro}),p.jsx("pre",{tabIndex:"0",children:N0})]})})}function L0({content:n}){return im(ka)?p.jsxs("address",{children:[p.jsx("strong",{children:ka.name}),p.jsx("a",{href:`mailto:${ka.email}`,children:ka.email})]}):p.jsx("p",{className:"legal-page__gate",children:n.operatorMissing})}function k0(){const{locale:n}=et(),r=(n==="en"?ir:or).privacy;return p.jsx(rr,{content:r,children:p.jsxs("section",{className:"legal-page__operator","aria-labelledby":"privacy-operator",children:[p.jsx("h2",{id:"privacy-operator",children:r.operatorTitle}),p.jsx(L0,{content:r})]})})}function C0(){const{locale:n}=et(),r=(n==="en"?ir:or).source;return p.jsx(rr,{content:r,children:p.jsxs("section",{className:"legal-page__revision","aria-labelledby":"source-revision",children:[p.jsx("h2",{id:"source-revision",children:r.revisionLabel}),p.jsx("code",{children:bu.commit}),p.jsx("a",{href:bu.sourceUrl,children:r.revisionLink}),p.jsx("p",{children:r.availabilityNote})]})})}function D0(){const{locale:n}=et(),r=(n==="en"?ir:or).terms;return p.jsx(rr,{content:r})}const H0="modulepreload",j0=function(n){return"/"+n},kh={},Xt=function(r,s,c){let d=Promise.resolve();if(s&&s.length>0){let h=function(b){return Promise.all(b.map(L=>Promise.resolve(L).then(z=>({status:"fulfilled",value:z}),z=>({status:"rejected",reason:z}))))};document.getElementsByTagName("link");const y=document.querySelector("meta[property=csp-nonce]"),g=y?.nonce||y?.getAttribute("nonce");d=h(s.map(b=>{if(b=j0(b),b in kh)return;kh[b]=!0;const L=b.endsWith(".css"),z=L?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${b}"]${z}`))return;const w=document.createElement("link");if(w.rel=L?"stylesheet":H0,L||(w.as="script"),w.crossOrigin="",w.href=b,g&&w.setAttribute("nonce",g),document.head.appendChild(w),L)return new Promise((I,j)=>{w.addEventListener("load",I),w.addEventListener("error",()=>j(Error(`Unable to preload CSS for ${b}`)))})}))}function f(h){const y=new Event("vite:preloadError",{cancelable:!0});if(y.payload=h,window.dispatchEvent(y),!y.defaultPrevented)throw h}return d.then(h=>{for(const y of h||[])y.status==="rejected"&&f(y.reason);return r().catch(f)})},M0=new Map([["text",()=>Xt(()=>import("./text-CfDG7drI.js"),[])],["qr",()=>Xt(()=>import("./qr-CbYtd9Ss.js"),[])],["image",()=>Xt(()=>import("./image-DOMKGsij.js"),[])],["hash",()=>Xt(()=>import("./hash-D3mAx1Cf.js"),[])],["crypto",()=>Xt(()=>import("./crypto-CHdSJc2r.js"),[])],["data",()=>Xt(()=>import("./data-CIQpavSw.js"),[])],["web",()=>Xt(()=>import("./web-DgbzOi_X.js"),[])],["number",()=>Xt(()=>import("./number-B7sqgtvZ.js"),[])],["color",()=>Xt(()=>import("./color-BvBhy5b_.js"),[])],["utility",()=>Xt(()=>import("./utility-DDF0wWP2.js"),[])],["imageFormat",()=>Xt(()=>import("./imageFormat-4vfeJw6f.js"),[])],["media",()=>Xt(()=>import("./media-DEE-FesG.js"),[])],["pdf",()=>Xt(()=>import("./pdf-Yf3fw-AF.js"),[])]]);function z0(n,r){switch(n){case"text":return r.textConverters;case"qr":return r.qrConverters;case"image":return r.imageConverters;case"hash":return r.hashConverters;case"crypto":return r.cryptoConverters;case"data":return r.dataConverters;case"web":return r.webConverters;case"number":return r.numberConverters;case"color":return r.colorConverters;case"utility":return r.utilityConverters;case"imageFormat":return r.imageFormatConverters;case"media":return r.mediaConverters;case"pdf":return r.pdfConverters;default:return null}}function U0(n,r,s){const c={...n};return typeof n.convert=="function"&&(c.convert=async(...d)=>{const f=await n.convert(...d);return typeof f=="string"?{kind:"text",text:f}:f}),r==="media"&&(c.onRuntimeStatus=s.onFFmpegLoad),c}function $0(n=M0){return async function(s){if(typeof s!="string")return null;const c=$l.find(g=>g.id===s&&g.tier!=="hidden");if(!c)return null;const d=n.get(c.module);if(!d)throw new Error(`Missing converter module loader: ${c.module}`);const f=await d(),y=z0(c.module,f)?.find(g=>g.id===c.id);if(!y)throw new Error(`Missing released converter implementation: ${c.id}`);return U0(y,c.module,f)}}const G0=$0();function B0(n,r){const s=n.toLowerCase(),c=r.toLowerCase();if(c.includes(s))return 100+s.length/c.length*50;let d=0,f=0,h=0,y=-2;for(let g=0;g<c.length&&d<s.length;g++)c[g]===s[d]&&(d++,g===y+1?(h++,f+=h*2):h=0,(g===0||c[g-1]===" "||c[g-1]==="-"||c[g-1]==="_")&&(f+=5),f+=1,y=g);return d<s.length?0:f}function iu(n,r,s){return n.trim()?r.map(d=>{const f=s(d),h=Math.max(...f.map(y=>B0(n,y)));return{item:d,score:h}}).filter(d=>d.score>0).sort((d,f)=>f.score-d.score).map(d=>d.item):r}const _0=5;function rm(){try{const n=JSON.parse(localStorage.getItem(Gt.recentTools));return Array.isArray(n)?n.filter(r=>typeof r=="string"):[]}catch{return[]}}function Ch(n){const r=rm().filter(s=>s!==n);r.unshift(n),localStorage.setItem(Gt.recentTools,JSON.stringify(r.slice(0,_0)))}const P0=["text","encode","data","number","hash","color","units","image","media","document","utility"],lm={text:["Case","Markup"],encode:["Text"],data:["Data","Time"],number:["Number"],hash:["Hash"],color:["Color"],units:["Length","Weight","Speed","Area","Volume","Duration","Energy","Pressure","Angle","Frequency","Power","Temperature","Distance","Cooking","Force","Illuminance","Fuel Economy","Data Rate","Data Size","Torque","Acceleration","Capacitance","Electric","Resistance","Voltage","Density","Typography"],image:[],media:[],document:[],utility:[]},Nu={text:["text"],encode:["encode"],data:["data"],number:["number"],hash:["hash"],color:["color"],units:[],image:["image"],media:["media"],document:["document"],utility:["utility","web"]},sm={};for(const[n,r]of Object.entries(lm))for(const s of r)sm[s]=n;const cm={};for(const[n,r]of Object.entries(Nu))for(const s of r)cm[s]=n;const Y0=Object.values(Nu).flat();function W0(n,r){const s=r.find(c=>c.id===n);return s&&sm[s.group]||"text"}function q0(n){return cm[n.category]||"utility"}function V0(n,r,s,c,d){if(n==="to")return"text";if(s){const f=d.find(h=>h.id===s);if(f)return q0(f)}return r?W0(r,c):"text"}function ru(n,r){return n<0?n:r===0?-1:n>=r?r-1:n}function Dh({tool:n}){return n.tier!=="experimental"?null:p.jsx("span",{className:"tool-picker-tool-tier","aria-label":n.tierLabel,children:n.tierLabel})}function K0({open:n,onClose:r,onSelectFormat:s,onSelectConverter:c,mode:d,align:f="left",availableFormatIds:h,currentFormatValue:y,currentConverterValue:g,releasedFormats:b=[],releasedTools:L=[],categories:z=[]}){const{t:w}=et(),[I,j]=A.useState(""),[C,O]=A.useState(()=>V0(d,y,g,b,L)),[q,te]=A.useState(-1),B=A.useRef(null),ne=A.useRef(null),ce=A.useRef(null),fe=A.useRef(null),ae=A.useRef(document.activeElement),Ae=A.useId();A.useEffect(()=>()=>{const $=ae.current;requestAnimationFrame(()=>{$?.isConnected&&$.focus()})},[]),A.useEffect(()=>{ne.current&&(ne.current.scrollTop=0),requestAnimationFrame(()=>{B.current?.focus(),fe.current&&fe.current.querySelector(".tool-picker-tab.active")?.scrollIntoView?.({block:"nearest",inline:"center"})})},[]),A.useEffect(()=>{ne.current&&(ne.current.scrollTop=0)},[C]);const Ne=A.useMemo(()=>n?h?b.filter($=>h.includes($.id)):b:[],[n,h,b]),{tabGrouped:Pe,tabFlatFormats:Fe,tabFormatIndexMap:tt}=A.useMemo(()=>{if(!n||d==="to")return{tabGrouped:{},tabFlatFormats:[],tabFormatIndexMap:new Map};const $=lm[C]||[];if($.length===0)return{tabGrouped:{},tabFlatFormats:[],tabFormatIndexMap:new Map};const oe=new Set($),Q=Ne.filter(Re=>oe.has(Re.group)),De={};for(const Re of Q)De[Re.group]||(De[Re.group]=[]),De[Re.group].push(Re);const ge=Object.values(De).flat(),Ie=new Map(ge.map((Re,Lt)=>[Re,Lt]));return{tabGrouped:De,tabFlatFormats:ge,tabFormatIndexMap:Ie}},[n,d,C,Ne]),de=A.useMemo(()=>{if(!n||d==="to")return[];const $=Nu[C]||[];return $.length===0?[]:L.filter(oe=>$.includes(oe.category))},[n,d,C,L]),pt=A.useMemo(()=>!n||d!=="to"?[]:h?b.filter($=>h.includes($.id)):b,[n,d,h,b]),{toGrouped:Ue,toFlatFormats:D,toFormatIndexMap:P}=A.useMemo(()=>{if(!n||d!=="to")return{toGrouped:{},toFlatFormats:[],toFormatIndexMap:new Map};const $=I.trim(),oe=$?iu($,pt,je=>[je.name,je.id,je.group]):pt,Q=rm().filter(je=>oe.some(Qt=>Qt.id===je)),De=Q.map(je=>oe.find(Qt=>Qt.id===je)).filter(Boolean),ge=new Set(Q),Ie={};for(const je of oe)ge.has(je.id)||(Ie[je.group]||(Ie[je.group]=[]),Ie[je.group].push(je));const Re=De.length?{Recent:De,...Ie}:Ie,Lt=Object.values(Re).flat(),dn=new Map(Lt.map((je,Qt)=>[je,Qt]));return{toGrouped:Re,toFlatFormats:Lt,toFormatIndexMap:dn}},[n,d,pt,I]),{searchFormats:ee,searchTools:be}=A.useMemo(()=>{if(!n||d==="to")return{searchFormats:[],searchTools:[]};const $=I.trim();if(!$)return{searchFormats:[],searchTools:[]};const oe=iu($,Ne,ge=>[ge.name,ge.id,ge.group]),Q=L.filter(ge=>Y0.includes(ge.category)),De=iu($,Q,ge=>[ge.name,ge.description,ge.id,ge.categoryName||"",ge.category||""]);return{searchFormats:oe,searchTools:De}},[n,d,I,Ne,L]),he=I.trim().length>0,T=A.useMemo(()=>{if(!n)return[];if(d==="to")return D.map(Q=>({type:"format",item:Q}));if(he){const Q=ee.map(ge=>({type:"format",item:ge})),De=be.map(ge=>({type:"converter",item:ge}));return[...Q,...De]}const $=Fe.map(Q=>({type:"format",item:Q})),oe=de.map(Q=>({type:"converter",item:Q}));return[...$,...oe]},[n,d,he,D,ee,be,Fe,de]),x=ru(q,T.length),_=x>=0?T[x]:null,W=($,oe)=>`${Ae}-${$}-${oe}`,V=_?W(_.type,_.item.id):void 0,{searchFormatIndexMap:X,searchToolIndexMap:Te}=A.useMemo(()=>{if(!he||d==="to")return{searchFormatIndexMap:new Map,searchToolIndexMap:new Map};const $=new Map,oe=new Map;for(let Q=0;Q<T.length;Q++){const De=T[Q];De.type==="format"?$.set(De.item,Q):oe.set(De.item,Q)}return{searchFormatIndexMap:$,searchToolIndexMap:oe}},[T,he,d]),Ye=A.useMemo(()=>{if(he||d==="to")return new Map;const $=Fe.length;return new Map(de.map((oe,Q)=>[oe,$+Q]))},[he,d,Fe.length,de]);A.useEffect(()=>{if(x<0||!ne.current)return;const $=ne.current.querySelectorAll("[data-picker-item]");$[x]&&$[x].scrollIntoView?.({block:"nearest"})},[x]);const Ce=A.useCallback($=>{Ch($),s($),r()},[s,r]),Ft=A.useCallback($=>{Ch($.id),c($),r()},[c,r]),un=A.useCallback($=>{const oe=T[$];oe&&(oe.type==="format"?Ce(oe.item.id):Ft(oe.item))},[T,Ce,Ft]),Xe=$=>{$.key==="ArrowDown"?($.preventDefault(),te(oe=>{if(T.length===0)return-1;const Q=ru(oe,T.length);return Math.min(Q+1,T.length-1)})):$.key==="ArrowUp"?($.preventDefault(),te(oe=>{if(T.length===0)return-1;const Q=ru(oe,T.length);return Math.max(Q-1,0)})):$.key==="Enter"||$.key==="Tab"?x>=0&&T[x]?($.preventDefault(),un(x)):T.length===1&&($.preventDefault(),un(0)):$.key==="Escape"&&($.preventDefault(),$.stopPropagation(),r())};if(A.useEffect(()=>{if(!n)return;const $=oe=>{oe.key==="Escape"&&(oe.preventDefault(),oe.stopPropagation(),r())};return document.addEventListener("keydown",$),()=>document.removeEventListener("keydown",$)},[n,r]),A.useEffect(()=>{if(!n)return;const $=oe=>{ce.current&&!ce.current.contains(oe.target)&&r()};return document.addEventListener("mousedown",$),()=>document.removeEventListener("mousedown",$)},[n,r]),!n)return null;const Rt=d==="to",bt=Fe.length>0,wn=de.length>0,ta=new Map(z.map($=>[$.id,$.name])),Ca=$=>w(`toolPicker.groups.${$}`),Da=w(Rt?"toolPicker.searchFormats":"toolPicker.searchConversions");return p.jsxs("div",{className:`tool-picker${f==="right"?" align-right":""}`,ref:ce,children:[p.jsxs("div",{className:"tool-picker-search",children:[p.jsxs("svg",{className:"tool-picker-search-icon",width:"15",height:"15",viewBox:"0 0 15 15",fill:"none",children:[p.jsx("circle",{cx:"6.5",cy:"6.5",r:"5",stroke:"currentColor",strokeWidth:"1.3"}),p.jsx("path",{d:"M10.5 10.5l3 3",stroke:"currentColor",strokeWidth:"1.3",strokeLinecap:"round"})]}),p.jsx("input",{ref:B,type:"text",value:I,onChange:$=>{j($.target.value),te($.target.value.trim()?0:-1)},onKeyDown:Xe,role:"combobox","aria-label":Da,"aria-expanded":n,"aria-controls":Ae,"aria-activedescendant":V,"aria-autocomplete":"list",placeholder:w(Rt?"toolPicker.searchFormatsPlaceholder":"toolPicker.searchConversionsPlaceholder"),spellCheck:!1,autoComplete:"off"})]}),!Rt&&!he&&p.jsx("div",{className:"tool-picker-tabs",ref:fe,children:P0.map($=>p.jsx("button",{className:`tool-picker-tab${C===$?" active":""}`,onClick:()=>{O($),te(-1)},children:ta.get($)||w(`toolPicker.tabs.${$}`)},$))}),p.jsxs("div",{className:"tool-picker-list",ref:ne,role:"listbox",id:Ae,"aria-label":Da,children:[he&&!Rt&&p.jsxs(p.Fragment,{children:[ee.length>0&&p.jsxs("div",{className:"tool-picker-section",children:[p.jsx("div",{className:"tool-picker-section-label",children:w("toolPicker.formats")}),ee.map($=>{const oe=X.get($)??-1;return p.jsxs("div",{id:W("format",$.id),role:"option","aria-selected":$.id===y,"data-picker-item":!0,className:`tool-picker-format-item${$.id===y?" selected":""}${oe===x?" highlighted":""}`,onMouseDown:Q=>{Q.preventDefault(),Ce($.id)},onMouseEnter:()=>te(oe),children:[p.jsx("span",{className:"tool-picker-format-name",children:$.name}),p.jsx("span",{className:"tool-picker-format-group",children:Ca($.group)})]},`f-${$.id}`)})]}),be.length>0&&p.jsxs("div",{className:"tool-picker-section",children:[p.jsx("div",{className:"tool-picker-section-label",children:w("toolPicker.tools")}),be.map($=>{const oe=Te.get($)??-1;return p.jsxs("div",{id:W("converter",$.id),role:"option","aria-selected":$.id===g,"data-picker-item":!0,className:`tool-picker-tool-item${$.id===g?" selected":""}${oe===x?" highlighted":""}`,onMouseDown:Q=>{Q.preventDefault(),Ft($)},onMouseEnter:()=>te(oe),children:[p.jsx("span",{className:"tool-picker-tool-name",children:$.name}),p.jsx("span",{className:"tool-picker-tool-cat",children:$.categoryName||$.category}),p.jsx(Dh,{tool:$})]},`c-${$.id}`)})]}),ee.length===0&&be.length===0&&p.jsx("div",{className:"tool-picker-empty",children:w("toolPicker.noResults")})]}),Rt&&p.jsxs(p.Fragment,{children:[Object.entries(Ue).map(([$,oe])=>p.jsxs("div",{className:"tool-picker-section",children:[p.jsx("div",{className:"tool-picker-section-label",children:Ca($)}),oe.map(Q=>{const De=P.get(Q)??-1;return p.jsxs("div",{id:W("format",Q.id),role:"option","aria-selected":Q.id===y,"data-picker-item":!0,className:`tool-picker-format-item${Q.id===y?" selected":""}${De===x?" highlighted":""}`,onMouseDown:ge=>{ge.preventDefault(),Ce(Q.id)},onMouseEnter:()=>te(De),children:[p.jsx("span",{className:"tool-picker-format-name",children:Q.name}),Q.id===y&&p.jsx("svg",{width:"12",height:"12",viewBox:"0 0 12 12",fill:"none",children:p.jsx("path",{d:"M2.5 6l2.5 2.5 4.5-5",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})})]},Q.id)})]},$)),D.length===0&&p.jsx("div",{className:"tool-picker-empty",children:w("toolPicker.noFormats")})]}),!he&&!Rt&&p.jsxs(p.Fragment,{children:[bt&&Object.entries(Pe).map(([$,oe])=>p.jsxs("div",{className:"tool-picker-section",children:[p.jsx("div",{className:"tool-picker-section-label",children:Ca($)}),oe.map(Q=>{const De=tt.get(Q)??-1;return p.jsxs("div",{id:W("format",Q.id),role:"option","aria-selected":Q.id===y,"data-picker-item":!0,className:`tool-picker-format-item${Q.id===y?" selected":""}${De===x?" highlighted":""}`,onMouseDown:ge=>{ge.preventDefault(),Ce(Q.id)},onMouseEnter:()=>te(De),children:[p.jsx("span",{className:"tool-picker-format-name",children:Q.name}),Q.id===y&&p.jsx("svg",{width:"12",height:"12",viewBox:"0 0 12 12",fill:"none",children:p.jsx("path",{d:"M2.5 6l2.5 2.5 4.5-5",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})})]},Q.id)})]},$)),bt&&wn&&p.jsx("div",{className:"tool-picker-section",children:p.jsx("div",{className:"tool-picker-section-label",children:w("toolPicker.tools")})}),wn&&p.jsx("div",{className:"tool-picker-tool-grid",children:de.map($=>{const oe=Ye.get($)??-1;return p.jsxs("div",{id:W("converter",$.id),role:"option","aria-selected":$.id===g,"data-picker-item":!0,className:`tool-picker-tool-card${$.id===g?" selected":""}${oe===x?" highlighted":""}`,"data-category":$.category,onMouseDown:Q=>{Q.preventDefault(),Ft($)},onMouseEnter:()=>te(oe),children:[p.jsx("span",{className:"tool-picker-tool-card-name",children:$.name}),p.jsx("span",{className:"tool-picker-tool-card-desc",children:$.description}),p.jsx(Dh,{tool:$})]},$.id)})}),!bt&&!wn&&p.jsx("div",{className:"tool-picker-empty",children:w("toolPicker.noItems")})]})]})]})}function Hh(n){const{open:r,mode:s,currentFormatValue:c,currentConverterValue:d}=n;return r?p.jsx(K0,{...n},`${s}|${c||""}|${d||""}`):null}const um=A.createContext(null);function dm(){return A.useContext(um)}const Ln=Object.freeze({compatible:"compatible",incompatibleImplemented:"incompatible-but-implemented",unsupported:"unsupported"});function X0(n,{implementationExists:r=!1,evidenceExists:s=!1}={}){const c=n&&typeof n.from=="string"&&typeof n.to=="string"?`${n.from}→${n.to}`:null;return!c||!r||!s?{status:Ln.unsupported,pairKey:c}:n.compatibility===Ln.compatible?{status:Ln.compatible,pairKey:c}:n.compatibility===Ln.incompatibleImplemented?{status:Ln.incompatibleImplemented,pairKey:c}:{status:Ln.unsupported,pairKey:c}}function Z0(n,r){const s=xu.find(c=>c.from===n&&c.to===r)||null;return X0(s,{implementationExists:typeof s?.implementationEvidenceId=="string"&&s.implementationEvidenceId.length>0,evidenceExists:typeof s?.evidenceId=="string"&&s.evidenceId.length>0})}function Q0(n,r){return n?.status===Ln.compatible?!0:n?.status===Ln.incompatibleImplemented&&typeof n.pairKey=="string"&&r===n.pairKey}const fm=30,jh=120,J0="convert-everything-history",Eu="folkkit:history-change";function kl(){window.dispatchEvent(new Event(Eu))}function vu(){h0(),localStorage.removeItem(J0)}function qo(){return f0()?!0:(vu(),gu(!1),!1)}function pm(n){return!n||typeof n.from!="string"||typeof n.to!="string"||typeof n.input!="string"||typeof n.output!="string"||!Number.isFinite(n.timestamp)||!Sn(n.from,n.to)?null:{from:n.from,to:n.to,input:n.input.slice(0,jh),output:n.output.slice(0,jh),timestamp:n.timestamp}}function lu(){const n=p0().map(pm).filter(Boolean).slice(0,fm),r=localStorage.getItem(Gt.contentHistory),s=JSON.stringify(n);return r!==null&&r!==s&&yu(n),n}const Vo=Object.freeze({isEnabled(){return qo()},setEnabled(n){const r=qo();(n!==!0||!r)&&vu(),gu(n),kl()},list(){return qo()?lu().map(n=>({...n})):[]},append(n){if(!qo())return;const r=pm(n);r&&(yu([r,...lu()].slice(0,fm)),kl())},remove(n){if(!qo()||!Number.isInteger(n)||n<0)return;const r=lu();n>=r.length||(r.splice(n,1),yu(r),kl())},clear({revokeConsent:n=!1}={}){vu(),n&&gu(!1),kl()}});typeof localStorage<"u"&&qo();function eb(n=URL){const r=new Set;return Object.freeze({create(s){const c=n.createObjectURL(s);return r.add(c),c},revoke(s){r.delete(s)&&n.revokeObjectURL(s)},revokeAll(){for(const s of r)n.revokeObjectURL(s);r.clear()}})}const hm=16*1024*1024,tb=500,Mh=4,Ou=5e3,Mb=2048,zh=64*1024,Cl=Object.freeze({maxRows:5e3,maxColumns:100,maxCells:2e5}),su=Object.freeze({maxLogicalLines:5e3,maxCharactersPerLogicalLine:1e4,maxEstimatedPages:200}),zb=Object.freeze({maxPages:1e3,maxElapsedMs:3e4}),Ub=Object.freeze({maxDurationSeconds:7200,maxElapsedMs:12e4,maxOutputBytes:64*1024*1024}),Uh=Object.freeze({lowMemory:Object.freeze({maxWidth:8192,maxHeight:8192,maxPixels:24e6,maxAggregatePixels:6e7}),standard:Object.freeze({maxWidth:16384,maxHeight:16384,maxPixels:64e6,maxAggregatePixels:18e7})});function cn(){const n=new Error("resource_limit");return n.code="resource_limit",n}function $h(n,r=hm){if((n?.kind==="text"?new TextEncoder().encode(String(n.text||"")).byteLength:n?.blob instanceof Blob?n.blob.size:0)>r)throw cn();return n}function $b(n,r){const s=String(n).trim();let c=1,d=1,f=1,h=0,y=0,g=!1,b=!0;for(let C=0;C<s.length;C+=1){const O=s[C];if(O===`
`||O==="\r"){if(O==="\r"&&s[C+1]===`
`&&(C+=1),d=Math.max(d,f),c+=1,c>Cl.maxRows)throw cn();f=1,g=!1,b=!1;continue}if(O==='"'){g&&s[C+1]==='"'?(h+=1,b&&(y+=1),C+=1):g=!g;continue}if(!g&&O===","){if(f+=1,f>Cl.maxColumns)throw cn();continue}h+=1,b&&(y+=1)}if(d=Math.max(d,f),c*d>Cl.maxCells)throw cn();const z=Math.max(0,c-1);if(2+h*6+z*(y*6+d*8+4)>hm)throw cn();const I=s.split(/\r?\n/),j=[];for(const C of I){const O=r(C);if(O.length>Cl.maxColumns)throw cn();j.push(O)}return j}function nb(n,r=Ou){if(!n)return{count:0,overflow:!1};let s=1;for(let c=0;c<n.length;c+=1)if(n.charCodeAt(c)===10&&(s+=1,s>r))return{count:r+1,overflow:!0};return{count:s,overflow:!1}}function ab(n=globalThis){const r=Number(n?.deviceMemory??n?.navigator?.deviceMemory),s=Number(n?.viewportWidth??n?.innerWidth??n?.document?.documentElement?.clientWidth);return Number.isFinite(r)&&r<=4||Number.isFinite(s)&&s<768?Uh.lowMemory:Uh.standard}function Gb(n){const r=String(n).split(`
`);if(r.length>su.maxLogicalLines)throw cn();let s=0;for(const c of r){if(c.length>su.maxCharactersPerLogicalLine)throw cn();s+=Math.max(1,Math.ceil(c.length/90))}if(Math.ceil(s/50)>su.maxEstimatedPages)throw cn();return r}function Gh(n){const r=n instanceof Uint8Array?n:new Uint8Array(n||0);if(r.length>=24&&[137,80,78,71,13,10,26,10].every((c,d)=>r[d]===c)){const c=new DataView(r.buffer,r.byteOffset,r.byteLength);return{kind:"png",width:c.getUint32(16),height:c.getUint32(20)}}if(r.length<4||r[0]!==255||r[1]!==216)return null;let s=2;for(;s+8<r.length;){if(r[s]!==255){s+=1;continue}const c=r[s+1];if(c===216||c===217){s+=2;continue}const d=r[s+2]<<8|r[s+3];if(d<2||s+2+d>r.length)return null;if([192,193,194,195,197,198,199,201,202,203,205,206,207].includes(c))return{kind:"jpeg",height:r[s+5]<<8|r[s+6],width:r[s+7]<<8|r[s+8]};s+=2+d}return null}function Bh(n,r){if(!n||!Number.isInteger(n.width)||!Number.isInteger(n.height))throw cn();const s=n.width*n.height;if(n.width<1||n.height<1||n.width>r.maxWidth||n.height>r.maxHeight||s>r.maxPixels)throw cn();return s}function Bb(n,r=n?.byteLength){const s=n instanceof Uint8Array?n:new Uint8Array(n||0),c=Number(r);if(s.length<12||!Number.isSafeInteger(c)||c<12)return null;const d=(L,z)=>String.fromCharCode(...s.slice(L,L+z));if(d(0,4)!=="RIFF"||d(8,4)!=="WAVE")return null;const f=new DataView(s.buffer,s.byteOffset,s.byteLength),h=f.getUint32(4,!0)+8;if(h<12||h>c)return null;let y=null,g=null,b=12;for(;b+8<=s.byteLength&&b+8<=h;){const L=d(b,4),z=f.getUint32(b+4,!0),w=b+8,I=w+z;if(!Number.isSafeInteger(I)||I>c||I>h)return null;if(L==="fmt "){if(z<16||w+16>s.byteLength)return null;const C=f.getUint16(w,!0),O=f.getUint16(w+2,!0),q=f.getUint32(w+4,!0),te=f.getUint32(w+8,!0),B=f.getUint16(w+12,!0),ne=f.getUint16(w+14,!0),ce=C===1?[8,16,24,32]:C===3?[32,64]:[],fe=O*ne/8,ae=q*fe;if(O<1||O>8||q<8e3||q>384e3||!ce.includes(ne)||!Number.isInteger(fe)||fe<1||B!==fe||!Number.isSafeInteger(ae)||ae>4294967295||te!==ae)return null;y=ae}else if(L==="data"){if(z<1)return null;g=z}if(y!==null&&g!==null){const C=g/y;return Number.isFinite(C)&&C>0?C:null}const j=I+z%2;if(j<=b||j>s.byteLength)return null;b=j}return null}const Su=Object.freeze({unsupported_type:"errors.unsupportedType",unsupported_pair:"errors.unsupportedPair",unsupported_browser:"errors.unsupportedBrowser",too_large:"errors.tooLarge",invalid_file:"errors.invalidFile",out_of_memory:"errors.outOfMemory",cancelled:"errors.cancelled",conversion_failed:"errors.conversionFailed",media_runtime_unavailable:"errors.mediaRuntimeUnavailable",resource_limit:"errors.resourceLimit"});class Ml extends Error{constructor(r){super(r),this.name="ToolRuntimeError",this.code=r,this.messageKey=Su[r]||Su.conversion_failed}}function yt(n){return new Ml(n)}function ob(n){const r=Number(n);if(!Number.isFinite(r))return null;const s=r>=0&&r<=1?r*100:r;return Math.round(Math.min(100,Math.max(0,s)))}function mm(n){return n?.limits===Zt.pdf||String(n?.acceptTypes||"").toLowerCase().includes("pdf")}function ib(n){return n?.limits===Zt.images||String(n?.acceptTypes||"").toLowerCase().includes("image/")}async function cu(n,r){const s=n.slice(0,r);return typeof s.arrayBuffer=="function"?new Uint8Array(await s.arrayBuffer()):new Promise((c,d)=>{const f=new FileReader;f.onerror=()=>d(yt("invalid_file")),f.onload=()=>c(new Uint8Array(f.result)),f.readAsArrayBuffer(s)})}async function rb(n,r,s){const c=ab(s);let d=0;for(const f of r){if(mm(n)){const g=await cu(f,5);if(String.fromCharCode(...g)!=="%PDF-")throw yt("invalid_file");continue}if(!ib(n))continue;const h=String(f.type||"").toLowerCase(),y=String(f.name||"").toLowerCase();if(h==="image/png"||y.endsWith(".png")){const g=await cu(f,zh);if(![137,80,78,71,13,10,26,10].every((L,z)=>g[z]===L))throw yt("invalid_file");["images-to-pdf","png-to-jpg"].includes(n?.id)&&(d+=Bh(Gh(g),c))}else if(h==="image/jpeg"||h==="image/jpg"||y.endsWith(".jpg")||y.endsWith(".jpeg")){const g=await cu(f,zh);if(g[0]!==255||g[1]!==216||g[2]!==255)throw yt("invalid_file");["images-to-pdf","jpg-to-png"].includes(n?.id)&&(d+=Bh(Gh(g),c))}if(d>c.maxAggregatePixels)throw yt("resource_limit")}}function gm(n){if(!n||typeof n!="object")throw yt("conversion_failed");const s=Object.hasOwn(n,"info")?n.info:void 0;if(s!==void 0&&typeof s!="string")throw yt("conversion_failed");const c=s===void 0?{}:{info:s};if(n.kind==="text"&&_h(n,["kind","text","info"],["kind","text"])&&typeof n.text=="string")return $h({kind:"text",text:n.text,...c});if((n.kind==="download"||n.kind==="image")&&_h(n,["kind","blob","filename","info"],["kind","blob","filename"])&&n.blob instanceof Blob&&typeof n.filename=="string"&&n.filename.trim())return $h({kind:n.kind,blob:n.blob,filename:n.filename,...c});throw yt("conversion_failed")}function _h(n,r,s){const c=Reflect.ownKeys(n);return s.every(d=>Object.hasOwn(n,d))&&c.every(d=>typeof d=="string"&&r.includes(d))}function lb(n,r){return n instanceof Ml?n:Su[n?.code]?yt(n.code):n?.name==="AbortError"||n?.code==="cancelled"?yt("cancelled"):n instanceof RangeError||/out of memory|allocation failed|memory access/i.test(String(n?.message||""))?yt("out_of_memory"):mm(r)?yt("invalid_file"):yt("conversion_failed")}function uu(n){if(n?.aborted)throw yt("cancelled")}async function sb({tool:n,files:r=[],text:s="",signal:c,onProgress:d,environment:f=globalThis}){uu(c);const h=Array.from(r||[]),y=Xh(n,h,f);if(!y.ok)throw yt(y.code);const g=Number(n?.textLimit),b=Number.isFinite(g)&&g>0?Math.min(hu,Math.floor(g)):hu;if(new TextEncoder().encode(String(s||"")).byteLength>b)throw yt("too_large");let L=!0,z=!1;const w=()=>{if(!z){z=!0;try{n?.terminate?.()}catch{}}};let I=()=>{};const j=c?new Promise((O,q)=>{const te=()=>{L=!1,w(),q(yt("cancelled"))};c.addEventListener("abort",te,{once:!0}),I=()=>c.removeEventListener("abort",te)}):null,C=O=>{if(!L||c?.aborted)return;const q=ob(O);q!==null&&d?.(q)};try{await rb(n,h,f),uu(c);let O;if(typeof n?.fileConvert=="function"){const te=n.multipleFiles?h:h[0];O=n.hasTextInput?n.fileConvert(te,s,{signal:c,onProgress:C}):n.fileConvert(te,C,{signal:c})}else if(typeof n?.convert=="function")O=n.convert(s,{signal:c,onProgress:C});else throw yt("conversion_failed");const q=await(j?Promise.race([O,j]):O);return uu(c),gm(q)}catch(O){throw lb(O,n)}finally{L=!1,I()}}function cb({execute:n=sb,urlApi:r=URL}={}){const s=eb(r);let c=0,d=null;function f(){c+=1,d?.abort(),d=null,s.revokeAll()}async function h(g){f();const b=c,L=new AbortController;d=L;const z=g.signal,w=()=>L.abort();z?.addEventListener("abort",w,{once:!0}),z?.aborted&&L.abort();try{const I=await n({...g,signal:L.signal});if(b!==c||L.signal.aborted)return null;const j=I.kind==="download"||I.kind==="image"?s.create(I.blob):null;return{result:I,...j?{url:j}:{}}}catch(I){if(b!==c)return null;throw I}finally{z?.removeEventListener("abort",w),b===c&&(d=null)}}function y(g){const b=gm(g);f();const L=b.kind==="download"||b.kind==="image"?s.create(b.blob):null;return{result:b,...L?{url:L}:{}}}return Object.freeze({run:h,present:y,cancel:f,reset:f,dispose:f})}function ub(n){return n<1024?`${n} B`:n<1024*1024?`${(n/1024).toFixed(1)} KB`:`${(n/(1024*1024)).toFixed(1)} MB`}function db({accept:n="*",multiple:r=!1,files:s=[],disabled:c=!1,onFilesChange:d}){const{t:f}=et(),[h,y]=A.useState(!1),g=A.useRef(null),b=f(r?"workspaceTools.selectFiles":"workspaceTools.selectFile"),L=s.slice(0,8),z=Math.max(0,s.length-L.length);A.useEffect(()=>{s.length===0&&g.current&&(g.current.value="")},[s.length]);const w=j=>{if(c)return;const C=Array.from(j||[]);d?.(r?C:C.slice(0,1))},I=()=>{c||g.current?.click()};return p.jsxs("div",{className:`drop-zone${h?" dragging":""}${c?" disabled":""}`,onDrop:j=>{j.preventDefault(),y(!1),w(j.dataTransfer.files)},onDragOver:j=>{j.preventDefault(),c||y(!0)},onDragLeave:()=>y(!1),"aria-disabled":c,children:[p.jsx("input",{ref:g,type:"file",accept:n,multiple:r,disabled:c,onChange:j=>w(j.target.files),className:"workspace-file-input","aria-label":b}),s.length>0?p.jsxs("div",{className:"drop-zone-files",children:[L.map((j,C)=>p.jsxs("span",{className:"drop-zone-file",children:[p.jsx("span",{className:"drop-zone-filename",children:j.name}),p.jsx("span",{className:"drop-zone-size",children:ub(j.size)})]},`${j.name}-${j.size}-${C}`)),z>0&&p.jsx("span",{className:"drop-zone-more",children:f("workspaceTools.moreFiles",{count:z})})]}):p.jsx("span",{className:"drop-zone-hint",children:f(r?"workspaceTools.dropFiles":"workspaceTools.dropFile")}),p.jsx("button",{type:"button",className:"drop-zone-choose",disabled:c,onClick:I,children:b})]})}function fb({progress:n=0,loadingRuntime:r=!1,onCancel:s}){const{t:c}=et(),d=Math.min(100,Math.max(0,Number(n)||0)),f=r?c("workspaceTools.loadingRuntime"):c("workspaceTools.processing",{progress:`${d} %`});return p.jsxs("div",{className:"progress-status",role:"status","aria-live":"polite",children:[p.jsx("progress",{className:"progress-bar","aria-label":c("workspaceTools.progressLabel"),max:"100",value:d}),p.jsxs("div",{className:"progress-status-row",children:[p.jsx("span",{className:"progress-text",children:f}),p.jsx("button",{type:"button",className:"pill-btn-sm",onClick:s,children:c("workspaceTools.cancel")})]})]})}function pb(n){return n<1024?`${n} B`:n<1024*1024?`${(n/1024).toFixed(1)} KB`:`${(n/(1024*1024)).toFixed(1)} MB`}function Ph({record:n,onDiscard:r,onCopied:s}){const{t:c}=et(),d=n?.result;if(!d)return null;const f=async()=>{d.kind!=="text"||!d.text||(await navigator.clipboard.writeText(d.text),s?.())};return p.jsxs("div",{className:"result-actions",children:[p.jsxs("div",{className:"panel-label-row",children:[p.jsx("span",{className:"panel-label",children:c("workspaceTools.output")}),p.jsxs("div",{className:"panel-actions",children:[(d.kind==="download"||d.kind==="image")&&n.url&&p.jsx("a",{className:"pill-btn-sm",href:n.url,download:d.filename,children:c("workspaceTools.download")}),d.kind==="text"&&d.text&&p.jsx("button",{type:"button",className:"pill-btn-sm",onClick:f,children:c("workspaceTools.copy")}),p.jsx("button",{type:"button",className:"pill-btn-sm",onClick:r,children:c("workspaceTools.discard")})]})]}),(d.kind==="download"||d.kind==="image")&&p.jsxs("div",{className:"media-result",children:[p.jsx("span",{className:"media-result-name",children:d.filename}),p.jsx("span",{className:"media-result-size",children:pb(d.blob.size)})]}),d.kind==="image"&&n.url&&p.jsx("div",{className:"image-preview",children:p.jsx("img",{src:n.url,alt:c("workspaceTools.previewAlt")})}),d.kind==="text"&&p.jsx("pre",{className:"workspace-text-result",children:d.text})]})}const hb=Object.freeze({unsupported_type:"errors.unsupportedType",unsupported_pair:"errors.unsupportedPair",unsupported_browser:"errors.unsupportedBrowser",too_large:"errors.tooLarge",invalid_file:"errors.invalidFile",out_of_memory:"errors.outOfMemory",cancelled:"errors.cancelled",conversion_failed:"errors.conversionFailed",media_runtime_unavailable:"errors.mediaRuntimeUnavailable",resource_limit:"errors.resourceLimit"});function Yh({error:n,onRetry:r}){const{t:s}=et();if(!n)return null;const c=hb[n.code]||"errors.conversionFailed";return p.jsxs("div",{className:"error-msg",role:"alert",children:[p.jsx("span",{children:s(c)}),n.code==="media_runtime_unavailable"&&r&&p.jsx("button",{type:"button",onClick:r,children:s("workspaceTools.retryModule")})]})}function Wh(n){const r=n.trim();if(!r)return null;if(r.startsWith("{")&&r.endsWith("}")||r.startsWith("[")&&r.endsWith("]"))try{return JSON.parse(r),"json"}catch{}if(/^[A-Za-z0-9+/=]{8,}$/.test(r)&&r.length%4===0)try{return atob(r),"base64"}catch{}return/^([0-9a-fA-F]{2}\s)+[0-9a-fA-F]{2}$/.test(r)?"hex":/^#[0-9a-fA-F]{3,8}$/.test(r)?"color-hex":/^rgba?\(\s*\d+/.test(r)?"color-rgb":/^hsla?\(\s*\d+/.test(r)?"color-hsl":/^hsv\(\s*\d+/.test(r)?"color-hsv":/^([01]{8}\s)+[01]{8}$/.test(r)?"binary":/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(r)?"text":/^\d{10,13}$/.test(r)?"timestamp":/%[0-9a-fA-F]{2}/.test(r)&&r.includes("%")?"url":r.startsWith("<?xml")||r.startsWith("<")&&r.endsWith(">")&&r.includes("</")?"xml":/^\[[\w.]+\]/m.test(r)&&/^\w+\s*=\s*.+/m.test(r)?"toml":/^[a-zA-Z_][a-zA-Z0-9_]*:\s/m.test(r)&&!r.includes("{")?"yaml":r.includes("	")&&r.includes(`
`)&&r.split(`
`)[0].split("	").length>1?"tsv":r.includes(",")&&r.includes(`
`)&&r.split(`
`)[0].split(",").length>1?"csv":/^[a-zA-Z0-9_]+=/.test(r)&&r.includes("&")?"querystring":/^[.\-/ ]+$/.test(r)&&r.includes(".")?"morse":/^[IVXLCDM]{2,15}$/i.test(r)?"roman":/^0o[0-7]+$/i.test(r)?"numoct":/^-?\d+(\.\d+)?$/.test(r)?"decimal":/^0x[0-9a-fA-F]+$/i.test(r)?"numhex":/^0b[01]+$/i.test(r)?"numbin":/^-?\d+(\.\d+)?\s*°?[Cc]$/.test(r)?"celsius":/^-?\d+(\.\d+)?\s*°?[Ff]$/.test(r)?"fahrenheit":/^-?\d+(\.\d+)?\s*[Kk]$/.test(r)?"kelvin":/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(r)?"iso-date":/<[a-z][^>]*>/i.test(r)&&r.includes("</")?"html-markup":/^#{1,6}\s/m.test(r)||/\*\*.+\*\*/m.test(r)?"markdown":null}function qh(n){n&&(n.style.height="auto",n.style.height=Math.max(120,n.scrollHeight)+"px")}const du="convert-everything-fav-pairs",Hl=Gt.favorites;function mb(){const n=localStorage.getItem(Hl),r=localStorage.getItem(du);try{const s=JSON.parse(n??r??"[]"),d=(Array.isArray(s)?s:[]).filter(h=>{if(typeof h!="string")return!1;const[y,g,b]=h.split("→");return!b&&Sn(y,g)}),f=JSON.stringify(d);return(n!==null||r!==null)&&n!==f&&localStorage.setItem(Hl,f),localStorage.removeItem(du),d}catch{return localStorage.setItem(Hl,"[]"),localStorage.removeItem(du),[]}}function gb(n){const r=n.filter(s=>{const[c,d,f]=String(s).split("→");return!f&&Sn(c,d)});localStorage.setItem(Hl,JSON.stringify(r))}function yb({from:n,to:r,onFromChange:s,onToChange:c,onPairChange:d,activeConverter:f,onConverterChange:h,initialInput:y="",reuseRequestId:g,onReuseConsumed:b,releasedFormats:L=Fu,releasedTools:z=[],categories:w=[],resolveConvertFn:I=Fh,resolvePairPolicy:j=Z0}){const{locale:C,t:O}=et(),[q,te]=A.useState(y),[B,ne]=A.useState(""),[ce,fe]=A.useState(!1),[ae,Ae]=A.useState(!0),[Ne,Pe]=A.useState(!1),[Fe,tt]=A.useState(null),[de,pt]=A.useState(mb),Ue=dm(),D=A.useRef(null),P=A.useRef(null),ee=A.useRef(null),be=A.useRef(null),he=A.useRef(null),[T,x]=A.useState(!1),[_,W]=A.useState(!1),[V,X]=A.useState(null),[Te,Ye]=A.useState(!1),[Ce,Ft]=A.useState(0),[un,Xe]=A.useState(null),[Rt,bt]=A.useState([]),[wn,ta]=A.useState(""),[Ca,Da]=A.useState(null),$=A.useRef(null),oe=A.useRef(null),Q=A.useRef(0),De=A.useRef(0),ge=A.useRef(0),Ie=A.useRef(f?.id||null),Re=A.useRef(null);Re.current==null&&(Re.current=cb());const Lt=A.useRef(null),dn=A.useRef(null),je=A.useCallback((k,Y)=>{if(d){d(k,Y);return}s(k),c(Y)},[s,d,c]),Qt=A.useCallback(k=>{const Y=In(k),K=Y.includes(r)?r:Y[0];K&&je(k,K)},[je,r]),Ha=A.useCallback(k=>je(n,k),[n,je]),lr=In(n),oo=A.useMemo(()=>j(n,r),[n,r,j]),ct=`${n}→${r}`,[Nt,xn]=A.useState(ct);Nt!==ct&&(xn(ct),tt(null));const Tt=Fe===ct?Fe:null,le=!!f,na=le&&!!f.isGenerator,io=le&&!!f.acceptsFile,fn=le&&!!f.isMediaConverter,aa=le&&!!f.hasTextInput,ro=le&&!!f.multipleFiles,pn=le&&!io&&!na;A.useEffect(()=>{if(g==null)return;let k=!1;return Promise.resolve().then(()=>{k||(D.current?.focus(),b?.(g))}),()=>{k=!0}},[g,b]),A.useEffect(()=>{Ie.current=f?.id||null,De.current+=1,ge.current+=1},[f]),A.useEffect(()=>{Q.current+=1},[le]),A.useEffect(()=>()=>{Lt.current&&clearTimeout(Lt.current),dn.current&&clearTimeout(dn.current),Re.current?.dispose()},[]),A.useEffect(()=>{if(le)return;let k=!1;return Promise.resolve().then(()=>{if(k)return;const Y=In(n);!Y.includes(r)&&Y.length>0&&Ha(Y[0]),D.current?.focus()}),()=>{k=!0}},[n,r,le,Ha]);const ja=A.useCallback(async()=>{const k=++Q.current;if(le)return;if(!q.trim()){Re.current.cancel(),k===Q.current&&(ne(""),Xe(null),X(null));return}if(!Sn(n,r)||oo.status===Ln.unsupported){Re.current.cancel(),k===Q.current&&(ne(""),X(null),Xe(new Ml("unsupported_pair")));return}if(!Q0(oo,Tt)){Re.current.cancel(),k===Q.current&&(ne(""),X(null),Xe(null));return}const Y=I(n,r);if(!Y){Re.current.cancel(),k===Q.current&&(ne(""),Xe(null));return}Xe(null);try{const K={textLimit:e0(n,r),convert:async(ye,Ze)=>{if(!ce)return{kind:"text",text:String(await Y(ye,Ze))};const We=ye.split(`
`);if(We.length>tb)throw cn();const Dt=[];for(let ht=0;ht<We.length;ht+=Mh){const ho=We.slice(ht,ht+Mh);Dt.push(...await Promise.all(ho.map(async bn=>bn.trim()?Y(bn,Ze):"")))}return{kind:"text",text:Dt.join(`
`)}}},se=await Re.current.run({tool:K,text:q});if(k!==Q.current||le||!se||se.result.kind!=="text")return;ne(se.result.text),se.result.text&&Vo.append({from:n,to:r,input:q,output:se.result.text,timestamp:Date.now()})}catch(K){k===Q.current&&!le&&(ne(""),Xe(K))}},[q,n,r,ce,le,I,oo,Tt]);A.useEffect(()=>{if(le)return;let k=!1;return Promise.resolve().then(()=>{k||ja()}),()=>{k=!0}},[ja,le]);const hn=A.useCallback(async k=>{if(!f)return;const Y=f,K=Y.id,se=++De.current;if(!k&&!na){Re.current.cancel(),se===De.current&&Ie.current===K&&(ne(""),X(null),Xe(null));return}Xe(null);try{const ye=await Re.current.run({tool:Y,text:k});if(se!==De.current||Ie.current!==K||!ye)return;ye.result.kind==="text"?(ne(ye.result.text),X(null)):(ne(""),X(ye))}catch(ye){se===De.current&&Ie.current===K&&(ne(""),Xe(ye))}},[f,na]);A.useEffect(()=>{if(!pn||fn)return;let k=!1;return Promise.resolve().then(()=>{k||hn(q)}),()=>{k=!0}},[q,hn,pn,fn]),A.useEffect(()=>{if(!na)return;let k=!1;return Promise.resolve().then(()=>{k||hn("")}),()=>{k=!0}},[na,hn]),A.useEffect(()=>{if(!(!fn||!f.onRuntimeStatus))return f.onRuntimeStatus(k=>{Da(k==="ready"?null:k)})},[f,fn]),A.useEffect(()=>{le?qh($.current):D.current&&(D.current.style.height="auto",D.current.style.height=Math.max(120,D.current.scrollHeight)+"px")},[q,le]),A.useEffect(()=>{le?qh(oe.current):P.current&&(P.current.style.height="auto",P.current.style.height=Math.max(120,P.current.scrollHeight)+"px")},[B,le]);const[Gl,ei]=A.useState(!1),Ma=A.useCallback(()=>{!Sn(r,n)||!Fh(r,n)||(je(r,n),te(B),ei(!0),Lt.current&&clearTimeout(Lt.current),Lt.current=setTimeout(()=>{ei(!1),Lt.current=null},300))},[n,r,B,je]),Dn=async()=>{const k=B||(V?.result?.kind==="text"?V.result.text:"");k&&(await navigator.clipboard.writeText(k),Ue(O("workspaceTools.copiedToClipboard")))},za=A.useCallback(()=>{Re.current.reset(),De.current+=1,ge.current+=1,te(""),ne(""),X(null),Xe(null),bt([]),ta(""),Ft(0),Ye(!1),(le?$:D).current?.focus()},[le]),lo=A.useCallback(()=>{(le?oe:P).current?.select()},[le]);A.useEffect(()=>{const k=Y=>{const K=Y.metaKey||Y.ctrlKey;if(K&&Y.shiftKey&&(Y.key==="c"||Y.key==="C")&&B&&B!=="(conversion error)"&&(Y.preventDefault(),navigator.clipboard.writeText(B).then(()=>Ue(O("workspaceTools.copiedOutput")))),K&&Y.key==="b"&&!Y.shiftKey&&!le&&(Y.preventDefault(),fe(se=>!se)),K&&Y.shiftKey&&(Y.key==="s"||Y.key==="S")&&!le&&(Y.preventDefault(),Ma()),K&&Y.shiftKey&&(Y.key==="x"||Y.key==="X")&&(Y.preventDefault(),za()),K&&Y.key==="l"&&!Y.shiftKey){Y.preventDefault();const se=le?$:D;se.current?.focus(),se.current?.select()}};return document.addEventListener("keydown",k),()=>document.removeEventListener("keydown",k)},[B,Ue,Ma,le,za,O]);const Ua=!le&&Sn(r,n),sr=()=>{if(le&&V?.url){const K=document.createElement("a");K.href=V.url,K.download=V.result?.filename||"output",K.click();return}if(!B)return;const k=Re.current.present({kind:"download",blob:new Blob([B],{type:"text/plain"}),filename:le?`${f.id}-output.txt`:`${n}-to-${r}.txt`}),Y=document.createElement("a");Y.href=k.url,Y.download=k.result.filename,Y.click()},so=async()=>{if(le){const K=new URLSearchParams({tool:f.id}),se=window.location.origin+window.location.pathname+"?"+K.toString(),ye={title:f.name,text:f.description,url:se};if(navigator.share)try{await navigator.share(ye)}catch{}else await navigator.clipboard.writeText(se),Ue(O("workspaceTools.linkCopied"));return}const k=new URLSearchParams({from:n,to:r}),Y=window.location.origin+window.location.pathname+"?"+k.toString();if(navigator.share)try{await navigator.share({title:`${cr?.name} → ${ii?.name}`,url:Y})}catch{}else await navigator.clipboard.writeText(Y),Ue(O("workspaceTools.shareLinkCopied"))},ti=()=>{if(!B||B==="(conversion error)")return;const k=Wh(B);k&&k!==n&&In(k).length>0&&Qt(k),te(B),ne("")},ni=()=>{if(!B)return;const k=Re.current.present({kind:"download",blob:new Blob([B],{type:"text/plain"}),filename:le?`${f.id}-output.txt`:`${n}-to-${r}.txt`}),Y=document.createElement("a");Y.href=k.url,Y.download=k.result.filename,Y.click()},[ai,mn]=A.useState(!1),ut=k=>{if(le)return;const Y=k.clipboardData?.getData("text");if(!Y||q.trim())return;const K=Wh(Y);K&&K!==n&&In(K).length>0&&(Qt(K),mn(!0),dn.current&&clearTimeout(dn.current),dn.current=setTimeout(()=>{mn(!1),dn.current=null},1500))},dt=de.includes(ct),oa=A.useCallback(()=>{pt(k=>{if(!Sn(n,r))return k.filter(K=>K!==ct);const Y=k.includes(ct)?k.filter(K=>K!==ct):[...k,ct].slice(-8);return gb(Y),Y})},[n,ct,r]),oi=A.useMemo(()=>L.filter(k=>In(k.id).length>0).map(k=>k.id),[L]),Bl=lr.length>0?lr:[],cr=Cn(n,C),ii=Cn(r,C),ia=le&&f.placeholder||O("workspaceTools.formatInputPlaceholder"),$a=O("workspaceTools.resultPlaceholder"),gn=!le&&["color-hex","color-rgb","color-hsl","color-hsv"].includes(n),ra=A.useRef(null),Ga=A.useMemo(()=>{if(!gn||!q.trim())return"#000000";try{if(n==="color-hex"){const k=q.trim();return k.length===4?`#${k[1]}${k[1]}${k[2]}${k[2]}${k[3]}${k[3]}`:k.slice(0,7)}if(n==="color-rgb"){const k=Xo(q.trim());return k?Dl(k):"#000000"}if(n==="color-hsl"){const k=Zo(q.trim());return k?Dl(Ko(k)):"#000000"}if(n==="color-hsv"){const k=Jo(q.trim());return k?Dl(Qo(k)):"#000000"}}catch{}return"#000000"},[gn,n,q]),la=k=>{const Y=k.target.value;if(n==="color-hex")te(Y);else if(n==="color-rgb"){const K=parseInt(Y.slice(1,3),16),se=parseInt(Y.slice(3,5),16),ye=parseInt(Y.slice(5,7),16);te(`rgb(${K}, ${se}, ${ye})`)}else if(n==="color-hsl"){const K=parseInt(Y.slice(1,3),16)/255,se=parseInt(Y.slice(3,5),16)/255,ye=parseInt(Y.slice(5,7),16)/255,Ze=Math.max(K,se,ye),We=Math.min(K,se,ye),Dt=(Ze+We)/2;if(Ze===We){te(`hsl(0, 0%, ${Math.round(Dt*100)}%)`);return}const ht=Ze-We,ho=Dt>.5?ht/(2-Ze-We):ht/(Ze+We);let bn;Ze===K?bn=((se-ye)/ht+(se<ye?6:0))/6:Ze===se?bn=((ye-K)/ht+2)/6:bn=((K-se)/ht+4)/6,te(`hsl(${Math.round(bn*360)}, ${Math.round(ho*100)}%, ${Math.round(Dt*100)}%)`)}else if(n==="color-hsv"){const K=parseInt(Y.slice(1,3),16)/255,se=parseInt(Y.slice(3,5),16)/255,ye=parseInt(Y.slice(5,7),16)/255,Ze=Math.max(K,se,ye),We=Math.min(K,se,ye),Dt=Ze-We;let ht=0;Dt!==0&&(Ze===K?ht=((se-ye)/Dt+(se<ye?6:0))/6:Ze===se?ht=((ye-K)/Dt+2)/6:ht=((K-se)/Dt+4)/6),te(`hsv(${Math.round(ht*360)}, ${Math.round((Ze===0?0:Dt/Ze)*100)}%, ${Math.round(Ze*100)}%)`)}},nt=A.useMemo(()=>{if(le)return[];const k=new Set(L.map(K=>K.id));return In(r).filter(K=>K!==n&&k.has(K)).slice(0,4).map(K=>Cn(K,C)).filter(Boolean)},[r,n,le,C,L]),ur=A.useCallback(()=>{ee.current&&P.current&&(ee.current.scrollTop=P.current.scrollTop)},[]),co=A.useMemo(()=>nb(B,Ou),[B]),yn=co.count,sa=co.overflow?`${Ou}+`:String(yn),dr=!le&&["color-hex","color-rgb","color-hsl","color-hsv"].includes(r),ri=A.useMemo(()=>!dr||!B||B.startsWith("(")?null:jy(r,B),[dr,r,B]),fr=async k=>{if(!k||!f?.fileConvert)return;const Y=f,K=Y.id,se=++ge.current;try{const ye=await Re.current.run({tool:Y,files:[k]});if(se!==ge.current||Ie.current!==K||!ye)return;ye.result.kind==="text"?ne(ye.result.text):X(ye),te(k.name)}catch(ye){se===ge.current&&Ie.current===K&&Xe(ye)}},li=async k=>{if(!k.length||!f?.fileConvert)return;const Y=f,K=Y.id,se=++ge.current,ye=Array.from(k),Ze=We=>{se===ge.current&&Ie.current===K&&Ft(We)};bt(Array.from(k)),Ye(!0),Ft(0),Xe(null),X(null);try{const We=await Re.current.run({tool:Y,files:ye,text:aa?wn:"",onProgress:Ze});if(se!==ge.current||Ie.current!==K)return;We&&X(We)}catch(We){se===ge.current&&Ie.current===K&&Xe(We)}finally{se===ge.current&&Ie.current===K&&Ye(!1)}},uo=k=>{const Y=Xh(f,k);if(!Y.ok){Re.current.cancel(),bt([]),X(null),Xe(new Ml(Y.code));return}bt(k),fn?li(k):k[0]&&fr(k[0])},fo=()=>{ge.current+=1,Re.current.cancel(),Ye(!1),Ft(0),X(null),bt([]),te(""),Xe({code:"cancelled",messageKey:"errors.cancelled"})},Jt=()=>{Re.current.reset(),X(null),Xe(null)},kt=()=>{hn("")},si=le?f.name:cr?.name||n,pr=ii?.name||r,ci=A.useCallback(k=>{x(!1),f&&!d&&h(null),Qt(k)},[f,h,d,Qt]),hr=A.useCallback(k=>{x(!1),h(k)},[h,x]),po=A.useCallback(k=>{W(!1),Ha(k)},[Ha,W]),_l=A.useCallback(()=>{x(k=>{const Y=!k;return Y&&W(!1),Y})},[]),Ct=A.useCallback(()=>{W(k=>{const Y=!k;return Y&&x(!1),Y})},[]);return p.jsxs("div",{className:"convert-panel",children:[p.jsxs("div",{className:`convert-selectors${le?" tool-mode":""}`,children:[p.jsxs("div",{className:`convert-selector-side convert-selector-from${ai?" auto-detected":""}`,ref:be,children:[p.jsxs("button",{className:"picker-trigger",onMouseDown:k=>k.stopPropagation(),onClick:_l,"aria-expanded":T,"aria-label":O("workspaceTools.selectInput",{name:si}),children:[p.jsx("span",{className:"picker-trigger-label",children:si}),p.jsx("svg",{width:"10",height:"10",viewBox:"0 0 10 10",fill:"none",children:p.jsx("path",{d:"M2.5 4l2.5 2 2.5-2",stroke:"currentColor",strokeWidth:"1.2",strokeLinecap:"round",strokeLinejoin:"round"})})]}),ai&&p.jsx("span",{className:"detect-badge",children:O("workspaceTools.detected")}),p.jsx(Hh,{open:T,onClose:()=>x(!1),onSelectFormat:ci,onSelectConverter:hr,mode:"from",align:"left",availableFormatIds:oi,currentFormatValue:le?null:n,currentConverterValue:le?f.id:null,releasedFormats:L,releasedTools:z,categories:w})]}),!le&&p.jsxs(p.Fragment,{children:[p.jsx("button",{className:`swap-btn${Ua?"":" disabled"}${Gl?" swapped":""}`,onClick:Ma,disabled:!Ua,title:O(Ua?"workspaceTools.swap":"workspaceTools.noReverseConversion"),"aria-label":O(Ua?"workspaceTools.swap":"workspaceTools.noReverseConversion"),children:p.jsx("svg",{width:"16",height:"16",viewBox:"0 0 16 16",fill:"none",children:p.jsx("path",{d:"M5 4l6 0M11 4l-2.5 2.5M11 4l-2.5-2.5M11 12l-6 0M5 12l2.5-2.5M5 12l2.5 2.5",stroke:"currentColor",strokeWidth:"1.3",strokeLinecap:"round",strokeLinejoin:"round"})})}),p.jsxs("div",{className:"convert-selector-side convert-selector-to",ref:he,children:[p.jsxs("button",{className:"picker-trigger",onMouseDown:k=>k.stopPropagation(),onClick:Ct,"aria-expanded":_,"aria-label":O("workspaceTools.selectOutput",{name:pr}),children:[p.jsx("span",{className:"picker-trigger-label",children:pr}),p.jsx("svg",{width:"10",height:"10",viewBox:"0 0 10 10",fill:"none",children:p.jsx("path",{d:"M2.5 4l2.5 2 2.5-2",stroke:"currentColor",strokeWidth:"1.2",strokeLinecap:"round",strokeLinejoin:"round"})})]}),p.jsx(Hh,{open:_,onClose:()=>W(!1),onSelectFormat:po,onSelectConverter:()=>{},mode:"to",align:"right",availableFormatIds:Bl,currentFormatValue:r,currentConverterValue:null,releasedFormats:L,releasedTools:z,categories:w})]}),p.jsxs("div",{className:"selector-extra-actions",children:[p.jsx("button",{className:`batch-toggle${ce?" active":""}`,onClick:()=>fe(k=>!k),title:O(ce?"workspaceTools.disableBatch":"workspaceTools.enableBatch"),"aria-label":O(ce?"workspaceTools.disableBatch":"workspaceTools.enableBatch"),children:p.jsx("svg",{width:"14",height:"14",viewBox:"0 0 14 14",fill:"none",children:p.jsx("path",{d:"M3 4h8M3 7h8M3 10h8",stroke:"currentColor",strokeWidth:"1.2",strokeLinecap:"round"})})}),p.jsx("button",{className:`batch-toggle${dt?" active":""}`,onClick:oa,title:O(dt?"workspaceTools.removeFavourite":"workspaceTools.addFavourite"),"aria-label":O(dt?"workspaceTools.removeFavourite":"workspaceTools.addFavourite"),children:p.jsx("svg",{width:"14",height:"14",viewBox:"0 0 14 14",fill:"none",children:p.jsx("path",{d:"M7 1.5l1.76 3.57 3.94.57-2.85 2.78.67 3.93L7 10.57l-3.52 1.78.67-3.93L1.3 5.64l3.94-.57L7 1.5z",stroke:"currentColor",strokeWidth:"1.1",strokeLinejoin:"round",fill:dt?"currentColor":"none"})})})]})]}),le&&p.jsx("div",{className:"tool-mode-actions",children:p.jsx("button",{className:"pill-btn-sm",onClick:so,title:O("workspaceTools.shareTool"),"aria-label":O("workspaceTools.shareTool"),children:p.jsxs("svg",{width:"14",height:"14",viewBox:"0 0 14 14",fill:"none",children:[p.jsx("path",{d:"M4.5 8.5l5-3M4.5 5.5l5 3",stroke:"currentColor",strokeWidth:"1.2",strokeLinecap:"round"}),p.jsx("circle",{cx:"3.5",cy:"7",r:"1.5",stroke:"currentColor",strokeWidth:"1.2"}),p.jsx("circle",{cx:"10.5",cy:"4",r:"1.5",stroke:"currentColor",strokeWidth:"1.2"}),p.jsx("circle",{cx:"10.5",cy:"10",r:"1.5",stroke:"currentColor",strokeWidth:"1.2"})]})})})]}),le&&p.jsxs(p.Fragment,{children:[p.jsx("p",{className:"tool-description",children:f.description}),f.notice&&p.jsx("p",{className:"tool-description",role:"note",children:f.notice})]}),!le&&de.length>0&&p.jsx("div",{className:"fav-pairs",children:de.map(k=>{const[Y,K]=k.split("→"),se=Cn(Y,C)?.name||Y,ye=Cn(K,C)?.name||K;return p.jsxs("button",{className:`fav-pair-btn${k===ct?" active":""}`,onClick:()=>{Sn(Y,K)&&je(Y,K)},children:[se," → ",ye]},k)})}),!le&&p.jsxs(p.Fragment,{children:[p.jsxs("div",{className:"convert-textareas",children:[p.jsx("div",{className:"convert-side",children:p.jsxs("div",{className:"textarea-area",children:[p.jsx("textarea",{ref:D,value:q,onChange:k=>te(k.target.value),"aria-label":O("workspaceTools.inputText"),onPaste:ut,placeholder:ia,spellCheck:!1,autoFocus:!0}),q&&p.jsx("button",{className:"float-clear",onClick:za,"aria-label":O("workspaceTools.clearInput"),children:p.jsx("svg",{width:"12",height:"12",viewBox:"0 0 12 12",fill:"none",children:p.jsx("path",{d:"M3 3l6 6M9 3l-6 6",stroke:"currentColor",strokeWidth:"1.3",strokeLinecap:"round"})})}),gn&&p.jsxs("label",{className:"color-picker-btn",title:O("workspaceTools.pickColor"),children:[p.jsx("input",{ref:ra,type:"color",value:Ga,onChange:la,className:"color-picker-input","aria-label":O("workspaceTools.pickColor")}),p.jsxs("svg",{width:"14",height:"14",viewBox:"0 0 14 14",fill:"none",children:[p.jsx("rect",{x:"2",y:"2",width:"10",height:"10",rx:"2",stroke:"currentColor",strokeWidth:"1.2"}),p.jsx("rect",{x:"4",y:"4",width:"6",height:"6",rx:"1",fill:"currentColor",opacity:"0.3"})]})]}),q.length>0&&p.jsx("span",{className:`float-info${gn?" float-info-color-offset":""}`,title:O("workspaceTools.byteCount",{count:new Blob([q]).size}),children:O("workspaceTools.inputStats",{characters:q.length,words:q.split(/\s+/).filter(Boolean).length,lines:q.split(`
`).length})})]})}),p.jsx("div",{className:"convert-side",children:p.jsxs("div",{className:`textarea-area${Ne?" with-gutter":""}`,children:[Ne&&yn>0&&!co.overflow&&p.jsx("div",{className:"line-gutter",ref:ee,children:Array.from({length:yn},(k,Y)=>p.jsx("div",{className:"line-num",children:Y+1},Y))}),p.jsx("textarea",{ref:P,className:`output mono${ae?"":" no-wrap"}`,value:B,readOnly:!0,placeholder:$a,onDoubleClick:lo,onScroll:Ne?ur:void 0,"aria-label":O("workspaceTools.conversionResult"),"aria-live":"polite"}),B&&p.jsxs("div",{className:"float-actions",children:[p.jsx("button",{className:"float-icon",onClick:Dn,title:O("workspaceTools.copyResult"),"aria-label":O("workspaceTools.copyResult"),children:p.jsxs("svg",{width:"14",height:"14",viewBox:"0 0 14 14",fill:"none",children:[p.jsx("rect",{x:"4.5",y:"4.5",width:"7",height:"7",rx:"1",stroke:"currentColor",strokeWidth:"1.2"}),p.jsx("path",{d:"M9.5 4.5V3a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v5.5a1 1 0 0 0 1 1h1.5",stroke:"currentColor",strokeWidth:"1.2"})]})}),B!=="(conversion error)"&&B.length>500&&p.jsx("button",{className:"float-icon",onClick:sr,title:O("workspaceTools.downloadResult"),"aria-label":O("workspaceTools.downloadResult"),children:p.jsx("svg",{width:"14",height:"14",viewBox:"0 0 14 14",fill:"none",children:p.jsx("path",{d:"M7 2v7M7 9L4.5 6.5M7 9l2.5-2.5M3 11h8",stroke:"currentColor",strokeWidth:"1.2",strokeLinecap:"round",strokeLinejoin:"round"})})}),B!=="(conversion error)"&&p.jsx("button",{className:"float-icon",onClick:ti,title:O("workspaceTools.useAsInput"),"aria-label":O("workspaceTools.useAsInput"),children:p.jsxs("svg",{width:"14",height:"14",viewBox:"0 0 14 14",fill:"none",children:[p.jsx("path",{d:"M10 4H4M4 4L6.5 6.5M4 4L6.5 1.5",stroke:"currentColor",strokeWidth:"1.2",strokeLinecap:"round",strokeLinejoin:"round"}),p.jsx("path",{d:"M4 10H10M10 10L7.5 7.5M10 10L7.5 12.5",stroke:"currentColor",strokeWidth:"1.2",strokeLinecap:"round",strokeLinejoin:"round"})]})}),p.jsx("button",{className:`float-icon${ae?" active":""}`,onClick:()=>Ae(k=>!k),title:O(ae?"workspaceTools.wordWrapOn":"workspaceTools.wordWrapOff"),"aria-label":O(ae?"workspaceTools.wordWrapOn":"workspaceTools.wordWrapOff"),children:p.jsx("svg",{width:"14",height:"14",viewBox:"0 0 14 14",fill:"none",children:p.jsx("path",{d:"M2 3h10M2 7h7a2 2 0 0 1 0 4H7M7 11L5 9M7 11l-2 2",stroke:"currentColor",strokeWidth:"1.2",strokeLinecap:"round",strokeLinejoin:"round"})})}),p.jsx("button",{className:`float-icon${Ne?" active":""}`,onClick:()=>Pe(k=>!k),title:O(Ne?"workspaceTools.hideLineNumbers":"workspaceTools.showLineNumbers"),"aria-label":O(Ne?"workspaceTools.hideLineNumbers":"workspaceTools.showLineNumbers"),children:p.jsxs("svg",{width:"14",height:"14",viewBox:"0 0 14 14",fill:"none",children:[p.jsx("text",{x:"1",y:"5",fontSize:"4.5",fill:"currentColor",fontFamily:"sans-serif",children:"1"}),p.jsx("text",{x:"1",y:"9.5",fontSize:"4.5",fill:"currentColor",fontFamily:"sans-serif",children:"2"}),p.jsx("text",{x:"1",y:"14",fontSize:"4.5",fill:"currentColor",fontFamily:"sans-serif",children:"3"}),p.jsx("path",{d:"M6 2v10",stroke:"currentColor",strokeWidth:"0.7",opacity:"0.4"}),p.jsx("path",{d:"M8 3.5h4M8 7h4M8 10.5h4",stroke:"currentColor",strokeWidth:"1.2",strokeLinecap:"round"})]})}),B!=="(conversion error)"&&q.length<=500&&p.jsx("button",{className:"float-icon",onClick:so,title:O("workspaceTools.shareConversion"),"aria-label":O("workspaceTools.shareConversion"),children:p.jsxs("svg",{width:"14",height:"14",viewBox:"0 0 14 14",fill:"none",children:[p.jsx("path",{d:"M4.5 8.5l5-3M4.5 5.5l5 3",stroke:"currentColor",strokeWidth:"1.2",strokeLinecap:"round"}),p.jsx("circle",{cx:"3.5",cy:"7",r:"1.5",stroke:"currentColor",strokeWidth:"1.2"}),p.jsx("circle",{cx:"10.5",cy:"4",r:"1.5",stroke:"currentColor",strokeWidth:"1.2"}),p.jsx("circle",{cx:"10.5",cy:"10",r:"1.5",stroke:"currentColor",strokeWidth:"1.2"})]})})]}),ri&&p.jsx("input",{className:"color-swatch",type:"color",value:ri,"aria-label":O("workspaceTools.colorPreview"),disabled:!0,tabIndex:"-1"}),B&&B.startsWith("data:image/")&&p.jsx("div",{className:"base64-preview",children:p.jsx("img",{src:B,alt:O("workspaceTools.base64Preview")})}),B&&B!=="(conversion error)"&&p.jsx("span",{className:"float-info",title:O("workspaceTools.byteCount",{count:new Blob([B]).size}),children:O("workspaceTools.outputStats",{characters:B.length,lines:sa})})]})})]}),B&&B!=="(conversion error)"&&nt.length>0&&p.jsxs("div",{className:"chain-hint",children:[O("workspaceTools.chain")," →",nt.map(k=>p.jsx("button",{className:"chain-hint-btn",onClick:()=>{je(r,k.id),te(B),ne("")},children:k.name},k.id))]})]}),pn&&p.jsxs("div",{className:"convert-textareas",children:[p.jsx("div",{className:"convert-side",children:p.jsxs("div",{className:"textarea-area",children:[p.jsx("textarea",{ref:$,value:q,onChange:k=>te(k.target.value),"aria-label":O("workspaceTools.toolInputText"),placeholder:ia,spellCheck:!1,autoFocus:!0}),q&&p.jsx("button",{className:"float-clear",onClick:za,"aria-label":O("workspaceTools.clearInput"),children:p.jsx("svg",{width:"12",height:"12",viewBox:"0 0 12 12",fill:"none",children:p.jsx("path",{d:"M3 3l6 6M9 3l-6 6",stroke:"currentColor",strokeWidth:"1.3",strokeLinecap:"round"})})})]})}),p.jsx("div",{className:"convert-side",children:p.jsxs("div",{className:"textarea-area",children:[p.jsx("textarea",{ref:oe,className:"output mono",value:B,readOnly:!0,placeholder:$a,onDoubleClick:lo,"aria-label":O("workspaceTools.toolOutputText")}),B&&!B.startsWith("(")&&p.jsxs("div",{className:"float-actions",children:[p.jsx("button",{className:"float-icon",onClick:Dn,title:O("workspaceTools.copyResult"),"aria-label":O("workspaceTools.copyResult"),children:p.jsxs("svg",{width:"14",height:"14",viewBox:"0 0 14 14",fill:"none",children:[p.jsx("rect",{x:"4.5",y:"4.5",width:"7",height:"7",rx:"1",stroke:"currentColor",strokeWidth:"1.2"}),p.jsx("path",{d:"M9.5 4.5V3a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v5.5a1 1 0 0 0 1 1h1.5",stroke:"currentColor",strokeWidth:"1.2"})]})}),B.length>20&&p.jsx("button",{className:"float-icon",onClick:ni,title:O("workspaceTools.saveResult"),"aria-label":O("workspaceTools.saveResult"),children:p.jsx("svg",{width:"14",height:"14",viewBox:"0 0 14 14",fill:"none",children:p.jsx("path",{d:"M7 2v7M7 9L4.5 6.5M7 9l2.5-2.5M3 11h8",stroke:"currentColor",strokeWidth:"1.2",strokeLinecap:"round",strokeLinejoin:"round"})})})]}),B&&B.length>0&&p.jsx("span",{className:"float-info",children:O("workspaceTools.characterCount",{count:B.length})})]})})]}),na&&p.jsxs("div",{className:"tool-panels",children:[p.jsx("div",{className:"panel-label-row",children:p.jsx("button",{className:"pill-btn-sm",onClick:kt,children:O("workspaceTools.generate")})}),p.jsxs("div",{className:"textarea-area",children:[p.jsx("textarea",{ref:oe,className:"output mono",value:B,readOnly:!0,placeholder:$a,onDoubleClick:lo,"aria-label":O("workspaceTools.toolOutputText")}),B&&!B.startsWith("(")&&p.jsxs("div",{className:"float-actions",children:[p.jsx("button",{className:"float-icon",onClick:Dn,title:O("workspaceTools.copyResult"),"aria-label":O("workspaceTools.copyResult"),children:p.jsxs("svg",{width:"14",height:"14",viewBox:"0 0 14 14",fill:"none",children:[p.jsx("rect",{x:"4.5",y:"4.5",width:"7",height:"7",rx:"1",stroke:"currentColor",strokeWidth:"1.2"}),p.jsx("path",{d:"M9.5 4.5V3a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v5.5a1 1 0 0 0 1 1h1.5",stroke:"currentColor",strokeWidth:"1.2"})]})}),B.length>20&&p.jsx("button",{className:"float-icon",onClick:ni,title:O("workspaceTools.saveResult"),"aria-label":O("workspaceTools.saveResult"),children:p.jsx("svg",{width:"14",height:"14",viewBox:"0 0 14 14",fill:"none",children:p.jsx("path",{d:"M7 2v7M7 9L4.5 6.5M7 9l2.5-2.5M3 11h8",stroke:"currentColor",strokeWidth:"1.2",strokeLinecap:"round",strokeLinejoin:"round"})})})]}),B&&B.length>0&&p.jsx("span",{className:"float-info",children:O("workspaceTools.characterCount",{count:B.length})})]})]}),io&&p.jsxs("div",{className:"tool-panels",children:[p.jsxs("div",{className:"panel",children:[p.jsxs("div",{className:"panel-label-row",children:[p.jsx("span",{className:"panel-label",children:O("workspaceTools.input")}),(Rt.length>0||q)&&p.jsx("button",{type:"button",className:"pill-btn-sm",onClick:za,children:O("workspaceTools.clear")})]}),p.jsx(db,{accept:f.acceptTypes||"*",multiple:ro,files:Rt,onFilesChange:uo}),aa&&p.jsx("input",{className:"param-input",type:"text",value:wn,onChange:k=>{Re.current.cancel(),ge.current+=1,Ye(!1),X(null),Xe(null),ta(k.target.value)},"aria-label":O("workspaceTools.parameters"),placeholder:f.textPlaceholder||O("workspaceTools.parametersPlaceholder")}),fn&&Rt.length>0&&aa&&!Te&&p.jsx("button",{type:"button",className:"pill-btn convert-btn",onClick:()=>li(Rt),children:O("workspaceTools.convert")})]}),Te&&p.jsx(fb,{progress:Ce,loadingRuntime:Ca==="downloading",onCancel:fo}),p.jsx(Yh,{error:un,onRetry:un?.code==="media_runtime_unavailable"?()=>li(Rt):void 0}),p.jsx(Ph,{record:V,onDiscard:Jt,onCopied:()=>Ue(O("workspaceTools.copied"))})]}),!le&&oo.status===Ln.incompatibleImplemented&&p.jsxs("section",{className:"compatibility-warning",role:"note","aria-labelledby":"format-compatibility-title",children:[p.jsx("strong",{id:"format-compatibility-title",children:O("formatCompatibility.warningTitle")}),p.jsx("p",{children:O("formatCompatibility.warningBody")}),p.jsxs("label",{children:[p.jsx("input",{type:"checkbox",checked:Tt===ct,onChange:k=>tt(k.target.checked?ct:null)}),p.jsx("span",{children:O("formatCompatibility.confirmation")})]})]}),!io&&p.jsx(Yh,{error:un}),!io&&V&&p.jsx(Ph,{record:V,onDiscard:Jt,onCopied:()=>Ue(O("workspaceTools.copied"))})]})}function bb({activeConverter:n,reuseRequest:r,onReuseConsumed:s,...c}){const[d,f]=A.useState(null),h=n||r?.id===d?null:r,y=A.useCallback(b=>{f(L=>L===b?L:b),s?.(b)},[s]),g=n?.id??`format:${h?.id??d??0}`;return p.jsx(yb,{...c,activeConverter:n,initialInput:h?.value??"",reuseRequestId:h?.id,onReuseConsumed:y},g)}class Tb extends A.Component{constructor(r){super(r),this.state={hasError:!1,error:null}}static getDerivedStateFromError(r){return{hasError:!0,error:r}}render(){return this.state.hasError?p.jsx("div",{className:"converter-view",children:p.jsxs("div",{className:"error-msg",role:"alert",children:[this.props.message,p.jsx("br",{}),p.jsx("button",{className:"pill-btn-sm error-retry",onClick:()=>this.setState({hasError:!1,error:null}),children:this.props.retryLabel})]})}):this.props.children}}function Eb(n){const{t:r}=et();return p.jsx(Tb,{...n,message:r("errorBoundary.message"),retryLabel:r("errorBoundary.retry")})}function vb(n,r){const s=Date.now()-n,c=Math.floor(s/6e4);if(c<1)return r("history.now");if(c<60)return r("history.minutesAgo",{count:c});const d=Math.floor(c/60);return d<24?r("history.hoursAgo",{count:d}):r("history.daysAgo",{count:Math.floor(d/24)})}function Ob({onSelect:n}){const{locale:r,t:s}=et(),[c,d]=A.useState([]),[f,h]=A.useState(!1),y=dm();A.useEffect(()=>{const w=()=>{h(Vo.isEnabled()),d(Vo.list())};return w(),window.addEventListener(Eu,w),()=>window.removeEventListener(Eu,w)},[]);const g=()=>{Vo.setEnabled(!0)},b=()=>{Vo.clear({revokeConsent:!0})},L=(w,I)=>{w.stopPropagation(),Vo.remove(I)},z=A.useCallback(async(w,I)=>{w.stopPropagation();try{await navigator.clipboard.writeText(I),y(s("history.copied"))}catch{}},[s,y]);return f?p.jsxs("div",{className:"history",children:[p.jsxs("div",{className:"history-header",children:[p.jsx("span",{className:"history-label",children:s("history.recent")}),p.jsx("button",{className:"history-clear",onClick:b,children:s("history.deleteAndDisable")})]}),p.jsxs("ul",{className:"history-scroll","aria-label":s("history.recent"),children:[c.length===0&&p.jsx("li",{className:"history-empty",children:s("history.empty")}),c.map((w,I)=>{const j=Cn(w.from,r),C=Cn(w.to,r);return p.jsx("li",{children:p.jsxs("article",{className:"history-card",children:[p.jsx("button",{className:"history-card-remove",onClick:O=>L(O,I),"aria-label":s("history.remove"),children:p.jsx("svg",{width:"10",height:"10",viewBox:"0 0 10 10",fill:"none",children:p.jsx("path",{d:"M2.5 2.5l5 5M7.5 2.5l-5 5",stroke:"currentColor",strokeWidth:"1.2",strokeLinecap:"round"})})}),p.jsxs("div",{className:"history-card-top",children:[p.jsxs("span",{className:"history-card-route",children:[j?.name||w.from,p.jsx("svg",{className:"history-arrow",width:"10",height:"10",viewBox:"0 0 10 10",children:p.jsx("path",{d:"M2 5h6M6 3l2 2-2 2",fill:"none",stroke:"currentColor",strokeWidth:"1.2",strokeLinecap:"round",strokeLinejoin:"round"})}),C?.name||w.to]}),p.jsx("span",{className:"history-card-time",children:vb(w.timestamp,s)})]}),p.jsx("span",{className:"history-card-preview",children:w.input}),p.jsx("span",{className:"history-card-output",children:w.output}),p.jsxs("div",{className:"history-card-actions",children:[p.jsx("button",{className:"history-card-btn",onClick:O=>z(O,w.output),children:s("history.copy")}),p.jsx("button",{className:"history-card-btn",onClick:O=>{O.stopPropagation(),n(w)},children:s("history.reuse")})]})]})},`${w.timestamp}-${I}`)})]})]}):p.jsxs("div",{className:"history",children:[p.jsx("p",{children:s("history.consent")}),p.jsx("button",{className:"history-clear",onClick:g,children:s("history.enable")})]})}const Sb=[{groupKey:"keyboardHelp.convertGroup"},{keys:["Ctrl/⌘","L"],descKey:"keyboardHelp.focusInput"},{keys:["Ctrl/⌘","⇧","S"],descKey:"keyboardHelp.swap"},{keys:["Ctrl/⌘","⇧","C"],descKey:"keyboardHelp.copyOutput"},{keys:["Ctrl/⌘","⇧","X"],descKey:"keyboardHelp.reset"},{keys:["Ctrl/⌘","B"],descKey:"keyboardHelp.toggleBatch"},{keys:["Esc"],descKey:"keyboardHelp.backToFormats"},{groupKey:"keyboardHelp.globalGroup"},{keys:["Ctrl/⌘","D"],descKey:"keyboardHelp.toggleTheme"},{keys:["?"],descKey:"keyboardHelp.thisHelp"}];function wb({open:n,onClose:r}){const{t:s}=et(),c=A.useRef(null);return A.useEffect(()=>{if(!n)return;const d=document.activeElement;c.current?.focus();const f=h=>{(h.key==="Escape"||h.key==="?")&&(h.preventDefault(),h.stopImmediatePropagation(),r())};return window.addEventListener("keydown",f),()=>{window.removeEventListener("keydown",f),d?.focus?.()}},[n,r]),n?p.jsx("div",{className:"kb-backdrop",onClick:r,children:p.jsxs("div",{className:"kb-modal",role:"dialog","aria-modal":"true","aria-labelledby":"keyboard-help-title",onClick:d=>d.stopPropagation(),children:[p.jsx("h2",{className:"kb-title",id:"keyboard-help-title",children:s("keyboardHelp.title")}),p.jsx("div",{className:"kb-list",children:Sb.map(d=>d.groupKey?p.jsx("div",{className:"kb-group-label",children:s(d.groupKey)},d.groupKey):p.jsxs("div",{className:"kb-row",children:[p.jsx("div",{className:"kb-keys",children:d.keys.map((f,h)=>p.jsxs("span",{children:[p.jsx("kbd",{className:"kb-key",children:f}),h<d.keys.length-1&&p.jsx("span",{className:"kb-plus",children:"+"})]},h))}),p.jsx("span",{className:"kb-desc",children:s(d.descKey)})]},d.descKey))}),p.jsx("div",{className:"kb-footer",children:s("keyboardHelp.footer")}),p.jsx("button",{ref:c,type:"button",className:"kb-close",onClick:r,"aria-label":s("keyboardHelp.close"),children:s("keyboardHelp.closeVisible")})]})}):null}const ym="text",bm="base64";function xb(n){const r=n.replace(/^#/,"");return r.startsWith("tool/")&&r.slice(5)||null}function Vh(n,r){const s=new URLSearchParams(n),c=Fu.filter(L=>In(L.id).length>0).map(L=>L.id),d=s.get("from"),f=c.includes(d)?d:ym,h=In(f),y=s.get("to"),g=h.includes(y)?y:h[0]||bm,b=s.get("tool")||xb(r||"");return{from:f,to:g,toolId:b}}function Ab({from:n,to:r,toolId:s},c="/workspace"){const d=new URLSearchParams;return typeof s=="string"&&/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(s)?d.set("tool",s):In(n).includes(r)?(d.set("from",n),d.set("to",r)):(d.set("from",ym),d.set("to",bm)),`${c}?${d.toString()}`}function Tm(){try{return window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"}catch{return"auto"}}function Fb(n){const r=n.type||"",s=n.name.toLowerCase();return r==="application/pdf"||s.endsWith(".pdf")?"pdf-page-count":r==="image/png"||s.endsWith(".png")?"png-to-jpg":["image/jpeg","image/jpg"].includes(r)||/\.jpe?g$/.test(s)?"jpg-to-png":r.startsWith("audio/")?"audio-to-mp3":null}function fu(n,r={}){let s=document.head.querySelector(n);return s||(s=document.createElement("meta"),Object.entries(r).forEach(([c,d])=>s.setAttribute(c,d)),document.head.appendChild(s)),s}function Rb(){let n=document.head.querySelector('link[rel="canonical"]');return n||(n=document.createElement("link"),n.setAttribute("rel","canonical"),document.head.appendChild(n)),n}function Nb(){const{locale:n,t:r}=et(),s=A.useMemo(()=>am(n),[n]),c=A.useMemo(()=>d0(n),[n]),d=A.useMemo(()=>t0(n),[n]),f=A.useMemo(()=>Vh(window.location.search,window.location.hash),[]),[h,y]=A.useState(f.from),[g,b]=A.useState(f.to),[L,z]=A.useState(null),[w,I]=A.useState(()=>s.some(T=>T.id===f.toolId)?f.toolId:null),j=A.useRef(null);j.current===null&&(j.current={from:f.from,to:f.to,toolId:s.some(T=>T.id===f.toolId)?f.toolId:null});const[C,O]=A.useState(null),[q,te]=A.useState(null),[B,ne]=A.useState(0),[ce,fe]=A.useState(!1),[ae,Ae]=A.useState(!1),[Ne,Pe]=A.useState(!1),Fe=A.useRef(0),tt=A.useRef(0),de=A.useMemo(()=>s.find(T=>T.id===w)||null,[w,s]),pt=A.useMemo(()=>!de||C?.id!==de.id?null:{...C.converter,...de},[de,C]),Ue=A.useCallback((T,{replace:x=!1}={})=>{const _=Ab(T,window.location.pathname);`${window.location.pathname}${window.location.search}${window.location.hash}`!==_&&history[x?"replaceState":"pushState"](null,"",_)},[]),D=A.useCallback((T,x,_)=>{Sn(T,x)&&(I(null),y(T),b(x),Pe(!1),Ue({from:T,to:x,toolId:null},_))},[Ue]);A.useEffect(()=>{Ue(j.current,{replace:!0})},[Ue]),A.useEffect(()=>{if(!w)return;let T=!0;return G0(w).then(x=>{T&&x&&O({id:w,converter:x})}).catch(()=>{T&&te({id:w,attempt:B})}),()=>{T=!1}},[w,B]),A.useEffect(()=>{const T=Cn(h,n)?.name||h,x=Cn(g,n)?.name||g,W=`${de?de.name:r("workspace.pairTitle",{from:T,to:x})} · Folkkit`,V=de?r("workspace.toolDescription",{name:de.name}):r("workspace.pairDescription",{from:T,to:x});document.title=W,fu('meta[name="description"]',{name:"description"}).setAttribute("content",V),fu('meta[property="og:title"]',{property:"og:title"}).setAttribute("content",W),fu('meta[property="og:description"]',{property:"og:description"}).setAttribute("content",V);const X=new URL(window.location.pathname,window.location.origin);de?X.searchParams.set("tool",de.id):(X.searchParams.set("from",h),X.searchParams.set("to",g)),Rb().setAttribute("href",X.toString())},[de,h,g,n,r]),A.useEffect(()=>{const T=()=>{const{from:x,to:_,toolId:W}=Vh(window.location.search,window.location.hash),V=s.find(X=>X.id===W);I(V?.id||null),V||(y(x),b(_))};return window.addEventListener("popstate",T),()=>window.removeEventListener("popstate",T)},[s]);const P=A.useCallback(T=>{Ue({from:h,to:g,toolId:T?.id||null}),I(T?.id||null),Pe(!1),window.scrollTo({top:0,behavior:Tm()})},[h,g,Ue]),ee=A.useCallback(T=>{Sn(T?.from,T?.to)&&(D(T.from,T.to),z({id:++tt.current,value:T.input}))},[D]),be=A.useCallback(T=>{z(x=>x?.id===T?null:x)},[]),he=A.useCallback(()=>{if(navigator.onLine){window.location.reload();return}ne(T=>T+1)},[]);return A.useEffect(()=>{const T=V=>{V.preventDefault(),Fe.current+=1,Fe.current===1&&Ae(!0)},x=V=>{V.preventDefault(),Fe.current-=1,Fe.current===0&&Ae(!1)},_=V=>V.preventDefault(),W=V=>{if(V.preventDefault(),Fe.current=0,Ae(!1),de)return;const X=V.dataTransfer?.files?.[0],Te=X?Fb(X):null,Ye=s.find(Ce=>Ce.id===Te);Ye?P(Ye):X&&Pe(!0)};return document.addEventListener("dragenter",T),document.addEventListener("dragleave",x),document.addEventListener("dragover",_),document.addEventListener("drop",W),()=>{document.removeEventListener("dragenter",T),document.removeEventListener("dragleave",x),document.removeEventListener("dragover",_),document.removeEventListener("drop",W)}},[de,P,s]),A.useEffect(()=>{const T=x=>{if(de||["INPUT","TEXTAREA","SELECT"].includes(document.activeElement?.tagName)||!Array.from(x.clipboardData?.items||[]).find(V=>V.type.startsWith("image/")))return;const W=s.find(V=>V.id==="image-resize");W&&(x.preventDefault(),P(W))};return document.addEventListener("paste",T),()=>document.removeEventListener("paste",T)},[de,P,s]),A.useEffect(()=>{const T=x=>{if(ce)return;const _=["INPUT","TEXTAREA","SELECT"].includes(document.activeElement?.tagName);x.key==="Escape"&&de?P(null):x.key==="?"&&!_&&(x.preventDefault(),fe(W=>!W))};return window.addEventListener("keydown",T),()=>window.removeEventListener("keydown",T)},[de,P,ce]),p.jsxs("div",{className:"workspace-page",children:[p.jsxs("header",{className:"workspace-heading heading-group",children:[p.jsx("p",{className:"eyebrow",children:r("workspace.eyebrow")}),p.jsx("h1",{className:"display",children:de?.name||r("workspace.title")}),p.jsx("p",{children:r("workspace.intro")})]}),p.jsxs("div",{className:"workspace-surface",children:[Ne&&p.jsx("div",{className:"error-msg",role:"alert",children:r("workspace.unsupportedDrop")}),p.jsx(Eb,{children:de&&q?.id===w&&q.attempt===B?p.jsxs("div",{className:"error-msg",role:"alert",children:[p.jsx("p",{children:r(de.module==="media"?"workspaceTools.mediaModuleUnavailable":"workspaceTools.toolModuleUnavailable")}),p.jsx("button",{type:"button",onClick:he,children:r("workspaceTools.retryModule")})]}):de&&!pt?p.jsx("p",{role:"status",children:r("workspaceTools.loadingTool")}):p.jsx(bb,{from:h,to:g,onFromChange:y,onToChange:b,onPairChange:D,reuseRequest:L,onReuseConsumed:be,activeConverter:pt,onConverterChange:P,releasedFormats:d,releasedTools:s,categories:c})},de?.id||"format"),!de&&p.jsx(Ob,{onSelect:ee})]}),p.jsx(wb,{open:ce,onClose:()=>fe(!1)}),ae&&!de&&p.jsx("div",{className:"drop-overlay",children:p.jsx("div",{className:"drop-overlay-content",children:r("workspace.dropOverlay")})})]})}const Ib=Object.freeze({"/privacy":"privacy","/open-source":"openSource","/licenses":"licenses","/terms":"terms","/contact":"contact"}),Lb=Object.freeze({privacy:k0,openSource:C0,licenses:I0,terms:D0,contact:A0});function pu(){const n=Ib[window.location.pathname];return n?`legal:${n}`:window.location.pathname==="/tools"?"catalog":window.location.pathname==="/workspace"||window.location.search||window.location.hash.startsWith("#tool/")?"workspace":"home"}function Kh(){requestAnimationFrame(()=>{document.getElementById("main-content")?.focus({preventScroll:!0})})}function kb(){const{locale:n,setLocale:r}=et(),[s,c]=A.useState(pu),d=A.useMemo(()=>am(n),[n]),f=s.startsWith("legal:")?"legal":s,h=s.startsWith("legal:")?Lb[s.slice(6)]:null;A.useEffect(()=>{document.documentElement.lang=n},[n]),A.useEffect(()=>{const L=()=>{c(pu()),Kh()};return window.addEventListener("popstate",L),()=>window.removeEventListener("popstate",L)},[]);const y=A.useCallback(L=>{const z=new URL(L,window.location.origin);history.pushState(null,"",`${z.pathname}${z.search}${z.hash}`),c(pu()),Kh(),window.scrollTo({top:0,behavior:Tm()})},[]),g=L=>{y({pdf:"/workspace?tool=merge-pdf",qr:"/workspace?tool=text-to-qr",convert:"/workspace?from=text&to=base64"}[L])},b=({kind:L,toolId:z,from:w,to:I})=>{y(L==="tool"?`/workspace?tool=${encodeURIComponent(z)}`:`/workspace?from=${encodeURIComponent(w)}&to=${encodeURIComponent(I)}`)};return p.jsxs(E0,{locale:n,onLocaleChange:r,route:f,onNavigate:y,children:[s==="home"&&p.jsx(R0,{onOpenCore:g,onOpenCatalog:()=>y("/tools")}),s==="catalog"&&p.jsx(v0,{entries:d,onSelect:b}),s==="workspace"&&p.jsx(Nb,{}),h&&p.jsx(h,{})]})}function Cb({children:n}){const[r,s]=A.useState(null),c=A.useRef(null),d=A.useCallback(f=>{clearTimeout(c.current),s(f),c.current=setTimeout(()=>s(null),1500)},[]);return p.jsxs(um.Provider,{value:d,children:[n,r&&p.jsx("div",{className:"toast",role:"status","aria-live":"polite",children:r})]})}function Db(n){if(n==="de"||n==="en")return n;try{const r=localStorage.getItem(Gt.locale);if(r==="de"||r==="en")return r}catch{}return"de"}function Hb({children:n,initialLocale:r}){const[s,c]=A.useState(()=>Db(r)),d=A.useCallback(y=>{const g=Ul(y);c(g);try{localStorage.setItem(Gt.locale,g)}catch{}},[]),f=A.useCallback((y,g)=>ea(Ru(s),y,g),[s]),h=A.useMemo(()=>({locale:s,setLocale:d,t:f}),[s,d,f]);return p.jsx(tm.Provider,{value:h,children:n})}Cy.createRoot(document.getElementById("root")).render(p.jsx(A.StrictMode,{children:p.jsx(Hb,{children:p.jsx(Cb,{children:p.jsx(kb,{})})})}));"serviceWorker"in navigator&&window.addEventListener("load",()=>{const s=`${"/".endsWith("/")?"/":"//"}sw.js`;navigator.serviceWorker.register(s).catch(c=>{console.warn("[SW] Service worker registration failed:",c)})});export{jb as I,Ub as M,zb as P,Mb as Q,Zt as T,Xt as _,$b as a,Ko as b,xl as c,Dl as d,Bh as e,Bb as f,ab as g,nr as h,Gb as i,cn as r};
