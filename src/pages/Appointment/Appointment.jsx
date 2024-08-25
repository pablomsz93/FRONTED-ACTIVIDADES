import { Button } from "@mui/material";
import "./Appointment.css";
import { useNavigate } from "react-router-dom";
import { userData } from "../userSlice";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useSelector } from "react-redux";
import {
  getAllApointments,
  getAppointmentByUser,
} from "../../services/apiCalls";
import { TabBar } from "../../common/CustomTabs/CustomTabs";
import CardAppointments from "../../common/CardAppointments/CardAppointments";
import Modal from "../../common/Modal/Modal";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { CustomAlert } from "../../common/Alert/Alert";

export const Appointment = () => {
  const navigate = useNavigate();
  const rdxToken = useSelector(userData);

  const newAppointment = () => {
    setTimeout(() => {
      navigate("/actividad");
    }, 200);
  };

  const [tabValue1, setTabValue] = useState("null");
  const [appointments, setAppointments] = useState([]);
  const [msgError] = useState("");
  const [allAppointments, setAllAppointments] = useState([]);
  const [uniqueActivities, setUniqueActivities] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState(null);

  //Paginación
  //Paginación, aquí lo que hacemos es seguir el elemento para saber cual tengo que mostrar
  const [currentPage, setCurrentPage] = useState(1);
  const citasPorPagina = 6;

  // Calcular el índice del primer y último appointment
  const lastAppointment = currentPage * citasPorPagina;
  const firstAppointment = lastAppointment - citasPorPagina;
  const citasActuales = appointments.slice(firstAppointment, lastAppointment);

  // Función para manejar el cambio de página
  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (appointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedAppointment(null);
    setIsModalOpen(false);
  };

  //Alert
  const [alert, setAlert] = useState({
    show: false,
    title: "",
    message: "",
  });

  const alertHandler = (e) => {
    setAlert(e);
  };

  const handleAlertClose = () => {
    setAlert({
      show: false,
      title: "",
      message: "",
    });
  };

  const alertClasses = alert.show ? "alert show" : "alert";


  const customTabs1 = [
    { label: "Todos", value: "null" },
    { label: "Aprobadas", value: "approved" },
    { label: "Pendientes", value: "pending" },
    { label: "Canceladas", value: "canceled" },
    { label: "Finalizadas", value: "made" },
  ];

  const handlerTab1 = (event, newValue) => {
    console.log(newValue, "soy value???");
    setTabValue(newValue);

    if (newValue === "null") {
      const orderAllAppointments = allAppointments.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      setAppointments(orderAllAppointments);
      return;
    }

    const filterAppointments = allAppointments.filter(
      (appointment) => appointment.status_appointment === newValue
    );
    console.log(newValue, "soy new");
    const orderFilterAppointment = filterAppointments.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    setAppointments(orderFilterAppointment);
  };

  const filterAppointmentsByActivity = (activity) => {
    if (!activity) {
      setAppointments(allAppointments);
      return;
    }
    const filteredAppointments = allAppointments.filter(
      (appointment) => appointment.activity_name === activity
    );

    const orderedAppointments = filteredAppointments.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    setAppointments(orderedAppointments);
  };

  useEffect(() => {
    const infoAppointment = async () => {
      try {
        if (rdxToken.credentials !== "") {
          const token = rdxToken.credentials.token;
          const decoredToken = jwtDecode(token);
          console.log(decoredToken, "soy el token");
          let appointmentsByRole;
          console.log(
            "Valor inicial de appointmentsByRole:",
            appointmentsByRole
          );
          if (decoredToken.role == "super_admin") {
            console.log("soy superAdmin");
            if (decoredToken.user_token == "") {
              const appointmentSuper = await getAllApointments(token);
              appointmentsByRole = appointmentSuper.data;
              console.log("soy appo de super", appointmentSuper.data);
            } else {
              console.log("no tengo el role de usuario vacio");
              const appointmentSuper = await getAppointmentByUser(token);
              console.log(appointmentSuper, "es esta la cita");
              appointmentsByRole = appointmentSuper;
              console.log(appointmentsByRole, "continuo teniendo aqui la cita");
            }
          } else {
            appointmentsByRole = await getAppointmentByUser(token);
            console.log("soy appo de NO super", appointmentsByRole);
          }

          if (Array.isArray(appointmentsByRole.data)) {
            console.log("aqui entra, paso 1");
            const allAppointments = appointmentsByRole.data;

            const orderAppointment = allAppointments.sort(
              (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
            );
            setAllAppointments(orderAppointment);
            setAppointments(orderAppointment);

            // Obtener los nombres únicos de las actividades
            const uniqueActivityNames = [
              ...new Set(
                allAppointments.map((appointment) => appointment.activity_name)
              ),
            ];

            // Actualizar el estado de uniqueActivities 
            setUniqueActivities(uniqueActivityNames);
            if (selectedActivity) {
              // Si hay una actividad seleccionada, filtrar y paginar por esa actividad
              filterAppointmentsByActivity(selectedActivity);

            } else {
              // Si no hay actividad seleccionada, paginar las citas actuales
              const citasActuales = allAppointments.slice(
                firstAppointment,
                lastAppointment
              );
              setAppointments(citasActuales);
            }
          } else {
            console.log("No tienes citas agendadas");
          }
        } else {
          navigate("/");
        }
      } catch (error) {
        if (error.response && error.response.data) {
          alertHandler({
            show: true,
            title: "error",
            message: error.response.data,
          });
          setTimeout(handleAlertClose, 3000);
        } else {
          console.log("Hubo un error al cargar las citas.", error);
        }
      }
    };
    setTabValue("null");
    infoAppointment();
    console.log("Selected Activity:", selectedActivity);
    console.log("Appointments:", appointments);
  }, [rdxToken, selectedActivity, isModalOpen]);

  return (
    <div className="AppointmentDesign">
      <CustomAlert
        className={alertClasses}
        type={alert.title}
        content={alert.message}
        showAlert={alert.show}
      />
      <div className="containerAppointment">
        <div className="newAppointmentButton">
          {rdxToken.credentials.token &&
         ( jwtDecode(rdxToken.credentials.token).user_token == "" || jwtDecode(rdxToken.credentials.token).user_token.id == jwtDecode(rdxToken.credentials.token).id )  ? (
            <Button
              variant="contained"
              className="buttonSend"
              onClick={newAppointment}
              style={{ textTransform: "none", fontFamily: "" }}
            >
              Nueva Reserva
            </Button>
          ) : null}
        </div>
        <div className="inforAppointment">
          <div className="select-activity">
            <div className="titleSelectorActivity">Filtra por actividad:</div>
            <div className="selectorActivity">
              {uniqueActivities.length > 0 && (
                <select
                  value={selectedActivity || ""}
                  onChange={(e) => {
                    setSelectedActivity(e.target.value || null);
                    filterAppointmentsByActivity(e.target.value);
                  }}
                >
                  <option value="">Selecciona una actividad</option>
                  {uniqueActivities.map((activity) => (
                    <option key={activity} value={activity}>
                      {activity}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
          <>
            <div className="tabAppointment">
              <TabBar
                tabs={customTabs1}
                value={tabValue1}
                handler={handlerTab1}
              />
            </div>
            {citasActuales.length > 0 ? (
              <div className="appointment-filtered">
                {citasActuales.map((appointment) => {
                  return (
                    <CardAppointments
                      key={appointment.id}
                      id={appointment.id}
                      activity_name={appointment.activity_name}
                      date={appointment.date}
                      participants={appointment.participants}
                      price={appointment.price}
                      status_appointment={appointment.status_appointment}
                      is_active={appointment.is_active}
                      handleOpenModal={handleOpenModal}
                    />
                  );
                })}
              </div>
            ) : (
              <div>{msgError}</div>
            )}
          </>
        </div>
        {citasActuales.length !== 0 ? (
           <div className="paginationAppointments">
           <Stack spacing={2} className="pagination">
             <Pagination
               count={Math.ceil(appointments.length / citasPorPagina)}
               page={currentPage}
               onChange={handlePageChange}
             />
           </Stack>
         </div>
        ): null}
       
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        appointment={selectedAppointment}
      />
    </div>
  );
};
