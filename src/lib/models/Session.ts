import { DataTypes } from 'sequelize';
import sequelize from '../sequelize';
import Message from './Message';

const Session = sequelize.define(
	'Session',
	{
		name: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true
		}
	},
	{
		modelName: 'session'
	}
);

Session.hasMany(Message);

export default Session;
