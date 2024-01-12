import { Result, SubscriberModel } from "@/interface/types";
import Subscriber from "@/model/subscriberModel";

export const registerSubscriber = async (userId: number, chatId: number, username: string): Promise<Result<SubscriberModel>> => {
  try {
    const result = await Subscriber.create({ userId, chatId, username })
    console.log('Subscriber created successfully:', result);
    return {
      successful: true,
      data: result,
      error: null
    };
  } catch (error) {
    const err = error as Error
    console.error('Error creating subscriber:', err.message);
    return {
      successful: false,
      data: null,
      error: err.message
    };
  }
}

export const getSubscriberById = async (id: number): Promise<Result<SubscriberModel>> => {
  try {
    const subscriber = await Subscriber.findOne({ where: { id } })
    
    if (!subscriber) {
      throw new Error("Subscriber not found")
    }

    console.log('Successfully found subscriber:', subscriber)
    return {
      successful: true,
      data: subscriber,
      error: null
    }
  } catch (error) {
    const err = error as Error
    console.error('Error getting subscriber:', err.message)

    return {
      successful: false,
      data: null,
      error: err.message
    }
  }
}

export const addSubscriberToGroup = async (id: number, groupId: number): Promise<Result<null>> => {
  const result = await getSubscriberById(id)

  if (!result.successful) {
    return {
      successful: false,
      data: null,
      error: result.error
    }
  }

  try {
    await result.data.addGroup(groupId)
    
    return {
      successful: true,
      data: null,
      error: null
    }
  } catch (error) {
    const err = error as Error
    console.error('Something went wrong:', err.message)

    return {
      successful: false,
      data: null,
      error: err.message
    }
  }
}