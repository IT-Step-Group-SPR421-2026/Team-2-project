module testflow_subscription::testflow_subscription;

use std::string::String;
use sui::balance::{Self, Balance};
use sui::coin::{Self, Coin};
use sui::object::{Self, UID, ID};
use sui::sui::SUI;
use sui::transfer;
use sui::tx_context::{Self, TxContext};

const EInvalidName: u64 = 1;
const EAlreadyPremium: u64 = 2;
const EInvalidAdminCap: u64 = 3;
const EInvalidPaymentAmount: u64 = 4;

/// 0.01 SUI = 10_000_000 MIST
const PREMIUM_PRICE: u64 = 10_000_000;

public enum SubscriptionStatus has copy, drop, store {     
    Standard,
    Premium,
}

/// Capability адміністратора.
/// Хто володіє цим object, той має право на withdraw.
public struct AdminCap has key, store {
    id: UID,
}

/// Центральний shared object застосунку.
public struct App has key {
    id: UID,
    admin_cap_id: ID,
    treasury: Balance<SUI>,
}

public struct Profile has key {
    id: UID,
    subscription_status: SubscriptionStatus,
    name: String,
}

/// Викликається один раз під час publish package.
/// Створює AdminCap для паблішера і shared App.
fun init(ctx: &mut TxContext) {
    let admin_cap = AdminCap {
        id: object::new(ctx),
    };

    let app = App {
        id: object::new(ctx),
        admin_cap_id: object::id(&admin_cap),
        treasury: balance::zero<SUI>(),
    };

    transfer::transfer(admin_cap, tx_context::sender(ctx));
    transfer::share_object(app);
}

/// Створити новий shared Profile.
public fun new(ctx: &mut TxContext, name: String) {
    assert!(name.length() > 0, EInvalidName);

    let profile = Profile {
        id: object::new(ctx),
        subscription_status: SubscriptionStatus::Standard,
        name,
    };

    transfer::share_object(profile);
}

/// Купити Premium рівно за 0.01 SUI.
public entry fun buy_premium_status(app: &mut App, profile: &mut Profile, payment: Coin<SUI>) {
    assert!(profile.subscription_status != SubscriptionStatus::Premium, EAlreadyPremium);
    assert!(coin::value(&payment) == PREMIUM_PRICE, EInvalidPaymentAmount);

    balance::join(&mut app.treasury, coin::into_balance(payment));
    profile.subscription_status = SubscriptionStatus::Premium;
}

/// Вивести кошти з treasury може тільки власник пов'язаного AdminCap.
public entry fun withdraw(app: &mut App, admin_cap: &AdminCap, amount: u64, ctx: &mut TxContext) {
    assert!(object::id(admin_cap) == app.admin_cap_id, EInvalidAdminCap);

    let withdrawn_balance = balance::split(&mut app.treasury, amount);
    let withdrawn_coin = coin::from_balance(withdrawn_balance, ctx);

    transfer::public_transfer(withdrawn_coin, tx_context::sender(ctx));
}
