import React from 'react';
import { useRoutes } from 'react-router-dom';
import { routes } from './routes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import default CSS for react-toastify

// If you have global styles or contexts that don't need router, they can go here
// or in main.tsx

function App() {
  const element = useRoutes(routes);
  return (
    <>
      {element}
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored" // Or "light", "dark" to match your app theme better
      />
    </>
  );
}

export default App;
