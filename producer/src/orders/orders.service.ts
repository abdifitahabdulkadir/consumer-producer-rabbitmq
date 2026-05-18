import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { timeout } from 'rxjs';
import { OrderDTO } from './order.dto';

@Injectable()
export class OrdersService {
  constructor(@Inject('ORDERS_SERVICE') private rabbitClient: ClientProxy) {}

  placeOrder(order: OrderDTO) {
    // you fire the an event and not wait to get any response.
    this.rabbitClient.emit('order:placed', order);
    return { message: 'successfully Placed the order' };
  }

  getOrders() {
    // you fire an event and wait the result to come back.
    return this.rabbitClient.send({ CMD: 'getOrders' }, {}).pipe(timeout(5000));
  }
}
