import { Controller, Get, Res, HttpStatus, Param, Put, Body, BadRequestException, Post, UseGuards } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { CreateUserDTO, EditUserDto } from '../dtos/';
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
        const users = await this.userService.findAllUser();
        return res.status(HttpStatus.OK).json(users);
    }

    @Auth({
        possession: 'any',
        action: 'create',
        resource: AppResources.USER,
    })
    @Post()
    async createUser(@Body() userdto: CreateUserDTO ) {
        const user = await this.userService.addUser(userdto);
        return { message: 'User created', user };
    }

    @Auth({
        possession: 'own',
        action: 'update',
        resource: AppResources.USER,
    })
    @Put(':id')
    async updateUser(@Param('id') id: number, @Body() changes: EditUserDto, @User() user: UserEntity) {
        
        let data;
        if(!id) throw new BadRequestException("Can't update user id")
        if(this.rolesBuilder
            .can(user.roles)
            .updateAny(AppResources.USER)
            .granted
        ) {
            //es Admin
            data = await this.userService.updateUser(id, changes)
        } else {
            // es Guard
            const { roles, ...rest } = changes;
            data = await this.userService.updateUser(id, rest, user)
        }

        return { message: 'User edited', data }
    }


}
