import { Link, Stack, Typography, Button } from "@mui/material";
import { signInWithPopup } from "firebase/auth";
import { Navigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { auth, authProvider, db } from "../../config/firebase";
import { useDispatch, useSelector } from "../../redux/store";
import { loggedIn } from "../../redux/slices/user";

const Login = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.userData.isLoggedIn);
  const handleLogin = () => {
    signInWithPopup(auth, authProvider)
      .then((response) => {
        let userData = {
          email: response.user.email,
          accessToken: response.user.accessToken,
          displayName: response.user.displayName,
          photoURL: response.user.photoURL,
          uid: response.user.uid,
        };
        setDoc(doc(db, "users", userData.uid), {
          ...userData,
        });
        dispatch(loggedIn(userData));
      })
      .catch((err) => console.log(err.message));
  };

  if (isLoggedIn) {
    return <Navigate to="/" />;
  }
  return (
    <>
      <Stack
        alignItems={"center"}
        spacing={2}
        sx={{ mb: 5, position: "relative" }}
      >
        <Typography variant="h4">Login to Chat</Typography>
        {/* Login form */}
        <Button
          fullWidth
          onClick={handleLogin}
          color="inherit"
          size="large"
          type="submit"
          variant="contained"
          sx={{
            bgcolor: "text.primary",
            color: (theme) =>
              theme.palette.mode === "light" ? "common.white" : "grey.800",
            "&:hover": {
              bgcolor: "text.primary",
              color: (theme) =>
                theme.palette.mode === "light" ? "common.white" : "grey.800",
            },
          }}
        >
          Gmail
        </Button>
      </Stack>
    </>
  );
};

export default Login;
