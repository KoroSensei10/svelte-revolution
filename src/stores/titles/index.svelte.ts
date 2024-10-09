import { env } from '$env/dynamic/public';

const BRANCH_NAME = env.PUBLIC_VITE_BRANCH_NAME;

class Titles {
	mainTitle = $state('Babel Révolution');

	setMainTitle(title: string) {
		if (BRANCH_NAME) {
			title += ` (${BRANCH_NAME})`;
		}
		this.mainTitle = title;
	}
}

export const titles = new Titles();
