export enum GameStatus {
  InProgress = 'in-progress',
  Check = 'check',
  Checkmate = 'checkmate',
  Stalemate = 'stalemate',
  DrawByFiftyMove = 'draw-by-fifty-move',
  DrawByInsufficientMaterial = 'draw-by-insufficient-material',
  DrawByThreefoldRepetition = 'draw-by-threefold-repetition',
}
