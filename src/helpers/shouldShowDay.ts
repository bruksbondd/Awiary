import isSameDay from "date-fns/isSameDay"

export function shouldShowDay(previous: any, message: any) {


  const isFirst = !previous
  if (isFirst) {
    return true
  }

  const isNewDay = !isSameDay(
    previous.createdAt.seconds * 1000,
    message.createdAt.seconds * 1000,
  )

  return isNewDay
}
