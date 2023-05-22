import { AuthService } from './../../../../shared/services/auth.service';
import { Service_employeeestadosResponseInterface } from './service_employeeestados-response.interface';
import { throwError as observableThrowError, Observable } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Service_employeeestadosInterface } from './service_employeeestados.interface';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Configuration } from '../../../../app.constants';

@Injectable({
  providedIn: 'root'
})
export class Service_employeeestadosService {
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
        this.endPoint = `${this._configuration.apiUrl}service_employee`;
       }
       findByIdProject_service = ( id ) : Observable<Service_employeeestadosResponseInterface> => {
           return this._http.get<HttpResponse<any>>(`${this.endPoint}/project_service/${id}`, this.options)
               .pipe(
                   map((response: any) => response),
                   catchError(this.handleError));
       }
       findByIdServiceEmployee = ( id ) : Observable<Service_employeeestadosResponseInterface> => {
        return this._http.get<HttpResponse<any>>(`${this._configuration.apiUrl}service_employeeestado/service_employee/${id}`, this.options)
            .pipe(
                map((response: any) => response),
                catchError(this.handleError));
       }
       findByIdEmployee = ( id ) : Observable<Service_employeeestadosResponseInterface> => {
           return this._http.get<HttpResponse<any>>(`${this.endPoint}/employee/${id}`, this.options)
               .pipe(
                   map((response: any) => response),
                   catchError(this.handleError));
       }
       allFromTo = ( fechaDesde: string, fechaHasta: string ) : Observable<Service_employeeestadosResponseInterface> => {
           return this._http.get<HttpResponse<any>>(`${this.endPoint}/from-to/${fechaDesde}/${fechaHasta}`, this.options)
               .pipe(
                   map((response: any) => response),
                   catchError(this.handleError));
       }
       allEstadosFromTo = ( fechaDesde: string, fechaHasta: string ) : Observable<Service_employeeestadosResponseInterface> => {
           return this._http.get<HttpResponse<any>>(`${this._configuration.apiUrl}service_employeeestado/from-to/${fechaDesde}/${fechaHasta}`, this.options)
               .pipe(
                   map((response: any) => response),
                   catchError(this.handleError));
       }
       all = () : Observable<Service_employeeestadosResponseInterface> => {
           return this._http.get<HttpResponse<any>>(this.endPoint, this.options)
               .pipe(
                   map((response: any) => response),
                   catchError(this.handleError));
       }
       findById = ( id ) : Observable<Service_employeeestadosResponseInterface> => {
           return this._http.get<HttpResponse<any>>(`${this.endPoint}/${id}`, this.options)
               .pipe(
                   map((response: any) => response),
                   catchError(this.handleError));
       }
       update = ( service_employee: Service_employeeestadosInterface ) : Observable<Service_employeeestadosResponseInterface> => {
           return this._http.patch<HttpResponse<any>>(this.endPoint, service_employee, this.options)
               .pipe(
                   map((response: any) => response),
                   catchError(this.handleError));
       }
       remove= ( id ) : Observable<Service_employeeestadosResponseInterface> => {
           return this._http.delete<HttpResponse<any>>(`${this.endPoint}/${id}`, this.options)
               .pipe(
                   map((response: any) => response),
                   catchError(this.handleError));
       }
       removeEstado = ( id ) : Observable<Service_employeeestadosResponseInterface> => {
        return this._http.delete<HttpResponse<any>>(`${this._configuration.apiUrl}service_employeeestado/${id}`, this.options)
            .pipe(
                map((response: any) => response),
                catchError(this.handleError));
        }
       exist = ( id ) : Observable<Service_employeeestadosResponseInterface> => {
           return this._http.get<HttpResponse<any>>(`${this.endPoint}/${id}`, this.options)
               .pipe(
                   map((response: any) => response),
                   catchError(this.handleError));
       }
       count = () : Observable<Service_employeeestadosResponseInterface> => {
           return this._http.get<HttpResponse<any>>(`${this.endPoint}`, this.options)
               .pipe(
                   map((response: any) => response),
                   catchError(this.handleError));
       }
       insert = ( service_employee: Service_employeeestadosInterface ) : Observable<Service_employeeestadosResponseInterface> => {
           return this._http.post<HttpResponse<any>>(this.endPoint, service_employee, this.options)
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
       insertFile = ( service_employee: Service_employeeestadosInterface, documento?: File ) : Observable<any> => {
           var formData: any = new FormData();
           if (documento) {
               formData.append("documento", documento);
           }
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
