import React, {useState} from 'react';
import { getIdToken } from '../api/apiClient';
import {createProperty, RoomType} from '../api/propertyClient';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import {Colors} from '../theme/colors';

export default function AddPropertyScreen({
  navigation,
}: {
  navigation: any;
}) {
  const [name, setName] = useState('');

  // Address
  const [street, setStreet] = useState('');
  const [area, setArea] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');

  // Property type
  const [type, setType] = useState<'Apartment' | 'Hostel'>('Apartment');

  // Apartment
  const [bhkConfig, setBhkConfig] = useState<
    'Studio' | '1 BHK' | '2 BHK' | '3 BHK'
  >('2 BHK');

  // Rent (Apartment)
  const [monthlyRent, setMonthlyRent] = useState('');
  const [securityDeposit, setSecurityDeposit] = useState('');

  // Hostel Rooms
  const [hostelRooms, setHostelRooms] = useState<Record<string, {count: string, rent: string, deposit: string}>>({});

const handleSave = async () => {
  // Common validation
  if (
    !name.trim() ||
    !street.trim() ||
    !area.trim() ||
    !city.trim() ||
    !state.trim() ||
    !pincode.trim()
  ) {
    Alert.alert('Missing Information', 'Please fill all required address fields.');
    return;
  }

  if (type === 'Apartment' && (!monthlyRent.trim() || !securityDeposit.trim())) {
    Alert.alert('Missing Information', 'Please fill rent and security deposit.');
    return;
  }

  if (type === 'Hostel') {
    if (Object.keys(hostelRooms).length === 0) {
      Alert.alert('Missing Information', 'Please select at least one room type for the hostel.');
      return;
    }
    for (const [rType, data] of Object.entries(hostelRooms)) {
      if (!data.count.trim() || !data.rent.trim() || !data.deposit.trim()) {
        Alert.alert('Missing Information', `Please fill all details for ${rType}.`);
        return;
      }
    }
  }

  // Create property object
  const property: any = {
    name: name.trim(),
    address: {
      street: street.trim(),
      area: area.trim(),
      city: city.trim(),
      state: state.trim(),
      pincode: pincode.trim(),
    },
    type,
    bhkConfig: type === 'Apartment' ? bhkConfig : null,
  };

  if (type === 'Apartment') {
    property.monthlyRent = Number(monthlyRent);
    property.securityDeposit = Number(securityDeposit);
  } else if (type === 'Hostel') {
    property.hostelDetails = {
      rooms: Object.entries(hostelRooms).map(([rType, data]) => ({
        roomType: rType as RoomType,
        count: Number(data.count),
        rentPerBed: Number(data.rent),
        securityDeposit: Number(data.deposit)
      }))
    };
  }

  console.log('Saving property:', property);

  try {
    // Get Firebase authentication token
    const token = await getIdToken(true);

    // Send property to backend
    const savedProperty = await createProperty(token, property);

    console.log('Property saved successfully:', savedProperty);

    Alert.alert(
      'Success',
      'Property added successfully!',
      [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ],
    );
  } catch (error) {
    console.error('Save property error:', error);

    Alert.alert(
      'Error',
      error instanceof Error
        ? error.message
        : 'Failed to save property. Please try again.',
    );
  }
};

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled">

        {/* Header */}
        <Text style={styles.eyebrow}>RENTEASE</Text>

        <View style={styles.titleRow}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.backButton}>
            <Text style={styles.backText}>←</Text>
          </Pressable>

          <View>
            <Text style={styles.title}>Add Property</Text>

            <Text style={styles.subtitle}>
              Enter your property details
            </Text>
          </View>
        </View>

        {/* Property Name */}
        <Text style={styles.label}>Property Name *</Text>

        <TextInput
          value={name}
          onChangeText={setName}
          placeholder={
            type === 'Apartment'
              ? 'Eg. Greenview Apartments'
              : 'Eg. City Hostel'
          }
          placeholderTextColor={Colors.textSecondary}
          style={styles.input}
        />

        {/* Address */}
        <Text style={styles.sectionTitle}>Address</Text>

        <Text style={styles.label}>Street *</Text>

        <TextInput
          value={street}
          onChangeText={setStreet}
          placeholder="Street / House number"
          placeholderTextColor={Colors.textSecondary}
          style={styles.input}
        />

        <Text style={styles.label}>Area *</Text>

        <TextInput
          value={area}
          onChangeText={setArea}
          placeholder="Area / Locality"
          placeholderTextColor={Colors.textSecondary}
          style={styles.input}
        />

        <View style={styles.row}>
          <View style={styles.half}>
            <Text style={styles.label}>City *</Text>

            <TextInput
              value={city}
              onChangeText={setCity}
              placeholder="City"
              placeholderTextColor={Colors.textSecondary}
              style={styles.input}
            />
          </View>

          <View style={styles.half}>
            <Text style={styles.label}>Pincode *</Text>

            <TextInput
              value={pincode}
              onChangeText={setPincode}
              placeholder="Pincode"
              placeholderTextColor={Colors.textSecondary}
              keyboardType="numeric"
              maxLength={6}
              style={styles.input}
            />
          </View>
        </View>

        <Text style={styles.label}>State *</Text>

        <TextInput
          value={state}
          onChangeText={setState}
          placeholder="State"
          placeholderTextColor={Colors.textSecondary}
          style={styles.input}
        />

        {/* Property Details */}
        <Text style={styles.sectionTitle}>Property Details</Text>

        <Text style={styles.label}>Property Type *</Text>

        <View style={styles.optionRow}>
          {(['Apartment', 'Hostel'] as const).map(item => (
            <Pressable
              key={item}
              onPress={() => setType(item)}
              style={[
                styles.option,
                type === item && styles.optionActive,
              ]}>
              <Text
                style={[
                  styles.optionText,
                  type === item && styles.optionTextActive,
                ]}>
                {item}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Apartment Details */}
        {type === 'Apartment' && (
          <>
            <Text style={styles.label}>BHK Configuration *</Text>

            <View style={styles.optionRow}>
              {(['Studio', '1 BHK', '2 BHK', '3 BHK'] as const).map(
                item => (
                  <Pressable
                    key={item}
                    onPress={() => setBhkConfig(item)}
                    style={[
                      styles.option,
                      bhkConfig === item && styles.optionActive,
                    ]}>
                    <Text
                      style={[
                        styles.optionText,
                        bhkConfig === item &&
                          styles.optionTextActive,
                      ]}>
                      {item}
                    </Text>
                  </Pressable>
                ),
              )}
            </View>
          </>
        )}

        {/* Hostel Details */}
        {type === 'Hostel' && (
          <>
            <Text style={styles.sectionTitle}>Hostel Room Types</Text>
            <Text style={styles.label}>Select Available Room Types *</Text>
            <View style={styles.optionRow}>
              {(['1 Bed', '2 Bed', '3 Bed', '4 Bed'] as const).map(item => {
                const isActive = !!hostelRooms[item];
                return (
                  <Pressable
                    key={item}
                    onPress={() => {
                      setHostelRooms(prev => {
                        const next = { ...prev };
                        if (next[item]) delete next[item];
                        else next[item] = { count: '', rent: '', deposit: '' };
                        return next;
                      });
                    }}
                    style={[styles.option, isActive && styles.optionActive]}>
                    <Text style={[styles.optionText, isActive && styles.optionTextActive]}>
                      {item}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {Object.entries(hostelRooms).map(([rType, data]) => (
              <View key={rType} style={{marginTop: 20, padding: 15, backgroundColor: Colors.glassBg, borderRadius: 10, borderWidth: 1, borderColor: Colors.glassBorder}}>
                <Text style={{color: Colors.textPrimary, fontSize: 16, fontWeight: '800', marginBottom: 10}}>{rType} Configuration</Text>
                
                <Text style={styles.label}>Number of Rooms *</Text>
                <TextInput
                  value={data.count}
                  onChangeText={(val) => setHostelRooms(prev => ({...prev, [rType]: {...prev[rType], count: val}}))}
                  placeholder="Eg. 10"
                  placeholderTextColor={Colors.textSecondary}
                  keyboardType="numeric"
                  style={styles.input}
                />

                <Text style={styles.label}>Monthly Rent per Bed *</Text>
                <View style={styles.rentInput}>
                  <Text style={styles.rupee}>₹</Text>
                  <TextInput
                    value={data.rent}
                    onChangeText={(val) => setHostelRooms(prev => ({...prev, [rType]: {...prev[rType], rent: val}}))}
                    placeholder="8000"
                    placeholderTextColor={Colors.textSecondary}
                    keyboardType="numeric"
                    style={styles.rentTextInput}
                  />
                </View>

                <Text style={styles.label}>Security Deposit per Bed *</Text>
                <View style={styles.rentInput}>
                  <Text style={styles.rupee}>₹</Text>
                  <TextInput
                    value={data.deposit}
                    onChangeText={(val) => setHostelRooms(prev => ({...prev, [rType]: {...prev[rType], deposit: val}}))}
                    placeholder="16000"
                    placeholderTextColor={Colors.textSecondary}
                    keyboardType="numeric"
                    style={styles.rentTextInput}
                  />
                </View>
              </View>
            ))}
          </>
        )}

        {/* Apartment Rent Details */}
        {type === 'Apartment' && (
          <>
            <Text style={styles.sectionTitle}>Rent Details</Text>

            <Text style={styles.label}>Monthly Rent *</Text>

            <View style={styles.rentInput}>
              <Text style={styles.rupee}>₹</Text>

              <TextInput
                value={monthlyRent}
                onChangeText={setMonthlyRent}
                placeholder="12000"
                placeholderTextColor={Colors.textSecondary}
                keyboardType="numeric"
                style={styles.rentTextInput}
              />
            </View>

            <Text style={styles.label}>Security Deposit *</Text>

            <View style={styles.rentInput}>
              <Text style={styles.rupee}>₹</Text>

              <TextInput
                value={securityDeposit}
                onChangeText={setSecurityDeposit}
                placeholder="24000"
                placeholderTextColor={Colors.textSecondary}
                keyboardType="numeric"
                style={styles.rentTextInput}
              />
            </View>
          </>
        )}

        {/* Save */}
        <Pressable
          style={styles.saveButton}
          onPress={handleSave}>
          <Text style={styles.saveButtonText}>
            SAVE PROPERTY
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryDark,
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  eyebrow: {
    color: Colors.accent,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: 15,
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: Colors.glassBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  backText: {
    color: Colors.textPrimary,
    fontSize: 30,
    lineHeight: 32,
  },

  title: {
    color: Colors.textPrimary,
    fontSize: 26,
    fontWeight: '800',
  },

  subtitle: {
    color: Colors.textSecondary,
    fontSize: 13,
    marginTop: 3,
  },

  sectionTitle: {
    color: Colors.textPrimary,
    fontSize: 17,
    fontWeight: '800',
    marginTop: 22,
    marginBottom: 14,
  },

  label: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 7,
    marginTop: 12,
  },

  input: {
    height: 48,
    backgroundColor: Colors.cardBg,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    borderRadius: 10,
    paddingHorizontal: 14,
    color: Colors.textPrimary,
    fontSize: 14,
  },

  row: {
    flexDirection: 'row',
    gap: 10,
  },

  half: {
    flex: 1,
  },

  optionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  option: {
    paddingHorizontal: 15,
    height: 42,
    borderRadius: 10,
    backgroundColor: Colors.cardBg,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    justifyContent: 'center',
  },

  optionActive: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },

  optionText: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: '700',
  },

  optionTextActive: {
    color: '#FFFFFF',
  },

  rentInput: {
    height: 50,
    backgroundColor: Colors.cardBg,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
  },

  rupee: {
    color: Colors.accent,
    fontSize: 18,
    fontWeight: '800',
    marginRight: 8,
  },

  rentTextInput: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },

  saveButton: {
    height: 52,
    borderRadius: 10,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },

  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});

