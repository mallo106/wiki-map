import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import ForceGraph3D from '3d-force-graph';
import {WikiRestApi} from './wiki_api/wiki-rest-api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  private wikiApi: WikiRestApi;
  private Graph: ForceGraph3D;
  private depth = 5;
  private breadth = 3;
  constructor(http: HttpClient) {
    this.wikiApi = new WikiRestApi(http);
    this.Graph = new ForceGraph3D();
  }

  ngOnInit(): void {
    this.Graph(document.getElementById('test'))
      .graphData({nodes: [], links: []})
      .nodeAutoColorBy('id')
      .nodeLabel(node => `${node.title}`);
    // Set the root to the most viewed article and expand from there
    this.wikiApi.getMostPopularArticle().subscribe(theArticle => {
      this.getLinks(theArticle.article, -1, this.breadth);
    });
  }

  private getLinks(theTitle: string, theId: number, theLinkCount: number, theDepth?: number) {
    const aDepth = theDepth === undefined ? 0 : theDepth;
    this.wikiApi.getLinks(theTitle, theLinkCount)
      .subscribe(theLinks => {
        const { nodes, links } = this.Graph.graphData();
        if (aDepth === 0) {
          nodes.push({
            id: theId,
            title: theTitle
          });
        }
        theLinks.query.backlinks.forEach(aLink => {
          if (nodes.findIndex(aNode => aNode.id === aLink.pageid) < 0) {
            nodes.push({
              id: aLink.pageid,
              title: aLink.title
            });
          }
          links.push({
            source: theId,
            target: aLink.pageid
          });
          if (aDepth < this.depth) {
            setTimeout(() => {
              this.getLinks(aLink.title, aLink.pageid, theLinkCount, aDepth + 1);
            }, 3000);
          }
        });
        this.Graph.graphData({links, nodes});
      });
  }
}
