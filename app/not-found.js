import Invitation from '../components/Invitation.jsx';

/* A mistyped or extra path (e.g. /index.html from a share sheet) still opens the invitation, never a 404 page. */
export default function NotFound() {
  return <Invitation />;
}
