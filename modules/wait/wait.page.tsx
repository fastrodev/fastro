import { useEffect, useState } from "preact/hooks";
import { JSX } from "preact/jsx-runtime";

export default function Wait() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [headingIndex, setHeadingIndex] = useState(0);
  const [gradientPosition, setGradientPosition] = useState({ x: 50, y: 50 });
  const [direction, setDirection] = useState({ x: 1, y: 1 });

  const headings = [
    [
      "Banyak Barang Kadaluarsa di Gudang?",
      "Cegah kerugian dengan sistem alert otomatis",
    ],
    [
      "Masih Pakai Excel untuk Inventaris?",
      "Upgrade ke sistem modern yang lebih handal",
    ],
    [
      "Butuh Software Invertaris yang Simpel?",
      "Interface bersih dan mudah dipelajari",
    ],
    [
      "Siap Upgrade ke Sistem yang Lebih Baik?",
      "Transisi mudah dengan panduan lengkap",
    ],
    ["Mau Kurangi Biaya Operasional?", "Hemat biaya dengan otomatisasi"],
    ["Cari Aplikasi yang Terjangkau?", "Harga bersaing dengan fitur premium"],
    [
      "Sering Salah Input Data Stok?",
      "Minimalisir human error dengan validasi",
    ],
    ["Sulit Cek Stok di Luar Jam Kerja?", "Akses data 24/7 dari mana saja"],
    ["Laporan Keuangan Sering Terlambat?", "Laporan real-time dalam satu klik"],
    ["Butuh Akses Data dari HP?", "Aplikasi mobile yang responsif"],
    ["Ingin Kontrol Stok dari Mana Saja?", "Remote monitoring lebih mudah"],
    ["Tim Sering Mis communication?", "Kolaborasi tim jadi lebih lancar"],
    [
      "Data Inventaris & Purchasing Gak Sinkron?",
      "Integrasi data antar divisi",
    ],
    ["Supplier Sering Komplain?", "Manajemen supplier yang terorganisir"],
    ["Stok Fisik Beda dengan Sistem?", "Tracking stok akurat real-time"],
    ["Bingung Kapan Harus Order Barang?", "Reorder point otomatis"],
    ["Promo Gagal Karena Stok Kosong?", "Prediksi stok yang lebih akurat"],
    ["Target Penjualan Sulit Tercapai?", "Analisis penjualan mendalam"],
    ["Ingin Integrasi dengan Marketplace?", "Koneksi multi-channel seamless"],
    [
      "Butuh Sistem yang Bisa Dikustomisasi?",
      "Fleksibel sesuai kebutuhan bisnis",
    ],
    ["Kesulitan Tracking Retur Barang?", "Manajemen retur yang sistematis"],
    ["Ingin Tingkatkan Efisiensi Tim?", "Tingkatkan produktivitas hingga 50%"],
  ];

  useEffect(() => {
    const pauseDuration = 3000;
    const minRandomDelay = 10;
    const maxRandomDelay = 40;

    let timeoutId: number;

    const typeText = () => {
      const currentHeading = headings[headingIndex][0]; // Get only the question

      if (currentCharIndex <= currentHeading.length) {
        const isLastChar = currentCharIndex === currentHeading.length - 1;
        const isQuestionMark = currentHeading[currentCharIndex] === "?";

        setDisplayText(currentHeading.slice(0, currentCharIndex + 1));

        if (isQuestionMark && isLastChar) {
          // Extra pause for the last question mark
          timeoutId = setTimeout(() => {
            setCurrentCharIndex(0);
            setDisplayText("");
            setHeadingIndex((prev) => (prev + 1) % headings.length);
          }, pauseDuration);
        } else {
          setCurrentCharIndex((prev) => prev + 1);
          const randomDelay =
            Math.random() * (maxRandomDelay - minRandomDelay) + minRandomDelay;
          timeoutId = setTimeout(typeText, randomDelay);
        }
      } else {
        // Move to next heading
        timeoutId = setTimeout(() => {
          setCurrentCharIndex(0);
          setDisplayText("");
          setHeadingIndex((prev) => (prev + 1) % headings.length);
        }, pauseDuration);
      }
    };

    typeText();

    return () => clearTimeout(timeoutId);
  }, [headingIndex, currentCharIndex]);

  useEffect(() => {
    const speed = 0.5; // Controls how fast the gradient moves
    const interval = setInterval(() => {
      setGradientPosition((prev) => {
        const newX = prev.x + (speed * direction.x);
        const newY = prev.y + (speed * direction.y);
        const newDirection = { ...direction };

        // Bounce off edges
        if (newX >= 100 || newX <= 0) {
          newDirection.x *= -1;
          setDirection(newDirection);
        }
        if (newY >= 100 || newY <= 0) {
          newDirection.y *= -1;
          setDirection(newDirection);
        }

        return {
          x: Math.max(0, Math.min(100, newX)),
          y: Math.max(0, Math.min(100, newY)),
        };
      });
    }, 50); // Smaller interval for smoother animation

    return () => clearInterval(interval);
  }, [direction]);

  const handleSubmit = async (e: JSX.TargetedEvent<HTMLFormElement, Event>) => {
    e.preventDefault();
    if (email) {
      try {
        const response = await fetch("/api/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        });

        if (response.ok) {
          console.log("Email submitted successfully:", email);
          setIsSubmitted(true);
          setEmail("");
        } else {
          console.error("Failed to submit email");
          // Optionally handle error state here
        }
      } catch (error) {
        console.error("Error submitting email:", error);
        // Optionally handle error state here
      }
    }
  };

  const handleChange = (e: JSX.TargetedEvent<HTMLInputElement, InputEvent>) => {
    setEmail((e.target as HTMLInputElement).value);
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const themeStyles = {
    background: isDark
      ? `radial-gradient(circle at ${gradientPosition.x}% ${gradientPosition.y}%, #2e1065, #000000)`
      : `radial-gradient(circle at ${gradientPosition.x}% ${gradientPosition.y}%, #ffffff, #fafafa)`,
    text: isDark ? "text-gray-100" : "text-gray-800",
    input: isDark
      ? "bg-gray-700/30 border-gray-600 text-white placeholder-gray-400"
      : "bg-gray-100/70 border-gray-300 text-gray-900 placeholder-gray-500",
    button: isDark
      ? "bg-blue-600 hover:bg-blue-700"
      : "bg-blue-500 hover:bg-blue-600",
    footer: isDark ? "text-gray-400" : "text-gray-600",
    link: isDark
      ? "text-blue-400 hover:text-blue-300"
      : "text-blue-600 hover:text-blue-500",
    answer: isDark ? "text-gray-100" : "text-gray-700", // Added specific color for answers
    cta:
      "bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent", // Consistent gradient for CTA
  };

  return (
    <div className="relative min-h-screen">
      {/* Background Layers Group */}
      <div className="fixed inset-0 z-0">
        {/* Gradient Background */}
        <div
          className="absolute inset-0 transition-all duration-[3000ms] ease-in-out"
          style={{
            background: themeStyles.background,
          }}
        />

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 z-[1]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
              linear-gradient(to right, ${
                isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.05)"
              } 1px, transparent 1px),
              linear-gradient(to bottom, ${
                isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.05)"
              } 1px, transparent 1px)
            `,
              backgroundSize: "20px 20px",
            }}
          />
        </div>
      </div>

      {/* Content Layer */}
      <div className="relative z-10 w-full max-w-xl mx-auto p-8 min-h-screen flex flex-col">
        <div
          className={`flex-grow flex flex-col justify-center items-center 
            backdrop-blur-lg bg-white/10 dark:bg-black/10
            border border-gray-200/20 dark:border-gray-800/20
            rounded-2xl shadow-2xl
            p-6 sm:p-8
            ${themeStyles.text}
            relative z-20`}
        >
          {!isSubmitted
            ? (
              <div className="flex flex-col gap-8 sm:gap-10">
                {/* Reduced from gap-12 sm:gap-16 */}
                {/* Heading Section with Answer */}
                <div className="flex flex-col space-y-4">
                  {/* Reduced from space-y-6 */}
                  {/* Header */}
                  <div className="py-2 sm:py-3 md:py-4 lg:py-5 min-h-[100px] sm:min-h-[120px] md:min-h-[140px] lg:min-h-[160px] flex items-center">
                    {/* Reduced min-height */}
                    <h2
                      className={`text-[2rem] sm:text-4xl md:text-4xl lg:text-5xl xl:text-6xl 
                    font-extrabold
                    leading-[1.3] sm:leading-[1.5] md:leading-[1.6]
                    tracking-tight md:tracking-tighter
                    max-w-[95vw] sm:max-w-[85vw] md:max-w-[80vw] mx-auto
                    ${
                        isDark
                          ? "bg-gradient-to-br from-blue-300 to-purple-200"
                          : "bg-gradient-to-br from-gray-800 to-gray-600"
                      } bg-clip-text text-transparent transition-opacity duration-500
                    drop-shadow-[0_0_8px_rgba(255,255,255,0.15)]`}
                    >
                      <span className="block py-2">
                        <span className="[text-shadow:_0_0_10px_rgba(255,255,255,0.1)]">
                          {displayText}
                        </span>
                        <span className="inline-block w-0.5 sm:w-1 
                        h-[1em] ml-0.5 sm:ml-1 
                        animate-pulse bg-current" />
                      </span>
                    </h2>
                  </div>

                  {/* Answer - Directly below header */}
                  <div className="w-full max-w-md mx-auto">
                    <p
                      className={`text-base sm:text-xl text-left ${themeStyles.answer}`}
                    >
                      {headings[headingIndex][1]}
                    </p>
                  </div>
                </div>

                {/* CTA Section */}
                <div className="w-full max-w-md mx-auto">
                  <p
                    className={`text-base sm:text-xl text-left font-medium ${themeStyles.cta}`}
                  >
                    Jadilah yang pertama menggunakan aplikasi inventaris dan
                    purchasing baru kami.
                  </p>
                </div>

                {/* Form Section */}
                <div className="w-full max-w-md mx-auto">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={handleChange}
                      required
                      className={`w-full p-3 backdrop-blur-sm border rounded-lg
                          focus:outline-none focus:ring-2 focus:ring-blue-500 
                          focus:border-transparent transition-colors
                          ${themeStyles.input}`}
                    />
                    <button
                      type="submit"
                      className={`w-full text-white py-2.5 sm:py-3 px-4 rounded-lg
                      text-base sm:text-lg font-semibold transition-colors
                      ${themeStyles.button}`}
                    >
                      Join Waitlist
                    </button>
                  </form>
                </div>
              </div>
            )
            : (
              <>
                <div>
                  <h2
                    className={`text-4xl sm:text-5xl font-extrabold mb-4 ${
                      isDark
                        ? "bg-gradient-to-br from-gray-200 to-gray-600"
                        : "bg-gradient-to-br from-gray-800 to-gray-600"
                    } bg-clip-text text-transparent`}
                  >
                    Thank You for Joining!
                  </h2>
                </div>
                <div>
                  <p className="text-lg sm:text-xl mb-8">
                    We'll keep you updated on our progress and let you know when
                    we launch.
                  </p>
                </div>
              </>
            )}

          {/* Footer */}
          <div
            className={`w-full mt-auto pt-8 flex flex-col items-center space-y-4 ${themeStyles.footer}`}
          >
            {/* Social Icons */}
            <div className="flex space-x-6">
              <a
                href="https://wa.me/628121619781"
                target="_blank"
                rel="noopener noreferrer"
                className={`transition-colors hover:scale-110 transform duration-200 ${themeStyles.footer}`}
                aria-label="WhatsApp"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/company/fastro"
                target="_blank"
                rel="noopener noreferrer"
                className={`transition-colors hover:scale-110 transform duration-200 ${themeStyles.footer}`}
                aria-label="LinkedIn"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>

            <p className="text-sm">
              Powered by{" "}
              <a
                href="https://github.com/fastrodev/fastro"
                target="_blank"
                rel="noopener noreferrer"
                className={`transition-colors ${themeStyles.link}`}
              >
                Fastro Framework
              </a>
            </p>
          </div>
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className={`fixed bottom-4 right-4 p-3 rounded-full transition-colors 
            shadow-lg hover:scale-110 transform duration-200 z-50
            ${
            isDark ? "bg-gray-800 text-gray-200" : "bg-gray-200 text-gray-800"
          }`}
          aria-label="Toggle theme"
        >
          {isDark ? "☀️" : "🌙"}
        </button>
      </div>
    </div>
  );
}
