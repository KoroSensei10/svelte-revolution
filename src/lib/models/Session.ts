import { DataTypes, Model } from 'sequelize';
import sequelize from '../sequelize';
import Scenario from './Scenario';
import Node from './Node';

class Session extends Model {}

Session.init(
	{
		name: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true
		},
		image: {
			type: DataTypes.STRING,
			allowNull: true
		},
		completed: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false
		},
		public: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: true
		},
		visible: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: true
		}
	},
	{
		sequelize,
		modelName: 'Session'
	}
);

Session.hasMany(Node, {
	foreignKey: 'sessionId'
});
Session.belongsTo(Scenario, {
	foreignKey: 'scenarioId'
});

export default Session;
