import { CustomInput } from "../../common/CustomInput/CustomInput";
import { validator } from "../../services/userful";
import "./Register.css";
import letterLogo from "../../img/Letras.png";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { login, userData } from "../userSlice";
import { createUser } from "../../services/apiCalls";
import { Button } from "@mui/material";
import { CustomAlert } from "../../common/Alert/Alert";

export const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const rdxCredentials = useSelector(userData);

  // Declaramos los datos que vamos a solicitar para poder realizar el register.
  const [registerData, setRegisterData] = useState({
    name: "",
    surname: "",
    phone: 0,
    email: "",
    password: "",
  });

  const [registerDataError, setRegisterDataError] = useState({
    nameError: "",
    surnameError: "",
    phoneError: "",
    emailError: "",
    passwordError: "",
  });

  const functionHandler = (e) => {
    setRegisterData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  //Validacion de errores
  const errorCheck = (e) => {
    let error = "";
    error = validator(e.target.name, e.target.value);
    setRegisterDataError((prevState) => ({
      ...prevState,
      [e.target.name + "Error"]: error,
    }));
  };

  const [hasErrors, setHasErrors] = useState(false);

  const updateErrorState = () => {
    const dataErrorValues = Object.values(registerDataError);
    setHasErrors(dataErrorValues.some((value) => value !== ""));
  };

  useEffect(() => {
    if (rdxCredentials?.credentials.token) {
      navigate("/reservas");
    }
  }, [rdxCredentials?.credentials.token]);

  useEffect(() => {
    updateErrorState();
  }, [registerData, registerDataError]);

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

  //Registrar nuevos usuarios.
  const registerUser = () => {
    // Verificar si hay errores
    if (hasErrors) {
      alertHandler({
        show: true,
        title: "warning",
        message: "Usuario no registrado, valida los campos.",
      });
      setTimeout(handleAlertClose, 2000);
      return;
    }

    const data = {
      ...registerData,
      phone: parseInt(registerData.phone),
    };

    createUser(data)
      .then((resultado) => {
        alertHandler({
          show: true,
          title: `success`,
          message: `${resultado.data.message}`,
        });
        setTimeout(() => {
          dispatch(login({ credentials: resultado.data }));
          navigate("/reservas");
        }, 2000);
      })
      .catch((error) => {
        if (error.response.status !== 200) {
          alertHandler({
            show: true,
            title: "error",
            message: `Usuario no registrado, valida los campos.`,
          });
          setTimeout(handleAlertClose, 3000);
        }
      });
  };

  return (
    <div className="registerDesign">
      <CustomAlert
        className={alertClasses}
        type={alert.title}
        content={alert.message}
        showAlert={alert.show}
      />
      <div className="content">
        <div className="headerLogo">
          <img src={letterLogo} alt="Logo" style={{ height: "4.1em" }} />
        </div>
        <div className="titleRegister">Crear cuenta</div>
        <div className="elementsRegister">
          <CustomInput
            required
            label={"Nombre"}
            design={"inputDesign"}
            type={"text"}
            name={"name"}
            placeholder={""}
            value={""}
            maxLength={"50"}
            fullWidth
            functionProp={functionHandler}
            functionBlur={errorCheck}
            helperText={registerDataError.nameError}
          />
          <CustomInput
            requiered
            label={"Apellidos"}
            design={"inputDesign"}
            type={"text"}
            name={"surname"}
            placeholder={""}
            value={""}
            maxLength={"50"}
            fullWidth
            functionProp={functionHandler}
            functionBlur={errorCheck}
            helperText={registerDataError.surnameError}
          />
          <CustomInput
            required
            label={"Teléfono"}
            design={"inputDesign"}
            type={"tel"}
            name={"phone"}
            placeholder={""}
            min={600000000}
            max={900000000}
            value={""}
            fullWidth
            functionProp={functionHandler}
            functionBlur={errorCheck}
            helperText={registerDataError.phoneError}
          />
          <CustomInput
            required
            label={"Dirección de e-mail"}
            design={"inputDesign"}
            type={"email"}
            name={"email"}
            placeholder={""}
            value={""}
            maxLength={"100"}
            fullWidth
            functionProp={functionHandler}
            functionBlur={errorCheck}
            helperText={registerDataError.emailError}
          />
          <CustomInput
            required
            label={"Password"}
            design={"inputDesign"}
            type={"password"}
            name={"password"}
            placeholder={""}
            value={""}
            maxLength={"12"}
            fullWidth
            functionProp={functionHandler}
            functionBlur={errorCheck}
            helperText={registerDataError.passwordError}
          />
        </div>
        <div className="registerButton">
          <Button
            variant="contained"
            className="buttonSend"
            onClick={registerUser}
            style={{ textTransform: "none", fontFamily: "" }}
          >
            Registarme
          </Button>
        </div>
      </div>
    </div>
  );
};
