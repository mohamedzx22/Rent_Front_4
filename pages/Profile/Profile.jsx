import { useParams, Navigate } from 'react-router-dom';
import { getUserRole } from '../../services/auth';

const Profile = () => {
  const { userType } = useParams();
  const currentRole = getUserRole()?.toLowerCase();

  // If no userType parameter, redirect to correct dashboard
  if (!userType) {
    return <Navigate to={`/${currentRole}`} replace />;
  }

  // Verify that userType matches the actual user role
  if (userType !== currentRole) {
    return <Navigate to={`/${currentRole}`} replace />;
  }

  // Display profile page if everything matches
  return <div>Profile page for {userType}</div>;
};

export default Profile;