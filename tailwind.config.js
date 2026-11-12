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
          // Bảng màu: Đại Ngàn Tây Giang & Gỗ Trầm, Lửa Trại, Thổ Cẩm
          dark: '#0A120E',          // Nền chính tối trầm đại ngàn
          darker: '#060B08',        // Nền tối sâu thẳm
          surface: '#111D17',       // Nền card/panel tối sang trọng
          surfaceHover: '#172720',  // Hover trên surface
          surfaceLight: '#1E3228',  // Khối nổi
          sand: '#22342A',          // Viền tinh tế trầm
          sandDark: '#334D3F',      // Viền nhấn
          border: 'rgba(212, 163, 89, 0.22)', // Viền vàng đồng ánh kim
          clay: '#38A17E',          // Xanh ngọc bích rừng (Luminous Jade)
          clayDark: '#237358',      // Xanh rừng đậm
          clayLight: '#5CC9A3',     // Điểm nhấn sáng
          ochre: '#D49B45',         // Vàng đồng ánh kim / Hổ phách Tây Giang
          ochreLight: '#E8B868',    // Vàng sáng
          terracotta: '#C25336',    // Đỏ thổ cẩm Cơ Tu / Đất nung
          terracottaDark: '#8F381F',// Đỏ sẫm
          wood: '#F5EFE6',          // Chữ chính: Trắng ngà cổ / Xương ngà giấy dó
          woodLight: '#D2C7B8',     // Chữ phụ sáng
          woodMuted: '#8E9E95',     // Chữ chú thích dịu
          cream: '#131F19',         // Thẻ phụ tối nhẹ
          ivory: '#0A120E',         // Nền phụ
          charcoal: '#060A08',      // Nền đen than
          forest: '#142E23',        // Xanh rừng già
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
        'heritage': '0 16px 36px -8px rgba(0, 0, 0, 0.45), 0 4px 16px -2px rgba(0, 0, 0, 0.3)',
        'heritage-lg': '0 24px 50px -12px rgba(0, 0, 0, 0.65), 0 8px 24px -4px rgba(212, 163, 89, 0.08)',
        'glow': '0 0 30px rgba(212, 163, 89, 0.25)',
        'glow-jade': '0 0 30px rgba(56, 161, 126, 0.25)',
      },
      borderRadius: {
        'xl': '0.875rem',
        '2xl': '1.125rem',
        '3xl': '1.5rem',
        '4xl': '1.75rem',
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
