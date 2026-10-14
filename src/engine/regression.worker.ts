/// <reference lib="webworker" />
import { fitRegression } from '../models/linear/leastSquares';
import type { Point, Params, ModelId } from '../models/types';
type Request={id:number;points:Point[];model:ModelId;params:Params};
self.onmessage=(event:MessageEvent<Request>)=>{const {id,points,model,params}=event.data;try{self.postMessage({id,result:fitRegression(points,model,params)});}catch(error){self.postMessage({id,error:error instanceof Error?error.message:'Unable to fit this model.'});}};
export {};
