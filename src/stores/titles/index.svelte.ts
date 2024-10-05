class Titles {
	mainTitle = $state('Babel Révolution');

	setMainTitle(title: string) {
		if (import.meta.env.VITE_BRANCH_NAME) {
			title += ` (${import.meta.env.VITE_BRANCH_NAME})`;
		}
		this.mainTitle = title;
	}
}

export const titles = new Titles();
