import { useRoutes } from 'react-router-dom';
import { routes } from './routes'; // Using the manually defined routes for now
import DebugInfo from './debug';

// If you have global styles or contexts that don't need router, they can go here
// or in main.tsx

function App() {
  const element = useRoutes(routes);
  
  // Add debug info in development or if there are issues
  const isDev = import.meta.env.DEV;
  
  return (
    <>
      {element}
      {isDev && <DebugInfo />}
    </>
  );
}

export default App;
