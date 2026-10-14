import { useCallback, useState } from 'react';
import { makePreset, type Preset } from '../data/presets';
import type { ModelId, Params, Point } from '../models/types';
export function useExplorerState(){const [points,setPoints]=useState<Point[]>(()=>makePreset('noisy'));const [dataset,setDataset]=useState('noisy');const [model,setModel]=useState<ModelId>('ols');const [params,setParams]=useState<Params>({degree:2,lambda:.15,alpha:.5,learningRate:.03,iterations:800});const [theme,setTheme]=useState<'dark'|'light'>('dark');const loadPreset=useCallback((preset:Preset)=>{setPoints(makePreset(preset));setDataset(preset);},[]);return{points,setPoints,dataset,setDataset,model,setModel,params,setParams,theme,setTheme,loadPreset};}
