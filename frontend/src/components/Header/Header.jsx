import {
  IconBook,
  IconShoppingCart,
  IconUser,
  IconLogout,
} from "@tabler/icons-react";
import {
  Avatar,
  Box,
  Burger,
  Button,
  Center,
  Divider,
  Drawer,
  Group,
  Menu,
  ScrollArea,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../store/AuthContext";

import classes from "./Header.module.css";

export function Header() {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const theme = useMantineTheme();
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <Box>
      <header className={classes.header}>
        <Group justify="space-between" h="100%">
          <IconBook cursor="pointer" onClick={() => navigate("/")} />
          <Group h="100%" gap={0} visibleFrom="sm">
            <div className={classes.link} onClick={() => navigate("/")}>
              Home
            </div>
            <div className={classes.link} onClick={() => navigate("/Category")}>
              Category
            </div>
            <div className={classes.link} onClick={() => navigate("/About")}>
              About
            </div>
            <div className={classes.link} onClick={() => navigate("/Contact")}>
              Contact
            </div>
          </Group>

          <Group
            h="100%"
            align="center"
            className={classes.userAndCartGroup}
            visibleFrom="sm"
          >
            {/* User Menu */}
            <Menu shadow="md" width={200}>
              <Menu.Target>
                {isAuthenticated ? (
                  <Avatar size="md" radius="xl" color="blue">
                    {user?.username?.charAt(0).toUpperCase()}
                  </Avatar>
                ) : (
                  <div className={classes.link} onClick={() => navigate("/Login")}>
                    <IconUser size={24} />
                  </div>
                )}
              </Menu.Target>

              <Menu.Dropdown>
                {isAuthenticated ? (
                  <>
                    <Menu.Item onClick={() => navigate("/profile")}>
                      Profile
                    </Menu.Item>
                    <Menu.Item
                      onClick={handleLogout}
                      color="red"
                      leftSection={<IconLogout size={14} />}
                    >
                      Sign out
                    </Menu.Item>
                  </>
                ) : (
                  <>
                    <Menu.Item onClick={() => navigate("/Login")}>
                      Log in
                    </Menu.Item>
                    <Menu.Item c="blue" onClick={() => navigate("/SignUp")}>
                      Sign up
                    </Menu.Item>
                  </>
                )}
              </Menu.Dropdown>
            </Menu>

            <div className={classes.link} onClick={() => navigate("/Cart")}>
              <IconShoppingCart size={24} />
            </div>
          </Group>

          <Burger opened={drawerOpened} onClick={toggleDrawer} hiddenFrom="sm" />
        </Group>
      </header>

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        title="Navigation"
        hiddenFrom="sm"
        zIndex={1000000}
      >
        <ScrollArea h="calc(100vh - 80px" mx="-md">
          <Divider my="sm" />

          <div className={classes.link} onClick={() => navigate("/")}>
            Home
          </div>
          <div className={classes.link} onClick={() => navigate("/Category")}>
            Category
          </div>
          <div className={classes.link} onClick={() => navigate("/About")}>
            About
          </div>
          <div className={classes.link} onClick={() => navigate("/Contact")}>
            Contact
          </div>
          <div className={classes.link} onClick={() => navigate("/Cart")}>
            <IconShoppingCart />
          </div>
          <Divider my="sm" />

          <Group justify="center" grow pb="xl" px="md">
            {isAuthenticated ? (
              <>
                <Button variant="default" onClick={() => navigate("/profile")}>
                  Profile
                </Button>
                <Button color="red" onClick={handleLogout}>
                  Sign out
                </Button>
              </>
            ) : (
              <>
                <Button variant="default" onClick={() => navigate("/Login")}>
                  Log in
                </Button>
                <Button color="blue" onClick={() => navigate("/SignUp")}>
                  Sign up
                </Button>
              </>
            )}
          </Group>
        </ScrollArea>
      </Drawer>
    </Box>
  );
}
