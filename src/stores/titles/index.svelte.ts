import { env } from '$env/dynamic/public';

const BRANCH_NAME = env.PUBLIC_VITE_BRANCH_NAME;

function createTitleStore() {
	const mainTitle = $state('Babel Révolution');
	let navTitle = $state('Babel Révolution');
	let previousNavTitle = $state('Babel Révolution');

	function setNavTitle(title: string) {
		previousNavTitle = navTitle;
		navTitle = title;
	}

	return {
		get mainTitle() {
			return mainTitle;
		},
		get navTitle() {
			return navTitle;
		},
		get previousNavTitle() {
			return previousNavTitle;
		},
		setNavTitle
	};
}

export const titleStore = createTitleStore();
