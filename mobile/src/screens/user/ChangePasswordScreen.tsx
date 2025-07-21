import React from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';

const ChangePasswordScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Change Password</Text>
      <TextInput
        placeholder="Current Password"
        style={styles.input}
        secureTextEntry
      />
      <TextInput
        placeholder="New Password"
        style={styles.input}
        secureTextEntry
      />
      <TextInput
        placeholder="Confirm New Password"
        style={styles.input}
        secureTextEntry
      />
      <Button
        title="Update Password"
        onPress={() => Alert.alert('Not implemented')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  heading: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
});

export default ChangePasswordScreen;
