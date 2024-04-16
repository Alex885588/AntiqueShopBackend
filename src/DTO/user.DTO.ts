import { UserRole } from "src/Enums/user.role";

export class UserDto {
    id?: number
    username?: string;
    password?: string;
    userStatus?: UserRole;
    autoBidBalance?: number;
    notificationParcentage?: number
}
