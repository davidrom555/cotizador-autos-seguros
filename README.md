# Cotizador de Seguros de Autos

Este proyecto es una aplicación web para cotizar seguros de automóviles, desarrollada con Angular.

## Requisitos Previos

Asegúrate de tener instaladas las siguientes herramientas en tu entorno de desarrollo:

- [Node.js](https://nodejs.org/) (versión 20.x o superior)
- [Angular CLI](https://angular.dev/tools/cli) (versión 20.x o superior)

## Instalación

1.  Clona este repositorio en tu máquina local:

    ```bash
    git clone https://github.com/davidrom555/cotizador-autos-seguros.git
    ```

2.  Navega al directorio del proyecto:

    ```bash
    cd cotizador-autos-seguros
    ```

3.  Instala las dependencias del proyecto:

    ```bash
    npm install
    ```

## Servidor de Desarrollo

Para iniciar el servidor de desarrollo local, ejecuta el siguiente comando:

```bash
npm start
```

Una vez que el servidor esté en funcionamiento, abre tu navegador y visita `http://localhost:4200/`. La aplicación se recargará automáticamente cada vez que modifiques alguno de los archivos de origen.

## Compilación

Para compilar el proyecto para producción, utiliza el siguiente comando:

```bash
npm run build
```

Esto compilará tu proyecto y almacenará los artefactos de compilación en el directorio `dist/`. La compilación de producción optimiza tu aplicación para obtener el mejor rendimiento.

## Ejecución de Pruebas Unitarias

Para ejecutar las pruebas unitarias con [Karma](https://karma-runner.github.io), utiliza el siguiente comando:

```bash
npm test
```

## Estructura del Proyecto

A continuación, se describe la estructura de los directorios más importantes de la aplicación:

-   `src/app/core`: Contiene los servicios, interceptores y guardias principales de la aplicación.
-   `src/app/features`: Contiene las funcionalidades principales de la aplicación, como el cotizador.
-   `src/app/layout`: Contiene los componentes de la estructura principal de la página (encabezado, pie de página).
-   `src/app/shared`: Contiene los módulos, componentes, directivas y pipes compartidos.
-   `src/assets`: Contiene los recursos estáticos como imágenes y archivos de datos.
-   `src/environments`: Contiene los archivos de configuración para los diferentes entornos (desarrollo, producción).

## Recomendaciones

-   **Editor de Código**: Se recomienda utilizar [Visual Studio Code](https://code.visualstudio.com/) con las siguientes extensiones para una mejor experiencia de desarrollo:
    -   [Angular Language Service](https://marketplace.visualstudio.com/items?itemName=Angular.ng-template)
    -   [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
-   **Estilo de Código**: El proyecto utiliza [Prettier](https://prettier.io/) para formatear el código. Asegúrate de que tu editor esté configurado para formatear al guardar.