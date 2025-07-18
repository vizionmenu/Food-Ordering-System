import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { RestaurantRole } from "@vision-menu/types";

@Injectable()
export class RestaurantRoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<RestaurantRole[]>(
      "roles",
      context.getHandler(),
    );

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException("User not authenticated");
    }

    if (!user.restaurant_id) {
      throw new ForbiddenException("User not associated with a restaurant");
    }

    if (!user.role) {
      throw new ForbiddenException("User role not defined");
    }

    // Owner has all permissions
    if (user.role === "owner") {
      return true;
    }

    // Check if user has required role
    const hasRole = requiredRoles.includes(user.role);

    if (!hasRole) {
      throw new ForbiddenException(
        `Required role: ${requiredRoles.join(", ")}. Current role: ${user.role}`,
      );
    }

    return true;
  }
}
