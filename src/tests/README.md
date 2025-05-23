Supertest obtiene su maximo potencial al ser utilizado junto a jest, ya que permite realizar pruebas de integración de manera sencilla y efectiva. Con supertest, puedes simular solicitudes HTTP a tu servidor y verificar las respuestas, lo que es ideal para probar tus rutas y controladores.

Pasos para configurar:

1. Instalar y configurar babel y jest:
   ```bash
   npm install --save-dev jest
   npm install --save-dev babel-jest @babel/preset-env
   ```

   Crear archivos: `babel.config.js` y `jest.config.js`

   Agregar en `babel.config.js`:
   ```javascript
   module.exports = {
     presets: [
       [
         "@babel/preset-env",
         {
           targets: {
             node: "current"
           }
         }
       ]
     ]
   };
   ```

   Agregar en `jest.config.js`:
   ```javascript
   export default {
     transformIgnorePatterns: [
       '/node_modules/(?!node-fetch)/',
     ],
   };
   ```

   Asegúrate de tener las siguientes dependencias de desarrollo en tu `package.json`:
   ```json
   {
     "devDependencies": {
       "@babel/core": "^7.27.1",
       "@babel/preset-env": "^7.27.2",
       "babel-jest": "^29.7.0",
       "jest": "^29.7.0",
       "supertest": "^7.1.1"
     }
   }
   ```

2. Instalar supertest:
   ```bash
   npm install --save-dev supertest
   ```

   Importante: Exportar la `app` de Express antes de ejecutar `app.listen()` para que Supertest pueda manejar ese aspecto por su cuenta. Por ello, se recomienda crear un archivo `app.js` (o similar) que configure y exporte la app, y otro archivo `index.js` (o punto de entrada principal) donde se importa la app y se ejecuta `listen()`.

Para correr los tests usar:
```bash
npm run test
```
