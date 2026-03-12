export const SUBSCRIPTION_PACKAGE_ID =
  '0x89cf31753d34eabe4601345a41daf500a39ef33ab46a7c853a7c1bd60689aa8f';

export const SUBSCRIPTION_MODULE_NAME = 'testflow_subscription';

export const SUBSCRIPTION_METHODS = {
  CREATE_PROFILE: 'new',
  BUY_PREMIUM: 'buy_premium_status',
} as const;

export const PREMIUM_PRICE_MIST = 10000000;

export const SUBSCRIPTION_OBJECT_TYPES = {
  APP: `${SUBSCRIPTION_PACKAGE_ID}::${SUBSCRIPTION_MODULE_NAME}::App`,
  PROFILE: `${SUBSCRIPTION_PACKAGE_ID}::${SUBSCRIPTION_MODULE_NAME}::Profile`,
} as const;

export const SUBSCRIPTION_PROFILE_STORAGE_KEY = 'testflow:subscription:profile-by-wallet:v1';
export const SUBSCRIPTION_APP_STORAGE_KEY = 'testflow:subscription:app-object-id:v1';
