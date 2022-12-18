export interface BreadcrumbsItem {
  entry: string;
  hasEntries: boolean;
  label: string;
  isCurrent: boolean;
  href?: string;
  path?: string;
}
