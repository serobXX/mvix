export const isUserProfileValid = user => {
  if (!user) {
    return false
  }
  return user.appointmentLink && user.userSignature
}
