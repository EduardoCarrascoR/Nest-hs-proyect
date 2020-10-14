import { ConfigService } from "@nestjs/config";
import { getRepository } from "typeorm";
import { User } from '../entities';
import { DEFAULT_USER_EMAIL, DEFAULT_USER_PASSWORD, DEFAULT_USER_RUT, DEFAULT_USER_FIRSTNAME } from "./constants";


export const setDefaultUser = async (config: ConfigService) => {
    const userRepository = getRepository<User>(User)

    const defaultUser = await userRepository
        .createQueryBuilder()
        .where('rut = rut', { rut: config.get<string>(DEFAULT_USER_RUT)})
        .getOne()
    if(!defaultUser) {
        const adminUser = userRepository.create({
            email: config.get<string>(DEFAULT_USER_EMAIL),
            firstname: config.get<string>(DEFAULT_USER_FIRSTNAME),
            password: config.get<string>(DEFAULT_USER_PASSWORD),
            rut: config.get<string>(DEFAULT_USER_RUT),
            roles: ['Admin']
        })

        return await userRepository.save(adminUser)
    }
}