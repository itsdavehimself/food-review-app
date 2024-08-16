import styles from './Searchbar.module.scss';

const Searchbar: React.FC = () => {
	return (
		<form className={styles.searchbar}>
			<input placeholder="Search restaurant"></input>
			<input placeholder="Location"></input>
		</form>
	);
};

export default Searchbar;
