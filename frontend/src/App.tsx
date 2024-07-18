import './App.css';
import { useAuth } from './auth/AuthProvider';
import SideBar from './components/SideBar';
import { AppRouter } from './router/AppRouter';

function App() {
  const { isUserDataLoaded, isAuthenticated } = useAuth();
  if (!isUserDataLoaded && isAuthenticated ) {
    return (
      <div className='flex space-x-2 justify-center items-center bg-slate-100 h-screen'>
        <div className='h-8 w-8 bg-slate-700 rounded-full animate-bounce [animation-delay:-0.3s]'></div>
        <div className='h-8 w-8 bg-slate-700 rounded-full animate-bounce [animation-delay:-0.15s]'></div>
        <div className='h-8 w-8 bg-slate-700 rounded-full animate-bounce'></div>
      </div>
    );
  }

  return (
    <>
      <div className="flex bg-slate-100 text-slate-900">
        <SideBar />
        <div className='lg:mt-0 mt-14 flex w-full h-full justify-center fade-in'>
          <AppRouter />
        </div>
      </div>
    </>
  );
}

export default App;
