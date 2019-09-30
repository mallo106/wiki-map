import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import ForceGraph3D from '3d-force-graph';
import {BacklinksAPI} from './wiki_api/backlinks_api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  private linksAPI: BacklinksAPI;
  private Graph: ForceGraph3D;
  constructor(http: HttpClient) {
    this.linksAPI = new BacklinksAPI(http);
    this.Graph = new ForceGraph3D();
  }

  ngOnInit(): void {
    const aRoot = -1;
    this.linksAPI.getLinks('Spam (food)', 50)
      .subscribe(theLinks => {
        console.log(theLinks.query.backlinks);
        const aNodes = [{
          id: aRoot,
          title: 'Spam (food)'
        }];
        const aLinks = [];
        theLinks.query.backlinks.forEach(aLink => {
          aNodes.push({
            id: aLink.pageid,
            title: aLink.title
          });
          aLinks.push({
            source: aRoot,
            target: aLink.pageid
          });
        });
        this.Graph(document.getElementById('test'))
        .graphData({
          links: aLinks,
          nodes: aNodes
        }).nodeLabel(node => `${node.title}`);
      });
  }
}
