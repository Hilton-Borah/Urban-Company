import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Button,
  Input,
  InputLeftAddon,
  InputGroup,
  PinInput, PinInputField, HStack, Box, useToast, Spinner, Text, Flex
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useDisclosure } from "@chakra-ui/react";
import axios from "axios";
import { getLocalData, saveLocalData } from "../Utils/LocalStorage";
import { Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginAuth } from "../Redux/action";


const initialState = {
  username: "",
  email: "",
  mobile: "",
}

function DrawerExample1() {
  const isAuth = useSelector((state) => state.isAuth)
  const dispatch = useDispatch()
  const isLoading = useSelector((state) => state.isLoading)
  const toast = useToast()
  const navigate = useNavigate()
  const [formState, setFormState] = React.useState(initialState);
  // const [isLoading, setIsloading] = useState(false)
  const [isLoading1, setIsloading1] = useState(false)
  const [check, setCheck] = useState(false);
  const [pin, setPin] = useState("")
  const [response, setresponse] = useState("")
  const [response1, setresponse1] = useState("")
  const [response1check, setResponse1Check] = useState(1)

  const handleLogout = () => {
    localStorage.clear()
    // isAuth = false
    window.location.reload()
  }

  console.log(isAuth)

  const handleChange = (e) => {

    const { name, value, type } = e.target;
    const val = type === "number" ? Number(value) : value;
    setFormState({
      ...formState,
      [name]: val,
    });
  };

  const submitData = () => {
    saveLocalData("username", formState.username);
    saveLocalData("emailId",formState.email);
    setCheck(true)
    // setIsloading(true)

    toast({
      title: 'OTP sent successfully',
      description: "Please check your email.",
      status: 'success',
      duration: 9000,
      isClosable: true,
    })

    dispatch(loginAuth(formState.email))

    // axios.get(`https://verify-email.herokuapp.com/generate/otp/${formState.email}`)
    //   .then((res) => {
    //     setIsloading(false)
    //     console.log(res)
    //   })
    //   .catch((err) => {
    //     setIsloading(false)
    //     console.log(err)
    //   })
  }

  const handleChangeSecond = (e) => {
    setPin(e.target.value)
  }

  const handleClick = () => {
    setIsloading1(true)
    axios.get(`https://verify-email.herokuapp.com/validate/otp/${formState.email}/${pin}`)
      .then((res) => {
        setIsloading1(false)
        setresponse1(res.data)
        console.log(res)
        if (res.data == "OTP Verified Successfully..") {
          setResponse1Check(2)
        } else {
          setResponse1Check(3)
        }
        // if (formState.email === "hiltonborah123@gmail.com") {
        //   navigate("/adminpage")
        // } else {
        //   navigate("/")
        // }
      })
      .catch((err) => {
        setIsloading1(false)
        console.log(err)
      })
    setFormState(initialState)
    setPin("")
  }

  let username = getLocalData("username")
  let emailId = getLocalData("emailId")

  const handleAdmin=()=>{
    navigate("/adminpage")
  }

  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();

  return (
    <>
      <Button ref={btnRef} colorScheme="trasparent" onClick={() => onOpen()} mt="-8px">
        {username || "Login/Sign Up"}
      </Button>
      {isAuth ? <b onClick={handleLogout} style={{ cursor: "pointer" }}>Logout</b> : null}
      {emailId==="hiltonborah123@gmail.com"?<b onClick={handleAdmin} style={{ cursor: "pointer" }}>Admin dashboard</b> : null}
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
        display="flex"
        flexDirection="column"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton mt="10px" />
          <DrawerHeader>Please login to continue</DrawerHeader>

          <DrawerBody>
            <InputGroup display="flex" flexDirection="column" gap="10px">
              <Input
                name="username"
                value={formState.username}
                type="text"
                placeholder="Username"
                onChange={handleChange}
              />
              <Input
                name="email"
                value={formState.email}
                type="email"
                placeholder="Email"
                onChange={handleChange}
                required
              />
              <DrawerBody width="320px">
                <InputGroup ml="-22px">
                  <InputLeftAddon children="+91" />
                  <Input
                    name="mobile"
                    value={formState.mobile}
                    type="number"
                    placeholder="phone number"
                    onChange={handleChange}
                  />
                </InputGroup>
              </DrawerBody>
            </InputGroup>
            <Box>{isLoading ? <Box w={"100%"} ml={"43%"} mt={"20px"}><Spinner /></Box> : null}</Box>
            <Button ml={"30%"} mt={"10px"} disabled={formState.email === "" || check} colorScheme="blue" onClick={submitData}>
              Continue
            </Button>
            {
              check ? <Box mt={"20px"}><HStack>
                <PinInput>
                  <PinInputField onChange={handleChangeSecond} />
                  <PinInputField onChange={handleChangeSecond} />
                  <PinInputField onChange={handleChangeSecond} />
                  <PinInputField onChange={handleChangeSecond} />
                  <PinInputField onChange={handleChangeSecond} />
                  <PinInputField onChange={handleChangeSecond} />
                </PinInput>
              </HStack>
                <Box>{response1check === 3 ? <Text fontSize={"13px"} mt={"10px"} textAlign="center" color={"red"}>Wrong OTP. Plaese put the right one.</Text> : null}</Box>
                <Box>{response1check === 2 ? <Text fontSize={"13px"} mt={"10px"} textAlign="center" color={"green"}>OTP verified. Thanks for joining with us.</Text> : null}</Box>
                <Box>{isLoading1 ? <Box w={"100%"} ml={"43%"} mt={"20px"}><Spinner /></Box> : null}</Box>
                <Button disabled={response1check === 2} onClick={()=>{handleClick()}} ml={"30%"} mt={"20px"} fontSize={"14px"} colorScheme="blue">Verify OTP</Button>
              </Box> : null
            }
            <Flex justifyContent={"center"}><Button position={"fixed"} top={"660px"} w={"90%"} colorScheme="blue">Log Out</Button></Flex>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export { DrawerExample1 };
