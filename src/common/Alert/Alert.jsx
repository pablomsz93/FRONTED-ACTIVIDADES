import { Zoom } from "@mui/material";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import { useEffect, useState } from "react";

export const CustomAlert = ({ type, content, showAlert }) => {
    const [showAnimation, setShowAnimation] = useState(showAlert);

    useEffect(() => {
      setShowAnimation(showAlert);
    }, [showAlert]);
  
  const alertSeverity = (type) => {
    switch (type) {
      case "error":
        return "error";
      case "warning":
        return "warning";
      case "info":
        return "info";
      case "success":
        return "success";
      default:
        return "info";
    }
  };

  const alertClasses = showAlert ? "contentAlertShow" : "contentAlert";

  return (
    <div className={alertClasses}>
      {showAlert == true && (
        <Stack sx={{ width: "100%" }} spacing={2}>
          <Zoom
            in={showAnimation}
            style={{ transitionDelay: showAlert ? "500ms" : "3000ms",
            transition: "transform 500ms, opacity 500ms", }}
          >
            <Alert severity={alertSeverity(type)}>
              {content}
            </Alert>
          </Zoom>
        </Stack>
      )}
    </div>
  );
};
