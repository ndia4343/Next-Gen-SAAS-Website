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

  // Also bridge onto window/globalThis for any UMD/bundle looking for global.React
  if (typeof window !== 'undefined') {
    const w = window as any;
    if (!w.React) {
      try {
        w.React = React;
      } catch {}
    }
    if (w.React) {
      if (!w.React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED) {
        try {
          w.React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = internals;
        } catch {}
      }
      if (!w.React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE) {
        try {
          w.React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = internals;
        } catch {}
      }
    }
  }
} catch (e) {
  // Fail silently
}

export {};
