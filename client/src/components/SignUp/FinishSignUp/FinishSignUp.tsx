import styles from './FinishSignUp.module.scss';
import { useForm, SubmitHandler } from 'react-hook-form';
import Cookies from 'js-cookie';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { login } from '../../../app/slices/userSlice';
import { useAppDispatch } from '../../../app/hooks';
import { useNavigate } from 'react-router-dom';

interface FinishSignUpProps {
	email: string;
}

interface FormValues {
	password: string;
	username: string;
	displayName: string;
}

export interface UserInfoPayload extends JwtPayload {
	UserInfo: {
		email: string;
		sub: string;
		username: string;
		displayName: string;
	};
}

const FinishSignUp: React.FC<FinishSignUpProps> = ({ email }) => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormValues>();

	const onSubmit: SubmitHandler<FormValues> = async (data) => {
		const { password, username, displayName } = data;

		const signUpResponse = await fetch(
			`http://localhost:3000/api/auth/signup`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email, password, username, displayName }),
				credentials: 'include',
			}
		);

		const signUpData = await signUpResponse.json();
		const accessToken = signUpData.accessToken;
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
			<form onSubmit={handleSubmit(onSubmit)}>
				<input
					id="password"
					type="password"
					{...register('password', { required: 'Please enter a password' })}
					placeholder="Enter a password"
				/>
				{errors.password && <p>{errors.password.message}</p>}
				<input
					id="username"
					type="text"
					{...register('username', { required: 'Please enter a username' })}
					placeholder="Enter a username"
				/>
				{errors.username && <p>{errors.username.message}</p>}
				<input
					id="displayName"
					type="text"
					{...register('displayName', {
						required: 'Please enter a display name',
					})}
					placeholder="Enter a display name"
				/>
				{errors.displayName && <p>{errors.displayName.message}</p>}
				<button type="submit">Sign Up</button>
			</form>
		</div>
	);
};

export default FinishSignUp;
