export interface PaymentTypeConfig {
  label: string;
  color: string;
  icon: string;
  deepLink: (handle: string) => string | null; // null = no deep link, display only
}

export const PAYMENT_TYPES: Record<string, PaymentTypeConfig> = {
  venmo: {
    label: 'Venmo',
    color: '#3D95CE',
    icon: '💙',
    deepLink: (h) => `https://venmo.com/u/${h.replace('@', '')}`,
  },
  cashapp: {
    label: 'Cash App',
    color: '#00D632',
    icon: '💚',
    deepLink: (h) => `https://cash.app/${h.startsWith('$') ? h : '$' + h}`,
  },
  paypal: {
    label: 'PayPal',
    color: '#003087',
    icon: '💳',
    deepLink: (h) => `https://paypal.me/${h.replace('@', '')}`,
  },
  zelle: {
    label: 'Zelle',
    color: '#6D1ED4',
    icon: '💜',
    deepLink: () => null, // Display only
  },
  bitcoin: {
    label: 'Bitcoin',
    color: '#F7931A',
    icon: '₿',
    deepLink: (h) => `bitcoin:${h}`,
  },
  ethereum: {
    label: 'Ethereum',
    color: '#627EEA',
    icon: 'Ξ',
    deepLink: (h) => `ethereum:${h}`,
  },
  applepay: {
    label: 'Apple Pay',
    color: '#333333',
    icon: '🍎',
    deepLink: () => null,
  },
  googlepay: {
    label: 'Google Pay',
    color: '#4285F4',
    icon: '🟢',
    deepLink: () => null,
  },
};

export const PAYMENT_TYPE_OPTIONS = Object.entries(PAYMENT_TYPES).map(([key, val]) => ({
  value: key,
  label: val.label,
  icon: val.icon,
}));

export function getPaymentConfig(type: string): PaymentTypeConfig {
  return PAYMENT_TYPES[type] || { label: type, color: '#666', icon: '💰', deepLink: () => null };
}
