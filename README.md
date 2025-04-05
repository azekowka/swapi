# <p align="center" height="40px" width="40px"> SWAPI (Star Wars API) проект </p>

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/azekowka/swapi.git
   ```
    ```sh
    cd swapi
   ```
2. Install Node.js dependencies
   ```sh
   npm i
   ```
    ```sh
   npm audit fix --force
   ``` 
3. Run the Next.js application
   ```sh
   npm run dev
   ```
4. Access the Next.js application at `http://localhost:3000`

## 📂 Repository Structure

### Next.js Project

- **app/**: Contains Axios instance, Doctor's and Client's Dashboards, layout page.
- **components/**: Contains React components used in the project.
- **pages/**: Contains Next.js pages. Each file in this directory is associated with a route based on its file name.
- **styles/**: Contains CSS files for styling the application.
- **public/**: Contains static files such as images, which can be accessed directly.
- **utils/**: Contains utility functions and helpers used throughout the project.

## 📝 ToDo List

- [x] Использовано React (версии 18 и выше), Next.js, TypeScript, и базовый ESLint.
- [x] Использовано shadcn/ui и TailwindCSS для стилизации и UI/UX.
- [x] React-Redux для управления состояниями.
- [x] React Hook Form для работы с формами.
- [x] React Router v6 для реализации маршрутизации и вложенных роутов.
- [x] Фетчинг данных с API SWAPI (https://swapi.dev/). 
- [x] Персонажи: https://swapi.dev/api/people/
- [x] Планеты: https://swapi.dev/api/planets/
- [x] Космические корабли: https://swapi.dev/api/starships/ 
- [x] встроенные механизмы пагинации SWAPI для загрузки страниц с данными (параметры ?page=1, ?page=2, и т.д.).
- [x] Деплоймент на Vercel.


## Contact

Abdulaziz Gabitov - gabjtov@gmail.com