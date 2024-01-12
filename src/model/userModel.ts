import sequelize from "@/db/database"
import { UserModel } from "@/interface/types";
import { DataTypes } from "sequelize";
import bcrypt from "bcrypt";

const User = sequelize.define<UserModel>('User', {
  id: {
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER.UNSIGNED,
  },
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      len: [3, 12],
      validate: {
        isAllowedCharacters: (value: string) => {
          if (!/\w+/.test(value)) {
            throw new Error('Username can only contain latin letters and digits')
          }
        }
      }
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: {
        msg: 'Invalid email format',
      },
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isStrongPassword: (value: string) => {
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}/.test(value)) {
          throw new Error('Password must be at least 8 characters long and contain at least 1 uppercase letter, 1 numeral, and 1 special character.');
        }
      },
    },
  },
}, {
  hooks: {
    beforeCreate: async (user) => {
      // Generate a salt and hash the password before creating the user
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
      const hashedPassword = await bcrypt.hash(user.password, salt);

      user.password = hashedPassword;
    },
  },
});

// Sync model with the database
sequelize.sync().then(() => {
  console.log('Database and tables created!');
}).catch(err => {
  console.error('Error creating database and tables:', err);
});

export default User