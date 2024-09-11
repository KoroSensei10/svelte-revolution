import { DataTypes } from 'sequelize';
import sequelize from '../sequelize';
import Scenario from './Scenario';
import Session from './Session';

const User = sequelize.define(
	'User',
	{
		username: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false
		}
	},
	{
		modelName: 'User'
	}
);

User.hasMany(Scenario, { foreignKey: 'creatorId' });
User.hasMany(Session, { foreignKey: 'creatorId' });

export default User;
