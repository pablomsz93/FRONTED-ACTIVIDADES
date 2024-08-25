import { useEffect, useState } from "react";
import "./ActivityById.css";
import { createAppointment, getActivityById } from "../../services/apiCalls";
import { useLocation, useNavigate } from "react-router-dom";
import { CustomInput } from "../../common/CustomInput/CustomInput";
import { Button } from "@mui/material";
import { useSelector } from "react-redux";
import { userData } from "../userSlice";
import dayjs from "dayjs";
import { validator } from "../../services/userful";
import { jwtDecode } from "jwt-decode";
import { CustomAlert } from "../../common/Alert/Alert";

export const ActivityById = () => {
  const navigate = useNavigate();

  const location = useLocation();
  const { activityId, date } = location.state || {};

  const rdxToken = useSelector(userData);
  const [is_active, setIsActive] = useState(false);

  const [activityDetails, setActivityDetails] = useState(null);

  const [dateAppointments, setDateAppointments] = useState({
    date: date ? date : "",
    participants: "",
    accept_requirements: true,
  });

  console.log(dateAppointments, "esre es el date");

  const [dateAppointmentsError, setDateAppointmentsError] = useState({
    dateError: "",
    participantsError: "",
    accept_requirementsError: "",
  });

  const functionHandler = (e) => {
    setDateAppointments((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const errorCheck = (e) => {
    let error = "";
    error = validator(e.target.name, e.target.value);
    setDateAppointmentsError((prevState) => ({
      ...prevState,
      [e.target.name + "Error"]: error,
    }));
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

  useEffect(() => {
    const fetchActivityDetails = async () => {
      try {
        const response = await getActivityById(activityId);
        const data = response.data;
        console.log(response, "soy activityDetails");

        if (data) {
          setActivityDetails(data);
        } else {
          console.error("La respuesta de la API no tiene el formato esperado");
        }

        if (rdxToken.credentials !== "") {
          const token = rdxToken.credentials?.token;
          const decoredToken = jwtDecode(token);
          const activeStatus = decoredToken.is_active;
          setIsActive(activeStatus);
        } else {
          console.log("No se encontró token");
        }
      } catch (error) {
        console.error("Error al obtener los detalles de la actividad", error);
      }
    };

    fetchActivityDetails();
  }, [activityId, rdxToken.credentials]);

  const checkAvailability = async () => {
    try {
      const formatDate = dayjs(dateAppointments.date).toISOString();
      console.log(formatDate, "soy formate");
      const body = {
        activity: activityId,
        participants: dateAppointments.participants,
        date_activity: formatDate,
        accept_requirements: dateAppointments.accept_requirements,
      };

      const token = rdxToken.credentials.token;

      const newAppointment = await createAppointment(body, token);
      if (newAppointment) {
        navigate("/reservas");
        console.log("se ha creado la cita");
      }
    } catch (error) {
              if (error.response.status !== 200) {
            alertHandler({
              show: true,
              title: "error",
              message: `Error al consultar la disponibilidad`,
            });
            setTimeout(handleAlertClose, 3000);
          }
    }
  };

  return (
    <div className="activityDesign">
      <CustomAlert
        className={alertClasses}
        type={alert.title}
        content={alert.message}
        showAlert={alert.show}
      />
      <div className="containActivityDesign">
        {activityDetails ? (
          <h1>{activityDetails.data.activity.title}</h1>
        ) : null}
        {rdxToken.credentials !== "" && is_active ? (
          <div className="detailsAppointmentActivity">
            <CustomInput
              design={"inputDesign"}
              type={"datetime-local"}
              name={"date"}
              value={dateAppointments.date}
              functionProp={functionHandler}
              functionBlur={errorCheck}
              helperText={dateAppointmentsError.dateError}
            />
            <CustomInput
              required
              label={"Número de participantes"}
              design={"inputDesign"}
              type={"number"}
              name={"participants"}
              value={""}
              min={1}
              max={12}
              functionProp={functionHandler}
              functionBlur={errorCheck}
              helperText={dateAppointmentsError.participantsError}
            />
            <div className="conditionsAppointment">
            <Button
              variant="contained"
              className="buttonSend"
              onClick={checkAvailability}
              style={{ textTransform: "none", fontFamily: "" }}
            >
              Reservar
            </Button>
            ** Al realizar la reserva, aceptas los términos y condiciones.
            </div>
          </div>
        ) : (
          <div>
            <Button
              variant="contained"
              className="buttonSend"
              onClick={() => navigate("/login")}
              style={{ textTransform: "none", fontFamily: "" }}
            >
              Comprobar disponibilidad
            </Button>
          </div>
        )}

        {activityDetails ? (
          <>
            <div className="descriptionActivity">
              <h3>{activityDetails.data.activity.title} al detalle</h3>
              <p>{activityDetails.data.activity.description}</p>
            </div>
            {activityDetails.data.activityDetails.length === 0 ? (
              <h1>Ponte en contacto con nosotros para más información</h1>
            ) : (
              <p>Hola, soy details, encantada</p>
            )}
          </>
        ) : (
          <p>Cargando detalles de la actividad...</p>
        )}
      </div>
    </div>
  );
};
