import { useRoutes } from 'react-router-dom';
import { routes } from './routes'; // Using the manually defined routes for now

// If you have global styles or contexts that don't need router, they can go here
// or in main.tsx

function App() {
  const element = useRoutes(routes);
  
  return element;
}

export default App;
