import { useEffect, useState } from "react";
import "./Activity.css";
import { disponibilityDate, getAllActivities } from "../../services/apiCalls";
import { CustomActivity } from "../../common/CustomActivity/CustomActivity";
import { arrayBufferToBase64 } from "../../common/functions";
import { CustomInput } from "../../common/CustomInput/CustomInput";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { userData } from "../userSlice";
import { validator } from "../../services/userful";
import { CustomAlert } from "../../common/Alert/Alert";

export const Activity = () => {
  const navigate = useNavigate();
  // Instanciamos Redux en lectura
  const rdxToken = useSelector(userData);

  const [allActivities, setAllActivities] = useState([]);

  //Recuperamos la fecha
  const [date, setDate] = useState({
    date: "",
  });

  //Validación de errores
  const [dateError, setDateError] = useState({
    dateError: "",
  });

  const errorCheck = (e) => {
    let error = "";
    error = validator(e.target.name, e.target.value);
    setDateError((prevState) => ({
      ...prevState,
      [e.target.name + "Error"]: error,
    }));
  };

  const functionHandler = (e) => {
    setDate((prevState) => ({
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

  const checkAvailability = async () => {
    try {
      console.log(rdxToken);
      if (rdxToken.credentials == "") {
        navigate("/login");
      }

      const token = rdxToken.credentials.token;
      const decoredToken = jwtDecode(token);

      if (!decoredToken.is_active) {
        navigate("/login");
      }

      if (!date.date) {
        setTimeout(
          alertHandler({
            show: true,
            title: `error`,
            message: `Fecha vacía`,
          }),
          100
        ),
          setTimeout(handleAlertClose, 2000);
        return;
      }

      const formatDate = dayjs(date.date).toISOString();

      const body = { date: formatDate };
      const results = await disponibilityDate(body, token);
      const participants = results.data.data;

      if (participants.length > 0) {
        const updatedActivities = allActivities.map((activity) => {
          const participantInfo = participants.find(
            (participant) => participant.id_activity === activity.id
          );

          return {
            ...activity,
            availability: participantInfo ? participantInfo.allParticipants : 0,
          };
        });
        setTimeout(
          alertHandler({
            show: true,
            title: `success`,
            message: `Todas las actividades disponibles.`,
          },
        ), 100)      
        setTimeout(handleAlertClose, 2000);
        setAllActivities(updatedActivities);
      } else {
        setTimeout(
          alertHandler({
            show: true,
            title: `success`,
            message: `Todas las actividades disponibles.`,
          },
        ), 100)  
        setTimeout(handleAlertClose, 2000);
      }
    } catch (error) {
      setTimeout(
        alertHandler({
          show: true,
          title: `error`,
          message: `Error al consultar la disponibilidad.`,
        },
      ), 100),       
      setTimeout(handleAlertClose, 2000);
    }
  };

  const handleReserve = (activityId) => {
    try {
      console.log(activityId, "soy el activityId");
      if (activityId !== isNaN) {
        navigate(`/infor_actividad`, {
          state: { activityId, date: date.date },
        });
      }
    } catch (error) {
      if (error.response.status !== 200) {
        setTimeout(
          alertHandler({
            show: true,
            title: `error`,
            message: `Error al procesar la solicitud.`,
          }),
          100
        ),
          setTimeout(handleAlertClose, 2000);
      }
    }
  };

  const disponibiltyActivity = async () => {
    if (allActivities.length === 0) {
      getAllActivities()
        .then((results) => {
          if (Array.isArray(results.data.data)) {
            const parseImage = results.data.data.map((activity) => {
              return {
                imageBase64: arrayBufferToBase64(activity.image.data),
                ...activity,
              };
            });
            setTimeout(
              alertHandler({
                show: true,
                title: `sucess`,
                message: `${results.data.message}`,
              },
            ), 100),       
            setTimeout(handleAlertClose, 2000);
            setAllActivities(parseImage);
          } else {
            console.error();
          }
        })
        .catch((error) => console.log(error));
    }
  };

  useEffect(() => {
    disponibiltyActivity();
  }, [allActivities]);

  return (
    <div className="activityDesign">
      <CustomAlert
        className={alertClasses}
        type={alert.title}
        content={alert.message}
        showAlert={alert.show}
      />
      <div className="selectDay">
        <CustomInput
          design={"inputDesign"}
          type={"datetime-local"}
          name={"date"}
          placeholder={""}
          value={date.date}
          functionProp={functionHandler}
          functionBlur={errorCheck}
          helperText={dateError.dateError}
        />
        <Button
          variant="contained"
          className="buttonSend"
          onClick={checkAvailability}
          style={{ textTransform: "none", fontFamily: "" }}
        >
          Comprobar disponibilidad
        </Button>
      </div>
      {allActivities.length > 0 ? (
        <div className="activityCard">
          {allActivities.map((results) => {
            return (
              <CustomActivity
                key={results.id}
                image={results.imageBase64}
                title={results.title}
                description={results.description}
                price={results.price}
                availability={results.availability}
                handleReserve={handleReserve}
                id={results.id}
              />
            );
          })}
        </div>
      ) : (
        <div>Esperando las actividades</div>
      )}
    </div>
  );
};
