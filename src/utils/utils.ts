class Utils {
    hasValNotEmpty(obj: any, key: any) {
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

      isNumber(value: any) : Boolean {
        return (typeof value == "number" || typeof value == "string" && value.match(/^[0-9]+$/))? true: false;
      }

      isUUid(value: any) : Boolean {
        return typeof value == "string" && value.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i) ? true: false;
      }
}

export default new Utils();