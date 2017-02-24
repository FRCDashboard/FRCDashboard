declare namespace NetworkTables {
    /**
     * These functions allow your code to listen for particular NetworkTables events.
     * @param f a function that will be called with a single boolean parameter that indicates whether the websocket is connected
     * @param immediateNotify If true, the function will be immediately called with the current status of the websocket
     */
    function addWsConnectionListener(f: (connected: boolean) => any, immediateNotify?: boolean): void
    /**
     * Sets a function to be called when the robot connects/disconnects to the pynetworktables2js server via NetworkTables. It will also be called when the websocket connects/disconnects.
     * 
     * When a listener function is called with a ‘true’ parameter, the NetworkTables.getRobotAddress() function will return a non-null value.
     * @param f a function that will be called with a single boolean parameter that indicates whether the robot is connected
     * @param immediateNotify If true, the function will be immediately called with the current robot connection state
     */
    function addRobotConnectionListener(f: (connected: boolean) => any, immediateNotify?: boolean): void
    /**
     * Set a function that will be called whenever any NetworkTables value is changed
     * @param f When any key changes, this function will be called with the following parameters; key: key name for entry, value: value of entry, isNew: If true, the entry has just been created
     * @param immediateNotify If true, the function will be immediately called with the current value of all keys
     */
    function addGlobalListener(f: (key: string, value: any, isNew: boolean) => any, immediateNotify?: boolean): void
    /**
     * Set a function that will be called whenever a value for a particular key is changed in NetworkTables
     * @param key A networktables key to listen for
     * @param f When the key changes, this function will be called with the following parameters; key: key name for entry, value: value of entry, isNew: If true, the entry has just been created
     * @param immediateNotify If true, the function will be immediately called with the current value of the specified key
     */
    function addKeyListener(key: string, f: (key: string, value: any, isNew: boolean) => any, immediateNotify?: boolean)
    /**
     * Use this to test whether a value is present in the table or not
     * @param key A networktables key
     * @returns true if a key is present in NetworkTables, false otherwise
     */
    function containsKey(key: string): boolean
    /**
     * Get all keys in the NetworkTables
     * @returns all the keys in the NetworkTables
     */
    function getKeys(): string[]
    /**
     * Returns the value that the key maps to. If the websocket is not open, this will always return the default value specified.
     * @param key A networktables key
     * @param defaultValue If the key isn’t present in the table, return this instead
     * @returns value of key if present, undefined or defaultValue otherwise
     */
    function getValue(key: string, defaultValue?: any): any
    /**
     * @returns null if the robot is not connected, or a string otherwise
     */
    function getRobotAddress(): string | null
    /**
     * @returns true if the robot is connected
     */
    function isRobotConnected(): boolean
    /** 
     * @returns true if the websocket is connected
     */
    function isWsConnected(): boolean
    /**
     * Sets the value in NetworkTables. If the websocket is not connected, the value will be discarded.
     * @param key A networktables key
     * @param value The value to set (see warnings)
     * @returns True if the websocket is open, False otherwise
     */
    function putValue(key: string, value: any): boolean
    /** 
     * Creates a new empty map (or hashtable) object and returns it. The map is safe to store NetworkTables keys in.
     * @returns map object, with forEach/get/has/set functions defined. Simlar to a map object when using d3.js
     */
    function create_map(): Object
    /** 
     * Escapes NetworkTables keys so that they’re valid HTML identifiers.
     * @param key A networktables key
     * @returns Escaped value
     */
    function keyToId(key: string): string
    /**
     * Escapes special characters and returns a valid jQuery selector. Useful as NetworkTables does not really put any limits on what keys can be used.
     * @param key A networktables key
     * @returns Escaped value
     */
    function keySelector(key: string): string
}