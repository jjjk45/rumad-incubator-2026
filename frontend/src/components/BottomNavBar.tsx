import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Colors, BorderRadius, Shadows } from '../constants/colors';
import type { TabRoute } from '../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface BottomNavBarProps {
  activeTab: TabRoute;
  onTabPress: (tab: TabRoute) => void;
}

const TABS: { route: TabRoute; label: string; icon: string }[] = [
  { route: 'Explore', label: 'Explore', icon: 'compass' },
  { route: 'Sell', label: 'Sell', icon: 'plus-square' },
  { route: 'Activity', label: 'Activity', icon: 'bell' },
  { route: 'Account', label: 'Account', icon: 'user' },
];

export function BottomNavBar({ activeTab, onTabPress }: BottomNavBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.route;
          return (
            <TouchableOpacity
              key={tab.route}
              style={[styles.tab, isActive && styles.tabActive]}
              onPress={() => onTabPress(tab.route)}
              activeOpacity={0.8}
            >
              <View style={styles.iconContainer}>
                <Text style={[styles.icon, isActive && styles.iconActive]}>
                  {getIcon(tab.icon, isActive)}
                </Text>
              </View>
              <Text style={[styles.label, isActive && styles.labelActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

function getIcon(iconName: string, isActive: boolean): string {
  const icons: Record<string, { active: string; inactive: string }> = {
    compass: { active: '⬡', inactive: '⬡' },
    'plus-square': { active: '+', inactive: '+' },
    bell: { active: '🔔', inactive: '🔔' },
    user: { active: '👤', inactive: '👤' },
  };
  return icons[iconName]?.inactive || '•';
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.tabBarBackground,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    borderTopColor: Colors.tabBarBorder,
    ...Shadows.bottomNav,
    paddingBottom: 20,
  },
  inner: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 80,
    paddingHorizontal: 16,
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
  },
  tabActive: {
    backgroundColor: Colors.primary,
  },
  iconContainer: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  icon: {
    fontSize: 18,
    color: Colors.tabInactive,
  },
  iconActive: {
    color: Colors.tabActive,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.tabInactive,
    letterSpacing: 0.55,
    textTransform: 'uppercase',
  },
  labelActive: {
    color: Colors.tabActive,
  },
});
