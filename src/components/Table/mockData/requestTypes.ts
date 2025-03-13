export const requestTypes = {
  operational: [
    { value: 'adhoc', label: 'Ad Hoc' },
    { value: 'downwell', label: 'Down Well' },
    { value: 'al_review', label: 'AL Review' },
    { value: 'margin', label: 'Margin' },
    { value: 'allocation', label: 'Allocation' },
    { value: 'production_fault', label: 'Production Fault' }
  ]
};

// Helper to check if a type is an operational request
export const isOperationalRequest = (type: string) => {
  return requestTypes.operational.some(t => t.label === type);
};