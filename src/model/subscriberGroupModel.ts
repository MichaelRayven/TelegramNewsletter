import sequelize from "@/db/database";
import { SubscriberGroupModel } from "@/interface/types";
import { DataTypes } from "sequelize";
import Subscriber from "@/model/subscriberModel";

const SubscriberGroup = sequelize.define<SubscriberGroupModel>('SubscriberGroup', {
  id: {
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER.UNSIGNED,
  },
  code: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isAlpha: true
    }
  }
})

SubscriberGroup.belongsToMany(Subscriber, { through: "Subscriber_SubscriberGroup" })

sequelize.sync().then(async () => {
  if ((await SubscriberGroup.count()) == 0) {
    SubscriberGroup.create({ id: 0, code: "" })
  }
  console.log('Database and tables created!');
}).catch(err => {
  console.error('Error creating database and tables:', err);
});

export default SubscriberGroup