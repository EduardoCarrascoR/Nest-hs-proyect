import { ConfigService } from "@nestjs/config";
import { getConnection, getRepository } from "typeorm";
import { User } from '../entities';
import { DEFAULT_USER_EMAIL, DEFAULT_USER_PASSWORD, DEFAULT_USER_RUT, DEFAULT_USER_FIRSTNAME, DEFAULT_USER_LASTNAME, DEFAULT_USER_PHONE } from "./constants";


export const setDefaultUser = async (config: ConfigService) => {
    let defaultUser;
    const user = {
        email: config.get<string>(DEFAULT_USER_EMAIL),
        firstname: config.get<string>(DEFAULT_USER_FIRSTNAME),
        lastname: config.get<string>(DEFAULT_USER_LASTNAME),
        password: config.get<string>(DEFAULT_USER_PASSWORD),
        rut: config.get<string>(DEFAULT_USER_RUT),
        phone: config.get<string>(DEFAULT_USER_PHONE),
        roles: ['Admin']
    }
    
    await getConnection().transaction(async transaction => {
        defaultUser = await transaction
            .createQueryBuilder()
            .select("user")
            .from(User, "user")
            .where("user.rut = :userRut", { userRut: config.get<string>(DEFAULT_USER_RUT)})
            .getOne();
        if(!defaultUser) {
            const adminUser = transaction.create(User,user)
    
            return await transaction.save(adminUser)
        }
    })
}