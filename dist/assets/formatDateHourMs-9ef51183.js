function g(e){if(!e)return"";const t=new Date(e);return(t.getMonth()<9?"0"+(t.getMonth()+1):t.getMonth()+1)+"/"+(t.getDate()<10?"0"+t.getDate():t.getDate())+"/"+t.getFullYear()+" "+(t.getHours()<10?"0"+t.getHours():t.getHours())+":"+(t.getMinutes()<10?"0"+t.getMinutes():t.getMinutes())+":"+(t.getSeconds()<10?"0"+t.getSeconds():t.getSeconds())}export{g as u};
