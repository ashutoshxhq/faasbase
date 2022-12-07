import { Command } from 'cmdk';
import React, { useState } from 'react'
import * as Popover from '@radix-ui/react-popover'
import { Box, Button, Icon, Tooltip } from '@chakra-ui/react';
import { FiPlus, FiSearch, FiShoppingBag, FiUserPlus } from 'react-icons/fi';
import './../../styles.scss'
import { FaAws, FaStoreAlt } from 'react-icons/fa';
import { SiKubernetes } from 'react-icons/si';

const CommandBar = () => {
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = React.useState(false)

    React.useEffect(() => {
        const down = (e: any) => {
            if (e.key === 'k' && e.metaKey) {
                setOpen((open) => !open)
            }
        }

        document.addEventListener('keydown', down)
        return () => document.removeEventListener('keydown', down)
    }, [])

    return (
        <Popover.Root open={open} onOpenChange={setOpen}>
            <Tooltip label={"Global Search"} placement='right'>
                <Box width={"100%"} display="flex" justifyContent={"center"} alignItems={"center"}>
                    <Popover.Trigger>

                        <Button as={Box} variant="ghost" justifyContent="center" _hover={{ backgroundColor: "whiteAlpha.200" }} _active={{ backgroundColor: "whiteAlpha.200" }} w={12} h={12} borderRadius={"8px"} p={0}>
                            <Icon as={FiSearch} boxSize="6" color="subtle" />
                        </Button>
                    </Popover.Trigger>
                </Box>
            </Tooltip>

            <Popover.Portal container={document.getElementById("command-bar-root")}>
                <Popover.Content className='command-bar raycast'>
                    <Command>
                        <Box className='dark'>
                            <div cmdk-raycast-top-shine="" />
                            <Command.Input placeholder='Type a command or search' />
                            <hr cmdk-raycast-loader="" />
                            <Command.List>
                                {loading && <Command.Loading>Hang on…</Command.Loading>}

                                <Command.Empty>No results found.</Command.Empty>

                                <Command.Item>
                                    <Box borderRadius={4} bg={"#ffffff14"} padding={1}>
                                        <FiPlus />
                                    </Box>
                                    Create New Function
                                </Command.Item>
                                <Command.Item><Box borderRadius={4} bg={"#ffffff14"} padding={1}>
                                    <FiPlus />
                                </Box>Create New Application</Command.Item>
                                <Command.Item> <Box borderRadius={4} bg={"#ffffff14"} padding={1}>
                                    <FaAws />
                                </Box>Add AWS Account</Command.Item>
                                <Command.Item>
                                    <Box borderRadius={4} bg={"#ffffff14"} padding={1}>
                                        <SiKubernetes />
                                    </Box>
                                    Add Kubernetes Cluster</Command.Item>
                                <Command.Item>
                                    <Box borderRadius={4} bg={"#ffffff14"} padding={1}>
                                        <FiUserPlus />
                                    </Box>
                                    Invite Team Member</Command.Item>
                                <Command.Item>
                                    <Box borderRadius={4} bg={"#ffffff14"} padding={1}>
                                        <FiShoppingBag />
                                    </Box>
                                    Function Marketplace</Command.Item>
                                <Command.Item>
                                    <Box borderRadius={4} bg={"#ffffff14"} padding={1}>
                                        <FiShoppingBag />
                                    </Box>Application Marketplace</Command.Item>
                                <Command.Item>
                                    <Box borderRadius={4} bg={"#ffffff14"} padding={1}>
                                        <FiShoppingBag />
                                    </Box>Template Marketplace</Command.Item>
                            </Command.List>

                            <div cmdk-raycast-footer="">
                                <RaycastDarkIcon />

                                <button cmdk-raycast-open-trigger="">
                                    Open Application
                                    <kbd>↵</kbd>
                                </button>

                            </div>

                        </Box>
                    </Command>
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>

    )
}

export default CommandBar

function RaycastDarkIcon() {
    return (
        <svg width="1024" height="1024" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.workspace/2000/svg">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M301.144 634.799V722.856L90 511.712L134.244 467.804L301.144 634.799ZM389.201 722.856H301.144L512.288 934L556.34 889.996L389.201 722.856ZM889.996 555.956L934 511.904L512.096 90L468.092 134.052L634.799 300.952H534.026L417.657 184.679L373.605 228.683L446.065 301.144H395.631V628.561H723.048V577.934L795.509 650.395L839.561 606.391L723.048 489.878V389.105L889.996 555.956ZM323.17 278.926L279.166 322.978L326.385 370.198L370.39 326.145L323.17 278.926ZM697.855 653.61L653.994 697.615L701.214 744.834L745.218 700.782L697.855 653.61ZM228.731 373.413L184.679 417.465L301.144 533.93V445.826L228.731 373.413ZM578.174 722.856H490.07L606.535 839.321L650.587 795.269L578.174 722.856Z"
                fill="#FF6363"
            />
        </svg>
    )
}
