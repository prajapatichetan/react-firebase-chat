import {
  Box,
  Fab,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Tooltip,
} from "@mui/material";
import React, { useEffect, useState, useRef } from "react";
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

import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";

import Picker from "@emoji-mart/react";
import CircularProgress from "@mui/material/CircularProgress";
import { auth, authProvider, db, storage } from "../../config/firebase";
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
    keyTitle: "image",
  },
  {
    color: "#0159b2",
    icon: <File size={24} />,
    y: 172,
    title: "Document",
    keyTitle: "document",
  },
  // {
  //   color: "#1b8cfe",
  //   icon: <Sticker size={24} />,
  //   y: 242,
  //   title: "Stickers",
  // },
  // {
  //   color: "#0172e4",
  //   icon: <Camera size={24} />,
  //   y: 312,
  //   title: "Image",
  // },

  // {
  //   color: "#013f7f",
  //   icon: <User size={24} />,
  //   y: 382,
  //   title: "Contact",
  // },
];

const ChatInput = ({
  message,
  setOpenPicker,
  handleMessage,
  clickedActionButton,
  onselectFileUploadAction,
  selectActionForFileUpload,
  handleClickedActionButton,
}) => {
  const [openAction, setOpenAction] = useState(false);

  useEffect(() => {
    if (clickedActionButton == "") {
      setOpenAction(false);
    }
  }, [clickedActionButton]);
  return (
    <StyledInput
      autoFocus={true}
      fullWidth
      placeholder={
        selectActionForFileUpload == "" ? "Write a message..." : "File Selected"
      }
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
                    onClick={(e) => {
                      handleClickedActionButton("clicked");
                      onselectFileUploadAction(el.keyTitle);
                    }}
                  >
                    {el.icon}
                  </Fab>
                </Tooltip>
              ))}
            </Stack>
            <InputAdornment>
              <IconButton
                onClick={() => {
                  setOpenAction((prev) => !prev);
                }}
              >
                <LinkSimple />
              </IconButton>
            </InputAdornment>
          </Stack>
        ),
        endAdornment: (
          <InputAdornment>
            <IconButton
              onClick={() => {
                setOpenPicker((prev) => !prev);
              }}
            >
              <Smiley />
            </IconButton>
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
  const hiddenFileInput = useRef(null);
  const [message, handleMessage] = useState("");
  const [clickedActionButton, handleClickedActionButton] = useState("");
  const [selectActionForFileUpload, handleSelectFileUploadAction] =
    useState("");
  const [uploadedFile, setUploadedFile] = useState([]);

  const { receiverData, user, selectedGroup } = useSelector(
    (store) => store.userData
  );

  useEffect(() => {
    if (clickedActionButton != "") {
      hiddenFileInput.current.click();
      handleClickedActionButton("");
    }
  }, [clickedActionButton]);

  const sendMessage = async (link, fileName, connectionId) => {
    await addDoc(collection(db, "messages"), {
      link: link,
      fileName: fileName,
      message: message,
      type: selectActionForFileUpload,
      senderId: user.uid,
      receiverId: receiverData.uid,
      connectionId: connectionId,
      timestamp: serverTimestamp(),
    }).then((result) => {
      setLoader(false);
      handleSelectFileUploadAction("");
    });
    setReceiverId({
      ...receiverData,
      connectionId: connectionId,
    });
  };
  const sendMessageGroup = async (link, fileName, connectionId) => {
    await addDoc(collection(db, "messages"), {
      message: message,
      senderId: user.uid,
      groupId: selectedGroup.id,
      link: link,
      fileName: fileName,
      type: selectActionForFileUpload,
      timestamp: serverTimestamp(),
    }).then((result) => {
      setLoader(false);
      handleSelectFileUploadAction("");
    });
  };
  const handleSendMessage = async (e) => {
    e.preventDefault();
    setOpenPicker(false);
    try {
      if (
        user &&
        receiverData &&
        (selectedGroup?.id == "" || selectedGroup?.id == undefined)
      ) {
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
        if (selectActionForFileUpload != "") {
          if (!uploadedFile) return;
          let path = selectActionForFileUpload == "img" ? "images" : "files";
          const storageRef = ref(
            storage,
            `${path}/${serverTimestamp() + "_" + uploadedFile.name}`
          );
          const uploadTask = uploadBytesResumable(storageRef, uploadedFile);
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress = Math.round(
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100
              );
              console.log(progress);
              // setProgresspercent(progress);
            },
            (error) => {
              setLoader(false);
              console.log(error);
            },
            () => {
              getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                sendMessage(downloadURL, uploadedFile.name, connectionId);
                handleSelectFileUploadAction("");
              });
            }
          );
        } else {
          sendMessage("", "", connectionId);
        }
      } else {
        setLoader(true);
        if (selectActionForFileUpload != "") {
          if (!uploadedFile) return;
          let path = selectActionForFileUpload == "img" ? "images" : "files";
          const storageRef = ref(
            storage,
            `${path}/${serverTimestamp() + "_" + uploadedFile.name}`
          );
          const uploadTask = uploadBytesResumable(storageRef, uploadedFile);
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress = Math.round(
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100
              );
              console.log(progress);
              // setProgresspercent(progress);
            },
            (error) => {
              setLoader(false);
              console.log(error);
            },
            () => {
              getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                sendMessageGroup(downloadURL, uploadedFile.name);
                handleSelectFileUploadAction("");
              });
            }
          );
        } else {
          sendMessageGroup("", "");
        }
        // await addDoc(collection(db, "messages"), {
        //   message: message,
        //   senderId: user.uid,
        //   groupId: selectedGroup.id,

        //   timestamp: serverTimestamp(),
        // }).then((result) => {
        //   setLoader(false);
        // });
      }
    } catch (error) {
      console.log(error);
    }
    handleMessage("");
  };

  const handleChange = (event) => {
    setUploadedFile(event.target.files[0]);
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
        <form
          style={{ width: "100%", display: "flex" }}
          onSubmit={handleSendMessage}
        >
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
                onEmojiSelect={(e) => handleMessage(message + e.native)}
              />
            </Box>
            {!loader && (
              <ChatInput
                onselectFileUploadAction={handleSelectFileUploadAction}
                selectActionForFileUpload={selectActionForFileUpload}
                message={message}
                handleMessage={handleMessage}
                setOpenPicker={setOpenPicker}
                clickedActionButton={clickedActionButton}
                handleClickedActionButton={handleClickedActionButton}
              />
            )}
            {loader && <CircularProgress />}
          </Stack>

          <Box
            sx={{
              height: 48,
              width: 48,
              backgroundColor: theme.palette.primary.main,
              borderRadius: 1.5,
              ml: "24px",
            }}
          >
            <Stack
              sx={{
                height: "100%",
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <IconButton
                disabled={loader}
                onClick={(e) => {
                  handleSendMessage(e);
                }}
              >
                <PaperPlaneTilt color="#fff" />
              </IconButton>
            </Stack>
          </Box>
          <input
            type="file"
            onChange={handleChange}
            ref={hiddenFileInput}
            accept={
              selectActionForFileUpload == "document"
                ? "application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint,text/plain, application/pdf"
                : "image/*"
            }
            style={{ display: "none" }} // Make the file input element invisible
          />
        </form>
      </Stack>
    </Box>
  );
};

export default Footer;
