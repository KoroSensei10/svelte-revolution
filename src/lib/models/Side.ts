import { DataTypes, Model } from 'sequelize';
import sequelize from '../sequelize';

class Side extends Model {}

Side.init(
	{
		name: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true
		}
	},
	{
		sequelize,
		modelName: 'Side'
	}
);

Side.belongsTo(Side);

export default Side;
