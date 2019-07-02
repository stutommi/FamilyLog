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
  confirmation: Boolean
}

const schema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Blank username'],
    unique: [true, 'Username taken']
  },
  email: {
    type: String,
    required: [true, 'Blank email'],
    unique: [true, 'Email already in use']
  },
  passwordHash: {
    type: String,
    required: [true, 'Blank password']
  },
  confirmed: {
    type: Boolean,
    required: true,
    default: false
  },
  persons: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Person'
    }
  ]
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