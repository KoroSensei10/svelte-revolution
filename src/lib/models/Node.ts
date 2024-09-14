import { DataTypes, Model } from 'sequelize';
import sequelize from '../sequelize';
import Side from './Side';

class Node extends Model { }

Node.init(
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true
		},
		sessionId: {
			type: DataTypes.INTEGER,
			primaryKey: true
		},
		title: {
			type: DataTypes.STRING,
			allowNull: false
		},
		text: {
			type: DataTypes.STRING,
			allowNull: false
		},
		author: {
			type: DataTypes.STRING,
			allowNull: false
		},
		type: {
			type: DataTypes.ENUM,
			allowNull: false,
			values: ['contribution', 'event', 'startNode'],
			defaultValue: 'contribution'
		}
	},
	{
		sequelize,
		modelName: 'Node'
	}
);

Node.hasOne(Node, {
	foreignKey: {
		name: 'parentId',
		allowNull: true
	}
});

Node.hasOne(Side);

export default Node;
