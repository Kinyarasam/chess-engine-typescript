import { Color } from './Color.js';
import { PieceType } from './PieceType.js';

export class Piece {
  public readonly color: Color;
  public readonly type: PieceType;

  constructor(color: Color, type: PieceType) {
    this.type = type;
    this.color = color;
  }
}
