
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Notification } from './notification.entity';
import { PubserviceService } from 'src/pubservice/pubservice.service';


@Injectable()
export class NotificationService {  

  constructor(private prisma: PrismaService , private readonly pubSubService: PubserviceService ,) {  
  }

  async findMyNotifications(userId: string): Promise<Notification[]> {
    return this.prisma.notification.findMany({
      where: { OR:[
        {shopId:userId},
        {shopId:null}
      ] },
      orderBy: { createdAt: 'desc' },
    });
    
  }

  async markAsRead(id: string, userId: string): Promise<Notification> {
    return this.prisma.notification.update({
      where: { id, shopId:userId },
      data: { isRead: true },
    });
  }



  async createBroadcastNotification( message,
    route,
    title,
    url): Promise<Notification> {
    
      const notifications =await this.prisma.notification.create({data:{
        message,
        route,
        imageUrl:url,
        title
        
      }})
      console.log('ddddddddddddddddddddddddddddddddd',notifications)
      if(notifications){
        console.log(notifications)
      await this.pubSubService.publish(`broadcastNotification`, { broadcastNotification: notifications});
       


      }


    return notifications ;
  }
}
