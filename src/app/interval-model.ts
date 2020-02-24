export class Interval {
  value: number;
  temperament: number;
  frequency: number;
  referencePitchHz = 440;
  color: {backgroundColor} = {backgroundColor: ''};
  constructor(temperament: number, value: number) {
    this.value = value;
    this.temperament = temperament;
    const equalTempNthRootOfTwo = Math.pow(2, (1 / this.temperament));
    const productQ = Math.pow(equalTempNthRootOfTwo, this.value);
    this.frequency = (this.referencePitchHz * productQ);
    const hue = Math.floor((360 / this.temperament * value) % 360);
    this.color.backgroundColor = 'hsl(' + hue + ', 100%, 75%)';
  }
}
