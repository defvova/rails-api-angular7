export interface Attributes {
  author: string;
  builtBy: object;
  currentPeriodStars: number;
  description: string;
  forks: number;
  language: string;
  languageColor: string;
  name: string;
  stars: number;
  url: string;
}

export interface Trending {
  attributes: Attributes;
  id: string;
  type: string;
}
