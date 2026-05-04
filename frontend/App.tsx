import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';
import { useState } from 'react';
import { Colors } from './src/constants/colors';
import { BottomNavBar } from './src/components';
import type { TabRoute, Listing, User } from './src/types';

import {
  LandingScreen,
  SignInScreen,
  SignUpScreen,
  HomeScreen,
  ItemDetailsScreen,
  PostItemScreen,
  AccountScreen,
  ActivityScreen,
  SettingsScreen,
  EditProfileScreen,
  ChatDetailScreen,
} from './src/screens';
import React from 'react';

type Screen =
  | 'landing'
  | 'signin'
  | 'signup'
  | 'home'
  | 'itemDetails'
  | 'postItem'
  | 'editProfile'
  | 'account'
  | 'settings'
  | 'activity'
  | 'chatDetail';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('landing');
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [activeTab, setActiveTab] = useState<TabRoute>('Explore');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  const goToAccount = () => {
    setCurrentScreen('account');
    setActiveTab('Account');
  };

  const handleGetStarted = () => {
    setCurrentScreen('signin');
  };

  const handleSignInSuccess = () => {
    setIsAuthenticated(true);
    setCurrentScreen('home');
    setActiveTab('Explore');
  };

  const handleSignUp = (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    classYear: string;
  }) => {
    const newUser: User = {
      id: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      university: 'Rutgers University',
      classYear: userData.classYear,
      rating: 0,
      reviewCount: 0,
      isVerified: true,
    };

    setCurrentUser(newUser);
    setIsAuthenticated(true);
    setCurrentScreen('home');
    setActiveTab('Explore');
  };

  const handleTabPress = (tab: TabRoute) => {
    setActiveTab(tab);

    switch (tab) {
      case 'Explore':
        setCurrentScreen('home');
        break;
      case 'Sell':
        setCurrentScreen('postItem');
        break;
      case 'Activity':
        setCurrentScreen('activity');
        break;
      case 'Account':
        setCurrentScreen('account');
        break;
      default:
        setCurrentScreen('home');
        break;
    }
  };

  const handleListingPress = (listing: Listing) => {
    setSelectedListing(listing);
    setCurrentScreen('itemDetails');
  };

  const handleBack = () => {
    if (currentScreen === 'chatDetail') {
      setCurrentScreen('activity');
      setActiveChatId(null);
      setActiveTab('Activity');
    } else if (currentScreen === 'settings' || currentScreen === 'editProfile') {
      setCurrentScreen('account');
      setActiveTab('Account');
    } else if (currentScreen === 'itemDetails') {
      setCurrentScreen('home');
      setActiveTab('Explore');
    } else if (currentScreen === 'postItem') {
      setCurrentScreen('home');
      setActiveTab('Explore');
    } else if (currentScreen === 'account') {
      setCurrentScreen('home');
      setActiveTab('Explore');
    } else {
      setCurrentScreen('home');
      setActiveTab('Explore');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    setSelectedListing(null);
    setActiveChatId(null);
    setActiveTab('Explore');
    setCurrentScreen('signin');
  };

  const renderHomeScreen = () => (
    <HomeScreen
      onListingPress={handleListingPress}
      onCategoryPress={(category) => console.log('Category:', category)}
      onSeeAllPress={() => console.log('See all')}
      onRandomPress={() => console.log('Random')}
      onProfilePress={goToAccount}
    />
  );

  const renderScreen = () => {
    switch (currentScreen) {
      case 'landing':
        return <LandingScreen onGetStarted={handleGetStarted} />;

      case 'signin':
        return (
          <SignInScreen
            onSignInSuccess={handleSignInSuccess}
            onForgotPassword={() => console.log('Forgot password')}
            onCreateAccount={() => setCurrentScreen('signup')}
          />
        );

      case 'signup':
        return (
          <SignUpScreen
            onSignUp={handleSignUp}
            onSignIn={() => setCurrentScreen('signin')}
          />
        );

      case 'home':
        return renderHomeScreen();

      case 'itemDetails':
        return selectedListing ? (
          <ItemDetailsScreen
            listing={selectedListing}
            onBack={handleBack}
            onBuy={() => console.log('Buy')}
            onOfferTrade={() => console.log('Offer trade')}
            onViewProfile={() => console.log('View profile')}
            onReport={() => console.log('Report')}
            onMessageSeller={() => {
              setActiveChatId('conv-1');
              setCurrentScreen('chatDetail');
            }}
          />
        ) : (
          renderHomeScreen()
        );

      case 'postItem':
        return (
          <PostItemScreen
            onCancel={handleBack}
            onPostSuccess={() => {
              setCurrentScreen('activity');
              setActiveTab('Activity');
            }}
          />
        );

      case 'account':
        return (
          <AccountScreen
            onEditProfile={() => {
              setCurrentScreen('editProfile');
              setActiveTab('Account');
            }}
            onSettingsPress={() => {
              setCurrentScreen('settings');
              setActiveTab('Account');
            }}
          />
        );

      case 'editProfile':
        return (
          <EditProfileScreen
            onBack={handleBack}
            onSaveSuccess={() => {
              setCurrentScreen('account');
              setActiveTab('Account');
            }}
          />
        );

      case 'settings':
        return <SettingsScreen onBack={handleBack} onLogout={handleLogout} />;

      case 'activity':
        return (
          <ActivityScreen
            activeTab={activeTab}
            onTabPress={handleTabPress}
            onConversationPress={(chatId) => {
              setActiveChatId(chatId);
              setCurrentScreen('chatDetail');
            }}
          />
        );

      case 'chatDetail':
        return activeChatId ? (
          <ChatDetailScreen chatId={activeChatId} onBack={handleBack} />
        ) : (
          <ActivityScreen
            activeTab={activeTab}
            onTabPress={handleTabPress}
            onConversationPress={(chatId) => {
              setActiveChatId(chatId);
              setCurrentScreen('chatDetail');
            }}
          />
        );

      default:
        return <LandingScreen onGetStarted={handleGetStarted} />;
    }
  };

  const showBottomNav =
    isAuthenticated &&
    ['home', 'postItem', 'activity', 'account', 'chatDetail'].includes(
      currentScreen
    );

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      {renderScreen()}
      {showBottomNav && (
        <BottomNavBar activeTab={activeTab} onTabPress={handleTabPress} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});