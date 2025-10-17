import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime } from 'rxjs/operators';
import { OrderService } from '../../../core/services/order.service';
import { Order } from '../../../core/models/order.model';

@Component({
  selector: 'app-order-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './order-form.component.html',
  styleUrl: './order-form.component.css'
})
export class OrderFormComponent implements OnInit {
  form!: FormGroup; // <- operador ! evita el error TS2564
  isEdit = false;
  orderId?: number;
  duplicateError = '';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private svc: OrderService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      client_name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      status: ['pending', [Validators.required]],
      delivery_date: ['', [Validators.required]]
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.orderId = +id;
      this.svc.get(this.orderId).subscribe((res: any) => this.form.patchValue(res.data));
    }

    this.form.get('client_name')!.valueChanges
      .pipe(debounceTime(300))
      .subscribe(() => this.checkDuplicate());

    this.form.get('delivery_date')!.valueChanges
      .pipe(debounceTime(300))
      .subscribe(() => this.checkDuplicate());
  }

  checkDuplicate(): void {
    this.duplicateError = '';
    const client = this.form.value.client_name;
    const date = this.form.value.delivery_date;
    if (!client || !date) return;

    this.svc.findByClientAndDate(client, date).subscribe({
      next: (res: any) => {
        const duplicates = res.data.filter((o: any) =>
          this.isEdit ? o.id !== this.orderId : true
        );
        if (duplicates.length > 0) {
          this.duplicateError = 'Ya existe una orden para este cliente en la misma fecha.';
          this.form.setErrors({ duplicate: true });
        } else {
          const errors = this.form.errors;
          if (errors && errors['duplicate']) {
            delete errors['duplicate'];
            if (Object.keys(errors).length === 0) this.form.setErrors(null);
          }
        }
      },
      error: () => (this.duplicateError = '')
    });
  }

  submit(): void {
    if (this.form.invalid) return;

    const payload = this.form.value as Order;
    this.loading = true;

    const request = this.isEdit && this.orderId
      ? this.svc.update(this.orderId, payload)
      : this.svc.create(payload);

    request.subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/orders']);
      },
      error: (e: any) => {
        this.loading = false;
        alert(e?.error?.message || 'Error guardando la orden.');
      }
    });
  }
}
