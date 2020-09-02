import { Controller, Get, Res, HttpStatus, Param, Put, Body, BadRequestException, Post } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { UpdateUserDTO, CreateUserDTO } from '../dtos/user.DTO';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
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

    @Post()
    async createUser(@Body() userdto: CreateUserDTO ) {
        const user = await this.userService.addUser(userdto)
    }

    @Put(':id')
    async updateUser(@Body() changes: UpdateUserDTO, @Param() params) {
        if(!params.id) throw new BadRequestException("Can't update user id")

        return this.userService.updateUser(params.id, changes);
    }


}
