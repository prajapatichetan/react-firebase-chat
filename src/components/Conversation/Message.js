import React, { useRef, useEffect, forwardRef } from "react";
import { useTheme } from "@mui/material/styles";
import moment from "moment";

// import { Chat_History } from "../../theme-data";
import { Box, Stack, Divider, Typography } from "@mui/material";
import { DocMsg, MediaMsg, ReplyMsg, TextMsg, TimeLine } from "./MsgTypes";
import { useSelector } from "../../redux/store";

// import { Message_options } from "../../theme-data";

const Message = ({ allMessages, menu }) => {
  const lastMessageDiv = useRef(null);
  // window.addEventListener("scroll");
  useEffect(() => {
    scrollToBottom();
  }, [allMessages]);
  const scrollToBottom = () => {
    lastMessageDiv.current.scrollIntoView({ block: "end", behavior: "smooth" });
  };
  const { user } = useSelector((store) => store.userData);
  return (
    <Box p={3}>
      <Stack spacing={3}>
        {/* {allMessages.map((message) => {
          return <TextMsg key={message.id} msg={message} menu={menu} />;
        })} */}
        {Object.keys(allMessages).map((date) => {
          return (
            <>
              <TimeLine date={date} />

              {allMessages[date].map((message) => {
                switch (message.type) {
                  case "image":
                    return (
                      <MediaMsg key={message.id} msg={message} user={user} />
                    );
                  case "document":
                    return (
                      <DocMsg key={message.id} msg={message} user={user} />
                    );
                  default:
                    return (
                      <TextMsg
                        key={message.id}
                        msg={message}
                        menu={menu}
                        user={user}
                      />
                    );
                }
              })}
            </>
          );
        })}
        <div ref={lastMessageDiv} className="mb-10"></div>
        {/* {Chat_History.map((el) => {
          switch (el.type) {
            case "divider":
              return <TimeLine el={el} />;

            case "msg":
              switch (el.subtype) {
                case "img":
                  return <MediaMsg el={el} menu={menu} />;
                

                case "link":
                  return <LinkMsg el={el} menu={menu} />;
                case "reply":
                  return <ReplyMsg el={el} menu={menu} />;

                default:
                  return <TextMsg el={el} menu={menu} />;
              }
              break;

            default:
              return <></>;
          }
        })} */}
      </Stack>
    </Box>
  );
};

export default Message;
