export type OrderStatus = 'pending' | 'in_progress' | 'completed';

export interface Order {
  id?: number;
  client_name: string;
  description: string;
  status: OrderStatus;
  delivery_date: string;
  created_at?: string;
  updated_at?: string;
}
