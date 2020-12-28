import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { News, Shift, User, Workedhours } from 'src/entities';
import { getConnection, Repository } from 'typeorm';
import { CreateNewDTO, NewsDTO } from '../dtos/new.dto';

@Injectable()
export class NewsService {
    constructor(
        @InjectRepository(News)
            private readonly newsRepository: Repository<News>
    ) {}

    async findAllNews(shiftId: number, UserEntity?: User) {
        const news = await this.newsRepository.find({ where: { shiftsShiftsId: shiftId }, relations: ["shiftsShifts"] })
            return news;
        
    }

    async addNew(newDTO: CreateNewDTO, UserEntity?: User) {
        const { shiftId, ...rest } = newDTO;
        await getConnection().transaction(async transaction => {
            const shift: Shift = await transaction.findOne(Shift, { where: { shiftId }});
            const shiftInitalizedOrFinalized: Workedhours = await transaction.findOne(Workedhours, { where: { shiftHoursId: newDTO.shiftId, guardId: UserEntity.id }})
            
            if(!shift) throw new HttpException({ success: false, status: HttpStatus.NOT_FOUND, message: 'Shift does not exists or unauthorized'}, HttpStatus.NOT_FOUND)
            if(!shiftInitalizedOrFinalized || shiftInitalizedOrFinalized.start === null ) throw new HttpException({ success: false, status: HttpStatus.NOT_FOUND, message: 'shift has not been started or unauthorized'},HttpStatus.NOT_FOUND)
            if(shiftInitalizedOrFinalized.finish !== null) throw new HttpException({ success: false, status: HttpStatus.CONFLICT, message: 'shift has been finished or unauthorized'},HttpStatus.CONFLICT)
            
            const news: News = await transaction.create(News, {
                ...rest,
                shiftsShifts: shift
            })
            await transaction.save(news)

            return await news;
        })
    }
}
