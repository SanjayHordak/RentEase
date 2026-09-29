import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
} from 'react-native';

import {Colors} from '../theme/colors';

const properties = [
  {
    id: '1',
    name: 'Greenview Apartments',
    detail: '2 BHK • Kochi',
    rent: '₹12,000',
    status: 'Paid',
  },
  {
    id: '2',
    name: 'Palm Grove Residency',
    detail: '1 BHK • Bengaluru',
    rent: '₹12,000',
    status: 'Paid',
  },
  {
    id: '3',
    name: 'Lake Road Home',
    detail: '2 BHK • Chennai',
    rent: '₹12,000',
    status: 'Due',
  },
];

export default function PropertiesScreen({navigation,}:{navigation:any}) {
  const handleAddProperty = ()=>{
      navigation.navigate('AddProperty');
  }
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>RENTEASE</Text>

        <Text style={styles.title}>
          Properties
        </Text>

        <Text style={styles.subtitle}>
          Manage your properties
        </Text>
        <Pressable
          style={styles.fab}
          onPress={handleAddProperty}>
          <Text style={styles.fabText}>+</Text>
        </Pressable>
      </View>

      <FlatList
        data={properties}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({item}) => (
          <Pressable style={styles.card}>

            <View style={styles.mark}>
              <Text style={styles.markText}>
                {item.type === 'Hostel' ? 'H' : 'A'}
              </Text>
            </View>

            <View style={styles.info}>
              <Text style={styles.name}>
                {item.name}
              </Text>

              <Text style={styles.detail}>
                {item.detail}
              </Text>
            </View>

            <View style={styles.right}>
              <Text style={styles.rent}>
                {item.rent}
              </Text>

              <Text
                style={[
                  styles.status,
                  item.status === 'Due' && styles.due,
                ]}>
                {item.status}
              </Text>
            </View>

          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryDark,
  },

  header: {
    padding: 20,
    paddingTop: 25,
  },

  eyebrow: {
    color: Colors.accent,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
  },

  title: {
    color: Colors.textPrimary,
    fontSize: 28,
    fontWeight: '800',
    marginTop: 6,
  },

  subtitle: {
    color: Colors.textSecondary,
    fontSize: 14,
    marginTop: 5,
  },

  list: {
    padding: 20,
    paddingTop: 0,
  },

  card: {
    backgroundColor: Colors.cardBg,
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },

  mark: {
    width: 44,
    height: 44,
    borderRadius: 9,
    backgroundColor: Colors.glassBg,
    justifyContent: 'center',
    alignItems: 'center',
  },

  markText: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '800',
  },

  info: {
    flex: 1,
    marginLeft: 12,
  },

  name: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '800',
  },

  detail: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginTop: 4,
  },

  right: {
    alignItems: 'flex-end',
  },

  rent: {
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
  },

  status: {
    color: Colors.accent,
    fontSize: 12,
    fontWeight: '800',
    marginTop: 4,
  },

  due: {
    color: Colors.error,
  },
  fab:{
    position:'absolute',
    top:50,
    right:20,
    height:55,
    width:55,
    borderRadius:15,
    backgroundColor:Colors.accent,
    alignItems:'center',
    justifyContent:'center'
    },
  fabText:{
    color:'white',
    fontSize:15,
    fontWeight:'800',
  }
});