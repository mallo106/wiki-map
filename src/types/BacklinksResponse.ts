export interface Continue {
  blcontinue: string;
  continue: string;
}

export interface Backlink {
  pageid: number;
  ns: number;
  title: string;
}

export interface Query {
  backlinks: Backlink[];
}

export interface BacklinksResponse {
  batchcomplete: string;
  continue: Continue;
  query: Query;
}
