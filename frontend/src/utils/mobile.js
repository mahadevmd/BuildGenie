import { Capacitor } from '@capacitor/core';

export const isNativeMobile = () => {
  return Capacitor.isNativePlatform();
};

export const isIOS = () => {
  return Capacitor.getPlatform() === 'ios';
};

export const isAndroid = () => {
  return Capacitor.getPlatform() === 'android';
};

export const getMobileSafeArea = () => {
  if (isNativeMobile()) {
    return {
      paddingTop: 'env(safe-area-inset-top)',
      paddingBottom: 'env(safe-area-inset-bottom)',
    };
  }
  return { paddingTop: 0, paddingBottom: 0 };
};

export const getPlatformClass = () => {
  if (isNativeMobile()) {
    return `capacitor-platform-${Capacitor.getPlatform()}`;
  }
  return '';
};

export const shouldUseMobileOptimizations = () => {
  return isNativeMobile() || window.innerWidth <= 768;
};

export const getMobileViewportHeight = () => {
  if (isNativeMobile()) {
    return '100vh'; // Capacitor handles viewport properly
  }
  return '100vh';
};

export const isMobileWeb = () => {
  return !isNativeMobile() && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};