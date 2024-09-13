import { DataTypes, Model } from 'sequelize';
import sequelize from '../sequelize';

class End extends Model {}

End.init(
	{
		title: {
			type: DataTypes.STRING,
			allowNull: false
		},
		text: {
			type: DataTypes.TEXT,
			allowNull: false
		}
	},
	{
		sequelize,
		modelName: 'End'
	}
);

export default End;
