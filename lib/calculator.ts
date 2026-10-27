export const COST_ASSUMPTIONS = {
  ridingDays: 365,
  petrolKmPerLiter: 45,
  gridRate: 8.5,
  packKwh: 4.2,
  petrolCo2PerLiter: 2.31,
  gridCo2PerKwh: 0.71,
  treeAbsorptionKg: 21.77,
} as const;

export function projectCosts(dailyKm: number, petrolPrice: number, rangeKm: number) {
  const a = COST_ASSUMPTIONS;
  const annualKm = dailyKm * a.ridingDays;
  const liters = annualKm / a.petrolKmPerLiter;
  const petrolAnnual = liters * petrolPrice;
  const kwhPerKm = a.packKwh / rangeKm;
  const electricAnnual = annualKm * kwhPerKm * a.gridRate;
  const savings3 = (petrolAnnual - electricAnnual) * 3;
  const co2Saved = liters * a.petrolCo2PerLiter - annualKm * kwhPerKm * a.gridCo2PerKwh;
  const trees = Math.max(0, co2Saved / a.treeAbsorptionKg);
  const chargesPerDay = dailyKm / rangeKm;

  return {
    annualKm,
    petrolAnnual,
    electricAnnual,
    savings3,
    trees,
    chargesPerDay,
    kwhPerKm,
  };
}
