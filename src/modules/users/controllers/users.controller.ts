import { Controller, Get, Res, HttpStatus, Param, Put, Body, BadRequestException, Post, UseGuards } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { UpdateUserDTO, CreateUserDTO } from '../dtos/user.DTO';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards';
import { Auth } from 'src/common/decorators';

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

    @Auth()
    @Post()
    async createUser(@Body() userdto: CreateUserDTO ) {
        const user = await this.userService.addUser(userdto)
    }

    @Auth()
    @Put(':id')
    async updateUser(@Body() changes: UpdateUserDTO, @Param() params) {
        if(!params.id) throw new BadRequestException("Can't update user id")

        return this.userService.updateUser(params.id, changes);
    }


}
