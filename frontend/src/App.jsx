import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import AppRoutes from './route/appRoutes';
import { AuthProvider } from './store/AuthContext';
import '@mantine/notifications/styles.css';
import { Notifications } from '@mantine/notifications';
import '@mantine/dropzone/styles.css';


function App() {

  return (
    <AuthProvider>
        <MantineProvider>
        <Notifications />
          <AppRoutes/>
        </MantineProvider>
    </AuthProvider>
  )
}

export default App
