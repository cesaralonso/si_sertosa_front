import { AuthService } from './../../../../shared/services/auth.service';
import { ProductsResponseInterface } from './products-response.interface';
import { throwError as observableThrowError, Observable } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { ProductsInterface } from './products.interface';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Configuration } from '../../../../app.constants';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
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
        this.endPoint = `${this._configuration.apiUrl}product`;
       }
       findByIdFamily = ( id ) : Observable<ProductsResponseInterface> => {
           return this._http.get<HttpResponse<any>>(`${this.endPoint}/family/${id}`, this.options)
               .pipe(
                   map((response: any) => response),
                   catchError(this.handleError));
       }
       findByIdProvider = ( id ) : Observable<ProductsResponseInterface> => {
           return this._http.get<HttpResponse<any>>(`${this.endPoint}/provider/${id}`, this.options)
               .pipe(
                   map((response: any) => response),
                   catchError(this.handleError));
       }
       allFromTo = ( fechaDesde: string, fechaHasta: string ) : Observable<ProductsResponseInterface> => {
           return this._http.get<HttpResponse<any>>(`${this.endPoint}/from-to/${fechaDesde}/${fechaHasta}`, this.options)
               .pipe(
                   map((response: any) => response),
                   catchError(this.handleError));
       }
       all = () : Observable<ProductsResponseInterface> => {
           return this._http.get<HttpResponse<any>>(this.endPoint, this.options)
               .pipe(
                   map((response: any) => response),
                   catchError(this.handleError));
       }
       findById = ( id ) : Observable<ProductsResponseInterface> => {
           return this._http.get<HttpResponse<any>>(`${this.endPoint}/${id}`, this.options)
               .pipe(
                   map((response: any) => response),
                   catchError(this.handleError));
       }
       update = ( product: ProductsInterface ) : Observable<ProductsResponseInterface> => {
           return this._http.patch<HttpResponse<any>>(this.endPoint, product, this.options)
               .pipe(
                   map((response: any) => response),
                   catchError(this.handleError));
       }
       remove= ( id ) : Observable<ProductsResponseInterface> => {
           return this._http.delete<HttpResponse<any>>(`${this.endPoint}/${id}`, this.options)
               .pipe(
                   map((response: any) => response),
                   catchError(this.handleError));
       }
       exist = ( id ) : Observable<ProductsResponseInterface> => {
           return this._http.get<HttpResponse<any>>(`${this.endPoint}/${id}`, this.options)
               .pipe(
                   map((response: any) => response),
                   catchError(this.handleError));
       }
       count = () : Observable<ProductsResponseInterface> => {
           return this._http.get<HttpResponse<any>>(`${this.endPoint}`, this.options)
               .pipe(
                   map((response: any) => response),
                   catchError(this.handleError));
       }
       insert = ( product: ProductsInterface ) : Observable<ProductsResponseInterface> => {
           return this._http.post<HttpResponse<any>>(this.endPoint, product, this.options)
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
      updateFile = ( product: ProductsInterface, documento?: File ) : Observable<any> => {
        var formData: any = new FormData();
        if (documento) {
            formData.append("documento", documento);
        }
        formData.append("idproduct", product.idproduct);
        formData.append("name", product.name);

           
           formData.append("sku", product.sku);
           
           formData.append("aka", product.aka);
           formData.append("description", product.description);
           formData.append("type", product.type);
           formData.append("family_idfamily", product.family_idfamily);
           formData.append("provider_idprovider", product.provider_idprovider);
           formData.append("cost", product.cost);
           formData.append("min", product.min);
           formData.append("reorderpoint", product.reorderpoint);
           formData.append("max", product.max);
           formData.append("caducity", product.caducity);
           formData.append("unitin", product.unitin);
           formData.append("unitout", product.unitout);
        
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



       insertFile = ( product: ProductsInterface, documento?: File ) : Observable<any> => {
           var formData: any = new FormData();
           if (documento) {
               formData.append("documento", documento);
           }
           formData.append('id', product.idproduct)
           formData.append("name", product.name);
           formData.append("sku", product.sku);
           formData.append("aka", product.aka);
           formData.append("description", product.description);
           formData.append("type", product.type);
           formData.append("family_idfamily", product.family_idfamily);
           formData.append("provider_idprovider", product.provider_idprovider);
           formData.append("cost", product.cost);
           formData.append("min", product.min);
           formData.append("reorderpoint", product.reorderpoint);
           formData.append("max", product.max);
           formData.append("caducity", product.caducity);
           formData.append("unitin", product.unitin);
           formData.append("unitout", product.unitout);
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
