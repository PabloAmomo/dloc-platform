import { Navigate, useLocation, useSearchParams } from 'react-router-dom';
import { useUserContext } from 'providers/UserProvider';
import LoadingPage from 'components/LoadingPage/LoadingPage';

const ProtectedRoute = (props: ProtectedRouteProps) => {
  const { children } = props;
  const { isLoggedIn, isAutoLogingIn } = useUserContext();
  const location = useLocation();
  const redirect = 'b64:' + btoa((location?.pathname ?? '/') + (location?.search ?? ''));
 
  if (isAutoLogingIn) return <LoadingPage />;
  else if (!isLoggedIn) return <Navigate to={`/login?redirect=${redirect}`} />;
  else return children;
};

export default ProtectedRoute;

interface ProtectedRouteProps {
  children: any;
}
