import React from 'react'
import { useAuth0 } from '@auth0/auth0-react';
import { Box, Button, Card, Divider, IconButton, Link, Menu, MenuButton, MenuItem, MenuList, Skeleton, Stack, Tag, Text, useDisclosure, useToast } from '@chakra-ui/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { FiCommand, FiDatabase, FiMoreHorizontal, FiMoreVertical, FiPlus } from 'react-icons/fi';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { currentWorkspaceState } from '../../../store/workspaces';
import { getDatabase } from '../../../api/databases';
function DatabaseDetails() {
  const {databaseId} = useParams();
  const { getAccessTokenSilently } = useAuth0();
  const [currentWorkspace,] = useRecoilState(currentWorkspaceState);

  const database = useQuery(['databases-'+databaseId, { getAccessTokenSilently, databaseId }], getDatabase);
console.log(database?.data?.data?.data)
  return (
    <Box height={"calc(100vh - 40px)"} overflowY={"scroll"}>
      <Box as="section" mt={4} py={4} px={4} borderBottom={"solid 1px #42424252"} data-tauri-drag-region>
        <Stack spacing="5">
          <Stack
            data-tauri-drag-region
            spacing="4"
            direction={{ base: "column", sm: "row" }}
            justify="space-between"
            alignItems={"center"}
          >
            <Box display="flex" gap={4} justifyContent={"center"} alignItems={"center"}>
              <FiDatabase size={"40px"} />
              {
                database?.isFetched ? (
                <Box>
                  <Text fontSize="2xl" fontWeight="medium">
                    {database?.data?.data?.data?.name}
                  </Text>
                  <Text color="muted" fontSize="sm">
                    {database?.data?.data?.data?.database_type}
                  </Text>
                </Box>
                ):(
                  <Stack width={"50%"}>
                    <Skeleton startColor='#1e1e1e' endColor='#424242' height='30px' width={"100%"} />
                    <Skeleton startColor='#1e1e1e' endColor='#424242' height='20px' width={"100%"} />
                  </Stack>
                )
              }
              
            </Box>
          </Stack>
        </Stack>
      </Box>
    </Box>
  )
}

export default DatabaseDetails