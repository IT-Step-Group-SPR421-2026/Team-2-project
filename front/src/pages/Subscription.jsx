import { useMemo, useState } from 'react';
import { useCurrentAccount, useCurrentClient, useDAppKit } from '@mysten/dapp-kit-react';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';
import { useAppText } from '../utils/i18n';
import {
  getCompletedTestsToday,
  getDailyTestLimitForUser,
  getSubscriptionPlanName,
  getRemainingTestsToday,
  isPremiumUser,
} from '../utils/subscription';
import {
  SUBSCRIPTION_PLAN_KEYS,
  SUBSCRIPTION_PLAN_ORDER,
  SUBSCRIPTION_PLAN_PRICES,
} from '../constants/subscriptionPlans';
import { SUBSCRIPTION_STATUS } from '../api/userEntity';
import {
  buyPremiumStatus,
  ensureProfileObjectId,
  isAlreadyPremiumOnChainError,
  resolveAppObjectId,
} from '../utils/subscriptionBlockchain';
import './Subscription.css';

function SubscriptionPage() {
  const { text } = useAppText();
  const { user, updateSubscription } = useAuth();
  const dAppKit = useDAppKit();
  const currentAccount = useCurrentAccount();
  const currentClient = useCurrentClient();
  const [purchaseMessage, setPurchaseMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isUpdatingPlan, setIsUpdatingPlan] = useState(false);
  const pageText = text.subscription;
  const premium = isPremiumUser(user);
  const dailyLimit = getDailyTestLimitForUser(user);
  const completedToday = getCompletedTestsToday(user);
  const leftToday = getRemainingTestsToday(user);
  const currentPlan = getSubscriptionPlanName(user?.subscriptionStatus);
  const walletRequiredMessage =
    pageText.walletRequired ?? 'Connect wallet to buy Premium on chain.';
  const syncFailedFallback =
    pageText.syncFailed ??
    'Blockchain payment succeeded, but profile sync with backend failed.';
  const blockchainSuccessFallback =
    pageText.blockchainSuccess ?? 'Premium purchase confirmed on blockchain.';
  const rebuyPremiumFallback =
    pageText.rebuyPremium ?? 'Premium purchased again on blockchain.';
  const downgradeBlockedFallback =
    pageText.downgradeBlocked ?? 'Downgrade from Premium to Standart is disabled.';
  const blockchainFlowHint = currentAccount?.address
    ? pageText.connectedWalletHint ?? 'Wallet connected. Premium purchase uses on-chain transaction.'
    : walletRequiredMessage;

  const plans = useMemo(
    () =>
      SUBSCRIPTION_PLAN_ORDER.map((planKey) => {
        const planText = pageText?.plans?.[planKey];
        return {
          key: planKey,
          active:
            (premium && planKey === SUBSCRIPTION_PLAN_KEYS.PREMIUM) ||
            (!premium && planKey === SUBSCRIPTION_PLAN_KEYS.STANDART),
          subscriptionStatus:
            planKey === SUBSCRIPTION_PLAN_KEYS.PREMIUM
              ? SUBSCRIPTION_STATUS.PREMIUM
              : SUBSCRIPTION_STATUS.STANDARD,
          price: SUBSCRIPTION_PLAN_PRICES[planKey],
          name: planText?.name ?? '',
          description: planText?.description ?? '',
          cta: planText?.cta ?? '',
          features: Array.isArray(planText?.features) ? planText.features : [],
        };
      }),
    [pageText, premium],
  );

  async function handlePremiumPurchase() {
    if (!currentAccount?.address) {
      throw new Error(walletRequiredMessage);
    }

    if (!currentClient) {
      throw new Error(pageText.comingSoon || 'Blockchain client is not available.');
    }

    const appObjectId = await resolveAppObjectId(currentClient);
    const profileObjectId = await ensureProfileObjectId({
      client: currentClient,
      dAppKit,
      walletAddress: currentAccount.address,
      profileName: user?.name,
    });

    try {
      const digest = await buyPremiumStatus({
        client: currentClient,
        dAppKit,
        appObjectId,
        profileObjectId,
      });

      return {
        digest,
        isRebuy: false,
      };
    } catch (error) {
      if (!isAlreadyPremiumOnChainError(error)) {
        throw error;
      }

      const freshProfileObjectId = await ensureProfileObjectId({
        client: currentClient,
        dAppKit,
        walletAddress: currentAccount.address,
        profileName: user?.name,
        forceCreate: true,
      });

      const digest = await buyPremiumStatus({
        client: currentClient,
        dAppKit,
        appObjectId,
        profileObjectId: freshProfileObjectId,
      });

      return {
        digest,
        isRebuy: true,
      };
    }
  }

  async function handlePlanChange(nextStatus) {
    setPurchaseMessage('');
    setErrorMessage('');

    if (premium && nextStatus === SUBSCRIPTION_STATUS.STANDARD) {
      setErrorMessage(downgradeBlockedFallback);
      return;
    }

    setIsUpdatingPlan(true);
    let purchaseDigest = '';
    let isRebuy = false;

    try {
      if (nextStatus === SUBSCRIPTION_STATUS.PREMIUM) {
        const premiumResult = await handlePremiumPurchase();
        purchaseDigest = premiumResult.digest;
        isRebuy = premiumResult.isRebuy;
      }

      const response = await updateSubscription({ subscriptionStatus: nextStatus });
      if (nextStatus === SUBSCRIPTION_STATUS.PREMIUM) {
        const successBaseMessage = isRebuy ? rebuyPremiumFallback : blockchainSuccessFallback;
        const fallbackMessage = purchaseDigest
          ? `${successBaseMessage} Tx: ${purchaseDigest}`
          : successBaseMessage;
        setPurchaseMessage(response?.message || fallbackMessage);
      } else {
        setPurchaseMessage(response?.message || pageText.availableSoon);
      }
    } catch (error) {
      if (purchaseDigest) {
        setErrorMessage(`${syncFailedFallback} Tx: ${purchaseDigest}.`);
      } else {
        setErrorMessage(error?.message || pageText.comingSoon);
      }
    } finally {
      setIsUpdatingPlan(false);
    }
  }

  return (
    <div className="app">
      <Header />
      <main className="subscription-main">
        <section className="subscription-page">
          <header className="subscription-head">
            <h1>{pageText.title}</h1>
            <p>{pageText.subtitle}</p>
            <div className="subscription-usage">
              <span>
                {pageText.currentPlan}: <strong>{currentPlan}</strong>
              </span>
              <span>
                {pageText.dailyUsage}: <strong>{completedToday}/{dailyLimit}</strong> {pageText.perDay}
              </span>
              <span>
                {pageText.dailyLeft}: <strong>{leftToday}</strong>
              </span>
            </div>
          </header>

          <div className="subscription-grid">
            {plans.map((plan) => (
              <article
                key={plan.key}
                className={`subscription-card${plan.active ? ' subscription-card-active' : ''}`}
              >
                <div className="subscription-card-top">
                  <h2>{plan.name}</h2>
                  {plan.active && <span className="subscription-badge">{pageText.currentPlan}</span>}
                </div>
                <p className="subscription-price">{plan.price}</p>
                <p className="subscription-description">{plan.description}</p>
                <button
                  type="button"
                  className="subscription-btn"
                  disabled={
                    isUpdatingPlan ||
                    (premium && plan.key === SUBSCRIPTION_PLAN_KEYS.STANDART) ||
                    (plan.active &&
                      !(premium && plan.key === SUBSCRIPTION_PLAN_KEYS.PREMIUM))
                  }
                  onClick={() => handlePlanChange(plan.subscriptionStatus)}
                >
                  {isUpdatingPlan
                    ? pageText.updatingCta
                    : premium && plan.key === SUBSCRIPTION_PLAN_KEYS.PREMIUM
                      ? plan.rebuyCta ?? 'Buy Premium again'
                      : premium && plan.key === SUBSCRIPTION_PLAN_KEYS.STANDART
                        ? pageText.downgradeDisabledCta ?? 'Downgrade unavailable'
                      : plan.active
                        ? pageText.currentPlan
                        : plan.cta}
                </button>
                <ul className="subscription-features">
                  {plan.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          {errorMessage && <p className="subscription-note">{errorMessage}</p>}
          {purchaseMessage && <p className="subscription-note">{purchaseMessage}</p>}
          {!purchaseMessage && !errorMessage && (
            <p className="subscription-note">{blockchainFlowHint}</p>
          )}
        </section>
      </main>
    </div>
  );
}

export default SubscriptionPage;
