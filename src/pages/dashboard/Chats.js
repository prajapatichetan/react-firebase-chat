import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Box,
  IconButton,
  Stack,
  Typography,
  InputBase,
  Button,
  Divider,
  Avatar,
  Badge,
  CircularProgress,
} from "@mui/material";
import { ArchiveBox, CircleDashed, MagnifyingGlass } from "phosphor-react";
import { useTheme } from "@mui/material/styles";

import { db, auth } from "../../config/firebase";
import { collection, onSnapshot } from "firebase/firestore";

// import { faker } from '@faker-js/faker';
// import { ChatList } from "../../data";
// import {
//   Search,
//   SearchIconWrapper,
//   StyledInputBase,
// } from "../../components/Search";
import ChatElement from "../../components/ChatElement";

const Chats = () => {
  const theme = useTheme();
  const [users, setUsers] = useState([]);
  const userData = useSelector((state) => state.userData.user);
  const [loader, setLoader] = useState(true);
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "users"), (snapshot) => {
      setUsers(
        snapshot.docs
          .map((doc) => doc.data())
          .filter((item) => item.email != userData.email)
      );
      setLoader(false);
    });
    setTimeout(() => {}, 2000);

    return setUsers([]);
  }, []);

  return (
    <Box
      sx={{
        position: "relative",
        width: 320,
        backgroundColor:
          theme.palette.mode === "light"
            ? "#F8FAFF"
            : theme.palette.background.paper,
        boxShadow: "0px 0px 2px rgba(0,0,0,0.25)",
      }}
    >
      <Stack p={3} spacing={2} sx={{ height: "100vh" }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography variant="h5">Chats</Typography>
          <IconButton>
            <CircleDashed />
          </IconButton>
        </Stack>

        {/* <Stack sx={{ width: "100%" }}>
          <Search>
            <SearchIconWrapper>
              <MagnifyingGlass color="#709CE6" />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search..."
              inputProps={{ "aria-label": "search" }}
            />
          </Search>
        </Stack> */}

        {/* <Stack spacing={1}>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <ArchiveBox size={24} />
            <Button>Archive</Button>
          </Stack>
          <Divider />
        </Stack> */}

        <Stack
          className="scrollbar"
          spacing={2}
          direction="column"
          sx={{ flexGrow: 1, overflowY: "scroll", height: "100%" }}
        >
          {/* <Stack spacing={2.4}>
            <Typography variant="subtitle2" sx={{ color: "#676767" }}>
              Pinned
            </Typography>
            {ChatList.filter((el) => el.pinned).map((el) => {
              return <ChatElement {...el} />;
            })}
          </Stack> */}

          <Stack spacing={2.4}>
            <Typography variant="subtitle2" sx={{ color: "#676767" }}>
              All Chats
            </Typography>

            {loader && (
              <Stack
                height={"100%"}
                minHeight={"58vh"}
                width={"auto"}
                sx={{
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <CircularProgress />{" "}
              </Stack>
            )}
            {!loader &&
              users.map((el) => {
                return <ChatElement key={el.uid} {...el} />;
              })}
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
};

export default Chats;
