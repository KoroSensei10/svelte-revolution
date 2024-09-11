import { DataTypes } from 'sequelize';
import sequelize from '../sequelize';
import Info from './Info';

class Scenario extends Info {}

Scenario.init(
	{
		name: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true
		},
		prologue: {
			type: DataTypes.TEXT,
			allowNull: false
		}
	},
	{
		sequelize,
		modelName: 'Scenario'
	}
);

export default Scenario;
