
import { Provider } from 'react-redux';
import { store } from './store/store';
import  AppNavigator from './navigation/index'
export default function App() {
  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
}

