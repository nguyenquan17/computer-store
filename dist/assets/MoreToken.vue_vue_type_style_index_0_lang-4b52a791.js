import{t as M,g as w}from"./formatNumberInput-23a78a00.js";import{f as D,E as N,M as U,G as A,r as i,j as V,T as p,a0 as E,g as m,o as n,k as v,w as y,a as _,b as I,u as a,I as f,c as d,F as L,D as R,R as G,N as $,$ as h}from"./index-33323f4a.js";const F=_("div",{class:"px-3 py-4 cursor-pointer hover:text-tab-active"},"More...",-1),H={class:"list-more-token max-h-[300px] mt-2 overflow-y-auto"},j={key:0},z=["onClick"],P=D({__name:"MoreToken",emits:["select"],setup(O,{emit:k}){N();const b=U(),u=A(),r=i(!1),l=i(""),t=i([]),c=i([]);V(()=>{console.log(u.listAssetToken),t.value=p(u.listAssetToken,e=>!h(["MAGIC","ETH","BNB","USDT","BUSD"],e.currency)),c.value=p(u.listAssetToken,e=>!h(["MAGIC","ETH","BNB","USDT","BUSD"],e.currency))});const x=e=>{T(M(e).toLowerCase())},T=E(e=>{e?t.value=p(c.value,o=>o.currency.toLowerCase().includes(e)||o.currencyName.toLowerCase().includes(e)):t.value=c.value}),C=e=>{k("select",e.currency),r.value=!1,l.value="",t.value=c.value};return(e,o)=>{const g=m("el-input"),B=w,S=m("el-popover");return n(),v(S,{visible:a(r),"onUpdate:visible":o[1]||(o[1]=s=>f(r)?r.value=s:null),placement:"bottom","popper-class":"popper-token-more",width:"200",trigger:"click",class:"p-2"},{reference:y(()=>[F]),default:y(()=>[_("div",null,[I(g,{modelValue:a(l),"onUpdate:modelValue":o[0]||(o[0]=s=>f(l)?l.value=s:null),class:"input-search py-0 px-5 h-10",placeholder:"Search",onInput:x},null,8,["modelValue"]),_("div",H,[a(t).length?(n(),d("div",j,[(n(!0),d(L,null,R(a(t),s=>(n(),d("div",{key:s.id,class:G([a(b).params.currency===s.currency?"text-tab-active font-semibold":null,"token-more cursor-pointer h-[40px] py-0 px-5 text-base leading-10 hover:text-tab-active"]),onClick:q=>C(s)},$(s.currency),11,z))),128))])):(n(),v(B,{key:1}))])])]),_:1},8,["visible"])}}});export{P as _};
