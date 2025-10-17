import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';
import { Order } from '../../../core/models/order.model';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.css'
})
export class OrderDetailComponent implements OnInit {
  order?: Order;
  loading = false;
  error = '';

  constructor(private route: ActivatedRoute, private svc: OrderService) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.error = 'ID de orden inválido';
      return;
    }

    this.loading = true;
    this.svc.get(id).subscribe({
      next: res => {
        this.order = res.data;
        this.loading = false;
      },
      error: () => {
        this.error = 'No se encontró la orden';
        this.loading = false;
      }
    });
  }
}
