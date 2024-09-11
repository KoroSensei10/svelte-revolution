import { DataTypes, Model } from 'sequelize';
import sequelize from '../sequelize';
import Message from './Message';
import Scenario from './Scenario';

class Session extends Model { }

Session.init(
	{
		name: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true
		}
	},
	{
		sequelize,
		modelName: 'Session',
	}
);

Session.hasMany(Message, {
	foreignKey: 'sessionId'
});
Session.belongsTo(Scenario, {
	foreignKey: 'scenarioId'
});

export default Session;
