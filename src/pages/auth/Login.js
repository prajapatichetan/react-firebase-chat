import { Link, Stack, Typography, Button } from "@mui/material";

const Login = () => {
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
