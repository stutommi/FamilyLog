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

const htmlMessageBirthDay = (name: string, birth: string): string => `
<h1>
  ${name} has a Birthday coming up in one week!
</h1>

<p>
  Birthday hero will turn ${moment().add(8, 'days').diff(birth, 'years')} on
  ${moment().add(7, 'days').format('dddd, D.MM.YYYY')}
</p>

<p>
  Best regards,
</p>

<p>
  FamilyLog
</p>
`

const htmlMessageSpecialEvent = (name: string, type: string, date: string): string => `
<h1>
  Special occasion: ${type} in one week with ${name}!
</h1>

<p>
  ${moment().add(8, 'days').diff(date, 'years')} ago was the first time of ${type}.
  The exact date is ${moment().add(7, 'days').format('dddd, D.MM.YYYY')}
</p>

<p>
  Best regards,
</p>

<p>
  FamilyLog
</p>
`

// This function is responsible of sending email notifications to users,
// when person from their log information has birthday or special occasion coming.
// It informs the user one week before the event.
export const alertEventWithEmail = async () => {
  console.log('moment()', moment().dayOfYear())
  try {
    const personArray: IPerson[] = await Person.find({}).populate('user')

    personArray.forEach(person => {
      const weekFromBirthDayAsDayOfYear = moment(person.birth).subtract(7, 'days').dayOfYear()
      // @ts-ignore
      const nowAsDayOfYear = moment().dayOfYear()


      // @ts-ignore
      const email = person.user.email

      // Send mail notification if birthday is 7 days away
      if (weekFromBirthDayAsDayOfYear - nowAsDayOfYear === 0) {
        transporter.sendMail({
          html: htmlMessageBirthDay(person.name, person.birth),
          subject: `${person.name}s birthday in 7 days`,
          to: email
        })
      }

      if (person.specialEvents !== undefined) {
        const specialEventsWeekFromNow = person.specialEvents
          .reduce((acc: any, cur: ISpecialEvent) => {

            // Skip if shouldn't notify by email
            if (!cur.notifyByEmail) {
              return acc
            }

            // If special event is a week away, return it to array
            if (moment(cur.date).subtract(7, 'days').dayOfYear() - nowAsDayOfYear === 0) {
              acc.push(cur)
            }
          }, [])

        // send mail if special event is 7 days away
        if (specialEventsWeekFromNow.length > 0) {
          specialEventsWeekFromNow.forEach((event: ISpecialEvent) => {
            transporter.sendMail({
              html: htmlMessageSpecialEvent(person.name, event.type, event.date),
              subject: `${event.type} with ${person.name} in 7 days`,
              to: email
            })
          })
        }
      }
    })

  } catch (error) {
    logger.error(error)
  }
}

/*



*/