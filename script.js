const DEV=false,DURATION=10,$=s=>document.querySelector(s),stage=$('#stage'),atmos=$('#atmos'),grain=$('#grain');let tl,alive=true,atmosMode='off',density=0,wind=0,audioOn=false,ctx,out,music=$('#music');
function fit(c){const r=stage.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,1.5);c.width=r.width*d;c.height=r.height*d;c.style.width=r.width+'px';c.style.height=r.height+'px';return d}let DPR=fit(atmos);fit(grain);addEventListener('resize',()=>{DPR=fit(atmos);fit(grain)});
const ac=atmos.getContext('2d'),gc=grain.getContext('2d');const motes=Array.from({length:520},()=>({x:Math.random(),y:Math.random(),z:Math.random(),a:.015+Math.random()*.08,r:.15+Math.random()*1.2,p:Math.random()*10,v:.00015+Math.random()*.0011}));
function atmosphere(ms){const w=atmos.width,h=atmos.height,t=ms/1000;ac.clearRect(0,0,w,h);if(density<.01)return;ac.save();ac.globalCompositeOperation='screen';for(const p of motes){p.x+=p.v*(.25+wind*2.6);p.y+=Math.sin(t*1.1+p.p)*.00008;if(p.x>1.15){p.x=-.15;p.y=Math.random()}let x=p.x*w,y=p.y*h;if(atmosMode==='spray'){x=(.17+p.x*.82)*w;y=(.42+(p.y-.5)*(.10+p.x*.38))*h}let rr=p.r*DPR*(1+p.z*2.4);if(atmosMode==='fog')rr*=3.4;const g=ac.createRadialGradient(x,y,0,x,y,rr*7);g.addColorStop(0,`rgba(248,232,207,${p.a*density})`);g.addColorStop(.28,`rgba(214,172,122,${p.a*density*.35})`);g.addColorStop(1,'rgba(0,0,0,0)');ac.fillStyle=g;ac.beginPath();ac.arc(x,y,rr*7,0,Math.PI*2);ac.fill()}ac.restore()}
let last=0,noiseCanvas=document.createElement('canvas');noiseCanvas.width=128;noiseCanvas.height=228;let nc=noiseCanvas.getContext('2d');function draw(ms){if(alive){atmosphere(ms);if(ms-last>70){let im=nc.createImageData(128,228);for(let i=0;i<im.data.length;i+=4){let v=Math.random()*255;im.data[i]=im.data[i+1]=im.data[i+2]=v;im.data[i+3]=22}nc.putImageData(im,0,0);gc.clearRect(0,0,grain.width,grain.height);gc.imageSmoothingEnabled=false;gc.drawImage(noiseCanvas,0,0,grain.width,grain.height);last=ms}}requestAnimationFrame(draw)}requestAnimationFrame(draw);
function audio(){if(ctx)return;ctx=new AudioContext;out=ctx.createGain();out.gain.value=.68;out.connect(ctx.destination)}function sub(f=43,d=.55,v=.08){if(!audioOn)return;audio();let o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.setValueAtTime(f,ctx.currentTime);o.frequency.exponentialRampToValueAtTime(f*.72,ctx.currentTime+d);g.gain.setValueAtTime(v,ctx.currentTime);g.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+d);o.connect(g).connect(out);o.start();o.stop(ctx.currentTime+d)}function hiss(d=.4,v=.025){if(!audioOn)return;audio();let n=ctx.sampleRate*d,b=ctx.createBuffer(1,n,ctx.sampleRate),a=b.getChannelData(0);for(let i=0;i<n;i++)a[i]=(Math.random()*2-1)*Math.pow(1-i/n,1.8);let s=ctx.createBufferSource(),f=ctx.createBiquadFilter(),g=ctx.createGain();f.type='bandpass';f.frequency.value=3500;f.Q.value=.7;g.gain.value=v;s.buffer=b;s.connect(f).connect(g).connect(out);s.start()}function chime(f=330,d=.7,v=.018){if(!audioOn)return;audio();let o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.value=f;g.gain.setValueAtTime(v,ctx.currentTime);g.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+d);o.connect(g).connect(out);o.start();o.stop(ctx.currentTime+d)}
function cut(id,t,d=.1){tl.set('.plate',{opacity:0},t).set(id,{opacity:1},t).set(id,{opacity:0},t+d)}function wipeText(sel,t,d=.32){tl.set(sel,{opacity:1,clipPath:'inset(0 100% 0 0)'},t).to(sel,{clipPath:'inset(0 0% 0 0)',duration:d,ease:'power4.out'},t)}
function build(){
 gsap.set(['.plate','.type'],{opacity:0}); gsap.set('#black',{opacity:1});
 tl=gsap.timeline({paused:true,onUpdate:()=>{if(DEV)$('#scrub').value=tl.time()}});
 // A restrained continuous film: darkness breathes between images instead of hard editorial cuts.
 tl.set('#spray',{opacity:1},0).set('#black',{opacity:1},0)
   .to('#black',{opacity:.12,duration:.42,ease:'sine.inOut'},.08)
   .fromTo('#spray img',{scale:1.22,xPercent:-7,yPercent:1},{scale:1.10,xPercent:-2,yPercent:-1,duration:1.45,ease:'sine.inOut'},.08)
   .call(()=>{atmosMode='spray';density=.78;wind=.72;hiss(.75,.022)},null,.20)
   .fromTo('#beam',{opacity:0,xPercent:-30},{opacity:.34,xPercent:108,duration:.88,ease:'sine.inOut'},.24)
   .to('#beam',{opacity:0,duration:.28,ease:'sine.out'},1.05)
   .to('#black',{opacity:1,duration:.30,ease:'power2.inOut'},1.18).set('#spray',{opacity:0},1.49);

 // Typography behaves like fashion typography: words arrive independently, with soft vertical masks.
 tl.set('.t1',{opacity:1},1.42)
   .fromTo('.w1',{clipPath:'inset(100% 0 0 0)',y:28},{clipPath:'inset(0% 0 0 0)',y:0,duration:.48,ease:'power4.out'},1.46)
   .fromTo('.w2',{clipPath:'inset(100% 0 0 0)',y:20},{clipPath:'inset(0% 0 0 0)',y:0,duration:.44,ease:'power4.out'},1.63)
   .fromTo('.t1 .subline',{clipPath:'inset(0 100% 0 0)',x:-10},{clipPath:'inset(0 0% 0 0)',x:0,duration:.62,ease:'power3.out'},1.82)
   .call(()=>chime(294,.65,.009),null,1.62)
   .to('.t1',{opacity:0,duration:.34,ease:'sine.inOut'},2.48);

 // One flowing macro passage. Glass appears through darkness rather than slamming into frame.
 tl.set('#glass',{opacity:1},2.62).set('#glass img',{scale:1.44,xPercent:-5,yPercent:-5},2.62)
   .to('#black',{opacity:.08,duration:.40,ease:'sine.inOut'},2.62)
   .to('#glass img',{scale:1.28,xPercent:3,yPercent:4,duration:1.35,ease:'sine.inOut'},2.62)
   .fromTo('#beam',{opacity:0,xPercent:-55},{opacity:.27,xPercent:115,duration:1.05,ease:'sine.inOut'},2.72)
   .to('#beam',{opacity:0,duration:.25},3.72)
   .to('#black',{opacity:1,duration:.34,ease:'sine.inOut'},3.70).set('#glass',{opacity:0},4.04);

 tl.set('.t2',{opacity:1},3.90)
   .fromTo('.w3',{clipPath:'inset(100% 0 0 0)',y:24},{clipPath:'inset(0 0 0 0)',y:0,duration:.42,ease:'power4.out'},3.94)
   .fromTo('.w4',{clipPath:'inset(100% 0 0 0)',y:22},{clipPath:'inset(0 0 0 0)',y:0,duration:.50,ease:'power4.out'},4.10)
   .call(()=>sub(41,.55,.042),null,4.03)
   .to('.t2',{opacity:0,duration:.34,ease:'sine.inOut'},4.70);

 // Hero: one luxurious reveal, no rough microcuts. The light is the transition.
 tl.set('#hero',{opacity:1},4.78).set('#hero .lit',{clipPath:'inset(0 100% 0 0)'},4.78)
   .set('#hero img',{scale:1.035},4.78).to('#black',{opacity:.04,duration:.50,ease:'sine.inOut'},4.78)
   .call(()=>{atmosMode='fog';density=.24;wind=.05;sub(35,.95,.068)},null,4.90)
   .to('#hero img',{scale:1.065,duration:2.55,ease:'sine.inOut'},4.80)
   .to('#hero .lit',{clipPath:'inset(0 62% 0 20%)',duration:.72,ease:'sine.inOut'},5.02)
   .to('#hero .lit',{clipPath:'inset(0 28% 0 48%)',duration:.82,ease:'sine.inOut'},5.74)
   .to('#hero .lit',{clipPath:'inset(0 7% 0 7%)',duration:.80,ease:'sine.out'},6.56)
   .fromTo('#iris',{opacity:.55,scale:1.05},{opacity:.12,scale:1,duration:1.7,ease:'sine.out'},5.10);

 tl.set('.t3',{opacity:1},6.52)
   .fromTo('.t3 .brand',{clipPath:'inset(100% 0 0 0)',y:18,letterSpacing:'.12em'},{clipPath:'inset(0 0 0 0)',y:0,letterSpacing:'.045em',duration:.62,ease:'power4.out'},6.56)
   .fromTo('.t3 .kicker',{opacity:0,y:6},{opacity:.9,y:0,duration:.42,ease:'sine.out'},6.88)
   .call(()=>chime(392,.8,.012),null,6.68)
   .to('.t3',{opacity:0,duration:.34,ease:'sine.inOut'},7.48)
   .to('#black',{opacity:1,duration:.36,ease:'sine.inOut'},7.52).set('#hero',{opacity:0},7.90);

 // Final product breath before the studio signature.
 tl.set('#distance',{opacity:1},7.88).set('#distance img',{filter:'brightness(.30) contrast(1.22) saturate(.60)',scale:1.025},7.88)
   .to('#black',{opacity:.12,duration:.38,ease:'sine.inOut'},7.90)
   .to('#distance img',{scale:1.0,duration:.92,ease:'sine.inOut'},7.90)
   .fromTo('#beam',{opacity:0,xPercent:-65},{opacity:.22,xPercent:100,duration:.76,ease:'sine.inOut'},8.00)
   .to('#beam',{opacity:0,duration:.20},8.64)
   .to('#black',{opacity:1,duration:.30,ease:'sine.inOut'},8.58).set('#distance',{opacity:0},8.90);

 tl.set('.t4',{opacity:1},8.88)
   .fromTo('.t4 .kicker',{opacity:0,y:7},{opacity:.72,y:0,duration:.40,ease:'sine.out'},8.92)
   .fromTo('.t4 .studio',{clipPath:'inset(100% 0 0 0)',y:20,letterSpacing:'.22em'},{clipPath:'inset(0 0 0 0)',y:0,letterSpacing:'.13em',duration:.58,ease:'power4.out'},9.04)
   .call(()=>sub(32,.7,.045),null,9.08)
   .to('.t4',{opacity:0,duration:.22,ease:'sine.in'},9.70)
   .set('#black',{opacity:1},9.92).to({}, {duration:.08});
 tl.duration(DURATION); return tl;
}
function preload(){return Promise.all([...document.images].map(i=>i.complete?Promise.resolve():new Promise(r=>i.onload=i.onerror=r)))}function play(){density=0;tl.pause(0).play();if(music){music.pause();music.currentTime=0;if(audioOn){music.volume=.72;music.play().catch(()=>{})}}}$('#replay').onclick=play;$('#sound').onclick=async()=>{audioOn=!audioOn;audio();if(audioOn&&ctx.state==='suspended')await ctx.resume();$('.soundLabel').textContent=audioOn?'SOUND ON':'SOUND';$('#sound').style.opacity=audioOn?'.95':'.72';if(music){music.volume=.72;if(audioOn){play()}else{music.pause();}}};if(DEV){$('#scrub').style.display='block';$('#scrub').addEventListener?.('input',e=>tl.pause(+e.target.value))}document.addEventListener('visibilitychange',()=>{alive=!document.hidden;if(document.hidden)tl.pause();else tl.play()});preload().then(()=>{build();if(matchMedia('(prefers-reduced-motion: reduce)').matches){tl.pause(7.98);gsap.set('#distance',{opacity:1});gsap.set('#black',{opacity:0})}else play()});window.replayEclipse=play;
