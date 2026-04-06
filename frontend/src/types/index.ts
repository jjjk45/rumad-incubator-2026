export type TabRoute = 'Explore' | 'Sell' | 'Activity' | 'Account';

export interface NavItem {
  route: TabRoute;
  label: string;
  icon: string;
}