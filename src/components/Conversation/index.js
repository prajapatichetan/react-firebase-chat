import { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import { Box, Stack } from "@mui/material";
import Header from "./Header";
import Footer from "./Footer";
import Message from "./Message";

import { useSelector } from "../../redux/store";
import { db } from "../../config/firebase";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  where,
} from "firebase/firestore";
import moment from "moment";

const Conversation = () => {
  const theme = useTheme();

  const { receiverData, user } = useSelector((store) => store.userData);
  const [allMessages, setAllMessages] = useState({});
  useEffect(() => {
    if (
      receiverData.connectionId != "" &&
      receiverData.connectionId != undefined
    ) {
      const q = query(
        collection(db, "messages"),
        where("connectionId", "==", receiverData.connectionId),
        orderBy("timestamp", "asc")
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const messages = [];

        querySnapshot.forEach((doc) => {
          messages.push({
            id: doc.id,
            ...doc.data(),
            date: moment(doc.data().timestamp?.toDate().getTime()).format("L"),
          });
        });

        const messageGroupBy = Object.groupBy(messages, ({ date }) => date);

        setAllMessages(messageGroupBy);
      });
    } else {
      setAllMessages({});
    }
  }, [receiverData]);

  return (
    <Stack height={"100%"} maxHeight={"100vh"} width={"auto"}>
      {/* Chat header */}
      <Header />
      {/* Msg */}
      <Box
        className="scrollbar"
        width={"100%"}
        sx={{ flexGrow: 1, height: "100%", overflowY: "scroll" }}
      >
        <Message allMessages={allMessages} menu={true} />
      </Box>
      {/* Chat footer */}
      <Footer />
    </Stack>
  );
};

export default Conversation;
