import { AnalyticType } from './types';

export const analyticTypes: AnalyticType[] = [
  {
    label: 'LOE Variance',
    value: 'loe_variance',
    subtypes: [
      { label: 'Chemical vs Artificial Lift Avg', value: 'chemical_vs_al', parentType: 'loe_variance' },
      { label: 'Chemical vs Formation Avg', value: 'chemical_vs_formation', parentType: 'loe_variance' },
      { label: 'Chemical vs Route Avg', value: 'chemical_vs_route', parentType: 'loe_variance' },
      { label: 'Compressor vs Artificial Lift Avg', value: 'compressor_vs_al', parentType: 'loe_variance' },
      { label: 'Compressor vs Formation Avg', value: 'compressor_vs_formation', parentType: 'loe_variance' }
    ]
  },
  {
    label: 'Margin Variance',
    value: 'margin_variance',
    subtypes: [
      { label: 'Top Cumulative Margin Lost', value: 'top_margin_lost', parentType: 'margin_variance' },
      { label: '$/BOE vs Artificial List', value: 'boe_vs_al', parentType: 'margin_variance' },
      { label: 'Margin vs Route', value: 'margin_vs_route', parentType: 'margin_variance' },
      { label: '12 mo. Consecutive Negative Margin', value: 'consecutive_negative', parentType: 'margin_variance' }
    ]
  }
];