import { Sequelize, DataTypes } from 'sequelize';
import bcrypt from 'bcrypt';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite',
});

const User = sequelize.define('User', {
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
      isStrongPassword: function (value) {
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

// Sync the model with the database
sequelize.sync().then(() => {
  console.log('Database and tables created!');
}).catch(err => {
  console.error('Error creating database and tables:', err);
});

export const registerUser = async (email, password) => {
  try {
    const result = await User.create({ email, password });
    console.log('User created successfully:', result);
    return {
      successful: true,
      data: result,
      error: null
    };
  } catch (error) {
    console.error('Error creating user:', error.message);
    return {
      successful: true,
      data: null,
      error: error.message
    };
  }
};

export const authenticateUser = async (email, password) => {
  try {
    // Find the user by their email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new Error('User not found');
    }

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error('Incorrect password');
    }

    // If the password is valid, you can proceed with user authentication
    console.log('Login successful:', user);
    return {
      successful: true,
      data: user,
      error: null
    };
  } catch (error) {
    console.error('Error during login:', error.message);
    return {
      successful: false,
      data: null,
      error: error.message
    };
  }
};

export const getUserById = async (id) => {
  try {
    const user = await User.findOne({ where: { id } })

    if (!user) {
      throw new Error('User not found');
    }

    return {
      successful: true,
      data: user,
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

// State object
// {
//   successful: Boolean
//   data: any
//   error: string
// }