import {
  Box,
  Fab,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Tooltip,
} from "@mui/material";
import React, { useState } from "react";
import { styled, useTheme } from "@mui/material/styles";
import {
  LinkSimple,
  PaperPlaneTilt,
  Smiley,
  Camera,
  File,
  Image,
  Sticker,
  User,
} from "phosphor-react";
import data from "@emoji-mart/data";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import Picker from "@emoji-mart/react";
import { auth, authProvider, db } from "../../config/firebase";
import { useSelector } from "../../redux/store";
import { setReceiverId } from "../../redux/slices/user";

const StyledInput = styled(TextField)(({ theme }) => ({
  "& .MuiInputBase-input": {
    paddingTop: "12px",
    paddingBottom: "12px",
  },
}));

const Actions = [
  {
    color: "#4da5fe",
    icon: <Image size={24} />,
    y: 102,
    title: "Photo/Video",
  },
  {
    color: "#1b8cfe",
    icon: <Sticker size={24} />,
    y: 172,
    title: "Stickers",
  },
  {
    color: "#0172e4",
    icon: <Camera size={24} />,
    y: 242,
    title: "Image",
  },
  {
    color: "#0159b2",
    icon: <File size={24} />,
    y: 312,
    title: "Document",
  },
  {
    color: "#013f7f",
    icon: <User size={24} />,
    y: 382,
    title: "Contact",
  },
];

const ChatInput = ({ message, setOpenPicker, handleMessage }) => {
  const [openAction, setOpenAction] = useState(false);
  return (
    <StyledInput
      fullWidth
      placeholder="Write a message..."
      variant="filled"
      onChange={(e) => {
        handleMessage(e.target.value);
      }}
      value={message}
      InputProps={{
        disableUnderline: true,
        startAdornment: (
          <Stack sx={{ width: "max-content" }}>
            <Stack
              sx={{
                position: "relative",
                display: openAction ? "inline-block" : "none",
              }}
            >
              {Actions.map((el) => (
                <Tooltip key={el.title} placement="right" title={el.title}>
                  <Fab
                    sx={{
                      position: "absolute",
                      top: -el.y,
                      backgroundColor: el.color,
                    }}
                  >
                    {el.icon}
                  </Fab>
                </Tooltip>
              ))}
            </Stack>
            {/* <InputAdornment>
                    <IconButton onClick={()=>{
                        setOpenAction((prev)=>!prev)
                    }}>
                        <LinkSimple/>
                    </IconButton>
                </InputAdornment> */}
          </Stack>
        ),
        endAdornment: (
          <InputAdornment>
            {/* <IconButton
              onClick={() => {
                setOpenPicker((prev) => !prev);
              }}
            >
              <Smiley />
            </IconButton> */}
          </InputAdornment>
        ),
      }}
    />
  );
};

const Footer = () => {
  const theme = useTheme();
  const [openPicker, setOpenPicker] = useState(false);
  const [loader, setLoader] = useState(false);

  const [message, handleMessage] = useState("");

  const { receiverData, user } = useSelector((store) => store.userData);
  // console.log(receiverData);

  const handleSendMessage = async () => {
    try {
      if (user && receiverData) {
        setLoader(true);

        let connectionId = receiverData.connectionId;
        if (connectionId == "" || connectionId == undefined) {
          const connection = await addDoc(
            collection(db, "chatUserConnection"),
            {
              firstUserId: user.uid,
              secondUserId: receiverData.uid,
            }
          );
          connectionId = connection.id;
        }
        await addDoc(collection(db, "messages"), {
          message: message,
          senderId: user.uid,
          receiverId: receiverData.uid,
          connectionId: connectionId,
          timestamp: serverTimestamp(),
        }).then((result) => {
          setLoader(false);
        });
        setReceiverId({
          ...receiverData,
          connectionId: connectionId,
        });
      }
    } catch (error) {
      console.log(error);
    }
    handleMessage("");
  };
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
      <Stack direction="row" alignItems={"center"} spacing={3}>
        <Stack sx={{ width: "100%" }}>
          {/* Chat Input */}
          <Box
            sx={{
              display: openPicker ? "inline" : "none",
              zIndex: 10,
              position: "fixed",
              bottom: 81,
              right: 100,
            }}
          >
            <Picker
              theme={theme.palette.mode}
              data={data}
              onEmojiSelect={console.log}
            />
          </Box>
          <ChatInput
            message={message}
            handleMessage={handleMessage}
            setOpenPicker={setOpenPicker}
          />
        </Stack>

        <Box
          sx={{
            height: 48,
            width: 48,
            backgroundColor: theme.palette.primary.main,
            borderRadius: 1.5,
          }}
        >
          <Stack
            sx={{
              height: "100%",
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={() => {
              handleSendMessage();
            }}
          >
            <IconButton>
              <PaperPlaneTilt color="#fff" />
            </IconButton>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};

export default Footer;
