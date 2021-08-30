import URLSearchParams from '@ungap/url-search-params';

function UrlQueryParams(init) {
    this.params = new URLSearchParams(init);
}

UrlQueryParams.prototype.append = function (key: string, value: any) {
    this.params.append(key, value);
}

UrlQueryParams.prototype.delete = function (key: string) {
    this.params.delete(key);
}

UrlQueryParams.prototype.get = function (key: string) {
    return this.params.get(key);
}

UrlQueryParams.prototype.getAll = function (key: string) {
    return this.params.getAll(key);
}

UrlQueryParams.prototype.has = function (key: string) {
    return this.params.has(key);
}

UrlQueryParams.prototype.set = function (key: string, value: any) {
    this.params.set(key, value);
}

UrlQueryParams.prototype.forEach = function (callback: Function, ctx: any) {
    this.params.forEach(callback, ctx);
}

UrlQueryParams.prototype.toJSON = function () {
    return {};
}

UrlQueryParams.prototype.toString = function () {
    return this.params.toString();
}

UrlQueryParams.prototype.sort = function () {
    return this.params.sort();
}

UrlQueryParams.prototype.entries = function () {
    return this.params.entries();
}

UrlQueryParams.prototype.values = function () {
    return this.params.values();
}



export default UrlQueryParams;
