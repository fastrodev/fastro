import { assertEquals } from "std/assert/assert_equals.ts";
import { assertExists } from "std/assert/assert_exists.ts";
import fastro from "../../mod.ts";
import { assert } from "std/assert/assert.ts";
import hello from "../../app/hello.page.tsx";
import dear from "../../app/dear.page.tsx";
import { layout } from "../../app/app.layout.tsx";
import { Fastro } from "./types.ts";

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
        `var L,a,Q,un,C,G,X,N,sn,E={},Y=[],fn=/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i,H=Array.isArray;function x(n,e){for(var t in e)n[t]=e[t];return n}function nn(n){var e=n.parentNode;e&&e.removeChild(n)}function R(n,e,t){var l,o,_,s={};for(_ in e)_=="key"?l=e[_]:_=="ref"?o=e[_]:s[_]=e[_];if(arguments.length>2&&(s.children=arguments.length>3?L.call(arguments,2):t),typeof n=="function"&&n.defaultProps!=null)for(_ in n.defaultProps)s[_]===void 0&&(s[_]=n.defaultProps[_]);return W(n,s,l,o,null)}function W(n,e,t,l,o){var _={type:n,props:e,key:t,ref:l,__k:null,__:null,__b:0,__e:null,__d:void 0,__c:null,constructor:void 0,__v:o??++Q,__i:-1,__u:0};return o==null&&a.vnode!=null&&a.vnode(_),_}function P(n){return n.children}function j(n,e){this.props=n,this.context=e}function w(n,e){if(e==null)return n.__?w(n.__,n.__i+1):null;for(var t;e<n.__k.length;e++)if((t=n.__k[e])!=null&&t.__e!=null)return t.__e;return typeof n.type=="function"?w(n):null}function en(n){var e,t;if((n=n.__)!=null&&n.__c!=null){for(n.__e=n.__c.base=null,e=0;e<n.__k.length;e++)if((t=n.__k[e])!=null&&t.__e!=null){n.__e=n.__c.base=t.__e;break}return en(n)}}function q(n){(!n.__d&&(n.__d=!0)&&C.push(n)&&!F.__r++||G!==a.debounceRendering)&&((G=a.debounceRendering)||X)(F)}function F(){var n,e,t,l,o,_,s,u,c;for(C.sort(N);n=C.shift();)n.__d&&(e=C.length,l=void 0,_=(o=(t=n).__v).__e,u=[],c=[],(s=t.__P)&&((l=x({},o)).__v=o.__v+1,a.vnode&&a.vnode(l),B(s,l,o,t.__n,s.ownerSVGElement!==void 0,32&o.__u?[_]:null,u,_??w(o),!!(32&o.__u),c),l.__.__k[l.__i]=l,on(u,l,c),l.__e!=_&&en(l)),C.length>e&&C.sort(N));F.__r=0}function tn(n,e,t,l,o,_,s,u,c,i,p){var r,m,f,h,k,v=l&&l.__k||Y,d=e.length;for(t.__d=c,cn(t,e,v),c=t.__d,r=0;r<d;r++)(f=t.__k[r])!=null&&typeof f!="boolean"&&typeof f!="function"&&(m=f.__i===-1?E:v[f.__i]||E,f.__i=r,B(n,f,m,o,_,s,u,c,i,p),h=f.__e,f.ref&&m.ref!=f.ref&&(m.ref&&I(m.ref,null,f),p.push(f.ref,f.__c||h,f)),k==null&&h!=null&&(k=h),65536&f.__u||m.__k===f.__k?c=rn(f,c,n):typeof f.type=="function"&&f.__d!==void 0?c=f.__d:h&&(c=h.nextSibling),f.__d=void 0,f.__u&=-196609);t.__d=c,t.__e=k}function cn(n,e,t){var l,o,_,s,u,c=e.length,i=t.length,p=i,r=0;for(n.__k=[],l=0;l<c;l++)(o=n.__k[l]=(o=e[l])==null||typeof o=="boolean"||typeof o=="function"?null:typeof o=="string"||typeof o=="number"||typeof o=="bigint"||o.constructor==String?W(null,o,null,null,o):H(o)?W(P,{children:o},null,null,null):o.__b>0?W(o.type,o.props,o.key,o.ref?o.ref:null,o.__v):o)!=null?(o.__=n,o.__b=n.__b+1,u=pn(o,t,s=l+r,p),o.__i=u,_=null,u!==-1&&(p--,(_=t[u])&&(_.__u|=131072)),_==null||_.__v===null?(u==-1&&r--,typeof o.type!="function"&&(o.__u|=65536)):u!==s&&(u===s+1?r++:u>s?p>c-s?r+=u-s:r--:r=u<s&&u==s-1?u-s:0,u!==l+r&&(o.__u|=65536))):(_=t[l])&&_.key==null&&_.__e&&(_.__e==n.__d&&(n.__d=w(_)),$(_,_,!1),t[l]=null,p--);if(p)for(l=0;l<i;l++)(_=t[l])!=null&&!(131072&_.__u)&&(_.__e==n.__d&&(n.__d=w(_)),$(_,_))}function rn(n,e,t){var l,o;if(typeof n.type=="function"){for(l=n.__k,o=0;l&&o<l.length;o++)l[o]&&(l[o].__=n,e=rn(l[o],e,t));return e}return n.__e!=e&&(t.insertBefore(n.__e,e||null),e=n.__e),e&&e.nextSibling}function pn(n,e,t,l){var o=n.key,_=n.type,s=t-1,u=t+1,c=e[t];if(c===null||c&&o==c.key&&_===c.type)return t;if(l>(c!=null&&!(131072&c.__u)?1:0))for(;s>=0||u<e.length;){if(s>=0){if((c=e[s])&&!(131072&c.__u)&&o==c.key&&_===c.type)return s;s--}if(u<e.length){if((c=e[u])&&!(131072&c.__u)&&o==c.key&&_===c.type)return u;u++}}return-1}function Z(n,e,t){e[0]==="-"?n.setProperty(e,t??""):n[e]=t==null?"":typeof t!="number"||fn.test(e)?t:t+"px"}function A(n,e,t,l,o){var _;n:if(e==="style")if(typeof t=="string")n.style.cssText=t;else{if(typeof l=="string"&&(n.style.cssText=l=""),l)for(e in l)t&&e in t||Z(n.style,e,"");if(t)for(e in t)l&&t[e]===l[e]||Z(n.style,e,t[e])}else if(e[0]==="o"&&e[1]==="n")_=e!==(e=e.replace(/(PointerCapture)$|Capture$/,"$1")),e=e.toLowerCase()in n?e.toLowerCase().slice(2):e.slice(2),n.l||(n.l={}),n.l[e+_]=t,t?l?t.u=l.u:(t.u=Date.now(),n.addEventListener(e,_?K:J,_)):n.removeEventListener(e,_?K:J,_);else{if(o)e=e.replace(/xlink(H|:h)/,"h").replace(/sName$/,"s");else if(e!=="width"&&e!=="height"&&e!=="href"&&e!=="list"&&e!=="form"&&e!=="tabIndex"&&e!=="download"&&e!=="rowSpan"&&e!=="colSpan"&&e!=="role"&&e in n)try{n[e]=t??"";break n}catch{}typeof t=="function"||(t==null||t===!1&&e[4]!=="-"?n.removeAttribute(e):n.setAttribute(e,t))}}function J(n){var e=this.l[n.type+!1];if(n.t){if(n.t<=e.u)return}else n.t=Date.now();return e(a.event?a.event(n):n)}function K(n){return this.l[n.type+!0](a.event?a.event(n):n)}function B(n,e,t,l,o,_,s,u,c,i){var p,r,m,f,h,k,v,d,y,b,D,S,z,U,M,g=e.type;if(e.constructor!==void 0)return null;128&t.__u&&(c=!!(32&t.__u),_=[u=e.__e=t.__e]),(p=a.__b)&&p(e);n:if(typeof g=="function")try{if(d=e.props,y=(p=g.contextType)&&l[p.__c],b=p?y?y.props.value:p.__:l,t.__c?v=(r=e.__c=t.__c).__=r.__E:("prototype"in g&&g.prototype.render?e.__c=r=new g(d,b):(e.__c=r=new j(d,b),r.constructor=g,r.render=dn),y&&y.sub(r),r.props=d,r.state||(r.state={}),r.context=b,r.__n=l,m=r.__d=!0,r.__h=[],r._sb=[]),r.__s==null&&(r.__s=r.state),g.getDerivedStateFromProps!=null&&(r.__s==r.state&&(r.__s=x({},r.__s)),x(r.__s,g.getDerivedStateFromProps(d,r.__s))),f=r.props,h=r.state,r.__v=e,m)g.getDerivedStateFromProps==null&&r.componentWillMount!=null&&r.componentWillMount(),r.componentDidMount!=null&&r.__h.push(r.componentDidMount);else{if(g.getDerivedStateFromProps==null&&d!==f&&r.componentWillReceiveProps!=null&&r.componentWillReceiveProps(d,b),!r.__e&&(r.shouldComponentUpdate!=null&&r.shouldComponentUpdate(d,r.__s,b)===!1||e.__v===t.__v)){for(e.__v!==t.__v&&(r.props=d,r.state=r.__s,r.__d=!1),e.__e=t.__e,e.__k=t.__k,e.__k.forEach(function(T){T&&(T.__=e)}),D=0;D<r._sb.length;D++)r.__h.push(r._sb[D]);r._sb=[],r.__h.length&&s.push(r);break n}r.componentWillUpdate!=null&&r.componentWillUpdate(d,r.__s,b),r.componentDidUpdate!=null&&r.__h.push(function(){r.componentDidUpdate(f,h,k)})}if(r.context=b,r.props=d,r.__P=n,r.__e=!1,S=a.__r,z=0,"prototype"in g&&g.prototype.render){for(r.state=r.__s,r.__d=!1,S&&S(e),p=r.render(r.props,r.state,r.context),U=0;U<r._sb.length;U++)r.__h.push(r._sb[U]);r._sb=[]}else do r.__d=!1,S&&S(e),p=r.render(r.props,r.state,r.context),r.state=r.__s;while(r.__d&&++z<25);r.state=r.__s,r.getChildContext!=null&&(l=x(x({},l),r.getChildContext())),m||r.getSnapshotBeforeUpdate==null||(k=r.getSnapshotBeforeUpdate(f,h)),tn(n,H(M=p!=null&&p.type===P&&p.key==null?p.props.children:p)?M:[M],e,t,l,o,_,s,u,c,i),r.base=e.__e,e.__u&=-161,r.__h.length&&s.push(r),v&&(r.__E=r.__=null)}catch(T){e.__v=null,c||_!=null?(e.__e=u,e.__u|=c?160:32,_[_.indexOf(u)]=null):(e.__e=t.__e,e.__k=t.__k),a.__e(T,e,t)}else _==null&&e.__v===t.__v?(e.__k=t.__k,e.__e=t.__e):e.__e=an(t.__e,e,t,l,o,_,s,c,i);(p=a.diffed)&&p(e)}function on(n,e,t){e.__d=void 0;for(var l=0;l<t.length;l++)I(t[l],t[++l],t[++l]);a.__c&&a.__c(e,n),n.some(function(o){try{n=o.__h,o.__h=[],n.some(function(_){_.call(o)})}catch(_){a.__e(_,o.__v)}})}function an(n,e,t,l,o,_,s,u,c){var i,p,r,m,f,h,k,v=t.props,d=e.props,y=e.type;if(y==="svg"&&(o=!0),_!=null){for(i=0;i<_.length;i++)if((f=_[i])&&"setAttribute"in f==!!y&&(y?f.localName===y:f.nodeType===3)){n=f,_[i]=null;break}}if(n==null){if(y===null)return document.createTextNode(d);n=o?document.createElementNS("http://www.w3.org/2000/svg",y):document.createElement(y,d.is&&d),_=null,u=!1}if(y===null)v===d||u&&n.data===d||(n.data=d);else{if(_=_&&L.call(n.childNodes),v=t.props||E,!u&&_!=null)for(v={},i=0;i<n.attributes.length;i++)v[(f=n.attributes[i]).name]=f.value;for(i in v)f=v[i],i=="children"||(i=="dangerouslySetInnerHTML"?r=f:i==="key"||i in d||A(n,i,null,f,o));for(i in d)f=d[i],i=="children"?m=f:i=="dangerouslySetInnerHTML"?p=f:i=="value"?h=f:i=="checked"?k=f:i==="key"||u&&typeof f!="function"||v[i]===f||A(n,i,f,v[i],o);if(p)u||r&&(p.__html===r.__html||p.__html===n.innerHTML)||(n.innerHTML=p.__html),e.__k=[];else if(r&&(n.innerHTML=""),tn(n,H(m)?m:[m],e,t,l,o&&y!=="foreignObject",_,s,_?_[0]:t.__k&&w(t,0),u,c),_!=null)for(i=_.length;i--;)_[i]!=null&&nn(_[i]);u||(i="value",h!==void 0&&(h!==n[i]||y==="progress"&&!h||y==="option"&&h!==v[i])&&A(n,i,h,v[i],!1),i="checked",k!==void 0&&k!==n[i]&&A(n,i,k,v[i],!1))}return n}function I(n,e,t){try{typeof n=="function"?n(e):n.current=e}catch(l){a.__e(l,t)}}function $(n,e,t){var l,o;if(a.unmount&&a.unmount(n),(l=n.ref)&&(l.current&&l.current!==n.__e||I(l,null,e)),(l=n.__c)!=null){if(l.componentWillUnmount)try{l.componentWillUnmount()}catch(_){a.__e(_,e)}l.base=l.__P=null,n.__c=void 0}if(l=n.__k)for(o=0;o<l.length;o++)l[o]&&$(l[o],e,t||typeof n.type!="function");t||n.__e==null||nn(n.__e),n.__=n.__e=n.__d=void 0}function dn(n,e,t){return this.constructor(n,t)}function hn(n,e,t){var l,o,_,s;a.__&&a.__(n,e),o=(l=typeof t=="function")?null:t&&t.__k||e.__k,_=[],s=[],B(e,n=(!l&&t||e).__k=R(P,null,[n]),o||E,E,e.ownerSVGElement!==void 0,!l&&t?[t]:o?null:e.firstChild?L.call(e.childNodes):null,_,!l&&t?t:o?o.__e:e.firstChild,l,s),on(_,n,s)}function V(n,e){hn(n,e,V)}L=Y.slice,a={__e:function(n,e,t,l){for(var o,_,s;e=e.__;)if((o=e.__c)&&!o.__)try{if((_=o.constructor)&&_.getDerivedStateFromError!=null&&(o.setState(_.getDerivedStateFromError(n)),s=o.__d),o.componentDidCatch!=null&&(o.componentDidCatch(n,l||{}),s=o.__d),s)return o.__E=o}catch(u){n=u}throw n}},Q=0,un=function(n){return n!=null&&n.constructor==null},j.prototype.setState=function(n,e){var t;t=this.__s!=null&&this.__s!==this.state?this.__s:this.__s=x({},this.state),typeof n=="function"&&(n=n(x({},t),this.props)),n&&x(t,n),n!=null&&this.__v&&(e&&this._sb.push(e),q(this))},j.prototype.forceUpdate=function(n){this.__v&&(this.__e=!0,n&&this.__h.push(n),q(this))},j.prototype.render=P,C=[],X=typeof Promise=="function"?Promise.prototype.then.bind(Promise.resolve()):setTimeout,N=function(n,e){return n.__v.__b-e.__v.__b},F.__r=0,sn=0;var vn=0,xn=Array.isArray;function ln(n,e,t,l,o,_){var s,u,c={};for(u in e)u=="ref"?s=e[u]:c[u]=e[u];var i={type:n,props:c,key:t,ref:s,__k:null,__:null,__b:0,__e:null,__d:void 0,__c:null,constructor:void 0,__v:--vn,__i:-1,__u:0,__source:o,__self:_};if(typeof n=="function"&&(s=n.defaultProps))for(u in s)c[u]===void 0&&(c[u]=s[u]);return a.vnode&&a.vnode(i),i}function O({data:n}){return ln("p",{class:"font-extralight",children:["Dear ",n.data," ",n.user," ",n.title]})}var _n=document.getElementById("root");if(_n){let n=new URL(window.location.href);fetch("/__"+n.pathname+"/props").then(e=>e.json()).then(e=>{V(R(O,{data:e}),_n)}).catch(e=>{console.error("Error fetching data:",e)})}\n`,
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
