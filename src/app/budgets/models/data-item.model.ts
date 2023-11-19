export interface DataItem {
  entries: {
    [key: string]: any;
  };
  isInTotal: boolean;
  key: string;
  label: string;
  order: number;
  value: any;
}
