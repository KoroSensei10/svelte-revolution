class UserViewport {
	width = $state(0);
	height = $state(0);

	constructor() {
		this.update();
		window.addEventListener('resize', this.update);
	}

	update = () => {
		this.width = window.innerWidth;
		this.height = window.innerHeight;
	};
}

export const userViewport = new UserViewport();
