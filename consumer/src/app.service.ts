import { Injectable } from '@nestjs/common';
import { OrderDTO } from './order.dto';

@Injectable()
export class AppService {
  orders: OrderDTO[] | any[] = [];
  placeOrder(order: OrderDTO) {
    this.orders.push(order);
    console.log('received Data: ', order.name);
  }

  getOrders() {
    return this.orders;
  }
}
