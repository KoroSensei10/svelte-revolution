// src/lib/sequelize.js
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize({
	dialect: 'sqlite',
	storage: './database.sqlite', // pour une DB locale
	logging: false
});

export const sync = async () => {
	await sequelize.sync();
};

export default sequelize;
