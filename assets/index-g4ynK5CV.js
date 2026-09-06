const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/QrDesignerPage-XZz-QEz5.js","assets/pdf-lib-BYCLJ2U_.js","assets/jpegOrientation-CVoaSQDi.js","assets/QrDesignerPage-CmBXaxUL.css","assets/FileConverterPage-HwqJAkuh.js","assets/workBudgets-C5ZqjDz6.js","assets/FileConverterPage-nlcXSCYu.css","assets/PdfEditorPage-BxpNK1SQ.js","assets/pdfClient-B3O83sLH.js","assets/PdfEditorPage-Bh-6tEL2.css","assets/WorkspacePage-CE6y_Hw4.js","assets/WorkspacePage-x1HfyxUR.css","assets/CalculatorPage-CUrwfvZu.js","assets/CalculatorPage-DiVfOUWI.css"])))=>i.map(i=>d[i]);
(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const p of document.querySelectorAll('link[rel="modulepreload"]'))c(p);new MutationObserver(p=>{for(const d of p)if(d.type==="childList")for(const f of d.addedNodes)f.tagName==="LINK"&&f.rel==="modulepreload"&&c(f)}).observe(document,{childList:!0,subtree:!0});function l(p){const d={};return p.integrity&&(d.integrity=p.integrity),p.referrerPolicy&&(d.referrerPolicy=p.referrerPolicy),p.crossOrigin==="use-credentials"?d.credentials="include":p.crossOrigin==="anonymous"?d.credentials="omit":d.credentials="same-origin",d}function c(p){if(p.ep)return;p.ep=!0;const d=l(p);fetch(p.href,d)}})();var tc={exports:{}},Gi={};var wp;function Pg(){if(wp)return Gi;wp=1;var n=Symbol.for("react.transitional.element"),s=Symbol.for("react.fragment");function l(c,p,d){var f=null;if(d!==void 0&&(f=""+d),p.key!==void 0&&(f=""+p.key),"key"in p){d={};for(var m in p)m!=="key"&&(d[m]=p[m])}else d=p;return p=d.ref,{$$typeof:n,type:c,key:f,ref:p!==void 0?p:null,props:d}}return Gi.Fragment=s,Gi.jsx=l,Gi.jsxs=l,Gi}var Rp;function Yg(){return Rp||(Rp=1,tc.exports=Pg()),tc.exports}var E=Yg(),nc={exports:{}},X={};var Fp;function $g(){if(Fp)return X;Fp=1;var n=Symbol.for("react.transitional.element"),s=Symbol.for("react.portal"),l=Symbol.for("react.fragment"),c=Symbol.for("react.strict_mode"),p=Symbol.for("react.profiler"),d=Symbol.for("react.consumer"),f=Symbol.for("react.context"),m=Symbol.for("react.forward_ref"),y=Symbol.for("react.suspense"),b=Symbol.for("react.memo"),z=Symbol.for("react.lazy"),M=Symbol.for("react.activity"),F=Symbol.iterator;function L(O){return O===null||typeof O!="object"?null:(O=F&&O[F]||O["@@iterator"],typeof O=="function"?O:null)}var k={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},H=Object.assign,U={};function de(O,D,G){this.props=O,this.context=D,this.refs=U,this.updater=G||k}de.prototype.isReactComponent={},de.prototype.setState=function(O,D){if(typeof O!="object"&&typeof O!="function"&&O!=null)throw Error("takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,O,D,"setState")},de.prototype.forceUpdate=function(O){this.updater.enqueueForceUpdate(this,O,"forceUpdate")};function P(){}P.prototype=de.prototype;function J(O,D,G){this.props=O,this.context=D,this.refs=U,this.updater=G||k}var se=J.prototype=new P;se.constructor=J,H(se,de.prototype),se.isPureReactComponent=!0;var ne=Array.isArray;function ye(){}var Q={H:null,A:null,T:null,S:null},Ne=Object.prototype.hasOwnProperty;function W(O,D,G){var Y=G.ref;return{$$typeof:n,type:O,key:D,ref:Y!==void 0?Y:null,props:G}}function Z(O,D){return W(O.type,D,O.props)}function pe(O){return typeof O=="object"&&O!==null&&O.$$typeof===n}function Fe(O){var D={"=":"=0",":":"=2"};return"$"+O.replace(/[=:]/g,function(G){return D[G]})}var Et=/\/+/g;function Ct(O,D){return typeof O=="object"&&O!==null&&O.key!=null?Fe(""+O.key):D.toString(36)}function Dt(O){switch(O.status){case"fulfilled":return O.value;case"rejected":throw O.reason;default:switch(typeof O.status=="string"?O.then(ye,ye):(O.status="pending",O.then(function(D){O.status==="pending"&&(O.status="fulfilled",O.value=D)},function(D){O.status==="pending"&&(O.status="rejected",O.reason=D)})),O.status){case"fulfilled":return O.value;case"rejected":throw O.reason}}throw O}function I(O,D,G,Y,ee){var ie=typeof O;(ie==="undefined"||ie==="boolean")&&(O=null);var be=!1;if(O===null)be=!0;else switch(ie){case"bigint":case"string":case"number":be=!0;break;case"object":switch(O.$$typeof){case n:case s:be=!0;break;case z:return be=O._init,I(be(O._payload),D,G,Y,ee)}}if(be)return ee=ee(O),be=Y===""?"."+Ct(O,0):Y,ne(ee)?(G="",be!=null&&(G=be.replace(Et,"$&/")+"/"),I(ee,D,G,"",function(qa){return qa})):ee!=null&&(pe(ee)&&(ee=Z(ee,G+(ee.key==null||O&&O.key===ee.key?"":(""+ee.key).replace(Et,"$&/")+"/")+be)),D.push(ee)),1;be=0;var Je=Y===""?".":Y+":";if(ne(O))for(var ke=0;ke<O.length;ke++)Y=O[ke],ie=Je+Ct(Y,ke),be+=I(Y,D,G,ie,ee);else if(ke=L(O),typeof ke=="function")for(O=ke.call(O),ke=0;!(Y=O.next()).done;)Y=Y.value,ie=Je+Ct(Y,ke++),be+=I(Y,D,G,ie,ee);else if(ie==="object"){if(typeof O.then=="function")return I(Dt(O),D,G,Y,ee);throw D=String(O),Error("Objects are not valid as a React child (found: "+(D==="[object Object]"?"object with keys {"+Object.keys(O).join(", ")+"}":D)+"). If you meant to render a collection of children, use an array instead.")}return be}function j(O,D,G){if(O==null)return O;var Y=[],ee=0;return I(O,Y,"","",function(ie){return D.call(G,ie,ee++)}),Y}function K(O){if(O._status===-1){var D=O._result;D=D(),D.then(function(G){(O._status===0||O._status===-1)&&(O._status=1,O._result=G)},function(G){(O._status===0||O._status===-1)&&(O._status=2,O._result=G)}),O._status===-1&&(O._status=0,O._result=D)}if(O._status===1)return O._result.default;throw O._result}var Oe=typeof reportError=="function"?reportError:function(O){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var D=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof O=="object"&&O!==null&&typeof O.message=="string"?String(O.message):String(O),error:O});if(!window.dispatchEvent(D))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",O);return}console.error(O)},we={map:j,forEach:function(O,D,G){j(O,function(){D.apply(this,arguments)},G)},count:function(O){var D=0;return j(O,function(){D++}),D},toArray:function(O){return j(O,function(D){return D})||[]},only:function(O){if(!pe(O))throw Error("React.Children.only expected to receive a single React element child.");return O}};return X.Activity=M,X.Children=we,X.Component=de,X.Fragment=l,X.Profiler=p,X.PureComponent=J,X.StrictMode=c,X.Suspense=y,X.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=Q,X.__COMPILER_RUNTIME={__proto__:null,c:function(O){return Q.H.useMemoCache(O)}},X.cache=function(O){return function(){return O.apply(null,arguments)}},X.cacheSignal=function(){return null},X.cloneElement=function(O,D,G){if(O==null)throw Error("The argument must be a React element, but you passed "+O+".");var Y=H({},O.props),ee=O.key;if(D!=null)for(ie in D.key!==void 0&&(ee=""+D.key),D)!Ne.call(D,ie)||ie==="key"||ie==="__self"||ie==="__source"||ie==="ref"&&D.ref===void 0||(Y[ie]=D[ie]);var ie=arguments.length-2;if(ie===1)Y.children=G;else if(1<ie){for(var be=Array(ie),Je=0;Je<ie;Je++)be[Je]=arguments[Je+2];Y.children=be}return W(O.type,ee,Y)},X.createContext=function(O){return O={$$typeof:f,_currentValue:O,_currentValue2:O,_threadCount:0,Provider:null,Consumer:null},O.Provider=O,O.Consumer={$$typeof:d,_context:O},O},X.createElement=function(O,D,G){var Y,ee={},ie=null;if(D!=null)for(Y in D.key!==void 0&&(ie=""+D.key),D)Ne.call(D,Y)&&Y!=="key"&&Y!=="__self"&&Y!=="__source"&&(ee[Y]=D[Y]);var be=arguments.length-2;if(be===1)ee.children=G;else if(1<be){for(var Je=Array(be),ke=0;ke<be;ke++)Je[ke]=arguments[ke+2];ee.children=Je}if(O&&O.defaultProps)for(Y in be=O.defaultProps,be)ee[Y]===void 0&&(ee[Y]=be[Y]);return W(O,ie,ee)},X.createRef=function(){return{current:null}},X.forwardRef=function(O){return{$$typeof:m,render:O}},X.isValidElement=pe,X.lazy=function(O){return{$$typeof:z,_payload:{_status:-1,_result:O},_init:K}},X.memo=function(O,D){return{$$typeof:b,type:O,compare:D===void 0?null:D}},X.startTransition=function(O){var D=Q.T,G={};Q.T=G;try{var Y=O(),ee=Q.S;ee!==null&&ee(G,Y),typeof Y=="object"&&Y!==null&&typeof Y.then=="function"&&Y.then(ye,Oe)}catch(ie){Oe(ie)}finally{D!==null&&G.types!==null&&(D.types=G.types),Q.T=D}},X.unstable_useCacheRefresh=function(){return Q.H.useCacheRefresh()},X.use=function(O){return Q.H.use(O)},X.useActionState=function(O,D,G){return Q.H.useActionState(O,D,G)},X.useCallback=function(O,D){return Q.H.useCallback(O,D)},X.useContext=function(O){return Q.H.useContext(O)},X.useDebugValue=function(){},X.useDeferredValue=function(O,D){return Q.H.useDeferredValue(O,D)},X.useEffect=function(O,D){return Q.H.useEffect(O,D)},X.useEffectEvent=function(O){return Q.H.useEffectEvent(O)},X.useId=function(){return Q.H.useId()},X.useImperativeHandle=function(O,D,G){return Q.H.useImperativeHandle(O,D,G)},X.useInsertionEffect=function(O,D){return Q.H.useInsertionEffect(O,D)},X.useLayoutEffect=function(O,D){return Q.H.useLayoutEffect(O,D)},X.useMemo=function(O,D){return Q.H.useMemo(O,D)},X.useOptimistic=function(O,D){return Q.H.useOptimistic(O,D)},X.useReducer=function(O,D,G){return Q.H.useReducer(O,D,G)},X.useRef=function(O){return Q.H.useRef(O)},X.useState=function(O){return Q.H.useState(O)},X.useSyncExternalStore=function(O,D,G){return Q.H.useSyncExternalStore(O,D,G)},X.useTransition=function(){return Q.H.useTransition()},X.version="19.2.8",X}var Np;function Ec(){return Np||(Np=1,nc.exports=$g()),nc.exports}var q=Ec(),ac={exports:{}},Bi={},ic={exports:{}},oc={};var Ip;function Wg(){return Ip||(Ip=1,(function(n){function s(I,j){var K=I.length;I.push(j);e:for(;0<K;){var Oe=K-1>>>1,we=I[Oe];if(0<p(we,j))I[Oe]=j,I[K]=we,K=Oe;else break e}}function l(I){return I.length===0?null:I[0]}function c(I){if(I.length===0)return null;var j=I[0],K=I.pop();if(K!==j){I[0]=K;e:for(var Oe=0,we=I.length,O=we>>>1;Oe<O;){var D=2*(Oe+1)-1,G=I[D],Y=D+1,ee=I[Y];if(0>p(G,K))Y<we&&0>p(ee,G)?(I[Oe]=ee,I[Y]=K,Oe=Y):(I[Oe]=G,I[D]=K,Oe=D);else if(Y<we&&0>p(ee,K))I[Oe]=ee,I[Y]=K,Oe=Y;else break e}}return j}function p(I,j){var K=I.sortIndex-j.sortIndex;return K!==0?K:I.id-j.id}if(n.unstable_now=void 0,typeof performance=="object"&&typeof performance.now=="function"){var d=performance;n.unstable_now=function(){return d.now()}}else{var f=Date,m=f.now();n.unstable_now=function(){return f.now()-m}}var y=[],b=[],z=1,M=null,F=3,L=!1,k=!1,H=!1,U=!1,de=typeof setTimeout=="function"?setTimeout:null,P=typeof clearTimeout=="function"?clearTimeout:null,J=typeof setImmediate<"u"?setImmediate:null;function se(I){for(var j=l(b);j!==null;){if(j.callback===null)c(b);else if(j.startTime<=I)c(b),j.sortIndex=j.expirationTime,s(y,j);else break;j=l(b)}}function ne(I){if(H=!1,se(I),!k)if(l(y)!==null)k=!0,ye||(ye=!0,Fe());else{var j=l(b);j!==null&&Dt(ne,j.startTime-I)}}var ye=!1,Q=-1,Ne=5,W=-1;function Z(){return U?!0:!(n.unstable_now()-W<Ne)}function pe(){if(U=!1,ye){var I=n.unstable_now();W=I;var j=!0;try{e:{k=!1,H&&(H=!1,P(Q),Q=-1),L=!0;var K=F;try{t:{for(se(I),M=l(y);M!==null&&!(M.expirationTime>I&&Z());){var Oe=M.callback;if(typeof Oe=="function"){M.callback=null,F=M.priorityLevel;var we=Oe(M.expirationTime<=I);if(I=n.unstable_now(),typeof we=="function"){M.callback=we,se(I),j=!0;break t}M===l(y)&&c(y),se(I)}else c(y);M=l(y)}if(M!==null)j=!0;else{var O=l(b);O!==null&&Dt(ne,O.startTime-I),j=!1}}break e}finally{M=null,F=K,L=!1}j=void 0}}finally{j?Fe():ye=!1}}}var Fe;if(typeof J=="function")Fe=function(){J(pe)};else if(typeof MessageChannel<"u"){var Et=new MessageChannel,Ct=Et.port2;Et.port1.onmessage=pe,Fe=function(){Ct.postMessage(null)}}else Fe=function(){de(pe,0)};function Dt(I,j){Q=de(function(){I(n.unstable_now())},j)}n.unstable_IdlePriority=5,n.unstable_ImmediatePriority=1,n.unstable_LowPriority=4,n.unstable_NormalPriority=3,n.unstable_Profiling=null,n.unstable_UserBlockingPriority=2,n.unstable_cancelCallback=function(I){I.callback=null},n.unstable_forceFrameRate=function(I){0>I||125<I?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):Ne=0<I?Math.floor(1e3/I):5},n.unstable_getCurrentPriorityLevel=function(){return F},n.unstable_next=function(I){switch(F){case 1:case 2:case 3:var j=3;break;default:j=F}var K=F;F=j;try{return I()}finally{F=K}},n.unstable_requestPaint=function(){U=!0},n.unstable_runWithPriority=function(I,j){switch(I){case 1:case 2:case 3:case 4:case 5:break;default:I=3}var K=F;F=I;try{return j()}finally{F=K}},n.unstable_scheduleCallback=function(I,j,K){var Oe=n.unstable_now();switch(typeof K=="object"&&K!==null?(K=K.delay,K=typeof K=="number"&&0<K?Oe+K:Oe):K=Oe,I){case 1:var we=-1;break;case 2:we=250;break;case 5:we=1073741823;break;case 4:we=1e4;break;default:we=5e3}return we=K+we,I={id:z++,callback:j,priorityLevel:I,startTime:K,expirationTime:we,sortIndex:-1},K>Oe?(I.sortIndex=K,s(b,I),l(y)===null&&I===l(b)&&(H?(P(Q),Q=-1):H=!0,Dt(ne,K-Oe))):(I.sortIndex=we,s(y,I),k||L||(k=!0,ye||(ye=!0,Fe()))),I},n.unstable_shouldYield=Z,n.unstable_wrapCallback=function(I){var j=F;return function(){var K=F;F=j;try{return I.apply(this,arguments)}finally{F=K}}}})(oc)),oc}var xp;function _g(){return xp||(xp=1,ic.exports=Wg()),ic.exports}var rc={exports:{}},Ze={};var Lp;function qg(){if(Lp)return Ze;Lp=1;var n=Ec();function s(y){var b="https://react.dev/errors/"+y;if(1<arguments.length){b+="?args[]="+encodeURIComponent(arguments[1]);for(var z=2;z<arguments.length;z++)b+="&args[]="+encodeURIComponent(arguments[z])}return"Minified React error #"+y+"; visit "+b+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function l(){}var c={d:{f:l,r:function(){throw Error(s(522))},D:l,C:l,L:l,m:l,X:l,S:l,M:l},p:0,findDOMNode:null},p=Symbol.for("react.portal");function d(y,b,z){var M=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:p,key:M==null?null:""+M,children:y,containerInfo:b,implementation:z}}var f=n.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;function m(y,b){if(y==="font")return"";if(typeof b=="string")return b==="use-credentials"?b:""}return Ze.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=c,Ze.createPortal=function(y,b){var z=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!b||b.nodeType!==1&&b.nodeType!==9&&b.nodeType!==11)throw Error(s(299));return d(y,b,null,z)},Ze.flushSync=function(y){var b=f.T,z=c.p;try{if(f.T=null,c.p=2,y)return y()}finally{f.T=b,c.p=z,c.d.f()}},Ze.preconnect=function(y,b){typeof y=="string"&&(b?(b=b.crossOrigin,b=typeof b=="string"?b==="use-credentials"?b:"":void 0):b=null,c.d.C(y,b))},Ze.prefetchDNS=function(y){typeof y=="string"&&c.d.D(y)},Ze.preinit=function(y,b){if(typeof y=="string"&&b&&typeof b.as=="string"){var z=b.as,M=m(z,b.crossOrigin),F=typeof b.integrity=="string"?b.integrity:void 0,L=typeof b.fetchPriority=="string"?b.fetchPriority:void 0;z==="style"?c.d.S(y,typeof b.precedence=="string"?b.precedence:void 0,{crossOrigin:M,integrity:F,fetchPriority:L}):z==="script"&&c.d.X(y,{crossOrigin:M,integrity:F,fetchPriority:L,nonce:typeof b.nonce=="string"?b.nonce:void 0})}},Ze.preinitModule=function(y,b){if(typeof y=="string")if(typeof b=="object"&&b!==null){if(b.as==null||b.as==="script"){var z=m(b.as,b.crossOrigin);c.d.M(y,{crossOrigin:z,integrity:typeof b.integrity=="string"?b.integrity:void 0,nonce:typeof b.nonce=="string"?b.nonce:void 0})}}else b==null&&c.d.M(y)},Ze.preload=function(y,b){if(typeof y=="string"&&typeof b=="object"&&b!==null&&typeof b.as=="string"){var z=b.as,M=m(z,b.crossOrigin);c.d.L(y,z,{crossOrigin:M,integrity:typeof b.integrity=="string"?b.integrity:void 0,nonce:typeof b.nonce=="string"?b.nonce:void 0,type:typeof b.type=="string"?b.type:void 0,fetchPriority:typeof b.fetchPriority=="string"?b.fetchPriority:void 0,referrerPolicy:typeof b.referrerPolicy=="string"?b.referrerPolicy:void 0,imageSrcSet:typeof b.imageSrcSet=="string"?b.imageSrcSet:void 0,imageSizes:typeof b.imageSizes=="string"?b.imageSizes:void 0,media:typeof b.media=="string"?b.media:void 0})}},Ze.preloadModule=function(y,b){if(typeof y=="string")if(b){var z=m(b.as,b.crossOrigin);c.d.m(y,{as:typeof b.as=="string"&&b.as!=="script"?b.as:void 0,crossOrigin:z,integrity:typeof b.integrity=="string"?b.integrity:void 0})}else c.d.m(y)},Ze.requestFormReset=function(y){c.d.r(y)},Ze.unstable_batchedUpdates=function(y,b){return y(b)},Ze.useFormState=function(y,b,z){return f.H.useFormState(y,b,z)},Ze.useFormStatus=function(){return f.H.useHostTransitionStatus()},Ze.version="19.2.8",Ze}var Cp;function Vg(){if(Cp)return rc.exports;Cp=1;function n(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n)}catch(s){console.error(s)}}return n(),rc.exports=qg(),rc.exports}var Dp;function Kg(){if(Dp)return Bi;Dp=1;var n=_g(),s=Ec(),l=Vg();function c(e){var t="https://react.dev/errors/"+e;if(1<arguments.length){t+="?args[]="+encodeURIComponent(arguments[1]);for(var a=2;a<arguments.length;a++)t+="&args[]="+encodeURIComponent(arguments[a])}return"Minified React error #"+e+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function p(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function d(e){var t=e,a=e;if(e.alternate)for(;t.return;)t=t.return;else{e=t;do t=e,(t.flags&4098)!==0&&(a=t.return),e=t.return;while(e)}return t.tag===3?a:null}function f(e){if(e.tag===13){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function m(e){if(e.tag===31){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function y(e){if(d(e)!==e)throw Error(c(188))}function b(e){var t=e.alternate;if(!t){if(t=d(e),t===null)throw Error(c(188));return t!==e?null:e}for(var a=e,i=t;;){var o=a.return;if(o===null)break;var r=o.alternate;if(r===null){if(i=o.return,i!==null){a=i;continue}break}if(o.child===r.child){for(r=o.child;r;){if(r===a)return y(o),e;if(r===i)return y(o),t;r=r.sibling}throw Error(c(188))}if(a.return!==i.return)a=o,i=r;else{for(var u=!1,h=o.child;h;){if(h===a){u=!0,a=o,i=r;break}if(h===i){u=!0,i=o,a=r;break}h=h.sibling}if(!u){for(h=r.child;h;){if(h===a){u=!0,a=r,i=o;break}if(h===i){u=!0,i=r,a=o;break}h=h.sibling}if(!u)throw Error(c(189))}}if(a.alternate!==i)throw Error(c(190))}if(a.tag!==3)throw Error(c(188));return a.stateNode.current===a?e:t}function z(e){var t=e.tag;if(t===5||t===26||t===27||t===6)return e;for(e=e.child;e!==null;){if(t=z(e),t!==null)return t;e=e.sibling}return null}var M=Object.assign,F=Symbol.for("react.element"),L=Symbol.for("react.transitional.element"),k=Symbol.for("react.portal"),H=Symbol.for("react.fragment"),U=Symbol.for("react.strict_mode"),de=Symbol.for("react.profiler"),P=Symbol.for("react.consumer"),J=Symbol.for("react.context"),se=Symbol.for("react.forward_ref"),ne=Symbol.for("react.suspense"),ye=Symbol.for("react.suspense_list"),Q=Symbol.for("react.memo"),Ne=Symbol.for("react.lazy"),W=Symbol.for("react.activity"),Z=Symbol.for("react.memo_cache_sentinel"),pe=Symbol.iterator;function Fe(e){return e===null||typeof e!="object"?null:(e=pe&&e[pe]||e["@@iterator"],typeof e=="function"?e:null)}var Et=Symbol.for("react.client.reference");function Ct(e){if(e==null)return null;if(typeof e=="function")return e.$$typeof===Et?null:e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case H:return"Fragment";case de:return"Profiler";case U:return"StrictMode";case ne:return"Suspense";case ye:return"SuspenseList";case W:return"Activity"}if(typeof e=="object")switch(e.$$typeof){case k:return"Portal";case J:return e.displayName||"Context";case P:return(e._context.displayName||"Context")+".Consumer";case se:var t=e.render;return e=e.displayName,e||(e=t.displayName||t.name||"",e=e!==""?"ForwardRef("+e+")":"ForwardRef"),e;case Q:return t=e.displayName||null,t!==null?t:Ct(e.type)||"Memo";case Ne:t=e._payload,e=e._init;try{return Ct(e(t))}catch{}}return null}var Dt=Array.isArray,I=s.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,j=l.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,K={pending:!1,data:null,method:null,action:null},Oe=[],we=-1;function O(e){return{current:e}}function D(e){0>we||(e.current=Oe[we],Oe[we]=null,we--)}function G(e,t){we++,Oe[we]=e.current,e.current=t}var Y=O(null),ee=O(null),ie=O(null),be=O(null);function Je(e,t){switch(G(ie,t),G(ee,e),G(Y,null),t.nodeType){case 9:case 11:e=(e=t.documentElement)&&(e=e.namespaceURI)?Vh(e):0;break;default:if(e=t.tagName,t=t.namespaceURI)t=Vh(t),e=Kh(t,e);else switch(e){case"svg":e=1;break;case"math":e=2;break;default:e=0}}D(Y),G(Y,e)}function ke(){D(Y),D(ee),D(ie)}function qa(e){e.memoizedState!==null&&G(be,e);var t=Y.current,a=Kh(t,e.type);t!==a&&(G(ee,e),G(Y,a))}function ao(e){ee.current===e&&(D(Y),D(ee)),be.current===e&&(D(be),zi._currentValue=K)}var Mr,Ac;function jn(e){if(Mr===void 0)try{throw Error()}catch(a){var t=a.stack.trim().match(/\n( *(at )?)/);Mr=t&&t[1]||"",Ac=-1<a.stack.indexOf(`
    at`)?" (<anonymous>)":-1<a.stack.indexOf("@")?"@unknown:0:0":""}return`
`+Mr+e+Ac}var Ur=!1;function jr(e,t){if(!e||Ur)return"";Ur=!0;var a=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{var i={DetermineComponentFrameRoot:function(){try{if(t){var C=function(){throw Error()};if(Object.defineProperty(C.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(C,[])}catch(R){var w=R}Reflect.construct(e,[],C)}else{try{C.call()}catch(R){w=R}e.call(C.prototype)}}else{try{throw Error()}catch(R){w=R}(C=e())&&typeof C.catch=="function"&&C.catch(function(){})}}catch(R){if(R&&w&&typeof R.stack=="string")return[R.stack,w.stack]}return[null,null]}};i.DetermineComponentFrameRoot.displayName="DetermineComponentFrameRoot";var o=Object.getOwnPropertyDescriptor(i.DetermineComponentFrameRoot,"name");o&&o.configurable&&Object.defineProperty(i.DetermineComponentFrameRoot,"name",{value:"DetermineComponentFrameRoot"});var r=i.DetermineComponentFrameRoot(),u=r[0],h=r[1];if(u&&h){var g=u.split(`
`),A=h.split(`
`);for(o=i=0;i<g.length&&!g[i].includes("DetermineComponentFrameRoot");)i++;for(;o<A.length&&!A[o].includes("DetermineComponentFrameRoot");)o++;if(i===g.length||o===A.length)for(i=g.length-1,o=A.length-1;1<=i&&0<=o&&g[i]!==A[o];)o--;for(;1<=i&&0<=o;i--,o--)if(g[i]!==A[o]){if(i!==1||o!==1)do if(i--,o--,0>o||g[i]!==A[o]){var N=`
`+g[i].replace(" at new "," at ");return e.displayName&&N.includes("<anonymous>")&&(N=N.replace("<anonymous>",e.displayName)),N}while(1<=i&&0<=o);break}}}finally{Ur=!1,Error.prepareStackTrace=a}return(a=e?e.displayName||e.name:"")?jn(a):""}function Tf(e,t){switch(e.tag){case 26:case 27:case 5:return jn(e.type);case 16:return jn("Lazy");case 13:return e.child!==t&&t!==null?jn("Suspense Fallback"):jn("Suspense");case 19:return jn("SuspenseList");case 0:case 15:return jr(e.type,!1);case 11:return jr(e.type.render,!1);case 1:return jr(e.type,!0);case 31:return jn("Activity");default:return""}}function wc(e){try{var t="",a=null;do t+=Tf(e,a),a=e,e=e.return;while(e);return t}catch(i){return`
Error generating stack: `+i.message+`
`+i.stack}}var Gr=Object.prototype.hasOwnProperty,Br=n.unstable_scheduleCallback,Pr=n.unstable_cancelCallback,Ef=n.unstable_shouldYield,Of=n.unstable_requestPaint,lt=n.unstable_now,vf=n.unstable_getCurrentPriorityLevel,Rc=n.unstable_ImmediatePriority,Fc=n.unstable_UserBlockingPriority,io=n.unstable_NormalPriority,Sf=n.unstable_LowPriority,Nc=n.unstable_IdlePriority,Af=n.log,wf=n.unstable_setDisableYieldValue,Va=null,ct=null;function pn(e){if(typeof Af=="function"&&wf(e),ct&&typeof ct.setStrictMode=="function")try{ct.setStrictMode(Va,e)}catch{}}var ut=Math.clz32?Math.clz32:Nf,Rf=Math.log,Ff=Math.LN2;function Nf(e){return e>>>=0,e===0?32:31-(Rf(e)/Ff|0)|0}var oo=256,ro=262144,so=4194304;function Gn(e){var t=e&42;if(t!==0)return t;switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:return 64;case 128:return 128;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:return e&261888;case 262144:case 524288:case 1048576:case 2097152:return e&3932160;case 4194304:case 8388608:case 16777216:case 33554432:return e&62914560;case 67108864:return 67108864;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 0;default:return e}}function lo(e,t,a){var i=e.pendingLanes;if(i===0)return 0;var o=0,r=e.suspendedLanes,u=e.pingedLanes;e=e.warmLanes;var h=i&134217727;return h!==0?(i=h&~r,i!==0?o=Gn(i):(u&=h,u!==0?o=Gn(u):a||(a=h&~e,a!==0&&(o=Gn(a))))):(h=i&~r,h!==0?o=Gn(h):u!==0?o=Gn(u):a||(a=i&~e,a!==0&&(o=Gn(a)))),o===0?0:t!==0&&t!==o&&(t&r)===0&&(r=o&-o,a=t&-t,r>=a||r===32&&(a&4194048)!==0)?t:o}function Ka(e,t){return(e.pendingLanes&~(e.suspendedLanes&~e.pingedLanes)&t)===0}function If(e,t){switch(e){case 1:case 2:case 4:case 8:case 64:return t+250;case 16:case 32:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t+5e3;case 4194304:case 8388608:case 16777216:case 33554432:return-1;case 67108864:case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function Ic(){var e=so;return so<<=1,(so&62914560)===0&&(so=4194304),e}function Yr(e){for(var t=[],a=0;31>a;a++)t.push(e);return t}function Za(e,t){e.pendingLanes|=t,t!==268435456&&(e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0)}function xf(e,t,a,i,o,r){var u=e.pendingLanes;e.pendingLanes=a,e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0,e.expiredLanes&=a,e.entangledLanes&=a,e.errorRecoveryDisabledLanes&=a,e.shellSuspendCounter=0;var h=e.entanglements,g=e.expirationTimes,A=e.hiddenUpdates;for(a=u&~a;0<a;){var N=31-ut(a),C=1<<N;h[N]=0,g[N]=-1;var w=A[N];if(w!==null)for(A[N]=null,N=0;N<w.length;N++){var R=w[N];R!==null&&(R.lane&=-536870913)}a&=~C}i!==0&&xc(e,i,0),r!==0&&o===0&&e.tag!==0&&(e.suspendedLanes|=r&~(u&~t))}function xc(e,t,a){e.pendingLanes|=t,e.suspendedLanes&=~t;var i=31-ut(t);e.entangledLanes|=t,e.entanglements[i]=e.entanglements[i]|1073741824|a&261930}function Lc(e,t){var a=e.entangledLanes|=t;for(e=e.entanglements;a;){var i=31-ut(a),o=1<<i;o&t|e[i]&t&&(e[i]|=t),a&=~o}}function Cc(e,t){var a=t&-t;return a=(a&42)!==0?1:$r(a),(a&(e.suspendedLanes|t))!==0?0:a}function $r(e){switch(e){case 2:e=1;break;case 8:e=4;break;case 32:e=16;break;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:e=128;break;case 268435456:e=134217728;break;default:e=0}return e}function Wr(e){return e&=-e,2<e?8<e?(e&134217727)!==0?32:268435456:8:2}function Dc(){var e=j.p;return e!==0?e:(e=window.event,e===void 0?32:bp(e.type))}function kc(e,t){var a=j.p;try{return j.p=e,t()}finally{j.p=a}}var fn=Math.random().toString(36).slice(2),We="__reactFiber$"+fn,tt="__reactProps$"+fn,ia="__reactContainer$"+fn,_r="__reactEvents$"+fn,Lf="__reactListeners$"+fn,Cf="__reactHandles$"+fn,Hc="__reactResources$"+fn,Qa="__reactMarker$"+fn;function qr(e){delete e[We],delete e[tt],delete e[_r],delete e[Lf],delete e[Cf]}function oa(e){var t=e[We];if(t)return t;for(var a=e.parentNode;a;){if(t=a[ia]||a[We]){if(a=t.alternate,t.child!==null||a!==null&&a.child!==null)for(e=np(e);e!==null;){if(a=e[We])return a;e=np(e)}return t}e=a,a=e.parentNode}return null}function ra(e){if(e=e[We]||e[ia]){var t=e.tag;if(t===5||t===6||t===13||t===31||t===26||t===27||t===3)return e}return null}function Xa(e){var t=e.tag;if(t===5||t===26||t===27||t===6)return e.stateNode;throw Error(c(33))}function sa(e){var t=e[Hc];return t||(t=e[Hc]={hoistableStyles:new Map,hoistableScripts:new Map}),t}function Pe(e){e[Qa]=!0}var zc=new Set,Mc={};function Bn(e,t){la(e,t),la(e+"Capture",t)}function la(e,t){for(Mc[e]=t,e=0;e<t.length;e++)zc.add(t[e])}var Df=RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"),Uc={},jc={};function kf(e){return Gr.call(jc,e)?!0:Gr.call(Uc,e)?!1:Df.test(e)?jc[e]=!0:(Uc[e]=!0,!1)}function co(e,t,a){if(kf(t))if(a===null)e.removeAttribute(t);else{switch(typeof a){case"undefined":case"function":case"symbol":e.removeAttribute(t);return;case"boolean":var i=t.toLowerCase().slice(0,5);if(i!=="data-"&&i!=="aria-"){e.removeAttribute(t);return}}e.setAttribute(t,""+a)}}function uo(e,t,a){if(a===null)e.removeAttribute(t);else{switch(typeof a){case"undefined":case"function":case"symbol":case"boolean":e.removeAttribute(t);return}e.setAttribute(t,""+a)}}function Wt(e,t,a,i){if(i===null)e.removeAttribute(a);else{switch(typeof i){case"undefined":case"function":case"symbol":case"boolean":e.removeAttribute(a);return}e.setAttributeNS(t,a,""+i)}}function Ot(e){switch(typeof e){case"bigint":case"boolean":case"number":case"string":case"undefined":return e;case"object":return e;default:return""}}function Gc(e){var t=e.type;return(e=e.nodeName)&&e.toLowerCase()==="input"&&(t==="checkbox"||t==="radio")}function Hf(e,t,a){var i=Object.getOwnPropertyDescriptor(e.constructor.prototype,t);if(!e.hasOwnProperty(t)&&typeof i<"u"&&typeof i.get=="function"&&typeof i.set=="function"){var o=i.get,r=i.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return o.call(this)},set:function(u){a=""+u,r.call(this,u)}}),Object.defineProperty(e,t,{enumerable:i.enumerable}),{getValue:function(){return a},setValue:function(u){a=""+u},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}function Vr(e){if(!e._valueTracker){var t=Gc(e)?"checked":"value";e._valueTracker=Hf(e,t,""+e[t])}}function Bc(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var a=t.getValue(),i="";return e&&(i=Gc(e)?e.checked?"true":"false":e.value),e=i,e!==a?(t.setValue(e),!0):!1}function ho(e){if(e=e||(typeof document<"u"?document:void 0),typeof e>"u")return null;try{return e.activeElement||e.body}catch{return e.body}}var zf=/[\n"\\]/g;function vt(e){return e.replace(zf,function(t){return"\\"+t.charCodeAt(0).toString(16)+" "})}function Kr(e,t,a,i,o,r,u,h){e.name="",u!=null&&typeof u!="function"&&typeof u!="symbol"&&typeof u!="boolean"?e.type=u:e.removeAttribute("type"),t!=null?u==="number"?(t===0&&e.value===""||e.value!=t)&&(e.value=""+Ot(t)):e.value!==""+Ot(t)&&(e.value=""+Ot(t)):u!=="submit"&&u!=="reset"||e.removeAttribute("value"),t!=null?Zr(e,u,Ot(t)):a!=null?Zr(e,u,Ot(a)):i!=null&&e.removeAttribute("value"),o==null&&r!=null&&(e.defaultChecked=!!r),o!=null&&(e.checked=o&&typeof o!="function"&&typeof o!="symbol"),h!=null&&typeof h!="function"&&typeof h!="symbol"&&typeof h!="boolean"?e.name=""+Ot(h):e.removeAttribute("name")}function Pc(e,t,a,i,o,r,u,h){if(r!=null&&typeof r!="function"&&typeof r!="symbol"&&typeof r!="boolean"&&(e.type=r),t!=null||a!=null){if(!(r!=="submit"&&r!=="reset"||t!=null)){Vr(e);return}a=a!=null?""+Ot(a):"",t=t!=null?""+Ot(t):a,h||t===e.value||(e.value=t),e.defaultValue=t}i=i??o,i=typeof i!="function"&&typeof i!="symbol"&&!!i,e.checked=h?e.checked:!!i,e.defaultChecked=!!i,u!=null&&typeof u!="function"&&typeof u!="symbol"&&typeof u!="boolean"&&(e.name=u),Vr(e)}function Zr(e,t,a){t==="number"&&ho(e.ownerDocument)===e||e.defaultValue===""+a||(e.defaultValue=""+a)}function ca(e,t,a,i){if(e=e.options,t){t={};for(var o=0;o<a.length;o++)t["$"+a[o]]=!0;for(a=0;a<e.length;a++)o=t.hasOwnProperty("$"+e[a].value),e[a].selected!==o&&(e[a].selected=o),o&&i&&(e[a].defaultSelected=!0)}else{for(a=""+Ot(a),t=null,o=0;o<e.length;o++){if(e[o].value===a){e[o].selected=!0,i&&(e[o].defaultSelected=!0);return}t!==null||e[o].disabled||(t=e[o])}t!==null&&(t.selected=!0)}}function Yc(e,t,a){if(t!=null&&(t=""+Ot(t),t!==e.value&&(e.value=t),a==null)){e.defaultValue!==t&&(e.defaultValue=t);return}e.defaultValue=a!=null?""+Ot(a):""}function $c(e,t,a,i){if(t==null){if(i!=null){if(a!=null)throw Error(c(92));if(Dt(i)){if(1<i.length)throw Error(c(93));i=i[0]}a=i}a==null&&(a=""),t=a}a=Ot(t),e.defaultValue=a,i=e.textContent,i===a&&i!==""&&i!==null&&(e.value=i),Vr(e)}function ua(e,t){if(t){var a=e.firstChild;if(a&&a===e.lastChild&&a.nodeType===3){a.nodeValue=t;return}}e.textContent=t}var Mf=new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));function Wc(e,t,a){var i=t.indexOf("--")===0;a==null||typeof a=="boolean"||a===""?i?e.setProperty(t,""):t==="float"?e.cssFloat="":e[t]="":i?e.setProperty(t,a):typeof a!="number"||a===0||Mf.has(t)?t==="float"?e.cssFloat=a:e[t]=(""+a).trim():e[t]=a+"px"}function _c(e,t,a){if(t!=null&&typeof t!="object")throw Error(c(62));if(e=e.style,a!=null){for(var i in a)!a.hasOwnProperty(i)||t!=null&&t.hasOwnProperty(i)||(i.indexOf("--")===0?e.setProperty(i,""):i==="float"?e.cssFloat="":e[i]="");for(var o in t)i=t[o],t.hasOwnProperty(o)&&a[o]!==i&&Wc(e,o,i)}else for(var r in t)t.hasOwnProperty(r)&&Wc(e,r,t[r])}function Qr(e){if(e.indexOf("-")===-1)return!1;switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var Uf=new Map([["acceptCharset","accept-charset"],["htmlFor","for"],["httpEquiv","http-equiv"],["crossOrigin","crossorigin"],["accentHeight","accent-height"],["alignmentBaseline","alignment-baseline"],["arabicForm","arabic-form"],["baselineShift","baseline-shift"],["capHeight","cap-height"],["clipPath","clip-path"],["clipRule","clip-rule"],["colorInterpolation","color-interpolation"],["colorInterpolationFilters","color-interpolation-filters"],["colorProfile","color-profile"],["colorRendering","color-rendering"],["dominantBaseline","dominant-baseline"],["enableBackground","enable-background"],["fillOpacity","fill-opacity"],["fillRule","fill-rule"],["floodColor","flood-color"],["floodOpacity","flood-opacity"],["fontFamily","font-family"],["fontSize","font-size"],["fontSizeAdjust","font-size-adjust"],["fontStretch","font-stretch"],["fontStyle","font-style"],["fontVariant","font-variant"],["fontWeight","font-weight"],["glyphName","glyph-name"],["glyphOrientationHorizontal","glyph-orientation-horizontal"],["glyphOrientationVertical","glyph-orientation-vertical"],["horizAdvX","horiz-adv-x"],["horizOriginX","horiz-origin-x"],["imageRendering","image-rendering"],["letterSpacing","letter-spacing"],["lightingColor","lighting-color"],["markerEnd","marker-end"],["markerMid","marker-mid"],["markerStart","marker-start"],["overlinePosition","overline-position"],["overlineThickness","overline-thickness"],["paintOrder","paint-order"],["panose-1","panose-1"],["pointerEvents","pointer-events"],["renderingIntent","rendering-intent"],["shapeRendering","shape-rendering"],["stopColor","stop-color"],["stopOpacity","stop-opacity"],["strikethroughPosition","strikethrough-position"],["strikethroughThickness","strikethrough-thickness"],["strokeDasharray","stroke-dasharray"],["strokeDashoffset","stroke-dashoffset"],["strokeLinecap","stroke-linecap"],["strokeLinejoin","stroke-linejoin"],["strokeMiterlimit","stroke-miterlimit"],["strokeOpacity","stroke-opacity"],["strokeWidth","stroke-width"],["textAnchor","text-anchor"],["textDecoration","text-decoration"],["textRendering","text-rendering"],["transformOrigin","transform-origin"],["underlinePosition","underline-position"],["underlineThickness","underline-thickness"],["unicodeBidi","unicode-bidi"],["unicodeRange","unicode-range"],["unitsPerEm","units-per-em"],["vAlphabetic","v-alphabetic"],["vHanging","v-hanging"],["vIdeographic","v-ideographic"],["vMathematical","v-mathematical"],["vectorEffect","vector-effect"],["vertAdvY","vert-adv-y"],["vertOriginX","vert-origin-x"],["vertOriginY","vert-origin-y"],["wordSpacing","word-spacing"],["writingMode","writing-mode"],["xmlnsXlink","xmlns:xlink"],["xHeight","x-height"]]),jf=/^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;function po(e){return jf.test(""+e)?"javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')":e}function _t(){}var Xr=null;function Jr(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var da=null,ha=null;function qc(e){var t=ra(e);if(t&&(e=t.stateNode)){var a=e[tt]||null;e:switch(e=t.stateNode,t.type){case"input":if(Kr(e,a.value,a.defaultValue,a.defaultValue,a.checked,a.defaultChecked,a.type,a.name),t=a.name,a.type==="radio"&&t!=null){for(a=e;a.parentNode;)a=a.parentNode;for(a=a.querySelectorAll('input[name="'+vt(""+t)+'"][type="radio"]'),t=0;t<a.length;t++){var i=a[t];if(i!==e&&i.form===e.form){var o=i[tt]||null;if(!o)throw Error(c(90));Kr(i,o.value,o.defaultValue,o.defaultValue,o.checked,o.defaultChecked,o.type,o.name)}}for(t=0;t<a.length;t++)i=a[t],i.form===e.form&&Bc(i)}break e;case"textarea":Yc(e,a.value,a.defaultValue);break e;case"select":t=a.value,t!=null&&ca(e,!!a.multiple,t,!1)}}}var es=!1;function Vc(e,t,a){if(es)return e(t,a);es=!0;try{var i=e(t);return i}finally{if(es=!1,(da!==null||ha!==null)&&(er(),da&&(t=da,e=ha,ha=da=null,qc(t),e)))for(t=0;t<e.length;t++)qc(e[t])}}function Ja(e,t){var a=e.stateNode;if(a===null)return null;var i=a[tt]||null;if(i===null)return null;a=i[t];e:switch(t){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(i=!i.disabled)||(e=e.type,i=!(e==="button"||e==="input"||e==="select"||e==="textarea")),e=!i;break e;default:e=!1}if(e)return null;if(a&&typeof a!="function")throw Error(c(231,t,typeof a));return a}var qt=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),ts=!1;if(qt)try{var ei={};Object.defineProperty(ei,"passive",{get:function(){ts=!0}}),window.addEventListener("test",ei,ei),window.removeEventListener("test",ei,ei)}catch{ts=!1}var mn=null,ns=null,fo=null;function Kc(){if(fo)return fo;var e,t=ns,a=t.length,i,o="value"in mn?mn.value:mn.textContent,r=o.length;for(e=0;e<a&&t[e]===o[e];e++);var u=a-e;for(i=1;i<=u&&t[a-i]===o[r-i];i++);return fo=o.slice(e,1<i?1-i:void 0)}function mo(e){var t=e.keyCode;return"charCode"in e?(e=e.charCode,e===0&&t===13&&(e=13)):e=t,e===10&&(e=13),32<=e||e===13?e:0}function go(){return!0}function Zc(){return!1}function nt(e){function t(a,i,o,r,u){this._reactName=a,this._targetInst=o,this.type=i,this.nativeEvent=r,this.target=u,this.currentTarget=null;for(var h in e)e.hasOwnProperty(h)&&(a=e[h],this[h]=a?a(r):r[h]);return this.isDefaultPrevented=(r.defaultPrevented!=null?r.defaultPrevented:r.returnValue===!1)?go:Zc,this.isPropagationStopped=Zc,this}return M(t.prototype,{preventDefault:function(){this.defaultPrevented=!0;var a=this.nativeEvent;a&&(a.preventDefault?a.preventDefault():typeof a.returnValue!="unknown"&&(a.returnValue=!1),this.isDefaultPrevented=go)},stopPropagation:function(){var a=this.nativeEvent;a&&(a.stopPropagation?a.stopPropagation():typeof a.cancelBubble!="unknown"&&(a.cancelBubble=!0),this.isPropagationStopped=go)},persist:function(){},isPersistent:go}),t}var Pn={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},yo=nt(Pn),ti=M({},Pn,{view:0,detail:0}),Gf=nt(ti),as,is,ni,bo=M({},ti,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:rs,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return"movementX"in e?e.movementX:(e!==ni&&(ni&&e.type==="mousemove"?(as=e.screenX-ni.screenX,is=e.screenY-ni.screenY):is=as=0,ni=e),as)},movementY:function(e){return"movementY"in e?e.movementY:is}}),Qc=nt(bo),Bf=M({},bo,{dataTransfer:0}),Pf=nt(Bf),Yf=M({},ti,{relatedTarget:0}),os=nt(Yf),$f=M({},Pn,{animationName:0,elapsedTime:0,pseudoElement:0}),Wf=nt($f),_f=M({},Pn,{clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),qf=nt(_f),Vf=M({},Pn,{data:0}),Xc=nt(Vf),Kf={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},Zf={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},Qf={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function Xf(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):(e=Qf[e])?!!t[e]:!1}function rs(){return Xf}var Jf=M({},ti,{key:function(e){if(e.key){var t=Kf[e.key]||e.key;if(t!=="Unidentified")return t}return e.type==="keypress"?(e=mo(e),e===13?"Enter":String.fromCharCode(e)):e.type==="keydown"||e.type==="keyup"?Zf[e.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:rs,charCode:function(e){return e.type==="keypress"?mo(e):0},keyCode:function(e){return e.type==="keydown"||e.type==="keyup"?e.keyCode:0},which:function(e){return e.type==="keypress"?mo(e):e.type==="keydown"||e.type==="keyup"?e.keyCode:0}}),em=nt(Jf),tm=M({},bo,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),Jc=nt(tm),nm=M({},ti,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:rs}),am=nt(nm),im=M({},Pn,{propertyName:0,elapsedTime:0,pseudoElement:0}),om=nt(im),rm=M({},bo,{deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0}),sm=nt(rm),lm=M({},Pn,{newState:0,oldState:0}),cm=nt(lm),um=[9,13,27,32],ss=qt&&"CompositionEvent"in window,ai=null;qt&&"documentMode"in document&&(ai=document.documentMode);var dm=qt&&"TextEvent"in window&&!ai,eu=qt&&(!ss||ai&&8<ai&&11>=ai),tu=" ",nu=!1;function au(e,t){switch(e){case"keyup":return um.indexOf(t.keyCode)!==-1;case"keydown":return t.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function iu(e){return e=e.detail,typeof e=="object"&&"data"in e?e.data:null}var pa=!1;function hm(e,t){switch(e){case"compositionend":return iu(t);case"keypress":return t.which!==32?null:(nu=!0,tu);case"textInput":return e=t.data,e===tu&&nu?null:e;default:return null}}function pm(e,t){if(pa)return e==="compositionend"||!ss&&au(e,t)?(e=Kc(),fo=ns=mn=null,pa=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case"compositionend":return eu&&t.locale!=="ko"?null:t.data;default:return null}}var fm={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function ou(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t==="input"?!!fm[e.type]:t==="textarea"}function ru(e,t,a,i){da?ha?ha.push(i):ha=[i]:da=i,t=sr(t,"onChange"),0<t.length&&(a=new yo("onChange","change",null,a,i),e.push({event:a,listeners:t}))}var ii=null,oi=null;function mm(e){Ph(e,0)}function To(e){var t=Xa(e);if(Bc(t))return e}function su(e,t){if(e==="change")return t}var lu=!1;if(qt){var ls;if(qt){var cs="oninput"in document;if(!cs){var cu=document.createElement("div");cu.setAttribute("oninput","return;"),cs=typeof cu.oninput=="function"}ls=cs}else ls=!1;lu=ls&&(!document.documentMode||9<document.documentMode)}function uu(){ii&&(ii.detachEvent("onpropertychange",du),oi=ii=null)}function du(e){if(e.propertyName==="value"&&To(oi)){var t=[];ru(t,oi,e,Jr(e)),Vc(mm,t)}}function gm(e,t,a){e==="focusin"?(uu(),ii=t,oi=a,ii.attachEvent("onpropertychange",du)):e==="focusout"&&uu()}function ym(e){if(e==="selectionchange"||e==="keyup"||e==="keydown")return To(oi)}function bm(e,t){if(e==="click")return To(t)}function Tm(e,t){if(e==="input"||e==="change")return To(t)}function Em(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}var dt=typeof Object.is=="function"?Object.is:Em;function ri(e,t){if(dt(e,t))return!0;if(typeof e!="object"||e===null||typeof t!="object"||t===null)return!1;var a=Object.keys(e),i=Object.keys(t);if(a.length!==i.length)return!1;for(i=0;i<a.length;i++){var o=a[i];if(!Gr.call(t,o)||!dt(e[o],t[o]))return!1}return!0}function hu(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function pu(e,t){var a=hu(e);e=0;for(var i;a;){if(a.nodeType===3){if(i=e+a.textContent.length,e<=t&&i>=t)return{node:a,offset:t-e};e=i}e:{for(;a;){if(a.nextSibling){a=a.nextSibling;break e}a=a.parentNode}a=void 0}a=hu(a)}}function fu(e,t){return e&&t?e===t?!0:e&&e.nodeType===3?!1:t&&t.nodeType===3?fu(e,t.parentNode):"contains"in e?e.contains(t):e.compareDocumentPosition?!!(e.compareDocumentPosition(t)&16):!1:!1}function mu(e){e=e!=null&&e.ownerDocument!=null&&e.ownerDocument.defaultView!=null?e.ownerDocument.defaultView:window;for(var t=ho(e.document);t instanceof e.HTMLIFrameElement;){try{var a=typeof t.contentWindow.location.href=="string"}catch{a=!1}if(a)e=t.contentWindow;else break;t=ho(e.document)}return t}function us(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&(t==="input"&&(e.type==="text"||e.type==="search"||e.type==="tel"||e.type==="url"||e.type==="password")||t==="textarea"||e.contentEditable==="true")}var Om=qt&&"documentMode"in document&&11>=document.documentMode,fa=null,ds=null,si=null,hs=!1;function gu(e,t,a){var i=a.window===a?a.document:a.nodeType===9?a:a.ownerDocument;hs||fa==null||fa!==ho(i)||(i=fa,"selectionStart"in i&&us(i)?i={start:i.selectionStart,end:i.selectionEnd}:(i=(i.ownerDocument&&i.ownerDocument.defaultView||window).getSelection(),i={anchorNode:i.anchorNode,anchorOffset:i.anchorOffset,focusNode:i.focusNode,focusOffset:i.focusOffset}),si&&ri(si,i)||(si=i,i=sr(ds,"onSelect"),0<i.length&&(t=new yo("onSelect","select",null,t,a),e.push({event:t,listeners:i}),t.target=fa)))}function Yn(e,t){var a={};return a[e.toLowerCase()]=t.toLowerCase(),a["Webkit"+e]="webkit"+t,a["Moz"+e]="moz"+t,a}var ma={animationend:Yn("Animation","AnimationEnd"),animationiteration:Yn("Animation","AnimationIteration"),animationstart:Yn("Animation","AnimationStart"),transitionrun:Yn("Transition","TransitionRun"),transitionstart:Yn("Transition","TransitionStart"),transitioncancel:Yn("Transition","TransitionCancel"),transitionend:Yn("Transition","TransitionEnd")},ps={},yu={};qt&&(yu=document.createElement("div").style,"AnimationEvent"in window||(delete ma.animationend.animation,delete ma.animationiteration.animation,delete ma.animationstart.animation),"TransitionEvent"in window||delete ma.transitionend.transition);function $n(e){if(ps[e])return ps[e];if(!ma[e])return e;var t=ma[e],a;for(a in t)if(t.hasOwnProperty(a)&&a in yu)return ps[e]=t[a];return e}var bu=$n("animationend"),Tu=$n("animationiteration"),Eu=$n("animationstart"),vm=$n("transitionrun"),Sm=$n("transitionstart"),Am=$n("transitioncancel"),Ou=$n("transitionend"),vu=new Map,fs="abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");fs.push("scrollEnd");function kt(e,t){vu.set(e,t),Bn(t,[e])}var Eo=typeof reportError=="function"?reportError:function(e){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var t=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof e=="object"&&e!==null&&typeof e.message=="string"?String(e.message):String(e),error:e});if(!window.dispatchEvent(t))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",e);return}console.error(e)},St=[],ga=0,ms=0;function Oo(){for(var e=ga,t=ms=ga=0;t<e;){var a=St[t];St[t++]=null;var i=St[t];St[t++]=null;var o=St[t];St[t++]=null;var r=St[t];if(St[t++]=null,i!==null&&o!==null){var u=i.pending;u===null?o.next=o:(o.next=u.next,u.next=o),i.pending=o}r!==0&&Su(a,o,r)}}function vo(e,t,a,i){St[ga++]=e,St[ga++]=t,St[ga++]=a,St[ga++]=i,ms|=i,e.lanes|=i,e=e.alternate,e!==null&&(e.lanes|=i)}function gs(e,t,a,i){return vo(e,t,a,i),So(e)}function Wn(e,t){return vo(e,null,null,t),So(e)}function Su(e,t,a){e.lanes|=a;var i=e.alternate;i!==null&&(i.lanes|=a);for(var o=!1,r=e.return;r!==null;)r.childLanes|=a,i=r.alternate,i!==null&&(i.childLanes|=a),r.tag===22&&(e=r.stateNode,e===null||e._visibility&1||(o=!0)),e=r,r=r.return;return e.tag===3?(r=e.stateNode,o&&t!==null&&(o=31-ut(a),e=r.hiddenUpdates,i=e[o],i===null?e[o]=[t]:i.push(t),t.lane=a|536870912),r):null}function So(e){if(50<Ii)throw Ii=0,wl=null,Error(c(185));for(var t=e.return;t!==null;)e=t,t=e.return;return e.tag===3?e.stateNode:null}var ya={};function wm(e,t,a,i){this.tag=e,this.key=a,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.refCleanup=this.ref=null,this.pendingProps=t,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=i,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function ht(e,t,a,i){return new wm(e,t,a,i)}function ys(e){return e=e.prototype,!(!e||!e.isReactComponent)}function Vt(e,t){var a=e.alternate;return a===null?(a=ht(e.tag,t,e.key,e.mode),a.elementType=e.elementType,a.type=e.type,a.stateNode=e.stateNode,a.alternate=e,e.alternate=a):(a.pendingProps=t,a.type=e.type,a.flags=0,a.subtreeFlags=0,a.deletions=null),a.flags=e.flags&65011712,a.childLanes=e.childLanes,a.lanes=e.lanes,a.child=e.child,a.memoizedProps=e.memoizedProps,a.memoizedState=e.memoizedState,a.updateQueue=e.updateQueue,t=e.dependencies,a.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext},a.sibling=e.sibling,a.index=e.index,a.ref=e.ref,a.refCleanup=e.refCleanup,a}function Au(e,t){e.flags&=65011714;var a=e.alternate;return a===null?(e.childLanes=0,e.lanes=t,e.child=null,e.subtreeFlags=0,e.memoizedProps=null,e.memoizedState=null,e.updateQueue=null,e.dependencies=null,e.stateNode=null):(e.childLanes=a.childLanes,e.lanes=a.lanes,e.child=a.child,e.subtreeFlags=0,e.deletions=null,e.memoizedProps=a.memoizedProps,e.memoizedState=a.memoizedState,e.updateQueue=a.updateQueue,e.type=a.type,t=a.dependencies,e.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext}),e}function Ao(e,t,a,i,o,r){var u=0;if(i=e,typeof e=="function")ys(e)&&(u=1);else if(typeof e=="string")u=xg(e,a,Y.current)?26:e==="html"||e==="head"||e==="body"?27:5;else e:switch(e){case W:return e=ht(31,a,t,o),e.elementType=W,e.lanes=r,e;case H:return _n(a.children,o,r,t);case U:u=8,o|=24;break;case de:return e=ht(12,a,t,o|2),e.elementType=de,e.lanes=r,e;case ne:return e=ht(13,a,t,o),e.elementType=ne,e.lanes=r,e;case ye:return e=ht(19,a,t,o),e.elementType=ye,e.lanes=r,e;default:if(typeof e=="object"&&e!==null)switch(e.$$typeof){case J:u=10;break e;case P:u=9;break e;case se:u=11;break e;case Q:u=14;break e;case Ne:u=16,i=null;break e}u=29,a=Error(c(130,e===null?"null":typeof e,"")),i=null}return t=ht(u,a,t,o),t.elementType=e,t.type=i,t.lanes=r,t}function _n(e,t,a,i){return e=ht(7,e,i,t),e.lanes=a,e}function bs(e,t,a){return e=ht(6,e,null,t),e.lanes=a,e}function wu(e){var t=ht(18,null,null,0);return t.stateNode=e,t}function Ts(e,t,a){return t=ht(4,e.children!==null?e.children:[],e.key,t),t.lanes=a,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}var Ru=new WeakMap;function At(e,t){if(typeof e=="object"&&e!==null){var a=Ru.get(e);return a!==void 0?a:(t={value:e,source:t,stack:wc(t)},Ru.set(e,t),t)}return{value:e,source:t,stack:wc(t)}}var ba=[],Ta=0,wo=null,li=0,wt=[],Rt=0,gn=null,Gt=1,Bt="";function Kt(e,t){ba[Ta++]=li,ba[Ta++]=wo,wo=e,li=t}function Fu(e,t,a){wt[Rt++]=Gt,wt[Rt++]=Bt,wt[Rt++]=gn,gn=e;var i=Gt;e=Bt;var o=32-ut(i)-1;i&=~(1<<o),a+=1;var r=32-ut(t)+o;if(30<r){var u=o-o%5;r=(i&(1<<u)-1).toString(32),i>>=u,o-=u,Gt=1<<32-ut(t)+o|a<<o|i,Bt=r+e}else Gt=1<<r|a<<o|i,Bt=e}function Es(e){e.return!==null&&(Kt(e,1),Fu(e,1,0))}function Os(e){for(;e===wo;)wo=ba[--Ta],ba[Ta]=null,li=ba[--Ta],ba[Ta]=null;for(;e===gn;)gn=wt[--Rt],wt[Rt]=null,Bt=wt[--Rt],wt[Rt]=null,Gt=wt[--Rt],wt[Rt]=null}function Nu(e,t){wt[Rt++]=Gt,wt[Rt++]=Bt,wt[Rt++]=gn,Gt=t.id,Bt=t.overflow,gn=e}var _e=null,Ie=null,ue=!1,yn=null,Ft=!1,vs=Error(c(519));function bn(e){var t=Error(c(418,1<arguments.length&&arguments[1]!==void 0&&arguments[1]?"text":"HTML",""));throw ci(At(t,e)),vs}function Iu(e){var t=e.stateNode,a=e.type,i=e.memoizedProps;switch(t[We]=e,t[tt]=i,a){case"dialog":re("cancel",t),re("close",t);break;case"iframe":case"object":case"embed":re("load",t);break;case"video":case"audio":for(a=0;a<Li.length;a++)re(Li[a],t);break;case"source":re("error",t);break;case"img":case"image":case"link":re("error",t),re("load",t);break;case"details":re("toggle",t);break;case"input":re("invalid",t),Pc(t,i.value,i.defaultValue,i.checked,i.defaultChecked,i.type,i.name,!0);break;case"select":re("invalid",t);break;case"textarea":re("invalid",t),$c(t,i.value,i.defaultValue,i.children)}a=i.children,typeof a!="string"&&typeof a!="number"&&typeof a!="bigint"||t.textContent===""+a||i.suppressHydrationWarning===!0||_h(t.textContent,a)?(i.popover!=null&&(re("beforetoggle",t),re("toggle",t)),i.onScroll!=null&&re("scroll",t),i.onScrollEnd!=null&&re("scrollend",t),i.onClick!=null&&(t.onclick=_t),t=!0):t=!1,t||bn(e,!0)}function xu(e){for(_e=e.return;_e;)switch(_e.tag){case 5:case 31:case 13:Ft=!1;return;case 27:case 3:Ft=!0;return;default:_e=_e.return}}function Ea(e){if(e!==_e)return!1;if(!ue)return xu(e),ue=!0,!1;var t=e.tag,a;if((a=t!==3&&t!==27)&&((a=t===5)&&(a=e.type,a=!(a!=="form"&&a!=="button")||Gl(e.type,e.memoizedProps)),a=!a),a&&Ie&&bn(e),xu(e),t===13){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(c(317));Ie=tp(e)}else if(t===31){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(c(317));Ie=tp(e)}else t===27?(t=Ie,Cn(e.type)?(e=Wl,Wl=null,Ie=e):Ie=t):Ie=_e?It(e.stateNode.nextSibling):null;return!0}function qn(){Ie=_e=null,ue=!1}function Ss(){var e=yn;return e!==null&&(rt===null?rt=e:rt.push.apply(rt,e),yn=null),e}function ci(e){yn===null?yn=[e]:yn.push(e)}var As=O(null),Vn=null,Zt=null;function Tn(e,t,a){G(As,t._currentValue),t._currentValue=a}function Qt(e){e._currentValue=As.current,D(As)}function ws(e,t,a){for(;e!==null;){var i=e.alternate;if((e.childLanes&t)!==t?(e.childLanes|=t,i!==null&&(i.childLanes|=t)):i!==null&&(i.childLanes&t)!==t&&(i.childLanes|=t),e===a)break;e=e.return}}function Rs(e,t,a,i){var o=e.child;for(o!==null&&(o.return=e);o!==null;){var r=o.dependencies;if(r!==null){var u=o.child;r=r.firstContext;e:for(;r!==null;){var h=r;r=o;for(var g=0;g<t.length;g++)if(h.context===t[g]){r.lanes|=a,h=r.alternate,h!==null&&(h.lanes|=a),ws(r.return,a,e),i||(u=null);break e}r=h.next}}else if(o.tag===18){if(u=o.return,u===null)throw Error(c(341));u.lanes|=a,r=u.alternate,r!==null&&(r.lanes|=a),ws(u,a,e),u=null}else u=o.child;if(u!==null)u.return=o;else for(u=o;u!==null;){if(u===e){u=null;break}if(o=u.sibling,o!==null){o.return=u.return,u=o;break}u=u.return}o=u}}function Oa(e,t,a,i){e=null;for(var o=t,r=!1;o!==null;){if(!r){if((o.flags&524288)!==0)r=!0;else if((o.flags&262144)!==0)break}if(o.tag===10){var u=o.alternate;if(u===null)throw Error(c(387));if(u=u.memoizedProps,u!==null){var h=o.type;dt(o.pendingProps.value,u.value)||(e!==null?e.push(h):e=[h])}}else if(o===be.current){if(u=o.alternate,u===null)throw Error(c(387));u.memoizedState.memoizedState!==o.memoizedState.memoizedState&&(e!==null?e.push(zi):e=[zi])}o=o.return}e!==null&&Rs(t,e,a,i),t.flags|=262144}function Ro(e){for(e=e.firstContext;e!==null;){if(!dt(e.context._currentValue,e.memoizedValue))return!0;e=e.next}return!1}function Kn(e){Vn=e,Zt=null,e=e.dependencies,e!==null&&(e.firstContext=null)}function qe(e){return Lu(Vn,e)}function Fo(e,t){return Vn===null&&Kn(e),Lu(e,t)}function Lu(e,t){var a=t._currentValue;if(t={context:t,memoizedValue:a,next:null},Zt===null){if(e===null)throw Error(c(308));Zt=t,e.dependencies={lanes:0,firstContext:t},e.flags|=524288}else Zt=Zt.next=t;return a}var Rm=typeof AbortController<"u"?AbortController:function(){var e=[],t=this.signal={aborted:!1,addEventListener:function(a,i){e.push(i)}};this.abort=function(){t.aborted=!0,e.forEach(function(a){return a()})}},Fm=n.unstable_scheduleCallback,Nm=n.unstable_NormalPriority,Me={$$typeof:J,Consumer:null,Provider:null,_currentValue:null,_currentValue2:null,_threadCount:0};function Fs(){return{controller:new Rm,data:new Map,refCount:0}}function ui(e){e.refCount--,e.refCount===0&&Fm(Nm,function(){e.controller.abort()})}var di=null,Ns=0,va=0,Sa=null;function Im(e,t){if(di===null){var a=di=[];Ns=0,va=Ll(),Sa={status:"pending",value:void 0,then:function(i){a.push(i)}}}return Ns++,t.then(Cu,Cu),t}function Cu(){if(--Ns===0&&di!==null){Sa!==null&&(Sa.status="fulfilled");var e=di;di=null,va=0,Sa=null;for(var t=0;t<e.length;t++)(0,e[t])()}}function xm(e,t){var a=[],i={status:"pending",value:null,reason:null,then:function(o){a.push(o)}};return e.then(function(){i.status="fulfilled",i.value=t;for(var o=0;o<a.length;o++)(0,a[o])(t)},function(o){for(i.status="rejected",i.reason=o,o=0;o<a.length;o++)(0,a[o])(void 0)}),i}var Du=I.S;I.S=function(e,t){gh=lt(),typeof t=="object"&&t!==null&&typeof t.then=="function"&&Im(e,t),Du!==null&&Du(e,t)};var Zn=O(null);function Is(){var e=Zn.current;return e!==null?e:Re.pooledCache}function No(e,t){t===null?G(Zn,Zn.current):G(Zn,t.pool)}function ku(){var e=Is();return e===null?null:{parent:Me._currentValue,pool:e}}var Aa=Error(c(460)),xs=Error(c(474)),Io=Error(c(542)),xo={then:function(){}};function Hu(e){return e=e.status,e==="fulfilled"||e==="rejected"}function zu(e,t,a){switch(a=e[a],a===void 0?e.push(t):a!==t&&(t.then(_t,_t),t=a),t.status){case"fulfilled":return t.value;case"rejected":throw e=t.reason,Uu(e),e;default:if(typeof t.status=="string")t.then(_t,_t);else{if(e=Re,e!==null&&100<e.shellSuspendCounter)throw Error(c(482));e=t,e.status="pending",e.then(function(i){if(t.status==="pending"){var o=t;o.status="fulfilled",o.value=i}},function(i){if(t.status==="pending"){var o=t;o.status="rejected",o.reason=i}})}switch(t.status){case"fulfilled":return t.value;case"rejected":throw e=t.reason,Uu(e),e}throw Xn=t,Aa}}function Qn(e){try{var t=e._init;return t(e._payload)}catch(a){throw a!==null&&typeof a=="object"&&typeof a.then=="function"?(Xn=a,Aa):a}}var Xn=null;function Mu(){if(Xn===null)throw Error(c(459));var e=Xn;return Xn=null,e}function Uu(e){if(e===Aa||e===Io)throw Error(c(483))}var wa=null,hi=0;function Lo(e){var t=hi;return hi+=1,wa===null&&(wa=[]),zu(wa,e,t)}function pi(e,t){t=t.props.ref,e.ref=t!==void 0?t:null}function Co(e,t){throw t.$$typeof===F?Error(c(525)):(e=Object.prototype.toString.call(t),Error(c(31,e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e)))}function ju(e){function t(v,T){if(e){var S=v.deletions;S===null?(v.deletions=[T],v.flags|=16):S.push(T)}}function a(v,T){if(!e)return null;for(;T!==null;)t(v,T),T=T.sibling;return null}function i(v){for(var T=new Map;v!==null;)v.key!==null?T.set(v.key,v):T.set(v.index,v),v=v.sibling;return T}function o(v,T){return v=Vt(v,T),v.index=0,v.sibling=null,v}function r(v,T,S){return v.index=S,e?(S=v.alternate,S!==null?(S=S.index,S<T?(v.flags|=67108866,T):S):(v.flags|=67108866,T)):(v.flags|=1048576,T)}function u(v){return e&&v.alternate===null&&(v.flags|=67108866),v}function h(v,T,S,x){return T===null||T.tag!==6?(T=bs(S,v.mode,x),T.return=v,T):(T=o(T,S),T.return=v,T)}function g(v,T,S,x){var _=S.type;return _===H?N(v,T,S.props.children,x,S.key):T!==null&&(T.elementType===_||typeof _=="object"&&_!==null&&_.$$typeof===Ne&&Qn(_)===T.type)?(T=o(T,S.props),pi(T,S),T.return=v,T):(T=Ao(S.type,S.key,S.props,null,v.mode,x),pi(T,S),T.return=v,T)}function A(v,T,S,x){return T===null||T.tag!==4||T.stateNode.containerInfo!==S.containerInfo||T.stateNode.implementation!==S.implementation?(T=Ts(S,v.mode,x),T.return=v,T):(T=o(T,S.children||[]),T.return=v,T)}function N(v,T,S,x,_){return T===null||T.tag!==7?(T=_n(S,v.mode,x,_),T.return=v,T):(T=o(T,S),T.return=v,T)}function C(v,T,S){if(typeof T=="string"&&T!==""||typeof T=="number"||typeof T=="bigint")return T=bs(""+T,v.mode,S),T.return=v,T;if(typeof T=="object"&&T!==null){switch(T.$$typeof){case L:return S=Ao(T.type,T.key,T.props,null,v.mode,S),pi(S,T),S.return=v,S;case k:return T=Ts(T,v.mode,S),T.return=v,T;case Ne:return T=Qn(T),C(v,T,S)}if(Dt(T)||Fe(T))return T=_n(T,v.mode,S,null),T.return=v,T;if(typeof T.then=="function")return C(v,Lo(T),S);if(T.$$typeof===J)return C(v,Fo(v,T),S);Co(v,T)}return null}function w(v,T,S,x){var _=T!==null?T.key:null;if(typeof S=="string"&&S!==""||typeof S=="number"||typeof S=="bigint")return _!==null?null:h(v,T,""+S,x);if(typeof S=="object"&&S!==null){switch(S.$$typeof){case L:return S.key===_?g(v,T,S,x):null;case k:return S.key===_?A(v,T,S,x):null;case Ne:return S=Qn(S),w(v,T,S,x)}if(Dt(S)||Fe(S))return _!==null?null:N(v,T,S,x,null);if(typeof S.then=="function")return w(v,T,Lo(S),x);if(S.$$typeof===J)return w(v,T,Fo(v,S),x);Co(v,S)}return null}function R(v,T,S,x,_){if(typeof x=="string"&&x!==""||typeof x=="number"||typeof x=="bigint")return v=v.get(S)||null,h(T,v,""+x,_);if(typeof x=="object"&&x!==null){switch(x.$$typeof){case L:return v=v.get(x.key===null?S:x.key)||null,g(T,v,x,_);case k:return v=v.get(x.key===null?S:x.key)||null,A(T,v,x,_);case Ne:return x=Qn(x),R(v,T,S,x,_)}if(Dt(x)||Fe(x))return v=v.get(S)||null,N(T,v,x,_,null);if(typeof x.then=="function")return R(v,T,S,Lo(x),_);if(x.$$typeof===J)return R(v,T,S,Fo(T,x),_);Co(T,x)}return null}function B(v,T,S,x){for(var _=null,fe=null,$=T,ae=T=0,ce=null;$!==null&&ae<S.length;ae++){$.index>ae?(ce=$,$=null):ce=$.sibling;var me=w(v,$,S[ae],x);if(me===null){$===null&&($=ce);break}e&&$&&me.alternate===null&&t(v,$),T=r(me,T,ae),fe===null?_=me:fe.sibling=me,fe=me,$=ce}if(ae===S.length)return a(v,$),ue&&Kt(v,ae),_;if($===null){for(;ae<S.length;ae++)$=C(v,S[ae],x),$!==null&&(T=r($,T,ae),fe===null?_=$:fe.sibling=$,fe=$);return ue&&Kt(v,ae),_}for($=i($);ae<S.length;ae++)ce=R($,v,ae,S[ae],x),ce!==null&&(e&&ce.alternate!==null&&$.delete(ce.key===null?ae:ce.key),T=r(ce,T,ae),fe===null?_=ce:fe.sibling=ce,fe=ce);return e&&$.forEach(function(Mn){return t(v,Mn)}),ue&&Kt(v,ae),_}function V(v,T,S,x){if(S==null)throw Error(c(151));for(var _=null,fe=null,$=T,ae=T=0,ce=null,me=S.next();$!==null&&!me.done;ae++,me=S.next()){$.index>ae?(ce=$,$=null):ce=$.sibling;var Mn=w(v,$,me.value,x);if(Mn===null){$===null&&($=ce);break}e&&$&&Mn.alternate===null&&t(v,$),T=r(Mn,T,ae),fe===null?_=Mn:fe.sibling=Mn,fe=Mn,$=ce}if(me.done)return a(v,$),ue&&Kt(v,ae),_;if($===null){for(;!me.done;ae++,me=S.next())me=C(v,me.value,x),me!==null&&(T=r(me,T,ae),fe===null?_=me:fe.sibling=me,fe=me);return ue&&Kt(v,ae),_}for($=i($);!me.done;ae++,me=S.next())me=R($,v,ae,me.value,x),me!==null&&(e&&me.alternate!==null&&$.delete(me.key===null?ae:me.key),T=r(me,T,ae),fe===null?_=me:fe.sibling=me,fe=me);return e&&$.forEach(function(Bg){return t(v,Bg)}),ue&&Kt(v,ae),_}function Ae(v,T,S,x){if(typeof S=="object"&&S!==null&&S.type===H&&S.key===null&&(S=S.props.children),typeof S=="object"&&S!==null){switch(S.$$typeof){case L:e:{for(var _=S.key;T!==null;){if(T.key===_){if(_=S.type,_===H){if(T.tag===7){a(v,T.sibling),x=o(T,S.props.children),x.return=v,v=x;break e}}else if(T.elementType===_||typeof _=="object"&&_!==null&&_.$$typeof===Ne&&Qn(_)===T.type){a(v,T.sibling),x=o(T,S.props),pi(x,S),x.return=v,v=x;break e}a(v,T);break}else t(v,T);T=T.sibling}S.type===H?(x=_n(S.props.children,v.mode,x,S.key),x.return=v,v=x):(x=Ao(S.type,S.key,S.props,null,v.mode,x),pi(x,S),x.return=v,v=x)}return u(v);case k:e:{for(_=S.key;T!==null;){if(T.key===_)if(T.tag===4&&T.stateNode.containerInfo===S.containerInfo&&T.stateNode.implementation===S.implementation){a(v,T.sibling),x=o(T,S.children||[]),x.return=v,v=x;break e}else{a(v,T);break}else t(v,T);T=T.sibling}x=Ts(S,v.mode,x),x.return=v,v=x}return u(v);case Ne:return S=Qn(S),Ae(v,T,S,x)}if(Dt(S))return B(v,T,S,x);if(Fe(S)){if(_=Fe(S),typeof _!="function")throw Error(c(150));return S=_.call(S),V(v,T,S,x)}if(typeof S.then=="function")return Ae(v,T,Lo(S),x);if(S.$$typeof===J)return Ae(v,T,Fo(v,S),x);Co(v,S)}return typeof S=="string"&&S!==""||typeof S=="number"||typeof S=="bigint"?(S=""+S,T!==null&&T.tag===6?(a(v,T.sibling),x=o(T,S),x.return=v,v=x):(a(v,T),x=bs(S,v.mode,x),x.return=v,v=x),u(v)):a(v,T)}return function(v,T,S,x){try{hi=0;var _=Ae(v,T,S,x);return wa=null,_}catch($){if($===Aa||$===Io)throw $;var fe=ht(29,$,null,v.mode);return fe.lanes=x,fe.return=v,fe}}}var Jn=ju(!0),Gu=ju(!1),En=!1;function Ls(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,lanes:0,hiddenCallbacks:null},callbacks:null}}function Cs(e,t){e=e.updateQueue,t.updateQueue===e&&(t.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,callbacks:null})}function On(e){return{lane:e,tag:0,payload:null,callback:null,next:null}}function vn(e,t,a){var i=e.updateQueue;if(i===null)return null;if(i=i.shared,(ge&2)!==0){var o=i.pending;return o===null?t.next=t:(t.next=o.next,o.next=t),i.pending=t,t=So(e),Su(e,null,a),t}return vo(e,i,t,a),So(e)}function fi(e,t,a){if(t=t.updateQueue,t!==null&&(t=t.shared,(a&4194048)!==0)){var i=t.lanes;i&=e.pendingLanes,a|=i,t.lanes=a,Lc(e,a)}}function Ds(e,t){var a=e.updateQueue,i=e.alternate;if(i!==null&&(i=i.updateQueue,a===i)){var o=null,r=null;if(a=a.firstBaseUpdate,a!==null){do{var u={lane:a.lane,tag:a.tag,payload:a.payload,callback:null,next:null};r===null?o=r=u:r=r.next=u,a=a.next}while(a!==null);r===null?o=r=t:r=r.next=t}else o=r=t;a={baseState:i.baseState,firstBaseUpdate:o,lastBaseUpdate:r,shared:i.shared,callbacks:i.callbacks},e.updateQueue=a;return}e=a.lastBaseUpdate,e===null?a.firstBaseUpdate=t:e.next=t,a.lastBaseUpdate=t}var ks=!1;function mi(){if(ks){var e=Sa;if(e!==null)throw e}}function gi(e,t,a,i){ks=!1;var o=e.updateQueue;En=!1;var r=o.firstBaseUpdate,u=o.lastBaseUpdate,h=o.shared.pending;if(h!==null){o.shared.pending=null;var g=h,A=g.next;g.next=null,u===null?r=A:u.next=A,u=g;var N=e.alternate;N!==null&&(N=N.updateQueue,h=N.lastBaseUpdate,h!==u&&(h===null?N.firstBaseUpdate=A:h.next=A,N.lastBaseUpdate=g))}if(r!==null){var C=o.baseState;u=0,N=A=g=null,h=r;do{var w=h.lane&-536870913,R=w!==h.lane;if(R?(le&w)===w:(i&w)===w){w!==0&&w===va&&(ks=!0),N!==null&&(N=N.next={lane:0,tag:h.tag,payload:h.payload,callback:null,next:null});e:{var B=e,V=h;w=t;var Ae=a;switch(V.tag){case 1:if(B=V.payload,typeof B=="function"){C=B.call(Ae,C,w);break e}C=B;break e;case 3:B.flags=B.flags&-65537|128;case 0:if(B=V.payload,w=typeof B=="function"?B.call(Ae,C,w):B,w==null)break e;C=M({},C,w);break e;case 2:En=!0}}w=h.callback,w!==null&&(e.flags|=64,R&&(e.flags|=8192),R=o.callbacks,R===null?o.callbacks=[w]:R.push(w))}else R={lane:w,tag:h.tag,payload:h.payload,callback:h.callback,next:null},N===null?(A=N=R,g=C):N=N.next=R,u|=w;if(h=h.next,h===null){if(h=o.shared.pending,h===null)break;R=h,h=R.next,R.next=null,o.lastBaseUpdate=R,o.shared.pending=null}}while(!0);N===null&&(g=C),o.baseState=g,o.firstBaseUpdate=A,o.lastBaseUpdate=N,r===null&&(o.shared.lanes=0),Fn|=u,e.lanes=u,e.memoizedState=C}}function Bu(e,t){if(typeof e!="function")throw Error(c(191,e));e.call(t)}function Pu(e,t){var a=e.callbacks;if(a!==null)for(e.callbacks=null,e=0;e<a.length;e++)Bu(a[e],t)}var Ra=O(null),Do=O(0);function Yu(e,t){e=sn,G(Do,e),G(Ra,t),sn=e|t.baseLanes}function Hs(){G(Do,sn),G(Ra,Ra.current)}function zs(){sn=Do.current,D(Ra),D(Do)}var pt=O(null),Nt=null;function Sn(e){var t=e.alternate;G(He,He.current&1),G(pt,e),Nt===null&&(t===null||Ra.current!==null||t.memoizedState!==null)&&(Nt=e)}function Ms(e){G(He,He.current),G(pt,e),Nt===null&&(Nt=e)}function $u(e){e.tag===22?(G(He,He.current),G(pt,e),Nt===null&&(Nt=e)):An()}function An(){G(He,He.current),G(pt,pt.current)}function ft(e){D(pt),Nt===e&&(Nt=null),D(He)}var He=O(0);function ko(e){for(var t=e;t!==null;){if(t.tag===13){var a=t.memoizedState;if(a!==null&&(a=a.dehydrated,a===null||Yl(a)||$l(a)))return t}else if(t.tag===19&&(t.memoizedProps.revealOrder==="forwards"||t.memoizedProps.revealOrder==="backwards"||t.memoizedProps.revealOrder==="unstable_legacy-backwards"||t.memoizedProps.revealOrder==="together")){if((t.flags&128)!==0)return t}else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}return null}var Xt=0,te=null,ve=null,Ue=null,Ho=!1,Fa=!1,ea=!1,zo=0,yi=0,Na=null,Lm=0;function Ce(){throw Error(c(321))}function Us(e,t){if(t===null)return!1;for(var a=0;a<t.length&&a<e.length;a++)if(!dt(e[a],t[a]))return!1;return!0}function js(e,t,a,i,o,r){return Xt=r,te=t,t.memoizedState=null,t.updateQueue=null,t.lanes=0,I.H=e===null||e.memoizedState===null?Fd:el,ea=!1,r=a(i,o),ea=!1,Fa&&(r=_u(t,a,i,o)),Wu(e),r}function Wu(e){I.H=Ei;var t=ve!==null&&ve.next!==null;if(Xt=0,Ue=ve=te=null,Ho=!1,yi=0,Na=null,t)throw Error(c(300));e===null||je||(e=e.dependencies,e!==null&&Ro(e)&&(je=!0))}function _u(e,t,a,i){te=e;var o=0;do{if(Fa&&(Na=null),yi=0,Fa=!1,25<=o)throw Error(c(301));if(o+=1,Ue=ve=null,e.updateQueue!=null){var r=e.updateQueue;r.lastEffect=null,r.events=null,r.stores=null,r.memoCache!=null&&(r.memoCache.index=0)}I.H=Nd,r=t(a,i)}while(Fa);return r}function Cm(){var e=I.H,t=e.useState()[0];return t=typeof t.then=="function"?bi(t):t,e=e.useState()[0],(ve!==null?ve.memoizedState:null)!==e&&(te.flags|=1024),t}function Gs(){var e=zo!==0;return zo=0,e}function Bs(e,t,a){t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~a}function Ps(e){if(Ho){for(e=e.memoizedState;e!==null;){var t=e.queue;t!==null&&(t.pending=null),e=e.next}Ho=!1}Xt=0,Ue=ve=te=null,Fa=!1,yi=zo=0,Na=null}function et(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return Ue===null?te.memoizedState=Ue=e:Ue=Ue.next=e,Ue}function ze(){if(ve===null){var e=te.alternate;e=e!==null?e.memoizedState:null}else e=ve.next;var t=Ue===null?te.memoizedState:Ue.next;if(t!==null)Ue=t,ve=e;else{if(e===null)throw te.alternate===null?Error(c(467)):Error(c(310));ve=e,e={memoizedState:ve.memoizedState,baseState:ve.baseState,baseQueue:ve.baseQueue,queue:ve.queue,next:null},Ue===null?te.memoizedState=Ue=e:Ue=Ue.next=e}return Ue}function Mo(){return{lastEffect:null,events:null,stores:null,memoCache:null}}function bi(e){var t=yi;return yi+=1,Na===null&&(Na=[]),e=zu(Na,e,t),t=te,(Ue===null?t.memoizedState:Ue.next)===null&&(t=t.alternate,I.H=t===null||t.memoizedState===null?Fd:el),e}function Uo(e){if(e!==null&&typeof e=="object"){if(typeof e.then=="function")return bi(e);if(e.$$typeof===J)return qe(e)}throw Error(c(438,String(e)))}function Ys(e){var t=null,a=te.updateQueue;if(a!==null&&(t=a.memoCache),t==null){var i=te.alternate;i!==null&&(i=i.updateQueue,i!==null&&(i=i.memoCache,i!=null&&(t={data:i.data.map(function(o){return o.slice()}),index:0})))}if(t==null&&(t={data:[],index:0}),a===null&&(a=Mo(),te.updateQueue=a),a.memoCache=t,a=t.data[t.index],a===void 0)for(a=t.data[t.index]=Array(e),i=0;i<e;i++)a[i]=Z;return t.index++,a}function Jt(e,t){return typeof t=="function"?t(e):t}function jo(e){var t=ze();return $s(t,ve,e)}function $s(e,t,a){var i=e.queue;if(i===null)throw Error(c(311));i.lastRenderedReducer=a;var o=e.baseQueue,r=i.pending;if(r!==null){if(o!==null){var u=o.next;o.next=r.next,r.next=u}t.baseQueue=o=r,i.pending=null}if(r=e.baseState,o===null)e.memoizedState=r;else{t=o.next;var h=u=null,g=null,A=t,N=!1;do{var C=A.lane&-536870913;if(C!==A.lane?(le&C)===C:(Xt&C)===C){var w=A.revertLane;if(w===0)g!==null&&(g=g.next={lane:0,revertLane:0,gesture:null,action:A.action,hasEagerState:A.hasEagerState,eagerState:A.eagerState,next:null}),C===va&&(N=!0);else if((Xt&w)===w){A=A.next,w===va&&(N=!0);continue}else C={lane:0,revertLane:A.revertLane,gesture:null,action:A.action,hasEagerState:A.hasEagerState,eagerState:A.eagerState,next:null},g===null?(h=g=C,u=r):g=g.next=C,te.lanes|=w,Fn|=w;C=A.action,ea&&a(r,C),r=A.hasEagerState?A.eagerState:a(r,C)}else w={lane:C,revertLane:A.revertLane,gesture:A.gesture,action:A.action,hasEagerState:A.hasEagerState,eagerState:A.eagerState,next:null},g===null?(h=g=w,u=r):g=g.next=w,te.lanes|=C,Fn|=C;A=A.next}while(A!==null&&A!==t);if(g===null?u=r:g.next=h,!dt(r,e.memoizedState)&&(je=!0,N&&(a=Sa,a!==null)))throw a;e.memoizedState=r,e.baseState=u,e.baseQueue=g,i.lastRenderedState=r}return o===null&&(i.lanes=0),[e.memoizedState,i.dispatch]}function Ws(e){var t=ze(),a=t.queue;if(a===null)throw Error(c(311));a.lastRenderedReducer=e;var i=a.dispatch,o=a.pending,r=t.memoizedState;if(o!==null){a.pending=null;var u=o=o.next;do r=e(r,u.action),u=u.next;while(u!==o);dt(r,t.memoizedState)||(je=!0),t.memoizedState=r,t.baseQueue===null&&(t.baseState=r),a.lastRenderedState=r}return[r,i]}function qu(e,t,a){var i=te,o=ze(),r=ue;if(r){if(a===void 0)throw Error(c(407));a=a()}else a=t();var u=!dt((ve||o).memoizedState,a);if(u&&(o.memoizedState=a,je=!0),o=o.queue,Vs(Zu.bind(null,i,o,e),[e]),o.getSnapshot!==t||u||Ue!==null&&Ue.memoizedState.tag&1){if(i.flags|=2048,Ia(9,{destroy:void 0},Ku.bind(null,i,o,a,t),null),Re===null)throw Error(c(349));r||(Xt&127)!==0||Vu(i,t,a)}return a}function Vu(e,t,a){e.flags|=16384,e={getSnapshot:t,value:a},t=te.updateQueue,t===null?(t=Mo(),te.updateQueue=t,t.stores=[e]):(a=t.stores,a===null?t.stores=[e]:a.push(e))}function Ku(e,t,a,i){t.value=a,t.getSnapshot=i,Qu(t)&&Xu(e)}function Zu(e,t,a){return a(function(){Qu(t)&&Xu(e)})}function Qu(e){var t=e.getSnapshot;e=e.value;try{var a=t();return!dt(e,a)}catch{return!0}}function Xu(e){var t=Wn(e,2);t!==null&&st(t,e,2)}function _s(e){var t=et();if(typeof e=="function"){var a=e;if(e=a(),ea){pn(!0);try{a()}finally{pn(!1)}}}return t.memoizedState=t.baseState=e,t.queue={pending:null,lanes:0,dispatch:null,lastRenderedReducer:Jt,lastRenderedState:e},t}function Ju(e,t,a,i){return e.baseState=a,$s(e,ve,typeof i=="function"?i:Jt)}function Dm(e,t,a,i,o){if(Po(e))throw Error(c(485));if(e=t.action,e!==null){var r={payload:o,action:e,next:null,isTransition:!0,status:"pending",value:null,reason:null,listeners:[],then:function(u){r.listeners.push(u)}};I.T!==null?a(!0):r.isTransition=!1,i(r),a=t.pending,a===null?(r.next=t.pending=r,ed(t,r)):(r.next=a.next,t.pending=a.next=r)}}function ed(e,t){var a=t.action,i=t.payload,o=e.state;if(t.isTransition){var r=I.T,u={};I.T=u;try{var h=a(o,i),g=I.S;g!==null&&g(u,h),td(e,t,h)}catch(A){qs(e,t,A)}finally{r!==null&&u.types!==null&&(r.types=u.types),I.T=r}}else try{r=a(o,i),td(e,t,r)}catch(A){qs(e,t,A)}}function td(e,t,a){a!==null&&typeof a=="object"&&typeof a.then=="function"?a.then(function(i){nd(e,t,i)},function(i){return qs(e,t,i)}):nd(e,t,a)}function nd(e,t,a){t.status="fulfilled",t.value=a,ad(t),e.state=a,t=e.pending,t!==null&&(a=t.next,a===t?e.pending=null:(a=a.next,t.next=a,ed(e,a)))}function qs(e,t,a){var i=e.pending;if(e.pending=null,i!==null){i=i.next;do t.status="rejected",t.reason=a,ad(t),t=t.next;while(t!==i)}e.action=null}function ad(e){e=e.listeners;for(var t=0;t<e.length;t++)(0,e[t])()}function id(e,t){return t}function od(e,t){if(ue){var a=Re.formState;if(a!==null){e:{var i=te;if(ue){if(Ie){t:{for(var o=Ie,r=Ft;o.nodeType!==8;){if(!r){o=null;break t}if(o=It(o.nextSibling),o===null){o=null;break t}}r=o.data,o=r==="F!"||r==="F"?o:null}if(o){Ie=It(o.nextSibling),i=o.data==="F!";break e}}bn(i)}i=!1}i&&(t=a[0])}}return a=et(),a.memoizedState=a.baseState=t,i={pending:null,lanes:0,dispatch:null,lastRenderedReducer:id,lastRenderedState:t},a.queue=i,a=Ad.bind(null,te,i),i.dispatch=a,i=_s(!1),r=Js.bind(null,te,!1,i.queue),i=et(),o={state:t,dispatch:null,action:e,pending:null},i.queue=o,a=Dm.bind(null,te,o,r,a),o.dispatch=a,i.memoizedState=e,[t,a,!1]}function rd(e){var t=ze();return sd(t,ve,e)}function sd(e,t,a){if(t=$s(e,t,id)[0],e=jo(Jt)[0],typeof t=="object"&&t!==null&&typeof t.then=="function")try{var i=bi(t)}catch(u){throw u===Aa?Io:u}else i=t;t=ze();var o=t.queue,r=o.dispatch;return a!==t.memoizedState&&(te.flags|=2048,Ia(9,{destroy:void 0},km.bind(null,o,a),null)),[i,r,e]}function km(e,t){e.action=t}function ld(e){var t=ze(),a=ve;if(a!==null)return sd(t,a,e);ze(),t=t.memoizedState,a=ze();var i=a.queue.dispatch;return a.memoizedState=e,[t,i,!1]}function Ia(e,t,a,i){return e={tag:e,create:a,deps:i,inst:t,next:null},t=te.updateQueue,t===null&&(t=Mo(),te.updateQueue=t),a=t.lastEffect,a===null?t.lastEffect=e.next=e:(i=a.next,a.next=e,e.next=i,t.lastEffect=e),e}function cd(){return ze().memoizedState}function Go(e,t,a,i){var o=et();te.flags|=e,o.memoizedState=Ia(1|t,{destroy:void 0},a,i===void 0?null:i)}function Bo(e,t,a,i){var o=ze();i=i===void 0?null:i;var r=o.memoizedState.inst;ve!==null&&i!==null&&Us(i,ve.memoizedState.deps)?o.memoizedState=Ia(t,r,a,i):(te.flags|=e,o.memoizedState=Ia(1|t,r,a,i))}function ud(e,t){Go(8390656,8,e,t)}function Vs(e,t){Bo(2048,8,e,t)}function Hm(e){te.flags|=4;var t=te.updateQueue;if(t===null)t=Mo(),te.updateQueue=t,t.events=[e];else{var a=t.events;a===null?t.events=[e]:a.push(e)}}function dd(e){var t=ze().memoizedState;return Hm({ref:t,nextImpl:e}),function(){if((ge&2)!==0)throw Error(c(440));return t.impl.apply(void 0,arguments)}}function hd(e,t){return Bo(4,2,e,t)}function pd(e,t){return Bo(4,4,e,t)}function fd(e,t){if(typeof t=="function"){e=e();var a=t(e);return function(){typeof a=="function"?a():t(null)}}if(t!=null)return e=e(),t.current=e,function(){t.current=null}}function md(e,t,a){a=a!=null?a.concat([e]):null,Bo(4,4,fd.bind(null,t,e),a)}function Ks(){}function gd(e,t){var a=ze();t=t===void 0?null:t;var i=a.memoizedState;return t!==null&&Us(t,i[1])?i[0]:(a.memoizedState=[e,t],e)}function yd(e,t){var a=ze();t=t===void 0?null:t;var i=a.memoizedState;if(t!==null&&Us(t,i[1]))return i[0];if(i=e(),ea){pn(!0);try{e()}finally{pn(!1)}}return a.memoizedState=[i,t],i}function Zs(e,t,a){return a===void 0||(Xt&1073741824)!==0&&(le&261930)===0?e.memoizedState=t:(e.memoizedState=a,e=bh(),te.lanes|=e,Fn|=e,a)}function bd(e,t,a,i){return dt(a,t)?a:Ra.current!==null?(e=Zs(e,a,i),dt(e,t)||(je=!0),e):(Xt&42)===0||(Xt&1073741824)!==0&&(le&261930)===0?(je=!0,e.memoizedState=a):(e=bh(),te.lanes|=e,Fn|=e,t)}function Td(e,t,a,i,o){var r=j.p;j.p=r!==0&&8>r?r:8;var u=I.T,h={};I.T=h,Js(e,!1,t,a);try{var g=o(),A=I.S;if(A!==null&&A(h,g),g!==null&&typeof g=="object"&&typeof g.then=="function"){var N=xm(g,i);Ti(e,t,N,yt(e))}else Ti(e,t,i,yt(e))}catch(C){Ti(e,t,{then:function(){},status:"rejected",reason:C},yt())}finally{j.p=r,u!==null&&h.types!==null&&(u.types=h.types),I.T=u}}function zm(){}function Qs(e,t,a,i){if(e.tag!==5)throw Error(c(476));var o=Ed(e).queue;Td(e,o,t,K,a===null?zm:function(){return Od(e),a(i)})}function Ed(e){var t=e.memoizedState;if(t!==null)return t;t={memoizedState:K,baseState:K,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:Jt,lastRenderedState:K},next:null};var a={};return t.next={memoizedState:a,baseState:a,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:Jt,lastRenderedState:a},next:null},e.memoizedState=t,e=e.alternate,e!==null&&(e.memoizedState=t),t}function Od(e){var t=Ed(e);t.next===null&&(t=e.alternate.memoizedState),Ti(e,t.next.queue,{},yt())}function Xs(){return qe(zi)}function vd(){return ze().memoizedState}function Sd(){return ze().memoizedState}function Mm(e){for(var t=e.return;t!==null;){switch(t.tag){case 24:case 3:var a=yt();e=On(a);var i=vn(t,e,a);i!==null&&(st(i,t,a),fi(i,t,a)),t={cache:Fs()},e.payload=t;return}t=t.return}}function Um(e,t,a){var i=yt();a={lane:i,revertLane:0,gesture:null,action:a,hasEagerState:!1,eagerState:null,next:null},Po(e)?wd(t,a):(a=gs(e,t,a,i),a!==null&&(st(a,e,i),Rd(a,t,i)))}function Ad(e,t,a){var i=yt();Ti(e,t,a,i)}function Ti(e,t,a,i){var o={lane:i,revertLane:0,gesture:null,action:a,hasEagerState:!1,eagerState:null,next:null};if(Po(e))wd(t,o);else{var r=e.alternate;if(e.lanes===0&&(r===null||r.lanes===0)&&(r=t.lastRenderedReducer,r!==null))try{var u=t.lastRenderedState,h=r(u,a);if(o.hasEagerState=!0,o.eagerState=h,dt(h,u))return vo(e,t,o,0),Re===null&&Oo(),!1}catch{}if(a=gs(e,t,o,i),a!==null)return st(a,e,i),Rd(a,t,i),!0}return!1}function Js(e,t,a,i){if(i={lane:2,revertLane:Ll(),gesture:null,action:i,hasEagerState:!1,eagerState:null,next:null},Po(e)){if(t)throw Error(c(479))}else t=gs(e,a,i,2),t!==null&&st(t,e,2)}function Po(e){var t=e.alternate;return e===te||t!==null&&t===te}function wd(e,t){Fa=Ho=!0;var a=e.pending;a===null?t.next=t:(t.next=a.next,a.next=t),e.pending=t}function Rd(e,t,a){if((a&4194048)!==0){var i=t.lanes;i&=e.pendingLanes,a|=i,t.lanes=a,Lc(e,a)}}var Ei={readContext:qe,use:Uo,useCallback:Ce,useContext:Ce,useEffect:Ce,useImperativeHandle:Ce,useLayoutEffect:Ce,useInsertionEffect:Ce,useMemo:Ce,useReducer:Ce,useRef:Ce,useState:Ce,useDebugValue:Ce,useDeferredValue:Ce,useTransition:Ce,useSyncExternalStore:Ce,useId:Ce,useHostTransitionStatus:Ce,useFormState:Ce,useActionState:Ce,useOptimistic:Ce,useMemoCache:Ce,useCacheRefresh:Ce};Ei.useEffectEvent=Ce;var Fd={readContext:qe,use:Uo,useCallback:function(e,t){return et().memoizedState=[e,t===void 0?null:t],e},useContext:qe,useEffect:ud,useImperativeHandle:function(e,t,a){a=a!=null?a.concat([e]):null,Go(4194308,4,fd.bind(null,t,e),a)},useLayoutEffect:function(e,t){return Go(4194308,4,e,t)},useInsertionEffect:function(e,t){Go(4,2,e,t)},useMemo:function(e,t){var a=et();t=t===void 0?null:t;var i=e();if(ea){pn(!0);try{e()}finally{pn(!1)}}return a.memoizedState=[i,t],i},useReducer:function(e,t,a){var i=et();if(a!==void 0){var o=a(t);if(ea){pn(!0);try{a(t)}finally{pn(!1)}}}else o=t;return i.memoizedState=i.baseState=o,e={pending:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:o},i.queue=e,e=e.dispatch=Um.bind(null,te,e),[i.memoizedState,e]},useRef:function(e){var t=et();return e={current:e},t.memoizedState=e},useState:function(e){e=_s(e);var t=e.queue,a=Ad.bind(null,te,t);return t.dispatch=a,[e.memoizedState,a]},useDebugValue:Ks,useDeferredValue:function(e,t){var a=et();return Zs(a,e,t)},useTransition:function(){var e=_s(!1);return e=Td.bind(null,te,e.queue,!0,!1),et().memoizedState=e,[!1,e]},useSyncExternalStore:function(e,t,a){var i=te,o=et();if(ue){if(a===void 0)throw Error(c(407));a=a()}else{if(a=t(),Re===null)throw Error(c(349));(le&127)!==0||Vu(i,t,a)}o.memoizedState=a;var r={value:a,getSnapshot:t};return o.queue=r,ud(Zu.bind(null,i,r,e),[e]),i.flags|=2048,Ia(9,{destroy:void 0},Ku.bind(null,i,r,a,t),null),a},useId:function(){var e=et(),t=Re.identifierPrefix;if(ue){var a=Bt,i=Gt;a=(i&~(1<<32-ut(i)-1)).toString(32)+a,t="_"+t+"R_"+a,a=zo++,0<a&&(t+="H"+a.toString(32)),t+="_"}else a=Lm++,t="_"+t+"r_"+a.toString(32)+"_";return e.memoizedState=t},useHostTransitionStatus:Xs,useFormState:od,useActionState:od,useOptimistic:function(e){var t=et();t.memoizedState=t.baseState=e;var a={pending:null,lanes:0,dispatch:null,lastRenderedReducer:null,lastRenderedState:null};return t.queue=a,t=Js.bind(null,te,!0,a),a.dispatch=t,[e,t]},useMemoCache:Ys,useCacheRefresh:function(){return et().memoizedState=Mm.bind(null,te)},useEffectEvent:function(e){var t=et(),a={impl:e};return t.memoizedState=a,function(){if((ge&2)!==0)throw Error(c(440));return a.impl.apply(void 0,arguments)}}},el={readContext:qe,use:Uo,useCallback:gd,useContext:qe,useEffect:Vs,useImperativeHandle:md,useInsertionEffect:hd,useLayoutEffect:pd,useMemo:yd,useReducer:jo,useRef:cd,useState:function(){return jo(Jt)},useDebugValue:Ks,useDeferredValue:function(e,t){var a=ze();return bd(a,ve.memoizedState,e,t)},useTransition:function(){var e=jo(Jt)[0],t=ze().memoizedState;return[typeof e=="boolean"?e:bi(e),t]},useSyncExternalStore:qu,useId:vd,useHostTransitionStatus:Xs,useFormState:rd,useActionState:rd,useOptimistic:function(e,t){var a=ze();return Ju(a,ve,e,t)},useMemoCache:Ys,useCacheRefresh:Sd};el.useEffectEvent=dd;var Nd={readContext:qe,use:Uo,useCallback:gd,useContext:qe,useEffect:Vs,useImperativeHandle:md,useInsertionEffect:hd,useLayoutEffect:pd,useMemo:yd,useReducer:Ws,useRef:cd,useState:function(){return Ws(Jt)},useDebugValue:Ks,useDeferredValue:function(e,t){var a=ze();return ve===null?Zs(a,e,t):bd(a,ve.memoizedState,e,t)},useTransition:function(){var e=Ws(Jt)[0],t=ze().memoizedState;return[typeof e=="boolean"?e:bi(e),t]},useSyncExternalStore:qu,useId:vd,useHostTransitionStatus:Xs,useFormState:ld,useActionState:ld,useOptimistic:function(e,t){var a=ze();return ve!==null?Ju(a,ve,e,t):(a.baseState=e,[e,a.queue.dispatch])},useMemoCache:Ys,useCacheRefresh:Sd};Nd.useEffectEvent=dd;function tl(e,t,a,i){t=e.memoizedState,a=a(i,t),a=a==null?t:M({},t,a),e.memoizedState=a,e.lanes===0&&(e.updateQueue.baseState=a)}var nl={enqueueSetState:function(e,t,a){e=e._reactInternals;var i=yt(),o=On(i);o.payload=t,a!=null&&(o.callback=a),t=vn(e,o,i),t!==null&&(st(t,e,i),fi(t,e,i))},enqueueReplaceState:function(e,t,a){e=e._reactInternals;var i=yt(),o=On(i);o.tag=1,o.payload=t,a!=null&&(o.callback=a),t=vn(e,o,i),t!==null&&(st(t,e,i),fi(t,e,i))},enqueueForceUpdate:function(e,t){e=e._reactInternals;var a=yt(),i=On(a);i.tag=2,t!=null&&(i.callback=t),t=vn(e,i,a),t!==null&&(st(t,e,a),fi(t,e,a))}};function Id(e,t,a,i,o,r,u){return e=e.stateNode,typeof e.shouldComponentUpdate=="function"?e.shouldComponentUpdate(i,r,u):t.prototype&&t.prototype.isPureReactComponent?!ri(a,i)||!ri(o,r):!0}function xd(e,t,a,i){e=t.state,typeof t.componentWillReceiveProps=="function"&&t.componentWillReceiveProps(a,i),typeof t.UNSAFE_componentWillReceiveProps=="function"&&t.UNSAFE_componentWillReceiveProps(a,i),t.state!==e&&nl.enqueueReplaceState(t,t.state,null)}function ta(e,t){var a=t;if("ref"in t){a={};for(var i in t)i!=="ref"&&(a[i]=t[i])}if(e=e.defaultProps){a===t&&(a=M({},a));for(var o in e)a[o]===void 0&&(a[o]=e[o])}return a}function Ld(e){Eo(e)}function Cd(e){console.error(e)}function Dd(e){Eo(e)}function Yo(e,t){try{var a=e.onUncaughtError;a(t.value,{componentStack:t.stack})}catch(i){setTimeout(function(){throw i})}}function kd(e,t,a){try{var i=e.onCaughtError;i(a.value,{componentStack:a.stack,errorBoundary:t.tag===1?t.stateNode:null})}catch(o){setTimeout(function(){throw o})}}function al(e,t,a){return a=On(a),a.tag=3,a.payload={element:null},a.callback=function(){Yo(e,t)},a}function Hd(e){return e=On(e),e.tag=3,e}function zd(e,t,a,i){var o=a.type.getDerivedStateFromError;if(typeof o=="function"){var r=i.value;e.payload=function(){return o(r)},e.callback=function(){kd(t,a,i)}}var u=a.stateNode;u!==null&&typeof u.componentDidCatch=="function"&&(e.callback=function(){kd(t,a,i),typeof o!="function"&&(Nn===null?Nn=new Set([this]):Nn.add(this));var h=i.stack;this.componentDidCatch(i.value,{componentStack:h!==null?h:""})})}function jm(e,t,a,i,o){if(a.flags|=32768,i!==null&&typeof i=="object"&&typeof i.then=="function"){if(t=a.alternate,t!==null&&Oa(t,a,o,!0),a=pt.current,a!==null){switch(a.tag){case 31:case 13:return Nt===null?tr():a.alternate===null&&De===0&&(De=3),a.flags&=-257,a.flags|=65536,a.lanes=o,i===xo?a.flags|=16384:(t=a.updateQueue,t===null?a.updateQueue=new Set([i]):t.add(i),Nl(e,i,o)),!1;case 22:return a.flags|=65536,i===xo?a.flags|=16384:(t=a.updateQueue,t===null?(t={transitions:null,markerInstances:null,retryQueue:new Set([i])},a.updateQueue=t):(a=t.retryQueue,a===null?t.retryQueue=new Set([i]):a.add(i)),Nl(e,i,o)),!1}throw Error(c(435,a.tag))}return Nl(e,i,o),tr(),!1}if(ue)return t=pt.current,t!==null?((t.flags&65536)===0&&(t.flags|=256),t.flags|=65536,t.lanes=o,i!==vs&&(e=Error(c(422),{cause:i}),ci(At(e,a)))):(i!==vs&&(t=Error(c(423),{cause:i}),ci(At(t,a))),e=e.current.alternate,e.flags|=65536,o&=-o,e.lanes|=o,i=At(i,a),o=al(e.stateNode,i,o),Ds(e,o),De!==4&&(De=2)),!1;var r=Error(c(520),{cause:i});if(r=At(r,a),Ni===null?Ni=[r]:Ni.push(r),De!==4&&(De=2),t===null)return!0;i=At(i,a),a=t;do{switch(a.tag){case 3:return a.flags|=65536,e=o&-o,a.lanes|=e,e=al(a.stateNode,i,e),Ds(a,e),!1;case 1:if(t=a.type,r=a.stateNode,(a.flags&128)===0&&(typeof t.getDerivedStateFromError=="function"||r!==null&&typeof r.componentDidCatch=="function"&&(Nn===null||!Nn.has(r))))return a.flags|=65536,o&=-o,a.lanes|=o,o=Hd(o),zd(o,e,a,i),Ds(a,o),!1}a=a.return}while(a!==null);return!1}var il=Error(c(461)),je=!1;function Ve(e,t,a,i){t.child=e===null?Gu(t,null,a,i):Jn(t,e.child,a,i)}function Md(e,t,a,i,o){a=a.render;var r=t.ref;if("ref"in i){var u={};for(var h in i)h!=="ref"&&(u[h]=i[h])}else u=i;return Kn(t),i=js(e,t,a,u,r,o),h=Gs(),e!==null&&!je?(Bs(e,t,o),en(e,t,o)):(ue&&h&&Es(t),t.flags|=1,Ve(e,t,i,o),t.child)}function Ud(e,t,a,i,o){if(e===null){var r=a.type;return typeof r=="function"&&!ys(r)&&r.defaultProps===void 0&&a.compare===null?(t.tag=15,t.type=r,jd(e,t,r,i,o)):(e=Ao(a.type,null,i,t,t.mode,o),e.ref=t.ref,e.return=t,t.child=e)}if(r=e.child,!hl(e,o)){var u=r.memoizedProps;if(a=a.compare,a=a!==null?a:ri,a(u,i)&&e.ref===t.ref)return en(e,t,o)}return t.flags|=1,e=Vt(r,i),e.ref=t.ref,e.return=t,t.child=e}function jd(e,t,a,i,o){if(e!==null){var r=e.memoizedProps;if(ri(r,i)&&e.ref===t.ref)if(je=!1,t.pendingProps=i=r,hl(e,o))(e.flags&131072)!==0&&(je=!0);else return t.lanes=e.lanes,en(e,t,o)}return ol(e,t,a,i,o)}function Gd(e,t,a,i){var o=i.children,r=e!==null?e.memoizedState:null;if(e===null&&t.stateNode===null&&(t.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),i.mode==="hidden"){if((t.flags&128)!==0){if(r=r!==null?r.baseLanes|a:a,e!==null){for(i=t.child=e.child,o=0;i!==null;)o=o|i.lanes|i.childLanes,i=i.sibling;i=o&~r}else i=0,t.child=null;return Bd(e,t,r,a,i)}if((a&536870912)!==0)t.memoizedState={baseLanes:0,cachePool:null},e!==null&&No(t,r!==null?r.cachePool:null),r!==null?Yu(t,r):Hs(),$u(t);else return i=t.lanes=536870912,Bd(e,t,r!==null?r.baseLanes|a:a,a,i)}else r!==null?(No(t,r.cachePool),Yu(t,r),An(),t.memoizedState=null):(e!==null&&No(t,null),Hs(),An());return Ve(e,t,o,a),t.child}function Oi(e,t){return e!==null&&e.tag===22||t.stateNode!==null||(t.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),t.sibling}function Bd(e,t,a,i,o){var r=Is();return r=r===null?null:{parent:Me._currentValue,pool:r},t.memoizedState={baseLanes:a,cachePool:r},e!==null&&No(t,null),Hs(),$u(t),e!==null&&Oa(e,t,i,!0),t.childLanes=o,null}function $o(e,t){return t=_o({mode:t.mode,children:t.children},e.mode),t.ref=e.ref,e.child=t,t.return=e,t}function Pd(e,t,a){return Jn(t,e.child,null,a),e=$o(t,t.pendingProps),e.flags|=2,ft(t),t.memoizedState=null,e}function Gm(e,t,a){var i=t.pendingProps,o=(t.flags&128)!==0;if(t.flags&=-129,e===null){if(ue){if(i.mode==="hidden")return e=$o(t,i),t.lanes=536870912,Oi(null,e);if(Ms(t),(e=Ie)?(e=ep(e,Ft),e=e!==null&&e.data==="&"?e:null,e!==null&&(t.memoizedState={dehydrated:e,treeContext:gn!==null?{id:Gt,overflow:Bt}:null,retryLane:536870912,hydrationErrors:null},a=wu(e),a.return=t,t.child=a,_e=t,Ie=null)):e=null,e===null)throw bn(t);return t.lanes=536870912,null}return $o(t,i)}var r=e.memoizedState;if(r!==null){var u=r.dehydrated;if(Ms(t),o)if(t.flags&256)t.flags&=-257,t=Pd(e,t,a);else if(t.memoizedState!==null)t.child=e.child,t.flags|=128,t=null;else throw Error(c(558));else if(je||Oa(e,t,a,!1),o=(a&e.childLanes)!==0,je||o){if(i=Re,i!==null&&(u=Cc(i,a),u!==0&&u!==r.retryLane))throw r.retryLane=u,Wn(e,u),st(i,e,u),il;tr(),t=Pd(e,t,a)}else e=r.treeContext,Ie=It(u.nextSibling),_e=t,ue=!0,yn=null,Ft=!1,e!==null&&Nu(t,e),t=$o(t,i),t.flags|=4096;return t}return e=Vt(e.child,{mode:i.mode,children:i.children}),e.ref=t.ref,t.child=e,e.return=t,e}function Wo(e,t){var a=t.ref;if(a===null)e!==null&&e.ref!==null&&(t.flags|=4194816);else{if(typeof a!="function"&&typeof a!="object")throw Error(c(284));(e===null||e.ref!==a)&&(t.flags|=4194816)}}function ol(e,t,a,i,o){return Kn(t),a=js(e,t,a,i,void 0,o),i=Gs(),e!==null&&!je?(Bs(e,t,o),en(e,t,o)):(ue&&i&&Es(t),t.flags|=1,Ve(e,t,a,o),t.child)}function Yd(e,t,a,i,o,r){return Kn(t),t.updateQueue=null,a=_u(t,i,a,o),Wu(e),i=Gs(),e!==null&&!je?(Bs(e,t,r),en(e,t,r)):(ue&&i&&Es(t),t.flags|=1,Ve(e,t,a,r),t.child)}function $d(e,t,a,i,o){if(Kn(t),t.stateNode===null){var r=ya,u=a.contextType;typeof u=="object"&&u!==null&&(r=qe(u)),r=new a(i,r),t.memoizedState=r.state!==null&&r.state!==void 0?r.state:null,r.updater=nl,t.stateNode=r,r._reactInternals=t,r=t.stateNode,r.props=i,r.state=t.memoizedState,r.refs={},Ls(t),u=a.contextType,r.context=typeof u=="object"&&u!==null?qe(u):ya,r.state=t.memoizedState,u=a.getDerivedStateFromProps,typeof u=="function"&&(tl(t,a,u,i),r.state=t.memoizedState),typeof a.getDerivedStateFromProps=="function"||typeof r.getSnapshotBeforeUpdate=="function"||typeof r.UNSAFE_componentWillMount!="function"&&typeof r.componentWillMount!="function"||(u=r.state,typeof r.componentWillMount=="function"&&r.componentWillMount(),typeof r.UNSAFE_componentWillMount=="function"&&r.UNSAFE_componentWillMount(),u!==r.state&&nl.enqueueReplaceState(r,r.state,null),gi(t,i,r,o),mi(),r.state=t.memoizedState),typeof r.componentDidMount=="function"&&(t.flags|=4194308),i=!0}else if(e===null){r=t.stateNode;var h=t.memoizedProps,g=ta(a,h);r.props=g;var A=r.context,N=a.contextType;u=ya,typeof N=="object"&&N!==null&&(u=qe(N));var C=a.getDerivedStateFromProps;N=typeof C=="function"||typeof r.getSnapshotBeforeUpdate=="function",h=t.pendingProps!==h,N||typeof r.UNSAFE_componentWillReceiveProps!="function"&&typeof r.componentWillReceiveProps!="function"||(h||A!==u)&&xd(t,r,i,u),En=!1;var w=t.memoizedState;r.state=w,gi(t,i,r,o),mi(),A=t.memoizedState,h||w!==A||En?(typeof C=="function"&&(tl(t,a,C,i),A=t.memoizedState),(g=En||Id(t,a,g,i,w,A,u))?(N||typeof r.UNSAFE_componentWillMount!="function"&&typeof r.componentWillMount!="function"||(typeof r.componentWillMount=="function"&&r.componentWillMount(),typeof r.UNSAFE_componentWillMount=="function"&&r.UNSAFE_componentWillMount()),typeof r.componentDidMount=="function"&&(t.flags|=4194308)):(typeof r.componentDidMount=="function"&&(t.flags|=4194308),t.memoizedProps=i,t.memoizedState=A),r.props=i,r.state=A,r.context=u,i=g):(typeof r.componentDidMount=="function"&&(t.flags|=4194308),i=!1)}else{r=t.stateNode,Cs(e,t),u=t.memoizedProps,N=ta(a,u),r.props=N,C=t.pendingProps,w=r.context,A=a.contextType,g=ya,typeof A=="object"&&A!==null&&(g=qe(A)),h=a.getDerivedStateFromProps,(A=typeof h=="function"||typeof r.getSnapshotBeforeUpdate=="function")||typeof r.UNSAFE_componentWillReceiveProps!="function"&&typeof r.componentWillReceiveProps!="function"||(u!==C||w!==g)&&xd(t,r,i,g),En=!1,w=t.memoizedState,r.state=w,gi(t,i,r,o),mi();var R=t.memoizedState;u!==C||w!==R||En||e!==null&&e.dependencies!==null&&Ro(e.dependencies)?(typeof h=="function"&&(tl(t,a,h,i),R=t.memoizedState),(N=En||Id(t,a,N,i,w,R,g)||e!==null&&e.dependencies!==null&&Ro(e.dependencies))?(A||typeof r.UNSAFE_componentWillUpdate!="function"&&typeof r.componentWillUpdate!="function"||(typeof r.componentWillUpdate=="function"&&r.componentWillUpdate(i,R,g),typeof r.UNSAFE_componentWillUpdate=="function"&&r.UNSAFE_componentWillUpdate(i,R,g)),typeof r.componentDidUpdate=="function"&&(t.flags|=4),typeof r.getSnapshotBeforeUpdate=="function"&&(t.flags|=1024)):(typeof r.componentDidUpdate!="function"||u===e.memoizedProps&&w===e.memoizedState||(t.flags|=4),typeof r.getSnapshotBeforeUpdate!="function"||u===e.memoizedProps&&w===e.memoizedState||(t.flags|=1024),t.memoizedProps=i,t.memoizedState=R),r.props=i,r.state=R,r.context=g,i=N):(typeof r.componentDidUpdate!="function"||u===e.memoizedProps&&w===e.memoizedState||(t.flags|=4),typeof r.getSnapshotBeforeUpdate!="function"||u===e.memoizedProps&&w===e.memoizedState||(t.flags|=1024),i=!1)}return r=i,Wo(e,t),i=(t.flags&128)!==0,r||i?(r=t.stateNode,a=i&&typeof a.getDerivedStateFromError!="function"?null:r.render(),t.flags|=1,e!==null&&i?(t.child=Jn(t,e.child,null,o),t.child=Jn(t,null,a,o)):Ve(e,t,a,o),t.memoizedState=r.state,e=t.child):e=en(e,t,o),e}function Wd(e,t,a,i){return qn(),t.flags|=256,Ve(e,t,a,i),t.child}var rl={dehydrated:null,treeContext:null,retryLane:0,hydrationErrors:null};function sl(e){return{baseLanes:e,cachePool:ku()}}function ll(e,t,a){return e=e!==null?e.childLanes&~a:0,t&&(e|=gt),e}function _d(e,t,a){var i=t.pendingProps,o=!1,r=(t.flags&128)!==0,u;if((u=r)||(u=e!==null&&e.memoizedState===null?!1:(He.current&2)!==0),u&&(o=!0,t.flags&=-129),u=(t.flags&32)!==0,t.flags&=-33,e===null){if(ue){if(o?Sn(t):An(),(e=Ie)?(e=ep(e,Ft),e=e!==null&&e.data!=="&"?e:null,e!==null&&(t.memoizedState={dehydrated:e,treeContext:gn!==null?{id:Gt,overflow:Bt}:null,retryLane:536870912,hydrationErrors:null},a=wu(e),a.return=t,t.child=a,_e=t,Ie=null)):e=null,e===null)throw bn(t);return $l(e)?t.lanes=32:t.lanes=536870912,null}var h=i.children;return i=i.fallback,o?(An(),o=t.mode,h=_o({mode:"hidden",children:h},o),i=_n(i,o,a,null),h.return=t,i.return=t,h.sibling=i,t.child=h,i=t.child,i.memoizedState=sl(a),i.childLanes=ll(e,u,a),t.memoizedState=rl,Oi(null,i)):(Sn(t),cl(t,h))}var g=e.memoizedState;if(g!==null&&(h=g.dehydrated,h!==null)){if(r)t.flags&256?(Sn(t),t.flags&=-257,t=ul(e,t,a)):t.memoizedState!==null?(An(),t.child=e.child,t.flags|=128,t=null):(An(),h=i.fallback,o=t.mode,i=_o({mode:"visible",children:i.children},o),h=_n(h,o,a,null),h.flags|=2,i.return=t,h.return=t,i.sibling=h,t.child=i,Jn(t,e.child,null,a),i=t.child,i.memoizedState=sl(a),i.childLanes=ll(e,u,a),t.memoizedState=rl,t=Oi(null,i));else if(Sn(t),$l(h)){if(u=h.nextSibling&&h.nextSibling.dataset,u)var A=u.dgst;u=A,i=Error(c(419)),i.stack="",i.digest=u,ci({value:i,source:null,stack:null}),t=ul(e,t,a)}else if(je||Oa(e,t,a,!1),u=(a&e.childLanes)!==0,je||u){if(u=Re,u!==null&&(i=Cc(u,a),i!==0&&i!==g.retryLane))throw g.retryLane=i,Wn(e,i),st(u,e,i),il;Yl(h)||tr(),t=ul(e,t,a)}else Yl(h)?(t.flags|=192,t.child=e.child,t=null):(e=g.treeContext,Ie=It(h.nextSibling),_e=t,ue=!0,yn=null,Ft=!1,e!==null&&Nu(t,e),t=cl(t,i.children),t.flags|=4096);return t}return o?(An(),h=i.fallback,o=t.mode,g=e.child,A=g.sibling,i=Vt(g,{mode:"hidden",children:i.children}),i.subtreeFlags=g.subtreeFlags&65011712,A!==null?h=Vt(A,h):(h=_n(h,o,a,null),h.flags|=2),h.return=t,i.return=t,i.sibling=h,t.child=i,Oi(null,i),i=t.child,h=e.child.memoizedState,h===null?h=sl(a):(o=h.cachePool,o!==null?(g=Me._currentValue,o=o.parent!==g?{parent:g,pool:g}:o):o=ku(),h={baseLanes:h.baseLanes|a,cachePool:o}),i.memoizedState=h,i.childLanes=ll(e,u,a),t.memoizedState=rl,Oi(e.child,i)):(Sn(t),a=e.child,e=a.sibling,a=Vt(a,{mode:"visible",children:i.children}),a.return=t,a.sibling=null,e!==null&&(u=t.deletions,u===null?(t.deletions=[e],t.flags|=16):u.push(e)),t.child=a,t.memoizedState=null,a)}function cl(e,t){return t=_o({mode:"visible",children:t},e.mode),t.return=e,e.child=t}function _o(e,t){return e=ht(22,e,null,t),e.lanes=0,e}function ul(e,t,a){return Jn(t,e.child,null,a),e=cl(t,t.pendingProps.children),e.flags|=2,t.memoizedState=null,e}function qd(e,t,a){e.lanes|=t;var i=e.alternate;i!==null&&(i.lanes|=t),ws(e.return,t,a)}function dl(e,t,a,i,o,r){var u=e.memoizedState;u===null?e.memoizedState={isBackwards:t,rendering:null,renderingStartTime:0,last:i,tail:a,tailMode:o,treeForkCount:r}:(u.isBackwards=t,u.rendering=null,u.renderingStartTime=0,u.last=i,u.tail=a,u.tailMode=o,u.treeForkCount=r)}function Vd(e,t,a){var i=t.pendingProps,o=i.revealOrder,r=i.tail;i=i.children;var u=He.current,h=(u&2)!==0;if(h?(u=u&1|2,t.flags|=128):u&=1,G(He,u),Ve(e,t,i,a),i=ue?li:0,!h&&e!==null&&(e.flags&128)!==0)e:for(e=t.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&qd(e,a,t);else if(e.tag===19)qd(e,a,t);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break e;for(;e.sibling===null;){if(e.return===null||e.return===t)break e;e=e.return}e.sibling.return=e.return,e=e.sibling}switch(o){case"forwards":for(a=t.child,o=null;a!==null;)e=a.alternate,e!==null&&ko(e)===null&&(o=a),a=a.sibling;a=o,a===null?(o=t.child,t.child=null):(o=a.sibling,a.sibling=null),dl(t,!1,o,a,r,i);break;case"backwards":case"unstable_legacy-backwards":for(a=null,o=t.child,t.child=null;o!==null;){if(e=o.alternate,e!==null&&ko(e)===null){t.child=o;break}e=o.sibling,o.sibling=a,a=o,o=e}dl(t,!0,a,null,r,i);break;case"together":dl(t,!1,null,null,void 0,i);break;default:t.memoizedState=null}return t.child}function en(e,t,a){if(e!==null&&(t.dependencies=e.dependencies),Fn|=t.lanes,(a&t.childLanes)===0)if(e!==null){if(Oa(e,t,a,!1),(a&t.childLanes)===0)return null}else return null;if(e!==null&&t.child!==e.child)throw Error(c(153));if(t.child!==null){for(e=t.child,a=Vt(e,e.pendingProps),t.child=a,a.return=t;e.sibling!==null;)e=e.sibling,a=a.sibling=Vt(e,e.pendingProps),a.return=t;a.sibling=null}return t.child}function hl(e,t){return(e.lanes&t)!==0?!0:(e=e.dependencies,!!(e!==null&&Ro(e)))}function Bm(e,t,a){switch(t.tag){case 3:Je(t,t.stateNode.containerInfo),Tn(t,Me,e.memoizedState.cache),qn();break;case 27:case 5:qa(t);break;case 4:Je(t,t.stateNode.containerInfo);break;case 10:Tn(t,t.type,t.memoizedProps.value);break;case 31:if(t.memoizedState!==null)return t.flags|=128,Ms(t),null;break;case 13:var i=t.memoizedState;if(i!==null)return i.dehydrated!==null?(Sn(t),t.flags|=128,null):(a&t.child.childLanes)!==0?_d(e,t,a):(Sn(t),e=en(e,t,a),e!==null?e.sibling:null);Sn(t);break;case 19:var o=(e.flags&128)!==0;if(i=(a&t.childLanes)!==0,i||(Oa(e,t,a,!1),i=(a&t.childLanes)!==0),o){if(i)return Vd(e,t,a);t.flags|=128}if(o=t.memoizedState,o!==null&&(o.rendering=null,o.tail=null,o.lastEffect=null),G(He,He.current),i)break;return null;case 22:return t.lanes=0,Gd(e,t,a,t.pendingProps);case 24:Tn(t,Me,e.memoizedState.cache)}return en(e,t,a)}function Kd(e,t,a){if(e!==null)if(e.memoizedProps!==t.pendingProps)je=!0;else{if(!hl(e,a)&&(t.flags&128)===0)return je=!1,Bm(e,t,a);je=(e.flags&131072)!==0}else je=!1,ue&&(t.flags&1048576)!==0&&Fu(t,li,t.index);switch(t.lanes=0,t.tag){case 16:e:{var i=t.pendingProps;if(e=Qn(t.elementType),t.type=e,typeof e=="function")ys(e)?(i=ta(e,i),t.tag=1,t=$d(null,t,e,i,a)):(t.tag=0,t=ol(null,t,e,i,a));else{if(e!=null){var o=e.$$typeof;if(o===se){t.tag=11,t=Md(null,t,e,i,a);break e}else if(o===Q){t.tag=14,t=Ud(null,t,e,i,a);break e}}throw t=Ct(e)||e,Error(c(306,t,""))}}return t;case 0:return ol(e,t,t.type,t.pendingProps,a);case 1:return i=t.type,o=ta(i,t.pendingProps),$d(e,t,i,o,a);case 3:e:{if(Je(t,t.stateNode.containerInfo),e===null)throw Error(c(387));i=t.pendingProps;var r=t.memoizedState;o=r.element,Cs(e,t),gi(t,i,null,a);var u=t.memoizedState;if(i=u.cache,Tn(t,Me,i),i!==r.cache&&Rs(t,[Me],a,!0),mi(),i=u.element,r.isDehydrated)if(r={element:i,isDehydrated:!1,cache:u.cache},t.updateQueue.baseState=r,t.memoizedState=r,t.flags&256){t=Wd(e,t,i,a);break e}else if(i!==o){o=At(Error(c(424)),t),ci(o),t=Wd(e,t,i,a);break e}else for(e=t.stateNode.containerInfo,e.nodeType===9?e=e.body:e=e.nodeName==="HTML"?e.ownerDocument.body:e,Ie=It(e.firstChild),_e=t,ue=!0,yn=null,Ft=!0,a=Gu(t,null,i,a),t.child=a;a;)a.flags=a.flags&-3|4096,a=a.sibling;else{if(qn(),i===o){t=en(e,t,a);break e}Ve(e,t,i,a)}t=t.child}return t;case 26:return Wo(e,t),e===null?(a=rp(t.type,null,t.pendingProps,null))?t.memoizedState=a:ue||(a=t.type,e=t.pendingProps,i=lr(ie.current).createElement(a),i[We]=t,i[tt]=e,Ke(i,a,e),Pe(i),t.stateNode=i):t.memoizedState=rp(t.type,e.memoizedProps,t.pendingProps,e.memoizedState),null;case 27:return qa(t),e===null&&ue&&(i=t.stateNode=ap(t.type,t.pendingProps,ie.current),_e=t,Ft=!0,o=Ie,Cn(t.type)?(Wl=o,Ie=It(i.firstChild)):Ie=o),Ve(e,t,t.pendingProps.children,a),Wo(e,t),e===null&&(t.flags|=4194304),t.child;case 5:return e===null&&ue&&((o=i=Ie)&&(i=yg(i,t.type,t.pendingProps,Ft),i!==null?(t.stateNode=i,_e=t,Ie=It(i.firstChild),Ft=!1,o=!0):o=!1),o||bn(t)),qa(t),o=t.type,r=t.pendingProps,u=e!==null?e.memoizedProps:null,i=r.children,Gl(o,r)?i=null:u!==null&&Gl(o,u)&&(t.flags|=32),t.memoizedState!==null&&(o=js(e,t,Cm,null,null,a),zi._currentValue=o),Wo(e,t),Ve(e,t,i,a),t.child;case 6:return e===null&&ue&&((e=a=Ie)&&(a=bg(a,t.pendingProps,Ft),a!==null?(t.stateNode=a,_e=t,Ie=null,e=!0):e=!1),e||bn(t)),null;case 13:return _d(e,t,a);case 4:return Je(t,t.stateNode.containerInfo),i=t.pendingProps,e===null?t.child=Jn(t,null,i,a):Ve(e,t,i,a),t.child;case 11:return Md(e,t,t.type,t.pendingProps,a);case 7:return Ve(e,t,t.pendingProps,a),t.child;case 8:return Ve(e,t,t.pendingProps.children,a),t.child;case 12:return Ve(e,t,t.pendingProps.children,a),t.child;case 10:return i=t.pendingProps,Tn(t,t.type,i.value),Ve(e,t,i.children,a),t.child;case 9:return o=t.type._context,i=t.pendingProps.children,Kn(t),o=qe(o),i=i(o),t.flags|=1,Ve(e,t,i,a),t.child;case 14:return Ud(e,t,t.type,t.pendingProps,a);case 15:return jd(e,t,t.type,t.pendingProps,a);case 19:return Vd(e,t,a);case 31:return Gm(e,t,a);case 22:return Gd(e,t,a,t.pendingProps);case 24:return Kn(t),i=qe(Me),e===null?(o=Is(),o===null&&(o=Re,r=Fs(),o.pooledCache=r,r.refCount++,r!==null&&(o.pooledCacheLanes|=a),o=r),t.memoizedState={parent:i,cache:o},Ls(t),Tn(t,Me,o)):((e.lanes&a)!==0&&(Cs(e,t),gi(t,null,null,a),mi()),o=e.memoizedState,r=t.memoizedState,o.parent!==i?(o={parent:i,cache:i},t.memoizedState=o,t.lanes===0&&(t.memoizedState=t.updateQueue.baseState=o),Tn(t,Me,i)):(i=r.cache,Tn(t,Me,i),i!==o.cache&&Rs(t,[Me],a,!0))),Ve(e,t,t.pendingProps.children,a),t.child;case 29:throw t.pendingProps}throw Error(c(156,t.tag))}function tn(e){e.flags|=4}function pl(e,t,a,i,o){if((t=(e.mode&32)!==0)&&(t=!1),t){if(e.flags|=16777216,(o&335544128)===o)if(e.stateNode.complete)e.flags|=8192;else if(vh())e.flags|=8192;else throw Xn=xo,xs}else e.flags&=-16777217}function Zd(e,t){if(t.type!=="stylesheet"||(t.state.loading&4)!==0)e.flags&=-16777217;else if(e.flags|=16777216,!dp(t))if(vh())e.flags|=8192;else throw Xn=xo,xs}function qo(e,t){t!==null&&(e.flags|=4),e.flags&16384&&(t=e.tag!==22?Ic():536870912,e.lanes|=t,Da|=t)}function vi(e,t){if(!ue)switch(e.tailMode){case"hidden":t=e.tail;for(var a=null;t!==null;)t.alternate!==null&&(a=t),t=t.sibling;a===null?e.tail=null:a.sibling=null;break;case"collapsed":a=e.tail;for(var i=null;a!==null;)a.alternate!==null&&(i=a),a=a.sibling;i===null?t||e.tail===null?e.tail=null:e.tail.sibling=null:i.sibling=null}}function xe(e){var t=e.alternate!==null&&e.alternate.child===e.child,a=0,i=0;if(t)for(var o=e.child;o!==null;)a|=o.lanes|o.childLanes,i|=o.subtreeFlags&65011712,i|=o.flags&65011712,o.return=e,o=o.sibling;else for(o=e.child;o!==null;)a|=o.lanes|o.childLanes,i|=o.subtreeFlags,i|=o.flags,o.return=e,o=o.sibling;return e.subtreeFlags|=i,e.childLanes=a,t}function Pm(e,t,a){var i=t.pendingProps;switch(Os(t),t.tag){case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return xe(t),null;case 1:return xe(t),null;case 3:return a=t.stateNode,i=null,e!==null&&(i=e.memoizedState.cache),t.memoizedState.cache!==i&&(t.flags|=2048),Qt(Me),ke(),a.pendingContext&&(a.context=a.pendingContext,a.pendingContext=null),(e===null||e.child===null)&&(Ea(t)?tn(t):e===null||e.memoizedState.isDehydrated&&(t.flags&256)===0||(t.flags|=1024,Ss())),xe(t),null;case 26:var o=t.type,r=t.memoizedState;return e===null?(tn(t),r!==null?(xe(t),Zd(t,r)):(xe(t),pl(t,o,null,i,a))):r?r!==e.memoizedState?(tn(t),xe(t),Zd(t,r)):(xe(t),t.flags&=-16777217):(e=e.memoizedProps,e!==i&&tn(t),xe(t),pl(t,o,e,i,a)),null;case 27:if(ao(t),a=ie.current,o=t.type,e!==null&&t.stateNode!=null)e.memoizedProps!==i&&tn(t);else{if(!i){if(t.stateNode===null)throw Error(c(166));return xe(t),null}e=Y.current,Ea(t)?Iu(t):(e=ap(o,i,a),t.stateNode=e,tn(t))}return xe(t),null;case 5:if(ao(t),o=t.type,e!==null&&t.stateNode!=null)e.memoizedProps!==i&&tn(t);else{if(!i){if(t.stateNode===null)throw Error(c(166));return xe(t),null}if(r=Y.current,Ea(t))Iu(t);else{var u=lr(ie.current);switch(r){case 1:r=u.createElementNS("http://www.w3.org/2000/svg",o);break;case 2:r=u.createElementNS("http://www.w3.org/1998/Math/MathML",o);break;default:switch(o){case"svg":r=u.createElementNS("http://www.w3.org/2000/svg",o);break;case"math":r=u.createElementNS("http://www.w3.org/1998/Math/MathML",o);break;case"script":r=u.createElement("div"),r.innerHTML="<script><\/script>",r=r.removeChild(r.firstChild);break;case"select":r=typeof i.is=="string"?u.createElement("select",{is:i.is}):u.createElement("select"),i.multiple?r.multiple=!0:i.size&&(r.size=i.size);break;default:r=typeof i.is=="string"?u.createElement(o,{is:i.is}):u.createElement(o)}}r[We]=t,r[tt]=i;e:for(u=t.child;u!==null;){if(u.tag===5||u.tag===6)r.appendChild(u.stateNode);else if(u.tag!==4&&u.tag!==27&&u.child!==null){u.child.return=u,u=u.child;continue}if(u===t)break e;for(;u.sibling===null;){if(u.return===null||u.return===t)break e;u=u.return}u.sibling.return=u.return,u=u.sibling}t.stateNode=r;e:switch(Ke(r,o,i),o){case"button":case"input":case"select":case"textarea":i=!!i.autoFocus;break e;case"img":i=!0;break e;default:i=!1}i&&tn(t)}}return xe(t),pl(t,t.type,e===null?null:e.memoizedProps,t.pendingProps,a),null;case 6:if(e&&t.stateNode!=null)e.memoizedProps!==i&&tn(t);else{if(typeof i!="string"&&t.stateNode===null)throw Error(c(166));if(e=ie.current,Ea(t)){if(e=t.stateNode,a=t.memoizedProps,i=null,o=_e,o!==null)switch(o.tag){case 27:case 5:i=o.memoizedProps}e[We]=t,e=!!(e.nodeValue===a||i!==null&&i.suppressHydrationWarning===!0||_h(e.nodeValue,a)),e||bn(t,!0)}else e=lr(e).createTextNode(i),e[We]=t,t.stateNode=e}return xe(t),null;case 31:if(a=t.memoizedState,e===null||e.memoizedState!==null){if(i=Ea(t),a!==null){if(e===null){if(!i)throw Error(c(318));if(e=t.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(c(557));e[We]=t}else qn(),(t.flags&128)===0&&(t.memoizedState=null),t.flags|=4;xe(t),e=!1}else a=Ss(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=a),e=!0;if(!e)return t.flags&256?(ft(t),t):(ft(t),null);if((t.flags&128)!==0)throw Error(c(558))}return xe(t),null;case 13:if(i=t.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(o=Ea(t),i!==null&&i.dehydrated!==null){if(e===null){if(!o)throw Error(c(318));if(o=t.memoizedState,o=o!==null?o.dehydrated:null,!o)throw Error(c(317));o[We]=t}else qn(),(t.flags&128)===0&&(t.memoizedState=null),t.flags|=4;xe(t),o=!1}else o=Ss(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=o),o=!0;if(!o)return t.flags&256?(ft(t),t):(ft(t),null)}return ft(t),(t.flags&128)!==0?(t.lanes=a,t):(a=i!==null,e=e!==null&&e.memoizedState!==null,a&&(i=t.child,o=null,i.alternate!==null&&i.alternate.memoizedState!==null&&i.alternate.memoizedState.cachePool!==null&&(o=i.alternate.memoizedState.cachePool.pool),r=null,i.memoizedState!==null&&i.memoizedState.cachePool!==null&&(r=i.memoizedState.cachePool.pool),r!==o&&(i.flags|=2048)),a!==e&&a&&(t.child.flags|=8192),qo(t,t.updateQueue),xe(t),null);case 4:return ke(),e===null&&Hl(t.stateNode.containerInfo),xe(t),null;case 10:return Qt(t.type),xe(t),null;case 19:if(D(He),i=t.memoizedState,i===null)return xe(t),null;if(o=(t.flags&128)!==0,r=i.rendering,r===null)if(o)vi(i,!1);else{if(De!==0||e!==null&&(e.flags&128)!==0)for(e=t.child;e!==null;){if(r=ko(e),r!==null){for(t.flags|=128,vi(i,!1),e=r.updateQueue,t.updateQueue=e,qo(t,e),t.subtreeFlags=0,e=a,a=t.child;a!==null;)Au(a,e),a=a.sibling;return G(He,He.current&1|2),ue&&Kt(t,i.treeForkCount),t.child}e=e.sibling}i.tail!==null&&lt()>Xo&&(t.flags|=128,o=!0,vi(i,!1),t.lanes=4194304)}else{if(!o)if(e=ko(r),e!==null){if(t.flags|=128,o=!0,e=e.updateQueue,t.updateQueue=e,qo(t,e),vi(i,!0),i.tail===null&&i.tailMode==="hidden"&&!r.alternate&&!ue)return xe(t),null}else 2*lt()-i.renderingStartTime>Xo&&a!==536870912&&(t.flags|=128,o=!0,vi(i,!1),t.lanes=4194304);i.isBackwards?(r.sibling=t.child,t.child=r):(e=i.last,e!==null?e.sibling=r:t.child=r,i.last=r)}return i.tail!==null?(e=i.tail,i.rendering=e,i.tail=e.sibling,i.renderingStartTime=lt(),e.sibling=null,a=He.current,G(He,o?a&1|2:a&1),ue&&Kt(t,i.treeForkCount),e):(xe(t),null);case 22:case 23:return ft(t),zs(),i=t.memoizedState!==null,e!==null?e.memoizedState!==null!==i&&(t.flags|=8192):i&&(t.flags|=8192),i?(a&536870912)!==0&&(t.flags&128)===0&&(xe(t),t.subtreeFlags&6&&(t.flags|=8192)):xe(t),a=t.updateQueue,a!==null&&qo(t,a.retryQueue),a=null,e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(a=e.memoizedState.cachePool.pool),i=null,t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(i=t.memoizedState.cachePool.pool),i!==a&&(t.flags|=2048),e!==null&&D(Zn),null;case 24:return a=null,e!==null&&(a=e.memoizedState.cache),t.memoizedState.cache!==a&&(t.flags|=2048),Qt(Me),xe(t),null;case 25:return null;case 30:return null}throw Error(c(156,t.tag))}function Ym(e,t){switch(Os(t),t.tag){case 1:return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 3:return Qt(Me),ke(),e=t.flags,(e&65536)!==0&&(e&128)===0?(t.flags=e&-65537|128,t):null;case 26:case 27:case 5:return ao(t),null;case 31:if(t.memoizedState!==null){if(ft(t),t.alternate===null)throw Error(c(340));qn()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 13:if(ft(t),e=t.memoizedState,e!==null&&e.dehydrated!==null){if(t.alternate===null)throw Error(c(340));qn()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 19:return D(He),null;case 4:return ke(),null;case 10:return Qt(t.type),null;case 22:case 23:return ft(t),zs(),e!==null&&D(Zn),e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 24:return Qt(Me),null;case 25:return null;default:return null}}function Qd(e,t){switch(Os(t),t.tag){case 3:Qt(Me),ke();break;case 26:case 27:case 5:ao(t);break;case 4:ke();break;case 31:t.memoizedState!==null&&ft(t);break;case 13:ft(t);break;case 19:D(He);break;case 10:Qt(t.type);break;case 22:case 23:ft(t),zs(),e!==null&&D(Zn);break;case 24:Qt(Me)}}function Si(e,t){try{var a=t.updateQueue,i=a!==null?a.lastEffect:null;if(i!==null){var o=i.next;a=o;do{if((a.tag&e)===e){i=void 0;var r=a.create,u=a.inst;i=r(),u.destroy=i}a=a.next}while(a!==o)}}catch(h){Ee(t,t.return,h)}}function wn(e,t,a){try{var i=t.updateQueue,o=i!==null?i.lastEffect:null;if(o!==null){var r=o.next;i=r;do{if((i.tag&e)===e){var u=i.inst,h=u.destroy;if(h!==void 0){u.destroy=void 0,o=t;var g=a,A=h;try{A()}catch(N){Ee(o,g,N)}}}i=i.next}while(i!==r)}}catch(N){Ee(t,t.return,N)}}function Xd(e){var t=e.updateQueue;if(t!==null){var a=e.stateNode;try{Pu(t,a)}catch(i){Ee(e,e.return,i)}}}function Jd(e,t,a){a.props=ta(e.type,e.memoizedProps),a.state=e.memoizedState;try{a.componentWillUnmount()}catch(i){Ee(e,t,i)}}function Ai(e,t){try{var a=e.ref;if(a!==null){switch(e.tag){case 26:case 27:case 5:var i=e.stateNode;break;case 30:i=e.stateNode;break;default:i=e.stateNode}typeof a=="function"?e.refCleanup=a(i):a.current=i}}catch(o){Ee(e,t,o)}}function Pt(e,t){var a=e.ref,i=e.refCleanup;if(a!==null)if(typeof i=="function")try{i()}catch(o){Ee(e,t,o)}finally{e.refCleanup=null,e=e.alternate,e!=null&&(e.refCleanup=null)}else if(typeof a=="function")try{a(null)}catch(o){Ee(e,t,o)}else a.current=null}function eh(e){var t=e.type,a=e.memoizedProps,i=e.stateNode;try{e:switch(t){case"button":case"input":case"select":case"textarea":a.autoFocus&&i.focus();break e;case"img":a.src?i.src=a.src:a.srcSet&&(i.srcset=a.srcSet)}}catch(o){Ee(e,e.return,o)}}function fl(e,t,a){try{var i=e.stateNode;dg(i,e.type,a,t),i[tt]=t}catch(o){Ee(e,e.return,o)}}function th(e){return e.tag===5||e.tag===3||e.tag===26||e.tag===27&&Cn(e.type)||e.tag===4}function ml(e){e:for(;;){for(;e.sibling===null;){if(e.return===null||th(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.tag===27&&Cn(e.type)||e.flags&2||e.child===null||e.tag===4)continue e;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function gl(e,t,a){var i=e.tag;if(i===5||i===6)e=e.stateNode,t?(a.nodeType===9?a.body:a.nodeName==="HTML"?a.ownerDocument.body:a).insertBefore(e,t):(t=a.nodeType===9?a.body:a.nodeName==="HTML"?a.ownerDocument.body:a,t.appendChild(e),a=a._reactRootContainer,a!=null||t.onclick!==null||(t.onclick=_t));else if(i!==4&&(i===27&&Cn(e.type)&&(a=e.stateNode,t=null),e=e.child,e!==null))for(gl(e,t,a),e=e.sibling;e!==null;)gl(e,t,a),e=e.sibling}function Vo(e,t,a){var i=e.tag;if(i===5||i===6)e=e.stateNode,t?a.insertBefore(e,t):a.appendChild(e);else if(i!==4&&(i===27&&Cn(e.type)&&(a=e.stateNode),e=e.child,e!==null))for(Vo(e,t,a),e=e.sibling;e!==null;)Vo(e,t,a),e=e.sibling}function nh(e){var t=e.stateNode,a=e.memoizedProps;try{for(var i=e.type,o=t.attributes;o.length;)t.removeAttributeNode(o[0]);Ke(t,i,a),t[We]=e,t[tt]=a}catch(r){Ee(e,e.return,r)}}var nn=!1,Ge=!1,yl=!1,ah=typeof WeakSet=="function"?WeakSet:Set,Ye=null;function $m(e,t){if(e=e.containerInfo,Ul=mr,e=mu(e),us(e)){if("selectionStart"in e)var a={start:e.selectionStart,end:e.selectionEnd};else e:{a=(a=e.ownerDocument)&&a.defaultView||window;var i=a.getSelection&&a.getSelection();if(i&&i.rangeCount!==0){a=i.anchorNode;var o=i.anchorOffset,r=i.focusNode;i=i.focusOffset;try{a.nodeType,r.nodeType}catch{a=null;break e}var u=0,h=-1,g=-1,A=0,N=0,C=e,w=null;t:for(;;){for(var R;C!==a||o!==0&&C.nodeType!==3||(h=u+o),C!==r||i!==0&&C.nodeType!==3||(g=u+i),C.nodeType===3&&(u+=C.nodeValue.length),(R=C.firstChild)!==null;)w=C,C=R;for(;;){if(C===e)break t;if(w===a&&++A===o&&(h=u),w===r&&++N===i&&(g=u),(R=C.nextSibling)!==null)break;C=w,w=C.parentNode}C=R}a=h===-1||g===-1?null:{start:h,end:g}}else a=null}a=a||{start:0,end:0}}else a=null;for(jl={focusedElem:e,selectionRange:a},mr=!1,Ye=t;Ye!==null;)if(t=Ye,e=t.child,(t.subtreeFlags&1028)!==0&&e!==null)e.return=t,Ye=e;else for(;Ye!==null;){switch(t=Ye,r=t.alternate,e=t.flags,t.tag){case 0:if((e&4)!==0&&(e=t.updateQueue,e=e!==null?e.events:null,e!==null))for(a=0;a<e.length;a++)o=e[a],o.ref.impl=o.nextImpl;break;case 11:case 15:break;case 1:if((e&1024)!==0&&r!==null){e=void 0,a=t,o=r.memoizedProps,r=r.memoizedState,i=a.stateNode;try{var B=ta(a.type,o);e=i.getSnapshotBeforeUpdate(B,r),i.__reactInternalSnapshotBeforeUpdate=e}catch(V){Ee(a,a.return,V)}}break;case 3:if((e&1024)!==0){if(e=t.stateNode.containerInfo,a=e.nodeType,a===9)Pl(e);else if(a===1)switch(e.nodeName){case"HEAD":case"HTML":case"BODY":Pl(e);break;default:e.textContent=""}}break;case 5:case 26:case 27:case 6:case 4:case 17:break;default:if((e&1024)!==0)throw Error(c(163))}if(e=t.sibling,e!==null){e.return=t.return,Ye=e;break}Ye=t.return}}function ih(e,t,a){var i=a.flags;switch(a.tag){case 0:case 11:case 15:on(e,a),i&4&&Si(5,a);break;case 1:if(on(e,a),i&4)if(e=a.stateNode,t===null)try{e.componentDidMount()}catch(u){Ee(a,a.return,u)}else{var o=ta(a.type,t.memoizedProps);t=t.memoizedState;try{e.componentDidUpdate(o,t,e.__reactInternalSnapshotBeforeUpdate)}catch(u){Ee(a,a.return,u)}}i&64&&Xd(a),i&512&&Ai(a,a.return);break;case 3:if(on(e,a),i&64&&(e=a.updateQueue,e!==null)){if(t=null,a.child!==null)switch(a.child.tag){case 27:case 5:t=a.child.stateNode;break;case 1:t=a.child.stateNode}try{Pu(e,t)}catch(u){Ee(a,a.return,u)}}break;case 27:t===null&&i&4&&nh(a);case 26:case 5:on(e,a),t===null&&i&4&&eh(a),i&512&&Ai(a,a.return);break;case 12:on(e,a);break;case 31:on(e,a),i&4&&sh(e,a);break;case 13:on(e,a),i&4&&lh(e,a),i&64&&(e=a.memoizedState,e!==null&&(e=e.dehydrated,e!==null&&(a=Jm.bind(null,a),Tg(e,a))));break;case 22:if(i=a.memoizedState!==null||nn,!i){t=t!==null&&t.memoizedState!==null||Ge,o=nn;var r=Ge;nn=i,(Ge=t)&&!r?rn(e,a,(a.subtreeFlags&8772)!==0):on(e,a),nn=o,Ge=r}break;case 30:break;default:on(e,a)}}function oh(e){var t=e.alternate;t!==null&&(e.alternate=null,oh(t)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(t=e.stateNode,t!==null&&qr(t)),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}var Le=null,at=!1;function an(e,t,a){for(a=a.child;a!==null;)rh(e,t,a),a=a.sibling}function rh(e,t,a){if(ct&&typeof ct.onCommitFiberUnmount=="function")try{ct.onCommitFiberUnmount(Va,a)}catch{}switch(a.tag){case 26:Ge||Pt(a,t),an(e,t,a),a.memoizedState?a.memoizedState.count--:a.stateNode&&(a=a.stateNode,a.parentNode.removeChild(a));break;case 27:Ge||Pt(a,t);var i=Le,o=at;Cn(a.type)&&(Le=a.stateNode,at=!1),an(e,t,a),Di(a.stateNode),Le=i,at=o;break;case 5:Ge||Pt(a,t);case 6:if(i=Le,o=at,Le=null,an(e,t,a),Le=i,at=o,Le!==null)if(at)try{(Le.nodeType===9?Le.body:Le.nodeName==="HTML"?Le.ownerDocument.body:Le).removeChild(a.stateNode)}catch(r){Ee(a,t,r)}else try{Le.removeChild(a.stateNode)}catch(r){Ee(a,t,r)}break;case 18:Le!==null&&(at?(e=Le,Xh(e.nodeType===9?e.body:e.nodeName==="HTML"?e.ownerDocument.body:e,a.stateNode),Ba(e)):Xh(Le,a.stateNode));break;case 4:i=Le,o=at,Le=a.stateNode.containerInfo,at=!0,an(e,t,a),Le=i,at=o;break;case 0:case 11:case 14:case 15:wn(2,a,t),Ge||wn(4,a,t),an(e,t,a);break;case 1:Ge||(Pt(a,t),i=a.stateNode,typeof i.componentWillUnmount=="function"&&Jd(a,t,i)),an(e,t,a);break;case 21:an(e,t,a);break;case 22:Ge=(i=Ge)||a.memoizedState!==null,an(e,t,a),Ge=i;break;default:an(e,t,a)}}function sh(e,t){if(t.memoizedState===null&&(e=t.alternate,e!==null&&(e=e.memoizedState,e!==null))){e=e.dehydrated;try{Ba(e)}catch(a){Ee(t,t.return,a)}}}function lh(e,t){if(t.memoizedState===null&&(e=t.alternate,e!==null&&(e=e.memoizedState,e!==null&&(e=e.dehydrated,e!==null))))try{Ba(e)}catch(a){Ee(t,t.return,a)}}function Wm(e){switch(e.tag){case 31:case 13:case 19:var t=e.stateNode;return t===null&&(t=e.stateNode=new ah),t;case 22:return e=e.stateNode,t=e._retryCache,t===null&&(t=e._retryCache=new ah),t;default:throw Error(c(435,e.tag))}}function Ko(e,t){var a=Wm(e);t.forEach(function(i){if(!a.has(i)){a.add(i);var o=eg.bind(null,e,i);i.then(o,o)}})}function it(e,t){var a=t.deletions;if(a!==null)for(var i=0;i<a.length;i++){var o=a[i],r=e,u=t,h=u;e:for(;h!==null;){switch(h.tag){case 27:if(Cn(h.type)){Le=h.stateNode,at=!1;break e}break;case 5:Le=h.stateNode,at=!1;break e;case 3:case 4:Le=h.stateNode.containerInfo,at=!0;break e}h=h.return}if(Le===null)throw Error(c(160));rh(r,u,o),Le=null,at=!1,r=o.alternate,r!==null&&(r.return=null),o.return=null}if(t.subtreeFlags&13886)for(t=t.child;t!==null;)ch(t,e),t=t.sibling}var Ht=null;function ch(e,t){var a=e.alternate,i=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:it(t,e),ot(e),i&4&&(wn(3,e,e.return),Si(3,e),wn(5,e,e.return));break;case 1:it(t,e),ot(e),i&512&&(Ge||a===null||Pt(a,a.return)),i&64&&nn&&(e=e.updateQueue,e!==null&&(i=e.callbacks,i!==null&&(a=e.shared.hiddenCallbacks,e.shared.hiddenCallbacks=a===null?i:a.concat(i))));break;case 26:var o=Ht;if(it(t,e),ot(e),i&512&&(Ge||a===null||Pt(a,a.return)),i&4){var r=a!==null?a.memoizedState:null;if(i=e.memoizedState,a===null)if(i===null)if(e.stateNode===null){e:{i=e.type,a=e.memoizedProps,o=o.ownerDocument||o;t:switch(i){case"title":r=o.getElementsByTagName("title")[0],(!r||r[Qa]||r[We]||r.namespaceURI==="http://www.w3.org/2000/svg"||r.hasAttribute("itemprop"))&&(r=o.createElement(i),o.head.insertBefore(r,o.querySelector("head > title"))),Ke(r,i,a),r[We]=e,Pe(r),i=r;break e;case"link":var u=cp("link","href",o).get(i+(a.href||""));if(u){for(var h=0;h<u.length;h++)if(r=u[h],r.getAttribute("href")===(a.href==null||a.href===""?null:a.href)&&r.getAttribute("rel")===(a.rel==null?null:a.rel)&&r.getAttribute("title")===(a.title==null?null:a.title)&&r.getAttribute("crossorigin")===(a.crossOrigin==null?null:a.crossOrigin)){u.splice(h,1);break t}}r=o.createElement(i),Ke(r,i,a),o.head.appendChild(r);break;case"meta":if(u=cp("meta","content",o).get(i+(a.content||""))){for(h=0;h<u.length;h++)if(r=u[h],r.getAttribute("content")===(a.content==null?null:""+a.content)&&r.getAttribute("name")===(a.name==null?null:a.name)&&r.getAttribute("property")===(a.property==null?null:a.property)&&r.getAttribute("http-equiv")===(a.httpEquiv==null?null:a.httpEquiv)&&r.getAttribute("charset")===(a.charSet==null?null:a.charSet)){u.splice(h,1);break t}}r=o.createElement(i),Ke(r,i,a),o.head.appendChild(r);break;default:throw Error(c(468,i))}r[We]=e,Pe(r),i=r}e.stateNode=i}else up(o,e.type,e.stateNode);else e.stateNode=lp(o,i,e.memoizedProps);else r!==i?(r===null?a.stateNode!==null&&(a=a.stateNode,a.parentNode.removeChild(a)):r.count--,i===null?up(o,e.type,e.stateNode):lp(o,i,e.memoizedProps)):i===null&&e.stateNode!==null&&fl(e,e.memoizedProps,a.memoizedProps)}break;case 27:it(t,e),ot(e),i&512&&(Ge||a===null||Pt(a,a.return)),a!==null&&i&4&&fl(e,e.memoizedProps,a.memoizedProps);break;case 5:if(it(t,e),ot(e),i&512&&(Ge||a===null||Pt(a,a.return)),e.flags&32){o=e.stateNode;try{ua(o,"")}catch(B){Ee(e,e.return,B)}}i&4&&e.stateNode!=null&&(o=e.memoizedProps,fl(e,o,a!==null?a.memoizedProps:o)),i&1024&&(yl=!0);break;case 6:if(it(t,e),ot(e),i&4){if(e.stateNode===null)throw Error(c(162));i=e.memoizedProps,a=e.stateNode;try{a.nodeValue=i}catch(B){Ee(e,e.return,B)}}break;case 3:if(dr=null,o=Ht,Ht=cr(t.containerInfo),it(t,e),Ht=o,ot(e),i&4&&a!==null&&a.memoizedState.isDehydrated)try{Ba(t.containerInfo)}catch(B){Ee(e,e.return,B)}yl&&(yl=!1,uh(e));break;case 4:i=Ht,Ht=cr(e.stateNode.containerInfo),it(t,e),ot(e),Ht=i;break;case 12:it(t,e),ot(e);break;case 31:it(t,e),ot(e),i&4&&(i=e.updateQueue,i!==null&&(e.updateQueue=null,Ko(e,i)));break;case 13:it(t,e),ot(e),e.child.flags&8192&&e.memoizedState!==null!=(a!==null&&a.memoizedState!==null)&&(Qo=lt()),i&4&&(i=e.updateQueue,i!==null&&(e.updateQueue=null,Ko(e,i)));break;case 22:o=e.memoizedState!==null;var g=a!==null&&a.memoizedState!==null,A=nn,N=Ge;if(nn=A||o,Ge=N||g,it(t,e),Ge=N,nn=A,ot(e),i&8192)e:for(t=e.stateNode,t._visibility=o?t._visibility&-2:t._visibility|1,o&&(a===null||g||nn||Ge||na(e)),a=null,t=e;;){if(t.tag===5||t.tag===26){if(a===null){g=a=t;try{if(r=g.stateNode,o)u=r.style,typeof u.setProperty=="function"?u.setProperty("display","none","important"):u.display="none";else{h=g.stateNode;var C=g.memoizedProps.style,w=C!=null&&C.hasOwnProperty("display")?C.display:null;h.style.display=w==null||typeof w=="boolean"?"":(""+w).trim()}}catch(B){Ee(g,g.return,B)}}}else if(t.tag===6){if(a===null){g=t;try{g.stateNode.nodeValue=o?"":g.memoizedProps}catch(B){Ee(g,g.return,B)}}}else if(t.tag===18){if(a===null){g=t;try{var R=g.stateNode;o?Jh(R,!0):Jh(g.stateNode,!1)}catch(B){Ee(g,g.return,B)}}}else if((t.tag!==22&&t.tag!==23||t.memoizedState===null||t===e)&&t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break e;for(;t.sibling===null;){if(t.return===null||t.return===e)break e;a===t&&(a=null),t=t.return}a===t&&(a=null),t.sibling.return=t.return,t=t.sibling}i&4&&(i=e.updateQueue,i!==null&&(a=i.retryQueue,a!==null&&(i.retryQueue=null,Ko(e,a))));break;case 19:it(t,e),ot(e),i&4&&(i=e.updateQueue,i!==null&&(e.updateQueue=null,Ko(e,i)));break;case 30:break;case 21:break;default:it(t,e),ot(e)}}function ot(e){var t=e.flags;if(t&2){try{for(var a,i=e.return;i!==null;){if(th(i)){a=i;break}i=i.return}if(a==null)throw Error(c(160));switch(a.tag){case 27:var o=a.stateNode,r=ml(e);Vo(e,r,o);break;case 5:var u=a.stateNode;a.flags&32&&(ua(u,""),a.flags&=-33);var h=ml(e);Vo(e,h,u);break;case 3:case 4:var g=a.stateNode.containerInfo,A=ml(e);gl(e,A,g);break;default:throw Error(c(161))}}catch(N){Ee(e,e.return,N)}e.flags&=-3}t&4096&&(e.flags&=-4097)}function uh(e){if(e.subtreeFlags&1024)for(e=e.child;e!==null;){var t=e;uh(t),t.tag===5&&t.flags&1024&&t.stateNode.reset(),e=e.sibling}}function on(e,t){if(t.subtreeFlags&8772)for(t=t.child;t!==null;)ih(e,t.alternate,t),t=t.sibling}function na(e){for(e=e.child;e!==null;){var t=e;switch(t.tag){case 0:case 11:case 14:case 15:wn(4,t,t.return),na(t);break;case 1:Pt(t,t.return);var a=t.stateNode;typeof a.componentWillUnmount=="function"&&Jd(t,t.return,a),na(t);break;case 27:Di(t.stateNode);case 26:case 5:Pt(t,t.return),na(t);break;case 22:t.memoizedState===null&&na(t);break;case 30:na(t);break;default:na(t)}e=e.sibling}}function rn(e,t,a){for(a=a&&(t.subtreeFlags&8772)!==0,t=t.child;t!==null;){var i=t.alternate,o=e,r=t,u=r.flags;switch(r.tag){case 0:case 11:case 15:rn(o,r,a),Si(4,r);break;case 1:if(rn(o,r,a),i=r,o=i.stateNode,typeof o.componentDidMount=="function")try{o.componentDidMount()}catch(A){Ee(i,i.return,A)}if(i=r,o=i.updateQueue,o!==null){var h=i.stateNode;try{var g=o.shared.hiddenCallbacks;if(g!==null)for(o.shared.hiddenCallbacks=null,o=0;o<g.length;o++)Bu(g[o],h)}catch(A){Ee(i,i.return,A)}}a&&u&64&&Xd(r),Ai(r,r.return);break;case 27:nh(r);case 26:case 5:rn(o,r,a),a&&i===null&&u&4&&eh(r),Ai(r,r.return);break;case 12:rn(o,r,a);break;case 31:rn(o,r,a),a&&u&4&&sh(o,r);break;case 13:rn(o,r,a),a&&u&4&&lh(o,r);break;case 22:r.memoizedState===null&&rn(o,r,a),Ai(r,r.return);break;case 30:break;default:rn(o,r,a)}t=t.sibling}}function bl(e,t){var a=null;e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(a=e.memoizedState.cachePool.pool),e=null,t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(e=t.memoizedState.cachePool.pool),e!==a&&(e!=null&&e.refCount++,a!=null&&ui(a))}function Tl(e,t){e=null,t.alternate!==null&&(e=t.alternate.memoizedState.cache),t=t.memoizedState.cache,t!==e&&(t.refCount++,e!=null&&ui(e))}function zt(e,t,a,i){if(t.subtreeFlags&10256)for(t=t.child;t!==null;)dh(e,t,a,i),t=t.sibling}function dh(e,t,a,i){var o=t.flags;switch(t.tag){case 0:case 11:case 15:zt(e,t,a,i),o&2048&&Si(9,t);break;case 1:zt(e,t,a,i);break;case 3:zt(e,t,a,i),o&2048&&(e=null,t.alternate!==null&&(e=t.alternate.memoizedState.cache),t=t.memoizedState.cache,t!==e&&(t.refCount++,e!=null&&ui(e)));break;case 12:if(o&2048){zt(e,t,a,i),e=t.stateNode;try{var r=t.memoizedProps,u=r.id,h=r.onPostCommit;typeof h=="function"&&h(u,t.alternate===null?"mount":"update",e.passiveEffectDuration,-0)}catch(g){Ee(t,t.return,g)}}else zt(e,t,a,i);break;case 31:zt(e,t,a,i);break;case 13:zt(e,t,a,i);break;case 23:break;case 22:r=t.stateNode,u=t.alternate,t.memoizedState!==null?r._visibility&2?zt(e,t,a,i):wi(e,t):r._visibility&2?zt(e,t,a,i):(r._visibility|=2,xa(e,t,a,i,(t.subtreeFlags&10256)!==0||!1)),o&2048&&bl(u,t);break;case 24:zt(e,t,a,i),o&2048&&Tl(t.alternate,t);break;default:zt(e,t,a,i)}}function xa(e,t,a,i,o){for(o=o&&((t.subtreeFlags&10256)!==0||!1),t=t.child;t!==null;){var r=e,u=t,h=a,g=i,A=u.flags;switch(u.tag){case 0:case 11:case 15:xa(r,u,h,g,o),Si(8,u);break;case 23:break;case 22:var N=u.stateNode;u.memoizedState!==null?N._visibility&2?xa(r,u,h,g,o):wi(r,u):(N._visibility|=2,xa(r,u,h,g,o)),o&&A&2048&&bl(u.alternate,u);break;case 24:xa(r,u,h,g,o),o&&A&2048&&Tl(u.alternate,u);break;default:xa(r,u,h,g,o)}t=t.sibling}}function wi(e,t){if(t.subtreeFlags&10256)for(t=t.child;t!==null;){var a=e,i=t,o=i.flags;switch(i.tag){case 22:wi(a,i),o&2048&&bl(i.alternate,i);break;case 24:wi(a,i),o&2048&&Tl(i.alternate,i);break;default:wi(a,i)}t=t.sibling}}var Ri=8192;function La(e,t,a){if(e.subtreeFlags&Ri)for(e=e.child;e!==null;)hh(e,t,a),e=e.sibling}function hh(e,t,a){switch(e.tag){case 26:La(e,t,a),e.flags&Ri&&e.memoizedState!==null&&Lg(a,Ht,e.memoizedState,e.memoizedProps);break;case 5:La(e,t,a);break;case 3:case 4:var i=Ht;Ht=cr(e.stateNode.containerInfo),La(e,t,a),Ht=i;break;case 22:e.memoizedState===null&&(i=e.alternate,i!==null&&i.memoizedState!==null?(i=Ri,Ri=16777216,La(e,t,a),Ri=i):La(e,t,a));break;default:La(e,t,a)}}function ph(e){var t=e.alternate;if(t!==null&&(e=t.child,e!==null)){t.child=null;do t=e.sibling,e.sibling=null,e=t;while(e!==null)}}function Fi(e){var t=e.deletions;if((e.flags&16)!==0){if(t!==null)for(var a=0;a<t.length;a++){var i=t[a];Ye=i,mh(i,e)}ph(e)}if(e.subtreeFlags&10256)for(e=e.child;e!==null;)fh(e),e=e.sibling}function fh(e){switch(e.tag){case 0:case 11:case 15:Fi(e),e.flags&2048&&wn(9,e,e.return);break;case 3:Fi(e);break;case 12:Fi(e);break;case 22:var t=e.stateNode;e.memoizedState!==null&&t._visibility&2&&(e.return===null||e.return.tag!==13)?(t._visibility&=-3,Zo(e)):Fi(e);break;default:Fi(e)}}function Zo(e){var t=e.deletions;if((e.flags&16)!==0){if(t!==null)for(var a=0;a<t.length;a++){var i=t[a];Ye=i,mh(i,e)}ph(e)}for(e=e.child;e!==null;){switch(t=e,t.tag){case 0:case 11:case 15:wn(8,t,t.return),Zo(t);break;case 22:a=t.stateNode,a._visibility&2&&(a._visibility&=-3,Zo(t));break;default:Zo(t)}e=e.sibling}}function mh(e,t){for(;Ye!==null;){var a=Ye;switch(a.tag){case 0:case 11:case 15:wn(8,a,t);break;case 23:case 22:if(a.memoizedState!==null&&a.memoizedState.cachePool!==null){var i=a.memoizedState.cachePool.pool;i!=null&&i.refCount++}break;case 24:ui(a.memoizedState.cache)}if(i=a.child,i!==null)i.return=a,Ye=i;else e:for(a=e;Ye!==null;){i=Ye;var o=i.sibling,r=i.return;if(oh(i),i===a){Ye=null;break e}if(o!==null){o.return=r,Ye=o;break e}Ye=r}}}var _m={getCacheForType:function(e){var t=qe(Me),a=t.data.get(e);return a===void 0&&(a=e(),t.data.set(e,a)),a},cacheSignal:function(){return qe(Me).controller.signal}},qm=typeof WeakMap=="function"?WeakMap:Map,ge=0,Re=null,oe=null,le=0,Te=0,mt=null,Rn=!1,Ca=!1,El=!1,sn=0,De=0,Fn=0,aa=0,Ol=0,gt=0,Da=0,Ni=null,rt=null,vl=!1,Qo=0,gh=0,Xo=1/0,Jo=null,Nn=null,Be=0,In=null,ka=null,ln=0,Sl=0,Al=null,yh=null,Ii=0,wl=null;function yt(){return(ge&2)!==0&&le!==0?le&-le:I.T!==null?Ll():Dc()}function bh(){if(gt===0)if((le&536870912)===0||ue){var e=ro;ro<<=1,(ro&3932160)===0&&(ro=262144),gt=e}else gt=536870912;return e=pt.current,e!==null&&(e.flags|=32),gt}function st(e,t,a){(e===Re&&(Te===2||Te===9)||e.cancelPendingCommit!==null)&&(Ha(e,0),xn(e,le,gt,!1)),Za(e,a),((ge&2)===0||e!==Re)&&(e===Re&&((ge&2)===0&&(aa|=a),De===4&&xn(e,le,gt,!1)),Yt(e))}function Th(e,t,a){if((ge&6)!==0)throw Error(c(327));var i=!a&&(t&127)===0&&(t&e.expiredLanes)===0||Ka(e,t),o=i?Zm(e,t):Fl(e,t,!0),r=i;do{if(o===0){Ca&&!i&&xn(e,t,0,!1);break}else{if(a=e.current.alternate,r&&!Vm(a)){o=Fl(e,t,!1),r=!1;continue}if(o===2){if(r=t,e.errorRecoveryDisabledLanes&r)var u=0;else u=e.pendingLanes&-536870913,u=u!==0?u:u&536870912?536870912:0;if(u!==0){t=u;e:{var h=e;o=Ni;var g=h.current.memoizedState.isDehydrated;if(g&&(Ha(h,u).flags|=256),u=Fl(h,u,!1),u!==2){if(El&&!g){h.errorRecoveryDisabledLanes|=r,aa|=r,o=4;break e}r=rt,rt=o,r!==null&&(rt===null?rt=r:rt.push.apply(rt,r))}o=u}if(r=!1,o!==2)continue}}if(o===1){Ha(e,0),xn(e,t,0,!0);break}e:{switch(i=e,r=o,r){case 0:case 1:throw Error(c(345));case 4:if((t&4194048)!==t)break;case 6:xn(i,t,gt,!Rn);break e;case 2:rt=null;break;case 3:case 5:break;default:throw Error(c(329))}if((t&62914560)===t&&(o=Qo+300-lt(),10<o)){if(xn(i,t,gt,!Rn),lo(i,0,!0)!==0)break e;ln=t,i.timeoutHandle=Zh(Eh.bind(null,i,a,rt,Jo,vl,t,gt,aa,Da,Rn,r,"Throttled",-0,0),o);break e}Eh(i,a,rt,Jo,vl,t,gt,aa,Da,Rn,r,null,-0,0)}}break}while(!0);Yt(e)}function Eh(e,t,a,i,o,r,u,h,g,A,N,C,w,R){if(e.timeoutHandle=-1,C=t.subtreeFlags,C&8192||(C&16785408)===16785408){C={stylesheets:null,count:0,imgCount:0,imgBytes:0,suspenseyImages:[],waitingForImages:!0,waitingForViewTransition:!1,unsuspend:_t},hh(t,r,C);var B=(r&62914560)===r?Qo-lt():(r&4194048)===r?gh-lt():0;if(B=Cg(C,B),B!==null){ln=r,e.cancelPendingCommit=B(Nh.bind(null,e,t,r,a,i,o,u,h,g,N,C,null,w,R)),xn(e,r,u,!A);return}}Nh(e,t,r,a,i,o,u,h,g)}function Vm(e){for(var t=e;;){var a=t.tag;if((a===0||a===11||a===15)&&t.flags&16384&&(a=t.updateQueue,a!==null&&(a=a.stores,a!==null)))for(var i=0;i<a.length;i++){var o=a[i],r=o.getSnapshot;o=o.value;try{if(!dt(r(),o))return!1}catch{return!1}}if(a=t.child,t.subtreeFlags&16384&&a!==null)a.return=t,t=a;else{if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return!0;t=t.return}t.sibling.return=t.return,t=t.sibling}}return!0}function xn(e,t,a,i){t&=~Ol,t&=~aa,e.suspendedLanes|=t,e.pingedLanes&=~t,i&&(e.warmLanes|=t),i=e.expirationTimes;for(var o=t;0<o;){var r=31-ut(o),u=1<<r;i[r]=-1,o&=~u}a!==0&&xc(e,a,t)}function er(){return(ge&6)===0?(xi(0),!1):!0}function Rl(){if(oe!==null){if(Te===0)var e=oe.return;else e=oe,Zt=Vn=null,Ps(e),wa=null,hi=0,e=oe;for(;e!==null;)Qd(e.alternate,e),e=e.return;oe=null}}function Ha(e,t){var a=e.timeoutHandle;a!==-1&&(e.timeoutHandle=-1,fg(a)),a=e.cancelPendingCommit,a!==null&&(e.cancelPendingCommit=null,a()),ln=0,Rl(),Re=e,oe=a=Vt(e.current,null),le=t,Te=0,mt=null,Rn=!1,Ca=Ka(e,t),El=!1,Da=gt=Ol=aa=Fn=De=0,rt=Ni=null,vl=!1,(t&8)!==0&&(t|=t&32);var i=e.entangledLanes;if(i!==0)for(e=e.entanglements,i&=t;0<i;){var o=31-ut(i),r=1<<o;t|=e[o],i&=~r}return sn=t,Oo(),a}function Oh(e,t){te=null,I.H=Ei,t===Aa||t===Io?(t=Mu(),Te=3):t===xs?(t=Mu(),Te=4):Te=t===il?8:t!==null&&typeof t=="object"&&typeof t.then=="function"?6:1,mt=t,oe===null&&(De=1,Yo(e,At(t,e.current)))}function vh(){var e=pt.current;return e===null?!0:(le&4194048)===le?Nt===null:(le&62914560)===le||(le&536870912)!==0?e===Nt:!1}function Sh(){var e=I.H;return I.H=Ei,e===null?Ei:e}function Ah(){var e=I.A;return I.A=_m,e}function tr(){De=4,Rn||(le&4194048)!==le&&pt.current!==null||(Ca=!0),(Fn&134217727)===0&&(aa&134217727)===0||Re===null||xn(Re,le,gt,!1)}function Fl(e,t,a){var i=ge;ge|=2;var o=Sh(),r=Ah();(Re!==e||le!==t)&&(Jo=null,Ha(e,t)),t=!1;var u=De;e:do try{if(Te!==0&&oe!==null){var h=oe,g=mt;switch(Te){case 8:Rl(),u=6;break e;case 3:case 2:case 9:case 6:pt.current===null&&(t=!0);var A=Te;if(Te=0,mt=null,za(e,h,g,A),a&&Ca){u=0;break e}break;default:A=Te,Te=0,mt=null,za(e,h,g,A)}}Km(),u=De;break}catch(N){Oh(e,N)}while(!0);return t&&e.shellSuspendCounter++,Zt=Vn=null,ge=i,I.H=o,I.A=r,oe===null&&(Re=null,le=0,Oo()),u}function Km(){for(;oe!==null;)wh(oe)}function Zm(e,t){var a=ge;ge|=2;var i=Sh(),o=Ah();Re!==e||le!==t?(Jo=null,Xo=lt()+500,Ha(e,t)):Ca=Ka(e,t);e:do try{if(Te!==0&&oe!==null){t=oe;var r=mt;t:switch(Te){case 1:Te=0,mt=null,za(e,t,r,1);break;case 2:case 9:if(Hu(r)){Te=0,mt=null,Rh(t);break}t=function(){Te!==2&&Te!==9||Re!==e||(Te=7),Yt(e)},r.then(t,t);break e;case 3:Te=7;break e;case 4:Te=5;break e;case 7:Hu(r)?(Te=0,mt=null,Rh(t)):(Te=0,mt=null,za(e,t,r,7));break;case 5:var u=null;switch(oe.tag){case 26:u=oe.memoizedState;case 5:case 27:var h=oe;if(u?dp(u):h.stateNode.complete){Te=0,mt=null;var g=h.sibling;if(g!==null)oe=g;else{var A=h.return;A!==null?(oe=A,nr(A)):oe=null}break t}}Te=0,mt=null,za(e,t,r,5);break;case 6:Te=0,mt=null,za(e,t,r,6);break;case 8:Rl(),De=6;break e;default:throw Error(c(462))}}Qm();break}catch(N){Oh(e,N)}while(!0);return Zt=Vn=null,I.H=i,I.A=o,ge=a,oe!==null?0:(Re=null,le=0,Oo(),De)}function Qm(){for(;oe!==null&&!Ef();)wh(oe)}function wh(e){var t=Kd(e.alternate,e,sn);e.memoizedProps=e.pendingProps,t===null?nr(e):oe=t}function Rh(e){var t=e,a=t.alternate;switch(t.tag){case 15:case 0:t=Yd(a,t,t.pendingProps,t.type,void 0,le);break;case 11:t=Yd(a,t,t.pendingProps,t.type.render,t.ref,le);break;case 5:Ps(t);default:Qd(a,t),t=oe=Au(t,sn),t=Kd(a,t,sn)}e.memoizedProps=e.pendingProps,t===null?nr(e):oe=t}function za(e,t,a,i){Zt=Vn=null,Ps(t),wa=null,hi=0;var o=t.return;try{if(jm(e,o,t,a,le)){De=1,Yo(e,At(a,e.current)),oe=null;return}}catch(r){if(o!==null)throw oe=o,r;De=1,Yo(e,At(a,e.current)),oe=null;return}t.flags&32768?(ue||i===1?e=!0:Ca||(le&536870912)!==0?e=!1:(Rn=e=!0,(i===2||i===9||i===3||i===6)&&(i=pt.current,i!==null&&i.tag===13&&(i.flags|=16384))),Fh(t,e)):nr(t)}function nr(e){var t=e;do{if((t.flags&32768)!==0){Fh(t,Rn);return}e=t.return;var a=Pm(t.alternate,t,sn);if(a!==null){oe=a;return}if(t=t.sibling,t!==null){oe=t;return}oe=t=e}while(t!==null);De===0&&(De=5)}function Fh(e,t){do{var a=Ym(e.alternate,e);if(a!==null){a.flags&=32767,oe=a;return}if(a=e.return,a!==null&&(a.flags|=32768,a.subtreeFlags=0,a.deletions=null),!t&&(e=e.sibling,e!==null)){oe=e;return}oe=e=a}while(e!==null);De=6,oe=null}function Nh(e,t,a,i,o,r,u,h,g){e.cancelPendingCommit=null;do ar();while(Be!==0);if((ge&6)!==0)throw Error(c(327));if(t!==null){if(t===e.current)throw Error(c(177));if(r=t.lanes|t.childLanes,r|=ms,xf(e,a,r,u,h,g),e===Re&&(oe=Re=null,le=0),ka=t,In=e,ln=a,Sl=r,Al=o,yh=i,(t.subtreeFlags&10256)!==0||(t.flags&10256)!==0?(e.callbackNode=null,e.callbackPriority=0,tg(io,function(){return Dh(),null})):(e.callbackNode=null,e.callbackPriority=0),i=(t.flags&13878)!==0,(t.subtreeFlags&13878)!==0||i){i=I.T,I.T=null,o=j.p,j.p=2,u=ge,ge|=4;try{$m(e,t,a)}finally{ge=u,j.p=o,I.T=i}}Be=1,Ih(),xh(),Lh()}}function Ih(){if(Be===1){Be=0;var e=In,t=ka,a=(t.flags&13878)!==0;if((t.subtreeFlags&13878)!==0||a){a=I.T,I.T=null;var i=j.p;j.p=2;var o=ge;ge|=4;try{ch(t,e);var r=jl,u=mu(e.containerInfo),h=r.focusedElem,g=r.selectionRange;if(u!==h&&h&&h.ownerDocument&&fu(h.ownerDocument.documentElement,h)){if(g!==null&&us(h)){var A=g.start,N=g.end;if(N===void 0&&(N=A),"selectionStart"in h)h.selectionStart=A,h.selectionEnd=Math.min(N,h.value.length);else{var C=h.ownerDocument||document,w=C&&C.defaultView||window;if(w.getSelection){var R=w.getSelection(),B=h.textContent.length,V=Math.min(g.start,B),Ae=g.end===void 0?V:Math.min(g.end,B);!R.extend&&V>Ae&&(u=Ae,Ae=V,V=u);var v=pu(h,V),T=pu(h,Ae);if(v&&T&&(R.rangeCount!==1||R.anchorNode!==v.node||R.anchorOffset!==v.offset||R.focusNode!==T.node||R.focusOffset!==T.offset)){var S=C.createRange();S.setStart(v.node,v.offset),R.removeAllRanges(),V>Ae?(R.addRange(S),R.extend(T.node,T.offset)):(S.setEnd(T.node,T.offset),R.addRange(S))}}}}for(C=[],R=h;R=R.parentNode;)R.nodeType===1&&C.push({element:R,left:R.scrollLeft,top:R.scrollTop});for(typeof h.focus=="function"&&h.focus(),h=0;h<C.length;h++){var x=C[h];x.element.scrollLeft=x.left,x.element.scrollTop=x.top}}mr=!!Ul,jl=Ul=null}finally{ge=o,j.p=i,I.T=a}}e.current=t,Be=2}}function xh(){if(Be===2){Be=0;var e=In,t=ka,a=(t.flags&8772)!==0;if((t.subtreeFlags&8772)!==0||a){a=I.T,I.T=null;var i=j.p;j.p=2;var o=ge;ge|=4;try{ih(e,t.alternate,t)}finally{ge=o,j.p=i,I.T=a}}Be=3}}function Lh(){if(Be===4||Be===3){Be=0,Of();var e=In,t=ka,a=ln,i=yh;(t.subtreeFlags&10256)!==0||(t.flags&10256)!==0?Be=5:(Be=0,ka=In=null,Ch(e,e.pendingLanes));var o=e.pendingLanes;if(o===0&&(Nn=null),Wr(a),t=t.stateNode,ct&&typeof ct.onCommitFiberRoot=="function")try{ct.onCommitFiberRoot(Va,t,void 0,(t.current.flags&128)===128)}catch{}if(i!==null){t=I.T,o=j.p,j.p=2,I.T=null;try{for(var r=e.onRecoverableError,u=0;u<i.length;u++){var h=i[u];r(h.value,{componentStack:h.stack})}}finally{I.T=t,j.p=o}}(ln&3)!==0&&ar(),Yt(e),o=e.pendingLanes,(a&261930)!==0&&(o&42)!==0?e===wl?Ii++:(Ii=0,wl=e):Ii=0,xi(0)}}function Ch(e,t){(e.pooledCacheLanes&=t)===0&&(t=e.pooledCache,t!=null&&(e.pooledCache=null,ui(t)))}function ar(){return Ih(),xh(),Lh(),Dh()}function Dh(){if(Be!==5)return!1;var e=In,t=Sl;Sl=0;var a=Wr(ln),i=I.T,o=j.p;try{j.p=32>a?32:a,I.T=null,a=Al,Al=null;var r=In,u=ln;if(Be=0,ka=In=null,ln=0,(ge&6)!==0)throw Error(c(331));var h=ge;if(ge|=4,fh(r.current),dh(r,r.current,u,a),ge=h,xi(0,!1),ct&&typeof ct.onPostCommitFiberRoot=="function")try{ct.onPostCommitFiberRoot(Va,r)}catch{}return!0}finally{j.p=o,I.T=i,Ch(e,t)}}function kh(e,t,a){t=At(a,t),t=al(e.stateNode,t,2),e=vn(e,t,2),e!==null&&(Za(e,2),Yt(e))}function Ee(e,t,a){if(e.tag===3)kh(e,e,a);else for(;t!==null;){if(t.tag===3){kh(t,e,a);break}else if(t.tag===1){var i=t.stateNode;if(typeof t.type.getDerivedStateFromError=="function"||typeof i.componentDidCatch=="function"&&(Nn===null||!Nn.has(i))){e=At(a,e),a=Hd(2),i=vn(t,a,2),i!==null&&(zd(a,i,t,e),Za(i,2),Yt(i));break}}t=t.return}}function Nl(e,t,a){var i=e.pingCache;if(i===null){i=e.pingCache=new qm;var o=new Set;i.set(t,o)}else o=i.get(t),o===void 0&&(o=new Set,i.set(t,o));o.has(a)||(El=!0,o.add(a),e=Xm.bind(null,e,t,a),t.then(e,e))}function Xm(e,t,a){var i=e.pingCache;i!==null&&i.delete(t),e.pingedLanes|=e.suspendedLanes&a,e.warmLanes&=~a,Re===e&&(le&a)===a&&(De===4||De===3&&(le&62914560)===le&&300>lt()-Qo?(ge&2)===0&&Ha(e,0):Ol|=a,Da===le&&(Da=0)),Yt(e)}function Hh(e,t){t===0&&(t=Ic()),e=Wn(e,t),e!==null&&(Za(e,t),Yt(e))}function Jm(e){var t=e.memoizedState,a=0;t!==null&&(a=t.retryLane),Hh(e,a)}function eg(e,t){var a=0;switch(e.tag){case 31:case 13:var i=e.stateNode,o=e.memoizedState;o!==null&&(a=o.retryLane);break;case 19:i=e.stateNode;break;case 22:i=e.stateNode._retryCache;break;default:throw Error(c(314))}i!==null&&i.delete(t),Hh(e,a)}function tg(e,t){return Br(e,t)}var ir=null,Ma=null,Il=!1,or=!1,xl=!1,Ln=0;function Yt(e){e!==Ma&&e.next===null&&(Ma===null?ir=Ma=e:Ma=Ma.next=e),or=!0,Il||(Il=!0,ag())}function xi(e,t){if(!xl&&or){xl=!0;do for(var a=!1,i=ir;i!==null;){if(e!==0){var o=i.pendingLanes;if(o===0)var r=0;else{var u=i.suspendedLanes,h=i.pingedLanes;r=(1<<31-ut(42|e)+1)-1,r&=o&~(u&~h),r=r&201326741?r&201326741|1:r?r|2:0}r!==0&&(a=!0,jh(i,r))}else r=le,r=lo(i,i===Re?r:0,i.cancelPendingCommit!==null||i.timeoutHandle!==-1),(r&3)===0||Ka(i,r)||(a=!0,jh(i,r));i=i.next}while(a);xl=!1}}function ng(){zh()}function zh(){or=Il=!1;var e=0;Ln!==0&&pg()&&(e=Ln);for(var t=lt(),a=null,i=ir;i!==null;){var o=i.next,r=Mh(i,t);r===0?(i.next=null,a===null?ir=o:a.next=o,o===null&&(Ma=a)):(a=i,(e!==0||(r&3)!==0)&&(or=!0)),i=o}Be!==0&&Be!==5||xi(e),Ln!==0&&(Ln=0)}function Mh(e,t){for(var a=e.suspendedLanes,i=e.pingedLanes,o=e.expirationTimes,r=e.pendingLanes&-62914561;0<r;){var u=31-ut(r),h=1<<u,g=o[u];g===-1?((h&a)===0||(h&i)!==0)&&(o[u]=If(h,t)):g<=t&&(e.expiredLanes|=h),r&=~h}if(t=Re,a=le,a=lo(e,e===t?a:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),i=e.callbackNode,a===0||e===t&&(Te===2||Te===9)||e.cancelPendingCommit!==null)return i!==null&&i!==null&&Pr(i),e.callbackNode=null,e.callbackPriority=0;if((a&3)===0||Ka(e,a)){if(t=a&-a,t===e.callbackPriority)return t;switch(i!==null&&Pr(i),Wr(a)){case 2:case 8:a=Fc;break;case 32:a=io;break;case 268435456:a=Nc;break;default:a=io}return i=Uh.bind(null,e),a=Br(a,i),e.callbackPriority=t,e.callbackNode=a,t}return i!==null&&i!==null&&Pr(i),e.callbackPriority=2,e.callbackNode=null,2}function Uh(e,t){if(Be!==0&&Be!==5)return e.callbackNode=null,e.callbackPriority=0,null;var a=e.callbackNode;if(ar()&&e.callbackNode!==a)return null;var i=le;return i=lo(e,e===Re?i:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),i===0?null:(Th(e,i,t),Mh(e,lt()),e.callbackNode!=null&&e.callbackNode===a?Uh.bind(null,e):null)}function jh(e,t){if(ar())return null;Th(e,t,!0)}function ag(){mg(function(){(ge&6)!==0?Br(Rc,ng):zh()})}function Ll(){if(Ln===0){var e=va;e===0&&(e=oo,oo<<=1,(oo&261888)===0&&(oo=256)),Ln=e}return Ln}function Gh(e){return e==null||typeof e=="symbol"||typeof e=="boolean"?null:typeof e=="function"?e:po(""+e)}function Bh(e,t){var a=t.ownerDocument.createElement("input");return a.name=t.name,a.value=t.value,e.id&&a.setAttribute("form",e.id),t.parentNode.insertBefore(a,t),e=new FormData(e),a.parentNode.removeChild(a),e}function ig(e,t,a,i,o){if(t==="submit"&&a&&a.stateNode===o){var r=Gh((o[tt]||null).action),u=i.submitter;u&&(t=(t=u[tt]||null)?Gh(t.formAction):u.getAttribute("formAction"),t!==null&&(r=t,u=null));var h=new yo("action","action",null,i,o);e.push({event:h,listeners:[{instance:null,listener:function(){if(i.defaultPrevented){if(Ln!==0){var g=u?Bh(o,u):new FormData(o);Qs(a,{pending:!0,data:g,method:o.method,action:r},null,g)}}else typeof r=="function"&&(h.preventDefault(),g=u?Bh(o,u):new FormData(o),Qs(a,{pending:!0,data:g,method:o.method,action:r},r,g))},currentTarget:o}]})}}for(var Cl=0;Cl<fs.length;Cl++){var Dl=fs[Cl],og=Dl.toLowerCase(),rg=Dl[0].toUpperCase()+Dl.slice(1);kt(og,"on"+rg)}kt(bu,"onAnimationEnd"),kt(Tu,"onAnimationIteration"),kt(Eu,"onAnimationStart"),kt("dblclick","onDoubleClick"),kt("focusin","onFocus"),kt("focusout","onBlur"),kt(vm,"onTransitionRun"),kt(Sm,"onTransitionStart"),kt(Am,"onTransitionCancel"),kt(Ou,"onTransitionEnd"),la("onMouseEnter",["mouseout","mouseover"]),la("onMouseLeave",["mouseout","mouseover"]),la("onPointerEnter",["pointerout","pointerover"]),la("onPointerLeave",["pointerout","pointerover"]),Bn("onChange","change click focusin focusout input keydown keyup selectionchange".split(" ")),Bn("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),Bn("onBeforeInput",["compositionend","keypress","textInput","paste"]),Bn("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" ")),Bn("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" ")),Bn("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var Li="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),sg=new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(Li));function Ph(e,t){t=(t&4)!==0;for(var a=0;a<e.length;a++){var i=e[a],o=i.event;i=i.listeners;e:{var r=void 0;if(t)for(var u=i.length-1;0<=u;u--){var h=i[u],g=h.instance,A=h.currentTarget;if(h=h.listener,g!==r&&o.isPropagationStopped())break e;r=h,o.currentTarget=A;try{r(o)}catch(N){Eo(N)}o.currentTarget=null,r=g}else for(u=0;u<i.length;u++){if(h=i[u],g=h.instance,A=h.currentTarget,h=h.listener,g!==r&&o.isPropagationStopped())break e;r=h,o.currentTarget=A;try{r(o)}catch(N){Eo(N)}o.currentTarget=null,r=g}}}}function re(e,t){var a=t[_r];a===void 0&&(a=t[_r]=new Set);var i=e+"__bubble";a.has(i)||(Yh(t,e,2,!1),a.add(i))}function kl(e,t,a){var i=0;t&&(i|=4),Yh(a,e,i,t)}var rr="_reactListening"+Math.random().toString(36).slice(2);function Hl(e){if(!e[rr]){e[rr]=!0,zc.forEach(function(a){a!=="selectionchange"&&(sg.has(a)||kl(a,!1,e),kl(a,!0,e))});var t=e.nodeType===9?e:e.ownerDocument;t===null||t[rr]||(t[rr]=!0,kl("selectionchange",!1,t))}}function Yh(e,t,a,i){switch(bp(t)){case 2:var o=Hg;break;case 8:o=zg;break;default:o=Zl}a=o.bind(null,t,a,e),o=void 0,!ts||t!=="touchstart"&&t!=="touchmove"&&t!=="wheel"||(o=!0),i?o!==void 0?e.addEventListener(t,a,{capture:!0,passive:o}):e.addEventListener(t,a,!0):o!==void 0?e.addEventListener(t,a,{passive:o}):e.addEventListener(t,a,!1)}function zl(e,t,a,i,o){var r=i;if((t&1)===0&&(t&2)===0&&i!==null)e:for(;;){if(i===null)return;var u=i.tag;if(u===3||u===4){var h=i.stateNode.containerInfo;if(h===o)break;if(u===4)for(u=i.return;u!==null;){var g=u.tag;if((g===3||g===4)&&u.stateNode.containerInfo===o)return;u=u.return}for(;h!==null;){if(u=oa(h),u===null)return;if(g=u.tag,g===5||g===6||g===26||g===27){i=r=u;continue e}h=h.parentNode}}i=i.return}Vc(function(){var A=r,N=Jr(a),C=[];e:{var w=vu.get(e);if(w!==void 0){var R=yo,B=e;switch(e){case"keypress":if(mo(a)===0)break e;case"keydown":case"keyup":R=em;break;case"focusin":B="focus",R=os;break;case"focusout":B="blur",R=os;break;case"beforeblur":case"afterblur":R=os;break;case"click":if(a.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":R=Qc;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":R=Pf;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":R=am;break;case bu:case Tu:case Eu:R=Wf;break;case Ou:R=om;break;case"scroll":case"scrollend":R=Gf;break;case"wheel":R=sm;break;case"copy":case"cut":case"paste":R=qf;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":R=Jc;break;case"toggle":case"beforetoggle":R=cm}var V=(t&4)!==0,Ae=!V&&(e==="scroll"||e==="scrollend"),v=V?w!==null?w+"Capture":null:w;V=[];for(var T=A,S;T!==null;){var x=T;if(S=x.stateNode,x=x.tag,x!==5&&x!==26&&x!==27||S===null||v===null||(x=Ja(T,v),x!=null&&V.push(Ci(T,x,S))),Ae)break;T=T.return}0<V.length&&(w=new R(w,B,null,a,N),C.push({event:w,listeners:V}))}}if((t&7)===0){e:{if(w=e==="mouseover"||e==="pointerover",R=e==="mouseout"||e==="pointerout",w&&a!==Xr&&(B=a.relatedTarget||a.fromElement)&&(oa(B)||B[ia]))break e;if((R||w)&&(w=N.window===N?N:(w=N.ownerDocument)?w.defaultView||w.parentWindow:window,R?(B=a.relatedTarget||a.toElement,R=A,B=B?oa(B):null,B!==null&&(Ae=d(B),V=B.tag,B!==Ae||V!==5&&V!==27&&V!==6)&&(B=null)):(R=null,B=A),R!==B)){if(V=Qc,x="onMouseLeave",v="onMouseEnter",T="mouse",(e==="pointerout"||e==="pointerover")&&(V=Jc,x="onPointerLeave",v="onPointerEnter",T="pointer"),Ae=R==null?w:Xa(R),S=B==null?w:Xa(B),w=new V(x,T+"leave",R,a,N),w.target=Ae,w.relatedTarget=S,x=null,oa(N)===A&&(V=new V(v,T+"enter",B,a,N),V.target=S,V.relatedTarget=Ae,x=V),Ae=x,R&&B)t:{for(V=lg,v=R,T=B,S=0,x=v;x;x=V(x))S++;x=0;for(var _=T;_;_=V(_))x++;for(;0<S-x;)v=V(v),S--;for(;0<x-S;)T=V(T),x--;for(;S--;){if(v===T||T!==null&&v===T.alternate){V=v;break t}v=V(v),T=V(T)}V=null}else V=null;R!==null&&$h(C,w,R,V,!1),B!==null&&Ae!==null&&$h(C,Ae,B,V,!0)}}e:{if(w=A?Xa(A):window,R=w.nodeName&&w.nodeName.toLowerCase(),R==="select"||R==="input"&&w.type==="file")var fe=su;else if(ou(w))if(lu)fe=Tm;else{fe=ym;var $=gm}else R=w.nodeName,!R||R.toLowerCase()!=="input"||w.type!=="checkbox"&&w.type!=="radio"?A&&Qr(A.elementType)&&(fe=su):fe=bm;if(fe&&(fe=fe(e,A))){ru(C,fe,a,N);break e}$&&$(e,w,A),e==="focusout"&&A&&w.type==="number"&&A.memoizedProps.value!=null&&Zr(w,"number",w.value)}switch($=A?Xa(A):window,e){case"focusin":(ou($)||$.contentEditable==="true")&&(fa=$,ds=A,si=null);break;case"focusout":si=ds=fa=null;break;case"mousedown":hs=!0;break;case"contextmenu":case"mouseup":case"dragend":hs=!1,gu(C,a,N);break;case"selectionchange":if(Om)break;case"keydown":case"keyup":gu(C,a,N)}var ae;if(ss)e:{switch(e){case"compositionstart":var ce="onCompositionStart";break e;case"compositionend":ce="onCompositionEnd";break e;case"compositionupdate":ce="onCompositionUpdate";break e}ce=void 0}else pa?au(e,a)&&(ce="onCompositionEnd"):e==="keydown"&&a.keyCode===229&&(ce="onCompositionStart");ce&&(eu&&a.locale!=="ko"&&(pa||ce!=="onCompositionStart"?ce==="onCompositionEnd"&&pa&&(ae=Kc()):(mn=N,ns="value"in mn?mn.value:mn.textContent,pa=!0)),$=sr(A,ce),0<$.length&&(ce=new Xc(ce,e,null,a,N),C.push({event:ce,listeners:$}),ae?ce.data=ae:(ae=iu(a),ae!==null&&(ce.data=ae)))),(ae=dm?hm(e,a):pm(e,a))&&(ce=sr(A,"onBeforeInput"),0<ce.length&&($=new Xc("onBeforeInput","beforeinput",null,a,N),C.push({event:$,listeners:ce}),$.data=ae)),ig(C,e,A,a,N)}Ph(C,t)})}function Ci(e,t,a){return{instance:e,listener:t,currentTarget:a}}function sr(e,t){for(var a=t+"Capture",i=[];e!==null;){var o=e,r=o.stateNode;if(o=o.tag,o!==5&&o!==26&&o!==27||r===null||(o=Ja(e,a),o!=null&&i.unshift(Ci(e,o,r)),o=Ja(e,t),o!=null&&i.push(Ci(e,o,r))),e.tag===3)return i;e=e.return}return[]}function lg(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5&&e.tag!==27);return e||null}function $h(e,t,a,i,o){for(var r=t._reactName,u=[];a!==null&&a!==i;){var h=a,g=h.alternate,A=h.stateNode;if(h=h.tag,g!==null&&g===i)break;h!==5&&h!==26&&h!==27||A===null||(g=A,o?(A=Ja(a,r),A!=null&&u.unshift(Ci(a,A,g))):o||(A=Ja(a,r),A!=null&&u.push(Ci(a,A,g)))),a=a.return}u.length!==0&&e.push({event:t,listeners:u})}var cg=/\r\n?/g,ug=/\u0000|\uFFFD/g;function Wh(e){return(typeof e=="string"?e:""+e).replace(cg,`
`).replace(ug,"")}function _h(e,t){return t=Wh(t),Wh(e)===t}function Se(e,t,a,i,o,r){switch(a){case"children":typeof i=="string"?t==="body"||t==="textarea"&&i===""||ua(e,i):(typeof i=="number"||typeof i=="bigint")&&t!=="body"&&ua(e,""+i);break;case"className":uo(e,"class",i);break;case"tabIndex":uo(e,"tabindex",i);break;case"dir":case"role":case"viewBox":case"width":case"height":uo(e,a,i);break;case"style":_c(e,i,r);break;case"data":if(t!=="object"){uo(e,"data",i);break}case"src":case"href":if(i===""&&(t!=="a"||a!=="href")){e.removeAttribute(a);break}if(i==null||typeof i=="function"||typeof i=="symbol"||typeof i=="boolean"){e.removeAttribute(a);break}i=po(""+i),e.setAttribute(a,i);break;case"action":case"formAction":if(typeof i=="function"){e.setAttribute(a,"javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");break}else typeof r=="function"&&(a==="formAction"?(t!=="input"&&Se(e,t,"name",o.name,o,null),Se(e,t,"formEncType",o.formEncType,o,null),Se(e,t,"formMethod",o.formMethod,o,null),Se(e,t,"formTarget",o.formTarget,o,null)):(Se(e,t,"encType",o.encType,o,null),Se(e,t,"method",o.method,o,null),Se(e,t,"target",o.target,o,null)));if(i==null||typeof i=="symbol"||typeof i=="boolean"){e.removeAttribute(a);break}i=po(""+i),e.setAttribute(a,i);break;case"onClick":i!=null&&(e.onclick=_t);break;case"onScroll":i!=null&&re("scroll",e);break;case"onScrollEnd":i!=null&&re("scrollend",e);break;case"dangerouslySetInnerHTML":if(i!=null){if(typeof i!="object"||!("__html"in i))throw Error(c(61));if(a=i.__html,a!=null){if(o.children!=null)throw Error(c(60));e.innerHTML=a}}break;case"multiple":e.multiple=i&&typeof i!="function"&&typeof i!="symbol";break;case"muted":e.muted=i&&typeof i!="function"&&typeof i!="symbol";break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"defaultValue":case"defaultChecked":case"innerHTML":case"ref":break;case"autoFocus":break;case"xlinkHref":if(i==null||typeof i=="function"||typeof i=="boolean"||typeof i=="symbol"){e.removeAttribute("xlink:href");break}a=po(""+i),e.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href",a);break;case"contentEditable":case"spellCheck":case"draggable":case"value":case"autoReverse":case"externalResourcesRequired":case"focusable":case"preserveAlpha":i!=null&&typeof i!="function"&&typeof i!="symbol"?e.setAttribute(a,""+i):e.removeAttribute(a);break;case"inert":case"allowFullScreen":case"async":case"autoPlay":case"controls":case"default":case"defer":case"disabled":case"disablePictureInPicture":case"disableRemotePlayback":case"formNoValidate":case"hidden":case"loop":case"noModule":case"noValidate":case"open":case"playsInline":case"readOnly":case"required":case"reversed":case"scoped":case"seamless":case"itemScope":i&&typeof i!="function"&&typeof i!="symbol"?e.setAttribute(a,""):e.removeAttribute(a);break;case"capture":case"download":i===!0?e.setAttribute(a,""):i!==!1&&i!=null&&typeof i!="function"&&typeof i!="symbol"?e.setAttribute(a,i):e.removeAttribute(a);break;case"cols":case"rows":case"size":case"span":i!=null&&typeof i!="function"&&typeof i!="symbol"&&!isNaN(i)&&1<=i?e.setAttribute(a,i):e.removeAttribute(a);break;case"rowSpan":case"start":i==null||typeof i=="function"||typeof i=="symbol"||isNaN(i)?e.removeAttribute(a):e.setAttribute(a,i);break;case"popover":re("beforetoggle",e),re("toggle",e),co(e,"popover",i);break;case"xlinkActuate":Wt(e,"http://www.w3.org/1999/xlink","xlink:actuate",i);break;case"xlinkArcrole":Wt(e,"http://www.w3.org/1999/xlink","xlink:arcrole",i);break;case"xlinkRole":Wt(e,"http://www.w3.org/1999/xlink","xlink:role",i);break;case"xlinkShow":Wt(e,"http://www.w3.org/1999/xlink","xlink:show",i);break;case"xlinkTitle":Wt(e,"http://www.w3.org/1999/xlink","xlink:title",i);break;case"xlinkType":Wt(e,"http://www.w3.org/1999/xlink","xlink:type",i);break;case"xmlBase":Wt(e,"http://www.w3.org/XML/1998/namespace","xml:base",i);break;case"xmlLang":Wt(e,"http://www.w3.org/XML/1998/namespace","xml:lang",i);break;case"xmlSpace":Wt(e,"http://www.w3.org/XML/1998/namespace","xml:space",i);break;case"is":co(e,"is",i);break;case"innerText":case"textContent":break;default:(!(2<a.length)||a[0]!=="o"&&a[0]!=="O"||a[1]!=="n"&&a[1]!=="N")&&(a=Uf.get(a)||a,co(e,a,i))}}function Ml(e,t,a,i,o,r){switch(a){case"style":_c(e,i,r);break;case"dangerouslySetInnerHTML":if(i!=null){if(typeof i!="object"||!("__html"in i))throw Error(c(61));if(a=i.__html,a!=null){if(o.children!=null)throw Error(c(60));e.innerHTML=a}}break;case"children":typeof i=="string"?ua(e,i):(typeof i=="number"||typeof i=="bigint")&&ua(e,""+i);break;case"onScroll":i!=null&&re("scroll",e);break;case"onScrollEnd":i!=null&&re("scrollend",e);break;case"onClick":i!=null&&(e.onclick=_t);break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"innerHTML":case"ref":break;case"innerText":case"textContent":break;default:if(!Mc.hasOwnProperty(a))e:{if(a[0]==="o"&&a[1]==="n"&&(o=a.endsWith("Capture"),t=a.slice(2,o?a.length-7:void 0),r=e[tt]||null,r=r!=null?r[a]:null,typeof r=="function"&&e.removeEventListener(t,r,o),typeof i=="function")){typeof r!="function"&&r!==null&&(a in e?e[a]=null:e.hasAttribute(a)&&e.removeAttribute(a)),e.addEventListener(t,i,o);break e}a in e?e[a]=i:i===!0?e.setAttribute(a,""):co(e,a,i)}}}function Ke(e,t,a){switch(t){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"img":re("error",e),re("load",e);var i=!1,o=!1,r;for(r in a)if(a.hasOwnProperty(r)){var u=a[r];if(u!=null)switch(r){case"src":i=!0;break;case"srcSet":o=!0;break;case"children":case"dangerouslySetInnerHTML":throw Error(c(137,t));default:Se(e,t,r,u,a,null)}}o&&Se(e,t,"srcSet",a.srcSet,a,null),i&&Se(e,t,"src",a.src,a,null);return;case"input":re("invalid",e);var h=r=u=o=null,g=null,A=null;for(i in a)if(a.hasOwnProperty(i)){var N=a[i];if(N!=null)switch(i){case"name":o=N;break;case"type":u=N;break;case"checked":g=N;break;case"defaultChecked":A=N;break;case"value":r=N;break;case"defaultValue":h=N;break;case"children":case"dangerouslySetInnerHTML":if(N!=null)throw Error(c(137,t));break;default:Se(e,t,i,N,a,null)}}Pc(e,r,h,g,A,u,o,!1);return;case"select":re("invalid",e),i=u=r=null;for(o in a)if(a.hasOwnProperty(o)&&(h=a[o],h!=null))switch(o){case"value":r=h;break;case"defaultValue":u=h;break;case"multiple":i=h;default:Se(e,t,o,h,a,null)}t=r,a=u,e.multiple=!!i,t!=null?ca(e,!!i,t,!1):a!=null&&ca(e,!!i,a,!0);return;case"textarea":re("invalid",e),r=o=i=null;for(u in a)if(a.hasOwnProperty(u)&&(h=a[u],h!=null))switch(u){case"value":i=h;break;case"defaultValue":o=h;break;case"children":r=h;break;case"dangerouslySetInnerHTML":if(h!=null)throw Error(c(91));break;default:Se(e,t,u,h,a,null)}$c(e,i,o,r);return;case"option":for(g in a)a.hasOwnProperty(g)&&(i=a[g],i!=null)&&(g==="selected"?e.selected=i&&typeof i!="function"&&typeof i!="symbol":Se(e,t,g,i,a,null));return;case"dialog":re("beforetoggle",e),re("toggle",e),re("cancel",e),re("close",e);break;case"iframe":case"object":re("load",e);break;case"video":case"audio":for(i=0;i<Li.length;i++)re(Li[i],e);break;case"image":re("error",e),re("load",e);break;case"details":re("toggle",e);break;case"embed":case"source":case"link":re("error",e),re("load",e);case"area":case"base":case"br":case"col":case"hr":case"keygen":case"meta":case"param":case"track":case"wbr":case"menuitem":for(A in a)if(a.hasOwnProperty(A)&&(i=a[A],i!=null))switch(A){case"children":case"dangerouslySetInnerHTML":throw Error(c(137,t));default:Se(e,t,A,i,a,null)}return;default:if(Qr(t)){for(N in a)a.hasOwnProperty(N)&&(i=a[N],i!==void 0&&Ml(e,t,N,i,a,void 0));return}}for(h in a)a.hasOwnProperty(h)&&(i=a[h],i!=null&&Se(e,t,h,i,a,null))}function dg(e,t,a,i){switch(t){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"input":var o=null,r=null,u=null,h=null,g=null,A=null,N=null;for(R in a){var C=a[R];if(a.hasOwnProperty(R)&&C!=null)switch(R){case"checked":break;case"value":break;case"defaultValue":g=C;default:i.hasOwnProperty(R)||Se(e,t,R,null,i,C)}}for(var w in i){var R=i[w];if(C=a[w],i.hasOwnProperty(w)&&(R!=null||C!=null))switch(w){case"type":r=R;break;case"name":o=R;break;case"checked":A=R;break;case"defaultChecked":N=R;break;case"value":u=R;break;case"defaultValue":h=R;break;case"children":case"dangerouslySetInnerHTML":if(R!=null)throw Error(c(137,t));break;default:R!==C&&Se(e,t,w,R,i,C)}}Kr(e,u,h,g,A,N,r,o);return;case"select":R=u=h=w=null;for(r in a)if(g=a[r],a.hasOwnProperty(r)&&g!=null)switch(r){case"value":break;case"multiple":R=g;default:i.hasOwnProperty(r)||Se(e,t,r,null,i,g)}for(o in i)if(r=i[o],g=a[o],i.hasOwnProperty(o)&&(r!=null||g!=null))switch(o){case"value":w=r;break;case"defaultValue":h=r;break;case"multiple":u=r;default:r!==g&&Se(e,t,o,r,i,g)}t=h,a=u,i=R,w!=null?ca(e,!!a,w,!1):!!i!=!!a&&(t!=null?ca(e,!!a,t,!0):ca(e,!!a,a?[]:"",!1));return;case"textarea":R=w=null;for(h in a)if(o=a[h],a.hasOwnProperty(h)&&o!=null&&!i.hasOwnProperty(h))switch(h){case"value":break;case"children":break;default:Se(e,t,h,null,i,o)}for(u in i)if(o=i[u],r=a[u],i.hasOwnProperty(u)&&(o!=null||r!=null))switch(u){case"value":w=o;break;case"defaultValue":R=o;break;case"children":break;case"dangerouslySetInnerHTML":if(o!=null)throw Error(c(91));break;default:o!==r&&Se(e,t,u,o,i,r)}Yc(e,w,R);return;case"option":for(var B in a)w=a[B],a.hasOwnProperty(B)&&w!=null&&!i.hasOwnProperty(B)&&(B==="selected"?e.selected=!1:Se(e,t,B,null,i,w));for(g in i)w=i[g],R=a[g],i.hasOwnProperty(g)&&w!==R&&(w!=null||R!=null)&&(g==="selected"?e.selected=w&&typeof w!="function"&&typeof w!="symbol":Se(e,t,g,w,i,R));return;case"img":case"link":case"area":case"base":case"br":case"col":case"embed":case"hr":case"keygen":case"meta":case"param":case"source":case"track":case"wbr":case"menuitem":for(var V in a)w=a[V],a.hasOwnProperty(V)&&w!=null&&!i.hasOwnProperty(V)&&Se(e,t,V,null,i,w);for(A in i)if(w=i[A],R=a[A],i.hasOwnProperty(A)&&w!==R&&(w!=null||R!=null))switch(A){case"children":case"dangerouslySetInnerHTML":if(w!=null)throw Error(c(137,t));break;default:Se(e,t,A,w,i,R)}return;default:if(Qr(t)){for(var Ae in a)w=a[Ae],a.hasOwnProperty(Ae)&&w!==void 0&&!i.hasOwnProperty(Ae)&&Ml(e,t,Ae,void 0,i,w);for(N in i)w=i[N],R=a[N],!i.hasOwnProperty(N)||w===R||w===void 0&&R===void 0||Ml(e,t,N,w,i,R);return}}for(var v in a)w=a[v],a.hasOwnProperty(v)&&w!=null&&!i.hasOwnProperty(v)&&Se(e,t,v,null,i,w);for(C in i)w=i[C],R=a[C],!i.hasOwnProperty(C)||w===R||w==null&&R==null||Se(e,t,C,w,i,R)}function qh(e){switch(e){case"css":case"script":case"font":case"img":case"image":case"input":case"link":return!0;default:return!1}}function hg(){if(typeof performance.getEntriesByType=="function"){for(var e=0,t=0,a=performance.getEntriesByType("resource"),i=0;i<a.length;i++){var o=a[i],r=o.transferSize,u=o.initiatorType,h=o.duration;if(r&&h&&qh(u)){for(u=0,h=o.responseEnd,i+=1;i<a.length;i++){var g=a[i],A=g.startTime;if(A>h)break;var N=g.transferSize,C=g.initiatorType;N&&qh(C)&&(g=g.responseEnd,u+=N*(g<h?1:(h-A)/(g-A)))}if(--i,t+=8*(r+u)/(o.duration/1e3),e++,10<e)break}}if(0<e)return t/e/1e6}return navigator.connection&&(e=navigator.connection.downlink,typeof e=="number")?e:5}var Ul=null,jl=null;function lr(e){return e.nodeType===9?e:e.ownerDocument}function Vh(e){switch(e){case"http://www.w3.org/2000/svg":return 1;case"http://www.w3.org/1998/Math/MathML":return 2;default:return 0}}function Kh(e,t){if(e===0)switch(t){case"svg":return 1;case"math":return 2;default:return 0}return e===1&&t==="foreignObject"?0:e}function Gl(e,t){return e==="textarea"||e==="noscript"||typeof t.children=="string"||typeof t.children=="number"||typeof t.children=="bigint"||typeof t.dangerouslySetInnerHTML=="object"&&t.dangerouslySetInnerHTML!==null&&t.dangerouslySetInnerHTML.__html!=null}var Bl=null;function pg(){var e=window.event;return e&&e.type==="popstate"?e===Bl?!1:(Bl=e,!0):(Bl=null,!1)}var Zh=typeof setTimeout=="function"?setTimeout:void 0,fg=typeof clearTimeout=="function"?clearTimeout:void 0,Qh=typeof Promise=="function"?Promise:void 0,mg=typeof queueMicrotask=="function"?queueMicrotask:typeof Qh<"u"?function(e){return Qh.resolve(null).then(e).catch(gg)}:Zh;function gg(e){setTimeout(function(){throw e})}function Cn(e){return e==="head"}function Xh(e,t){var a=t,i=0;do{var o=a.nextSibling;if(e.removeChild(a),o&&o.nodeType===8)if(a=o.data,a==="/$"||a==="/&"){if(i===0){e.removeChild(o),Ba(t);return}i--}else if(a==="$"||a==="$?"||a==="$~"||a==="$!"||a==="&")i++;else if(a==="html")Di(e.ownerDocument.documentElement);else if(a==="head"){a=e.ownerDocument.head,Di(a);for(var r=a.firstChild;r;){var u=r.nextSibling,h=r.nodeName;r[Qa]||h==="SCRIPT"||h==="STYLE"||h==="LINK"&&r.rel.toLowerCase()==="stylesheet"||a.removeChild(r),r=u}}else a==="body"&&Di(e.ownerDocument.body);a=o}while(a);Ba(t)}function Jh(e,t){var a=e;e=0;do{var i=a.nextSibling;if(a.nodeType===1?t?(a._stashedDisplay=a.style.display,a.style.display="none"):(a.style.display=a._stashedDisplay||"",a.getAttribute("style")===""&&a.removeAttribute("style")):a.nodeType===3&&(t?(a._stashedText=a.nodeValue,a.nodeValue=""):a.nodeValue=a._stashedText||""),i&&i.nodeType===8)if(a=i.data,a==="/$"){if(e===0)break;e--}else a!=="$"&&a!=="$?"&&a!=="$~"&&a!=="$!"||e++;a=i}while(a)}function Pl(e){var t=e.firstChild;for(t&&t.nodeType===10&&(t=t.nextSibling);t;){var a=t;switch(t=t.nextSibling,a.nodeName){case"HTML":case"HEAD":case"BODY":Pl(a),qr(a);continue;case"SCRIPT":case"STYLE":continue;case"LINK":if(a.rel.toLowerCase()==="stylesheet")continue}e.removeChild(a)}}function yg(e,t,a,i){for(;e.nodeType===1;){var o=a;if(e.nodeName.toLowerCase()!==t.toLowerCase()){if(!i&&(e.nodeName!=="INPUT"||e.type!=="hidden"))break}else if(i){if(!e[Qa])switch(t){case"meta":if(!e.hasAttribute("itemprop"))break;return e;case"link":if(r=e.getAttribute("rel"),r==="stylesheet"&&e.hasAttribute("data-precedence"))break;if(r!==o.rel||e.getAttribute("href")!==(o.href==null||o.href===""?null:o.href)||e.getAttribute("crossorigin")!==(o.crossOrigin==null?null:o.crossOrigin)||e.getAttribute("title")!==(o.title==null?null:o.title))break;return e;case"style":if(e.hasAttribute("data-precedence"))break;return e;case"script":if(r=e.getAttribute("src"),(r!==(o.src==null?null:o.src)||e.getAttribute("type")!==(o.type==null?null:o.type)||e.getAttribute("crossorigin")!==(o.crossOrigin==null?null:o.crossOrigin))&&r&&e.hasAttribute("async")&&!e.hasAttribute("itemprop"))break;return e;default:return e}}else if(t==="input"&&e.type==="hidden"){var r=o.name==null?null:""+o.name;if(o.type==="hidden"&&e.getAttribute("name")===r)return e}else return e;if(e=It(e.nextSibling),e===null)break}return null}function bg(e,t,a){if(t==="")return null;for(;e.nodeType!==3;)if((e.nodeType!==1||e.nodeName!=="INPUT"||e.type!=="hidden")&&!a||(e=It(e.nextSibling),e===null))return null;return e}function ep(e,t){for(;e.nodeType!==8;)if((e.nodeType!==1||e.nodeName!=="INPUT"||e.type!=="hidden")&&!t||(e=It(e.nextSibling),e===null))return null;return e}function Yl(e){return e.data==="$?"||e.data==="$~"}function $l(e){return e.data==="$!"||e.data==="$?"&&e.ownerDocument.readyState!=="loading"}function Tg(e,t){var a=e.ownerDocument;if(e.data==="$~")e._reactRetry=t;else if(e.data!=="$?"||a.readyState!=="loading")t();else{var i=function(){t(),a.removeEventListener("DOMContentLoaded",i)};a.addEventListener("DOMContentLoaded",i),e._reactRetry=i}}function It(e){for(;e!=null;e=e.nextSibling){var t=e.nodeType;if(t===1||t===3)break;if(t===8){if(t=e.data,t==="$"||t==="$!"||t==="$?"||t==="$~"||t==="&"||t==="F!"||t==="F")break;if(t==="/$"||t==="/&")return null}}return e}var Wl=null;function tp(e){e=e.nextSibling;for(var t=0;e;){if(e.nodeType===8){var a=e.data;if(a==="/$"||a==="/&"){if(t===0)return It(e.nextSibling);t--}else a!=="$"&&a!=="$!"&&a!=="$?"&&a!=="$~"&&a!=="&"||t++}e=e.nextSibling}return null}function np(e){e=e.previousSibling;for(var t=0;e;){if(e.nodeType===8){var a=e.data;if(a==="$"||a==="$!"||a==="$?"||a==="$~"||a==="&"){if(t===0)return e;t--}else a!=="/$"&&a!=="/&"||t++}e=e.previousSibling}return null}function ap(e,t,a){switch(t=lr(a),e){case"html":if(e=t.documentElement,!e)throw Error(c(452));return e;case"head":if(e=t.head,!e)throw Error(c(453));return e;case"body":if(e=t.body,!e)throw Error(c(454));return e;default:throw Error(c(451))}}function Di(e){for(var t=e.attributes;t.length;)e.removeAttributeNode(t[0]);qr(e)}var xt=new Map,ip=new Set;function cr(e){return typeof e.getRootNode=="function"?e.getRootNode():e.nodeType===9?e:e.ownerDocument}var cn=j.d;j.d={f:Eg,r:Og,D:vg,C:Sg,L:Ag,m:wg,X:Fg,S:Rg,M:Ng};function Eg(){var e=cn.f(),t=er();return e||t}function Og(e){var t=ra(e);t!==null&&t.tag===5&&t.type==="form"?Od(t):cn.r(e)}var Ua=typeof document>"u"?null:document;function op(e,t,a){var i=Ua;if(i&&typeof t=="string"&&t){var o=vt(t);o='link[rel="'+e+'"][href="'+o+'"]',typeof a=="string"&&(o+='[crossorigin="'+a+'"]'),ip.has(o)||(ip.add(o),e={rel:e,crossOrigin:a,href:t},i.querySelector(o)===null&&(t=i.createElement("link"),Ke(t,"link",e),Pe(t),i.head.appendChild(t)))}}function vg(e){cn.D(e),op("dns-prefetch",e,null)}function Sg(e,t){cn.C(e,t),op("preconnect",e,t)}function Ag(e,t,a){cn.L(e,t,a);var i=Ua;if(i&&e&&t){var o='link[rel="preload"][as="'+vt(t)+'"]';t==="image"&&a&&a.imageSrcSet?(o+='[imagesrcset="'+vt(a.imageSrcSet)+'"]',typeof a.imageSizes=="string"&&(o+='[imagesizes="'+vt(a.imageSizes)+'"]')):o+='[href="'+vt(e)+'"]';var r=o;switch(t){case"style":r=ja(e);break;case"script":r=Ga(e)}xt.has(r)||(e=M({rel:"preload",href:t==="image"&&a&&a.imageSrcSet?void 0:e,as:t},a),xt.set(r,e),i.querySelector(o)!==null||t==="style"&&i.querySelector(ki(r))||t==="script"&&i.querySelector(Hi(r))||(t=i.createElement("link"),Ke(t,"link",e),Pe(t),i.head.appendChild(t)))}}function wg(e,t){cn.m(e,t);var a=Ua;if(a&&e){var i=t&&typeof t.as=="string"?t.as:"script",o='link[rel="modulepreload"][as="'+vt(i)+'"][href="'+vt(e)+'"]',r=o;switch(i){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":r=Ga(e)}if(!xt.has(r)&&(e=M({rel:"modulepreload",href:e},t),xt.set(r,e),a.querySelector(o)===null)){switch(i){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":if(a.querySelector(Hi(r)))return}i=a.createElement("link"),Ke(i,"link",e),Pe(i),a.head.appendChild(i)}}}function Rg(e,t,a){cn.S(e,t,a);var i=Ua;if(i&&e){var o=sa(i).hoistableStyles,r=ja(e);t=t||"default";var u=o.get(r);if(!u){var h={loading:0,preload:null};if(u=i.querySelector(ki(r)))h.loading=5;else{e=M({rel:"stylesheet",href:e,"data-precedence":t},a),(a=xt.get(r))&&_l(e,a);var g=u=i.createElement("link");Pe(g),Ke(g,"link",e),g._p=new Promise(function(A,N){g.onload=A,g.onerror=N}),g.addEventListener("load",function(){h.loading|=1}),g.addEventListener("error",function(){h.loading|=2}),h.loading|=4,ur(u,t,i)}u={type:"stylesheet",instance:u,count:1,state:h},o.set(r,u)}}}function Fg(e,t){cn.X(e,t);var a=Ua;if(a&&e){var i=sa(a).hoistableScripts,o=Ga(e),r=i.get(o);r||(r=a.querySelector(Hi(o)),r||(e=M({src:e,async:!0},t),(t=xt.get(o))&&ql(e,t),r=a.createElement("script"),Pe(r),Ke(r,"link",e),a.head.appendChild(r)),r={type:"script",instance:r,count:1,state:null},i.set(o,r))}}function Ng(e,t){cn.M(e,t);var a=Ua;if(a&&e){var i=sa(a).hoistableScripts,o=Ga(e),r=i.get(o);r||(r=a.querySelector(Hi(o)),r||(e=M({src:e,async:!0,type:"module"},t),(t=xt.get(o))&&ql(e,t),r=a.createElement("script"),Pe(r),Ke(r,"link",e),a.head.appendChild(r)),r={type:"script",instance:r,count:1,state:null},i.set(o,r))}}function rp(e,t,a,i){var o=(o=ie.current)?cr(o):null;if(!o)throw Error(c(446));switch(e){case"meta":case"title":return null;case"style":return typeof a.precedence=="string"&&typeof a.href=="string"?(t=ja(a.href),a=sa(o).hoistableStyles,i=a.get(t),i||(i={type:"style",instance:null,count:0,state:null},a.set(t,i)),i):{type:"void",instance:null,count:0,state:null};case"link":if(a.rel==="stylesheet"&&typeof a.href=="string"&&typeof a.precedence=="string"){e=ja(a.href);var r=sa(o).hoistableStyles,u=r.get(e);if(u||(o=o.ownerDocument||o,u={type:"stylesheet",instance:null,count:0,state:{loading:0,preload:null}},r.set(e,u),(r=o.querySelector(ki(e)))&&!r._p&&(u.instance=r,u.state.loading=5),xt.has(e)||(a={rel:"preload",as:"style",href:a.href,crossOrigin:a.crossOrigin,integrity:a.integrity,media:a.media,hrefLang:a.hrefLang,referrerPolicy:a.referrerPolicy},xt.set(e,a),r||Ig(o,e,a,u.state))),t&&i===null)throw Error(c(528,""));return u}if(t&&i!==null)throw Error(c(529,""));return null;case"script":return t=a.async,a=a.src,typeof a=="string"&&t&&typeof t!="function"&&typeof t!="symbol"?(t=Ga(a),a=sa(o).hoistableScripts,i=a.get(t),i||(i={type:"script",instance:null,count:0,state:null},a.set(t,i)),i):{type:"void",instance:null,count:0,state:null};default:throw Error(c(444,e))}}function ja(e){return'href="'+vt(e)+'"'}function ki(e){return'link[rel="stylesheet"]['+e+"]"}function sp(e){return M({},e,{"data-precedence":e.precedence,precedence:null})}function Ig(e,t,a,i){e.querySelector('link[rel="preload"][as="style"]['+t+"]")?i.loading=1:(t=e.createElement("link"),i.preload=t,t.addEventListener("load",function(){return i.loading|=1}),t.addEventListener("error",function(){return i.loading|=2}),Ke(t,"link",a),Pe(t),e.head.appendChild(t))}function Ga(e){return'[src="'+vt(e)+'"]'}function Hi(e){return"script[async]"+e}function lp(e,t,a){if(t.count++,t.instance===null)switch(t.type){case"style":var i=e.querySelector('style[data-href~="'+vt(a.href)+'"]');if(i)return t.instance=i,Pe(i),i;var o=M({},a,{"data-href":a.href,"data-precedence":a.precedence,href:null,precedence:null});return i=(e.ownerDocument||e).createElement("style"),Pe(i),Ke(i,"style",o),ur(i,a.precedence,e),t.instance=i;case"stylesheet":o=ja(a.href);var r=e.querySelector(ki(o));if(r)return t.state.loading|=4,t.instance=r,Pe(r),r;i=sp(a),(o=xt.get(o))&&_l(i,o),r=(e.ownerDocument||e).createElement("link"),Pe(r);var u=r;return u._p=new Promise(function(h,g){u.onload=h,u.onerror=g}),Ke(r,"link",i),t.state.loading|=4,ur(r,a.precedence,e),t.instance=r;case"script":return r=Ga(a.src),(o=e.querySelector(Hi(r)))?(t.instance=o,Pe(o),o):(i=a,(o=xt.get(r))&&(i=M({},a),ql(i,o)),e=e.ownerDocument||e,o=e.createElement("script"),Pe(o),Ke(o,"link",i),e.head.appendChild(o),t.instance=o);case"void":return null;default:throw Error(c(443,t.type))}else t.type==="stylesheet"&&(t.state.loading&4)===0&&(i=t.instance,t.state.loading|=4,ur(i,a.precedence,e));return t.instance}function ur(e,t,a){for(var i=a.querySelectorAll('link[rel="stylesheet"][data-precedence],style[data-precedence]'),o=i.length?i[i.length-1]:null,r=o,u=0;u<i.length;u++){var h=i[u];if(h.dataset.precedence===t)r=h;else if(r!==o)break}r?r.parentNode.insertBefore(e,r.nextSibling):(t=a.nodeType===9?a.head:a,t.insertBefore(e,t.firstChild))}function _l(e,t){e.crossOrigin==null&&(e.crossOrigin=t.crossOrigin),e.referrerPolicy==null&&(e.referrerPolicy=t.referrerPolicy),e.title==null&&(e.title=t.title)}function ql(e,t){e.crossOrigin==null&&(e.crossOrigin=t.crossOrigin),e.referrerPolicy==null&&(e.referrerPolicy=t.referrerPolicy),e.integrity==null&&(e.integrity=t.integrity)}var dr=null;function cp(e,t,a){if(dr===null){var i=new Map,o=dr=new Map;o.set(a,i)}else o=dr,i=o.get(a),i||(i=new Map,o.set(a,i));if(i.has(e))return i;for(i.set(e,null),a=a.getElementsByTagName(e),o=0;o<a.length;o++){var r=a[o];if(!(r[Qa]||r[We]||e==="link"&&r.getAttribute("rel")==="stylesheet")&&r.namespaceURI!=="http://www.w3.org/2000/svg"){var u=r.getAttribute(t)||"";u=e+u;var h=i.get(u);h?h.push(r):i.set(u,[r])}}return i}function up(e,t,a){e=e.ownerDocument||e,e.head.insertBefore(a,t==="title"?e.querySelector("head > title"):null)}function xg(e,t,a){if(a===1||t.itemProp!=null)return!1;switch(e){case"meta":case"title":return!0;case"style":if(typeof t.precedence!="string"||typeof t.href!="string"||t.href==="")break;return!0;case"link":if(typeof t.rel!="string"||typeof t.href!="string"||t.href===""||t.onLoad||t.onError)break;return t.rel==="stylesheet"?(e=t.disabled,typeof t.precedence=="string"&&e==null):!0;case"script":if(t.async&&typeof t.async!="function"&&typeof t.async!="symbol"&&!t.onLoad&&!t.onError&&t.src&&typeof t.src=="string")return!0}return!1}function dp(e){return!(e.type==="stylesheet"&&(e.state.loading&3)===0)}function Lg(e,t,a,i){if(a.type==="stylesheet"&&(typeof i.media!="string"||matchMedia(i.media).matches!==!1)&&(a.state.loading&4)===0){if(a.instance===null){var o=ja(i.href),r=t.querySelector(ki(o));if(r){t=r._p,t!==null&&typeof t=="object"&&typeof t.then=="function"&&(e.count++,e=hr.bind(e),t.then(e,e)),a.state.loading|=4,a.instance=r,Pe(r);return}r=t.ownerDocument||t,i=sp(i),(o=xt.get(o))&&_l(i,o),r=r.createElement("link"),Pe(r);var u=r;u._p=new Promise(function(h,g){u.onload=h,u.onerror=g}),Ke(r,"link",i),a.instance=r}e.stylesheets===null&&(e.stylesheets=new Map),e.stylesheets.set(a,t),(t=a.state.preload)&&(a.state.loading&3)===0&&(e.count++,a=hr.bind(e),t.addEventListener("load",a),t.addEventListener("error",a))}}var Vl=0;function Cg(e,t){return e.stylesheets&&e.count===0&&fr(e,e.stylesheets),0<e.count||0<e.imgCount?function(a){var i=setTimeout(function(){if(e.stylesheets&&fr(e,e.stylesheets),e.unsuspend){var r=e.unsuspend;e.unsuspend=null,r()}},6e4+t);0<e.imgBytes&&Vl===0&&(Vl=62500*hg());var o=setTimeout(function(){if(e.waitingForImages=!1,e.count===0&&(e.stylesheets&&fr(e,e.stylesheets),e.unsuspend)){var r=e.unsuspend;e.unsuspend=null,r()}},(e.imgBytes>Vl?50:800)+t);return e.unsuspend=a,function(){e.unsuspend=null,clearTimeout(i),clearTimeout(o)}}:null}function hr(){if(this.count--,this.count===0&&(this.imgCount===0||!this.waitingForImages)){if(this.stylesheets)fr(this,this.stylesheets);else if(this.unsuspend){var e=this.unsuspend;this.unsuspend=null,e()}}}var pr=null;function fr(e,t){e.stylesheets=null,e.unsuspend!==null&&(e.count++,pr=new Map,t.forEach(Dg,e),pr=null,hr.call(e))}function Dg(e,t){if(!(t.state.loading&4)){var a=pr.get(e);if(a)var i=a.get(null);else{a=new Map,pr.set(e,a);for(var o=e.querySelectorAll("link[data-precedence],style[data-precedence]"),r=0;r<o.length;r++){var u=o[r];(u.nodeName==="LINK"||u.getAttribute("media")!=="not all")&&(a.set(u.dataset.precedence,u),i=u)}i&&a.set(null,i)}o=t.instance,u=o.getAttribute("data-precedence"),r=a.get(u)||i,r===i&&a.set(null,o),a.set(u,o),this.count++,i=hr.bind(this),o.addEventListener("load",i),o.addEventListener("error",i),r?r.parentNode.insertBefore(o,r.nextSibling):(e=e.nodeType===9?e.head:e,e.insertBefore(o,e.firstChild)),t.state.loading|=4}}var zi={$$typeof:J,Provider:null,Consumer:null,_currentValue:K,_currentValue2:K,_threadCount:0};function kg(e,t,a,i,o,r,u,h,g){this.tag=1,this.containerInfo=e,this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.next=this.pendingContext=this.context=this.cancelPendingCommit=null,this.callbackPriority=0,this.expirationTimes=Yr(-1),this.entangledLanes=this.shellSuspendCounter=this.errorRecoveryDisabledLanes=this.expiredLanes=this.warmLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=Yr(0),this.hiddenUpdates=Yr(null),this.identifierPrefix=i,this.onUncaughtError=o,this.onCaughtError=r,this.onRecoverableError=u,this.pooledCache=null,this.pooledCacheLanes=0,this.formState=g,this.incompleteTransitions=new Map}function hp(e,t,a,i,o,r,u,h,g,A,N,C){return e=new kg(e,t,a,u,g,A,N,C,h),t=1,r===!0&&(t|=24),r=ht(3,null,null,t),e.current=r,r.stateNode=e,t=Fs(),t.refCount++,e.pooledCache=t,t.refCount++,r.memoizedState={element:i,isDehydrated:a,cache:t},Ls(r),e}function pp(e){return e?(e=ya,e):ya}function fp(e,t,a,i,o,r){o=pp(o),i.context===null?i.context=o:i.pendingContext=o,i=On(t),i.payload={element:a},r=r===void 0?null:r,r!==null&&(i.callback=r),a=vn(e,i,t),a!==null&&(st(a,e,t),fi(a,e,t))}function mp(e,t){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var a=e.retryLane;e.retryLane=a!==0&&a<t?a:t}}function Kl(e,t){mp(e,t),(e=e.alternate)&&mp(e,t)}function gp(e){if(e.tag===13||e.tag===31){var t=Wn(e,67108864);t!==null&&st(t,e,67108864),Kl(e,67108864)}}function yp(e){if(e.tag===13||e.tag===31){var t=yt();t=$r(t);var a=Wn(e,t);a!==null&&st(a,e,t),Kl(e,t)}}var mr=!0;function Hg(e,t,a,i){var o=I.T;I.T=null;var r=j.p;try{j.p=2,Zl(e,t,a,i)}finally{j.p=r,I.T=o}}function zg(e,t,a,i){var o=I.T;I.T=null;var r=j.p;try{j.p=8,Zl(e,t,a,i)}finally{j.p=r,I.T=o}}function Zl(e,t,a,i){if(mr){var o=Ql(i);if(o===null)zl(e,t,i,gr,a),Tp(e,i);else if(Ug(o,e,t,a,i))i.stopPropagation();else if(Tp(e,i),t&4&&-1<Mg.indexOf(e)){for(;o!==null;){var r=ra(o);if(r!==null)switch(r.tag){case 3:if(r=r.stateNode,r.current.memoizedState.isDehydrated){var u=Gn(r.pendingLanes);if(u!==0){var h=r;for(h.pendingLanes|=2,h.entangledLanes|=2;u;){var g=1<<31-ut(u);h.entanglements[1]|=g,u&=~g}Yt(r),(ge&6)===0&&(Xo=lt()+500,xi(0))}}break;case 31:case 13:h=Wn(r,2),h!==null&&st(h,r,2),er(),Kl(r,2)}if(r=Ql(i),r===null&&zl(e,t,i,gr,a),r===o)break;o=r}o!==null&&i.stopPropagation()}else zl(e,t,i,null,a)}}function Ql(e){return e=Jr(e),Xl(e)}var gr=null;function Xl(e){if(gr=null,e=oa(e),e!==null){var t=d(e);if(t===null)e=null;else{var a=t.tag;if(a===13){if(e=f(t),e!==null)return e;e=null}else if(a===31){if(e=m(t),e!==null)return e;e=null}else if(a===3){if(t.stateNode.current.memoizedState.isDehydrated)return t.tag===3?t.stateNode.containerInfo:null;e=null}else t!==e&&(e=null)}}return gr=e,null}function bp(e){switch(e){case"beforetoggle":case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"toggle":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 2;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 8;case"message":switch(vf()){case Rc:return 2;case Fc:return 8;case io:case Sf:return 32;case Nc:return 268435456;default:return 32}default:return 32}}var Jl=!1,Dn=null,kn=null,Hn=null,Mi=new Map,Ui=new Map,zn=[],Mg="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");function Tp(e,t){switch(e){case"focusin":case"focusout":Dn=null;break;case"dragenter":case"dragleave":kn=null;break;case"mouseover":case"mouseout":Hn=null;break;case"pointerover":case"pointerout":Mi.delete(t.pointerId);break;case"gotpointercapture":case"lostpointercapture":Ui.delete(t.pointerId)}}function ji(e,t,a,i,o,r){return e===null||e.nativeEvent!==r?(e={blockedOn:t,domEventName:a,eventSystemFlags:i,nativeEvent:r,targetContainers:[o]},t!==null&&(t=ra(t),t!==null&&gp(t)),e):(e.eventSystemFlags|=i,t=e.targetContainers,o!==null&&t.indexOf(o)===-1&&t.push(o),e)}function Ug(e,t,a,i,o){switch(t){case"focusin":return Dn=ji(Dn,e,t,a,i,o),!0;case"dragenter":return kn=ji(kn,e,t,a,i,o),!0;case"mouseover":return Hn=ji(Hn,e,t,a,i,o),!0;case"pointerover":var r=o.pointerId;return Mi.set(r,ji(Mi.get(r)||null,e,t,a,i,o)),!0;case"gotpointercapture":return r=o.pointerId,Ui.set(r,ji(Ui.get(r)||null,e,t,a,i,o)),!0}return!1}function Ep(e){var t=oa(e.target);if(t!==null){var a=d(t);if(a!==null){if(t=a.tag,t===13){if(t=f(a),t!==null){e.blockedOn=t,kc(e.priority,function(){yp(a)});return}}else if(t===31){if(t=m(a),t!==null){e.blockedOn=t,kc(e.priority,function(){yp(a)});return}}else if(t===3&&a.stateNode.current.memoizedState.isDehydrated){e.blockedOn=a.tag===3?a.stateNode.containerInfo:null;return}}}e.blockedOn=null}function yr(e){if(e.blockedOn!==null)return!1;for(var t=e.targetContainers;0<t.length;){var a=Ql(e.nativeEvent);if(a===null){a=e.nativeEvent;var i=new a.constructor(a.type,a);Xr=i,a.target.dispatchEvent(i),Xr=null}else return t=ra(a),t!==null&&gp(t),e.blockedOn=a,!1;t.shift()}return!0}function Op(e,t,a){yr(e)&&a.delete(t)}function jg(){Jl=!1,Dn!==null&&yr(Dn)&&(Dn=null),kn!==null&&yr(kn)&&(kn=null),Hn!==null&&yr(Hn)&&(Hn=null),Mi.forEach(Op),Ui.forEach(Op)}function br(e,t){e.blockedOn===t&&(e.blockedOn=null,Jl||(Jl=!0,n.unstable_scheduleCallback(n.unstable_NormalPriority,jg)))}var Tr=null;function vp(e){Tr!==e&&(Tr=e,n.unstable_scheduleCallback(n.unstable_NormalPriority,function(){Tr===e&&(Tr=null);for(var t=0;t<e.length;t+=3){var a=e[t],i=e[t+1],o=e[t+2];if(typeof i!="function"){if(Xl(i||a)===null)continue;break}var r=ra(a);r!==null&&(e.splice(t,3),t-=3,Qs(r,{pending:!0,data:o,method:a.method,action:i},i,o))}}))}function Ba(e){function t(g){return br(g,e)}Dn!==null&&br(Dn,e),kn!==null&&br(kn,e),Hn!==null&&br(Hn,e),Mi.forEach(t),Ui.forEach(t);for(var a=0;a<zn.length;a++){var i=zn[a];i.blockedOn===e&&(i.blockedOn=null)}for(;0<zn.length&&(a=zn[0],a.blockedOn===null);)Ep(a),a.blockedOn===null&&zn.shift();if(a=(e.ownerDocument||e).$$reactFormReplay,a!=null)for(i=0;i<a.length;i+=3){var o=a[i],r=a[i+1],u=o[tt]||null;if(typeof r=="function")u||vp(a);else if(u){var h=null;if(r&&r.hasAttribute("formAction")){if(o=r,u=r[tt]||null)h=u.formAction;else if(Xl(o)!==null)continue}else h=u.action;typeof h=="function"?a[i+1]=h:(a.splice(i,3),i-=3),vp(a)}}}function Sp(){function e(r){r.canIntercept&&r.info==="react-transition"&&r.intercept({handler:function(){return new Promise(function(u){return o=u})},focusReset:"manual",scroll:"manual"})}function t(){o!==null&&(o(),o=null),i||setTimeout(a,20)}function a(){if(!i&&!navigation.transition){var r=navigation.currentEntry;r&&r.url!=null&&navigation.navigate(r.url,{state:r.getState(),info:"react-transition",history:"replace"})}}if(typeof navigation=="object"){var i=!1,o=null;return navigation.addEventListener("navigate",e),navigation.addEventListener("navigatesuccess",t),navigation.addEventListener("navigateerror",t),setTimeout(a,100),function(){i=!0,navigation.removeEventListener("navigate",e),navigation.removeEventListener("navigatesuccess",t),navigation.removeEventListener("navigateerror",t),o!==null&&(o(),o=null)}}}function ec(e){this._internalRoot=e}Er.prototype.render=ec.prototype.render=function(e){var t=this._internalRoot;if(t===null)throw Error(c(409));var a=t.current,i=yt();fp(a,i,e,t,null,null)},Er.prototype.unmount=ec.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var t=e.containerInfo;fp(e.current,2,null,e,null,null),er(),t[ia]=null}};function Er(e){this._internalRoot=e}Er.prototype.unstable_scheduleHydration=function(e){if(e){var t=Dc();e={blockedOn:null,target:e,priority:t};for(var a=0;a<zn.length&&t!==0&&t<zn[a].priority;a++);zn.splice(a,0,e),a===0&&Ep(e)}};var Ap=s.version;if(Ap!=="19.2.8")throw Error(c(527,Ap,"19.2.8"));j.findDOMNode=function(e){var t=e._reactInternals;if(t===void 0)throw typeof e.render=="function"?Error(c(188)):(e=Object.keys(e).join(","),Error(c(268,e)));return e=b(t),e=e!==null?z(e):null,e=e===null?null:e.stateNode,e};var Gg={bundleType:0,version:"19.2.8",rendererPackageName:"react-dom",currentDispatcherRef:I,reconcilerVersion:"19.2.8"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var Or=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!Or.isDisabled&&Or.supportsFiber)try{Va=Or.inject(Gg),ct=Or}catch{}}return Bi.createRoot=function(e,t){if(!p(e))throw Error(c(299));var a=!1,i="",o=Ld,r=Cd,u=Dd;return t!=null&&(t.unstable_strictMode===!0&&(a=!0),t.identifierPrefix!==void 0&&(i=t.identifierPrefix),t.onUncaughtError!==void 0&&(o=t.onUncaughtError),t.onCaughtError!==void 0&&(r=t.onCaughtError),t.onRecoverableError!==void 0&&(u=t.onRecoverableError)),t=hp(e,1,!1,null,null,a,i,null,o,r,u,Sp),e[ia]=t.current,Hl(e),new ec(t)},Bi.hydrateRoot=function(e,t,a){if(!p(e))throw Error(c(299));var i=!1,o="",r=Ld,u=Cd,h=Dd,g=null;return a!=null&&(a.unstable_strictMode===!0&&(i=!0),a.identifierPrefix!==void 0&&(o=a.identifierPrefix),a.onUncaughtError!==void 0&&(r=a.onUncaughtError),a.onCaughtError!==void 0&&(u=a.onCaughtError),a.onRecoverableError!==void 0&&(h=a.onRecoverableError),a.formState!==void 0&&(g=a.formState)),t=hp(e,1,!0,t,a??null,i,o,g,r,u,h,Sp),t.context=pp(null),a=t.current,i=yt(),i=$r(i),o=On(i),o.callback=null,vn(a,o,i),a=i,t.current.lanes=a,Za(t,a),Yt(t),e[ia]=t.current,Hl(e),new Er(t)},Bi.version="19.2.8",Bi}var kp;function Zg(){if(kp)return ac.exports;kp=1;function n(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n)}catch(s){console.error(s)}}return n(),ac.exports=Kg(),ac.exports}var Qg=Zg();const Xg="modulepreload",Jg=function(n){return"/"+n},Hp={},Ji=function(s,l,c){let p=Promise.resolve();if(l&&l.length>0){let f=function(b){return Promise.all(b.map(z=>Promise.resolve(z).then(M=>({status:"fulfilled",value:M}),M=>({status:"rejected",reason:M}))))};document.getElementsByTagName("link");const m=document.querySelector("meta[property=csp-nonce]"),y=m?.nonce||m?.getAttribute("nonce");p=f(l.map(b=>{if(b=Jg(b),b in Hp)return;Hp[b]=!0;const z=b.endsWith(".css"),M=z?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${b}"]${M}`))return;const F=document.createElement("link");if(F.rel=z?"stylesheet":Xg,z||(F.as="script"),F.crossOrigin="",F.href=b,y&&F.setAttribute("nonce",y),document.head.appendChild(F),z)return new Promise((L,k)=>{F.addEventListener("load",L),F.addEventListener("error",()=>k(Error(`Unable to preload CSS for ${b}`)))})}))}function d(f){const m=new Event("vite:preloadError",{cancelable:!0});if(m.payload=f,window.dispatchEvent(m),!m.defaultPrevented)throw f}return p.then(f=>{for(const m of f||[])m.status==="rejected"&&d(m.reason);return s().catch(d)})};function bt(n){return Object.freeze(n.trim().split(/\s+/))}const ey=Object.freeze({text:bt(`
    base64-encode base64-decode base32-encode base32-decode url-encode url-decode html-encode html-decode hex-encode hex-decode binary-encode binary-decode unicode-escape unicode-unescape rot13 morse-encode morse-decode html-to-text text-to-nato hash-identify atbash encoding-detect caesar-cipher hex-to-rgb-batch text-to-phonetic vigenere ascii-table text-dedupe text-sort-lines number-lines unicode-styled soundex word-wrap-smart nato-alphabet pig-latin readability-score text-diff-inline acronym-gen text-sentence-ops text-center markdown-toc text-extract-quotes text-summarize text-char-frequency text-find-replace lorem-words haiku-checker spongecase text-anagram-finder text-password-phrase word-cloud-text morse-advanced text-braille phonetic-alphabet text-reverse-cipher
  `),qr:bt("text-to-qr qr-to-text"),image:bt("image-to-base64 base64-to-image file-to-base64"),hash:bt("sha1 sha256 sha384 sha512 sha224 all-hashes"),crypto:bt("file-sha256 file-sha512 random-password random-hex random-base64 random-uuid-bulk text-hash-all checksum-all hash-compare hmac-gen xor-cipher crc32-calc adler32-calc"),data:bt(`
    json-prettify json-minify json-escape json-unescape csv-to-json tsv-to-json json-to-tsv env-to-json json-to-markdown-table markdown-table-to-json ini-to-json json-to-ini ndjson-to-json json-to-ndjson properties-to-json json-to-properties json-merge csv-stats json-pick csv-transpose jsonl-to-json csv-sort json-group-by json-count tsv-csv-convert json-to-sql csv-to-html json-to-csv-advanced csv-filter data-url-converter yaml-to-env csv-stats-summary json-to-zod msgpack-preview graphql-schema json-to-prisma protobuf-gen markdown-to-json json-normalize avro-schema har-to-curl openapi-gen
  `),web:bt(`
    text-diff xml-to-json regex-tester css-minify html-minify js-minify js-prettify url-parser cron-parser json-to-querystring querystring-to-json json-to-yaml yaml-to-json json-to-xml html-prettify css-prettify toml-to-json json-validate html-to-jsx json-to-toml svg-optimize css-vars-extract tailwind-to-css json-sort-keys htaccess-gen markdown-table-format word-frequency reading-time user-agent-parse json-to-csv csv-to-json-array markdown-link-extract html-entity-ref json-to-env endian-swap json-to-graphql unicode-lookup text-encoding-view json-to-python json-to-php json-to-typescript sql-format sql-minify json-path csv-to-html-table html-to-markdown base64url-encode base64url-decode backslash-escape backslash-unescape punycode-encode punycode-decode number-words markdown-to-html json-schema-validate epoch-batch semver-compare url-parse url-builder data-uri ipv6-expand ipv6-compress md-table-to-csv csv-to-md-table curl-builder curl-to-fetch text-dedup line-sort line-number xml-format xml-minify column-align text-wrap placeholder-image css-unit slug-gen case-detect json-diff css-gradient css-shadow dotenv-validate emoji-lookup text-to-emoji regex-escape regex-unescape timezone-convert unix-perm docker-run-gen gitignore-gen json-to-go json-to-rust md-link-check text-pad html-table-to-csv json-to-kotlin json-to-java json-schema-gen duration-format sql-insert-to-json text-reverse-words string-multiply anagram-check json-to-csharp json-to-swift bit-calculator css-specificity uuid-validate css-animation-gen openapi-summary har-parse matrix-ops text-normalize unit-prefix http-headers-parse semver-parse json-pointer color-contrast-ratio text-inflect yaml-to-toml json-to-table git-log-parse sql-to-json-schema markdown-escape ip-range json-to-form-data css-to-js-obj ts-type-gen mime-lookup open-graph-meta http-status-lookup cors-headers cookie-parser csp-generator nginx-location-gen fetch-to-axios webpack-import-gen dockerfile-gen api-mock-gen regex-to-code env-validator http-header-gen sql-schema-gen json-diff-compare github-actions-gen robots-txt-gen schema-org-gen docker-compose-gen package-json-gen git-commit-lint
  `),number:bt(`
    dec-to-hex hex-to-dec dec-to-bin bin-to-dec dec-to-oct oct-to-dec dec-to-roman roman-to-dec number-base bytes-format scientific-notation fraction-decimal prime-check fibonacci gcd-lcm collatz integer-overflow number-sequence modular-arithmetic prime-factorization digit-ops fibonacci-gen ieee754 pascal-triangle binary-arithmetic statistics-calc roman-numeral-convert bitwise-ops matrix-2x2 unit-fraction quadratic-solver complex-number trig-calc log-calc prime-sieve mod-arith-advanced sequence-gen percentage-solver combinatorics number-properties base-arithmetic continued-fraction interest-calc number-curiosities
  `),color:bt(`
    color-convert color-palette color-contrast color-blindness color-shades color-gradient oklch-convert color-mix css-custom-props color-temperature color-tints-shades color-harmonies color-lighten-darken color-random color-extract css-to-color-vars color-wcag-audit color-to-tailwind color-from-image color-css-variables color-mix-calculator color-luminance
  `),utility:bt(`
    timestamp-to-date date-to-timestamp uuid-generate jwt-decode lorem-ipsum char-count case-convert reverse-text sort-lines dedupe-lines line-numbers shuffle-lines trim-lines remove-empty-lines wrap-lines extract-emails extract-urls extract-numbers slugify string-escape string-unescape number-format csv-to-markdown markdown-to-csv epoch-now list-to-json json-to-list ip-to-decimal decimal-to-ip markdown-preview epoch-convert placeholder-img css-units aspect-ratio docker-run-to-compose regex-replace base-convert jwt-create number-to-words date-diff text-frequency json-path-extract text-to-nato-table cidr-calc named-colors rot-n number-base-table lorem-sentences fake-data ip-info crontab-gen chmod-calc text-stats string-reverse nato-converter wcag-contrast json-flatten json-unflatten color-scheme unicode-inspector ascii-art typescript-gen http-status password-strength luhn-check num-stats morse-code css-clamp percentage-calc loan-calc bmi-calc password-entropy tls-cert-info xpath-tester color-mix-ratio timezone-list email-address-parse text-columns compound-interest isbn-validate age-calc tip-calc aspect-ratio-exact pace-calc ppi-calc levenshtein discount-calc grade-calc fuel-cost recipe-scale paint-calc mortgage-calc time-between loan-amortization calories-burned screen-size-calc water-intake wind-chill retirement-calc tax-bracket speed-distance-time ohms-law number-system-table body-fat-calc electricity-cost ideal-weight blood-pressure unit-price-compare inflation-calc heart-rate-zones running-pace savings-goal timezone-offset recipe-nutrition fuel-calc sleep-cycle dna-calc date-calculator event-countdown
  `),imageFormat:bt(`
    png-to-jpg jpg-to-png png-to-webp jpg-to-webp webp-to-png webp-to-jpg bmp-to-png any-to-png any-to-jpg any-to-webp image-resize image-compress svg-to-png image-rotate image-flip-h image-flip-v image-grayscale image-invert image-crop-square image-sepia image-brightness image-contrast
  `),media:bt(`
    video-to-audio video-to-wav audio-to-mp3 audio-to-wav audio-to-ogg video-to-mp4 video-to-webm video-to-gif audio-to-aac audio-to-flac video-to-audio-ogg audio-to-m4a video-trim audio-trim
  `),pdf:bt(`
    images-to-pdf merge-pdf pdf-page-count pdf-split pdf-extract-range text-to-pdf pdf-metadata pdf-rotate
  `)}),ty=Object.freeze([Object.freeze({id:"all",name:"All"}),Object.freeze({id:"encode",name:"Encode / Decode"}),Object.freeze({id:"hash",name:"Hash"}),Object.freeze({id:"data",name:"Data"}),Object.freeze({id:"web",name:"Web"}),Object.freeze({id:"number",name:"Number"}),Object.freeze({id:"color",name:"Color"}),Object.freeze({id:"utility",name:"Utility"}),Object.freeze({id:"image",name:"Image"}),Object.freeze({id:"media",name:"Media"}),Object.freeze({id:"document",name:"Document"})]);function Pi(n){const s=n.split(`
`),l={};let c=null;for(const p of s){const d=p.trimEnd();if(!d||d.startsWith("#"))continue;const f=d.match(/^(\s*)- (.*)$/);if(f){c&&!Array.isArray(l[c])&&(l[c]=[]),c&&l[c].push(zp(f[2]));continue}const m=d.match(/^(\s*)([^:]+):\s*(.*)$/);if(m){const y=m[2].trim(),b=m[3].trim();c=y,b?l[y]=zp(b):l[y]={}}}return JSON.stringify(l,null,2)}function zp(n){return n==="true"||n==="True"?!0:n==="false"||n==="False"?!1:n==="null"||n==="Null"||n==="~"?null:/^-?\d+$/.test(n)?parseInt(n,10):/^-?\d+\.\d+$/.test(n)?parseFloat(n):n.startsWith('"')&&n.endsWith('"')||n.startsWith("'")&&n.endsWith("'")?n.slice(1,-1):n}function $t(n,s){const l="  ".repeat(s);if(n===null)return"null";if(typeof n=="boolean"||typeof n=="number")return String(n);if(typeof n=="string")return n.includes(`
`)||n.includes(":")||n.includes("#")?`"${n.replace(/"/g,'\\"')}"`:n;if(Array.isArray(n))return n.length===0?"[]":n.map(c=>{if(typeof c=="object"&&c!==null){const p=$t(c,s+1),d=p.split(`
`)[0],f=p.split(`
`).slice(1).map(m=>l+"  "+m).join(`
`);return`${l}- ${d}${f?`
`+f:""}`}return`${l}- ${$t(c,s+1)}`}).join(`
`);if(typeof n=="object"){const c=Object.entries(n);return c.length===0?"{}":c.map(([p,d])=>typeof d=="object"&&d!==null?`${l}${p}:
${$t(d,s+1)}`:`${l}${p}: ${$t(d,s+1)}`).join(`
`)}return String(n)}function vr(n){const s={};let l=s;for(const c of n.split(`
`)){const p=c.trim();if(!p||p.startsWith("#"))continue;const d=p.match(/^\[([^\]]+)\]$/);if(d){const m=d[1].split(".");l=s;for(const y of m)l[y]||(l[y]={}),l=l[y];continue}const f=p.match(/^([^=]+)=\s*(.+)$/);if(f){const m=f[1].trim();let y=f[2].trim();if(y==="true")l[m]=!0;else if(y==="false")l[m]=!1;else if(/^-?\d+$/.test(y))l[m]=parseInt(y);else if(/^-?\d+\.\d+$/.test(y))l[m]=parseFloat(y);else if(y.startsWith('"')&&y.endsWith('"')||y.startsWith("'")&&y.endsWith("'"))l[m]=y.slice(1,-1);else if(y.startsWith("[")&&y.endsWith("]"))try{l[m]=JSON.parse(y)}catch{l[m]=y}else l[m]=y}}return s}function Wi(n){const s=String(n||"").trim().match(/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i);if(!s)return null;const l=s[1],c=l.length===3?l.split("").map(d=>d+d).join(""):l,p=parseInt(c,16);return{r:p>>16&255,g:p>>8&255,b:p&255}}function Sr({r:n,g:s,b:l}){n/=255,s/=255,l/=255;const c=Math.max(n,s,l),p=Math.min(n,s,l),d=(c+p)/2;if(c===p)return{h:0,s:0,l:Math.round(d*100)};const f=c-p,m=d>.5?f/(2-c-p):f/(c+p);let y;return c===n?y=((s-l)/f+(s<l?6:0))/6:c===s?y=((l-n)/f+2)/6:y=((n-s)/f+4)/6,{h:Math.round(y*360),s:Math.round(m*100),l:Math.round(d*100)}}function _i({h:n,s,l}){if(n/=360,s/=100,l/=100,s===0){const f=Math.round(l*255);return{r:f,g:f,b:f}}const c=(f,m,y)=>(y<0&&(y+=1),y>1&&(y-=1),y<1/6?f+(m-f)*6*y:y<1/2?m:y<2/3?f+(m-f)*(2/3-y)*6:f),p=l<.5?l*(1+s):l+s-l*s,d=2*l-p;return{r:Math.round(c(d,p,n+1/3)*255),g:Math.round(c(d,p,n)*255),b:Math.round(c(d,p,n-1/3)*255)}}function ny({r:n,g:s,b:l}){return"#"+[n,s,l].map(c=>c.toString(16).padStart(2,"0")).join("")}function qi(n){const s=String(n||"").trim(),l=s.match(/^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i)||s.match(/^rgb\(\s*(\d+)\s+(\d+)\s+(\d+)\s*\)$/i);if(!l)return null;const c={r:+l[1],g:+l[2],b:+l[3]};return[c.r,c.g,c.b].every(p=>p>=0&&p<=255)?c:null}function Vi(n){const s=String(n||"").trim(),l=s.match(/^hsl\(\s*(\d+)\s*,\s*(\d+)\s*%\s*,\s*(\d+)\s*%\s*\)$/i)||s.match(/^hsl\(\s*(\d+)\s+(\d+)\s*%\s+(\d+)\s*%\s*\)$/i);if(!l)return null;const c={h:+l[1],s:+l[2],l:+l[3]};return c.h<=360&&c.s<=100&&c.l<=100?c:null}function Ar({r:n,g:s,b:l}){n/=255,s/=255,l/=255;const c=Math.max(n,s,l),p=Math.min(n,s,l),d=c-p;let f=0;return d!==0&&(c===n?f=((s-l)/d+(s<l?6:0))/6:c===s?f=((l-n)/d+2)/6:f=((n-s)/d+4)/6),{h:Math.round(f*360),s:Math.round((c===0?0:d/c)*100),v:Math.round(c*100)}}function Ki({h:n,s,v:l}){n/=360,s/=100,l/=100;const c=Math.floor(n*6),p=n*6-c,d=l*(1-s),f=l*(1-p*s),m=l*(1-(1-p)*s);let y,b,z;switch(c%6){case 0:[y,b,z]=[l,m,d];break;case 1:[y,b,z]=[f,l,d];break;case 2:[y,b,z]=[d,l,m];break;case 3:[y,b,z]=[d,f,l];break;case 4:[y,b,z]=[m,d,l];break;default:[y,b,z]=[l,d,f]}return{r:Math.round(y*255),g:Math.round(b*255),b:Math.round(z*255)}}function Zi(n){const s=String(n||"").trim(),l=s.match(/^hsv\(\s*(\d+)\s*,\s*(\d+)\s*%\s*,\s*(\d+)\s*%\s*\)$/i)||s.match(/^hsv\(\s*(\d+)\s+(\d+)\s*%\s+(\d+)\s*%\s*\)$/i);if(!l)return null;const c={h:+l[1],s:+l[2],v:+l[3]};return c.h<=360&&c.s<=100&&c.v<=100?c:null}function Mp(n){return n&&[n.r,n.g,n.b].every(s=>Number.isInteger(s)&&s>=0&&s<=255)}function Up(n,s){return n&&Number.isInteger(n.h)&&n.h>=0&&n.h<=360&&Number.isInteger(n.s)&&n.s>=0&&n.s<=100&&Number.isInteger(n[s])&&n[s]>=0&&n[s]<=100}function Qb(n,s){const l=String(s||"").trim();let c=null;if(n==="color-hex")c=Wi(l);else if(n==="color-rgb"){const p=qi(l);Mp(p)&&(c=p)}else if(n==="color-hsl"){const p=Vi(l);Up(p,"l")&&(c=_i(p))}else if(n==="color-hsv"){const p=Zi(l);Up(p,"v")&&(c=Ki(p))}return Mp(c)?ny(c):null}const Mt=1024*1024,ay=5*Mt,iy=64*1024,Xb="image/png,image/jpeg,.png,.jpg,.jpeg";function sc(n,s){return Object.freeze({lowMemory:Object.freeze(n),standard:Object.freeze(s)})}const Ut=Object.freeze({pdf:sc({perFile:25*Mt,total:60*Mt,maxFiles:8},{perFile:100*Mt,total:250*Mt,maxFiles:20}),images:sc({perFile:25*Mt,total:100*Mt,maxFiles:12},{perFile:80*Mt,total:300*Mt,maxFiles:32}),media:sc({perFile:75*Mt,total:null,maxFiles:4},{perFile:250*Mt,total:null,maxFiles:8})}),wr=Object.freeze({unsupported_type:Object.freeze({ok:!1,code:"unsupported_type",messageKey:"errors.unsupportedType"}),too_large:Object.freeze({ok:!1,code:"too_large",messageKey:"errors.tooLarge"}),resource_limit:Object.freeze({ok:!1,code:"resource_limit",messageKey:"errors.resourceLimit"})});function oy(n=globalThis){const s=Number(n?.deviceMemory??n?.navigator?.deviceMemory),l=Number(n?.viewportWidth??n?.innerWidth??n?.document?.documentElement?.clientWidth);return Number.isFinite(s)&&s<=4||Number.isFinite(l)&&l<768}function ry(n,s=globalThis){return n?oy(s)?n.lowMemory:n.standard:null}function sy(n,s){if(!s||s==="*")return!0;const l=String(n.type||"").toLowerCase(),c=String(n.name||"").toLowerCase(),p=s.split(",").map(b=>b.trim().toLowerCase()).filter(Boolean),d=p.filter(b=>b.startsWith(".")),f=p.filter(b=>!b.startsWith(".")),m=d.some(b=>c.endsWith(b)),y=f.some(b=>b.endsWith("/*")?l.startsWith(b.slice(0,-1)):l===b);return d.length>0&&c.includes(".")&&!m||l&&f.length>0&&!y?!1:p.some(b=>{const z=b.trim().toLowerCase();return z?z.startsWith(".")?c.endsWith(z):z.endsWith("/*")?l.startsWith(z.slice(0,-1)):l===z:!1})}function ly(n){return n==="image/png"?"png":n==="image/jpeg"||n==="image/jpg"?"jpeg":null}function cy(n){return n.endsWith(".png")?"png":n.endsWith(".jpg")||n.endsWith(".jpeg")?"jpeg":null}function uy(n,s){if(n?.limits!==Ut.images)return!1;const l=String(s.type||"").toLowerCase(),c=String(s.name||"").toLowerCase(),p=ly(String(s.type||"").toLowerCase()),d=cy(c),f=c.lastIndexOf("."),m=f>=0&&f<c.length-1;return l&&!p||m&&!d||!p&&!d?!0:!!(p&&d&&p!==d)}function Jb(n,s,l=globalThis){const c=Array.from(s||[]);if(c.some(f=>uy(n,f)||!sy(f,n?.acceptTypes)))return wr.unsupported_type;const p=ry(n?.limits,l);if(!p)return{ok:!0};if(Number.isInteger(p.maxFiles)&&c.length>p.maxFiles)return wr.resource_limit;if(c.some(f=>Number(f.size)>p.perFile))return wr.too_large;const d=c.reduce((f,m)=>f+Number(m.size||0),0);return p.total!=null&&d>p.total?wr.too_large:{ok:!0}}const Rr=Object.freeze({"text-5-mib":ay,"text-64-kib":iy});function $e({formatId:n,from:s,to:l,compatibility:c,input:p,expected:d,additionalCases:f=[],inputLimitClass:m="text-5-mib",nameDe:y,nameEn:b,descriptionDe:z,descriptionEn:M}){if(!["compatible","incompatible-but-implemented"].includes(c))throw new Error(`Format evidence ${n} needs an explicit compatibility state.`);for(const F of f)if(!["compatible","incompatible-but-implemented"].includes(F.compatibility))throw new Error(`Additional format evidence ${n} needs an explicit compatibility state.`);return Object.freeze({evidenceId:`format:${n}`,subjectKind:"format",subjectId:n,formatId:n,executor:"format-exact",from:s,to:l,compatibility:c,input:p,expected:d,additionalCases:Object.freeze(f.map(F=>Object.freeze({...F}))),inputLimitClass:m,category:"format",tier:"advanced",runtimeClass:"main-thread",outputNaming:"inline-text",nameDe:y,nameEn:b,descriptionDe:z,descriptionEn:M})}const Hr=Object.freeze([$e({formatId:"text",from:"text",to:"base64",compatibility:"compatible",input:"Folkkit",expected:"Rm9sa2tpdA==",nameDe:"Text",nameEn:"Text",descriptionDe:"Text lokal in ein belegtes Zielformat umwandeln.",descriptionEn:"Convert text locally to an evidenced target format."}),$e({formatId:"base64",from:"base64",to:"text",compatibility:"compatible",input:"Rm9sa2tpdA==",expected:"Folkkit",nameDe:"Base64",nameEn:"Base64",descriptionDe:"Base64 lokal in Text decodieren.",descriptionEn:"Decode Base64 to text locally."}),$e({formatId:"base58",from:"text",to:"base58",compatibility:"compatible",input:"Folkkit",expected:"3fp86L69TR",inputLimitClass:"text-64-kib",additionalCases:[{from:"base58",to:"text",compatibility:"compatible",input:"3fp86L69TR",expected:"Folkkit"}],nameDe:"Base58",nameEn:"Base58",descriptionDe:"Base58 bis 64 KiB lokal in Text decodieren.",descriptionEn:"Decode Base58 up to 64 KiB to text locally."}),$e({formatId:"url",from:"url",to:"text",compatibility:"compatible",input:"Folkkit%20lokal",expected:"Folkkit lokal",nameDe:"URL-Codierung",nameEn:"URL encoding",descriptionDe:"Percent-codierten URL-Text lokal decodieren.",descriptionEn:"Decode percent-encoded URL text locally."}),$e({formatId:"html-ent",from:"text",to:"html-ent",compatibility:"compatible",input:"<b>&",expected:"&lt;b&gt;&amp;",nameDe:"HTML-Entities",nameEn:"HTML entities",descriptionDe:"HTML-Sonderzeichen lokal als Entities codieren.",descriptionEn:"Encode HTML special characters as entities locally."}),$e({formatId:"hex",from:"hex",to:"text",compatibility:"compatible",input:"46 6f 6c 6b 6b 69 74",expected:"Folkkit",nameDe:"Hexadezimal",nameEn:"Hexadecimal",descriptionDe:"Hexadezimalwerte lokal in Text decodieren.",descriptionEn:"Decode hexadecimal values to text locally."}),$e({formatId:"binary",from:"binary",to:"text",compatibility:"compatible",input:"01000110 01101111 01101100 01101011 01101011 01101001 01110100",expected:"Folkkit",nameDe:"Binär",nameEn:"Binary",descriptionDe:"Binärwerte lokal in Text decodieren.",descriptionEn:"Decode binary values to text locally."}),$e({formatId:"unicode",from:"unicode",to:"text",compatibility:"compatible",input:"\\u0046\\u006f\\u006c\\u006b\\u006b\\u0069\\u0074",expected:"Folkkit",nameDe:"Unicode-Escapes",nameEn:"Unicode escapes",descriptionDe:"Unicode-Escape-Sequenzen lokal in Text decodieren.",descriptionEn:"Decode Unicode escape sequences to text locally."}),$e({formatId:"uppercase",from:"uppercase",to:"lowercase",compatibility:"compatible",input:"FOLKKIT",expected:"folkkit",nameDe:"GROSSBUCHSTABEN",nameEn:"UPPERCASE",descriptionDe:"Grossbuchstaben lokal in Kleinbuchstaben umwandeln.",descriptionEn:"Convert uppercase text to lowercase locally."}),$e({formatId:"lowercase",from:"lowercase",to:"uppercase",compatibility:"compatible",input:"folkkit",expected:"FOLKKIT",nameDe:"kleinbuchstaben",nameEn:"lowercase",descriptionDe:"Kleinbuchstaben lokal in Grossbuchstaben umwandeln.",descriptionEn:"Convert lowercase text to uppercase locally."}),$e({formatId:"json",from:"json",to:"json-min",compatibility:"compatible",input:'{"name": "Folkkit"}',expected:'{"name":"Folkkit"}',nameDe:"JSON",nameEn:"JSON",descriptionDe:"JSON lokal minimieren.",descriptionEn:"Minify JSON locally."}),$e({formatId:"json-min",from:"json-min",to:"json",compatibility:"compatible",input:'{"name":"Folkkit"}',expected:`{
  "name": "Folkkit"
}`,nameDe:"Minimiertes JSON",nameEn:"Minified JSON",descriptionDe:"Minimiertes JSON lokal formatieren.",descriptionEn:"Format minified JSON locally."}),$e({formatId:"decimal",from:"decimal",to:"numhex",compatibility:"compatible",input:"255",expected:"0xFF",nameDe:"Dezimal",nameEn:"Decimal",descriptionDe:"Eine Dezimalzahl lokal in Hexadezimal umwandeln.",descriptionEn:"Convert a decimal number to hexadecimal locally."}),$e({formatId:"numhex",from:"numhex",to:"decimal",compatibility:"compatible",input:"0xFF",expected:"255",nameDe:"Hexadezimalzahl",nameEn:"Hexadecimal number",descriptionDe:"Eine Hexadezimalzahl lokal in Dezimal umwandeln.",descriptionEn:"Convert a hexadecimal number to decimal locally."}),$e({formatId:"numbin",from:"numbin",to:"decimal",compatibility:"compatible",input:"0b1010",expected:"10",nameDe:"Binärzahl",nameEn:"Binary number",descriptionDe:"Eine Binärzahl lokal in Dezimal umwandeln.",descriptionEn:"Convert a binary number to decimal locally."}),$e({formatId:"numoct",from:"numoct",to:"decimal",compatibility:"compatible",input:"0o10",expected:"8",nameDe:"Oktalzahl",nameEn:"Octal number",descriptionDe:"Eine Oktalzahl lokal in Dezimal umwandeln.",descriptionEn:"Convert an octal number to decimal locally."}),$e({formatId:"color-hex",from:"color-hex",to:"color-rgb",compatibility:"compatible",input:"#ff0000",expected:"rgb(255, 0, 0)",nameDe:"Farbe HEX",nameEn:"Color HEX",descriptionDe:"Einen HEX-Farbwert lokal in RGB umwandeln.",descriptionEn:"Convert a HEX color value to RGB locally."}),$e({formatId:"color-rgb",from:"color-rgb",to:"color-hex",compatibility:"compatible",input:"rgb(255, 0, 0)",expected:"#ff0000",nameDe:"Farbe RGB",nameEn:"Color RGB",descriptionDe:"Einen RGB-Farbwert lokal in HEX umwandeln.",descriptionEn:"Convert an RGB color value to HEX locally."})]);function Xe(n,s,l={}){return Object.freeze({evidenceId:`tool:${n}`,subjectKind:"tool",subjectId:n,executor:s,...l})}const dy=[["base64-encode","Folkkit","Rm9sa2tpdA=="],["base64-decode","Rm9sa2tpdA==","Folkkit"],["url-encode","Folkkit & lokal","Folkkit%20%26%20lokal"],["url-decode","Folkkit%20%26%20lokal","Folkkit & lokal"],["html-encode","<b>&</b>","&lt;b&gt;&amp;&lt;/b&gt;"],["html-decode","&lt;b&gt;&amp;&lt;/b&gt;","<b>&</b>"],["hex-encode","Hi","48 69"],["hex-decode","48 69","Hi"],["binary-encode","Hi","01001000 01101001"],["binary-decode","01001000 01101001","Hi"],["unicode-escape","Hi ✓","\\u0048\\u0069\\u0020\\u2713"],["unicode-unescape","\\u0048\\u0069","Hi"],["rot13","Folkkit","Sbyxxvg"],["atbash","Abc","Zyx"],["sha256","Folkkit","9b7c7fc175ad695c18d03e20295ea1b502cab00fc6ef3fb780c4ae512ff62275"],["json-prettify",'{"a":1}',`{
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
  3840 x 2160`]],hy=dy.map(([n,s,l])=>Xe(n,"tool-text-cases",{cases:Object.freeze([{input:s,expected:l,match:"exact"}])})),py=Xe("percentage-calc","tool-text-cases",{cases:Object.freeze([{input:"15% of 200",expected:"15% of 200 = 30",match:"exact"},{input:"15% von 200",expected:"15% von 200 = 30",match:"exact"}])}),fy=[Xe("loan-calc","tool-text-cases",{cases:Object.freeze([{input:"1000 12% 1",expected:"Monthly payment:  $88.85",match:"contains"},{input:"1000 5% 0",expected:"(invalid values)",match:"exact"},{input:"1000 5% 101",expected:"(invalid values)",match:"exact"},{input:"1000000000001 5% 30",expected:"(invalid values)",match:"exact"},{input:"1000 101% 30",expected:"(invalid values)",match:"exact"},{input:"99999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999 5% 30",expected:"(invalid values)",match:"exact"}])}),Xe("bmi-calc","tool-text-cases",{cases:Object.freeze([{input:"70kg 175cm",expected:"BMI:      22.9",match:"contains"}])})],my=[Xe("text-to-qr","tool-qr-generate",{input:"Folkkit evidence",expectedFilename:"folkkit-qr.svg"}),Xe("merge-pdf","tool-pdf-behavior",{operation:"merge"}),Xe("pdf-page-count","tool-pdf-behavior",{operation:"page-count"}),Xe("pdf-split","tool-pdf-behavior",{operation:"split"}),Xe("pdf-extract-range","tool-pdf-behavior",{operation:"extract-range"}),Xe("text-to-pdf","tool-pdf-behavior",{operation:"text-to-pdf"}),Xe("pdf-metadata","tool-pdf-behavior",{operation:"metadata"}),Xe("pdf-rotate","tool-pdf-behavior",{operation:"rotate"})],gy=[Xe("images-to-pdf","browser-e2e"),Xe("png-to-jpg","browser-e2e"),Xe("jpg-to-png","browser-e2e"),Xe("audio-to-mp3","browser-e2e")],yy=Object.freeze([...hy,py,...fy,...my,...gy]);Object.freeze([...Hr,...yy]);const by=Object.freeze(Hr.map(n=>n.formatId)),tf=Object.freeze(Hr.flatMap(n=>[Object.freeze({evidenceId:n.evidenceId,from:n.from,to:n.to,compatibility:n.compatibility,implementationEvidenceId:n.evidenceId,inputLimitClass:n.inputLimitClass}),...n.additionalCases.map((s,l)=>Object.freeze({evidenceId:`${n.evidenceId}:${l+2}`,from:s.from,to:s.to,compatibility:s.compatibility,implementationEvidenceId:`${n.evidenceId}:${l+2}`,inputLimitClass:n.inputLimitClass}))])),Ty=new Set(tf.map(n=>`${n.from}→${n.to}`));function Cr(n){return Hr.find(s=>s.formatId===n)||null}function nf(n,s){return typeof n=="string"&&typeof s=="string"&&Ty.has(`${n}→${s}`)}function Ey(n){return typeof n!="string"?[]:tf.filter(s=>s.from===n).map(s=>s.to)}function e0(n,s){if(!nf(n,s))return null;const l=Cr(n),c=Cr(s),p=Rr[l?.inputLimitClass]||Rr["text-5-mib"],d=Rr[c?.inputLimitClass]||Rr["text-5-mib"];return Math.min(p,d)}const Oc=[{id:"text",name:"Text",group:"Text",placeholder:"Type or paste text..."},{id:"base64",name:"Base64",group:"Text",placeholder:"SGVsbG8gV29ybGQ="},{id:"base32",name:"Base32",group:"Text",placeholder:"JBSWY3DPEBLW64TMMQ======"},{id:"base58",name:"Base58",group:"Text",placeholder:"StV1DL6CwTryKyV"},{id:"url",name:"URL Encoded",group:"Text",placeholder:"hello%20world"},{id:"html-ent",name:"HTML Entities",group:"Text",placeholder:"&lt;div&gt;hello&lt;/div&gt;"},{id:"hex",name:"Hex",group:"Text",placeholder:"48 65 6c 6c 6f"},{id:"binary",name:"Binary",group:"Text",placeholder:"01001000 01100101 01101100 01101100 01101111"},{id:"unicode",name:"Unicode Escaped",group:"Text",placeholder:"\\u0048\\u0065\\u006c\\u006c\\u006f"},{id:"morse",name:"Morse Code",group:"Text",placeholder:".... . .-.. .-.. ---"},{id:"nato",name:"NATO Phonetic",group:"Text",placeholder:"Alfa Bravo Charlie"},{id:"rot13",name:"ROT13",group:"Text",placeholder:"Uryyb Jbeyq"},{id:"reverse",name:"Reversed",group:"Text",placeholder:"dlroW olleH"},{id:"json-escaped",name:"JSON String",group:"Text",placeholder:'"Hello\\nWorld\\t\\"quoted\\"" '},{id:"uppercase",name:"UPPERCASE",group:"Case",placeholder:"HELLO WORLD"},{id:"lowercase",name:"lowercase",group:"Case",placeholder:"hello world"},{id:"titlecase",name:"Title Case",group:"Case",placeholder:"Hello World"},{id:"camelcase",name:"camelCase",group:"Case",placeholder:"helloWorld"},{id:"snakecase",name:"snake_case",group:"Case",placeholder:"hello_world"},{id:"kebabcase",name:"kebab-case",group:"Case",placeholder:"hello-world"},{id:"markdown",name:"Markdown",group:"Markup",placeholder:"# Hello **world**"},{id:"html-markup",name:"HTML",group:"Markup",placeholder:"<h1>Hello <strong>world</strong></h1>"},{id:"plain",name:"Plain Text",group:"Markup",placeholder:"Hello world"},{id:"json",name:"JSON",group:"Data",placeholder:'{"key": "value"}'},{id:"json-min",name:"JSON Minified",group:"Data",placeholder:'{"key":"value"}'},{id:"yaml",name:"YAML",group:"Data",placeholder:`key: value
items:
  - one
  - two`},{id:"csv",name:"CSV",group:"Data",placeholder:`name,age
Alice,30
Bob,25`},{id:"tsv",name:"TSV",group:"Data",placeholder:`name	age
Alice	30
Bob	25`},{id:"xml",name:"XML",group:"Data",placeholder:"<root><item>hello</item></root>"},{id:"querystring",name:"Query String",group:"Data",placeholder:"key=value&foo=bar"},{id:"toml",name:"TOML",group:"Data",placeholder:`key = "value"
[section]
name = "test"`},{id:"timestamp",name:"Unix Timestamp",group:"Time",placeholder:"1700000000"},{id:"iso-date",name:"ISO 8601",group:"Time",placeholder:"2024-01-15T12:00:00Z"},{id:"human-date",name:"Human Date",group:"Time",placeholder:"Mon, 15 Jan 2024 12:00:00 GMT"},{id:"sha1",name:"SHA-1 Hash",group:"Hash"},{id:"sha256",name:"SHA-256 Hash",group:"Hash"},{id:"sha384",name:"SHA-384 Hash",group:"Hash"},{id:"sha512",name:"SHA-512 Hash",group:"Hash"},{id:"md5",name:"MD5 Hash",group:"Hash"},{id:"decimal",name:"Decimal",group:"Number",placeholder:"255"},{id:"numhex",name:"Hexadecimal",group:"Number",placeholder:"0xFF"},{id:"numbin",name:"Binary (Num)",group:"Number",placeholder:"0b11111111"},{id:"numoct",name:"Octal",group:"Number",placeholder:"0o377"},{id:"roman",name:"Roman Numeral",group:"Number",placeholder:"CCLV"},{id:"bits",name:"Bits",group:"Data Size",placeholder:"8388608"},{id:"bytes",name:"Bytes",group:"Data Size",placeholder:"1048576"},{id:"kilobytes",name:"Kilobytes",group:"Data Size",placeholder:"1024"},{id:"megabytes",name:"Megabytes",group:"Data Size",placeholder:"1"},{id:"gigabytes",name:"Gigabytes",group:"Data Size",placeholder:"0.5"},{id:"kib",name:"Kibibytes (KiB)",group:"Data Size",placeholder:"1000"},{id:"mib",name:"Mebibytes (MiB)",group:"Data Size",placeholder:"0.977"},{id:"gib",name:"Gibibytes (GiB)",group:"Data Size",placeholder:"0.00095"},{id:"celsius",name:"Celsius",group:"Temperature",placeholder:"100"},{id:"fahrenheit",name:"Fahrenheit",group:"Temperature",placeholder:"212"},{id:"kelvin",name:"Kelvin",group:"Temperature",placeholder:"373.15"},{id:"inches",name:"Inches",group:"Length",placeholder:"12"},{id:"cm",name:"Centimeters",group:"Length",placeholder:"30.48"},{id:"mm",name:"Millimeters",group:"Length",placeholder:"304.8"},{id:"feet",name:"Feet",group:"Length",placeholder:"1"},{id:"meters",name:"Meters",group:"Length",placeholder:"0.3048"},{id:"miles",name:"Miles",group:"Distance",placeholder:"1"},{id:"km",name:"Kilometers",group:"Distance",placeholder:"1.609"},{id:"yards",name:"Yards",group:"Distance",placeholder:"1760"},{id:"nautmiles",name:"Nautical Miles",group:"Distance",placeholder:"0.8684"},{id:"kg",name:"Kilograms",group:"Weight",placeholder:"1"},{id:"lb",name:"Pounds",group:"Weight",placeholder:"2.205"},{id:"oz",name:"Ounces",group:"Weight",placeholder:"35.274"},{id:"grams",name:"Grams",group:"Weight",placeholder:"1000"},{id:"ton-metric",name:"Tonnes (metric)",group:"Weight",placeholder:"0.001"},{id:"ton-short",name:"Short Tons (US)",group:"Weight",placeholder:"0.0011"},{id:"stone",name:"Stones",group:"Weight",placeholder:"0.1575"},{id:"mph",name:"Miles/hour",group:"Speed",placeholder:"60"},{id:"kmh",name:"km/hour",group:"Speed",placeholder:"96.56"},{id:"ms",name:"Meters/sec",group:"Speed",placeholder:"26.82"},{id:"knots",name:"Knots",group:"Speed",placeholder:"52.14"},{id:"sqft",name:"Square Feet",group:"Area",placeholder:"100"},{id:"sqm",name:"Square Meters",group:"Area",placeholder:"9.29"},{id:"acres",name:"Acres",group:"Area",placeholder:"1"},{id:"hectares",name:"Hectares",group:"Area",placeholder:"0.4047"},{id:"liters",name:"Liters",group:"Volume",placeholder:"1"},{id:"gallons",name:"Gallons (US)",group:"Volume",placeholder:"0.2642"},{id:"ml",name:"Milliliters",group:"Volume",placeholder:"1000"},{id:"floz",name:"Fluid Ounces",group:"Volume",placeholder:"33.814"},{id:"cups",name:"Cups",group:"Volume",placeholder:"4.227"},{id:"dur-seconds",name:"Seconds",group:"Duration",placeholder:"3600"},{id:"dur-minutes",name:"Minutes",group:"Duration",placeholder:"60"},{id:"dur-hours",name:"Hours",group:"Duration",placeholder:"1"},{id:"dur-days",name:"Days",group:"Duration",placeholder:"0.0417"},{id:"joules",name:"Joules",group:"Energy",placeholder:"1000"},{id:"calories",name:"Calories",group:"Energy",placeholder:"239.006"},{id:"kcal",name:"Kilocalories",group:"Energy",placeholder:"0.239"},{id:"kwh",name:"Kilowatt-hours",group:"Energy",placeholder:"0.000278"},{id:"btu",name:"BTU",group:"Energy",placeholder:"0.9478"},{id:"psi",name:"PSI",group:"Pressure",placeholder:"14.696"},{id:"bar",name:"Bar",group:"Pressure",placeholder:"1.01325"},{id:"atm",name:"Atmospheres",group:"Pressure",placeholder:"1"},{id:"pascal",name:"Pascals",group:"Pressure",placeholder:"101325"},{id:"mmhg",name:"mmHg",group:"Pressure",placeholder:"760"},{id:"degrees",name:"Degrees",group:"Angle",placeholder:"180"},{id:"radians",name:"Radians",group:"Angle",placeholder:"3.14159"},{id:"gradians",name:"Gradians",group:"Angle",placeholder:"200"},{id:"terabytes",name:"Terabytes",group:"Data Size",placeholder:"0.001"},{id:"petabytes",name:"Petabytes",group:"Data Size",placeholder:"0.000001"},{id:"hz",name:"Hertz",group:"Frequency",placeholder:"1000"},{id:"khz",name:"Kilohertz",group:"Frequency",placeholder:"1"},{id:"mhz",name:"Megahertz",group:"Frequency",placeholder:"0.001"},{id:"ghz",name:"Gigahertz",group:"Frequency",placeholder:"0.000001"},{id:"watts",name:"Watts",group:"Power",placeholder:"1000"},{id:"kilowatts",name:"Kilowatts",group:"Power",placeholder:"1"},{id:"horsepower",name:"Horsepower",group:"Power",placeholder:"1.341"},{id:"btuh",name:"BTU/hour",group:"Power",placeholder:"3412.14"},{id:"mpg",name:"Miles/gallon",group:"Fuel Economy",placeholder:"30"},{id:"kml",name:"km/Liter",group:"Fuel Economy",placeholder:"12.75"},{id:"l100km",name:"L/100km",group:"Fuel Economy",placeholder:"7.84"},{id:"bps",name:"Bits/sec",group:"Data Rate",placeholder:"1000000"},{id:"kbps",name:"Kbps",group:"Data Rate",placeholder:"1000"},{id:"mbps",name:"Mbps",group:"Data Rate",placeholder:"1"},{id:"gbps",name:"Gbps",group:"Data Rate",placeholder:"0.001"},{id:"tsp",name:"Teaspoons",group:"Cooking",placeholder:"3"},{id:"tbsp",name:"Tablespoons",group:"Cooking",placeholder:"1"},{id:"cup-cook",name:"Cups (US)",group:"Cooking",placeholder:"0.0625"},{id:"braille",name:"Braille",group:"Text",placeholder:"⠓⠑⠇⠇⠕"},{id:"piglatin",name:"Pig Latin",group:"Text",placeholder:"ellohay orldway"},{id:"leetspeak",name:"Leet Speak",group:"Text",placeholder:"h3ll0 w0rld"},{id:"base64url",name:"Base64 URL",group:"Text",placeholder:"SGVsbG8gV29ybGQ"},{id:"atbash",name:"Atbash",group:"Text",placeholder:"Svool Dliow"},{id:"rankine",name:"Rankine",group:"Temperature",placeholder:"671.67"},{id:"turns",name:"Turns",group:"Angle",placeholder:"0.5"},{id:"tbps",name:"Tbps",group:"Data Rate",placeholder:"0.000001"},{id:"color-hex",name:"Color HEX",group:"Color",placeholder:"#ff6b35"},{id:"color-rgb",name:"Color RGB",group:"Color",placeholder:"rgb(255, 107, 53)"},{id:"color-hsl",name:"Color HSL",group:"Color",placeholder:"hsl(16, 100%, 60%)"},{id:"color-hsv",name:"Color HSV",group:"Color",placeholder:"hsv(16, 79%, 100%)"},{id:"color-cmyk",name:"Color CMYK",group:"Color",placeholder:"cmyk(0%, 58%, 79%, 0%)"},{id:"pint-cook",name:"Pints (US)",group:"Cooking",placeholder:"0.03125"},{id:"qt-cook",name:"Quarts (US)",group:"Cooking",placeholder:"0.015625"},{id:"floz-cook",name:"Fluid Oz (US)",group:"Cooking",placeholder:"0.5"},{id:"dur-ms",name:"Milliseconds",group:"Duration",placeholder:"3600000"},{id:"dur-weeks",name:"Weeks",group:"Duration",placeholder:"0.006"},{id:"dur-us",name:"Microseconds",group:"Duration",placeholder:"3600000000"},{id:"dur-ns",name:"Nanoseconds",group:"Duration",placeholder:"3.6e12"},{id:"dur-months",name:"Months",group:"Duration",placeholder:"0.00137"},{id:"dur-years",name:"Years",group:"Duration",placeholder:"0.000114"},{id:"megajoules",name:"Megajoules",group:"Energy",placeholder:"0.001"},{id:"fps",name:"Feet/sec",group:"Speed",placeholder:"88"},{id:"mach",name:"Mach",group:"Speed",placeholder:"0.0767"},{id:"micrometers",name:"Micrometers",group:"Length",placeholder:"304800"},{id:"nanometers",name:"Nanometers",group:"Length",placeholder:"304800000"},{id:"light-year",name:"Light Years",group:"Distance",placeholder:"1"},{id:"au",name:"Astronomical Units",group:"Distance",placeholder:"63241"},{id:"gallon-us",name:"Gallons (US)",group:"Cooking",placeholder:"1"},{id:"milligrams",name:"Milligrams",group:"Weight",placeholder:"453592"},{id:"micrograms",name:"Micrograms",group:"Weight",placeholder:"453592000"},{id:"carats",name:"Carats",group:"Weight",placeholder:"5000"},{id:"btu-per-hr",name:"BTU/hour",group:"Power",placeholder:"3412"},{id:"calories-per-sec",name:"cal/sec",group:"Power",placeholder:"239"},{id:"rpm",name:"RPM",group:"Frequency",placeholder:"60"},{id:"radians-per-sec",name:"Radians/sec (ω)",group:"Frequency",placeholder:"6.2832"},{id:"troy-oz",name:"Troy Ounce",group:"Weight",placeholder:"32.15"},{id:"sqkm",name:"Square Kilometers",group:"Area",placeholder:"1"},{id:"sqmiles",name:"Square Miles",group:"Area",placeholder:"0.3861"},{id:"sqinches",name:"Square Inches",group:"Area",placeholder:"1550"},{id:"sqcm",name:"Square Centimeters",group:"Area",placeholder:"92.9"},{id:"kpa",name:"Kilopascals (kPa)",group:"Pressure",placeholder:"101.325"},{id:"hpa",name:"Hectopascals (hPa)",group:"Pressure",placeholder:"1013.25"},{id:"arcminutes",name:"Arcminutes",group:"Angle",placeholder:"10800"},{id:"arcseconds",name:"Arcseconds",group:"Angle",placeholder:"648000"},{id:"cubic-m",name:"Cubic Meters",group:"Volume",placeholder:"0.001"},{id:"cubic-ft",name:"Cubic Feet",group:"Volume",placeholder:"0.0353"},{id:"newtons",name:"Newtons",group:"Force",placeholder:"9.807"},{id:"pound-force",name:"Pound-force (lbf)",group:"Force",placeholder:"2.205"},{id:"kg-force",name:"Kilogram-force (kgf)",group:"Force",placeholder:"1"},{id:"dyne",name:"Dyne",group:"Force",placeholder:"980665"},{id:"kilonewtons",name:"Kilonewtons",group:"Force",placeholder:"0.009807"},{id:"lux",name:"Lux",group:"Illuminance",placeholder:"500"},{id:"foot-candle",name:"Foot-candle",group:"Illuminance",placeholder:"46.45"},{id:"millilux",name:"Millilux",group:"Illuminance",placeholder:"500000"},{id:"pt",name:"Points (pt)",group:"Typography",placeholder:"72"},{id:"pica",name:"Picas",group:"Typography",placeholder:"6"},{id:"px",name:"Pixels (96 DPI)",group:"Typography",placeholder:"96"},{id:"kgm3",name:"kg/m³",group:"Density",placeholder:"1000"},{id:"gcm3",name:"g/cm³",group:"Density",placeholder:"1"},{id:"lbft3",name:"lb/ft³",group:"Density",placeholder:"62.43"},{id:"lbgal",name:"lb/gal (US)",group:"Density",placeholder:"8.34"},{id:"ampere",name:"Amperes (A)",group:"Electric",placeholder:"1"},{id:"milliamp",name:"Milliamperes (mA)",group:"Electric",placeholder:"1000"},{id:"microamp",name:"Microamperes (μA)",group:"Electric",placeholder:"1000000"},{id:"kiloamp",name:"Kiloamperes (kA)",group:"Electric",placeholder:"0.001"},{id:"volt",name:"Volts (V)",group:"Voltage",placeholder:"120"},{id:"millivolt",name:"Millivolts (mV)",group:"Voltage",placeholder:"120000"},{id:"kilovolt",name:"Kilovolts (kV)",group:"Voltage",placeholder:"0.12"},{id:"microvolt",name:"Microvolts (μV)",group:"Voltage",placeholder:"120000000"},{id:"ohm",name:"Ohms (Ω)",group:"Resistance",placeholder:"1000"},{id:"kilohm",name:"Kilohms (kΩ)",group:"Resistance",placeholder:"1"},{id:"megohm",name:"Megohms (MΩ)",group:"Resistance",placeholder:"0.001"},{id:"milliohm",name:"Milliohms (mΩ)",group:"Resistance",placeholder:"1000000"},{id:"ms2",name:"m/s²",group:"Acceleration",placeholder:"9.81"},{id:"gforce",name:"g-force",group:"Acceleration",placeholder:"1"},{id:"fts2",name:"ft/s²",group:"Acceleration",placeholder:"32.17"},{id:"cms2",name:"cm/s² (Gal)",group:"Acceleration",placeholder:"981"},{id:"nm-torque",name:"Newton-meters (N·m)",group:"Torque",placeholder:"100"},{id:"lb-ft",name:"Pound-feet (lb·ft)",group:"Torque",placeholder:"73.76"},{id:"lb-in",name:"Pound-inches (lb·in)",group:"Torque",placeholder:"885.1"},{id:"kg-cm",name:"Kilogram-cm (kg·cm)",group:"Torque",placeholder:"1019.7"},{id:"newton",name:"Newtons (N)",group:"Force",placeholder:"9.81"},{id:"kilonewton",name:"Kilonewtons (kN)",group:"Force",placeholder:"0.00981"},{id:"kgforce",name:"Kilogram-force (kgf)",group:"Force",placeholder:"1"},{id:"footcandle",name:"Footcandle (fc)",group:"Illuminance",placeholder:"46.45"},{id:"phot",name:"Phot (ph)",group:"Illuminance",placeholder:"0.05"},{id:"nox",name:"Nox (nx)",group:"Illuminance",placeholder:"500000"},{id:"farad",name:"Farad (F)",group:"Capacitance",placeholder:"0.000001"},{id:"microfarad",name:"Microfarad (μF)",group:"Capacitance",placeholder:"1"},{id:"nanofarad",name:"Nanofarad (nF)",group:"Capacitance",placeholder:"1000"},{id:"picofarad",name:"Picofarad (pF)",group:"Capacitance",placeholder:"1000000"},{id:"terahertz",name:"Terahertz (THz)",group:"Frequency",placeholder:"0.001"},{id:"gigahertz",name:"Gigahertz (GHz)",group:"Frequency",placeholder:"1"},{id:"percent",name:"Percent (%)",group:"Number",placeholder:"75"},{id:"decimal-frac",name:"Decimal Fraction",group:"Number",placeholder:"0.75"},{id:"ppm",name:"Parts per Million (ppm)",group:"Number",placeholder:"750000"},{id:"ppb",name:"Parts per Billion (ppb)",group:"Number",placeholder:"750000000"},{id:"pt-type",name:"Point (pt)",group:"Typography",placeholder:"72"},{id:"screen-px",name:"Screen Pixel (96 DPI)",group:"Typography",placeholder:"96"},{id:"twip",name:"Twip (1/1440 in)",group:"Typography",placeholder:"1440"}],af=new Set(by),Oy=Oc.filter(n=>af.has(n.id));function vy(n,s="de"){const l=Oc.find(p=>p.id===n),c=Cr(n);return!l||!c?null:{...l,name:s==="en"?c.nameEn:c.nameDe}}function t0(n="de"){return Oy.map(s=>vy(s.id,n))}async function Yi(n,s){const l=new TextEncoder().encode(s),c=await crypto.subtle.digest(n,l);return Array.from(new Uint8Array(c)).map(p=>p.toString(16).padStart(2,"0")).join("")}const of="123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";function lc(n){const s=new TextEncoder().encode(n);let l=0n;for(const p of s)l=l*256n+BigInt(p);let c="";for(;l>0n;)c=of[Number(l%58n)]+c,l/=58n;for(const p of s)if(p===0)c="1"+c;else break;return c||"1"}function cc(n){const s=n.trim();let l=0n;for(const m of s){const y=of.indexOf(m);if(y<0)throw new Error("bad char");l=l*58n+BigInt(y)}const p=l.toString(16).padStart(2,"0").match(/.{2}/g).map(m=>parseInt(m,16));let d=0;for(const m of s)if(m==="1")d++;else break;const f=new Uint8Array([...Array(d).fill(0),...p]);return new TextDecoder().decode(f)}const rf={a:"⠁",b:"⠃",c:"⠉",d:"⠙",e:"⠑",f:"⠋",g:"⠛",h:"⠓",i:"⠊",j:"⠚",k:"⠅",l:"⠇",m:"⠍",n:"⠝",o:"⠕",p:"⠏",q:"⠟",r:"⠗",s:"⠎",t:"⠞",u:"⠥",v:"⠧",w:"⠺",x:"⠭",y:"⠽",z:"⠵",1:"⠼⠁",2:"⠼⠃",3:"⠼⠉",4:"⠼⠙",5:"⠼⠑",6:"⠼⠋",7:"⠼⠛",8:"⠼⠓",9:"⠼⠊",0:"⠼⠚"," ":" ",".":"⠲",",":"⠂","?":"⠦","!":"⠖",";":"⠆",":":"⠒","-":"⠤","'":"⠄",'"':"⠦","/":"⠌","(":"⠐⠣",")":"⠐⠜"},Qi={};for(const[n,s]of Object.entries(rf))Qi[s]||(Qi[s]=n);function un(n){let s="";for(const l of n.toLowerCase())s+=rf[l]||l;return s}function $i(n){let s="",l=0;const c=Array.from(n);for(;l<c.length;){if(l+1<c.length){const d=c[l]+c[l+1];if(Qi[d]){s+=Qi[d],l+=2;continue}}const p=c[l];s+=Qi[p]||p,l++}return s}function uc(n){return n.replace(/\b([a-zA-Z]+)\b/g,s=>{const l=s.toLowerCase(),c=s[0]===s[0].toUpperCase(),p="aeiou";let d;if(p.includes(l[0]))d=l+"yay";else{let f=0;for(;f<l.length&&!p.includes(l[f]);)f++;d=l.slice(f)+l.slice(0,f)+"ay"}return c?d.charAt(0).toUpperCase()+d.slice(1):d})}function dc(n){return n.replace(/\b([a-zA-Z]+)\b/g,s=>{const l=s.toLowerCase(),c=s[0]===s[0].toUpperCase();let p;if(l.endsWith("yay"))p=l.slice(0,-3);else if(l.endsWith("ay")){const d=l.slice(0,-2),f="aeiou";let m=d.length;for(let y=d.length-1;y>=0&&!f.includes(d[y]);y--)m=y;p=d.slice(m)+d.slice(0,m)}else p=l;return c?p.charAt(0).toUpperCase()+p.slice(1):p})}const fc={a:"4",e:"3",i:"1",o:"0",s:"5",t:"7",b:"8",g:"9",l:"|"},Fr=Object.fromEntries(Object.entries(fc).map(([n,s])=>[s,n]));function jp(n){const s=new TextEncoder().encode(n);function l(M,F){let L=M[0],k=M[1],H=M[2],U=M[3];const de=(ne,ye,Q,Ne,W,Z,pe)=>(ne=c(c(ne,ye&Q|~ye&Ne),c(W,pe)),c(ne<<Z|ne>>>32-Z,ye)),P=(ne,ye,Q,Ne,W,Z,pe)=>(ne=c(c(ne,ye&Ne|Q&~Ne),c(W,pe)),c(ne<<Z|ne>>>32-Z,ye)),J=(ne,ye,Q,Ne,W,Z,pe)=>(ne=c(c(ne,ye^Q^Ne),c(W,pe)),c(ne<<Z|ne>>>32-Z,ye)),se=(ne,ye,Q,Ne,W,Z,pe)=>(ne=c(c(ne,Q^(ye|~Ne)),c(W,pe)),c(ne<<Z|ne>>>32-Z,ye));L=de(L,k,H,U,F[0],7,-680876936),U=de(U,L,k,H,F[1],12,-389564586),H=de(H,U,L,k,F[2],17,606105819),k=de(k,H,U,L,F[3],22,-1044525330),L=de(L,k,H,U,F[4],7,-176418897),U=de(U,L,k,H,F[5],12,1200080426),H=de(H,U,L,k,F[6],17,-1473231341),k=de(k,H,U,L,F[7],22,-45705983),L=de(L,k,H,U,F[8],7,1770035416),U=de(U,L,k,H,F[9],12,-1958414417),H=de(H,U,L,k,F[10],17,-42063),k=de(k,H,U,L,F[11],22,-1990404162),L=de(L,k,H,U,F[12],7,1804603682),U=de(U,L,k,H,F[13],12,-40341101),H=de(H,U,L,k,F[14],17,-1502002290),k=de(k,H,U,L,F[15],22,1236535329),L=P(L,k,H,U,F[1],5,-165796510),U=P(U,L,k,H,F[6],9,-1069501632),H=P(H,U,L,k,F[11],14,643717713),k=P(k,H,U,L,F[0],20,-373897302),L=P(L,k,H,U,F[5],5,-701558691),U=P(U,L,k,H,F[10],9,38016083),H=P(H,U,L,k,F[15],14,-660478335),k=P(k,H,U,L,F[4],20,-405537848),L=P(L,k,H,U,F[9],5,568446438),U=P(U,L,k,H,F[14],9,-1019803690),H=P(H,U,L,k,F[3],14,-187363961),k=P(k,H,U,L,F[8],20,1163531501),L=P(L,k,H,U,F[13],5,-1444681467),U=P(U,L,k,H,F[2],9,-51403784),H=P(H,U,L,k,F[7],14,1735328473),k=P(k,H,U,L,F[12],20,-1926607734),L=J(L,k,H,U,F[5],4,-378558),U=J(U,L,k,H,F[8],11,-2022574463),H=J(H,U,L,k,F[11],16,1839030562),k=J(k,H,U,L,F[14],23,-35309556),L=J(L,k,H,U,F[1],4,-1530992060),U=J(U,L,k,H,F[4],11,1272893353),H=J(H,U,L,k,F[7],16,-155497632),k=J(k,H,U,L,F[10],23,-1094730640),L=J(L,k,H,U,F[13],4,681279174),U=J(U,L,k,H,F[0],11,-358537222),H=J(H,U,L,k,F[3],16,-722521979),k=J(k,H,U,L,F[6],23,76029189),L=J(L,k,H,U,F[9],4,-640364487),U=J(U,L,k,H,F[12],11,-421815835),H=J(H,U,L,k,F[15],16,530742520),k=J(k,H,U,L,F[2],23,-995338651),L=se(L,k,H,U,F[0],6,-198630844),U=se(U,L,k,H,F[7],10,1126891415),H=se(H,U,L,k,F[14],15,-1416354905),k=se(k,H,U,L,F[5],21,-57434055),L=se(L,k,H,U,F[12],6,1700485571),U=se(U,L,k,H,F[3],10,-1894986606),H=se(H,U,L,k,F[10],15,-1051523),k=se(k,H,U,L,F[1],21,-2054922799),L=se(L,k,H,U,F[8],6,1873313359),U=se(U,L,k,H,F[15],10,-30611744),H=se(H,U,L,k,F[6],15,-1560198380),k=se(k,H,U,L,F[13],21,1309151649),L=se(L,k,H,U,F[4],6,-145523070),U=se(U,L,k,H,F[11],10,-1120210379),H=se(H,U,L,k,F[2],15,718787259),k=se(k,H,U,L,F[9],21,-343485551),M[0]=c(L,M[0]),M[1]=c(k,M[1]),M[2]=c(H,M[2]),M[3]=c(U,M[3])}function c(M,F){return M+F&4294967295}function p(M){const F=[];for(let L=0;L<64;L+=4)F[L>>2]=M[L]+(M[L+1]<<8)+(M[L+2]<<16)+(M[L+3]<<24);return F}const d=s.length;let f=[128],m=d+1;for(;m%64!==56;)f.push(0),m++;const y=[1732584193,-271733879,-1732584194,271733878],b=new Uint8Array(d+f.length+8);b.set(s),b.set(f,d);const z=d*8;b[b.length-8]=z&255,b[b.length-7]=z>>8&255,b[b.length-6]=z>>16&255,b[b.length-5]=z>>24&255;for(let M=0;M<b.length;M+=64)l(y,p(b.slice(M,M+64)));return y.map(M=>{let F="";for(let L=0;L<4;L++)F+=(M>>L*8&255).toString(16).padStart(2,"0");return F}).join("")}function Gp(n){const s=[[1e3,"M"],[900,"CM"],[500,"D"],[400,"CD"],[100,"C"],[90,"XC"],[50,"L"],[40,"XL"],[10,"X"],[9,"IX"],[5,"V"],[4,"IV"],[1,"I"]];let l="";for(const[c,p]of s)for(;n>=c;)l+=p,n-=c;return l}function Bp(n){const s={I:1,V:5,X:10,L:50,C:100,D:500,M:1e3};let l=0;const c=n.trim().toUpperCase();for(let p=0;p<c.length;p++){const d=s[c[p]];if(!d)throw new Error("invalid roman numeral");const f=s[c[p+1]]||0;d<f?l-=d:l+=d}return l}function Pp(n){const s=JSON.parse(n);return $t(s,0)}const dn={A:".-",B:"-...",C:"-.-.",D:"-..",E:".",F:"..-.",G:"--.",H:"....",I:"..",J:".---",K:"-.-",L:".-..",M:"--",N:"-.",O:"---",P:".--.",Q:"--.-",R:".-.",S:"...",T:"-",U:"..-",V:"...-",W:".--",X:"-..-",Y:"-.--",Z:"--..",0:"-----",1:".----",2:"..---",3:"...--",4:"....-",5:".....",6:"-....",7:"--...",8:"---..",9:"----."," ":"/"},Nr=Object.fromEntries(Object.entries(dn).map(([n,s])=>[s,n])),Pa={A:"Alfa",B:"Bravo",C:"Charlie",D:"Delta",E:"Echo",F:"Foxtrot",G:"Golf",H:"Hotel",I:"India",J:"Juliet",K:"Kilo",L:"Lima",M:"Mike",N:"November",O:"Oscar",P:"Papa",Q:"Quebec",R:"Romeo",S:"Sierra",T:"Tango",U:"Uniform",V:"Victor",W:"Whiskey",X:"X-ray",Y:"Yankee",Z:"Zulu"},sf={"text→base64":n=>btoa(unescape(encodeURIComponent(n))),"base64→text":n=>decodeURIComponent(escape(atob(n.trim()))),"text→base58":n=>lc(n),"base58→text":n=>cc(n),"text→base32":n=>{const s="ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",l=new TextEncoder().encode(n);let c="";for(const d of l)c+=d.toString(2).padStart(8,"0");for(;c.length%5;)c+="0";let p="";for(let d=0;d<c.length;d+=5)p+=s[parseInt(c.slice(d,d+5),2)];for(;p.length%8;)p+="=";return p},"base32→text":n=>{const s="ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",l=n.trim().replace(/=+$/,"").toUpperCase();let c="";for(const d of l){const f=s.indexOf(d);if(f<0)throw new Error("bad char");c+=f.toString(2).padStart(5,"0")}const p=[];for(let d=0;d+8<=c.length;d+=8)p.push(parseInt(c.slice(d,d+8),2));return new TextDecoder().decode(new Uint8Array(p))},"text→url":n=>encodeURIComponent(n),"url→text":n=>decodeURIComponent(n),"text→html-ent":n=>n.replace(/[&<>"']/g,s=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[s]),"html-ent→text":n=>{const s=document.createElement("textarea");return s.innerHTML=n,s.value},"text→hex":n=>Array.from(new TextEncoder().encode(n)).map(s=>s.toString(16).padStart(2,"0")).join(" "),"hex→text":n=>{const s=n.replace(/\s+/g,""),l=new Uint8Array(s.match(/.{2}/g).map(c=>parseInt(c,16)));return new TextDecoder().decode(l)},"text→binary":n=>Array.from(new TextEncoder().encode(n)).map(s=>s.toString(2).padStart(8,"0")).join(" "),"binary→text":n=>{const s=n.trim().split(/\s+/);return new TextDecoder().decode(new Uint8Array(s.map(l=>parseInt(l,2))))},"text→unicode":n=>Array.from(n).map(s=>{const l=s.codePointAt(0);return l>65535?`\\u{${l.toString(16)}}`:`\\u${l.toString(16).padStart(4,"0")}`}).join(""),"unicode→text":n=>n.replace(/\\u\{([0-9a-fA-F]+)\}|\\u([0-9a-fA-F]{4})/g,(s,l,c)=>String.fromCodePoint(parseInt(l||c,16))),"text→morse":n=>n.toUpperCase().split("").map(s=>dn[s]||s).join(" "),"morse→text":n=>n.trim().split(" ").map(s=>Nr[s]||s).join(""),"text→nato":n=>n.toUpperCase().split("").map(s=>s===" "?"/":Pa[s]||s).join(" "),"text→uppercase":n=>n.toUpperCase(),"text→lowercase":n=>n.toLowerCase(),"text→titlecase":n=>n.replace(/\b\w/g,s=>s.toUpperCase()),"text→camelcase":n=>n.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g,(s,l)=>l.toUpperCase()),"text→snakecase":n=>n.replace(/([a-z])([A-Z])/g,"$1_$2").replace(/[\s-]+/g,"_").toLowerCase(),"text→kebabcase":n=>n.replace(/([a-z])([A-Z])/g,"$1-$2").replace(/[\s_]+/g,"-").toLowerCase(),"uppercase→text":n=>n,"lowercase→text":n=>n,"titlecase→text":n=>n,"camelcase→text":n=>n.replace(/([A-Z])/g," $1").trim().toLowerCase(),"snakecase→text":n=>n.replace(/_/g," "),"kebabcase→text":n=>n.replace(/-/g," "),"uppercase→lowercase":n=>n.toLowerCase(),"lowercase→uppercase":n=>n.toUpperCase(),"text→rot13":n=>n.replace(/[a-zA-Z]/g,s=>{const l=s<="Z"?65:97;return String.fromCharCode((s.charCodeAt(0)-l+13)%26+l)}),"rot13→text":n=>n.replace(/[a-zA-Z]/g,s=>{const l=s<="Z"?65:97;return String.fromCharCode((s.charCodeAt(0)-l+13)%26+l)}),"text→braille":n=>un(n),"braille→text":n=>$i(n),"text→piglatin":n=>uc(n),"piglatin→text":n=>dc(n),"text→leetspeak":n=>Array.from(n).map(s=>fc[s.toLowerCase()]||s).join(""),"leetspeak→text":n=>Array.from(n).map(s=>Fr[s]||s).join(""),"text→base64url":n=>btoa(unescape(encodeURIComponent(n))).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,""),"base64url→text":n=>{const s=n.trim().replace(/-/g,"+").replace(/_/g,"/");return decodeURIComponent(escape(atob(s+"=".repeat((4-s.length%4)%4))))},"base64url→base64":n=>{const s=n.trim().replace(/-/g,"+").replace(/_/g,"/");return s+"=".repeat((4-s.length%4)%4)},"base64→base64url":n=>n.trim().replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,""),"base64url→hex":n=>{const s=n.trim().replace(/-/g,"+").replace(/_/g,"/"),l=Uint8Array.from(atob(s+"=".repeat((4-s.length%4)%4)),c=>c.charCodeAt(0));return Array.from(l).map(c=>c.toString(16).padStart(2,"0")).join(" ")},"text→atbash":n=>n.replace(/[a-zA-Z]/g,s=>{const l=s<="Z"?65:97;return String.fromCharCode(l+25-(s.charCodeAt(0)-l))}),"atbash→text":n=>n.replace(/[a-zA-Z]/g,s=>{const l=s<="Z"?65:97;return String.fromCharCode(l+25-(s.charCodeAt(0)-l))}),"atbash→morse":n=>n.replace(/[a-zA-Z]/g,l=>{const c=l<="Z"?65:97;return String.fromCharCode(c+25-(l.charCodeAt(0)-c))}).toUpperCase().split("").map(l=>dn[l]||l).join(" "),"atbash→braille":n=>un(n.replace(/[a-zA-Z]/g,s=>{const l=s<="Z"?65:97;return String.fromCharCode(l+25-(s.charCodeAt(0)-l))})),"rot13→atbash":n=>n.replace(/[a-zA-Z]/g,l=>{const c=l<="Z"?65:97;return String.fromCharCode((l.charCodeAt(0)-c+13)%26+c)}).replace(/[a-zA-Z]/g,l=>{const c=l<="Z"?65:97;return String.fromCharCode(c+25-(l.charCodeAt(0)-c))}),"atbash→rot13":n=>n.replace(/[a-zA-Z]/g,l=>{const c=l<="Z"?65:97;return String.fromCharCode(c+25-(l.charCodeAt(0)-c))}).replace(/[a-zA-Z]/g,l=>{const c=l<="Z"?65:97;return String.fromCharCode((l.charCodeAt(0)-c+13)%26+c)}),"reverse→base64":n=>btoa(unescape(encodeURIComponent(n))),"reverse→morse":n=>n.toUpperCase().split("").map(s=>dn[s]||s).join(" "),"reverse→braille":n=>un(n),"morse→braille":n=>un(n.trim().split(" ").map(s=>Nr[s]||s).join("")),"braille→morse":n=>$i(n).toUpperCase().split("").map(s=>dn[s]||s).join(" "),"base64→braille":n=>un(decodeURIComponent(escape(atob(n.trim())))),"braille→base64":n=>btoa(unescape(encodeURIComponent($i(n)))),"leetspeak→morse":n=>Array.from(n).map(l=>Fr[l]||l).join("").toUpperCase().split("").map(l=>dn[l]||l).join(" "),"leetspeak→braille":n=>un(Array.from(n).map(s=>Fr[s]||s).join("")),"piglatin→braille":n=>un(dc(n)),"braille→piglatin":n=>uc($i(n)),"morse→binary":n=>{const s=n.trim().split(" ").map(l=>Nr[l]||l).join("");return Array.from(new TextEncoder().encode(s)).map(l=>l.toString(2).padStart(8,"0")).join(" ")},"binary→morse":n=>new TextDecoder().decode(new Uint8Array(n.trim().split(/\s+/).map(l=>parseInt(l,2)))).toUpperCase().split("").map(l=>dn[l]||l).join(" "),"rot13→morse":n=>n.replace(/[a-zA-Z]/g,s=>{const l=s<="Z"?65:97;return String.fromCharCode((s.charCodeAt(0)-l+13)%26+l)}).toUpperCase().split("").map(s=>dn[s]||s).join(" "),"rot13→braille":n=>un(n.replace(/[a-zA-Z]/g,s=>{const l=s<="Z"?65:97;return String.fromCharCode((s.charCodeAt(0)-l+13)%26+l)})),"morse→nato":n=>n.trim().split(" ").map(l=>Nr[l]||l).join("").toUpperCase().split("").map(l=>l===" "?"/":Pa[l]||l).join(" "),"nato→morse":n=>{const s=Object.fromEntries(Object.entries(Pa).map(([c,p])=>[p.toLowerCase(),c]));return n.split(/\s+/).map(c=>c==="/"?" ":s[c.toLowerCase()]||c).join("").toUpperCase().split("").map(c=>dn[c]||c).join(" ")},"braille→nato":n=>$i(n).toUpperCase().split("").map(l=>l===" "?"/":Pa[l]||l).join(" "),"nato→braille":n=>{const s=Object.fromEntries(Object.entries(Pa).map(([c,p])=>[p.toLowerCase(),c])),l=n.split(/\s+/).map(c=>c==="/"?" ":s[c.toLowerCase()]||c).join("");return un(l)},"reverse→leetspeak":n=>Array.from(n).map(s=>fc[s.toLowerCase()]||s).join(""),"leetspeak→reverse":n=>[...Array.from(n).map(s=>Fr[s]||s).join("")].reverse().join(""),"reverse→piglatin":n=>uc([...n].reverse().join("")),"piglatin→reverse":n=>[...dc(n)].reverse().join(""),"text→reverse":n=>[...n].reverse().join(""),"reverse→text":n=>[...n].reverse().join(""),"text→json-escaped":n=>JSON.stringify(n),"json-escaped→text":n=>JSON.parse(n.trim()),"markdown→html-markup":n=>{let s=n;return s=s.replace(/^### (.+)$/gm,"<h3>$1</h3>"),s=s.replace(/^## (.+)$/gm,"<h2>$1</h2>"),s=s.replace(/^# (.+)$/gm,"<h1>$1</h1>"),s=s.replace(/\*\*\*(.+?)\*\*\*/g,"<strong><em>$1</em></strong>"),s=s.replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>"),s=s.replace(/\*(.+?)\*/g,"<em>$1</em>"),s=s.replace(/`(.+?)`/g,"<code>$1</code>"),s=s.replace(/\[(.+?)\]\((.+?)\)/g,'<a href="$2">$1</a>'),s},"html-markup→plain":n=>{const s=document.createElement("div");return s.innerHTML=n,s.textContent||""},"json→json-min":n=>JSON.stringify(JSON.parse(n)),"json-min→json":n=>JSON.stringify(JSON.parse(n),null,2),"json→csv":n=>{const s=JSON.parse(n);if(!Array.isArray(s)||!s.length)throw new Error("expected array");const l=Object.keys(s[0]),c=p=>{const d=String(p??"");return/[,"\n]/.test(d)?`"${d.replace(/"/g,'""')}"`:d};return[l.map(c).join(","),...s.map(p=>l.map(d=>c(p[d])).join(","))].join(`
`)},"csv→json":n=>{const s=n.trim().split(`
`),l=p=>{const d=[];let f="",m=!1;for(let y=0;y<p.length;y++){const b=p[y];m?b==='"'&&p[y+1]==='"'?(f+='"',y++):b==='"'?m=!1:f+=b:b==='"'?m=!0:b===","?(d.push(f),f=""):f+=b}return d.push(f),d},c=l(s[0]);return JSON.stringify(s.slice(1).map(p=>{const d=l(p),f={};return c.forEach((m,y)=>f[m]=d[y]??""),f}),null,2)},"csv→tsv":n=>{const s=l=>{const c=[];let p="",d=!1;for(let f=0;f<l.length;f++){const m=l[f];d?m==='"'&&l[f+1]==='"'?(p+='"',f++):m==='"'?d=!1:p+=m:m==='"'?d=!0:m===","?(c.push(p),p=""):p+=m}return c.push(p),c};return n.trim().split(`
`).map(l=>s(l).join("	")).join(`
`)},"tsv→csv":n=>{const s=l=>{const c=String(l??"");return/[,"\n]/.test(c)?`"${c.replace(/"/g,'""')}"`:c};return n.trim().split(`
`).map(l=>l.split("	").map(s).join(",")).join(`
`)},"json→tsv":n=>{const s=JSON.parse(n);if(!Array.isArray(s)||!s.length)throw new Error("expected array");const l=Object.keys(s[0]);return[l.join("	"),...s.map(c=>l.map(p=>String(c[p]??"").replace(/\t/g," ")).join("	"))].join(`
`)},"tsv→json":n=>{const s=n.trim().split(`
`),l=s[0].split("	");return JSON.stringify(s.slice(1).map(c=>{const p=c.split("	"),d={};return l.forEach((f,m)=>d[f]=p[m]??""),d}),null,2)},"tsv→yaml":n=>{const s=n.trim().split(`
`),l=s[0].split("	"),c=s.slice(1).map(p=>{const d=p.split("	"),f={};return l.forEach((m,y)=>f[m]=d[y]??""),f});return $t(c,0)},"tsv→xml":n=>{const s=n.trim().split(`
`),l=s[0].split("	");return`<?xml version="1.0"?>
<data>
`+s.slice(1).map(p=>{const d=p.split("	");return`  <row>
`+l.map((f,m)=>`    <${f}>${(d[m]||"").replace(/&/g,"&amp;").replace(/</g,"&lt;")}</${f}>`).join(`
`)+`
  </row>`}).join(`
`)+`
</data>`},"json→yaml":n=>Pp(n),"yaml→json":n=>Pi(n),"json→toml":n=>{const s=JSON.parse(n),l=[];function c(p,d){for(const[f,m]of Object.entries(p))if(m!==null&&typeof m=="object"&&!Array.isArray(m)){const y=d?`${d}.${f}`:f;l.push(`
[${y}]`),c(m,y)}else{const y=typeof m=="string"?`"${m}"`:JSON.stringify(m);l.push(`${f} = ${y}`)}}return c(s,""),l.join(`
`).trim()},"toml→json":n=>JSON.stringify(vr(n),null,2),"json→querystring":n=>{const s=JSON.parse(n),l=new URLSearchParams;for(const[c,p]of Object.entries(s))l.set(c,String(p));return l.toString()},"querystring→json":n=>{const s=new URLSearchParams(n.trim().replace(/^\?/,"")),l={};for(const[c,p]of s)l[c]=p;return JSON.stringify(l,null,2)},"yaml→csv":n=>{const s=Pi(n),l=JSON.parse(s);if(!Array.isArray(l))throw new Error("need array");const c=Object.keys(l[0]),p=d=>{const f=String(d??"");return/[,"\n]/.test(f)?`"${f.replace(/"/g,'""')}"`:f};return[c.map(p).join(","),...l.map(d=>c.map(f=>p(d[f])).join(","))].join(`
`)},"xml→json":n=>{const l=new DOMParser().parseFromString(n,"text/xml");if(l.querySelector("parsererror"))throw new Error("invalid XML");function c(p){const d={};if(p.attributes)for(const f of p.attributes)d["@"+f.name]=f.value;for(const f of p.childNodes)if(f.nodeType===3){const m=f.textContent.trim();if(m){if(!Object.keys(d).length)return m;d["#text"]=m}}else if(f.nodeType===1){const m=c(f);d[f.nodeName]?(Array.isArray(d[f.nodeName])||(d[f.nodeName]=[d[f.nodeName]]),d[f.nodeName].push(m)):d[f.nodeName]=m}return d}return JSON.stringify({[l.documentElement.nodeName]:c(l.documentElement)},null,2)},"text→sha1":n=>Yi("SHA-1",n),"text→sha256":n=>Yi("SHA-256",n),"text→sha384":n=>Yi("SHA-384",n),"text→sha512":n=>Yi("SHA-512",n),"text→md5":n=>jp(n),"base64→sha256":async n=>{const s=decodeURIComponent(escape(atob(n.trim())));return Yi("SHA-256",s)},"base64→md5":n=>{const s=decodeURIComponent(escape(atob(n.trim())));return jp(s)},"timestamp→iso-date":n=>{const s=Number(n.trim()),l=s>1e12?s:s*1e3;return new Date(l).toISOString()},"timestamp→human-date":n=>{const s=Number(n.trim()),l=s>1e12?s:s*1e3;return new Date(l).toUTCString()},"iso-date→timestamp":n=>String(Math.floor(new Date(n.trim()).getTime()/1e3)),"iso-date→human-date":n=>new Date(n.trim()).toUTCString(),"human-date→timestamp":n=>String(Math.floor(new Date(n.trim()).getTime()/1e3)),"human-date→iso-date":n=>new Date(n.trim()).toISOString(),"text→timestamp":n=>{const s=new Date(n.trim());if(isNaN(s.getTime()))throw new Error("bad date");return String(Math.floor(s.getTime()/1e3))},"text→iso-date":n=>{const s=new Date(n.trim());if(isNaN(s.getTime()))throw new Error("bad date");return s.toISOString()},"decimal→numhex":n=>"0x"+parseInt(n.trim(),10).toString(16).toUpperCase(),"numhex→decimal":n=>String(parseInt(n.trim().replace(/^0x/i,""),16)),"decimal→numbin":n=>"0b"+parseInt(n.trim(),10).toString(2),"numbin→decimal":n=>String(parseInt(n.trim().replace(/^0b/i,""),2)),"decimal→numoct":n=>"0o"+parseInt(n.trim(),10).toString(8),"numoct→decimal":n=>String(parseInt(n.trim().replace(/^0o/i,""),8)),"numhex→numbin":n=>"0b"+parseInt(n.trim().replace(/^0x/i,""),16).toString(2),"numbin→numhex":n=>"0x"+parseInt(n.trim().replace(/^0b/i,""),2).toString(16).toUpperCase(),"decimal→roman":n=>{const s=parseInt(n.trim(),10);if(isNaN(s)||s<1||s>3999)throw new Error("1-3999 only");return Gp(s)},"roman→decimal":n=>String(Bp(n)),"numhex→roman":n=>{const s=parseInt(n.trim().replace(/^0x/i,""),16);return Gp(s)},"roman→numhex":n=>"0x"+Bp(n).toString(16).toUpperCase(),"base64→hex":n=>{const s=Uint8Array.from(atob(n.trim()),l=>l.charCodeAt(0));return Array.from(s).map(l=>l.toString(16).padStart(2,"0")).join(" ")},"hex→base64":n=>{const l=n.replace(/\s+/g,"").match(/.{2}/g).map(c=>parseInt(c,16));return btoa(String.fromCharCode(...l))},"base64→base32":n=>{const s=Uint8Array.from(atob(n.trim()),d=>d.charCodeAt(0)),l="ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";let c="";for(const d of s)c+=d.toString(2).padStart(8,"0");for(;c.length%5;)c+="0";let p="";for(let d=0;d<c.length;d+=5)p+=l[parseInt(c.slice(d,d+5),2)];for(;p.length%8;)p+="=";return p},"base32→base64":n=>{const s="ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",l=n.trim().replace(/=+$/,"").toUpperCase();let c="";for(const d of l){const f=s.indexOf(d);if(f<0)throw new Error("bad char");c+=f.toString(2).padStart(5,"0")}const p=[];for(let d=0;d+8<=c.length;d+=8)p.push(parseInt(c.slice(d,d+8),2));return btoa(String.fromCharCode(...p))},"base64→binary":n=>{const s=Uint8Array.from(atob(n.trim()),l=>l.charCodeAt(0));return Array.from(s).map(l=>l.toString(2).padStart(8,"0")).join(" ")},"binary→base64":n=>{const s=n.trim().split(/\s+/).map(l=>parseInt(l,2));return btoa(String.fromCharCode(...s))},"hex→binary":n=>n.replace(/\s+/g,"").match(/.{2}/g).map(l=>parseInt(l,16).toString(2).padStart(8,"0")).join(" "),"binary→hex":n=>n.trim().split(/\s+/).map(s=>parseInt(s,2).toString(16).padStart(2,"0")).join(" "),"url→base64":n=>btoa(unescape(encodeURIComponent(decodeURIComponent(n)))),"base64→url":n=>encodeURIComponent(decodeURIComponent(escape(atob(n.trim())))),"url→hex":n=>{const s=decodeURIComponent(n);return Array.from(new TextEncoder().encode(s)).map(l=>l.toString(16).padStart(2,"0")).join(" ")},"hex→url":n=>{const s=n.replace(/\s+/g,""),l=new Uint8Array(s.match(/.{2}/g).map(c=>parseInt(c,16)));return encodeURIComponent(new TextDecoder().decode(l))},"base32→hex":n=>{const s="ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",l=n.trim().replace(/=+$/,"").toUpperCase();let c="";for(const d of l){const f=s.indexOf(d);if(f<0)throw new Error("bad char");c+=f.toString(2).padStart(5,"0")}const p=[];for(let d=0;d+8<=c.length;d+=8)p.push(parseInt(c.slice(d,d+8),2));return p.map(d=>d.toString(16).padStart(2,"0")).join(" ")},"hex→base32":n=>{const s="ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",c=n.replace(/\s+/g,"").match(/.{2}/g).map(f=>parseInt(f,16));let p="";for(const f of c)p+=f.toString(2).padStart(8,"0");for(;p.length%5;)p+="0";let d="";for(let f=0;f<p.length;f+=5)d+=s[parseInt(p.slice(f,f+5),2)];for(;d.length%8;)d+="=";return d},"base58→base64":n=>btoa(unescape(encodeURIComponent(cc(n)))),"base64→base58":n=>lc(decodeURIComponent(escape(atob(n.trim())))),"base58→hex":n=>{const s=cc(n);return Array.from(new TextEncoder().encode(s)).map(l=>l.toString(16).padStart(2,"0")).join(" ")},"hex→base58":n=>{const s=n.replace(/\s+/g,""),l=new Uint8Array(s.match(/.{2}/g).map(c=>parseInt(c,16)));return lc(new TextDecoder().decode(l))},"json→xml":n=>{const s=JSON.parse(n);function l(p,d){if(p==null)return`<${d}/>`;if(Array.isArray(p))return p.map(f=>l(f,d)).join(`
`);if(typeof p=="object"){const f=Object.entries(p).map(([m,y])=>l(y,m)).join(`
  `);return`<${d}>
  ${f}
</${d}>`}return`<${d}>${String(p).replace(/&/g,"&amp;").replace(/</g,"&lt;")}</${d}>`}const c=Object.keys(s);return c.length===1?`<?xml version="1.0"?>
`+l(s[c[0]],c[0]):`<?xml version="1.0"?>
`+l(s,"root")},"xml→yaml":n=>{const l=new DOMParser().parseFromString(n,"text/xml");if(l.querySelector("parsererror"))throw new Error("invalid XML");function c(d){const f={};if(d.attributes)for(const m of d.attributes)f["@"+m.name]=m.value;for(const m of d.childNodes)if(m.nodeType===3){const y=m.textContent.trim();if(y){if(!Object.keys(f).length)return y;f["#text"]=y}}else if(m.nodeType===1){const y=c(m);f[m.nodeName]?(Array.isArray(f[m.nodeName])||(f[m.nodeName]=[f[m.nodeName]]),f[m.nodeName].push(y)):f[m.nodeName]=y}return f}const p={[l.documentElement.nodeName]:c(l.documentElement)};return $t(p,0)},"csv→yaml":n=>{const s=n.trim().split(`
`),l=d=>{const f=[];let m="",y=!1;for(let b=0;b<d.length;b++){const z=d[b];y?z==='"'&&d[b+1]==='"'?(m+='"',b++):z==='"'?y=!1:m+=z:z==='"'?y=!0:z===","?(f.push(m),m=""):m+=z}return f.push(m),f},c=l(s[0]),p=s.slice(1).map(d=>{const f=l(d),m={};return c.forEach((y,b)=>m[y]=f[b]??""),m});return $t(p,0)},"toml→yaml":n=>$t(vr(n),0),"yaml→toml":n=>{const s=Pi(n),l=JSON.parse(s),c=[];function p(d,f){for(const[m,y]of Object.entries(d))if(y!==null&&typeof y=="object"&&!Array.isArray(y)){const b=f?`${f}.${m}`:m;c.push(`
[${b}]`),p(y,b)}else{const b=typeof y=="string"?`"${y}"`:JSON.stringify(y);c.push(`${m} = ${b}`)}}return p(l,""),c.join(`
`).trim()},"json-min→yaml":n=>Pp(JSON.stringify(JSON.parse(n))),"yaml→json-min":n=>JSON.stringify(JSON.parse(Pi(n))),"json-min→csv":n=>{const s=JSON.parse(n);if(!Array.isArray(s)||!s.length)throw new Error("expected array");const l=Object.keys(s[0]),c=p=>{const d=String(p??"");return/[,"\n]/.test(d)?`"${d.replace(/"/g,'""')}"`:d};return[l.map(c).join(","),...s.map(p=>l.map(d=>c(p[d])).join(","))].join(`
`)},"json-min→toml":n=>{const s=JSON.parse(n),l=[];function c(p,d){for(const[f,m]of Object.entries(p))if(m!==null&&typeof m=="object"&&!Array.isArray(m)){const y=d?`${d}.${f}`:f;l.push(`
[${y}]`),c(m,y)}else{const y=typeof m=="string"?`"${m}"`:JSON.stringify(m);l.push(`${f} = ${y}`)}}return c(s,""),l.join(`
`).trim()},"csv→toml":n=>{const s=n.trim().split(`
`),l=d=>{const f=[];let m="",y=!1;for(let b=0;b<d.length;b++){const z=d[b];y?z==='"'&&d[b+1]==='"'?(m+='"',b++):z==='"'?y=!1:m+=z:z==='"'?y=!0:z===","?(f.push(m),m=""):m+=z}return f.push(m),f},c=l(s[0]);return s.slice(1).map(d=>{const f=l(d),m={};return c.forEach((y,b)=>m[y]=f[b]??""),m}).map(d=>{const f=`[[item]]
`,m=Object.entries(d).map(([y,b])=>/^-?\d+$/.test(b)?`${y} = ${b}`:/^-?\d+\.\d+$/.test(b)?`${y} = ${b}`:b==="true"||b==="false"?`${y} = ${b}`:`${y} = "${b}"`).join(`
`);return f+m}).join(`

`)},"toml→csv":n=>{const s=vr(n),c=Object.values(s).find(f=>Array.isArray(f))||[s];if(!Array.isArray(c)||!c.length)throw new Error("no tabular data");const p=Object.keys(c[0]),d=f=>{const m=String(f??"");return/[,"\n]/.test(m)?`"${m.replace(/"/g,'""')}"`:m};return[p.map(d).join(","),...c.map(f=>p.map(m=>d(f[m])).join(","))].join(`
`)},"querystring→yaml":n=>{const s=new URLSearchParams(n.trim().replace(/^\?/,"")),l={};for(const[c,p]of s)l[c]=p;return $t(l,0)},"yaml→querystring":n=>{const s=Pi(n),l=JSON.parse(s),c=new URLSearchParams;for(const[p,d]of Object.entries(l))c.set(p,String(d));return c.toString()},"querystring→toml":n=>{const s=new URLSearchParams(n.trim().replace(/^\?/,"")),l=[];for(const[c,p]of s)/^-?\d+$/.test(p)?l.push(`${c} = ${p}`):p==="true"||p==="false"?l.push(`${c} = ${p}`):l.push(`${c} = "${p}"`);return l.join(`
`)},"nato→text":n=>{const s=Object.fromEntries(Object.entries(Pa).map(([l,c])=>[c.toLowerCase(),l]));return n.split(/\s+/).map(l=>l==="/"?" ":s[l.toLowerCase()]||l).join("")},"bytes→kilobytes":n=>(parseFloat(n.trim())/1024).toPrecision(6).replace(/\.?0+$/,""),"bytes→megabytes":n=>(parseFloat(n.trim())/(1024*1024)).toPrecision(6).replace(/\.?0+$/,""),"bytes→gigabytes":n=>(parseFloat(n.trim())/(1024*1024*1024)).toPrecision(6).replace(/\.?0+$/,""),"kilobytes→bytes":n=>String(Math.round(parseFloat(n.trim())*1024)),"kilobytes→megabytes":n=>(parseFloat(n.trim())/1024).toPrecision(6).replace(/\.?0+$/,""),"kilobytes→gigabytes":n=>(parseFloat(n.trim())/(1024*1024)).toPrecision(6).replace(/\.?0+$/,""),"megabytes→bytes":n=>String(Math.round(parseFloat(n.trim())*1024*1024)),"megabytes→kilobytes":n=>String(Math.round(parseFloat(n.trim())*1024)),"megabytes→gigabytes":n=>(parseFloat(n.trim())/1024).toPrecision(6).replace(/\.?0+$/,""),"gigabytes→bytes":n=>String(Math.round(parseFloat(n.trim())*1024*1024*1024)),"gigabytes→kilobytes":n=>String(Math.round(parseFloat(n.trim())*1024*1024)),"gigabytes→megabytes":n=>String(Math.round(parseFloat(n.trim())*1024)),"bits→bytes":n=>(parseFloat(n.trim())/8).toPrecision(6).replace(/\.?0+$/,""),"bytes→bits":n=>String(Math.round(parseFloat(n.trim())*8)),"bits→kilobytes":n=>(parseFloat(n.trim())/8/1024).toPrecision(6).replace(/\.?0+$/,""),"bits→megabytes":n=>(parseFloat(n.trim())/8/1048576).toPrecision(6).replace(/\.?0+$/,""),"kilobytes→bits":n=>String(Math.round(parseFloat(n.trim())*1024*8)),"megabytes→bits":n=>String(Math.round(parseFloat(n.trim())*1048576*8)),"bits→gigabytes":n=>(parseFloat(n.trim())/8/1073741824).toPrecision(6).replace(/\.?0+$/,""),"gigabytes→bits":n=>String(Math.round(parseFloat(n.trim())*1073741824*8)),"bits→terabytes":n=>(parseFloat(n.trim())/8/1099511627776).toPrecision(6).replace(/\.?0+$/,""),"terabytes→bits":n=>String(Math.round(parseFloat(n.trim())*1099511627776*8)),"bits→petabytes":n=>(parseFloat(n.trim())/8/0x4000000000000).toPrecision(6).replace(/\.?0+$/,""),"petabytes→bits":n=>String(Math.round(parseFloat(n.trim())*0x4000000000000*8)),"bits→kib":n=>(parseFloat(n.trim())/8/1024).toPrecision(6).replace(/\.?0+$/,""),"kib→bits":n=>String(Math.round(parseFloat(n.trim())*1024*8)),"bits→mib":n=>(parseFloat(n.trim())/8/1048576).toPrecision(6).replace(/\.?0+$/,""),"mib→bits":n=>String(Math.round(parseFloat(n.trim())*1048576*8)),"bits→gib":n=>(parseFloat(n.trim())/8/1073741824).toPrecision(6).replace(/\.?0+$/,""),"gib→bits":n=>String(Math.round(parseFloat(n.trim())*1073741824*8)),"bytes→kib":n=>(parseFloat(n.trim())/1024).toPrecision(6).replace(/\.?0+$/,""),"kib→bytes":n=>String(Math.round(parseFloat(n.trim())*1024)),"bytes→mib":n=>(parseFloat(n.trim())/1048576).toPrecision(6).replace(/\.?0+$/,""),"mib→bytes":n=>String(Math.round(parseFloat(n.trim())*1048576)),"bytes→gib":n=>(parseFloat(n.trim())/1073741824).toPrecision(6).replace(/\.?0+$/,""),"gib→bytes":n=>String(Math.round(parseFloat(n.trim())*1073741824)),"kib→mib":n=>(parseFloat(n.trim())/1024).toPrecision(6).replace(/\.?0+$/,""),"mib→kib":n=>String(Math.round(parseFloat(n.trim())*1024)),"kib→gib":n=>(parseFloat(n.trim())/1048576).toPrecision(6).replace(/\.?0+$/,""),"gib→kib":n=>String(Math.round(parseFloat(n.trim())*1048576)),"mib→gib":n=>(parseFloat(n.trim())/1024).toPrecision(6).replace(/\.?0+$/,""),"gib→mib":n=>String(Math.round(parseFloat(n.trim())*1024)),"kilobytes→kib":n=>(parseFloat(n.trim())*1e3/1024).toPrecision(6).replace(/\.?0+$/,""),"kib→kilobytes":n=>(parseFloat(n.trim())*1024/1e3).toPrecision(6).replace(/\.?0+$/,""),"megabytes→mib":n=>(parseFloat(n.trim())*1e6/1048576).toPrecision(6).replace(/\.?0+$/,""),"mib→megabytes":n=>(parseFloat(n.trim())*1048576/1e6).toPrecision(6).replace(/\.?0+$/,""),"gigabytes→gib":n=>(parseFloat(n.trim())*1e9/1073741824).toPrecision(6).replace(/\.?0+$/,""),"gib→gigabytes":n=>(parseFloat(n.trim())*1073741824/1e9).toPrecision(6).replace(/\.?0+$/,""),"celsius→fahrenheit":n=>(parseFloat(n.trim())*9/5+32).toFixed(2)+" °F","celsius→kelvin":n=>(parseFloat(n.trim())+273.15).toFixed(2)+" K","fahrenheit→celsius":n=>((parseFloat(n.trim())-32)*5/9).toFixed(2)+" °C","fahrenheit→kelvin":n=>((parseFloat(n.trim())-32)*5/9+273.15).toFixed(2)+" K","kelvin→celsius":n=>(parseFloat(n.trim())-273.15).toFixed(2)+" °C","kelvin→fahrenheit":n=>((parseFloat(n.trim())-273.15)*9/5+32).toFixed(2)+" °F","celsius→rankine":n=>((parseFloat(n.trim())+273.15)*1.8).toFixed(2)+" °R","rankine→celsius":n=>(parseFloat(n.trim())/1.8-273.15).toFixed(2)+" °C","fahrenheit→rankine":n=>(parseFloat(n.trim())+459.67).toFixed(2)+" °R","rankine→fahrenheit":n=>(parseFloat(n.trim())-459.67).toFixed(2)+" °F","kelvin→rankine":n=>(parseFloat(n.trim())*1.8).toFixed(2)+" °R","rankine→kelvin":n=>(parseFloat(n.trim())/1.8).toFixed(4)+" K","numoct→numhex":n=>"0x"+parseInt(n.trim().replace(/^0o/i,""),8).toString(16).toUpperCase(),"numhex→numoct":n=>"0o"+parseInt(n.trim().replace(/^0x/i,""),16).toString(8),"numoct→numbin":n=>"0b"+parseInt(n.trim().replace(/^0o/i,""),8).toString(2),"numbin→numoct":n=>"0o"+parseInt(n.trim().replace(/^0b/i,""),2).toString(8),"markdown→plain":n=>{let s=n;return s=s.replace(/^#{1,6}\s+/gm,""),s=s.replace(/\*\*\*(.+?)\*\*\*/g,"$1"),s=s.replace(/\*\*(.+?)\*\*/g,"$1"),s=s.replace(/\*(.+?)\*/g,"$1"),s=s.replace(/~~(.+?)~~/g,"$1"),s=s.replace(/`(.+?)`/g,"$1"),s=s.replace(/\[(.+?)\]\(.+?\)/g,"$1"),s=s.replace(/!\[.*?\]\(.+?\)/g,""),s=s.replace(/^>\s?/gm,""),s=s.replace(/^[-*+]\s/gm,""),s=s.replace(/^\d+\.\s/gm,""),s=s.replace(/^---+$/gm,""),s.trim()},"json-min→querystring":n=>{const s=JSON.parse(n),l=new URLSearchParams;for(const[c,p]of Object.entries(s))l.set(c,String(p));return l.toString()},"querystring→json-min":n=>{const s=new URLSearchParams(n.trim().replace(/^\?/,"")),l={};for(const[c,p]of s)l[c]=p;return JSON.stringify(l)},"inches→cm":n=>(parseFloat(n)*2.54).toFixed(4).replace(/\.?0+$/,""),"cm→inches":n=>(parseFloat(n)/2.54).toFixed(4).replace(/\.?0+$/,""),"inches→mm":n=>(parseFloat(n)*25.4).toFixed(2).replace(/\.?0+$/,""),"mm→inches":n=>(parseFloat(n)/25.4).toFixed(4).replace(/\.?0+$/,""),"inches→feet":n=>(parseFloat(n)/12).toFixed(4).replace(/\.?0+$/,""),"feet→inches":n=>(parseFloat(n)*12).toFixed(2).replace(/\.?0+$/,""),"inches→meters":n=>(parseFloat(n)*.0254).toFixed(4).replace(/\.?0+$/,""),"meters→inches":n=>(parseFloat(n)/.0254).toFixed(2).replace(/\.?0+$/,""),"cm→mm":n=>(parseFloat(n)*10).toFixed(2).replace(/\.?0+$/,""),"mm→cm":n=>(parseFloat(n)/10).toFixed(4).replace(/\.?0+$/,""),"cm→meters":n=>(parseFloat(n)/100).toFixed(4).replace(/\.?0+$/,""),"meters→cm":n=>(parseFloat(n)*100).toFixed(2).replace(/\.?0+$/,""),"cm→feet":n=>(parseFloat(n)/30.48).toFixed(4).replace(/\.?0+$/,""),"feet→cm":n=>(parseFloat(n)*30.48).toFixed(2).replace(/\.?0+$/,""),"mm→meters":n=>(parseFloat(n)/1e3).toFixed(4).replace(/\.?0+$/,""),"meters→mm":n=>(parseFloat(n)*1e3).toFixed(2).replace(/\.?0+$/,""),"feet→meters":n=>(parseFloat(n)*.3048).toFixed(4).replace(/\.?0+$/,""),"meters→feet":n=>(parseFloat(n)/.3048).toFixed(4).replace(/\.?0+$/,""),"mm→feet":n=>(parseFloat(n)/304.8).toFixed(4).replace(/\.?0+$/,""),"feet→mm":n=>(parseFloat(n)*304.8).toFixed(2).replace(/\.?0+$/,""),"kg→lb":n=>(parseFloat(n)*2.20462).toFixed(4).replace(/\.?0+$/,""),"lb→kg":n=>(parseFloat(n)/2.20462).toFixed(4).replace(/\.?0+$/,""),"kg→oz":n=>(parseFloat(n)*35.274).toFixed(2).replace(/\.?0+$/,""),"oz→kg":n=>(parseFloat(n)/35.274).toFixed(4).replace(/\.?0+$/,""),"kg→grams":n=>(parseFloat(n)*1e3).toFixed(2).replace(/\.?0+$/,""),"grams→kg":n=>(parseFloat(n)/1e3).toFixed(4).replace(/\.?0+$/,""),"lb→oz":n=>(parseFloat(n)*16).toFixed(2).replace(/\.?0+$/,""),"oz→lb":n=>(parseFloat(n)/16).toFixed(4).replace(/\.?0+$/,""),"lb→grams":n=>(parseFloat(n)*453.592).toFixed(2).replace(/\.?0+$/,""),"grams→lb":n=>(parseFloat(n)/453.592).toFixed(4).replace(/\.?0+$/,""),"oz→grams":n=>(parseFloat(n)*28.3495).toFixed(2).replace(/\.?0+$/,""),"grams→oz":n=>(parseFloat(n)/28.3495).toFixed(4).replace(/\.?0+$/,""),"kg→ton-metric":n=>(parseFloat(n)/1e3).toFixed(6).replace(/\.?0+$/,""),"ton-metric→kg":n=>(parseFloat(n)*1e3).toFixed(2).replace(/\.?0+$/,""),"kg→ton-short":n=>(parseFloat(n)/907.185).toFixed(6).replace(/\.?0+$/,""),"ton-short→kg":n=>(parseFloat(n)*907.185).toFixed(2).replace(/\.?0+$/,""),"kg→stone":n=>(parseFloat(n)/6.35029).toFixed(4).replace(/\.?0+$/,""),"stone→kg":n=>(parseFloat(n)*6.35029).toFixed(4).replace(/\.?0+$/,""),"lb→stone":n=>(parseFloat(n)/14).toFixed(4).replace(/\.?0+$/,""),"stone→lb":n=>(parseFloat(n)*14).toFixed(2).replace(/\.?0+$/,""),"ton-metric→lb":n=>(parseFloat(n)*2204.62).toFixed(2).replace(/\.?0+$/,""),"lb→ton-metric":n=>(parseFloat(n)/2204.62).toFixed(6).replace(/\.?0+$/,""),"ton-metric→ton-short":n=>(parseFloat(n)*1.10231).toFixed(4).replace(/\.?0+$/,""),"ton-short→ton-metric":n=>(parseFloat(n)/1.10231).toFixed(4).replace(/\.?0+$/,""),"ton-short→lb":n=>(parseFloat(n)*2e3).toFixed(2).replace(/\.?0+$/,""),"lb→ton-short":n=>(parseFloat(n)/2e3).toFixed(6).replace(/\.?0+$/,""),"miles→km":n=>(parseFloat(n)*1.60934).toFixed(4).replace(/\.?0+$/,""),"km→miles":n=>(parseFloat(n)/1.60934).toFixed(4).replace(/\.?0+$/,""),"miles→yards":n=>(parseFloat(n)*1760).toFixed(2).replace(/\.?0+$/,""),"yards→miles":n=>(parseFloat(n)/1760).toFixed(6).replace(/\.?0+$/,""),"miles→meters":n=>(parseFloat(n)*1609.34).toFixed(2).replace(/\.?0+$/,""),"meters→miles":n=>(parseFloat(n)/1609.34).toFixed(6).replace(/\.?0+$/,""),"miles→nautmiles":n=>(parseFloat(n)*.868976).toFixed(4).replace(/\.?0+$/,""),"nautmiles→miles":n=>(parseFloat(n)/.868976).toFixed(4).replace(/\.?0+$/,""),"km→yards":n=>(parseFloat(n)*1093.61).toFixed(2).replace(/\.?0+$/,""),"yards→km":n=>(parseFloat(n)/1093.61).toFixed(6).replace(/\.?0+$/,""),"km→meters":n=>(parseFloat(n)*1e3).toFixed(2).replace(/\.?0+$/,""),"meters→km":n=>(parseFloat(n)/1e3).toFixed(6).replace(/\.?0+$/,""),"km→nautmiles":n=>(parseFloat(n)*.539957).toFixed(4).replace(/\.?0+$/,""),"nautmiles→km":n=>(parseFloat(n)/.539957).toFixed(4).replace(/\.?0+$/,""),"yards→meters":n=>(parseFloat(n)*.9144).toFixed(4).replace(/\.?0+$/,""),"meters→yards":n=>(parseFloat(n)/.9144).toFixed(4).replace(/\.?0+$/,""),"yards→feet":n=>(parseFloat(n)*3).toFixed(2).replace(/\.?0+$/,""),"feet→yards":n=>(parseFloat(n)/3).toFixed(4).replace(/\.?0+$/,""),"nautmiles→meters":n=>(parseFloat(n)*1852).toFixed(2).replace(/\.?0+$/,""),"meters→nautmiles":n=>(parseFloat(n)/1852).toFixed(6).replace(/\.?0+$/,""),"mph→kmh":n=>(parseFloat(n)*1.60934).toFixed(4).replace(/\.?0+$/,""),"kmh→mph":n=>(parseFloat(n)/1.60934).toFixed(4).replace(/\.?0+$/,""),"mph→ms":n=>(parseFloat(n)*.44704).toFixed(4).replace(/\.?0+$/,""),"ms→mph":n=>(parseFloat(n)/.44704).toFixed(4).replace(/\.?0+$/,""),"mph→knots":n=>(parseFloat(n)*.868976).toFixed(4).replace(/\.?0+$/,""),"knots→mph":n=>(parseFloat(n)/.868976).toFixed(4).replace(/\.?0+$/,""),"kmh→ms":n=>(parseFloat(n)/3.6).toFixed(4).replace(/\.?0+$/,""),"ms→kmh":n=>(parseFloat(n)*3.6).toFixed(4).replace(/\.?0+$/,""),"kmh→knots":n=>(parseFloat(n)*.539957).toFixed(4).replace(/\.?0+$/,""),"knots→kmh":n=>(parseFloat(n)/.539957).toFixed(4).replace(/\.?0+$/,""),"ms→knots":n=>(parseFloat(n)*1.94384).toFixed(4).replace(/\.?0+$/,""),"knots→ms":n=>(parseFloat(n)/1.94384).toFixed(4).replace(/\.?0+$/,""),"fps→mph":n=>(parseFloat(n)*.681818).toFixed(4).replace(/\.?0+$/,""),"mph→fps":n=>(parseFloat(n)*1.46667).toFixed(4).replace(/\.?0+$/,""),"fps→ms":n=>(parseFloat(n)*.3048).toFixed(4).replace(/\.?0+$/,""),"ms→fps":n=>(parseFloat(n)/.3048).toFixed(4).replace(/\.?0+$/,""),"fps→kmh":n=>(parseFloat(n)*1.09728).toFixed(4).replace(/\.?0+$/,""),"kmh→fps":n=>(parseFloat(n)/1.09728).toFixed(4).replace(/\.?0+$/,""),"fps→knots":n=>(parseFloat(n)*.592484).toFixed(4).replace(/\.?0+$/,""),"knots→fps":n=>(parseFloat(n)/.592484).toFixed(4).replace(/\.?0+$/,""),"mach→ms":n=>(parseFloat(n)*343).toFixed(2).replace(/\.?0+$/,""),"ms→mach":n=>(parseFloat(n)/343).toFixed(6).replace(/\.?0+$/,""),"mach→mph":n=>(parseFloat(n)*767.269).toFixed(2).replace(/\.?0+$/,""),"mph→mach":n=>(parseFloat(n)/767.269).toFixed(6).replace(/\.?0+$/,""),"mach→kmh":n=>(parseFloat(n)*1235.52).toFixed(2).replace(/\.?0+$/,""),"kmh→mach":n=>(parseFloat(n)/1235.52).toFixed(6).replace(/\.?0+$/,""),"mach→knots":n=>(parseFloat(n)*667.607).toFixed(2).replace(/\.?0+$/,""),"knots→mach":n=>(parseFloat(n)/667.607).toFixed(6).replace(/\.?0+$/,""),"mach→fps":n=>(parseFloat(n)*1125.33).toFixed(2).replace(/\.?0+$/,""),"fps→mach":n=>(parseFloat(n)/1125.33).toFixed(6).replace(/\.?0+$/,""),"sqft→sqm":n=>(parseFloat(n)*.092903).toFixed(4).replace(/\.?0+$/,""),"sqm→sqft":n=>(parseFloat(n)/.092903).toFixed(4).replace(/\.?0+$/,""),"sqft→acres":n=>(parseFloat(n)/43560).toFixed(6).replace(/\.?0+$/,""),"acres→sqft":n=>(parseFloat(n)*43560).toFixed(2).replace(/\.?0+$/,""),"sqft→hectares":n=>(parseFloat(n)/107639).toFixed(6).replace(/\.?0+$/,""),"hectares→sqft":n=>(parseFloat(n)*107639).toFixed(2).replace(/\.?0+$/,""),"sqm→acres":n=>(parseFloat(n)/4046.86).toFixed(6).replace(/\.?0+$/,""),"acres→sqm":n=>(parseFloat(n)*4046.86).toFixed(2).replace(/\.?0+$/,""),"sqm→hectares":n=>(parseFloat(n)/1e4).toFixed(6).replace(/\.?0+$/,""),"hectares→sqm":n=>(parseFloat(n)*1e4).toFixed(2).replace(/\.?0+$/,""),"acres→hectares":n=>(parseFloat(n)*.404686).toFixed(6).replace(/\.?0+$/,""),"hectares→acres":n=>(parseFloat(n)/.404686).toFixed(4).replace(/\.?0+$/,""),"liters→gallons":n=>(parseFloat(n)*.264172).toFixed(4).replace(/\.?0+$/,""),"gallons→liters":n=>(parseFloat(n)/.264172).toFixed(4).replace(/\.?0+$/,""),"liters→ml":n=>(parseFloat(n)*1e3).toFixed(2).replace(/\.?0+$/,""),"ml→liters":n=>(parseFloat(n)/1e3).toFixed(4).replace(/\.?0+$/,""),"liters→floz":n=>(parseFloat(n)*33.814).toFixed(4).replace(/\.?0+$/,""),"floz→liters":n=>(parseFloat(n)/33.814).toFixed(4).replace(/\.?0+$/,""),"liters→cups":n=>(parseFloat(n)*4.22675).toFixed(4).replace(/\.?0+$/,""),"cups→liters":n=>(parseFloat(n)/4.22675).toFixed(4).replace(/\.?0+$/,""),"gallons→ml":n=>(parseFloat(n)*3785.41).toFixed(2).replace(/\.?0+$/,""),"ml→gallons":n=>(parseFloat(n)/3785.41).toFixed(6).replace(/\.?0+$/,""),"gallons→floz":n=>(parseFloat(n)*128).toFixed(2).replace(/\.?0+$/,""),"floz→gallons":n=>(parseFloat(n)/128).toFixed(4).replace(/\.?0+$/,""),"gallons→cups":n=>(parseFloat(n)*16).toFixed(2).replace(/\.?0+$/,""),"cups→gallons":n=>(parseFloat(n)/16).toFixed(4).replace(/\.?0+$/,""),"ml→floz":n=>(parseFloat(n)*.033814).toFixed(4).replace(/\.?0+$/,""),"floz→ml":n=>(parseFloat(n)/.033814).toFixed(2).replace(/\.?0+$/,""),"ml→cups":n=>(parseFloat(n)*.00422675).toFixed(4).replace(/\.?0+$/,""),"cups→ml":n=>(parseFloat(n)/.00422675).toFixed(2).replace(/\.?0+$/,""),"floz→cups":n=>(parseFloat(n)/8).toFixed(4).replace(/\.?0+$/,""),"cups→floz":n=>(parseFloat(n)*8).toFixed(2).replace(/\.?0+$/,""),"dur-seconds→dur-minutes":n=>(parseFloat(n)/60).toFixed(4).replace(/\.?0+$/,""),"dur-minutes→dur-seconds":n=>(parseFloat(n)*60).toFixed(2).replace(/\.?0+$/,""),"dur-seconds→dur-hours":n=>(parseFloat(n)/3600).toFixed(6).replace(/\.?0+$/,""),"dur-hours→dur-seconds":n=>(parseFloat(n)*3600).toFixed(2).replace(/\.?0+$/,""),"dur-seconds→dur-days":n=>(parseFloat(n)/86400).toFixed(6).replace(/\.?0+$/,""),"dur-days→dur-seconds":n=>(parseFloat(n)*86400).toFixed(2).replace(/\.?0+$/,""),"dur-minutes→dur-hours":n=>(parseFloat(n)/60).toFixed(4).replace(/\.?0+$/,""),"dur-hours→dur-minutes":n=>(parseFloat(n)*60).toFixed(2).replace(/\.?0+$/,""),"dur-minutes→dur-days":n=>(parseFloat(n)/1440).toFixed(6).replace(/\.?0+$/,""),"dur-days→dur-minutes":n=>(parseFloat(n)*1440).toFixed(2).replace(/\.?0+$/,""),"dur-hours→dur-days":n=>(parseFloat(n)/24).toFixed(4).replace(/\.?0+$/,""),"dur-days→dur-hours":n=>(parseFloat(n)*24).toFixed(2).replace(/\.?0+$/,""),"dur-ms→dur-days":n=>(parseFloat(n)/864e5).toFixed(8).replace(/\.?0+$/,""),"dur-days→dur-ms":n=>(parseFloat(n)*864e5).toFixed(0),"dur-weeks→dur-seconds":n=>(parseFloat(n)*604800).toFixed(0),"dur-seconds→dur-weeks":n=>(parseFloat(n)/604800).toFixed(8).replace(/\.?0+$/,""),"dur-weeks→dur-ms":n=>(parseFloat(n)*6048e5).toFixed(0),"dur-ms→dur-weeks":n=>(parseFloat(n)/6048e5).toFixed(10).replace(/\.?0+$/,""),"joules→calories":n=>(parseFloat(n)*.239006).toFixed(4).replace(/\.?0+$/,""),"calories→joules":n=>(parseFloat(n)/.239006).toFixed(4).replace(/\.?0+$/,""),"joules→kcal":n=>(parseFloat(n)/4184).toFixed(6).replace(/\.?0+$/,""),"kcal→joules":n=>(parseFloat(n)*4184).toFixed(2).replace(/\.?0+$/,""),"joules→kwh":n=>(parseFloat(n)/36e5).toFixed(8).replace(/\.?0+$/,""),"kwh→joules":n=>(parseFloat(n)*36e5).toFixed(2).replace(/\.?0+$/,""),"joules→btu":n=>(parseFloat(n)*947817e-9).toFixed(6).replace(/\.?0+$/,""),"btu→joules":n=>(parseFloat(n)/947817e-9).toFixed(2).replace(/\.?0+$/,""),"calories→kcal":n=>(parseFloat(n)/1e3).toFixed(4).replace(/\.?0+$/,""),"kcal→calories":n=>(parseFloat(n)*1e3).toFixed(2).replace(/\.?0+$/,""),"calories→kwh":n=>(parseFloat(n)/860421).toFixed(8).replace(/\.?0+$/,""),"kwh→calories":n=>(parseFloat(n)*860421).toFixed(2).replace(/\.?0+$/,""),"calories→btu":n=>(parseFloat(n)*.003968).toFixed(6).replace(/\.?0+$/,""),"btu→calories":n=>(parseFloat(n)/.003968).toFixed(2).replace(/\.?0+$/,""),"kcal→kwh":n=>(parseFloat(n)/860.421).toFixed(6).replace(/\.?0+$/,""),"kwh→kcal":n=>(parseFloat(n)*860.421).toFixed(2).replace(/\.?0+$/,""),"kcal→btu":n=>(parseFloat(n)*3.96832).toFixed(4).replace(/\.?0+$/,""),"btu→kcal":n=>(parseFloat(n)/3.96832).toFixed(4).replace(/\.?0+$/,""),"kwh→btu":n=>(parseFloat(n)*3412.14).toFixed(2).replace(/\.?0+$/,""),"btu→kwh":n=>(parseFloat(n)/3412.14).toFixed(6).replace(/\.?0+$/,""),"megajoules→joules":n=>(parseFloat(n)*1e6).toFixed(0),"joules→megajoules":n=>(parseFloat(n)/1e6).toFixed(8).replace(/\.?0+$/,""),"megajoules→kwh":n=>(parseFloat(n)/3.6).toFixed(6).replace(/\.?0+$/,""),"kwh→megajoules":n=>(parseFloat(n)*3.6).toFixed(4).replace(/\.?0+$/,""),"megajoules→kcal":n=>(parseFloat(n)*239.006).toFixed(2).replace(/\.?0+$/,""),"kcal→megajoules":n=>(parseFloat(n)/239.006).toFixed(6).replace(/\.?0+$/,""),"megajoules→btu":n=>(parseFloat(n)*947.817).toFixed(2).replace(/\.?0+$/,""),"btu→megajoules":n=>(parseFloat(n)/947.817).toFixed(6).replace(/\.?0+$/,""),"psi→bar":n=>(parseFloat(n)*.0689476).toFixed(4).replace(/\.?0+$/,""),"bar→psi":n=>(parseFloat(n)/.0689476).toFixed(4).replace(/\.?0+$/,""),"psi→atm":n=>(parseFloat(n)*.068046).toFixed(4).replace(/\.?0+$/,""),"atm→psi":n=>(parseFloat(n)/.068046).toFixed(4).replace(/\.?0+$/,""),"psi→pascal":n=>(parseFloat(n)*6894.76).toFixed(2).replace(/\.?0+$/,""),"pascal→psi":n=>(parseFloat(n)/6894.76).toFixed(6).replace(/\.?0+$/,""),"psi→mmhg":n=>(parseFloat(n)*51.7149).toFixed(4).replace(/\.?0+$/,""),"mmhg→psi":n=>(parseFloat(n)/51.7149).toFixed(4).replace(/\.?0+$/,""),"bar→atm":n=>(parseFloat(n)*.986923).toFixed(4).replace(/\.?0+$/,""),"atm→bar":n=>(parseFloat(n)/.986923).toFixed(4).replace(/\.?0+$/,""),"bar→pascal":n=>(parseFloat(n)*1e5).toFixed(2).replace(/\.?0+$/,""),"pascal→bar":n=>(parseFloat(n)/1e5).toFixed(6).replace(/\.?0+$/,""),"bar→mmhg":n=>(parseFloat(n)*750.062).toFixed(4).replace(/\.?0+$/,""),"mmhg→bar":n=>(parseFloat(n)/750.062).toFixed(6).replace(/\.?0+$/,""),"atm→pascal":n=>(parseFloat(n)*101325).toFixed(2).replace(/\.?0+$/,""),"pascal→atm":n=>(parseFloat(n)/101325).toFixed(8).replace(/\.?0+$/,""),"atm→mmhg":n=>(parseFloat(n)*760).toFixed(4).replace(/\.?0+$/,""),"mmhg→atm":n=>(parseFloat(n)/760).toFixed(6).replace(/\.?0+$/,""),"pascal→mmhg":n=>(parseFloat(n)*.00750062).toFixed(4).replace(/\.?0+$/,""),"mmhg→pascal":n=>(parseFloat(n)/.00750062).toFixed(2).replace(/\.?0+$/,""),"degrees→radians":n=>(parseFloat(n)*Math.PI/180).toFixed(6).replace(/\.?0+$/,""),"radians→degrees":n=>(parseFloat(n)*180/Math.PI).toFixed(4).replace(/\.?0+$/,""),"degrees→gradians":n=>(parseFloat(n)*10/9).toFixed(4).replace(/\.?0+$/,""),"gradians→degrees":n=>(parseFloat(n)*9/10).toFixed(4).replace(/\.?0+$/,""),"radians→gradians":n=>(parseFloat(n)*200/Math.PI).toFixed(4).replace(/\.?0+$/,""),"gradians→radians":n=>(parseFloat(n)*Math.PI/200).toFixed(6).replace(/\.?0+$/,""),"turns→degrees":n=>(parseFloat(n)*360).toFixed(4).replace(/\.?0+$/,""),"degrees→turns":n=>(parseFloat(n)/360).toFixed(6).replace(/\.?0+$/,""),"turns→radians":n=>(parseFloat(n)*2*Math.PI).toFixed(6).replace(/\.?0+$/,""),"radians→turns":n=>(parseFloat(n)/(2*Math.PI)).toFixed(6).replace(/\.?0+$/,""),"turns→gradians":n=>(parseFloat(n)*400).toFixed(4).replace(/\.?0+$/,""),"gradians→turns":n=>(parseFloat(n)/400).toFixed(6).replace(/\.?0+$/,""),"gigabytes→terabytes":n=>(parseFloat(n)/1024).toFixed(6).replace(/\.?0+$/,""),"terabytes→gigabytes":n=>(parseFloat(n)*1024).toFixed(2).replace(/\.?0+$/,""),"terabytes→petabytes":n=>(parseFloat(n)/1024).toFixed(8).replace(/\.?0+$/,""),"petabytes→terabytes":n=>(parseFloat(n)*1024).toFixed(2).replace(/\.?0+$/,""),"megabytes→terabytes":n=>(parseFloat(n)/1048576).toFixed(8).replace(/\.?0+$/,""),"terabytes→megabytes":n=>(parseFloat(n)*1048576).toFixed(2).replace(/\.?0+$/,""),"kilobytes→terabytes":n=>(parseFloat(n)/1073741824).toFixed(10).replace(/\.?0+$/,""),"terabytes→kilobytes":n=>(parseFloat(n)*1073741824).toFixed(0),"bytes→terabytes":n=>(parseFloat(n)/1099511627776).toFixed(12).replace(/\.?0+$/,""),"terabytes→bytes":n=>(parseFloat(n)*1099511627776).toFixed(0),"megabytes→petabytes":n=>(parseFloat(n)/1073741824).toFixed(10).replace(/\.?0+$/,""),"petabytes→megabytes":n=>(parseFloat(n)*1073741824).toFixed(0),"gigabytes→petabytes":n=>(parseFloat(n)/1048576).toFixed(8).replace(/\.?0+$/,""),"petabytes→gigabytes":n=>(parseFloat(n)*1048576).toFixed(2).replace(/\.?0+$/,""),"bytes→petabytes":n=>(parseFloat(n)/0x4000000000000).toFixed(15).replace(/\.?0+$/,""),"petabytes→bytes":n=>(parseFloat(n)*0x4000000000000).toFixed(0),"kilobytes→petabytes":n=>(parseFloat(n)/1099511627776).toFixed(12).replace(/\.?0+$/,""),"petabytes→kilobytes":n=>(parseFloat(n)*1099511627776).toFixed(0),"hz→khz":n=>(parseFloat(n)/1e3).toFixed(4).replace(/\.?0+$/,""),"khz→hz":n=>(parseFloat(n)*1e3).toFixed(2).replace(/\.?0+$/,""),"hz→mhz":n=>(parseFloat(n)/1e6).toFixed(6).replace(/\.?0+$/,""),"mhz→hz":n=>(parseFloat(n)*1e6).toFixed(0),"hz→ghz":n=>(parseFloat(n)/1e9).toFixed(9).replace(/\.?0+$/,""),"ghz→hz":n=>(parseFloat(n)*1e9).toFixed(0),"khz→mhz":n=>(parseFloat(n)/1e3).toFixed(4).replace(/\.?0+$/,""),"mhz→khz":n=>(parseFloat(n)*1e3).toFixed(2).replace(/\.?0+$/,""),"khz→ghz":n=>(parseFloat(n)/1e6).toFixed(6).replace(/\.?0+$/,""),"ghz→khz":n=>(parseFloat(n)*1e6).toFixed(2).replace(/\.?0+$/,""),"mhz→ghz":n=>(parseFloat(n)/1e3).toFixed(4).replace(/\.?0+$/,""),"ghz→mhz":n=>(parseFloat(n)*1e3).toFixed(2).replace(/\.?0+$/,""),"watts→kilowatts":n=>(parseFloat(n)/1e3).toFixed(4).replace(/\.?0+$/,""),"kilowatts→watts":n=>(parseFloat(n)*1e3).toFixed(2).replace(/\.?0+$/,""),"watts→horsepower":n=>(parseFloat(n)/745.7).toFixed(4).replace(/\.?0+$/,""),"horsepower→watts":n=>(parseFloat(n)*745.7).toFixed(2).replace(/\.?0+$/,""),"watts→btuh":n=>(parseFloat(n)*3.41214).toFixed(4).replace(/\.?0+$/,""),"btuh→watts":n=>(parseFloat(n)/3.41214).toFixed(4).replace(/\.?0+$/,""),"kilowatts→horsepower":n=>(parseFloat(n)*1.34102).toFixed(4).replace(/\.?0+$/,""),"horsepower→kilowatts":n=>(parseFloat(n)/1.34102).toFixed(4).replace(/\.?0+$/,""),"kilowatts→btuh":n=>(parseFloat(n)*3412.14).toFixed(2).replace(/\.?0+$/,""),"btuh→kilowatts":n=>(parseFloat(n)/3412.14).toFixed(6).replace(/\.?0+$/,""),"horsepower→btuh":n=>(parseFloat(n)*2544.43).toFixed(2).replace(/\.?0+$/,""),"btuh→horsepower":n=>(parseFloat(n)/2544.43).toFixed(6).replace(/\.?0+$/,""),"mpg→kml":n=>(parseFloat(n)*.425144).toFixed(4).replace(/\.?0+$/,""),"kml→mpg":n=>(parseFloat(n)/.425144).toFixed(4).replace(/\.?0+$/,""),"mpg→l100km":n=>(235.215/parseFloat(n)).toFixed(4).replace(/\.?0+$/,""),"l100km→mpg":n=>(235.215/parseFloat(n)).toFixed(4).replace(/\.?0+$/,""),"kml→l100km":n=>(100/parseFloat(n)).toFixed(4).replace(/\.?0+$/,""),"l100km→kml":n=>(100/parseFloat(n)).toFixed(4).replace(/\.?0+$/,""),"bps→kbps":n=>(parseFloat(n)/1e3).toFixed(4).replace(/\.?0+$/,""),"kbps→bps":n=>(parseFloat(n)*1e3).toFixed(0),"bps→mbps":n=>(parseFloat(n)/1e6).toFixed(6).replace(/\.?0+$/,""),"mbps→bps":n=>(parseFloat(n)*1e6).toFixed(0),"bps→gbps":n=>(parseFloat(n)/1e9).toFixed(9).replace(/\.?0+$/,""),"gbps→bps":n=>(parseFloat(n)*1e9).toFixed(0),"kbps→mbps":n=>(parseFloat(n)/1e3).toFixed(4).replace(/\.?0+$/,""),"mbps→kbps":n=>(parseFloat(n)*1e3).toFixed(2).replace(/\.?0+$/,""),"kbps→gbps":n=>(parseFloat(n)/1e6).toFixed(6).replace(/\.?0+$/,""),"gbps→kbps":n=>(parseFloat(n)*1e6).toFixed(2).replace(/\.?0+$/,""),"mbps→gbps":n=>(parseFloat(n)/1e3).toFixed(4).replace(/\.?0+$/,""),"gbps→mbps":n=>(parseFloat(n)*1e3).toFixed(2).replace(/\.?0+$/,""),"gbps→tbps":n=>(parseFloat(n)/1e3).toFixed(6).replace(/\.?0+$/,""),"tbps→gbps":n=>(parseFloat(n)*1e3).toFixed(2).replace(/\.?0+$/,""),"mbps→tbps":n=>(parseFloat(n)/1e6).toFixed(8).replace(/\.?0+$/,""),"tbps→mbps":n=>(parseFloat(n)*1e6).toFixed(2).replace(/\.?0+$/,""),"kbps→tbps":n=>(parseFloat(n)/1e9).toFixed(12).replace(/\.?0+$/,""),"tbps→kbps":n=>(parseFloat(n)*1e9).toFixed(0),"bps→tbps":n=>(parseFloat(n)/1e12).toFixed(14).replace(/\.?0+$/,""),"tbps→bps":n=>(parseFloat(n)*1e12).toFixed(0),"tsp→tbsp":n=>(parseFloat(n)/3).toFixed(4).replace(/\.?0+$/,""),"tbsp→tsp":n=>(parseFloat(n)*3).toFixed(2).replace(/\.?0+$/,""),"tsp→cup-cook":n=>(parseFloat(n)/48).toFixed(4).replace(/\.?0+$/,""),"cup-cook→tsp":n=>(parseFloat(n)*48).toFixed(2).replace(/\.?0+$/,""),"tsp→ml":n=>(parseFloat(n)*4.92892).toFixed(4).replace(/\.?0+$/,""),"ml→tsp":n=>(parseFloat(n)/4.92892).toFixed(4).replace(/\.?0+$/,""),"tbsp→cup-cook":n=>(parseFloat(n)/16).toFixed(4).replace(/\.?0+$/,""),"cup-cook→tbsp":n=>(parseFloat(n)*16).toFixed(2).replace(/\.?0+$/,""),"tbsp→ml":n=>(parseFloat(n)*14.7868).toFixed(4).replace(/\.?0+$/,""),"ml→tbsp":n=>(parseFloat(n)/14.7868).toFixed(4).replace(/\.?0+$/,""),"cup-cook→ml":n=>(parseFloat(n)*236.588).toFixed(2).replace(/\.?0+$/,""),"ml→cup-cook":n=>(parseFloat(n)/236.588).toFixed(4).replace(/\.?0+$/,""),"toml→querystring":n=>{const s=vr(n),l=new URLSearchParams;for(const[c,p]of Object.entries(s))typeof p!="object"&&l.set(c,String(p));return l.toString()},"json-min→xml":n=>{const s=JSON.parse(n);function l(p,d){if(p==null)return`<${d}/>`;if(Array.isArray(p))return p.map(f=>l(f,d)).join(`
`);if(typeof p=="object"){const f=Object.entries(p).map(([m,y])=>l(y,m)).join(`
  `);return`<${d}>
  ${f}
</${d}>`}return`<${d}>${String(p).replace(/&/g,"&amp;").replace(/</g,"&lt;")}</${d}>`}const c=Object.keys(s);return c.length===1?`<?xml version="1.0"?>
`+l(s[c[0]],c[0]):`<?xml version="1.0"?>
`+l(s,"root")},"xml→json-min":n=>{const l=new DOMParser().parseFromString(n,"text/xml");if(l.querySelector("parsererror"))throw new Error("invalid XML");function c(p){const d={};if(p.attributes)for(const f of p.attributes)d["@"+f.name]=f.value;for(const f of p.childNodes)if(f.nodeType===3){const m=f.textContent.trim();if(m){if(!Object.keys(d).length)return m;d["#text"]=m}}else if(f.nodeType===1){const m=c(f);d[f.nodeName]?(Array.isArray(d[f.nodeName])||(d[f.nodeName]=[d[f.nodeName]]),d[f.nodeName].push(m)):d[f.nodeName]=m}return d}return JSON.stringify({[l.documentElement.nodeName]:c(l.documentElement)})},"csv→xml":n=>{const s=n.trim().split(`
`),l=d=>{const f=[];let m="",y=!1;for(let b=0;b<d.length;b++){const z=d[b];y?z==='"'&&d[b+1]==='"'?(m+='"',b++):z==='"'?y=!1:m+=z:z==='"'?y=!0:z===","?(f.push(m),m=""):m+=z}return f.push(m),f},c=l(s[0]);return`<?xml version="1.0"?>
<data>
`+s.slice(1).map(d=>{const f=l(d);return`  <row>
`+c.map((m,y)=>`    <${m}>${(f[y]||"").replace(/&/g,"&amp;").replace(/</g,"&lt;")}</${m}>`).join(`
`)+`
  </row>`}).join(`
`)+`
</data>`},"xml→csv":n=>{const l=new DOMParser().parseFromString(n,"text/xml");if(l.querySelector("parsererror"))throw new Error("invalid XML");const c=l.documentElement.children;if(!c.length)throw new Error("no data");const p=[...c[0].children].map(m=>m.nodeName),d=m=>{const y=String(m??"");return/[,"\n]/.test(y)?`"${y.replace(/"/g,'""')}"`:y},f=[...c].map(m=>p.map(y=>d(m.querySelector(y)?.textContent||"")).join(","));return[p.join(","),...f].join(`
`)},"html-markup→markdown":n=>{let s=n;return s=s.replace(/<h1[^>]*>(.*?)<\/h1>/gi,"# $1"),s=s.replace(/<h2[^>]*>(.*?)<\/h2>/gi,"## $1"),s=s.replace(/<h3[^>]*>(.*?)<\/h3>/gi,"### $1"),s=s.replace(/<h4[^>]*>(.*?)<\/h4>/gi,"#### $1"),s=s.replace(/<strong[^>]*>(.*?)<\/strong>/gi,"**$1**"),s=s.replace(/<b[^>]*>(.*?)<\/b>/gi,"**$1**"),s=s.replace(/<em[^>]*>(.*?)<\/em>/gi,"*$1*"),s=s.replace(/<i[^>]*>(.*?)<\/i>/gi,"*$1*"),s=s.replace(/<code[^>]*>(.*?)<\/code>/gi,"`$1`"),s=s.replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi,"[$2]($1)"),s=s.replace(/<br\s*\/?>/gi,`
`),s=s.replace(/<p[^>]*>(.*?)<\/p>/gi,`$1
`),s=s.replace(/<li[^>]*>(.*?)<\/li>/gi,"- $1"),s=s.replace(/<\/?[^>]+>/g,""),s=s.replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&quot;/g,'"'),s.trim()},"plain→html-markup":n=>n.split(/\n\n+/).map(s=>`<p>${s.replace(/\n/g,"<br>")}</p>`).join(`
`),"color-hex→color-rgb":n=>{const s=Wi(n.trim());if(!s)throw new Error("bad hex");return`rgb(${s.r}, ${s.g}, ${s.b})`},"color-hex→color-hsl":n=>{const s=Wi(n.trim());if(!s)throw new Error("bad hex");const l=Sr(s);return`hsl(${l.h}, ${l.s}%, ${l.l}%)`},"color-rgb→color-hex":n=>{const s=qi(n);if(!s)throw new Error("bad rgb");return"#"+[s.r,s.g,s.b].map(l=>l.toString(16).padStart(2,"0")).join("")},"color-rgb→color-hsl":n=>{const s=qi(n);if(!s)throw new Error("bad rgb");const l=Sr(s);return`hsl(${l.h}, ${l.s}%, ${l.l}%)`},"color-hsl→color-hex":n=>{const s=Vi(n);if(!s)throw new Error("bad hsl");const l=_i(s);return"#"+[l.r,l.g,l.b].map(c=>c.toString(16).padStart(2,"0")).join("")},"color-hsl→color-rgb":n=>{const s=Vi(n);if(!s)throw new Error("bad hsl");const l=_i(s);return`rgb(${l.r}, ${l.g}, ${l.b})`},"color-hex→color-hsv":n=>{const s=Wi(n.trim());if(!s)throw new Error("bad hex");const l=Ar(s);return`hsv(${l.h}, ${l.s}%, ${l.v}%)`},"color-rgb→color-hsv":n=>{const s=qi(n);if(!s)throw new Error("bad rgb");const l=Ar(s);return`hsv(${l.h}, ${l.s}%, ${l.v}%)`},"color-hsl→color-hsv":n=>{const s=Vi(n);if(!s)throw new Error("bad hsl");const l=_i(s),c=Ar(l);return`hsv(${c.h}, ${c.s}%, ${c.v}%)`},"color-hsv→color-hex":n=>{const s=Zi(n);if(!s)throw new Error("bad hsv");const l=Ki(s);return"#"+[l.r,l.g,l.b].map(c=>c.toString(16).padStart(2,"0")).join("")},"color-hsv→color-rgb":n=>{const s=Zi(n);if(!s)throw new Error("bad hsv");const l=Ki(s);return`rgb(${l.r}, ${l.g}, ${l.b})`},"color-hsv→color-hsl":n=>{const s=Zi(n);if(!s)throw new Error("bad hsv");const l=Ki(s),c=Sr(l);return`hsl(${c.h}, ${c.s}%, ${c.l}%)`},"color-hex→color-cmyk":n=>{const s=Wi(n.trim());if(!s)throw new Error("bad hex");const l=s.r/255,c=s.g/255,p=s.b/255,d=1-Math.max(l,c,p);if(d===1)return"cmyk(0%, 0%, 0%, 100%)";const f=(1-l-d)/(1-d),m=(1-c-d)/(1-d),y=(1-p-d)/(1-d);return`cmyk(${Math.round(f*100)}%, ${Math.round(m*100)}%, ${Math.round(y*100)}%, ${Math.round(d*100)}%)`},"color-cmyk→color-hex":n=>{const s=n.match(/cmyk\(\s*([\d.]+)%?\s*,\s*([\d.]+)%?\s*,\s*([\d.]+)%?\s*,\s*([\d.]+)%?\s*\)/i);if(!s)throw new Error("bad cmyk");const[l,c,p,d]=[s[1],s[2],s[3],s[4]].map(b=>parseFloat(b)/100),f=Math.round(255*(1-l)*(1-d)),m=Math.round(255*(1-c)*(1-d)),y=Math.round(255*(1-p)*(1-d));return"#"+[f,m,y].map(b=>Math.max(0,Math.min(255,b)).toString(16).padStart(2,"0")).join("")},"color-rgb→color-cmyk":n=>{const s=qi(n);if(!s)throw new Error("bad rgb");const l=s.r/255,c=s.g/255,p=s.b/255,d=1-Math.max(l,c,p);if(d===1)return"cmyk(0%, 0%, 0%, 100%)";const f=(1-l-d)/(1-d),m=(1-c-d)/(1-d),y=(1-p-d)/(1-d);return`cmyk(${Math.round(f*100)}%, ${Math.round(m*100)}%, ${Math.round(y*100)}%, ${Math.round(d*100)}%)`},"color-cmyk→color-rgb":n=>{const s=n.match(/cmyk\(\s*([\d.]+)%?\s*,\s*([\d.]+)%?\s*,\s*([\d.]+)%?\s*,\s*([\d.]+)%?\s*\)/i);if(!s)throw new Error("bad cmyk");const[l,c,p,d]=[s[1],s[2],s[3],s[4]].map(b=>parseFloat(b)/100),f=Math.round(255*(1-l)*(1-d)),m=Math.round(255*(1-c)*(1-d)),y=Math.round(255*(1-p)*(1-d));return`rgb(${Math.max(0,Math.min(255,f))}, ${Math.max(0,Math.min(255,m))}, ${Math.max(0,Math.min(255,y))})`},"color-cmyk→color-hsl":n=>{const s=n.match(/cmyk\(\s*([\d.]+)%?\s*,\s*([\d.]+)%?\s*,\s*([\d.]+)%?\s*,\s*([\d.]+)%?\s*\)/i);if(!s)throw new Error("bad cmyk");const[l,c,p,d]=[s[1],s[2],s[3],s[4]].map(y=>parseFloat(y)/100),f={r:Math.round(255*(1-l)*(1-d)),g:Math.round(255*(1-c)*(1-d)),b:Math.round(255*(1-p)*(1-d))},m=Sr(f);return`hsl(${m.h}, ${m.s}%, ${m.l}%)`},"color-hsl→color-cmyk":n=>{const s=Vi(n);if(!s)throw new Error("bad hsl");const l=_i(s),c=l.r/255,p=l.g/255,d=l.b/255,f=1-Math.max(c,p,d);if(f===1)return"cmyk(0%, 0%, 0%, 100%)";const m=(1-c-f)/(1-f),y=(1-p-f)/(1-f),b=(1-d-f)/(1-f);return`cmyk(${Math.round(m*100)}%, ${Math.round(y*100)}%, ${Math.round(b*100)}%, ${Math.round(f*100)}%)`},"tsp→floz-cook":n=>(parseFloat(n)/6).toFixed(4).replace(/\.?0+$/,""),"floz-cook→tsp":n=>(parseFloat(n)*6).toFixed(2).replace(/\.?0+$/,""),"tbsp→floz-cook":n=>(parseFloat(n)/2).toFixed(4).replace(/\.?0+$/,""),"floz-cook→tbsp":n=>(parseFloat(n)*2).toFixed(2).replace(/\.?0+$/,""),"cup-cook→floz-cook":n=>(parseFloat(n)*8).toFixed(2).replace(/\.?0+$/,""),"floz-cook→cup-cook":n=>(parseFloat(n)/8).toFixed(4).replace(/\.?0+$/,""),"floz-cook→ml":n=>(parseFloat(n)*29.5735).toFixed(2).replace(/\.?0+$/,""),"ml→floz-cook":n=>(parseFloat(n)/29.5735).toFixed(4).replace(/\.?0+$/,""),"pint-cook→cup-cook":n=>(parseFloat(n)*2).toFixed(2).replace(/\.?0+$/,""),"cup-cook→pint-cook":n=>(parseFloat(n)/2).toFixed(4).replace(/\.?0+$/,""),"pint-cook→floz-cook":n=>(parseFloat(n)*16).toFixed(2).replace(/\.?0+$/,""),"floz-cook→pint-cook":n=>(parseFloat(n)/16).toFixed(4).replace(/\.?0+$/,""),"pint-cook→ml":n=>(parseFloat(n)*473.176).toFixed(2).replace(/\.?0+$/,""),"ml→pint-cook":n=>(parseFloat(n)/473.176).toFixed(4).replace(/\.?0+$/,""),"qt-cook→pint-cook":n=>(parseFloat(n)*2).toFixed(2).replace(/\.?0+$/,""),"pint-cook→qt-cook":n=>(parseFloat(n)/2).toFixed(4).replace(/\.?0+$/,""),"qt-cook→cup-cook":n=>(parseFloat(n)*4).toFixed(2).replace(/\.?0+$/,""),"cup-cook→qt-cook":n=>(parseFloat(n)/4).toFixed(4).replace(/\.?0+$/,""),"qt-cook→ml":n=>(parseFloat(n)*946.353).toFixed(2).replace(/\.?0+$/,""),"ml→qt-cook":n=>(parseFloat(n)/946.353).toFixed(4).replace(/\.?0+$/,""),"qt-cook→floz-cook":n=>(parseFloat(n)*32).toFixed(2).replace(/\.?0+$/,""),"floz-cook→qt-cook":n=>(parseFloat(n)/32).toFixed(4).replace(/\.?0+$/,""),"kib→megabytes":n=>(parseFloat(n)/976.5625).toFixed(6).replace(/\.?0+$/,""),"megabytes→kib":n=>(parseFloat(n)*976.5625).toFixed(2).replace(/\.?0+$/,""),"meters→micrometers":n=>(parseFloat(n)*1e6).toExponential(4).replace(/\.?0+e/,"e"),"micrometers→meters":n=>(parseFloat(n)*1e-6).toExponential(4).replace(/\.?0+e/,"e"),"mm→micrometers":n=>(parseFloat(n)*1e3).toFixed(2).replace(/\.?0+$/,""),"micrometers→mm":n=>(parseFloat(n)/1e3).toFixed(6).replace(/\.?0+$/,""),"cm→micrometers":n=>(parseFloat(n)*1e4).toFixed(2).replace(/\.?0+$/,""),"micrometers→cm":n=>(parseFloat(n)/1e4).toFixed(6).replace(/\.?0+$/,""),"inches→micrometers":n=>(parseFloat(n)*25400).toFixed(2).replace(/\.?0+$/,""),"micrometers→inches":n=>(parseFloat(n)/25400).toFixed(6).replace(/\.?0+$/,""),"micrometers→nanometers":n=>(parseFloat(n)*1e3).toFixed(2).replace(/\.?0+$/,""),"nanometers→micrometers":n=>(parseFloat(n)/1e3).toFixed(6).replace(/\.?0+$/,""),"mm→nanometers":n=>(parseFloat(n)*1e6).toFixed(0),"nanometers→mm":n=>(parseFloat(n)*1e-6).toFixed(8).replace(/\.?0+$/,""),"nanometers→meters":n=>(parseFloat(n)*1e-9).toExponential(4),"meters→nanometers":n=>(parseFloat(n)*1e9).toExponential(4),"nanometers→cm":n=>(parseFloat(n)*1e-7).toExponential(4),"cm→nanometers":n=>(parseFloat(n)*1e7).toExponential(4),"nanometers→inches":n=>(parseFloat(n)/254e5).toExponential(4),"inches→nanometers":n=>(parseFloat(n)*254e5).toExponential(4),"light-year→km":n=>(parseFloat(n)*9461e9).toExponential(4),"km→light-year":n=>(parseFloat(n)/9461e9).toExponential(4),"light-year→miles":n=>(parseFloat(n)*5879e9).toExponential(4),"miles→light-year":n=>(parseFloat(n)/5879e9).toExponential(4),"light-year→au":n=>(parseFloat(n)*63241.1).toFixed(1),"au→light-year":n=>(parseFloat(n)/63241.1).toExponential(6),"au→km":n=>(parseFloat(n)*1496e5).toExponential(4),"km→au":n=>(parseFloat(n)/1496e5).toExponential(6),"au→miles":n=>(parseFloat(n)*9296e4).toExponential(4),"miles→au":n=>(parseFloat(n)/9296e4).toExponential(6),"light-year→meters":n=>(parseFloat(n)*9461e12).toExponential(4),"meters→light-year":n=>(parseFloat(n)/9461e12).toExponential(6),"au→meters":n=>(parseFloat(n)*1496e8).toExponential(4),"meters→au":n=>(parseFloat(n)/1496e8).toExponential(6),"au→yards":n=>(parseFloat(n)*1636e8).toExponential(4),"yards→au":n=>(parseFloat(n)/1636e8).toExponential(6),"oz→carats":n=>(parseFloat(n)*141.748).toFixed(3).replace(/\.?0+$/,""),"carats→oz":n=>(parseFloat(n)/141.748).toFixed(6).replace(/\.?0+$/,""),"milligrams→carats":n=>(parseFloat(n)/200).toFixed(6).replace(/\.?0+$/,""),"carats→milligrams":n=>(parseFloat(n)*200).toFixed(2).replace(/\.?0+$/,""),"micrograms→oz":n=>(parseFloat(n)/283495231e-1).toExponential(4),"oz→micrograms":n=>(parseFloat(n)*283495231e-1).toExponential(4),"micrograms→kg":n=>(parseFloat(n)*1e-9).toExponential(4),"kg→micrograms":n=>(parseFloat(n)*1e9).toExponential(4),"gallon-us→cup-cook":n=>(parseFloat(n)*16).toFixed(2).replace(/\.?0+$/,""),"cup-cook→gallon-us":n=>(parseFloat(n)/16).toFixed(4).replace(/\.?0+$/,""),"gallon-us→floz-cook":n=>(parseFloat(n)*128).toFixed(2).replace(/\.?0+$/,""),"floz-cook→gallon-us":n=>(parseFloat(n)/128).toFixed(6).replace(/\.?0+$/,""),"gallon-us→ml":n=>(parseFloat(n)*3785.41).toFixed(2).replace(/\.?0+$/,""),"ml→gallon-us":n=>(parseFloat(n)/3785.41).toFixed(6).replace(/\.?0+$/,""),"gallon-us→pint-cook":n=>(parseFloat(n)*8).toFixed(2).replace(/\.?0+$/,""),"pint-cook→gallon-us":n=>(parseFloat(n)/8).toFixed(4).replace(/\.?0+$/,""),"gallon-us→qt-cook":n=>(parseFloat(n)*4).toFixed(2).replace(/\.?0+$/,""),"qt-cook→gallon-us":n=>(parseFloat(n)/4).toFixed(4).replace(/\.?0+$/,""),"gallon-us→liters":n=>(parseFloat(n)*3.78541).toFixed(4).replace(/\.?0+$/,""),"liters→gallon-us":n=>(parseFloat(n)/3.78541).toFixed(4).replace(/\.?0+$/,""),"watts→btu-per-hr":n=>(parseFloat(n)*3.41214).toFixed(4).replace(/\.?0+$/,""),"btu-per-hr→watts":n=>(parseFloat(n)/3.41214).toFixed(4).replace(/\.?0+$/,""),"horsepower→btu-per-hr":n=>(parseFloat(n)*2544.43).toFixed(2).replace(/\.?0+$/,""),"btu-per-hr→horsepower":n=>(parseFloat(n)/2544.43).toFixed(6).replace(/\.?0+$/,""),"kilowatts→btu-per-hr":n=>(parseFloat(n)*3412.14).toFixed(2).replace(/\.?0+$/,""),"btu-per-hr→kilowatts":n=>(parseFloat(n)/3412.14).toFixed(6).replace(/\.?0+$/,""),"watts→calories-per-sec":n=>(parseFloat(n)/4.184).toFixed(4).replace(/\.?0+$/,""),"calories-per-sec→watts":n=>(parseFloat(n)*4.184).toFixed(4).replace(/\.?0+$/,""),"horsepower→calories-per-sec":n=>(parseFloat(n)*745.7/4.184).toFixed(4).replace(/\.?0+$/,""),"calories-per-sec→horsepower":n=>(parseFloat(n)*4.184/745.7).toFixed(6).replace(/\.?0+$/,""),"hz→rpm":n=>(parseFloat(n)*60).toFixed(4).replace(/\.?0+$/,""),"rpm→hz":n=>(parseFloat(n)/60).toFixed(6).replace(/\.?0+$/,""),"hz→radians-per-sec":n=>(parseFloat(n)*2*Math.PI).toFixed(4).replace(/\.?0+$/,""),"radians-per-sec→hz":n=>(parseFloat(n)/(2*Math.PI)).toFixed(6).replace(/\.?0+$/,""),"rpm→radians-per-sec":n=>(parseFloat(n)*Math.PI/30).toFixed(4).replace(/\.?0+$/,""),"radians-per-sec→rpm":n=>(parseFloat(n)*30/Math.PI).toFixed(4).replace(/\.?0+$/,""),"troy-oz→kg":n=>(parseFloat(n)*.0311035).toFixed(6).replace(/\.?0+$/,""),"kg→troy-oz":n=>(parseFloat(n)/.0311035).toFixed(4).replace(/\.?0+$/,""),"troy-oz→milligrams":n=>(parseFloat(n)*31103.5).toFixed(2).replace(/\.?0+$/,""),"milligrams→troy-oz":n=>(parseFloat(n)/31103.5).toFixed(8).replace(/\.?0+$/,""),"troy-oz→carats":n=>(parseFloat(n)*155.517).toFixed(3).replace(/\.?0+$/,""),"carats→troy-oz":n=>(parseFloat(n)/155.517).toFixed(6).replace(/\.?0+$/,""),"troy-oz→lb":n=>(parseFloat(n)*.0685714).toFixed(6).replace(/\.?0+$/,""),"lb→troy-oz":n=>(parseFloat(n)/.0685714).toFixed(4).replace(/\.?0+$/,""),"calories-per-sec→kilowatts":n=>(parseFloat(n)*4.184/1e3).toFixed(6).replace(/\.?0+$/,""),"kilowatts→calories-per-sec":n=>(parseFloat(n)*1e3/4.184).toFixed(4).replace(/\.?0+$/,""),"rpm→khz":n=>(parseFloat(n)/6e4).toExponential(4),"khz→rpm":n=>(parseFloat(n)*6e4).toFixed(2).replace(/\.?0+$/,""),"radians-per-sec→khz":n=>(parseFloat(n)/(2*Math.PI*1e3)).toExponential(4),"khz→radians-per-sec":n=>(parseFloat(n)*2*Math.PI*1e3).toFixed(4).replace(/\.?0+$/,""),"sqm→sqkm":n=>(parseFloat(n)/1e6).toFixed(8).replace(/\.?0+$/,""),"sqkm→sqm":n=>(parseFloat(n)*1e6).toFixed(0),"sqft→sqkm":n=>(parseFloat(n)/107639104e-1).toFixed(10).replace(/\.?0+$/,""),"sqkm→sqft":n=>(parseFloat(n)*107639104e-1).toFixed(2).replace(/\.?0+$/,""),"sqkm→acres":n=>(parseFloat(n)*247.105).toFixed(4).replace(/\.?0+$/,""),"acres→sqkm":n=>(parseFloat(n)/247.105).toFixed(6).replace(/\.?0+$/,""),"sqkm→hectares":n=>(parseFloat(n)*100).toFixed(4).replace(/\.?0+$/,""),"hectares→sqkm":n=>(parseFloat(n)/100).toFixed(6).replace(/\.?0+$/,""),"sqmiles→sqkm":n=>(parseFloat(n)*2.58999).toFixed(4).replace(/\.?0+$/,""),"sqkm→sqmiles":n=>(parseFloat(n)/2.58999).toFixed(4).replace(/\.?0+$/,""),"sqmiles→sqft":n=>(parseFloat(n)*27878400).toFixed(0),"sqft→sqmiles":n=>(parseFloat(n)/27878400).toFixed(8).replace(/\.?0+$/,""),"sqmiles→acres":n=>(parseFloat(n)*640).toFixed(2).replace(/\.?0+$/,""),"acres→sqmiles":n=>(parseFloat(n)/640).toFixed(6).replace(/\.?0+$/,""),"sqmiles→sqm":n=>(parseFloat(n)*25899881e-1).toFixed(2).replace(/\.?0+$/,""),"sqm→sqmiles":n=>(parseFloat(n)/25899881e-1).toFixed(8).replace(/\.?0+$/,""),"sqinches→sqft":n=>(parseFloat(n)/144).toFixed(4).replace(/\.?0+$/,""),"sqft→sqinches":n=>(parseFloat(n)*144).toFixed(2).replace(/\.?0+$/,""),"sqinches→sqcm":n=>(parseFloat(n)*6.4516).toFixed(4).replace(/\.?0+$/,""),"sqcm→sqinches":n=>(parseFloat(n)/6.4516).toFixed(4).replace(/\.?0+$/,""),"sqcm→sqm":n=>(parseFloat(n)/1e4).toFixed(6).replace(/\.?0+$/,""),"sqm→sqcm":n=>(parseFloat(n)*1e4).toFixed(2).replace(/\.?0+$/,""),"sqinches→sqm":n=>(parseFloat(n)/1550).toFixed(6).replace(/\.?0+$/,""),"sqm→sqinches":n=>(parseFloat(n)*1550).toFixed(2).replace(/\.?0+$/,""),"pascal→kpa":n=>(parseFloat(n)/1e3).toFixed(6).replace(/\.?0+$/,""),"kpa→pascal":n=>(parseFloat(n)*1e3).toFixed(2).replace(/\.?0+$/,""),"bar→kpa":n=>(parseFloat(n)*100).toFixed(2).replace(/\.?0+$/,""),"kpa→bar":n=>(parseFloat(n)/100).toFixed(4).replace(/\.?0+$/,""),"atm→kpa":n=>(parseFloat(n)*101.325).toFixed(4).replace(/\.?0+$/,""),"kpa→atm":n=>(parseFloat(n)/101.325).toFixed(6).replace(/\.?0+$/,""),"psi→kpa":n=>(parseFloat(n)*6.89476).toFixed(4).replace(/\.?0+$/,""),"kpa→psi":n=>(parseFloat(n)/6.89476).toFixed(4).replace(/\.?0+$/,""),"mmhg→kpa":n=>(parseFloat(n)*.133322).toFixed(6).replace(/\.?0+$/,""),"kpa→mmhg":n=>(parseFloat(n)/.133322).toFixed(4).replace(/\.?0+$/,""),"kpa→hpa":n=>(parseFloat(n)*10).toFixed(2).replace(/\.?0+$/,""),"hpa→kpa":n=>(parseFloat(n)/10).toFixed(4).replace(/\.?0+$/,""),"pascal→hpa":n=>(parseFloat(n)/100).toFixed(4).replace(/\.?0+$/,""),"hpa→pascal":n=>(parseFloat(n)*100).toFixed(2).replace(/\.?0+$/,""),"bar→hpa":n=>(parseFloat(n)*1e3).toFixed(2).replace(/\.?0+$/,""),"hpa→bar":n=>(parseFloat(n)/1e3).toFixed(6).replace(/\.?0+$/,""),"atm→hpa":n=>(parseFloat(n)*1013.25).toFixed(2).replace(/\.?0+$/,""),"hpa→atm":n=>(parseFloat(n)/1013.25).toFixed(6).replace(/\.?0+$/,""),"psi→hpa":n=>(parseFloat(n)*68.9476).toFixed(4).replace(/\.?0+$/,""),"hpa→psi":n=>(parseFloat(n)/68.9476).toFixed(4).replace(/\.?0+$/,""),"mmhg→hpa":n=>(parseFloat(n)*1.33322).toFixed(4).replace(/\.?0+$/,""),"hpa→mmhg":n=>(parseFloat(n)/1.33322).toFixed(4).replace(/\.?0+$/,""),"degrees→arcminutes":n=>(parseFloat(n)*60).toFixed(4).replace(/\.?0+$/,""),"arcminutes→degrees":n=>(parseFloat(n)/60).toFixed(6).replace(/\.?0+$/,""),"degrees→arcseconds":n=>(parseFloat(n)*3600).toFixed(4).replace(/\.?0+$/,""),"arcseconds→degrees":n=>(parseFloat(n)/3600).toFixed(6).replace(/\.?0+$/,""),"arcminutes→arcseconds":n=>(parseFloat(n)*60).toFixed(4).replace(/\.?0+$/,""),"arcseconds→arcminutes":n=>(parseFloat(n)/60).toFixed(6).replace(/\.?0+$/,""),"radians→arcminutes":n=>(parseFloat(n)*180/Math.PI*60).toFixed(4).replace(/\.?0+$/,""),"arcminutes→radians":n=>(parseFloat(n)/60*Math.PI/180).toFixed(8).replace(/\.?0+$/,""),"turns→arcminutes":n=>(parseFloat(n)*21600).toFixed(4).replace(/\.?0+$/,""),"arcminutes→turns":n=>(parseFloat(n)/21600).toFixed(8).replace(/\.?0+$/,""),"ml→cubic-m":n=>(parseFloat(n)*1e-6).toExponential(4),"cubic-m→ml":n=>(parseFloat(n)*1e6).toFixed(0),"arcseconds→radians":n=>(parseFloat(n)/3600*Math.PI/180).toFixed(10).replace(/\.?0+$/,""),"radians→arcseconds":n=>(parseFloat(n)*180/Math.PI*3600).toFixed(4).replace(/\.?0+$/,""),"arcseconds→turns":n=>(parseFloat(n)/1296e3).toFixed(10).replace(/\.?0+$/,""),"turns→arcseconds":n=>(parseFloat(n)*1296e3).toFixed(2).replace(/\.?0+$/,""),"arcseconds→gradians":n=>(parseFloat(n)/3240).toFixed(6).replace(/\.?0+$/,""),"gradians→arcseconds":n=>(parseFloat(n)*3240).toFixed(2).replace(/\.?0+$/,""),"sqcm→sqft":n=>(parseFloat(n)/929.03).toFixed(6).replace(/\.?0+$/,""),"sqft→sqcm":n=>(parseFloat(n)*929.03).toFixed(4).replace(/\.?0+$/,""),"sqcm→sqkm":n=>(parseFloat(n)*1e-10).toExponential(4),"sqkm→sqcm":n=>(parseFloat(n)*1e10).toExponential(4),"sqcm→hectares":n=>(parseFloat(n)*1e-8).toExponential(4),"hectares→sqcm":n=>(parseFloat(n)*1e8).toFixed(0),"sqcm→acres":n=>(parseFloat(n)*247105e-13).toExponential(4),"acres→sqcm":n=>(parseFloat(n)/247105e-13).toExponential(4),"stone→grams":n=>(parseFloat(n)*6350.29).toFixed(2).replace(/\.?0+$/,""),"grams→stone":n=>(parseFloat(n)/6350.29).toFixed(6).replace(/\.?0+$/,""),"stone→oz":n=>(parseFloat(n)*224).toFixed(2).replace(/\.?0+$/,""),"oz→stone":n=>(parseFloat(n)/224).toFixed(6).replace(/\.?0+$/,""),"stone→ton-metric":n=>(parseFloat(n)*.00635029).toFixed(6).replace(/\.?0+$/,""),"ton-metric→stone":n=>(parseFloat(n)/.00635029).toFixed(4).replace(/\.?0+$/,""),"camelcase→snakecase":n=>n.replace(/([A-Z])/g,"_$1").toLowerCase().replace(/^_/,""),"snakecase→camelcase":n=>n.replace(/_([a-z])/g,(s,l)=>l.toUpperCase()),"camelcase→kebabcase":n=>n.replace(/([A-Z])/g,"-$1").toLowerCase().replace(/^-/,""),"kebabcase→camelcase":n=>n.replace(/-([a-z])/g,(s,l)=>l.toUpperCase()),"snakecase→kebabcase":n=>n.replace(/_/g,"-"),"kebabcase→snakecase":n=>n.replace(/-/g,"_"),"titlecase→camelcase":n=>n.replace(/\s+(\w)/g,(s,l)=>l.toUpperCase()).replace(/^\w/,s=>s.toLowerCase()),"titlecase→snakecase":n=>n.toLowerCase().replace(/\s+/g,"_"),"titlecase→kebabcase":n=>n.toLowerCase().replace(/\s+/g,"-"),"plain→lowercase":n=>n.toLowerCase(),"plain→uppercase":n=>n.toUpperCase(),"plain→titlecase":n=>n.replace(/\b\w/g,s=>s.toUpperCase()),"roman→binary":n=>{const s=n.trim().toUpperCase(),l={M:1e3,CM:900,D:500,CD:400,C:100,XC:90,L:50,XL:40,X:10,IX:9,V:5,IV:4,I:1};let c=0,p=0;for(const[d,f]of Object.entries(l))for(;s.startsWith(d,p);)c+=f,p+=d.length;return c===0?"(invalid roman numeral)":c.toString(2)},"binary→roman":n=>{const s=parseInt(n.trim(),2);if(isNaN(s)||s<=0||s>3999)return"(out of range for roman numerals: 1-3999)";const l=[[1e3,"M"],[900,"CM"],[500,"D"],[400,"CD"],[100,"C"],[90,"XC"],[50,"L"],[40,"XL"],[10,"X"],[9,"IX"],[5,"V"],[4,"IV"],[1,"I"]];let c="",p=s;for(const[d,f]of l)for(;p>=d;)c+=f,p-=d;return c},"newtons→pound-force":n=>(parseFloat(n)*.224809).toFixed(4).replace(/\.?0+$/,""),"pound-force→newtons":n=>(parseFloat(n)*4.44822).toFixed(4).replace(/\.?0+$/,""),"newtons→kg-force":n=>(parseFloat(n)/9.80665).toFixed(4).replace(/\.?0+$/,""),"kg-force→newtons":n=>(parseFloat(n)*9.80665).toFixed(4).replace(/\.?0+$/,""),"newtons→dyne":n=>(parseFloat(n)*1e5).toFixed(2).replace(/\.?0+$/,""),"dyne→newtons":n=>(parseFloat(n)*1e-5).toFixed(8).replace(/\.?0+$/,""),"newtons→kilonewtons":n=>(parseFloat(n)/1e3).toFixed(6).replace(/\.?0+$/,""),"kilonewtons→newtons":n=>(parseFloat(n)*1e3).toFixed(2).replace(/\.?0+$/,""),"pound-force→kg-force":n=>(parseFloat(n)*.453592).toFixed(4).replace(/\.?0+$/,""),"kg-force→pound-force":n=>(parseFloat(n)*2.20462).toFixed(4).replace(/\.?0+$/,""),"kilonewtons→pound-force":n=>(parseFloat(n)*224.809).toFixed(4).replace(/\.?0+$/,""),"pound-force→kilonewtons":n=>(parseFloat(n)/224.809).toFixed(6).replace(/\.?0+$/,""),"kilonewtons→kg-force":n=>(parseFloat(n)*101.972).toFixed(4).replace(/\.?0+$/,""),"kg-force→kilonewtons":n=>(parseFloat(n)/101.972).toFixed(6).replace(/\.?0+$/,""),"lux→foot-candle":n=>(parseFloat(n)*.0929).toFixed(4).replace(/\.?0+$/,""),"foot-candle→lux":n=>(parseFloat(n)*10.7639).toFixed(4).replace(/\.?0+$/,""),"lux→millilux":n=>(parseFloat(n)*1e3).toFixed(2).replace(/\.?0+$/,""),"millilux→lux":n=>(parseFloat(n)/1e3).toFixed(6).replace(/\.?0+$/,""),"foot-candle→millilux":n=>(parseFloat(n)*10763.9).toFixed(2).replace(/\.?0+$/,""),"millilux→foot-candle":n=>(parseFloat(n)/10763.9).toFixed(8).replace(/\.?0+$/,""),"lowercase→titlecase":n=>n.replace(/\b\w/g,s=>s.toUpperCase()),"lowercase→snakecase":n=>n.trim().replace(/\s+/g,"_"),"lowercase→kebabcase":n=>n.trim().replace(/\s+/g,"-"),"lowercase→camelcase":n=>n.replace(/\s+(\w)/g,(s,l)=>l.toUpperCase()),"uppercase→titlecase":n=>n.toLowerCase().replace(/\b\w/g,s=>s.toUpperCase()),"uppercase→snakecase":n=>n.toLowerCase().replace(/\s+/g,"_"),"uppercase→kebabcase":n=>n.toLowerCase().replace(/\s+/g,"-"),"snakecase→uppercase":n=>n.toUpperCase(),"kebabcase→uppercase":n=>n.toUpperCase().replace(/-/g,"_"),"markdown→text":n=>n.replace(/#{1,6}\s+/g,"").replace(/\*\*(.+?)\*\*/g,"$1").replace(/\*(.+?)\*/g,"$1").replace(/__(.+?)__/g,"$1").replace(/_(.+?)_/g,"$1").replace(/`{3}[\s\S]*?`{3}/g,"").replace(/`(.+?)`/g,"$1").replace(/\[(.+?)\]\(.+?\)/g,"$1").replace(/!\[.*?\]\(.+?\)/g,"").replace(/^[-*+]\s+/gm,"").replace(/^\d+\.\s+/gm,"").replace(/^>\s+/gm,"").replace(/^[-*_]{3,}$/gm,"").replace(/\n{3,}/g,`

`).trim(),"plain→camelcase":n=>n.trim().toLowerCase().replace(/[^a-z0-9]+(.)/g,(s,l)=>l.toUpperCase()),"plain→snakecase":n=>n.trim().toLowerCase().replace(/[^a-z0-9]+/g,"_").replace(/^_|_$/g,""),"plain→kebabcase":n=>n.trim().toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,""),"pt→pica":n=>(parseFloat(n)/12).toFixed(4).replace(/\.?0+$/,""),"pica→pt":n=>(parseFloat(n)*12).toFixed(4).replace(/\.?0+$/,""),"pt→px":n=>(parseFloat(n)*96/72).toFixed(4).replace(/\.?0+$/,""),"px→pt":n=>(parseFloat(n)*72/96).toFixed(4).replace(/\.?0+$/,""),"pt→inches":n=>(parseFloat(n)/72).toFixed(6).replace(/\.?0+$/,""),"inches→pt":n=>(parseFloat(n)*72).toFixed(4).replace(/\.?0+$/,""),"pt→mm":n=>(parseFloat(n)*25.4/72).toFixed(4).replace(/\.?0+$/,""),"mm→pt":n=>(parseFloat(n)*72/25.4).toFixed(4).replace(/\.?0+$/,""),"pt→cm":n=>(parseFloat(n)*2.54/72).toFixed(6).replace(/\.?0+$/,""),"cm→pt":n=>(parseFloat(n)*72/2.54).toFixed(4).replace(/\.?0+$/,""),"pica→inches":n=>(parseFloat(n)/6).toFixed(6).replace(/\.?0+$/,""),"inches→pica":n=>(parseFloat(n)*6).toFixed(4).replace(/\.?0+$/,""),"pica→px":n=>(parseFloat(n)*16).toFixed(2).replace(/\.?0+$/,""),"px→pica":n=>(parseFloat(n)/16).toFixed(4).replace(/\.?0+$/,""),"px→inches":n=>(parseFloat(n)/96).toFixed(6).replace(/\.?0+$/,""),"inches→px":n=>(parseFloat(n)*96).toFixed(2).replace(/\.?0+$/,""),"px→mm":n=>(parseFloat(n)*25.4/96).toFixed(4).replace(/\.?0+$/,""),"mm→px":n=>(parseFloat(n)*96/25.4).toFixed(4).replace(/\.?0+$/,""),"px→cm":n=>(parseFloat(n)*2.54/96).toFixed(6).replace(/\.?0+$/,""),"cm→px":n=>(parseFloat(n)*96/2.54).toFixed(4).replace(/\.?0+$/,""),"kgm3→gcm3":n=>(parseFloat(n)/1e3).toFixed(6).replace(/\.?0+$/,""),"gcm3→kgm3":n=>(parseFloat(n)*1e3).toFixed(2).replace(/\.?0+$/,""),"kgm3→lbft3":n=>(parseFloat(n)*.0624279).toFixed(4).replace(/\.?0+$/,""),"lbft3→kgm3":n=>(parseFloat(n)*16.0185).toFixed(4).replace(/\.?0+$/,""),"kgm3→lbgal":n=>(parseFloat(n)*.0083454).toFixed(6).replace(/\.?0+$/,""),"lbgal→kgm3":n=>(parseFloat(n)*119.826).toFixed(4).replace(/\.?0+$/,""),"gcm3→lbft3":n=>(parseFloat(n)*62.4279).toFixed(4).replace(/\.?0+$/,""),"lbft3→gcm3":n=>(parseFloat(n)/62.4279).toFixed(6).replace(/\.?0+$/,""),"gcm3→lbgal":n=>(parseFloat(n)*8.3454).toFixed(4).replace(/\.?0+$/,""),"lbgal→gcm3":n=>(parseFloat(n)/8.3454).toFixed(6).replace(/\.?0+$/,""),"lbft3→lbgal":n=>(parseFloat(n)/7.48052).toFixed(6).replace(/\.?0+$/,""),"lbgal→lbft3":n=>(parseFloat(n)*7.48052).toFixed(4).replace(/\.?0+$/,""),"ampere→milliamp":n=>(parseFloat(n)*1e3).toFixed(4).replace(/\.?0+$/,""),"milliamp→ampere":n=>(parseFloat(n)/1e3).toFixed(6).replace(/\.?0+$/,""),"ampere→microamp":n=>(parseFloat(n)*1e6).toFixed(2).replace(/\.?0+$/,""),"microamp→ampere":n=>(parseFloat(n)*1e-6).toFixed(9).replace(/\.?0+$/,""),"ampere→kiloamp":n=>(parseFloat(n)/1e3).toFixed(6).replace(/\.?0+$/,""),"kiloamp→ampere":n=>(parseFloat(n)*1e3).toFixed(2).replace(/\.?0+$/,""),"milliamp→microamp":n=>(parseFloat(n)*1e3).toFixed(4).replace(/\.?0+$/,""),"microamp→milliamp":n=>(parseFloat(n)/1e3).toFixed(6).replace(/\.?0+$/,""),"milliamp→kiloamp":n=>(parseFloat(n)*1e-6).toFixed(9).replace(/\.?0+$/,""),"kiloamp→milliamp":n=>(parseFloat(n)*1e6).toFixed(2).replace(/\.?0+$/,""),"volt→millivolt":n=>(parseFloat(n)*1e3).toFixed(4).replace(/\.?0+$/,""),"millivolt→volt":n=>(parseFloat(n)/1e3).toFixed(6).replace(/\.?0+$/,""),"volt→kilovolt":n=>(parseFloat(n)/1e3).toFixed(6).replace(/\.?0+$/,""),"kilovolt→volt":n=>(parseFloat(n)*1e3).toFixed(4).replace(/\.?0+$/,""),"volt→microvolt":n=>(parseFloat(n)*1e6).toFixed(2).replace(/\.?0+$/,""),"microvolt→volt":n=>(parseFloat(n)*1e-6).toFixed(9).replace(/\.?0+$/,""),"millivolt→kilovolt":n=>(parseFloat(n)*1e-6).toFixed(9).replace(/\.?0+$/,""),"kilovolt→millivolt":n=>(parseFloat(n)*1e6).toFixed(2).replace(/\.?0+$/,""),"millivolt→microvolt":n=>(parseFloat(n)*1e3).toFixed(4).replace(/\.?0+$/,""),"microvolt→millivolt":n=>(parseFloat(n)/1e3).toFixed(6).replace(/\.?0+$/,""),"cubic-m→liters":n=>(parseFloat(n)*1e3).toFixed(4).replace(/\.?0+$/,""),"liters→cubic-m":n=>(parseFloat(n)/1e3).toFixed(6).replace(/\.?0+$/,""),"cubic-m→gallons":n=>(parseFloat(n)*264.172).toFixed(4).replace(/\.?0+$/,""),"gallons→cubic-m":n=>(parseFloat(n)/264.172).toFixed(6).replace(/\.?0+$/,""),"cubic-ft→liters":n=>(parseFloat(n)*28.3168).toFixed(4).replace(/\.?0+$/,""),"liters→cubic-ft":n=>(parseFloat(n)/28.3168).toFixed(6).replace(/\.?0+$/,""),"cubic-ft→gallons":n=>(parseFloat(n)*7.48052).toFixed(4).replace(/\.?0+$/,""),"gallons→cubic-ft":n=>(parseFloat(n)/7.48052).toFixed(4).replace(/\.?0+$/,""),"cubic-m→cubic-ft":n=>(parseFloat(n)*35.3147).toFixed(4).replace(/\.?0+$/,""),"cubic-ft→cubic-m":n=>(parseFloat(n)/35.3147).toFixed(6).replace(/\.?0+$/,""),"milligrams→grams":n=>(parseFloat(n)/1e3).toFixed(6).replace(/\.?0+$/,""),"grams→milligrams":n=>(parseFloat(n)*1e3).toFixed(4).replace(/\.?0+$/,""),"milligrams→kg":n=>(parseFloat(n)*1e-6).toFixed(9).replace(/\.?0+$/,""),"kg→milligrams":n=>(parseFloat(n)*1e6).toFixed(2).replace(/\.?0+$/,""),"milligrams→oz":n=>(parseFloat(n)*35274e-9).toFixed(8).replace(/\.?0+$/,""),"oz→milligrams":n=>(parseFloat(n)*28349.5).toFixed(2).replace(/\.?0+$/,""),"micrograms→milligrams":n=>(parseFloat(n)/1e3).toFixed(6).replace(/\.?0+$/,""),"milligrams→micrograms":n=>(parseFloat(n)*1e3).toFixed(4).replace(/\.?0+$/,""),"micrograms→grams":n=>(parseFloat(n)*1e-6).toFixed(9).replace(/\.?0+$/,""),"grams→micrograms":n=>(parseFloat(n)*1e6).toFixed(2).replace(/\.?0+$/,""),"carats→grams":n=>(parseFloat(n)*.2).toFixed(4).replace(/\.?0+$/,""),"grams→carats":n=>(parseFloat(n)*5).toFixed(4).replace(/\.?0+$/,""),"troy-oz→grams":n=>(parseFloat(n)*31.1035).toFixed(4).replace(/\.?0+$/,""),"grams→troy-oz":n=>(parseFloat(n)/31.1035).toFixed(6).replace(/\.?0+$/,""),"troy-oz→oz":n=>(parseFloat(n)*1.09714).toFixed(4).replace(/\.?0+$/,""),"oz→troy-oz":n=>(parseFloat(n)/1.09714).toFixed(6).replace(/\.?0+$/,""),"dur-ms→dur-seconds":n=>(parseFloat(n)/1e3).toFixed(4).replace(/\.?0+$/,""),"dur-seconds→dur-ms":n=>(parseFloat(n)*1e3).toFixed(2).replace(/\.?0+$/,""),"dur-ms→dur-minutes":n=>(parseFloat(n)/6e4).toFixed(6).replace(/\.?0+$/,""),"dur-minutes→dur-ms":n=>(parseFloat(n)*6e4).toFixed(2).replace(/\.?0+$/,""),"dur-ms→dur-hours":n=>(parseFloat(n)/36e5).toFixed(8).replace(/\.?0+$/,""),"dur-hours→dur-ms":n=>(parseFloat(n)*36e5).toFixed(2).replace(/\.?0+$/,""),"dur-weeks→dur-hours":n=>(parseFloat(n)*168).toFixed(4).replace(/\.?0+$/,""),"dur-hours→dur-weeks":n=>(parseFloat(n)/168).toFixed(6).replace(/\.?0+$/,""),"dur-weeks→dur-minutes":n=>(parseFloat(n)*10080).toFixed(2).replace(/\.?0+$/,""),"dur-minutes→dur-weeks":n=>(parseFloat(n)/10080).toFixed(8).replace(/\.?0+$/,""),"dur-weeks→dur-days":n=>(parseFloat(n)*7).toFixed(4).replace(/\.?0+$/,""),"dur-days→dur-weeks":n=>(parseFloat(n)/7).toFixed(6).replace(/\.?0+$/,""),"color-hsv→color-cmyk":n=>{const s=Zi(n);if(!s)throw new Error("bad hsv");const l=Ki(s),c=l.r/255,p=l.g/255,d=l.b/255,f=1-Math.max(c,p,d);return f===1?"cmyk(0%, 0%, 0%, 100%)":`cmyk(${Math.round((1-c-f)/(1-f)*100)}%, ${Math.round((1-p-f)/(1-f)*100)}%, ${Math.round((1-d-f)/(1-f)*100)}%, ${Math.round(f*100)}%)`},"color-cmyk→color-hsv":n=>{const s=n.match(/cmyk\(\s*([\d.]+)%[^,]*,\s*([\d.]+)%[^,]*,\s*([\d.]+)%[^,]*,\s*([\d.]+)%/i);if(!s)throw new Error("bad cmyk");const[l,c,p,d]=[parseFloat(s[1])/100,parseFloat(s[2])/100,parseFloat(s[3])/100,parseFloat(s[4])/100],f={r:Math.round(255*(1-l)*(1-d)),g:Math.round(255*(1-c)*(1-d)),b:Math.round(255*(1-p)*(1-d))},m=Ar(f);return`hsv(${m.h}, ${m.s}%, ${m.v}%)`},"ohm→kilohm":n=>(parseFloat(n)/1e3).toFixed(6).replace(/\.?0+$/,""),"kilohm→ohm":n=>(parseFloat(n)*1e3).toFixed(4).replace(/\.?0+$/,""),"ohm→megohm":n=>(parseFloat(n)*1e-6).toFixed(9).replace(/\.?0+$/,""),"megohm→ohm":n=>(parseFloat(n)*1e6).toFixed(2).replace(/\.?0+$/,""),"ohm→milliohm":n=>(parseFloat(n)*1e3).toFixed(4).replace(/\.?0+$/,""),"milliohm→ohm":n=>(parseFloat(n)/1e3).toFixed(6).replace(/\.?0+$/,""),"kilohm→megohm":n=>(parseFloat(n)/1e3).toFixed(6).replace(/\.?0+$/,""),"megohm→kilohm":n=>(parseFloat(n)*1e3).toFixed(4).replace(/\.?0+$/,""),"milliohm→kilohm":n=>(parseFloat(n)*1e-6).toFixed(9).replace(/\.?0+$/,""),"kilohm→milliohm":n=>(parseFloat(n)*1e6).toFixed(2).replace(/\.?0+$/,""),"ms2→gforce":n=>(parseFloat(n)/9.80665).toFixed(6).replace(/\.?0+$/,""),"gforce→ms2":n=>(parseFloat(n)*9.80665).toFixed(4).replace(/\.?0+$/,""),"ms2→fts2":n=>(parseFloat(n)*3.28084).toFixed(4).replace(/\.?0+$/,""),"fts2→ms2":n=>(parseFloat(n)/3.28084).toFixed(6).replace(/\.?0+$/,""),"ms2→cms2":n=>(parseFloat(n)*100).toFixed(4).replace(/\.?0+$/,""),"cms2→ms2":n=>(parseFloat(n)/100).toFixed(6).replace(/\.?0+$/,""),"gforce→fts2":n=>(parseFloat(n)*32.1741).toFixed(4).replace(/\.?0+$/,""),"fts2→gforce":n=>(parseFloat(n)/32.1741).toFixed(6).replace(/\.?0+$/,""),"gforce→cms2":n=>(parseFloat(n)*980.665).toFixed(4).replace(/\.?0+$/,""),"cms2→gforce":n=>(parseFloat(n)/980.665).toFixed(6).replace(/\.?0+$/,""),"fts2→cms2":n=>(parseFloat(n)*30.48).toFixed(4).replace(/\.?0+$/,""),"cms2→fts2":n=>(parseFloat(n)/30.48).toFixed(6).replace(/\.?0+$/,""),"nm-torque→lb-ft":n=>(parseFloat(n)*.737562).toFixed(4).replace(/\.?0+$/,""),"lb-ft→nm-torque":n=>(parseFloat(n)*1.35582).toFixed(4).replace(/\.?0+$/,""),"nm-torque→lb-in":n=>(parseFloat(n)*8.85075).toFixed(4).replace(/\.?0+$/,""),"lb-in→nm-torque":n=>(parseFloat(n)*.112985).toFixed(6).replace(/\.?0+$/,""),"nm-torque→kg-cm":n=>(parseFloat(n)*10.1972).toFixed(4).replace(/\.?0+$/,""),"kg-cm→nm-torque":n=>(parseFloat(n)*.098066).toFixed(6).replace(/\.?0+$/,""),"lb-ft→lb-in":n=>(parseFloat(n)*12).toFixed(4).replace(/\.?0+$/,""),"lb-in→lb-ft":n=>(parseFloat(n)/12).toFixed(6).replace(/\.?0+$/,""),"lb-ft→kg-cm":n=>(parseFloat(n)*13.8255).toFixed(4).replace(/\.?0+$/,""),"kg-cm→lb-ft":n=>(parseFloat(n)/13.8255).toFixed(6).replace(/\.?0+$/,""),"lb-in→kg-cm":n=>(parseFloat(n)*1.15212).toFixed(4).replace(/\.?0+$/,""),"kg-cm→lb-in":n=>(parseFloat(n)/1.15212).toFixed(6).replace(/\.?0+$/,""),"newton→kilonewton":n=>(parseFloat(n)/1e3).toFixed(8).replace(/\.?0+$/,""),"kilonewton→newton":n=>(parseFloat(n)*1e3).toFixed(4).replace(/\.?0+$/,""),"newton→pound-force":n=>(parseFloat(n)*.224809).toFixed(6).replace(/\.?0+$/,""),"pound-force→newton":n=>(parseFloat(n)*4.44822).toFixed(6).replace(/\.?0+$/,""),"newton→kgforce":n=>(parseFloat(n)*.101972).toFixed(6).replace(/\.?0+$/,""),"kgforce→newton":n=>(parseFloat(n)*9.80665).toFixed(6).replace(/\.?0+$/,""),"newton→dyne":n=>(parseFloat(n)*1e5).toFixed(4).replace(/\.?0+$/,""),"dyne→newton":n=>(parseFloat(n)/1e5).toFixed(10).replace(/\.?0+$/,""),"kilonewton→pound-force":n=>(parseFloat(n)*224.809).toFixed(4).replace(/\.?0+$/,""),"pound-force→kilonewton":n=>(parseFloat(n)*.00444822).toFixed(8).replace(/\.?0+$/,""),"kilonewton→kgforce":n=>(parseFloat(n)*101.972).toFixed(4).replace(/\.?0+$/,""),"kgforce→kilonewton":n=>(parseFloat(n)*.00980665).toFixed(8).replace(/\.?0+$/,""),"pound-force→kgforce":n=>(parseFloat(n)*.453592).toFixed(6).replace(/\.?0+$/,""),"kgforce→pound-force":n=>(parseFloat(n)*2.20462).toFixed(6).replace(/\.?0+$/,""),"pound-force→dyne":n=>(parseFloat(n)*444822).toFixed(2).replace(/\.?0+$/,""),"dyne→pound-force":n=>(parseFloat(n)*224809e-11).toFixed(12).replace(/\.?0+$/,""),"lux→footcandle":n=>(parseFloat(n)*.092903).toFixed(6).replace(/\.?0+$/,""),"footcandle→lux":n=>(parseFloat(n)*10.7639).toFixed(4).replace(/\.?0+$/,""),"lux→phot":n=>(parseFloat(n)*1e-4).toFixed(8).replace(/\.?0+$/,""),"phot→lux":n=>(parseFloat(n)*1e4).toFixed(4).replace(/\.?0+$/,""),"lux→nox":n=>(parseFloat(n)*1e3).toFixed(4).replace(/\.?0+$/,""),"nox→lux":n=>(parseFloat(n)/1e3).toFixed(8).replace(/\.?0+$/,""),"footcandle→phot":n=>(parseFloat(n)*.00929).toFixed(6).replace(/\.?0+$/,""),"phot→footcandle":n=>(parseFloat(n)/.00929).toFixed(4).replace(/\.?0+$/,""),"farad→microfarad":n=>(parseFloat(n)*1e6).toFixed(4).replace(/\.?0+$/,""),"microfarad→farad":n=>(parseFloat(n)*1e-6).toFixed(12).replace(/\.?0+$/,""),"farad→nanofarad":n=>(parseFloat(n)*1e9).toFixed(4).replace(/\.?0+$/,""),"nanofarad→farad":n=>(parseFloat(n)*1e-9).toFixed(15).replace(/\.?0+$/,""),"farad→picofarad":n=>(parseFloat(n)*1e12).toFixed(4).replace(/\.?0+$/,""),"picofarad→farad":n=>(parseFloat(n)*1e-12).toFixed(18).replace(/\.?0+$/,""),"microfarad→nanofarad":n=>(parseFloat(n)*1e3).toFixed(4).replace(/\.?0+$/,""),"nanofarad→microfarad":n=>(parseFloat(n)/1e3).toFixed(8).replace(/\.?0+$/,""),"microfarad→picofarad":n=>(parseFloat(n)*1e6).toFixed(4).replace(/\.?0+$/,""),"picofarad→microfarad":n=>(parseFloat(n)*1e-6).toFixed(12).replace(/\.?0+$/,""),"nanofarad→picofarad":n=>(parseFloat(n)*1e3).toFixed(4).replace(/\.?0+$/,""),"picofarad→nanofarad":n=>(parseFloat(n)/1e3).toFixed(8).replace(/\.?0+$/,""),"terahertz→gigahertz":n=>(parseFloat(n)*1e3).toFixed(4).replace(/\.?0+$/,""),"gigahertz→terahertz":n=>(parseFloat(n)/1e3).toFixed(8).replace(/\.?0+$/,""),"terahertz→megahertz":n=>(parseFloat(n)*1e6).toFixed(4).replace(/\.?0+$/,""),"megahertz→terahertz":n=>(parseFloat(n)*1e-6).toFixed(12).replace(/\.?0+$/,""),"terahertz→kilohertz":n=>(parseFloat(n)*1e9).toFixed(4).replace(/\.?0+$/,""),"kilohertz→terahertz":n=>(parseFloat(n)*1e-9).toFixed(15).replace(/\.?0+$/,""),"terahertz→hertz":n=>(parseFloat(n)*1e12).toFixed(4).replace(/\.?0+$/,""),"hertz→terahertz":n=>(parseFloat(n)*1e-12).toFixed(18).replace(/\.?0+$/,""),"gigahertz→megahertz":n=>(parseFloat(n)*1e3).toFixed(4).replace(/\.?0+$/,""),"megahertz→gigahertz":n=>(parseFloat(n)/1e3).toFixed(8).replace(/\.?0+$/,""),"gigahertz→kilohertz":n=>(parseFloat(n)*1e6).toFixed(4).replace(/\.?0+$/,""),"kilohertz→gigahertz":n=>(parseFloat(n)*1e-6).toFixed(12).replace(/\.?0+$/,""),"gigahertz→hertz":n=>(parseFloat(n)*1e9).toFixed(4).replace(/\.?0+$/,""),"hertz→gigahertz":n=>(parseFloat(n)*1e-9).toFixed(15).replace(/\.?0+$/,""),"percent→decimal-frac":n=>(parseFloat(n)/100).toFixed(6).replace(/\.?0+$/,""),"decimal-frac→percent":n=>(parseFloat(n)*100).toFixed(4).replace(/\.?0+$/,""),"percent→ppm":n=>(parseFloat(n)*1e4).toFixed(4).replace(/\.?0+$/,""),"ppm→percent":n=>(parseFloat(n)/1e4).toFixed(8).replace(/\.?0+$/,""),"percent→ppb":n=>(parseFloat(n)*1e7).toFixed(4).replace(/\.?0+$/,""),"ppb→percent":n=>(parseFloat(n)/1e7).toFixed(12).replace(/\.?0+$/,""),"decimal-frac→ppm":n=>(parseFloat(n)*1e6).toFixed(4).replace(/\.?0+$/,""),"ppm→decimal-frac":n=>(parseFloat(n)*1e-6).toFixed(12).replace(/\.?0+$/,""),"decimal-frac→ppb":n=>(parseFloat(n)*1e9).toFixed(4).replace(/\.?0+$/,""),"ppb→decimal-frac":n=>(parseFloat(n)*1e-9).toFixed(15).replace(/\.?0+$/,""),"ppm→ppb":n=>(parseFloat(n)*1e3).toFixed(4).replace(/\.?0+$/,""),"ppb→ppm":n=>(parseFloat(n)/1e3).toFixed(8).replace(/\.?0+$/,""),"pt-type→pica":n=>(parseFloat(n)/12).toFixed(6).replace(/\.?0+$/,""),"pica→pt-type":n=>(parseFloat(n)*12).toFixed(4).replace(/\.?0+$/,""),"pt-type→screen-px":n=>(parseFloat(n)*96/72).toFixed(4).replace(/\.?0+$/,""),"screen-px→pt-type":n=>(parseFloat(n)*72/96).toFixed(4).replace(/\.?0+$/,""),"pt-type→twip":n=>(parseFloat(n)*20).toFixed(4).replace(/\.?0+$/,""),"twip→pt-type":n=>(parseFloat(n)/20).toFixed(6).replace(/\.?0+$/,""),"pt-type→mm":n=>(parseFloat(n)*25.4/72).toFixed(6).replace(/\.?0+$/,""),"mm→pt-type":n=>(parseFloat(n)*72/25.4).toFixed(4).replace(/\.?0+$/,""),"pt-type→inch":n=>(parseFloat(n)/72).toFixed(8).replace(/\.?0+$/,""),"inch→pt-type":n=>(parseFloat(n)*72).toFixed(4).replace(/\.?0+$/,""),"pt-type→cm":n=>(parseFloat(n)*2.54/72).toFixed(6).replace(/\.?0+$/,""),"cm→pt-type":n=>(parseFloat(n)*72/2.54).toFixed(4).replace(/\.?0+$/,""),"pica→mm":n=>(parseFloat(n)*25.4/6).toFixed(4).replace(/\.?0+$/,""),"mm→pica":n=>(parseFloat(n)*6/25.4).toFixed(6).replace(/\.?0+$/,""),"pica→inch":n=>(parseFloat(n)/6).toFixed(6).replace(/\.?0+$/,""),"inch→pica":n=>(parseFloat(n)*6).toFixed(4).replace(/\.?0+$/,""),"pica→cm":n=>(parseFloat(n)*2.54/6).toFixed(4).replace(/\.?0+$/,""),"cm→pica":n=>(parseFloat(n)*6/2.54).toFixed(6).replace(/\.?0+$/,""),"pica→screen-px":n=>(parseFloat(n)*96/6).toFixed(4).replace(/\.?0+$/,""),"screen-px→pica":n=>(parseFloat(n)*6/96).toFixed(6).replace(/\.?0+$/,""),"screen-px→mm":n=>(parseFloat(n)*25.4/96).toFixed(6).replace(/\.?0+$/,""),"mm→screen-px":n=>(parseFloat(n)*96/25.4).toFixed(4).replace(/\.?0+$/,""),"screen-px→inch":n=>(parseFloat(n)/96).toFixed(8).replace(/\.?0+$/,""),"inch→screen-px":n=>(parseFloat(n)*96).toFixed(4).replace(/\.?0+$/,""),"screen-px→cm":n=>(parseFloat(n)*2.54/96).toFixed(6).replace(/\.?0+$/,""),"cm→screen-px":n=>(parseFloat(n)*96/2.54).toFixed(4).replace(/\.?0+$/,""),"twip→mm":n=>(parseFloat(n)*25.4/1440).toFixed(6).replace(/\.?0+$/,""),"mm→twip":n=>(parseFloat(n)*1440/25.4).toFixed(4).replace(/\.?0+$/,""),"twip→inch":n=>(parseFloat(n)/1440).toFixed(8).replace(/\.?0+$/,""),"inch→twip":n=>(parseFloat(n)*1440).toFixed(4).replace(/\.?0+$/,""),"twip→screen-px":n=>(parseFloat(n)*96/1440).toFixed(6).replace(/\.?0+$/,""),"screen-px→twip":n=>(parseFloat(n)*1440/96).toFixed(4).replace(/\.?0+$/,""),"twip→pica":n=>(parseFloat(n)/240).toFixed(6).replace(/\.?0+$/,""),"pica→twip":n=>(parseFloat(n)*240).toFixed(4).replace(/\.?0+$/,""),"dur-us→dur-ms":n=>(parseFloat(n)/1e3).toFixed(6).replace(/\.?0+$/,""),"dur-ms→dur-us":n=>(parseFloat(n)*1e3).toFixed(2).replace(/\.?0+$/,""),"dur-us→dur-seconds":n=>(parseFloat(n)/1e6).toFixed(9).replace(/\.?0+$/,""),"dur-seconds→dur-us":n=>(parseFloat(n)*1e6).toFixed(2).replace(/\.?0+$/,""),"dur-us→dur-ns":n=>(parseFloat(n)*1e3).toFixed(2).replace(/\.?0+$/,""),"dur-ns→dur-us":n=>(parseFloat(n)/1e3).toFixed(6).replace(/\.?0+$/,""),"dur-ns→dur-ms":n=>(parseFloat(n)/1e6).toFixed(9).replace(/\.?0+$/,""),"dur-ms→dur-ns":n=>(parseFloat(n)*1e6).toFixed(2).replace(/\.?0+$/,""),"dur-ns→dur-seconds":n=>(parseFloat(n)/1e9).toFixed(12).replace(/\.?0+$/,""),"dur-seconds→dur-ns":n=>(parseFloat(n)*1e9).toFixed(2).replace(/\.?0+$/,""),"dur-ns→dur-minutes":n=>(parseFloat(n)/6e10).toFixed(14).replace(/\.?0+$/,""),"dur-minutes→dur-ns":n=>(parseFloat(n)*6e10).toFixed(0),"dur-months→dur-days":n=>(parseFloat(n)*30.4375).toFixed(4).replace(/\.?0+$/,""),"dur-days→dur-months":n=>(parseFloat(n)/30.4375).toFixed(6).replace(/\.?0+$/,""),"dur-months→dur-weeks":n=>(parseFloat(n)*4.34821).toFixed(4).replace(/\.?0+$/,""),"dur-weeks→dur-months":n=>(parseFloat(n)/4.34821).toFixed(6).replace(/\.?0+$/,""),"dur-months→dur-hours":n=>(parseFloat(n)*730.5).toFixed(2).replace(/\.?0+$/,""),"dur-hours→dur-months":n=>(parseFloat(n)/730.5).toFixed(8).replace(/\.?0+$/,""),"dur-months→dur-seconds":n=>(parseFloat(n)*2629800).toFixed(0),"dur-seconds→dur-months":n=>(parseFloat(n)/2629800).toFixed(10).replace(/\.?0+$/,""),"dur-years→dur-months":n=>(parseFloat(n)*12).toFixed(4).replace(/\.?0+$/,""),"dur-months→dur-years":n=>(parseFloat(n)/12).toFixed(6).replace(/\.?0+$/,""),"dur-years→dur-days":n=>(parseFloat(n)*365.25).toFixed(4).replace(/\.?0+$/,""),"dur-days→dur-years":n=>(parseFloat(n)/365.25).toFixed(8).replace(/\.?0+$/,""),"dur-years→dur-weeks":n=>(parseFloat(n)*52.1775).toFixed(4).replace(/\.?0+$/,""),"dur-weeks→dur-years":n=>(parseFloat(n)/52.1775).toFixed(8).replace(/\.?0+$/,""),"dur-years→dur-hours":n=>(parseFloat(n)*8766).toFixed(2).replace(/\.?0+$/,""),"dur-hours→dur-years":n=>(parseFloat(n)/8766).toFixed(8).replace(/\.?0+$/,""),"dur-years→dur-seconds":n=>(parseFloat(n)*31557600).toFixed(0),"dur-seconds→dur-years":n=>(parseFloat(n)/31557600).toFixed(10).replace(/\.?0+$/,""),"dur-years→dur-minutes":n=>(parseFloat(n)*525960).toFixed(0),"dur-minutes→dur-years":n=>(parseFloat(n)/525960).toFixed(10).replace(/\.?0+$/,"")},hc={};for(const n of Object.keys(sf)){const[s,l]=n.split("→");hc[s]||(hc[s]=[]),hc[s].push(l)}const Sy={"kg-force":"kgforce",kgforce:"kg-force"};function Yp(n){const s=Sy[n];return s?[n,s]:[n]}function n0(n){return af.has(n)?Ey(n):[]}function a0(n,s){for(const l of Yp(n))for(const c of Yp(s)){const p=sf[`${l}→${c}`];if(p)return p}return null}const Ay=Object.freeze({studioQr:Object.freeze({title:"QR-Code gestalten",intro:"Inhalt eingeben, Design anpassen.",modeLabel:"QR-Werkzeug",modeCreate:"Erstellen",modeRead:"Lesen",tabsLabel:"QR-Einstellungen",tabContent:"Inhalt",tabDesign:"Design",tabLogo:"Logo",contentType:"Inhaltstyp",typeText:"Text",typeUrl:"URL",typeWifi:"WLAN",typeContact:"Kontakt",typeEmail:"E-Mail",typeSms:"SMS",contentLabel:"Inhalt",textPlaceholder:"Text für den QR-Code eingeben",urlPlaceholder:"Webadresse einfügen",wifiName:"Netzwerkname",wifiEncryption:"Sicherheit",wifiOpen:"Offenes Netzwerk",wifiPassword:"Passwort",wifiHidden:"Netzwerk ist verborgen",contactName:"Name",contactOrganization:"Organisation",phone:"Telefonnummer",emailAddress:"E-Mail-Adresse",website:"Website",emailTo:"Empfängeradresse",emailSubject:"Betreff",message:"Nachricht",fieldErrors:Object.freeze({single_line:"Zeilenumbrüche, Tabulatoren und Steuerzeichen sind hier nicht unterstützt.",required:"Dieses Feld ist erforderlich.",http_url:"Gib eine vollständige HTTP- oder HTTPS-Adresse ein.",email:"Gib eine gültige E-Mail-Adresse ein.",phone:"Gib eine gültige Telefonnummer ein."}),byteUsage:"{used} von {capacity} Bytes",capacityRemaining:"Der QR-Code ist fast voll. Noch {remaining} Bytes sind verfügbar.",correctionLevel:"Fehlerkorrektur {level}",capacityError:"Der Inhalt ist für einen QR-Code mit den aktuellen Einstellungen zu lang.",foreground:"Vordergrund",background:"Hintergrund",foregroundPresets:"Vordergrundfarben",backgroundPresets:"Hintergrundfarben",selectForegroundPreset:"{color} als Vordergrund wählen",selectBackgroundPreset:"{color} als Hintergrund wählen",colourGraphite:"Graphit",colourGreen:"Grün",colourBlue:"Blau",colourPurple:"Violett",colourTerracotta:"Terrakotta",colourWhite:"Weiss",colourLightNeutral:"Hellgrau",colourMint:"Mint",colourLightBlue:"Hellblau",colourRose:"Rosé",contrastWarning:"Der Kontrast ist niedrig. Verwende deutlich unterschiedliche Farben, damit Scanner den Code zuverlässig erkennen.",moduleStyle:"Modulstil",cornerFrameStyle:"Eckrahmen",cornerDotStyle:"Eckpunkt",styleSquare:"Quadratisch",styleRounded:"Abgerundet",styleDots:"Punkte",styleExtraRounded:"Stark abgerundet",size:"Exportgrösse",sizeValue:"{value} px",quietZone:"Freier Rand",quietZoneValue:"{value} Module",quietZoneHint:"Mindestens vier freie Module schützen die Lesbarkeit.",logoInput:"Logo auswählen",logoAcceptHint:"PNG, JPEG oder WebP, maximal 4 MB und 12 Megapixel.",logoSelected:"Ausgewählt: {name}",logoRemove:"Logo entfernen",logoSize:"Logogrösse",logoSizeValue:"{value} %",logoSpacing:"Abstand zum Code",logoSpacingValue:"{value} px",cropZoom:"Ausschnitt vergrössern",cropControlLabel:"Logo-Ausschnitt verschieben",cropHint:"Ziehe das Bild im Rahmen. Mit den Pfeiltasten verschiebst du es schrittweise, mit Umschalt schneller.",cropCenter:"Zentrieren",logoSafety:"Mit Logo verwendet Folkkit automatisch die hohe Fehlerkorrektur H.",invalidLogo:"Diese Datei ist kein gültiges PNG-, JPEG- oder WebP-Bild.",largeLogo:"Das Logo ist zu gross. Verwende höchstens 4 MB und 12 Megapixel.",unsupportedLogo:"Dieser Browser kann das Logo nicht lokal verarbeiten.",previewTitle:"Vorschau",previewAlt:"QR-Code-Vorschau",previewUpdating:"Vorschau wird aktualisiert …",previewError:"Die Vorschau konnte nicht erstellt werden. Prüfe den Inhalt und die Einstellungen.",downloadPng:"PNG herunterladen",downloadSvg:"SVG herunterladen",downloading:"Download wird vorbereitet …",downloadError:"Der QR-Code konnte nicht exportiert werden.",reset:"Zurücksetzen",readerTitle:"QR-Code lesen",readerIntro:"QR-Codes aus Fotos und Screenshots auslesen.",readerInput:"QR-Bild auswählen",readerHint:"PNG, JPEG oder WebP, maximal 12 MB und 12 Megapixel.",readerProgress:"QR-Code wird gelesen …",readerCancel:"Abbrechen",readerResult:"Gelesener Inhalt",readerCopy:"Inhalt kopieren",readerCopied:"Inhalt kopiert.",readerOpenLink:"Link öffnen",readerReset:"Anderes Bild wählen",readerErrors:Object.freeze({invalid_file:"Diese Datei ist kein gültiges PNG-, JPEG- oder WebP-Bild.",too_large:"Das Bild ist zu gross. Verwende höchstens 12 MB und 12 Megapixel.",not_found:"Kein QR-Code gefunden. Prüfe, ob der Code vollständig und scharf abgebildet ist.",timeout:"Das Lesen hat zu lange gedauert. Versuche ein kleineres oder schärferes Bild.",unsupported_browser:"Dieser Browser kann das Bild nicht lokal lesen.",decode_failed:"Das Bild konnte nicht gelesen werden.",copy_failed:"Der Inhalt konnte nicht kopiert werden."})})}),wy={title:"Dateien konvertieren",subtitle:"Bilder, PDFs, Audio und Video.",optimizeTitle:"Bilder verkleinern",optimizeSubtitle:"PNG, JPEG und WebP lokal neu berechnen oder proportional verkleinern.",limitsLabel:"Dateigrenzen",modeLabel:"Arbeitsmodus",modeConvert:"Konvertieren",modeOptimize:"Bilder verkleinern",choose:"Dateien auswählen",add:"Dateien hinzufügen",drop:"Dateien hier ablegen",dropHint:"PNG, JPEG, WebP, PDF, MP3, WAV, FLAC, OGG, MP4, WebM, MOV",optimizeDropHint:"PNG, JPEG oder WebP",limits:"Bis zu 20 Dateien · 100 MiB pro Datei (PDF: 32 MiB) · 250 MiB insgesamt · 64 MiB pro Ergebnis",width:"Breite (px)",height:"Höhe (px)",maxWidth:"Maximale Breite (px)",maxHeight:"Maximale Höhe (px)",qualityLevel:"Qualitätsstufe",qualitySmall:"Stärker komprimiert",qualityBalanced:"Ausgewogen",qualityHigh:"Hohe Qualität",pageSize:"PDF-Seitengrösse",original:"Originale Bildgrösse",orientation:"Ausrichtung",portrait:"Hochformat",landscape:"Querformat",dpi:"PDF-Auflösung",bitrate:"MP3-Bitrate",flacLevel:"FLAC-Kompressionsstufe",vorbisQuality:"Vorbis-Qualität",resolution:"Videoauflösung",trim:"Videoausschnitt wählen",wavHint:"WAV: unkomprimiertes PCM16.",commonTarget:"Zielformat für alle Dateien",individual:"Pro Datei wählen",target:"Zielformat",files:"Dateien",convert:"Dateien konvertieren",optimize:"Optimierung starten",cancel:"Konvertierung abbrechen",cancelOptimize:"Optimierung abbrechen",clear:"Dateien entfernen",remove:"Entfernen",retry:"Erneut versuchen",download:"Herunterladen",downloadZip:"Alle als ZIP herunterladen",downloadFileZip:"Ergebnisse als ZIP herunterladen",fileNumber:"Datei",creatingZip:"ZIP wird erstellt…",quality:"Qualität (%)",pages:"PDF-Seiten",pagesHint:"Alle Seiten oder zum Beispiel 1-3,5. Höchstens 100 Seiten.",clipStart:"Ausschnitt ab (Sekunden)",clipDuration:"Dauer (Sekunden)",clipHint:"Wähle einen Ausschnitt bis 30 Sekunden. GIF: 720 px, 12 Bilder/s.",imageHint:"Für die Originalgrösse beide Masse leer lassen. Das Seitenverhältnis bleibt erhalten. JPEG erhält einen weissen Hintergrund.",optimizeHint:"Leere Masse behalten die Originalgrösse. Grössere Werte werden nicht hochskaliert.",optimizePngHint:"PNG wird ohne Qualitätsregler verarbeitet. Leere Masse behalten die Originalgrösse; grössere Werte werden nicht hochskaliert.",audioHint:"MP3: 192 kbit/s · WAV: PCM16 · FLAC: Stufe 5 · OGG: Vorbis-Qualität 5",videoHint:"Höchstens 1080p, ohne Vergrösserung. MP4: H.264/AAC · WebM: VP8/Opus.",combine:"Bilder in dieser Reihenfolge zu einem PDF verbinden",moveUp:"Nach oben",moveDown:"Nach unten",combined:"Im gemeinsamen PDF enthalten",local:"Deine Dateien bleiben auf diesem Gerät.",settings:"Einstellungen",unknown:"Unbekanntes Format",optimizeUnsupported:"Nur PNG-, JPEG- und WebP-Bilder können in diesem Modus verarbeitet werden.",before:"Vorher",after:"Nachher",result:"Ergebnis",keptOriginal:"Mit diesen Einstellungen wird die Datei nicht kleiner. Du erhältst das Original.",reducedBy:"Dateigrösse reduziert um",largerResult:"Die Ergebnisdatei ist grösser als das Original.",largerAfterResize:"Die Abmessungen wurden geändert; die Datei ist dabei grösser geworden.",sameSize:"Die Dateigrösse ist unverändert.",downloadResult:"Ergebnis herunterladen",status:{detecting:"Format wird geprüft…",ready:"Bereit",running:"Wird verarbeitet…",done:"Fertig",error:"Fehlgeschlagen",cancelled:"Abgebrochen",unsupported:"In diesem Modus nicht verfügbar"},errors:{invalid_settings:"Wähle einen unterstützten Wert für diese Einstellungen.",unsupported_type:"Dieses Dateiformat wird nicht unterstützt.",type_mismatch:"Der Dateiinhalt passt nicht zur Endung oder zum Dateityp.",unsupported_pair:"Diese Konvertierung ist nicht verfügbar.",too_large:"Die ausgewählten Dateien überschreiten die Grössenbegrenzung.",resource_limit:"Die Datei überschreitet die lokale Verarbeitungsgrenze. Versuche eine kleinere Datei oder weniger Seiten.",invalid_file:"Die Datei konnte nicht gelesen werden.",unsupported_codec:"Der enthaltene Audio- oder Video-Codec wird nicht unterstützt.",invalid_pages:"Gib gültige Seitenzahlen ein, zum Beispiel 1-3,5.",invalid_clip:"Wähle einen Ausschnitt innerhalb des Videos mit einer Dauer von 1 bis 30 Sekunden.",no_audio:"Diese Datei enthält keine unterstützte Tonspur.",media_runtime_unavailable:"Das Verarbeitungsmodul ist offline noch nicht verfügbar. Lade es einmal mit Internetverbindung und versuche es erneut.",conversion_failed:"Die Konvertierung ist fehlgeschlagen. Du kannst diese Datei erneut versuchen.",cancelled:"Konvertierung abgebrochen."}},Ry={resize:"Skalieren: {corner}",corner:{nw:"oben links",ne:"oben rechts",sw:"unten links",se:"unten rechts"},properties:"Eigenschaften",allPages:"Alle auswählen",clearPages:"Auswahl aufheben",selectedPages:"{count} ausgewählt",selectPage:"Seite {number} auswählen",viewing:"Angezeigt",pageSelectionHint:"Seiten für gemeinsame Aktionen ankreuzen. Ausgewählte Seiten zum Sortieren ziehen.",rotateSelected:"Ausgewählte Seiten drehen",deleteSelected:"Ausgewählte Seiten löschen",extractSelected:"Ausgewählte Seiten herunterladen",actions:{edit:{title:"PDF bearbeiten",before:"Wähle ein PDF, um Text, Bilder und Seiten zu bearbeiten.",after:"Unterstützte Objekte ziehen oder an den Eckgriffen skalieren. Text zum Bearbeiten doppelt anklicken."},merge:{title:"PDFs zusammenführen",before:"Wähle das erste PDF. Hänge danach weitere PDFs in der gewünschten Reihenfolge an.",after:"Wähle «Weiteres PDF anfügen» für jede weitere Datei. Lade danach das zusammengeführte PDF herunter."},extract:{title:"PDF-Seiten extrahieren",before:"Wähle ein PDF und kreuze die Seiten an, die du herunterladen möchtest.",after:"Kreuze eine oder mehrere, auch getrennte Seiten an. Der Download folgt der Dokumentreihenfolge."},rotate:{title:"PDF-Seiten drehen",before:"Wähle ein PDF und danach die Seiten zum Drehen.",after:"Kreuze die gewünschten Seiten an. Jede Aktion dreht alle ausgewählten Seiten um 90 Grad im Uhrzeigersinn."},count:{title:"PDF-Seiten zählen",before:"Wähle ein PDF, um die Seitenzahl zu sehen.",after:"Dieses PDF enthält {count} Seiten."},organize:{title:"PDF-Seiten ordnen",before:"Wähle ein PDF, um Seiten auszuwählen, zu sortieren oder zu entfernen.",after:"Kreuze Seiten für gemeinsame Aktionen an. Ziehe sie in die gewünschte Reihenfolge oder nutze die Verschiebeknöpfe."}},recover:"Letzten Bearbeitungsstand wiederherstellen",title:"PDF bearbeiten",intro:"Texte anpassen, Seiten ordnen und Ergänzungen einfügen.",choose:"PDF auswählen",drop:"PDF hier ablegen",limits:"Bis 32 MiB und 200 Seiten. Deine Datei bleibt in diesem Browser.",working:"PDF wird verarbeitet …",cancel:"Abbrechen",download:"PDF herunterladen",original:"Original herunterladen",undo:"Rückgängig",redo:"Wiederholen",saved:"Änderungen heruntergeladen",unsaved:"Ungespeicherte Änderungen",discard:"Ungespeicherte Änderungen verwerfen?",page:"Seite {number}",pages:"Seiten",select:"Auswählen",text:"Text",image:"Bild",highlight:"Markieren",underline:"Unterstreichen",draw:"Zeichnen",note:"Notiz",rectangle:"Rechteck",ellipse:"Ellipse",line:"Linie",signature:"Unterschrift zeichnen",signatureImage:"Unterschrift als Bild",tools:"Werkzeuge",content:"Textinhalt",apply:"Übernehmen",insert:"Einfügen",fontSize:"Schriftgrösse",color:"Farbe",stroke:"Linienstärke",x:"X-Position",y:"Y-Position",width:"Breite",height:"Höhe",placement:"Position ab linker unterer Seitenecke in PDF-Punkten. Du kannst auch direkt auf der Seite platzieren oder zeichnen.",selectHint:"Wähle ein Text- oder Bildobjekt auf der Seite.",textHint:"Unterstützte Textobjekte werden im PDF ersetzt. Es gibt keinen automatischen Absatzumbruch.",unsupportedText:"Dieses Textobjekt lässt sich hier nicht zuverlässig ersetzen. Nutze bei Bedarf neuen Text an einer freien Stelle.",scan:"Auf dieser Seite wurde kein bearbeitbarer Text gefunden. Für Scans ist keine Texterkennung enthalten.",fontHint:"Lateinische Zeichen mit Umlauten. Vollständige eingebettete Schriften und Standardschriften werden unterstützt, Teilmengen und gedrehte Textobjekte können ausgeschlossen sein.",signatureHint:"Eine sichtbare Unterschrift als Bild oder Zeichnung, ohne kryptografische Signatur.",selectedObject:"{type} {number}",objectText:"Textobjekt",objectImage:"Bildobjekt",removeObject:"Objekt löschen",moveLeft:"Nach links",moveRight:"Nach rechts",moveUp:"Nach oben",moveDown:"Nach unten",grow:"Vergrössern",shrink:"Verkleinern",rotate:"Seite drehen",duplicate:"Seite duplizieren",deletePage:"Seite löschen",previous:"Seite nach vorne",next:"Seite nach hinten",blank:"Leere Seite",merge:"Weiteres PDF anfügen",extract:"Seite herunterladen",zoom:"Zoom",search:"Text suchen",searchAction:"Suchen",noResults:"Kein Text gefunden.",matches:"{count} Treffer",preview:"PDF-Seitenvorschau",document:"PDF-Dokument",close:"Dokument schliessen",addHint:"Wähle ein Werkzeug. Klicken platziert Text und Notizen; Ziehen erstellt Formen und Zeichnungen.",errors:{unsupported_structure:"Vorhandene Formularstrukturen lassen sich bei diesem Vorgang nicht zuverlässig erhalten. Das PDF wurde nicht verändert.",invalid_file:"Das PDF konnte nicht verarbeitet werden. Wähle eine gültige, unverschlüsselte Datei.",resource_limit:"Die Datei oder dieser Arbeitsschritt überschreitet das lokale Limit. Verwende eine kleinere Datei oder einen tieferen Zoom.",unsupported_text:"Diese Schrift, Zeichen oder Textausrichtung wird nicht unterstützt. Die Änderung wurde verworfen.",last_page:"Die letzte Seite kann nicht gelöscht werden.",cancelled:"Verarbeitung abgebrochen.",unsupported_browser:"Dieser Browser unterstützt den PDF-Arbeitsbereich nicht."}},Ya={title:"Rechner",intro:"Zahlen einsetzen. Ergebnis direkt sehen.",choose:"Rechner wählen",calculators:{percent:"Prozent","rule-of-three":"Dreisatz",pythagoras:"Pythagoras",circle:"Kreis",area:"Flächen",volume:"Volumen",units:"Einheiten"},descriptions:{percent:"Anteil, Prozentsatz und Veränderung","rule-of-three":"Direkt proportionale Werte",pythagoras:"Seiten im rechtwinkligen Dreieck",circle:"Radius, Durchmesser, Umfang und Fläche",area:"Rechteck und Dreieck",volume:"Quader und Zylinder",units:"Längen, Gewichte, Temperaturen und mehr"},operation:"Berechnung",percentModes:{of:"Wie viel sind X % von Y?",share:"Wie viel Prozent sind X von Y?",change:"Prozentuale Veränderung"},fields:{rate:"Prozentsatz",base:"Grundwert",part:"Anteil",previous:"Ausgangswert",next:"Neuer Wert",first:"Wert A",second:"Entspricht B",third:"Gesuchter Wert C",a:"Kathete a",b:"Kathete b",c:"Hypotenuse c",radius:"Radius",diameter:"Durchmesser",width:"Breite",triangleBase:"Grundseite",height:"Höhe",depth:"Tiefe",value:"Wert"},missing:"Gesuchte Seite",knownMeasure:"Bekannte Grösse",shape:"Form",shapes:{rectangle:"Rechteck",triangle:"Dreieck",cuboid:"Quader",cylinder:"Zylinder"},category:"Grösse",categories:{length:"Länge",area:"Fläche",volume:"Volumen",mass:"Gewicht",temperature:"Temperatur",time:"Zeit",speed:"Geschwindigkeit",storage:"Speichergrösse"},from:"Von",to:"Nach",swap:"Einheiten tauschen",clear:"Leeren",resultHeading:"Ergebnis",empty:"Werte eingeben",emptyHint:"Das Ergebnis erscheint hier.",formula:"Formel",results:{result:"Ergebnis",a:"Kathete a",b:"Kathete b",c:"Hypotenuse c",radius:"Radius",diameter:"Durchmesser",circumference:"Umfang",area:"Fläche",perimeter:"Umfang",volume:"Volumen"},unitSquared:"Quadrateinheiten",unitCubed:"Kubikeinheiten",sameUnits:"Alle Längen in derselben Einheit eingeben.",triangleHint:"Die Höhe steht senkrecht auf der Grundseite.",pythagorasHint:"c ist die längste Seite, gegenüber dem rechten Winkel.",ruleHint:"A entspricht B. Wie viel entspricht dann C?",percentChangeHint:"Der Ausgangswert muss grösser als null sein.",decimalHint:"Dezimalkomma oder Dezimalpunkt, ohne Tausendertrennzeichen.",precision:"Anzeige mit bis zu 12 signifikanten Stellen.",storageHint:"MB, GB und TB sind dezimal (1000). MiB, GiB und TiB sind binär (1024). Alle Angaben in Byte.",temperatureHint:"Temperaturen ab dem absoluten Nullpunkt.",errors:{number:"Gib eine gültige, endliche Zahl ein.",positive:"Dieser Wert muss grösser als null sein.",nonzero:"Dieser Wert darf nicht null sein.",nonnegative:"Dieser Wert darf nicht negativ sein.",hypotenuse:"c muss grösser als die bekannte Kathete sein.",temperature:"Die Temperatur liegt unter dem absoluten Nullpunkt.",range:"Diese Zahlen sind für eine zuverlässige Berechnung zu gross oder zu klein.",selection:"Wähle eine gültige Berechnung und passende Einheiten."},unitNames:{length:{m:"Meter",cm:"Zentimeter",mm:"Millimeter",km:"Kilometer",in:"Zoll",ft:"Fuss",yd:"Yard",mi:"Meile"},area:{m2:"Quadratmeter",cm2:"Quadratzentimeter",mm2:"Quadratmillimeter",km2:"Quadratkilometer",ha:"Hektar",ft2:"Quadratfuss"},volume:{l:"Liter",ml:"Milliliter",m3:"Kubikmeter",cm3:"Kubikzentimeter",usgal:"US-Gallone"},mass:{kg:"Kilogramm",g:"Gramm",mg:"Milligramm",t:"Tonne",lb:"Pfund (lb)",oz:"Unze"},temperature:{C:"Celsius",F:"Fahrenheit",K:"Kelvin"},time:{h:"Stunde",min:"Minute",s:"Sekunde",ms:"Millisekunde",day:"Tag",week:"Woche"},speed:{kmh:"Kilometer pro Stunde",ms:"Meter pro Sekunde",mph:"Meilen pro Stunde",kn:"Knoten"},storage:{B:"Byte",kB:"Kilobyte",MB:"Megabyte",GB:"Gigabyte",TB:"Terabyte",KiB:"Kibibyte",MiB:"Mebibyte",GiB:"Gibibyte",TiB:"Tebibyte"}}},Fy={...Ya,calculators:{...Ya.calculators,"aspect-ratio":"Seitenverhältnis",loan:"Kreditrate",bmi:"BMI",date:"Datum",duration:"Zeitspannen"},descriptions:{...Ya.descriptions,"aspect-ratio":"Verhältnis vereinfachen und Bildgrössen anpassen",loan:"Monatsrate, Rückzahlung und Zinsen",bmi:"Body-Mass-Index aus Gewicht und Grösse",date:"Tage zählen und ein Datum verschieben",duration:"Zeiten addieren und abziehen"},fields:{...Ya.fields,pixelWidth:"Breite (px)",pixelHeight:"Höhe (px)",targetWidth:"Zielbreite (px)",principal:"Kreditbetrag",annualRate:"Jahreszins (%)",months:"Laufzeit (Monate)",weight:"Gewicht (kg)",bodyHeight:"Grösse (cm)",startDate:"Startdatum",endDate:"Enddatum",days:"Anzahl Tage",hours:"Stunden",minutes:"Minuten",seconds:"Sekunden"},aspectModes:{ratio:"Verhältnis berechnen",resize:"Grösse anpassen"},results:{...Ya.results,ratio:"Seitenverhältnis",targetWidth:"Zielbreite",targetHeight:"Zielhöhe",monthlyPayment:"Monatsrate",totalPayment:"Rückzahlung gesamt",totalInterest:"Zinsen gesamt",bmi:"BMI",days:"Tage zwischen den Daten",date:"Neues Datum",duration:"Gesamtdauer",totalSeconds:"Sekunden gesamt"},example:"Beispiel",copy:"Kopieren",copied:"Kopiert",copyError:"Kopieren fehlgeschlagen",copyResult:"{name} kopieren",dateModes:{difference:"Tage zwischen zwei Daten",add:"Tage hinzufügen oder abziehen"},dateDifferenceHint:"Das Startdatum wird nicht mitgezählt. Ein früheres Enddatum ergibt einen negativen Wert.",dateAddHint:"Mit einer negativen Anzahl gehst du zurück.",dateDifferenceFormula:"Kalendertage vom Startdatum bis zum Enddatum",dateAddFormula:"Neues Datum = Startdatum + Anzahl Tage",durationFormula:`Sekunden = Stunden × 3600 + Minuten × 60 + Sekunden
Alle Zeitspannen mit ihrem Vorzeichen zusammenzählen.`,durationHint:"Minuten und Sekunden von 0 bis 59. Leere Felder zählen als 0.",durationRow:"Zeitspanne {number}",durationOperation:"Rechenzeichen für Zeitspanne {number}",removeDuration:"Zeitspanne {number} entfernen",addDuration:"Zeitspanne hinzufügen",add:"Addieren",subtract:"Abziehen",remove:"Entfernen",roundedPrecision:"Gerundete Anzeige; sehr kleine und grosse Werte mit bis zu 12 Stellen.",aspectHint:"Breite und Höhe in ganzen Pixeln eingeben.",aspectResizeHint:"Die Zielhöhe wird auf ganze Pixel gerundet.",aspectRatioFormula:"Breite : Höhe, vollständig gekürzt",aspectResizeFormula:"Zielhöhe = Zielbreite × Höhe ÷ Breite",loanHint:"Gleichbleibender Jahreszins, Raten am Monatsende, ohne Gebühren. Alle Beträge in derselben Währung.",loanFormula:`Rate = Betrag × i ÷ (1 − (1 + i)⁻ⁿ)
i = Jahreszins ÷ 1200; n = Monate
Bei 0 %: Betrag ÷ Monate`,bmiHint:"Orientierungswert für Erwachsene.",errors:{...Ya.errors,integer:"Gib eine ganze Pixelzahl ein.",dimension:"Die Bildabmessungen müssen zwischen 1 und 1000000000 Pixeln liegen.",rate:"Der Jahreszins muss zwischen 0 und 100 % liegen.",months:"Gib eine ganze Laufzeit zwischen 1 und 1200 Monaten ein.",date:"Wähle ein gültiges Datum zwischen den Jahren 1 und 9999.",days:"Gib eine ganze Anzahl Tage zwischen −3652058 und 3652058 ein.",dateRange:"Das Ergebnis liegt ausserhalb der Jahre 1 bis 9999.",durationRows:"Verwende 1 bis 50 Zeitspannen.",durationHours:"Gib ganze Stunden von 0 bis 999999 ein.",durationPart:"Gib eine ganze Zahl von 0 bis 59 ein."}},Ny=Object.freeze({...Ay,studioConvert:wy,studioPdf:Ry,studioCalculate:Fy,shell:Object.freeze({skip:"Zum Inhalt springen",home:"Startseite",tools:"Weitere Werkzeuge",qr:"QR-Codes",pdf:"PDF",convert:"Konvertieren",calculate:"Rechner",loading:"Wird geladen …",loadError:"Der Arbeitsbereich konnte nicht geladen werden.",retry:"Erneut laden",unsaved:"Du hast ungespeicherte PDF-Änderungen. Wirklich verlassen?",privacyStatus:"Lokal verarbeitet",localeLabel:"Sprache wählen",themeToggle:"Dunkles Design",menuOpen:"Menü öffnen",menuClose:"Menü schliessen",mobileNavigation:"Mobile Navigation",primaryNavigation:"Hauptnavigation",privacy:"Datenschutz",openSource:"Open Source",licenses:"Lizenzen",terms:"Nutzungsbedingungen",contact:"Kontakt",source:"Quellcode",footerNavigation:"Fussnavigation",footerNote:"Deine Dateien bleiben bei dir."}),home:Object.freeze({eyebrow:"Werkzeuge für den Alltag",title:"Was möchtest du machen?",intro:"Deine Werkzeuge. Direkt im Browser.",sampleTitle:"Projektplan",sampleLine1:"Ideen festhalten.",sampleLine2:"Details bearbeiten.",sampleLine3:"Weiter geht’s.",privacyTitle:"Deine Dateien bleiben in diesem Browser.",privacyBody:"Folkkit überträgt keine Dateiinhalte zur Verarbeitung. Der statische Webhost kann beim Seitenaufruf technische Zugriffsdaten erhalten.",pdfTitle:"PDF bearbeiten",pdfBody:"Texte, Markierungen und Seiten.",qrTitle:"QR-Code erstellen",qrBody:"Mit Farben, Formen und eigenem Logo.",convertTitle:"Datei konvertieren",convertBody:"Bilder, Dokumente, Audio und Video.",calculateTitle:"Rechner & Einheiten",calculateBody:"Prozente, Geometrie und Einheiten.",catalogLink:"Weitere Werkzeuge entdecken"}),catalog:Object.freeze({toolCount:"{count} Werkzeuge",eyebrow:"Werkzeugkatalog",title:"Weitere Werkzeuge",intro:"Für Text, Daten und kleine Aufgaben zwischendurch.",openTool:"{name} öffnen",search:"Werkzeuge suchen",searchPlaceholder:"Name oder Aufgabe",category:"Kategorie",allCategories:"Alle Kategorien",favoritesOnly:"Nur Favoriten",addFavorite:"{name} zu Favoriten hinzufügen",removeFavorite:"{name} aus Favoriten entfernen",filteredCount:"{count} von {total} Werkzeugen",empty:"Keine passenden Werkzeuge",emptyHint:"Versuche einen anderen Suchbegriff oder entferne einen Filter.",clearFilters:"Filter zurücksetzen",storageError:"Dein Browser speichert die Favoriten gerade nicht. Sie bleiben bis zum Verlassen dieser Seite verfügbar.",studioCategory:"Studio",qrReader:"QR-Code lesen",qrReaderDescription:"Inhalt aus einem QR-Bild auslesen",imageOptimize:"Bilder verkleinern",imageOptimizeDescription:"Dateigrösse und Abmessungen anpassen"}),workspace:Object.freeze({eyebrow:"Werkzeug",title:"Datei lokal bearbeiten",intro:"Eingabe wählen und Ergebnis mitnehmen.",dropOverlay:"Datei zum Konvertieren ablegen",unsupportedDrop:"Dieser Dateityp lässt sich hier nicht öffnen. Wähle ein passendes Werkzeug.",pairTitle:"{from} in {to}",pairDescription:"{from} lokal in {to} umwandeln. Dateiinhalte werden nicht hochgeladen.",toolDescription:"{name} lokal im Browser verwenden. Dateiinhalte werden nicht hochgeladen."}),keyboardHelp:Object.freeze({title:"Tastaturkürzel",convertGroup:"Konvertierungsbereich",focusInput:"Eingabefeld fokussieren",swap:"Eingabe ↔ Ausgabe tauschen",copyOutput:"Ausgabe kopieren",reset:"Konvertierung zurücksetzen",toggleBatch:"Stapelmodus umschalten",backToFormats:"Zurück zur Formatauswahl",globalGroup:"Allgemein",toggleTheme:"Zwischen hellem und dunklem Design wechseln",thisHelp:"Diese Hilfe",footer:"Mit ? oder Esc schliessen",close:"Tastaturhilfe schliessen",closeVisible:"Schliessen"}),workspaceTools:Object.freeze({input:"Eingabe",output:"Ergebnis",inputText:"Eingabetext",conversionResult:"Konvertierungsergebnis",toolInputText:"Werkzeugeingabe",toolOutputText:"Werkzeugergebnis",formatInputPlaceholder:"Wert eingeben oder einfügen",resultPlaceholder:"Ergebnis erscheint hier",parametersPlaceholder:"Parameter eingeben",clear:"Zurücksetzen",clearInput:"Eingabe löschen",selectFile:"Datei auswählen",selectFiles:"PDF-Dateien auswählen",dropFile:"Datei hier ablegen oder auswählen",dropFiles:"Dateien hier ablegen oder auswählen",convert:"Konvertieren",parameters:"Werkzeugparameter",progressLabel:"Fortschritt",processing:"Verarbeitung läuft: {progress}",loadingRuntime:"Medienmodul wird lokal geladen.",loadingTool:"Werkzeug wird lokal geladen.",mediaModuleUnavailable:"Das Medienmodul ist offline noch nicht verfügbar. Stelle die Internetverbindung wieder her und versuche es erneut.",toolModuleUnavailable:"Dieses Werkzeugmodul ist offline noch nicht verfügbar. Stelle die Internetverbindung wieder her und versuche es erneut.",retryModule:"Erneut versuchen",cancel:"Abbrechen",download:"Herunterladen",copy:"Kopieren",copied:"Ergebnis kopiert",copiedToClipboard:"In Zwischenablage kopiert",copiedOutput:"Ausgabe kopiert",linkCopied:"Link kopiert",shareLinkCopied:"Freigabelink kopiert",discard:"Verwerfen",previewAlt:"Lokale Ergebnisvorschau",shareTool:"Werkzeug teilen",moreFiles:"{count} weitere Dateien",detected:"erkannt",selectInput:"Eingabe auswählen: {name}",selectOutput:"Ausgabeformat auswählen: {name}",swap:"Formate tauschen",noReverseConversion:"Keine umgekehrte Konvertierung verfügbar",enableBatch:"Stapelmodus aktivieren",disableBatch:"Stapelmodus deaktivieren",addFavourite:"Formatpaar zu Favoriten hinzufügen",removeFavourite:"Formatpaar aus Favoriten entfernen",pickColor:"Farbe auswählen",copyResult:"Ergebnis kopieren",downloadResult:"Ergebnis herunterladen",useAsInput:"Ergebnis als Eingabe verwenden",wordWrapOn:"Zeilenumbruch aktiv",wordWrapOff:"Zeilenumbruch inaktiv",showLineNumbers:"Zeilennummern anzeigen",hideLineNumbers:"Zeilennummern ausblenden",shareConversion:"Konvertierung teilen",colorPreview:"Farbvorschau",base64Preview:"Base64-Vorschau",chain:"Weiterverarbeiten",generate:"Erzeugen",saveResult:"Ergebnis speichern",inputStats:"Zeichen {characters} · Wörter {words} · Zeilen {lines}",outputStats:"Zeichen {characters} · Zeilen {lines}",characterCount:"Zeichen: {count}",byteCount:"{count} Bytes"}),history:Object.freeze({consent:"Der lokale Verlauf wird erst nach deiner Zustimmung in diesem Browser gespeichert.",enable:"Lokalen Verlauf aktivieren",recent:"Letzte Konvertierungen",deleteAndDisable:"Verlauf löschen und deaktivieren",empty:"Noch kein lokaler Verlauf.",remove:"Aus Verlauf entfernen",copy:"Ergebnis kopieren",reuse:"Wiederverwenden",copied:"In Zwischenablage kopiert",now:"jetzt",minutesAgo:"vor {count} Min.",hoursAgo:"vor {count} Std.",daysAgo:"vor {count} Tagen"}),toolPicker:Object.freeze({searchConversions:"Konvertierungen durchsuchen",searchFormats:"Formate durchsuchen",searchConversionsPlaceholder:"Alle Konvertierungen durchsuchen …",searchFormatsPlaceholder:"Formate durchsuchen …",formats:"Formate",tools:"Werkzeuge",noResults:"Keine Ergebnisse",noFormats:"Keine Formate gefunden",noItems:"Keine Einträge in dieser Kategorie",recent:"Zuletzt verwendet",tabs:Object.freeze({text:"Text",encode:"Codierung",data:"Daten",number:"Zahlen",hash:"Prüfwerte",color:"Farben",units:"Einheiten",image:"Bilder",media:"Audio und Video",document:"PDF und Dokumente",utility:"Hilfsmittel"}),groups:Object.freeze({Text:"Text",Case:"Gross- und Kleinschreibung",Data:"Daten",Number:"Zahlen",Color:"Farben",Recent:"Zuletzt verwendet"})}),errorBoundary:Object.freeze({message:"Bei diesem Werkzeug ist ein Fehler aufgetreten.",retry:"Erneut versuchen"}),errors:Object.freeze({unsupportedType:"Dieser Dateityp wird von diesem Werkzeug nicht unterstützt.",unsupportedPair:"Für dieses Formatpaar existiert keine Konvertierung.",unsupportedBrowser:"QR-Codes können in diesem Browser nicht gelesen werden.",tooLarge:"Die ausgewählte Datei ist für dieses Gerät zu gross.",invalidFile:"Die Datei ist beschädigt oder ungültig.",outOfMemory:"Der verfügbare Speicher reicht für diese Verarbeitung nicht aus.",cancelled:"Der Vorgang wurde abgebrochen.",conversionFailed:"Die Verarbeitung ist fehlgeschlagen.",mediaRuntimeUnavailable:"FFmpeg-Core und WASM sind offline nicht verfügbar. Stelle die Internetverbindung wieder her und versuche es erneut.",resourceLimit:"Die Eingabe überschreitet die sichere Verarbeitungsgrenze."}),formatCompatibility:Object.freeze({warningTitle:"Diese Dateiformate sind nicht miteinander kompatibel.",warningBody:"Die vorhandene Konvertierungsfunktion ist nur für einen bewussten Spezialfall vorgesehen. Prüfe das Ergebnis sorgfältig.",confirmation:"Ich weiss, was ich mache, und verstehe, dass diese Dateiformate nicht miteinander kompatibel sind."}),labels:Object.freeze({experimental:"Experimentell",mediaWarning:"Experimentell. Das lokale Medienmodul benötigt je nach Datei viel Speicher und Rechenleistung."}),categories:Object.freeze({encode:"QR und Codierung",hash:"Prüfwerte",data:"Daten",number:"Zahlen",color:"Farben",utility:"Hilfsmittel",image:"Bilder",media:"Audio und Video",document:"PDF und Dokumente"}),tools:Object.freeze({base64Encode:Object.freeze({name:"Base64 codieren",description:"Text lokal in Base64 umwandeln",placeholder:"Text eingeben oder einfügen"}),base64Decode:Object.freeze({name:"Base64 decodieren",description:"Base64 lokal in Text zurückwandeln"}),urlEncode:Object.freeze({name:"URL codieren",description:"Text für eine URL percent-codieren"}),urlDecode:Object.freeze({name:"URL decodieren",description:"Percent-codierten URL-Text zurückwandeln"}),htmlEncode:Object.freeze({name:"HTML-Zeichen maskieren",description:"HTML-Sonderzeichen durch Entities ersetzen"}),htmlDecode:Object.freeze({name:"HTML-Entities decodieren",description:"HTML-Entities in Zeichen zurückwandeln"}),hexEncode:Object.freeze({name:"Text in Hex",description:"Text lokal in Hexadezimalwerte umwandeln"}),hexDecode:Object.freeze({name:"Hex in Text",description:"Hexadezimalwerte lokal in Text umwandeln"}),binaryEncode:Object.freeze({name:"Text in Binär",description:"Text lokal in Binärwerte umwandeln"}),binaryDecode:Object.freeze({name:"Binär in Text",description:"Binärwerte lokal in Text umwandeln"}),unicodeEscape:Object.freeze({name:"Unicode maskieren",description:"Text in Unicode-Escape-Sequenzen umwandeln"}),unicodeUnescape:Object.freeze({name:"Unicode-Escapes decodieren",description:"Unicode-Escape-Sequenzen in Text zurückwandeln"}),rot13:Object.freeze({name:"ROT13",description:"ROT13 lokal auf Text anwenden"}),atbash:Object.freeze({name:"Atbash",description:"Das lateinische Alphabet lokal spiegeln"}),sha256:Object.freeze({name:"SHA-256-Prüfwert",description:"SHA-256-Prüfwert eines Textes berechnen"}),jsonPrettify:Object.freeze({name:"JSON formatieren",description:"JSON mit Einrückungen lesbar formatieren"}),jsonMinify:Object.freeze({name:"JSON minimieren",description:"Unnötige Leerzeichen aus JSON entfernen"}),jsonEscape:Object.freeze({name:"JSON-String maskieren",description:"Text als JSON-String maskieren"}),csvToJson:Object.freeze({name:"CSV in JSON",description:"Eine CSV-Tabelle in ein JSON-Array umwandeln"}),decToHex:Object.freeze({name:"Dezimal in Hex",description:"Eine Dezimalzahl in Hexadezimal umwandeln"}),hexToDec:Object.freeze({name:"Hex in Dezimal",description:"Eine Hexadezimalzahl in Dezimal umwandeln"}),decToBin:Object.freeze({name:"Dezimal in Binär",description:"Eine Dezimalzahl in Binär umwandeln"}),binToDec:Object.freeze({name:"Binär in Dezimal",description:"Eine Binärzahl in Dezimal umwandeln"}),decToOct:Object.freeze({name:"Dezimal in Oktal",description:"Eine Dezimalzahl in Oktal umwandeln"}),octToDec:Object.freeze({name:"Oktal in Dezimal",description:"Eine Oktalzahl in Dezimal umwandeln"}),colorConvert:Object.freeze({name:"Farbwert umwandeln",description:"Zwischen HEX, RGB und HSL umwandeln"}),cssMinify:Object.freeze({name:"CSS minimieren",description:"Kommentare und unnötige Leerzeichen aus CSS entfernen"}),jsonValidate:Object.freeze({name:"JSON-Syntax prüfen",description:"JSON-Syntax lokal parsen und Fehler anzeigen"}),base64urlEncode:Object.freeze({name:"Base64URL codieren",description:"Text in URL-sicheres Base64 umwandeln"}),base64urlDecode:Object.freeze({name:"Base64URL decodieren",description:"URL-sicheres Base64 in Text zurückwandeln"}),slugGen:Object.freeze({name:"URL-Slug erstellen",description:"Text in einen einfachen URL-Slug umwandeln"}),charCount:Object.freeze({name:"Zeichen und Wörter zählen",description:"Zeichen, Wörter, Zeilen und Bytes lokal zählen"}),reverseText:Object.freeze({name:"Text umkehren",description:"Die Reihenfolge der Zeichen umkehren"}),percentageCalc:Object.freeze({name:"Prozent berechnen",description:"Einfache Prozentaufgaben lokal berechnen",placeholder:"15% von 200"}),aspectRatio:Object.freeze({name:"Seitenverhältnis berechnen",description:"Ein begrenztes Seitenverhältnis aus Breite und Höhe berechnen"}),loanCalc:Object.freeze({name:"Kreditrate berechnen",description:"Monatsrate, Gesamtkosten und Tilgungsverlauf aus Betrag, Zinssatz und Laufzeit schätzen",placeholder:"250000 4.5% 30",notice:"Nur eine lokale Rechenhilfe, keine Finanzberatung."}),bmiCalc:Object.freeze({name:"BMI berechnen",description:"Den Body-Mass-Index aus Gewicht und Grösse berechnen",placeholder:"70kg 175cm",notice:"Nur eine allgemeine Rechenhilfe, keine medizinische Beratung."}),pngToJpg:Object.freeze({name:"PNG in JPEG",description:"Ein PNG-Bild lokal in JPEG umwandeln"}),jpgToPng:Object.freeze({name:"JPEG in PNG",description:"Ein JPEG-Bild lokal in PNG umwandeln"}),audioToMp3:Object.freeze({name:"Audio in MP3",description:"Eine Audiodatei lokal in MP3 umwandeln"}),textToQr:Object.freeze({name:"Text in QR-Code",description:"QR-Code aus Text oder einem Link erstellen",placeholder:"Text oder Link eingeben"}),imagesToPdf:Object.freeze({name:"Bilder in PDF",description:"Mehrere Bilder zu einem PDF zusammenführen"}),mergePdf:Object.freeze({name:"PDFs zusammenführen",description:"Mehrere PDF-Dateien zu einer Datei zusammenführen"}),pdfPageCount:Object.freeze({name:"PDF-Seiten zählen",description:"Anzahl Seiten einer PDF-Datei ermitteln"}),pdfSplit:Object.freeze({name:"PDF-Seite extrahieren",description:"Eine einzelne Seite aus einer PDF-Datei extrahieren",parameterPlaceholder:"Seitennummer, zum Beispiel 1"}),pdfExtractRange:Object.freeze({name:"PDF-Seiten extrahieren",description:"Einen Seitenbereich aus einer PDF-Datei extrahieren",parameterPlaceholder:"Seitenbereich, zum Beispiel 1-5 oder 1,3,5"}),textToPdf:Object.freeze({name:"Text in PDF",description:"Klartext in ein einfaches PDF-Dokument umwandeln",placeholder:"Text eingeben oder einfügen"}),pdfMetadata:Object.freeze({name:"PDF-Metadaten",description:"Titel, Autor und weitere PDF-Metadaten anzeigen"}),pdfRotate:Object.freeze({name:"PDF-Seiten drehen",description:"Alle Seiten einer PDF-Datei drehen",parameterPlaceholder:"Grad: 90, 180 oder 270"})})}),Iy=Object.freeze({studioQr:Object.freeze({title:"Design a QR code",intro:"Enter content and adjust the design.",modeLabel:"QR tool",modeCreate:"Create",modeRead:"Read",tabsLabel:"QR settings",tabContent:"Content",tabDesign:"Design",tabLogo:"Logo",contentType:"Content type",typeText:"Text",typeUrl:"URL",typeWifi:"Wi-Fi",typeContact:"Contact",typeEmail:"Email",typeSms:"SMS",contentLabel:"Content",textPlaceholder:"Enter text for the QR code",urlPlaceholder:"Paste a web address",wifiName:"Network name",wifiEncryption:"Security",wifiOpen:"Open network",wifiPassword:"Password",wifiHidden:"Network is hidden",contactName:"Name",contactOrganization:"Organisation",phone:"Phone number",emailAddress:"Email address",website:"Website",emailTo:"Recipient address",emailSubject:"Subject",message:"Message",fieldErrors:Object.freeze({single_line:"Line breaks, tabs and control characters are not supported here.",required:"This field is required.",http_url:"Enter a complete HTTP or HTTPS address.",email:"Enter a valid email address.",phone:"Enter a valid phone number."}),byteUsage:"{used} of {capacity} bytes",capacityRemaining:"The QR code is almost full. {remaining} bytes remain.",correctionLevel:"Error correction {level}",capacityError:"The content is too long for a QR code with the current settings.",foreground:"Foreground",background:"Background",foregroundPresets:"Foreground colours",backgroundPresets:"Background colours",selectForegroundPreset:"{color} as foreground",selectBackgroundPreset:"{color} as background",colourGraphite:"Graphite",colourGreen:"Green",colourBlue:"Blue",colourPurple:"Purple",colourTerracotta:"Terracotta",colourWhite:"White",colourLightNeutral:"Light neutral",colourMint:"Mint",colourLightBlue:"Light blue",colourRose:"Rose",contrastWarning:"The contrast is low. Use clearly different colours so scanners can read the code reliably.",moduleStyle:"Module style",cornerFrameStyle:"Corner frame",cornerDotStyle:"Corner dot",styleSquare:"Square",styleRounded:"Rounded",styleDots:"Dots",styleExtraRounded:"Extra rounded",size:"Export size",sizeValue:"{value} px",quietZone:"Quiet zone",quietZoneValue:"{value} modules",quietZoneHint:"At least four clear modules protect readability.",logoInput:"Choose logo",logoAcceptHint:"PNG, JPEG, or WebP, up to 4 MB and 12 megapixels.",logoSelected:"Selected: {name}",logoRemove:"Remove logo",logoSize:"Logo size",logoSizeValue:"{value}%",logoSpacing:"Space around logo",logoSpacingValue:"{value} px",cropZoom:"Crop zoom",cropControlLabel:"Move logo crop",cropHint:"Drag the image inside the frame. Use the arrow keys for small steps and Shift for larger steps.",cropCenter:"Centre",logoSafety:"When a logo is present, Folkkit automatically uses high error correction H.",invalidLogo:"This file is not a valid PNG, JPEG, or WebP image.",largeLogo:"The logo is too large. Use no more than 4 MB and 12 megapixels.",unsupportedLogo:"This browser cannot process the logo locally.",previewTitle:"Preview",previewAlt:"QR code preview",previewUpdating:"Updating preview…",previewError:"The preview could not be created. Check the content and settings.",downloadPng:"Download PNG",downloadSvg:"Download SVG",downloading:"Preparing download…",downloadError:"The QR code could not be exported.",reset:"Reset",readerTitle:"Read a QR code",readerIntro:"Read QR codes from photos and screenshots.",readerInput:"Choose QR image",readerHint:"PNG, JPEG, or WebP, up to 12 MB and 12 megapixels.",readerProgress:"Reading QR code…",readerCancel:"Cancel",readerResult:"Decoded content",readerCopy:"Copy content",readerCopied:"Content copied.",readerOpenLink:"Open link",readerReset:"Choose another image",readerErrors:Object.freeze({invalid_file:"This file is not a valid PNG, JPEG, or WebP image.",too_large:"The image is too large. Use no more than 12 MB and 12 megapixels.",not_found:"No QR code was found. Check that the whole code is sharp and visible.",timeout:"Reading took too long. Try a smaller or sharper image.",unsupported_browser:"This browser cannot read the image locally.",decode_failed:"The image could not be read.",copy_failed:"The content could not be copied."})})}),xy={title:"Convert files",subtitle:"Images, PDFs, audio and video.",optimizeTitle:"Make images smaller",optimizeSubtitle:"Re-encode or proportionally resize PNG, JPEG and WebP images on this device.",limitsLabel:"File limits",modeLabel:"Workspace mode",modeConvert:"Convert",modeOptimize:"Make images smaller",choose:"Choose files",add:"Add files",drop:"Drop your files here",dropHint:"PNG, JPEG, WebP, PDF, MP3, WAV, FLAC, OGG, MP4, WebM, MOV",optimizeDropHint:"PNG, JPEG or WebP",limits:"Up to 20 files · 100 MiB per file (PDF: 32 MiB) · 250 MiB total · 64 MiB per result",width:"Width (px)",height:"Height (px)",maxWidth:"Maximum width (px)",maxHeight:"Maximum height (px)",qualityLevel:"Quality level",qualitySmall:"More compression",qualityBalanced:"Balanced",qualityHigh:"High quality",pageSize:"PDF page size",original:"Original image size",orientation:"Orientation",portrait:"Portrait",landscape:"Landscape",dpi:"PDF resolution",bitrate:"MP3 bitrate",flacLevel:"FLAC compression level",vorbisQuality:"Vorbis quality",resolution:"Video resolution",trim:"Choose a video clip",wavHint:"WAV: uncompressed PCM16.",commonTarget:"Output for all files",individual:"Choose per file",target:"Output format",files:"Files",convert:"Convert files",optimize:"Start optimization",cancel:"Cancel conversion",cancelOptimize:"Cancel optimization",clear:"Clear files",remove:"Remove",retry:"Retry",download:"Download",downloadZip:"Download all as ZIP",downloadFileZip:"Download results as ZIP",fileNumber:"file",creatingZip:"Preparing ZIP…",quality:"Quality (%)",pages:"PDF pages",pagesHint:"All pages, or for example 1-3,5. Maximum 100 pages.",clipStart:"Clip start (seconds)",clipDuration:"Clip length (seconds)",clipHint:"Select a clip up to 30 seconds. GIF: 720 px, 12 fps.",imageHint:"Leave dimensions empty for original size. Aspect ratio stays the same. JPEG uses a white background.",optimizeHint:"Leave both limits empty to keep the original dimensions. Larger values never upscale the image.",optimizePngHint:"PNG has no ineffective quality control. Leave both limits empty for original dimensions; larger values never upscale the image.",audioHint:"MP3: 192 kbit/s · WAV: PCM16 · FLAC: level 5 · OGG: Vorbis quality 5",videoHint:"Maximum 1080p, no upscaling. MP4: H.264/AAC · WebM: VP8/Opus.",combine:"Combine images into one PDF in this order",moveUp:"Move up",moveDown:"Move down",combined:"Included in the combined PDF",local:"Files stay on this device.",settings:"Settings",unknown:"Unknown format",optimizeUnsupported:"Only PNG, JPEG and WebP images can be processed in this mode.",before:"Before",after:"After",result:"Result",keptOriginal:"These settings would not reduce the file size. The original is provided instead.",reducedBy:"File size reduced by",largerResult:"The resulting file is larger than the original.",largerAfterResize:"The dimensions changed, but the resulting file is larger.",sameSize:"The file size is unchanged.",downloadResult:"Download result",status:{detecting:"Checking format…",ready:"Ready",running:"Processing…",done:"Done",error:"Failed",cancelled:"Cancelled",unsupported:"Not available in this mode"},errors:{invalid_settings:"Choose a supported value for these settings.",unsupported_type:"This file format is not supported.",type_mismatch:"The file content does not match its extension or file type.",unsupported_pair:"This conversion is not available.",too_large:"The selected files exceed the size limit.",resource_limit:"The file exceeds the local processing limit. Try a smaller file or fewer pages.",invalid_file:"The file could not be read.",unsupported_codec:"The actual audio or video codec is not supported.",invalid_pages:"Enter valid page numbers, for example 1-3,5.",invalid_clip:"Choose a clip within the video, with a length of 1 to 30 seconds.",no_audio:"This file contains no supported audio track.",media_runtime_unavailable:"The processing module is not available offline yet. Connect once to load it, then retry.",conversion_failed:"Conversion failed. You can retry this file.",cancelled:"Conversion cancelled."}},Ly={resize:"Resize {corner}",corner:{nw:"top left",ne:"top right",sw:"bottom left",se:"bottom right"},properties:"Properties",allPages:"Select all",clearPages:"Clear selection",selectedPages:"{count} selected",selectPage:"Select page {number}",viewing:"Viewing",pageSelectionHint:"Tick pages for a joint action. Drag selected pages to reorder them.",rotateSelected:"Rotate selected pages",deleteSelected:"Delete selected pages",extractSelected:"Download selected pages",actions:{edit:{title:"Edit PDF",before:"Choose a PDF to edit text, images and pages.",after:"Drag supported objects or resize them with the corner handles. Double-click text to edit it."},merge:{title:"Merge PDFs",before:"Choose the first PDF. Then append further PDFs in the desired order.",after:"Use “Append another PDF” for each additional file. Download the merged PDF when ready."},extract:{title:"Extract PDF pages",before:"Choose a PDF, then tick the pages you want to download.",after:"Tick one or more pages, including separate pages. The download follows the document order."},rotate:{title:"Rotate PDF pages",before:"Choose a PDF, then select the pages to rotate.",after:"Tick the pages to rotate. Each action turns all selected pages 90 degrees clockwise."},count:{title:"Count PDF pages",before:"Choose a PDF to see its page count.",after:"This PDF contains {count} pages."},organize:{title:"Organize PDF pages",before:"Choose a PDF to select, reorder or remove pages.",after:"Tick pages for joint actions. Drag them into order or use the move buttons."}},recover:"Restore the last editing state",title:"Edit PDF",intro:"Change text, arrange pages and add content.",choose:"Choose PDF",drop:"Drop a PDF here",limits:"Up to 32 MiB and 200 pages. Your file stays in this browser.",working:"Processing PDF …",cancel:"Cancel",download:"Download PDF",original:"Download original",undo:"Undo",redo:"Redo",saved:"Changes downloaded",unsaved:"Unsaved changes",discard:"Discard unsaved changes?",page:"Page {number}",pages:"Pages",select:"Select",text:"Text",image:"Image",highlight:"Highlight",underline:"Underline",draw:"Draw",note:"Note",rectangle:"Rectangle",ellipse:"Ellipse",line:"Line",signature:"Draw signature",signatureImage:"Signature image",tools:"Tools",content:"Text content",apply:"Apply",insert:"Insert",fontSize:"Font size",color:"Colour",stroke:"Line width",x:"X position",y:"Y position",width:"Width",height:"Height",placement:"Position from the bottom left of the page in PDF points. You can also place or draw directly on the page.",selectHint:"Select a text or image object on the page.",textHint:"Supported text objects are replaced in the PDF. Paragraphs do not wrap automatically.",unsupportedText:"This text object cannot be replaced reliably here. You can add new text in an empty area.",scan:"No editable text was found on this page. Text recognition for scans is not included.",fontHint:"Latin characters including accents. Standard and complete embedded fonts are supported; subsets and rotated text objects may be excluded.",signatureHint:"A visible signature as an image or drawing, without a cryptographic signature.",selectedObject:"{type} {number}",objectText:"Text object",objectImage:"Image object",removeObject:"Delete object",moveLeft:"Move left",moveRight:"Move right",moveUp:"Move up",moveDown:"Move down",grow:"Make larger",shrink:"Make smaller",rotate:"Rotate page",duplicate:"Duplicate page",deletePage:"Delete page",previous:"Move page earlier",next:"Move page later",blank:"Blank page",merge:"Append another PDF",extract:"Download page",zoom:"Zoom",search:"Search text",searchAction:"Search",noResults:"No text found.",matches:"{count} matches",preview:"PDF page preview",document:"PDF document",close:"Close document",addHint:"Choose a tool. Click to place text and notes; drag to create shapes and drawings.",errors:{unsupported_structure:"Existing form structures cannot be preserved reliably for this operation. The PDF was not changed.",invalid_file:"The PDF could not be processed. Choose a valid, unencrypted file.",resource_limit:"The file or operation exceeds the local limit. Use a smaller file or lower zoom.",unsupported_text:"This font, character or text orientation is unsupported. The change was discarded.",last_page:"The last page cannot be deleted.",cancelled:"Processing cancelled.",unsupported_browser:"This browser does not support the PDF workspace."}},$a={title:"Calculators",intro:"Enter your numbers. See the result.",choose:"Choose a calculator",calculators:{percent:"Percentage","rule-of-three":"Proportion",pythagoras:"Pythagoras",circle:"Circle",area:"Area",volume:"Volume",units:"Units"},descriptions:{percent:"Portion, percentage and change","rule-of-three":"Directly proportional values",pythagoras:"Sides of a right triangle",circle:"Radius, diameter, circumference and area",area:"Rectangle and triangle",volume:"Cuboid and cylinder",units:"Length, weight, temperature and more"},operation:"Calculation",percentModes:{of:"What is X% of Y?",share:"X is what percentage of Y?",change:"Percentage change"},fields:{rate:"Percentage",base:"Base value",part:"Portion",previous:"Original value",next:"New value",first:"Value A",second:"Corresponds to B",third:"New value C",a:"Leg a",b:"Leg b",c:"Hypotenuse c",radius:"Radius",diameter:"Diameter",width:"Width",triangleBase:"Base",height:"Height",depth:"Depth",value:"Value"},missing:"Find side",knownMeasure:"Known measurement",shape:"Shape",shapes:{rectangle:"Rectangle",triangle:"Triangle",cuboid:"Cuboid",cylinder:"Cylinder"},category:"Measurement",categories:{length:"Length",area:"Area",volume:"Volume",mass:"Weight",temperature:"Temperature",time:"Time",speed:"Speed",storage:"Data size"},from:"From",to:"To",swap:"Swap units",clear:"Clear",resultHeading:"Result",empty:"Enter values",emptyHint:"Your result will appear here.",formula:"Formula",results:{result:"Result",a:"Leg a",b:"Leg b",c:"Hypotenuse c",radius:"Radius",diameter:"Diameter",circumference:"Circumference",area:"Area",perimeter:"Perimeter",volume:"Volume"},unitSquared:"square units",unitCubed:"cubic units",sameUnits:"Use the same unit for every length.",triangleHint:"The height is perpendicular to the base.",pythagorasHint:"c is the longest side, opposite the right angle.",ruleHint:"A corresponds to B. What does C correspond to?",percentChangeHint:"The original value must be greater than zero.",decimalHint:"Use a decimal point or comma, without thousands separators.",precision:"Displayed to up to 12 significant digits.",storageHint:"MB, GB and TB are decimal (1000). MiB, GiB and TiB are binary (1024). All values are in bytes.",temperatureHint:"Temperatures must be at or above absolute zero.",errors:{number:"Enter a valid, finite number.",positive:"This value must be greater than zero.",nonzero:"This value cannot be zero.",nonnegative:"This value cannot be negative.",hypotenuse:"c must be longer than the known leg.",temperature:"This temperature is below absolute zero.",range:"These numbers are too large or too small for a reliable calculation.",selection:"Choose a valid calculation and compatible units."},unitNames:{length:{m:"Metre",cm:"Centimetre",mm:"Millimetre",km:"Kilometre",in:"Inch",ft:"Foot",yd:"Yard",mi:"Mile"},area:{m2:"Square metre",cm2:"Square centimetre",mm2:"Square millimetre",km2:"Square kilometre",ha:"Hectare",ft2:"Square foot"},volume:{l:"Litre",ml:"Millilitre",m3:"Cubic metre",cm3:"Cubic centimetre",usgal:"US gallon"},mass:{kg:"Kilogram",g:"Gram",mg:"Milligram",t:"Tonne",lb:"Pound",oz:"Ounce"},temperature:{C:"Celsius",F:"Fahrenheit",K:"Kelvin"},time:{h:"Hour",min:"Minute",s:"Second",ms:"Millisecond",day:"Day",week:"Week"},speed:{kmh:"Kilometres per hour",ms:"Metres per second",mph:"Miles per hour",kn:"Knot"},storage:{B:"Byte",kB:"Kilobyte",MB:"Megabyte",GB:"Gigabyte",TB:"Terabyte",KiB:"Kibibyte",MiB:"Mebibyte",GiB:"Gibibyte",TiB:"Tebibyte"}}},Cy={...$a,calculators:{...$a.calculators,"aspect-ratio":"Aspect ratio",loan:"Loan payment",bmi:"BMI",date:"Dates",duration:"Durations"},descriptions:{...$a.descriptions,"aspect-ratio":"Simplify ratios and resize images",loan:"Monthly payment, total repayment and interest",bmi:"Body mass index from weight and height",date:"Count days and shift a date",duration:"Add and subtract time spans"},fields:{...$a.fields,pixelWidth:"Width (px)",pixelHeight:"Height (px)",targetWidth:"Target width (px)",principal:"Loan amount",annualRate:"Annual interest rate (%)",months:"Term (months)",weight:"Weight (kg)",bodyHeight:"Height (cm)",startDate:"Start date",endDate:"End date",days:"Number of days",hours:"Hours",minutes:"Minutes",seconds:"Seconds"},aspectModes:{ratio:"Calculate ratio",resize:"Resize"},results:{...$a.results,ratio:"Aspect ratio",targetWidth:"Target width",targetHeight:"Target height",monthlyPayment:"Monthly payment",totalPayment:"Total repayment",totalInterest:"Total interest",bmi:"BMI",days:"Days between dates",date:"New date",duration:"Total duration",totalSeconds:"Total seconds"},example:"Example",copy:"Copy",copied:"Copied",copyError:"Copy failed",copyResult:"Copy {name}",dateModes:{difference:"Days between two dates",add:"Add or subtract days"},dateDifferenceHint:"The start date is excluded. An earlier end date gives a negative result.",dateAddHint:"Use a negative number to go back.",dateDifferenceFormula:"Calendar days from the start date to the end date",dateAddFormula:"New date = start date + number of days",durationFormula:`Seconds = hours × 3600 + minutes × 60 + seconds
Add all signed durations together.`,durationHint:"Minutes and seconds range from 0 to 59. Blank fields count as 0.",durationRow:"Duration {number}",durationOperation:"Operation for duration {number}",removeDuration:"Remove duration {number}",addDuration:"Add duration",add:"Add",subtract:"Subtract",remove:"Remove",roundedPrecision:"Rounded display; very small and large values use up to 12 digits.",aspectHint:"Enter width and height in whole pixels.",aspectResizeHint:"The target height is rounded to whole pixels.",aspectRatioFormula:"Width : height, reduced to lowest terms",aspectResizeFormula:"Target height = target width × height ÷ width",loanHint:"Fixed annual interest, payments at month end, excluding fees. Use the same currency for all amounts.",loanFormula:`Payment = amount × i ÷ (1 − (1 + i)⁻ⁿ)
i = annual interest rate ÷ 1200; n = months
At 0%: amount ÷ months`,bmiHint:"A screening measure for adults.",errors:{...$a.errors,integer:"Enter a whole number of pixels.",dimension:"Image dimensions must be between 1 and 1000000000 pixels.",rate:"Annual interest must be between 0 and 100%.",months:"Enter a whole term between 1 and 1200 months.",date:"Choose a valid date in years 1 to 9999.",days:"Enter a whole number of days between −3652058 and 3652058.",dateRange:"The result is outside years 1 to 9999.",durationRows:"Use 1 to 50 durations.",durationHours:"Enter whole hours from 0 to 999999.",durationPart:"Enter a whole number from 0 to 59."}},Dy=Object.freeze({...Iy,studioConvert:xy,studioPdf:Ly,studioCalculate:Cy,shell:Object.freeze({skip:"Skip to content",home:"Home",tools:"More tools",qr:"QR codes",pdf:"PDF",convert:"Convert",calculate:"Calculators",loading:"Loading …",loadError:"This workspace could not be loaded.",retry:"Reload",unsaved:"You have unsaved PDF changes. Leave this page?",privacyStatus:"Processed locally",localeLabel:"Choose language",themeToggle:"Dark theme",menuOpen:"Open menu",menuClose:"Close menu",mobileNavigation:"Mobile navigation",primaryNavigation:"Primary navigation",privacy:"Privacy",openSource:"Open source",licenses:"Licenses",terms:"Terms",contact:"Contact",source:"Source code",footerNavigation:"Footer navigation",footerNote:"Your files stay with you."}),home:Object.freeze({eyebrow:"Everyday tools",title:"What would you like to do?",intro:"Your tools. Right in your browser.",sampleTitle:"Project plan",sampleLine1:"Capture ideas.",sampleLine2:"Edit the details.",sampleLine3:"Keep things moving.",privacyTitle:"Your files stay in this browser.",privacyBody:"Folkkit does not send file contents away for processing. The static web host may receive technical access data when you open the site.",pdfTitle:"Edit PDF",pdfBody:"Text, annotations, and pages.",qrTitle:"Create QR code",qrBody:"Colors, shapes, and your own logo.",convertTitle:"Convert file",convertBody:"Images, documents, audio, and video.",calculateTitle:"Calculators & units",calculateBody:"Percentages, geometry, and unit conversions.",catalogLink:"Discover more tools"}),catalog:Object.freeze({toolCount:"{count} tools",eyebrow:"Tool catalog",title:"More tools",intro:"For text, data, and small everyday tasks.",openTool:"Open {name}",search:"Search tools",searchPlaceholder:"Name or task",category:"Category",allCategories:"All categories",favoritesOnly:"Favorites only",addFavorite:"Add {name} to favorites",removeFavorite:"Remove {name} from favorites",filteredCount:"{count} of {total} tools",empty:"No matching tools",emptyHint:"Try another search term or remove a filter.",clearFilters:"Reset filters",storageError:"Your browser cannot save favorites right now. They remain available until you leave this page.",studioCategory:"Studio",qrReader:"Read a QR code",qrReaderDescription:"Read the content of a QR image",imageOptimize:"Reduce image size",imageOptimizeDescription:"Adjust file size and dimensions"}),workspace:Object.freeze({eyebrow:"Tool",title:"Work with a file locally",intro:"Choose an input and take the result with you.",dropOverlay:"Drop the file to convert it",unsupportedDrop:"This file type cannot be opened here. Choose a suitable tool.",pairTitle:"{from} to {to}",pairDescription:"Convert {from} to {to} locally in your browser. File contents are not uploaded.",toolDescription:"Use {name} locally in your browser. File contents are not uploaded."}),keyboardHelp:Object.freeze({title:"Keyboard Shortcuts",convertGroup:"Convert Panel",focusInput:"Focus input field",swap:"Swap from ↔ to",copyOutput:"Copy output",reset:"Reset conversion",toggleBatch:"Toggle batch mode",backToFormats:"Back to format mode",globalGroup:"Global",toggleTheme:"Toggle dark/light theme",thisHelp:"This help",footer:"Press ? or Esc to close",close:"Close keyboard help",closeVisible:"Close"}),workspaceTools:Object.freeze({input:"Input",output:"Result",inputText:"Input text",conversionResult:"Conversion result",toolInputText:"Tool input",toolOutputText:"Tool result",formatInputPlaceholder:"Enter or paste a value",resultPlaceholder:"The result will appear here",parametersPlaceholder:"Enter parameters",clear:"Reset",clearInput:"Clear input",selectFile:"Choose file",selectFiles:"Choose PDF files",dropFile:"Drop a file here or choose one",dropFiles:"Drop files here or choose them",convert:"Convert",parameters:"Tool parameters",progressLabel:"Progress",processing:"Processing: {progress}",loadingRuntime:"Loading the local media module.",loadingTool:"Loading the tool locally.",mediaModuleUnavailable:"The media module is not available offline yet. Reconnect to the internet and try again.",toolModuleUnavailable:"This tool module is not available offline yet. Reconnect to the internet and try again.",retryModule:"Try again",cancel:"Cancel",download:"Download",copy:"Copy",copied:"Result copied",copiedToClipboard:"Copied to clipboard",copiedOutput:"Output copied",linkCopied:"Link copied",shareLinkCopied:"Share link copied",discard:"Discard",previewAlt:"Local result preview",shareTool:"Share this tool",moreFiles:"{count} more files",detected:"detected",selectInput:"Choose input: {name}",selectOutput:"Choose output format: {name}",swap:"Swap formats",noReverseConversion:"No reverse conversion available",enableBatch:"Enable batch mode",disableBatch:"Disable batch mode",addFavourite:"Add format pair to favourites",removeFavourite:"Remove format pair from favourites",pickColor:"Choose a colour",copyResult:"Copy result",downloadResult:"Download result",useAsInput:"Use result as input",wordWrapOn:"Word wrap on",wordWrapOff:"Word wrap off",showLineNumbers:"Show line numbers",hideLineNumbers:"Hide line numbers",shareConversion:"Share conversion",colorPreview:"Colour preview",base64Preview:"Base64 preview",chain:"Continue with",generate:"Generate",saveResult:"Save result",inputStats:"Characters {characters} · words {words} · lines {lines}",outputStats:"Characters {characters} · lines {lines}",characterCount:"Characters: {count}",byteCount:"{count} bytes"}),history:Object.freeze({consent:"Local history is stored in this browser only after you enable it.",enable:"Enable local history",recent:"Recent conversions",deleteAndDisable:"Delete history and disable it",empty:"No local history yet.",remove:"Remove from history",copy:"Copy result",reuse:"Reuse",copied:"Copied to clipboard",now:"now",minutesAgo:"{count} min ago",hoursAgo:"{count} hr ago",daysAgo:"{count} days ago"}),toolPicker:Object.freeze({searchConversions:"Search conversions",searchFormats:"Search formats",searchConversionsPlaceholder:"Search all conversions…",searchFormatsPlaceholder:"Search formats…",formats:"Formats",tools:"Tools",noResults:"No results",noFormats:"No formats found",noItems:"No items in this category",recent:"Recent",tabs:Object.freeze({text:"Text",encode:"Encoding",data:"Data",number:"Numbers",hash:"Checksums",color:"Colours",units:"Units",image:"Images",media:"Audio and video",document:"PDF and documents",utility:"Utilities"}),groups:Object.freeze({Text:"Text",Case:"Letter case",Data:"Data",Number:"Numbers",Color:"Colours",Recent:"Recent"})}),errorBoundary:Object.freeze({message:"Something went wrong with this tool.",retry:"Try again"}),errors:Object.freeze({unsupportedType:"This file type is not supported by this tool.",unsupportedPair:"No conversion exists for this format pair.",unsupportedBrowser:"QR codes cannot be read in this browser.",tooLarge:"The selected file is too large for this device.",invalidFile:"The file is damaged or invalid.",outOfMemory:"There is not enough available memory for this conversion.",cancelled:"The operation was cancelled.",conversionFailed:"Processing failed.",mediaRuntimeUnavailable:"FFmpeg core and WASM are not available offline. Reconnect to the internet and try again.",resourceLimit:"The input exceeds the safe processing limit."}),formatCompatibility:Object.freeze({warningTitle:"These file formats are not compatible with each other.",warningBody:"The available conversion is intended only for a deliberate specialist case. Check the result carefully.",confirmation:"I know what I am doing and understand that these file formats are not compatible with each other."}),labels:Object.freeze({experimental:"Experimental",mediaWarning:"Experimental. The local media module may need substantial memory and processing power for some files."}),categories:Object.freeze({encode:"QR and encoding",hash:"Checksums",data:"Data",number:"Numbers",color:"Colors",utility:"Utilities",image:"Images",media:"Audio and video",document:"PDF and documents"}),tools:Object.freeze({base64Encode:Object.freeze({name:"Base64 encode",description:"Convert text to Base64 locally",placeholder:"Type or paste text"}),base64Decode:Object.freeze({name:"Base64 decode",description:"Convert Base64 back to text locally"}),urlEncode:Object.freeze({name:"URL encode",description:"Percent-encode text for a URL"}),urlDecode:Object.freeze({name:"URL decode",description:"Convert percent-encoded URL text back to text"}),htmlEncode:Object.freeze({name:"Escape HTML characters",description:"Replace HTML special characters with entities"}),htmlDecode:Object.freeze({name:"Decode HTML entities",description:"Convert HTML entities back to characters"}),hexEncode:Object.freeze({name:"Text to hex",description:"Convert text to hexadecimal values locally"}),hexDecode:Object.freeze({name:"Hex to text",description:"Convert hexadecimal values to text locally"}),binaryEncode:Object.freeze({name:"Text to binary",description:"Convert text to binary values locally"}),binaryDecode:Object.freeze({name:"Binary to text",description:"Convert binary values to text locally"}),unicodeEscape:Object.freeze({name:"Unicode escape",description:"Convert text to Unicode escape sequences"}),unicodeUnescape:Object.freeze({name:"Decode Unicode escapes",description:"Convert Unicode escape sequences back to text"}),rot13:Object.freeze({name:"ROT13",description:"Apply ROT13 to text locally"}),atbash:Object.freeze({name:"Atbash",description:"Mirror the Latin alphabet locally"}),sha256:Object.freeze({name:"SHA-256 checksum",description:"Calculate the SHA-256 checksum of text"}),jsonPrettify:Object.freeze({name:"Format JSON",description:"Format JSON with readable indentation"}),jsonMinify:Object.freeze({name:"Minify JSON",description:"Remove unnecessary whitespace from JSON"}),jsonEscape:Object.freeze({name:"Escape JSON string",description:"Escape text as a JSON string"}),csvToJson:Object.freeze({name:"CSV to JSON",description:"Convert a CSV table to a JSON array"}),decToHex:Object.freeze({name:"Decimal to hex",description:"Convert a decimal number to hexadecimal"}),hexToDec:Object.freeze({name:"Hex to decimal",description:"Convert a hexadecimal number to decimal"}),decToBin:Object.freeze({name:"Decimal to binary",description:"Convert a decimal number to binary"}),binToDec:Object.freeze({name:"Binary to decimal",description:"Convert a binary number to decimal"}),decToOct:Object.freeze({name:"Decimal to octal",description:"Convert a decimal number to octal"}),octToDec:Object.freeze({name:"Octal to decimal",description:"Convert an octal number to decimal"}),colorConvert:Object.freeze({name:"Convert color value",description:"Convert between HEX, RGB, and HSL"}),cssMinify:Object.freeze({name:"Minify CSS",description:"Remove comments and unnecessary whitespace from CSS"}),jsonValidate:Object.freeze({name:"Check JSON syntax",description:"Parse JSON syntax locally and show errors"}),base64urlEncode:Object.freeze({name:"Base64URL encode",description:"Convert text to URL-safe Base64"}),base64urlDecode:Object.freeze({name:"Base64URL decode",description:"Convert URL-safe Base64 back to text"}),slugGen:Object.freeze({name:"Create URL slug",description:"Convert text to a simple URL slug"}),charCount:Object.freeze({name:"Count characters and words",description:"Count characters, words, lines, and bytes locally"}),reverseText:Object.freeze({name:"Reverse text",description:"Reverse the order of characters"}),percentageCalc:Object.freeze({name:"Percentage calculator",description:"Calculate simple percentage expressions locally",placeholder:"15% of 200"}),aspectRatio:Object.freeze({name:"Aspect ratio calculator",description:"Calculate a bounded aspect ratio from width and height"}),loanCalc:Object.freeze({name:"Loan payment calculator",description:"Estimate monthly payment, total cost, and amortization from amount, rate, and term",placeholder:"250000 4.5% 30",notice:"Local calculation aid only, not financial advice."}),bmiCalc:Object.freeze({name:"BMI calculator",description:"Calculate body mass index from weight and height",placeholder:"70kg 175cm",notice:"General calculation aid only, not medical advice."}),pngToJpg:Object.freeze({name:"PNG to JPEG",description:"Convert a PNG image to JPEG locally"}),jpgToPng:Object.freeze({name:"JPEG to PNG",description:"Convert a JPEG image to PNG locally"}),audioToMp3:Object.freeze({name:"Audio to MP3",description:"Convert an audio file to MP3 locally"}),textToQr:Object.freeze({name:"Text to QR code",description:"Create a QR code from text or a link",placeholder:"Type text or a link"}),imagesToPdf:Object.freeze({name:"Images to PDF",description:"Combine several images into one PDF"}),mergePdf:Object.freeze({name:"Merge PDFs",description:"Combine several PDF files into one file"}),pdfPageCount:Object.freeze({name:"Count PDF pages",description:"Find the number of pages in a PDF file"}),pdfSplit:Object.freeze({name:"Extract PDF page",description:"Extract one page from a PDF file",parameterPlaceholder:"Page number, for example 1"}),pdfExtractRange:Object.freeze({name:"Extract PDF pages",description:"Extract a page range from a PDF file",parameterPlaceholder:"Page range, for example 1-5 or 1,3,5"}),textToPdf:Object.freeze({name:"Text to PDF",description:"Convert plain text into a simple PDF document",placeholder:"Type or paste text"}),pdfMetadata:Object.freeze({name:"PDF metadata",description:"View a PDF title, author, and other metadata"}),pdfRotate:Object.freeze({name:"Rotate PDF pages",description:"Rotate every page in a PDF file",parameterPlaceholder:"Degrees: 90, 180, or 270"})})}),lf=q.createContext(null);function Lt(){const n=q.useContext(lf);if(!n)throw new Error("useI18n must be used within an I18nProvider");return n}const ky=Object.freeze({de:Ny,en:Dy});function zr(n){return n==="en"?"en":"de"}function hn(n,s,l={}){const c=s.split(".").reduce((p,d)=>p?.[d],n);if(typeof c!="string")throw new Error(`Missing translation: ${s}`);return c.replace(/\{(\w+)\}/g,(p,d)=>String(l[d]??`{${d}}`))}function vc(n){return ky[zr(n)]}const $p=Object.freeze(["core","advanced","experimental","hidden"]),cf=Object.freeze({text:"encode",qr:"encode",image:"image",hash:"hash",crypto:"hash",data:"data",web:"web",number:"number",color:"color",utility:"utility",imageFormat:"image",media:"media",pdf:"document"}),Hy=Object.freeze({text:"Hidden pending a named bounded-output fixture and localized release copy.",qr:"Hidden pending QR capability verification.",image:"Hidden pending exact input signatures, Blob result normalization, and image fixtures.",hash:"Hidden pending digest fixtures and copy that does not imply password or security validation.",crypto:"Hidden because cryptographic, password, or randomness claims require a separate security review.",data:"Hidden pending bounded structured-data fixtures and output-size review.",web:"Hidden pending per-tool review of validators, generators, and any live-lookup implication.",number:"Hidden pending bounded numerical fixtures and expansion limits.",color:"Hidden pending deterministic color fixtures and review of accessibility claims.",utility:"Hidden pending per-tool review for dated data, professional advice, and bounded output.",imageFormat:"Hidden pending exact PNG/JPEG validation, Canvas cleanup, and Blob result fixtures.",media:"Hidden pending same-origin FFmpeg network and cancellation evidence.",pdf:"Hidden pending PDF runtime evidence."}),zy=Object.freeze({"qr-to-text":"Hidden until a real successful decode fixture passes in a supported browser."});function Qe({module:n,category:s=cf[n],tier:l,translationKey:c,runtimeClass:p,inputLimitClass:d,outputNaming:f,evidenceId:m,...y}){return Object.freeze({module:n,category:s,tier:l,translationKey:c,runtimeClass:p,inputLimitClass:d,outputNaming:f,evidenceId:m,...y})}function he(n,s,l,c={}){return Qe({module:s,category:c.category,tier:"advanced",translationKey:l,runtimeClass:c.runtimeClass||"main-thread",inputLimitClass:"text-5-mib",outputNaming:"inline-text",evidenceId:`tool:${n}`,placeholderKey:c.placeholderKey,noticeKey:c.noticeKey})}function My(n,s,l,c={}){return Qe({module:"media",tier:"experimental",translationKey:s,runtimeClass:"ffmpeg-wasm",inputLimitClass:"media-device",outputNaming:"converter-filename",evidenceId:`tool:${n}`,acceptsFile:!0,acceptTypes:l,isMediaConverter:!0,limits:Ut.media,noticeKey:"labels.mediaWarning",hasTextInput:c.hasTextInput,parameterPlaceholderKey:c.parameterPlaceholderKey})}const Uy=Object.freeze({"base64-encode":Qe({module:"text",tier:"advanced",translationKey:"base64Encode",runtimeClass:"main-thread",inputLimitClass:"text-5-mib",outputNaming:"inline-text",evidenceId:"tool:base64-encode",placeholderKey:"tools.base64Encode.placeholder"}),"base64-decode":he("base64-decode","text","base64Decode"),"url-encode":he("url-encode","text","urlEncode"),"url-decode":he("url-decode","text","urlDecode"),"html-encode":he("html-encode","text","htmlEncode"),"html-decode":he("html-decode","text","htmlDecode"),"hex-encode":he("hex-encode","text","hexEncode"),"hex-decode":he("hex-decode","text","hexDecode"),"binary-encode":he("binary-encode","text","binaryEncode"),"binary-decode":he("binary-decode","text","binaryDecode"),"unicode-escape":he("unicode-escape","text","unicodeEscape"),"unicode-unescape":he("unicode-unescape","text","unicodeUnescape"),rot13:he("rot13","text","rot13"),atbash:he("atbash","text","atbash"),sha256:he("sha256","hash","sha256",{runtimeClass:"web-crypto"}),"json-prettify":he("json-prettify","data","jsonPrettify"),"json-minify":he("json-minify","data","jsonMinify"),"json-escape":he("json-escape","data","jsonEscape"),"csv-to-json":he("csv-to-json","data","csvToJson"),"dec-to-hex":he("dec-to-hex","number","decToHex"),"hex-to-dec":he("hex-to-dec","number","hexToDec"),"dec-to-bin":he("dec-to-bin","number","decToBin"),"bin-to-dec":he("bin-to-dec","number","binToDec"),"dec-to-oct":he("dec-to-oct","number","decToOct"),"oct-to-dec":he("oct-to-dec","number","octToDec"),"color-convert":he("color-convert","color","colorConvert"),"css-minify":he("css-minify","web","cssMinify",{category:"data"}),"json-validate":he("json-validate","web","jsonValidate",{category:"data"}),"base64url-encode":he("base64url-encode","web","base64urlEncode",{category:"encode"}),"base64url-decode":he("base64url-decode","web","base64urlDecode",{category:"encode"}),"slug-gen":he("slug-gen","web","slugGen",{category:"utility"}),"char-count":he("char-count","utility","charCount"),"reverse-text":he("reverse-text","utility","reverseText"),"percentage-calc":he("percentage-calc","utility","percentageCalc",{placeholderKey:"tools.percentageCalc.placeholder"}),"aspect-ratio":he("aspect-ratio","utility","aspectRatio"),"loan-calc":Qe({module:"utility",tier:"advanced",translationKey:"loanCalc",runtimeClass:"main-thread",inputLimitClass:"text-5-mib",outputNaming:"inline-text",evidenceId:"tool:loan-calc",placeholderKey:"tools.loanCalc.placeholder",noticeKey:"tools.loanCalc.notice"}),"bmi-calc":Qe({module:"utility",tier:"advanced",translationKey:"bmiCalc",runtimeClass:"main-thread",inputLimitClass:"text-5-mib",outputNaming:"inline-text",evidenceId:"tool:bmi-calc",placeholderKey:"tools.bmiCalc.placeholder",noticeKey:"tools.bmiCalc.notice"}),"png-to-jpg":Qe({module:"imageFormat",tier:"advanced",translationKey:"pngToJpg",runtimeClass:"canvas",inputLimitClass:"image-device",outputNaming:"converter-filename",evidenceId:"tool:png-to-jpg",acceptsFile:!0,acceptTypes:"image/png,.png",isMediaConverter:!0,limits:Ut.images}),"jpg-to-png":Qe({module:"imageFormat",tier:"advanced",translationKey:"jpgToPng",runtimeClass:"canvas",inputLimitClass:"image-device",outputNaming:"converter-filename",evidenceId:"tool:jpg-to-png",acceptsFile:!0,acceptTypes:"image/jpeg,.jpg,.jpeg",isMediaConverter:!0,limits:Ut.images}),"audio-to-mp3":My("audio-to-mp3","audioToMp3","audio/*"),"text-to-qr":Qe({module:"qr",tier:"core",translationKey:"textToQr",runtimeClass:"main-thread",inputLimitClass:"text-5-mib",outputNaming:"generated-image",evidenceId:"tool:text-to-qr",showsPreview:!0,placeholderKey:"tools.textToQr.placeholder"}),"images-to-pdf":Qe({module:"pdf",tier:"core",translationKey:"imagesToPdf",runtimeClass:"pdf-lib",inputLimitClass:"image-device",outputNaming:"converter-filename",evidenceId:"tool:images-to-pdf",acceptsFile:!0,acceptTypes:"image/png,image/jpeg,.png,.jpg,.jpeg",multipleFiles:!0,isMediaConverter:!0,limits:Ut.images}),"merge-pdf":Qe({module:"pdf",tier:"core",translationKey:"mergePdf",runtimeClass:"pdf-lib",inputLimitClass:"pdf-device",outputNaming:"converter-filename",evidenceId:"tool:merge-pdf",acceptsFile:!0,acceptTypes:"application/pdf,.pdf",multipleFiles:!0,isMediaConverter:!0,limits:Ut.pdf}),"pdf-page-count":Qe({module:"pdf",tier:"core",translationKey:"pdfPageCount",runtimeClass:"pdf-lib",inputLimitClass:"pdf-device",outputNaming:"inline-text",evidenceId:"tool:pdf-page-count",acceptsFile:!0,acceptTypes:"application/pdf,.pdf",isMediaConverter:!0,limits:Ut.pdf}),"pdf-split":Qe({module:"pdf",tier:"core",translationKey:"pdfSplit",runtimeClass:"pdf-lib",inputLimitClass:"pdf-device",outputNaming:"converter-filename",evidenceId:"tool:pdf-split",acceptsFile:!0,acceptTypes:"application/pdf,.pdf",isMediaConverter:!0,hasTextInput:!0,parameterPlaceholderKey:"tools.pdfSplit.parameterPlaceholder",limits:Ut.pdf}),"pdf-extract-range":Qe({module:"pdf",tier:"core",translationKey:"pdfExtractRange",runtimeClass:"pdf-lib",inputLimitClass:"pdf-device",outputNaming:"converter-filename",evidenceId:"tool:pdf-extract-range",acceptsFile:!0,acceptTypes:"application/pdf,.pdf",isMediaConverter:!0,hasTextInput:!0,parameterPlaceholderKey:"tools.pdfExtractRange.parameterPlaceholder",limits:Ut.pdf}),"text-to-pdf":Qe({module:"pdf",tier:"core",translationKey:"textToPdf",runtimeClass:"pdf-lib",inputLimitClass:"text-5-mib",outputNaming:"converter-filename",evidenceId:"tool:text-to-pdf",placeholderKey:"tools.textToPdf.placeholder"}),"pdf-metadata":Qe({module:"pdf",tier:"core",translationKey:"pdfMetadata",runtimeClass:"pdf-lib",inputLimitClass:"pdf-device",outputNaming:"inline-text",evidenceId:"tool:pdf-metadata",acceptsFile:!0,acceptTypes:"application/pdf,.pdf",isMediaConverter:!0,limits:Ut.pdf}),"pdf-rotate":Qe({module:"pdf",tier:"core",translationKey:"pdfRotate",runtimeClass:"pdf-lib",inputLimitClass:"pdf-device",outputNaming:"converter-filename",evidenceId:"tool:pdf-rotate",acceptsFile:!0,acceptTypes:"application/pdf,.pdf",isMediaConverter:!0,hasTextInput:!0,parameterPlaceholderKey:"tools.pdfRotate.parameterPlaceholder",limits:Ut.pdf})}),Sc=Object.freeze(Object.entries(ey).flatMap(([n,s])=>s.map(l=>{const c=Uy[l];return Object.freeze(c?{id:l,...c}:{id:l,module:n,category:cf[n],tier:"hidden",translationKey:l,hiddenReason:zy[l]||Hy[n]})})));Object.freeze(Oc.map(n=>{const s=Cr(n.id);return Object.freeze(s?{id:n.id,kind:"format",category:s.category,tier:s.tier,runtimeClass:s.runtimeClass,inputLimitClass:s.inputLimitClass,outputNaming:s.outputNaming,evidenceId:s.evidenceId,nameDe:s.nameDe,nameEn:s.nameEn,descriptionDe:s.descriptionDe,descriptionEn:s.descriptionEn}:{id:n.id,kind:"format",category:"format",tier:"hidden",hiddenReason:"Hidden pending an independent literal fixture with exact output and a defensible input limit."})}));Sc.filter(n=>n.tier!=="hidden").length;function jy(n,s){const l=vc(s),c={...n,tierLabel:n.tier==="experimental"?hn(l,"labels.experimental"):null,name:hn(l,`tools.${n.translationKey}.name`),description:hn(l,`tools.${n.translationKey}.description`),categoryName:hn(l,`categories.${n.category}`)};return n.placeholderKey&&(c.placeholder=hn(l,n.placeholderKey)),n.parameterPlaceholderKey&&(c.textPlaceholder=hn(l,n.parameterPlaceholderKey)),n.noticeKey&&(c.notice=hn(l,n.noticeKey)),c}function Gy(n="de"){const s=zr(n);return Sc.filter(l=>l.tier!=="hidden").sort((l,c)=>$p.indexOf(l.tier)-$p.indexOf(c.tier)).map(l=>jy(l,s))}function i0(n="de"){const s=vc(zr(n)),l=new Set(Sc.filter(c=>c.tier!=="hidden").map(c=>c.category));return ty.filter(c=>l.has(c.id)).map(c=>({id:c.id,name:hn(s,`categories.${c.id}`)}))}const Tt=Object.freeze({locale:"folkkit:locale",theme:"folkkit:theme",favorites:"folkkit:favorites",favoriteTools:"folkkit:favorite-tools",recentTools:"folkkit:recent-tools",historyEnabled:"folkkit:history-enabled",contentHistory:"folkkit:content-history",installDismissed:"folkkit:install-dismissed"});function By(){return localStorage.getItem(Tt.historyEnabled)==="true"}function mc(n){if(n===!0){localStorage.setItem(Tt.historyEnabled,"true");return}localStorage.removeItem(Tt.historyEnabled)}function Py(){try{const n=JSON.parse(localStorage.getItem(Tt.contentHistory)||"[]");return Array.isArray(n)?n:[]}catch{return[]}}function gc(n){Array.isArray(n)&&localStorage.setItem(Tt.contentHistory,JSON.stringify(n))}function Yy(){localStorage.removeItem(Tt.contentHistory)}function $y(){const n=localStorage.getItem(Tt.theme);return n==="light"||n==="dark"?n:"light"}function Wy(){const[n,s]=q.useState($y);return q.useEffect(()=>{document.documentElement.setAttribute("data-theme",n),localStorage.setItem(Tt.theme,n);const c=document.querySelector('meta[name="theme-color"]');c&&c.setAttribute("content",n==="dark"?"#171c20":"#f6f7f8")},[n]),{theme:n,toggle:()=>s(c=>c==="light"?"dark":"light")}}const uf="https://github.com/ThisIsPhantom/folkkit";function _y(n){if(!/^[0-9a-f]{40}$/.test(n))throw new Error("Build information requires an exact 40-character Git commit.");return Object.freeze({commit:n,sourceUrl:`${uf}/tree/${n}`})}const Wp="9a65c83b06a7d002e16ace9f3995e9cb2e49758e",yc=/^[0-9a-f]{40}$/.test(Wp)?_y(Wp):Object.freeze({commit:"development",sourceUrl:uf});function qy({onNavigate:n}){const{t:s}=Lt(),l=[["privacy","/privacy"],["openSource","/open-source"],["licenses","/licenses"],["terms","/terms"],["contact","/contact"]];return E.jsx("footer",{className:"site-footer",children:E.jsxs("div",{className:"site-footer__inner",children:[E.jsx("p",{children:s("shell.footerNote")}),E.jsx("nav",{"aria-label":s("shell.footerNavigation"),children:E.jsxs("ul",{role:"list",className:"site-footer__links",children:[l.map(([c,p])=>E.jsx("li",{children:E.jsx("a",{href:p,onClick:d=>{d.preventDefault(),n(p)},children:s(`shell.${c}`)})},c)),E.jsx("li",{children:E.jsx("a",{href:yc.sourceUrl,children:s("shell.source")})})]})})]})})}var Vy={outline:{xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"},filled:{xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"currentColor",stroke:"none"}};const jt=(n,s,l,c)=>{const p=q.forwardRef(({color:d="currentColor",size:f=24,stroke:m=2,title:y,className:b,children:z,...M},F)=>q.createElement("svg",{ref:F,...Vy[n],width:f,height:f,className:["tabler-icon",`tabler-icon-${s}`,b].join(" "),strokeWidth:m,stroke:d,...M},[y&&q.createElement("title",{key:"svg-title"},y),...c.map(([L,k])=>q.createElement(L,k)),...Array.isArray(z)?z:[z]]));return p.displayName=`${l}`,p};const Ky=[["path",{d:"M5 12l14 0",key:"svg-0"}],["path",{d:"M13 18l6 -6",key:"svg-1"}],["path",{d:"M13 6l6 6",key:"svg-2"}]],Xi=jt("outline","arrow-right","ArrowRight",Ky);const Zy=[["path",{d:"M7 10h14l-4 -4",key:"svg-0"}],["path",{d:"M17 14h-14l4 4",key:"svg-1"}]],Qy=jt("outline","arrows-exchange","ArrowsExchange",Zy);const Xy=[["path",{d:"M4 5a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2l0 -14",key:"svg-0"}],["path",{d:"M8 8a1 1 0 0 1 1 -1h6a1 1 0 0 1 1 1v1a1 1 0 0 1 -1 1h-6a1 1 0 0 1 -1 -1l0 -1",key:"svg-1"}],["path",{d:"M8 14l0 .01",key:"svg-2"}],["path",{d:"M12 14l0 .01",key:"svg-3"}],["path",{d:"M16 14l0 .01",key:"svg-4"}],["path",{d:"M8 17l0 .01",key:"svg-5"}],["path",{d:"M12 17l0 .01",key:"svg-6"}],["path",{d:"M16 17l0 .01",key:"svg-7"}]],Jy=jt("outline","calculator","Calculator",Xy);const eb=[["path",{d:"M14 3v4a1 1 0 0 0 1 1h4",key:"svg-0"}],["path",{d:"M5 12v-7a2 2 0 0 1 2 -2h7l5 5v4",key:"svg-1"}],["path",{d:"M5 18h1.5a1.5 1.5 0 0 0 0 -3h-1.5v6",key:"svg-2"}],["path",{d:"M17 18h2",key:"svg-3"}],["path",{d:"M20 15h-3v6",key:"svg-4"}],["path",{d:"M11 15v6h1a2 2 0 0 0 2 -2v-2a2 2 0 0 0 -2 -2h-1",key:"svg-5"}]],df=jt("outline","file-type-pdf","FileTypePdf",eb);const tb=[["path",{d:"M4 6l16 0",key:"svg-0"}],["path",{d:"M4 12l16 0",key:"svg-1"}],["path",{d:"M4 18l16 0",key:"svg-2"}]],nb=jt("outline","menu-2","Menu2",tb);const ab=[["path",{d:"M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454l0 .008",key:"svg-0"}]],ib=jt("outline","moon","Moon",ab);const ob=[["path",{d:"M15 8h.01",key:"svg-0"}],["path",{d:"M3 6a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v12a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3v-12",key:"svg-1"}],["path",{d:"M3 16l5 -5c.928 -.893 2.072 -.893 3 0l5 5",key:"svg-2"}],["path",{d:"M14 14l1 -1c.928 -.893 2.072 -.893 3 0l3 3",key:"svg-3"}]],rb=jt("outline","photo","Photo",ob);const sb=[["path",{d:"M4 5a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1l0 -4",key:"svg-0"}],["path",{d:"M7 17l0 .01",key:"svg-1"}],["path",{d:"M14 5a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1l0 -4",key:"svg-2"}],["path",{d:"M7 7l0 .01",key:"svg-3"}],["path",{d:"M4 15a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1l0 -4",key:"svg-4"}],["path",{d:"M17 7l0 .01",key:"svg-5"}],["path",{d:"M14 14l3 0",key:"svg-6"}],["path",{d:"M20 14l0 .01",key:"svg-7"}],["path",{d:"M14 14l0 3",key:"svg-8"}],["path",{d:"M14 20l3 0",key:"svg-9"}],["path",{d:"M17 17l3 0",key:"svg-10"}],["path",{d:"M20 17l0 3",key:"svg-11"}]],lb=jt("outline","qrcode","Qrcode",sb);const cb=[["path",{d:"M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873l-6.158 -3.245",key:"svg-0"}]],_p=jt("outline","star","Star",cb);const ub=[["path",{d:"M8 12a4 4 0 1 0 8 0a4 4 0 1 0 -8 0",key:"svg-0"}],["path",{d:"M3 12h1m8 -9v1m8 8h1m-9 8v1m-6.4 -15.4l.7 .7m12.1 -.7l-.7 .7m0 11.4l.7 .7m-12.1 -.7l-.7 .7",key:"svg-1"}]],db=jt("outline","sun","Sun",ub);const hb=[["path",{d:"M18 6l-12 12",key:"svg-0"}],["path",{d:"M6 6l12 12",key:"svg-1"}]],pb=jt("outline","x","X",hb);function qp({active:n,children:s,href:l,onNavigate:c}){const p=d=>{d.button!==0||d.metaKey||d.ctrlKey||d.shiftKey||d.altKey||(d.preventDefault(),c(l))};return E.jsx("a",{className:"site-nav__link",href:l,"aria-current":n?"page":void 0,onClick:p,children:s})}function fb({route:n,onNavigate:s,locale:l,onLocaleChange:c,theme:p,onThemeToggle:d}){const{t:f}=Lt(),[m,y]=q.useState(!1),b=q.useRef(null);q.useEffect(()=>{if(!m)return;const F=L=>{L.key==="Escape"&&(y(!1),b.current?.focus())};return window.addEventListener("keydown",F),()=>window.removeEventListener("keydown",F)},[m]);const z=[{href:"/qr",route:"qr",label:"shell.qr"},{href:"/pdf",route:"pdf",label:"shell.pdf"},{href:"/convert",route:"convert",label:"shell.convert"},{href:"/calculate",route:"calculate",label:"shell.calculate"},{href:"/tools",route:"catalog",label:"shell.tools"}],M=F=>{y(!1),s(F)};return E.jsxs("header",{className:"site-header",children:[E.jsxs("div",{className:"site-header__inner",children:[E.jsx("div",{className:"site-header__brand-group",children:E.jsxs("a",{className:"wordmark display",href:"/","aria-label":f("shell.home"),onClick:F=>{F.preventDefault(),M("/")},children:[E.jsx("span",{className:"wordmark__symbol","aria-hidden":"true",children:"f."}),"Folkkit"]})}),E.jsx("nav",{className:"site-nav site-nav--desktop","aria-label":f("shell.primaryNavigation"),children:z.map(F=>E.jsx(qp,{href:F.href,active:n===F.route,onNavigate:M,children:f(F.label)},F.href))}),E.jsxs("div",{className:"site-header__actions",children:[E.jsxs("div",{className:"locale-switch",role:"group","aria-label":f("shell.localeLabel"),children:[E.jsx("button",{type:"button","aria-label":"Deutsch","aria-pressed":l==="de",onClick:()=>c("de"),children:"DE"}),E.jsx("button",{type:"button","aria-label":"English","aria-pressed":l==="en",onClick:()=>c("en"),children:"EN"})]}),E.jsx("button",{className:"theme-button",type:"button","aria-label":f("shell.themeToggle"),title:f("shell.themeToggle"),"aria-pressed":p==="dark",onClick:d,children:p==="dark"?E.jsx(db,{size:20,"aria-hidden":"true"}):E.jsx(ib,{size:20,"aria-hidden":"true"})}),E.jsx("button",{className:"menu-button",ref:b,type:"button","aria-expanded":m,"aria-controls":"mobile-navigation","aria-label":f(m?"shell.menuClose":"shell.menuOpen"),onClick:()=>y(F=>!F),children:m?E.jsx(pb,{size:22,"aria-hidden":"true"}):E.jsx(nb,{size:22,"aria-hidden":"true"})})]})]}),m&&E.jsx("nav",{id:"mobile-navigation",className:"site-nav site-nav--mobile","aria-label":f("shell.mobileNavigation"),children:z.map(F=>E.jsx(qp,{href:F.href,active:n===F.route,onNavigate:M,children:f(F.label)},F.href))})]})}function mb({locale:n,onLocaleChange:s,route:l,onNavigate:c,children:p}){const{theme:d,toggle:f}=Wy(),{t:m}=Lt(),y=q.useCallback(()=>f(),[f]);return q.useEffect(()=>{const b=z=>{const M=["INPUT","TEXTAREA","SELECT"].includes(document.activeElement?.tagName);(z.metaKey||z.ctrlKey)&&z.key.toLowerCase()==="d"&&!M&&(z.preventDefault(),y())};return window.addEventListener("keydown",b),()=>window.removeEventListener("keydown",b)},[y]),E.jsxs("div",{className:"shell",children:[E.jsx("a",{className:"skip-link",href:"#main-content",children:m("shell.skip")}),E.jsx(fb,{route:l,onNavigate:c,locale:n,onLocaleChange:s,theme:d,onThemeToggle:y}),E.jsx("main",{id:"main-content",className:`shell__main shell__main--${l}`,tabIndex:"-1",children:p}),E.jsx(qy,{onNavigate:c})]})}const Vp=n=>String(n).normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLocaleLowerCase();function gb(n){try{const s=localStorage.getItem(Tt.favoriteTools)||"[]";if(s.length>16384)return[];const l=JSON.parse(s),c=new Set(n.map(p=>p.id));return Array.isArray(l)?[...new Set(l.filter(p=>typeof p=="string"&&c.has(p)))]:[]}catch{return[]}}function yb({entries:n,onSelect:s}){const{t:l}=Lt(),[c,p]=q.useState(""),[d,f]=q.useState("all"),[m,y]=q.useState(!1),[b,z]=q.useState(()=>gb(n)),[M,F]=q.useState(!1),L=[...new Map(n.map(P=>[P.category,P.categoryName])).entries()],k=Vp(c).trim().split(/\s+/).filter(Boolean),H=n.filter(P=>(d==="all"||P.category===d)&&(!m||b.includes(P.id))&&k.every(J=>Vp(`${P.name} ${P.description} ${P.categoryName}`).includes(J))),U=P=>{const J=b.includes(P)?b.filter(se=>se!==P):[...b,P];z(J);try{localStorage.setItem(Tt.favoriteTools,JSON.stringify(J)),F(!1)}catch{F(!0)}},de=()=>{p(""),f("all"),y(!1)};return E.jsxs("div",{className:"catalog-page page-frame",children:[E.jsxs("header",{className:"page-heading heading-group",children:[E.jsx("h1",{className:"display",children:l("catalog.title")}),E.jsx("p",{children:l("catalog.intro")})]}),E.jsxs("form",{className:"catalog-toolbar",onSubmit:P=>P.preventDefault(),role:"search",children:[E.jsxs("label",{className:"catalog-search",htmlFor:"catalog-search",children:[E.jsx("span",{children:l("catalog.search")}),E.jsx("input",{id:"catalog-search",name:"search",type:"search",maxLength:128,value:c,onChange:P=>p(P.target.value),placeholder:l("catalog.searchPlaceholder"),autoComplete:"off"})]}),E.jsxs("label",{htmlFor:"catalog-category",children:[E.jsx("span",{children:l("catalog.category")}),E.jsxs("select",{id:"catalog-category",name:"category",value:d,onChange:P=>f(P.target.value),children:[E.jsx("option",{value:"all",children:l("catalog.allCategories")}),L.map(([P,J])=>E.jsx("option",{value:P,children:J},P))]})]}),E.jsxs("button",{type:"button",className:"catalog-favorites-filter","aria-pressed":m,onClick:()=>y(P=>!P),children:[E.jsx(_p,{size:18,"aria-hidden":"true"}),l("catalog.favoritesOnly")]})]}),E.jsx("p",{className:"catalog-count",role:"status",children:l("catalog.filteredCount",{count:H.length,total:n.length})}),M&&E.jsx("p",{className:"catalog-storage-note",children:l("catalog.storageError")}),H.length===0&&E.jsxs("div",{className:"catalog-empty",children:[E.jsx("h2",{children:l("catalog.empty")}),E.jsx("p",{children:l("catalog.emptyHint")}),E.jsx("button",{type:"button",onClick:de,children:l("catalog.clearFilters")})]}),E.jsx("ul",{className:"catalog-list",role:"list",children:H.map(P=>E.jsxs("li",{children:[E.jsxs("button",{className:"catalog-list__open",type:"button",onClick:()=>s({kind:"tool",toolId:P.id}),"aria-label":l("catalog.openTool",{name:P.name}),children:[E.jsxs("span",{className:"catalog-list__copy",children:[E.jsx("span",{className:"catalog-list__title",children:P.name}),E.jsx("span",{className:"catalog-list__description",children:P.description})]}),E.jsxs("span",{className:"catalog-list__meta",children:[E.jsx("span",{children:P.categoryName}),P.tierLabel&&E.jsx("span",{className:"tier-badge",children:P.tierLabel})]})]}),E.jsx("button",{className:"catalog-favorite",type:"button","aria-pressed":b.includes(P.id),"aria-label":l(b.includes(P.id)?"catalog.removeFavorite":"catalog.addFavorite",{name:P.name}),onClick:()=>U(P.id),children:E.jsx(_p,{size:20,"aria-hidden":"true"})})]},P.id))})]})}const eo=Object.freeze({privacy:Object.freeze({testId:"privacy",eyebrow:"Transparente Datenbearbeitung",title:"Datenschutz",intro:"Folkkit verarbeitet ausgewählte Inhalte im Browser. Beim Laden der Website können trotzdem technische Zugriffsdaten anfallen. Diese Erklärung trennt beide Vorgänge.",operatorTitle:"Verantwortliche Stelle",operatorMissing:"Die öffentlichen Betreiberangaben wurden für diesen privaten Vorabstand noch nicht freigegeben. Ein Release-Build bleibt gesperrt, bis Name und Kontakt-E-Mail genehmigt und hinterlegt sind.",sourcesLabel:"Offizielle Orientierung",sources:Object.freeze([Object.freeze({id:"edoeb-privacy-statements",label:"EDÖB: Datenschutzerklärungen im Internet",url:"https://www.edoeb.admin.ch/de/datenschutzerklaerungen-im-internet"}),Object.freeze({id:"edoeb-information-duty",label:"EDÖB: Informationspflicht",url:"https://www.edoeb.admin.ch/de/informationspflicht"})]),sections:Object.freeze([Object.freeze({id:"local-processing",title:"Lokale Dateiverarbeitung",paragraphs:Object.freeze(["Ausgewählte Dateien, eingefügte Inhalte, Vorschauen und Ergebnisse verarbeitet Folkkit lokal im Browser auf deinem Gerät. Diese Inhalte werden nicht zur Bearbeitung an einen Anwendungsserver übertragen.","Die Verarbeitung kann Arbeitsspeicher, Prozessor und lokale Browserfunktionen beanspruchen. Beim Verwerfen, Zurücksetzen oder Verlassen eines Werkzeugs entfernt Folkkit seine temporären Objekt-URLs und Arbeitsspeicherverweise, soweit der Browser dies zulässt."])}),Object.freeze({id:"same-origin-cache",title:"Website-Dateien und Offline-Cache",paragraphs:Object.freeze(["Der Browser lädt HTML, JavaScript, CSS, Manifest, Favicon sowie bei Bedarf PDF-, QR- und FFmpeg-Module inklusive WebAssembly vom gleichen Ursprung wie die Website.","Ein Service Worker kann diese Anwendungsdateien für die Offline-Nutzung im Cache Storage speichern. Ausgewählte Dateien, Eingaben, Vorschauen, Ergebnisse und die optionale Inhaltschronik werden nicht in diesem Offline-Cache gespeichert."])}),Object.freeze({id:"history",title:"Optionale lokale Inhaltschronik",paragraphs:Object.freeze(["Inhalte bleiben standardmässig nur während der aktuellen Sitzung verfügbar. Eine lokale Inhaltschronik speichert begrenzte Ein- und Ausgaben im Local Storage dieses Browsers erst, wenn du sie ausdrücklich aktivierst.","Du kannst einzelne Einträge löschen, die ganze Inhaltschronik löschen oder die Einwilligung widerrufen. Beim Widerruf entfernt Folkkit die gespeicherte Inhaltschronik auf diesem Gerät."])}),Object.freeze({id:"host-logs",title:"Technische Zugriffsprotokolle bei Hosttech",paragraphs:Object.freeze(["Ob Hosttech technische Zugriffsprotokolle erstellt und welche Daten sie enthalten, hängt von der aktiven Hosting-Konfiguration ab. Mögliche Felder sind IP-Adresse, Zeitpunkt, angeforderter Pfad, Referrer und User-Agent.","Umfang, Zweck und Aufbewahrungsdauer müssen vor der öffentlichen Veröffentlichung anhand dieser Konfiguration bestätigt werden. Für diese Vorabversion liegt dazu keine verifizierte Konfiguration vor."])}),Object.freeze({id:"no-tracking",title:"Keine Analytik, Werbung oder Telemetrie",paragraphs:Object.freeze(["Folkkit V1 enthält keine Analytik, keine Telemetrie, keine Werbeskripte und keine Anzeigen. Das passive AdSense-Metadatum im HTML-Head bezeichnet lediglich ein mögliches künftiges Eigentümerkonto. Dieses Metadatum löst selbst keine Netzwerkverbindung, Cookies oder Anzeigenlaufzeit aus.","Externe Links zu EDÖB, GNU, GitHub oder FFmpeg werden erst aufgerufen, wenn du ihnen folgst. Dann gelten die Datenschutzbestimmungen des jeweiligen Ziels."])}),Object.freeze({id:"preferences-rights",title:"Einstellungen und Anliegen",paragraphs:Object.freeze(["Sprache, Design, Favoriten, zuletzt verwendete Werkzeug-IDs und die Entscheidung zur Inhaltschronik können lokal im Browser gespeichert werden. Diese Einstellungen enthalten standardmässig keine ausgewählten Dateien oder konvertierten Ergebnisse.","Datenschutzanliegen und Begehren zu Auskunft, Berichtigung oder Löschung können über die auf der Kontaktseite veröffentlichte Kontakt-E-Mail eingereicht werden, sobald die genehmigten Angaben für den öffentlichen Release hinterlegt sind."])})])}),source:Object.freeze({testId:"open-source",eyebrow:"Offener Quellcode",title:"Open Source",intro:"Der Code hinter Folkkit ist öffentlich. Du kannst ihn lesen und unter den Lizenzbedingungen weiterverwenden.",revisionLabel:"Diese Version",revisionLink:"Exakte Revision auf GitHub öffnen",availabilityNote:"Der vollständige Quellcode ist auf GitHub ohne Anmeldung einsehbar. Der Link führt zum Stand dieser Version.",sourcesLabel:"Projektquellen",sources:Object.freeze([Object.freeze({id:"upstream",label:"Upstream: MercuriusDream/convert-everything",url:"https://github.com/MercuriusDream/convert-everything"}),Object.freeze({id:"gnu-agpl",label:"GNU Affero General Public License 3.0",url:"https://www.gnu.org/licenses/agpl-3.0.html"})]),sections:Object.freeze([Object.freeze({id:"license",title:"Folkkit-Lizenz",paragraphs:Object.freeze(["Folkkit ist als Gesamtwerk ausschliesslich unter AGPL-3.0-only veröffentlicht. Der vollständige Lizenztext liegt im Repository in der Datei LICENSE."])}),Object.freeze({id:"upstream",title:"Herkunft und Änderungen",paragraphs:Object.freeze(["Folkkit basiert auf Convert Everything von MercuriusDream. Die Git-Historie, Urheberhinweise und der Upstream-Verweis bleiben erhalten.","Folkkit ergänzt unter anderem die zweisprachige Oberfläche, lokale Datenschutzkontrollen, Laufzeitgrenzen, Offline-Verhalten sowie diese Rechts- und Quellcodeflächen."])})])}),licenses:Object.freeze({testId:"licenses",eyebrow:"Lizenznachweise",title:"Lizenzen",intro:"Folkkit und die mitgelieferten Laufzeitkomponenten unterliegen ihren jeweiligen Lizenzen. Die generierten Hinweise stammen aus der gesperrten Abhängigkeitsstruktur und dem manuellen Laufzeit-Asset-Register.",noticesTitle:"Generierte Hinweise zu Drittkomponenten",noticesIntro:"Die folgende Datei wird deterministisch aus bun.lock und scripts/runtime-assets.json erzeugt. Sie umfasst direkte und transitive Laufzeitpakete, das Favicon, den Verzicht auf eingebettete Schriftdateien sowie FFmpeg-JavaScript und WebAssembly.",sourcesLabel:"Primäre Lizenzquellen",sources:Object.freeze([Object.freeze({id:"gnu-agpl",label:"GNU Affero General Public License 3.0",url:"https://www.gnu.org/licenses/agpl-3.0.html"}),Object.freeze({id:"ffmpeg-legal",label:"FFmpeg: Lizenz und rechtliche Hinweise",url:"https://ffmpeg.org/legal.html"})]),sections:Object.freeze([Object.freeze({id:"folkkit",title:"Folkkit und Upstream",paragraphs:Object.freeze(["Folkkit bleibt AGPL-3.0-only. Die Lizenz erlaubt Nutzung, Änderung und Weitergabe unter ihren Bedingungen und enthält Haftungs- und Gewährleistungsausschlüsse im gesetzlich zulässigen Umfang.","Die Herkunft von MercuriusDream/convert-everything sowie dessen Historie und Hinweise bleiben Teil des Projekts."])}),Object.freeze({id:"ffmpeg",title:"FFmpeg und ffmpeg.wasm",paragraphs:Object.freeze(["FFmpeg steht überwiegend unter LGPL-2.1-or-later; optionale Bestandteile können GPL-2.0-or-later unterliegen. Das ausgelieferte Paket @ffmpeg/core 0.12.10 deklariert GPL-2.0-or-later. Die erzeugten Hinweise führen die konkreten Paket- und Asset-Angaben auf.","Die FFmpeg-Core-Dateien werden als JavaScript und WebAssembly vom gleichen Ursprung ausgeliefert. Ihre Registrierung ausserhalb der JavaScript-Abhängigkeitsliste verhindert, dass WASM bei der Lizenzprüfung übersehen wird."])})])}),terms:Object.freeze({testId:"terms",eyebrow:"Rahmen der Nutzung",title:"Nutzungsbedingungen",intro:"Diese Bedingungen beschreiben den technischen Zweck und die Grenzen von Folkkit V1. Sie sind keine Zusicherung für einen bestimmten Verwendungszweck.",sourcesLabel:"Lizenzgrundlage",sources:Object.freeze([Object.freeze({id:"gnu-agpl",label:"GNU Affero General Public License 3.0",url:"https://www.gnu.org/licenses/agpl-3.0.html"}),Object.freeze({id:"source",label:"Quellcode und Build-Revision",url:"/open-source"})]),sections:Object.freeze([Object.freeze({id:"scope",title:"Zweck und Verfügbarkeit",paragraphs:Object.freeze(["Folkkit stellt kostenlose, kontolose Browserwerkzeuge für gelegentliche Datei-, Text-, PDF-, QR- und Rechenaufgaben bereit. Es besteht kein Anspruch auf dauernde Verfügbarkeit, Fehlerfreiheit oder Unterstützung eines bestimmten Browsers oder Dateiformats.","Werkzeuge können Eingaben wegen Dateigrösse, Format, Gerätespeicher oder fehlender Browserfunktionen ablehnen. Experimentelle Medienwerkzeuge können besonders viel Arbeitsspeicher und Rechenleistung benötigen."])}),Object.freeze({id:"responsibility",title:"Eigene Verantwortung",paragraphs:Object.freeze(["Du bist dafür verantwortlich, dass du Dateien und Inhalte bearbeiten darfst und Ergebnisse vor ihrer weiteren Verwendung prüfst. Bewahre wichtige Originale und Sicherungskopien ausserhalb von Folkkit auf.","Folkkit prüft nicht, ob ein Ergebnis für einen bestimmten rechtlichen Zweck genügt, und übernimmt keine Gewähr dafür, dass ein Ergebnis rechtlich wirksam oder konform ist."])}),Object.freeze({id:"medical",title:"Gesundheitsbezogene Rechenhilfe",paragraphs:Object.freeze(["Der BMI-Rechner ist nur eine allgemeine Rechenhilfe und keine medizinische Beratung, Diagnose oder Behandlungsempfehlung. Besprich gesundheitliche Fragen mit einer qualifizierten Fachperson.","Ein Rechenergebnis berücksichtigt keine individuelle Krankengeschichte, keine Körperzusammensetzung und keine weiteren medizinischen Faktoren."])}),Object.freeze({id:"finance",title:"Finanzbezogene Rechenhilfe",paragraphs:Object.freeze(["Der Kreditrechner ist nur eine vereinfachte Rechenhilfe und keine Finanzberatung, Kreditzusage oder Offerte. Konditionen, Gebühren, Steuern, Rundungen und Zahlungspläne können in der Praxis abweichen.","Triff keine finanzielle Entscheidung allein aufgrund eines Folkkit-Ergebnisses. Prüfe die massgeblichen Vertragsunterlagen und hole bei Bedarf fachliche Beratung ein."])}),Object.freeze({id:"license",title:"Open-Source-Lizenz und Drittkomponenten",paragraphs:Object.freeze(["Folkkit wird unter AGPL-3.0-only bereitgestellt. Für Drittkomponenten gelten die auf der Lizenzseite aufgeführten Bedingungen und Hinweise.","Soweit das anwendbare Recht es zulässt, gelten die Gewährleistungs- und Haftungsregeln der jeweiligen Open-Source-Lizenzen. Zwingende gesetzliche Rechte bleiben unberührt."])})])}),contact:Object.freeze({testId:"contact",eyebrow:"Betreiber und Anfragen",title:"Kontakt",intro:"Die öffentliche Kontaktseite darf nur genehmigte Betreiberangaben anzeigen.",operatorTitle:"Öffentliche Betreiberangaben",operatorMissing:"Die öffentlichen Betreiberangaben wurden für diesen privaten Vorabstand noch nicht freigegeben. Ein Release-Build bleibt bis zur Hinterlegung von Name und Kontakt-E-Mail gesperrt.",emailLabel:"E-Mail schreiben",sourcesLabel:"Weitere Informationen",sources:Object.freeze([Object.freeze({id:"privacy",label:"Datenschutzerklärung",url:"/privacy"}),Object.freeze({id:"source",label:"Quellcode und Build-Revision",url:"/open-source"})]),sections:Object.freeze([Object.freeze({id:"requests",title:"Anliegen",paragraphs:Object.freeze(["Nutze die veröffentlichte Kontakt-E-Mail für Fragen zum Betrieb, zum Datenschutz oder zur Ausübung datenschutzrechtlicher Rechte.","Übermittle keine vertraulichen Dateiinhalte, Gesundheitsdaten, Finanzdaten oder Zugangsdaten per unverschlüsselter E-Mail."])}),Object.freeze({id:"tool-support",title:"Technische Hinweise",paragraphs:Object.freeze(["Nenne bei einem technischen Problem das Werkzeug, den Browser, die ungefähre Dateigrösse und die angezeigte Fehlermeldung. Sende die betroffene Datei nur nach einer ausdrücklichen und geeigneten sicheren Absprache.","Folkkit enthält keine Telemetrie. Der Betreiber erhält deshalb nicht automatisch Informationen über fehlgeschlagene Verarbeitungsvorgänge."])})])})}),to=Object.freeze({privacy:Object.freeze({testId:"privacy",eyebrow:"Transparent data processing",title:"Privacy",intro:"Folkkit processes selected content in the browser. Technical access data may still arise when the website loads. This notice separates those two processes.",operatorTitle:"Controller",operatorMissing:"The public operator details have not yet been approved for this private pre-release. A release build remains blocked until the approved name and contact email are provided.",sourcesLabel:"Official guidance",sources:Object.freeze([Object.freeze({id:"edoeb-privacy-statements",label:"FDPIC: Privacy policies on the internet",url:"https://www.edoeb.admin.ch/de/datenschutzerklaerungen-im-internet"}),Object.freeze({id:"edoeb-information-duty",label:"FDPIC: Duty to provide information",url:"https://www.edoeb.admin.ch/de/informationspflicht"})]),sections:Object.freeze([Object.freeze({id:"local-processing",title:"Local file processing",paragraphs:Object.freeze(["Folkkit processes selected files, pasted content, previews, and results locally in the browser on your device. It does not transfer that content to an application server for processing.","Processing may use memory, processor capacity, and local browser features. When you discard or reset work or leave a tool, Folkkit removes its temporary object URLs and memory references as far as the browser permits."])}),Object.freeze({id:"same-origin-cache",title:"Website files and offline cache",paragraphs:Object.freeze(["The browser loads HTML, JavaScript, CSS, the manifest, the favicon, and, when needed, PDF, QR, and FFmpeg modules including WebAssembly from the same origin as the website.","A service worker may store these application files in Cache Storage for offline use. Selected files, inputs, previews, results, and optional content history are not stored in that offline cache."])}),Object.freeze({id:"history",title:"Optional local content history",paragraphs:Object.freeze(["Content is available only for the current session by default. Local content history stores limited inputs and outputs in this browser's Local Storage only after you explicitly enable it.","You can delete individual entries, clear all content history, or withdraw consent. When you withdraw consent, Folkkit removes the stored content history from this device."])}),Object.freeze({id:"host-logs",title:"Technical access logs at Hosttech",paragraphs:Object.freeze(["Whether Hosttech creates technical access logs and which data they contain depends on the active hosting configuration. Possible fields are the IP address, timestamp, requested path, referrer, and user agent.","The scope, purpose, and retention period must be confirmed against that configuration before public release. No verified configuration is available for this pre-release."])}),Object.freeze({id:"no-tracking",title:"No analytics, advertising, or telemetry",paragraphs:Object.freeze(["Folkkit V1 contains no analytics, telemetry, advertising scripts, or ads. Passive AdSense ownership metadata in the HTML head merely identifies a possible future owner account. The metadata itself causes no network connection, cookies, or advertising runtime.","External links to the FDPIC, GNU, GitHub, or FFmpeg are opened only when you follow them. The destination's privacy terms then apply."])}),Object.freeze({id:"preferences-rights",title:"Preferences and requests",paragraphs:Object.freeze(["Language, theme, favourites, recent tool IDs, and the content history choice may be stored locally in the browser. By default, these preferences contain no selected files or converted results.","Privacy questions and requests for access, correction, or deletion can be submitted through the contact email published on the contact page once approved details are configured for public release."])})])}),source:Object.freeze({testId:"open-source",eyebrow:"Open code",title:"Open source",intro:"The code behind Folkkit is public. You can read and reuse it under the license terms.",revisionLabel:"This version",revisionLink:"Open exact revision on GitHub",availabilityNote:"The full source code is available on GitHub without signing in. The link opens the source for this version.",sourcesLabel:"Project sources",sources:Object.freeze([Object.freeze({id:"upstream",label:"Upstream: MercuriusDream/convert-everything",url:"https://github.com/MercuriusDream/convert-everything"}),Object.freeze({id:"gnu-agpl",label:"GNU Affero General Public License 3.0",url:"https://www.gnu.org/licenses/agpl-3.0.html"})]),sections:Object.freeze([Object.freeze({id:"license",title:"Folkkit license",paragraphs:Object.freeze(["Folkkit as a whole is released exclusively under AGPL-3.0-only. The full license text is stored in the repository as LICENSE."])}),Object.freeze({id:"upstream",title:"Origin and modifications",paragraphs:Object.freeze(["Folkkit is based on Convert Everything by MercuriusDream. The Git history, copyright notices, and upstream reference remain intact.","Folkkit adds the bilingual interface, local privacy controls, runtime limits, offline behaviour, and these legal and source surfaces, among other changes."])})])}),licenses:Object.freeze({testId:"licenses",eyebrow:"License records",title:"Licenses",intro:"Folkkit and its bundled runtime components are subject to their respective licenses. The generated notices come from the locked dependency graph and the manually maintained runtime asset register.",noticesTitle:"Generated third-party notices",noticesIntro:"The following file is generated deterministically from bun.lock and scripts/runtime-assets.json. It covers direct and transitive runtime packages, the favicon, the absence of embedded font files, and the FFmpeg JavaScript and WebAssembly assets.",sourcesLabel:"Primary license sources",sources:Object.freeze([Object.freeze({id:"gnu-agpl",label:"GNU Affero General Public License 3.0",url:"https://www.gnu.org/licenses/agpl-3.0.html"}),Object.freeze({id:"ffmpeg-legal",label:"FFmpeg: License and legal considerations",url:"https://ffmpeg.org/legal.html"})]),sections:Object.freeze([Object.freeze({id:"folkkit",title:"Folkkit and upstream",paragraphs:Object.freeze(["Folkkit remains AGPL-3.0-only. The license permits use, modification, and redistribution under its conditions and includes warranty and liability disclaimers to the extent permitted by law.","The origin in MercuriusDream/convert-everything, its history, and its notices remain part of the project."])}),Object.freeze({id:"ffmpeg",title:"FFmpeg and ffmpeg.wasm",paragraphs:Object.freeze(["FFmpeg is mostly licensed under LGPL-2.1-or-later, while optional parts may be covered by GPL-2.0-or-later. The shipped @ffmpeg/core 0.12.10 package declares GPL-2.0-or-later. The generated notices list the concrete package and asset metadata.","FFmpeg core files are served as same-origin JavaScript and WebAssembly. Registering them outside the JavaScript dependency list prevents the WASM asset from being missed during license review."])})])}),terms:Object.freeze({testId:"terms",eyebrow:"Terms of use",title:"Terms",intro:"These terms describe the technical purpose and limits of Folkkit V1. They do not promise fitness for a particular use.",sourcesLabel:"License basis",sources:Object.freeze([Object.freeze({id:"gnu-agpl",label:"GNU Affero General Public License 3.0",url:"https://www.gnu.org/licenses/agpl-3.0.html"}),Object.freeze({id:"source",label:"Source code and build revision",url:"/open-source"})]),sections:Object.freeze([Object.freeze({id:"scope",title:"Purpose and availability",paragraphs:Object.freeze(["Folkkit provides free, accountless browser tools for occasional file, text, PDF, QR, and calculation tasks. There is no entitlement to continuous availability, error-free operation, or support for a particular browser or file format.","Tools may reject input because of file size, format, device memory, or missing browser capabilities. Experimental media tools may require substantial memory and processor capacity."])}),Object.freeze({id:"responsibility",title:"Your responsibility",paragraphs:Object.freeze(["You are responsible for having the right to process files and content and for checking results before further use. Keep important originals and backups outside Folkkit.","Folkkit does not check whether output meets a particular legal requirement and gives no guarantee that output is legally effective or compliant."])}),Object.freeze({id:"medical",title:"Health calculation aid",paragraphs:Object.freeze(["The BMI calculator is a general calculation aid only. It is not medical advice, a diagnosis, or a treatment recommendation. Discuss health questions with a qualified professional.","A calculation does not account for individual medical history, body composition, or other medical factors."])}),Object.freeze({id:"finance",title:"Financial calculation aid",paragraphs:Object.freeze(["The loan calculator is a simplified calculation aid only. It is not financial advice, a credit decision, or an offer. Terms, fees, taxes, rounding, and payment schedules may differ in practice.","Do not make a financial decision based only on a Folkkit result. Check the relevant contract documents and obtain professional advice if needed."])}),Object.freeze({id:"license",title:"Open-source license and third-party components",paragraphs:Object.freeze(["Folkkit is provided under AGPL-3.0-only. The conditions and notices shown on the licenses page apply to third-party components.","To the extent permitted by applicable law, the warranty and liability terms of the respective open-source licenses apply. Mandatory statutory rights remain unaffected."])})])}),contact:Object.freeze({testId:"contact",eyebrow:"Operator and requests",title:"Contact",intro:"The public contact page may display only approved operator details.",operatorTitle:"Public operator details",operatorMissing:"The public operator details have not yet been approved for this private pre-release. A release build remains blocked until the name and contact email are provided.",emailLabel:"Send email",sourcesLabel:"More information",sources:Object.freeze([Object.freeze({id:"privacy",label:"Privacy notice",url:"/privacy"}),Object.freeze({id:"source",label:"Source code and build revision",url:"/open-source"})]),sections:Object.freeze([Object.freeze({id:"requests",title:"Requests",paragraphs:Object.freeze(["Use the published contact email for questions about operation, privacy, or the exercise of data protection rights.","Do not send confidential file contents, health data, financial data, or credentials by unencrypted email."])}),Object.freeze({id:"tool-support",title:"Technical information",paragraphs:Object.freeze(["For a technical problem, state the tool, browser, approximate file size, and displayed error message. Send the affected file only after an explicit arrangement through a suitable secure channel.","Folkkit contains no telemetry. The operator therefore receives no automatic information about failed processing operations."])})])})}),bb={VITE_PUBLIC_CONTACT_EMAIL:"ruskoigor25@gmail.com",VITE_PUBLIC_OPERATOR_NAME:"Igor Rusko"},Kp=Object.freeze({VITE_PUBLIC_OPERATOR_NAME:"Example Operator",VITE_PUBLIC_CONTACT_EMAIL:"operator@example.com"});function Zp(n){return typeof n=="string"?n.trim():""}function Tb(n={}){return Object.freeze({name:Zp(n.VITE_PUBLIC_OPERATOR_NAME),email:Zp(n.VITE_PUBLIC_CONTACT_EMAIL)})}function Eb(n){const s=[];return n.name?n.name.toLowerCase()===Kp.VITE_PUBLIC_OPERATOR_NAME.toLowerCase()&&s.push("VITE_PUBLIC_OPERATOR_NAME still contains the example value."):s.push("VITE_PUBLIC_OPERATOR_NAME is required."),n.email?n.email.toLowerCase()===Kp.VITE_PUBLIC_CONTACT_EMAIL.toLowerCase()?s.push("VITE_PUBLIC_CONTACT_EMAIL still contains the example value."):/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(n.email)||s.push("VITE_PUBLIC_CONTACT_EMAIL must be a valid email address."):s.push("VITE_PUBLIC_CONTACT_EMAIL is required."),s}function hf(n){return Eb(n).length===0}const Ob=bb||{},Un=Tb(Ob);function no({content:n,children:s}){const l=`legal-title-${n.testId}`;return E.jsxs("article",{className:"legal-page page-frame","aria-labelledby":l,"data-testid":`legal-page-${n.testId}`,children:[E.jsxs("header",{className:"legal-page__header",children:[E.jsx("p",{className:"eyebrow",children:n.eyebrow}),E.jsx("h1",{id:l,className:"display",children:n.title}),E.jsx("p",{children:n.intro})]}),s,E.jsx("div",{className:"legal-page__sections",children:n.sections.map(c=>E.jsxs("section",{id:c.id,"aria-labelledby":`${n.testId}-${c.id}`,children:[E.jsx("h2",{id:`${n.testId}-${c.id}`,children:c.title}),c.paragraphs.map(p=>E.jsx("p",{children:p},p))]},c.id))}),E.jsxs("section",{className:"legal-page__sources","aria-labelledby":`${n.testId}-sources`,children:[E.jsx("h2",{id:`${n.testId}-sources`,children:n.sourcesLabel}),E.jsx("ul",{children:n.sources.map(c=>E.jsx("li",{children:E.jsx("a",{href:c.url,children:c.label})},c.id))})]})]})}function vb(){const{locale:n}=Lt(),s=(n==="en"?to:eo).contact,l=hf(Un);return E.jsx(no,{content:s,children:E.jsxs("section",{className:"legal-page__operator","aria-labelledby":"contact-operator",children:[E.jsx("h2",{id:"contact-operator",children:s.operatorTitle}),l?E.jsxs("address",{children:[E.jsx("strong",{children:Un.name}),E.jsxs("a",{href:`mailto:${Un.email}`,children:[s.emailLabel,": ",Un.email]})]}):E.jsx("p",{className:"legal-page__gate",children:s.operatorMissing})]})})}const Sb="/assets/qr-preview-DebKZAhx.svg",Ab=[{kind:"qr",title:"home.qrTitle",body:"home.qrBody",icon:lb},{kind:"pdf",title:"home.pdfTitle",body:"home.pdfBody",icon:df},{kind:"convert",title:"home.convertTitle",body:"home.convertBody",icon:Qy}];function wb({kind:n,t:s}){return n==="qr"?E.jsxs("div",{className:"tool-preview tool-preview--qr","aria-hidden":"true",children:[E.jsxs("div",{className:"qr-sample",children:[E.jsx("img",{src:Sb,alt:"",width:"156",height:"156"}),E.jsx("span",{className:"qr-sample__mark",children:"f."})]}),E.jsxs("div",{className:"preview-swatches",children:[E.jsx("span",{}),E.jsx("span",{}),E.jsx("span",{})]})]}):n==="pdf"?E.jsxs("div",{className:"tool-preview tool-preview--pdf","aria-hidden":"true",children:[E.jsxs("div",{className:"pdf-sample",children:[E.jsx("span",{className:"pdf-sample__tag",children:"PDF"}),E.jsx("strong",{children:s("home.sampleTitle")}),E.jsx("p",{children:s("home.sampleLine1")}),E.jsx("mark",{children:s("home.sampleLine2")}),E.jsx("p",{children:s("home.sampleLine3")}),E.jsx("span",{className:"pdf-sample__cursor"})]}),E.jsxs("div",{className:"pdf-sample__toolbar",children:[E.jsx("span",{children:"T"}),E.jsx("span",{children:"↗"}),E.jsx("span",{children:"✓"})]})]}):E.jsxs("div",{className:"tool-preview tool-preview--convert","aria-hidden":"true",children:[E.jsxs("div",{className:"convert-sample",children:[E.jsx(rb,{size:26,stroke:1.5}),E.jsx("span",{children:"PNG"}),E.jsx(Xi,{size:22}),E.jsx("strong",{children:"WEBP"})]}),E.jsxs("div",{className:"convert-sample convert-sample--secondary",children:[E.jsx(df,{size:26,stroke:1.5}),E.jsx("span",{children:"PDF"}),E.jsx(Xi,{size:22}),E.jsx("strong",{children:"JPG"})]})]})}function Rb({onOpenCore:n,onOpenCatalog:s}){const{t:l}=Lt();return E.jsxs("div",{className:"home-page page-frame studio-home",children:[E.jsx("section",{className:"home-hero","aria-labelledby":"home-title",children:E.jsxs("div",{className:"heading-group",children:[E.jsx("h1",{id:"home-title",className:"display",children:l("home.title")}),E.jsx("p",{className:"home-hero__intro",children:l("home.intro")})]})}),E.jsxs("section",{className:"core-entry-section","aria-label":l("home.eyebrow"),children:[E.jsx("div",{className:"core-entry-grid",children:Ab.map(c=>E.jsxs("button",{className:`core-entry core-entry--${c.kind}`,type:"button","aria-label":l(c.title),onClick:()=>n(c.kind),children:[E.jsx(wb,{kind:c.kind,t:l}),E.jsxs("span",{className:"core-entry__content",children:[E.jsxs("span",{className:"core-entry__title",children:[E.jsx(c.icon,{size:22,stroke:1.7,"aria-hidden":"true"}),l(c.title)]}),E.jsx("span",{className:"core-entry__body",children:l(c.body)})]}),E.jsx("span",{className:"core-entry__go","aria-hidden":"true",children:E.jsx(Xi,{size:22})})]},c.kind))}),E.jsxs("button",{className:"calculator-entry",type:"button",onClick:()=>n("calculate"),children:[E.jsx("span",{className:"calculator-entry__icon","aria-hidden":"true",children:E.jsx(Jy,{size:26,stroke:1.6})}),E.jsxs("span",{children:[E.jsx("strong",{children:l("home.calculateTitle")}),E.jsx("span",{children:l("home.calculateBody")})]}),E.jsx(Xi,{size:22,"aria-hidden":"true"})]}),E.jsxs("button",{className:"catalog-link",type:"button",onClick:s,children:[l("home.catalogLink"),E.jsx(Xi,{size:18,"aria-hidden":"true"})]})]})]})}const Fb=`# Folkkit Third-Party Notices

This file is generated deterministically from \`bun.lock\` and \`scripts/runtime-assets.json\`. Do not edit it manually.

## Application license and upstream attribution

- Folkkit is licensed under \`AGPL-3.0-only\`.
- License text: GNU Affero General Public License 3.0
- Upstream project: MercuriusDream/convert-everything

## Bundled runtime packages

The locked runtime graph contains 48 direct and transitive packages. License identifiers and source links come from the installed package metadata for the exact locked versions. Available license, licence, copying, and notice files are preserved below.

### @embedpdf/pdfium 2.15.0

- License: \`MIT\`
- Source: [external reference listed in repository notices]

<details>
<summary>LICENSE</summary>

\`\`\`text
MIT License

Copyright (c) 2024 CloudPDF, Ji Chang

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

<details>
<summary>LICENSE.pdfium</summary>

\`\`\`text
// Copyright 2014 PDFium Authors. All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are
// met:
//
//    * Redistributions of source code must retain the above copyright
// notice, this list of conditions and the following disclaimer.
//    * Redistributions in binary form must reproduce the above
// copyright notice, this list of conditions and the following disclaimer
// in the documentation and/or other materials provided with the
// distribution.
//    * Neither the name of Google Inc. nor the names of its
// contributors may be used to endorse or promote products derived from
// this software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
// "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
// LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
// A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
// OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
// LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
// DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
// THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
// (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
                                 Apache License
                           Version 2.0, January 2004
                        [external reference listed in repository notices]
   TERMS AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTION
   1. Definitions.
      "License" shall mean the terms and conditions for use, reproduction,
      and distribution as defined by Sections 1 through 9 of this document.
      "Licensor" shall mean the copyright owner or entity authorized by
      the copyright owner that is granting the License.
      "Legal Entity" shall mean the union of the acting entity and all
      other entities that control, are controlled by, or are under common
      control with that entity. For the purposes of this definition,
      "control" means (i) the power, direct or indirect, to cause the
      direction or management of such entity, whether by contract or
      otherwise, or (ii) ownership of fifty percent (50%) or more of the
      outstanding shares, or (iii) beneficial ownership of such entity.
      "You" (or "Your") shall mean an individual or Legal Entity
      exercising permissions granted by this License.
      "Source" form shall mean the preferred form for making modifications,
      including but not limited to software source code, documentation
      source, and configuration files.
      "Object" form shall mean any form resulting from mechanical
      transformation or translation of a Source form, including but
      not limited to compiled object code, generated documentation,
      and conversions to other media types.
      "Work" shall mean the work of authorship, whether in Source or
      Object form, made available under the License, as indicated by a
      copyright notice that is included in or attached to the work
      (an example is provided in the Appendix below).
      "Derivative Works" shall mean any work, whether in Source or Object
      form, that is based on (or derived from) the Work and for which the
      editorial revisions, annotations, elaborations, or other modifications
      represent, as a whole, an original work of authorship. For the purposes
      of this License, Derivative Works shall not include works that remain
      separable from, or merely link (or bind by name) to the interfaces of,
      the Work and Derivative Works thereof.
      "Contribution" shall mean any work of authorship, including
      the original version of the Work and any modifications or additions
      to that Work or Derivative Works thereof, that is intentionally
      submitted to Licensor for inclusion in the Work by the copyright owner
      or by an individual or Legal Entity authorized to submit on behalf of
      the copyright owner. For the purposes of this definition, "submitted"
      means any form of electronic, verbal, or written communication sent
      to the Licensor or its representatives, including but not limited to
      communication on electronic mailing lists, source code control systems,
      and issue tracking systems that are managed by, or on behalf of, the
      Licensor for the purpose of discussing and improving the Work, but
      excluding communication that is conspicuously marked or otherwise
      designated in writing by the copyright owner as "Not a Contribution."
      "Contributor" shall mean Licensor and any individual or Legal Entity
      on behalf of whom a Contribution has been received by Licensor and
      subsequently incorporated within the Work.
   2. Grant of Copyright License. Subject to the terms and conditions of
      this License, each Contributor hereby grants to You a perpetual,
      worldwide, non-exclusive, no-charge, royalty-free, irrevocable
      copyright license to reproduce, prepare Derivative Works of,
      publicly display, publicly perform, sublicense, and distribute the
      Work and such Derivative Works in Source or Object form.
   3. Grant of Patent License. Subject to the terms and conditions of
      this License, each Contributor hereby grants to You a perpetual,
      worldwide, non-exclusive, no-charge, royalty-free, irrevocable
      (except as stated in this section) patent license to make, have made,
      use, offer to sell, sell, import, and otherwise transfer the Work,
      where such license applies only to those patent claims licensable
      by such Contributor that are necessarily infringed by their
      Contribution(s) alone or by combination of their Contribution(s)
      with the Work to which such Contribution(s) was submitted. If You
      institute patent litigation against any entity (including a
      cross-claim or counterclaim in a lawsuit) alleging that the Work
      or a Contribution incorporated within the Work constitutes direct
      or contributory patent infringement, then any patent licenses
      granted to You under this License for that Work shall terminate
      as of the date such litigation is filed.
   4. Redistribution. You may reproduce and distribute copies of the
      Work or Derivative Works thereof in any medium, with or without
      modifications, and in Source or Object form, provided that You
      meet the following conditions:
      (a) You must give any other recipients of the Work or
          Derivative Works a copy of this License; and
      (b) You must cause any modified files to carry prominent notices
          stating that You changed the files; and
      (c) You must retain, in the Source form of any Derivative Works
          that You distribute, all copyright, patent, trademark, and
          attribution notices from the Source form of the Work,
          excluding those notices that do not pertain to any part of
          the Derivative Works; and
      (d) If the Work includes a "NOTICE" text file as part of its
          distribution, then any Derivative Works that You distribute must
          include a readable copy of the attribution notices contained
          within such NOTICE file, excluding those notices that do not
          pertain to any part of the Derivative Works, in at least one
          of the following places: within a NOTICE text file distributed
          as part of the Derivative Works; within the Source form or
          documentation, if provided along with the Derivative Works; or,
          within a display generated by the Derivative Works, if and
          wherever such third-party notices normally appear. The contents
          of the NOTICE file are for informational purposes only and
          do not modify the License. You may add Your own attribution
          notices within Derivative Works that You distribute, alongside
          or as an addendum to the NOTICE text from the Work, provided
          that such additional attribution notices cannot be construed
          as modifying the License.
      You may add Your own copyright statement to Your modifications and
      may provide additional or different license terms and conditions
      for use, reproduction, or distribution of Your modifications, or
      for any such Derivative Works as a whole, provided Your use,
      reproduction, and distribution of the Work otherwise complies with
      the conditions stated in this License.
   5. Submission of Contributions. Unless You explicitly state otherwise,
      any Contribution intentionally submitted for inclusion in the Work
      by You to the Licensor shall be under the terms and conditions of
      this License, without any additional terms or conditions.
      Notwithstanding the above, nothing herein shall supersede or modify
      the terms of any separate license agreement you may have executed
      with Licensor regarding such Contributions.
   6. Trademarks. This License does not grant permission to use the trade
      names, trademarks, service marks, or product names of the Licensor,
      except as required for reasonable and customary use in describing the
      origin of the Work and reproducing the content of the NOTICE file.
   7. Disclaimer of Warranty. Unless required by applicable law or
      agreed to in writing, Licensor provides the Work (and each
      Contributor provides its Contributions) on an "AS IS" BASIS,
      WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
      implied, including, without limitation, any warranties or conditions
      of TITLE, NON-INFRINGEMENT, MERCHANTABILITY, or FITNESS FOR A
      PARTICULAR PURPOSE. You are solely responsible for determining the
      appropriateness of using or redistributing the Work and assume any
      risks associated with Your exercise of permissions under this License.
   8. Limitation of Liability. In no event and under no legal theory,
      whether in tort (including negligence), contract, or otherwise,
      unless required by applicable law (such as deliberate and grossly
      negligent acts) or agreed to in writing, shall any Contributor be
      liable to You for damages, including any direct, indirect, special,
      incidental, or consequential damages of any character arising as a
      result of this License or out of the use or inability to use the
      Work (including but not limited to damages for loss of goodwill,
      work stoppage, computer failure or malfunction, or any and all
      other commercial damages or losses), even if such Contributor
      has been advised of the possibility of such damages.
   9. Accepting Warranty or Additional Liability. While redistributing
      the Work or Derivative Works thereof, You may choose to offer,
      and charge a fee for, acceptance of support, warranty, indemnity,
      or other liability obligations and/or rights consistent with this
      License. However, in accepting such obligations, You may act only
      on Your own behalf and on Your sole responsibility, not on behalf
      of any other Contributor, and only if You agree to indemnify,
      defend, and hold each Contributor harmless for any liability
      incurred by, or claims asserted against, such Contributor by reason
      of your accepting any such warranty or additional liability.
   END OF TERMS AND CONDITIONS
   APPENDIX: How to apply the Apache License to your work.
      To apply the Apache License to your work, attach the following
      boilerplate notice, with the fields enclosed by brackets "[]"
      replaced with your own identifying information. (Don't include
      the brackets!)  The text should be enclosed in the appropriate
      comment syntax for the file format. We also recommend that a
      file or class name and description of purpose be included on the
      same "printed page" as the copyright notice for easier
      identification within third-party archives.
   Copyright [yyyy] [name of copyright owner]
   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at
       [external reference listed in repository notices]
   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
\`\`\`

</details>

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

### @tabler/icons 3.46.0

- License: \`MIT\`
- Source: [external reference listed in repository notices]

<details>
<summary>LICENSE</summary>

\`\`\`text
MIT License

Copyright (c) 2020-2026 Paweł Kuna

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

### @tabler/icons-react 3.46.0

- License: \`MIT\`
- Source: [external reference listed in repository notices]

<details>
<summary>LICENSE</summary>

\`\`\`text
MIT License

Copyright (c) 2020-2026 Paweł Kuna

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

### fflate 0.8.2

- License: \`MIT\`
- Source: [external reference listed in repository notices]

<details>
<summary>LICENSE</summary>

\`\`\`text
MIT License

Copyright (c) 2023 Arjun Barrett

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

### jsqr 1.4.0

- License: \`Apache-2.0\`
- Source: [external reference listed in repository notices]

<details>
<summary>LICENSE</summary>

\`\`\`text
                                 Apache License
                           Version 2.0, January 2004
                        [external reference listed in repository notices]

   TERMS AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTION

   1. Definitions.

      "License" shall mean the terms and conditions for use, reproduction,
      and distribution as defined by Sections 1 through 9 of this document.

      "Licensor" shall mean the copyright owner or entity authorized by
      the copyright owner that is granting the License.

      "Legal Entity" shall mean the union of the acting entity and all
      other entities that control, are controlled by, or are under common
      control with that entity. For the purposes of this definition,
      "control" means (i) the power, direct or indirect, to cause the
      direction or management of such entity, whether by contract or
      otherwise, or (ii) ownership of fifty percent (50%) or more of the
      outstanding shares, or (iii) beneficial ownership of such entity.

      "You" (or "Your") shall mean an individual or Legal Entity
      exercising permissions granted by this License.

      "Source" form shall mean the preferred form for making modifications,
      including but not limited to software source code, documentation
      source, and configuration files.

      "Object" form shall mean any form resulting from mechanical
      transformation or translation of a Source form, including but
      not limited to compiled object code, generated documentation,
      and conversions to other media types.

      "Work" shall mean the work of authorship, whether in Source or
      Object form, made available under the License, as indicated by a
      copyright notice that is included in or attached to the work
      (an example is provided in the Appendix below).

      "Derivative Works" shall mean any work, whether in Source or Object
      form, that is based on (or derived from) the Work and for which the
      editorial revisions, annotations, elaborations, or other modifications
      represent, as a whole, an original work of authorship. For the purposes
      of this License, Derivative Works shall not include works that remain
      separable from, or merely link (or bind by name) to the interfaces of,
      the Work and Derivative Works thereof.

      "Contribution" shall mean any work of authorship, including
      the original version of the Work and any modifications or additions
      to that Work or Derivative Works thereof, that is intentionally
      submitted to Licensor for inclusion in the Work by the copyright owner
      or by an individual or Legal Entity authorized to submit on behalf of
      the copyright owner. For the purposes of this definition, "submitted"
      means any form of electronic, verbal, or written communication sent
      to the Licensor or its representatives, including but not limited to
      communication on electronic mailing lists, source code control systems,
      and issue tracking systems that are managed by, or on behalf of, the
      Licensor for the purpose of discussing and improving the Work, but
      excluding communication that is conspicuously marked or otherwise
      designated in writing by the copyright owner as "Not a Contribution."

      "Contributor" shall mean Licensor and any individual or Legal Entity
      on behalf of whom a Contribution has been received by Licensor and
      subsequently incorporated within the Work.

   2. Grant of Copyright License. Subject to the terms and conditions of
      this License, each Contributor hereby grants to You a perpetual,
      worldwide, non-exclusive, no-charge, royalty-free, irrevocable
      copyright license to reproduce, prepare Derivative Works of,
      publicly display, publicly perform, sublicense, and distribute the
      Work and such Derivative Works in Source or Object form.

   3. Grant of Patent License. Subject to the terms and conditions of
      this License, each Contributor hereby grants to You a perpetual,
      worldwide, non-exclusive, no-charge, royalty-free, irrevocable
      (except as stated in this section) patent license to make, have made,
      use, offer to sell, sell, import, and otherwise transfer the Work,
      where such license applies only to those patent claims licensable
      by such Contributor that are necessarily infringed by their
      Contribution(s) alone or by combination of their Contribution(s)
      with the Work to which such Contribution(s) was submitted. If You
      institute patent litigation against any entity (including a
      cross-claim or counterclaim in a lawsuit) alleging that the Work
      or a Contribution incorporated within the Work constitutes direct
      or contributory patent infringement, then any patent licenses
      granted to You under this License for that Work shall terminate
      as of the date such litigation is filed.

   4. Redistribution. You may reproduce and distribute copies of the
      Work or Derivative Works thereof in any medium, with or without
      modifications, and in Source or Object form, provided that You
      meet the following conditions:

      (a) You must give any other recipients of the Work or
          Derivative Works a copy of this License; and

      (b) You must cause any modified files to carry prominent notices
          stating that You changed the files; and

      (c) You must retain, in the Source form of any Derivative Works
          that You distribute, all copyright, patent, trademark, and
          attribution notices from the Source form of the Work,
          excluding those notices that do not pertain to any part of
          the Derivative Works; and

      (d) If the Work includes a "NOTICE" text file as part of its
          distribution, then any Derivative Works that You distribute must
          include a readable copy of the attribution notices contained
          within such NOTICE file, excluding those notices that do not
          pertain to any part of the Derivative Works, in at least one
          of the following places: within a NOTICE text file distributed
          as part of the Derivative Works; within the Source form or
          documentation, if provided along with the Derivative Works; or,
          within a display generated by the Derivative Works, if and
          wherever such third-party notices normally appear. The contents
          of the NOTICE file are for informational purposes only and
          do not modify the License. You may add Your own attribution
          notices within Derivative Works that You distribute, alongside
          or as an addendum to the NOTICE text from the Work, provided
          that such additional attribution notices cannot be construed
          as modifying the License.

      You may add Your own copyright statement to Your modifications and
      may provide additional or different license terms and conditions
      for use, reproduction, or distribution of Your modifications, or
      for any such Derivative Works as a whole, provided Your use,
      reproduction, and distribution of the Work otherwise complies with
      the conditions stated in this License.

   5. Submission of Contributions. Unless You explicitly state otherwise,
      any Contribution intentionally submitted for inclusion in the Work
      by You to the Licensor shall be under the terms and conditions of
      this License, without any additional terms or conditions.
      Notwithstanding the above, nothing herein shall supersede or modify
      the terms of any separate license agreement you may have executed
      with Licensor regarding such Contributions.

   6. Trademarks. This License does not grant permission to use the trade
      names, trademarks, service marks, or product names of the Licensor,
      except as required for reasonable and customary use in describing the
      origin of the Work and reproducing the content of the NOTICE file.

   7. Disclaimer of Warranty. Unless required by applicable law or
      agreed to in writing, Licensor provides the Work (and each
      Contributor provides its Contributions) on an "AS IS" BASIS,
      WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
      implied, including, without limitation, any warranties or conditions
      of TITLE, NON-INFRINGEMENT, MERCHANTABILITY, or FITNESS FOR A
      PARTICULAR PURPOSE. You are solely responsible for determining the
      appropriateness of using or redistributing the Work and assume any
      risks associated with Your exercise of permissions under this License.

   8. Limitation of Liability. In no event and under no legal theory,
      whether in tort (including negligence), contract, or otherwise,
      unless required by applicable law (such as deliberate and grossly
      negligent acts) or agreed to in writing, shall any Contributor be
      liable to You for damages, including any direct, indirect, special,
      incidental, or consequential damages of any character arising as a
      result of this License or out of the use or inability to use the
      Work (including but not limited to damages for loss of goodwill,
      work stoppage, computer failure or malfunction, or any and all
      other commercial damages or losses), even if such Contributor
      has been advised of the possibility of such damages.

   9. Accepting Warranty or Additional Liability. While redistributing
      the Work or Derivative Works thereof, You may choose to offer,
      and charge a fee for, acceptance of support, warranty, indemnity,
      or other liability obligations and/or rights consistent with this
      License. However, in accepting such obligations, You may act only
      on Your own behalf and on Your sole responsibility, not on behalf
      of any other Contributor, and only if You agree to indemnify,
      defend, and hold each Contributor harmless for any liability
      incurred by, or claims asserted against, such Contributor by reason
      of your accepting any such warranty or additional liability.

   END OF TERMS AND CONDITIONS

   APPENDIX: How to apply the Apache License to your work.

      To apply the Apache License to your work, attach the following
      boilerplate notice, with the fields enclosed by brackets "{}"
      replaced with your own identifying information. (Don't include
      the brackets!)  The text should be enclosed in the appropriate
      comment syntax for the file format. We also recommend that a
      file or class name and description of purpose be included on the
      same "printed page" as the copyright notice for easier
      identification within third-party archives.

   Copyright {yyyy} {name of copyright owner}

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       [external reference listed in repository notices]

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
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

### pngjs 7.0.0

- License: \`MIT\`
- Source: [external reference listed in repository notices]

<details>
<summary>LICENSE</summary>

\`\`\`text
pngjs original work Copyright (c) 2015 Luke Page & Original Contributors
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

### qr-code-styling 1.9.2

- License: \`MIT\`
- Source: [external reference listed in repository notices]

<details>
<summary>LICENSE</summary>

\`\`\`text
MIT License

Copyright (c) 2019 Denys Kozak

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

### qrcode-generator 1.5.2

- License: \`MIT\`
- Source: [external reference listed in repository notices]

<details>
<summary>scripts/license-texts/MIT-qrcode-generator.txt</summary>

\`\`\`text
MIT License

Copyright (c) 2009 Kazuhiko Arase

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

### EmbedPDF PDFium browser engine 2.15.0

- License: \`BSD-3-Clause AND Apache-2.0\`
- Source: [external reference listed in repository notices]
- Deployed paths: \`assets/pdfium-*.wasm\`

<details>
<summary>scripts/license-texts/PDFium-2.15.0.txt</summary>

\`\`\`text
// Copyright 2014 PDFium Authors. All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are
// met:
//
//    * Redistributions of source code must retain the above copyright
// notice, this list of conditions and the following disclaimer.
//    * Redistributions in binary form must reproduce the above
// copyright notice, this list of conditions and the following disclaimer
// in the documentation and/or other materials provided with the
// distribution.
//    * Neither the name of Google Inc. nor the names of its
// contributors may be used to endorse or promote products derived from
// this software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
// "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
// LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
// A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
// OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
// LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
// DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
// THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
// (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
                                 Apache License
                           Version 2.0, January 2004
                        [external reference listed in repository notices]
   TERMS AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTION
   1. Definitions.
      "License" shall mean the terms and conditions for use, reproduction,
      and distribution as defined by Sections 1 through 9 of this document.
      "Licensor" shall mean the copyright owner or entity authorized by
      the copyright owner that is granting the License.
      "Legal Entity" shall mean the union of the acting entity and all
      other entities that control, are controlled by, or are under common
      control with that entity. For the purposes of this definition,
      "control" means (i) the power, direct or indirect, to cause the
      direction or management of such entity, whether by contract or
      otherwise, or (ii) ownership of fifty percent (50%) or more of the
      outstanding shares, or (iii) beneficial ownership of such entity.
      "You" (or "Your") shall mean an individual or Legal Entity
      exercising permissions granted by this License.
      "Source" form shall mean the preferred form for making modifications,
      including but not limited to software source code, documentation
      source, and configuration files.
      "Object" form shall mean any form resulting from mechanical
      transformation or translation of a Source form, including but
      not limited to compiled object code, generated documentation,
      and conversions to other media types.
      "Work" shall mean the work of authorship, whether in Source or
      Object form, made available under the License, as indicated by a
      copyright notice that is included in or attached to the work
      (an example is provided in the Appendix below).
      "Derivative Works" shall mean any work, whether in Source or Object
      form, that is based on (or derived from) the Work and for which the
      editorial revisions, annotations, elaborations, or other modifications
      represent, as a whole, an original work of authorship. For the purposes
      of this License, Derivative Works shall not include works that remain
      separable from, or merely link (or bind by name) to the interfaces of,
      the Work and Derivative Works thereof.
      "Contribution" shall mean any work of authorship, including
      the original version of the Work and any modifications or additions
      to that Work or Derivative Works thereof, that is intentionally
      submitted to Licensor for inclusion in the Work by the copyright owner
      or by an individual or Legal Entity authorized to submit on behalf of
      the copyright owner. For the purposes of this definition, "submitted"
      means any form of electronic, verbal, or written communication sent
      to the Licensor or its representatives, including but not limited to
      communication on electronic mailing lists, source code control systems,
      and issue tracking systems that are managed by, or on behalf of, the
      Licensor for the purpose of discussing and improving the Work, but
      excluding communication that is conspicuously marked or otherwise
      designated in writing by the copyright owner as "Not a Contribution."
      "Contributor" shall mean Licensor and any individual or Legal Entity
      on behalf of whom a Contribution has been received by Licensor and
      subsequently incorporated within the Work.
   2. Grant of Copyright License. Subject to the terms and conditions of
      this License, each Contributor hereby grants to You a perpetual,
      worldwide, non-exclusive, no-charge, royalty-free, irrevocable
      copyright license to reproduce, prepare Derivative Works of,
      publicly display, publicly perform, sublicense, and distribute the
      Work and such Derivative Works in Source or Object form.
   3. Grant of Patent License. Subject to the terms and conditions of
      this License, each Contributor hereby grants to You a perpetual,
      worldwide, non-exclusive, no-charge, royalty-free, irrevocable
      (except as stated in this section) patent license to make, have made,
      use, offer to sell, sell, import, and otherwise transfer the Work,
      where such license applies only to those patent claims licensable
      by such Contributor that are necessarily infringed by their
      Contribution(s) alone or by combination of their Contribution(s)
      with the Work to which such Contribution(s) was submitted. If You
      institute patent litigation against any entity (including a
      cross-claim or counterclaim in a lawsuit) alleging that the Work
      or a Contribution incorporated within the Work constitutes direct
      or contributory patent infringement, then any patent licenses
      granted to You under this License for that Work shall terminate
      as of the date such litigation is filed.
   4. Redistribution. You may reproduce and distribute copies of the
      Work or Derivative Works thereof in any medium, with or without
      modifications, and in Source or Object form, provided that You
      meet the following conditions:
      (a) You must give any other recipients of the Work or
          Derivative Works a copy of this License; and
      (b) You must cause any modified files to carry prominent notices
          stating that You changed the files; and
      (c) You must retain, in the Source form of any Derivative Works
          that You distribute, all copyright, patent, trademark, and
          attribution notices from the Source form of the Work,
          excluding those notices that do not pertain to any part of
          the Derivative Works; and
      (d) If the Work includes a "NOTICE" text file as part of its
          distribution, then any Derivative Works that You distribute must
          include a readable copy of the attribution notices contained
          within such NOTICE file, excluding those notices that do not
          pertain to any part of the Derivative Works, in at least one
          of the following places: within a NOTICE text file distributed
          as part of the Derivative Works; within the Source form or
          documentation, if provided along with the Derivative Works; or,
          within a display generated by the Derivative Works, if and
          wherever such third-party notices normally appear. The contents
          of the NOTICE file are for informational purposes only and
          do not modify the License. You may add Your own attribution
          notices within Derivative Works that You distribute, alongside
          or as an addendum to the NOTICE text from the Work, provided
          that such additional attribution notices cannot be construed
          as modifying the License.
      You may add Your own copyright statement to Your modifications and
      may provide additional or different license terms and conditions
      for use, reproduction, or distribution of Your modifications, or
      for any such Derivative Works as a whole, provided Your use,
      reproduction, and distribution of the Work otherwise complies with
      the conditions stated in this License.
   5. Submission of Contributions. Unless You explicitly state otherwise,
      any Contribution intentionally submitted for inclusion in the Work
      by You to the Licensor shall be under the terms and conditions of
      this License, without any additional terms or conditions.
      Notwithstanding the above, nothing herein shall supersede or modify
      the terms of any separate license agreement you may have executed
      with Licensor regarding such Contributions.
   6. Trademarks. This License does not grant permission to use the trade
      names, trademarks, service marks, or product names of the Licensor,
      except as required for reasonable and customary use in describing the
      origin of the Work and reproducing the content of the NOTICE file.
   7. Disclaimer of Warranty. Unless required by applicable law or
      agreed to in writing, Licensor provides the Work (and each
      Contributor provides its Contributions) on an "AS IS" BASIS,
      WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
      implied, including, without limitation, any warranties or conditions
      of TITLE, NON-INFRINGEMENT, MERCHANTABILITY, or FITNESS FOR A
      PARTICULAR PURPOSE. You are solely responsible for determining the
      appropriateness of using or redistributing the Work and assume any
      risks associated with Your exercise of permissions under this License.
   8. Limitation of Liability. In no event and under no legal theory,
      whether in tort (including negligence), contract, or otherwise,
      unless required by applicable law (such as deliberate and grossly
      negligent acts) or agreed to in writing, shall any Contributor be
      liable to You for damages, including any direct, indirect, special,
      incidental, or consequential damages of any character arising as a
      result of this License or out of the use or inability to use the
      Work (including but not limited to damages for loss of goodwill,
      work stoppage, computer failure or malfunction, or any and all
      other commercial damages or losses), even if such Contributor
      has been advised of the possibility of such damages.
   9. Accepting Warranty or Additional Liability. While redistributing
      the Work or Derivative Works thereof, You may choose to offer,
      and charge a fee for, acceptance of support, warranty, indemnity,
      or other liability obligations and/or rights consistent with this
      License. However, in accepting such obligations, You may act only
      on Your own behalf and on Your sole responsibility, not on behalf
      of any other Contributor, and only if You agree to indemnify,
      defend, and hold each Contributor harmless for any liability
      incurred by, or claims asserted against, such Contributor by reason
      of your accepting any such warranty or additional liability.
   END OF TERMS AND CONDITIONS
   APPENDIX: How to apply the Apache License to your work.
      To apply the Apache License to your work, attach the following
      boilerplate notice, with the fields enclosed by brackets "[]"
      replaced with your own identifying information. (Don't include
      the brackets!)  The text should be enclosed in the appropriate
      comment syntax for the file format. We also recommend that a
      file or class name and description of purpose be included on the
      same "printed page" as the copyright notice for easier
      identification within third-party archives.
   Copyright [yyyy] [name of copyright owner]
   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at
       [external reference listed in repository notices]
   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
\`\`\`

</details>

## Fonts

No font files are distributed. Folkkit distributes no font files. Its CSS uses system font stacks supplied by the user's operating system and browser.
`;function Nb(){const{locale:n}=Lt(),s=(n==="en"?to:eo).licenses;return E.jsx(no,{content:s,children:E.jsxs("section",{className:"legal-page__notices","aria-labelledby":"third-party-notices",children:[E.jsx("h2",{id:"third-party-notices",children:s.noticesTitle}),E.jsx("p",{children:s.noticesIntro}),E.jsx("pre",{tabIndex:"0",children:Fb})]})})}function Ib({content:n}){return hf(Un)?E.jsxs("address",{children:[E.jsx("strong",{children:Un.name}),E.jsx("a",{href:`mailto:${Un.email}`,children:Un.email})]}):E.jsx("p",{className:"legal-page__gate",children:n.operatorMissing})}function xb(){const{locale:n}=Lt(),s=(n==="en"?to:eo).privacy;return E.jsx(no,{content:s,children:E.jsxs("section",{className:"legal-page__operator","aria-labelledby":"privacy-operator",children:[E.jsx("h2",{id:"privacy-operator",children:s.operatorTitle}),E.jsx(Ib,{content:s})]})})}function Lb(){const{locale:n}=Lt(),s=(n==="en"?to:eo).source;return E.jsx(no,{content:s,children:E.jsxs("section",{className:"legal-page__revision","aria-labelledby":"source-revision",children:[E.jsx("h2",{id:"source-revision",children:s.revisionLabel}),E.jsx("code",{children:yc.commit}),E.jsx("a",{href:yc.sourceUrl,children:s.revisionLink}),E.jsx("p",{children:s.availabilityNote})]})})}function Cb(){const{locale:n}=Lt(),s=(n==="en"?to:eo).terms;return E.jsx(no,{content:s})}function Db(){try{return window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"}catch{return"auto"}}const Qp=Object.freeze({"/privacy":"privacy","/open-source":"openSource","/licenses":"licenses","/terms":"terms","/contact":"contact"}),bc=Object.freeze({pdf:"/pdf",qr:"/qr",convert:"/convert",calculate:"/calculate"}),Dr=Object.freeze({"percentage-calc":"percent","aspect-ratio":"aspect-ratio","bmi-calc":"bmi","loan-calc":"loan"}),pf=Object.freeze(Object.keys(Dr));function kb({search:n="",hash:s=""}){const l=new URLSearchParams(n).get("tool")||(s.startsWith("#tool/")?s.slice(6):"");return pf.includes(l)?l:null}function Hb({search:n="",hash:s=""}){const l=kb({search:n,hash:s});if(l)return Dr[l];const c=new URLSearchParams(n).get("calculator");return["percent","rule-of-three","pythagoras","circle","area","volume","units","aspect-ratio","loan","bmi","date","duration"].includes(c)?c:"percent"}const Xp=Object.freeze({"text-to-qr":"/qr","qr-to-text":"/qr?mode=read","qr-reader":"/qr?mode=read","image-optimize":"/convert?mode=optimize","merge-pdf":"/pdf?action=merge","pdf-split":"/pdf?action=extract","pdf-extract-range":"/pdf?action=extract","pdf-rotate":"/pdf?action=rotate","pdf-page-count":"/pdf?action=count","images-to-pdf":"/convert?target=pdf&combine=1","png-to-jpg":"/convert?target=jpeg","jpg-to-png":"/convert?target=png","audio-to-mp3":"/convert?target=mp3"});function ff(n){return Object.hasOwn(Dr,n)?`/calculate?calculator=${Dr[n]}`:Object.hasOwn(Xp,n)?Xp[n]:null}function kr({pathname:n="/",search:s="",hash:l=""}){if(!["/","/workspace"].includes(n))return null;const c=new URLSearchParams(s).get("tool")||(l.startsWith("#tool/")?l.slice(6):"");return ff(c)}function Ir(n,s){const l=kr(s),c=new URLSearchParams(l?l.split("?")[1]||"":s.search||"");if(n==="calculate")return{calculator:Hb({search:c.toString()})};if(n==="qr")return{mode:c.get("mode")==="read"?"read":"create"};if(n==="pdf")return{action:["merge","extract","rotate","count","organize"].includes(c.get("action"))?c.get("action"):"edit"};if(n==="convert"){const p=["png","jpeg","webp","pdf","mp3","wav","flac","ogg","mp4","webm","gif"].includes(c.get("target"))?c.get("target"):void 0;return{mode:c.get("mode")==="optimize"?"optimize":"convert",target:p,combine:p==="pdf"&&c.get("combine")==="1"}}return{}}function mf({pathname:n="/",search:s="",hash:l=""}){if(Object.values(bc).includes(n))return n.slice(1);if(Qp[n])return`legal:${Qp[n]}`;if(n==="/tools")return"catalog";const c=kr({pathname:n,search:s,hash:l});return c?c.slice(1).split("?")[0]:n==="/workspace"||s||l.startsWith("#tool/")?"workspace":"home"}class zb extends q.Component{constructor(s){super(s),this.state={hasError:!1,error:null}}static getDerivedStateFromError(s){return{hasError:!0,error:s}}render(){return this.state.hasError?E.jsx("div",{className:"converter-view",children:E.jsxs("div",{className:"error-msg",role:"alert",children:[this.props.message,E.jsx("br",{}),E.jsx("button",{className:"pill-btn-sm error-retry",type:"button",onClick:()=>this.props.onRetry?this.props.onRetry():this.setState({hasError:!1,error:null}),children:this.props.retryLabel})]})}):this.props.children}}function Jp(n){const{t:s}=Lt();return E.jsx(zb,{...n,message:s("errorBoundary.message"),retryLabel:s("errorBoundary.retry")})}const Mb=q.lazy(()=>Ji(()=>import("./QrDesignerPage-XZz-QEz5.js"),__vite__mapDeps([0,1,2,3]))),Ub=q.lazy(()=>Ji(()=>import("./FileConverterPage-HwqJAkuh.js").then(n=>n.f),__vite__mapDeps([4,5,2,6]))),jb=q.lazy(()=>Ji(()=>import("./PdfEditorPage-BxpNK1SQ.js"),__vite__mapDeps([7,8,5,9]))),Gb=q.lazy(()=>Ji(()=>import("./WorkspacePage-CE6y_Hw4.js"),__vite__mapDeps([10,5,11]))),Bb=q.lazy(()=>Ji(()=>import("./CalculatorPage-CUrwfvZu.js"),__vite__mapDeps([12,13]))),Wa=["qr","convert","calculate"],Pb=Object.freeze({privacy:xb,openSource:Lb,licenses:Nb,terms:Cb,contact:vb});function xr(){return mf(window.location)}function Yb(){requestAnimationFrame(()=>{document.getElementById("main-content")?.focus({preventScroll:!0})})}function $b(){const{locale:n,setLocale:s,t:l}=Lt(),[c,p]=q.useState(xr),[d,f]=q.useState(()=>Wa.includes(c)?{[c]:Ir(c,window.location)}:{}),[m,y]=q.useState(()=>Ir("pdf",window.location)),b=q.useRef({}),[z,M]=q.useState(null),F=q.useRef(0),L=q.useCallback(W=>M(Z=>Z?.id===W?null:Z),[]),k=q.useRef(!1),H=q.useRef(`${window.location.pathname}${window.location.search}${window.location.hash}`),U=q.useCallback(W=>{k.current=W},[]),de=q.useMemo(()=>Gy(n),[n]),P=c.startsWith("legal:")?"legal":c,J=c.startsWith("legal:")?Pb[c.slice(6)]:null;q.useEffect(()=>{document.documentElement.lang=n},[n]),q.useEffect(()=>{const W=kr(window.location);W&&(history.replaceState(null,"",W),H.current=W),Wa.includes(c)&&(b.current[c]=`${window.location.pathname}${window.location.search}`)},[c,d]);const se=q.useCallback((W=!0)=>{const Z=xr(),pe=kr(window.location);if(pe&&history.replaceState(null,"",pe),H.current=`${window.location.pathname}${window.location.search}${window.location.hash}`,p(Z),Wa.includes(Z)){const Fe=Ir(Z,window.location);f(Et=>({...Et,[Z]:Fe}))}Z==="pdf"?y(Ir("pdf",window.location)):M(Fe=>Fe?.route==="pdf"?null:Fe),W&&Yb()},[]);q.useEffect(()=>{if(c==="workspace")return;const W=c.startsWith("legal:")?c.slice(6):c==="catalog"?"tools":c;document.title=c==="home"?"Folkkit":`${l(`shell.${W}`)} · Folkkit`},[c,l]),q.useEffect(()=>{const W=()=>{const Z=xr();if(k.current&&Z!=="pdf"&&!window.confirm(l("shell.unsaved"))){history.pushState(null,"",H.current);return}Z!=="pdf"&&(k.current=!1),se()};return window.addEventListener("popstate",W),()=>window.removeEventListener("popstate",W)},[l,se]);const ne=q.useCallback(W=>{const Z=Wa.find(Ct=>W===bc[Ct]),pe=new URL(Z&&b.current[Z]?b.current[Z]:W,window.location.origin),Fe=mf(pe),Et=Fe===xr()&&Wa.includes(Fe);return k.current&&Fe!=="pdf"&&!window.confirm(l("shell.unsaved"))?!1:(Fe!=="pdf"&&(k.current=!1),history.pushState(null,"",`${pe.pathname}${pe.search}${pe.hash}`),se(!Et),Et||window.scrollTo({top:0,behavior:Db()}),!0)},[l,se]),ye=q.useCallback((W,Z)=>{const pe=W==="text-to-qr"?"/qr?mode=create":ff(W);return pe?(ne(pe)&&Z&&M({id:++F.current,file:Z,route:pe.slice(1).split("?")[0]}),!0):!1},[ne]),Q=W=>{ne(bc[W])},Ne=({kind:W,toolId:Z,from:pe,to:Fe})=>{W==="tool"?ye(Z)||ne(`/workspace?tool=${encodeURIComponent(Z)}`):ne(`/workspace?from=${encodeURIComponent(pe)}&to=${encodeURIComponent(Fe)}`)};return E.jsxs(mb,{locale:n,onLocaleChange:s,route:P,onNavigate:ne,children:[c==="home"&&E.jsx(Rb,{onOpenCore:Q,onOpenCatalog:()=>ne("/tools")}),c==="catalog"&&E.jsx(yb,{entries:[{id:"qr-reader",name:l("catalog.qrReader"),description:l("catalog.qrReaderDescription"),category:"studio",categoryName:l("catalog.studioCategory")},{id:"image-optimize",name:l("catalog.imageOptimize"),description:l("catalog.imageOptimizeDescription"),category:"studio",categoryName:l("catalog.studioCategory")},...de.filter(W=>!pf.includes(W.id))],onSelect:Ne}),Wa.filter(W=>d[W]).map(W=>E.jsx("div",{hidden:c!==W,inert:c!==W,className:"studio-session",children:E.jsx(Jp,{onRetry:()=>window.location.reload(),children:E.jsxs(q.Suspense,{fallback:E.jsxs("div",{className:"studio-page studio-loading",children:[E.jsx("h1",{children:l(`shell.${W}`)}),E.jsx("p",{role:"status",children:l("shell.loading")})]}),children:[W==="qr"&&E.jsx(Mb,{initialMode:d.qr.mode,onModeChange:Z=>ne(`/qr?mode=${Z}`),active:c===W}),W==="convert"&&E.jsx(Ub,{initialMode:d.convert.mode,initialTarget:d.convert.target,initialCombine:d.convert.combine,fileRequest:z?.route==="convert"?z:void 0,onFileRequestConsumed:L,onModeChange:Z=>ne(`/convert?mode=${Z}`),active:c===W}),W==="calculate"&&E.jsx(Bb,{initialCalculator:d.calculate.calculator,onSelectCalculator:Z=>{Z!==d.calculate.calculator&&ne(`/calculate?calculator=${Z}`)}})]})})},W)),["pdf","workspace"].includes(c)&&E.jsx(Jp,{onRetry:()=>window.location.reload(),children:E.jsxs(q.Suspense,{fallback:E.jsxs("div",{className:"studio-page studio-loading",children:[E.jsx("h1",{children:l(c==="workspace"?"workspace.title":`shell.${c}`)}),E.jsxs("p",{role:"status",children:[E.jsx("span",{className:"studio-spinner","aria-hidden":"true"}),l("shell.loading")]})]}),children:[c==="pdf"&&E.jsx(jb,{initialAction:m.action,fileRequest:z?.route==="pdf"?z:void 0,onFileRequestConsumed:L,onDirtyChange:U}),c==="workspace"&&E.jsx(Gb,{onOpenTool:ye})]})},c),J&&E.jsx(J,{})]})}const gf=q.createContext(null);function o0(){return q.useContext(gf)}function Wb({children:n}){const[s,l]=q.useState(null),c=q.useRef(null),p=q.useCallback(d=>{clearTimeout(c.current),l(d),c.current=setTimeout(()=>l(null),1500)},[]);return E.jsxs(gf.Provider,{value:p,children:[n,s&&E.jsx("div",{className:"toast",role:"status","aria-live":"polite",children:s})]})}function _b(n){if(n==="de"||n==="en")return n;try{const s=localStorage.getItem(Tt.locale);if(s==="de"||s==="en")return s}catch{}return"de"}function qb({children:n,initialLocale:s}){const[l,c]=q.useState(()=>_b(s)),p=q.useCallback(m=>{const y=zr(m);c(y);try{localStorage.setItem(Tt.locale,y)}catch{}},[]),d=q.useCallback((m,y)=>hn(vc(l),m,y),[l]),f=q.useMemo(()=>({locale:l,setLocale:p,t:d}),[l,p,d]);return E.jsx(lf.Provider,{value:f,children:n})}const yf=30,ef=120,Vb="convert-everything-history",Kb="folkkit:history-change";function Lr(){window.dispatchEvent(new Event(Kb))}function Tc(){Yy(),localStorage.removeItem(Vb)}function _a(){return By()?!0:(Tc(),mc(!1),!1)}function bf(n){return!n||typeof n.from!="string"||typeof n.to!="string"||typeof n.input!="string"||typeof n.output!="string"||!Number.isFinite(n.timestamp)||!nf(n.from,n.to)?null:{from:n.from,to:n.to,input:n.input.slice(0,ef),output:n.output.slice(0,ef),timestamp:n.timestamp}}function pc(){const n=Py().map(bf).filter(Boolean).slice(0,yf),s=localStorage.getItem(Tt.contentHistory),l=JSON.stringify(n);return s!==null&&s!==l&&gc(n),n}const r0=Object.freeze({isEnabled(){return _a()},setEnabled(n){const s=_a();(n!==!0||!s)&&Tc(),mc(n),Lr()},list(){return _a()?pc().map(n=>({...n})):[]},append(n){if(!_a())return;const s=bf(n);s&&(gc([s,...pc()].slice(0,yf)),Lr())},remove(n){if(!_a()||!Number.isInteger(n)||n<0)return;const s=pc();n>=s.length||(s.splice(n,1),gc(s),Lr())},clear({revokeConsent:n=!1}={}){Tc(),n&&mc(!1),Lr()}});function Zb(){try{return _a(),!0}catch{return!1}}Zb();Qg.createRoot(document.getElementById("root")).render(E.jsx(q.StrictMode,{children:E.jsx(qb,{children:E.jsx(Wb,{children:E.jsx($b,{})})})}));"serviceWorker"in navigator&&window.addEventListener("load",()=>{const l=`${"/".endsWith("/")?"/":"//"}sw.js`;navigator.serviceWorker.register(l).catch(c=>{console.warn("[SW] Service worker registration failed:",c)})});export{Db as A,jt as B,Wi as C,Sr as D,Jp as E,Xb as F,Kb as H,Qy as I,Ut as T,Ji as _,Sc as a,tf as b,ay as c,o0 as d,a0 as e,e0 as f,n0 as g,r0 as h,nf as i,E as j,Oy as k,vy as l,qi as m,ny as n,Vi as o,Tt as p,_i as q,q as r,Zi as s,Ki as t,Lt as u,Jb as v,Qb as w,Gy as x,i0 as y,t0 as z};
