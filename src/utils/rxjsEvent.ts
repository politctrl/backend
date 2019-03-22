export class RxEvent<Data> {
  eventType: string;
  data: Data;

  constructor(eventType: string, data: Data) {
    this.eventType = eventType;
    this.data = data;
  }
}
