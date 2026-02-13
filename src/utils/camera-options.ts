export const ISO_OPTIONS = [
  { label: '50', value: '50' },
  { label: '100', value: '100' },
  { label: '200', value: '200' },
  { label: '400', value: '400' },
  { label: '800', value: '800' },
  { label: '1600', value: '1600' },
  { label: '3200', value: '3200' },
  { label: '6400', value: '6400' },
  { label: '12800', value: '12800' },
  { label: '25600', value: '25600' },
];

export const SHUTTER_SPEED_OPTIONS = [
  { label: '1/8000', value: '1/8000' },
  { label: '1/4000', value: '1/4000' },
  { label: '1/2000', value: '1/2000' },
  { label: '1/1000', value: '1/1000' },
  { label: '1/500', value: '1/500' },
  { label: '1/250', value: '1/250' },
  { label: '1/125', value: '1/125' },
  { label: '1/60', value: '1/60' },
  { label: '1/30', value: '1/30' },
  { label: '1/15', value: '1/15' },
  { label: '1/8', value: '1/8' },
  { label: '1/4', value: '1/4' },
  { label: '1/2', value: '1/2' },
  { label: '1"', value: '1"' },
  { label: '2"', value: '2"' },
  { label: '4"', value: '4"' },
  { label: '8"', value: '8"' },
  { label: '15"', value: '15"' },
  { label: '30"', value: '30"' },
];

export const APERTURE_OPTIONS = [
  { label: 'f/1.4', value: 'f/1.4' },
  { label: 'f/1.8', value: 'f/1.8' },
  { label: 'f/2', value: 'f/2' },
  { label: 'f/2.8', value: 'f/2.8' },
  { label: 'f/4', value: 'f/4' },
  { label: 'f/5.6', value: 'f/5.6' },
  { label: 'f/8', value: 'f/8' },
  { label: 'f/11', value: 'f/11' },
  { label: 'f/16', value: 'f/16' },
  { label: 'f/22', value: 'f/22' },
];

export const WHITE_BALANCE_OPTIONS = [
  { label: 'Auto', value: 'Auto' },
  { label: 'Daylight', value: 'Daylight' },
  { label: 'Cloudy', value: 'Cloudy' },
  { label: 'Shade', value: 'Shade' },
  { label: 'Tungsten', value: 'Tungsten' },
  { label: 'Fluorescent', value: 'Fluorescent' },
  { label: 'Flash', value: 'Flash' },
  { label: 'Kelvin', value: 'Kelvin' },
];

export const FOCUS_OPTIONS = [
  { label: 'AF-S (单次)', value: 'AF-S' },
  { label: 'AF-C (连续)', value: 'AF-C' },
  { label: 'AF-A (自动)', value: 'AF-A' },
  { label: 'MF (手动)', value: 'MF' },
];

export const EXPOSURE_OPTIONS: { label: string; value: string }[] = [];
for (let i = -30; i <= 30; i++) {
  const ev = i * 0.1;
  const label = ev >= 0 ? `+${ev.toFixed(1)}` : ev.toFixed(1);
  EXPOSURE_OPTIONS.push({ label: `${label}EV`, value: `${label}EV` });
}

export function getOptionIndex(
  value: string,
  options: { label: string; value: string }[]
): number {
  const index = options.findIndex((opt) => opt.value === value);
  return index >= 0 ? index : 0;
}

export function getOptionValue(
  index: number,
  options: { label: string; value: string }[]
): string {
  if (options.length === 0) return '';
  return options[index]?.value ?? options[0].value ?? '';
}
