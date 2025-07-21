import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { useMutation } from '@apollo/client';
import { LOGIN } from '../../graphql/auth.graphql';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../store/slices/authSlice';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/AuthStack';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

const LoginScreen = ({ navigation }: Props) => {
  const dispatch = useDispatch();

  const [form, setForm] = useState({ email: '', password: '' });

  const [login, { loading }] = useMutation(LOGIN, {
    onCompleted: ({ login }) => {
      dispatch(setCredentials(login));
    },
    onError: err => {
      Alert.alert('Login Failed', err.message);
    },
  });

  const handleSubmit = () => {
    if (!form.email || !form.password) return;

    login({
      variables: {
        input: form,
      },
    });
  };

  return (
    <View>
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
        title={loading ? 'Logging in...' : 'Login'}
        onPress={handleSubmit}
      />
      <Button
        title="Go to Register"
        onPress={() => navigation.navigate('Register')}
      />
    </View>
  );
};

export default LoginScreen;
