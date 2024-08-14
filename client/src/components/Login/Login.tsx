import styles from './Login.module.scss';
import { useAppDispatch } from '../../app/hooks';
import { useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { JwtPayload, jwtDecode } from 'jwt-decode';
import { login } from '../../app/slices/userSlice';
import Cookies from 'js-cookie';

interface FormValues {
	password: string;
	identifier: string;
}

export interface UserInfoPayload extends JwtPayload {
	UserInfo: {
		email: string;
		sub: string;
		username: string;
		displayName: string;
	};
}

const Login: React.FC = () => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormValues>();

	const onSubmit: SubmitHandler<FormValues> = async (data) => {
		const { identifier, password } = data;

		const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ identifier, password }),
		});

		const loginData = await loginResponse.json();
		const accessToken = loginData.accessToken;
		Cookies.set('accessToken', accessToken);

		if (accessToken) {
			const decodedToken = jwtDecode(accessToken) as UserInfoPayload;
			dispatch(login(decodedToken.UserInfo));
			navigate('/dashboard');
		} else {
			throw new Error('No access tokens found');
		}
	};

	return (
		<div>
			<h1>Login</h1>
			<form onSubmit={handleSubmit(onSubmit)}>
				<input
					id="identifier"
					type="text"
					{...register('identifier', {
						required: 'Enter your email or username',
					})}
					placeholder="Email or username"
				/>
				{errors.identifier && <p>{errors.identifier.message}</p>}
				<input
					id="password"
					type="password"
					{...register('password', { required: 'Please enter a password' })}
					placeholder="Password"
				/>
				{errors.password && <p>{errors.password.message}</p>}
				<button type="submit">Login</button>
			</form>
		</div>
	);
};

export default Login;
