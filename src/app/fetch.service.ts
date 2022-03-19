import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FetchService {
  public key = '6c1cf4c4d5fe283be9162eb56bae31a9';

  constructor(private http: HttpClient) { }

    public fetchData(input: any, page: number): Observable <any> {
    return this.http.get(
      'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key='
      + this.key + '&text=' + input + '&per_page=10&page=' + page + '&format=json&nojsoncallback=1'
      ) as Observable<any>;
    }


}
