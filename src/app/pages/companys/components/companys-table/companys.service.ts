import { AuthService } from './../../../../shared/services/auth.service';
import { CompanysResponseInterface } from './companys-response.interface';
import { throwError as observableThrowError, Observable } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { CompanysInterface } from './companys.interface';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Configuration } from '../../../../app.constants';

@Injectable({
  providedIn: 'root'
})
export class CompanysService {
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
        this.endPoint = `${this._configuration.apiUrl}company`;
       }
       findByIdCompanygroup = ( id ) : Observable<CompanysResponseInterface> => {
           return this._http.get<HttpResponse<any>>(`${this.endPoint}/companygroup/${id}`, this.options)
               .pipe(
                   map((response: any) => response),
                   catchError(this.handleError));
       }
       allFromTo = ( fechaDesde: string, fechaHasta: string ) : Observable<CompanysResponseInterface> => {
           return this._http.get<HttpResponse<any>>(`${this.endPoint}/from-to/${fechaDesde}/${fechaHasta}`, this.options)
               .pipe(
                   map((response: any) => response),
                   catchError(this.handleError));
       }
       all = () : Observable<CompanysResponseInterface> => {
           return this._http.get<HttpResponse<any>>(this.endPoint, this.options)
               .pipe(
                   map((response: any) => response),
                   catchError(this.handleError));
       }
       findById = ( id ) : Observable<CompanysResponseInterface> => {
           return this._http.get<HttpResponse<any>>(`${this.endPoint}/${id}`, this.options)
               .pipe(
                   map((response: any) => response),
                   catchError(this.handleError));
       }
       update = ( company: CompanysInterface ) : Observable<CompanysResponseInterface> => {
           return this._http.patch<HttpResponse<any>>(this.endPoint, company, this.options)
               .pipe(
                   map((response: any) => response),
                   catchError(this.handleError));
       }
       remove= ( id ) : Observable<CompanysResponseInterface> => {
           return this._http.delete<HttpResponse<any>>(`${this.endPoint}/${id}`, this.options)
               .pipe(
                   map((response: any) => response),
                   catchError(this.handleError));
       }
       exist = ( id ) : Observable<CompanysResponseInterface> => {
           return this._http.get<HttpResponse<any>>(`${this.endPoint}/${id}`, this.options)
               .pipe(
                   map((response: any) => response),
                   catchError(this.handleError));
       }
       count = () : Observable<CompanysResponseInterface> => {
           return this._http.get<HttpResponse<any>>(`${this.endPoint}`, this.options)
               .pipe(
                   map((response: any) => response),
                   catchError(this.handleError));
       }
       insert = ( company: CompanysInterface ) : Observable<CompanysResponseInterface> => {
           return this._http.post<HttpResponse<any>>(this.endPoint, company, this.options)
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
       
    // IMÁGENES
    updateFile = ( company: CompanysInterface, documento?: File ) : Observable<any> => {
        var formData: any = new FormData();
        if (documento) {
            formData.append("documento", documento);
        }
        formData.append("idcompany", company.idcompany);
        formData.append("name", company.name);
        formData.append("companygroup_idcompanygroup", company.companygroup_idcompanygroup);
        return this._http.patch<HttpResponse<any>>(`${this.endPoint}/file`, formData, {
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
    insertFile = ( company: CompanysInterface, documento?: File ) : Observable<any> => {
        var formData: any = new FormData();
        if (documento) {
            formData.append("documento", documento);
        }
        formData.append("name", company.name);
        formData.append("companygroup_idcompanygroup", company.companygroup_idcompanygroup);
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
