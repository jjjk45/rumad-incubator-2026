import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { TopAppBar } from '../components';
import { supabase } from '../lib/supabase';

interface PostItemScreenProps {
  onPostSuccess?: () => void;
  onCancel?: () => void;
}

const CATEGORIES = [
  'Books',
  'Tech',
  'Furniture',
  'Clothing',
  'Dorm',
  'School Supplies',
  'Other',
];

const CONDITIONS = ['New', 'Like New', 'Good', 'Fair', 'Used'];

const PICKUP_LOCATIONS = [
  'Livingston',
  'College Ave',
  'Cook/Doug',
  'Busch',
];

export function PostItemScreen({
  onPostSuccess,
  onCancel,
}: PostItemScreenProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [category, setCategory] = useState('Books');
  const [condition, setCondition] = useState('Good');
  const [imageUri, setImageUri] = useState<string | null>(null);

  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showConditionPicker, setShowConditionPicker] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const priceNumber = Number(price);

  const isFormValid =
    title.trim().length > 0 &&
    description.trim().length > 0 &&
    price.trim().length > 0 &&
    !Number.isNaN(priceNumber) &&
    priceNumber >= 0 &&
    pickupLocation.trim().length > 0;

  const takePhoto = async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          'Camera permission needed',
          'Please allow camera access to take listing photos.'
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets.length > 0) {
        setImageUri(result.assets[0].uri);
      }
    } catch (err: any) {
      Alert.alert('Camera Error', err.message || 'Could not open camera.');
    }
  };

  const pickImage = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          'Photo permission needed',
          'Please allow photo access to choose listing images.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets.length > 0) {
        setImageUri(result.assets[0].uri);
      }
    } catch (err: any) {
      Alert.alert('Photo Error', err.message || 'Could not choose photo.');
    }
  };

  const uploadImageToSupabase = async (uri: string, userId: string) => {
    const response = await fetch(uri);
    const arrayBuffer = await response.arrayBuffer();

    const fileExt = uri.split('.').pop()?.split('?')[0]?.toLowerCase() || 'jpg';
    const filePath = `${userId}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('listing-images')
      .upload(filePath, arrayBuffer, {
        contentType: 'image/jpeg',
        upsert: false,
      });

    if (uploadError) {
      throw new Error(uploadError.message);
    }

    const { data } = supabase.storage
      .from('listing-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handlePostItem = async () => {
    console.log('POST BUTTON PRESSED');
    console.log({
      title,
      description,
      price,
      pickupLocation,
      category,
      condition,
      imageUri,
      isFormValid,
    });

    if (!isFormValid) {
      Alert.alert(
        'Missing info',
        'Please fill out title, description, price, and pickup location.'
      );
      return;
    }

    setIsLoading(true);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        throw new Error(userError.message);
      }

      if (!user) {
        throw new Error('You must be signed in to post an item.');
      }

      let imageUrl: string | null = null;

      if (imageUri) {
        imageUrl = await uploadImageToSupabase(imageUri, user.id);
      }

      const listingPayload = {
        seller_id: user.id,
        title: title.trim(),
        description: description.trim(),
        price: priceNumber,
        category,
        condition,
        location: pickupLocation.trim(),
        status: 'active',
        image_url: imageUrl,
        is_open_to_trade: false,
        is_negotiable: true,
      };

      console.log('Listing payload:', listingPayload);

      const { data, error } = await supabase
        .from('listings')
        .insert(listingPayload)
        .select()
        .single();

      console.log('Listing insert data:', data);
      console.log('Listing insert error:', error);

      if (error) {
        throw new Error(error.message);
      }

      Alert.alert('Posted!', 'Your item has been listed.');

      setTitle('');
      setDescription('');
      setPrice('');
      setPickupLocation('');
      setCategory('Books');
      setCondition('Good');
      setImageUri(null);

      setShowCategoryPicker(false);
      setShowConditionPicker(false);
      setShowLocationPicker(false);

      onPostSuccess?.();
    } catch (err: any) {
      console.log('Post item error:', err);
      Alert.alert('Error', err.message || 'Could not post item.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.screen}>
      <TopAppBar
        showLogo
        showSearch={false}
        showNotification={false}
        showProfile={false}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="always"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.pageTitle}>Sell an Item</Text>
          <Text style={styles.subtitle}>
            Post something for other Rutgers students to buy or trade.
          </Text>

          <View style={styles.section}>
            <Text style={styles.label}>Item Photo</Text>

            {imageUri ? (
              <View>
                <Image source={{ uri: imageUri }} style={styles.previewImage} />
                <TouchableOpacity
                  style={styles.removePhotoButton}
                  onPress={() => setImageUri(null)}
                  disabled={isLoading}
                >
                  <Text style={styles.removePhotoText}>Remove Photo</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.photoPlaceholder}>
                <Text style={styles.photoIcon}>📷</Text>
                <Text style={styles.photoPlaceholderText}>No photo selected</Text>
              </View>
            )}

            <View style={styles.photoButtons}>
              <TouchableOpacity
                style={styles.photoPrimaryButton}
                onPress={takePhoto}
                disabled={isLoading}
              >
                <Text style={styles.photoPrimaryButtonText}>Take Photo</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.photoSecondaryButton}
                onPress={pickImage}
                disabled={isLoading}
              >
                <Text style={styles.photoSecondaryButtonText}>Choose Photo</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Item Title</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: Mini fridge, calculus textbook, desk lamp"
                placeholderTextColor="#888888"
                value={title}
                onChangeText={setTitle}
                editable={!isLoading}
                autoCapitalize="sentences"
                underlineColorAndroid="transparent"
                selectionColor="#AC2C13"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Describe the item, condition, and details buyers should know"
                placeholderTextColor="#888888"
                value={description}
                onChangeText={setDescription}
                editable={!isLoading}
                multiline
                textAlignVertical="top"
                underlineColorAndroid="transparent"
                selectionColor="#AC2C13"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Price</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: 25"
                placeholderTextColor="#888888"
                value={price}
                onChangeText={(text) => setPrice(text.replace(/[^0-9.]/g, ''))}
                editable={!isLoading}
                keyboardType={Platform.OS === 'ios' ? 'decimal-pad' : 'numeric'}
                underlineColorAndroid="transparent"
                selectionColor="#AC2C13"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Pickup Location</Text>

              <TouchableOpacity
                style={styles.select}
                onPress={() => {
                  setShowLocationPicker(!showLocationPicker);
                  setShowCategoryPicker(false);
                  setShowConditionPicker(false);
                }}
                disabled={isLoading}
              >
                <Text
                  style={[
                    styles.selectValue,
                    pickupLocation.trim() === '' && styles.placeholderText,
                  ]}
                >
                  {pickupLocation.trim() === ''
                    ? 'Choose pickup location'
                    : pickupLocation}
                </Text>
                <Text style={styles.chevron}>▼</Text>
              </TouchableOpacity>

              {showLocationPicker && (
                <View style={styles.picker}>
                  {PICKUP_LOCATIONS.map((item) => (
                    <TouchableOpacity
                      key={item}
                      style={[
                        styles.pickerOption,
                        pickupLocation === item && styles.pickerOptionActive,
                      ]}
                      onPress={() => {
                        setPickupLocation(item);
                        setShowLocationPicker(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.pickerText,
                          pickupLocation === item && styles.pickerTextActive,
                        ]}
                      >
                        {item}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Category</Text>

              <TouchableOpacity
                style={styles.select}
                onPress={() => {
                  setShowCategoryPicker(!showCategoryPicker);
                  setShowConditionPicker(false);
                  setShowLocationPicker(false);
                }}
                disabled={isLoading}
              >
                <Text style={styles.selectValue}>{category}</Text>
                <Text style={styles.chevron}>▼</Text>
              </TouchableOpacity>

              {showCategoryPicker && (
                <View style={styles.picker}>
                  {CATEGORIES.map((item) => (
                    <TouchableOpacity
                      key={item}
                      style={[
                        styles.pickerOption,
                        category === item && styles.pickerOptionActive,
                      ]}
                      onPress={() => {
                        setCategory(item);
                        setShowCategoryPicker(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.pickerText,
                          category === item && styles.pickerTextActive,
                        ]}
                      >
                        {item}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Condition</Text>

              <TouchableOpacity
                style={styles.select}
                onPress={() => {
                  setShowConditionPicker(!showConditionPicker);
                  setShowCategoryPicker(false);
                  setShowLocationPicker(false);
                }}
                disabled={isLoading}
              >
                <Text style={styles.selectValue}>{condition}</Text>
                <Text style={styles.chevron}>▼</Text>
              </TouchableOpacity>

              {showConditionPicker && (
                <View style={styles.picker}>
                  {CONDITIONS.map((item) => (
                    <TouchableOpacity
                      key={item}
                      style={[
                        styles.pickerOption,
                        condition === item && styles.pickerOptionActive,
                      ]}
                      onPress={() => {
                        setCondition(item);
                        setShowConditionPicker(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.pickerText,
                          condition === item && styles.pickerTextActive,
                        ]}
                      >
                        {item}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <TouchableOpacity
              style={[
                styles.postButton,
                (!isFormValid || isLoading) && styles.postButtonDisabled,
              ]}
              onPress={handlePostItem}
              disabled={isLoading}
              activeOpacity={0.85}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.postButtonText}>Post Item</Text>
              )}
            </TouchableOpacity>

            {!isFormValid && (
              <Text style={styles.helperText}>
                Fill out title, description, price, and pickup location to post.
              </Text>
            )}

            {onCancel && (
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={onCancel}
                disabled={isLoading}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.bottomSpacing} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F8F5F2',
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    paddingTop: 80,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  pageTitle: {
    fontSize: 44,
    fontWeight: '800',
    color: '#111111',
    letterSpacing: -1.4,
    lineHeight: 48,
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 28,
    fontSize: 16,
    color: '#555555',
    lineHeight: 24,
  },
  section: {
    marginBottom: 28,
  },
  form: {
    gap: 18,
  },
  inputGroup: {
    width: '100%',
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111111',
    marginBottom: 8,
  },
  input: {
    width: '100%',
    minHeight: 54,
    backgroundColor: '#FFFFFF',
    color: '#111111',
    borderWidth: 1,
    borderColor: '#D7D7D7',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  textArea: {
    minHeight: 120,
  },
  photoPlaceholder: {
    height: 190,
    borderRadius: 16,
    backgroundColor: '#EFE8E4',
    borderWidth: 1,
    borderColor: '#D7D7D7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  photoPlaceholderText: {
    color: '#555555',
    fontSize: 15,
  },
  previewImage: {
    width: '100%',
    height: 220,
    borderRadius: 16,
    backgroundColor: '#EFE8E4',
  },
  removePhotoButton: {
    alignSelf: 'center',
    marginTop: 10,
  },
  removePhotoText: {
    color: '#AC2C13',
    fontSize: 14,
    fontWeight: '700',
  },
  photoButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  photoPrimaryButton: {
    flex: 1,
    backgroundColor: '#AC2C13',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  photoPrimaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
  photoSecondaryButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D7D7D7',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  photoSecondaryButtonText: {
    color: '#111111',
    fontWeight: '700',
    fontSize: 15,
  },
  select: {
    width: '100%',
    minHeight: 54,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D7D7D7',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectValue: {
    color: '#111111',
    fontSize: 16,
  },
  placeholderText: {
    color: '#888888',
  },
  chevron: {
    color: '#888888',
    fontSize: 12,
  },
  picker: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D7D7D7',
    borderRadius: 12,
    marginTop: 6,
    overflow: 'hidden',
  },
  pickerOption: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  pickerOptionActive: {
    backgroundColor: '#F5DED9',
  },
  pickerText: {
    fontSize: 16,
    color: '#111111',
  },
  pickerTextActive: {
    color: '#AC2C13',
    fontWeight: '700',
  },
  postButton: {
    marginTop: 12,
    backgroundColor: '#AC2C13',
    minHeight: 54,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  postButtonDisabled: {
    opacity: 0.65,
  },
  postButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  helperText: {
    color: '#555555',
    fontSize: 13,
    textAlign: 'center',
    marginTop: -8,
  },
  cancelButton: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  cancelText: {
    color: '#555555',
    fontSize: 16,
    fontWeight: '700',
  },
  bottomSpacing: {
    height: 100,
  },
});