import { model, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { assign, values } from 'lodash';
import { paginationAndDownload, toJSON } from './plugins';
import { Status } from '../enums';
import { Gender } from '../enums/users';
import { IUser, IUserModel } from '../interfaces/users';

const userSchema: Schema<IUser> = new Schema<IUser>(
  {
    name: {
      first: {
        type: String,
        trim: true,
        required: true,
      },
      last: {
        type: String,
        trim: true,
        required: true,
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    isEmailVerified: {
      type: Boolean,
    },
    password: {
      type: String,
      trim: true,
      minlength: 8,
      validate(value: string) {
        if (!value.match(/\d/g) || !value.match(/[a-z]/g) || !value.match(/[A-Z]/g) || !value.match(/[!"#$%&'()*+.:;<=>?@^_`{|}~-]/g)) {
          throw new Error('Password must contain at least one upper and lower letter, one number and one special character');
        }
      },
      private: true, // used by the toJSON plugin
    },
    gender: {
      type: String,
      enum: values(Gender),
    },
    RoleIds: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: 'roles',
        },
      ],
    },
    status: {
      type: String,
      enum: values(Status),
    },
    isPending: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'users',
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'users',
    },
  },
  {
    timestamps: true,
  },
);

// add plugin pagination and download for populate
userSchema.plugin(paginationAndDownload);

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);

// Check if email is taken
userSchema.statics.isEmailTaken = async function (email: string, excludeUserId?: string): Promise<boolean> {
  const user = this as IUserModel;

  const query = { email };

  if (excludeUserId) {
    assign(query, { _id: { $ne: excludeUserId } });
  }

  const userInfo = await user.findOne(query);

  return !!userInfo;
};

// Check if password matches the user's password
userSchema.methods.isPasswordMatch = async function (password: string): Promise<boolean> {
  const user = this as IUser;

  return bcrypt.compare(password, user.password);
};

userSchema.pre('save', async function (next) {
  const user = this as IUser;

  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

export default model<IUser, IUserModel>('users', userSchema);
