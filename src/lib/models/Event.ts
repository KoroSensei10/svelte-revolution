import { DataTypes, Model } from 'sequelize';
import sequelize from '../sequelize';

class Event extends Model {}

Event.init(
	{
		title: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true
		},
		prologue: {
			type: DataTypes.TEXT,
			allowNull: false
		},
		author: {
			type: DataTypes.STRING,
			allowNull: false
		}
	},
	{
		sequelize,
		modelName: 'Event'
	}
);

Event.belongsTo(Info, {
	foreignKey: 'infoId',
	as: 'info'
});

export default Event;
