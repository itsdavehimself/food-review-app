import styles from './CheckEmail.module.scss';
import { useForm, SubmitHandler } from 'react-hook-form';

interface CheckEmailProps {
	setEmail: React.Dispatch<React.SetStateAction<string>>;
}

interface FormValues {
	email: string;
}

const CheckEmail: React.FC<CheckEmailProps> = ({ setEmail }) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormValues>();

	const onSubmit: SubmitHandler<FormValues> = async (data) => {
		const { email } = data;
		const emailResponse = await fetch(`http://localhost:3000/api/auth/email`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ email }),
		});

		const availability = await emailResponse.json();

		if (availability.message === 'available') {
			setEmail(email);
		}
	};

	return (
		<div>
			<form onSubmit={handleSubmit(onSubmit)}>
				<label htmlFor="email">Email:</label>
				<input
					id="email"
					type="text"
					{...register('email', { required: 'Please enter your email' })}
					placeholder="Enter your email"
				/>
				{errors.email && <p>{errors.email.message}</p>}
				<button type="submit">Sign Up</button>
			</form>
		</div>
	);
};

export default CheckEmail;
