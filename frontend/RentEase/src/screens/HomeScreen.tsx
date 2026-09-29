import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Alert, Pressable, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import auth from '@react-native-firebase/auth';
import {signOutUser} from '../backend/firebaseAuth';
import {Colors} from '../theme/colors';
import { getIdToken, getUserProfile } from '../api/apiClient';

export default function HomeScreen({navigation}: {navigation: any}) {
  const user = auth().currentUser;
  const firstName = user?.displayName?.split(' ')[0] || 'there';
  const [profile,setProfile] = useState<any>(null);
  const [loading,setLoading] = useState(true);

  useEffect(()=>{
      loadProfile();
  },[]);
  const loadProfile = async () =>{
    try{
       const token = await getIdToken();
       const userProfile = await getUserProfile(token);
       setProfile(userProfile);
    }catch(error){
       console.error("Error loading profile",error);
       Alert.alert("Error","Could not load profile",[{text:"OK"}]);
    } finally{
      setLoading(false);
    }
  }
  const role = profile?.role?.toUpperCase();
  if(loading){
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator/>
      </SafeAreaView>
    )
  }

  const handleSignOut = async () => {
    try {
      await signOutUser();
      navigation.replace('Auth');
    } catch (error: any) {
      Alert.alert('Sign out failed', error.message || 'Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar 
      barStyle="light-content" 
      backgroundColor={Colors.primaryDark} 
      />
      <ScrollView 
      contentContainerStyle={styles.content} 
      showsVerticalScrollIndicator={false}
      >
        <View style={styles.topBar}>
          <View>
            <Text style={styles.brand}>RentEase</Text>
            <Text style={styles.greeting}>Good morning, {firstName}</Text>
            </View>
            <Pressable 
            accessibilityLabel="Sign out" 
            onPress={handleSignOut} 
            style={styles.avatar}>
              <Text style={styles.avatarText}>
                {firstName[0].toUpperCase()}
                </Text>
                </Pressable>
                </View>
        {role === 'LANDLORD' && <LandlordDashboard/>}
        {role === 'TENANT' && <TenantDashboard/>}
      </ScrollView>
    </SafeAreaView>
  );
}

function LandlordDashboard() {
  return <><View style={styles.sectionHeading}><View><Text style={styles.eyebrow}>THIS MONTH</Text><Text style={styles.sectionTitle}>Rent collection</Text></View><Text style={styles.month}>AUG 2026</Text></View><LinearGradient colors={[Colors.cardBg, Colors.primaryMid]} style={styles.collectionCard}><View><Text style={styles.cardLabel}>COLLECTED</Text><Text style={styles.amount}>₹24,000</Text><Text style={styles.cardMeta}>2 of 3 properties paid</Text></View><View style={styles.progressRing}><Text style={styles.progressText}>67%</Text></View></LinearGradient><Pressable style={styles.primaryAction} onPress={() => Alert.alert('Rent tracker', 'Add a property to start tracking rent.')}><Text style={styles.primaryActionText}>+  Mark rent received</Text></Pressable><View style={styles.statsRow}><Stat value="₹12,000" label="Pending" color="#FFD60A" /><Stat value="1" label="Maintenance" color={Colors.error} /><Stat value="3" label="Properties" color={Colors.accent} /></View><View style={styles.sectionHeading}><Text style={styles.sectionTitle}>Your properties</Text><Text style={styles.link}>View all</Text></View><PropertyRow name="Greenview Apartments" detail="2 BHK  •  Kochi" rent="₹12,000" status="Paid" /><PropertyRow name="Palm Grove Residency" detail="1 BHK  •  Bengaluru" rent="₹12,000" status="Paid" /><PropertyRow name="Lake Road Home" detail="2 BHK  •  Chennai" rent="₹12,000" status="Due" due /></>;
}

function TenantDashboard() {
  return <><Text style={styles.eyebrow}>YOUR RENT</Text><Text style={styles.sectionTitle}>Next payment</Text><View style={styles.tenantCard}><Text style={styles.tenantAmount}>₹18,500</Text><Text style={styles.cardMeta}>Due on 5 September 2026</Text><View style={styles.tenantDivider} /><Text style={styles.tenantStatus}>12 days to go</Text></View><View style={styles.sectionHeading}><Text style={styles.sectionTitle}>Quick access</Text></View><View style={styles.quickGrid}><QuickAction title="Receipts" detail="View your rent history" /><QuickAction title="Documents" detail="Your lease agreement" /><QuickAction title="Maintenance" detail="1 open request" /><QuickAction title="Reminders" detail="Notifications on" /></View></>;
}

function Stat({value, label, color}: {value: string; label: string; color: string}) { return <View style={styles.stat}><Text style={[styles.statValue, {color}]}>{value}</Text><Text style={styles.statLabel}>{label}</Text></View>; }
function PropertyRow({name, detail, rent, status, due}: {name: string; detail: string; rent: string; status: string; due?: boolean}) { return <View style={styles.propertyRow}><View style={[styles.propertyMark, due && styles.propertyMarkDue]}><Text style={[styles.propertyMarkText, due && styles.dueText]}>H</Text></View><View style={styles.propertyInfo}><Text style={styles.propertyName}>{name}</Text><Text style={styles.propertyDetail}>{detail}</Text></View><View style={styles.propertyRight}><Text style={styles.propertyRent}>{rent}</Text><Text style={[styles.propertyStatus, due && styles.dueText]}>{status}</Text></View></View>; }
function QuickAction({title, detail}: {title: string; detail: string}) { return <Pressable style={styles.quickAction}><Text style={styles.quickTitle}>{title}</Text><Text style={styles.quickDetail}>{detail}</Text></Pressable>; }

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.primaryDark}, content: {padding: 20, paddingBottom: 100}, topBar: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22}, brand: {color: Colors.accent, fontSize: 15, fontWeight: '700', letterSpacing: 1}, greeting: {color: Colors.textPrimary, fontSize: 25, fontWeight: '800', marginTop: 7}, avatar: {width: 42, height: 42, borderRadius: 21, backgroundColor: Colors.cardBg, borderWidth: 1, borderColor: Colors.glassBorder, alignItems: 'center', justifyContent: 'center'}, avatarText: {color: Colors.accent, fontSize: 17, fontWeight: '800'}, roleSwitch: {flexDirection: 'row', backgroundColor: Colors.cardBg, padding: 4, borderRadius: 8, marginBottom: 28}, roleButton: {flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: 6}, roleActive: {backgroundColor: Colors.glassBg, elevation: 0}, roleText: {color: Colors.textSecondary, fontSize: 14, fontWeight: '700'}, roleTextActive: {color: Colors.textPrimary}, sectionHeading: {flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 24, marginBottom: 12}, eyebrow: {color: Colors.accent, fontSize: 11, fontWeight: '800', letterSpacing: 1.2, marginBottom: 5}, sectionTitle: {color: Colors.textPrimary, fontSize: 20, fontWeight: '800'}, month: {color: Colors.textSecondary, fontSize: 11, fontWeight: '700'}, collectionCard: {borderRadius: 10, padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: Colors.glassBorder}, cardLabel: {color: Colors.textSecondary, fontSize: 11, fontWeight: '800', letterSpacing: 1}, amount: {color: Colors.textPrimary, fontSize: 30, fontWeight: '800', marginVertical: 5}, cardMeta: {color: Colors.textMuted, fontSize: 13}, progressRing: {width: 68, height: 68, borderRadius: 34, borderWidth: 7, borderColor: Colors.accent, alignItems: 'center', justifyContent: 'center'}, progressText: {color: Colors.textPrimary, fontSize: 15, fontWeight: '800'}, primaryAction: {backgroundColor: Colors.accent, borderRadius: 8, paddingVertical: 15, alignItems: 'center', marginTop: 12}, primaryActionText: {color: Colors.primaryDark, fontSize: 15, fontWeight: '800'}, statsRow: {flexDirection: 'row', gap: 8, marginTop: 14}, stat: {flex: 1, backgroundColor: Colors.cardBg, borderRadius: 8, padding: 13, borderWidth: 1, borderColor: Colors.glassBorder}, statValue: {fontSize: 17, fontWeight: '800'}, statLabel: {color: Colors.textSecondary, fontSize: 12, marginTop: 4}, link: {color: Colors.accent, fontSize: 13, fontWeight: '800'}, propertyRow: {backgroundColor: Colors.cardBg, borderRadius: 8, padding: 13, flexDirection: 'row', alignItems: 'center', marginBottom: 8, borderWidth: 1, borderColor: Colors.glassBorder}, propertyMark: {width: 38, height: 38, borderRadius: 8, backgroundColor: Colors.glassBg, alignItems: 'center', justifyContent: 'center'}, propertyMarkDue: {backgroundColor: 'rgba(255, 59, 48, 0.1)'}, propertyMarkText: {color: Colors.textPrimary, fontSize: 15, fontWeight: '800'}, propertyInfo: {flex: 1, marginLeft: 11}, propertyName: {color: Colors.textPrimary, fontSize: 14, fontWeight: '800'}, propertyDetail: {color: Colors.textSecondary, fontSize: 12, marginTop: 4}, propertyRight: {alignItems: 'flex-end'}, propertyRent: {color: Colors.textPrimary, fontSize: 13, fontWeight: '700'}, propertyStatus: {color: Colors.accent, fontSize: 12, fontWeight: '800', marginTop: 4}, dueText: {color: Colors.error}, tenantCard: {backgroundColor: Colors.cardBg, borderRadius: 10, padding: 20, marginTop: 14, borderWidth: 1, borderColor: Colors.glassBorder}, tenantAmount: {color: Colors.accent, fontSize: 32, fontWeight: '800'}, tenantDivider: {height: 1, backgroundColor: Colors.glassBorder, marginVertical: 18}, tenantStatus: {color: Colors.textSecondary, fontWeight: '800', fontSize: 14}, quickGrid: {flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 4}, quickAction: {width: '48%', backgroundColor: Colors.cardBg, borderRadius: 8, padding: 16, borderWidth: 1, borderColor: Colors.glassBorder}, quickTitle: {color: Colors.textPrimary, fontSize: 15, fontWeight: '800'}, quickDetail: {color: Colors.textSecondary, fontSize: 12, marginTop: 8, lineHeight: 17}, bottomNav: {position: 'absolute', bottom: 0, left: 0, right: 0, height: 68, backgroundColor: Colors.primaryDark, borderTopWidth: 1, borderTopColor: Colors.glassBorder, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center'}, navActive: {color: Colors.accent, fontSize: 12, fontWeight: '800'}, navItem: {color: Colors.textSecondary, fontSize: 12, fontWeight: '600'},
});
