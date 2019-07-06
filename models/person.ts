// Libraries
import * as mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'
// Types
import { IUser } from './user'

export interface ISpecialEvent {
  type: string,
  date: string,
  notifyByEmail: boolean
}

export interface IBirth {
  date: string,
  notifyByEmail: boolean
}

export interface IPerson extends mongoose.Document {
  user: string | IUser
  name: string
  birth: IBirth
  relative: string
  relation: string[]
  _id: string
  likes: string[],
  dislikes: string[],
  specialEvents: ISpecialEvent[]
}

// Schema
const schema = new mongoose.Schema({
  birth: {
    date: {
      required: true,
      type: Date
    },
    notifyByEmail: {
      required: true,
      type: Boolean
    }
  },
  dislikes: [String],
  likes: [String],
  name: {
    minlength: 1,
    required: true,
    type: String
  },
  relation: {
    required: true,
    type: String
  },
  relative: {
    requied: true,
    type: Boolean
  },
  specialEvents: [
    {
      type: {
        type: String,
        required: true,
        unique: true
      },
      date: {
        type: String,
        required: true
      },
      notifyByEmail: {
        type: Boolean,
        required: true,
        default: true
      }
    }
  ],
  user: {
    required: true,
    ref: 'User',
    type: mongoose.Schema.Types.ObjectId
  }
})

schema.set('toJSON', {
  transform: (_, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

schema.plugin(uniqueValidator)

export default mongoose.model<IPerson>('Person', schema)
