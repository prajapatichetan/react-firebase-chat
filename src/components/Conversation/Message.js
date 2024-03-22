import React, { useRef, useEffect, forwardRef } from "react";
import { useTheme } from "@mui/material/styles";
import moment from "moment";

// import { Chat_History } from "../../theme-data";
import { Box, Stack, Divider, Typography } from "@mui/material";
// import { DocMsg, LinkMsg, MediaMsg, ReplyMsg, TimeLine } from "./MsgTypes";
import { useSelector } from "../../redux/store";
import { dateToFromNowDaily } from "../../utils/formatTime";

// import { Message_options } from "../../theme-data";

const TextMsg = forwardRef(({ msg, menu }, ref) => {
  const { user } = useSelector((store) => store.userData);
  const theme = useTheme();

  return (
    <Stack
      direction="row"
      justifyContent={msg.senderId != user.uid ? "start" : "end"}
      ref={ref}
    >
      <Box
        p={1.5}
        sx={{
          backgroundColor:
            msg.senderId == user.uid
              ? theme.palette.background.default
              : theme.palette.primary.main,
          borderRadius: 1.5,
          width: "max-content",
        }}
      >
        <Typography
          variant="body2"
          color={msg.senderId == user.uid ? theme.palette.text : "#fff"}
        >
          {msg.message}
        </Typography>
        <Stack direction="row" justifyContent={"end"}>
          <Typography
            color={msg.senderId == user.uid ? theme.palette.text : "#fff"}
            sx={{ fontWeight: 200 }}
            variant="caption"
          >
            {moment(msg?.timestamp?.toDate().getTime()).format("LT")}
          </Typography>
        </Stack>
      </Box>
      {/* {menu && <MessageOptions />} */}
    </Stack>
  );
});

const TimeLine = ({ date }) => {
  const theme = useTheme();

  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between">
      <Divider width="46%" />
      <Typography variant="caption" sx={{ color: theme.palette.text }}>
        {dateToFromNowDaily(date)}
      </Typography>
      <Divider width="46%" />
    </Stack>
  );
};

const Message = ({ allMessages, menu }) => {
  const lastMessageDiv = useRef(null);
  useEffect(() => {
    scrollToBottom();
  }, [allMessages]);
  const scrollToBottom = () => {
    lastMessageDiv.current.scrollIntoView({ behavior: "smooth" });
  };
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
                return <TextMsg key={message.id} msg={message} menu={menu} />;
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
                case "doc":
                  return <DocMsg el={el} menu={menu} />;

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
