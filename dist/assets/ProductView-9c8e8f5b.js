import{aa as G,ab as E,f as I,P as T,r as t,y as N,j as v,o,c as d,a as n,b as a,w as r,l as s,O as w,G as k,H as V,k as $,e as P,L as b,X as K,a5 as F,ac as M,p as H,m as J,u as O,g as X,J as Q,I as W,ad as Y}from"./index-65c6b856.js";import{_ as Z}from"./_plugin-vue_export-helper-c27b6911.js";import{_ as ee}from"./BaseButton-5e92c961.js";import{I as te}from"./Item-c45914e6.js";import"./formatNumber-a2d8cd5e.js";function le(){const c={};return{dataList:c,getAttributeProduct:async u=>{try{const f=G(u,async i=>{const p=await E.getAttribute(i);p&&(c[`${i}`]=p.data)})}catch(f){console.log(f)}}}}const oe={class:"max-w-[20%] flex-[0_0_20%] px-2 py-2"},ae={class:"flex flex-col rounded-lg bg-white px-[12px] py-[12px]"},se={class:"price"},ne=n("div",{class:"mb-1 text-sm font-bold"},"Khoảng giá",-1),re={class:"flex"},de=n("div",{class:"mr-2 text-description"},"-",-1),ce={class:"slider-demo-block"},ie=I({__name:"SideBarFilter",setup(c){const m=T(),u=le(),f=t([4,8]),i=t({priceTo:"",priceFrom:""}),p=t([]),x=t([]),y=t([]);t([]),t([]),t([]),t([]),t([]),t([]),t([]),t([]);const C=t([]);t([]),t([]),t([]),t([]);const _=t(["1","2","3","4"]),g=t({});N(async()=>{m.params.category==="laptop"&&(await u.getAttributeProduct(["brandProduct","colorProduct","laptopSeries","ramCapacity"]),console.log(u.dataList),g.value=u.dataList)});const h=()=>{console.log({checkListBrandProduct:p,checkListColorProduct:x,checkListLaptopSeries:y})};return(U,l)=>{const A=v("el-input"),j=v("el-form-item"),q=v("el-slider"),L=v("el-checkbox"),S=v("el-checkbox-group"),B=v("el-collapse-item"),z=v("el-collapse"),D=v("el-form");return o(),d("div",oe,[n("div",ae,[a(D,null,{default:r(()=>[n("div",se,[ne,n("div",re,[a(j,{class:"mr-2",label:""},{default:r(()=>[a(A,{modelValue:s(i).priceFrom,"onUpdate:modelValue":l[0]||(l[0]=e=>s(i).priceFrom=e),clearable:"",placeholder:"0"},null,8,["modelValue"])]),_:1}),de,a(j,{label:""},{default:r(()=>[a(A,{modelValue:s(i).priceTo,"onUpdate:modelValue":l[1]||(l[1]=e=>s(i).priceTo=e),clearable:"",placeholder:"0"},null,8,["modelValue"])]),_:1})]),n("div",ce,[a(q,{modelValue:s(f),"onUpdate:modelValue":l[2]||(l[2]=e=>w(f)?f.value=e:null),max:10,range:"","show-stops":"",size:"small"},null,8,["modelValue"])])]),n("div",null,[a(z,{modelValue:s(_),"onUpdate:modelValue":l[7]||(l[7]=e=>w(_)?_.value=e:null)},{default:r(()=>[a(B,{name:"1",title:"Thương hiệu"},{default:r(()=>[a(S,{modelValue:s(p),"onUpdate:modelValue":l[3]||(l[3]=e=>w(p)?p.value=e:null),class:"flex flex-wrap justify-between",onChange:h},{default:r(()=>[(o(!0),d(k,null,V(s(g).brandProduct,e=>(o(),$(L,{key:e.name,label:e.value,class:"!mr-2 flex w-[90px] flex-wrap"},{default:r(()=>[P(b(e.name),1)]),_:2},1032,["label"]))),128))]),_:1},8,["modelValue"])]),_:1}),a(B,{name:"2",title:"Màu sắc"},{default:r(()=>[a(S,{modelValue:s(x),"onUpdate:modelValue":l[4]||(l[4]=e=>w(x)?x.value=e:null),onChange:h},{default:r(()=>[(o(!0),d(k,null,V(s(g).colorProduct,e=>(o(),$(L,{key:e.name,label:e.value},{default:r(()=>[P(b(e.name),1)]),_:2},1032,["label"]))),128))]),_:1},8,["modelValue"])]),_:1}),a(B,{name:"3",title:"Laptop Series"},{default:r(()=>[a(S,{modelValue:s(y),"onUpdate:modelValue":l[5]||(l[5]=e=>w(y)?y.value=e:null),onChange:h},{default:r(()=>[(o(!0),d(k,null,V(s(g).laptopSeries,e=>(o(),$(L,{key:e.name,label:e.value},{default:r(()=>[P(b(e.name),1)]),_:2},1032,["label"]))),128))]),_:1},8,["modelValue"])]),_:1}),a(B,{name:"4",title:"Dung lượng Ram"},{default:r(()=>[a(S,{modelValue:s(C),"onUpdate:modelValue":l[6]||(l[6]=e=>w(C)?C.value=e:null),onChange:h},{default:r(()=>[(o(!0),d(k,null,V(s(g).ramCapacity,e=>(o(),$(L,{key:e.name,label:e.value},{default:r(()=>[P(b(e.name),1)]),_:2},1032,["label"]))),128))]),_:1},8,["modelValue"])]),_:1})]),_:1},8,["modelValue"])])]),_:1})])])}}}),R=c=>(H("data-v-658df945"),c=c(),J(),c),ue=R(()=>n("div",{class:"spinner-loading"},null,-1)),_e={class:"center loading-tip"},pe={key:1},me={key:1},fe={key:0,class:"spinning"},ge=R(()=>n("div",{class:"spinner-loading"},null,-1)),he={class:"center loading-tip"},ve={key:1},ye=I({__name:"BaseLoading",props:{loading:{required:!0,type:Boolean,default:!0},delay:{required:!1,type:Number,default:0},fullscreen:{required:!1,type:Boolean,default:!1},tip:{required:!1,type:String,default:"Loading..."}},setup(c){const m=t(0);return(u,f)=>c.fullscreen?(o(),$(M,{key:0,name:"fade"},{default:r(()=>[c.loading&&!s(m)?(o(),d("div",{key:0,class:K(c.fullscreen?"spinning fullscreen":"spinning")},[ue,n("p",_e,b(c.tip),1)],2)):(o(),d("div",pe,[F(u.$slots,"default",{},void 0,!0)]))]),_:3})):(o(),d("div",me,[c.loading&&!s(m)?(o(),d("div",fe,[ge,n("p",he,b(c.tip),1)])):(o(),d("div",ve,[F(u.$slots,"default",{},void 0,!0)]))]))}});const be=Z(ye,[["__scopeId","data-v-658df945"]]),xe={class:"max-w-[80%] flex-[0_0_80%] px-2 py-2"},we={class:"w-full rounded-lg bg-white"},ke={class:"flex h-[64px] w-full border-b border-solid border-[#eaeaea] px-4 text-sm"},Ve={class:"flex items-center"},$e=n("h3",{class:"mr-8 text-sm font-bold"},"Sắp xếp theo",-1),Ce={class:"flex justify-between"},Pe={key:0,class:"flex min-h-[65vh] flex-wrap justify-start bg-white"},Le=["onClick"],Se={key:1,class:"flex min-h-[65vh] flex-wrap justify-start bg-white"},Be=I({__name:"ProductList",setup(c){const m=T(),u=O(),f=X(),i=t(!1),p=t([]),x=t([{name:"Khuyến mãi tốt nhất",value:"big_promotion"},{name:"Giá tăng dần",value:"price_asc"},{name:"Giá giảm dần",value:"price_desc"}]);N(async()=>{await y()});const y=async()=>{try{i.value=!0;const _={page:0,size:20,sort:"desc",order:"productId",categoryId:Q(f.listAssetCategory,h=>h.path===m.params.category)[0].id},g=await W.getAllProductByCategory(_);g&&(p.value=g.data),i.value=!1}catch(_){i.value=!1,console.log(_)}},C=_=>{console.log(_.productId),u.push({name:"ProductDetailView",params:{detail:_.productId}})};return Y(()=>m.params.category,()=>{y()}),(_,g)=>{const h=ee,U=be;return o(),d("div",xe,[n("div",we,[n("div",ke,[n("div",Ve,[$e,n("div",Ce,[(o(!0),d(k,null,V(s(x),l=>(o(),$(h,{key:l.value,class:"mr-4",size:"medium",type:"plain"},{default:r(()=>[P(b(l.name),1)]),_:2},1024))),128))])])]),s(i)?(o(),d("div",Se,[a(U,{class:"flex w-full items-center justify-center",tip:""})])):(o(),d("div",Pe,[(o(!0),d(k,null,V(s(p),l=>(o(),d("div",{key:l.id,class:"h-fit w-[25%] border-b border-r border-l border-solid border-[#eaeaea]",onClick:A=>C(l)},[a(te,{"data-item":l},null,8,["data-item"])],8,Le))),128))]))])])}}}),Ie={class:"m-auto w-full max-w-[1232px] px-4 py-4"},Ue={class:"flex flex-row"},Re=I({__name:"ProductView",setup(c){return(m,u)=>(o(),d("div",null,[n("div",null,[n("div",Ie,[n("div",Ue,[a(ie),a(Be)])])])]))}});export{Re as default};
