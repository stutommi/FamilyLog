// Libraries
import mongoose from 'mongoose'
import moment from 'moment'
// Utils
import { transporter } from './utils/mailConfig'
import logger from './utils/logger'
// Models
import Person from './models/person'
import User from './models/user'
// Types
import { IUser } from './models/user'
import { IPerson, ISpecialEvent } from './models/person'

// This function is responsible of sending email notifications to users,
// when person from their log information has birthday or special occasion coming.
// It informs the user one week before the event.
export const alertEventWithEmail = async () => {
  console.log('moment()', moment().dayOfYear())
  try {
    const personArray: IPerson[] = await Person.find({})

    personArray.forEach(person => {
      const weekFromBirthDayAsDayOfYear = moment(person.birth).subtract(7, 'days').dayOfYear()
      // @ts-ignore
      const nowAsDayOfYear = moment().dayOfYear()

      const specialEventsWeekFromNow = person.specialEvents
        .reduce((acc: any, cur: ISpecialEvent) => {

          // Skip if shouldn't notify by email
          if (!cur.notifyByEmail) {
            return acc
          }

          // If special event is a week away, return it to array
          if (moment(cur.date).subtract(7, 'days').dayOfYear() - nowAsDayOfYear === 0) {
            acc.push({
              type: cur.type,
              date: cur.date,
            })
          }
          }, [])




      if (weekFromBirthDayAsDayOfYear - nowAsDayOfYear === 0) {

      }
    })

  } catch (error) {
    logger.error(error)
  }
}

/*

        transporter.sendMail({
          html: `Please click this email to confirm your email: <a href="${url}">${url}</a>`,
          subject: 'Confirm Email',
          to: email
        })

*/