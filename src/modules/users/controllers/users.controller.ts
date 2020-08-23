import { Controller, Get, Res, HttpStatus, Param, Put, Body, BadRequestException } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { UpdateUser, UserData } from '../interface/user.interface';

@Controller('users')
export class UsersController {
    constructor(
        private readonly userService: UsersService
    ){}

    @Get('/all')
    async getUsers(@Res() res) {
        const users = await this.userService.findAllUser();
        return res.status(HttpStatus.OK).json(users)
    }

    @Get(':id')
    async getOneUser(@Param('id') params, @Res() res) {
        const user = await this.userService.findOneUser(params.id);
        return res.status(HttpStatus.OK).json(user);
    }

    @Put(':id')
    async updateUser(@Body() changes: UpdateUser, @Param() params) {
        if(!params.id) throw new BadRequestException("Can't update user id")

        return this.userService.updateUser(params.id, changes);
    }

}
