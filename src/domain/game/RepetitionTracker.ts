import { Position } from './Position.js';
import { PositionKey } from './PositionKey.js';

export class RepetitionTracker {
  private readonly positionCounts: Map<string, number>;

  public constructor(initialPosition: Position) {
    this.positionCounts = new Map();

    this.record(initialPosition);
  }

  public record(position: Position): void {
    const key = PositionKey.from(position);
    const currentCount = this.positionCounts.get(key) ?? 0;

    this.positionCounts.set(key, currentCount + 1);
  }

  public getCount(position: Position): number {
    const key = PositionKey.from(position);

    return this.positionCounts.get(key) ?? 0;
  }

  public isThreefoldRepetition(position: Position): boolean {
    return this.getCount(position) >= 3;
  }
}
