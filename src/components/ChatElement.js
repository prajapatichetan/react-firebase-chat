import { useEffect, useState } from "react";
import { Avatar, Badge, Box, Stack, Typography } from "@mui/material";
import { useTheme, styled } from "@mui/material/styles";
import StyledBadge from "./StyledBadge";
import { db } from "../config/firebase";
import { collection, onSnapshot, addDoc } from "firebase/firestore";
import { useDispatch, useSelector } from "../redux/store";

import { setReceiverId } from "../redux/slices/user";

//single chat element
const ChatElement = ({
  uid,
  displayName,
  photoURL,
  msg,
  time,
  online,
  unread,
}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const loggedInUser = useSelector((state) => state.userData.user);
  // const [connectionId, setConnectionId] = useState(false);
  const selectReceiver = async () => {
    // const snapshot = await db.collection("chatUserConnection").get();
    // console.log(snapshot);

    const unsub = onSnapshot(
      collection(db, "chatUserConnection"),
      (snapshot) => {
        let connectionData = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter(
            (item) =>
              item.firstUserId == loggedInUser.uid ||
              item.secondUserId == loggedInUser.uid
          )
          .filter(
            (item) => item.firstUserId == uid || item.secondUserId == uid
          );

        dispatch(
          setReceiverId({
            uid,
            displayName,
            photoURL,
            connectionId: connectionData[0]?.id,
          })
        );
        // console.log(connectionId);
      }
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
      }}
      p={2}
      onClick={() => {
        selectReceiver();
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Stack direction="row" spacing={2}>
          {online ? (
            <StyledBadge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              variant="dot"
            >
              <Avatar src={photoURL} />
            </StyledBadge>
          ) : (
            <Avatar src={photoURL} />
          )}

          <Stack spacing={0.3}>
            <Typography variant="subtitle2">{displayName}</Typography>
            {/* <Typography variant='caption'>
                {msg} Message
              </Typography> */}
          </Stack>
        </Stack>
        <Stack spacing={2} alignItems="center">
          {/* <Typography sx={{fontWeight:600}} variant='caption'>
                {time} Time
              </Typography>
              <Badge color='primary' badgeContent={unread}>
  
              </Badge> */}
        </Stack>
      </Stack>
    </Box>
  );
};

export default ChatElement;
