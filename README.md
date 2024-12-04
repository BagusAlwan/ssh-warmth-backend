<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Prerequisites

Before running the app, ensure the following steps are completed:

1. **Create a `.env` File**

   - Add the following environment variables to the `.env` file:
     ```plaintext
     PORT=3000
     WEATHER_API_KEY=your_open_weather_api_key
     SCRIPT_PATH=src/prediction/predict.py
     ```
     Replace `your_open_weather_api_key` with your actual OpenWeather API key.

2. **Install Dependencies**

   - For Python dependencies:

     ```bash
     pip install torch transformers Pillow opencv-python numpy

     ```

   - For Node.js dependencies:
     ```bash
     npm install
     ```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
