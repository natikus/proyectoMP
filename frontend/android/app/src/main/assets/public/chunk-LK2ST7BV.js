import{d as a,e as c}from"./chunk-F25JKKOW.js";import"./chunk-G3CV3VGG.js";import{d as r,e as s}from"./chunk-QYULWRQI.js";import{a as i}from"./chunk-KEIDFBYO.js";import{e as n}from"./chunk-JHI3MBHO.js";var h=()=>{let e=window;e.addEventListener("statusTap",()=>{r(()=>{let m=e.innerWidth,d=e.innerHeight,o=document.elementFromPoint(m/2,d/2);if(!o)return;let t=a(o);t&&new Promise(l=>i(t,l)).then(()=>{s(()=>n(void 0,null,function*(){t.style.setProperty("--overflow","hidden"),yield c(t,300),t.style.removeProperty("--overflow")}))})})})};export{h as startStatusTap};