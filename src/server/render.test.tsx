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
        `var I,k,ce,Fe,T,le,pe,G,Ne,F={},ae=[],He=/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i,Z=Array.isArray;function E(e,n){for(var t in n)e[t]=n[t];return e}function de(e){var n=e.parentNode;n&&n.removeChild(e)}function J(e,n,t){var r,o,l,f={};for(l in n)l=="key"?r=n[l]:l=="ref"?o=n[l]:f[l]=n[l];if(arguments.length>2&&(f.children=arguments.length>3?I.call(arguments,2):t),typeof e=="function"&&e.defaultProps!=null)for(l in e.defaultProps)f[l]===void 0&&(f[l]=e.defaultProps[l]);return $(e,f,r,o,null)}function $(e,n,t,r,o){var l={type:e,props:n,key:t,ref:r,__k:null,__:null,__b:0,__e:null,__d:void 0,__c:null,constructor:void 0,__v:o??++ce,__i:-1,__u:0};return o==null&&k.vnode!=null&&k.vnode(l),l}function B(e){return e.children}function j(e,n){this.props=e,this.context=n}function L(e,n){if(n==null)return e.__?L(e.__,e.__i+1):null;for(var t;n<e.__k.length;n++)if((t=e.__k[n])!=null&&t.__e!=null)return t.__e;return typeof e.type=="function"?L(e):null}function he(e){var n,t;if((e=e.__)!=null&&e.__c!=null){for(e.__e=e.__c.base=null,n=0;n<e.__k.length;n++)if((t=e.__k[n])!=null&&t.__e!=null){e.__e=e.__c.base=t.__e;break}return he(e)}}function ie(e){(!e.__d&&(e.__d=!0)&&T.push(e)&&!R.__r++||le!==k.debounceRendering)&&((le=k.debounceRendering)||pe)(R)}function R(){var e,n,t,r,o,l,f,s,c;for(T.sort(G);e=T.shift();)e.__d&&(n=T.length,r=void 0,l=(o=(t=e).__v).__e,s=[],c=[],(f=t.__P)&&((r=E({},o)).__v=o.__v+1,k.vnode&&k.vnode(r),K(f,r,o,t.__n,f.ownerSVGElement!==void 0,32&o.__u?[l]:null,s,l??L(o),!!(32&o.__u),c),r.__.__k[r.__i]=r,me(s,r,c),r.__e!=l&&he(r)),T.length>n&&T.sort(G));R.__r=0}function ve(e,n,t,r,o,l,f,s,c,i,p){var _,y,u,d,b,h=r&&r.__k||ae,a=n.length;for(t.__d=c,$e(t,n,h),c=t.__d,_=0;_<a;_++)(u=t.__k[_])!=null&&typeof u!="boolean"&&typeof u!="function"&&(y=u.__i===-1?F:h[u.__i]||F,u.__i=_,K(e,u,y,o,l,f,s,c,i,p),d=u.__e,u.ref&&y.ref!=u.ref&&(y.ref&&Q(y.ref,null,u),p.push(u.ref,u.__c||d,u)),b==null&&d!=null&&(b=d),65536&u.__u||y.__k===u.__k?c=ye(u,c,e):typeof u.type=="function"&&u.__d!==void 0?c=u.__d:d&&(c=d.nextSibling),u.__d=void 0,u.__u&=-196609);t.__d=c,t.__e=b}function $e(e,n,t){var r,o,l,f,s,c=n.length,i=t.length,p=i,_=0;for(e.__k=[],r=0;r<c;r++)(o=e.__k[r]=(o=n[r])==null||typeof o=="boolean"||typeof o=="function"?null:typeof o=="string"||typeof o=="number"||typeof o=="bigint"||o.constructor==String?$(null,o,null,null,o):Z(o)?$(B,{children:o},null,null,null):o.__b>0?$(o.type,o.props,o.key,o.ref?o.ref:null,o.__v):o)!=null?(o.__=e,o.__b=e.__b+1,s=je(o,t,f=r+_,p),o.__i=s,l=null,s!==-1&&(p--,(l=t[s])&&(l.__u|=131072)),l==null||l.__v===null?(s==-1&&_--,typeof o.type!="function"&&(o.__u|=65536)):s!==f&&(s===f+1?_++:s>f?p>c-f?_+=s-f:_--:_=s<f&&s==f-1?s-f:0,s!==r+_&&(o.__u|=65536))):(l=t[r])&&l.key==null&&l.__e&&(l.__e==e.__d&&(e.__d=L(l)),q(l,l,!1),t[r]=null,p--);if(p)for(r=0;r<i;r++)(l=t[r])!=null&&!(131072&l.__u)&&(l.__e==e.__d&&(e.__d=L(l)),q(l,l))}function ye(e,n,t){var r,o;if(typeof e.type=="function"){for(r=e.__k,o=0;r&&o<r.length;o++)r[o]&&(r[o].__=e,n=ye(r[o],n,t));return n}return e.__e!=n&&(t.insertBefore(e.__e,n||null),n=e.__e),n&&n.nextSibling}function je(e,n,t,r){var o=e.key,l=e.type,f=t-1,s=t+1,c=n[t];if(c===null||c&&o==c.key&&l===c.type)return t;if(r>(c!=null&&!(131072&c.__u)?1:0))for(;f>=0||s<n.length;){if(f>=0){if((c=n[f])&&!(131072&c.__u)&&o==c.key&&l===c.type)return f;f--}if(s<n.length){if((c=n[s])&&!(131072&c.__u)&&o==c.key&&l===c.type)return s;s++}}return-1}function ue(e,n,t){n[0]==="-"?e.setProperty(n,t??""):e[n]=t==null?"":typeof t!="number"||He.test(n)?t:t+"px"}function H(e,n,t,r,o){var l;e:if(n==="style")if(typeof t=="string")e.style.cssText=t;else{if(typeof r=="string"&&(e.style.cssText=r=""),r)for(n in r)t&&n in t||ue(e.style,n,"");if(t)for(n in t)r&&t[n]===r[n]||ue(e.style,n,t[n])}else if(n[0]==="o"&&n[1]==="n")l=n!==(n=n.replace(/(PointerCapture)$|Capture$/,"$1")),n=n.toLowerCase()in e?n.toLowerCase().slice(2):n.slice(2),e.l||(e.l={}),e.l[n+l]=t,t?r?t.u=r.u:(t.u=Date.now(),e.addEventListener(n,l?fe:se,l)):e.removeEventListener(n,l?fe:se,l);else{if(o)n=n.replace(/xlink(H|:h)/,"h").replace(/sName$/,"s");else if(n!=="width"&&n!=="height"&&n!=="href"&&n!=="list"&&n!=="form"&&n!=="tabIndex"&&n!=="download"&&n!=="rowSpan"&&n!=="colSpan"&&n!=="role"&&n in e)try{e[n]=t??"";break e}catch{}typeof t=="function"||(t==null||t===!1&&n[4]!=="-"?e.removeAttribute(n):e.setAttribute(n,t))}}function se(e){var n=this.l[e.type+!1];if(e.t){if(e.t<=n.u)return}else e.t=Date.now();return n(k.event?k.event(e):e)}function fe(e){return this.l[e.type+!0](k.event?k.event(e):e)}function K(e,n,t,r,o,l,f,s,c,i){var p,_,y,u,d,b,h,a,v,x,P,C,M,w,U,m=n.type;if(n.constructor!==void 0)return null;128&t.__u&&(c=!!(32&t.__u),l=[s=n.__e=t.__e]),(p=k.__b)&&p(n);e:if(typeof m=="function")try{if(a=n.props,v=(p=m.contextType)&&r[p.__c],x=p?v?v.props.value:p.__:r,t.__c?h=(_=n.__c=t.__c).__=_.__E:("prototype"in m&&m.prototype.render?n.__c=_=new m(a,x):(n.__c=_=new j(a,x),_.constructor=m,_.render=Ie),v&&v.sub(_),_.props=a,_.state||(_.state={}),_.context=x,_.__n=r,y=_.__d=!0,_.__h=[],_._sb=[]),_.__s==null&&(_.__s=_.state),m.getDerivedStateFromProps!=null&&(_.__s==_.state&&(_.__s=E({},_.__s)),E(_.__s,m.getDerivedStateFromProps(a,_.__s))),u=_.props,d=_.state,_.__v=n,y)m.getDerivedStateFromProps==null&&_.componentWillMount!=null&&_.componentWillMount(),_.componentDidMount!=null&&_.__h.push(_.componentDidMount);else{if(m.getDerivedStateFromProps==null&&a!==u&&_.componentWillReceiveProps!=null&&_.componentWillReceiveProps(a,x),!_.__e&&(_.shouldComponentUpdate!=null&&_.shouldComponentUpdate(a,_.__s,x)===!1||n.__v===t.__v)){for(n.__v!==t.__v&&(_.props=a,_.state=_.__s,_.__d=!1),n.__e=t.__e,n.__k=t.__k,n.__k.forEach(function(S){S&&(S.__=n)}),P=0;P<_._sb.length;P++)_.__h.push(_._sb[P]);_._sb=[],_.__h.length&&f.push(_);break e}_.componentWillUpdate!=null&&_.componentWillUpdate(a,_.__s,x),_.componentDidUpdate!=null&&_.__h.push(function(){_.componentDidUpdate(u,d,b)})}if(_.context=x,_.props=a,_.__P=e,_.__e=!1,C=k.__r,M=0,"prototype"in m&&m.prototype.render){for(_.state=_.__s,_.__d=!1,C&&C(n),p=_.render(_.props,_.state,_.context),w=0;w<_._sb.length;w++)_.__h.push(_._sb[w]);_._sb=[]}else do _.__d=!1,C&&C(n),p=_.render(_.props,_.state,_.context),_.state=_.__s;while(_.__d&&++M<25);_.state=_.__s,_.getChildContext!=null&&(r=E(E({},r),_.getChildContext())),y||_.getSnapshotBeforeUpdate==null||(b=_.getSnapshotBeforeUpdate(u,d)),ve(e,Z(U=p!=null&&p.type===B&&p.key==null?p.props.children:p)?U:[U],n,t,r,o,l,f,s,c,i),_.base=n.__e,n.__u&=-161,_.__h.length&&f.push(_),h&&(_.__E=_.__=null)}catch(S){n.__v=null,c||l!=null?(n.__e=s,n.__u|=c?160:32,l[l.indexOf(s)]=null):(n.__e=t.__e,n.__k=t.__k),k.__e(S,n,t)}else l==null&&n.__v===t.__v?(n.__k=t.__k,n.__e=t.__e):n.__e=Re(t.__e,n,t,r,o,l,f,c,i);(p=k.diffed)&&p(n)}function me(e,n,t){n.__d=void 0;for(var r=0;r<t.length;r++)Q(t[r],t[++r],t[++r]);k.__c&&k.__c(n,e),e.some(function(o){try{e=o.__h,o.__h=[],e.some(function(l){l.call(o)})}catch(l){k.__e(l,o.__v)}})}function Re(e,n,t,r,o,l,f,s,c){var i,p,_,y,u,d,b,h=t.props,a=n.props,v=n.type;if(v==="svg"&&(o=!0),l!=null){for(i=0;i<l.length;i++)if((u=l[i])&&"setAttribute"in u==!!v&&(v?u.localName===v:u.nodeType===3)){e=u,l[i]=null;break}}if(e==null){if(v===null)return document.createTextNode(a);e=o?document.createElementNS("http://www.w3.org/2000/svg",v):document.createElement(v,a.is&&a),l=null,s=!1}if(v===null)h===a||s&&e.data===a||(e.data=a);else{if(l=l&&I.call(e.childNodes),h=t.props||F,!s&&l!=null)for(h={},i=0;i<e.attributes.length;i++)h[(u=e.attributes[i]).name]=u.value;for(i in h)u=h[i],i=="children"||(i=="dangerouslySetInnerHTML"?_=u:i==="key"||i in a||H(e,i,null,u,o));for(i in a)u=a[i],i=="children"?y=u:i=="dangerouslySetInnerHTML"?p=u:i=="value"?d=u:i=="checked"?b=u:i==="key"||s&&typeof u!="function"||h[i]===u||H(e,i,u,h[i],o);if(p)s||_&&(p.__html===_.__html||p.__html===e.innerHTML)||(e.innerHTML=p.__html),n.__k=[];else if(_&&(e.innerHTML=""),ve(e,Z(y)?y:[y],n,t,r,o&&v!=="foreignObject",l,f,l?l[0]:t.__k&&L(t,0),s,c),l!=null)for(i=l.length;i--;)l[i]!=null&&de(l[i]);s||(i="value",d!==void 0&&(d!==e[i]||v==="progress"&&!d||v==="option"&&d!==h[i])&&H(e,i,d,h[i],!1),i="checked",b!==void 0&&b!==e[i]&&H(e,i,b,h[i],!1))}return e}function Q(e,n,t){try{typeof e=="function"?e(n):e.current=n}catch(r){k.__e(r,t)}}function q(e,n,t){var r,o;if(k.unmount&&k.unmount(e),(r=e.ref)&&(r.current&&r.current!==e.__e||Q(r,null,n)),(r=e.__c)!=null){if(r.componentWillUnmount)try{r.componentWillUnmount()}catch(l){k.__e(l,n)}r.base=r.__P=null,e.__c=void 0}if(r=e.__k)for(o=0;o<r.length;o++)r[o]&&q(r[o],n,t||typeof e.type!="function");t||e.__e==null||de(e.__e),e.__=e.__e=e.__d=void 0}function Ie(e,n,t){return this.constructor(e,t)}function Be(e,n,t){var r,o,l,f;k.__&&k.__(e,n),o=(r=typeof t=="function")?null:t&&t.__k||n.__k,l=[],f=[],K(n,e=(!r&&t||n).__k=J(B,null,[e]),o||F,F,n.ownerSVGElement!==void 0,!r&&t?[t]:o?null:n.firstChild?I.call(n.childNodes):null,l,!r&&t?t:o?o.__e:n.firstChild,r,f),me(l,e,f)}function X(e,n){Be(e,n,X)}I=ae.slice,k={__e:function(e,n,t,r){for(var o,l,f;n=n.__;)if((o=n.__c)&&!o.__)try{if((l=o.constructor)&&l.getDerivedStateFromError!=null&&(o.setState(l.getDerivedStateFromError(e)),f=o.__d),o.componentDidCatch!=null&&(o.componentDidCatch(e,r||{}),f=o.__d),f)return o.__E=o}catch(s){e=s}throw e}},ce=0,Fe=function(e){return e!=null&&e.constructor==null},j.prototype.setState=function(e,n){var t;t=this.__s!=null&&this.__s!==this.state?this.__s:this.__s=E({},this.state),typeof e=="function"&&(e=e(E({},t),this.props)),e&&E(t,e),e!=null&&this.__v&&(n&&this._sb.push(n),ie(this))},j.prototype.forceUpdate=function(e){this.__v&&(this.__e=!0,e&&this.__h.push(e),ie(this))},j.prototype.render=B,T=[],pe=typeof Promise=="function"?Promise.prototype.then.bind(Promise.resolve()):setTimeout,G=function(e,n){return e.__v.__b-n.__v.__b},R.__r=0,Ne=0;var Pe,g,we,Oe,W,ge,Se,ee,Ve,ne={},Ee=[],ze=/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i,_e=Array.isArray;function D(e,n){for(var t in n)e[t]=n[t];return e}function De(e){var n=e.parentNode;n&&n.removeChild(e)}function Y(e,n,t,r,o){var l={type:e,props:n,key:t,ref:r,__k:null,__:null,__b:0,__e:null,__d:void 0,__c:null,constructor:void 0,__v:o??++we,__i:-1,__u:0};return o==null&&g.vnode!=null&&g.vnode(l),l}function N(e){return e.children}function V(e,n){this.props=e,this.context=n}function A(e,n){if(n==null)return e.__?A(e.__,e.__i+1):null;for(var t;n<e.__k.length;n++)if((t=e.__k[n])!=null&&t.__e!=null)return t.__e;return typeof e.type=="function"?A(e):null}function Ue(e){var n,t;if((e=e.__)!=null&&e.__c!=null){for(e.__e=e.__c.base=null,n=0;n<e.__k.length;n++)if((t=e.__k[n])!=null&&t.__e!=null){e.__e=e.__c.base=t.__e;break}return Ue(e)}}function ke(e){(!e.__d&&(e.__d=!0)&&W.push(e)&&!z.__r++||ge!==g.debounceRendering)&&((ge=g.debounceRendering)||Se)(z)}function z(){var e,n,t,r,o,l,f,s,c;for(W.sort(ee);e=W.shift();)e.__d&&(n=W.length,r=void 0,l=(o=(t=e).__v).__e,s=[],c=[],(f=t.__P)&&((r=D({},o)).__v=o.__v+1,g.vnode&&g.vnode(r),Le(f,r,o,t.__n,f.ownerSVGElement!==void 0,32&o.__u?[l]:null,s,l??A(o),!!(32&o.__u),c),r.__.__k[r.__i]=r,Ze(s,r,c),r.__e!=l&&Ue(r)),W.length>n&&W.sort(ee));z.__r=0}function Te(e,n,t,r,o,l,f,s,c,i,p){var _,y,u,d,b,h=r&&r.__k||Ee,a=n.length;for(t.__d=c,Ge(t,n,h),c=t.__d,_=0;_<a;_++)(u=t.__k[_])!=null&&typeof u!="boolean"&&typeof u!="function"&&(y=u.__i===-1?ne:h[u.__i]||ne,u.__i=_,Le(e,u,y,o,l,f,s,c,i,p),d=u.__e,u.ref&&y.ref!=u.ref&&(y.ref&&oe(y.ref,null,u),p.push(u.ref,u.__c||d,u)),b==null&&d!=null&&(b=d),65536&u.__u||y.__k===u.__k?c=We(u,c,e):typeof u.type=="function"&&u.__d!==void 0?c=u.__d:d&&(c=d.nextSibling),u.__d=void 0,u.__u&=-196609);t.__d=c,t.__e=b}function Ge(e,n,t){var r,o,l,f,s,c=n.length,i=t.length,p=i,_=0;for(e.__k=[],r=0;r<c;r++)(o=e.__k[r]=(o=n[r])==null||typeof o=="boolean"||typeof o=="function"?null:typeof o=="string"||typeof o=="number"||typeof o=="bigint"||o.constructor==String?Y(null,o,null,null,o):_e(o)?Y(N,{children:o},null,null,null):o.__b>0?Y(o.type,o.props,o.key,o.ref?o.ref:null,o.__v):o)!=null?(o.__=e,o.__b=e.__b+1,s=qe(o,t,f=r+_,p),o.__i=s,l=null,s!==-1&&(p--,(l=t[s])&&(l.__u|=131072)),l==null||l.__v===null?(s==-1&&_--,typeof o.type!="function"&&(o.__u|=65536)):s!==f&&(s===f+1?_++:s>f?p>c-f?_+=s-f:_--:_=s<f&&s==f-1?s-f:0,s!==r+_&&(o.__u|=65536))):(l=t[r])&&l.key==null&&l.__e&&(l.__e==e.__d&&(e.__d=A(l)),te(l,l,!1),t[r]=null,p--);if(p)for(r=0;r<i;r++)(l=t[r])!=null&&!(131072&l.__u)&&(l.__e==e.__d&&(e.__d=A(l)),te(l,l))}function We(e,n,t){var r,o;if(typeof e.type=="function"){for(r=e.__k,o=0;r&&o<r.length;o++)r[o]&&(r[o].__=e,n=We(r[o],n,t));return n}return e.__e!=n&&(t.insertBefore(e.__e,n||null),n=e.__e),n&&n.nextSibling}function qe(e,n,t,r){var o=e.key,l=e.type,f=t-1,s=t+1,c=n[t];if(c===null||c&&o==c.key&&l===c.type)return t;if(r>(c!=null&&!(131072&c.__u)?1:0))for(;f>=0||s<n.length;){if(f>=0){if((c=n[f])&&!(131072&c.__u)&&o==c.key&&l===c.type)return f;f--}if(s<n.length){if((c=n[s])&&!(131072&c.__u)&&o==c.key&&l===c.type)return s;s++}}return-1}function be(e,n,t){n[0]==="-"?e.setProperty(n,t??""):e[n]=t==null?"":typeof t!="number"||ze.test(n)?t:t+"px"}function O(e,n,t,r,o){var l;e:if(n==="style")if(typeof t=="string")e.style.cssText=t;else{if(typeof r=="string"&&(e.style.cssText=r=""),r)for(n in r)t&&n in t||be(e.style,n,"");if(t)for(n in t)r&&t[n]===r[n]||be(e.style,n,t[n])}else if(n[0]==="o"&&n[1]==="n")l=n!==(n=n.replace(/(PointerCapture)$|Capture$/,"$1")),n=n.toLowerCase()in e?n.toLowerCase().slice(2):n.slice(2),e.l||(e.l={}),e.l[n+l]=t,t?r?t.u=r.u:(t.u=Date.now(),e.addEventListener(n,l?Ce:xe,l)):e.removeEventListener(n,l?Ce:xe,l);else{if(o)n=n.replace(/xlink(H|:h)/,"h").replace(/sName$/,"s");else if(n!=="width"&&n!=="height"&&n!=="href"&&n!=="list"&&n!=="form"&&n!=="tabIndex"&&n!=="download"&&n!=="rowSpan"&&n!=="colSpan"&&n!=="role"&&n in e)try{e[n]=t??"";break e}catch{}typeof t=="function"||(t==null||t===!1&&n[4]!=="-"?e.removeAttribute(n):e.setAttribute(n,t))}}function xe(e){var n=this.l[e.type+!1];if(e.t){if(e.t<=n.u)return}else e.t=Date.now();return n(g.event?g.event(e):e)}function Ce(e){return this.l[e.type+!0](g.event?g.event(e):e)}function Le(e,n,t,r,o,l,f,s,c,i){var p,_,y,u,d,b,h,a,v,x,P,C,M,w,U,m=n.type;if(n.constructor!==void 0)return null;128&t.__u&&(c=!!(32&t.__u),l=[s=n.__e=t.__e]),(p=g.__b)&&p(n);e:if(typeof m=="function")try{if(a=n.props,v=(p=m.contextType)&&r[p.__c],x=p?v?v.props.value:p.__:r,t.__c?h=(_=n.__c=t.__c).__=_.__E:("prototype"in m&&m.prototype.render?n.__c=_=new m(a,x):(n.__c=_=new V(a,x),_.constructor=m,_.render=Ke),v&&v.sub(_),_.props=a,_.state||(_.state={}),_.context=x,_.__n=r,y=_.__d=!0,_.__h=[],_._sb=[]),_.__s==null&&(_.__s=_.state),m.getDerivedStateFromProps!=null&&(_.__s==_.state&&(_.__s=D({},_.__s)),D(_.__s,m.getDerivedStateFromProps(a,_.__s))),u=_.props,d=_.state,_.__v=n,y)m.getDerivedStateFromProps==null&&_.componentWillMount!=null&&_.componentWillMount(),_.componentDidMount!=null&&_.__h.push(_.componentDidMount);else{if(m.getDerivedStateFromProps==null&&a!==u&&_.componentWillReceiveProps!=null&&_.componentWillReceiveProps(a,x),!_.__e&&(_.shouldComponentUpdate!=null&&_.shouldComponentUpdate(a,_.__s,x)===!1||n.__v===t.__v)){for(n.__v!==t.__v&&(_.props=a,_.state=_.__s,_.__d=!1),n.__e=t.__e,n.__k=t.__k,n.__k.forEach(function(S){S&&(S.__=n)}),P=0;P<_._sb.length;P++)_.__h.push(_._sb[P]);_._sb=[],_.__h.length&&f.push(_);break e}_.componentWillUpdate!=null&&_.componentWillUpdate(a,_.__s,x),_.componentDidUpdate!=null&&_.__h.push(function(){_.componentDidUpdate(u,d,b)})}if(_.context=x,_.props=a,_.__P=e,_.__e=!1,C=g.__r,M=0,"prototype"in m&&m.prototype.render){for(_.state=_.__s,_.__d=!1,C&&C(n),p=_.render(_.props,_.state,_.context),w=0;w<_._sb.length;w++)_.__h.push(_._sb[w]);_._sb=[]}else do _.__d=!1,C&&C(n),p=_.render(_.props,_.state,_.context),_.state=_.__s;while(_.__d&&++M<25);_.state=_.__s,_.getChildContext!=null&&(r=D(D({},r),_.getChildContext())),y||_.getSnapshotBeforeUpdate==null||(b=_.getSnapshotBeforeUpdate(u,d)),Te(e,_e(U=p!=null&&p.type===N&&p.key==null?p.props.children:p)?U:[U],n,t,r,o,l,f,s,c,i),_.base=n.__e,n.__u&=-161,_.__h.length&&f.push(_),h&&(_.__E=_.__=null)}catch(S){n.__v=null,c||l!=null?(n.__e=s,n.__u|=c?160:32,l[l.indexOf(s)]=null):(n.__e=t.__e,n.__k=t.__k),g.__e(S,n,t)}else l==null&&n.__v===t.__v?(n.__k=t.__k,n.__e=t.__e):n.__e=Je(t.__e,n,t,r,o,l,f,c,i);(p=g.diffed)&&p(n)}function Ze(e,n,t){n.__d=void 0;for(var r=0;r<t.length;r++)oe(t[r],t[++r],t[++r]);g.__c&&g.__c(n,e),e.some(function(o){try{e=o.__h,o.__h=[],e.some(function(l){l.call(o)})}catch(l){g.__e(l,o.__v)}})}function Je(e,n,t,r,o,l,f,s,c){var i,p,_,y,u,d,b,h=t.props,a=n.props,v=n.type;if(v==="svg"&&(o=!0),l!=null){for(i=0;i<l.length;i++)if((u=l[i])&&"setAttribute"in u==!!v&&(v?u.localName===v:u.nodeType===3)){e=u,l[i]=null;break}}if(e==null){if(v===null)return document.createTextNode(a);e=o?document.createElementNS("http://www.w3.org/2000/svg",v):document.createElement(v,a.is&&a),l=null,s=!1}if(v===null)h===a||s&&e.data===a||(e.data=a);else{if(l=l&&Pe.call(e.childNodes),h=t.props||ne,!s&&l!=null)for(h={},i=0;i<e.attributes.length;i++)h[(u=e.attributes[i]).name]=u.value;for(i in h)u=h[i],i=="children"||(i=="dangerouslySetInnerHTML"?_=u:i==="key"||i in a||O(e,i,null,u,o));for(i in a)u=a[i],i=="children"?y=u:i=="dangerouslySetInnerHTML"?p=u:i=="value"?d=u:i=="checked"?b=u:i==="key"||s&&typeof u!="function"||h[i]===u||O(e,i,u,h[i],o);if(p)s||_&&(p.__html===_.__html||p.__html===e.innerHTML)||(e.innerHTML=p.__html),n.__k=[];else if(_&&(e.innerHTML=""),Te(e,_e(y)?y:[y],n,t,r,o&&v!=="foreignObject",l,f,l?l[0]:t.__k&&A(t,0),s,c),l!=null)for(i=l.length;i--;)l[i]!=null&&De(l[i]);s||(i="value",d!==void 0&&(d!==e[i]||v==="progress"&&!d||v==="option"&&d!==h[i])&&O(e,i,d,h[i],!1),i="checked",b!==void 0&&b!==e[i]&&O(e,i,b,h[i],!1))}return e}function oe(e,n,t){try{typeof e=="function"?e(n):e.current=n}catch(r){g.__e(r,t)}}function te(e,n,t){var r,o;if(g.unmount&&g.unmount(e),(r=e.ref)&&(r.current&&r.current!==e.__e||oe(r,null,n)),(r=e.__c)!=null){if(r.componentWillUnmount)try{r.componentWillUnmount()}catch(l){g.__e(l,n)}r.base=r.__P=null,e.__c=void 0}if(r=e.__k)for(o=0;o<r.length;o++)r[o]&&te(r[o],n,t||typeof e.type!="function");t||e.__e==null||De(e.__e),e.__=e.__e=e.__d=void 0}function Ke(e,n,t){return this.constructor(e,t)}Pe=Ee.slice,g={__e:function(e,n,t,r){for(var o,l,f;n=n.__;)if((o=n.__c)&&!o.__)try{if((l=o.constructor)&&l.getDerivedStateFromError!=null&&(o.setState(l.getDerivedStateFromError(e)),f=o.__d),o.componentDidCatch!=null&&(o.componentDidCatch(e,r||{}),f=o.__d),f)return o.__E=o}catch(s){e=s}throw e}},we=0,Oe=function(e){return e!=null&&e.constructor==null},V.prototype.setState=function(e,n){var t;t=this.__s!=null&&this.__s!==this.state?this.__s:this.__s=D({},this.state),typeof e=="function"&&(e=e(D({},t),this.props)),e&&D(t,e),e!=null&&this.__v&&(n&&this._sb.push(n),ke(this))},V.prototype.forceUpdate=function(e){this.__v&&(this.__e=!0,e&&this.__h.push(e),ke(this))},V.prototype.render=N,W=[],Se=typeof Promise=="function"?Promise.prototype.then.bind(Promise.resolve()):setTimeout,ee=function(e,n){return e.__v.__b-n.__v.__b},z.__r=0,Ve=0;var Qe=0,tn=Array.isArray;function Ae(e,n,t,r,o,l){var f,s,c={};for(s in n)s=="ref"?f=n[s]:c[s]=n[s];var i={type:e,props:c,key:t,ref:f,__k:null,__:null,__b:0,__e:null,__d:void 0,__c:null,constructor:void 0,__v:--Qe,__i:-1,__u:0,__source:o,__self:l};if(typeof e=="function"&&(f=e.defaultProps))for(s in f)c[s]===void 0&&(c[s]=f[s]);return g.vnode&&g.vnode(i),i}function re({data:e}){return Ae("p",{class:"font-extralight",children:["Dear ",e.data," ",e.user," ",e.title]})}var Me=document.getElementById("root");if(Me){let e=new URL(window.location.href);fetch("/__"+e.pathname+"/props").then(n=>n.json()).then(n=>{X(J(re,{data:n}),Me)}).catch(n=>{console.error("Error fetching data:",n)})}\n`,
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
