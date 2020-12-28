import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { validate } from 'class-validator';

@Injectable()
export class DatePipePipe implements PipeTransform<string> {
  constructor() {}

    async transform(value: any, metadata: ArgumentMetadata) {
      console.log(value)
      try {
        let date = new Date(value)
        console.log(date)
          if( date.toISOString()) {
            return value
          };
        }catch(err) {
            throw new BadRequestException("Date not valid");
        }

        return value;
    }
}
