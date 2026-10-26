"use client";

import * as React from 'react';

const anyReact = React as any;

try {
  const internals =
    anyReact.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE ||
    anyReact.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED ||
    {};

  if (!internals.ReactCurrentDispatcher) {
    internals.ReactCurrentDispatcher = {
      get current() {
        return internals.H || null;
      },
      set current(v: any) {
        internals.H = v;
      },
    };
  }

  if (!internals.ReactCurrentBatchConfig) {
    internals.ReactCurrentBatchConfig = {
      transition: internals.T || null,
    };
  }

  if (!internals.ReactCurrentOwner) {
    internals.ReactCurrentOwner = { current: null };
  }

  if (!internals.ReactCurrentActQueue) {
    internals.ReactCurrentActQueue = {
      current: null,
      isBatchingLegacy: false,
      didScheduleLegacyUpdate: false,
    };
  }

  // Attach __SECRET_INTERNALS directly to React object
  try {
    if (!anyReact.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED) {
      Object.defineProperty(anyReact, '__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED', {
        value: internals,
        enumerable: false,
        configurable: true,
        writable: true,
      });
    }
  } catch {}

  try {
    if (anyReact.default && !anyReact.default.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED) {
      Object.defineProperty(anyReact.default, '__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED', {
        value: internals,
        enumerable: false,
        configurable: true,
        writable: true,
      });
    }
  } catch {}

  // Also bridge onto globalThis and window
  const g = typeof globalThis !== 'undefined' ? (globalThis as any) : typeof window !== 'undefined' ? (window as any) : {};
  if (g) {
    g.__REACT_INTERNALS_POLYFILL = internals;
    if (!g.React) g.React = anyReact;
    try {
      if (g.React && !g.React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED) {
        Object.defineProperty(g.React, '__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED', {
          value: internals,
          enumerable: false,
          configurable: true,
          writable: true,
        });
      }
    } catch {}
  }
} catch (e) {
  // Fail silently
}

export {};
