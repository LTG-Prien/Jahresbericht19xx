// npm-js: fastest-levenshtein
/*
 * MIT License
 * 
 * Copyright (c) 2020 Kasper Unn Weihe
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
*/
var peq=new Uint32Array(65536),myers_32=function(r,e){for(var t=r.length,a=e.length,n=1<<t-1,h=-1,o=0,c=t,f=t;f--;)peq[r.charCodeAt(f)]|=1<<f;for(f=0;f<a;f++){var l=peq[e.charCodeAt(f)],v=l|o;(o|=~((l|=(l&h)+h^h)|h))&n&&c++,(h&=l)&n&&c--,h=h<<1|~(v|(o=o<<1|1)),o&=v}for(f=t;f--;)peq[r.charCodeAt(f)]=0;return c},myers_x=function(r,e){for(var t=e.length,a=r.length,n=[],h=[],o=Math.ceil(t/32),c=Math.ceil(a/32),f=0;f<o;f++)h[f]=-1,n[f]=0;for(var l=0;l<c-1;l++){for(var v=0,p=-1,q=32*l,A=Math.min(32,a)+q,d=q;d<A;d++)peq[r.charCodeAt(d)]|=1<<d;for(f=0;f<t;f++){var g=peq[e.charCodeAt(f)],i=h[f/32|0]>>>f&1,C=g|v,m=p&(w=((g|(x=n[f/32|0]>>>f&1))&p)+p^p|g|x);(U=v|~(w|p))>>>31^i&&(h[f/32|0]^=1<<f),m>>>31^x&&(n[f/32|0]^=1<<f),p=(m=m<<1|x)|~(C|(U=U<<1|i)),v=U&C}for(d=q;d<A;d++)peq[r.charCodeAt(d)]=0}for(var u=0,s=-1,y=32*l,M=Math.min(32,a-y)+y,d=y;d<M;d++)peq[r.charCodeAt(d)]|=1<<d;for(var _=a,f=0;f<t;f++){var x,w,U,g=peq[e.charCodeAt(f)],i=h[f/32|0]>>>f&1,C=g|u;_+=(U=u|~((w=((g|(x=n[f/32|0]>>>f&1))&s)+s^s|g|x)|s))>>>a-1&1,_-=(m=s&w)>>>a-1&1,U>>>31^i&&(h[f/32|0]^=1<<f),m>>>31^x&&(n[f/32|0]^=1<<f),s=(m=m<<1|x)|~(C|(U=U<<1|i)),u=U&C}for(d=y;d<M;d++)peq[r.charCodeAt(d)]=0;return _},levenshtein=function(r,e){var t;return r.length<e.length&&(t=e,e=r,r=t),0===e.length?r.length:(r.length<=32?myers_32:myers_x)(r,e)};