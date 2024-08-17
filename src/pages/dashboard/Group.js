import React, { useEffect, useState } from "react";
import {
  Box,
  Stack,
  Typography,
  Link,
  IconButton,
  Divider,
} from "@mui/material";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  where,
  Filter,
} from "firebase/firestore";
import {
  Search,
  SearchIconWrapper,
  StyledInputBase,
} from "../../components/Search";

import { MagnifyingGlass, Plus } from "phosphor-react";
import { useTheme } from "@mui/material/styles";
import { SimpleBarStyle } from "../../components/Scrollbar";
import "../../css/global.css";
import { db } from "../../config/firebase";
import { useSelector } from "../../redux/store";
import { ChatList } from "../../theme-data/index";
import ChatElementGroup from "../../components/ChatElementGroup";
import CreateGroup from "../../sections/main/CreateGroup";
import Conversation from "../../components/Conversation";

const Group = () => {
  const theme = useTheme();
  const [openDialog, setOpenDialog] = useState(false);
  const { sidebar } = useSelector((store) => store.app); // access our store inside component
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const userData = useSelector((state) => state.userData.user);
  const selectedGroup = useSelector((state) => state.userData.selectedGroup);

  const [groupData, setGroupData] = useState([]);
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "groups"), (snapshot) => {
      let connectionData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const groupAdminFind = [...connectionData];
      let groupAdmin = groupAdminFind.filter(
        (item) => item.admin == userData.uid
      );

      let memeberGroup = connectionData.filter((item) =>
        item.members.includes(userData.uid)
      );

      let finalGroupList = [...new Set([...groupAdmin, ...memeberGroup])];

      setGroupData(finalGroupList);
    });
  }, []);
  return (
    <>
      <Stack direction={"row"} sx={{ width: "100%" }}>
        {/* Left */}
        <Box
          sx={{
            height: "100vh",
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? "#F8FAFF"
                : theme.palette.background,
            width: 320,
            boxShadow: "0px 0px 2px rgba(0,0,0,0.25)",
          }}
        >
          <Stack p={3} spacing={2} sx={{ maxHeight: "100vh" }}>
            <Stack>
              <Typography variant="h5">Group</Typography>
            </Stack>
            <Stack sx={{ width: "100%" }}>
              <Search>
                <SearchIconWrapper>
                  <MagnifyingGlass color="#709CE6" />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="Search..."
                  inputProps={{ "aria-label": "search" }}
                />
              </Search>
            </Stack>
            <Stack
              direction={"row"}
              alignItems={"center"}
              justifyContent={"space-between"}
            >
              <Typography variant="subtitle2" component={Link}>
                Create New Group
              </Typography>
              <IconButton
                onClick={() => {
                  setOpenDialog(true);
                }}
              >
                <Plus style={{ color: theme.palette.primary.main }} />
              </IconButton>
            </Stack>
            <Divider />
            <Stack
              spacing={3}
              className="scrollbar"
              sx={{ flexGrow: 1, overflowY: "scroll", height: "100%" }}
            >
              <SimpleBarStyle timeout={500} clickOnTrack={false}>
                <Stack spacing={2.5}>
                  {/*  */}
                  {/* <Typography variant="subtitle2" sx={{ color: "#676667" }}>
                    Pinned
                  </Typography>
                  {/* Pinned *}
                  {ChatList.filter((el) => el.pinned).map((el) => {
                    return <ChatElement {...el} />;
                  })} */}

                  {/*  */}
                  <Typography variant="subtitle2" sx={{ color: "#676667" }}>
                    All Groups
                  </Typography>
                  {/* Chat List */}
                  {groupData.map((el) => {
                    return <ChatElementGroup {...el} />;
                  })}
                </Stack>
              </SimpleBarStyle>
            </Stack>
          </Stack>
        </Box>

        {/* Right */}
        <Box
          sx={{
            height: "100%",
            width: sidebar.open ? "calc(100vw - 740px)" : "calc(100vw - 420px)",
            backgroundColor:
              theme.palette.mode === "light"
                ? "#F0F4FA"
                : theme.palette.background.default,
          }}
        >
          {/* Conversation */}
          {selectedGroup?.id && selectedGroup?.id != undefined && (
            <Conversation />
          )}
        </Box>
      </Stack>
      {openDialog && (
        <CreateGroup open={openDialog} handleClose={handleCloseDialog} />
      )}
    </>
  );
};

export default Group;
