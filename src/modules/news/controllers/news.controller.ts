import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InjectRolesBuilder, RolesBuilder } from 'nest-access-control';
import { Auth, User } from 'src/common/decorators';
import { AppResources } from 'src/common/enums';
import { User as UserEntity } from 'src/entities';
import { CreateNewDTO } from '../dtos/new.dto';
import { NewsService } from '../services/news.service';

@ApiTags('News')
@Controller('news')
export class NewsController {
    constructor(
        private readonly newsService: NewsService,
        @InjectRolesBuilder()
        private readonly rolesBuilder: RolesBuilder
    ) {}

    @Auth({
        possession: 'own',
        action: 'create',
        resource: AppResources.NEWS,
    })
    @Post()
    async createNew(@Body() newDTO: CreateNewDTO, @User() user: UserEntity, @Res() res) {
        const news = await this.newsService.addNew(newDTO, user);
        
        return await res.status(HttpStatus.CREATED).json({ success: true, message: 'New created', new: news })
    }

    @Auth({
        possession: 'own',
        action: 'read',
        resource: AppResources.NEWS,
    })
    @Get('/newsShift/:shiftId')
    async getNews(@Param('shiftId') shiftId: number, @User() user: UserEntity, @Res() res) {
        let news 
        if(this.rolesBuilder
            .can(user.roles)
            .readAny(AppResources.NEWS)
            .granted
        ) {
            //es Admin
            news = await this.newsService.findAllNews(shiftId)
        } else {
            // es Guard
            news = await this.newsService.findAllNews(shiftId, user)
        }
        if(news.length == 0) throw new HttpException({ success: false, status: HttpStatus.NOT_FOUND, message: "Shifts not found" }, HttpStatus.NOT_FOUND)
        return res.status(HttpStatus.OK).json({ success: true, message: 'Shift news', news })
    }

}
