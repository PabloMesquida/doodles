import * as NotesApi from "../network/notes_api";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { User } from "../models/user";
import { LoginCredentials } from "../network/notes_api";
import { UnauthorizedError } from "../errors/http_errors";
import { Alert, Button, Form, Modal } from "react-bootstrap";
import TextInputField from "./forms/TextInputField";
import stylesUtils from "../styles/utils.module.css";

interface LoginModalProps {
	onDismiss: () => void;
	OnLoginSuccessful: (user: User) => void;
}

const LoginModal = ({ onDismiss, OnLoginSuccessful }: LoginModalProps) => {
	const [errorText, setErrorText] = useState<string | null>(null);
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<LoginCredentials>();

	async function onSubmit(credentials: LoginCredentials) {
		try {
			const user = await NotesApi.login(credentials);
			OnLoginSuccessful(user);
		} catch (error) {
			if (error instanceof UnauthorizedError) {
				setErrorText(error.message);
			} else {
				alert(error);
			}

			console.error(error);
		}
	}

	return (
		<Modal
			show
			onHide={onDismiss}
			style={{
				backgroundColor: "#f2eecb",
			}}
		>
			<Modal.Header closeButton>
				<Modal.Title>Log In</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				{errorText && <Alert variant="danger">{errorText}</Alert>}
				<Form onSubmit={handleSubmit(onSubmit)}>
					<TextInputField
						name="username"
						label="Username"
						type="text"
						placeholder="username"
						register={register}
						registerOptions={{ required: "Required" }}
						error={errors.username}
					/>
					<TextInputField
						name="password"
						label="Password"
						type="password"
						placeholder="password"
						register={register}
						registerOptions={{ required: "Required" }}
						error={errors.password}
					/>
					<Button
						type="submit"
						disabled={isSubmitting}
						className={stylesUtils.width100}
					>
						Log In
					</Button>
				</Form>
			</Modal.Body>
		</Modal>
	);
};

export default LoginModal;
