import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import * as Keychain from 'react-native-keychain';

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const loadCredentials = async () => {
    try {
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        setUsername(credentials.username);
        setPassword(credentials.password);
      }
    } catch (error) {
      console.log('Error al cargar las credenciales', error);
    }
  };

  useEffect(() => {
    loadCredentials();
  }, []);

  const handleLogin = async () => {
    try {
      const response = await fetch('http://erpcloud.syncsolutions.es:3030/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Éxito', `Token: ${data.token}`, [
          {
            text: 'Guardar contraseña',
            onPress: async () => {
              try {
                await Keychain.setGenericPassword(username, password);
                await Keychain.setGenericPassword('token', data.token);
              } catch (error) {
                console.log('Error al guardar las credenciales', error);
              }
            },
          },
          { text: 'OK' },
        ]);
      } else {
        setUsername('');
        setPassword('');
        Alert.alert('Error', data.message || 'Error en el inicio de sesión');
      }
    } catch (error) {
      setUsername('');
      setPassword('');
      Alert.alert('Error', 'Error de conexión');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Nombre de usuario:</Text>
      <TextInput
        value={username}
        onChangeText={setUsername}
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
      />
      <Text>Contraseña:</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
      />
      <Button title="Iniciar sesión" onPress={handleLogin} />
    </View>
  );
};

export default LoginScreen; 