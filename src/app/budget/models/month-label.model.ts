export interface MonthLabel {
  april: Item;
  august: Item;
  december: Item;
  february: Item;
  january: Item;
  july: Item;
  june: Item;
  march: Item;
  may: Item;
  november: Item;
  october: Item;
  september: Item;
}

export interface Item {
  id: string;
  long: string;
  short?: string;
}
