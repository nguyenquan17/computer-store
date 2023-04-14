import{_ as Y,d as q,u as C,b as N,c as S}from"./formatNumberInput-43cf38af.js";import{a as L}from"./BaseIcon-b94d5d09.js";import{u as F,a as j,b as U}from"./capitalizeLetter-3789e05e.js";import{d as I,r as V,g as B,o as d,y as w,w as l,j as b,b as r,a as s,i as t,c as _,t as i,n as z,z as $,q as G,D as E,F as R}from"./index-ecb8c6bc.js";import{_ as K}from"./BasePopup.vue_vue_type_script_setup_true_lang-9e94567c.js";import{u as O}from"./disableTime-86bbdf7c.js";const H={class:"flex"},J={key:0,class:"mr-4 !w-[170px]"},W={key:1,class:"mr-4 w-[210px]"},Q=["onClick"],X={class:"text-sm text-[#5b616e]"},Z={class:"text-sm font-normal text-[#5b616e]"},tt={key:0},et={key:0,class:"text-increase"},at={class:"text-sm text-description"},ot={key:1,class:"text-decrease"},nt={class:"text-sm text-description"},st={key:1},lt={class:"text-sm text-[#5b616e]"},Tt=I({__name:"TableTransaction",props:{data:{default:()=>[]},query:{default:()=>({page:1,limit:20,total:0})},isLoading:{type:Boolean,default:()=>!1},module:{default:"TRANSACTION"}},emits:["page-change","limit-change","row-click"],setup(c,{emit:y}){const T=c,n=V(!1),f=B(()=>window.innerWidth<1400),h=u=>u?u.indexOf("+")!==-1?"text-[#129961]":"text-[#cf202f]":"",g=u=>(T.query.page-1)*T.query.limit+u+1,k=u=>u==="PENDING"?"status status-pending":u==="FAILED"?"status status-error":u==="PROCESSING"?"status status-warning":u==="REJECTED"?"status status-rejected":"status status-success",v=u=>{if(n.value){n.value=!1;return}y("row-click",u)};return(u,o)=>{const m=b("el-table-column"),x=L,p=Y;return d(),w(p,{loading:c.isLoading,data:c.data,query:c.query,label:c.data.length>1?"transactions":"transaction",onLimitChange:o[0]||(o[0]=e=>y("limit-change",e)),onPageChange:o[1]||(o[1]=e=>y("page-change",e)),onRowClick:v},{default:l(()=>[r(m,{key:"1",label:"#",type:"index",index:g,align:"center",width:"80"}),r(m,{key:"2",label:"transaction id","class-name":"column-tx",width:t(f)?260:"","min-width":"260"},{default:l(e=>[s("div",null,[s("div",H,[t(f)?(d(),_("span",J,i(t(F)(e.row.transactionCode,8)),1)):(d(),_("span",W,i(t(F)(e.row.transactionCode,10)),1)),s("span",{onClick:D=>(t(j)(e.row.transactionCode),n.value=!0)},[r(x,{icon:"icon-copy",size:"24",color:"#A19F9D"})],8,Q)]),s("p",X,i(t(q)(e.row.transactionMillisecond)),1)])]),_:1},8,["width"]),r(m,{key:"3",label:"type",width:c.module==="CUSTOMER"?200:t(f)?130:180},{default:l(e=>[s("span",null,i(t(U)(e.row.transactionType)),1)]),_:1},8,["width"]),c.module==="TRANSACTION"?(d(),w(m,{key:"6",label:"customer",width:t(f)?180:250},{default:l(e=>[s("div",null,[s("p",null,i(e.row.fullName),1),s("p",Z,i(e.row.email),1)])]),_:1},8,["width"])):z("",!0),r(m,{key:"7",label:"status",align:"center",width:t(f)?120:140},{default:l(e=>[s("span",{class:$(k(e.row.status))},i(t(U)(e.row.status)),3)]),_:1},8,["width"]),r(m,{key:"8",label:"amount",align:"right",width:t(f)?"":240},{default:l(e=>[c.module==="CUSTOMER"?(d(),_("div",tt,[e.row.creditAmount?(d(),_("div",et,[s("p",null,"+"+i(t(C)(e.row.transactionAmount,e.row.creditCurrency))+" "+i(e.row.creditCurrency),1),s("p",at,"~$"+i(t(C)(e.row.transactionAmountToUsd,"USD")),1)])):(d(),_("div",ot,[s("p",null,"-"+i(t(C)(e.row.transactionAmount,e.row.debitCurrency))+" "+i(e.row.debitCurrency),1),s("p",nt,"~$"+i(t(C)(e.row.transactionAmountToUsd,"USD")),1)]))])):(d(),_("div",st,[s("p",{class:$(h(e.row.amountDisplay))},i(e.row.amountDisplay),3),s("p",lt,"~$"+i(e.row.amountToUsd.toFixed(2)),1)]))]),_:1},8,["width"])]),_:1},8,["loading","data","query","label"])}}}),rt={class:"flex justify-between"},it={class:"flex justify-between"},ut={class:"flex justify-between"},dt=s("div",{class:"text-base text-[#0a0b0d]"},"$",-1),ct=s("div",{class:"text-base text-[#0a0b0d]"},"$",-1),wt=I({__name:"PopupFilterTransaction",props:{listTransactionType:{default:()=>[]},transactionType:{default:""},module:{default:"TRANSACTION"}},emits:["reset","apply"],setup(c,{emit:y}){const T=c,n=V({fromTransactionDate:"",toTransactionDate:"",fromTransactionAmount:"",toTransactionAmount:"",status:"",transactionType:""}),f=()=>{n.value.transactionType=T.transactionType},h=V([{title:"Pending",value:"PENDING"},{title:"Processing",value:"PROCESSING"},{title:"Success",value:"SUCCESS"}]),g=()=>{n.value={transactionType:"",status:"",fromTransactionDate:"",toTransactionDate:"",fromTransactionAmount:"",toTransactionAmount:""}},k=()=>{g(),y("reset")},v=()=>{y("apply",n)};return(u,o)=>{const m=b("el-option"),x=b("el-select"),p=b("el-form-item"),e=b("el-date-picker"),D=b("el-input"),M=b("el-form"),P=K;return d(),w(P,{name:"popup-filter-transaction",width:"600px",class:"popup-filter-transaction","is-show-footer":!1,onOpen:f},{title:l(()=>[G("Filter")]),footer:l(()=>[s("button",{class:"border border-solid border-[#d2d0ce] w-[120px] rounded-lg mr-[15px] font-normal text-sm h-10 text-[#3b3a39]",onClick:k}," Reset "),s("button",{class:"border border-solid border-[#d2d0ce] w-[120px] rounded-lg font-normal text-sm h-10 text-[#fff] bg-[#0151fc]",onClick:v}," Continue ")]),default:l(()=>[r(M,{"label-position":"top"},{default:l(()=>[s("div",rt,[r(p,{class:"flex-1 mr-10",label:"Transaction Type"},{default:l(()=>[r(x,{modelValue:t(n).transactionType,"onUpdate:modelValue":o[0]||(o[0]=a=>t(n).transactionType=a),class:"w-full"},{default:l(()=>[(d(!0),_(R,null,E(T.listTransactionType,(a,A)=>(d(),w(m,{key:A,label:a.displayName,value:a.typeName},null,8,["label","value"]))),128))]),_:1},8,["modelValue"])]),_:1}),r(p,{class:"flex-1",label:"Status"},{default:l(()=>[r(x,{modelValue:t(n).status,"onUpdate:modelValue":o[1]||(o[1]=a=>t(n).status=a),clearable:!0,class:"w-full"},{default:l(()=>[(d(!0),_(R,null,E(t(h),(a,A)=>(d(),w(m,{key:A,label:a.title,value:a.value},null,8,["label","value"]))),128))]),_:1},8,["modelValue"])]),_:1})]),s("div",it,[r(p,{class:"flex-1 mr-10",label:"Transaction Date"},{default:l(()=>[r(e,{modelValue:t(n).fromTransactionDate,"onUpdate:modelValue":o[2]||(o[2]=a=>t(n).fromTransactionDate=a),class:"!w-full",format:"MM/DD/YYYY","value-format":"x",placeholder:"From date",type:"date","disabled-date":a=>t(O)(a,"from",t(n).toTransactionDate)},null,8,["modelValue","disabled-date"])]),_:1}),r(p,{class:"flex-1 hide-label",label:"1"},{default:l(()=>[r(e,{modelValue:t(n).toTransactionDate,"onUpdate:modelValue":o[3]||(o[3]=a=>t(n).toTransactionDate=a),class:"!w-full",format:"MM/DD/YYYY","value-format":"x",placeholder:"To date",type:"date","disabled-date":a=>t(O)(a,"to",t(n).fromTransactionDate)},null,8,["modelValue","disabled-date"])]),_:1})]),s("div",ut,[r(p,{class:"flex-1 mr-10",label:"Transaction Amount"},{default:l(()=>[r(D,{modelValue:t(n).fromTransactionAmount,"onUpdate:modelValue":o[4]||(o[4]=a=>t(n).fromTransactionAmount=a),placeholder:"From amount",onKeypress:o[5]||(o[5]=a=>t(N)(a,t(n).fromTransactionAmount)),onKeyup:o[6]||(o[6]=a=>t(S)(a))},{prefix:l(()=>[dt]),_:1},8,["modelValue"])]),_:1}),r(p,{class:"flex-1 hide-label",label:"1"},{default:l(()=>[r(D,{modelValue:t(n).toTransactionAmount,"onUpdate:modelValue":o[7]||(o[7]=a=>t(n).toTransactionAmount=a),placeholder:"To amount",onKeypress:o[8]||(o[8]=a=>t(N)(a,t(n).toTransactionAmount)),onKeyup:o[9]||(o[9]=a=>t(S)(a))},{prefix:l(()=>[ct]),_:1},8,["modelValue"])]),_:1})])]),_:1})]),_:1})}}});export{Tt as _,wt as a};
