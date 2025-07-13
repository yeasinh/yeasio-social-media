import React from 'react';
import { View, Text, Switch, Button, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { useNavigation } from '@react-navigation/native';

const SettingsScreen = () => {
  const dispatch = useDispatch();
  const navigation: any = useNavigation();

  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const toggleNotifications = () => setNotificationsEnabled(prev => !prev);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Settings</Text>

      <View style={styles.row}>
        <Text style={styles.label}>Push Notifications</Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={toggleNotifications}
        />
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Change Password</Text>
        <Button
          title="Go"
          onPress={() => navigation.navigate('ChangePassword')}
        />
      </View>

      <View style={{ marginTop: 20 }}>
        <Button title="Logout" color="red" onPress={handleLogout} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 15,
  },
  label: {
    fontSize: 16,
  },
});

export default SettingsScreen;
