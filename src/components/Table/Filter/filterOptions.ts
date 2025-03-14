import { FilterOption } from './Filter';

export const requestTypeOptions: FilterOption[] = [
  { label: 'All', value: 'all' },
  { label: 'None', value: 'none' },
  { label: 'Ad Hoc', value: 'adhoc' },
  { label: 'Down Well', value: 'downwell' },
  { label: 'AL Review', value: 'alreview' },
  { label: 'Margin', value: 'margin' },
  { label: 'Allocation', value: 'allocation' },
  { label: 'Production Fault', value: 'productionfault' }
];

export const sourceOptions: FilterOption[] = [
  { label: 'All', value: 'all' },
  { label: 'WorkQueue', value: 'workqueue' },
  { label: 'DataBricks', value: 'databricks' },
  { label: 'Cygnet', value: 'cygnet' },
  { label: 'PI-AF Analytics', value: 'piafanalytics' }
];

export const roleOptions: FilterOption[] = [
  { label: 'All', value: 'all' },
  { label: 'Production Engineer', value: 'productionengineer' },
  { label: 'Production Foreman', value: 'productionforeman' },
  { label: 'Production Assistant Foreman', value: 'productionassistantforeman' },
  { label: 'DSC Production Analyst', value: 'dscproductionanalyst' }
]; 