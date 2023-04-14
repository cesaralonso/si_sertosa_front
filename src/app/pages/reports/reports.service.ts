import { AuthService } from './../../shared/services/auth.service';
import { throwError as observableThrowError, Observable } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Configuration } from '../../app.constants';
import { ReportsResponseInterface } from './reports.response.interface';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
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
        this.endPoint = `${this._configuration.apiUrl}report`;
       }
       allReport1 = () : Observable<any> => {
           return this._http.get<HttpResponse<any>>(`${this.endPoint}/report1`, this.options)
               .pipe(
                   map((response: any) => response),
                   catchError(this.handleError));
       }
       allReport2 = () : Observable<any> => {
           return this._http.get<HttpResponse<any>>(`${this.endPoint}/report2`, this.options)
               .pipe(
                   map((response: any) => response),
                   catchError(this.handleError));
       }
       allReport3 = () : Observable<any> => {
           return this._http.get<HttpResponse<any>>(`${this.endPoint}/report3`, this.options)
               .pipe(
                   map((response: any) => response),
                   catchError(this.handleError));
       }
       allFromTo = ( fechaDesde: string, fechaHasta: string ) : Observable<ReportsResponseInterface> => {
        return this._http.get<HttpResponse<any>>(`${this.endPoint}/from-to/${fechaDesde}/${fechaHasta}`, this.options)
            .pipe(
                map((response: any) => response),
                catchError(this.handleError));
    }
    escargaZip = ( id: string, html: string ): Observable<any> => {
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


  count = () : Observable<ReportsResponseInterface> => {
    return this._http.get<HttpResponse<any>>(`${this.endPoint}`, this.options)
        .pipe(
            map((response: any) => response),
            catchError(this.handleError));
}



       private handleError(error: HttpResponse<any>) {
           console.error(error);
           return observableThrowError(error || 'Server error');
       }
}
