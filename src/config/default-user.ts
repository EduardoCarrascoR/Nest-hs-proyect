import { ConfigService } from "@nestjs/config";
import { getRepository } from "typeorm";
import { User } from "src/entities";
import { DEFAULT_USER_EMAIL, DEFAULT_USER_PASSWORD, DEFAULT_USER_RUT } from "./constants";


export const setDefaultUser = async (config: ConfigService) => {
    const userRepository = getRepository<User>(User)

    const defaultUser = await userRepository
        .createQueryBuilder()
        .where('email = email', { email: config.get<string>('DEFAULT_USER_EMAIL')})
        .getOne()
    if(!defaultUser) {
        const adminUser = userRepository.create({
            email: config.get<string>(DEFAULT_USER_EMAIL),
            password: config.get<string>(DEFAULT_USER_PASSWORD),
            rut: config.get<string>(DEFAULT_USER_RUT),
            roles: ['Admin']
        })

        return await userRepository.save(adminUser)
    }
}