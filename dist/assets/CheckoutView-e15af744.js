import{_ as ae}from"./BaseButton-3a92bdba.js";import{f as le,g as ye,r as G,j as L,o as Y,k as ge,w as b,e as B,a as s,b as y,l as S,E as Te,ad as De,c as ve,K as Q,ae as je,M as Le,p as Be,m as $e}from"./index-b738461e.js";import{_ as be}from"./BasePopup.vue_vue_type_script_setup_true_lang-f8d582e5.js";import{u as Re}from"./onlyNumber-23ffb405.js";import{_ as ce}from"./_plugin-vue_export-helper-c27b6911.js";import{_ as Ne}from"./BaseTable.vue_vue_type_script_setup_true_lang-c17c6914.js";import"./formatNumber-a2d8cd5e.js";import"./BaseIcon-f6a39fb9.js";const _e="/assets/paypal-logo-301aee1c.png",Fe=le({__name:"PopupShippingInfo",props:{propsForm:{default:()=>({})}},emits:["form-shipping"],setup(e,{emit:n}){const r=e,t=ye(),a=G({consigneeName:"",consigneePhoneNumber:"",deliveryAddress:""}),p=G(),m=G({consigneeName:[{required:!0,message:"Vui lòng nhập họ và tên",trigger:"blur"}],consigneePhoneNumber:[{required:!0,message:"Vui lòng nhập số điện thoại",trigger:"blur"}],deliveryAddress:[{required:!0,message:"Vui lòng nhập địa chỉ",trigger:"blur"}]}),c=()=>{a.value={...r.propsForm}},_=()=>{v()},h=async E=>{E&&await E.validate((d,P)=>{d?(n("form-shipping",a.value),Te.success({message:"Cập nhật thông tin thành công",duration:5e3}),t.setOpenPopup(!1,"popup-shipping-info")):console.log("error submit!",P)})},v=()=>{p.value.clearValidate(),t.setOpenPopup(!1,"popup-shipping-info")};return(E,d)=>{const P=L("el-input"),I=L("el-form-item"),$=ae,x=L("el-form"),z=be;return Y(),ge(z,{"is-show-footer":!1,class:"popup-shipping-info",name:"popup-shipping-info",width:"600px",onClose:_,onOpen:c},{title:b(()=>[B("Chỉnh sửa thông tin nhận hàng")]),default:b(()=>[s("div",null,[y(x,{ref_key:"ruleFormRef",ref:p,model:S(a),rules:S(m),"label-position":"top"},{default:b(()=>[y(I,{label:"Họ và tên",prop:"consigneeName"},{default:b(()=>[y(P,{modelValue:S(a).consigneeName,"onUpdate:modelValue":d[0]||(d[0]=w=>S(a).consigneeName=w)},null,8,["modelValue"])]),_:1}),y(I,{label:"Số điện thoại",prop:"consigneePhoneNumber"},{default:b(()=>[y(P,{modelValue:S(a).consigneePhoneNumber,"onUpdate:modelValue":d[1]||(d[1]=w=>S(a).consigneePhoneNumber=w),onKeypress:d[2]||(d[2]=w=>S(Re)(w,S(a).consigneePhoneNumber))},null,8,["modelValue"])]),_:1}),y(I,{label:"Địa chỉ nhận hàng",prop:"deliveryAddress"},{default:b(()=>[y(P,{modelValue:S(a).deliveryAddress,"onUpdate:modelValue":d[3]||(d[3]=w=>S(a).deliveryAddress=w),type:"textarea"},null,8,["modelValue"])]),_:1}),y(I,{class:"wrap-btn"},{default:b(()=>[y($,{class:"mr-4",type:"plain",onClick:d[4]||(d[4]=w=>v(S(p)))},{default:b(()=>[B("Hủy bỏ")]),_:1}),y($,{type:"primary",onClick:d[5]||(d[5]=w=>h(S(p)))},{default:b(()=>[B(" Xác nhận ")]),_:1})]),_:1})]),_:1},8,["model","rules"])])]),_:1})}}});const Ve=ce(Fe,[["__scopeId","data-v-299151bc"]]);var H={};const Me="@vue-stripe/vue-stripe",Ue="@vue-stripe/vue-stripe@4.5.0",qe=!1,He="sha512-BU449XT5zegjNQirl+SSztbzGIvPjhxlHv8ybomSZcI1jB6qEpLgpk2eHMFDKnOGZZRhqtg4C5FiErwSJ/yuRw==",Ge="/@vue-stripe/vue-stripe",ze={},Xe={type:"tag",registry:!0,raw:"@vue-stripe/vue-stripe",name:"@vue-stripe/vue-stripe",escapedName:"@vue-stripe%2fvue-stripe",scope:"@vue-stripe",rawSpec:"",saveSpec:null,fetchSpec:"latest"},Ke=["#DEV:/","#USER"],We="https://registry.npmjs.org/@vue-stripe/vue-stripe/-/vue-stripe-4.5.0.tgz",Ze="2297b3a3f7cc984e7c80f3b7dac75f5e0239a758",Qe="@vue-stripe/vue-stripe",Ye="C:\\Users\\quann\\Desktop\\NaqWeb\\naqwebsite",Je={name:"jofftiquez@gmail.com"},en={url:"https://github.com/vue-stripe/vue-stripe/issues"},nn=!1,tn={"@stripe/stripe-js":"^1.13.2","vue-coerce-props":"^1.0.0"},rn=!1,on="Stripe Checkout & Elements for Vue.js",sn={"@babel/cli":"^7.7.5","@babel/core":"^7.7.5","@babel/plugin-proposal-export-default-from":"^7.7.4","@babel/plugin-proposal-optional-chaining":"^7.10.4","@babel/plugin-transform-runtime":"^7.7.5","@babel/preset-env":"^7.7.5","@babel/preset-es2015":"^7.0.0-beta.53","@babel/runtime":"^7.7.5","@rollup/plugin-node-resolve":"^6.0.0","@vue/cli-plugin-eslint":"~4.5.0","@vue/cli-service":"^4.5.10","@vue/eslint-config-standard":"^5.1.2","babel-eslint":"^10.1.0","babel-minify":"^0.5.1","cross-env":"^6.0.3",eslint:"^6.8.0","eslint-plugin-import":"^2.20.2","eslint-plugin-node":"^11.1.0","eslint-plugin-promise":"^4.2.1","eslint-plugin-standard":"^4.0.0","eslint-plugin-vue":"^6.2.2",jest:"^24.9.0","lint-staged":"^9.5.0",rimraf:"^3.0.0",rollup:"^1.27.9","rollup-plugin-babel":"^4.3.3","rollup-plugin-commonjs":"^10.1.0","rollup-plugin-postcss":"^2.0.3","rollup-plugin-terser":"^5.1.3","rollup-plugin-uglify":"^6.0.3","rollup-plugin-vue":"^5.1.4","vue-template-compiler":"^2.6.11"},an={"pre-commit":"lint-staged"},ln="https://github.com/vue-stripe/vue-stripe#readme",cn=["vue","vuejs","stripe","checkout","payment"],pn="MIT",un="dist/index.js",dn="dist",mn="@vue-stripe/vue-stripe",hn={type:"git",url:"git+ssh://git@github.com/vue-stripe/vue-stripe.git"},fn={build:"rollup -c",lint:"vue-cli-service lint --fix",prebuild:"rimraf dist",test:"jest"},yn="typings/index.d.ts",gn="4.5.0",vn={_from:Me,_id:Ue,_inBundle:qe,_integrity:He,_location:Ge,_phantomChildren:ze,_requested:Xe,_requiredBy:Ke,_resolved:We,_shasum:Ze,_spec:Qe,_where:Ye,author:Je,bugs:en,bundleDependencies:nn,dependencies:tn,deprecated:rn,description:on,devDependencies:sn,gitHooks:an,homepage:ln,keywords:cn,license:pn,"lint-staged":{"*.{js,jsx,vue}":["vue-cli-service lint","git add"]},main:un,module:dn,name:mn,repository:hn,scripts:fn,typings:yn,version:gn};var Se;Object.defineProperty(H,"__esModule",{value:!0});var ie="auto",bn=["auto","bg","cs","da","de","el","en","en-GB","es","es-419","et","fi","fr","fr-CA","hu","id","it","ja","lt","lv","ms","mt","nb","nl","pl","pt","pt-BR","ro","ru","sk","sl","sv","tr","zh","zh-HK","zh-TW"],_n=["auto","book","donate","pay"],Sn=["required","auto"],En={base:{color:"#32325d",fontFamily:'"Helvetica Neue", Helvetica, sans-serif',fontSmoothing:"antialiased",fontSize:"16px","::placeholder":{color:"#aab7c4"}},invalid:{color:"#fa755a",iconColor:"#fa755a"}},wn=vn.version,K={name:"vue-stripe",version:wn,url:"https://vuestripe.com",partner_id:"pp_partner_IqtOXpBSuz0IE2"},An={install:function(e,n){var r=n.pk,t=n.stripeAccount,a=n.apiVersion,p=n.locale,m=window.Stripe(r,{stripeAccount:t,apiVersion:a,locale:p});m.registerAppInfo(K),e.prototype.$stripe=m}};function xn(e,n){return e(n={exports:{}},n.exports),n.exports}var Cn=xn(function(e){var n=function(r){var t,a=Object.prototype,p=a.hasOwnProperty,m=typeof Symbol=="function"?Symbol:{},c=m.iterator||"@@iterator",_=m.asyncIterator||"@@asyncIterator",h=m.toStringTag||"@@toStringTag";function v(o,i,u,f){var l=i&&i.prototype instanceof z?i:z,A=Object.create(l.prototype),M=new te(f||[]);return A._invoke=function(j,X,g){var k=d;return function(R,U){if(k===I)throw new Error("Generator is already running");if(k===$){if(R==="throw")throw U;return de()}for(g.method=R,g.arg=U;;){var q=g.delegate;if(q){var D=ue(q,g);if(D){if(D===x)continue;return D}}if(g.method==="next")g.sent=g._sent=g.arg;else if(g.method==="throw"){if(k===d)throw k=$,g.arg;g.dispatchException(g.arg)}else g.method==="return"&&g.abrupt("return",g.arg);k=I;var C=E(j,X,g);if(C.type==="normal"){if(k=g.done?$:P,C.arg===x)continue;return{value:C.arg,done:g.done}}C.type==="throw"&&(k=$,g.method="throw",g.arg=C.arg)}}}(o,u,M),A}function E(o,i,u){try{return{type:"normal",arg:o.call(i,u)}}catch(f){return{type:"throw",arg:f}}}r.wrap=v;var d="suspendedStart",P="suspendedYield",I="executing",$="completed",x={};function z(){}function w(){}function F(){}var J={};J[c]=function(){return this};var ee=Object.getPrototypeOf,W=ee&&ee(ee(re([])));W&&W!==a&&p.call(W,c)&&(J=W);var V=F.prototype=z.prototype=Object.create(J);function pe(o){["next","throw","return"].forEach(function(i){o[i]=function(u){return this._invoke(i,u)}})}function Z(o){var i;this._invoke=function(u,f){function l(){return new Promise(function(A,M){(function j(X,g,k,R){var U=E(o[X],o,g);if(U.type!=="throw"){var q=U.arg,D=q.value;return D&&typeof D=="object"&&p.call(D,"__await")?Promise.resolve(D.__await).then(function(C){j("next",C,k,R)},function(C){j("throw",C,k,R)}):Promise.resolve(D).then(function(C){q.value=C,k(q)},function(C){return j("throw",C,k,R)})}R(U.arg)})(u,f,A,M)})}return i=i?i.then(l,l):l()}}function ue(o,i){var u=o.iterator[i.method];if(u===t){if(i.delegate=null,i.method==="throw"){if(o.iterator.return&&(i.method="return",i.arg=t,ue(o,i),i.method==="throw"))return x;i.method="throw",i.arg=new TypeError("The iterator does not provide a 'throw' method")}return x}var f=E(u,o.iterator,i.arg);if(f.type==="throw")return i.method="throw",i.arg=f.arg,i.delegate=null,x;var l=f.arg;return l?l.done?(i[o.resultName]=l.value,i.next=o.nextLoc,i.method!=="return"&&(i.method="next",i.arg=t),i.delegate=null,x):l:(i.method="throw",i.arg=new TypeError("iterator result is not an object"),i.delegate=null,x)}function Ie(o){var i={tryLoc:o[0]};1 in o&&(i.catchLoc=o[1]),2 in o&&(i.finallyLoc=o[2],i.afterLoc=o[3]),this.tryEntries.push(i)}function ne(o){var i=o.completion||{};i.type="normal",delete i.arg,o.completion=i}function te(o){this.tryEntries=[{tryLoc:"root"}],o.forEach(Ie,this),this.reset(!0)}function re(o){if(o){var i=o[c];if(i)return i.call(o);if(typeof o.next=="function")return o;if(!isNaN(o.length)){var u=-1,f=function l(){for(;++u<o.length;)if(p.call(o,u))return l.value=o[u],l.done=!1,l;return l.value=t,l.done=!0,l};return f.next=f}}return{next:de}}function de(){return{value:t,done:!0}}return w.prototype=V.constructor=F,F.constructor=w,F[h]=w.displayName="GeneratorFunction",r.isGeneratorFunction=function(o){var i=typeof o=="function"&&o.constructor;return!!i&&(i===w||(i.displayName||i.name)==="GeneratorFunction")},r.mark=function(o){return Object.setPrototypeOf?Object.setPrototypeOf(o,F):(o.__proto__=F,h in o||(o[h]="GeneratorFunction")),o.prototype=Object.create(V),o},r.awrap=function(o){return{__await:o}},pe(Z.prototype),Z.prototype[_]=function(){return this},r.AsyncIterator=Z,r.async=function(o,i,u,f){var l=new Z(v(o,i,u,f));return r.isGeneratorFunction(i)?l:l.next().then(function(A){return A.done?A.value:l.next()})},pe(V),V[h]="Generator",V[c]=function(){return this},V.toString=function(){return"[object Generator]"},r.keys=function(o){var i=[];for(var u in o)i.push(u);return i.reverse(),function f(){for(;i.length;){var l=i.pop();if(l in o)return f.value=l,f.done=!1,f}return f.done=!0,f}},r.values=re,te.prototype={constructor:te,reset:function(o){if(this.prev=0,this.next=0,this.sent=this._sent=t,this.done=!1,this.delegate=null,this.method="next",this.arg=t,this.tryEntries.forEach(ne),!o)for(var i in this)i.charAt(0)==="t"&&p.call(this,i)&&!isNaN(+i.slice(1))&&(this[i]=t)},stop:function(){this.done=!0;var o=this.tryEntries[0].completion;if(o.type==="throw")throw o.arg;return this.rval},dispatchException:function(o){if(this.done)throw o;var i=this;function u(X,g){return A.type="throw",A.arg=o,i.next=X,g&&(i.method="next",i.arg=t),!!g}for(var f=this.tryEntries.length-1;f>=0;--f){var l=this.tryEntries[f],A=l.completion;if(l.tryLoc==="root")return u("end");if(l.tryLoc<=this.prev){var M=p.call(l,"catchLoc"),j=p.call(l,"finallyLoc");if(M&&j){if(this.prev<l.catchLoc)return u(l.catchLoc,!0);if(this.prev<l.finallyLoc)return u(l.finallyLoc)}else if(M){if(this.prev<l.catchLoc)return u(l.catchLoc,!0)}else{if(!j)throw new Error("try statement without catch or finally");if(this.prev<l.finallyLoc)return u(l.finallyLoc)}}}},abrupt:function(o,i){for(var u=this.tryEntries.length-1;u>=0;--u){var f=this.tryEntries[u];if(f.tryLoc<=this.prev&&p.call(f,"finallyLoc")&&this.prev<f.finallyLoc){var l=f;break}}l&&(o==="break"||o==="continue")&&l.tryLoc<=i&&i<=l.finallyLoc&&(l=null);var A=l?l.completion:{};return A.type=o,A.arg=i,l?(this.method="next",this.next=l.finallyLoc,x):this.complete(A)},complete:function(o,i){if(o.type==="throw")throw o.arg;return o.type==="break"||o.type==="continue"?this.next=o.arg:o.type==="return"?(this.rval=this.arg=o.arg,this.method="return",this.next="end"):o.type==="normal"&&i&&(this.next=i),x},finish:function(o){for(var i=this.tryEntries.length-1;i>=0;--i){var u=this.tryEntries[i];if(u.finallyLoc===o)return this.complete(u.completion,u.afterLoc),ne(u),x}},catch:function(o){for(var i=this.tryEntries.length-1;i>=0;--i){var u=this.tryEntries[i];if(u.tryLoc===o){var f=u.completion;if(f.type==="throw"){var l=f.arg;ne(u)}return l}}throw new Error("illegal catch attempt")},delegateYield:function(o,i,u){return this.delegate={iterator:re(o),resultName:i,nextLoc:u},this.method==="next"&&(this.arg=t),x}},r}(e.exports);try{regeneratorRuntime=n}catch{Function("r","regeneratorRuntime = r")(n)}}),O=Cn;function Ee(e){return(Ee=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(n){return typeof n}:function(n){return n&&typeof Symbol=="function"&&n.constructor===Symbol&&n!==Symbol.prototype?"symbol":typeof n})(e)}var we,Ae="https://js.stripe.com/v3",kn=/^https:\/\/js\.stripe\.com\/v3\/?(\?.*)?$/,me="loadStripe.setLoadParameters was called but an existing Stripe.js script already exists in the document; existing script parameters will be used",Pn=function(){for(var e=document.querySelectorAll('script[src^="'.concat(Ae,'"]')),n=0;n<e.length;n++){var r=e[n];if(kn.test(r.src))return r}return null},On=function(e){var n=e&&!e.advancedFraudSignals?"?advancedFraudSignals=false":"",r=document.createElement("script");r.src="".concat(Ae).concat(n);var t=document.head||document.body;if(!t)throw new Error("Expected document.body not to be null. Stripe.js requires a <body> element.");return t.appendChild(r),r},In=function(e,n){e&&e._registerWrapper&&e._registerWrapper({name:"stripe-js",version:"1.13.2",startTime:n})},oe=null,Tn=function(e){return oe!==null?oe:oe=new Promise(function(n,r){if(typeof window<"u")if(window.Stripe&&e&&console.warn(me),window.Stripe)n(window.Stripe);else try{var t=Pn();t&&e?console.warn(me):t||(t=On(e)),t.addEventListener("load",function(){window.Stripe?n(window.Stripe):r(new Error("Stripe.js not available"))}),t.addEventListener("error",function(){r(new Error("Failed to load Stripe.js"))})}catch(a){return void r(a)}else n(null)})},Dn=function(e,n,r){if(e===null)return null;var t=e.apply(void 0,n);return In(t,r),t},jn=function(e){var n=`invalid load parameters; expected object of shape

    {advancedFraudSignals: boolean}

but received

    `.concat(JSON.stringify(e),`
`);if(e===null||Ee(e)!=="object")throw new Error(n);if(Object.keys(e).length===1&&typeof e.advancedFraudSignals=="boolean")return e;throw new Error(n)},xe=!1,N=function(){for(var e=arguments.length,n=new Array(e),r=0;r<e;r++)n[r]=arguments[r];xe=!0;var t=Date.now();return Tn(we).then(function(a){return Dn(a,n,t)})};N.setLoadParameters=function(e){if(xe)throw new Error("You cannot change load parameters after calling loadStripe");we=jn(e)};/**
 * vue-coerce-props v1.0.0
 * (c) 2018 Eduardo San Martin Morote <posva13@gmail.com>
 * @license MIT
 */var Ln={beforeCreate:function(){var e=this.$options.props;e&&(this._$coertions=Object.keys(e).filter(function(n){return e[n].coerce}).map(function(n){return[n,e[n].coerce]}))},computed:{$coerced:function(){var e=this;return this._$coertions.reduce(function(n,r){var t=r[0],a=r[1];return n[t]=a.call(e,e.$props[t]),n},{})}}},Bn={pk:{type:String,required:!0},mode:{type:String,validator:function(e){return["payment","subscription"].includes(e)}},lineItems:{type:Array,default:void 0},items:{type:Array},successUrl:{type:String,default:window.location.href},cancelUrl:{type:String,default:window.location.href},submitType:{type:String,validator:function(e){return _n.includes(e)}},billingAddressCollection:{type:String,default:"auto",validator:function(e){return Sn.includes(e)}},clientReferenceId:{type:String},customerEmail:{type:String},sessionId:{type:String},stripeAccount:{type:String,default:void 0},apiVersion:{type:String,default:void 0},locale:{type:String,default:ie,coerce:function(e){return bn.includes(e)?e:(console.warn("VueStripe Warning: '".concat(e,"' is not supported by Stripe yet. Falling back to default '").concat(ie,"'.")),ie)}},shippingAddressCollection:{type:Object,validator:function(e){return Object.prototype.hasOwnProperty.call(e,"allowedCountries")}},disableAdvancedFraudDetection:{type:Boolean},stripeOptions:{type:Object,default:null}},$n={props:Bn,mixins:[Ln],render:function(e){return e},methods:{redirectToCheckout:function(){var e,n,r;return O.async(function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,this.$emit("loading",!0),this.disableAdvancedFraudDetection&&N.setLoadParameters({advancedFraudSignals:!1}),e={stripeAccount:this.stripeAccount,apiVersion:this.apiVersion,locale:this.locale},t.next=6,O.awrap(N(this.pk,e));case 6:if((n=t.sent).registerAppInfo(K),!this.sessionId){t.next=11;break}return n.redirectToCheckout({sessionId:this.sessionId}),t.abrupt("return");case 11:if(!this.lineItems||!this.lineItems.length||this.mode){t.next=14;break}return console.error("Error: Property 'mode' is required when using 'lineItems'. See https://stripe.com/docs/js/checkout/redirect_to_checkout#stripe_checkout_redirect_to_checkout-options-mode"),t.abrupt("return");case 14:return r={billingAddressCollection:this.billingAddressCollection,cancelUrl:this.cancelUrl,clientReferenceId:this.clientReferenceId,customerEmail:this.customerEmail,items:this.items,lineItems:this.lineItems,locale:this.$coerced.locale,mode:this.mode,shippingAddressCollection:this.shippingAddressCollection,submitType:this.submitType,successUrl:this.successUrl},t.abrupt("return",n.redirectToCheckout(r));case 18:t.prev=18,t.t0=t.catch(0),console.error(t.t0),this.$emit("error",t.t0);case 22:case"end":return t.stop()}},null,this,[[0,18]])}}};function Rn(e,n,r){return n in e?Object.defineProperty(e,n,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[n]=r,e}var Nn=Rn;function he(e,n){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(e);n&&(t=t.filter(function(a){return Object.getOwnPropertyDescriptor(e,a).enumerable})),r.push.apply(r,t)}return r}function Fn(e){for(var n=1;n<arguments.length;n++){var r=arguments[n]!=null?arguments[n]:{};n%2?he(Object(r),!0).forEach(function(t){Nn(e,t,r[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):he(Object(r)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))})}return e}var Vn="card",Mn={props:{pk:{type:String,required:!0},testMode:{type:Boolean,default:!1},stripeAccount:{type:String,default:void 0},apiVersion:{type:String,default:void 0},locale:{type:String,default:"auto"},elementsOptions:{type:Object,default:function(){return{}}},tokenData:{type:Object,default:function(){return{}}},disableAdvancedFraudDetection:{type:Boolean},classes:{type:Object,default:function(){return{}}},elementStyle:{type:Object,default:function(){return En}},value:{type:String,default:void 0},hidePostalCode:Boolean,iconStyle:{type:String,default:"default",validator:function(e){return["solid","default"].includes(e)}},hideIcon:Boolean,disabled:Boolean},data:function(){return{loading:!1,stripe:null,elements:null,element:null,card:null}},computed:{form:function(){return document.getElementById("stripe-element-form")}},mounted:function(){var e,n,r=this;return O.async(function(t){for(;;)switch(t.prev=t.next){case 0:return this.disableAdvancedFraudDetection&&N.setLoadParameters({advancedFraudSignals:!1}),e={stripeAccount:this.stripeAccount,apiVersion:this.apiVersion,locale:this.locale},n={classes:this.classes,style:this.elementStyle,value:this.value,hidePostalCode:this.hidePostalCode,iconStyle:this.iconStyle,hideIcon:this.hideIcon,disabled:this.disabled},t.next=5,O.awrap(N(this.pk,e));case 5:this.stripe=t.sent,this.stripe.registerAppInfo(K),this.elements=this.stripe.elements(this.elementsOptions),this.element=this.elements.create(Vn,n),this.element.mount("#stripe-element-mount-point"),this.element.on("change",function(a){var p=document.getElementById("stripe-element-errors");a.error?p.textContent=a.error.message:p.textContent="",r.onChange(a)}),this.element.on("blur",this.onBlur),this.element.on("click",this.onClick),this.element.on("escape",this.onEscape),this.element.on("focus",this.onFocus),this.element.on("ready",this.onReady),this.form.addEventListener("submit",function(a){var p,m,c,_;return O.async(function(h){for(;;)switch(h.prev=h.next){case 0:return h.prev=0,r.$emit("loading",!0),a.preventDefault(),p=Fn({},r.element),r.amount&&(p.amount=r.amount),h.next=7,O.awrap(r.stripe.createToken(p,r.tokenData));case 7:if(m=h.sent,c=m.token,!(_=m.error)){h.next=15;break}return document.getElementById("stripe-element-errors").textContent=_.message,r.$emit("error",_),h.abrupt("return");case 15:r.$emit("token",c),h.next=22;break;case 18:h.prev=18,h.t0=h.catch(0),console.error(h.t0),r.$emit("error",h.t0);case 22:return h.prev=22,r.$emit("loading",!1),h.finish(22);case 25:case"end":return h.stop()}},null,null,[[0,18,22,25]])});case 17:case"end":return t.stop()}},null,this)},methods:{submit:function(){this.$refs.submitButtonRef.click()},clear:function(){this.element.clear()},destroy:function(){this.element.destroy()},focus:function(){console.warn("This method will currently not work on iOS 13+ due to a system limitation."),this.element.focus()},unmount:function(){this.element.unmount()},update:function(e){this.element.update(e)},onChange:function(e){this.$emit("element-change",e)},onReady:function(e){this.$emit("element-ready",e)},onFocus:function(e){this.$emit("element-focus",e)},onBlur:function(e){this.$emit("element-blur",e)},onEscape:function(e){this.$emit("element-escape",e)},onClick:function(e){this.$emit("element-click",e)}}};function Ce(e,n,r,t,a,p,m,c,_,h){typeof m!="boolean"&&(_=c,c=m,m=!1);const v=typeof r=="function"?r.options:r;let E;if(e&&e.render&&(v.render=e.render,v.staticRenderFns=e.staticRenderFns,v._compiled=!0,a&&(v.functional=!0)),t&&(v._scopeId=t),p?(E=function(d){(d=d||this.$vnode&&this.$vnode.ssrContext||this.parent&&this.parent.$vnode&&this.parent.$vnode.ssrContext)||typeof __VUE_SSR_CONTEXT__>"u"||(d=__VUE_SSR_CONTEXT__),n&&n.call(this,_(d)),d&&d._registeredComponents&&d._registeredComponents.add(p)},v._ssrRegister=E):n&&(E=m?function(d){n.call(this,h(d,this.$root.$options.shadowRoot))}:function(d){n.call(this,c(d))}),E)if(v.functional){const d=v.render;v.render=function(P,I){return E.call(I),d(P,I)}}else{const d=v.beforeCreate;v.beforeCreate=d?[].concat(d,E):[E]}return r}const Un=typeof navigator<"u"&&/msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());function ke(e){return(n,r)=>qn(n,r)}let se;const fe={};function qn(e,n){const r=Un?n.media||"default":e,t=fe[r]||(fe[r]={ids:new Set,styles:[]});if(!t.ids.has(e)){t.ids.add(e);let a=n.source;if(n.map&&(a+=`
/*# sourceURL=`+n.map.sources[0]+" */",a+=`
/*# sourceMappingURL=data:application/json;base64,`+btoa(unescape(encodeURIComponent(JSON.stringify(n.map))))+" */"),t.element||(t.element=document.createElement("style"),t.element.type="text/css",n.media&&t.element.setAttribute("media",n.media),se===void 0&&(se=document.head||document.getElementsByTagName("head")[0]),se.appendChild(t.element)),"styleSheet"in t.element)t.styles.push(a),t.element.styleSheet.cssText=t.styles.filter(Boolean).join(`
`);else{const p=t.ids.size-1,m=document.createTextNode(a),c=t.element.childNodes;c[p]&&t.element.removeChild(c[p]),c.length?t.element.insertBefore(m,c[p]):t.element.appendChild(m)}}}const Hn=Mn;var Pe=function(){var e=this.$createElement,n=this._self._c||e;return n("div",[n("form",{attrs:{id:"stripe-element-form"}},[n("div",{attrs:{id:"stripe-element-mount-point"}}),this._v(" "),this._t("stripe-element-errors",[n("div",{attrs:{id:"stripe-element-errors",role:"alert"}})]),this._v(" "),n("button",{ref:"submitButtonRef",staticClass:"hide",attrs:{type:"submit"}})],2)])},Gn=[];Pe._withStripped=!0;const zn=function(e){e&&e("data-v-4dd8360e_0",{source:`





















































































































































































































































/**
 * The CSS shown here will not be introduced in the Quickstart guide, but shows
 * how you can use CSS to style your Element's container.
 */
.StripeElement[data-v-4dd8360e] {
  box-sizing: border-box;

  height: 40px;

  padding: 10px 12px;

  border: 1px solid transparent;
  border-radius: 4px;
  background-color: white;

  box-shadow: 0 1px 3px 0 #e6ebf1;
  -webkit-transition: box-shadow 150ms ease;
  transition: box-shadow 150ms ease;
}
.StripeElement--focus[data-v-4dd8360e] {
  box-shadow: 0 1px 3px 0 #cfd7df;
}
.StripeElement--invalid[data-v-4dd8360e] {
  border-color: #fa755a;
}
.StripeElement--webkit-autofill[data-v-4dd8360e] {
  background-color: #fefde5 !important;
}
.hide[data-v-4dd8360e] {
  display: none;
}
`,map:{version:3,sources:["/home/runner/work/vue-stripe/vue-stripe/src/elements/Card.vue"],names:[],mappings:";;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;AAsPA;;;EAGA;AACA;EACA,sBAAA;;EAEA,YAAA;;EAEA,kBAAA;;EAEA,6BAAA;EACA,kBAAA;EACA,uBAAA;;EAEA,+BAAA;EACA,yCAAA;EACA,iCAAA;AACA;AAEA;EACA,+BAAA;AACA;AAEA;EACA,qBAAA;AACA;AAEA;EACA,oCAAA;AACA;AAEA;EACA,aAAA;AACA",file:"Card.vue",sourcesContent:[`<template>
  <div>
    <form id="stripe-element-form">
      <div id="stripe-element-mount-point" />
      <slot name="stripe-element-errors">
        <div
          id="stripe-element-errors"
          role="alert"
        />
      </slot>
      <button
        ref="submitButtonRef"
        type="submit"
        class="hide"
      />
    </form>
  </div>
</template>

<script>
import { loadStripe } from '@stripe/stripe-js/dist/pure.esm.js';
// import { isSecureHost } from '../utils';
import {
  DEFAULT_ELEMENT_STYLE,
  STRIPE_PARTNER_DETAILS,
  // INSECURE_HOST_ERROR_MESSAGE,
} from '../constants';
const ELEMENT_TYPE = 'card';
export default {
  props: {
    pk: {
      type: String,
      required: true,
    },
    testMode: {
      type: Boolean,
      default: false,
    },
    stripeAccount: {
      type: String,
      default: undefined,
    },
    apiVersion: {
      type: String,
      default: undefined,
    },
    locale: {
      type: String,
      default: 'auto',
    },
    elementsOptions: {
      type: Object,
      default: () => ({}),
    },
    tokenData: {
      type: Object,
      default: () => ({}),
    },
    disableAdvancedFraudDetection: {
      type: Boolean,
    },
    // element specific options
    classes: {
      type: Object,
      default: () => ({}),
    },
    elementStyle: {
      type: Object,
      default: () => (DEFAULT_ELEMENT_STYLE),
    },
    value: {
      type: String,
      default: undefined,
    },
    hidePostalCode: Boolean,
    iconStyle: {
      type: String,
      default: 'default',
      validator: value => ['solid', 'default'].includes(value),
    },
    hideIcon: Boolean,
    disabled: Boolean,
  },
  data () {
    return {
      loading: false,
      stripe: null,
      elements: null,
      element: null,
      card: null,
    };
  },
  computed: {
    form () {
      return document.getElementById('stripe-element-form');
    },
  },
  async mounted () {
    // FIXME: temporarily remove to avoid problems with remote non-production deployments
    // if (!isSecureHost(this.testMode)) {
    //   document.getElementById('stripe-element-mount-point').innerHTML = \`<p style="color: red">\${INSECURE_HOST_ERROR_MESSAGE}</p>\`;
    //   return;
    // }

    if (this.disableAdvancedFraudDetection) loadStripe.setLoadParameters({ advancedFraudSignals: false });

    const stripeOptions = {
      stripeAccount: this.stripeAccount,
      apiVersion: this.apiVersion,
      locale: this.locale,
    };
    const createOptions = {
      classes: this.classes,
      style: this.elementStyle,
      value: this.value,
      hidePostalCode: this.hidePostalCode,
      iconStyle: this.iconStyle,
      hideIcon: this.hideIcon,
      disabled: this.disabled,
    };

    this.stripe = await loadStripe(this.pk, stripeOptions);
    this.stripe.registerAppInfo(STRIPE_PARTNER_DETAILS);
    this.elements = this.stripe.elements(this.elementsOptions);
    this.element = this.elements.create(ELEMENT_TYPE, createOptions);
    this.element.mount('#stripe-element-mount-point');

    this.element.on('change', (event) => {
      var displayError = document.getElementById('stripe-element-errors');
      if (event.error) {
        displayError.textContent = event.error.message;
      } else {
        displayError.textContent = '';
      }
      this.onChange(event);
    });

    this.element.on('blur', this.onBlur);
    this.element.on('click', this.onClick);
    this.element.on('escape', this.onEscape);
    this.element.on('focus', this.onFocus);
    this.element.on('ready', this.onReady);

    this.form.addEventListener('submit', async (event) => {
      try {
        this.$emit('loading', true);
        event.preventDefault();
        const data = {
          ...this.element,
        };
        if (this.amount) data.amount = this.amount;
        const { token, error } = await this.stripe.createToken(data, this.tokenData);
        if (error) {
          const errorElement = document.getElementById('stripe-element-errors');
          errorElement.textContent = error.message;
          this.$emit('error', error);
          return;
        }
        this.$emit('token', token);
      } catch (error) {
        console.error(error);
        this.$emit('error', error);
      } finally {
        this.$emit('loading', false);
      }
    });
  },
  methods: {
    /**
     * Triggers the submission of the form
     * @return {void}
     */
    submit () {
      this.$refs.submitButtonRef.click();
    },
    /**
     * Clears the element
     * @return {void}
     */
    clear () {
      this.element.clear();
    },
    /**
     * Destroys the element
     * @return {void}
     */
    destroy () {
      this.element.destroy();
    },
    /**
     * Focuses on the element
     * @return {void}
     */
    focus () {
      console.warn('This method will currently not work on iOS 13+ due to a system limitation.');
      this.element.focus();
    },
    /**
     * Unmounts the element
     * @return {void}
     */
    unmount () {
      this.element.unmount();
    },
    /**
     * Updates the element
     * @param {string} opts.classes.base The base class applied to the container. Defaults to StripeElement.
     * @param {string} opts.classes.complete The class name to apply when the Element is complete. Defaults to StripeElement--complete.
     * @param {string} opts.classes.empty The class name to apply when the Element is empty. Defaults to StripeElement--empty.
     * @param {string} opts.classes.focus The class name to apply when the Element is focused. Defaults to StripeElement--focus.
     * @param {string} opts.classes.invalid The class name to apply when the Element is invalid. Defaults to StripeElement--invalid.
     * @param {string} opts.classes.webkitAutoFill The class name to apply when the Element has its value autofilled by the browser (only on Chrome and Safari). Defaults to StripeElement--webkit-autofill.
     * @param {Object} opts.style Customize the appearance of this element using CSS properties passed in a Style object.
     * @param {string} opts.value A pre-filled set of values to include in the input (e.g., {postalCode: '94110'}). Note that sensitive card information (card number, CVC, and expiration date) cannot be pre-filled
     * @param {boolean} opts.hidePostalCode Hide the postal code field. Default is false. If you are already collecting a full billing address or postal code elsewhere, set this to true.
     * @param {string} opts.iconStyle Appearance of the icon in the Element. Either solid or default.
     * @param {boolean} opts.hideIcon Hides the icon in the Element. Default is false.
     * @param {boolean} opts.disabled Applies a disabled state to the Element such that user input is not accepted. Default is false.
     */
    update (opts) {
      this.element.update(opts);
    },
    // events
    onChange (e) {
      this.$emit('element-change', e);
    },
    onReady (e) {
      this.$emit('element-ready', e);
    },
    onFocus (e) {
      this.$emit('element-focus', e);
    },
    onBlur (e) {
      this.$emit('element-blur', e);
    },
    onEscape (e) {
      this.$emit('element-escape', e);
    },
    onClick (e) {
      this.$emit('element-click', e);
    },
  },
};
<\/script>

<style scoped>
/**
 * The CSS shown here will not be introduced in the Quickstart guide, but shows
 * how you can use CSS to style your Element's container.
 */
.StripeElement {
  box-sizing: border-box;

  height: 40px;

  padding: 10px 12px;

  border: 1px solid transparent;
  border-radius: 4px;
  background-color: white;

  box-shadow: 0 1px 3px 0 #e6ebf1;
  -webkit-transition: box-shadow 150ms ease;
  transition: box-shadow 150ms ease;
}

.StripeElement--focus {
  box-shadow: 0 1px 3px 0 #cfd7df;
}

.StripeElement--invalid {
  border-color: #fa755a;
}

.StripeElement--webkit-autofill {
  background-color: #fefde5 !important;
}

.hide {
  display: none;
}
</style>
`]},media:void 0})},Xn="data-v-4dd8360e",Kn=Ce({render:Pe,staticRenderFns:Gn},zn,Hn,Xn,!1,void 0,!1,ke,void 0,void 0);var Wn="payment",Zn={props:{pk:{type:String,required:!0},testMode:{type:Boolean,default:!1},elementsOptions:{type:Object,required:!0,default:function(){return{}}},confirmParams:{type:Object,required:!0,default:function(){return{}}},redirect:{type:String,default:"always"},createOptions:{type:Object,default:function(){return{}}},stripeAccount:{type:String,default:void 0},apiVersion:{type:String,default:void 0},locale:{type:String,default:"auto"},disableAdvancedFraudDetection:{type:Boolean}},data:function(){return{loading:!1,stripe:null,elements:null,element:null}},computed:{form:function(){return document.getElementById("stripe-payment-element-form")}},mounted:function(){var e,n=this;return O.async(function(r){for(;;)switch(r.prev=r.next){case 0:return this.disableAdvancedFraudDetection&&N.setLoadParameters({advancedFraudSignals:!1}),e={stripeAccount:this.stripeAccount,apiVersion:this.apiVersion,locale:this.locale},r.next=4,O.awrap(N(this.pk,e));case 4:this.stripe=r.sent,this.stripe.registerAppInfo(K),this.elements=this.stripe.elements(this.elementsOptions),this.element=this.elements.create(Wn,this.createOptions),this.element.mount("#stripe-payment-element-mount-point"),this.element.on("change",function(t){var a=document.getElementById("stripe-payment-element-errors");t.error?a.textContent=t.error.message:a.textContent="",n.onChange(t)}),this.element.on("blur",this.onBlur),this.element.on("click",this.onClick),this.element.on("escape",this.onEscape),this.element.on("focus",this.onFocus),this.element.on("ready",this.onReady),this.form.addEventListener("submit",function(t){var a,p,m;return O.async(function(c){for(;;)switch(c.prev=c.next){case 0:return c.prev=0,n.$emit("loading",!0),t.preventDefault(),c.next=5,O.awrap(n.stripe.confirmPayment({elements:n.elements,confirmParams:n.confirmParams,redirect:n.redirect}));case 5:if(a=c.sent,p=a.error,m=a.paymentIntent,!p){c.next=15;break}return document.getElementById("stripe-payment-element-errors").textContent=p.message,n.$emit("error",p),c.abrupt("return");case 15:m&&n.$emit("confirmed",m);case 16:c.next=22;break;case 18:c.prev=18,c.t0=c.catch(0),console.error(c.t0),n.$emit("error",c.t0);case 22:return c.prev=22,n.$emit("loading",!1),c.finish(22);case 25:case"end":return c.stop()}},null,null,[[0,18,22,25]])});case 16:case"end":return r.stop()}},null,this)},methods:{submit:function(){this.$refs.submitButtonRef.click()},clear:function(){this.element.clear()},destroy:function(){this.element.destroy()},focus:function(){console.warn("This method will currently not work on iOS 13+ due to a system limitation."),this.element.focus()},collapse:function(){this.element.collapse()},getElement:function(){this.element.getElement()},unmount:function(){this.element.unmount()},update:function(e){this.element.update(e)},onChange:function(e){this.$emit("element-change",e)},onReady:function(e){this.$emit("element-ready",e)},onFocus:function(e){this.$emit("element-focus",e)},onBlur:function(e){this.$emit("element-blur",e)},onEscape:function(e){this.$emit("element-escape",e)},onClick:function(e){this.$emit("element-click",e)}}};const Qn=Zn;var Oe=function(){var e=this.$createElement,n=this._self._c||e;return n("div",[n("form",{attrs:{id:"stripe-payment-element-form"}},[n("div",{attrs:{id:"stripe-payment-element-mount-point"}}),this._v(" "),this._t("stripe-payment-element-errors",[n("div",{attrs:{id:"stripe-payment-element-errors",role:"alert"}})]),this._v(" "),n("button",{ref:"submitButtonRef",staticClass:"hide",attrs:{type:"submit"}})],2)])},Yn=[];Oe._withStripped=!0;const Jn=function(e){e&&e("data-v-171d7aec_0",{source:`












































































































































































































































































/**
 * The CSS shown here will not be introduced in the Quickstart guide, but shows
 * how you can use CSS to style your Element's container.
 */
.hide[data-v-171d7aec] {
  display: none;
}
`,map:{version:3,sources:["/home/runner/work/vue-stripe/vue-stripe/src/elements/Payment.vue"],names:[],mappings:";;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;AA6QA;;;EAGA;AACA;EACA,aAAA;AACA",file:"Payment.vue",sourcesContent:[`<template>
  <div>
    <form id="stripe-payment-element-form">
      <div id="stripe-payment-element-mount-point" />
      <slot name="stripe-payment-element-errors">
        <div
          id="stripe-payment-element-errors"
          role="alert"
        />
      </slot>
      <button
        ref="submitButtonRef"
        type="submit"
        class="hide"
      />
    </form>
  </div>
</template>

<script>
import { loadStripe } from '@stripe/stripe-js/dist/pure.esm.js';
// import { isSecureHost } from '../utils';
import {
  STRIPE_PARTNER_DETAILS,
  // INSECURE_HOST_ERROR_MESSAGE,
} from '../constants';
const ELEMENT_TYPE = 'payment';
export default {
  props: {
    pk: {
      type: String,
      required: true,
    },
    testMode: {
      type: Boolean,
      default: false,
    },
    elementsOptions: {
      type: Object,
      required: true,
      default: () => ({}),
    },
    confirmParams: {
      type: Object,
      required: true,
      default: () => ({}),
    },
    redirect: {
      type: String,
      default: 'always',
    },
    createOptions: {
      type: Object,
      default: () => ({}),
    },
    stripeAccount: {
      type: String,
      default: undefined,
    },
    apiVersion: {
      type: String,
      default: undefined,
    },
    locale: {
      type: String,
      default: 'auto',
    },
    disableAdvancedFraudDetection: {
      type: Boolean,
    },
  },
  data () {
    return {
      loading: false,
      stripe: null,
      elements: null,
      element: null,
    };
  },
  computed: {
    form () {
      return document.getElementById('stripe-payment-element-form');
    },
  },
  async mounted () {
    // FIXME: temporarily remove to avoid problems with remote non-production deployments
    // if (!isSecureHost(this.testMode)) {
    //   document.getElementById(
    //     'stripe-payment-element-mount-point',
    //   ).innerHTML = \`<p style="color: red">\${INSECURE_HOST_ERROR_MESSAGE}</p>\`;
    //   return;
    // }

    if (this.disableAdvancedFraudDetection) {
      loadStripe.setLoadParameters({ advancedFraudSignals: false });
    }

    const stripeOptions = {
      stripeAccount: this.stripeAccount,
      apiVersion: this.apiVersion,
      locale: this.locale,
    };

    this.stripe = await loadStripe(this.pk, stripeOptions);
    this.stripe.registerAppInfo(STRIPE_PARTNER_DETAILS);

    this.elements = this.stripe.elements(this.elementsOptions);
    this.element = this.elements.create(ELEMENT_TYPE, this.createOptions);
    this.element.mount('#stripe-payment-element-mount-point');

    this.element.on('change', event => {
      var displayError = document.getElementById(
        'stripe-payment-element-errors',
      );
      if (event.error) {
        displayError.textContent = event.error.message;
      } else {
        displayError.textContent = '';
      }
      this.onChange(event);
    });

    this.element.on('blur', this.onBlur);
    this.element.on('click', this.onClick);
    this.element.on('escape', this.onEscape);
    this.element.on('focus', this.onFocus);
    this.element.on('ready', this.onReady);

    this.form.addEventListener('submit', async event => {
      try {
        this.$emit('loading', true);
        event.preventDefault();
        const { error, paymentIntent } = await this.stripe.confirmPayment({
          elements: this.elements,
          confirmParams: this.confirmParams,
          redirect: this.redirect,
        });

        // if the response is an error
        if (error) {
          const errorElement = document.getElementById(
            'stripe-payment-element-errors',
          );
          errorElement.textContent = error.message;
          this.$emit('error', error);
          return;
        } else if (paymentIntent) {
          // if the user has passed prop redirect="if_required"
          // and the payment confirmation was successful
          // and the payment method is not forced to redirect
          // then stripe.confirmPayment resolves with a paymentIntent
          // so we sould pass it back up to the caller for consumption
          // https://stripe.com/docs/js/payment_intents/confirm_payment?type=pii#confirm_payment_intent-options-redirect
          this.$emit('confirmed', paymentIntent);
        }
      } catch (error) {
        console.error(error);
        this.$emit('error', error);
      } finally {
        this.$emit('loading', false);
      }
    });
  },
  methods: {
    /**
     * Triggers the submission of the form
     * @return {void}
     */
    submit () {
      this.$refs.submitButtonRef.click();
    },
    /**
     * Clears the element
     * @return {void}
     */
    clear () {
      this.element.clear();
    },
    /**
     * Destroys the element
     * @return {void}
     */
    destroy () {
      this.element.destroy();
    },
    /**
     * Focuses on the element
     * @return {void}
     */
    focus () {
      console.warn(
        'This method will currently not work on iOS 13+ due to a system limitation.',
      );
      this.element.focus();
    },
    /**
     * Collapses the Payment Element into a row of payment method tabs
     * @return {void}
     */
    collapse () {
      this.element.collapse();
    },
    /**
     * Retrieves a previously created element
     */
    getElement () {
      this.element.getElement();
    },
    /**
     * Unmounts the element
     * @return {void}
     */
    unmount () {
      this.element.unmount();
    },
    /**
     * Updates the element. See official docs for more detail: https://site-admin.stripe.com/docs/js/elements_object/update_payment_element
     * @param {string} opts.business.name  Information about your business that will be displayed in the Payment Element. This information will be retrieved from the Stripe account if not provided.
     * @param {array} opts.paymentMethodOrder Sets order in which payment methods are displayed. Otherwise payment methods are ordered dynamically to optimize for conversion.
     * @param {string | Object} opts.fields.billingDetails The Payment Element automatically creates input fields to collect required billing information for some payment methods like SEPA debit. Specify 'never' to avoid collecting billing details in the Payment Element if you're collecting them outside of the Payment Element.
     * @param {string} opts.fields.billingDetails.name Specify 'never' to avoid collecting a name as part of the billing details in the Payment Element.
     * @param {string} opts.fields.billingDetails.email Specify 'never' to avoid collecting an email address as part of the billing details in the Payment Element.
     * @param {string} opts.fields.billingDetails.phone Specify 'never' to avoid collecting a phone number as part of the billing details in the Payment Element.
     * @param {string | Object} opts.fields.billingDetails.address Specify 'never' to avoid collecting an address as part of the billing details in the Payment Element.
     * @param {string} opts.fields.billingDetails.address.line1 Specify 'never' to avoid collecting an address line1 as part of the billing details in the Payment Element.
     * @param {string} opts.fields.billingDetails.address.line2 Specify 'never' to avoid collecting an address line2 as part of the billing details in the Payment Element.
     * @param {string} opts.fields.billingDetails.address.city Specify 'never' to avoid collecting an address city as part of the billing details in the Payment Element.
     * @param {string} opts.fields.billingDetails.address.state Specify 'never' to avoid collecting an address state as part of the billing details in the Payment Element.
     * @param {string} opts.fields.billingDetails.address.country Specify 'never' to avoid collecting an address country as part of the billing details in the Payment Element.
     * @param {string} opts.fields.billingDetails.address.postalCode Specify 'never' to avoid collecting an address postal code as part of the billing details in the Payment Element.
     * @param {string} opts.fields.terms The Payment Element automatically displays mandates or other legal agreements when required by the payment method, like SEPA debit. Specify 'never' to never show legal agreements.
     * @param {string} opts.fields.terms.auBecsDebit Specify 'never' to never show legal agreements for the BECS Debit payment method.
     * @param {string} opts.fields.terms.bancontact Specify 'never' to never show legal agreements for the Bancontact payment method.
     * @param {string} opts.fields.terms.card Specify 'never' to never show legal agreements for the credit card payment method.
     * @param {string} opts.fields.terms.ideal Specify 'never' to never show legal agreements for the iDEAL payment method.
     * @param {string} opts.fields.terms.sepaDebit Specify 'never' to never show legal agreements for the SEPA Debit payment method.
     * @param {string} opts.fields.terms.sofort Specify 'never' to never show legal agreements for the SOFORT payment method.
     * @param {string} opts.fields.terms.usBankAccount Specify 'never' to never show legal agreements for the US Bank accounts payment method.
     * @param {string} opts.wallets Specify 'never' to never show digital wallet payment methods like Apple Pay and Google Pay.
     * @param {string} opts.wallets.applePay Specify 'never' to never show the Apple Pay digital wallet payment method.
     * @param {string} opts.wallets.googlePay Specify 'never' to never show the Google Pay digital wallet payment method.
     */
    update (opts) {
      this.element.update(opts);
    },
    // events
    onChange (e) {
      this.$emit('element-change', e);
    },
    onReady (e) {
      this.$emit('element-ready', e);
    },
    onFocus (e) {
      this.$emit('element-focus', e);
    },
    onBlur (e) {
      this.$emit('element-blur', e);
    },
    onEscape (e) {
      this.$emit('element-escape', e);
    },
    onClick (e) {
      this.$emit('element-click', e);
    },
  },
};
<\/script>

<style scoped>
/**
 * The CSS shown here will not be introduced in the Quickstart guide, but shows
 * how you can use CSS to style your Element's container.
 */
.hide {
  display: none;
}
</style>
`]},media:void 0})},et=Ce({render:Oe,staticRenderFns:Yn},Jn,Qn,"data-v-171d7aec",!1,void 0,!1,ke,void 0,void 0);var nt={install:function(e,n){var r,t,a,p,m,c,_;return O.async(function(h){for(;;)switch(h.prev=h.next){case 0:r=n.pk,t=n.stripeAccount,a=n.apiVersion,p=n.locale,m=n.elementsOptions,(c=window.Stripe(r,{stripeAccount:t,apiVersion:a,locale:p})).registerAppInfo(K),_=c.elements(m),e.prototype.$stripe=c,e.prototype.$stripeElements=_;case 6:case"end":return h.stop()}})}};Se=H.StripeCheckout=$n,H.StripeElementCard=Kn,H.StripeElementPayment=et,H.StripeElementsPlugin=nt,H.StripePlugin=An;const tt="pk_test_51NBEtDGbLaki56uH8dbAEZJtpiUJ3E2DuqskReMLFNeWtuXDZMnDoQAhJrP9tJNQVo0LTglgwecDbkOMx45BSR7q00vM8QLRMv",rt={components:{StripeCheckout:Se},data(){return{loading:!1,sessionId:"session-id",publishableKey:tt,lineItems:[{clientId:1,productName:"Laptop Asus Zenbook 14 OLED UX3402Z UX3402ZA-KM221W (14inch 90Hz/Intel Core i7 1260P/16GB/512GB SSD/Windows 11 Home/1.3kg)",imageProduct:"https://lh3.googleusercontent.com/rnIVOAhuK4DqaHOsT3vGKI_rdZTtfAbpW3klDiKfLfXDjrvjrBI7JLCOkNegNx5lXWU4uIkoBaeTIMQsrMngAPg0xDzvBSGz=w500-h500-rw",quantity:3,amount:100,currency:"USD"},{clientId:1,productName:"Laptop Asus Zenbook 14 OLED UX3402Z UX3402ZA-KM221W (14inch 90Hz/Intel Core i7 1260P/16GB/512GB SSD/Windows 11 Home/1.3kg)",imageProduct:"https://lh3.googleusercontent.com/rnIVOAhuK4DqaHOsT3vGKI_rdZTtfAbpW3klDiKfLfXDjrvjrBI7JLCOkNegNx5lXWU4uIkoBaeTIMQsrMngAPg0xDzvBSGz=w500-h500-rw",quantity:1,amount:120,currency:"USD"}]}},onMounted(){},methods:{async submit(){this.sessionId=await De.createCheckoutSession(this.lineItems),this.$refs.checkoutRef.redirectToCheckout()}}};function it(e,n,r,t,a,p){const m=L("stripe-checkout");return Y(),ve("div",null,[y(m,{ref:"checkoutRef",pk:a.publishableKey,"session-id":a.sessionId},null,8,["pk","session-id"]),s("button",{onClick:n[0]||(n[0]=(...c)=>p.submit&&p.submit(...c))},"Checkout!")])}const ot=ce(rt,[["render",it]]),st=s("div",{class:"mb-4"},[s("h1",{class:"mb-4 text-base font-bold"},"Thông tin nhận hàng"),s("div",{class:"flex w-full text-sm font-medium"},[s("h1",{class:"mr-1 flex-[0_0_12%]"},"Họ và tên:"),s("div",null,"Nguyễn Anh Quân")]),s("div",{class:"flex w-full text-sm font-medium"},[s("h1",{class:"mr-1 flex-[0_0_12%]"},"Số điện thoại:"),s("span",null,"0368517926")]),s("div",{class:"flex w-full text-sm font-medium"},[s("h1",{class:"mr-1 flex-[0_0_12%]"},"Địa chỉ nhận hàng:"),s("div",null,"Số 34 Hoàng Cầu, tòa nhà Viễn Đông, Ô chợ Dừa, Đống Đa, Hà Nội")])],-1),at=s("h1",{class:"mb-4 text-base font-bold"},"Thông tin đơn hàng",-1),lt={class:"flex items-center"},ct=["src"],pt={class:"ml-4"},ut=s("div",{class:"mb-4"},[s("h1",{class:"mb-4 text-base font-bold"},"Thông tin thanh toán"),s("div",{class:"flex w-full items-center text-sm font-medium"},[s("h1",{class:"mr-1 flex-[0_0_16%]"},"Phương thức thanh toán:"),s("div",{class:"flex items-center"},[s("img",{alt:"",height:"50",src:_e,width:"100"})])])],-1),dt={class:"flex justify-end"},mt=le({__name:"PopupPaymentDetail",setup(e){const n=G([{id:0,name:"Laptop Asus Zenbook 14 OLED UX3402Z UX3402ZA-KM221W (14inch 90Hz/Intel Core i7 1260P/16GB/512GB SSD/Windows 11 Home/1.3kg)",image:"https://lh3.googleusercontent.com/rnIVOAhuK4DqaHOsT3vGKI_rdZTtfAbpW3klDiKfLfXDjrvjrBI7JLCOkNegNx5lXWU4uIkoBaeTIMQsrMngAPg0xDzvBSGz",retailPrice:2599e4,latestPrice:2099e4,quantity:2},{id:0,name:"Laptop Asus Zenbook 14 OLED UX3402Z UX3402ZA-KM221W (14inch 90Hz/Intel Core i7 1260P/16GB/512GB SSD/Windows 11 Home/1.3kg) ",image:"https://lh3.googleusercontent.com/rnIVOAhuK4DqaHOsT3vGKI_rdZTtfAbpW3klDiKfLfXDjrvjrBI7JLCOkNegNx5lXWU4uIkoBaeTIMQsrMngAPg0xDzvBSGz",retailPrice:2599e4,latestPrice:2099e4,quantity:2}]),r=()=>{console.log()},t=()=>{console.log()};return(a,p)=>{const m=L("el-table-column"),c=Ne,_=ae,h=be;return Y(),ge(h,{"is-show-footer":!0,class:"popup-payment-detail",name:"popup-payment-detail",width:"1200px",onClose:t,onOpen:r},{title:b(()=>[B("Chi tiết thanh toán")]),footer:b(()=>[s("div",dt,[y(_,{class:"mr-4",type:"plain"},{default:b(()=>[B("Quay lại")]),_:1}),y(_,{type:"primary"},{default:b(()=>[B(" Xác nhận ")]),_:1}),y(ot)])]),default:b(()=>[s("div",null,[s("div",null,[st,s("div",null,[at,y(c,{data:S(n),loading:!1,query:{},label:"sản phẩm"},{default:b(()=>[y(m,{index:1,align:"center",label:"#",type:"index",width:"80"}),y(m,{align:"left",label:"Tên sản phẩm",prop:"name"},{default:b(v=>[s("div",lt,[s("img",{src:v.row.image,alt:"",height:"60",width:"60"},null,8,ct),s("p",pt,Q(v.row.name),1)])]),_:1}),y(m,{align:"right",label:"Số lượng",prop:"quantity",width:"150"}),y(m,{align:"right",label:"Đơn giá",prop:"latestPrice",width:"250"})]),_:1},8,["data"])]),ut])])]),_:1})}}}),T=e=>(Be("data-v-4be50eb9"),e=e(),$e(),e),ht={class:"m-auto max-w-[1232px] px-8 py-8"},ft=T(()=>s("div",{class:"mr-4 w-[66.67%]"},[s("h1",{class:"mb-4 text-2xl font-bold"},"Thanh toán")],-1)),yt={class:"flex w-full"},gt={class:"block-left mr-4 w-[66.67%] rounded bg-white px-4 py-4"},vt={class:"mb-4"},bt=T(()=>s("div",{class:"flex items-center justify-between"},[s("h1",{class:"mb-4 text-sm font-bold"},"Thông tin nhận hàng")],-1)),_t={class:"block-right flex w-[48%] flex-wrap rounded bg-white"},St={class:"flex h-auto min-h-[120px] w-[100%] flex-auto flex-col rounded border border-solid border-[#eaeaea] p-[20px] text-sm"},Et={class:"flex items-center justify-between font-bold"},wt={class:"pr-2"},At=T(()=>s("div",{class:"flex items-center justify-between"},[s("h1",{class:"mb-4 text-sm font-bold"},"Phương thức thanh toán")],-1)),xt=T(()=>s("div",{class:"mr-4 text-sm font-bold"},"Thanh toán qua",-1)),Ct=T(()=>s("img",{alt:"",height:"50",src:_e,width:"100"},null,-1)),kt=T(()=>s("div",{class:"mr-4 text-sm font-bold"},"Thanh toán khi nhận hàng",-1)),Pt={class:"block-right max-h-[350px] w-[33.33%] rounded bg-white"},Ot={class:"px-6 py-6"},It=T(()=>s("div",{class:"mb-4 text-base font-bold"},"Thanh toán",-1)),Tt=T(()=>s("div",{class:"mb-1 flex justify-between"},[s("h3",null,"Tổng tạm tính"),s("span",null,"8.890.000₫")],-1)),Dt=T(()=>s("div",{class:"mb-1 flex justify-between"},[s("h3",null,"Phí vận chuyển"),s("span",null,"Miễn phí")],-1)),jt=T(()=>s("div",{class:"mb-12 flex justify-between"},[s("h3",null,"Thành tiền"),s("span",null,"8.890.000₫")],-1)),Lt=le({__name:"CheckoutView",setup(e){const n=ye(),r=G("1"),t=G({consigneeName:"Nguyễn Anh Quân",consigneePhoneNumber:"0368517926",deliveryAddress:"Hoài Đức, Xã Yên Sở, Huyện Hoài Đức, Thành phố Hà Nội"}),a=()=>{n.setOpenPopup(!0,"popup-shipping-info")},p=c=>{t.value={...c}},m=()=>{n.setOpenPopup(!0,"popup-payment-detail")};return(c,_)=>{const h=L("el-icon"),v=L("el-radio"),E=L("el-radio-group"),d=ae;return Y(),ve("div",ht,[ft,s("div",yt,[s("div",gt,[s("div",vt,[bt,s("div",_t,[s("div",St,[s("div",Et,[s("h1",wt,Q(S(t).consigneeName),1),y(h,{class:"cursor-pointer",size:"20",onClick:a},{default:b(()=>[y(S(je))]),_:1})]),s("div",null,Q(S(t).consigneePhoneNumber),1),s("div",null,Q(S(t).deliveryAddress),1)])])]),s("div",null,[At,s("div",null,[y(E,{modelValue:S(r),"onUpdate:modelValue":_[0]||(_[0]=P=>Le(r)?r.value=P:null),class:"flex w-full justify-between"},{default:b(()=>[y(v,{border:"",class:"!mr-[0] flex !h-[90px] w-[48%]",label:"1",size:"large"},{default:b(()=>[xt,Ct]),_:1}),y(v,{border:"",class:"!h-[90px] w-[48%]",label:"2",size:"large"},{default:b(()=>[kt]),_:1})]),_:1},8,["modelValue"])])])]),s("div",Pt,[s("div",Ot,[It,Tt,Dt,jt,y(d,{class:"mb-4",onClick:m},{default:b(()=>[B("Tiến hành thanh toán")]),_:1}),y(d,{type:"plain"},{default:b(()=>[B("Trở lại mua hàng")]),_:1})])])]),y(Ve,{"props-form":S(t),onFormShipping:p},null,8,["props-form"]),y(mt)])}}});const qt=ce(Lt,[["__scopeId","data-v-4be50eb9"]]);export{qt as default};
