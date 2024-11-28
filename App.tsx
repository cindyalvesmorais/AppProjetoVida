import './gesture-handler';
import { StyleSheet, Text, View } from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import Routes from './src/routes/index.routes';
import { UserProvider } from "./src/context/userContext";

export default function App() {
  return (
    <UserProvider>
      <NavigationContainer>
        <Routes />
      </NavigationContainer>
    </UserProvider>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
});
