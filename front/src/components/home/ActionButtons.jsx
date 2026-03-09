import './ActionButtons.css';
import { useAppText } from '../../utils/i18n';

function ActionButtons() {
  const { text } = useAppText();

  return (
    <div className="action-buttons">
      <button className="action-btn">{text.header.tests}</button>
    </div>
  );
}

export default ActionButtons;
