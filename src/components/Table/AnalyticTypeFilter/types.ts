export interface AnalyticType {
  label: string;
  value: string;
  subtypes?: AnalyticSubtype[];
}

export interface AnalyticSubtype {
  label: string;
  value: string;
  parentType: string;
}

export interface Selection {
  types: string[];
  subtypes: string[];
}