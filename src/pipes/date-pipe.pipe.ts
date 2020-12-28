import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class DatePipePipe implements PipeTransform<string> {
  constructor() {}

    async transform(value: any, metadata: ArgumentMetadata) {
      try {
        let date = new Date(value)
          if( date.toISOString()) {
            return value
          };
        }catch(err) {
            throw new BadRequestException("Date not valid");
        }

        return value;
    }
}
