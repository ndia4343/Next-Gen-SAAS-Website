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

  // Map React 18 dispatcher to React 19's internals.H
  internals.ReactCurrentDispatcher = {
    get current() {
      return internals.H;
    },
    set current(v: any) {
      internals.H = v;
    },
  };

  // Map React 18 batch config to React 19's internals.T
  internals.ReactCurrentBatchConfig = {
    get transition() {
      return internals.T;
    },
    set transition(v: any) {
      internals.T = v;
    },
  };

  // Map React 18 owner to React 19's internals.A
  internals.ReactCurrentOwner = {
    get current() {
      return internals.A;
    },
    set current(v: any) {
      internals.A = v;
    },
  };

  if (!internals.ReactCurrentActQueue) {
    internals.ReactCurrentActQueue = { current: null };
  }

  if (typeof window !== "undefined") {
    (window as any).React = React;
  }
}

export {};
