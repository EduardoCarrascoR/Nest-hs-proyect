import { Injectable } from '@nestjs/common';
import * as pdf from "html-pdf";
import * as moment from "moment";
import { User } from 'src/entities';
import { UserDTO } from 'src/modules/users/dtos';

@Injectable()
export class PdfService {
    

    generatePdf(user: User) {
        let contenido = `
            <h1>Esto es un test de html-pdf</h1>
            <p>Estoy generando PDF a partir de este código HTML sencillo</p>
            `;
        // return pdf.create(contenido).toFile('./pdfs/salida.pdf');

        return new Promise((resolve, reject) => {
            pdf.create(contenido).toFile(`./pdfs/salida_${moment().format('DD-MM-YYYY')}-${user.id}.pdf`, (err, res) => {
                
                if(err) {
                    reject(err)
                } else {
                    resolve(res)
                }
            });
        }) 
        
    }

}
