import { useState, useEffect } from "react";
import {
  Container,
  Title,
  Text,
  Paper,
  Stack,
  Avatar,
  Group,
  Button,
} from "@mantine/core";
import { useAuth } from "../../store/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(
        "http://host.docker.internal:3000/api/user/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Fetched profile data:", response.data);
      setUserInfo(response.data.response);
      setLoading(false);
    } catch (err) {
        console.error("Failed to fetch profile:", err);
      setError("Failed to load profile information");
      setLoading(false);
    }
  };

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text c="red">{error}</Text>;

  return (
    <Container size="sm" py="xl">
      <Paper shadow="sm" radius="md" p="xl">
        <Stack spacing="lg">
          <Group position="apart">
            <Title order={2}>Profile Information</Title>
            <Button
              variant="light"
              style={{ cursor: "pointer" }}
              onClick={() =>
                navigate(`/Profile/${userInfo._id}`, {
                  state: {
                    userId: userInfo._id,
                    username: userInfo.username,
                    email: userInfo.email,
                  },
                })
              }
            >
              Edit Profile
            </Button>
          </Group>

          <Group>
            <Avatar size="xl" radius="xl" color="blue">
              {userInfo?.username?.charAt(0).toUpperCase()}
            </Avatar> 
            <div>
              <Text size="xl" weight={500}>
                {userInfo?.username || "Unknown"}
              </Text>
              <Text c="dimmed" size="sm">
                {userInfo?.role || "N/A"}
              </Text>
            </div>
          </Group>

          <Stack spacing="xs">
            <Text>
              <strong>Email:</strong> {userInfo?.email || "N/A"}
            </Text>
            <Text>
              <strong>Role:</strong> {userInfo?.role || "N/A"}
            </Text>
            <Text>
              <strong>Member Since:</strong>{" "}
              {userInfo?.createdAt
                ? new Date(userInfo.createdAt).toLocaleDateString()
                : "N/A"}
            </Text>
          </Stack>
        </Stack>
      </Paper>
    </Container>
  );
}

export default Profile;
