import {HttpClient} from '@angular/common/http';
import {BacklinksResponse} from '../../types/BacklinksResponse';
import {Observable} from 'rxjs/Observable';
import {map} from 'rxjs/operators';

export class BacklinksAPI {
  private kApiUrl = 'https://en.wikipedia.org/w/api.php';
  constructor(private http: HttpClient) { }

  /**
   * https://en.wikipedia.org/w/api.php?action=query&format=json&list=backlinks&bltitle=Spam%20(food)&bllimit=30&blcontinue=0|1091408
   */
  getLinks(theTitle: string, theLimit?: number, theBlContinue?: string): Observable<BacklinksResponse> {
    return this.http.get(
      this.kApiUrl,
      {
        // headers: {
        //   'Access-Control-Allow-Origin': '*',
        // },
        params: {
          action: 'query',
          format: 'json',
          list: 'backlinks',
          bltitle: theTitle,
          blcontine: theBlContinue,
          bllimit: !!theLimit ? theLimit + '' : '10',
          origin: '*'
        }
      }
    ).pipe(
      map(theResponse => theResponse as BacklinksResponse)
    );
  }
}
