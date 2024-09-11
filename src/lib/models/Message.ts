import { DataTypes, Model } from 'sequelize';
import sequelize from '../sequelize';
import Session from './Session';

class Message extends Model {}

Message.init(
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
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
		}
	},
	{
		sequelize,
		modelName: 'message',
		timestamps: false
	}
);

Message.belongsTo(Session, {
	foreignKey: 'sessionId'
});

export default Message;
