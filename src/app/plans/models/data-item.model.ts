export interface DataItem {
  entries: Record<string, unknown>;
  isInTotal: boolean;
  key: string;
  label: string;
  order: number;
  value: unknown;
}
