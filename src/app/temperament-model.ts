export class Temperament {
  public label: string;
  public value: number;
  constructor(value: number) {
    this.label = value + '-TET';
    this.value = value;
  }
}
