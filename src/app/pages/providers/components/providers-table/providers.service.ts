import { AuthService } from './../../../../shared/services/auth.service';
import { ProvidersResponseInterface } from './providers-response.interface';
import { throwError as observableThrowError, Observable } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { ProvidersInterface } from './providers.interface';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Configuration } from '../../../../app.constants';

@Injectable({
  providedIn: 'root'
})
export class ProvidersService {
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
        this.endPoint = `${this._configuration.apiUrl}provider`;
       }
       allFromTo = ( fechaDesde: string, fechaHasta: string ) : Observable<ProvidersResponseInterface> => {
           return this._http.get<HttpResponse<any>>(`${this.endPoint}/from-to/${fechaDesde}/${fechaHasta}`, this.options)
               .pipe(
                   map((response: any) => response),
                   catchError(this.handleError));
       }
       all = () : Observable<ProvidersResponseInterface> => {
           return this._http.get<HttpResponse<any>>(this.endPoint, this.options)
               .pipe(
                   map((response: any) => response),
                   catchError(this.handleError));
       }
       findById = ( id ) : Observable<ProvidersResponseInterface> => {
           return this._http.get<HttpResponse<any>>(`${this.endPoint}/${id}`, this.options)
               .pipe(
                   map((response: any) => response),
                   catchError(this.handleError));
       }
       update = ( provider: ProvidersInterface ) : Observable<ProvidersResponseInterface> => {
           return this._http.patch<HttpResponse<any>>(this.endPoint, provider, this.options)
               .pipe(
                   map((response: any) => response),
                   catchError(this.handleError));
       }
       remove= ( id ) : Observable<ProvidersResponseInterface> => {
           return this._http.delete<HttpResponse<any>>(`${this.endPoint}/${id}`, this.options)
               .pipe(
                   map((response: any) => response),
                   catchError(this.handleError));
       }
       exist = ( id ) : Observable<ProvidersResponseInterface> => {
           return this._http.get<HttpResponse<any>>(`${this.endPoint}/${id}`, this.options)
               .pipe(
                   map((response: any) => response),
                   catchError(this.handleError));
       }
       count = () : Observable<ProvidersResponseInterface> => {
           return this._http.get<HttpResponse<any>>(`${this.endPoint}`, this.options)
               .pipe(
                   map((response: any) => response),
                   catchError(this.handleError));
       }
       insert = ( provider: ProvidersInterface ) : Observable<ProvidersResponseInterface> => {
           return this._http.post<HttpResponse<any>>(this.endPoint, provider, this.options)
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
      updateFile = ( provider: ProvidersInterface, documento?: File ) : Observable<any> => {
      var formData: any = new FormData();
      if (documento) {
          formData.append("documento", documento);
      }
      formData.append("idprovider", provider.idprovider);
      formData.append("name", provider.name);
      formData.append("alias", provider.alias);
      formData.append("rfc", provider.rfc);
      formData.append("billing_email", provider.billing_email);
      formData.append("office_phone", provider.office_phone);
      formData.append("care_contact", provider.care_contact);
      formData.append("care_email", provider.care_email);
      formData.append("care_phone", provider.care_phone);
      formData.append("skus", provider.skus);
      formData.append("status", provider.status);
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

  insertFile = ( provider: ProvidersInterface, documento?: File ) : Observable<any> => {
    var formData: any = new FormData();
    if (documento) {
        formData.append("documento", documento);
    }

    formData.append("name", provider.name);
    formData.append("alias", provider.alias);
    formData.append("rfc", provider.rfc);
    formData.append("billing_email", provider.billing_email);
    formData.append("office_phone", provider.office_phone);
    formData.append("care_contact", provider.care_contact);
    formData.append("care_email", provider.care_email);
    formData.append("care_phone", provider.care_phone);
    formData.append("skus", provider.skus);
    formData.append("status", provider.status);
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
