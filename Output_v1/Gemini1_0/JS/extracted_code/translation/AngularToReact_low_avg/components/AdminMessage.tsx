import { useSelector } from 'react-redux';
import { AdminPanelState } from '../features/adminPanelSlice';

const AdminMessage = () => {
  const { officialMessage } = useSelector((state: AdminPanelState) => state.adminPanel);

  return (
    <div className="official-message">
      <div className="official-message-content" dangerouslySetInnerHTML={{ __html: officialMessage.message }} />
      <button className="official-message-close" onClick={() => {}}>
        X
      </button>
    </div>
  );
};

export default AdminMessage;