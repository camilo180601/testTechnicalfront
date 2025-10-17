import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';
import { AuthService } from '../../../core/services/auth.service';
import { Order } from '../../../core/models/order.model';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.css'
})
export class OrderListComponent implements OnInit {
  orders: Order[] = [];
  error = '';
  loading = false;

  constructor(private auth: AuthService, private svc: OrderService, private router: Router) {}
  ngOnInit() { this.load(); }

  load() {
    this.svc.list().subscribe({
      next: res => this.orders = res.data,
      error: e => this.error = e?.error?.message || 'Error cargando órdenes'
    });
  }

  view(o: Order) { this.router.navigate(['/orders', o.id]); }
  edit(o: Order) { this.router.navigate(['/orders/edit', o.id]); }
  create() { this.router.navigate(['/orders/create']); }
  logout() { 
    this.auth.logout().subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/login']);
      },
      error: (e: any) => {
        this.loading = false;
        this.error = e?.error?.message || 'Error cerrando sesión.';
      }
    });
  }
  remove(o: Order) {
    if (confirm(`¿Eliminar orden de ${o.client_name}?`)) {
      this.svc.delete(o.id!).subscribe(() => this.load());
    }
  }
}
