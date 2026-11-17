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
          // Bảng màu: Rừng ẩm Tây Giang, Đất nung, Khói bếp & Gỗ kiền kiền già
          dark: '#0E1712',          // Nền rừng ẩm sâu lắng có ánh nâu nhẹ của đất
          darker: '#09100C',        // Nền tối sương đêm đại ngàn
          surface: '#13211A',       // Bề mặt gỗ/card mộc mạc, vững chãi
          surfaceHover: '#182920',  // Hover trầm tĩnh
          surfaceLight: '#1F3429',  // Khối nổi tự nhiên
          sand: '#25382E',          // Viền mộng gỗ
          sandDark: '#364D40',      // Viền trầm
          border: 'rgba(201, 148, 70, 0.22)', // Viền vàng gỗ già
          moss: '#233F31',          // Xanh rêu ẩm rừng nguyên sinh
          soil: '#2A1F17',          // Đất đỏ bazan ủ lá mục
          clay: '#327B62',          // Xanh lá ẩm Tây Giang (không pastel mint)
          clayDark: '#205B47',      // Xanh rừng thẳm
          clayLight: '#4E9A80',     // Ánh sương trên lá
          ochre: '#C89344',         // Vàng gỗ già / Hổ phách nhựa thông
          ochreLight: '#DEAA5C',    // Ánh nắng xiên qua tán cây
          terracotta: '#B6543A',    // Đất nung thổ cẩm Cơ Tu
          terracottaDark: '#853723',// Đỏ đất trầm
          wood: '#F3EDE3',          // Trắng ngà giấy dó / Thớ gỗ thông
          woodLight: '#CDC2B2',     // Chữ phụ trầm ấm
          woodMuted: '#88988F',     // Chú thích mờ như sương
          cream: '#15231C',         // Thẻ phụ
          ivory: '#0E1712',         // Nền phụ
          charcoal: '#0A120E',      // Nền than củi
          forest: '#162F23',        // Xanh rừng già Trường Sơn
        }
      },
      fontFamily: {
        sans: ['"Be Vietnam Pro"', '"Segoe UI"', 'Roboto', 'Arial', 'sans-serif'],
        serif: ['"Lora Variable"', '"Lora"', '"Noto Serif"', '"Times New Roman"', 'serif'],
      },
      fontSize: {
        '3xl': ['1.875rem', { lineHeight: '1.3' }],
        '4xl': ['2.25rem', { lineHeight: '1.28' }],
        '5xl': ['3rem', { lineHeight: '1.22' }],
      },
      boxShadow: {
        'heritage': '0 12px 30px -8px rgba(0, 0, 0, 0.55), 0 2px 8px -2px rgba(0, 0, 0, 0.35)',
        'heritage-lg': '0 20px 45px -10px rgba(0, 0, 0, 0.7), 0 4px 16px -2px rgba(200, 147, 68, 0.08)',
        'hearth': '0 0 35px rgba(200, 147, 68, 0.12)',
        'mist': '0 10px 40px rgba(14, 23, 18, 0.8)',
      },
      borderRadius: {
        // Thay thế bo góc siêu tròn kiểu SaaS bằng bo góc vững chãi kiểu kiến trúc mộng gỗ
        'xl': '0.625rem',
        '2xl': '0.875rem',
        '3xl': '1.125rem',
      },
      animation: {
        'mist-drift': 'mistDrift 28s ease-in-out infinite alternate',
        'dappled-light': 'dappledLight 18s ease-in-out infinite alternate',
        'subtle-pulse': 'subtlePulse 6s ease-in-out infinite',
      },
      keyframes: {
        mistDrift: {
          '0%': { transform: 'translateX(-2%) translateY(0)' },
          '100%': { transform: 'translateX(2%) translateY(-10px)' },
        },
        dappledLight: {
          '0%': { opacity: '0.35', transform: 'scale(1)' },
          '100%': { opacity: '0.65', transform: 'scale(1.05)' },
        },
        subtlePulse: {
          '0%, 100%': { opacity: '0.7' },
          '50%': { opacity: '0.95' },
        }
      }
    },
  },
  plugins: [],
}
