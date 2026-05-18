import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
@WebSocketGateway(3002)
export class WebsocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  //handle disconnect
  handleDisconnect(client: Socket) {
    console.log('Client disconnected', client.id);
  }

  //handle connection
  handleConnection(client: Socket) {
    console.log('Client connected', client.id);
  }

  @SubscribeMessage('message')
  handleMessage(
    @MessageBody() message: string,
    @ConnectedSocket() client: Socket,
  ) {
    console.log(message);

    // this only retuns to one client. but not broadcast to all clients.
    client.emit('replay', 'Hello from server');

    // broadcast to all clients including the server.
    //  we cna use server.broadcast.emit('replay', 'Hello from server as broadcaster'); will then not include the sender.
    this.server.emit('replay', 'Hello from server as broadcaster');
  }
}
