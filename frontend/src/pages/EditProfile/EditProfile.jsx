import { Container, Grid, PasswordInput, TextInput, Button, Notification, Center } from "@mantine/core";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function EditProfile() {
    const location = useLocation();
    const navigate = useNavigate();
    const { userId, username: initialUsername, email: initialEmail } = location.state || {};

    const [email, setEmail] = useState(initialEmail || "");
    const [username, setUsername] = useState(initialUsername || "");
    const [newPassword, setNewPassword] = useState("");
    const [successMessage, setSuccessMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    const handleSubmit = async () => {
        try {
            await axios.put(`http://host.docker.internal:3000/api/user/${userId}`, {
                email,
                username,
                password: newPassword,
            });
            setSuccessMessage("Profile updated successfully!");
            setErrorMessage(null);
            // Redirect to Profile page after a short delay for user feedback
            setTimeout(() => {
                navigate('/profile');
                window.location.reload();
            }, 2000);
        } catch (error) {
            setErrorMessage(error.response?.data?.message || "Failed to update profile.");
            setSuccessMessage(null);
        }
    };

    return (
        <Container>
            <Center>
                <Grid>
                    <Grid.Col span={12}>
                        <TextInput
                            label="Email"
                            placeholder="Your email"
                            required
                            value={email}
                            onChange={(event) => setEmail(event.currentTarget.value)}
                        />
                    </Grid.Col>
                    <Grid.Col span={12}>
                        <TextInput
                            label="Username"
                            placeholder="Your username"
                            required
                            value={username}
                            onChange={(event) => setUsername(event.currentTarget.value)}
                        />
                    </Grid.Col>
                    <Grid.Col span={12}>
                        <PasswordInput
                            label="New Password"
                            placeholder="Your new password"
                            value={newPassword}
                            onChange={(event) => setNewPassword(event.currentTarget.value)}
                        />
                    </Grid.Col>
                    <Grid.Col span={12}>
                        <Button onClick={handleSubmit}>Update Profile</Button>
                    </Grid.Col>
                    {successMessage && (
                        <Notification color="green" onClose={() => setSuccessMessage(null)}>
                            {successMessage}
                        </Notification>
                    )}
                    {errorMessage && (
                        <Notification color="red" onClose={() => setErrorMessage(null)}>
                            {errorMessage}
                        </Notification>
                    )}
                </Grid>
            </Center>
        </Container>
    );
}

export default EditProfile;
