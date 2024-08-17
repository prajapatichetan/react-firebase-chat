import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Slide,
  Stack,
  CircularProgress,
} from "@mui/material";

import { useForm } from "react-hook-form";
import * as Yup from "yup";

import { db } from "../../config/firebase";
import { collection, onSnapshot, addDoc } from "firebase/firestore";
import FormProvider from "../../components/hook-form/FormProvider";
import { RHFTextField } from "../../components/hook-form";
import RHFAutocomplete from "../../components/hook-form/RHFAutocomplete";
import { multiple } from "./../../components/Conversation/MsgTypes";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const CreateGroupForm = ({ handleClose }) => {
  const [users, setUsers] = useState([]);
  const userData = useSelector((state) => state.userData.user);
  const [loader, setLoader] = useState(true);
  const NewGroupSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    members: Yup.array().min(2, "Must have at least 2 members"),
  });
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
  const defaultValues = {
    title: "",
    members: [],
  };

  const methods = useForm({
    resolver: yupResolver(NewGroupSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful, isValid },
  } = methods;

  const onSubmit = async (data) => {
    try {
      //api call
      setLoader(true);
      const { title, members } = data;

      let memeberIds = [];
      members.map((member) => {
        let userEmail = member.split("(")[1].split(")")[0];
        memeberIds.push(users.find((user) => user.email == userEmail).uid);
      });
      let groupInfo = {
        groupName: title,
        members: memeberIds,
        admin: userData.uid,
      };
      await addDoc(collection(db, "groups"), groupInfo);
      handleClose();
      setLoader(false);
    } catch (error) {
      setLoader(false);
      console.log(error);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      {loader && (
        <Stack
          height={"100%"}
          maxHeight={"100vh"}
          minHeight={"75vh"}
          width={"auto"}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress />{" "}
        </Stack>
      )}
      <Stack spacing={3}>
        <RHFTextField name="title" label="Title" />
        <RHFAutocomplete
          name="members"
          label="Members"
          multiple
          freeSolo
          getOptionLabel={(option) => option || ""}
          options={users.map(
            (option) => option.displayName + "(" + option.email + ")"
          )}
          ChipProps={{ size: "medium" }}
        />

        <Stack
          spacing={2}
          direction="row"
          alignItems="center"
          justifyContent="end"
        >
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            Create
          </Button>
        </Stack>
      </Stack>
    </FormProvider>
  );
};

const CreateGroup = ({ open, handleClose }) => {
  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      open={open}
      TransitionComponent={Transition}
      keepMounted
      sx={{ p: 4 }}
    >
      {/* Title */}
      <DialogTitle sx={{ mb: 3 }}>Create New Group</DialogTitle>
      {/* Content */}
      <DialogContent>
        {/* Form */}
        <CreateGroupForm handleClose={handleClose} />
      </DialogContent>
    </Dialog>
  );
};

export default CreateGroup;
