import { Controller, Get, Res, HttpStatus, Param, Put, Body, BadRequestException, Post, UseGuards, HttpException } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { CreateUserDTO, EditUserDto } from '../dtos';
import { ApiTags } from '@nestjs/swagger';
import { Auth, User } from 'src/common/decorators';
import { InjectRolesBuilder, RolesBuilder } from 'nest-access-control';
import { AppResources } from 'src/common/enums';
import { User as UserEntity} from 'src/entities';

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
