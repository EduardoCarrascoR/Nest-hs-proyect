import { Controller, Get, Res, HttpStatus, Param, Put, Body, BadRequestException, Post, UseGuards } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { CreateUserDTO } from '../dtos/user.DTO';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/common/decorators';
import { EditUserDto } from '../dtos/edit-user.dto';
import { ACGuard, UseRoles } from 'nest-access-control';
import { AppResources } from 'src/common/enums';

@ApiTags('Users')
@Controller('users')
export class UsersController {
    constructor(
        private readonly userService: UsersService
    ){}

    @Auth()
    @Get('/all')
    async getUsers(@Res() res) {
        const users = await this.userService.findAllUser();
        return res.status(HttpStatus.OK).json(users)
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

    @Auth()
    @Put(':id')
    async updateUser(@Body() changes: EditUserDto, @Param() params) {
        if(!params.id) throw new BadRequestException("Can't update user id")

        return this.userService.updateUser(params.id, changes);
    }


}
