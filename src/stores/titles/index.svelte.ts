import { dev } from '$app/environment';

class Titles {
	mainTitle = $state('Babel Révolution');

	setMainTitle(title: string) {
		if (dev && !this.mainTitle.includes('DEV -')) {
			this.mainTitle = 'DEV - ' + title;
		} else {
			this.mainTitle = title;
		}
	}
}

export const titles = new Titles();
