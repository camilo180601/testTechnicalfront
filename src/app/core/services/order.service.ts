import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Order } from '../models/order.model';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private base = `${environment.apiBase}/orders`;

  constructor(private http: HttpClient) {}

  list() {
    return this.http.get<{ data: Order[] }>(this.base);
  }

  get(id: number) {
    return this.http.get<{ data: Order }>(`${this.base}/${id}`);
  }

  create(order: Order) {
    return this.http.post<{ data: Order }>(this.base, order);
  }

  update(id: number, order: Partial<Order>) {
    return this.http.put<{ data: Order }>(`${this.base}/${id}`, order);
  }

  delete(id: number) {
    return this.http.delete(`${this.base}/${id}`);
  }

  findByClientAndDate(client: string, date: string) {
    const params = new HttpParams().set('client_name', client).set('delivery_date', date);
    return this.http.get<{ data: Order[] }>(this.base, { params });
  }
}
