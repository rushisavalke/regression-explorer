import { describe,it,expect } from 'vitest';
import { fitRegression,solve } from '../src/models/linear/leastSquares';
import type { Params,Point } from '../src/models/types';
const params:Params={degree:2,lambda:0.1,alpha:0.5,learningRate:0.03,iterations:2000};
describe('educational regression engine',()=>{
 it('solves a small linear system',()=>expect(solve([[2,1],[1,3]],[5,6])).toEqual([1.8,1.4]));
 it('recovers a perfect line with OLS',()=>{const p:Point[]=[{x:0,y:2},{x:1,y:5},{x:2,y:8},{x:3,y:11}];const r=fitRegression(p,'ols',params);expect(r.coefficients[0]).toBeCloseTo(2);expect(r.coefficients[1]).toBeCloseTo(3);expect(r.metrics.r2).toBeCloseTo(1);});
 it('fits a quadratic basis',()=>{const p:Point[]=[-2,-1,0,1,2].map(x=>({x,y:1+2*x+3*x*x}));const r=fitRegression(p,'polynomial',params);expect(r.coefficients[2]).toBeCloseTo(3);expect(r.metrics.rmse).toBeLessThan(1e-8);});
 it('throws a helpful error for singular matrices',()=>expect(()=>solve([[1,1],[1,1]],[1,2])).toThrow(/singular/i));
 it('fits regularized models with finite metrics',()=>{const p:Point[]=[0,1,2,3,4].map(x=>({x,y:2+4*x}));for(const id of ['ridge','lasso','elastic-net'] as const){const r=fitRegression(p,id,params);expect(Number.isFinite(r.metrics.rmse)).toBe(true);}});
 it('rejects too few points',()=>expect(()=>fitRegression([{x:1,y:2}],'ols',params)).toThrow(/two data points/i));
});
