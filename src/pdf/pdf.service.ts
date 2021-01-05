import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as pdf from "html-pdf";
import * as moment from "moment";
import * as nodemailer from "nodemailer";
import * as fs from "fs";
import { EMAIL_PASS, EMAIL_REPORT } from "../config/constants";
import { Shift, User } from 'src/entities';
import { UserDTO } from 'src/modules/users/dtos';
import { getConnection, getRepository } from 'typeorm';
import { ShiftDTO } from 'src/modules/shifts/dtos/shift.dto';

@Injectable()
export class PdfService {
    
    constructor(
        private readonly config: ConfigService 
    ) {}

    generatePdf(user: User, shift) {
        let contentPDF = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <!-- Compiled and minified CSS -->
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css">
            <style type="text/css">
              .hs-color {
                background-color: #001039;
              }
        
              .hs-text-color {
                color: #001039;
              }

              img.report-error {
                height: 30vh;
              } 
            </style>
            <title>Pdf</title>
        </head>
        <body class="container">
          <div class="row">
              <div class="col s12 m12">
                <div class="card-panel grey lighten-4 z-depth-1">
                  <h5 class="center hs-text-color">Reporte del turno</h5>
                  <br>
                  <br>
                  <div class="card-panel grey lighten-5 z-depth-1">
                    <span class="hs-text-color">Cliente: ${shift.clientClient.name}</span>
                    <br>
                    <span class="hs-text-color">Direccion: ${shift.clientClient.address}</span>
                  </div>
                  <br>
        `;
        // Llenado tabla Reportes
        if(shift.reports.length > 0) {
          contentPDF+=`
                  <h5 class="center">Reportes</h5>
                  <table class="z-depth-2">
                    <thead class="hs-color">
                      <tr>
                        <th class="white-text">Tipo</th>
                        <th class="white-text">Hora</th>
                        <th class="white-text">Guardia</th>
                      </tr>
                    </thead>
                    <tbody class="white">`

          for(let data of shift.reports){
            contentPDF+= `
                      <tr>
                        <td>${data.type}</td>
                        <td>${(data.time || 'Sin registrar')}</td>`
            for(const guard of shift.guards) {
              if(guard.id === data.guardId){
                contentPDF+=`
                        <td>${(guard.firstname+` `+guard.lastname || 'Sin registrar')}</td>
                      </tr>`
              }
            }
          }

          contentPDF+=`
                    </tbody>
                  </table>
                  <br>`
        } else {
          contentPDF+=`
                  <br>`
        }
        // Llenado tabla Libro de novedades
        if(shift.news.length > 0) {
          contentPDF+=`
                  <h5 class="center">Libro de novedades</h5>
                  <table class="z-depth-2">
                    <thead class="hs-color">
                      <tr>
                        <th class="white-text">Título</th>
                        <th class="white-text">Descripción</th>
                      </tr>
                    </thead>
                    <tbody class="white">`

          for(let data of shift.news){
            contentPDF+= `
                      <tr>
                        <td>${(data.title || 'Sin registrar')}</td>
                        <td>${(data.description || 'Sin registrar')}</td>
                      </tr>`
          }

          contentPDF+=`
                    </tbody>
                  </table>
                  <br>`
        } else {
          contentPDF+=`
                  <br>`
        }
        // Llenado tabla Visitas
        if(shift.visits.length > 0) {
          contentPDF+=`
          <h5 class="center">Listado de visitas</h5>
                  <table class="z-depth-2">
                    <thead class="hs-color">
                      <tr>
                        <th class="white-text">Nombre</th>
                        <th class="white-text">Patente</th>
                        <th class="white-text">Rut</th>
                        <th class="white-text">Entrada</th>
                        <th class="white-text">Salida</th>
                      </tr>
                    </thead>
                    <tbody class="white">`

          for(let data of shift.visits){
            contentPDF+= `
                      <tr>
                        <td>${data.name}</td>
                        <td>${(data.patent || 'Sin registrar')}</td>
                        <td>${(data.rut || 'Sin registrar')}</td>
                        <td>${data.in}</td>
                        <td>${(data.out || 'Sin registrar')}</td>`
            
          }

          contentPDF+=`
                    </tbody>
                  </table>
                  <br>`
        } else {
          contentPDF+=`
                  <br>`
        }
        contentPDF+=`
              </div>
            </div>
          </div>
          <!-- Compiled and minified JavaScript -->
          <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js"></script>
        </body>
        </html>`
        
        return new Promise((resolve, reject) => {
            pdf.create(contentPDF).toFile(`./pdfs/reporte_${moment().format('DD-MM-YYYY_hh-mm-ssa')}-${user.id}.pdf`, (err, res) => {
                
                if(err) {
                    reject(err)
                } else {
                    resolve(res)
                }
            });
        }) 
        
    }

    async sendMailPdf(pdfFileName, client, date) {
        await moment.locale('es')
        const dateFormat = await moment(date).format("DD MMM YYYY")
        const contentEmailHTML = `
        <!doctype html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">

<head>
  <title> High Security </title>
  <!--[if !mso]><!-- -->
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <!--<![endif]-->
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style type="text/css">
    #outlook a {
      padding: 0;
    }

    body {
      margin: 0;
      padding: 0;
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }

    table,
    td {
      border-collapse: collapse;
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }

    img {
      border: 0;
      height: auto;
      line-height: 100%;
      outline: none;
      text-decoration: none;
      -ms-interpolation-mode: bicubic;
    }

    p {
      display: block;
      margin: 13px 0;
    }
  </style>
  <!--[if mso]>
        <xml>
        <o:OfficeDocumentSettings>
          <o:AllowPNG/>
          <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
        </xml>
        <![endif]-->
  <!--[if lte mso 11]>
        <style type="text/css">
          .mj-outlook-group-fix { width:100% !important; }
        </style>
        <![endif]-->
  <style type="text/css">
    @media only screen and (min-width:480px) {
      .mj-column-per-100 {
        width: 100% !important;
        max-width: 100%;
      }
      .mj-column-per-50 {
        width: 50% !important;
        max-width: 50%;
      }
    }
  </style>
  <style type="text/css">
    @media only screen and (max-width:480px) {
      table.mj-full-width-mobile {
        width: 100% !important;
      }
      td.mj-full-width-mobile {
        width: auto !important;
      }
    }
  </style>
</head>

<body style="background-color:#E7E7E7;">
  <div style="display:none;font-size:1px;color:#ffffff;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;"> Pre-header Text </div>
  <div style="background-color:#E7E7E7;">
    <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#001039;background-color:#001039;width:100%;">
      <tbody>
        <tr>
          <td>
            <!--[if mso | IE]>
      <table
         align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600"
      >
        <tr>
          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
      <![endif]-->
            <div style="margin:0px auto;max-width:600px;">
              <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
                <tbody>
                  <tr>
                    <td style="direction:ltr;font-size:0px;padding:20px 0;padding-bottom:0;text-align:center;">
                      <!--[if mso | IE]>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                
        <tr>
      
            <td
               class="" style="vertical-align:top;width:600px;"
            >
          <![endif]-->
                      <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                        <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                          <tr>
                            <td align="center" style="font-size:0px;padding:0;word-break:break-word;">
                              <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;">
                                <tbody>
                                  <tr>
                                    <td style="width:600px;"> <a href="https://google.com" target="_blank">
          
      <img alt height="auto" src="https://lh3.googleusercontent.com/fife/ABSRlIre7oqdRjUjMO32K-L4yiT0MneWvf0rN0r8ClRKJUnhbEY9yfTpY1a1bupMV8n2sy-oCrKLXvddi2oXWqroEeSmKc0HraYI10m8d_DeG7Ia0PgNhxQWIVoBYmw503XXBer_Zk9Qfy-0woTBQaaCMI5AN1eIlKYCawBdYMbOrNNWaFy6lgwp5AQqdefYxdA478oyCrd8RYzgwV4iWw5xGqXlOnx7Fxx6_DCw2rhsxdKvf1QlSEdTwDM282qlijVyrxKxnfTSOgqfsPVrFLsyGcozlZTmK240lO3IBbvTwpQMzGxchSi48_auxjJGuo5ChMtZocYjBPCbO0fz1infB1MhV6xu52eHevvXi9FT9iuD4fOi_B9SPz4SxXTDvN-qOhwPolvtqLvBGDnZVoGH4HgBJbRqppAmMkBVFnMAPdENlSxanxtYj2pLw_PRslG-iyEyT7tdAoD8RtNtDHQk2W0JFSnclx_QC65X1k0hxlmcMALTmxghiEYp2cW89R-QBlk_H8HkdGyOBOnTGDhYsM3oP8ZpOmr56Cf4vhyqjQRwpTv6Hjelt6wmv6MUj4wEAQ0hsTx0LlWJCzawMyC3Tk_TacLxCl7Wkmov-_IaL-WYF1OdvHqAezj-h11Jx9edJBNA74IbZ4WeoG3-DE2KgwsL_VHwy6v36E4m01pMYqM04WORBAuOt8QuqxTzrbZ3NWIiQ3zfHW5wcbT5DBPYYIqowSOSHQhUvQ=w1325-h666-ft" style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;" width="600">
    
        </a> </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </table>
                      </div>
                      <!--[if mso | IE]>
            </td>
          
        </tr>
      
                  </table>
                <![endif]-->
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <!--[if mso | IE]>
          </td>
        </tr>
      </table>
      <![endif]-->
          </td>
        </tr>
      </tbody>
    </table>
    <!--[if mso | IE]>
      <table
         align="center" border="0" cellpadding="0" cellspacing="0" class="body-section-outlook" style="width:600px;" width="600"
      >
        <tr>
          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
      <![endif]-->
    <div class="body-section" style="-webkit-box-shadow: 1px 4px 11px 0px rgba(0, 0, 0, 0.15); -moz-box-shadow: 1px 4px 11px 0px rgba(0, 0, 0, 0.15); box-shadow: 1px 4px 11px 0px rgba(0, 0, 0, 0.15); margin: 0px auto; max-width: 600px;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
        <tbody>
          <tr>
            <td style="direction:ltr;font-size:0px;padding:20px 0;padding-bottom:0;padding-top:0;text-align:center;">
              <!--[if mso | IE]>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                
            <tr>
              <td
                 class="" width="600px"
              >
          
      <table
         align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600"
      >
        <tr>
          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
      <![endif]-->
              <div style="background:#ffffff;background-color:#ffffff;margin:0px auto;max-width:600px;">
                <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;background-color:#ffffff;width:100%;">
                  <tbody>
                    <tr>
                      <td style="direction:ltr;font-size:0px;padding:20px 0;padding-left:15px;padding-right:15px;text-align:center;">
                        <!--[if mso | IE]>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                
        <tr>
      
            <td
               class="" style="vertical-align:top;width:570px;"
            >
          <![endif]-->
                        <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                          <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                            <tr>
                              <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                <div style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:20px;font-weight:bold;line-height:24px;text-align:left;color:#212b35;">Informe de la ronda asignada el dia <span>${dateFormat}</span></div>
                              </td>
                            </tr>
                            <tr>
                              <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                <div style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:16px;font-weight:400;line-height:24px;text-align:left;color:#637381;">Saludos ${client.name},</div>
                              </td>
                            </tr>
                            <tr>
                              <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                <div style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:16px;font-weight:400;line-height:24px;text-align:left;color:#637381;">Se adjunta el informe detallado de la ronda solicitada.</div>
                              </td>
                            </tr>
                            <tr>
                              <td style="font-size:0px;padding:20px 0;padding-top:0;padding-right:15px;padding-left:15px;word-break:break-word;">
                                <!--[if mso | IE]>
      <table
         align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:570px;" width="570"
      >
        <tr>
          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
      <![endif]-->
                                <div style="background:#ffffff;background-color:#ffffff;margin:0px auto;max-width:570px;">
                                  <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;background-color:#ffffff;width:100%;">
                                    <tbody>
                                      <tr>
                                        <td style="direction:ltr;font-size:0px;padding:20px 0;padding-left:15px;padding-right:15px;padding-top:0;text-align:center;">
                                          <!--[if mso | IE]>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                
        <tr>
      
            <td
               class="" style="vertical-align:top;width:540px;"
            >
          <![endif]-->
                                          <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                                            <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                                              <tr>
                                                <td style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                                  <p style="border-top:solid 1px #DFE3E8;font-size:1px;margin:0px auto;width:100%;"> </p>
                                                  <!--[if mso | IE]>
        <table
           align="center" border="0" cellpadding="0" cellspacing="0" style="border-top:solid 1px #DFE3E8;font-size:1px;margin:0px auto;width:490px;" role="presentation" width="490px"
        >
          <tr>
            <td style="height:0;line-height:0;">
              &nbsp;
            </td>
          </tr>
        </table>
      <![endif]-->
                                                </td>
                                              </tr>
                                            </table>
                                          </div>
                                          <!--[if mso | IE]>
            </td>
          
        </tr>
      
                  </table>
                <![endif]-->
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                                <!--[if mso | IE]>
          </td>
        </tr>
      </table>
      <![endif]-->
                              </td>
                            </tr>
                            <tr>
                              <td style="font-size:0px;padding:0 15px 0 15px;word-break:break-word;">
                                <!--[if mso | IE]>
      <table
         align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:570px;" width="570"
      >
        <tr>
          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
      <![endif]-->
                                <div style="background:#ffffff;background-color:#ffffff;margin:0px auto;max-width:570px;">
                                  <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;background-color:#ffffff;width:100%;">
                                    <tbody>
                                      <tr>
                                        <td style="direction:ltr;font-size:0px;padding:0 15px 0 15px;text-align:center;">
                                          <!--[if mso | IE]>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                
        <tr>
      
            <td
               class="" style="vertical-align:top;width:540px;"
            >
          <![endif]-->
                                          <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                                            <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                                              <tr>
                                                <td align="left" style="font-size:0px;padding:10px 25px;padding-bottom:0;word-break:break-word;">
                                                  <div style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:20px;font-weight:bold;line-height:24px;text-align:left;color:#212b35;">Saludos cordiales!</div>
                                                </td>
                                              </tr>
                                              <tr>
                                                <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                                  <div style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:16px;font-weight:400;line-height:24px;text-align:left;color:#637381;">Empresa High Security.</div>
                                                </td>
                                              </tr>
                                            </table>
                                          </div>
                                          <!--[if mso | IE]>
            </td>
          
        </tr>
      
                  </table>
                <![endif]-->
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                                <!--[if mso | IE]>
          </td>
        </tr>
      </table>
      <![endif]-->
                              </td>
                            </tr>
                            <tr>
                              <td style="font-size:0px;padding:20px 0;padding-right:15px;padding-left:15px;word-break:break-word;">
                                <!--[if mso | IE]>
      <table
         align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:570px;" width="570"
      >
        <tr>
          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
      <![endif]-->
                                <div style="background:#ffffff;background-color:#ffffff;margin:0px auto;max-width:570px;">
                                  <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;background-color:#ffffff;width:100%;">
                                    <tbody>
                                      <tr>
                                        <td style="direction:ltr;font-size:0px;padding:20px 0;padding-left:15px;padding-right:15px;text-align:center;">
                                          <!--[if mso | IE]>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                
        <tr>
      
            <td
               class="" style="vertical-align:top;width:270px;"
            >
          <![endif]-->
                                          <div class="mj-column-per-50 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                                            <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                                              <tr>
                                                <td align="left" style="font-size:0px;padding:10px 25px;padding-bottom:0;word-break:break-word;">
                                                  <div style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:12px;font-weight:bold;line-height:24px;text-align:left;text-transform:uppercase;color:#212b35;">Dirección</div>
                                                </td>
                                              </tr>
                                              <tr>
                                                <td align="left" style="font-size:0px;padding:10px 25px;padding-top:0;word-break:break-word;">
                                                  <div style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:13px;font-weight:400;line-height:24px;text-align:left;color:#637381;">Av. Nueva Providencia 1363, <br> Providencia, Región Metropolitana</div>
                                                </td>
                                              </tr>
                                            </table>
                                          </div>
                                          <!--[if mso | IE]>
            </td>
          
            <td
               class="" style="vertical-align:top;width:270px;"
            >
          <![endif]-->
                                          <div class="mj-column-per-50 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                                            <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                                              <tr>
                                                <td align="left" style="font-size:0px;padding:10px 25px;padding-bottom:0;word-break:break-word;">
                                                  <div style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:12px;font-weight:bold;line-height:24px;text-align:left;text-transform:uppercase;color:#212b35;">Contacto</div>
                                                </td>
                                              </tr>
                                              <tr>
                                                <td align="left" style="font-size:0px;padding:10px 25px;padding-top:0;word-break:break-word;">
                                                  <div style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:13px;font-weight:400;line-height:24px;text-align:left;color:#637381;">(2) 2236 9539, <br> info@highsecurity.cl</div>
                                                </td>
                                              </tr>
                                            </table>
                                          </div>
                                          <!--[if mso | IE]>
            </td>
          
        </tr>
      
                  </table>
                <![endif]-->
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                                <!--[if mso | IE]>
          </td>
        </tr>
      </table>
      <![endif]-->
                              </td>
                            </tr>
                          </table>
                        </div>
                        <!--[if mso | IE]>
            </td>
          
        </tr>
      
                  </table>
                <![endif]-->
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <!--[if mso | IE]>
          </td>
        </tr>
      </table>
      
              </td>
            </tr>
          
                  </table>
                <![endif]-->
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!--[if mso | IE]>
          </td>
        </tr>
      </table>
      <![endif]-->
    <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
      <tbody>
        <tr>
          <td>
            <!--[if mso | IE]>
      <table
         align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600"
      >
        <tr>
          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
      <![endif]-->
            <div style="margin:0px auto;max-width:600px;">
              <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
                <tbody>
                  <tr>
                    <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;">
                      <!--[if mso | IE]>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                
            <tr>
              <td
                 class="" width="600px"
              >
          
      <table
         align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600"
      >
        <tr>
          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
      <![endif]-->
                      <div style="margin:0px auto;max-width:600px;">
                        <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
                          <tbody>
                            <tr>
                              <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;">
                                <!--[if mso | IE]>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                
        <tr>
      
            <td
               class="" style="vertical-align:top;width:600px;"
            >
          <![endif]-->
                                <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                                  <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
                                    <tbody>
                                      <tr>
                                        <td style="vertical-align:top;padding:0;">
                                          <table border="0" cellpadding="0" cellspacing="0" role="presentation" style width="100%">
                                            <tr>
                                              <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                                <div style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:11px;font-weight:400;line-height:16px;text-align:center;color:#445566;">You are receiving this email because you registered with High Security Accountants. (Av. Nueva Providencia 1363, Providencia, Región Metropolitana) and agreed to receive emails from us regarding new features,
                                                  events and special offers.</div>
                                              </td>
                                            </tr>
                                            <tr>
                                              <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                                <div style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:11px;font-weight:400;line-height:16px;text-align:center;color:#445566;">&copy; High Security, Todos los derechos Reservados.</div>
                                              </td>
                                            </tr>
                                          </table>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                                <!--[if mso | IE]>
            </td>
          
        </tr>
      
                  </table>
                <![endif]-->
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <!--[if mso | IE]>
          </td>
        </tr>
      </table>
      
              </td>
            </tr>
          
                  </table>
                <![endif]-->
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <!--[if mso | IE]>
          </td>
        </tr>
      </table>
      <![endif]-->
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</body>

</html>`;
        
        let messageOptions = {
            from: "High Security <reportes@highsecurity.cl>",
            to: `${client.email}`,
            subject: "Reportes HighSecutiry",
            html: contentEmailHTML,
            attachments: [{
                filename: "reporte.pdf",
                path: pdfFileName
            }]
        }
        const transporter = nodemailer.createTransport({
            host: "mail.highsecurity.cl",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
              user: this.config.get<string>(EMAIL_REPORT), // generated ethereal user
              pass: this.config.get<string>(EMAIL_PASS), // generated ethereal password
            },
            tls: {
                rejectUnauthorized: false
            }
        });
        transporter.sendMail(messageOptions, async (error, info) => {
            if (error) {
                
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId)
            await fs.unlinkSync(pdfFileName)
        })
        
        return true
        
    }

}
