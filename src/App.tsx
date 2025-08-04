import { useRoutes } from 'react-router-dom';
import { routes } from './routes'; // Using the manually defined routes for now
import SimpleDebugInfo from './debug-simple';

// If you have global styles or contexts that don't need router, they can go here
// or in main.tsx

function App() {
  const element = useRoutes(routes);
  
  // Add debug info only in development
  const isDev = import.meta.env.DEV || import.meta.env.MODE === 'development';
  
  return (
    <>
      {element}
      {isDev && <SimpleDebugInfo />}
    </>
  );
}

export default App;
