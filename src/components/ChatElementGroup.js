import { useEffect, useState } from "react";
import { Avatar, Badge, Box, Stack, Typography } from "@mui/material";
import { useTheme, styled } from "@mui/material/styles";
import StyledBadge from "./StyledBadge";
import { db } from "../config/firebase";
import { collection, onSnapshot, addDoc } from "firebase/firestore";
import { useDispatch, useSelector } from "../redux/store";

import { setGroup } from "../redux/slices/user";

//single chat element
const ChatElementGroup = ({ id, groupName, members, admin }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const loggedInUser = useSelector((state) => state.userData.user);
  // const [connectionId, setConnectionId] = useState(false);

  const selectGroup = async () => {
    dispatch(
      setGroup({
        id,
        groupName,
        members,
        admin,
      })
    );
  };

  return (
    <Box
      sx={{
        width: "100%",
        borderRadius: 1,
        backgroundColor:
          theme.palette.mode === "light"
            ? "#fff"
            : theme.palette.background.default,
        cursor: "pointer",
      }}
      p={2}
      onClick={() => {
        selectGroup();
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Stack direction="row" spacing={2}>
          <Stack spacing={0.3}>
            <Typography variant="subtitle2">{groupName}</Typography>
            {/* <Typography variant="caption">{msg} Message</Typography> */}
          </Stack>
        </Stack>
        <Stack spacing={2} alignItems="center">
          {/* <Typography sx={{ fontWeight: 600 }} variant="caption">
            {time} Time
          </Typography>
          <Badge color="primary" badgeContent={unread}></Badge> */}
        </Stack>
      </Stack>
    </Box>
  );
};

export default ChatElementGroup;
