import {
  Box,
  Container,
  Heading,
  Stack,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { VscChromeClose, VscRemove, VscWindow } from "react-icons/vsc";
import { Logo } from "./components/Logo/Logo";

const SplashScreen = () => {

  return (
    <Box display={"flex"} bg="#121212" width={"100vw"} height={"100vh"} flexDirection="column">
      <Box height={"calc(100vh - 40px)"} display="flex" justifyContent={"center"} alignItems={"center"}>
        <Container minH={"400px"} maxW="md" p={{ base: "12", md: "12" }} m={"auto"}>
          <Box backgroundColor={"#ffffff14"} padding={12} borderRadius="lg" boxShadow={"2xl"}>
            <Stack spacing="12">
              <Box display={"flex"} flexDirection={"column"} gap={4} justifyContent={"center"} alignItems={"center"}>
                <Logo width={"140px"} height={"180px"} />
                <Stack textAlign="center">
                  <Heading size={useBreakpointValue({ base: "xs", md: "sm" })}>
                    Faasly Console
                  </Heading>
                  <Text color="muted">
                    Develop, Collaborate & Deploy
                  </Text>

                </Stack>
              </Box>
            </Stack>
          </Box>

        </Container>
      </Box>
    </Box>

  );
};

export default SplashScreen;
