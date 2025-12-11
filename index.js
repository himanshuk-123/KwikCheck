// index.js — make sure this is the very first import in the app
import 'react-native-gesture-handler';
import { registerRootComponent } from 'expo';
import App from './App';

registerRootComponent(App);
