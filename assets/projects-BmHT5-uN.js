import{m as f,_ as u,x as _}from"./index-D_bvfKlR.js";const P=`slug: demo-project
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
`,p=f([]),m=f(!1);function b(){return{projects:p,fetchProjects:async()=>{if(m.value)return;const e=Object.assign({"/content/projects/demo-project/meta.yml":P,"/content/projects/vue-dashboard/meta.yml":v}),r=[];for(const c in e){const a=c.match(/\/content\/projects\/([^/]+)\/meta\.yml/);if(!a)continue;const o=a[1],s=e[c],t=y(s);r.push({slug:o,title:t.title||{zh:o,en:o},description:t.description||{zh:"",en:""},thumbnail:t.thumbnail,tags:t.tags||[],status:t.status||"active",links:t.links,createdAt:t.createdAt||new Date().toISOString().split("T")[0],updatedAt:t.updatedAt,hidden:t.hidden??!1,order:t.order??999})}p.value=r.sort((c,a)=>c.order-a.order),m.value=!0},getProjectBySlug:e=>p.value.find(r=>r.slug===e),getProjectContent:async(e,r)=>{const c=[`/content/projects/${e}/index.${r}.md`,`/content/projects/${e}/index.md`],a=Object.assign({"/content/projects/demo-project/index.en.md":()=>u(()=>import("./index.en-CoREJmwu.js"),[],import.meta.url).then(o=>o.default),"/content/projects/demo-project/index.zh.md":()=>u(()=>import("./index.zh-Cjra5e6n.js"),[],import.meta.url).then(o=>o.default),"/content/projects/vue-dashboard/index.zh.md":()=>u(()=>import("./index.zh-BQvr_6VF.js"),[],import.meta.url).then(o=>o.default)});for(const o of c)if(a[o])return await a[o]();return""},getProjectHasVuePage:async e=>{const r=Object.assign({}),c=`/content/projects/${e}/page.vue`;return!!r[c]},loaded:m}}function y(i){const n={},d=i.split(`
`);for(const l of d){const e=l.replace(/\t/g,"  "),r=e.search(/\S/);if(r<0||e.trim().startsWith("#"))continue;const a=e.trim().startsWith("-")?e.trim().slice(1).trim():e,o=a.indexOf(":");if(o===-1)continue;const s=a.slice(0,o).trim(),t=a.slice(o+1).trim(),j=Math.floor(r/2);j===0?t===""||t==="|"?n[s]=s==="links"?{}:{zh:"",en:""}:t.startsWith("[")?n[s]=g(t):n[s]=h(t):j===1&&(n[s]||(n[s]=s==="links"?{}:{zh:"",en:""}),t===""||t==="|"||(t.startsWith("[")?n[s]=g(t):n[s]=h(t)))}return n}function h(i){return i?i==="true"?!0:i==="false"?!1:i.replace(/^["']|["']$/g,""):""}function g(i){const n=i.slice(1,-1).trim();return n?n.split(",").map(d=>d.trim().replace(/^["']|["']$/g,"")):[]}const x=_("projects",()=>{const{projects:i,fetchProjects:n,getProjectBySlug:d,getProjectContent:l,getProjectHasVuePage:e,loaded:r}=b(),c=f(!1);return{projects:i,loading:c,loadProjects:async()=>{c.value=!0,await n(),c.value=!1},fetchProjects:n,getProjectBySlug:d,getProjectContent:l,getProjectHasVuePage:e,loaded:r}});export{x as u};
