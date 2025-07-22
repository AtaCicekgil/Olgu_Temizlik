import { Link } from 'react-router-dom';
import Title from './Title';

const Header: React.FC = () => {
  return (
    <header>
      <Link to="/" className="flex items-center space-x-2">
        <img
          src="/logo.avif"
          alt="Olgu Temizlik Logo"
          className="h-12 w-12 object-contain"
        />
        <Title>Olgu Temizlik</Title>
      </Link>
    </header>
  );
};

export default Header;