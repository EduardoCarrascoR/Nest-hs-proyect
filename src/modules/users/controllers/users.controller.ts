import { Controller, Get, Res, HttpStatus, Param, Put, Body, Post, HttpException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InjectRolesBuilder, RolesBuilder } from 'nest-access-control';
import { UsersService } from '../services/users.service';
import { CreateUserDTO, EditUserDto } from '../dtos';
import { Auth, User } from '../../../common/decorators';
import { AppResources } from '../../../common/enums';
import { User as UserEntity} from '../../../entities';

@ApiTags('Users')
@Controller('users')
export class UsersController {
    constructor(
        private readonly userService: UsersService,
        @InjectRolesBuilder()
        private readonly rolesBuilder: RolesBuilder
    ) {}

    @Auth({
        possession: 'any',
        action: 'read',
        resource: AppResources.USER,
    })
    @Get('/all')
    async getUsers(@Res() res) {
        const users = await this.userService.findAllUsers();
        if(users.length == 0) throw new HttpException({ success: false, status: HttpStatus.NOT_FOUND, message: "Users not found" }, HttpStatus.NOT_FOUND)
        return res.status(HttpStatus.ACCEPTED).json({ success: true, users: users });
    }

    @Auth({
        possession: 'any',
        action: 'read',
        resource: AppResources.USER,
    })
    @Get('/allGuards')
    async getGuards(@Res() res) {
        const guards = await this.userService.findAllGuards();
        if(guards.length == 0) throw new HttpException({ success: false, status: HttpStatus.NOT_FOUND, message: "Guards not found" }, HttpStatus.NOT_FOUND)
        return res.status(HttpStatus.ACCEPTED).json({ success: true, guards: guards });
    }

    @Auth({
        possession: 'any',
        action: 'create',
        resource: AppResources.USER,
    })
    @Post()
    async createAdminUser(@Body() userdto: CreateUserDTO, @Res() res) {
        const user = await this.userService.addAdminUser(userdto);
        return res.status(HttpStatus.CREATED).json({ success: true, message: 'User created', user });
    }

    @Auth({
        possession: 'any',
        action: 'create',
        resource: AppResources.USER,
    })
    @Post('/Guard')
    async createGuardUser(@Body() userdto: CreateUserDTO, @Res() res) {
        const user = await this.userService.addGuardUser(userdto);
        return res.status(HttpStatus.CREATED).json({ success: true, message: 'User created', user });
    }

    @Auth({
        possession: 'own',
        action: 'update',
        resource: AppResources.USER,
    })
    @Put(':id')
    async updateUser(@Param('id') id: number, @Body() changes: EditUserDto, @User() user: UserEntity, @Res() res) {
        
        let data;
        if(!id) throw new HttpException({ success: false, status: HttpStatus.BAD_REQUEST, message: "Can't update user id" }, HttpStatus.BAD_REQUEST)
        if(this.rolesBuilder
            .can(user.roles)
            .updateAny(AppResources.USER)
            .granted
        ) {
            //es Admin
            data = await this.userService.updateUser(id, changes)
        } else {
            // es Guard
            const { ...rest } = changes;
            data = await this.userService.updateUser(id, rest, user)
        }

        return res.status(HttpStatus.OK).json({ success: true, message: 'User edited', user: data })
    }


}
