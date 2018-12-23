function OrderedHashMap(object){
    var self = this;
    this.hashMap = {};
    this.orderedKeysList = [];
    if(object) {
        if (typeof(object) !== 'object') {
            throw TypeError('Invalid argument for constructor')
        }
        for (var key in object) {
            if(!object.hasOwnProperty(key)) { continue; }

            this.orderedKeysList.push(key);
            this.hashMap[key] = JSON.parse(JSON.stringify(object[key]));
        }
    }

    this[Symbol.iterator] = function () {
        var keyIndex = 0, totalKeys, lastKeyIndex;
        totalKeys = self.orderedKeysList.length;
        lastKeyIndex = totalKeys - 1;

        return {
            next: function(){
                if (keyIndex > lastKeyIndex) {
                    return {done: true}
                }
                var key = self.orderedKeysList[keyIndex++];
                var tempObj = {};
                tempObj[key] = self.hashMap[key];
                return {value: tempObj, done: false};
            }
        }

    };
}

OrderedHashMap.prototype.keyExists = function(key) {
    return this.hashMap.hasOwnProperty(key);
};

OrderedHashMap.prototype.set = function(key, value) {
    if(!this.keyExists(key)) {
        this.orderedKeysList.push(key);
    }
    this.hashMap[key] = value;
};

OrderedHashMap.prototype.get = function(key) {
    return this.hashMap[key];
};

OrderedHashMap.prototype.setAtIndex = function(index, key, value) {
    if(this.keyExists(key)) {
        return;
    }
    this.orderedKeysList.splice(index, 0, key);
    this.hashMap[key] = value;
};

OrderedHashMap.prototype.getValueAtIndex = function(index) {
    return this.hashMap[this.getKeyAtIndex(index)];
};

OrderedHashMap.prototype.getKeyAtIndex = function(index) {
    return this.orderedKeysList[index];
};

OrderedHashMap.prototype.moveToIndex = function(key, newIndex) {
    if(!this.keyExists(key)) {
        return;
    }
    var currentIndex = this.orderedKeysList.indexOf(key);
    if(currentIndex !== -1) {
        this.orderedKeysList.splice(newIndex, 0, this.orderedKeysList.splice(currentIndex, 1)[0]);
    }
};

OrderedHashMap.prototype.remove = function(key) {
    if(!this.keyExists(key)) {
        return;
    }
    var keyIndex = this.orderedKeysList.indexOf(key);
    if(keyIndex !== -1) {
        this.orderedKeysList.splice(keyIndex, 1);
        delete this.hashMap[key];
    }
};

OrderedHashMap.prototype.removeFromIndex = function(index) {
    var key = this.orderedKeysList[index];
    if(key === undefined || key === null) {
        return;
    }
    this.orderedKeysList.splice(index, 1);
    delete this.hashMap[key];
};

/**
 * returns a ordered list of evey key value pair
 * @returns {Array}
 */
OrderedHashMap.prototype.all = function() {
    var list = [], tempObj;
    for (var index in this.orderedKeysList) {
        tempObj = {};
        tempObj[this.orderedKeysList[index]] = this.hashMap[this.orderedKeysList[index]];
        list.push(tempObj);
    }
    return list;
};

OrderedHashMap.prototype.copy = function() {
    var orderedHashMap = new OrderedHashMap();
    orderedHashMap.orderedKeysList = JSON.parse(JSON.stringify(this.orderedKeysList));
    orderedHashMap.hashMap = JSON.parse(JSON.stringify(this.hashMap));
    return orderedHashMap;
};