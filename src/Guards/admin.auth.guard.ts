import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { UserRole } from 'src/Enums/user.role';

@Injectable()
export class JwtAdminAuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (user) {
            const userRole = user.role;
            if (userRole === UserRole.Admin) {
                return true;
            }
        }
        throw new UnauthorizedException('User is not authorized to access this resource');
    }
}
