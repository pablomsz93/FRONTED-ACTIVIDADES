import "./CardUser.css"

export const CardUser = ({ id, name, surname, email, phone, role, onUserClick }) => {
    const handleUserClick = () => {
        onUserClick(id);
      };
    
  const inicial = name ? name.charAt(0) : "";
  return (
    <div className="card-user" onClick={handleUserClick}>
      <div className="card-user-header">
        
      <div className="letter-container-user">
      <div className="letter-avatar-user">{inicial}</div>
      </div>
        
      </div>
      <div className="card-user-content">
      <div className="role-box">
        {/* <div className="idUser">
        <p className="card-user-title">
          <strong>Identificador:</strong> {id}
          </p>
        </div> */}
        <div className="roleUSer">
        <p className="card-user-description role"><strong>Rol: </strong> {role}</p>

        </div>
        </div>
        <div className="name">
          <p className="card-user-title">
          <strong>Nombre:</strong> {name} {surname}
          </p>
       
        </div>
        <div className="emailUser">
        <p className="card-user-description"><strong>Email:</strong> {email}</p>
        </div>
        <div className="phoneUser">
        <p className="card-use-description"><strong>Teléfono:</strong> {phone}</p>
        </div>
      </div>
    </div>
  );
};