import './App.css';
import Home from './pages/Home';
import { RouterProvider, createBrowserRouter ,Outlet} from "react-router-dom";
import Login from './pages/Login';
import Signup from './pages/Signup';
import {Toaster} from 'react-hot-toast';  
import Header from './components/Header'; 
import { AuthProvider } from './contexts/AuthContext';
import Users from './pages/Users';

// AppLayout Component
const AppLayout = () => {
  return (
    <> 
     <Header/>
      <Outlet /> 
    </>
  );
}

// Setting up the router
const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,  // Parent layout
    children: [ 
      {
        path: '/',
        element: <Home /> 
      } ,
      {
        path : '/users',
        element : <Users/>
       }
      
    ]
  },
   {
    path : '/login',
    element : <Login/>
   } 
   ,{
    path : '/signup' ,
    element : <Signup/>
   } ,

   
]);

// App Component
function App() {
  return (
    <> 
     <Toaster 
     toastOptions={{
      duration : 2000
     }}
     /> 
      <AuthProvider >
      <RouterProvider router={router} />
      </AuthProvider>
    </>
  );
}

export default App;
