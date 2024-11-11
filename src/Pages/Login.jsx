import React from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from 'react-router-dom';
import { useState } from "react";
import { Box, Paper, TextField, Button as MuiButton, Stack, Typography } from "@mui/material";
import MyButton from "../Components/Button";
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';

const requestFormUrl = "https://docs.google.com/forms/d/e/1FAIpQLSdnzIE5u7dGyqt3qfcFstCCYsDW7Hskc6lQtDEGkmvgLd2bbA/viewform?usp=sf_link";

const Login = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [verifying, setVerifying] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const navigate = useNavigate();
	const toast_config = {position: toast.POSITION.TOP_CENTER, autoClose:2000};

	const handleSubmit = async () => {
		if (password === "") {
			setErrorMessage("Please enter a password");
		} else {
			setVerifying(true);
			try {
				let userCredential = await signInWithEmailAndPassword(auth, email, password);
				console.log(`Signed in as ${userCredential.user.email}`);
				toast('Logged in!', toast_config);
				navigate("/");
			} catch(error) {
				if (error.message.includes("auth/user-not-found") || error.message.includes("auth/invalid-email")) {
					setErrorMessage("Invalid email");
				} else if (error.message.includes("auth/wrong-password")) {
					setErrorMessage("Incorrect password");
				} else {
					setErrorMessage("Unknown error occurred");
				}
			};
			setVerifying(false);
		}
	};

	return (
		<Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
			<Paper sx={{ maxWidth: 400, p: 3 }}>
				<Stack alignItems="center" spacing={1}>
					<Typography variant="h3" textAlign="center">
						Log in for admin access to modify control panel.
					</Typography>
					<MuiButton
						variant="text"
						sx={{ typography: "link" }}
						onClick={() => window.open(requestFormUrl, "_blank")}
					>
						Request an account
					</MuiButton>
					<TextField
						variant="filled"
						label="Email"
						value={email}
						onChange={e => setEmail(e.target.value)}
						error={errorMessage.includes("email")}
					/>
					<TextField
						variant="filled"
						label="Password"
						type="password"
						value={password}
						onChange={e => setPassword(e.target.value)}
						error={errorMessage.includes("password")}
					/>
					{errorMessage && <Typography variant="body1" color="error">{errorMessage}</Typography>}
					{verifying ? (
						<MyButton disabled>Logging in...</MyButton>
					) : (
						<MyButton onClick={handleSubmit}>Login</MyButton>
					)}
					<MyButton
						variant="text"
						sx={{ typography: "link" }}
						onClick={() => navigate("/reset-password")}
					>
						Forgot password?
					</MyButton>
				</Stack>
			</Paper>
		</Box>
	);
};

export default Login
