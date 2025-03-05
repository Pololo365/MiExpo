import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import NetInfo from '@react-native-community/netinfo';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  // Escucha los cambios en la conectividad
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });
    return () => unsubscribe();
  }, []);

  // Cargar la contraseña guardada de forma segura para el usuario
  const loadPassword = async (username) => {
    try {
      const storedPassword = await SecureStore.getItemAsync(username);
      if (storedPassword) {
        setPassword(storedPassword);
        //console.log('Contraseña recuperada:', storedPassword);
      } else {
        setPassword('');
      }
    } catch (error) {
      console.log('Error al cargar la contraseña', error);
    }
  };

  // Actualiza la contraseña cada vez que el nombre de usuario cambia
  useEffect(() => {
    if (username) {
      loadPassword(username);
    } else {
      setPassword('');
    }
  }, [username]);

  // Función para manejar el inicio de sesión
  const handleLogin = async () => {
    try {
      // Aquí podrías también verificar si hay conexión antes de hacer la petición
      if (!isConnected) {
        Alert.alert('Sin conexión', 'No tienes acceso a internet.');
        return;
      }
      // Petición a la API para autenticar al usuario
      const response = await fetch('http://erpcloud.syncsolutions.es:3030/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Éxito', 'Inicio de sesión exitoso', [
          {
            text: 'Guardar contraseña',
            onPress: async () => {
              try {
                await SecureStore.setItemAsync(username, password);
                await SecureStore.setItemAsync('token', data.token);
                navigation.navigate('Home', { message: data.message || 'Bienvenido', token: data.token });
              } catch (error) {
                console.log('Error al guardar las credenciales', error);
              }
            },
          },
          {
            text: 'OK',
            onPress: () => {
              navigation.navigate('Home', { message: data.message || 'Bienvenido', token: data.token });
            },
          },
        ]);
      } else {
        setUsername('');
        setPassword('');
        Alert.alert('Error', data.message || 'Error en el inicio de sesión');
      }
    } catch (error) {
      setUsername('');
      setPassword('');
      console.log('Error de_conexión', error);
      Alert.alert('Error de conexión', error.message || 'Conexión fallida');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      {/* Muestra el estado de la conexión */}
      <Text style={{ fontSize: 20, marginBottom: 10 }}>
        Conexión a internet: {isConnected ? "✅" : "❌"}
      </Text>

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
