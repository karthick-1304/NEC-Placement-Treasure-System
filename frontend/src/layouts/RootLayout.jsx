import { Outlet } from 'react-router-dom';
import Header from '../components/common/Header.jsx';

export default function RootLayout() {
  return (
    <div className="min-h-screen bg-dark-950 flex flex-col">
      <Header />
      <main className="flex-1 pt-16">
        <Outlet />
      </main>
    </div>
  );
}