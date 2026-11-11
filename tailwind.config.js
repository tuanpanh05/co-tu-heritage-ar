/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        heritage: {
          // Bảng màu: Rừng Sương Tây Giang & Ngọc Bích Dịu Mát
          ivory: '#F5F9F7',      // Nền sương sớm trắng ngọc dịu mắt
          cream: '#EBF3F0',      // Nền thẻ phụ xanh bạc hà nhạt
          sand: '#D5E5DF',       // Viền nhẹ nhàng xanh sương
          sandDark: '#B3CEC4',   // Viền nhấn
          clay: '#237A63',       // Màu chủ đạo: Xanh Ngọc Bích Rừng (Jade Teal)
          clayDark: '#195E4B',   // Hover đậm hơn
          clayLight: '#52B79A',  // Điểm nhấn sáng dịu
          ochre: '#D4A359',      // Vàng nắng mai nhẹ nhàng (Champagne Gold)
          wood: '#1E332C',       // Chữ chính: Xanh Rêu Đá Đậm
          woodLight: '#355248',  // Chữ phụ đậm
          woodMuted: '#607D73',  // Chữ chú thích dịu
          charcoal: '#162621',   // Nền 3D sâu dịu
          forest: '#1D4D3F',     // Xanh rừng già
        }
      },
      fontFamily: {
        // Cả hai font đều tự host qua @fontsource và hỗ trợ đầy đủ dấu tiếng Việt chồng (ề, ố, ế, ữ...)
        sans: ['"Be Vietnam Pro"', '"Segoe UI"', 'Roboto', 'Arial', 'sans-serif'],
        serif: ['"Lora Variable"', '"Lora"', '"Noto Serif"', '"Times New Roman"', 'serif'],
      },
      fontSize: {
        // Nới khoảng dòng cho tiêu đề lớn để dấu tiếng Việt (ầ, ổ, ữ, ỗ...) không chạm dòng trên
        '3xl': ['1.875rem', { lineHeight: '1.3' }],
        '4xl': ['2.25rem', { lineHeight: '1.28' }],
        '5xl': ['3rem', { lineHeight: '1.22' }],
      },
      boxShadow: {
        'heritage': '0 10px 30px -5px rgba(30, 51, 44, 0.05), 0 4px 12px -2px rgba(35, 122, 99, 0.04)',
        'heritage-lg': '0 20px 45px -10px rgba(30, 51, 44, 0.09), 0 8px 20px -4px rgba(35, 122, 99, 0.06)',
        'glow': '0 0 25px rgba(82, 183, 154, 0.25)',
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.75rem',
        '4xl': '2.25rem',
      },
      animation: {
        'float-slow': 'float 7s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '0.9', transform: 'scale(1.03)' },
        }
      }
    },
  },
  plugins: [],
}
