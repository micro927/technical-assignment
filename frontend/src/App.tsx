import { BrowserRouter } from 'react-router-dom';
import Router from '@/Router';
import { AuthenticationProvider } from '@/core/authentication/Provider';
import { ThemeProvider } from './core/theme/Provider';

function App() {
  return (
    <AuthenticationProvider>
      <ThemeProvider>
        <BrowserRouter>
          <Router />
        </BrowserRouter>
      </ThemeProvider>
    </AuthenticationProvider>
  );
}

export default App;
