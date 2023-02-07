export const EMAIL_REGEX = /^[\w\d~!$%^&*_=+}{'?\-.]+@((?!_)[\w\d\-.])*\.[\w\d]+$/;

export const isEmail = (domain: string): boolean => {
  return EMAIL_REGEX.test(domain)
}
