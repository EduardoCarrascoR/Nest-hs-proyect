import { RolesBuilder } from "nest-access-control";
import { AppRoles, AppResources } from "./common/enums";

export const roles: RolesBuilder = new RolesBuilder();

roles
    // GUARD ROLES
    .grant(AppRoles.Guard)
    .updateOwn(AppResources.USER)
    .readOwn([AppResources.AUTH])
    // ADMIN ROLES
    .grant(AppRoles.Admin)
    .extend(AppRoles.Guard)
    .createAny([AppResources.USER])
    .updateAny([AppResources.USER])
    .readAny([AppResources.USER])
    .createAny([AppResources.CLIENT])
    .updateAny([AppResources.CLIENT])
    .readAny([AppResources.CLIENT])
