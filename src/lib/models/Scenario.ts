import { DataTypes } from 'sequelize';
import sequelize from '../sequelize';
import User from './User';
import Info from './Info';
import Session from './Session';

const Scenario = sequelize.define(
	'Scenario',
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
		modelName: 'scenario'
	}
);

Scenario.hasMany(Info);
Scenario.hasMany(Session);

export default Scenario;
