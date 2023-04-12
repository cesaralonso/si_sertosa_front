import { AuthService } from './../../shared/services/auth.service';
import { throwError as observableThrowError, Observable } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Configuration } from '../../app.constants';

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
       private handleError(error: HttpResponse<any>) {
           console.error(error);
           return observableThrowError(error || 'Server error');
       }
}
