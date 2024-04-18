import { BrowserRouter } from 'react-router-dom';
import Router from '@/Router';
import { AuthenticationProvider } from '@/core/authentication/Provider';

function App() {
  return (
    <AuthenticationProvider>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </AuthenticationProvider>
  );
}

export default App;
