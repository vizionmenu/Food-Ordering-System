import { Module } from "@nestjs/common";
import { RestaurantController } from "./restaurant.controller";
import { RestaurantService } from "./restaurant.service";

@Module({
  controllers: [RestaurantController],
  providers: [RestaurantService],
  exports: [RestaurantService],
})
export class RestaurantModule {}
