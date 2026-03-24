import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';
import { useState } from 'react';
import { Colors } from './src/constants/colors';
import { BottomNavBar } from './src/components';
import type { TabRoute, Listing, User, Chat } from './src/types';

// Screens
import {
  LandingScreen,
  SignInScreen,
  SignUpScreen,
  HomeScreen,
  ItemDetailsScreen,
  PostItemScreen,
  AccountScreen,
} from './src/screens';

type Screen =
  | 'landing'
  | 'signin'
  | 'signup'
  | 'home'
  | 'itemDetails'
  | 'postItem'
  | 'account'
  | 'activity';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('landing');
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [activeTab, setActiveTab] = useState<TabRoute>('Explore');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Mock current user
  const currentUser: User = {
    id: '1',
    firstName: 'Alex',
    lastName: 'Rivera',
    email: 'alex.rivera@rutgers.edu',
    university: 'Rutgers University',
    classYear: 'Senior',
    rating: 4.2,
    reviewCount: 15,
    isVerified: true,
  };

  // Navigation handlers
  const handleGetStarted = () => {
    setCurrentScreen('signup');
  };

  const handleSignIn = (email: string, password: string) => {
    console.log('Signing in:', email);
    setIsAuthenticated(true);
    setCurrentScreen('home');
  };

  const handleSignUp = (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    classYear: string;
  }) => {
    console.log('Signing up:', userData);
    setIsAuthenticated(true);
    setCurrentScreen('home');
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
    }
  };

  const handleListingPress = (listing: Listing) => {
    setSelectedListing(listing);
    setCurrentScreen('itemDetails');
  };

  const handleBack = () => {
    if (currentScreen === 'itemDetails') {
      setCurrentScreen('home');
    } else if (currentScreen === 'postItem') {
      setCurrentScreen('home');
      setActiveTab('Explore');
    } else if (currentScreen === 'account') {
      setCurrentScreen('home');
      setActiveTab('Explore');
    } else {
      setCurrentScreen('home');
    }
  };

  const handlePublish = (itemData: {
    title: string;
    category: string;
    condition: string;
    price: string;
    isOpenToTrade: boolean;
    isNegotiable: boolean;
  }) => {
    console.log('Publishing:', itemData);
    setCurrentScreen('home');
    setActiveTab('Explore');
  };

  // Render current screen
  const renderScreen = () => {
    switch (currentScreen) {
      case 'landing':
        return <LandingScreen onGetStarted={handleGetStarted} />;

      case 'signin':
        return (
          <SignInScreen
            onSignIn={handleSignIn}
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
        return (
          <HomeScreen
            onListingPress={handleListingPress}
            onCategoryPress={(category) => console.log('Category:', category)}
            onSeeAllPress={() => console.log('See all')}
            onRandomPress={() => console.log('Random')}
          />
        );

      case 'itemDetails':
        return selectedListing ? (
          <ItemDetailsScreen
            listing={selectedListing}
            onBack={handleBack}
            onBuy={() => console.log('Buy')}
            onOfferTrade={() => console.log('Offer trade')}
            onViewProfile={() => console.log('View profile')}
            onReport={() => console.log('Report')}
          />
        ) : null;

      case 'postItem':
        return (
          <PostItemScreen onBack={handleBack} onPublish={handlePublish} />
        );

      case 'account':
        return (
          <AccountScreen
            user={currentUser}
            onEditProfile={() => console.log('Edit profile')}
            onViewAllChats={() => console.log('View all chats')}
            onChatPress={(chat: Chat) => console.log('Chat:', chat)}
            onListingPress={handleListingPress}
            onSettingsPress={() => console.log('Settings')}
          />
        );

      case 'activity':
        // For now, show account screen as placeholder
        return (
          <AccountScreen
            user={currentUser}
            onEditProfile={() => console.log('Edit profile')}
            onViewAllChats={() => console.log('View all chats')}
            onChatPress={(chat: Chat) => console.log('Chat:', chat)}
            onListingPress={handleListingPress}
            onSettingsPress={() => console.log('Settings')}
          />
        );

      default:
        return <LandingScreen onGetStarted={handleGetStarted} />;
    }
  };

  // Show bottom nav bar for authenticated screens
  const showBottomNav =
    isAuthenticated &&
    (currentScreen === 'home' ||
      currentScreen === 'postItem' ||
      currentScreen === 'activity' ||
      currentScreen === 'account');

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
