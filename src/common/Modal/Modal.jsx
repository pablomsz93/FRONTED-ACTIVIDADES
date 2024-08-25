import "./Modal.css";
import { updateAppointment } from "../../services/apiCalls";
import { useSelector } from "react-redux";
import { userData } from "../../pages/userSlice";
import { CustomInput } from "../CustomInput/CustomInput";
import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { validator } from "../../services/userful";
import { CustomAlert } from "../Alert/Alert";

const Modal = ({ isOpen, onClose, appointment }) => {
  const rdxToken = useSelector(userData);

  const navigate = useNavigate();
  const [total, setTotal] = useState(0);

  const { id, activity_name, date, participants, price, status_appointment } =
    appointment || {};

  const [appointmentData, setAppointmentData] = useState({
    date: "",
    participants: "",
    price: 0,
  });

  //Validación de errores
  const [appointmentDataError, setAppointmentDataError] = useState({
    dateError: "",
    participantsError: "",
  });

  const errorCheck = (e) => {
    let error = "";
    error = validator(e.target.name, e.target.value);
    setAppointmentDataError((prevState) => ({
      ...prevState,
      [e.target.name + "Error"]: error,
    }));
  };

  const [isEnabled, setIsEnabled] = useState(false);

  const functionHandler = (e) => {
    setAppointmentData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
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
    setAppointmentData({
      date: date ? dayjs(date).format("YYYY-MM-DDTHH:mm") : "",
      participants,
      price,
    });
    const calculateTotal = () => {
      setTotal(participants * price);
    };

    calculateTotal();
  }, [appointment]);

  const sendData = async () => {
    try {
      // Verifica si la fecha está vacía
      if (!appointmentData.date) {
        alertHandler({
          show: true,
          title: "error",
          message: `Fecha vacía.`,
        });
        setTimeout(handleAlertClose, 3000);
        return;
      }

      // Verifica si el número de participantes está vacío
      if (!appointmentData.participants) {
        alertHandler({
          show: true,
          title: "error",
          message: `Debes de indicar el número de participantes.`,
        });
        setTimeout(handleAlertClose, 3000);
        return;
      }

      const token = rdxToken.credentials.token;

      const newAppointment = await updateAppointment(
        {
          id,
          date: appointmentData.date,
          participants: appointmentData.participants,
        },
        token
      );
      if (newAppointment) {
        alertHandler({
          show: true,
          title: "success",
          message: `Enhorabuena, se han realizado los cambios.`,
        });
        setTimeout(handleAlertClose, 3000);
        navigate("/reservas");
      }
    } catch (error) {
      alertHandler({
        show: true,
        title: "error",
        message: `Error, cambios no efectuados.`,
      });
      setTimeout(handleAlertClose, 3000);
    } finally {
      setIsEnabled(false);
    }
  };

  const modifyAppointment = () => {
    const dateAppointment = dayjs(date);
    const dateNow = dayjs();
    const diferenciaDias = dateAppointment.diff(dateNow, "days");
    if (
      status_appointment === "pending" ||
      (status_appointment == "approved" && diferenciaDias >= 10)
    ) {
      return (
        <div className="buttonModal">
          <button
            className="cancel-Appointment"
            onClick={() => cancelAppointment(id)}
          >
            Cancelar Reserva
          </button>

          {isEnabled ? (
            <Button
              variant="contained"
              className="button"
              onClick={() => sendData()}
              style={{ textTransform: "none", fontFamily: "" }}
            >
              Enviar datos
            </Button>
          ) : (
            <Button
              variant="contained"
              className="button"
              onClick={() => setIsEnabled(!isEnabled)}
              style={{ textTransform: "none", fontFamily: "" }}
            >
              Modificar reserva
            </Button>
          )}
        </div>
      );
    } else {
      return null;
    }
  };

  const cancelAppointment = async (id_appointment) => {
    if (rdxToken.credentials !== "" && id_appointment) {
      const token = rdxToken.credentials.token;
      const modify = await updateAppointment(
        {
          id: id_appointment,
          status_appointment: "canceled",
        },
        token
      );
      if (modify) {
        alertHandler({
          show: true,
          title: "success",
          message: `Enhorabuena, reserva modificada.`,
        });
        setTimeout(handleAlertClose, 3000);
      }
    } else navigate("/");
  };

  return (
    <>
      {isOpen && (
        <div className="modal-overlay">
          <CustomAlert
            className={alertClasses}
            type={alert.title}
            content={alert.message}
            showAlert={alert.show}
          />
          <div className="modal-container">
            <div className="modal-header">
              <h3>Detalles de la Cita</h3>
              <button className="modal-close" onClick={onClose}>
                X
              </button>
            </div>
            <div className="modal-content">
              <div className="identification">
                <div className="title-identification">
                  <h4>Identificador de reserva</h4>
                </div>
                <div className="infor-identification">
                  <p>#{id}</p>
                </div>
              </div>
              <div className="activitySelect">
                <h4>Actividad seleccionada: {activity_name}</h4>
              </div>

              <div className="inputsModal">
                <CustomInput
                  disabled={!isEnabled}
                  label={"Fecha"}
                  design={"inputDesign"}
                  type={"datetime-local"}
                  name={"date"}
                  placeholder={""}
                  value={appointmentData.date}
                  functionProp={functionHandler}
                  functionBlur={errorCheck}
                  helperText={appointmentDataError.dateError}
                />
                <CustomInput
                  disabled={!isEnabled}
                  label={"Número de participantes"}
                  design={"inputDesign"}
                  type={"number"}
                  name={"participants"}
                  placeholder={""}
                  value={appointmentData.participants}
                  max={"12"}
                  functionProp={functionHandler}
                  functionBlur={errorCheck}
                  helperText={appointmentDataError.participantsError}
                />
              </div>
              <div className="modalPrice">
                <h4>Precio/participante: {total} €</h4>
              </div>
            </div>
            {modifyAppointment()}
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
