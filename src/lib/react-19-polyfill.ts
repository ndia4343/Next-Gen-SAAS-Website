"use client";
import * as React from 'react';
const anyReact = React as any;
const secretKey = '__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED';
try {
  const clientInternals = anyReact.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED || { H: null, A: null, T: null, S: null };
  if (!anyReact[secretKey] && Object.isExtensible(anyReact)) {
    Object.defineProperty(anyReact, secretKey, { configurable: true, enumerable: false, writable: true, value: clientInternals });
  }
  const dispatcher = clientInternals.H || clientInternals.A || clientInternals.T || clientInternals.S;
  if (dispatcher && !dispatcher.ReactCurrentDispatcher) {
    dispatcher.ReactCurrentDispatcher = { current: clientInternals.H };
  }
  if (dispatcher && !dispatcher.ReactCurrentBatchConfig) {
    dispatcher.ReactCurrentBatchConfig = { transition: clientInternals.T };
  }
  if (dispatcher && !dispatcher.ReactCurrentOwner) {
    dispatcher.ReactCurrentOwner = { current: null };
  }
  if (dispatcher && !dispatcher.ReactCurrentActQueue) {
    dispatcher.ReactCurrentActQueue = { isBatchingLegacy: false, didScheduleLegacyUpdate: false };
  }
} catch (e) {}
export {};
