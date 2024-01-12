import { Result, UserModel } from "@/interface/types";
import User from "@/model/userModel";
import bcrypt from "bcrypt";

export const registerUser = async (email: string, username: string, password: string): Promise<Result<UserModel>> => {
  try {
    const result = await User.create({ email, username, password });
    console.log('User created successfully:', result);
    return {
      successful: true,
      data: result,
      error: null
    };
  } catch (error) {
    const err = error as Error
    console.error('Error creating user:', err.message);

    return {
      successful: false,
      data: null,
      error: err.message
    };
  }
};

export const authenticateUser = async (email: string, password: string): Promise<Result<UserModel>> => {
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
    const err = error as Error
    console.error('Error during login:', err.message);

    return {
      successful: false,
      data: null,
      error: err.message
    };
  }
};

export const getUserById = async (id: number): Promise<Result<UserModel>> => {
  try {
    const user = await User.findOne({ where: { id } })

    if (!user) {
      throw new Error('User not found');
    }

    console.log('Successfully found user:', user);
    return {
      successful: true,
      data: user,
      error: null
    };
  } catch (error) {
    const err = error as Error
    console.error('Error getting user:', err.message);

    return {
      successful: false,
      data: null,
      error: err.message
    };
  }
}

