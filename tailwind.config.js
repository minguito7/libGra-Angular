/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}"
  ],
  theme: {
    extend: {
      fontFamily: {
      'libgra-material-icon': './src/assets/logo1.png', // Definimos la fuente personalizada
    },
    colors:{
      'libgra_naranja': '#bfa140'
    }
  },
  },
  plugins: [],
}

