// Importamos react-native-gesture-handler para que react-navigation funcione correctamente
import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Importamos las pantallas
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import WorkOrdersScreen from './screens/WorkOrdersScreen';
import DetalleOrdenScreen from './screens/DetalleOrdenScreen';

// Creamos una instancia del stack navigator
const Stack = createStackNavigator();

// Componente principal de la aplicación
const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ title: 'Iniciar Sesión' }}
        />
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'Inicio' }}
        />
        <Stack.Screen 
          name="WorkOrders" 
          component={WorkOrdersScreen} 
          options={{ title: 'Órdenes de Trabajo' }}
        />
        <Stack.Screen 
          name="DetalleOrden" 
          component={DetalleOrdenScreen} 
          options={{ title: 'Detalle de Orden' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
