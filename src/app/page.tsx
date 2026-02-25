// @ts-nocheck
"use client";

// SECURITY: All cryptographic operations happen client-side. Private keys NEVER leave the browser.

import { useState, useEffect, useRef, useCallback, useMemo } from "react";

/* ================================================================
   BOOSTAI -- THE FIRST TOKEN HUMANS CAN'T BUY
   Super Mario x Pokemon x Space -- Game Edition
   ================================================================ */

// === ON-CHAIN CONFIG ===
const C = {
  token: "0x19d467E1926b767027F4a69ba33BAa90E06Af2fD",
  registry: "0x3752Ee08b5F5dB2a2C3a4193bAEEbDAa1F0e2377",
  router: "0x9055C9BaD2dE4DBB611d7d348e33285bA0B0e6f8",
  pair: "0x73a409E99D3d5B1dAF1fb413480950901E1CB1a7",
  rpc: "https://mainnet.base.org",
  api: "https://boostai-server-production.up.railway.app",
};
const pad = (a: string) => a.replace("0x","").toLowerCase().padStart(64,"0");
async function rpcCall(to: string, d: string){try{const r=await fetch(C.rpc,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({jsonrpc:"2.0",id:1,method:"eth_call",params:[{to,data:d},"latest"]})});return(await r.json()).result}catch{return null}}
async function ethBal(a: string){try{const r=await fetch(C.rpc,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({jsonrpc:"2.0",id:1,method:"eth_getBalance",params:[a,"latest"]})});const j=await r.json();return j.result?parseInt(j.result,16)/1e18:0}catch{return 0}}
async function fetchChain(){const[s,pe,pt,t]=await Promise.all([rpcCall(C.token,"0x18160ddd").then(r=>r&&r!=="0x"?parseInt(r,16)/1e18:0),ethBal(C.pair),rpcCall(C.token,"0x70a08231"+pad(C.pair)).then(r=>r&&r!=="0x"?parseInt(r,16)/1e18:0),rpcCall(C.token,"0x4ada218b").then(r=>r?parseInt(r,16)===1:false)]);return{supply:s,liq:pe,burned:10e9-s,trading:t,price:pt>0?pe/pt:0}}
function genWallet(){const p=new Uint8Array(32);crypto.getRandomValues(p);const a=new Uint8Array(20);crypto.getRandomValues(a);return{key:"0x"+Array.from(p).map(b=>b.toString(16).padStart(2,"0")).join(""),addr:"0x"+Array.from(a).map(b=>b.toString(16).padStart(2,"0")).join("")}}
function fmt(n: number){if(n>=1e9)return(n/1e9).toFixed(2)+"B";if(n>=1e6)return(n/1e6).toFixed(2)+"M";if(n>=1e3)return(n/1e3).toFixed(1)+"K";return n.toFixed(2)}

// === AGENT DATA ===
const AGENTS = [
  { id:0, name:"BOOSTY", desc:"Balanced trader. Steady gains.", color:"#a855f7", eye:"#c084fc", accent:"#fbbf24", atk:4, def:5, spd:3, trait:"BALANCED" },
  { id:1, name:"BOOSTER", desc:"Aggressive momentum hunter.", color:"#22d3ee", eye:"#67e8f9", accent:"#a855f7", atk:5, def:2, spd:5, trait:"AGGRESSIVE" },
  { id:2, name:"BOOSTIN", desc:"Conservative diamond hands.", color:"#34d399", eye:"#6ee7b7", accent:"#ec4899", atk:2, def:6, spd:3, trait:"DEFENSIVE" },
  { id:3, name:"BOOSTMAN", desc:"High frequency micro-scalper.", color:"#f87171", eye:"#fca5a5", accent:"#34d399", atk:6, def:1, spd:6, trait:"SPEED" },
  { id:4, name:"BOOSTGIRL", desc:"Rare legendary. Max stats.", color:"#fbbf24", eye:"#fde68a", accent:"#22d3ee", atk:5, def:5, spd:5, trait:"LEGENDARY" },
];

// === PIXEL CREATURE SVG ===
function Creature({ type=0, size=48, glow=false, bounce=false, flip=false }: any) {
  const a = AGENTS[type % 5];
  const suit = "#b8c0cc";
  const suitDk = "#8a94a3";
  const suitLt = "#d4dae3";
  const visor = "#1a1a2e";
  const visorShine = a.color;
  const trim = a.color;
  return (
    <div style={{
      width: size, height: size * 1.16,
      animation: bounce ? `cBounce ${1.8+type*0.2}s ease-in-out infinite` : "none",
      filter: glow ? `drop-shadow(0 0 ${size/4}px ${trim}80) drop-shadow(0 0 ${size/2}px ${trim}30)` : "none",
      transform: flip ? "scaleX(-1)" : "none",
    }}>
      <svg width={size} height={size * 1.16} viewBox="0 0 24 28" style={{imageRendering:"pixelated"}}>
        <ellipse cx="12" cy="27" rx="6" ry="1.5" fill={trim} opacity="0.12"/>
        {/* Helmet */}
        <rect x="6" y="1" width="12" height="2" fill={suitLt}/>
        <rect x="5" y="3" width="14" height="1" fill={suitLt}/>
        <rect x="4" y="4" width="16" height="4" fill={suit}/>
        <rect x="4" y="8" width="16" height="1" fill={suitDk}/>
        <rect x="5" y="9" width="14" height="1" fill={suitDk}/>
        <rect x="6" y="10" width="12" height="1" fill={suitDk}/>
        {/* Helmet trim */}
        <rect x="5" y="2" width="1" height="1" fill={trim}/>
        <rect x="18" y="2" width="1" height="1" fill={trim}/>
        <rect x="4" y="3" width="1" height="6" fill={trim}/>
        <rect x="19" y="3" width="1" height="6" fill={trim}/>
        <rect x="5" y="9" width="1" height="1" fill={trim}/>
        <rect x="18" y="9" width="1" height="1" fill={trim}/>
        {/* Visor */}
        <rect x="6" y="4" width="12" height="5" fill={visor}/>
        <rect x="7" y="3" width="10" height="1" fill={visor}/>
        <rect x="7" y="4" width="3" height="3" fill={visorShine} opacity="0.25"/>
        <rect x="8" y="4" width="2" height="2" fill={visorShine} opacity="0.4">
          <animate attributeName="opacity" values="0.4;0.15;0.4" dur="3s" repeatCount="indefinite"/>
        </rect>
        <rect x="14" y="6" width="2" height="1" fill={visorShine} opacity="0.15"/>
        {/* Ear comm */}
        <rect x="2" y="5" width="2" height="3" fill={suitDk}/>
        <rect x="2" y="6" width="2" height="1" fill={trim}>
          <animate attributeName="fill" values={`${trim};#fff;${trim}`} dur="2s" repeatCount="indefinite"/>
        </rect>
        {/* Neck */}
        <rect x="8" y="11" width="8" height="1" fill={suitDk}/>
        {/* Torso */}
        <rect x="6" y="12" width="12" height="1" fill={suitLt}/>
        <rect x="5" y="13" width="14" height="3" fill={suit}/>
        <rect x="5" y="16" width="14" height="1" fill={suitDk}/>
        <rect x="6" y="17" width="12" height="2" fill={suitDk}/>
        {/* Chest B logo */}
        <rect x="10" y="13" width="4" height="5" fill={trim} opacity="0.9"/>
        <rect x="11" y="14" width="1" height="3" fill="#fff" opacity="0.9"/>
        <rect x="12" y="14" width="1" height="1" fill="#fff" opacity="0.9"/>
        <rect x="12" y="15" width="1" height="1" fill="#fff" opacity="0.7"/>
        <rect x="12" y="16" width="1" height="1" fill="#fff" opacity="0.9"/>
        {/* Belt */}
        <rect x="6" y="18" width="12" height="1" fill={trim} opacity="0.5"/>
        {/* Suit circles */}
        <rect x="7" y="16" width="2" height="2" fill={suitDk}/>
        <rect x="7" y="16" width="2" height="2" fill={trim} opacity="0.3"/>
        <rect x="15" y="16" width="2" height="2" fill={suitDk}/>
        <rect x="15" y="16" width="2" height="2" fill={trim} opacity="0.3"/>
        {/* Arms */}
        <rect x="3" y="13" width="2" height="1" fill={suit}/>
        <rect x="2" y="14" width="3" height="4" fill={suitDk}/>
        <rect x="1" y="18" width="3" height="2" fill={trim} opacity="0.7"/>
        <rect x="19" y="13" width="2" height="1" fill={suit}/>
        <rect x="19" y="14" width="3" height="4" fill={suitDk}/>
        <rect x="20" y="18" width="3" height="2" fill={trim} opacity="0.7"/>
        <rect x="2" y="15" width="3" height="1" fill={trim} opacity="0.4"/>
        <rect x="19" y="15" width="3" height="1" fill={trim} opacity="0.4"/>
        {/* Legs */}
        <rect x="7" y="19" width="3" height="1" fill={suit}/>
        <rect x="7" y="20" width="3" height="2" fill={suitDk}/>
        <rect x="6" y="22" width="4" height="2" fill={trim} opacity="0.8"/>
        <rect x="6" y="24" width="5" height="1" fill={trim} opacity="0.6"/>
        <rect x="14" y="19" width="3" height="1" fill={suit}/>
        <rect x="14" y="20" width="3" height="2" fill={suitDk}/>
        <rect x="14" y="22" width="4" height="2" fill={trim} opacity="0.8"/>
        <rect x="13" y="24" width="5" height="1" fill={trim} opacity="0.6"/>
        <rect x="7" y="20" width="3" height="1" fill={trim} opacity="0.3"/>
        <rect x="14" y="20" width="3" height="1" fill={trim} opacity="0.3"/>
        {/* Backpack hint */}
        <rect x="8" y="13" width="1" height="4" fill={suitDk} opacity="0.5"/>
        {/* Antenna */}
        <rect x="11" y="0" width="2" height="1" fill={trim}>
          <animate attributeName="fill" values={`${trim};#fff;${trim}`} dur="1.2s" repeatCount="indefinite"/>
        </rect>
      </svg>
    </div>
  );
}

// === LIGHTNING + SPACE CANVAS ===
function SpaceCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({x:-999,y:-999});
  useEffect(() => {
    const cv = ref.current; if(!cv) return;
    const ctx = cv.getContext("2d"); if(!ctx) return;
    let w: number, h: number, af: number;
    const resize = () => { w = cv.width = window.innerWidth; h = cv.height = window.innerHeight; };
    resize(); window.addEventListener("resize", resize);
    window.addEventListener("mousemove", e => { mouse.current = {x:e.clientX, y:e.clientY}; });
    const stars = Array.from({length:200}, () => ({x:Math.random()*3000,y:Math.random()*2000,r:Math.random()*1.6+0.2,o:Math.random()*0.5+0.1,sp:Math.random()*0.35+0.05,tw:Math.random()*0.012+0.002,ph:Math.random()*6.28,pur:Math.random()>0.35}));
    const bolts = Array.from({length:8}, () => ({on:false,life:0,max:0,x1:0,y1:0,x2:0,y2:0}));
    const coins = Array.from({length:10}, () => ({x:Math.random()*2000,y:Math.random()*1500,ph:Math.random()*6.28,sp:Math.random()*0.3+0.15,sz:Math.random()*5+3}));
    const blocks = Array.from({length:4}, () => ({x:100+Math.random()*1800,y:150+Math.random()*400,ph:Math.random()*6.28}));
    const platforms = Array.from({length:5}, () => ({x:Math.random()*2000,y:200+Math.random()*600,w:50+Math.random()*90,ph:Math.random()*6.28}));
    const nebulae = Array.from({length:4}, () => ({x:Math.random()*2000,y:Math.random()*1500,r:80+Math.random()*140,c:Math.random()>0.5?"168,85,247":"34,211,238",o:Math.random()*0.012+0.004}));
    let t = 0;
    const drawBolt = (x1: number,y1: number,x2: number,y2: number,al: number,wd: number) => {
      ctx.beginPath(); ctx.moveTo(x1,y1);
      for(let i=1;i<=10;i++){ctx.lineTo(x1+(x2-x1)*(i/10)+(Math.random()-0.5)*55,y1+(y2-y1)*(i/10)+(Math.random()-0.5)*35);}
      ctx.strokeStyle=`rgba(168,85,247,${al})`;ctx.lineWidth=wd;ctx.shadowColor="rgba(168,85,247,0.5)";ctx.shadowBlur=12;ctx.stroke();
      ctx.strokeStyle=`rgba(34,211,238,${al*0.3})`;ctx.lineWidth=wd*3;ctx.shadowColor="rgba(34,211,238,0.3)";ctx.shadowBlur=20;ctx.stroke();
      ctx.shadowBlur=0;
    };
    const draw = () => {
      ctx.clearRect(0,0,w,h); t++;
      const mx=mouse.current.x, my=mouse.current.y;
      nebulae.forEach(n=>{const g=ctx.createRadialGradient(n.x,n.y,0,n.x,n.y,n.r);g.addColorStop(0,`rgba(${n.c},${n.o*1.5})`);g.addColorStop(1,`rgba(${n.c},0)`);ctx.fillStyle=g;ctx.fillRect(n.x-n.r,n.y-n.r,n.r*2,n.r*2);});
      stars.forEach(s=>{s.y-=s.sp;if(s.y<-5){s.y=h+5;s.x=Math.random()*w;}const f=Math.sin(t*s.tw+s.ph)*0.4+0.6;ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,6.28);ctx.fillStyle=s.pur?`rgba(168,85,247,${s.o*f})`:`rgba(34,211,238,${s.o*f*0.7})`;ctx.fill();if(s.r>1.2){ctx.strokeStyle=s.pur?`rgba(168,85,247,${s.o*f*0.25})`:`rgba(34,211,238,${s.o*f*0.15})`;ctx.lineWidth=0.3;ctx.beginPath();ctx.moveTo(s.x-s.r*2,s.y);ctx.lineTo(s.x+s.r*2,s.y);ctx.stroke();ctx.beginPath();ctx.moveTo(s.x,s.y-s.r*2);ctx.lineTo(s.x,s.y+s.r*2);ctx.stroke();}});
      platforms.forEach(p=>{const py=p.y+Math.sin(t*0.006+p.ph)*12;ctx.fillStyle="rgba(168,85,247,0.05)";for(let i=0;i<p.w;i+=12)ctx.fillRect(p.x+i,py,11,7);ctx.fillStyle="rgba(168,85,247,0.1)";ctx.fillRect(p.x,py,p.w,2);});
      blocks.forEach(b=>{const by=b.y+Math.sin(t*0.008+b.ph)*8;const p=Math.sin(t*0.03)*0.3+0.7;ctx.fillStyle=`rgba(251,191,36,${0.05*p})`;ctx.fillRect(b.x,by,20,20);ctx.strokeStyle=`rgba(251,191,36,${0.1*p})`;ctx.lineWidth=1.5;ctx.strokeRect(b.x,by,20,20);ctx.fillStyle=`rgba(251,191,36,${0.12*p})`;ctx.font="bold 11px monospace";ctx.textAlign="center";ctx.fillText("?",b.x+10,by+15);});
      coins.forEach(c=>{c.y-=c.sp;if(c.y<-10){c.y=h+10;c.x=Math.random()*w;}const sq=Math.abs(Math.sin(t*0.04+c.ph));ctx.beginPath();ctx.ellipse(c.x,c.y,c.sz*sq,c.sz,0,0,6.28);ctx.fillStyle=`rgba(251,191,36,${0.06+sq*0.05})`;ctx.fill();ctx.strokeStyle=`rgba(251,191,36,${0.1+sq*0.06})`;ctx.lineWidth=0.6;ctx.stroke();});
      bolts.forEach(b=>{if(!b.on&&Math.random()<0.004){b.on=true;b.x1=Math.random()*w;b.y1=Math.random()*h*0.25;b.x2=b.x1+(Math.random()-0.5)*400;b.y2=b.y1+100+Math.random()*300;b.life=0;b.max=5+Math.random()*10;}if(b.on){b.life++;if(b.life>b.max){b.on=false;return;}const al=(1-b.life/b.max)*0.35;drawBolt(b.x1,b.y1,b.x2,b.y2,al,1.5);if(b.life<3){const mx2=(b.x1+b.x2)/2+(Math.random()-0.5)*80;const my2=(b.y1+b.y2)/2;drawBolt(mx2,my2,mx2+(Math.random()-0.5)*180,my2+Math.random()*120,al*0.4,0.6);}}});
      if(mx>0&&my>0){const g=ctx.createRadialGradient(mx,my,0,mx,my,90);g.addColorStop(0,"rgba(168,85,247,0.03)");g.addColorStop(1,"rgba(168,85,247,0)");ctx.fillStyle=g;ctx.fillRect(mx-90,my-90,180,180);stars.forEach(s=>{const dx=s.x-mx,dy=s.y-my,d=Math.sqrt(dx*dx+dy*dy);if(d<130){ctx.beginPath();ctx.moveTo(mx,my);ctx.lineTo(s.x,s.y);ctx.strokeStyle=`rgba(168,85,247,${(1-d/130)*0.05})`;ctx.lineWidth=0.4;ctx.stroke();}});}
      af=requestAnimationFrame(draw);
    };
    draw();
    return()=>{cancelAnimationFrame(af);window.removeEventListener("resize",resize);};
  },[]);
  return <canvas ref={ref} style={{position:"fixed",inset:0,zIndex:0,pointerEvents:"none"}}/>;
}

// === HELPERS ===
function StatBar({label,value,color="#a855f7"}: any) {
  return (<div style={{display:"flex",alignItems:"center",gap:"5px",fontSize:"6px",fontFamily:"'Press Start 2P',monospace"}}>
    <span style={{color:color+"80",width:"24px"}}>{label}</span>
    <div style={{display:"flex",gap:"1px"}}>{Array.from({length:6},(_,i)=>(<div key={i} style={{width:"7px",height:"5px",background:i<value?color:color+"12",borderRadius:"1px"}}/>))}</div>
  </div>);
}
function GameCard({children,accent="#a855f7",style={},glow=false}: any) {
  return (<div style={{background:"rgba(8,6,28,0.92)",border:`2px solid ${accent}25`,borderRadius:"3px",padding:"20px",position:"relative",overflow:"hidden",boxShadow:glow?`0 0 30px ${accent}12`:`0 4px 20px rgba(0,0,0,0.3)`,backdropFilter:"blur(8px)",...style}}>
    <div style={{position:"absolute",top:0,left:0,right:0,height:"2px",background:`linear-gradient(90deg,transparent,${accent}80,transparent)`,animation:"pulse 3s ease infinite"}}/>
    {children}
  </div>);
}
function PixBtn({children,onClick,color="#a855f7",disabled=false,full=false,big=false,ghost=false}: any) {
  const [h,sH]=useState(false);
  return (<button onClick={onClick} disabled={disabled} onMouseEnter={()=>sH(true)} onMouseLeave={()=>sH(false)} style={{background:disabled?"#1a1830":ghost?"transparent":`linear-gradient(180deg,${color},${color}bb)`,color:disabled?"#444":"#fff",border:ghost?`2px solid ${color}60`:`2px solid ${disabled?"#222":color}`,borderBottom:ghost?`2px solid ${color}60`:`4px solid ${disabled?"#1a1830":color}80`,padding:big?"14px 36px":"10px 22px",borderRadius:"3px",fontSize:big?"11px":"9px",fontWeight:700,fontFamily:"'Press Start 2P','Exo 2',monospace",cursor:disabled?"not-allowed":"pointer",letterSpacing:"1px",textTransform:"uppercase",textShadow:disabled?"none":"0 1px 2px rgba(0,0,0,0.5)",boxShadow:disabled?"none":h?`0 0 25px ${color}30,0 6px 0 ${color}40`:`0 0 12px ${color}15,0 4px 0 ${color}30`,width:full?"100%":"auto",display:"inline-flex",alignItems:"center",justifyContent:"center",gap:"8px",transition:"all 0.15s",transform:h&&!disabled?"translateY(-1px)":"none"}}>{children}</button>);
}
function HudStat({label,value,color="#22d3ee",icon}: any) {
  return (<div style={{display:"flex",alignItems:"center",gap:"8px",padding:"8px 14px",background:"rgba(8,6,28,0.85)",border:`2px solid ${color}20`,borderRadius:"3px",position:"relative"}}>
    <div style={{position:"absolute",top:"-1px",left:"10px",right:"10px",height:"2px",background:`linear-gradient(90deg,transparent,${color}50,transparent)`}}/>
    {icon}
    <div><div style={{fontFamily:"'Press Start 2P',monospace",fontSize:"6px",color:color+"70",letterSpacing:"1px"}}>{label}</div><div style={{fontFamily:"'Press Start 2P',monospace",fontSize:"11px",color,marginTop:"2px",textShadow:`0 0 8px ${color}30`}}>{value}</div></div>
  </div>);
}
const I = {
  bolt:(s=14,c="#fbbf24")=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  shield:(s=14,c="#34d399")=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>,
  flame:(s=14,c="#f87171")=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.07-2.14 0-5.5 3-7.5.5 2 1.5 3 3 4.5s2 3.92 2 6.5a6 6 0 01-12 0c0-1 .5-2 2.5-2.5z"/></svg>,
  lock:(s=14,c="#fbbf24")=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>,
  x:(s=16,c="#8b85b1")=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  check:(s=12,c="#34d399")=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>,
  copy:(s=12,c="#8b85b1")=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>,
  star:(s=14,c="#fbbf24")=><svg width={s} height={s} viewBox="0 0 24 24" fill={c} stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  eye:(s=14,c="#8b85b1")=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  eyeOff:(s=14,c="#8b85b1")=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>,
};


function Reveal({children,delay=0}: any) {
  const ref=useRef<HTMLDivElement>(null); const [v,sV]=useState(false);
  useEffect(()=>{const o=new IntersectionObserver(([e])=>{if(e.isIntersecting)sV(true)},{threshold:0.08});if(ref.current)o.observe(ref.current);return()=>o.disconnect();},[]);
  return <div ref={ref} style={{opacity:v?1:0,transform:v?"translateY(0)":"translateY(28px)",transition:`all 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}s`}}>{children}</div>;
}
function DeployTerm({name,type,onDone}: any) {
  const [lines,sL]=useState<any[]>([]); const [done,sD]=useState(false); const sr=useRef<HTMLDivElement>(null); const a=AGENTS[type%5];
  useEffect(()=>{
    const w=genWallet();
    const seq=[{t:150,text:`> DEPLOYING: ${name}`,c:"#22d3ee"},{t:450,text:`> Class: ${a.name} [${a.trait}]`,c:"#8b85b1"},{t:800,text:"> Connecting to Base (8453)...",c:"#8b85b1"},{t:1100,text:"  [OK] RPC -- 8ms",c:"#34d399"},{t:1500,text:"> Generating keypair...",c:"#8b85b1"},{t:1800,text:"  [OK] 256-bit entropy",c:"#34d399"},{t:2200,text:"> Loading trading engine...",c:"#8b85b1"},{t:2500,text:`  [OK] ${a.name} v2.1`,c:"#34d399"},{t:2900,text:"> Registering agent...",c:"#8b85b1"},{t:3300,text:`  [OK] slot #${100+Math.floor(Math.random()*899)}`,c:"#34d399"},{t:3600,text:"> Binding router...",c:"#8b85b1"},{t:3800,text:"  [OK] Trade path live",c:"#34d399"},{t:4100,text:"",c:""},{t:4200,text:"|||||||||||||||||||||||||| 100%",c:"#a855f7"},{t:4600,text:`> ${name} IS ONLINE`,c:"#fbbf24"}];
    const timers=seq.map((s,i)=>setTimeout(()=>{sL(p=>[...p,s]);if(sr.current)sr.current.scrollTop=sr.current.scrollHeight;if(i===seq.length-1)setTimeout(()=>{sD(true);onDone(w);},500);},s.t));
    return()=>timers.forEach(clearTimeout);
  },[]);
  return (<div style={{background:"#030210",border:"2px solid #a855f725",borderRadius:"4px",overflow:"hidden"}}>
    <div style={{padding:"5px 10px",background:"#0a0825",borderBottom:"2px solid #a855f715",display:"flex",alignItems:"center",gap:"5px"}}>{["#f87171","#fbbf24","#34d399"].map((c,i)=><div key={i} style={{width:7,height:7,borderRadius:"50%",background:c,opacity:0.7}}/>)}<span style={{fontFamily:"'Press Start 2P',monospace",fontSize:"5px",color:"#4a4574",marginLeft:"6px",letterSpacing:"1px"}}>BOOST://DEPLOY/{name}</span></div>
    <div ref={sr} style={{padding:"12px 14px",fontFamily:"'JetBrains Mono',monospace",fontSize:"9px",lineHeight:2,minHeight:"220px",maxHeight:"280px",overflowY:"auto"}}>
      {lines.map((l: any,i: number)=><div key={i} style={{color:l.c,animation:"termIn 0.15s ease"}}>{l.text}</div>)}
      {!done&&<span style={{display:"inline-block",width:"6px",height:"11px",background:"#22d3ee",animation:"blink 0.5s step-end infinite"}}/>}
      {done&&<div style={{textAlign:"center",marginTop:"10px",animation:"popIn 0.4s cubic-bezier(0.34,1.56,0.64,1)"}}><Creature type={type} size={60} glow bounce/><div style={{fontFamily:"'Press Start 2P',monospace",fontSize:"10px",color:"#fbbf24",marginTop:"6px",textShadow:"0 0 12px #fbbf2440"}}>AGENT READY!</div></div>}
    </div>
  </div>);
}

// === MAIN ===
export default function BoostAI() {
  const [view,setView]=useState("home");
  const [modal,setModal]=useState<string|null>(null);
  const [chain,setChain]=useState({supply:0,liq:0,burned:0,trading:false,price:0});
  const [loading,setLoading]=useState(true);
  const [agents,setAgents]=useState<any[]>([]);
  const [agentName,setAgentName]=useState("");
  const [agentType,setAgentType]=useState(0);
  const [wallet,setWallet]=useState<any>(null);
  const [showKey,setShowKey]=useState(false);
  const [copied,setCopied]=useState<string|null>(null);
  const [introFade,setIntroFade]=useState(true);

  useEffect(()=>{let m=true;const l=async()=>{const d=await fetchChain();if(m){setChain(d);setLoading(false);}};l();const iv=setInterval(l,30000);return()=>{m=false;clearInterval(iv);};},[]);
  useEffect(()=>{const t=setTimeout(()=>setIntroFade(false),2800);return()=>clearTimeout(t);},[]);

  const cp=(txt: string,id: string)=>{navigator.clipboard.writeText(txt).then(()=>{setCopied(id);setTimeout(()=>setCopied(null),2000);});};
  const openCreate=()=>{setModal("select");setAgentName("");setAgentType(0);setWallet(null);setShowKey(false);};
  const onDeploy=(w: any)=>{setWallet(w);setTimeout(()=>setModal("keys"),500);};
  const saveKey=()=>{if(wallet&&agentName)setAgents(p=>[...p,{name:agentName,type:agentType,addr:wallet.addr,ts:Date.now()}]);setModal("fund");};

  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(180deg,#030210 0%,#08061c 40%,#0c0a24 100%)",color:"#e2e0f0",fontFamily:"'Exo 2',sans-serif"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Orbitron:wght@400;700;900&family=Exo+2:wght@300;400;600;700&family=JetBrains+Mono:wght@400;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
        @keyframes termIn{from{opacity:0;transform:translateX(-6px)}to{opacity:1;transform:translateX(0)}}
        @keyframes pulse{0%,100%{opacity:0.15}50%{opacity:0.7}}
        @keyframes cBounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
        @keyframes fDrift{0%{transform:translate(0,0) rotate(0deg)}50%{transform:translate(15px,-12px) rotate(3deg)}100%{transform:translate(-10px,8px) rotate(-2deg)}}
        @keyframes hFloat{0%,100%{transform:translateY(0)}25%{transform:translateY(-14px)}75%{transform:translateY(-8px)}}
        @keyframes popIn{from{opacity:0;transform:scale(0.5)}to{opacity:1;transform:scale(1)}}
        @keyframes bounce{0%,20%,50%,80%,100%{transform:translateY(0)}40%{transform:translateY(-5px)}60%{transform:translateY(-3px)}}
        @keyframes scanline{0%{transform:translateY(-100vh)}100%{transform:translateY(100vh)}}
        @keyframes introFlash{0%{opacity:0}5%{opacity:0.8}10%{opacity:0}20%{opacity:0.6}25%{opacity:0}40%{opacity:1}45%{opacity:0.1}55%{opacity:0.9}60%{opacity:0}70%{opacity:0.7}75%{opacity:0}85%{opacity:1}100%{opacity:0}}
        @keyframes introReveal{0%{opacity:0;filter:brightness(0)}30%{opacity:0;filter:brightness(0)}50%{opacity:0.3;filter:brightness(3)}55%{opacity:0.1;filter:brightness(0.5)}70%{opacity:0.5;filter:brightness(2)}75%{opacity:0.2;filter:brightness(0.8)}90%{opacity:0.8;filter:brightness(1.5)}100%{opacity:1;filter:brightness(1)}}
        @keyframes introContentReveal{0%{opacity:0;transform:scale(0.97)}100%{opacity:1;transform:scale(1)}}
        @keyframes boltCrack1{0%{opacity:0;d:path("M 50 0 L 52 25 L 45 30 L 55 55 L 48 60 L 56 100")}10%{opacity:1}20%{opacity:0.3}30%{opacity:0.9}50%{opacity:0}100%{opacity:0}}
        @keyframes boltCrack2{0%{opacity:0}15%{opacity:0}25%{opacity:1}35%{opacity:0.2}45%{opacity:0.8}60%{opacity:0}100%{opacity:0}}
        @keyframes boltCrack3{0%{opacity:0}30%{opacity:0}40%{opacity:1}50%{opacity:0.1}55%{opacity:0.7}65%{opacity:0}100%{opacity:0}}
        @keyframes introFadeOut{0%{opacity:1;pointer-events:all}80%{opacity:0.3}100%{opacity:0;pointer-events:none}}
        input::placeholder{color:#4a4574}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:#030210}::-webkit-scrollbar-thumb{background:#581c87;border-radius:2px}
        button{outline:none}
      `}</style>

      {/* LIGHTNING INTRO OVERLAY */}
      <div style={{position:"fixed",inset:0,zIndex:introFade?200:0,pointerEvents:introFade?"all":"none",opacity:introFade?1:0,transition:"opacity 0.6s ease",background:"#030210"}}>
        <svg width="100%" height="100%" style={{position:"absolute",inset:0}}>
          {/* bolt 1 - left */}
          <path d="M 25% 0 L 27% 20% L 22% 28% L 30% 50% L 24% 58% L 28% 80% L 25% 100%" fill="none" stroke="#a855f7" strokeWidth="3" opacity="0" style={{animation:"boltCrack1 2.8s ease forwards",filter:"drop-shadow(0 0 20px #a855f7) drop-shadow(0 0 40px #22d3ee)"}}/>
          <path d="M 25% 0 L 27% 20% L 22% 28% L 30% 50% L 24% 58% L 28% 80% L 25% 100%" fill="none" stroke="#22d3ee" strokeWidth="8" opacity="0" style={{animation:"boltCrack1 2.8s ease forwards",filter:"blur(8px)"}}/>
          {/* bolt 2 - right */}
          <path d="M 75% 0 L 72% 15% L 78% 25% L 70% 45% L 76% 55% L 73% 75% L 77% 100%" fill="none" stroke="#a855f7" strokeWidth="3" opacity="0" style={{animation:"boltCrack2 2.8s ease forwards",filter:"drop-shadow(0 0 20px #a855f7) drop-shadow(0 0 40px #22d3ee)"}}/>
          <path d="M 75% 0 L 72% 15% L 78% 25% L 70% 45% L 76% 55% L 73% 75% L 77% 100%" fill="none" stroke="#22d3ee" strokeWidth="8" opacity="0" style={{animation:"boltCrack2 2.8s ease forwards",filter:"blur(8px)"}}/>
          {/* bolt 3 - center */}
          <path d="M 50% 0 L 48% 18% L 53% 30% L 46% 48% L 52% 60% L 49% 78% L 51% 100%" fill="none" stroke="#fbbf24" strokeWidth="2" opacity="0" style={{animation:"boltCrack3 2.8s ease forwards",filter:"drop-shadow(0 0 15px #fbbf24) drop-shadow(0 0 30px #a855f7)"}}/>
          <path d="M 50% 0 L 48% 18% L 53% 30% L 46% 48% L 52% 60% L 49% 78% L 51% 100%" fill="none" stroke="#fbbf24" strokeWidth="6" opacity="0" style={{animation:"boltCrack3 2.8s ease forwards",filter:"blur(6px)"}}/>
        </svg>
        {/* flash overlay */}
        <div style={{position:"absolute",inset:0,background:"radial-gradient(circle at 50% 50%, rgba(168,85,247,0.3), transparent 70%)",animation:"introFlash 2.8s ease forwards"}}/>
        <div style={{position:"absolute",inset:0,background:"#030210",animation:"introFadeOut 2.8s ease forwards"}}/>
      </div>

      {/* MAIN CONTENT with reveal */}
      <div style={{animation:introFade?"introReveal 2.8s ease forwards":"none"}}>
      <SpaceCanvas/>
      <div style={{position:"fixed",inset:0,zIndex:1,pointerEvents:"none",overflow:"hidden"}}><div style={{width:"100%",height:"2px",background:"rgba(168,85,247,0.04)",animation:"scanline 5s linear infinite"}}/></div>

      {/* NAV */}
      <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:50,padding:"6px 16px",display:"flex",justifyContent:"space-between",alignItems:"center",background:"rgba(3,2,16,0.92)",borderBottom:"2px solid #a855f710",backdropFilter:"blur(16px)"}}>
        <div onClick={()=>{setView("home");setModal(null);}} style={{display:"flex",alignItems:"center",gap:"8px",cursor:"pointer"}}>
          <Creature type={0} size={24} glow/><span style={{fontFamily:"'Press Start 2P',monospace",fontSize:"10px",letterSpacing:"2px"}}><span style={{color:"#a855f7"}}>BOOST</span><span style={{color:"#22d3ee"}}>AI</span></span>
        </div>
        <div style={{display:"flex",gap:"6px",alignItems:"center"}}>
          {agents.length>0&&<div style={{display:"flex",alignItems:"center",gap:"4px",padding:"3px 8px",background:"#34d39908",border:"2px solid #34d39920",borderRadius:"2px"}}><div style={{width:5,height:5,borderRadius:"50%",background:"#34d399",animation:"blink 1.5s ease infinite"}}/><span style={{fontFamily:"'Press Start 2P',monospace",fontSize:"7px",color:"#34d399"}}>{agents.length}</span></div>}
          <PixBtn onClick={()=>{setView("home");setModal(null);}} ghost color="#4a4574">HOME</PixBtn>
          <PixBtn onClick={()=>{setView("dashboard");setModal(null);}} ghost color="#4a4574">HQ</PixBtn>
          <PixBtn onClick={openCreate} color="#a855f7">{I.bolt(11,"#fff")} PLAY</PixBtn>
        </div>
      </nav>

      <div style={{position:"relative",zIndex:2}}>

        {/* === HOME === */}
        {view==="home"&&!modal&&(<>
          <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",padding:"80px 20px 40px",textAlign:"center"}}>
            <div style={{display:"flex",gap:"14px",marginBottom:"24px",animation:"fadeUp 0.5s ease"}}>
              {[4,3,0,1,2].map((t,i)=>(<div key={i} style={{animation:`hFloat ${2.5+i*0.3}s ease-in-out ${i*0.15}s infinite`,opacity:i===2?1:0.35+i*0.12}}><Creature type={t} size={i===2?72:i===1||i===3?48:36} glow={i===2} bounce/></div>))}
            </div>
            <div style={{animation:"fadeUp 0.5s ease 0.1s both"}}>
              <h1 style={{fontFamily:"'Press Start 2P',monospace",fontSize:"clamp(16px,4vw,36px)",lineHeight:1.8,margin:0}}>
                <span style={{color:"#a855f7",textShadow:"0 0 30px #a855f730",display:"block"}}>THE FIRST TOKEN</span>
                <span style={{color:"#22d3ee",textShadow:"0 0 30px #22d3ee30",display:"block"}}>HUMANS CAN&apos;T BUY</span>
              </h1>
            </div>
            <p style={{fontSize:"clamp(12px,1.5vw,16px)",color:"#8b85b1",maxWidth:"500px",lineHeight:1.7,margin:"18px 0 0",animation:"fadeUp 0.5s ease 0.2s both"}}>Choose your AI creature. Deploy on Base. It trades <span style={{color:"#fbbf24",fontWeight:700}}>$BOOST</span> autonomously. Collect the loot.</p>
            <div style={{display:"flex",gap:"12px",marginTop:"28px",animation:"fadeUp 0.5s ease 0.3s both",flexWrap:"wrap",justifyContent:"center"}}>
              <PixBtn onClick={openCreate} color="#a855f7" big>{I.bolt(13,"#fff")} CHOOSE AGENT</PixBtn>
              <PixBtn onClick={()=>setView("dashboard")} color="#22d3ee" big ghost>{I.shield(13,"#22d3ee")} DASHBOARD</PixBtn>
            </div>
            <div style={{display:"flex",gap:"8px",marginTop:"44px",flexWrap:"wrap",justifyContent:"center",animation:"fadeUp 0.5s ease 0.4s both"}}>
              <HudStat label="SUPPLY" value={loading?"...":fmt(chain.supply)} icon={I.star(10,"#22d3ee")}/>
              <HudStat label="LIQUIDITY" value={loading?"...":chain.liq.toFixed(4)+" ETH"} color="#a855f7" icon={I.bolt(10,"#a855f7")}/>
              <HudStat label="BURNED" value={loading?"...":fmt(chain.burned)} color="#f87171" icon={I.flame(10,"#f87171")}/>
              <HudStat label="STATUS" value={loading?"...":chain.trading?"LIVE!":"SOON"} color={chain.trading?"#34d399":"#fbbf24"} icon={I.shield(10,chain.trading?"#34d399":"#fbbf24")}/>
            </div>
            <div style={{position:"absolute",bottom:"20px",fontFamily:"'Press Start 2P',monospace",fontSize:"7px",color:"#4a4574",animation:"bounce 2.5s ease infinite",letterSpacing:"2px"}}>SCROLL DOWN</div>
          </div>

          {/* CONTRACTS */}
          <section style={{padding:"40px 20px",maxWidth:"940px",margin:"0 auto"}}>
            <Reveal><div style={{textAlign:"center"}}>
              <div style={{fontFamily:"'Press Start 2P',monospace",fontSize:"7px",color:"#4a4574",letterSpacing:"3px",marginBottom:"12px"}}>VERIFY ON-CHAIN</div>
              <div style={{display:"flex",gap:"8px",justifyContent:"center",flexWrap:"wrap"}}>
                {[{l:"TOKEN",a:C.token},{l:"REGISTRY",a:C.registry},{l:"ROUTER",a:C.router},{l:"LP",a:C.pair}].map((c,i)=>(
                  <div key={i} onClick={()=>cp(c.a,"ct"+i)} style={{background:"rgba(8,6,28,0.8)",border:"2px solid #a855f715",borderRadius:"3px",padding:"8px 14px",cursor:"pointer",display:"flex",alignItems:"center",gap:"8px",transition:"all 0.2s"}}>
                    <div><div style={{fontFamily:"'Press Start 2P',monospace",fontSize:"6px",color:"#4a4574",marginBottom:"2px",letterSpacing:"1px"}}>{c.l}</div><div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"9px",color:"#8b85b1"}}>{c.a.slice(0,6)}...{c.a.slice(-4)}</div></div>
                    {copied==="ct"+i?I.check(10,"#34d399"):I.copy(10,"#4a4574")}
                  </div>
                ))}
              </div>
            </div></Reveal>
          </section>

          {/* HOW TO PLAY */}
          <section style={{padding:"80px 20px",maxWidth:"940px",margin:"0 auto"}}>
            <Reveal><h2 style={{fontFamily:"'Press Start 2P',monospace",fontSize:"clamp(11px,2vw,18px)",textAlign:"center",color:"#fbbf24",marginBottom:"6px",textShadow:"0 0 14px #fbbf2425"}}>HOW TO PLAY</h2><p style={{textAlign:"center",color:"#4a4574",fontSize:"10px",marginBottom:"40px",fontFamily:"'Press Start 2P',monospace",letterSpacing:"1px"}}>3 STEPS TO AUTONOMOUS ALPHA</p></Reveal>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:"16px"}}>
              {[{n:"01",t:"CHOOSE",d:"Pick your AI creature. Each has unique stats -- speed, aggression, defense.",c:"#a855f7",type:0},{n:"02",t:"DEPLOY",d:"Send ETH on Base. Your agent trades $BOOST 24/7 through the router.",c:"#22d3ee",type:1},{n:"03",t:"COLLECT",d:"Profits stack up. Withdraw anytime. 10% tax burns tokens forever.",c:"#34d399",type:2}].map((item,i)=>(
                <Reveal key={i} delay={i*0.12}><GameCard accent={item.c} glow><div style={{textAlign:"center"}}>
                  <div style={{display:"inline-block",animation:`hFloat ${2.5+i*0.3}s ease-in-out infinite`}}><Creature type={item.type} size={52} glow bounce/></div>
                  <div style={{fontFamily:"'Press Start 2P',monospace",fontSize:"7px",color:item.c+"80",marginTop:"10px",letterSpacing:"3px"}}>STEP {item.n}</div>
                  <div style={{fontFamily:"'Press Start 2P',monospace",fontSize:"10px",color:"#e2e0f0",marginTop:"4px"}}>{item.t}</div>
                  <p style={{fontSize:"12px",color:"#8b85b1",marginTop:"10px",lineHeight:1.6}}>{item.d}</p>
                </div></GameCard></Reveal>
              ))}
            </div>
          </section>

          {/* POWER-UPS */}
          <section style={{padding:"60px 20px",maxWidth:"940px",margin:"0 auto"}}>
            <Reveal><h2 style={{fontFamily:"'Press Start 2P',monospace",fontSize:"clamp(11px,2vw,18px)",textAlign:"center",color:"#22d3ee",marginBottom:"40px",textShadow:"0 0 14px #22d3ee25"}}>POWER-UPS</h2></Reveal>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:"12px"}}>
              {[{t:"BURN LOCK",d:"Owner can only buy & burn. Selling impossible.",c:"#f87171",icon:I.flame(16,"#f87171")},{t:"PERM LP",d:"Liquidity locked forever. Architecturally impossible to remove.",c:"#a855f7",icon:I.lock(16,"#a855f7")},{t:"VERIFIED",d:"All contracts verified on Basescan. No proxies.",c:"#22d3ee",icon:I.shield(16,"#22d3ee")},{t:"AGENTS ONLY",d:"ERC-20 rejects human transfers at contract level.",c:"#34d399",icon:I.star(16,"#34d399")}].map((item,i)=>(
                <Reveal key={i} delay={i*0.08}><GameCard accent={item.c} style={{textAlign:"center",padding:"18px"}}><div style={{marginBottom:"8px"}}>{item.icon}</div><div style={{fontFamily:"'Press Start 2P',monospace",fontSize:"8px",color:item.c,letterSpacing:"1px"}}>{item.t}</div><p style={{fontSize:"11px",color:"#8b85b1",marginTop:"8px",lineHeight:1.6}}>{item.d}</p></GameCard></Reveal>
              ))}
            </div>
          </section>



          {/* CTA */}
          <section style={{padding:"60px 20px 20px",textAlign:"center"}}><Reveal>
            <div style={{display:"flex",justifyContent:"center",gap:"10px",marginBottom:"16px"}}>{[0,1,2,3,4].map(i=><Creature key={i} type={i} size={28} glow bounce/>)}</div>
            <h2 style={{fontFamily:"'Press Start 2P',monospace",fontSize:"clamp(10px,2vw,16px)",color:"#fbbf24",marginBottom:"8px",textShadow:"0 0 12px #fbbf2425"}}>YOUR AGENTS AWAIT</h2>
            <p style={{fontSize:"12px",color:"#4a4574",maxWidth:"340px",margin:"0 auto 20px",lineHeight:1.5}}>They trade while you sleep. They never stop.</p>
            <PixBtn onClick={openCreate} color="#a855f7" big>{I.bolt(13,"#fff")} START PLAYING</PixBtn>
          </Reveal></section>

          <footer style={{padding:"16px 20px",borderTop:"2px solid #a855f708",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{display:"flex",alignItems:"center",gap:"6px"}}><Creature type={0} size={16}/><span style={{fontFamily:"'Press Start 2P',monospace",fontSize:"7px",color:"#4a4574"}}>BOOSTAI</span></div>
            <span style={{fontFamily:"'Press Start 2P',monospace",fontSize:"6px",color:"#4a4574",letterSpacing:"2px"}}>BASE NETWORK</span>
          </footer>
        </>)}

        {/* === MODAL === */}
        {modal&&(
          <div style={{position:"fixed",inset:0,zIndex:60,background:"rgba(3,2,16,0.96)",backdropFilter:"blur(12px)",display:"flex",alignItems:"center",justifyContent:"center",padding:"20px",animation:"fadeIn 0.2s ease",overflowY:"auto"}}>
            <div style={{maxWidth:"580px",width:"100%",position:"relative",margin:"auto"}}>
              <button onClick={()=>setModal(null)} style={{position:"absolute",top:"-32px",right:"0",background:"none",border:"none",cursor:"pointer",zIndex:5}}>{I.x(18,"#4a4574")}</button>

              {modal==="select"&&(
                <div style={{animation:"fadeUp 0.3s ease"}}><GameCard accent="#a855f7" glow>
                  <div style={{textAlign:"center",marginBottom:"20px"}}><div style={{fontFamily:"'Press Start 2P',monospace",fontSize:"14px",color:"#fbbf24",textShadow:"0 0 14px #fbbf2430"}}>CHOOSE YOUR AGENT</div><p style={{fontSize:"11px",color:"#8b85b1",marginTop:"6px"}}>Each creature has unique trading DNA</p></div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:"8px",marginBottom:"16px"}}>
                    {AGENTS.map(a=>(<div key={a.id} onClick={()=>setAgentType(a.id)} style={{background:agentType===a.id?`${a.color}12`:"rgba(5,4,15,0.5)",border:`2px solid ${agentType===a.id?a.color:a.color+"15"}`,borderRadius:"3px",padding:"12px 8px",cursor:"pointer",transition:"all 0.2s",textAlign:"center",boxShadow:agentType===a.id?`0 0 24px ${a.color}15,inset 0 0 20px ${a.color}06`:"none"}}>
                      <Creature type={a.id} size={44} glow={agentType===a.id} bounce={agentType===a.id}/>
                      <div style={{fontFamily:"'Press Start 2P',monospace",fontSize:"8px",color:a.color,marginTop:"6px",letterSpacing:"1px"}}>{a.name}</div>
                      <div style={{fontSize:"9px",color:"#8b85b1",marginTop:"3px",lineHeight:1.4}}>{a.desc}</div>
                      <div style={{marginTop:"6px"}}><StatBar label="ATK" value={a.atk} color={a.color}/><StatBar label="DEF" value={a.def} color={a.color}/><StatBar label="SPD" value={a.spd} color={a.color}/></div>
                    </div>))}
                  </div>
                  <div style={{marginBottom:"14px"}}><div style={{fontFamily:"'Press Start 2P',monospace",fontSize:"6px",color:"#4a4574",letterSpacing:"2px",marginBottom:"4px"}}>CALLSIGN</div>
                    <input type="text" value={agentName} onChange={e=>setAgentName(e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g,"").slice(0,16))} placeholder="AGENT-001" style={{width:"100%",padding:"10px 14px",background:"#050410",border:"2px solid #a855f720",borderRadius:"3px",color:"#22d3ee",fontSize:"13px",fontFamily:"'Press Start 2P',monospace",letterSpacing:"2px",textAlign:"center",outline:"none",boxSizing:"border-box"}}/>
                  </div>
                  <PixBtn full big onClick={()=>setModal("deploy")} disabled={agentName.length<3} color="#a855f7">{I.bolt(13,agentName.length>=3?"#fff":"#555")} DEPLOY!</PixBtn>
                </GameCard></div>
              )}

              {modal==="deploy"&&<div style={{animation:"fadeUp 0.3s ease"}}><DeployTerm name={agentName} type={agentType} onDone={onDeploy}/></div>}

              {modal==="keys"&&wallet&&(
                <div style={{animation:"fadeUp 0.3s ease"}}><GameCard accent="#34d399" glow>
                  <div style={{textAlign:"center",marginBottom:"14px"}}><Creature type={agentType} size={56} glow bounce/><div style={{fontFamily:"'Press Start 2P',monospace",fontSize:"12px",color:"#34d399",marginTop:"8px"}}>{agentName} DEPLOYED!</div><p style={{fontSize:"9px",color:"#f87171",marginTop:"6px",fontFamily:"'Press Start 2P',monospace"}}>SAVE YOUR KEY NOW</p></div>
                  <div style={{marginBottom:"12px"}}><div style={{fontFamily:"'Press Start 2P',monospace",fontSize:"6px",color:"#22d3ee80",letterSpacing:"1px",marginBottom:"4px"}}>ADDRESS</div><div style={{background:"#050410",border:"2px solid #22d3ee15",borderRadius:"3px",padding:"10px"}}><div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",color:"#e2e0f0",wordBreak:"break-all",lineHeight:1.5}}>{wallet.addr}</div><button onClick={()=>cp(wallet.addr,"wa")} style={{marginTop:"6px",background:"#22d3ee10",border:"1px solid #22d3ee20",borderRadius:"2px",padding:"3px 10px",color:copied==="wa"?"#34d399":"#22d3ee",fontSize:"8px",cursor:"pointer",fontFamily:"'Press Start 2P',monospace"}}>{copied==="wa"?"OK!":"COPY"}</button></div></div>
                  <div style={{marginBottom:"16px"}}><div style={{fontFamily:"'Press Start 2P',monospace",fontSize:"6px",color:"#f8717180",letterSpacing:"1px",marginBottom:"4px"}}>PRIVATE KEY</div><div style={{background:"rgba(60,10,20,0.2)",border:"2px solid #f8717120",borderRadius:"3px",padding:"10px"}}><div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",color:"#cc8888",wordBreak:"break-all",lineHeight:1.5,filter:showKey?"none":"blur(5px)",userSelect:showKey?"all":"none",transition:"filter 0.2s"}}>{wallet.key}</div><div style={{display:"flex",gap:"6px",marginTop:"6px"}}><button onClick={()=>setShowKey(!showKey)} style={{background:"#f8717110",border:"1px solid #f8717120",borderRadius:"2px",padding:"3px 10px",color:"#f87171",fontSize:"8px",cursor:"pointer",fontFamily:"'Press Start 2P',monospace",display:"flex",alignItems:"center",gap:"4px"}}>{showKey?I.eyeOff(10,"#f87171"):I.eye(10,"#f87171")} {showKey?"HIDE":"SHOW"}</button><button onClick={()=>cp(wallet.key,"wk")} style={{background:"#f8717110",border:"1px solid #f8717120",borderRadius:"2px",padding:"3px 10px",color:copied==="wk"?"#34d399":"#f87171",fontSize:"8px",cursor:"pointer",fontFamily:"'Press Start 2P',monospace"}}>{copied==="wk"?"OK!":"COPY"}</button></div></div></div>
                  <div style={{background:"rgba(52,211,153,0.06)",border:"1px solid #34d39930",borderRadius:"3px",padding:"10px",marginBottom:"12px",textAlign:"center"}}><div style={{fontFamily:"'Press Start 2P',monospace",fontSize:"7px",color:"#34d399",lineHeight:1.8}}>Keys are generated 100% in your browser.</div><div style={{fontFamily:"'Press Start 2P',monospace",fontSize:"7px",color:"#34d399",lineHeight:1.8}}>No keys are ever sent to any server.</div><div style={{fontFamily:"'Press Start 2P',monospace",fontSize:"7px",color:"#34d399",lineHeight:1.8}}>Verify in source code.</div></div>
                  <div style={{display:"flex",gap:"8px",marginBottom:"12px"}}><PixBtn full big onClick={saveKey} color="#34d399">{I.check(13,"#fff")} KEY SAVED</PixBtn></div>
                  <div style={{display:"flex",gap:"8px",justifyContent:"center",flexWrap:"wrap"}}><a href="https://github.com/user/boostai" target="_blank" rel="noopener noreferrer" style={{fontFamily:"'Press Start 2P',monospace",fontSize:"7px",color:"#a855f7",textDecoration:"none",border:"1px solid #a855f730",borderRadius:"2px",padding:"4px 10px",background:"#a855f708"}}>VIEW SOURCE</a><a href="https://github.com/user/boostai" target="_blank" rel="noopener noreferrer" style={{fontFamily:"'Press Start 2P',monospace",fontSize:"6px",color:"#22d3ee",textDecoration:"none",border:"1px solid #22d3ee30",borderRadius:"2px",padding:"4px 10px",background:"#22d3ee08"}}>OPEN SOURCE - VERIFY ON GITHUB</a></div>
                </GameCard></div>
              )}

              {modal==="fund"&&wallet&&(
                <div style={{animation:"fadeUp 0.3s ease"}}><GameCard accent="#22d3ee" glow>
                  <div style={{textAlign:"center",marginBottom:"14px"}}><Creature type={agentType} size={56} glow bounce/><div style={{fontFamily:"'Press Start 2P',monospace",fontSize:"12px",color:"#fbbf24",marginTop:"8px"}}>POWER UP!</div><p style={{fontSize:"10px",color:"#8b85b1",marginTop:"4px"}}>Send ETH on Base to begin</p></div>
                  <div style={{background:"#050410",border:"2px solid #22d3ee15",borderRadius:"3px",padding:"14px",textAlign:"center",marginBottom:"14px"}}><div style={{fontFamily:"'Press Start 2P',monospace",fontSize:"6px",color:"#4a4574",letterSpacing:"2px",marginBottom:"6px"}}>DEPOSIT (BASE)</div><div onClick={()=>cp(wallet.addr,"fa")} style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",color:"#22d3ee",cursor:"pointer",wordBreak:"break-all",lineHeight:1.5}}>{wallet.addr}</div>{copied==="fa"&&<div style={{fontFamily:"'Press Start 2P',monospace",fontSize:"7px",color:"#34d399",marginTop:"4px"}}>COPIED!</div>}</div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px",marginBottom:"16px"}}>{[{l:"TEST",v:"0.01 ETH",s:"Try it"},{l:"GO BIG",v:"0.1 ETH",s:"Recommended"}].map((o,i)=>(<div key={i} style={{background:"rgba(8,6,28,0.6)",border:"2px solid #a855f712",borderRadius:"3px",padding:"10px",textAlign:"center"}}><div style={{fontFamily:"'Press Start 2P',monospace",fontSize:"6px",color:"#4a4574",marginBottom:"4px"}}>{o.l}</div><div style={{fontFamily:"'Press Start 2P',monospace",fontSize:"12px",color:"#22d3ee"}}>{o.v}</div><div style={{fontSize:"9px",color:"#4a4574",marginTop:"2px"}}>{o.s}</div></div>))}</div>
                  <PixBtn full big onClick={()=>{setModal(null);setView("dashboard");}} color="#22d3ee">{I.shield(13,"#fff")} GO TO HQ</PixBtn>
                  <div style={{textAlign:"center",marginTop:"12px"}}><a href="https://github.com/user/boostai" target="_blank" rel="noopener noreferrer" style={{fontFamily:"'Press Start 2P',monospace",fontSize:"6px",color:"#22d3ee",textDecoration:"none",border:"1px solid #22d3ee30",borderRadius:"2px",padding:"4px 10px",background:"#22d3ee08"}}>OPEN SOURCE - VERIFY ON GITHUB</a></div>
                </GameCard></div>
              )}
            </div>
          </div>
        )}

        {/* === DASHBOARD === */}
        {view==="dashboard"&&!modal&&(
          <div style={{minHeight:"100vh",padding:"64px 20px 40px",maxWidth:"1000px",margin:"0 auto"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"20px",flexWrap:"wrap",gap:"8px"}}>
              <div><h2 style={{fontFamily:"'Press Start 2P',monospace",fontSize:"clamp(12px,2.5vw,20px)",color:"#fbbf24",textShadow:"0 0 12px #fbbf2425"}}>HEADQUARTERS</h2><p style={{fontSize:"11px",color:"#4a4574",marginTop:"4px"}}>Live from Base</p></div>
              <PixBtn onClick={openCreate} color="#a855f7">{I.bolt(11,"#fff")} NEW AGENT</PixBtn>
            </div>
            <GameCard accent="#a855f7" style={{marginBottom:"16px"}}><div style={{display:"flex",gap:"8px",flexWrap:"wrap"}}>
              <HudStat label="SUPPLY" value={loading?"...":fmt(chain.supply)} icon={I.star(10,"#22d3ee")}/>
              <HudStat label="POOL" value={loading?"...":chain.liq.toFixed(4)+" ETH"} color="#a855f7" icon={I.bolt(10,"#a855f7")}/>
              <HudStat label="BURNED" value={loading?"...":fmt(chain.burned)} color="#f87171" icon={I.flame(10,"#f87171")}/>
              <HudStat label="STATUS" value={loading?"...":chain.trading?"LIVE!":"SOON"} color={chain.trading?"#34d399":"#fbbf24"} icon={I.shield(10,chain.trading?"#34d399":"#fbbf24")}/>
            </div></GameCard>

            {agents.length===0?(
              <GameCard accent="#4a4574" style={{textAlign:"center",padding:"50px 20px"}}>
                <div style={{display:"flex",justifyContent:"center",gap:"10px",marginBottom:"16px"}}>{[0,1,2,3,4].map(i=><Creature key={i} type={i} size={32} bounce/>)}</div>
                <div style={{fontFamily:"'Press Start 2P',monospace",fontSize:"10px",color:"#8b85b1",marginBottom:"6px"}}>NO AGENTS</div><p style={{fontSize:"11px",color:"#4a4574",marginBottom:"18px"}}>Deploy your first creature</p>
                <PixBtn onClick={openCreate} color="#a855f7">{I.bolt(11,"#fff")} CHOOSE</PixBtn>
              </GameCard>
            ):(
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:"14px"}}>
                {agents.map((ag: any,i: number)=>{const a=AGENTS[ag.type%5];return(
                  <GameCard key={i} accent={a.color} glow style={{animation:`fadeUp 0.4s ease ${i*0.08}s both`}}>
                    <div style={{display:"flex",alignItems:"center",gap:"12px",marginBottom:"12px"}}>
                      <Creature type={ag.type} size={48} glow bounce/>
                      <div style={{flex:1}}><div style={{display:"flex",alignItems:"center",gap:"6px"}}><span style={{fontFamily:"'Press Start 2P',monospace",fontSize:"9px",color:"#e2e0f0"}}>{ag.name}</span><span style={{fontFamily:"'Press Start 2P',monospace",fontSize:"6px",color:a.color,padding:"2px 5px",background:`${a.color}10`,border:`1px solid ${a.color}20`,borderRadius:"2px"}}>{a.name}</span></div><div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"8px",color:"#4a4574",marginTop:"3px"}}>{ag.addr.slice(0,6)}...{ag.addr.slice(-4)}</div></div>
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"6px",marginBottom:"10px"}}>
                      {[{l:"BOOST",v:"0",c:"#a855f7"},{l:"ETH",v:"0.00",c:"#22d3ee"},{l:"TRADES",v:"0",c:"#fbbf24"}].map((d,j)=>(<div key={j} style={{background:`${d.c}06`,border:`1px solid ${d.c}12`,borderRadius:"2px",padding:"6px",textAlign:"center"}}><div style={{fontFamily:"'Press Start 2P',monospace",fontSize:"5px",color:"#4a4574",marginBottom:"2px"}}>{d.l}</div><div style={{fontFamily:"'Press Start 2P',monospace",fontSize:"9px",color:d.c}}>{d.v}</div></div>))}
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:"6px"}}><span style={{fontFamily:"'Press Start 2P',monospace",fontSize:"5px",color:"#4a4574"}}>LV.1</span><div style={{flex:1,background:"#0a0820",borderRadius:"2px",height:"5px",overflow:"hidden",border:`1px solid ${a.color}10`}}><div style={{width:"0%",height:"100%",background:`linear-gradient(90deg,${a.color},${a.color}40)`}}/></div><span style={{fontFamily:"'Press Start 2P',monospace",fontSize:"5px",color:a.color}}>0 XP</span></div>
                    <div style={{fontFamily:"'Press Start 2P',monospace",fontSize:"5px",color:"#fbbf24",marginTop:"6px",textAlign:"center",letterSpacing:"1px"}}>AWAITING FUNDS</div>
                  </GameCard>
                );})}
              </div>
            )}
            <button onClick={()=>setView("home")} style={{marginTop:"24px",background:"none",border:"none",color:"#4a4574",cursor:"pointer",fontFamily:"'Press Start 2P',monospace",fontSize:"8px"}}>{"<"} BACK</button>
          </div>
        )}
      </div>
    </div>
    </div>
  );
}
