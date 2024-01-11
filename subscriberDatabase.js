import { Sequelize, DataTypes } from "sequelize";

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite',
});

const Subscriber = sequelize.define('Subscriber', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  chatId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true
  },
  botId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
})

sequelize.sync().then(() => {
  console.log('Database and tables created!');
}).catch(err => {
  console.error('Error creating database and tables:', err);
});

export const registerSubscriber = async (userId, username, chatId, botId) => {
  try {
    const result = await Subscriber.create({ userId, username, chatId, botId })
    console.log('Subscriber created successfully:', result);
    return {
      successful: true,
      data: result,
      error: null
    };
  } catch (error) {
    console.error('Error creating subscriber:', error.message);
    return {
      successful: false,
      data: null,
      error: error.message
    };
  }
}

export const getSubscribersByBotId = async (botId) => {
  try {
    const subscribers = await Subscriber.findAll({ where: { botId } })

    if (subscribers.length == 0) {
      throw new Error('No subscribers found')
    }

    return {
      successful: true,
      data: subscribers,
      error: null
    };
  } catch (error) {
    return {
      successful: false,
      data: null,
      error: error.message
    };
  }
}