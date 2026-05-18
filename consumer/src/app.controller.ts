import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';
import { OrderDTO } from './order.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @EventPattern('order:placed')
  placeOrder(@Payload() data: OrderDTO) {
    console.log('we have seen uuu');
    console.log(data);
    this.appService.placeOrder(data);
  }

  @MessagePattern({ CMD: 'getOrders' })
  getOrders() {
    return this.appService.getOrders();
  }
}
