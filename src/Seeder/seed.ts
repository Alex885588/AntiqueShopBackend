import { NestFactory } from "@nestjs/core";
import { AppModule } from "../app.module";
import * as fs from "fs";
import { AuthService } from "src/Services/auth.service";
import * as bcrypt from "bcrypt";

export async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const userSeeder = app.get(AuthService);
    const userCount = await userSeeder.getTableLength()
    if (userCount === 0) {
        const jsonFilePathUsers = "./src/Utils/users.json"
        const jsonDataUsers = fs.readFileSync(jsonFilePathUsers, "utf8")
        const newJsonUser = JSON.parse(jsonDataUsers);
        for (const user of newJsonUser) {
            user.password = await bcrypt.hash(user.password, 10);
        }
        await userSeeder.seedData(newJsonUser);
        await app.close();
    }
    await app.close();
}

bootstrap();
