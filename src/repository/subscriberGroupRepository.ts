import { Result, SubscriberGroupModel } from "@/interface/types"
import SubscriberGroup from "@/model/subscriberGroupModel"
import Subscriber from "@/model/subscriberModel"

export const createSubscriberGroup = async (code: string): Promise<Result<SubscriberGroupModel>> => {
  try {
    const result = await SubscriberGroup.create({ code })

    console.log('Subscriber group created successfully:', result);
    return {
      successful: true,
      data: result,
      error: null
    };
  } catch (error) {
    const err = error as Error
    console.error('Error creating subscriber group:', err.message);
    
    return {
      successful: false,
      data: null,
      error: err.message
    };
  }
}

export const getGroupWithSubscribersById = async (id: number): Promise<Result<SubscriberGroupModel>> => {
  try {
    const result = await SubscriberGroup.findOne({ where: {id}, include: Subscriber })

    if (!result) {
      throw new Error('Group not found')
    }

    return {
      successful: true,
      data: result,
      error: null
    }
  } catch (error) {
    const err = error as Error;
    console.error('Error getting subscriber group:', err.message)

    return {
      successful: false,
      data: null,
      error: err.message
    }
  }
}