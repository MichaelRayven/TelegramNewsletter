import { CreationOptional, InferAttributes, InferCreationAttributes, Model, NonAttribute, BelongsToManyAddAssociationMixin, BelongsToManyRemoveAssociationMixin } from "sequelize";

export interface UserInfo {
  username: string;
  email: string;
}

export interface UserModel extends Model<InferAttributes<UserModel>, InferCreationAttributes<UserModel>> {
  id: CreationOptional<number>;
  username: string;
  email: string;
  password: string;
}

export interface SubscriberModel extends Model<InferAttributes<SubscriberModel>, InferCreationAttributes<SubscriberModel>> {
  id: CreationOptional<number>;
  userId: number,
  chatId: number,
  username: string
  groups?: NonAttribute<SubscriberGroupModel[]>;
  addGroup: BelongsToManyAddAssociationMixin<SubscriberGroupModel, SubscriberGroupModel["id"]>
  removeGroup: BelongsToManyRemoveAssociationMixin<SubscriberGroupModel, SubscriberGroupModel["id"]>
}

export interface ScheduledMessageModel extends Model<InferAttributes<ScheduledMessageModel>, InferCreationAttributes<ScheduledMessageModel>> {
  text: string,
  datetime: string,
  completed: boolean
}

export interface SubscriberGroupModel extends Model<InferAttributes<SubscriberGroupModel>, InferCreationAttributes<SubscriberGroupModel>> {
  id: CreationOptional<number>;
  code: string;
  subscribers?: NonAttribute<SubscriberModel[]>;
  addSubscriber: BelongsToManyAddAssociationMixin<SubscriberModel, SubscriberModel["id"]>
  removeSubscriber: BelongsToManyRemoveAssociationMixin<SubscriberModel, SubscriberModel["id"]>
}

export type Result<T> = {
  successful: true;
  data: T;
  error: null;
} | {
  successful: false;
  data: null;
  error: string;
}