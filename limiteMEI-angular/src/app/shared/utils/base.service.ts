import { HttpClient, HttpResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import {environment} from '../../../enviroments/enviroment';

export class BaseService<D, C, ID = number> {

  protected url: string;

  constructor(
    protected http: HttpClient,
    urlPrefix: string
  ) {
    this.url = `${environment.apiUrl}/${urlPrefix}`;
  }

  getAll(): Observable<HttpResponse<D[]>> {
    return this.http.get<D[]>(this.url, { observe: 'response' });
  }

  getById(id: ID): Observable<HttpResponse<D>> {
    return this.http.get<D>(`${this.url}/${id}`, { observe: 'response' });
  }

  create(dto: C): Observable<HttpResponse<D>> {
    return this.http.post<D>(this.url, dto, { observe: 'response' });
  }

  update(id: ID, dto: C): Observable<HttpResponse<D>> {
    return this.http.put<D>(`${this.url}/${id}`, dto, { observe: 'response' });
  }

  delete(id: ID): Observable<HttpResponse<void>> {
    return this.http.delete<void>(`${this.url}/${id}`, { observe: 'response' });
  }

}
