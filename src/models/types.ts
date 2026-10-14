export type Point = { x: number; y: number; weight?: number };
export type ModelId = 'ols' | 'polynomial' | 'ridge' | 'lasso' | 'elastic-net';
export type Params = { degree: number; lambda: number; alpha: number; learningRate: number; iterations: number };
export type RegressionDataset = { points: Point[]; name: string };
export type RegressionResult = { coefficients: number[]; predictions: number[]; residuals: number[]; metrics: { r2: number; rmse: number; mae: number; aic: number; bic: number }; curve: Point[]; converged: boolean; message?: string };
export type ModelPlugin = { id: ModelId; name: string; family: string; equation: string; intuition: string; assumptions: string[]; pros: string[]; cons: string[]; defaults: Partial<Params> };
