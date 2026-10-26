import * as React from "react";

// React 19 reconciler polyfill for @react-three/fiber v8
const anyReact = React as any;
if (anyReact) {
  const internals =
    anyReact.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE ||
    anyReact.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED ||
    {};

  if (!anyReact.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED) {
    anyReact.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = internals;
  }

  if (!internals.ReactCurrentDispatcher) {
    Object.defineProperty(internals, "ReactCurrentDispatcher", {
      get() {
        return internals.H || { current: null };
      },
      set(v) {
        internals.H = v;
      },
      configurable: true,
      enumerable: true,
    });
  }

  if (!internals.ReactCurrentBatchConfig) {
    internals.ReactCurrentBatchConfig = { transition: null };
  }

  if (!internals.ReactCurrentOwner) {
    internals.ReactCurrentOwner = { current: null };
  }

  if (!internals.ReactCurrentActQueue) {
    internals.ReactCurrentActQueue = { current: null };
  }

  if (typeof window !== "undefined") {
    (window as any).React = React;
  }
}

export {};
