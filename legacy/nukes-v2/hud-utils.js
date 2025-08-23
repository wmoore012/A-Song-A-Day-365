export function quantizeToStep(value, step = 10){
	if (!Number.isFinite(value)) return 0;
	const s = Math.max(1, Math.round(step));
	return Math.round(value / s) * s;
}
export function clamp01(v){
	if (!Number.isFinite(v)) return 0;
	return Math.max(0, Math.min(1, v));
}
export function gaugeDisplayValue(v){
	const clamped = Math.max(0, Math.min(200, Math.round(Number(v) || 0)));
	const snapped = quantizeToStep(clamped, 10);
	return `×${snapped}`;
}