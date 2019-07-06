// Libraries
import * as mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'
// Types

export interface IUser extends mongoose.Document {
  username: string
  email: string
  passwordHash: string
  persons: string[]
  _id: string
  confirmation: boolean
  allowEmailNotifications: boolean
}

const schema = new mongoose.Schema({
  allowEmailNotifications: {
    default: true,
    required: true,
    type: Boolean
  },
  confirmed: {
    default: false,
    required: true,
    type: Boolean
  },
  email: {
    required: [true, 'Blank email'],
    type: String,
    unique: [true, 'Email already in use']
  },
  passwordHash: {
    required: [true, 'Blank password'],
    type: String
  },
  persons: [
    {
      ref: 'Person',
      type: mongoose.Schema.Types.ObjectId
    }
  ],
  username: {
    required: [true, 'Blank username'],
    type: String,
    unique: [true, 'Username taken']
  },
})

schema.set('toJSON', {
  transform: (_, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.passwordHash
    delete returnedObject.__v
  }
})

schema.plugin(uniqueValidator)

export default mongoose.model<IUser>('User', schema)
