export enum GameEventType {
  userServerPing = 'userServerPing',
  initializeGame = 'create',
  updateCursor = 'updateCursor',
  addPing = 'addPing',
  updateDisplayName = 'updateDisplayName',
  updateColor = 'updateColor',
  updateCell = 'updateCell',
  check = 'check',
  reveal = 'reveal',
  reset = 'reset',
}

export interface GameEventParams {
  [GameEventType.userServerPing]: {
    uid: string;
  };
  [GameEventType.initializeGame]: {
    pid: string;
    game: any;
  };
}

export interface GameEvent<T extends GameEventType = GameEventType> {
  timestamp: number;
  type: T;
  params: GameEventParams[T];
  uid: string;
}

export const isUserPingGameEvent = (event: GameEvent): event is GameEvent<GameEventType.userPing> =>
  event.type === GameEventType.userPing;

export const isInitializeGameEvent = (event: GameEvent): event is GameEvent<GameEventType.initializeGame> =>
  // returns a "type guard"
  event.type === GameEventType.initializeGame;
