export class SearchStats {
  public nodesVisited = 0;
  public cutoffs = 0;

  public reset(): void {
    this.nodesVisited = 0;
    this.cutoffs = 0;
  }
}
