import { DataTypes } from 'sequelize';
import sequelize from '../sequelize';
import Scenario from './Scenario';
import Session from './Session';

const User = sequelize.define(
	'User',
	{
		mail: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			validate: {
				isEmail: true
			}
		},
		username: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false
			// validate: {
			// 	len: [8, 100]
			// }
		}
	},
	{
		modelName: 'User'
	}
);

User.hasMany(Scenario, { foreignKey: 'creatorId' });
User.hasMany(Session, { foreignKey: 'creatorId' });

export default User;
