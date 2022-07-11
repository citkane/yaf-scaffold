#### A wrapper for all things yaf.
This is the entry point for extending yaf and creating custom apps and services.  
The scaffold provides a namespaced object through which a developer can access all yaf functionality.
```ts
import yaf from 'yaf';
const alg = yaf.config.get('security.keys.algorithm');
```