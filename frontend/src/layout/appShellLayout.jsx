import { AppShell, Burger, Group, UnstyledButton } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Header } from "../components/Header/Header";
import { Outlet } from "react-router-dom";
import { Footer } from "../components/Footer/Footer";

export function AppShellLayout() {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShell.Header>
        <Header />
      </AppShell.Header>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>

      <Footer />
    </AppShell>
  );
}
