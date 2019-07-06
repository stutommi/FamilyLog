import moment from 'moment'
// Utils
import { transporter } from './utils/mailConfig'
import logger from './utils/logger'
// Models
import Person from './models/person'
// Types
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
  ${moment().add(8, 'days').diff(date, 'years')} years ago was the first time of ${type.toLocaleLowerCase()} with ${name}.
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

  try {
    const personArray: IPerson[] = await Person.find({}).populate('user')



    personArray.forEach(person => {

      // Skip if notifications are not allowed
      // @ts-ignore
      if (!person.user.allowEmailNotifications) {
        return
      }

      const weekFromBirthDayAsDayOfYear = moment(person.birth.date).subtract(7, 'days').dayOfYear()

      const nowAsDayOfYear = moment().dayOfYear()

      // @ts-ignore
      const email = person.user.email

      // Send mail notification if birthday is 7 days away
      // and notifications are allowed
      if (person.birth.notifyByEmail && weekFromBirthDayAsDayOfYear - nowAsDayOfYear === 0) {
        transporter.sendMail({
          html: htmlMessageBirthDay(person.name, person.birth.date),
          subject: `${person.name}s birthday in 7 days`,
          to: email
        })
      }

      // Handle emailing on special events
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

          return acc
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

    })

  } catch (error) {
    logger.error(error)
  }
}