export class Interval {
  value: number;
  temperament: number;
  frequency: number;
  referencePitchHz = 440;
  constructor(temperament: number, value: number) {
    this.value = value;
    this.temperament = temperament;
    const equalTempNthRootOfTwo = Math.pow(2, (1 / this.temperament));
    const productQ = Math.pow(equalTempNthRootOfTwo, this.value);
    this.frequency = (this.referencePitchHz * productQ);
  }
}
