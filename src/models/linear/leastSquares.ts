import type { Point, Params, RegressionResult, ModelId } from '../types';

/** Small educational Gaussian-elimination solver with partial pivoting. */
export function solve(A: number[][], b: number[]): number[] {
 const n=b.length; const M=A.map((r,i)=>[...r,b[i]]);
 for(let c=0;c<n;c++) { let pivot=c; for(let r=c+1;r<n;r++) if(Math.abs(M[r][c])>Math.abs(M[pivot][c])) pivot=r;
  if(Math.abs(M[pivot][c])<1e-10) throw new Error('This fit is underdetermined or nearly singular. Add more varied points or increase regularization.');
  [M[c],M[pivot]]=[M[pivot],M[c]]; const d=M[c][c]; for(let j=c;j<=n;j++) M[c][j]/=d;
  for(let r=0;r<n;r++) if(r!==c) { const f=M[r][c]; for(let j=c;j<=n;j++) M[r][j]-=f*M[c][j]; }
 }
 return M.map(r=>r[n]);
}
export function designRow(x:number, degree:number) { return Array.from({length:degree+1},(_,i)=>x**i); }
function softThreshold(v:number,t:number) { return Math.sign(v)*Math.max(0,Math.abs(v)-t); }
export function fitRegression(points:Point[], model:ModelId, params:Params):RegressionResult {
 if(points.length<2) throw new Error('Add at least two data points to fit a model.');
 if(points.some(p=>!Number.isFinite(p.x)||!Number.isFinite(p.y))) throw new Error('Data contains a non-finite value. Check your CSV.');
 const degree=model==='polynomial'?Math.max(1,Math.min(8,Math.round(params.degree))):1;
 const X=points.map(p=>designRow(p.x,degree)); const y=points.map(p=>p.y); const n=y.length,k=degree+1;
 const xtx=Array.from({length:k},()=>Array(k).fill(0)); const xty=Array(k).fill(0);
 for(let i=0;i<n;i++) for(let a=0;a<k;a++){xty[a]+=X[i][a]*y[i];for(let b=0;b<k;b++)xtx[a][b]+=X[i][a]*X[i][b];}
 let coefficients:number[]; let converged=true;
 if(model==='ols'||model==='polynomial') coefficients=solve(xtx,xty);
 else if(model==='ridge') { for(let j=1;j<k;j++) xtx[j][j]+=Math.max(0,params.lambda); coefficients=solve(xtx,xty); }
 else { // Coordinate descent on squared loss with L1 / Elastic Net penalties; intercept is unpenalized.
  coefficients=Array(k).fill(0); coefficients[0]=y.reduce((a,b)=>a+b,0)/n;
  const residual=y.map((v,i)=>v-coefficients[0]); const lambda=Math.max(0,params.lambda), alpha=model==='lasso'?1:Math.min(1,Math.max(0,params.alpha));
  for(let iter=0;iter<Math.max(1,params.iterations);iter++){let maxChange=0;
   for(let j=1;j<k;j++){let rho=0,norm=0;for(let i=0;i<n;i++){residual[i]+=X[i][j]*coefficients[j];rho+=X[i][j]*residual[i];norm+=X[i][j]*X[i][j];}
    const next=softThreshold(rho/n,lambda*alpha)/(norm/n+lambda*(1-alpha)); const delta=next-coefficients[j]; coefficients[j]=next; maxChange=Math.max(maxChange,Math.abs(delta));
    for(let i=0;i<n;i++) residual[i]-=X[i][j]*coefficients[j];
   }
   const mean=y.reduce((a,b)=>a+b,0)/n; const old=coefficients[0]; const offset=residual.reduce((a,b)=>a+b,0)/n; coefficients[0]+=offset; for(let i=0;i<n;i++) residual[i]-=offset; maxChange=Math.max(maxChange,Math.abs(coefficients[0]-old));
   if(maxChange<1e-7) break; if(iter===Math.max(1,params.iterations)-1) converged=false;
  }
 }
 const predictions=X.map(row=>row.reduce((s,v,j)=>s+v*coefficients[j],0)); const residuals=y.map((v,i)=>v-predictions[i]);
 const mean=y.reduce((a,b)=>a+b,0)/n, sse=residuals.reduce((s,v)=>s+v*v,0),sst=y.reduce((s,v)=>s+(v-mean)**2,0),rmse=Math.sqrt(sse/n),mae=residuals.reduce((s,v)=>s+Math.abs(v),0)/n;
 const safeSse=Math.max(sse,1e-12); return {coefficients,predictions,residuals,metrics:{r2:sst<1e-12?0:1-sse/sst,rmse,mae,aic:n*Math.log(safeSse/n)+2*k,bic:n*Math.log(safeSse/n)+Math.log(n)*k},curve:Array.from({length:121},(_,i)=>{const min=Math.min(...points.map(p=>p.x)),max=Math.max(...points.map(p=>p.x));const x=min+(max-min)*i/120;return{x,y:designRow(x,degree).reduce((s,v,j)=>s+v*coefficients[j],0)}}),converged,message:converged?undefined:'Optimizer reached the iteration limit; try more iterations.'};
}
