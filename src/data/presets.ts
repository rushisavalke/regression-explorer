import type { Point } from '../models/types';
export type Preset='linear'|'quadratic'|'noisy'|'outliers'|'heteroscedastic'|'multicollinear'|'sine'|'sensor';
export function makePreset(kind:Preset,n=32,noise=1,outlierPct=8):Point[]{
 let seed=1729; const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;}; const normal=()=>Math.sqrt(-2*Math.log(Math.max(rand(),1e-9)))*Math.cos(2*Math.PI*rand());
 return Array.from({length:n},(_,i)=>{const x=-5+10*i/Math.max(1,n-1);let y=1.4+1.7*x;
  if(kind==='quadratic')y=1+.45*x+.42*x*x;if(kind==='sine')y=2*Math.sin(x*1.2);if(kind==='sensor')y=3+.08*i+Math.sin(i*.45)*1.4;
  let eps=normal()*noise;if(kind==='heteroscedastic')eps*=.25+Math.abs(x)*.3;y+=eps;
  if(kind==='outliers'&&rand()<outlierPct/100)y+=(rand()>.5?1:-1)*(5+rand()*9);
  return{x,y};});
}
