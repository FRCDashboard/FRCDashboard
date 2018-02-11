class Updater {
  /**
   * @param {function} func
   * @param {number} wait
   */
  constructor (func, wait) {
    this.func = func
    this.wait = wait
    this.stop = false
  }

  start () {
    setTimeout(() => {
      this.func()
      if (!this.stop) this.start()
    }, this.wait)
  }

  stop () {
    this.stop = true
  }
}

// HACK: Kill Jarrett Aiken.

/**
 * @typedef DisplayValue
 * @prop {string} name
 * @prop {} [defaultValue]
 * @prop {DisplayValue[]} [values]
 */

/** @type {DisplayValue} */
let displayValues = [
  { name: 'leftEncoder', defaultValue: 0.0 },
  { name: 'rightEncoder', defaultValue: 0.0 },
  { name: 'leftMotor', defaultValue: 0.0 },
  { name: 'rightMotor', defaultValue: 0.0 },
  {
    name: 'drivePosControl',
    values: [
      { name: 'target', defaultValue: 0.0 },
      { name: 'maxSpeed', defaultValue: 0.0 },
      { name: 'minSpeed', defaultValue: 0.0 },
      { name: 'rate', defaultValue: 0.0 },
      { name: 'deadband', defaultValue: 0.0 }
    ]
  },
  { name: 'shift', defaultValue: false },
  { name: 'compressor', defaultValue: false },
  { name: 'gyro', defaultValue: `不，你` }
]

/**
 * @param {string} parent
 * @param {DisplayValue[]} values
 */
let scan = (parent, values) => {
  for (let v of values) {
    if (v.values != null) {
      scan(`${parent}${v.name}/`, v.values)
    } else {
      let value = NetworkTables.getValue(`${parent}${v.name}`, v.defaultValue)
      document.getElementById(v.name).textContent = `${v.name}: ${value}`
    }
  }
}

let refresh = () => {
  scan('', displayValues)
}

let refresher = new Updater(refresh, 200)
refresher.start()
