import { AuthService } from './../../../../shared/services/auth.service';
import { Si_logsResponseInterface } from './si_logs-response.interface';
import { throwError as observableThrowError, Observable } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Si_logsInterface } from './si_logs.interface';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Configuration } from '../../../../app.constants';

@Injectable({
  providedIn: 'root'
})
export class Si_logsService {
    private actionUrl: string;
    private headers: HttpHeaders;
    private options: any;
    private endPoint: string;
    constructor(
        private _http: HttpClient,
        private _configuration: Configuration,
        private authService: AuthService) {
        this.options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json; charset=UTF-8',
                'Authorization': 'JWT ' + this.authService.token
            })};
        this.endPoint = `${this._configuration.apiUrl}si_log`;
       }
       findByIdSi_modulo = ( id ) : Observable<Si_logsResponseInterface> => {
           return this._http.get<HttpResponse<any>>(`${this.endPoint}/si_modulo/${id}`, this.options)
               .pipe(
                   map((response: any) => response),
                   catchError(this.handleError));
       }
       findByIdSi_user = ( id ) : Observable<Si_logsResponseInterface> => {
           return this._http.get<HttpResponse<any>>(`${this.endPoint}/si_user/${id}`, this.options)
               .pipe(
                   map((response: any) => response),
                   catchError(this.handleError));
       }
       allFromTo = ( fechaDesde: string, fechaHasta: string ) : Observable<Si_logsResponseInterface> => {
           return this._http.get<HttpResponse<any>>(`${this.endPoint}/from-to/${fechaDesde}/${fechaHasta}`, this.options)
               .pipe(
                   map((response: any) => response),
                   catchError(this.handleError));
       }
       all = () : Observable<Si_logsResponseInterface> => {
           return this._http.get<HttpResponse<any>>(this.endPoint, this.options)
               .pipe(
                   map((response: any) => response),
                   catchError(this.handleError));
       }
       findById = ( id ) : Observable<Si_logsResponseInterface> => {
           return this._http.get<HttpResponse<any>>(`${this.endPoint}/${id}`, this.options)
               .pipe(
                   map((response: any) => response),
                   catchError(this.handleError));
       }
       update = ( si_log: Si_logsInterface ) : Observable<Si_logsResponseInterface> => {
           return this._http.patch<HttpResponse<any>>(this.endPoint, si_log, this.options)
               .pipe(
                   map((response: any) => response),
                   catchError(this.handleError));
       }
       remove= ( id ) : Observable<Si_logsResponseInterface> => {
           return this._http.delete<HttpResponse<any>>(`${this.endPoint}/${id}`, this.options)
               .pipe(
                   map((response: any) => response),
                   catchError(this.handleError));
       }
       exist = ( id ) : Observable<Si_logsResponseInterface> => {
           return this._http.get<HttpResponse<any>>(`${this.endPoint}/${id}`, this.options)
               .pipe(
                   map((response: any) => response),
                   catchError(this.handleError));
       }
       count = () : Observable<Si_logsResponseInterface> => {
           return this._http.get<HttpResponse<any>>(`${this.endPoint}`, this.options)
               .pipe(
                   map((response: any) => response),
                   catchError(this.handleError));
       }
       insert = ( si_log: Si_logsInterface ) : Observable<Si_logsResponseInterface> => {
           return this._http.post<HttpResponse<any>>(this.endPoint, si_log, this.options)
               .pipe(
                   map((response: any) => response),
                   catchError(this.handleError));
       }
       descargaZip = ( id: string, html: string ): Observable<any> => {
           const innerHTML = `

       <html>
       <head>
       <title>
       </title>
       <style>
           body {
               padding: 80px;
               font-family: 'Arial';
               font-size: 12px;
               line-height: 14px;
               text-align: left;
           }
           h5 {
               line-height: 15px;
           }
           @media print{
               .d-print-none, .d-print-none *{
                   display: none !important;
               }
           }
       </style>
       </head>
       <body>
           ${html}
       </body>
       </html>
       `;
           return this._http.post(`${this.endPoint}/download-zip/${id}`, { element: innerHTML },
               {
                   observe: 'response', 
                   responseType: 'arraybuffer',
                   headers: new HttpHeaders(
                       { 'Authorization': 'JWT ' + this.authService.token }
                   )
               })
               .pipe(
                   map((response: any) => response),
                   catchError(this.handleError));
       }
       insertFile = ( si_log: Si_logsInterface, documento?: File ) : Observable<any> => {
           var formData: any = new FormData();
           if (documento) {
               formData.append("documento", documento);
           }
           formData.append("si_modulo_idsi_modulo", si_log.si_modulo_idsi_modulo);
           formData.append("accion", si_log.accion);
           return this._http.post<HttpResponse<any>>(`${this.endPoint}/file`, formData, {
                       reportProgress: true,
                       observe: 'events',
                       headers: new HttpHeaders(
                           { 'Authorization': 'JWT ' + this.authService.token }
                       )
                   })
               .pipe(
                       map((response: any) => response),
                           catchError(this.handleError));
       }
       private handleError(error: HttpResponse<any>) {
           console.error(error);
           return observableThrowError(error || 'Server error');
       }
}
