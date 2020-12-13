export class Interval {
  value: number;
  temperament: number;
  frequency: number;
  referencePitchHz = 440;
  color: IntervalStyles = {
    backgroundColor: '',
    width: '',
    height: ''
  };
  constructor(temperament: number, value: number) {
    this.value = value;
    this.temperament = temperament;
    this.color.width = ((1 / (temperament + 1)) * 100) + '%';
    this.color.height = ((1 / (temperament + 1)) * 100) + '%';
    const equalTempNthRootOfTwo = Math.pow(2, (1 / this.temperament));
    const productQ = Math.pow(equalTempNthRootOfTwo, this.value);
    this.frequency = (this.referencePitchHz * productQ);
    const hue = Math.floor((360 / this.temperament * value) % 360);
    this.color.backgroundColor = 'hsl(' + hue + ', 100%, 75%)';
  }
}

interface IntervalStyles {
  backgroundColor: string;
  width: string;
  height: string;
}
