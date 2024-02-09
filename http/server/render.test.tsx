import { assert, assertEquals, assertExists } from "./deps.ts";
import fastro from "../../mod.ts";
import hello from "../../modules/web/hello.page.tsx";
import dear from "../../modules/web/dear.page.tsx";
import { layout } from "../../modules/web/app.layout.tsx";
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
        folder: "modules/web",
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
        `<!DOCTYPE html><html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1.0"/><title>halaman page</title><link href="/styles.css" rel="stylesheet"/></head><body id="root"><div><p>Count: 0</p><button>Increment</button><button>Decrement</button></div></body><script src="/js/hello.js" async></script></html>`,
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
        folder: "modules/web",
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
        `var L,p,Q,un,C,G,X,N,sn,E={},Y=[],cn=/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i,H=Array.isArray;function x(n,e){for(var t in e)n[t]=e[t];return n}function nn(n){var e=n.parentNode;e&&e.removeChild(n)}function R(n,e,t){var o,l,_,s={};for(_ in e)_=="key"?o=e[_]:_=="ref"?l=e[_]:s[_]=e[_];if(arguments.length>2&&(s.children=arguments.length>3?L.call(arguments,2):t),typeof n=="function"&&n.defaultProps!=null)for(_ in n.defaultProps)s[_]===void 0&&(s[_]=n.defaultProps[_]);return W(n,s,o,l,null)}function W(n,e,t,o,l){var _={type:n,props:e,key:t,ref:o,__k:null,__:null,__b:0,__e:null,__d:void 0,__c:null,constructor:void 0,__v:l??++Q,__i:-1,__u:0};return l==null&&p.vnode!=null&&p.vnode(_),_}function P(n){return n.children}function j(n,e){this.props=n,this.context=e}function w(n,e){if(e==null)return n.__?w(n.__,n.__i+1):null;for(var t;e<n.__k.length;e++)if((t=n.__k[e])!=null&&t.__e!=null)return t.__e;return typeof n.type=="function"?w(n):null}function en(n){var e,t;if((n=n.__)!=null&&n.__c!=null){for(n.__e=n.__c.base=null,e=0;e<n.__k.length;e++)if((t=n.__k[e])!=null&&t.__e!=null){n.__e=n.__c.base=t.__e;break}return en(n)}}function q(n){(!n.__d&&(n.__d=!0)&&C.push(n)&&!F.__r++||G!==p.debounceRendering)&&((G=p.debounceRendering)||X)(F)}function F(){var n,e,t,o,l,_,s,u,f;for(C.sort(N);n=C.shift();)n.__d&&(e=C.length,o=void 0,_=(l=(t=n).__v).__e,u=[],f=[],(s=t.__P)&&((o=x({},l)).__v=l.__v+1,p.vnode&&p.vnode(o),B(s,o,l,t.__n,s.ownerSVGElement!==void 0,32&l.__u?[_]:null,u,_??w(l),!!(32&l.__u),f),o.__.__k[o.__i]=o,on(u,o,f),o.__e!=_&&en(o)),C.length>e&&C.sort(N));F.__r=0}function tn(n,e,t,o,l,_,s,u,f,i,a){var r,m,c,h,k,v=o&&o.__k||Y,d=e.length;for(t.__d=f,fn(t,e,v),f=t.__d,r=0;r<d;r++)(c=t.__k[r])!=null&&typeof c!="boolean"&&typeof c!="function"&&(m=c.__i===-1?E:v[c.__i]||E,c.__i=r,B(n,c,m,l,_,s,u,f,i,a),h=c.__e,c.ref&&m.ref!=c.ref&&(m.ref&&I(m.ref,null,c),a.push(c.ref,c.__c||h,c)),k==null&&h!=null&&(k=h),65536&c.__u||m.__k===c.__k?f=rn(c,f,n):typeof c.type=="function"&&c.__d!==void 0?f=c.__d:h&&(f=h.nextSibling),c.__d=void 0,c.__u&=-196609);t.__d=f,t.__e=k}function fn(n,e,t){var o,l,_,s,u,f=e.length,i=t.length,a=i,r=0;for(n.__k=[],o=0;o<f;o++)(l=n.__k[o]=(l=e[o])==null||typeof l=="boolean"||typeof l=="function"?null:typeof l=="string"||typeof l=="number"||typeof l=="bigint"||l.constructor==String?W(null,l,null,null,l):H(l)?W(P,{children:l},null,null,null):l.constructor===void 0&&l.__b>0?W(l.type,l.props,l.key,l.ref?l.ref:null,l.__v):l)!=null?(l.__=n,l.__b=n.__b+1,u=an(l,t,s=o+r,a),l.__i=u,_=null,u!==-1&&(a--,(_=t[u])&&(_.__u|=131072)),_==null||_.__v===null?(u==-1&&r--,typeof l.type!="function"&&(l.__u|=65536)):u!==s&&(u===s+1?r++:u>s?a>f-s?r+=u-s:r--:r=u<s&&u==s-1?u-s:0,u!==o+r&&(l.__u|=65536))):(_=t[o])&&_.key==null&&_.__e&&(_.__e==n.__d&&(n.__d=w(_)),$(_,_,!1),t[o]=null,a--);if(a)for(o=0;o<i;o++)(_=t[o])!=null&&!(131072&_.__u)&&(_.__e==n.__d&&(n.__d=w(_)),$(_,_))}function rn(n,e,t){var o,l;if(typeof n.type=="function"){for(o=n.__k,l=0;o&&l<o.length;l++)o[l]&&(o[l].__=n,e=rn(o[l],e,t));return e}return n.__e!=e&&(t.insertBefore(n.__e,e||null),e=n.__e),e&&e.nextSibling}function an(n,e,t,o){var l=n.key,_=n.type,s=t-1,u=t+1,f=e[t];if(f===null||f&&l==f.key&&_===f.type)return t;if(o>(f!=null&&!(131072&f.__u)?1:0))for(;s>=0||u<e.length;){if(s>=0){if((f=e[s])&&!(131072&f.__u)&&l==f.key&&_===f.type)return s;s--}if(u<e.length){if((f=e[u])&&!(131072&f.__u)&&l==f.key&&_===f.type)return u;u++}}return-1}function Z(n,e,t){e[0]==="-"?n.setProperty(e,t??""):n[e]=t==null?"":typeof t!="number"||cn.test(e)?t:t+"px"}function A(n,e,t,o,l){var _;n:if(e==="style")if(typeof t=="string")n.style.cssText=t;else{if(typeof o=="string"&&(n.style.cssText=o=""),o)for(e in o)t&&e in t||Z(n.style,e,"");if(t)for(e in t)o&&t[e]===o[e]||Z(n.style,e,t[e])}else if(e[0]==="o"&&e[1]==="n")_=e!==(e=e.replace(/(PointerCapture)$|Capture$/,"$1")),e=e.toLowerCase()in n?e.toLowerCase().slice(2):e.slice(2),n.l||(n.l={}),n.l[e+_]=t,t?o?t.u=o.u:(t.u=Date.now(),n.addEventListener(e,_?K:J,_)):n.removeEventListener(e,_?K:J,_);else{if(l)e=e.replace(/xlink(H|:h)/,"h").replace(/sName$/,"s");else if(e!=="width"&&e!=="height"&&e!=="href"&&e!=="list"&&e!=="form"&&e!=="tabIndex"&&e!=="download"&&e!=="rowSpan"&&e!=="colSpan"&&e!=="role"&&e in n)try{n[e]=t??"";break n}catch{}typeof t=="function"||(t==null||t===!1&&e[4]!=="-"?n.removeAttribute(e):n.setAttribute(e,t))}}function J(n){var e=this.l[n.type+!1];if(n.t){if(n.t<=e.u)return}else n.t=Date.now();return e(p.event?p.event(n):n)}function K(n){return this.l[n.type+!0](p.event?p.event(n):n)}function B(n,e,t,o,l,_,s,u,f,i){var a,r,m,c,h,k,v,d,y,b,D,S,z,U,M,g=e.type;if(e.constructor!==void 0)return null;128&t.__u&&(f=!!(32&t.__u),_=[u=e.__e=t.__e]),(a=p.__b)&&a(e);n:if(typeof g=="function")try{if(d=e.props,y=(a=g.contextType)&&o[a.__c],b=a?y?y.props.value:a.__:o,t.__c?v=(r=e.__c=t.__c).__=r.__E:("prototype"in g&&g.prototype.render?e.__c=r=new g(d,b):(e.__c=r=new j(d,b),r.constructor=g,r.render=dn),y&&y.sub(r),r.props=d,r.state||(r.state={}),r.context=b,r.__n=o,m=r.__d=!0,r.__h=[],r._sb=[]),r.__s==null&&(r.__s=r.state),g.getDerivedStateFromProps!=null&&(r.__s==r.state&&(r.__s=x({},r.__s)),x(r.__s,g.getDerivedStateFromProps(d,r.__s))),c=r.props,h=r.state,r.__v=e,m)g.getDerivedStateFromProps==null&&r.componentWillMount!=null&&r.componentWillMount(),r.componentDidMount!=null&&r.__h.push(r.componentDidMount);else{if(g.getDerivedStateFromProps==null&&d!==c&&r.componentWillReceiveProps!=null&&r.componentWillReceiveProps(d,b),!r.__e&&(r.shouldComponentUpdate!=null&&r.shouldComponentUpdate(d,r.__s,b)===!1||e.__v===t.__v)){for(e.__v!==t.__v&&(r.props=d,r.state=r.__s,r.__d=!1),e.__e=t.__e,e.__k=t.__k,e.__k.forEach(function(T){T&&(T.__=e)}),D=0;D<r._sb.length;D++)r.__h.push(r._sb[D]);r._sb=[],r.__h.length&&s.push(r);break n}r.componentWillUpdate!=null&&r.componentWillUpdate(d,r.__s,b),r.componentDidUpdate!=null&&r.__h.push(function(){r.componentDidUpdate(c,h,k)})}if(r.context=b,r.props=d,r.__P=n,r.__e=!1,S=p.__r,z=0,"prototype"in g&&g.prototype.render){for(r.state=r.__s,r.__d=!1,S&&S(e),a=r.render(r.props,r.state,r.context),U=0;U<r._sb.length;U++)r.__h.push(r._sb[U]);r._sb=[]}else do r.__d=!1,S&&S(e),a=r.render(r.props,r.state,r.context),r.state=r.__s;while(r.__d&&++z<25);r.state=r.__s,r.getChildContext!=null&&(o=x(x({},o),r.getChildContext())),m||r.getSnapshotBeforeUpdate==null||(k=r.getSnapshotBeforeUpdate(c,h)),tn(n,H(M=a!=null&&a.type===P&&a.key==null?a.props.children:a)?M:[M],e,t,o,l,_,s,u,f,i),r.base=e.__e,e.__u&=-161,r.__h.length&&s.push(r),v&&(r.__E=r.__=null)}catch(T){e.__v=null,f||_!=null?(e.__e=u,e.__u|=f?160:32,_[_.indexOf(u)]=null):(e.__e=t.__e,e.__k=t.__k),p.__e(T,e,t)}else _==null&&e.__v===t.__v?(e.__k=t.__k,e.__e=t.__e):e.__e=pn(t.__e,e,t,o,l,_,s,f,i);(a=p.diffed)&&a(e)}function on(n,e,t){e.__d=void 0;for(var o=0;o<t.length;o++)I(t[o],t[++o],t[++o]);p.__c&&p.__c(e,n),n.some(function(l){try{n=l.__h,l.__h=[],n.some(function(_){_.call(l)})}catch(_){p.__e(_,l.__v)}})}function pn(n,e,t,o,l,_,s,u,f){var i,a,r,m,c,h,k,v=t.props,d=e.props,y=e.type;if(y==="svg"&&(l=!0),_!=null){for(i=0;i<_.length;i++)if((c=_[i])&&"setAttribute"in c==!!y&&(y?c.localName===y:c.nodeType===3)){n=c,_[i]=null;break}}if(n==null){if(y===null)return document.createTextNode(d);n=l?document.createElementNS("http://www.w3.org/2000/svg",y):document.createElement(y,d.is&&d),_=null,u=!1}if(y===null)v===d||u&&n.data===d||(n.data=d);else{if(_=_&&L.call(n.childNodes),v=t.props||E,!u&&_!=null)for(v={},i=0;i<n.attributes.length;i++)v[(c=n.attributes[i]).name]=c.value;for(i in v)c=v[i],i=="children"||(i=="dangerouslySetInnerHTML"?r=c:i==="key"||i in d||A(n,i,null,c,l));for(i in d)c=d[i],i=="children"?m=c:i=="dangerouslySetInnerHTML"?a=c:i=="value"?h=c:i=="checked"?k=c:i==="key"||u&&typeof c!="function"||v[i]===c||A(n,i,c,v[i],l);if(a)u||r&&(a.__html===r.__html||a.__html===n.innerHTML)||(n.innerHTML=a.__html),e.__k=[];else if(r&&(n.innerHTML=""),tn(n,H(m)?m:[m],e,t,o,l&&y!=="foreignObject",_,s,_?_[0]:t.__k&&w(t,0),u,f),_!=null)for(i=_.length;i--;)_[i]!=null&&nn(_[i]);u||(i="value",h!==void 0&&(h!==n[i]||y==="progress"&&!h||y==="option"&&h!==v[i])&&A(n,i,h,v[i],!1),i="checked",k!==void 0&&k!==n[i]&&A(n,i,k,v[i],!1))}return n}function I(n,e,t){try{typeof n=="function"?n(e):n.current=e}catch(o){p.__e(o,t)}}function $(n,e,t){var o,l;if(p.unmount&&p.unmount(n),(o=n.ref)&&(o.current&&o.current!==n.__e||I(o,null,e)),(o=n.__c)!=null){if(o.componentWillUnmount)try{o.componentWillUnmount()}catch(_){p.__e(_,e)}o.base=o.__P=null,n.__c=void 0}if(o=n.__k)for(l=0;l<o.length;l++)o[l]&&$(o[l],e,t||typeof n.type!="function");t||n.__e==null||nn(n.__e),n.__=n.__e=n.__d=void 0}function dn(n,e,t){return this.constructor(n,t)}function hn(n,e,t){var o,l,_,s;p.__&&p.__(n,e),l=(o=typeof t=="function")?null:t&&t.__k||e.__k,_=[],s=[],B(e,n=(!o&&t||e).__k=R(P,null,[n]),l||E,E,e.ownerSVGElement!==void 0,!o&&t?[t]:l?null:e.firstChild?L.call(e.childNodes):null,_,!o&&t?t:l?l.__e:e.firstChild,o,s),on(_,n,s)}function V(n,e){hn(n,e,V)}L=Y.slice,p={__e:function(n,e,t,o){for(var l,_,s;e=e.__;)if((l=e.__c)&&!l.__)try{if((_=l.constructor)&&_.getDerivedStateFromError!=null&&(l.setState(_.getDerivedStateFromError(n)),s=l.__d),l.componentDidCatch!=null&&(l.componentDidCatch(n,o||{}),s=l.__d),s)return l.__E=l}catch(u){n=u}throw n}},Q=0,un=function(n){return n!=null&&n.constructor==null},j.prototype.setState=function(n,e){var t;t=this.__s!=null&&this.__s!==this.state?this.__s:this.__s=x({},this.state),typeof n=="function"&&(n=n(x({},t),this.props)),n&&x(t,n),n!=null&&this.__v&&(e&&this._sb.push(e),q(this))},j.prototype.forceUpdate=function(n){this.__v&&(this.__e=!0,n&&this.__h.push(n),q(this))},j.prototype.render=P,C=[],X=typeof Promise=="function"?Promise.prototype.then.bind(Promise.resolve()):setTimeout,N=function(n,e){return n.__v.__b-e.__v.__b},F.__r=0,sn=0;var vn=0,xn=Array.isArray;function ln(n,e,t,o,l,_){var s,u,f={};for(u in e)u=="ref"?s=e[u]:f[u]=e[u];var i={type:n,props:f,key:t,ref:s,__k:null,__:null,__b:0,__e:null,__d:void 0,__c:null,constructor:void 0,__v:--vn,__i:-1,__u:0,__source:l,__self:_};if(typeof n=="function"&&(s=n.defaultProps))for(u in s)f[u]===void 0&&(f[u]=s[u]);return p.vnode&&p.vnode(i),i}function O({data:n}){return ln("p",{class:"font-extralight",children:["Dear ",n.data," ",n.user," ",n.title]})}var _n=document.getElementById("root");if(_n){let e="/__"+new URL(window.location.href).pathname+"/props",t=AbortSignal.timeout(8e3);fetch(e,{signal:t}).then(o=>o.json()).then(o=>{V(R(O,{data:o}),_n)}).catch(o=>{console.error("Error fetching data:",o)})}\n`,
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
