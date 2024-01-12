import sequelize from "@/db/database";
import { ScheduledMessageModel } from "@/interface/types";
import { DataTypes } from "sequelize";

const ScheduledMessage = sequelize.define<ScheduledMessageModel>('ScheduledMessage', {
  text: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  datetime: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  completed: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  }
})

sequelize.sync().then(() => {
  console.log('Database and tables created!');
}).catch(err => {
  console.error('Error creating database and tables:', err);
});

export default ScheduledMessageModel