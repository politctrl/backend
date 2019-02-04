export interface PolitPost {
  author: PolitUser;
  content: string;
  embeds: PolitEmbed[];
  id: string;
  createTimestamp: number;
}

export interface PolitUser {
  readable_name?: string;
  username: string;
  service: string;
  external_id: string;
  avatar: string; // url
}

export interface PolitEmbed {
  type: PolitEmbedType;
  name?: string;
  url: string;
}

export enum PolitEmbedType {
  VIDEO = 'video',
  GIF = 'gif',
  IMAGE = 'image',
  AUDIO = 'audio',
  FILE = 'file',
}
