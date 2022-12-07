import { useAuth0 } from '@auth0/auth0-react';
import { Avatar, Box, Button, calc, Code, Container, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay, Icon, IconButton, Image, Link, Menu, MenuButton, MenuItem, MenuList, Skeleton, Stack, Tag, Text, useDisclosure, useToast } from '@chakra-ui/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { FiCommand, FiMoreVertical } from 'react-icons/fi';
import { useParams } from 'react-router-dom';
import { getApplicationEventLogs, getApplicationEvents } from '../../../../api/applications';

function ApplicationEventAndLogs() {
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedEvent, setSelectedEvent] = useState<any>()
  const { applicationId } = useParams();
  const { getAccessTokenSilently } = useAuth0();
  const query = useQuery([`application-${applicationId}-events`, { getAccessTokenSilently, applicationId }], getApplicationEvents);
  return (
    <Box as="section">
      {selectedEvent?<LogsDrawer isOpen={isOpen} onClose={onClose} event={selectedEvent} />:null}
      

      <Container
        as='section'
        display={"flex"}
        justifyContent={"center"}
        alignContent={"start"}
        flexWrap={"wrap"}
        px={0}
        maxW={"8xl"}
        gap={"30px"}
      >
        {query?.data?.data?.data?.map((event: any, index: number) => (
          <Box
            cursor={"pointer"}
            onClick={() => {
              setSelectedEvent(event)
              onOpen()
            }}
            key={index}
            as="section"
            borderRadius={8}
            bg={"#1e1e1e"}
            boxShadow={"2xl"}
            border={"solid 0px #424242fd"}
            px={4}
            py={4}
            width={"calc(100%)"}
            _hover={{ background: "#1e1e1e" }}
          >
            <Stack
              // px={8}
              direction={{ base: "column", sm: "row" }}
              justify="space-between"
              alignItems={"center"}
            >
              <Stack
                direction={"row"}
                alignItems={"center"}
                justifyContent={'center'}
                spacing={'8'}
              >
                <Box bg={"whiteAlpha.200"} p={2} borderRadius={6}>
                  <FiCommand size={24} />
                </Box>
                <Box display={"flex"} flexDirection='column' justifyContent={"center"}>
                  <Text fontSize="md" fontWeight="medium">
                    {event?.resource_config?.method + ": " + event?.resource_config?.endpoint}
                  </Text>
                  <Box display="flex" gap={4}>
                    <Text mt={1} color="muted" fontSize="sm">
                      {event?.function_name}
                    </Text>
                    <Text mt={1} color="muted" fontSize="sm">
                      {moment(event?.created_at).calendar()}
                    </Text>
                  </Box>
                </Box>

              </Stack>
              <Stack direction="row">
                <Tag>{event?.info_count} info logs</Tag>
                <Tag>{event?.debug_count} debug log</Tag>
                <Tag>{event?.warn_count} warning log</Tag>
                <Tag colorScheme={"red"}>{event?.error_count} errors logs</Tag>
                {/* <Button variant="solid" colorScheme={"orange"}>Show Logs for Function</Button> */}
              </Stack>
            </Stack>
          </Box>))
        }
      </Container>
    </Box>
  )
}

export default ApplicationEventAndLogs




interface LogsDrawerProp {
  event: any;
  isOpen: boolean;
  onClose: () => void;
}

export function LogsDrawer(props: LogsDrawerProp) {
  const [eventId, setEventId] = useState("")
  const { applicationId } = useParams();
  const { getAccessTokenSilently } = useAuth0();
  const query = useQuery([`application-${applicationId}-event-${eventId}-logs`, { getAccessTokenSilently, applicationId, eventId }], getApplicationEventLogs);

  useEffect(() => {
    setEventId(props?.event?.id)
  }, [props?.event])


  return (
    <>
      <Drawer isOpen={props.isOpen} onClose={props.onClose} size="xl" >
        <DrawerOverlay />
        <DrawerContent maxW={"8xl"} bg={"#1e1e1e"} overflowY={"scroll"}>
          <DrawerCloseButton />
          <DrawerHeader display="flex" alignItems={"center"} fontWeight={"medium"}> Logs for &nbsp; <Tag>{props?.event?.resource_config?.method + ": " + props?.event?.resource_config?.endpoint}</Tag>  &nbsp; for function  &nbsp; <Tag>{props?.event?.function_name}</Tag> &nbsp;  at {moment(props?.event?.created_at).calendar()} </DrawerHeader>
          <DrawerBody>
            <Box bg={"whiteAlpha.200"} borderRadius="md" px={6} py={4} display="flex" flexDirection={"column"} gap={"2"}>
              {query.data?.data?.data?.map((log: any) => <Box key={log?.id} display="flex">
                {Object.entries(log?.data).map(([key, value]: any) => <Box display={"flex"} key={key}>
                  <Text fontWeight={"medium"}>{key}</Text>:&nbsp;<Text color={"subtle"}>{value}</Text>
                </Box>)}
              </Box>)}
            </Box>
          </DrawerBody>

        </DrawerContent>
      </Drawer>
    </>
  );
}
