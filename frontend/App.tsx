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
  ActivityScreen,
  ChatDetailScreen,
  OTPScreen,
} from './src/screens';

type Screen =
  | 'landing'
  | 'signin'
  | 'signup'
  | 'otpVerification'
  | 'home'
  | 'itemDetails'
  | 'postItem'
  | 'account'
  | 'activity'
  | 'chatDetail';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('landing');
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [activeTab, setActiveTab] = useState<TabRoute>('Explore');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  // Demo user for demo mode
  const demoUser: User = {
    id: 'demo-user',
    firstName: 'Demo',
    lastName: 'User',
    email: 'demo@rutgers.edu',
    university: 'Rutgers University',
    classYear: 'Senior',
    rating: 5.0,
    reviewCount: 100,
    isVerified: true,
  };

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

  const handleDemoMode = () => {
    setIsAuthenticated(true);
    setCurrentScreen('home');
  };

  const handleVerifyOTP = (otp: string) => {
    console.log('Verifying OTP:', otp);
    setIsAuthenticated(true);
    setCurrentScreen('home');
  };

  const handleResendOTP = () => {
    console.log('Resending OTP');
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
    // Navigate to OTP verification screen
    setCurrentScreen('otpVerification');
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
    if (currentScreen === 'chatDetail') {
      setCurrentScreen('activity');
      setActiveChatId(null);
    } else if (currentScreen === 'otpVerification') {
      setCurrentScreen('signup');
    } else if (currentScreen === 'itemDetails') {
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
        return <LandingScreen onGetStarted={handleGetStarted} onDemoMode={handleDemoMode} />;

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
            onOTPRequired={() => setCurrentScreen('otpVerification')}
          />
        );

      case 'otpVerification':
        return (
          <OTPScreen
            onVerifyOTP={handleVerifyOTP}
            onResendOTP={handleResendOTP}
            onBack={() => setCurrentScreen('signup')}
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
            onMessageSeller={() => {
              setActiveChatId('conv-1'); // Mock chat ID
              setCurrentScreen('chatDetail');
            }}
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
            onViewAllChats={() => {
              setCurrentScreen('activity');
              setActiveTab('Activity');
            }}
            onChatPress={(chat: any) => {
              setActiveChatId(chat.id);
              setCurrentScreen('chatDetail');
            }}
            onListingPress={handleListingPress}
            onSettingsPress={() => console.log('Settings')}
          />
        );

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
          <ChatDetailScreen
            chatId={activeChatId}
            onBack={handleBack}
          />
        ) : null;

      default:
        return <LandingScreen onGetStarted={handleGetStarted} onDemoMode={handleDemoMode} />;
    }
  };

  // Show bottom nav bar for authenticated screens
  const showBottomNav =
    (isAuthenticated || currentScreen === 'home') &&
    (currentScreen === 'home' ||
      currentScreen === 'postItem' ||
      currentScreen === 'activity' ||
      currentScreen === 'account' ||
      currentScreen === 'chatDetail');

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
