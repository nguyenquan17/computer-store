import{B as T}from"./BaseButton-33246e43.js";import{_ as Q}from"./BaseTable.vue_vue_type_script_setup_true_lang-84a05ae3.js";import{_ as W,a as z}from"./PopupPaymentDetail.vue_vue_type_script_setup_true_lang-28c42d6c.js";import{f as D,g as R,r as w,j as x,o as j,k as G,w as d,e as C,a as e,b as i,l as s,E as J,h as F,z as X,ad as k,i as V,c as q,a0 as H,t as y,ae as Z,M as K,p as Y,m as ee}from"./index-5ca1291a.js";import{_ as te}from"./BasePopup.vue_vue_type_script_setup_true_lang-3db24631.js";import{u as ne}from"./onlyNumber-646d122a.js";import{_ as B}from"./_plugin-vue_export-helper-c27b6911.js";import{u as M}from"./index-83bd10f7.js";import{u as L}from"./formatNumber-0d110035.js";import"./EmptyBlock.vue_vue_type_script_setup_true_lang-d633231f.js";import"./BaseIcon-aa053859.js";const oe=D({__name:"PopupShippingInfo",props:{propsForm:{default:()=>({})}},emits:["form-shipping"],setup(u,{emit:o}){const r=u,n=R(),t=w({consigneeName:"",consigneePhoneNumber:"",deliveryAddress:""}),c=w(),S=w({consigneeName:[{required:!0,message:"Vui lòng nhập họ và tên",trigger:"blur"}],consigneePhoneNumber:[{required:!0,message:"Vui lòng nhập số điện thoại",trigger:"blur"}],deliveryAddress:[{required:!0,message:"Vui lòng nhập địa chỉ",trigger:"blur"}]}),g=()=>{t.value={...r.propsForm}},N=()=>{h()},P=async v=>{v&&await v.validate((l,_)=>{l?(o("form-shipping",t.value),J.success({message:"Cập nhật thông tin thành công",duration:5e3}),n.setOpenPopup(!1,"popup-shipping-info")):console.log("error submit!",_)})},h=()=>{c.value.clearValidate(),n.setOpenPopup(!1,"popup-shipping-info")};return(v,l)=>{const _=x("el-input"),a=x("el-form-item"),m=T,f=x("el-form"),E=te;return j(),G(E,{"is-show-footer":!1,class:"popup-shipping-info",name:"popup-shipping-info",width:"600px",onClose:N,onOpen:g},{title:d(()=>[C("Chỉnh sửa thông tin nhận hàng")]),default:d(()=>[e("div",null,[i(f,{ref_key:"ruleFormRef",ref:c,model:s(t),rules:s(S),"label-position":"top"},{default:d(()=>[i(a,{label:"Họ và tên",prop:"consigneeName"},{default:d(()=>[i(_,{modelValue:s(t).consigneeName,"onUpdate:modelValue":l[0]||(l[0]=p=>s(t).consigneeName=p)},null,8,["modelValue"])]),_:1}),i(a,{label:"Số điện thoại",prop:"consigneePhoneNumber"},{default:d(()=>[i(_,{modelValue:s(t).consigneePhoneNumber,"onUpdate:modelValue":l[1]||(l[1]=p=>s(t).consigneePhoneNumber=p),onKeypress:l[2]||(l[2]=p=>s(ne)(p,s(t).consigneePhoneNumber))},null,8,["modelValue"])]),_:1}),i(a,{label:"Địa chỉ nhận hàng",prop:"deliveryAddress"},{default:d(()=>[i(_,{modelValue:s(t).deliveryAddress,"onUpdate:modelValue":l[3]||(l[3]=p=>s(t).deliveryAddress=p),type:"textarea"},null,8,["modelValue"])]),_:1}),i(a,{class:"wrap-btn"},{default:d(()=>[i(m,{class:"mr-4",type:"plain",onClick:l[4]||(l[4]=p=>h(s(c)))},{default:d(()=>[C("Hủy bỏ")]),_:1}),i(m,{type:"primary",onClick:l[5]||(l[5]=p=>P(s(c)))},{default:d(()=>[C(" Xác nhận ")]),_:1})]),_:1})]),_:1},8,["model","rules"])])]),_:1})}}});const se=B(oe,[["__scopeId","data-v-299151bc"]]);var O="https://js.stripe.com/v3",re=/^https:\/\/js\.stripe\.com\/v3\/?(\?.*)?$/,A="loadStripe.setLoadParameters was called but an existing Stripe.js script already exists in the document; existing script parameters will be used",ae=function(){for(var o=document.querySelectorAll('script[src^="'.concat(O,'"]')),r=0;r<o.length;r++){var n=o[r];if(re.test(n.src))return n}return null},ie=function(o){var r=o&&!o.advancedFraudSignals?"?advancedFraudSignals=false":"",n=document.createElement("script");n.src="".concat(O).concat(r);var t=document.head||document.body;if(!t)throw new Error("Expected document.body not to be null. Stripe.js requires a <body> element.");return t.appendChild(n),n},le=function(o,r){!o||!o._registerWrapper||o._registerWrapper({name:"stripe-js",version:"1.54.0",startTime:r})},I=null,ce=function(o){return I!==null||(I=new Promise(function(r,n){if(typeof window>"u"||typeof document>"u"){r(null);return}if(window.Stripe&&o&&console.warn(A),window.Stripe){r(window.Stripe);return}try{var t=ae();t&&o?console.warn(A):t||(t=ie(o)),t.addEventListener("load",function(){window.Stripe?r(window.Stripe):n(new Error("Stripe.js not available"))}),t.addEventListener("error",function(){n(new Error("Failed to load Stripe.js"))})}catch(c){n(c);return}})),I},de=function(o,r,n){if(o===null)return null;var t=o.apply(void 0,r);return le(t,n),t},U=Promise.resolve().then(function(){return ce(null)}),$=!1;U.catch(function(u){$||console.warn(u)});var ue=function(){for(var o=arguments.length,r=new Array(o),n=0;n<o;n++)r[n]=arguments[n];$=!0;var t=Date.now();return U.then(function(c){return de(c,r,t)})};const pe=D({__name:"CheckoutStripe",props:{formCardShippingInfo:{default:()=>({})}},setup(u){const o=u,r=F(),n=M(),t=ue("pk_test_51NBEtDGbLaki56uH8dbAEZJtpiUJ3E2DuqskReMLFNeWtuXDZMnDoQAhJrP9tJNQVo0LTglgwecDbkOMx45BSR7q00vM8QLRMv"),c=w(null);t.then(a=>{console.log(a),c.value=a,console.log(c.value)}),w([]);const S=w({}),g=w(!1);X(()=>{N()});const N=async()=>{try{const a=await k.getExchangeRate();S.value=a.data,console.log(S.value)}catch(a){console.log(a)}},P=V(()=>S.value.VND.value||23e3),h=V(()=>{var a,m;if((a=n.detailCart)!=null&&a.cartItemDetailList.length)return(m=n.detailCart)==null?void 0:m.cartItemDetailList.map(f=>({clientId:r.user.userId,productName:f.productName,imageProduct:f.productImage[0],quantity:f.itemQuantity,amount:f.totalPricePerProduct/P.value,currency:"USD"}))}),v=async()=>{try{g.value=!0;const a={cartId:n.detailCart.cartId,clientId:r.user.userId,consigneeName:o.formCardShippingInfo.consigneeName,consigneePhoneNumber:o.formCardShippingInfo.consigneePhoneNumber,deliveryAddress:o.formCardShippingInfo.deliveryAddress},f=(await k.createOrder(a)).data.toString();await l(f),g.value=!1}catch(a){g.value=!1,console.log(a)}},l=async a=>{try{g.value=!0;const m=await k.createCheckoutSession(h.value,a);c.value.redirectToCheckout({sessionId:m.id}),g.value=!1}catch(m){g.value=!1,console.log(m)}},_=async()=>{try{await v()}catch(a){console.error(a)}};return(a,m)=>{const f=T;return j(),q("div",null,[i(f,{loading:s(g),class:"mb-4",onClick:_},{default:d(()=>[C("Thanh toán")]),_:1},8,["loading"])])}}}),b=u=>(Y("data-v-c98a2a72"),u=u(),ee(),u),me={class:"m-auto max-w-[1232px] px-8 py-8"},he=b(()=>e("div",{class:"mr-4 w-[66.67%]"},[e("h1",{class:"mb-4 text-2xl font-bold"},"Thanh toán")],-1)),_e={class:"flex w-full"},fe={class:"block-left mr-4 w-[66.67%] rounded bg-white px-4 py-4"},ge={class:"mb-4"},ve=b(()=>e("div",{class:"flex items-center justify-between"},[e("h1",{class:"mb-4 text-sm font-bold"},"Thông tin nhận hàng")],-1)),be={class:"block-right flex w-[48%] flex-wrap rounded bg-white"},we={class:"flex h-auto min-h-[120px] w-[100%] flex-auto flex-col rounded border border-solid border-[#eaeaea] p-[20px] text-sm"},Se={class:"flex items-center justify-between font-bold"},ye={class:"pr-2"},xe={class:"mb-4"},Pe=b(()=>e("h1",{class:"mb-4 text-sm font-bold"},"Thông tin đơn hàng",-1)),Ne={class:"flex items-center"},Ce=["src"],Ie={class:"ml-4"},Ve={class:"text-sm font-medium"},Ee=b(()=>e("div",{class:"flex items-center justify-between"},[e("h1",{class:"mb-4 text-sm font-bold"},"Phương thức thanh toán")],-1)),ke=b(()=>e("div",{class:"mr-4 text-sm font-bold"},"Thanh toán qua",-1)),Le=b(()=>e("img",{alt:"",height:"50",src:z,width:"100"},null,-1)),Te=b(()=>e("div",{class:"mr-4 text-sm font-bold"},"Thanh toán khi nhận hàng",-1)),De={class:"block-right max-h-[350px] w-[33.33%] rounded bg-white"},je={class:"px-6 py-6"},Ae=b(()=>e("div",{class:"mb-4 text-base font-bold"},"Thanh toán",-1)),Re={class:"mb-1 flex justify-between"},Fe=b(()=>e("h3",null,"Tổng tạm tính",-1)),qe={class:"font-bold"},Be=b(()=>e("div",{class:"mb-1 flex justify-between"},[e("h3",null,"Phí vận chuyển"),e("span",null,"Miễn phí")],-1)),Me={class:"mb-12 flex justify-between"},Oe=b(()=>e("h3",null,"Thành tiền",-1)),Ue={class:"font-bold"},$e=D({__name:"CheckoutView",setup(u){const o=R(),r=F(),n=M(),t=w("1"),c=w({consigneeName:r.user.fullName,consigneePhoneNumber:r.user.phoneNumber,deliveryAddress:r.user.address}),S=()=>{o.setOpenPopup(!0,"popup-shipping-info")},g=h=>{c.value={...h}},N=V(()=>{var h;return(h=n.detailCart)!=null&&h.cartItemDetailList?n.detailCart.cartItemDetailList:[]}),P=V(()=>{var v;let h=0;return H((v=n.detailCart)==null?void 0:v.cartItemDetailList,l=>{h+=l.totalPricePerProduct}),h});return(h,v)=>{const l=x("el-icon"),_=x("el-table-column"),a=Q,m=x("el-radio"),f=x("el-radio-group"),E=T;return j(),q("div",me,[he,e("div",_e,[e("div",fe,[e("div",ge,[ve,e("div",be,[e("div",we,[e("div",Se,[e("h1",ye,y(s(c).consigneeName),1),i(l,{class:"cursor-pointer",size:"20",onClick:S},{default:d(()=>[i(s(Z))]),_:1})]),e("div",null,y(s(c).consigneePhoneNumber),1),e("div",null,y(s(c).deliveryAddress),1)])])]),e("div",xe,[Pe,i(a,{data:s(N),loading:!1,query:{},showPagination:!1,label:"sản phẩm"},{default:d(()=>[i(_,{index:1,align:"center",label:"#",type:"index",width:"80"}),i(_,{align:"left",label:"Tên sản phẩm",prop:"name"},{default:d(p=>[e("div",Ne,[e("img",{src:p.row.productImage,alt:"",height:"60",width:"60"},null,8,Ce),e("p",Ie,y(p.row.productName),1)])]),_:1}),i(_,{align:"right",label:"Số lượng",prop:"itemQuantity",width:"150"}),i(_,{align:"right",label:"Đơn giá",prop:"totalPricePerProduct",width:"150"},{default:d(p=>[e("div",Ve,y(s(L)(p.row.totalPricePerProduct))+"đ",1)]),_:1})]),_:1},8,["data"])]),e("div",null,[Ee,e("div",null,[i(f,{modelValue:s(t),"onUpdate:modelValue":v[0]||(v[0]=p=>K(t)?t.value=p:null),class:"flex w-full justify-between"},{default:d(()=>[i(m,{border:"",class:"!mr-[0] flex !h-[90px] w-[48%]",label:"1",size:"large"},{default:d(()=>[ke,Le]),_:1}),i(m,{border:"",class:"!h-[90px] w-[48%]",label:"2",size:"large"},{default:d(()=>[Te]),_:1})]),_:1},8,["modelValue"])])])]),e("div",De,[e("div",je,[Ae,e("div",Re,[Fe,e("span",qe,y(s(L)(s(P)))+"₫",1)]),Be,e("div",Me,[Oe,e("span",Ue,y(s(L)(s(P)))+"₫",1)]),i(pe,{"form-card-shipping-info":s(c)},null,8,["form-card-shipping-info"]),i(E,{type:"plain"},{default:d(()=>[C("Trở lại mua hàng")]),_:1})])])]),i(se,{"props-form":s(c),onFormShipping:g},null,8,["props-form"]),i(W)])}}});const tt=B($e,[["__scopeId","data-v-c98a2a72"]]);export{tt as default};
