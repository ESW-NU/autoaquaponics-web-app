import React, { useContext, useState } from 'react';
import { TextField, Button, Switch, FormControlLabel, Paper, Typography, Box, MenuItem, Select, FormGroup, Stack } from '@mui/material';
import { ThemeNameContext } from '../Hooks/ThemeNameContext';

const Settings = () => {
    const { themeName, setThemeName, prefersDarkMode } = useContext(ThemeNameContext);
    const [profile, setProfile] = useState({ name: '', email: '', language: 'English' });
    const [notifications, setNotifications] = useState({ email: true, push: false, sms: false });
    const [privacy, setPrivacy] = useState({ profileVisibility: 'public', dataDownload: false });
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfile((prev) => ({ ...prev, [name]: value }));
    };

    const handleNotificationChange = (name) => {
        setNotifications((prev) => ({ ...prev, [name]: !prev[name] }));
    };

    const handlePrivacyChange = (name) => {
        setPrivacy((prev) => ({ ...prev, [name]: !prev[name] }));
    };

    const handleThemeChange = (event) => {
        setThemeName(event.target.value);
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            // Simulate an API call
            setTimeout(() => {
                console.log('Profile updated:', profile);
                console.log('Notification settings:', notifications);
                console.log('Privacy settings:', privacy);
                console.log('Selected theme:', themeName);
                setLoading(false);
            }, 1000);
        } catch (error) {
            console.error('Failed to update settings:', error);
            setLoading(false);
        }
    };

    return (
        <Paper elevation={3} sx={{ padding: 3 }}>
            <Typography variant="h6" gutterBottom>
                Settings
            </Typography>
            <Box component="form" sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' } }}>
                <Typography variant="subtitle1">Profile Information</Typography>
                <TextField
                    label="Name"
                    variant="outlined"
                    name="name"
                    value={profile.name}
                    onChange={handleInputChange}
                />
                <TextField
                    label="Email"
                    variant="outlined"
                    name="email"
                    value={profile.email}
                    onChange={handleInputChange}
                />

                <Typography variant="subtitle1" sx={{ mt: 2 }}>
                    Notification Settings
                </Typography>
                <FormGroup>
                    <FormControlLabel
                        control={<Switch checked={notifications.email} onChange={() => handleNotificationChange('email')} />}
                        label="Email Notifications"
                    />
                    <FormControlLabel
                        control={<Switch checked={notifications.push} onChange={() => handleNotificationChange('push')} />}
                        label="Push Notifications"
                    />
                    <FormControlLabel
                        control={<Switch checked={notifications.sms} onChange={() => handleNotificationChange('sms')} />}
                        label="SMS Notifications"
                    />
                </FormGroup>

                <Typography variant="subtitle1" sx={{ mt: 2 }}>
                    Theme Settings
                </Typography>
                <Stack direction="row" spacing={1}>
                    <Select
                        value={themeName}
                        onChange={handleThemeChange}
                        displayEmpty
                        inputProps={{ 'aria-label': 'Without label' }}
                    >
                        <MenuItem value='light'>Light</MenuItem>
                        <MenuItem value='dark'>Dark</MenuItem>
                        <MenuItem value='system'>System default ({prefersDarkMode ? 'Dark' : 'Light'})</MenuItem>
                    </Select>

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        disabled={loading}
                        sx={{ mt: 2 }}
                    >
                        Save Changes
                    </Button>
                </Stack>
            </Box>
        </Paper>
    );
};

export default Settings;
