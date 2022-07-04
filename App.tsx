import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import Settings from './src/pages/Settings';
import Orders from './src/pages/Orders';
import Delivery from './src/pages/Delivery';
import {useState} from 'react';
import SignIn from './src/pages/SignIn';
import SignUp from './src/pages/SignUp';
import store from './src/store';
import { Provider, useSelector } from 'react-redux';
import { RootState } from './src/store/reducer';
import AppInner from './AppInner';



function App() {
  // const [isLoggedIn, setLoggedIn] = useState(false);
  
  return (
    <Provider store={store}>
      <AppInner></AppInner>
    </Provider>
  );
}

export default App;