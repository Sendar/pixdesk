export type PixelColor = string | null;

export type ToolType = 'pencil' | 'eraser' | 'fill' | 'pick';

export type FxMode = 'scroll' | 'static' | 'blink' | 'rainbow';

export interface Preset {
  id: string;
  name: string;
  rows: string[];
  px?: PixelColor[];
}

export interface QueueItem {
  id?: string;
  flag: string;
  who: string;
  text: string;
  icon: string;
  color: string;
  fx: FxMode;
}

export type DisplayTier = 'free' | 'priority' | 'sponsor';

export interface TierDefinition {
  id: DisplayTier;
  name: string;
  price: string;
  unit: string;
  slot: string;
  accent: string;
  perks: string[];
}

export type CamState = 'idle' | 'message_playing' | 'capturing_receipt';

export interface ReceiptData {
  img: string;
  time: Date;
  jobId?: string;
  text: string;
}

export interface SubmissionState {
  pos: number;
  status: 'queued' | 'playing' | 'capturing';
}
