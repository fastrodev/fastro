import { assert, assertEquals, assertExists } from "./deps.ts";
import fastro from "../../mod.ts";
import hello from "../../app/hello.page.tsx";
import dear from "../../app/dear.page.tsx";
import { layout } from "../../app/app.layout.tsx";
const host = "http://localhost:8000";

Deno.test(
  {
    permissions: { net: true, env: true, read: true, write: true, run: true },
    name: "SSR",
    async fn() {
      const f = new fastro();
      f.page("/", {
        component: hello,
        layout,
        folder: "app",
        handler: (req, ctx) => {
          return ctx.render({ title: "halaman page", data: "okeee page" });
        },
      }, (req, ctx) => {
        req.page = "page";
        return ctx.next();
      });

      f.page("/page", {
        component: <h1>Hello</h1>,
        layout,
        folder: "app",
        handler: (req, ctx) => {
          return ctx.render({ title: "halaman page", data: "okeee page" });
        },
      }, (req, ctx) => {
        req.page = "page";
        return ctx.next();
      });

      f.get("/hello", (req, ctx) => {
        return ctx.render(<h1>Hello</h1>);
      });

      await f.serve();

      const get = await fetch(host, { method: "GET" });
      const html = await get.text();
      assertEquals(
        html,
        `<!DOCTYPE html><html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1.0"/><title>halaman page</title><link href="/styles.css" rel="stylesheet"/></head><body id="root"><p class="font-extralight">hello bro okeee page</p></body><script src="/js/hello.js" async></script></html>`,
      );

      const helloFetch = await fetch(host + "/hello", { method: "GET" });
      const helloFetchHtml = await helloFetch.text();
      assertEquals(
        helloFetchHtml,
        `<h1>Hello</h1>`,
      );

      const page = await fetch(host + "/page", { method: "GET" });
      const pageHtml = await page.text();
      assertEquals(
        pageHtml,
        `<!DOCTYPE html><html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1.0"/><title>halaman page</title><link href="/styles.css" rel="stylesheet"/></head><body id="root"><h1>Hello</h1></body></html>`,
      );

      await f.shutdown();
    },
    sanitizeResources: false,
    sanitizeOps: false,
    sanitizeExit: false,
  },
);

Deno.test(
  {
    permissions: { net: true, env: true, read: true, write: true, run: true },
    name: "params",
    async fn() {
      Deno.env.set("ENV", "DEVELOPMENT");

      const f = new fastro();

      f.get("/user/:id", (req, ctx) => {
        return Response.json({ data: req.params?.id });
      });

      f.page("/profile/:user", {
        component: dear,
        layout,
        folder: "app",
        handler: (req, ctx) => {
          console.log(req.oke);
          return ctx.render({
            title: "halaman profile",
            data: "profilemu",
            user: req.params?.user,
          });
        },
      }, (req, ctx) => {
        console.log("params", req.params?.user);
        return ctx.next();
      });

      await f.serve();

      const helloFetch = await fetch(host + "/user/agus", {
        method: "GET",
      });
      const helloFetchHtml = await helloFetch.text();
      assertEquals(
        helloFetchHtml,
        `{"data":"agus"}`,
      );

      const propsFetch = await fetch(
        host + "/___refresh___",
        {
          method: "GET",
        },
      );

      assert(propsFetch.body instanceof ReadableStream);

      const dearFetch = await fetch(host + "/profile/agus", {
        method: "GET",
      });
      const dearFetchHtml = await dearFetch.text();
      assertEquals(
        dearFetchHtml,
        `<!DOCTYPE html><html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1.0"/><title>halaman profile</title><link href="/styles.css" rel="stylesheet"/></head><body id="root"><p class="font-extralight">Dear profilemu agus halaman profile</p></body><script src="/js/dear.js" async></script><script src="/js/refresh.js" async></script></html>`,
      );

      const jsFetch = await fetch(host + "/js/refresh.js", {
        method: "GET",
      });
      const jsFetchHtml = await jsFetch.text();
      assertExists(
        jsFetchHtml,
        `const es = new EventSource('/___refresh___')`,
      );

      const dearJsFetch = await fetch(host + "/js/dear.js", {
        method: "GET",
      });

      const dearJsFetchHtml = await dearJsFetch.text();
      assertEquals(
        dearJsFetchHtml,
        `var F,p,Q,le,w,q,X,$,se,E={},Y=[],ue=/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i,N=Array.isArray;function x(e,t){for(var _ in t)e[_]=t[_];return e}function ee(e){var t=e.parentNode;t&&t.removeChild(e)}function I(e,t,_){var i,o,r,u={};for(r in t)r=="key"?i=t[r]:r=="ref"?o=t[r]:u[r]=t[r];if(arguments.length>2&&(u.children=arguments.length>3?F.call(arguments,2):_),typeof e=="function"&&e.defaultProps!=null)for(r in e.defaultProps)u[r]===void 0&&(u[r]=e.defaultProps[r]);return L(e,u,i,o,null)}function L(e,t,_,i,o){var r={type:e,props:t,key:_,ref:i,__k:null,__:null,__b:0,__e:null,__d:void 0,__c:null,constructor:void 0,__v:o??++Q,__i:-1,__u:0};return o==null&&p.vnode!=null&&p.vnode(r),r}function P(e){return e.children}function j(e,t){this.props=e,this.context=t}function C(e,t){if(t==null)return e.__?C(e.__,e.__i+1):null;for(var _;t<e.__k.length;t++)if((_=e.__k[t])!=null&&_.__e!=null)return _.__e;return typeof e.type=="function"?C(e):null}function te(e){var t,_;if((e=e.__)!=null&&e.__c!=null){for(e.__e=e.__c.base=null,t=0;t<e.__k.length;t++)if((_=e.__k[t])!=null&&_.__e!=null){e.__e=e.__c.base=_.__e;break}return te(e)}}function G(e){(!e.__d&&(e.__d=!0)&&w.push(e)&&!W.__r++||q!==p.debounceRendering)&&((q=p.debounceRendering)||X)(W)}function W(){var e,t,_,i,o,r,u,l,c;for(w.sort($);e=w.shift();)e.__d&&(t=w.length,i=void 0,r=(o=(_=e).__v).__e,l=[],c=[],(u=_.__P)&&((i=x({},o)).__v=o.__v+1,p.vnode&&p.vnode(i),R(u,i,o,_.__n,u.ownerSVGElement!==void 0,32&o.__u?[r]:null,l,r??C(o),!!(32&o.__u),c),i.__.__k[i.__i]=i,oe(l,i,c),i.__e!=r&&te(i)),w.length>t&&w.sort($));W.__r=0}function _e(e,t,_,i,o,r,u,l,c,s,a){var n,m,f,h,k,v=i&&i.__k||Y,d=t.length;for(_.__d=c,fe(_,t,v),c=_.__d,n=0;n<d;n++)(f=_.__k[n])!=null&&typeof f!="boolean"&&typeof f!="function"&&(m=f.__i===-1?E:v[f.__i]||E,f.__i=n,R(e,f,m,o,r,u,l,c,s,a),h=f.__e,f.ref&&m.ref!=f.ref&&(m.ref&&B(m.ref,null,f),a.push(f.ref,f.__c||h,f)),k==null&&h!=null&&(k=h),65536&f.__u||m.__k===f.__k?c=ne(f,c,e):typeof f.type=="function"&&f.__d!==void 0?c=f.__d:h&&(c=h.nextSibling),f.__d=void 0,f.__u&=-196609);_.__d=c,_.__e=k}function fe(e,t,_){var i,o,r,u,l,c=t.length,s=_.length,a=s,n=0;for(e.__k=[],i=0;i<c;i++)(o=e.__k[i]=(o=t[i])==null||typeof o=="boolean"||typeof o=="function"?null:typeof o=="string"||typeof o=="number"||typeof o=="bigint"||o.constructor==String?L(null,o,null,null,o):N(o)?L(P,{children:o},null,null,null):o.__b>0?L(o.type,o.props,o.key,o.ref?o.ref:null,o.__v):o)!=null?(o.__=e,o.__b=e.__b+1,l=ce(o,_,u=i+n,a),o.__i=l,r=null,l!==-1&&(a--,(r=_[l])&&(r.__u|=131072)),r==null||r.__v===null?(l==-1&&n--,typeof o.type!="function"&&(o.__u|=65536)):l!==u&&(l===u+1?n++:l>u?a>c-u?n+=l-u:n--:n=l<u&&l==u-1?l-u:0,l!==i+n&&(o.__u|=65536))):(r=_[i])&&r.key==null&&r.__e&&(r.__e==e.__d&&(e.__d=C(r)),H(r,r,!1),_[i]=null,a--);if(a)for(i=0;i<s;i++)(r=_[i])!=null&&!(131072&r.__u)&&(r.__e==e.__d&&(e.__d=C(r)),H(r,r))}function ne(e,t,_){var i,o;if(typeof e.type=="function"){for(i=e.__k,o=0;i&&o<i.length;o++)i[o]&&(i[o].__=e,t=ne(i[o],t,_));return t}return e.__e!=t&&(_.insertBefore(e.__e,t||null),t=e.__e),t&&t.nextSibling}function ce(e,t,_,i){var o=e.key,r=e.type,u=_-1,l=_+1,c=t[_];if(c===null||c&&o==c.key&&r===c.type)return _;if(i>(c!=null&&!(131072&c.__u)?1:0))for(;u>=0||l<t.length;){if(u>=0){if((c=t[u])&&!(131072&c.__u)&&o==c.key&&r===c.type)return u;u--}if(l<t.length){if((c=t[l])&&!(131072&c.__u)&&o==c.key&&r===c.type)return l;l++}}return-1}function Z(e,t,_){t[0]==="-"?e.setProperty(t,_??""):e[t]=_==null?"":typeof _!="number"||ue.test(t)?_:_+"px"}function A(e,t,_,i,o){var r;e:if(t==="style")if(typeof _=="string")e.style.cssText=_;else{if(typeof i=="string"&&(e.style.cssText=i=""),i)for(t in i)_&&t in _||Z(e.style,t,"");if(_)for(t in _)i&&_[t]===i[t]||Z(e.style,t,_[t])}else if(t[0]==="o"&&t[1]==="n")r=t!==(t=t.replace(/(PointerCapture)$|Capture$/,"$1")),t=t.toLowerCase()in e?t.toLowerCase().slice(2):t.slice(2),e.l||(e.l={}),e.l[t+r]=_,_?i?_.u=i.u:(_.u=Date.now(),e.addEventListener(t,r?K:J,r)):e.removeEventListener(t,r?K:J,r);else{if(o)t=t.replace(/xlink(H|:h)/,"h").replace(/sName$/,"s");else if(t!=="width"&&t!=="height"&&t!=="href"&&t!=="list"&&t!=="form"&&t!=="tabIndex"&&t!=="download"&&t!=="rowSpan"&&t!=="colSpan"&&t!=="role"&&t in e)try{e[t]=_??"";break e}catch{}typeof _=="function"||(_==null||_===!1&&t[4]!=="-"?e.removeAttribute(t):e.setAttribute(t,_))}}function J(e){var t=this.l[e.type+!1];if(e.t){if(e.t<=t.u)return}else e.t=Date.now();return t(p.event?p.event(e):e)}function K(e){return this.l[e.type+!0](p.event?p.event(e):e)}function R(e,t,_,i,o,r,u,l,c,s){var a,n,m,f,h,k,v,d,y,b,D,S,z,U,M,g=t.type;if(t.constructor!==void 0)return null;128&_.__u&&(c=!!(32&_.__u),r=[l=t.__e=_.__e]),(a=p.__b)&&a(t);e:if(typeof g=="function")try{if(d=t.props,y=(a=g.contextType)&&i[a.__c],b=a?y?y.props.value:a.__:i,_.__c?v=(n=t.__c=_.__c).__=n.__E:("prototype"in g&&g.prototype.render?t.__c=n=new g(d,b):(t.__c=n=new j(d,b),n.constructor=g,n.render=pe),y&&y.sub(n),n.props=d,n.state||(n.state={}),n.context=b,n.__n=i,m=n.__d=!0,n.__h=[],n._sb=[]),n.__s==null&&(n.__s=n.state),g.getDerivedStateFromProps!=null&&(n.__s==n.state&&(n.__s=x({},n.__s)),x(n.__s,g.getDerivedStateFromProps(d,n.__s))),f=n.props,h=n.state,n.__v=t,m)g.getDerivedStateFromProps==null&&n.componentWillMount!=null&&n.componentWillMount(),n.componentDidMount!=null&&n.__h.push(n.componentDidMount);else{if(g.getDerivedStateFromProps==null&&d!==f&&n.componentWillReceiveProps!=null&&n.componentWillReceiveProps(d,b),!n.__e&&(n.shouldComponentUpdate!=null&&n.shouldComponentUpdate(d,n.__s,b)===!1||t.__v===_.__v)){for(t.__v!==_.__v&&(n.props=d,n.state=n.__s,n.__d=!1),t.__e=_.__e,t.__k=_.__k,t.__k.forEach(function(T){T&&(T.__=t)}),D=0;D<n._sb.length;D++)n.__h.push(n._sb[D]);n._sb=[],n.__h.length&&u.push(n);break e}n.componentWillUpdate!=null&&n.componentWillUpdate(d,n.__s,b),n.componentDidUpdate!=null&&n.__h.push(function(){n.componentDidUpdate(f,h,k)})}if(n.context=b,n.props=d,n.__P=e,n.__e=!1,S=p.__r,z=0,"prototype"in g&&g.prototype.render){for(n.state=n.__s,n.__d=!1,S&&S(t),a=n.render(n.props,n.state,n.context),U=0;U<n._sb.length;U++)n.__h.push(n._sb[U]);n._sb=[]}else do n.__d=!1,S&&S(t),a=n.render(n.props,n.state,n.context),n.state=n.__s;while(n.__d&&++z<25);n.state=n.__s,n.getChildContext!=null&&(i=x(x({},i),n.getChildContext())),m||n.getSnapshotBeforeUpdate==null||(k=n.getSnapshotBeforeUpdate(f,h)),_e(e,N(M=a!=null&&a.type===P&&a.key==null?a.props.children:a)?M:[M],t,_,i,o,r,u,l,c,s),n.base=t.__e,t.__u&=-161,n.__h.length&&u.push(n),v&&(n.__E=n.__=null)}catch(T){t.__v=null,c||r!=null?(t.__e=l,t.__u|=c?160:32,r[r.indexOf(l)]=null):(t.__e=_.__e,t.__k=_.__k),p.__e(T,t,_)}else r==null&&t.__v===_.__v?(t.__k=_.__k,t.__e=_.__e):t.__e=ae(_.__e,t,_,i,o,r,u,c,s);(a=p.diffed)&&a(t)}function oe(e,t,_){t.__d=void 0;for(var i=0;i<_.length;i++)B(_[i],_[++i],_[++i]);p.__c&&p.__c(t,e),e.some(function(o){try{e=o.__h,o.__h=[],e.some(function(r){r.call(o)})}catch(r){p.__e(r,o.__v)}})}function ae(e,t,_,i,o,r,u,l,c){var s,a,n,m,f,h,k,v=_.props,d=t.props,y=t.type;if(y==="svg"&&(o=!0),r!=null){for(s=0;s<r.length;s++)if((f=r[s])&&"setAttribute"in f==!!y&&(y?f.localName===y:f.nodeType===3)){e=f,r[s]=null;break}}if(e==null){if(y===null)return document.createTextNode(d);e=o?document.createElementNS("http://www.w3.org/2000/svg",y):document.createElement(y,d.is&&d),r=null,l=!1}if(y===null)v===d||l&&e.data===d||(e.data=d);else{if(r=r&&F.call(e.childNodes),v=_.props||E,!l&&r!=null)for(v={},s=0;s<e.attributes.length;s++)v[(f=e.attributes[s]).name]=f.value;for(s in v)f=v[s],s=="children"||(s=="dangerouslySetInnerHTML"?n=f:s==="key"||s in d||A(e,s,null,f,o));for(s in d)f=d[s],s=="children"?m=f:s=="dangerouslySetInnerHTML"?a=f:s=="value"?h=f:s=="checked"?k=f:s==="key"||l&&typeof f!="function"||v[s]===f||A(e,s,f,v[s],o);if(a)l||n&&(a.__html===n.__html||a.__html===e.innerHTML)||(e.innerHTML=a.__html),t.__k=[];else if(n&&(e.innerHTML=""),_e(e,N(m)?m:[m],t,_,i,o&&y!=="foreignObject",r,u,r?r[0]:_.__k&&C(_,0),l,c),r!=null)for(s=r.length;s--;)r[s]!=null&&ee(r[s]);l||(s="value",h!==void 0&&(h!==e[s]||y==="progress"&&!h||y==="option"&&h!==v[s])&&A(e,s,h,v[s],!1),s="checked",k!==void 0&&k!==e[s]&&A(e,s,k,v[s],!1))}return e}function B(e,t,_){try{typeof e=="function"?e(t):e.current=t}catch(i){p.__e(i,_)}}function H(e,t,_){var i,o;if(p.unmount&&p.unmount(e),(i=e.ref)&&(i.current&&i.current!==e.__e||B(i,null,t)),(i=e.__c)!=null){if(i.componentWillUnmount)try{i.componentWillUnmount()}catch(r){p.__e(r,t)}i.base=i.__P=null,e.__c=void 0}if(i=e.__k)for(o=0;o<i.length;o++)i[o]&&H(i[o],t,_||typeof e.type!="function");_||e.__e==null||ee(e.__e),e.__=e.__e=e.__d=void 0}function pe(e,t,_){return this.constructor(e,_)}function de(e,t,_){var i,o,r,u;p.__&&p.__(e,t),o=(i=typeof _=="function")?null:_&&_.__k||t.__k,r=[],u=[],R(t,e=(!i&&_||t).__k=I(P,null,[e]),o||E,E,t.ownerSVGElement!==void 0,!i&&_?[_]:o?null:t.firstChild?F.call(t.childNodes):null,r,!i&&_?_:o?o.__e:t.firstChild,i,u),oe(r,e,u)}function O(e,t){de(e,t,O)}F=Y.slice,p={__e:function(e,t,_,i){for(var o,r,u;t=t.__;)if((o=t.__c)&&!o.__)try{if((r=o.constructor)&&r.getDerivedStateFromError!=null&&(o.setState(r.getDerivedStateFromError(e)),u=o.__d),o.componentDidCatch!=null&&(o.componentDidCatch(e,i||{}),u=o.__d),u)return o.__E=o}catch(l){e=l}throw e}},Q=0,le=function(e){return e!=null&&e.constructor==null},j.prototype.setState=function(e,t){var _;_=this.__s!=null&&this.__s!==this.state?this.__s:this.__s=x({},this.state),typeof e=="function"&&(e=e(x({},_),this.props)),e&&x(_,e),e!=null&&this.__v&&(t&&this._sb.push(t),G(this))},j.prototype.forceUpdate=function(e){this.__v&&(this.__e=!0,e&&this.__h.push(e),G(this))},j.prototype.render=P,w=[],X=typeof Promise=="function"?Promise.prototype.then.bind(Promise.resolve()):setTimeout,$=function(e,t){return e.__v.__b-t.__v.__b},W.__r=0,se=0;var he=0,me=Array.isArray;function re(e,t,_,i,o,r){var u,l,c={};for(l in t)l=="ref"?u=t[l]:c[l]=t[l];var s={type:e,props:c,key:_,ref:u,__k:null,__:null,__b:0,__e:null,__d:void 0,__c:null,constructor:void 0,__v:--he,__i:-1,__u:0,__source:o,__self:r};if(typeof e=="function"&&(u=e.defaultProps))for(l in u)c[l]===void 0&&(c[l]=u[l]);return p.vnode&&p.vnode(s),s}function V({data:e}){return re("p",{class:"font-extralight",children:["Dear ",e.data," ",e.user," ",e.title]})}var ie=document.getElementById("root");if(ie){let e=new URL(window.location.href);fetch("/__"+e.pathname+"/props").then(t=>t.json()).then(t=>{O(I(V,{data:t}),ie)}).catch(t=>{console.error("Error fetching data:",t)})}\n`,
      );

      const jsProps = await fetch(host + "/__/profile/agus/props", {
        method: "GET",
      });
      const jsPropsText = await jsProps.text();
      assertEquals(
        jsPropsText,
        `{"title":"halaman profile","data":"profilemu","user":"agus"}`,
      );

      await f.shutdown();
    },
    sanitizeResources: false,
    sanitizeOps: false,
    sanitizeExit: false,
  },
);
