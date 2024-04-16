import { UserDto } from "../DTO/user.DTO";
import { User } from "../Models/user";

export class UserMapper {
    toDto(user: User): UserDto {
        const userDto: UserDto = new UserDto();
        userDto.id = user.id;
        userDto.username = user.username
        userDto.password = user.password
        userDto.userStatus = user.userStatus
        userDto.autoBidBalance = user.autoBidBalance
        userDto.notificationParcentage = user.notificationParcentage
        return userDto;
    }

    toEntity(userDto: UserDto): User {
        const user: User = new User();
        user.id = userDto.id;
        user.username = userDto.username
        user.password = userDto.password
        user.userStatus = userDto.userStatus
        user.autoBidBalance = userDto.autoBidBalance
        user.notificationParcentage = userDto.notificationParcentage
        return user;
    }
}
