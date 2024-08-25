import "./Profile.css";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

import { useNavigate } from "react-router-dom";
import { CustomInput } from "../../common/CustomInput/CustomInput";
import { useDispatch, useSelector } from "react-redux";
import { logout, userData } from "../userSlice";
import { useEffect, useState } from "react";
import {
  deactivateAccount,
  profileUser,
  updatePassword,
  updateUser,
} from "../../services/apiCalls";
import { Button } from "@mui/material";
import { jwtDecode } from "jwt-decode";
import { TabBar } from "../../common/CustomTabs/CustomTabs";
import LetterAvatars from "../../common/Avatar/LetterAvatars";
import { dateFormat } from "../../common/functions";
import { validator } from "../../services/userful";
import { CustomAlert } from "../../common/Alert/Alert";

export const Profile = () => {
  //Declaramos esta constante para que nos permita dirigirnos desde esta vista a otras.
  const navigate = useNavigate();
  // Instanciamos Redux en lectura
  const rdxToken = useSelector(userData);
  const dispatch = useDispatch();

  // Creamos un Hook con las propiedades que queremos mostrar en pantalla del perfil
  const [profile, setProfile] = useState({
    name: "",
    surname: "",
    phone: "",
    email: "",
    is_active: true,
  });

  const [profileError, setProfileError] = useState({
    nameError: "",
    surnameError: "",
    phoneError: "",
    emailError: "",
    is_activeError: "",
  });

  const [newPassword, setNewPassword] = useState({
    passwordOld: "",
    password: "",
  });

  const [newPasswordError, setNewPasswordError] = useState({
    passwordOldError: "",
    passwordError: "",
  });

  const errorProfile = (e) => {
    let error = "";
    error = validator(e.target.name, e.target.value);
    setProfileError((prevState) => ({
      ...prevState,
      [e.target.name + "Error"]: error,
    }));
  };

  const errorPassword = (e) => {
    let error = "";
    error = validator(e.target.name, e.target.value);
    setNewPasswordError((prevState) => ({
      ...prevState,
      [e.target.name + "Error"]: error,
    }));
  };

  const validateError = () => {
    return Object.values(profileError).some((value) => value !== "");
  }

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

  const [isEnabled, setIsEnabled] = useState(true);

  const [originalProfile, setOriginalProfile] = useState(false);

  const functionHandler = (e) => {
    setProfile((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const functionHandlerPassword = (e) => {
    setNewPassword((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const Update = () => {
    if (
      newPassword.password.trim() !== "" &&
      newPassword.passwordOld.trim() !== "" &&
      newPassword.password.trim() !== newPassword.passwordOld.trim()
    ) {
      const token = rdxToken.credentials.token;
      updatePassword(token, newPassword)
        .then((resultado) => {
          alertHandler({
            show: true,
            title: `success`,
            message: `${resultado.data.message}`,
          });
          setTimeout(() => {
            dispatch(logout({ credentials: "" }));
            navigate("/");
          }, 2000);
        })
        .catch((error) => {
          if (error.response.status !== 200) {
            alertHandler({
              show: true,
              title: "error",
              message: `Usuario no actualizado.`,
            });
            setTimeout(handleAlertClose, 3000);
          }
        });
    } else {
      alertHandler({
        show: true,
        title: "warning",
        message: "Contraseña no modificada.",
      });
      setTimeout(handleAlertClose, 2000);
    }
  };

  const profileChange = () => {
    return (
      profile.name !== originalProfile.name ||
      profile.surname !== originalProfile.surname ||
      profile.phone !== originalProfile.phone ||
      profile.email !== originalProfile.email
    );
  };

  const [tabValue, setTabValue] = useState("null");

  const customTabs = [
    { icon: <AccountCircleIcon />, label: "Perfil", value: "null" },
    { icon: <VpnKeyIcon />, label: "Seguridad", value: "cuenta" },
  ];

  const handlerTab = (event, newValue) => {
    setTabValue(newValue);
    if (newValue === "null") {
      return;
    } else {
      newValue === "cuenta";
      return;
    }
  };

  const passwordPattern = "^[a-zA-Z0-9áéíóúüñÁÉÍÓÚÜÑ]+$";

  useEffect(() => {
    if (rdxToken.credentials !== "") {
      const token = rdxToken.credentials.token;
      const decoredToken = jwtDecode(token);
      profileUser(token)
        .then((results) => {
          results.data.data.created_at = dateFormat(
            results.data.data.created_at
          );
          setProfile(results.data.data);
          setOriginalProfile(results.data.data);
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
      if (decoredToken.is_active !== true) {
        navigate("/");
      }
    } else {
      //Si no contamos con un token almacenado en Redux, redirigimos al usuario a inicio.
      navigate("/");
    }
  }, [rdxToken]);

  const sendData = async () => {
    const err = validateError()
    if (profileChange() && !err) {
      await updateUser(rdxToken.credentials.token, profile)
        .then(() => {
          setOriginalProfile(profile);
          alertHandler({
            show: true,
            title: `success`,
            message: `Enhorabuena, ${profile.name}, los cambios se han realizado con éxito.`,
          },
        )
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
      setTimeout(() => {
        setIsEnabled(true);
      }, 1000);
    } else {
        setTimeout(
          alertHandler({
            show: true,
            title: `error`,
            message: `${profile.name}, no se han actualizado los campos.`,
          },
        ), 100),       
        setTimeout(handleAlertClose, 2000);
        setProfile(originalProfile);
      profileChange(false);
    }
    setIsEnabled(true);
  };

  const sendAccount = async () => {
    if (profile.is_active === true) {
      try {
        await deactivateAccount(rdxToken.credentials.token, {
          is_active: "false",
        });
          
           alertHandler({
            show: true,
            title: `success`,
            message: `Enhorabuena, ${profile.name}, los cambios se han realizado con éxito.`,
          },
        )
      setTimeout(() => {
        dispatch(logout({ credentials: "" }));
        navigate("/");
      }, 2000);
      } catch (error) {
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
        }
    }
  };

  return (
    <div className="profileDesign">
      <CustomAlert
        className={alertClasses}
        type={alert.title}
        content={alert.message}
        showAlert={alert.show}
      />
      <div className="contentProfile">
        <div className="summaryProfile">
          <div className="infoCabecera">
            <div className="nameUser">
              <p className="nameProfile">
                <strong>
                  {profile.name} {profile.surname}
                </strong>
              </p>
            </div>
            <div className="roleUser">
              <strong>{profile.role}</strong>: {profile.email}
            </div>
            <div className="avatarUser">
              <LetterAvatars
                className="letterInProfile"
                initial={profile.name.charAt(0)}
              />
            </div>

            {rdxToken.credentials.token &&
            jwtDecode(rdxToken.credentials.token).role == "super_admin" ? (
              <div className="panelAdministracion">
                <Button
                  variant="contained"
                  className="button"
                  onClick={() => navigate("/usuarios")}
                  style={{ textTransform: "none", fontFamily: "" }}
                >
                  Panel de administración
                </Button>
              </div>
            ) : null}
            <div className="userSince">
              Miembro desde: <strong>{profile.created_at}</strong>
            </div>
          </div>
        </div>

        <div className="inforProfile">
          <TabBar tabs={customTabs} value={tabValue} handler={handlerTab} />
          {tabValue === "null" && (
            <div className="inforUser">
              <div className="titleProfile">Información básica</div>
              <div className="fieldsProfile">
                <CustomInput
                  disabled={isEnabled}
                  label={"Nombre"}
                  design={"inputDesign"}
                  type={"text"}
                  name={"name"}
                  placeholder={""}
                  value={profile.name}
                  maxLength={"25"}
                  functionProp={functionHandler}
                  functionBlur={errorProfile}
                  helperText={profileError.nameError}
                />
                <CustomInput
                  disabled={isEnabled}
                  label={"Apellidos"}
                  design={"inputDesign"}
                  type={"text"}
                  name={"surname"}
                  placeholder={""}
                  maxLength={"25"}
                  value={profile.surname}
                  functionProp={functionHandler}
                  functionBlur={errorProfile}
                  helperText={profileError.surnameError}
                />
              </div>
              <div className="titleProfile">Información de contacto</div>
              <div className="fieldsProfile">
                <CustomInput
                  disabled={isEnabled}
                  label={"Dirección de email"}
                  design={"inputDesign"}
                  type={"email"}
                  name={"email"}
                  placeholder={""}
                  maxLength={"50"}
                  value={profile.email}
                  functionProp={functionHandler}
                  functionBlur={errorProfile}
                  helperText={profileError.emailError}
                />
                <CustomInput
                  disabled={isEnabled}
                  label={"Dirección de email"}
                  design={"inputDesign"}
                  type={"tel"}
                  name={"phone"}
                  placeholder={""}
                  min={600000000}
                  max={900000000}
                  value={profile.phone || ""}
                  functionProp={functionHandler}
                  functionBlur={errorProfile}
                  helperText={profileError.emailError}
                />
              </div>
              {isEnabled ? (
                <Button
                  variant="contained"
                  className="button"
                  onClick={() => setIsEnabled(!isEnabled)}
                  style={{ textTransform: "none", fontFamily: "" }}
                >
                  Edita tus datos
                </Button>
              ) : (
                <Button
                  variant="contained"
                  className="button"
                  onClick={() => sendData()}
                  style={{ textTransform: "none", fontFamily: "" }}
                >
                  Enviar cambios
                </Button>
              )}
            </div>
          )}
          {tabValue === "cuenta" && (
            <div className="inforUser">
              <div className="titleProfile">Modificar contraseña</div>
              <div className="passwordContent">
                <CustomInput
                  label={"Contraseña actual"}
                  design={"inputDesign"}
                  type={"password"}
                  name={"passwordOld"}
                  placeholder={""}
                  value={""}
                  maxLength={"12"}
                  functionProp={functionHandlerPassword}
                  functionBlur={errorPassword}
                  helperText={newPasswordError.passwordOldError}
                />
                <CustomInput
                  label={"Nueva contraseña"}
                  design={"inputDesign"}
                  type={"password"}
                  name={"password"}
                  pattern={passwordPattern}
                  placeholder={""}
                  value={""}
                  maxLength={"12"}
                  functionProp={functionHandlerPassword}
                  functionBlur={errorPassword}
                  helperText={newPasswordError.passwordError}
                />
              </div>
              <Button
                variant="contained"
                className="button"
                onClick={Update}
                style={{ textTransform: "none", fontFamily: "" }}
              >
                Cambiar contraseña
              </Button>

              <div className="titleProfile">Cuenta</div>
              <div className="accountChange">
                <Button
                  variant="contained"
                  className="button"
                  onClick={() => {
                    sendAccount();
                  }}
                  style={{ textTransform: "none", fontFamily: "" }}
                >
                  Deshabilita tu cuenta
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
