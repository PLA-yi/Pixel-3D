export enum AppStatus {
  IDLE = 'IDLE',
  PROCESSING = 'PROCESSING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export enum Season {
  SPRING = 'Spring',
  SUMMER = 'Summer',
  AUTUMN = 'Autumn',
  WINTER = 'Winter',
}

export interface GenerationResult {
  imageUrl: string;
  timestamp: number;
}