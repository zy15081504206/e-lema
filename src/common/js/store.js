export function saveLocal(id, key, value) {
    let seller = window.localStorage.__seller__;
    if (!seller) {
        seller = {};
        seller[id] = {};

    } else {
        seller = JSON.parse(seller);
        if (!seller.id) {
            seller = {};
            seller[id] = {};

        }
    }
    seller[id][key] = value;
    window.localStorage.__seller__ = JSON.stringify(seller)
}

export function loadFromLocal(id,key,def){
    let seller = window.localStorage.__seller__;
    if(!seller){
        return def;
    }
    seller = JSON.parse(seller).id;
    if(!seller){
        return def;
    }
    let det = seller.key
    return det || def
}