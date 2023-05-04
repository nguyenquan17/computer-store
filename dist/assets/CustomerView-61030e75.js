import{_ as j,u as I,a as Z,b as ce,c as ue,d as se,e as pe,f as fe}from"./formatNumberInput-23a78a00.js";import{u as H}from"./disableTime-86bbdf7c.js";import{f as E,r as h,C as W,g as $,o as x,k as F,w as o,b as a,u as e,a as t,N as r,R as ee,G as ne,j as N,S as R,c as k,T as de,F as q,D as J,P as Q,U as ve,e as he,V as be,E as we,M as ge}from"./index-33323f4a.js";import{_ as te}from"./BaseIcon-fd0c2f2a.js";import{u as re,a as ie,b as X}from"./capitalizeLetter-2cf337ed.js";import{_ as ye,a as xe}from"./PopupFilterTransaction.vue_vue_type_style_index_0_lang-dc9506b8.js";import{_ as De}from"./_plugin-vue_export-helper-c27b6911.js";import"./BaseButton-83c1401e.js";function ae(_){if(!_)return"";const c=new Date(_);return(c.getHours()<10?"0"+c.getHours():c.getHours())+":"+(c.getMinutes()<10?"0"+c.getMinutes():c.getMinutes())+":"+(c.getSeconds()<10?"0"+c.getSeconds():c.getSeconds())}function le(_){if(!_)return"";const c=new Date(_);return(c.getMonth()<9?"0"+(c.getMonth()+1):c.getMonth()+1)+"/"+(c.getDate()<10?"0"+c.getDate():c.getDate())+"/"+c.getFullYear()}const Te={class:"be-flex align-center"},Ce={class:"d-ib mr-2 line-clamp-1"},Se={class:"line-clamp-1"},Ae={class:"flex items-center justify-between"},$e={class:"text-add"},ke=["onClick"],Le={class:"text-sm text-description"},Ve=E({__name:"CustomerTable",props:{data:{default:()=>[]},query:{default:()=>({page:1,limit:20,total:0})}},emits:["page-change","limit-change","row-click"],setup(_,{emit:c}){const p=_,g=h(!1),w=W(()=>window.innerWidth<1440),u=d=>(p.query.page-1)*p.query.limit+d+1,v=d=>{try{return d.level&&d.level==="MM"?"MM":d.level!=="Default"?`Level ${d.level.match(/\d+/)[0]}`:"Default"}catch{return""}},n=d=>d==="1"?"status-verified":"status-not-verified",l=d=>d==="1"?"Verified":"Unverified",s=d=>{if(g.value){g.value=!1;return}c("row-click",d)};return(d,b)=>{const D=$("el-table-column"),L=te,S=j;return x(),F(S,{data:p.data,query:_.query,label:"Customers",onLimitChange:b[0]||(b[0]=y=>c("limit-change",y)),onPageChange:b[1]||(b[1]=y=>c("page-change",y)),onRowClick:s},{default:o(()=>[a(D,{key:"1",label:"#",type:"index",index:u,align:"center",width:"80"}),a(D,{key:"2",label:"name",width:e(w)?190:200},{default:o(y=>[t("div",Te,[t("span",Ce,r(y.row.fullName),1)])]),_:1},8,["width"]),a(D,{key:"3",label:"email",prop:"email"},{default:o(y=>[t("p",Se,r(y.row.email),1)]),_:1}),a(D,{key:"4",label:"Address",prop:"address",width:e(w)?250:300},{default:o(y=>[t("div",Ae,[t("div",$e,r(e(re)(y.row.username,e(w)?8:10)),1),t("div",{class:"cursor h-6 mr-10",onClick:A=>(e(ie)(y.row.username),g.value=!0)},[a(L,{icon:"copy",size:"24",color:"#A19F9D"})],8,ke)])]),_:1},8,["width"]),a(D,{key:"5",label:"level",prop:"level",width:e(w)?120:150},{default:o(y=>[t("span",null,r(v(y.row)),1)]),_:1},8,["width"]),a(D,{key:"6",label:"date",prop:"createdDate",width:"140"},{default:o(y=>[t("p",null,r(e(le)(y.row.createdDate)),1),t("p",Le,r(e(ae)(y.row.createdDate)),1)]),_:1}),a(D,{key:"7",label:"status",prop:"emailVerified",align:"center",width:e(w)?140:160},{default:o(y=>[t("span",{class:ee(n(y.row.emailVerified))},r(l(y.row.emailVerified)),3)]),_:1},8,["width"])]),_:1},8,["data","query"])}}}),Be={class:"flex items-center"},Ie=["src"],Me={class:"pl-2"},Ee={class:"text-base"},Ue={class:"block text-sm text-description"},Fe={class:"text-base"},Ne={class:"block text-sm text-description"},Re={class:"text-base"},Pe={class:"block text-sm text-description"},Ye=E({__name:"BalanceTable",props:{rowData:{default:()=>({})}},setup(_){const c=_,p=ne(),g=h([{value:1,title:"Price"},{value:2,title:"Available amount"},{value:3,title:"Locked amount"},{value:4,title:"Balance amount"}]),w=h(!1),u=h([]),v=h({orderBy:"",search:""});N(()=>{n()});const n=async()=>{try{w.value=!0,u.value=await R.getListBalance(c.rowData.userId,v.value),w.value=!1}catch{w.value=!1}},l=D=>{v.value.orderBy=D.value,n()},s=D=>{v.value.search=D,n()},d=D=>{const L=de(p.listAssetToken,S=>S.currency===D);return L.length?L[0].iconUrl:""},b=D=>{const L=de(p.listAssetToken,S=>S.currency===D);return L.length?L[0].currencyName:""};return(D,L)=>{const S=Z,y=$("el-table-column"),A=j;return x(),k("div",null,[a(S,{"list-sort":e(g),"show-filter":!1,"sort-active":e(v).orderBy,"width-dropdown":210,onSort:l,onSearch:s},null,8,["list-sort","sort-active"]),a(A,{data:e(u),"show-pagination":!1,loading:e(w),class:"p-6 pt-0"},{default:o(()=>[a(y,{label:"#",type:"index",align:"center",width:"40"}),a(y,{label:"Asset",width:"144"},{default:o(m=>[t("div",Be,[t("img",{src:d(m.row.asset),alt:"",class:"w-6"},null,8,Ie),t("span",Me,r(b(m.row.asset)),1)])]),_:1}),a(y,{label:"price",align:"right",width:"160"},{default:o(m=>[t("span",null,"$"+r(e(I)(m.row.price,"USD")),1)]),_:1}),a(y,{label:"available",align:"right",width:"200"},{default:o(m=>[t("span",Ee,r(e(I)(m.row.available,m.row.asset))+" "+r(m.row.asset),1),t("span",Ue,"~$"+r(e(I)(m.row.availableUSD,"USD")),1)]),_:1}),a(y,{label:"locked amount",align:"right",width:"200"},{default:o(m=>[t("span",Fe,r(e(I)(m.row.totalLockedAmount,m.row.asset))+" "+r(m.row.asset),1),t("span",Ne,"~$"+r(e(I)(m.row.totalLockedAmountUSD,"USD")),1)]),_:1}),a(y,{label:"balance",align:"right"},{default:o(m=>[t("span",Re,r(e(I)(m.row.totalBalance,m.row.asset))+" "+r(m.row.asset),1),t("span",Pe,"~$"+r(e(I)(m.row.totalBalanceUSD,"USD")),1)]),_:1})]),_:1},8,["data","loading"])])}}}),Oe={class:"w-full"},qe={class:"text-base"},je={class:"text-sm text-description"},ze=E({__name:"ReferralTable",props:{rowData:{default:()=>({})}},setup(_){const c=_,p=h(null),g=h([{value:"3",title:"Invited date"},{value:"1",title:"Referral name"}]),w=h([{id:0,name:"Sign up",value:"SIGNED_UP"},{id:1,name:"Invited",value:"INVITED"}]),u=h(!1),v=h([]),n=h({orderBy:"",search:"",status:"",fromCreatedAt:"",toCreatedAt:"",page:1,limit:10,total:0});N(()=>{l()});const l=async()=>{try{u.value=!0;const A=await R.getListReferral({...n.value,userId:c.rowData.userId});v.value=A.content,n.value.total=A.totalElements,u.value=!1}catch{u.value=!1}},s=A=>{n.value.orderBy=A.value},d=A=>{n.value.search=A,n.value.page=1,l()},b=()=>{n.value.page=1,l()},D=()=>{n.value={orderBy:"",search:"",status:"",fromCreatedAt:"",toCreatedAt:"",page:1,limit:10,total:0},p.value.search="",l()},L=A=>A==="INVITED"?"status-neutral status":"status-warning status",S=A=>{n.value.page=A,l()},y=A=>{n.value.limit=A,n.value.page=1,l()};return(A,m)=>{const f=$("el-option"),P=$("el-select"),U=$("el-form-item"),M=$("el-date-picker"),z=$("el-form"),Y=Z,C=$("el-table-column"),B=j;return x(),k("div",Oe,[a(Y,{ref_key:"refFilter",ref:p,"list-sort":e(g),"sort-active":e(n).orderBy,"width-dropdown":210,"width-popper":330,onSort:s,onSearch:d,onReset:D,onApply:b},{filter:o(()=>[a(z,{"label-position":"top"},{default:o(()=>[a(U,{label:"Status",class:"w-full"},{default:o(()=>[a(P,{modelValue:e(n).status,"onUpdate:modelValue":m[0]||(m[0]=T=>e(n).status=T),teleported:!1,placeholder:"Status",class:"w-full",clearable:""},{default:o(()=>[(x(!0),k(q,null,J(e(w),(T,G)=>(x(),F(f,{key:G,label:T.name,value:T.value},null,8,["label","value"]))),128))]),_:1},8,["modelValue"])]),_:1}),a(U,{label:"From date",class:"w-full"},{default:o(()=>[a(M,{modelValue:e(n).fromCreatedAt,"onUpdate:modelValue":m[1]||(m[1]=T=>e(n).fromCreatedAt=T),format:"MM/DD/YYYY","value-format":"x",placeholder:"From date",type:"date",class:"!w-full",teleported:!1,"disabled-date":T=>e(H)(T,"from",e(n).toCreatedAt)},null,8,["modelValue","disabled-date"])]),_:1}),a(U,{class:"w-full",label:"To date"},{default:o(()=>[a(M,{modelValue:e(n).toCreatedAt,"onUpdate:modelValue":m[2]||(m[2]=T=>e(n).toCreatedAt=T),format:"MM/DD/YYYY","value-format":"x",placeholder:"To date",type:"date",class:"!w-full",teleported:!1,"disabled-date":T=>e(H)(T,"to",e(n).fromCreatedAt)},null,8,["modelValue","disabled-date"])]),_:1})]),_:1})]),_:1},8,["list-sort","sort-active"]),a(B,{data:e(v),query:e(n),label:"Investor",loading:e(u),class:"p-6 pt-0",onLimitChange:y,onPageChange:S},{default:o(()=>[a(C,{label:"name","class-name":"no-padding-cell"},{default:o(T=>[t("span",null,r(T.row.fullName),1)]),_:1}),a(C,{label:"email",prop:"inviteEmail",width:"260"}),a(C,{label:"tier",prop:"tier",width:"100",align:"center"}),a(C,{label:"date",width:"200"},{default:o(T=>[t("p",qe,r(e(le)(T.row.inviteDate)),1),t("p",je,r(e(ae)(T.row.inviteDate)),1)]),_:1}),a(C,{label:"status",align:"center",width:"120"},{default:o(T=>[T.row.status?(x(),k("span",{key:0,class:ee(L(T.row.status))},r(e(X)(T.row.status)),3)):Q("",!0)]),_:1})]),_:1},8,["data","query","loading"])])}}}),Ge={class:"w-full"},Ke={class:"flex"},He={class:"flex"},We={class:"flex"},Je={class:"flex items-center justify-between"},Qe={class:"d-ib"},Xe=["onClick"],Ze={class:"text-base"},et={class:"text-sm text-description"},tt={key:0,class:"text-increase"},at={class:"block text-sm text-description"},lt=E({__name:"BonusTable",props:{rowData:{default:()=>({})}},setup(_){const c=_,p=h(null),g=h([{value:"1",title:"Created date"},{value:"2",title:"Amount"}]),w=h([{id:0,name:"Sign Up Bonus",value:"BONUS_SIGN_UP"},{id:1,name:"First Transaction Bonus",value:"BONUS_FIRST_TRANS"}]),u=h([{id:0,name:"Pending",value:"PENDING"},{id:1,name:"Paid",value:"PAID"}]),v=h(!1),n=h([]),l=h({orderBy:"",search:"",status:"",transactionType:"",fromAmount:"",toAmount:"",toDate:"",fromDate:"",page:1,limit:10,total:0}),s=W(()=>l.value.limit*(l.value.page-1)+1);N(()=>{d()});const d=async()=>{try{v.value=!0;const m=await R.getListBonus({...l.value,userId:c.rowData.userId});n.value=m.content,l.value.total=m.totalElements,v.value=!1}catch{v.value=!1}},b=m=>{l.value.orderBy=m.value,d()},D=m=>{l.value.search=m,l.value.page=1,d()},L=()=>{l.value.page=1,d()},S=()=>{l.value={orderBy:"",search:"",status:"",transactionType:"",fromAmount:"",toAmount:"",toDate:"",fromDate:"",page:1,limit:10,total:0},p.value.search="",d()},y=m=>{l.value.page=m,d()},A=m=>{l.value.limit=m,l.value.page=1,d()};return(m,f)=>{const P=$("el-option"),U=$("el-select"),M=$("el-form-item"),z=$("el-date-picker"),Y=$("el-input"),C=$("el-form"),B=Z,T=$("el-table-column"),G=te,K=j;return x(),k("div",Ge,[a(B,{ref_key:"refFilter",ref:p,"list-sort":e(g),"sort-active":e(l).orderBy,"width-dropdown":210,"width-popper":520,onSort:b,onSearch:D,onReset:S,onApply:L},{filter:o(()=>[a(C,{"label-position":"top"},{default:o(()=>[t("div",Ke,[a(M,{label:"Transaction type",class:"flex-1 mr-10"},{default:o(()=>[a(U,{modelValue:e(l).transactionType,"onUpdate:modelValue":f[0]||(f[0]=i=>e(l).transactionType=i),teleported:!1,placeholder:"Status",class:"w-full",clearable:""},{default:o(()=>[(x(!0),k(q,null,J(e(w),(i,O)=>(x(),F(P,{key:O,label:i.name,value:i.value},null,8,["label","value"]))),128))]),_:1},8,["modelValue"])]),_:1}),a(M,{label:"Status",class:"flex-1"},{default:o(()=>[a(U,{modelValue:e(l).status,"onUpdate:modelValue":f[1]||(f[1]=i=>e(l).status=i),teleported:!1,placeholder:"Status",class:"w-full",clearable:""},{default:o(()=>[(x(!0),k(q,null,J(e(u),(i,O)=>(x(),F(P,{key:O,label:i.name,value:i.value},null,8,["label","value"]))),128))]),_:1},8,["modelValue"])]),_:1})]),t("div",He,[a(M,{label:"Date",class:"flex-1 mr-10"},{default:o(()=>[a(z,{modelValue:e(l).fromDate,"onUpdate:modelValue":f[2]||(f[2]=i=>e(l).fromDate=i),format:"MM/DD/YYYY","value-format":"x",placeholder:"From date",type:"date",class:"!w-full",teleported:!1,"disabled-date":i=>e(H)(i,"from",e(l).toDate)},null,8,["modelValue","disabled-date"])]),_:1}),a(M,{class:"flex-1 hide-label",label:"To date"},{default:o(()=>[a(z,{modelValue:e(l).toDate,"onUpdate:modelValue":f[3]||(f[3]=i=>e(l).toDate=i),format:"MM/DD/YYYY","value-format":"x",placeholder:"To date",type:"date",class:"!w-full",teleported:!1,"disabled-date":i=>e(H)(i,"to",e(l).fromDate)},null,8,["modelValue","disabled-date"])]),_:1})]),t("div",We,[a(M,{label:"Transaction amount",class:"flex-1 mr-10"},{default:o(()=>[a(Y,{modelValue:e(l).fromAmount,"onUpdate:modelValue":f[4]||(f[4]=i=>e(l).fromAmount=i),placeholder:"From amount",onKeypress:f[5]||(f[5]=i=>e(ce)(i,e(l).fromAmount)),onKeyup:f[6]||(f[6]=i=>e(ue)(i))},null,8,["modelValue"])]),_:1}),a(M,{class:"flex-1 hide-label",label:"To"},{default:o(()=>[a(Y,{modelValue:e(l).toAmount,"onUpdate:modelValue":f[7]||(f[7]=i=>e(l).toAmount=i),placeholder:"To amount",onKeypress:f[8]||(f[8]=i=>e(ce)(i,e(l).toAmount)),onKeyup:f[9]||(f[9]=i=>e(ue)(i))},null,8,["modelValue"])]),_:1})])]),_:1})]),_:1},8,["list-sort","sort-active"]),a(K,{data:e(n),query:e(l),label:"Investor",loading:e(v),class:"p-6 pt-0",onLimitChange:A,onPageChange:y},{default:o(()=>[a(T,{label:"#",index:e(s),type:"index",width:"50"},null,8,["index"]),a(T,{label:"transaction id",width:"280"},{default:o(i=>[t("div",Je,[t("span",Qe,r(e(re)(i.row.transactionCode)),1),t("div",{class:"cursor h-6 mr-8",onClick:O=>e(ie)(i.row.transactionCode)},[a(G,{icon:"copy",size:"24",color:"#A19F9D"})],8,Xe)])]),_:1}),a(T,{label:"type",width:"210"},{default:o(i=>[t("span",null,r(e(X)(i.row.bonusProgramCode)),1)]),_:1}),a(T,{label:"date",width:"180"},{default:o(i=>[t("p",Ze,r(e(le)(i.row.transactionDate)),1),t("p",et,r(e(ae)(i.row.transactionDate)),1)]),_:1}),a(T,{label:"status",align:"center",width:"120"},{default:o(i=>[i.row.status?(x(),k("span",{key:0,class:ee(i.row.status==="PENDING"?"status-pending":"status-success")},r(e(X)(i.row.status)),3)):Q("",!0)]),_:1}),a(T,{label:"amount",align:"right"},{default:o(i=>[i.row.tokenAmount?(x(),k("div",tt,[t("span",null,"+"+r(e(I)(i.row.tokenAmount,i.row.tokenCurrency))+" "+r(i.row.tokenCurrency),1),t("span",at,"~$"+r(e(I)(i.row.tokenAmountToUsd,"USD")),1)])):Q("",!0)]),_:1})]),_:1},8,["data","query","loading"])])}}});function ot(_,c=1){const p=["","K","M","B","T","P","E"];if(!_)return"0";if(_<1e3)return _.toString();const g=Math.log10(Math.abs(_))/3|0,w=p[g],u=Math.pow(10,g*3);return(_/u).toFixed(c)+w}const st={class:"w-full p-6"},nt={class:"grid grid-cols-5 gap-4"},rt={class:"flex justify-between"},it={class:"text-base text-description"},ct={class:"text-[30px] leading-[48px]"},ut=t("p",{class:"text-[18px] font-semibold mb-4 mt-10"},"Transaction Statistics",-1),dt={class:"text-base"},pt={class:"text-base"},_t=E({__name:"StatisticsTable",props:{rowData:{default:()=>({})}},setup(_){const c=_,p=h([{icon:"menu-balance-active",title:"Balance",total:0,color:"#fff"},{icon:"deposit",title:"Total Deposit",total:0,color:"inherit"},{icon:"withdraw",title:"Total Withdraw",total:0,color:"inherit"},{icon:"swap",title:"Total Bet",total:0,color:"#129961"},{icon:"prize",title:"Total Prize",total:0,color:"inherit"}]),g=h([]);N(()=>{w()});const w=async()=>{const v=await R.getStatistics(c.rowData.userId);g.value=v.statistics;const n=v.summary;console.log(n),p.value[0].total=u(n.totalBalance),p.value[1].total=u(n.totalDeposit),p.value[2].total=u(n.totalWithdraw),p.value[3].total=u(n.totalBet),p.value[4].total=u(n.totalBetPrize)},u=v=>v?v<10**6?I(v,"USD"):ot(v):0;return(v,n)=>{const l=te,s=$("el-table-column"),d=j;return x(),k("div",st,[t("div",nt,[(x(!0),k(q,null,J(e(p),(b,D)=>(x(),k("div",{key:D,class:"border border-solid border-[#dbdbdb] rounded-lg p-4"},[t("div",rt,[t("p",it,r(b.title),1),a(l,{icon:b.icon,size:"20",color:b.color},null,8,["icon","color"])]),t("p",ct,"$"+r(b.total),1)]))),128))]),ut,a(d,{data:e(g),"show-pagination":!1},{default:o(()=>[a(s,{label:"#",type:"index",width:"40"}),a(s,{label:"type",width:"200",prop:"transactionType",align:"left"},{default:o(b=>[t("span",null,r(e(X)(b.row.transactionType)),1)]),_:1}),a(s,{label:"num of trans",prop:"numOfTransaction",width:"144",align:"right"},{default:o(b=>[t("span",dt,r(b.row.numOfTransaction<10?"0"+b.row.numOfTransaction:b.row.numOfTransaction),1)]),_:1}),a(s,{label:"total amount",prop:"totalAmount",align:"right"},{default:o(b=>[t("span",pt,"$"+r(e(I)(b.row.totalAmount,"USD")),1)]),_:1}),a(s,{label:"avg trans amount",align:"right",prop:"avgAmount",width:"250"},{default:o(b=>[t("span",null,"$"+r(e(I)(b.row.avgAmount,"USD")),1)]),_:1}),a(s,{label:"last transaction",prop:"lastTransaction",width:"210",align:"center"},{default:o(b=>[t("span",null,r(e(se)(b.row.lastTransaction)),1)]),_:1})]),_:1},8,["data"])])}}}),mt={class:"w-full p-6"},ft={class:"flex justify-between items-center pb-[15px] border-b border-solid border-border-primary"},vt=t("p",{class:"text-base font-semibold"},"2-factor Authentication",-1),ht={key:0,class:"flex items-center"},bt={class:"ml-1 text-base"},wt={class:"flex justify-between items-center py-[15px] border-b border-solid border-border-primary"},gt=t("p",{class:"text-base font-semibold"},"Active status",-1),yt={key:0,class:"flex items-center"},xt={class:"ml-1 text-base"},Dt=E({__name:"SettingTable",props:{rowData:{default:()=>({})}},setup(_){const c=_,p=h({});N(()=>{g()});const g=async()=>{const v=await R.getDetailCustomer({userId:c.rowData.userId});p.value=v.content[0],console.log(v)},w=W(()=>p.value.faType==="SMS"?"verify-phone":p.value.faType==="EMAIL"?"verify-email":"verify-app"),u=W(()=>p.value.faType==="SMS"?"Phone number":p.value.faType==="EMAIL"?"Email":"Authenticator app");return(v,n)=>{const l=te;return x(),k("div",mt,[t("div",ft,[vt,e(p).faType?(x(),k("div",ht,[a(l,{icon:e(w),size:"40"},null,8,["icon"]),t("p",bt,r(e(u)),1)])):Q("",!0)]),t("div",wt,[gt,e(p).userStatus?(x(),k("div",yt,[t("div",{class:ee(["w-2 h-2 rounded-full mr-1",{"bg-[#129961]":e(p).userStatus==="ACTIVE","bg-[#cf202f]":e(p).userStatus==="UNVERIFIED"||e(p).userStatus==="LOCKED"}])},null,2),t("p",xt,r(e(X)(e(p).userStatus)),1)])):Q("",!0)])])}}}),Tt={class:"w-full"},Ct={class:"inline-block"},St={class:"inline-block"},At={class:"inline-block"},$t={class:"text-base"},kt={class:"text-sm text-description"},Lt={class:"text-base"},Vt=E({__name:"DeviceTable",props:{rowData:{default:()=>({})}},setup(_){const c=_,p=h([]);N(()=>{g()});const g=async()=>{try{const w=await R.getListDevice(c.rowData.userId);p.value=w.content}catch(w){console.log(w)}};return(w,u)=>{const v=$("el-table-column"),n=j;return x(),k("div",Tt,[a(n,{data:e(p),"show-pagination":!1,class:"p-6"},{default:o(()=>[a(v,{label:"#",type:"index",width:"50"}),a(v,{label:"device os",width:"220"},{default:o(l=>[t("span",Ct,r(l.row.devicesOsVersion),1)]),_:1}),a(v,{label:"device name"},{default:o(l=>[t("span",St,r(l.row.deviceName),1)]),_:1}),a(v,{label:"app version",width:"130"},{default:o(l=>[t("span",At,r(l.row.appVersion),1)]),_:1}),a(v,{label:"last login",width:"200"},{default:o(l=>[t("p",$t,r(e(le)(l.row.lastLogin)),1),t("p",kt,r(e(ae)(l.row.lastLogin)),1)]),_:1}),a(v,{label:"2fa status",width:"150",align:"center"},{default:o(l=>[t("span",Lt,r(l.row.twoFactorStatus),1)]),_:1})]),_:1},8,["data"])])}}}),Bt={class:"w-full"},It={class:"inline-block"},Mt={class:"inline-block"},Et=E({__name:"SocialTable",props:{rowData:{default:()=>({})}},setup(_){const c=_,p=W(()=>[{social:"Twitter",userName:c.rowData.twitter,socialId:c.rowData.twitter},{social:"Telegram",userName:c.rowData.telegram,socialId:c.rowData.telegramId},{social:"Discord",userName:c.rowData.discord,socialId:c.rowData.discordId}]),g=u=>u?"status-verified":"status-not-verified",w=u=>u?"Verified":"Unverified";return(u,v)=>{const n=$("el-table-column"),l=j;return x(),k("div",Bt,[a(l,{data:e(p),"show-pagination":!1,class:"p-6"},{default:o(()=>[a(n,{label:"#",type:"index",width:"50"}),a(n,{label:"Social"},{default:o(s=>[t("span",It,r(s.row.social),1)]),_:1}),a(n,{label:"User"},{default:o(s=>[t("span",Mt,r(s.row.userName),1)]),_:1}),a(n,{label:"Status",align:"center",width:"160"},{default:o(s=>[t("span",{class:ee(g(s.row.socialId))},r(w(s.row.socialId)),3)]),_:1})]),_:1},8,["data"])])}}}),Ut={class:"w-full"},Ft=E({__name:"TransactionTable",props:{rowData:{default:()=>({})}},setup(_){const c=_,p=ne(),g=h(!1),w=h([]),u=h({page:1,limit:20,total:0,transactionType:"",status:"",fromTransactionDate:"",toTransactionDate:"",fromTransactionAmount:"",toTransactionAmount:"",search:"",orderBy:"1"}),v=h([{title:"Transaction date",value:"1"},{title:"Transaction amount",value:"2"},{title:"Status",value:"3"}]),n=h([]);N(async()=>{await d(),l(),await s()});const l=()=>{u.value.transactionType||(u.value.transactionType=n.value[0].typeName)},s=async()=>{try{const f=await R.getListTransactionCustomer(c.rowData.userId,u.value);console.log(f),w.value=f.content,u.value.total=f.totalElements}catch{g.value=!1,w.value=[]}},d=async()=>{try{const f={module:"transaction"};n.value=await ve.getListTransactionType(f)}catch{n.value=[]}},b=f=>{u.value.page=1,u.value.limit=f,s()},D=f=>{u.value.page=f,s()},L=f=>{u.value.orderBy=f.value,s()},S=f=>{u.value.search=f,s()},y=()=>{m(),p.setOpenPopup(!1,"popup-filter-transaction"),s()},A=f=>{u.value={...u.value,...f.value},p.setOpenPopup(!1,"popup-filter-transaction"),s()},m=()=>{u.value={...u.value,page:1,transactionType:n.value[0].typeName,status:"",fromTransactionDate:"",toTransactionDate:"",fromTransactionAmount:"",toTransactionAmount:"",search:"",orderBy:"1"}};return(f,P)=>{const U=Z;return x(),k("div",Ut,[a(U,{ref:"refFilter","list-sort":e(v),popper:!1,"width-dropdown":"230","popup-name":"popup-filter-transaction","sort-active":e(u).orderBy,onSort:L,onSearch:S},null,8,["list-sort","sort-active"]),a(ye,{class:"table-transaction px-6","is-loading":e(g),data:e(w),query:e(u),module:"CUSTOMER",onLimitChange:b,onPageChange:D},null,8,["is-loading","data","query"]),a(xe,{"list-transaction-type":e(n),"is-show-footer":!0,"transaction-type":e(u).transactionType,module:"CUSTOMER",onReset:y,onApply:A,onSearch:S},null,8,["list-transaction-type","transaction-type"])])}}});const Nt=De(Ft,[["__scopeId","data-v-577192c8"]]),Rt={class:"content pb-6"},Pt={class:"flex mb-6"},Yt={class:"avatar"},Ot=["src"],qt={class:"flex-1 w-full ml-6"},jt={class:"text-[18px] leading-6 font-semibold mb-3"},zt={class:"flex"},Gt={class:"w-[316px] mr-[160px]"},Kt={class:"flex justify-between items-center relative mb-1"},Ht=t("p",{class:"text-xs text-description"},"Referral code:",-1),Wt={class:"text-base"},Jt={class:"flex justify-between items-center relative mb-1"},Qt=t("p",{class:"text-xs text-description"},"Username:",-1),Xt={class:"text-base"},Zt={class:"flex justify-between items-center relative mb-1"},ea=t("p",{class:"text-xs text-description"},"Email:",-1),ta={class:"text-base"},aa={key:0,class:"text-xs text-[#129961] absolute -right-[55px] top-1"},la={class:"w-[316px] mr-[160px]"},oa={class:"flex justify-between items-center relative mb-1"},sa=t("p",{class:"text-xs text-description"},"Level:",-1),na={class:"text-base"},ra={class:"flex justify-between items-center relative mb-1"},ia=t("p",{class:"text-xs text-description"},"Created date:",-1),ca={class:"text-base"},ua={class:"flex justify-between items-center relative mb-1"},da=t("p",{class:"text-xs text-description"},"Last login:",-1),pa={class:"text-base"},_a={class:"rounded shadow-md bg-white"},ma=E({__name:"PopupDetailCustomer",props:{rowData:{default:()=>({})}},setup(_){const c=_,p=h([{title:"Balance",value:"BALANCE"},{title:"Transaction",value:"TRANSACTION"},{title:"Referral",value:"REFERRAL"},{title:"Bonus",value:"BONUS"},{title:"Statistics",value:"STATISTICS"},{title:"Settings",value:"SETTING"},{title:"Devices",value:"DEVICE"},{title:"Social",value:"SOCIAL"}]),g=h("BALANCE"),w=h({BalanceTable:{component:()=>Ye},ReferralTable:{component:()=>ze},BonusTable:{component:()=>lt},StatisticsTable:{component:()=>_t},SettingTable:{component:()=>Dt},DeviceTable:{component:()=>Vt},SocialTable:{component:()=>Et},TransactionTable:{component:()=>Nt}}),u=W(()=>{const s=g.value.toLowerCase(),d=s.charAt(0).toUpperCase()+s.slice(1)+"Table";return w.value[d].component()}),v=s=>{try{return s&&s==="MM"?"MM":s!=="Default"?`Level ${s.match(/\d+/)[0]}`:"Default"}catch{return""}},n=()=>{g.value="BALANCE"},l=s=>{g.value=s.value};return(s,d)=>{const b=te,D=pe,L=fe;return x(),F(L,{name:"popup-detail-customer",width:"1200px",class:"popup-detail-customer","is-show-footer":!1,onOpen:n},{title:o(()=>[he("Customer detail")]),default:o(()=>[t("div",Rt,[t("div",Pt,[t("div",Yt,[_.rowData.avatar?(x(),k("img",{key:0,src:_.rowData.avatar,alt:"",class:"w-20 h-20 object-cover rounded-full"},null,8,Ot)):(x(),F(b,{key:1,icon:"default-avatar",size:"80"}))]),t("div",qt,[t("p",jt,r(_.rowData.fullName),1),t("div",zt,[t("div",Gt,[t("div",Kt,[Ht,t("p",Wt,r(_.rowData.affiliationCode),1)]),t("div",Jt,[Qt,t("p",Xt,r(e(re)(_.rowData.username,7)),1),t("div",{class:"cursor-pointer absolute right-[-34px] h-6",onClick:d[0]||(d[0]=S=>e(ie)(_.rowData.username))},[a(b,{icon:"copy",size:"24",color:"#A19F9D"})])]),t("div",Zt,[ea,t("p",ta,r(_.rowData.email),1),_.rowData.emailVerified==="1"?(x(),k("p",aa,"Verified")):Q("",!0)])]),t("div",la,[t("div",oa,[sa,t("p",na,r(v(_.rowData.level)),1)]),t("div",ra,[ia,t("p",ca,r(e(se)(_.rowData.createdDate)),1)]),t("div",ua,[da,t("p",pa,r(e(se)(_.rowData.lastTimeLogin)),1)])])])])]),t("div",_a,[a(D,{"list-tab":e(p),class:"text-[16px] text-description","tab-active":e(g),onClick:l},null,8,["list-tab","tab-active"]),(x(),F(be(e(u)),{"row-data":c.rowData},null,8,["row-data"]))])])]),_:1})}}});const fa={class:"shadow-md rounded bg-white"},va={class:"flex justify-between"},ha={class:"flex justify-between"},ba={class:"px-6"},Aa=E({__name:"CustomerView",setup(_){const c=ne(),p=we(),g=ge(),w=h([{title:"All Customers",value:"ALL"},{title:"Verified",value:"VERIFIED"}]),u=h([{title:"Created date",value:"1"},{title:"Last login",value:"2"}]),v=h([{title:"All status",value:""},{title:"Verified",value:"VERIFIED"}]),n=h([{title:"Default",value:"DEFAULT"},{title:"Level 1",value:"LEVEL_1"},{title:"Level 2",value:"LEVEL_2"},{title:"Level 3",value:"LEVEL_3"},{title:"Level 4",value:"LEVEL_4"},{title:"Level 5",value:"LEVEL_5"},{title:"MM",value:"MM"}]),l=h("ALL"),s=h({fromCreatedAt:"",toCreatedAt:"",type:"",level:"",orderBy:"1",search:""}),d=h({page:1,limit:20,total:0}),b=h([]),D=h(null),L=h({});N(async()=>{s.value.type=g.params.type==="all"?"":g.params.type.toUpperCase(),l.value=g.params.type.toUpperCase(),await S()});const S=async()=>{try{const C=await R.getListCustomer({...d.value,...s.value});console.log(C),b.value=C.content,d.value.total=C.totalElements}catch{b.value=[]}},y=C=>{l.value=C.value,p.push({params:{type:C.value.toLowerCase()}}),s.value.type=C.value==="ALL"?"":C.value,Y(),S()},A=C=>{s.value.orderBy=C.value,S()},m=C=>{s.value.search=C,S()},f=C=>{d.value.page=C,S()},P=C=>{d.value.limit=C,d.value.page=1,S()},U=C=>{L.value=C,c.setOpenPopup(!0,"popup-detail-customer")},M=()=>{console.log("apply"),d.value.page=1,S()},z=()=>{d.value.page=1,Y(),S()},Y=()=>{d.value={...d.value,page:1},s.value={...s.value,fromCreatedAt:"",toCreatedAt:"",level:"",orderBy:"1",search:""},D.value.search=""};return(C,B)=>{const T=pe,G=$("el-date-picker"),K=$("el-form-item"),i=$("el-option"),O=$("el-select"),_e=$("el-form"),me=Z;return x(),k(q,null,[t("div",fa,[a(T,{"list-tab":e(w),"tab-active":e(l),onClick:y},null,8,["list-tab","tab-active"]),a(me,{ref_key:"refFilter",ref:D,"list-sort":e(u),"width-popper":"518","width-dropdown":"180","sort-active":e(s).orderBy,onSearch:m,onSort:A,onReset:z,onApply:M},{filter:o(()=>[a(_e,{"label-position":"top"},{default:o(()=>[t("div",va,[a(K,{class:"flex-1 mr-10",label:"Created date"},{default:o(()=>[a(G,{modelValue:e(s).fromCreatedAt,"onUpdate:modelValue":B[0]||(B[0]=V=>e(s).fromCreatedAt=V),format:"MM/DD/YYYY","value-format":"x",placeholder:"From date",type:"date",teleported:!1,"disabled-date":V=>e(H)(V,"from",e(s).toCreatedAt)},null,8,["modelValue","disabled-date"])]),_:1}),a(K,{class:"flex-1 hide-label",label:"1"},{default:o(()=>[a(G,{modelValue:e(s).toCreatedAt,"onUpdate:modelValue":B[1]||(B[1]=V=>e(s).toCreatedAt=V),format:"MM/DD/YYYY","value-format":"x",placeholder:"To date",type:"date",teleported:!1,"disabled-date":V=>e(H)(V,"to",e(s).fromCreatedAt)},null,8,["modelValue","disabled-date"])]),_:1})]),t("div",ha,[a(K,{label:"Status",class:"flex-1 mr-10"},{default:o(()=>[a(O,{modelValue:e(s).type,"onUpdate:modelValue":B[2]||(B[2]=V=>e(s).type=V),teleported:!1,placeholder:"Status",class:"w-100",clearable:"",disabled:e(g).params.type==="verified"},{default:o(()=>[(x(!0),k(q,null,J(e(v),(V,oe)=>(x(),F(i,{key:oe,label:V.title,value:V.value},null,8,["label","value"]))),128))]),_:1},8,["modelValue","disabled"])]),_:1}),a(K,{label:"Level",class:"flex-1"},{default:o(()=>[a(O,{modelValue:e(s).level,"onUpdate:modelValue":B[3]||(B[3]=V=>e(s).level=V),placeholder:"Level",clearable:"",teleported:!1},{default:o(()=>[(x(!0),k(q,null,J(e(n),(V,oe)=>(x(),F(i,{key:oe,label:V.title,value:V.value},null,8,["label","value"]))),128))]),_:1},8,["modelValue"])]),_:1})])]),_:1})]),_:1},8,["list-sort","sort-active"]),t("div",ba,[a(Ve,{data:e(b),query:e(d),onLimitChange:P,onPageChange:f,onRowClick:U},null,8,["data","query"])])]),a(ma,{"row-data":e(L)},null,8,["row-data"])],64)}}});export{Aa as default};
