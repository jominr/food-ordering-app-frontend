import { Link } from 'react-router-dom';
import UsernameMenu from './UsernameMenu';
import { Button } from './ui/button';
import { useAuth0 } from '@auth0/auth0-react';

const MainNav = () => {
  // this is a hook that auth0 gives us access to lots of nice things. 
  const { loginWithRedirect, isAuthenticated } = useAuth0();
  
  return (
    <span className="flex space-x-2 items-center">
      { isAuthenticated ? (
        <>
          <Link to="/order-status" className="font-bold hover:text-orange-500">
            Order Status
          </Link>
          <UsernameMenu />
        </>
        
      ) : (
      /* 变体=幽灵:removes most of the Styles */
        <Button
          variant="ghost"
          className='font-bold hover:text-orange-500 hover:bg-white'
          // 这里写着aync await, MobileNav里没写。
          onClick={async () => await loginWithRedirect()}
        >
          Log In

        </Button> 
      )}
    </span>
  );
};

export default MainNav;