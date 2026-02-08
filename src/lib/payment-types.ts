export interface SetupGuide {
  helpText: string;
  placeholder: string;
  howToFind: string;
  screenshot?: string; // image path — drop in real screenshots later
}

export interface PaymentTypeConfig {
  label: string;
  color: string;
  icon: string;
  deepLink: (handle: string) => string | null; // null = no deep link, display only
  setup?: SetupGuide;
}

export const PAYMENT_TYPES: Record<string, PaymentTypeConfig> = {
  venmo: {
    label: 'Venmo',
    color: '#3D95CE',
    icon: '💙',
    deepLink: (h) => `https://venmo.com/u/${h.replace('@', '')}`,
    setup: {
      helpText: 'Enter your Venmo username (without the @)',
      placeholder: 'Daniel-Dieringer-3',
      howToFind: 'Open the Venmo app → tap your profile icon (top left) → your username is shown below your name. It may contain hyphens and numbers.',
    },
  },
  cashapp: {
    label: 'Cash App',
    color: '#00D632',
    icon: '💚',
    deepLink: (h) => `https://cash.app/${h.startsWith('$') ? h : '$' + h}`,
    setup: {
      helpText: 'Enter your $cashtag (without the $)',
      placeholder: 'danield',
      howToFind: 'Open Cash App → tap your profile icon (top right) → your $cashtag is displayed at the top of the profile screen.',
    },
  },
  paypal: {
    label: 'PayPal',
    color: '#003087',
    icon: '💳',
    deepLink: (h) => `https://paypal.me/${h.replace('@', '')}`,
    setup: {
      helpText: 'Enter your PayPal.me username',
      placeholder: 'DanielDieringer673',
      howToFind: 'Go to paypal.me → log in → your PayPal.me link is shown on your profile. The username is the part after paypal.me/.',
    },
  },
  zelle: {
    label: 'Zelle',
    color: '#6D1ED4',
    icon: '💜',
    deepLink: () => null,
    setup: {
      helpText: 'Enter the phone number or email registered with your bank',
      placeholder: '555-123-4567',
      howToFind: 'Open your banking app → find Zelle in payments → your registered email or phone number is shown in your Zelle settings.',
    },
  },
  bitcoin: {
    label: 'Bitcoin',
    color: '#F7931A',
    icon: '₿',
    deepLink: (h) => `bitcoin:${h}`,
    setup: {
      helpText: 'Enter your Bitcoin wallet address',
      placeholder: 'bc1qxy2kgdygjrsqtzq2n0yrf...',
      howToFind: 'Open your Bitcoin wallet app → tap "Receive" → copy your wallet address. It usually starts with bc1, 1, or 3.',
    },
  },
  ethereum: {
    label: 'Ethereum',
    color: '#627EEA',
    icon: 'Ξ',
    deepLink: (h) => `ethereum:${h}`,
    setup: {
      helpText: 'Enter your Ethereum wallet address',
      placeholder: '0x71C7656EC7ab88b098defB...',
      howToFind: 'Open your Ethereum wallet (MetaMask, Coinbase Wallet, etc.) → tap "Receive" → copy your address. It starts with 0x.',
    },
  },
  applepay: {
    label: 'Apple Pay',
    color: '#333333',
    icon: '🍎',
    deepLink: () => null,
    setup: {
      helpText: 'Enter the phone number or email linked to your Apple Pay',
      placeholder: 'email@icloud.com',
      howToFind: 'On your iPhone → Settings → Wallet & Apple Pay → tap your card → your linked phone/email is under "Contact & Shipping".',
    },
  },
  googlepay: {
    label: 'Google Pay',
    color: '#4285F4',
    icon: '🟢',
    deepLink: () => null,
    setup: {
      helpText: 'Enter the phone number or email linked to your Google Pay',
      placeholder: 'email@gmail.com',
      howToFind: 'Open Google Pay → tap your profile icon → your linked email or phone is shown in your account settings.',
    },
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
