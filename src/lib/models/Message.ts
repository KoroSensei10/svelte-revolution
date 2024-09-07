import { DataTypes } from 'sequelize';
import sequelize from '../sequelize';
import Session from './Session';

const Message = sequelize.define(
	'Message',
	{
		title: {
			type: DataTypes.STRING,
			allowNull: false
		},
		text: {
			type: DataTypes.TEXT,
			allowNull: false
		},
		belief: DataTypes.STRING,
		author: DataTypes.STRING
	},
	{
		modelName: 'message'
	}
);

Message.belongsTo(Message, { as: 'parent' });

export default Message;
