import Constants from 'expo-constants';
import { Platform } from 'react-native';

function trimTrailingSlash(value: string): string {
  return value.replace(/\/+$/, '');
}

function getExpoHost(): string | null {
  const hostUri =
    (Constants.expoConfig as { hostUri?: string } | null)?.hostUri ??
    null;

  if (!hostUri) {
    return null;
  }

  return hostUri.split(':')[0] ?? null;
}

function getDefaultApiUrl(): string {
  const envUrl = process.env.EXPO_PUBLIC_API_URL?.trim();
  if (envUrl) {
    return trimTrailingSlash(envUrl);
  }

  const expoHost = getExpoHost();
  if (expoHost) {
    return `http://${expoHost}:3000`;
  }

  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3000';
  }

  return 'http://localhost:3000';
}

export const API_URL = getDefaultApiUrl();
