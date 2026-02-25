import{m as f,_ as u,x as j}from"./index-CAmKV1WV.js";const P=`slug: cool-quick
title:
  zh: CoolQuick - 智能剪贴板管理工具
  en: CoolQuick - Intelligent Clipboard Manager
description:
  zh: 跨平台桌面应用，自动捕获和智能分类剪贴板内容，支持多窗口、悬浮窗与数据加密。
  en: Cross-platform desktop app for automatic clipboard capture and smart classification, featuring multi-window support, floating widget, and data encryption.

tags: [Tauri, Rust, React, SQLite, TypeScript]
status: active

links:
  github: https://github.com/easy12138s/cool-quick
  demo: https://github.com/easy12138s/cool-quick/releases

createdAt: 2024-03-20
order: 1
`,b=`slug: demo-project
title:
  zh: 示例项目
  en: Demo Project
description:
  zh: 这是一个展示项目功能的示例
  en: A demo project to showcase features

tags: [Vue, TypeScript, Demo]
status: active
createdAt: 2024-01-15
updatedAt: 2024-06-20
hidden: false
order: 1

links:
  github: https://github.com
  demo: https://example.com
`,v=`slug: vue-dashboard
title:
  zh: Vue Dashboard
  en: Vue Dashboard
description:
  zh: 功能强大的数据仪表盘模板
  en: A powerful data dashboard template

tags: [Vue, TypeScript, Dashboard, Charts]
status: active
createdAt: 2024-03-10
updatedAt: 2024-06-15
hidden: false
order: 2

links:
  github: https://github.com
  demo: https://example.com
`,p=f([]),m=f(!1);function y(){return{projects:p,fetchProjects:async()=>{if(m.value)return;const n=Object.assign({"/content/projects/cool-quick/meta.yml":P,"/content/projects/demo-project/meta.yml":b,"/content/projects/vue-dashboard/meta.yml":v}),r=[];for(const c in n){const i=c.match(/\/content\/projects\/([^/]+)\/meta\.yml/);if(!i)continue;const e=i[1],s=n[c],t=A(s);r.push({slug:e,title:t.title||{zh:e,en:e},description:t.description||{zh:"",en:""},thumbnail:t.thumbnail,tags:t.tags||[],status:t.status||"active",links:t.links,createdAt:t.createdAt||new Date().toISOString().split("T")[0],updatedAt:t.updatedAt,hidden:t.hidden??!1,order:t.order??999})}p.value=r.sort((c,i)=>c.order-i.order),m.value=!0},getProjectBySlug:n=>p.value.find(r=>r.slug===n),getProjectContent:async(n,r)=>{const c=[`/content/projects/${n}/index.${r}.md`,`/content/projects/${n}/index.md`],i=Object.assign({"/content/projects/cool-quick/index.en.md":()=>u(()=>import("./index.en-BoHguC9_.js"),[],import.meta.url).then(e=>e.default),"/content/projects/cool-quick/index.zh.md":()=>u(()=>import("./index.zh-Dd8RfnfI.js"),[],import.meta.url).then(e=>e.default),"/content/projects/demo-project/index.en.md":()=>u(()=>import("./index.en-CoREJmwu.js"),[],import.meta.url).then(e=>e.default),"/content/projects/demo-project/index.zh.md":()=>u(()=>import("./index.zh-Cjra5e6n.js"),[],import.meta.url).then(e=>e.default),"/content/projects/vue-dashboard/index.zh.md":()=>u(()=>import("./index.zh-BQvr_6VF.js"),[],import.meta.url).then(e=>e.default)});for(const e of c)if(i[e])return await i[e]();return""},getProjectHasVuePage:async n=>{const r=Object.assign({}),c=`/content/projects/${n}/page.vue`;return!!r[c]},loaded:m}}function A(a){const o={},l=a.split(`
`);for(const d of l){const n=d.replace(/\t/g,"  "),r=n.search(/\S/);if(r<0||n.trim().startsWith("#"))continue;const i=n.trim().startsWith("-")?n.trim().slice(1).trim():n,e=i.indexOf(":");if(e===-1)continue;const s=i.slice(0,e).trim(),t=i.slice(e+1).trim(),g=Math.floor(r/2);g===0?t===""||t==="|"?o[s]=s==="links"?{}:{zh:"",en:""}:t.startsWith("[")?o[s]=_(t):o[s]=h(t):g===1&&(o[s]||(o[s]=s==="links"?{}:{zh:"",en:""}),t===""||t==="|"||(t.startsWith("[")?o[s]=_(t):o[s]=h(t)))}return o}function h(a){return a?a==="true"?!0:a==="false"?!1:a.replace(/^["']|["']$/g,""):""}function _(a){const o=a.slice(1,-1).trim();return o?o.split(",").map(l=>l.trim().replace(/^["']|["']$/g,"")):[]}const z=j("projects",()=>{const{projects:a,fetchProjects:o,getProjectBySlug:l,getProjectContent:d,getProjectHasVuePage:n,loaded:r}=y(),c=f(!1);return{projects:a,loading:c,loadProjects:async()=>{c.value=!0,await o(),c.value=!1},fetchProjects:o,getProjectBySlug:l,getProjectContent:d,getProjectHasVuePage:n,loaded:r}});export{z as u};
