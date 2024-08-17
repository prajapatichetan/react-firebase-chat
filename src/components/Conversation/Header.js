import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  IconButton,
  Slide,
  Stack,
  Typography,
  Chip,
} from "@mui/material";

import React, { useEffect, useState } from "react";
import { collection, onSnapshot, addDoc } from "firebase/firestore";
import { useTheme } from "@mui/material/styles";

import StyledBadge from "../StyledBadge";
import { ToggleSidebar } from "../../redux/slices/app";
import { useDispatch } from "react-redux";

import { db } from "../../config/firebase";

import { useSelector } from "../../redux/store";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Header = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const receiverData = useSelector((state) => state.userData.receiverData);
  const selectedGroup = useSelector((state) => state.userData.selectedGroup);
  const [showDetails, setHandleDetailModel] = useState(false);
  const [users, setUsers] = useState([]);
  const [admin, setAdmin] = useState({});

  useEffect(() => {
    if (selectedGroup?.id != "" && selectedGroup?.id != undefined) {
      const unsub = onSnapshot(collection(db, "users"), (snapshot) => {
        setUsers(snapshot.docs.map((doc) => doc.data()));
      });
    }
  }, []);
  useEffect(() => {
    let adminData = users.filter((item) => item.uid == selectedGroup.admin);
    if (adminData.length > 0) {
      setAdmin(adminData[0]);
    }
  }, [users]);

  return (
    <Box
      p={2}
      sx={{
        width: "100%",
        backgroundColor:
          theme.palette.mode === "light"
            ? "#F8FAFF"
            : theme.palette.background.paper,
        boxShadow: "0px 0px 2px rgba(0,0,0,0.25)",
      }}
    >
      <Stack
        alignItems={"center"}
        direction="row"
        justifyContent={"space-between"}
        sx={{ width: "100%", height: "100%" }}
      >
        <Stack
          onClick={() => {
            // dispatch(ToggleSidebar());
          }}
          direction={"row"}
          spacing={2}
        >
          <Box>
            {(selectedGroup?.id == "" || selectedGroup?.id == undefined) && (
              <>
                {receiverData.status == "online" ? (
                  <StyledBadge
                    overlap="circular"
                    anchorOrigin={{
                      // position
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                    variant="dot"
                  >
                    <Avatar
                      alt={receiverData.displayName}
                      src={receiverData.photoURL}
                    />
                  </StyledBadge>
                ) : (
                  <Avatar
                    alt={receiverData.displayName}
                    src={receiverData.photoURL}
                  />
                )}
              </>
            )}
          </Box>
          <Stack>
            <Typography variant="heading">
              {selectedGroup?.id != "" && selectedGroup?.id != undefined
                ? selectedGroup.groupName
                : receiverData.displayName}
            </Typography>
            {receiverData.status == "online" && (
              <Typography variant="caption">Online</Typography>
            )}

            {selectedGroup?.id != "" && selectedGroup?.id != undefined && (
              <>
                <Stack direction={"row"}>
                  <Avatar alt={admin.displayName} src={admin.photoURL} />
                  <Typography variant="subtitle2">
                    {" Admin : "}
                    {admin.displayName}
                  </Typography>
                </Stack>
                <Typography
                  variant="caption"
                  onClick={() => {
                    setHandleDetailModel(true);
                  }}
                >
                  View Details
                </Typography>
              </>
            )}
          </Stack>
        </Stack>
        {/* <Stack direction="row" alignItems="center" spacing={3}>
          <IconButton>
            <VideoCamera />
          </IconButton>
          <IconButton>
            <Phone />
          </IconButton>
          <IconButton>
            <MagnifyingGlass />
          </IconButton>
          <Divider orientation="vertical" flexItem />
          <IconButton>
            <CaretDown />
          </IconButton>
        </Stack> */}
      </Stack>
      <Dialog
        fullWidth={true}
        open={showDetails}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => {
          setHandleDetailModel(false);
        }}
        aria-labelledby="customized-dialog-title"
      >
        <DialogTitle>Group Details</DialogTitle>
        <DialogContent>
          Group Name: {selectedGroup?.groupName}
          <Stack sx={{ height: "100%", p: 2 }} direction="row" spacing={3}>
            {users.length > 0 &&
              selectedGroup?.members.map((id) => {
                let user = users.find((item) => item.uid == id);
                return (
                  <Chip
                    key={id}
                    avatar={
                      <Avatar alt={user.displayName} src={user.photoURL} />
                    }
                    label={user.displayName}
                    variant="outlined"
                  />
                );
              })}
          </Stack>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Header;
