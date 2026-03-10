import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

import type { User } from '@shared/types/user';

const exampleUser: User = {
  id: 'demo-user',
  email: 'demo@rumad.app',
};

export default function App() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.container}>
        <Text style={styles.eyebrow}>Rumad Mobile</Text>
        <Text style={styles.title}>Expo workspace is ready.</Text>
        <Text style={styles.body}>
          The app boots from the frontend workspace and can import shared
          TypeScript types.
        </Text>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Shared type check</Text>
          <Text style={styles.cardValue}>{exampleUser.email}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f4f1ea',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 16,
  },
  eyebrow: {
    color: '#8e5a2a',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  title: {
    color: '#1f2937',
    fontSize: 34,
    fontWeight: '700',
    lineHeight: 40,
  },
  body: {
    color: '#4b5563',
    fontSize: 16,
    lineHeight: 24,
  },
  card: {
    marginTop: 8,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    padding: 18,
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    elevation: 3,
  },
  cardLabel: {
    color: '#8e5a2a',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  cardValue: {
    marginTop: 8,
    color: '#111827',
    fontSize: 18,
    fontWeight: '600',
  },
});
