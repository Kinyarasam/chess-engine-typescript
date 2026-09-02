import { Square } from '../board/Square.js';
import { PieceType } from '../pieces/PieceType.js';
import { MoveType } from './MoveType.js';

export class Move {
  public readonly from: Square;
  public readonly to: Square;
  public readonly type: MoveType;
  public readonly promotion: PieceType | null;

  public constructor(
    from: Square,
    to: Square,
    type: MoveType = MoveType.Normal,
    promotion: PieceType | null = null,
  ) {
    if (type === MoveType.Promotion && promotion === null) {
      throw new Error('Promotion moves must specify a promotion piece.');
    }

    if (type !== MoveType.Promotion && promotion !== null) {
      throw new Error('Only promotion moves can specify a promotion piece.');
    }

    this.from = from;
    this.to = to;
    this.type = type;
    this.promotion = promotion;
  }
}
