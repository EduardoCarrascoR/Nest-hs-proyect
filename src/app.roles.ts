import { RolesBuilder } from "nest-access-control";
import { AppRoles, AppResources } from "./common/enums";

export const roles: RolesBuilder = new RolesBuilder();

roles
    // GUARD ROLES
    .grant(AppRoles.Guard)
    .updateOwn(AppResources.USER)
    // ADMIN ROLES
    .grant(AppRoles.Admin)
    .createAny([AppResources.USER])
    .updateAny([AppResources.USER])
