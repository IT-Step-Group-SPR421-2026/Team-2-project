import { Transaction } from '@mysten/sui/transactions';
import {
  PREMIUM_PRICE_MIST,
  SUBSCRIPTION_APP_STORAGE_KEY,
  SUBSCRIPTION_METHODS,
  SUBSCRIPTION_MODULE_NAME,
  SUBSCRIPTION_OBJECT_TYPES,
  SUBSCRIPTION_PACKAGE_ID,
  SUBSCRIPTION_PROFILE_STORAGE_KEY,
} from '../constants';
import { normalizeAddress, normalizeText, normalizeType } from './helper';

function readJsonStorage(key, fallbackValue) {
  if (typeof window === 'undefined') {
    return fallbackValue;
  }

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) {
      return fallbackValue;
    }

    const parsed = JSON.parse(raw);
    return parsed ?? fallbackValue;
  } catch {
    return fallbackValue;
  }
}

function writeJsonStorage(key, value) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

function getTransactionFromResult(result) {
  if (!result || typeof result !== 'object') {
    return null;
  }

  if (result.$kind === 'Transaction' && result.Transaction) {
    return result.Transaction;
  }

  if (result.$kind === 'FailedTransaction' && result.FailedTransaction) {
    return result.FailedTransaction;
  }

  return null;
}

function extractExecutionError(status) {
  if (!status || status.success !== false) {
    return '';
  }

  const errorValue = status.error;
  if (typeof errorValue === 'string') {
    return errorValue;
  }

  if (!errorValue || typeof errorValue !== 'object') {
    return '';
  }

  if (typeof errorValue.message === 'string') {
    return errorValue.message;
  }

  try {
    return JSON.stringify(errorValue);
  } catch {
    return '';
  }
}

export function isAlreadyPremiumOnChainError(error) {
  const rawMessage =
    typeof error === 'string' ? error : normalizeText(error?.message);
  const message = normalizeText(rawMessage);
  if (!message) {
    return false;
  }

  const lowerMessage = message.toLowerCase();
  if (!lowerMessage.includes('buy_premium_status')) {
    return false;
  }

  if (lowerMessage.includes('alreadypremium') || lowerMessage.includes('ealreadypremium')) {
    return true;
  }

  return /\},\s*2\)/.test(message);
}

function extractCreatedObjectIds(transaction) {
  const changedObjects = transaction?.effects?.changedObjects;
  if (!Array.isArray(changedObjects)) {
    return [];
  }

  const ids = [];
  for (const changedObject of changedObjects) {
    if (
      changedObject?.idOperation === 'Created' &&
      typeof changedObject?.objectId === 'string' &&
      changedObject.objectId.trim()
    ) {
      ids.push(changedObject.objectId);
    }
  }

  return ids;
}

async function waitTransactionWithEffects(client, transactionResult) {
  const current = getTransactionFromResult(transactionResult);
  if (current?.effects?.changedObjects) {
    return current;
  }

  const waited = await client.waitForTransaction({
    result: transactionResult,
    include: { effects: true, transaction: true },
  });

  return getTransactionFromResult(waited);
}

async function isObjectOfType(client, objectId, expectedType) {
  const normalizedObjectId = normalizeText(objectId);
  if (!normalizedObjectId) {
    return false;
  }

  try {
    const { object } = await client.getObject({ objectId: normalizedObjectId });
    return normalizeType(object?.type) === normalizeType(expectedType);
  } catch {
    return false;
  }
}

async function findObjectIdByType(client, objectIds, expectedType) {
  if (!Array.isArray(objectIds) || objectIds.length === 0) {
    return '';
  }

  const uniqueIds = Array.from(
    new Set(objectIds.map((id) => normalizeText(id)).filter(Boolean)),
  );

  if (uniqueIds.length === 0) {
    return '';
  }

  const { objects } = await client.getObjects({ objectIds: uniqueIds });
  const expected = normalizeType(expectedType);

  for (const objectEntry of objects) {
    if (objectEntry instanceof Error) {
      continue;
    }

    if (normalizeType(objectEntry?.type) === expected) {
      return normalizeText(objectEntry.objectId);
    }
  }

  return '';
}

function readStoredAppObjectId() {
  const value = readJsonStorage(SUBSCRIPTION_APP_STORAGE_KEY, '');
  return normalizeText(value);
}

function writeStoredAppObjectId(objectId) {
  writeJsonStorage(SUBSCRIPTION_APP_STORAGE_KEY, normalizeText(objectId));
}

function readProfileMap() {
  const value = readJsonStorage(SUBSCRIPTION_PROFILE_STORAGE_KEY, {});
  return value && typeof value === 'object' ? value : {};
}

function writeProfileMap(profileMap) {
  writeJsonStorage(SUBSCRIPTION_PROFILE_STORAGE_KEY, profileMap);
}

function getStoredProfileObjectId(address) {
  const normalizedAddress = normalizeAddress(address);
  if (!normalizedAddress) {
    return '';
  }

  const profileMap = readProfileMap();
  return normalizeText(profileMap[normalizedAddress]);
}

function setStoredProfileObjectId(address, profileObjectId) {
  const normalizedAddress = normalizeAddress(address);
  const normalizedProfileObjectId = normalizeText(profileObjectId);
  if (!normalizedAddress || !normalizedProfileObjectId) {
    return;
  }

  const profileMap = readProfileMap();
  profileMap[normalizedAddress] = normalizedProfileObjectId;
  writeProfileMap(profileMap);
}

function buildMoveTarget(methodName) {
  return `${SUBSCRIPTION_PACKAGE_ID}::${SUBSCRIPTION_MODULE_NAME}::${methodName}`;
}

export async function resolveAppObjectId(client) {
  const cachedAppObjectId = readStoredAppObjectId();
  if (cachedAppObjectId) {
    const isValidCached = await isObjectOfType(client, cachedAppObjectId, SUBSCRIPTION_OBJECT_TYPES.APP);
    if (isValidCached) {
      return cachedAppObjectId;
    }
  }

  const { object: packageObject } = await client.getObject({
    objectId: SUBSCRIPTION_PACKAGE_ID,
    include: { previousTransaction: true },
  });

  const publishDigest = normalizeText(packageObject?.previousTransaction);
  if (!publishDigest) {
    throw new Error('Unable to resolve subscription package publish transaction.');
  }

  const publishTransactionResult = await client.getTransaction({
    digest: publishDigest,
    include: { effects: true, transaction: true },
  });

  const publishTransaction = getTransactionFromResult(publishTransactionResult);
  if (!publishTransaction) {
    throw new Error('Unable to read subscription package publish transaction.');
  }

  const createdObjectIds = extractCreatedObjectIds(publishTransaction);
  const appObjectId = await findObjectIdByType(client, createdObjectIds, SUBSCRIPTION_OBJECT_TYPES.APP);
  if (!appObjectId) {
    throw new Error('Unable to locate shared App object for subscription contract.');
  }

  writeStoredAppObjectId(appObjectId);
  return appObjectId;
}

export async function ensureProfileObjectId({
  client,
  dAppKit,
  walletAddress,
  profileName,
  forceCreate = false,
}) {
  const normalizedWalletAddress = normalizeAddress(walletAddress);
  if (!normalizedWalletAddress) {
    throw new Error('Wallet is not connected.');
  }

  if (!forceCreate) {
    const cachedProfileObjectId = getStoredProfileObjectId(normalizedWalletAddress);
    if (cachedProfileObjectId) {
      const isValidCached = await isObjectOfType(
        client,
        cachedProfileObjectId,
        SUBSCRIPTION_OBJECT_TYPES.PROFILE,
      );
      if (isValidCached) {
        return cachedProfileObjectId;
      }
    }
  }

  const tx = new Transaction();
  const safeProfileName = normalizeText(profileName) || `wallet:${normalizedWalletAddress.slice(0, 8)}`;
  tx.moveCall({
    target: buildMoveTarget(SUBSCRIPTION_METHODS.CREATE_PROFILE),
    arguments: [tx.pure.string(safeProfileName)],
  });

  const createProfileResult = await dAppKit.signAndExecuteTransaction({ transaction: tx });
  const createProfileTx = await waitTransactionWithEffects(client, createProfileResult);
  if (!createProfileTx) {
    throw new Error('Unable to create profile on blockchain.');
  }

  if (createProfileTx.status?.success === false) {
    const executionError = extractExecutionError(createProfileTx.status);
    throw new Error(executionError || 'Profile creation transaction failed.');
  }

  const createdObjectIds = extractCreatedObjectIds(createProfileTx);
  const profileObjectId = await findObjectIdByType(
    client,
    createdObjectIds,
    SUBSCRIPTION_OBJECT_TYPES.PROFILE,
  );

  if (!profileObjectId) {
    throw new Error('Profile object was not found after creation transaction.');
  }

  setStoredProfileObjectId(normalizedWalletAddress, profileObjectId);
  return profileObjectId;
}

export async function buyPremiumStatus({
  client,
  dAppKit,
  appObjectId,
  profileObjectId,
}) {
  const normalizedAppObjectId = normalizeText(appObjectId);
  const normalizedProfileObjectId = normalizeText(profileObjectId);

  if (!normalizedAppObjectId || !normalizedProfileObjectId) {
    throw new Error('Missing App/Profile object id for premium purchase.');
  }

  const tx = new Transaction();
  const [paymentCoin] = tx.splitCoins(tx.gas, [PREMIUM_PRICE_MIST]);
  tx.moveCall({
    target: buildMoveTarget(SUBSCRIPTION_METHODS.BUY_PREMIUM),
    arguments: [tx.object(normalizedAppObjectId), tx.object(normalizedProfileObjectId), paymentCoin],
  });

  const purchaseResult = await dAppKit.signAndExecuteTransaction({ transaction: tx });
  const purchaseTx = await waitTransactionWithEffects(client, purchaseResult);
  if (!purchaseTx) {
    throw new Error('Unable to verify premium purchase transaction.');
  }

  if (purchaseTx.status?.success === false) {
    const executionError = extractExecutionError(purchaseTx.status);
    throw new Error(executionError || 'Premium purchase transaction failed.');
  }

  return normalizeText(purchaseTx.digest);
}
