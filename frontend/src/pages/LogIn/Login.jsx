import { useState } from 'react';
import {
    TextInput,
    PasswordInput,
    Checkbox,
    Anchor,
    Paper,
    Title,
    Text,
    Container,
    Group,
    Button,
} from '@mantine/core';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import classes from './Login.module.css';
import { useAuth } from '../../store/AuthContext';

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const location = useLocation();
    const { login } = useAuth();

    const from = location.state?.from?.pathname || '/';

    const handleSignUp = () => {
        navigate('/SignUp');
    };

    const handleLogin = async () => {
        try {
            console.log('Attempting login...'); // Debug log
            const response = await axios.post('http://localhost:3000/api/auth/login',
                { email, password,  },
                {
                    withCredentials: true,
                    headers: { 'Content-Type': 'application/json' }
                }
            );

            console.log('Login response:', response.data); // Response'u görelim

            if (response.data && response.data.token) {
                console.log('Token received:', response.data.token); // Token'ı görelim
                login(response.data.token, response.data.user);
                navigate(from, { replace: true });
            } else {
                console.log('No token in response:', response.data); // Hata durumunu görelim
                setError('Login failed: No token received');
            }
        } catch (error) {
            console.error('Login error full details:', error); // Tam hata detayı
            setError('Invalid email or password. Please try again.');
        }
    };

    return (
        <Container size={420} my={40}>
            <Title ta="center" className={classes.title}>
                Welcome back!
            </Title>
            <Text c="dimmed" size="sm" ta="center" mt={5}>
                Do not have an account yet?{' '}
                <Anchor size="sm" component="button" onClick={handleSignUp}>
                    Create account
                </Anchor>
            </Text>

            <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                {error && (
                    <Text c="red" size="sm" ta="center" mt={5}>
                        {error}
                    </Text>
                )}
                <TextInput
                    label="Email"
                    placeholder="your email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.currentTarget.value)}
                />
                <PasswordInput
                    label="Password"
                    placeholder="Your password"
                    required
                    mt="md"
                    value={password}
                    onChange={(event) => setPassword(event.currentTarget.value)}
                />
                <Button fullWidth mt="xl" onClick={handleLogin}>
                    Sign in
                </Button>
            </Paper>
        </Container>
    );
}

export default Login;