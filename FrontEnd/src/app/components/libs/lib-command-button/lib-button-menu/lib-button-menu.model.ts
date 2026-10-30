import { MenuItem } from 'primeng/api';

export interface MenuItemClickEvent {
  item: MenuItem;
  originalEvent: Event;
}
