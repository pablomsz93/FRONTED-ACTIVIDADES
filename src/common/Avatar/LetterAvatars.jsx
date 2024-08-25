import './LetterAvatars.css'; // Archivo de estilos CSS

const LetterAvatars = ({ initial }) => {
  return (
    <div className="letter-avatars-container">
      <div className="letter-avatar">{initial}</div>
    </div>
  );
};

export default LetterAvatars;