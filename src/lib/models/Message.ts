import { DataTypes, Model } from 'sequelize';
import sequelize from '../sequelize';

class Message extends Model { }

Message.init(
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			unique: 'compositeIndex'
		},
		sessionId: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			unique: 'compositeIndex'
		},
		title: {
			type: DataTypes.STRING,
			allowNull: false
		},
		text: {
			type: DataTypes.STRING,
			allowNull: false
		}
	},
	{
		sequelize,
		modelName: 'Message'
	}
);

Message.hasOne(Message, {
	foreignKey: 'parentId'
});

export default Message;
