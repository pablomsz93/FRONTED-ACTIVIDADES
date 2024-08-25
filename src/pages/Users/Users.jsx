import { useEffect, useState } from "react";
import { CardUser } from "../../common/CardUser/CardUser";
import "./Users.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login, userData } from "../userSlice";
import { jwtDecode } from "jwt-decode";
import { getAllUsers, loginSuper } from "../../services/apiCalls";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

export const Users = () => {
  const navigate = useNavigate();
  const rdxToken = useSelector(userData);
  const [users, setUsers] = useState([]);
  const [msgError, setMsgError] = useState("");

  const dispatch = useDispatch();

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 6;

  // Calcular el índice del primer y último usuario
  const lastUser = currentPage * usersPerPage;
  const firstUser = lastUser - usersPerPage;
  const currentUsers = users.slice(firstUser, lastUser);

  // Función para manejar el cambio de página
  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  const handleUserClick = (userId) => {
    const token = rdxToken.credentials.token;
    const body = { "id_user": userId };
    loginSuper(token, body)
      .then((results) => {
        dispatch(login({ credentials: results.data }));
        console.log(results.data);
      })
      .catch((error) => {
        console.error("Error en loginSuper:", error);
      });
  };

  useEffect(() => {
    if (rdxToken.credentials !== "") {
      const token = rdxToken.credentials.token;
      const decoredToken = jwtDecode(token);
      console.log(decoredToken);
      if (decoredToken.role === "super_admin") {
        getAllUsers(token)
          .then((results) => {
            console.log("esto", results.data);
            setUsers(results.data.data);
          })
          .catch((error) => {
            if (error.response && error.response.data) {
              setMsgError(error.response.data);
            } else {
              setMsgError("Hubo un error al cargar los usuarios.");
            }
          });
      } else {
        navigate("/");
      }
    } else {
      navigate("/");
    }
  }, [rdxToken, navigate]);

  return (
    <div className="usersDesign">
      {currentUsers.length > 0 ? (
        <div className="containerUsers">
          {currentUsers.map((user) => (
            <CardUser
              key={user.id}
              name={user.name || ""}
              surname={user.surname || ""}
              role={user.role || ""}
              email={user.email || ""}
              phone={user.phone || ""}
              onUserClick={handleUserClick ? () => handleUserClick(user.id) : undefined}
            />
          ))}
          <div className="paginationUsers">
            <Stack spacing={2} className="pagination">
              <Pagination
                count={Math.ceil(users.length / usersPerPage)}
                page={currentPage}
                onChange={handlePageChange}
              />
            </Stack>
          </div>
        </div>
      ) : (
        <div>{msgError}</div>
      )}
    </div>
  );
};