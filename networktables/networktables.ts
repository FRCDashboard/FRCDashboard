type clientMesg = { key: string, val: any, valType: string, id: number, flags: number }
type sendMesg = { key: string, val: any, id?: number, flags: number }
let ipc = require('electron').ipcRenderer
namespace NetworkTables {
    let keys: { [key: string]: { val: any, valType, id, flags, new: boolean } } = {},
        connectionListeners: ((connected: boolean) => any)[] = [],
        connected = false,
        globalListeners: ((key: string, value: any, isNew: boolean) => any)[] = [],
        keyListeners: { [key: string]: ((key: string, value: any, isNew: boolean) => any)[] } = {},
        robotAddress = "127.0.0.1"
    ipc.send('ready')
    ipc.on('connected', (ev, con: boolean) => {
        connected = con
        connectionListeners.map(e => e(con))
    })
    ipc.on('add', (ev, mesg: clientMesg) => {
        keys[mesg.key] = { val: mesg.val, valType: mesg.valType, id: mesg.id, flags: mesg.flags, new: true }
        globalListeners.map(e => e(mesg.key, mesg.val, true))
        if (globalListeners.length > 0) keys[mesg.key].new = false
        if (mesg.key in keyListeners) {
            keyListeners[mesg.key].map(e => e(mesg.key, mesg.val, true))
            keys[mesg.key].new = false
        }
    })
    ipc.on('delete', (ev, mesg: clientMesg) => {
        delete keys[mesg.key]
    })
    ipc.on('update', (ev, mesg: clientMesg) => {
        let temp = keys[mesg.key]
        temp.flags = mesg.flags
        temp.val = mesg.val
        globalListeners.map(e => e(mesg.key, temp.val, temp.new))
        if (globalListeners.length > 0) keys[mesg.key].new = false
        if (mesg.key in keyListeners) {
            keyListeners[mesg.key].map(e => e(mesg.key, temp.val, temp.new))
            temp.new = false
        }
    })
    ipc.on('flagChange', (ev, mesg: clientMesg) => {
        keys[mesg.key].flags = mesg.flags
    })

    var d3_map = function () {

        this._ = Object.create(null);

        this.forEach = function (f) {
            for (var key in this._) f.call(this, d3_map_unescape(key), this._[key]);
        };

        this.get = function (key) {
            return this._[d3_map_escape(key)];
        };

        this.getKeys = function () {
            var keys = [];
            for (var key in this._) keys.push(d3_map_unescape(key));
            return keys;
        };

        this.has = function (key) {
            return d3_map_escape(key) in this._;
        };

        this.set = function (key, value) {
            return this._[d3_map_escape(key)] = value;
        };
    };
    var d3_map_proto = "__proto__", d3_map_zero = "\x00";
    function d3_map_escape(key) {
        return (key += "") === d3_map_proto || key[0] === d3_map_zero ? d3_map_zero + encodeURIComponent(key) : encodeURIComponent(key);
    }
    function d3_map_unescape(key) {
        return (key += "")[0] === d3_map_zero ? decodeURIComponent(key.slice(1)) : decodeURIComponent(key);
    }

    /**
     * Sets a function to be called when the robot connects/disconnects to the pynetworktables2js server via NetworkTables. It will also be called when the websocket connects/disconnects.
     * 
     * When a listener function is called with a ‘true’ parameter, the NetworkTables.getRobotAddress() function will return a non-null value.
     * @param f a function that will be called with a single boolean parameter that indicates whether the robot is connected
     * @param immediateNotify If true, the function will be immediately called with the current robot connection state
     */
    export function addRobotConnectionListener(f: (connected: boolean) => any, immediateNotify?: boolean): void {
        connectionListeners.push(f)
        if (immediateNotify) f(connected)
    }
    /**
     * Set a function that will be called whenever any NetworkTables value is changed
     * @param f When any key changes, this function will be called with the following parameters; key: key name for entry, value: value of entry, isNew: If true, the entry has just been created
     * @param immediateNotify If true, the function will be immediately called with the current value of all keys
     */
    export function addGlobalListener(f: (key: string, value: any, isNew: boolean) => any, immediateNotify?: boolean): void {
        globalListeners.push(f)
        if (immediateNotify) {
            for (let key in keys) {
                f(key, keys[key].val, keys[key].new)
                keys[key].new = false
            }
        }
    }
    /**
     * Set a function that will be called whenever a value for a particular key is changed in NetworkTables
     * @param key A networktables key to listen for
     * @param f When the key changes, this function will be called with the following parameters; key: key name for entry, value: value of entry, isNew: If true, the entry has just been created
     * @param immediateNotify If true, the function will be immediately called with the current value of the specified key
     */
    export function addKeyListener(key: string, f: (key: string, value: any, isNew: boolean) => any, immediateNotify?: boolean): void {
        if (key in keyListeners) {
            keyListeners[key].push(f)
        } else {
            keyListeners[key] = [f]
        }
        if (immediateNotify && key in keys) {
            let temp = keys[key]
            f(key, temp.val, temp.new)
        }
    }
    /**
     * Use this to test whether a value is present in the table or not
     * @param key A networktables key
     * @returns true if a key is present in NetworkTables, false otherwise
     */
    export function containsKey(key: string): boolean {
        return key in keys
    }
    /**
     * Get all keys in the NetworkTables
     * @returns all the keys in the NetworkTables
     */
    export function getKeys(): string[] {
        return Object.keys(keys)
    }
    /**
     * Returns the value that the key maps to. If the websocket is not open, this will always return the default value specified.
     * @param key A networktables key
     * @param defaultValue If the key isn’t present in the table, return this instead
     * @returns value of key if present, undefined or defaultValue otherwise
     */
    export function getValue(key: string, defaultValue?: any): any {
        if (key in keys) {
            return keys[key].val
        } else {
            return defaultValue
        }
    }
    /**
     * @returns null if the robot is not connected, or a string otherwise
     */
    export function getRobotAddress(): string | null {
        return connected ? robotAddress : null
    }
    /**
     * @returns true if the robot is connected
     */
    export function isRobotConnected(): boolean {
        return connected
    }
    /**
     * Sets the value in NetworkTables. If the websocket is not connected, the value will be discarded.
     * @param key A networktables key
     * @param value The value to set (see warnings)
     * @returns True if the websocket is open, False otherwise
     */
    export function putValue(key: string, value: any): boolean {
        if (key in keys) {
            keys[key].val = value
            ipc.send('update', { key, val: value, id: keys[key].id, flags: keys[key].flags } as sendMesg)
        } else {
            ipc.send('add', { key, val: value, flags: 0 } as sendMesg)
        }
        return connected
    }

    /** 
     * Creates a new empty map (or hashtable) object and returns it. The map is safe to store NetworkTables keys in.
     * @returns map object, with forEach/get/has/set functions defined. Simlar to a map object when using d3.js
     */
    export function create_map(): Object {
        return new d3_map()
    }
    /** 
     * Escapes NetworkTables keys so that they’re valid HTML identifiers.
     * @param key A networktables key
     * @returns Escaped value
     */
    export var keyToId = encodeURIComponent

    /**
     * Escapes special characters and returns a valid jQuery selector. Useful as NetworkTables does not really put any limits on what keys can be used.
     * @param key A networktables key
     * @returns Escaped value
     */
    export function keySelector(key: string): string {
        return encodeURIComponent(key).replace(/([;&,\.\+\*\~':"\!\^#$%@\[\]\(\)=>\|])/g, '\\$1');
    }
}