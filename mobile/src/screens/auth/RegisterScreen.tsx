import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { useMutation } from '@apollo/client';
import { REGISTER } from '../../graphql/auth.graphql';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../store/slices/authSlice';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/AuthStack';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

const RegisterScreen = ({ navigation }: Props) => {
  const dispatch = useDispatch();

  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const [register, { loading }] = useMutation(REGISTER, {
    onCompleted: ({ register }) => {
      dispatch(setCredentials(register));
    },
    onError: err => {
      Alert.alert('Error', err.message);
    },
  });

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.password) return;

    register({
      variables: {
        input: form,
      },
    });
  };

  return (
    <View>
      <Text>Name</Text>
      <TextInput
        value={form.name}
        onChangeText={text => setForm({ ...form, name: text })}
      />
      <Text>Email</Text>
      <TextInput
        value={form.email}
        onChangeText={text => setForm({ ...form, email: text })}
      />
      <Text>Password</Text>
      <TextInput
        secureTextEntry
        value={form.password}
        onChangeText={text => setForm({ ...form, password: text })}
      />
      <Button
        title={loading ? 'Registering...' : 'Register'}
        onPress={handleSubmit}
      />
      <Button
        title="Back to Login"
        onPress={() => navigation.navigate('Login')}
      />
    </View>
  );
};

export default RegisterScreen;
