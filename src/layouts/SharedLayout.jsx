import { Outlet, useParams } from 'react-router-dom';
import Navbar from '../components/shared/Navbar.jsx';

const SharedLayout = () => {
  const { role, id } = useParams();

  return (
    <div>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default SharedLayout;
