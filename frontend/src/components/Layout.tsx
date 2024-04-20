import { Outlet } from 'react-router-dom';

function Layout() {
  return (
    <div className="h-screen w-screen p-5">
      <div></div>
      <Outlet />
    </div>
  );
}

export default Layout;
