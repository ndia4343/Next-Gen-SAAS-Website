'use client';

import React from 'react';
import { Logo, LogoProps } from './Logo';

export interface ZavianLogoProps extends LogoProps {
  showWordmark?: boolean;
  withWordmark?: boolean;
}

export default function ZavianLogo(props: ZavianLogoProps) {
  return <Logo {...props} href={undefined} />;
}

export { Logo };
