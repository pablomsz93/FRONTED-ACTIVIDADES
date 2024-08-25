import "./Login.css";
import letterLogo from "../../img/Letras.png";

import { CustomInput } from "../../common/CustomInput/CustomInput";
import { useEffect, useState } from "react";
import { Button, Divider } from "@mui/material";
import { validator } from "../../services/userful";
import { loginUser } from "../../services/apiCalls";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login, userData } from "../userSlice";
import { CustomAlert } from "../../common/Alert/Alert";

export const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const rdxCredentials = useSelector(userData);

  // Declaramos las credenciales que vamos a solicitar para poder realizar el login.
  const [credenciales, setCredenciales] = useState({
    email: "",
    password: "",
  });

  const [credencialesError, setCredencialesError] = useState({
    emailError: null,
    passwordError: null,
  });

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


  const functionHandler = (e) => {
    setCredenciales((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const errorCheck = (e) => {
    let error = "";
    error = validator(e.target.name, e.target.value);
    setCredencialesError((prevState) => ({
      ...prevState,
      [e.target.name + "Error"]: error,
    }));
  };


  useEffect(() => {
    if (rdxCredentials?.credentials.token) {
      //Si ya contamos con un token, redirigimos al usuario a inicio.
      navigate("/perfil")
    }

  });

  //Declaramos la constante logMe para que, en caso de logearnos guarde el token y nos envíe al profile y por el contrario, nos muestre el error que nos impide hacerlo.
  const logMe =  () => {
    if (credenciales.email != "" && credenciales.password != "" && credencialesError.emailError == "" && credencialesError.passwordError == "") {
      loginUser(credenciales)
        .then((resultado) => {
          //Si nos logeamos, aparecerá el mensaje
          alertHandler({
                show: true,
                title: `success`,
                message: `${resultado.data.message}`,
              },
            )
          setTimeout(() => {
            dispatch(login({ credentials: resultado.data }));
            navigate("/reservas");
          }, 2000);
        })
        .catch((error) => {
          if (error.response.status !== 200) {
            setTimeout(
              alertHandler({
                show: true,
                title: `error`,
                message: `${error.response.data.message}`,
              },
            ), 100),       
            setTimeout(handleAlertClose, 2000);
          }
        });
    } 
    setTimeout(
      alertHandler({
        show: true,
        title: `warning`,
        message: "Introduce el usuario y contraseña, valida los campos.",
      },
    ), 100),       
    setTimeout(handleAlertClose, 2000);
  };

  //Declaramos esta constante, para que, en caso de pulsar sobre el botón que contiene "Crea tu cuenta", nos rediriga a registro.
  const registerMe = () => {
      navigate("/registro");
  };

  return (
    <div className="loginDesign">
      <CustomAlert
      className ={alertClasses}
        type={alert.title}
        content={alert.message}
        showAlert={alert.show}
      />
      <div className="contentLogin">
        <div className="headerLogo">
          <img src={letterLogo} alt="Logo" style={{ height: "4.1em" }} />
        </div>
        <div className="titleLogin">Inicia sesión</div>
        <div className="elementsLogin">
          <CustomInput
            required
            className="inputRegister"
            label={"Dirección de e-mail"}
            design={"inputDesign"}
            type={"email"}
            name={"email"}
            placeholder={""}
            value={""}
            maxLength={"50"}
            fullWidth
            functionProp={functionHandler}
            functionBlur={errorCheck}
            helperText={credencialesError.emailError}
          />
          <CustomInput
            required
            className="inputRegister"
            label={"Contraseña"}
            design={"inputDesign"}
            type={"password"}
            name={"password"}
            placeholder={""}
            value={""}
            maxLength={"12"}
            fullWidth
            functionProp={functionHandler}
            functionBlur={errorCheck}
            helperText={credencialesError.passwordError}
          />
        </div>
        <div className="loginButton">
          <Button
            variant="contained"
            className="buttonSend"
            onClick={logMe}
            style={{ textTransform: "none", fontFamily: "" }}
          >
            Iniciar sesión
          </Button>
        </div>
        <div className="registerAccount">
          <Divider>¿Eres nuevo?</Divider>

          <Button
            variant="contained"
            className="buttonSend"
            onClick={registerMe}
            style={{ textTransform: "none", fontFamily: "" }}
          >
            Crea tu cuenta
          </Button>
        </div>
      </div>
    </div>
  );
};
