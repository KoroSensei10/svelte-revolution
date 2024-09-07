import { DataTypes } from 'sequelize';
import sequelize from '../sequelize';

const Info = sequelize.define(
	'Info',
	{
		title: {
			type: DataTypes.STRING,
			allowNull: false
		},
		text: {
			type: DataTypes.TEXT,
			allowNull: false
		},
		origin: DataTypes.BOOLEAN,
		type: DataTypes.STRING // décret/fins/prologue
	},
	{
		modelName: 'info'
	}
);

export default Info;
