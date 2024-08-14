import styles from './SignUp.module.scss';
import { useState, useEffect } from 'react';
import CheckEmail from '../../../components/SignUp/CheckEmail/CheckEmail';
import FinishSignUp from '../../../components/SignUp/FinishSignUp/FinishSignUp';

const SignUp = () => {
	const [email, setEmail] = useState<string>('');

	return (
		<div>
			<h1>Sign Up</h1>
			{email === '' ? (
				<CheckEmail setEmail={setEmail} />
			) : (
				<FinishSignUp email={email} />
			)}
		</div>
	);
};

export default SignUp;
