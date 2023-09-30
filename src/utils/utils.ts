class Utils {
  constructor() { }
  public static hasValNotEmpty(obj: any, key: any) {
    if (obj === null) return false;
    if (typeof obj !== 'object') return false;

    if (key === null) return false;
    if (typeof key === 'undefined') return false;
    if (typeof key === 'string' && key === '') return false;

    if (obj[key] === null) return false;
    if (typeof obj[key] === 'undefined') return false;
    if (typeof obj[key] === 'string' && obj[key] === '') return false;
    if (typeof obj[key] === 'number' && obj[key] === 0) return false;

    return true;
  }

  public static isNumber(value: any): Boolean {
    return (typeof value == "number" || typeof value == "string" && value.match(/^[0-9]+$/)) ? true : false;
  }

  public static isUUid(value: any): Boolean {
    return typeof value == "string" && value.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i) ? true : false;
  }

  /**
   * validator
   * length must be 8
   * no special character allowed
   * 
   * @param value 
   * @returns Boolean
   */
  public static isNoSpecialWithLenght8(value: string): Boolean {
    return (typeof value === "string" && value.length == 8 && value.match(/^[a-zA-Z0-9]+$/i)) ? true : false;
  }

  public static validateDateFormat(value: any) {
    value = Utils.isNumber(value) ? parseInt(value) : value;

    if (typeof value !== "number")
      throw new Error('Incorrect Date Value!');

    let date: any = new Date(value);
    if (date == "Invalid Date")
      throw new Error('Incorrect Date Value!');
  }
}

export default Utils;