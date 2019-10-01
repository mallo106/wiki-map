import {HttpClient} from '@angular/common/http';
import {BacklinksResponse} from '../../types/BacklinksResponse';
import {Observable} from 'rxjs/Observable';
import {filter, map} from 'rxjs/operators';
import {Article, WikiMetrics} from '../../types/wiki-metrics';

export class WikiRestApi {
  private kApiUrl = 'https://en.wikipedia.org/w/api.php';
  private kWikiMediaUrl = 'https://wikimedia.org/api/rest_v1/';
  constructor(private http: HttpClient) { }

  /**
   * https://en.wikipedia.org/w/api.php?action=query&format=json&list=backlinks&bltitle=Spam%20(food)&bllimit=30&blcontinue=0|1091408
   */
  getLinks(theTitle: string, theLimit?: number, theBlContinue?: string): Observable<BacklinksResponse> {
    return this.http.get(
      this.kApiUrl,
      {
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

  /**
   * Returns all of yesterdays most popular articles by view count
   * Excludes a some lame articles "wikipedia" "Main Page"
   */
  getMostPopularArticles(): Observable<Article[]> {
    const aYesterday = new Date();
    aYesterday.setDate(aYesterday.getDate() - 1);
    const aFormattedDate = aYesterday.toISOString().split('T')[0].split('-').join('/');
    return this.http.get(
      `${this.kWikiMediaUrl}metrics/pageviews/top/en.wikipedia/all-access/${aFormattedDate}`,
      {
        params: {
          origin: '*'
        }
      }
    ).pipe(
      map(theResponse => {
        if (!theResponse) {
          return [];
        }
        return (theResponse as WikiMetrics).items[0].articles
            .filter(anArticle => ['Main_Page', 'Special:Search', 'Wikipedia'].indexOf(anArticle.article) < 0);
        }
      ),
    );
  }

  /**
   * Returns the most viewed article from yesterday
   */
  getMostPopularArticle(): Observable<Article> {
    return this.getMostPopularArticles().pipe(
      filter(anArticles => anArticles.length > 0),
      map(anArticles => anArticles[0])
    );
  }
}
