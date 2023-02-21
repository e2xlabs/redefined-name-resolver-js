export const EMAIL_REGEX = /^[\w\d~!$%^&*_=+}{'?\-.]+@((?!_)[\w\d\-.])*\.[\w\d]+$/;

export class EmailService {

  static isEmail(domain: string): boolean {
    return EMAIL_REGEX.test(domain)
  }
}
