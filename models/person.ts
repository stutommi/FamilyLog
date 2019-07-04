// Libraries
import * as mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'

export interface ISpecialEvent {
  type: string,
  date: Date,
  notifyByEmail: boolean
}

export interface IPerson extends mongoose.Document {
  user: string[]
  name: string
  birth: string
  relative: string
  relation: string[]
  _id: string
  likes: string[],
  dislikes: string[],
  specialEvents: ISpecialEvent[]
}

const schema = new mongoose.Schema({
  birth: {
    required: true,
    type: Date
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
  specialEvent: [
    {
      type: String,
      date: Date,
      notifyByEmail: Boolean
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
