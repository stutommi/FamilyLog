// Libraries
import * as mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'
// Types


export interface Person extends mongoose.Document {
  user: string[]
  name: string
  birth: string
  relative: string
  relation: string[]
  _id: string
  likes: string[],
  dislikes: string[]
}

const schema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  name: {
    type: String,
    required: true,
    minlength: 1
  },
  birth: {
    type: Date,
    required: true
  },
  relative: {
    type: Boolean,
    requied: true
  },
  relation: {
    type: String,
    required: true
  },
  likes: [String],
  dislikes: [String]
})

schema.set('toJSON', {
  transform: (_, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

schema.plugin(uniqueValidator)

export default mongoose.model<Person>('Person', schema)