import { DataTypes, Model } from 'sequelize';
import sequelize from '../sequelize';

class Session extends Model {}

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
		modelName: 'session'
	}
);

export default Session;
