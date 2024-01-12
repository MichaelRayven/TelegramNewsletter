import sequelize from "@/db/database";
import { SubscriberModel } from "@/interface/types";
import { DataTypes } from "sequelize";
import SubscriberGroup from "@/model/subscriberGroupModel";

const Subscriber = sequelize.define<SubscriberModel>('Subscriber', {
  id: {
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER.UNSIGNED,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  chatId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
})

Subscriber.belongsToMany(SubscriberGroup, { through: "Subscriber_SubscriberGroup" })

sequelize.sync().then(() => {
  console.log('Database and tables created!');
}).catch(err => {
  console.error('Error creating database and tables:', err);
});

export default Subscriber;