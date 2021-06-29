import Vue from 'vue';
import URLSearchParams from './url-search-params';

export interface QueryOptions {
    paramsStr?: any;
    key?: string;
}

function plugin(_Vue: typeof Vue, options: QueryOptions = {}) {
    if ((plugin as any).installed) return;

    const query = new URLSearchParams(options.paramsStr || location.search);
    const key = options.key || '$query';

    Object.defineProperty(_Vue.prototype, key, {
        get() {
            return query;
        },
    });

    _Vue[key] = query;
}

if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(plugin);
}

export default plugin;
