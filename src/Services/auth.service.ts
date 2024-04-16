import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { UserDto } from "../DTO/user.DTO";
import { UserMapper } from "../Mapper/user.mapper";
import { User } from "../Models/user";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private readonly jwtService: JwtService,
        private readonly userMapper: UserMapper,
    ) { }

    async getById(userId: number): Promise<UserDto> {
        const user = await this.userRepository.findOneById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return this.userMapper.toDto(user);
    }

    async getUsernameById(userId: number): Promise<string | undefined> {
        const user = await this.userRepository.findOneById(userId);
        return user?.username;
    }

    async create(userDto: UserDto): Promise<UserDto> {
        const newUser = this.userRepository.create(userDto);
        const savedUser = await this.userRepository.save(newUser);
        return this.userMapper.toDto(savedUser);
    }

    async update(updates: UserDto): Promise<UserDto> {
        const user = await this.userRepository.findOneById(updates.id);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        const updatedUser = Object.assign(user, updates);
        const saveUser = await this.userRepository.save(updatedUser);
        return this.userMapper.toDto(saveUser);
    }

    async signIn(username: string, password: string): Promise<{ token: string }> {
        const user = await this.isUsernameExists(username);
        const isCredentailsTrue = await bcrypt.compare(password, user.password);
        if (!user || !isCredentailsTrue) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const token = this.jwtService.sign({ id: user.id, username: user.username, role: user.userStatus });
        return { token };
    }

    async isUsernameExists(username: string): Promise<User> {
        const isExists = await this.userRepository
            .createQueryBuilder("user")
            .where("user.username = :username", { username })
            .getOne();
        return isExists;
    }

    async seedData(data: any) {
        const partners = this.userRepository.create(data);
        await this.userRepository.save(partners);
    }

    async getTableLength(): Promise<number> {
        const count = await this.userRepository.count();
        return count;
    }
}
